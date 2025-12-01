// QRyptshare Service Worker
// This service worker provides basic offline support

const CACHE_NAME = 'qryptshare-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let all requests go through to the network
  event.respondWith(fetch(event.request));
});
