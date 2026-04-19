const CACHE_NAME = 'sbo-cache-v1';

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - claim control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch event - pure pass-through for PWA installability requirements
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request).catch(() => {
       return new Response('Network error occurred.', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
       });
    })
  );
});
