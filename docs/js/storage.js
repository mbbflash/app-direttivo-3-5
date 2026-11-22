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
})();
