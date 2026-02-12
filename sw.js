---
---
const CACHE_VERSION = '{{ site.pwa_sw_version | default: "v1" }}';
const CACHE_NAME = `daizan-pwa-${CACHE_VERSION}`;

function getBasePath() {
  const swUrl = new URL(self.location.href);
  return swUrl.pathname.replace(/\/sw\.js$/, '');
}

const BASE_PATH = getBasePath();

function withBase(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

const APP_SHELL = [
  withBase('/'),
  withBase('/index.html'),
  withBase('/podcast/'),
  withBase('/assets/css/style.css'),
  withBase('/manifest.webmanifest'),
  withBase('/assets/pwa/icon-192.png'),
  withBase('/assets/pwa/icon-512.png'),
  withBase('/assets/pwa/apple-touch-icon.png')
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('daizan-pwa-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request, { ignoreSearch: true });
          if (cached) return cached;
          return caches.match(withBase('/'));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(withBase('/')));
    })
  );
});
