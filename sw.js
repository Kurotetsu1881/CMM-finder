// CMM Finder service worker: PWA kurulabilirliği için; sayfa/ikonlar önbelleğe alınır, IPC verileri her zaman ağdan okunur (güncel kalsın)
const CACHE = 'cmm-finder-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'logo.svg', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok && /\.(html|png|svg|webmanifest)$|\/$/.test(new URL(r.url).pathname)) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
    return res;
  }).catch(() => caches.match(r).then(h => h || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
