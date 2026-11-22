import csv
import http.server
import io
import json
import os
import re
import subprocess
import sys
import threading
import urllib.request
from urllib.parse import parse_qs, urlparse

import updater

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "config.json")
ESCURSIONI_CFG_PATH = os.path.join(BASE_DIR, "escursioni_config.json")


def load_web_app_url():
    """Legge l'URL della Web App da SOCI_WEB_APP_URL o da config.json (escluso da git)."""
    url = os.environ.get("SOCI_WEB_APP_URL", "").strip()
    if url:
        return url
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            url = str(json.load(f).get("web_app_url", "")).strip()
    except FileNotFoundError:
        url = ""
    except (OSError, ValueError, AttributeError) as e:
        sys.exit(f"Errore nella lettura di config.json: {e}")
    if not url:
        sys.exit(
            "URL della Web App mancante.\n"
            "Copia config.example.json in config.json e inserisci il valore di \"web_app_url\"\n"
            "(oppure imposta la variabile d'ambiente SOCI_WEB_APP_URL)."
        )
    return url


WEB_APP_URL = load_web_app_url()

def parse_sheet_id_and_gid(url_or_id):
    s = (url_or_id or "").strip()
    if not s:
        return "", "0"
    if re.fullmatch(r"[a-zA-Z0-9-_]{20,}", s):
        return s, "0"
    parsed = urlparse(s)
    m = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", parsed.path or s)
    sheet_id = m.group(1) if m else ""
    gid = "0"
    qs = parse_qs(parsed.query or "")
    if "gid" in qs and qs["gid"]:
        gid = qs["gid"][0]
    elif parsed.fragment:
        fm = re.search(r"gid=([0-9]+)", parsed.fragment)
        if fm:
            gid = fm.group(1)
    return sheet_id, gid

def load_escursioni_config():
    if not os.path.exists(ESCURSIONI_CFG_PATH):
        return []
    try:
        with open(ESCURSIONI_CFG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception:
        return []

def fetch_sheet_csv_rows(url_or_id):
    sheet_id, gid = parse_sheet_id_and_gid(url_or_id)
    if not sheet_id:
        raise ValueError("URL o ID del Foglio Google non valido")
    export_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"
    req = urllib.request.Request(export_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8-sig", errors="replace")
    reader = csv.reader(io.StringIO(raw))
    rows = list(reader)
    if not rows:
        return [], []
    headers = [str(h or "").strip() for h in rows[0]]
    records = []
    for r in rows[1:]:
        if not any(str(c or "").strip() for c in r):
            continue
        item = {}
        for idx, h in enumerate(headers):
            key = h if h else f"Colonna_{idx+1}"
            item[key] = str(r[idx] if idx < len(r) else "").strip()
        records.append(item)
    return headers, records

HIDDEN_PATHS = ("config.json", "escursioni_config.json", "backup", ".git")
RESTART_REQUESTED = threading.Event()


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def send_json(self, status, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path.startswith("/api/update/install"):
            # L'header personalizzato impedisce ad altri siti di avviare l'aggiornamento.
            if self.headers.get("X-App-Update") != "1":
                self.send_json(403, {"ok": False, "error": "Richiesta non consentita"})
                return
            try:
                result = updater.install()
            except Exception as e:
                self.send_json(500, {"ok": False, "error": str(e)})
                return
            self.send_json(200, result)
            print(f"Aggiornamento installato: v{result['from']} -> v{result['to']}. Riavvio...", flush=True)
            RESTART_REQUESTED.set()
            threading.Thread(target=self.server.shutdown, daemon=True).start()
            return
        self.send_error(404)

    def do_GET(self):
        first = urlparse(self.path).path.lstrip("/").split("/", 1)[0]
        if first in HIDDEN_PATHS:
            self.send_error(404)
            return
        if self.path.startswith("/api/version"):
            self.send_json(200, {"ok": True, "version": updater.current_version()})
            return
        if self.path.startswith("/api/update/check"):
            force = "force=1" in self.path
            self.send_json(200, updater.check(force=force))
            return
        if self.path.startswith("/api/escursioni"):
            try:
                sep = "&" if "?" in WEB_APP_URL else "?"
                wa_url = f"{WEB_APP_URL}{sep}action=escursioni"
                req = urllib.request.Request(wa_url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=25) as resp:
                    raw = resp.read().decode("utf-8", "replace")
                data = json.loads(raw)

                if isinstance(data, dict) and data.get("ok") is True and isinstance(data.get("escursioni"), list):
                    payload = json.dumps({
                        "ok": True,
                        "source": "webapp",
                        "updatedAt": data.get("updatedAt", ""),
                        "escursioni": data["escursioni"]
                    }, ensure_ascii=False).encode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Cache-Control", "no-store")
                    self.end_headers()
                    self.wfile.write(payload)
                    return

                # Fallback locale se la Web App non restituisce escursioni valide
                cfg = load_escursioni_config()
                risultati = []
                for esc in cfg:
                    src_url = esc.get("url") or esc.get("sheet_id") or ""
                    try:
                        headers, records = fetch_sheet_csv_rows(src_url)
                        risultati.append({
                            "id": esc.get("id") or src_url,
                            "titolo": esc.get("titolo") or "Escursione",
                            "data": esc.get("data") or "",
                            "url": src_url,
                            "ok": True,
                            "headers": headers,
                            "rows": records
                        })
                    except Exception as ex:
                        risultati.append({
                            "id": esc.get("id") or src_url,
                            "titolo": esc.get("titolo") or "Escursione",
                            "data": esc.get("data") or "",
                            "url": src_url,
                            "ok": False,
                            "error": str(ex),
                            "headers": [],
                            "rows": []
                        })
                payload = json.dumps({
                    "ok": True,
                    "source": "fallback_local",
                    "escursioni": risultati
                }, ensure_ascii=False).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(payload)
            except Exception as e:
                err = json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False).encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(err)
            return
        if self.path.startswith("/api/soci"):
            try:
                with urllib.request.urlopen(WEB_APP_URL, timeout=20) as resp:
                    body = resp.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)
            except Exception as e:
                err = f'{{"ok":false,"error":"{str(e).replace(chr(34), chr(39))}"}}'.encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(err)
        else:
            super().do_GET()

def main():
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 8000), Handler)
    print(f"APP Direttivo 3/5 (v{updater.current_version()}) attiva su "
          "http://localhost:8000/gestione-soci-associazione.html")
    print("Premi CTRL+C per fermarla.", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nAPP Direttivo 3/5 fermata.")
        return 0
    finally:
        httpd.server_close()
    if RESTART_REQUESTED.is_set():
        # Avvia la nuova versione nella stessa finestra e resta in attesa che finisca.
        try:
            return subprocess.call([sys.executable, os.path.join(BASE_DIR, "server.py")])
        except KeyboardInterrupt:
            return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
