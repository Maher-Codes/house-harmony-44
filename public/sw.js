const CACHE_NAME = 'househub-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Push notification handler
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'HouseHub';
  const options = {
    body:    data.body  || "It's your turn!",
    icon:    '/icons/icon-192x192.png',
    badge:   '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' },
    actions: [
      { action: 'open', title: '📱 Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});
