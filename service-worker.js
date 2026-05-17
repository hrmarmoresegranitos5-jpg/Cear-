// ─────────────────────────────────────────────────────────────────────────────
// service-worker.js — Ceará Planejados PWA
//
// Estratégia:
//   • Cache-first para assets estáticos (JS, CSS, imagens, fontes)
//   • Network-first para navegação (HTML) com fallback offline
//   • Stale-while-revalidate para dados dinâmicos futuros
//
// Versão do cache — incremente ao fazer deploy para forçar atualização
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_NAME    = 'cear-v1';
const OFFLINE_URL   = '/offline.html';

// Assets essenciais para funcionar offline (shell do app)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
];

// ─────────────────────────────────────────────────────────────────────────────
// INSTALL — pré-cacheia o shell do app
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pré-cacheando shell do app');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Ativa imediatamente sem esperar tabs antigas fecharem
  self.skipWaiting();
});

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVATE — limpa caches antigos
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deletando cache antigo:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Toma controle de todas as tabs abertas imediatamente
  self.clients.claim();
});

// ─────────────────────────────────────────────────────────────────────────────
// FETCH — intercept de requisições
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-HTTP (chrome-extension:// etc)
  if (!request.url.startsWith('http')) return;

  // Ignora requisições cross-origin (CDNs externos, APIs)
  if (url.origin !== self.location.origin) return;

  // ── Navegação (HTML) — Network-first com fallback offline ────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clona e guarda no cache
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Offline: tenta o cache, senão mostra página offline
          return caches.match(request)
            .then(cached => cached || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // ── Assets estáticos (JS, CSS, imagens) — Cache-first ───────────────────
  if (
    request.destination === 'script'   ||
    request.destination === 'style'    ||
    request.destination === 'image'    ||
    request.destination === 'font'     ||
    request.destination === 'manifest'
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // ── Demais requisições — Network com fallback no cache ───────────────────
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PUSH — notificações futuras (stub preparado)
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Ceará Planejados', {
    body:    data.body    || '',
    icon:    '/icons/icon-192x192.png',
    badge:   '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' },
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
