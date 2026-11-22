"""Aggiornamento automatico di APP Direttivo 3/5 dalle Release di GitHub."""

import io
import json
import os
import re
import shutil
import tempfile
import time
import urllib.error
import urllib.request
import zipfile

GITHUB_REPO = "mbbflash/app-direttivo-3-5"
API_LATEST = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"
USER_AGENT = "APP-Direttivo-3-5-updater"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VERSION_PATH = os.path.join(BASE_DIR, "VERSION")
BACKUP_DIR = os.path.join(BASE_DIR, "backup")

# File e cartelle locali che un aggiornamento non deve mai toccare.
PROTECTED = {"config.json", "escursioni_config.json", "backup", ".git"}

CHECK_CACHE_SECONDS = 600
_cache = {"time": 0.0, "data": None}


def current_version():
    try:
        with open(VERSION_PATH, "r", encoding="utf-8") as f:
            return f.read().strip() or "0.0.0"
    except OSError:
        return "0.0.0"


def _version_tuple(v):
    nums = re.findall(r"\d+", str(v or ""))
    return tuple(int(n) for n in nums[:3]) + (0,) * (3 - min(len(nums), 3))


def is_dev_checkout():
    """Una cartella clonata con git si aggiorna con 'git pull', non con lo zip."""
    return os.path.exists(os.path.join(BASE_DIR, ".git"))


def _get_json(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/vnd.github+json",
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def check(force=False):
    now = time.time()
    if not force and _cache["data"] and now - _cache["time"] < CHECK_CACHE_SECONDS:
        return _cache["data"]
    cur = current_version()
    try:
        rel = _get_json(API_LATEST)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            data = {"ok": True, "current": cur, "available": False, "latest": None,
                    "message": "Nessuna release pubblicata."}
        else:
            data = {"ok": False, "current": cur, "error": f"GitHub ha risposto {e.code}"}
        _cache.update(time=now, data=data)
        return data
    except Exception as e:
        return {"ok": False, "current": cur, "error": f"Controllo aggiornamenti non riuscito: {e}"}

    latest = str(rel.get("tag_name") or "").lstrip("vV")
    data = {
        "ok": True,
        "current": cur,
        "latest": latest,
        "available": bool(latest) and _version_tuple(latest) > _version_tuple(cur),
        "name": rel.get("name") or f"v{latest}",
        "notes": rel.get("body") or "",
        "published": rel.get("published_at") or "",
        "url": rel.get("html_url") or "",
        "zipball": rel.get("zipball_url") or "",
        "canInstall": not is_dev_checkout(),
    }
    _cache.update(time=now, data=data)
    return data


def _safe_members(zf):
    """Restituisce (nome_relativo, info) togliendo la cartella radice dello zip GitHub."""
    out = []
    for info in zf.infolist():
        parts = info.filename.replace("\\", "/").split("/")
        rel_parts = [p for p in parts[1:] if p]
        if not rel_parts or info.is_dir():
            continue
        if any(p == ".." for p in rel_parts) or info.filename.startswith("/") or ":" in rel_parts[0]:
            raise ValueError(f"Percorso non valido nello zip: {info.filename}")
        if rel_parts[0] in PROTECTED:
            continue
        out.append(("/".join(rel_parts), info))
    return out


def install():
    """Scarica l'ultima release, fa un backup dei file attuali e li sostituisce."""
    if is_dev_checkout():
        raise RuntimeError("Questa cartella è un clone git: aggiorna con 'git pull'.")
    info = check(force=True)
    if not info.get("ok"):
        raise RuntimeError(info.get("error") or "Controllo aggiornamenti non riuscito")
    if not info.get("available"):
        raise RuntimeError("Nessun aggiornamento disponibile.")

    req = urllib.request.Request(info["zipball"], headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = resp.read()

    with zipfile.ZipFile(io.BytesIO(payload)) as zf:
        members = _safe_members(zf)
        names = {name for name, _ in members}
        if "server.py" not in names or "VERSION" not in names:
            raise RuntimeError("Il pacchetto scaricato non sembra una versione valida dell'app.")

        staging = tempfile.mkdtemp(prefix="app-direttivo-update-")
        try:
            for name, zinfo in members:
                dest = os.path.join(staging, *name.split("/"))
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                with zf.open(zinfo) as src, open(dest, "wb") as dst:
                    shutil.copyfileobj(src, dst)

            stamp = time.strftime("%Y%m%d-%H%M%S")
            backup_path = os.path.join(BACKUP_DIR, f"v{info['current']}_{stamp}")
            for name in names:
                target = os.path.join(BASE_DIR, *name.split("/"))
                if os.path.isfile(target):
                    bdest = os.path.join(backup_path, *name.split("/"))
                    os.makedirs(os.path.dirname(bdest), exist_ok=True)
                    shutil.copy2(target, bdest)

            for name in names:
                src = os.path.join(staging, *name.split("/"))
                target = os.path.join(BASE_DIR, *name.split("/"))
                os.makedirs(os.path.dirname(target), exist_ok=True)
                shutil.copy2(src, target)
        finally:
            shutil.rmtree(staging, ignore_errors=True)

    _cache.update(time=0.0, data=None)
    return {"ok": True, "from": info["current"], "to": info["latest"],
            "backup": os.path.relpath(backup_path, BASE_DIR)}
