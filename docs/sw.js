// Service worker di APP Direttivo 3/5.
// Strategia "prima la rete": con internet si carica sempre l'ultima versione pubblicata,
// senza internet si apre l'ultima copia salvata. I dati Google non vengono mai messi in cache qui.
const CACHE = "app35-shell-v1";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "js/config.js",
  "js/google.js",
  "js/clouddb.js",
  "js/app.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req, { cache: "no-store" })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
  );
});
