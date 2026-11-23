// Database condiviso su Google Fogli per spunte tessere, note e conferme escursioni.
// Sul dispositivo resta solo una cache e la coda delle modifiche non ancora salvate.
(function () {
  const cfg = window.APP_CONFIG;
  const PENDING_KEY = "app35_pending_v1";
  const OPERATOR_KEY = "app35_operator_v1";

  const TABS = {
    paper: { name: "Tessere", headers: ["chiave", "tessera", "socio", "preparata", "consegnata", "aggiornato_il", "aggiornato_da"] },
    note: { name: "Note", headers: ["chiave", "tessera", "socio", "nota", "aggiornato_il", "aggiornato_da"] },
    exc: { name: "Conferme_Escursioni", headers: ["chiave", "escursione", "partecipante", "confermato", "nota", "aggiornato_il", "aggiornato_da"] },
    remind: { name: "Solleciti", headers: ["chiave", "tessera", "socio", "canale", "data_sollecito", "aggiornato_il", "aggiornato_da"] },
    log: { name: "Log", headers: ["quando", "chi", "tipo", "chiave", "valore"] },
    // Richieste per lo script Apps Script (SETUP-APPS-SCRIPT.md): righe aggiunte, mai riscritte dall'app.
    req: { name: "Richieste", headers: ["id", "tipo", "parametri", "stato", "risultato", "errore", "creato_il", "creato_da", "completato_il"] }
  };

  let dbId = "";
  let schemaReady = false;
  const rowIndex = { paper: {}, note: {}, exc: {}, remind: {} };
  let pending = readPending();
  let flushing = false;
  let flushTimer = null;
  let retryTimer = null;
  let resolver = { paper: () => ({}), note: () => ({}), exc: () => ({}), remind: () => ({}) };
  let statusCb = () => {};
  let lastStatus = { state: "idle", pending: 0, message: "" };

  function readPending() {
    try {
      const p = JSON.parse(appStorage.getItem(PENDING_KEY) || "{}");
      return p && typeof p === "object" ? p : {};
    } catch (e) { return {}; }
  }
  function savePending() {
    try { appStorage.setItem(PENDING_KEY, JSON.stringify(pending)); } catch (e) {}
  }
  function pendingCount() { return Object.keys(pending).length; }

  function setStatus(state, message) {
    lastStatus = { state, pending: pendingCount(), message: message || "" };
    try { statusCb(lastStatus); } catch (e) {}
  }

  function colLetter(n) {
    let s = "";
    while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }
  function tabRange(type, row) {
    const t = TABS[type];
    const last = colLetter(t.headers.length);
    const name = `'${t.name}'`;
    return row ? `${name}!A${row}:${last}${row}` : `${name}!A1:${last}`;
  }
  function yes(v) { return ["SI", "SÌ", "TRUE", "VERO", "1", "X"].includes(String(v || "").trim().toUpperCase()); }
  function yn(b) { return b ? "SI" : "NO"; }
  function nowIt() { return new Date().toLocaleString("it-IT"); }

  function operator() {
    try { return appStorage.getItem(OPERATOR_KEY) || ""; } catch (e) { return ""; }
  }
  function setOperator(name) {
    try { appStorage.setItem(OPERATOR_KEY, String(name || "").trim()); } catch (e) {}
  }
  function who() {
    const email = window.GoogleApi.email();
    const op = operator();
    return op ? (email ? `${op} (${email})` : op) : email;
  }
  function whoShort() { return operator() || window.GoogleApi.email(); }

  async function ensureSchema() {
    if (schemaReady) return;
    const meta = await GoogleApi.Sheets.meta(dbId);
    const existing = new Set((meta.sheets || []).map(s => s.properties.title));
    const missing = Object.values(TABS).filter(t => !existing.has(t.name));
    if (missing.length) {
      await GoogleApi.Sheets.batchUpdate(dbId, missing.map(t => ({
        addSheet: { properties: { title: t.name, gridProperties: { frozenRowCount: 1 } } }
      })));
      for (const t of missing) {
        const type = Object.keys(TABS).find(k => TABS[k] === t);
        await GoogleApi.Sheets.update(dbId, `'${t.name}'!A1:${colLetter(t.headers.length)}1`, [t.headers]);
        if (type && rowIndex[type]) rowIndex[type] = {};
      }
    }
    schemaReady = true;
  }

  async function openDb() {
    if (!dbId) dbId = await GoogleApi.findSpreadsheetId(cfg.databaseName);
    await ensureSchema();
  }

  function parseTab(type, values) {
    const rows = Array.isArray(values) ? values : [];
    const idx = {};
    const map = {};
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i] || [];
      const key = String(r[0] || "").trim();
      if (!key) continue;
      idx[key] = i + 1; // l'ultima riga con la stessa chiave vince
      if (type === "paper") {
        const consegnata = yes(r[4]);
        const preparata = yes(r[3]) || consegnata;
        if (preparata || consegnata) map[key] = { preparata, consegnata };
        else delete map[key];
      } else if (type === "note") {
        const nota = String(r[3] || "");
        if (nota.trim()) map[key] = nota; else delete map[key];
      } else if (type === "exc") {
        const confirmed = yes(r[3]);
        const note = String(r[4] || "");
        if (confirmed || note.trim()) map[key] = { confirmed, note }; else delete map[key];
      } else if (type === "remind") {
        const canale = String(r[3] || "").trim();
        const data = String(r[4] || "").trim();
        if (canale || data) map[key] = { canale, data, by: String(r[6] || "").trim() }; else delete map[key];
      }
    }
    rowIndex[type] = idx;
    return map;
  }

  // Applica sopra i dati del foglio le modifiche locali non ancora salvate.
  function overlayPending(data) {
    for (const op of Object.values(pending)) {
      const target = data[op.type];
      if (!target) continue;
      if (op.value === null || op.value === undefined) delete target[op.key];
      else target[op.key] = op.value;
    }
    return data;
  }

  async function load() {
    setStatus("loading", "Lettura database condiviso…");
    try {
      await openDb();
      const res = await GoogleApi.Sheets.batchGet(dbId, [tabRange("paper"), tabRange("note"), tabRange("exc"), tabRange("remind")]);
      const vr = res.valueRanges || [];
      const data = {
        paper: parseTab("paper", vr[0] && vr[0].values),
        note: parseTab("note", vr[1] && vr[1].values),
        exc: parseTab("exc", vr[2] && vr[2].values),
        remind: parseTab("remind", vr[3] && vr[3].values)
      };
      overlayPending(data);
      setStatus(pendingCount() ? "pending" : "idle");
      if (pendingCount()) scheduleFlush(200);
      return data;
    } catch (e) {
      setStatus(e instanceof GoogleApi.AuthError ? "auth" : "loaderror", e.message);
      throw e;
    }
  }

  function buildRow(type, key, value) {
    const info = (resolver[type] && resolver[type](key)) || {};
    const stamp = [nowIt(), who()];
    if (type === "paper") {
      const v = value || { preparata: false, consegnata: false };
      return [key, info.tessera || "", info.socio || "", yn(v.preparata), yn(v.consegnata), ...stamp];
    }
    if (type === "note") {
      return [key, info.tessera || "", info.socio || "", value || "", ...stamp];
    }
    if (type === "remind") {
      const v = value || {};
      return [key, info.tessera || "", info.socio || "", v.canale || "", v.data || "", ...stamp];
    }
    const v = value || { confirmed: false, note: "" };
    return [key, info.escursione || "", info.partecipante || "", yn(v.confirmed), v.note || "", ...stamp];
  }

  function logValue(type, value) {
    if (type === "paper") return value ? `preparata=${yn(value.preparata)} consegnata=${yn(value.consegnata)}` : "nessuna spunta";
    if (type === "note") return value || "(nota cancellata)";
    if (type === "remind") return value ? `sollecito ${value.canale || ""} del ${value.data || ""}` : "(sollecito annullato)";
    return value ? `confermato=${yn(value.confirmed)} nota=${value.note || ""}` : "(cancellato)";
  }

  // Registra una modifica: viene salvata subito in locale e poi inviata al foglio.
  function queue(type, key, value, delay) {
    if (!key || !TABS[type]) return;
    const id = type + "|" + key;
    const prev = pending[id];
    pending[id] = { type, key, value: value === undefined ? null : value, rev: (prev ? prev.rev : 0) + 1, at: Date.now() };
    savePending();
    setStatus("pending");
    scheduleFlush(delay === undefined ? 600 : delay);
  }

  function scheduleFlush(delay) {
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, delay);
  }

  async function writeOne(op) {
    const row = buildRow(op.type, op.key, op.value);
    let target = rowIndex[op.type][op.key];
    if (!target) {
      // Un altro dispositivo potrebbe aver appena creato la stessa chiave.
      const col = await GoogleApi.Sheets.get(dbId, `'${TABS[op.type].name}'!A1:A`);
      const vals = col.values || [];
      for (let i = vals.length - 1; i >= 1; i--) {
        if (String((vals[i] || [])[0] || "").trim() === op.key) { target = i + 1; break; }
      }
    }
    if (target) {
      await GoogleApi.Sheets.update(dbId, tabRange(op.type, target), [row]);
      rowIndex[op.type][op.key] = target;
    } else {
      const res = await GoogleApi.Sheets.append(dbId, tabRange(op.type), [row]);
      const m = /![A-Z]+(\d+)/.exec((res.updates && res.updates.updatedRange) || "");
      if (m) rowIndex[op.type][op.key] = Number(m[1]);
    }
    await GoogleApi.Sheets.append(dbId, tabRange("log"), [[nowIt(), who(), TABS[op.type].name, op.key, logValue(op.type, op.value)]]);
  }

  async function flush() {
    if (flushing || !pendingCount()) {
      // Senza modifiche in coda non c'è niente da dire: non nascondo un errore di lettura.
      if (!pendingCount() && ["pending", "saving", "auth", "offline", "error"].includes(lastStatus.state)) setStatus("idle");
      return;
    }
    if (!GoogleApi.isSignedIn()) { setStatus("auth", "Accedi per salvare le modifiche nel database."); return; }
    if (navigator.onLine === false) { setStatus("offline", "Offline: le modifiche verranno salvate appena torna la connessione."); return; }
    flushing = true;
    setStatus("saving");
    try {
      await openDb();
      for (const [id, op] of Object.entries(pending)) {
        await writeOne(op);
        if (pending[id] && pending[id].rev === op.rev) delete pending[id];
        savePending();
      }
      setStatus(pendingCount() ? "pending" : "idle");
      if (pendingCount()) scheduleFlush(300);
    } catch (e) {
      if (e instanceof GoogleApi.AuthError) {
        setStatus("auth", e.message);
      } else {
        setStatus("error", "Salvataggio non riuscito, riprovo tra poco: " + e.message);
        clearTimeout(retryTimer);
        retryTimer = setTimeout(flush, 15000);
      }
    } finally {
      flushing = false;
    }
  }

  window.addEventListener("online", () => scheduleFlush(500));

  // ---- Richieste allo script di automazione ----
  // Partono subito: se non si può (offline o senza accesso) l'errore arriva al chiamante,
  // perché eseguirle più tardi senza che l'utente lo veda potrebbe sorprendere.
  async function addRequest(tipo, parametri) {
    if (!navigator.onLine) throw new Error("Sei offline: riprova quando torna la connessione.");
    if (!GoogleApi.isSignedIn()) throw new GoogleApi.AuthError("Accedi con Google per inviare la richiesta.");
    await openDb();
    const id = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
    await GoogleApi.Sheets.append(dbId, tabRange("req"),
      [[id, tipo, JSON.stringify(parametri || {}), "in_attesa", "", "", nowIt(), who(), ""]]);
    return id;
  }

  async function getRequest(id) {
    await openDb();
    const res = await GoogleApi.Sheets.get(dbId, tabRange("req"));
    const rows = res.values || [];
    for (let i = rows.length - 1; i >= 1; i--) {
      const r = rows[i] || [];
      if (String(r[0] || "").trim() !== id) continue;
      let risultato = null;
      try { risultato = r[4] ? JSON.parse(r[4]) : null; } catch (e) { risultato = null; }
      return { id, stato: String(r[3] || "").trim(), risultato, errore: String(r[5] || "").trim() };
    }
    return null;
  }

  window.CloudDB = {
    TABS,
    load,
    flush: () => scheduleFlush(0),
    paper: (key, value) => queue("paper", key, value, 300),
    note: (key, text) => queue("note", key, String(text || "").trim() ? text : null, 1000),
    exc: (key, value) => queue("exc", key, value, 1000),
    remind: (key, value) => queue("remind", key, value, 300),
    addRequest,
    getRequest,
    pendingCount,
    status: () => lastStatus,
    onStatus: (cb) => { statusCb = cb || (() => {}); },
    setResolver: (r) => { resolver = Object.assign(resolver, r || {}); },
    operator,
    setOperator,
    who: whoShort,
    reset: () => { dbId = ""; schemaReady = false; }
  };
})();
