// Collega la pagina ad accesso Google, database condiviso e installazione come app.
// Usa le variabili e le funzioni dello script principale della pagina (members, renderTable, ...).
(function () {
  const cfg = window.APP_CONFIG;
  const $ = (id) => document.getElementById(id);
  const MIGRATED_KEY = "app35_migrated_v1";
  const ui = {
    overlay: $("loginOverlay"),
    overlayBtn: $("btnLoginOverlay"),
    overlayMsg: $("loginMsg"),
    overlayHint: $("loginHint"),
    login: $("btnLogin"),
    logout: $("btnLogout"),
    reload: $("btnLoadSheet"),
    account: $("authAccount"),
    operator: $("operatorName"),
    badge: $("syncBadge"),
    version: $("appVersion")
  };
  let lastCloudLoad = 0;
  let renderQueued = false;

  ui.version.textContent = "v" + cfg.version + (GoogleApi.isDemo ? " · DEMO" : "");
  if (GoogleApi.isDemo) ui.version.classList.add("badge", "warn", "plain");
  ui.operator.value = CloudDB.operator();
  ui.operator.addEventListener("change", () => CloudDB.setOperator(ui.operator.value));

  // ---- Etichette leggibili per le righe del database ----
  function memberInfo(key) {
    const i = members.findIndex((m, idx) => memberNoteKey(m, idx) === key);
    const m = members[i];
    return m ? { tessera: m["TESSERA n°"] || "", socio: `${m["COGNOME"] || ""} ${m["NOME"] || ""}`.trim() } : {};
  }
  CloudDB.setResolver({
    paper: memberInfo,
    note: memberInfo,
    exc: (key) => {
      const sep = key.indexOf("::");
      const escId = sep >= 0 ? key.slice(0, sep) : key;
      const pKey = sep >= 0 ? key.slice(sep + 2) : "";
      const esc = excList.find(e => e.id === escId);
      return {
        escursione: esc ? formatNomeUscita(esc.titolo) : escId,
        partecipante: pKey.replace(/^[a-z]+:/i, "").replace(/_/g, " ")
      };
    }
  });

  // ---- Stato della sincronizzazione ----
  CloudDB.onStatus((s) => {
    const map = {
      idle: ["ok", "✓ Salvato nel database"],
      loading: ["busy", "Lettura database…"],
      saving: ["busy", "Salvataggio…"],
      pending: ["busy", `● ${s.pending} modifiche da salvare`],
      auth: ["warn", `⚠ ${s.pending ? s.pending + " modifiche non salvate: " : ""}accedi per salvare`],
      offline: ["warn", `⚠ Offline${s.pending ? ": " + s.pending + " modifiche in attesa" : ""}`],
      error: ["err", "⚠ Errore di salvataggio: riprovo"],
      loaderror: ["err", "⚠ Database non raggiungibile: clic per riprovare"]
    };
    const [cls, text] = map[s.state] || ["", ""];
    ui.badge.className = "sync-badge " + cls;
    ui.badge.textContent = GoogleApi.isSignedIn() || s.pending ? text : "";
    ui.badge.title = s.message || "";
  });
  ui.badge.addEventListener("click", async () => {
    const s = CloudDB.status();
    if (s.state === "auth") await doLogin();
    else if (s.state === "error" || s.state === "offline") CloudDB.flush();
    else if (s.state === "loaderror") refreshAll();
  });

  // ---- Ridisegno senza disturbare chi sta scrivendo ----
  function editingInside() {
    const a = document.activeElement;
    if (!a || !(a.tagName === "INPUT" || a.tagName === "TEXTAREA")) return false;
    return Boolean(a.closest("#membersBody, #detailBody, #excRowsBody"));
  }
  function rerender() {
    if (editingInside()) {
      if (!renderQueued) {
        renderQueued = true;
        document.addEventListener("focusout", function once() {
          document.removeEventListener("focusout", once);
          renderQueued = false;
          setTimeout(rerender, 50);
        });
      }
      return;
    }
    renderTable();
    if (selectedMemberIndex !== null && members[selectedMemberIndex]) openMemberDetail(selectedMemberIndex, { keepScroll: true });
    if (excList.length) renderEscursioni();
  }

  function cacheMaps() {
    try {
      appStorage.setItem(PAPER_CARDS_KEY, JSON.stringify(paperCards));
      appStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(localNotes));
    } catch (e) {}
    saveExcLocalState();
  }

  // La prima volta su questo dispositivo propone di caricare nel database le spunte
  // e le note salvate dalla vecchia versione (solo locale) dell'app.
  function migrateLocal(cloud) {
    let done = false;
    try { done = appStorage.getItem(MIGRATED_KEY) === "1"; } catch (e) {}
    if (done) return;
    const extra = {
      paper: Object.keys(paperCards).filter(k => !(k in cloud.paper)),
      note: Object.keys(localNotes).filter(k => !(k in cloud.note) && String(localNotes[k] || "").trim()),
      exc: Object.keys(excLocalState).filter(k => !(k in cloud.exc))
    };
    const total = extra.paper.length + extra.note.length + extra.exc.length;
    if (total && confirm(
      `Su questo dispositivo ci sono dati salvati dalla versione precedente dell'app:\n` +
      `• ${extra.paper.length} spunte tessere\n• ${extra.note.length} note soci\n• ${extra.exc.length} note/conferme escursioni\n\n` +
      `Vuoi caricarli nel database condiviso, così li vede tutto il direttivo?`)) {
      extra.paper.forEach(k => { cloud.paper[k] = paperCards[k]; CloudDB.paper(k, paperCards[k]); });
      extra.note.forEach(k => { cloud.note[k] = localNotes[k]; CloudDB.note(k, localNotes[k]); });
      extra.exc.forEach(k => { cloud.exc[k] = excLocalState[k]; CloudDB.exc(k, excLocalState[k]); });
    }
    try { appStorage.setItem(MIGRATED_KEY, "1"); } catch (e) {}
  }

  async function loadCloud() {
    try {
      const data = await CloudDB.load();
      migrateLocal(data);
      paperCards = data.paper;
      localNotes = data.note;
      excLocalState = data.exc;
      cacheMaps();
      lastCloudLoad = Date.now();
      rerender();
    } catch (e) {
      if (e instanceof GoogleApi.AuthError) require(e.message);
      else setStatusText("Database condiviso non raggiungibile: " + e.message, true);
    }
  }

  async function refreshAll() {
    await Promise.all([loadFromSheet(), loadCloud(), excList.length ? loadEscursioniFromServer() : null]);
  }
  els.btnLoadSheet.removeEventListener("click", loadFromSheet);
  els.btnLoadSheet.addEventListener("click", () => {
    if (!GoogleApi.isSignedIn()) { require(); return; }
    refreshAll();
  });

  // ---- Accesso ----
  function setSignedInUi() {
    const on = GoogleApi.isSignedIn();
    const email = GoogleApi.email();
    ui.account.innerHTML = on
      ? `<span class="avatar">${escapeHtml(initials(email.split("@")[0].replace(/[._-]+/g, " ")))}</span><span>${escapeHtml(email)}</span>`
      : `<span class="avatar" style="background:var(--surface-3);color:var(--muted)">?</span><span class="muted">Non connesso</span>`;
    ui.login.style.display = on ? "none" : "";
    ui.logout.style.display = on ? "" : "none";
  }

  function require(message) {
    ui.overlayMsg.textContent = message || "";
    ui.overlay.classList.add("show");
    setSignedInUi();
  }

  async function doLogin() {
    ui.overlayMsg.textContent = "";
    ui.overlayBtn.disabled = true;
    ui.overlayBtn.textContent = "Accesso in corso…";
    try {
      await GoogleApi.signIn();
      ui.overlay.classList.remove("show");
      setSignedInUi();
      setStatusText("Caricamento dati…");
      await Promise.all([loadFromSheet(), loadCloud()]);
      CloudDB.flush();
    } catch (e) {
      require(e.message);
    } finally {
      ui.overlayBtn.disabled = false;
      ui.overlayBtn.textContent = "Accedi con Google";
    }
  }

  async function doLogout() {
    const n = CloudDB.pendingCount();
    if (n && !confirm(`Ci sono ${n} modifiche non ancora salvate nel database: uscendo andranno perse. Uscire comunque?`)) return;
    if (!n && !confirm("Uscire? Dal dispositivo verranno cancellati anche i dati in cache.")) return;
    await GoogleApi.signOut();
    // Sul dispositivo non deve restare nessun dato dei soci.
    [STORAGE_KEY, PAPER_CARDS_KEY, LOCAL_NOTES_KEY, EXC_LOCAL_KEY, "app35_pending_v1"].forEach(k => {
      try { appStorage.removeItem(k); } catch (e) {}
    });
    location.reload();
  }

  ui.overlayBtn.addEventListener("click", doLogin);
  ui.login.addEventListener("click", doLogin);
  ui.logout.addEventListener("click", doLogout);

  // Torna sull'app dopo un po': rilegge le modifiche fatte dagli altri.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && GoogleApi.isSignedIn() && Date.now() - lastCloudLoad > 60000) {
      loadCloud();
    }
  });

  window.AuthUI = { require };

  // ---- Avvio ----
  (async function start() {
    const st = await GoogleApi.init();
    setSignedInUi();
    if (!GoogleApi.isConfigured()) {
      ui.overlayHint.textContent = "L'app non è ancora collegata a Google.";
      require("Manca il Client ID Google in js/config.js (vedi SETUP-GOOGLE.md).\nPer provarla con dati finti apri questa pagina aggiungendo ?demo=1 all'indirizzo.");
      ui.overlayBtn.disabled = true;
      return;
    }
    if (GoogleApi.isDemo) ui.overlayHint.textContent = "Modalità DEMO: dati inventati, nessun accesso reale a Google.";
    if (st.signedIn) {
      ui.overlay.classList.remove("show");
      setStatusText("Caricamento dati…");
      await Promise.all([loadFromSheet(), loadCloud()]);
    } else {
      require();
    }
  })();

  // ---- App installabile e sempre aggiornata ----
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
