// Offline support: network-first (updates show up automatically), falls back to the saved copy with no signal.
const C = 'p90x-tracker-v2';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './img/cb.jpg', './img/plyo.jpg', './img/sa.jpg', './img/yoga.jpg', './img/lb.jpg', './img/kenpo.jpg',
  './img/xs.jpg', './img/rest.jpg', './img/core.jpg', './img/cst.jpg', './img/bb.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(C).then(c => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
