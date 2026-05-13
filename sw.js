const CACHE = 'truckgo-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&display=swap'
];

// Install — cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(['/','index.html']);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
