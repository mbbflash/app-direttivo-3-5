// Modalità dimostrativa (?demo=1): simula Google Drive e Fogli con dati inventati.
// Nessun dato reale, nessuna chiamata a Google. Serve per provare l'app senza account.
(function () {
  const cfg = window.APP_CONFIG;
  const STORE_KEY = "app35_demo_store_v1";

  function fmt(d) {
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }
  function shift(days) { const d = new Date(); d.setDate(d.getDate() + days); return d; }

  function seed() {
    const people = [
      ["Rossi", "Mario", 200], ["Bianchi", "Giulia", 15], ["Verdi", "Luca", -10], ["Neri", "Anna", 120],
      ["Gialli", "Paolo", 300], ["Blu", "Sara", 5], ["Marrone", "Elena", -40], ["Viola", "Marco", 90]
    ];
    const header = ["TESSERA n°", "TIPO TESSERA", "COGNOME", "NOME", "CELLULARE", "E-MAIL CONTATTO", "LUOGO DI NASCITA",
      "DATA DI NASCITA", "ANNI", "INDIRIZZO RESIDENZA", "CAP RESIDENZA", "CITTA RESIDENZA", "PROVINCIA RESIDENZA",
      "CODICE FISCALE", "DATA TESSERAMENTO", "DATA SCADENZA", "STATO TESSERA", "MAIL RINNOVO", "MESS. RINNOVO", "GG", "NOTE"];
    const soci = [header];
    people.forEach(([c, n, days], i) => {
      soci.push([String(i + 1), i % 3 ? "ORDINARIO" : "VOLONTARIO", c.toUpperCase(), n.toUpperCase(), "333000000" + i,
        `${n.toLowerCase()}.${c.toLowerCase()}@esempio.it`, "Lucca", "01/01/1990", "35", "Via Esempio " + (i + 1), "55100",
        "Lucca", "LU", "DEMO" + String(i).padStart(12, "0"), fmt(shift(days - 365)), fmt(shift(days)), "", "FALSE", "FALSE",
        String(days), i === 2 ? "Rinnovo da sollecitare" : ""]);
    });
    const formHeader = ["Informazioni cronologiche", "Nome e Cognome", "Indirizzo email", "Numero di telefono",
      "Sei un/una tesserato/a della TRE QUINTI TREKKING APS e la tua tessera è ancora attiva?"];
    const form = (rows) => [formHeader, ...rows];
    const store = {
      files: {
        "demo-soci": { name: cfg.libroSociName, sheets: { [cfg.libroSociSheet]: soci, "Libro Volontari": [[]] } },
        "demo-db": { name: cfg.databaseName, sheets: { "Foglio1": [] } },
        "demo-esc-1": { name: `${cfg.escursioniNamePrefix} 2026.10.25 - "Monte Esempio" (Risposte)`, sheets: { "Risposte del modulo 1": form([
          ["25/10/2026 9.00", "Mario Rossi", "mario.rossi@esempio.it", "3330000000", "SI"],
          ["25/10/2026 9.10", "Giulia Bianchi", "giulia.bianchi@esempio.it", "3330000001", "SI"],
          ["25/10/2026 9.20", "Ospite Esterno", "", "3471112222", "NO"]
        ]) } },
        "demo-esc-2": { name: `${cfg.escursioniNamePrefix} 2026.11.15 - "Il Sentiero Finto" (Risposte)`, sheets: { "Risposte del modulo 1": form([
          ["15/11/2026 8.00", "Rossi Mario", "mario.rossi@esempio.it", "", "SI"],
          ["15/11/2026 8.30", "Luca Verdi", "luca.verdi@esempio.it", "3330000002", "SI"],
          ["15/11/2026 8.45", "Sara Blu", "sara.blu@esempio.it", "3330000005", "SI"]
        ]) } }
      }
    };
    return store;
  }

  let store;
  try { store = JSON.parse(sessionStorage.getItem(STORE_KEY) || "null"); } catch (e) { store = null; }
  if (!store) store = seed();
  function persist() { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {} }

  function colNum(letters) {
    let n = 0;
    for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
    return n;
  }
  function parseRange(file, range) {
    let sheet = Object.keys(file.sheets)[0];
    let ref = range;
    const bang = range.lastIndexOf("!");
    if (bang >= 0) {
      sheet = range.slice(0, bang).replace(/^'|'$/g, "").replace(/''/g, "'");
      ref = range.slice(bang + 1);
    }
    const m = /^([A-Z]+)(\d*)(?::([A-Z]+)(\d*))?$/.exec(ref);
    if (!m) throw new Error("Intervallo non valido: " + range);
    return {
      sheet,
      c1: colNum(m[1]), r1: m[2] ? Number(m[2]) : 1,
      c2: m[3] ? colNum(m[3]) : colNum(m[1]), r2: m[4] ? Number(m[4]) : Infinity
    };
  }
  function getGrid(file, sheet) {
    if (!file.sheets[sheet]) { const e = new Error("Scheda non trovata: " + sheet); e.status = 400; throw e; }
    return file.sheets[sheet];
  }
  function readRange(file, range) {
    const p = parseRange(file, range);
    const grid = getGrid(file, p.sheet);
    const out = [];
    for (let r = p.r1; r <= Math.min(p.r2, grid.length); r++) {
      const row = (grid[r - 1] || []).slice(p.c1 - 1, p.c2);
      while (row.length && (row[row.length - 1] === "" || row[row.length - 1] == null)) row.pop();
      out.push(row.map(v => (v == null ? "" : String(v))));
    }
    while (out.length && !out[out.length - 1].length) out.pop();
    return { range, majorDimension: "ROWS", values: out };
  }
  function writeRange(file, range, values) {
    const p = parseRange(file, range);
    const grid = getGrid(file, p.sheet);
    values.forEach((vals, i) => {
      const r = p.r1 + i - 1;
      while (grid.length <= r) grid.push([]);
      vals.forEach((v, j) => { grid[r][p.c1 - 1 + j] = v; });
    });
  }

  async function handle(method, url, body) {
    await new Promise(r => setTimeout(r, 120)); // simula la rete
    const u = new URL(url);
    if (u.pathname.endsWith("/userinfo")) return { email: cfg.allowedAccounts[0] };

    if (u.hostname === "www.googleapis.com" && u.pathname === "/drive/v3/files") {
      const q = u.searchParams.get("q") || "";
      const eq = /name = '((?:[^'\\]|\\.)*)'/.exec(q);
      const contains = /name contains '((?:[^'\\]|\\.)*)'/.exec(q);
      const unq = (s) => s.replace(/\\(.)/g, "$1");
      const files = Object.entries(store.files)
        .filter(([, f]) => (eq ? f.name === unq(eq[1]) : contains ? f.name.includes(unq(contains[1])) : true))
        .map(([id, f]) => ({ id, name: f.name, ownedByMe: true, modifiedTime: new Date().toISOString() }));
      return { files };
    }

    const m = /\/v4\/spreadsheets\/([^/:]+)(.*)$/.exec(u.pathname);
    if (!m) throw new Error("Demo: richiesta non gestita " + url);
    const file = store.files[decodeURIComponent(m[1])];
    if (!file) throw new Error("Demo: foglio inesistente");
    const rest = decodeURIComponent(m[2] || "");

    if (!rest) {
      return { properties: { title: file.name }, sheets: Object.keys(file.sheets).map((t, i) => ({ properties: { sheetId: i, title: t } })) };
    }
    if (rest === ":batchUpdate") {
      for (const req of body.requests || []) {
        if (req.addSheet) file.sheets[req.addSheet.properties.title] = [];
      }
      persist();
      return { replies: [] };
    }
    if (rest === "/values:batchGet") {
      return { valueRanges: u.searchParams.getAll("ranges").map(r => readRange(file, r)) };
    }
    const vm = /^\/values\/(.+?)(:append)?$/.exec(rest);
    if (vm) {
      const range = vm[1];
      if (method === "GET") return readRange(file, range);
      if (method === "PUT") { writeRange(file, range, body.values); persist(); return { updatedRange: range }; }
      if (vm[2]) {
        const p = parseRange(file, range);
        const grid = getGrid(file, p.sheet);
        let last = grid.length;
        while (last > 0 && !(grid[last - 1] || []).some(v => v !== "" && v != null)) last--;
        const start = last + 1;
        writeRange(file, `'${p.sheet}'!A${start}`, body.values);
        persist();
        return { updates: { updatedRange: `'${p.sheet}'!A${start}:Z${start + body.values.length - 1}` } };
      }
    }
    throw new Error("Demo: richiesta non gestita " + method + " " + url);
  }

  window.DemoBackend = {
    handle,
    reset: () => { store = seed(); persist(); },
    dump: () => store
  };
})();
