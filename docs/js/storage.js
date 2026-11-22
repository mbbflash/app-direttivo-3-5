// Memoria del dispositivo usata dall'app.
// In modalità demo (?demo=1) usa uno spazio separato e temporaneo, così i dati finti
// non si mescolano mai con quelli veri e non finiscono nel database condiviso.
(function () {
  const isDemo = new URLSearchParams(location.search).has("demo");
  const memory = {};
  const fallback = {
    getItem: (k) => (k in memory ? memory[k] : null),
    setItem: (k, v) => { memory[k] = String(v); },
    removeItem: (k) => { delete memory[k]; }
  };

  function safe(storage, prefix) {
    try {
      const probe = "__app35_probe__";
      storage.setItem(probe, "1");
      storage.removeItem(probe);
    } catch (e) {
      return fallback;
    }
    return {
      getItem: (k) => { try { return storage.getItem(prefix + k); } catch (e) { return null; } },
      setItem: (k, v) => { try { storage.setItem(prefix + k, v); } catch (e) {} },
      removeItem: (k) => { try { storage.removeItem(prefix + k); } catch (e) {} }
    };
  }

  window.appStorage = isDemo ? safe(window.sessionStorage, "demo:") : safe(window.localStorage, "");

  // Ripulisce i residui lasciati da versioni precedenti della modalità demo,
  // che salvava i dati finti nello stesso spazio di quelli veri.
  if (!isDemo) {
    const s = window.appStorage;
    const token = s.getItem("app35_token_v1") || "";
    const files = s.getItem("app35_file_ids_v1") || "";
    if (token.includes("demo-token") || files.includes("\"demo-")) {
      ["app35_token_v1", "app35_file_ids_v1", "app35_pending_v1", "app35_migrated_v1",
        "libro_soci_ro_v2", "libro_soci_paper_cards_v1", "libro_soci_local_notes_v1",
        "libro_soci_escursioni_local_v1", "app35_reminders_v1", "app35_watch_v1"].forEach((k) => s.removeItem(k));
    }
  }
})();
