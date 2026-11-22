// Accesso con Google e lettura dei Fogli direttamente dal browser.
// Il token di accesso dura al massimo 1 ora; "Esci" lo revoca e cancella i dati dal dispositivo.
(function () {
  const cfg = window.APP_CONFIG;
  const SCOPES = [
    "openid",
    "email",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.metadata.readonly"
  ].join(" ");
  const TOKEN_KEY = "app35_token_v1";
  const FILE_CACHE_KEY = "app35_file_ids_v1";
  const SHEETS = "https://sheets.googleapis.com/v4/spreadsheets";
  const DRIVE = "https://www.googleapis.com/drive/v3/files";
  const SPREADSHEET_MIME = "application/vnd.google-apps.spreadsheet";

  const isDemo = new URLSearchParams(location.search).has("demo");
  let token = null;
  let tokenClient = null;

  class AuthError extends Error {
    constructor(msg) { super(msg); this.name = "AuthError"; }
  }

  function readJson(storage, key) {
    try { return JSON.parse(storage.getItem(key) || "null"); } catch (e) { return null; }
  }
  function writeJson(storage, key, val) {
    try {
      if (val === null) storage.removeItem(key);
      else storage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function isConfigured() {
    return isDemo || (cfg.googleClientId && !cfg.googleClientId.startsWith("INSERISCI"));
  }

  function tokenValid() {
    return Boolean(token && token.access_token && token.expires_at > Date.now() + 60000);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Impossibile caricare " + src));
      document.head.appendChild(s);
    });
  }

  let gisPromise = null;
  function loadGis() {
    if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
    if (!gisPromise) gisPromise = loadScript("https://accounts.google.com/gsi/client");
    return gisPromise;
  }

  async function init() {
    if (isDemo) {
      await loadScript("js/demo.js");
    }
    const saved = readJson(localStorage, TOKEN_KEY);
    if (saved && saved.expires_at > Date.now() + 60000) token = saved;
    if (!isDemo && isConfigured()) loadGis().catch(() => {});
    return { signedIn: tokenValid(), email: token ? token.email : "" };
  }

  // Deve partire da un clic dell'utente, altrimenti il browser blocca la finestra di Google.
  async function signIn() {
    if (!isConfigured()) {
      throw new Error("Client ID Google non configurato (js/config.js). Vedi SETUP-GOOGLE.md.");
    }
    let resp;
    if (isDemo) {
      resp = { access_token: "demo-token", expires_in: 3600 };
    } else {
      await loadGis();
      resp = await new Promise((resolve, reject) => {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: cfg.googleClientId,
          scope: SCOPES,
          hint: (cfg.allowedAccounts || [])[0] || "",
          callback: (r) => (r && r.error ? reject(new Error(r.error_description || r.error)) : resolve(r)),
          error_callback: (e) => reject(new Error(
            e && e.type === "popup_closed" ? "Accesso annullato." :
            e && e.type === "popup_failed_to_open" ? "Il browser ha bloccato la finestra di accesso: consenti i popup per questo sito." :
            (e && e.message) || "Accesso non riuscito."
          ))
        });
        tokenClient.requestAccessToken({ prompt: "" });
      });
      if (!google.accounts.oauth2.hasGrantedAllScopes(resp,
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.metadata.readonly")) {
        throw new Error("Per funzionare l'app ha bisogno di tutti i permessi richiesti: riprova e spunta tutte le caselle.");
      }
    }

    token = { access_token: resp.access_token, expires_at: Date.now() + Number(resp.expires_in || 3600) * 1000, email: "" };
    const info = await apiJson("https://www.googleapis.com/oauth2/v3/userinfo");
    const email = String(info.email || "").toLowerCase();
    const allowed = (cfg.allowedAccounts || []).map(a => a.toLowerCase());
    if (allowed.length && !allowed.includes(email)) {
      await signOut();
      throw new Error("Questo account (" + (email || "sconosciuto") + ") non è abilitato. Accedi con " + allowed.join(" oppure ") + ".");
    }
    token.email = email;
    writeJson(localStorage, TOKEN_KEY, token);
    return { email };
  }

  async function signOut() {
    const t = token;
    token = null;
    writeJson(localStorage, TOKEN_KEY, null);
    if (t && !isDemo && window.google && google.accounts && google.accounts.oauth2) {
      try { google.accounts.oauth2.revoke(t.access_token, () => {}); } catch (e) {}
    }
  }

  async function apiJson(url, options = {}) {
    if (!tokenValid()) {
      token = null;
      writeJson(localStorage, TOKEN_KEY, null);
      throw new AuthError("Sessione Google scaduta: accedi di nuovo.");
    }
    const opts = Object.assign({ method: "GET" }, options);
    if (isDemo) return window.DemoBackend.handle(opts.method, url, opts.body ? JSON.parse(opts.body) : null);
    const headers = Object.assign({ Authorization: "Bearer " + token.access_token }, opts.headers || {});
    if (opts.body) headers["Content-Type"] = "application/json";
    // Tutto il direttivo usa lo stesso account, quindi condivide il limite di richieste al minuto:
    // se Google risponde "troppe richieste" (429) o è momentaneamente non disponibile, riprovo da solo.
    let res;
    for (let attempt = 0; ; attempt++) {
      res = await fetch(url, Object.assign({}, opts, { headers }));
      const retryable = res.status === 429 || (opts.method === "GET" && [500, 502, 503, 504].includes(res.status));
      if (!retryable || attempt >= 4) break;
      const wait = Math.min(16000, 2000 * 2 ** attempt) + Math.random() * 1000;
      await new Promise(r => setTimeout(r, wait));
    }
    if (res.status === 401) {
      token = null;
      writeJson(localStorage, TOKEN_KEY, null);
      throw new AuthError("Sessione Google scaduta: accedi di nuovo.");
    }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw: text }; }
    if (!res.ok) {
      const msg = (data && data.error && (data.error.message || data.error.status)) || ("HTTP " + res.status);
      if (res.status === 403 || res.status === 404) {
        throw new Error(msg + " — controlla che l'account abbia accesso al foglio.");
      }
      throw new Error(msg);
    }
    return data;
  }

  // ---- Google Drive / Sheets ----

  function driveQuoted(s) { return "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'"; }

  async function listSpreadsheets(query) {
    const files = [];
    let pageToken = "";
    do {
      const params = new URLSearchParams({
        q: `(${query}) and mimeType = '${SPREADSHEET_MIME}' and trashed = false`,
        fields: "nextPageToken, files(id, name, modifiedTime, ownedByMe)",
        orderBy: "modifiedTime desc",
        pageSize: "200",
        supportsAllDrives: "true",
        includeItemsFromAllDrives: "true"
      });
      if (pageToken) params.set("pageToken", pageToken);
      const data = await apiJson(DRIVE + "?" + params.toString());
      files.push(...(data.files || []));
      pageToken = data.nextPageToken || "";
    } while (pageToken);
    return files;
  }

  async function findSpreadsheetId(name) {
    const cache = readJson(localStorage, FILE_CACHE_KEY) || {};
    if (cache[name]) return cache[name];
    const files = await listSpreadsheets("name = " + driveQuoted(name));
    if (!files.length) throw new Error(`Foglio "${name}" non trovato nel Drive dell'account.`);
    files.sort((a, b) => Number(b.ownedByMe) - Number(a.ownedByMe));
    cache[name] = files[0].id;
    writeJson(localStorage, FILE_CACHE_KEY, cache);
    return files[0].id;
  }

  function forgetSpreadsheetId(name) {
    const cache = readJson(localStorage, FILE_CACHE_KEY) || {};
    delete cache[name];
    writeJson(localStorage, FILE_CACHE_KEY, cache);
  }

  function sheetUrl(id, path) { return SHEETS + "/" + encodeURIComponent(id) + (path || ""); }

  const Sheets = {
    meta: (id) => apiJson(sheetUrl(id, "?fields=" + encodeURIComponent("properties.title,sheets.properties(sheetId,title)"))),
    get: (id, range) => apiJson(sheetUrl(id, "/values/" + encodeURIComponent(range))),
    batchGet: (id, ranges) => apiJson(sheetUrl(id, "/values:batchGet?" + ranges.map(r => "ranges=" + encodeURIComponent(r)).join("&"))),
    update: (id, range, values) => apiJson(
      sheetUrl(id, "/values/" + encodeURIComponent(range) + "?valueInputOption=RAW"),
      { method: "PUT", body: JSON.stringify({ range, majorDimension: "ROWS", values }) }),
    append: (id, range, values) => apiJson(
      sheetUrl(id, "/values/" + encodeURIComponent(range) + ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS"),
      { method: "POST", body: JSON.stringify({ majorDimension: "ROWS", values }) }),
    batchUpdate: (id, requests) => apiJson(sheetUrl(id, ":batchUpdate"), { method: "POST", body: JSON.stringify({ requests }) })
  };

  function rowsToRecords(values) {
    const rows = Array.isArray(values) ? values : [];
    if (!rows.length) return { headers: [], records: [] };
    const headers = rows[0].map((h, i) => String(h || "").trim() || `Colonna_${i + 1}`);
    const records = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r] || [];
      if (!row.some(c => String(c ?? "").trim())) continue;
      const item = { _rowNumber: r + 1 };
      headers.forEach((h, i) => { item[h] = String(row[i] ?? "").trim(); });
      records.push(item);
    }
    return { headers, records };
  }

  async function withRetryOnMissingFile(name, fn) {
    const id = await findSpreadsheetId(name);
    try {
      return await fn(id);
    } catch (e) {
      if (e instanceof AuthError) throw e;
      // Il file potrebbe essere stato ricreato: cerco di nuovo l'ID una volta.
      forgetSpreadsheetId(name);
      const id2 = await findSpreadsheetId(name);
      if (id2 === id) throw e;
      return fn(id2);
    }
  }

  async function mapLimit(items, limit, fn) {
    const out = new Array(items.length);
    let next = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    });
    await Promise.all(workers);
    return out;
  }

  const AppData = {
    async loadSoci() {
      return withRetryOnMissingFile(cfg.libroSociName, async (id) => {
        const data = await Sheets.get(id, `'${cfg.libroSociSheet.replace(/'/g, "''")}'!A1:AZ`);
        const { headers, records } = rowsToRecords(data.values);
        return { ok: true, headers, members: records, updatedAt: new Date().toISOString() };
      });
    },

    async loadEscursioni() {
      const files = await listSpreadsheets("name contains " + driveQuoted(cfg.escursioniNamePrefix));
      const prefix = cfg.escursioniNamePrefix.toLowerCase();
      const list = files
        .filter(f => f.name.toLowerCase().startsWith(prefix))
        .sort((a, b) => a.name.localeCompare(b.name, "it"));
      const escursioni = await mapLimit(list, 4, async (f) => {
        try {
          // Senza nome di scheda l'intervallo si riferisce al primo foglio (le risposte del modulo).
          const data = await Sheets.get(f.id, "A1:AZ");
          const { headers, records } = rowsToRecords(data.values);
          return { id: f.id, titolo: f.name, data: "", ok: true, headers, rows: records };
        } catch (e) {
          if (e instanceof AuthError) throw e;
          return { id: f.id, titolo: f.name, data: "", ok: false, error: e.message, headers: [], rows: [] };
        }
      });
      return { ok: true, escursioni, updatedAt: new Date().toISOString() };
    }
  };

  window.GoogleApi = {
    AuthError, isDemo, isConfigured, init, signIn, signOut,
    isSignedIn: tokenValid,
    email: () => (token ? token.email : ""),
    findSpreadsheetId, forgetSpreadsheetId, Sheets, rowsToRecords
  };
  window.AppData = AppData;
})();
