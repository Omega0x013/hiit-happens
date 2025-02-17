const CACHE_NAME = 'v1';
const CACHE_PATHS = [
  '/components/EditDialog.mjs',
  '/components/ExerciseLi.mjs',
  '/components/exercise.json',
  '/components/TimerDialog.mjs',
  '/components/WorkoutTile.mjs',
  '/app.webmanifest',
  '/icon.png',
  '/index.html',
  '/script.mjs',
  '/serviceworker.js',
  '/style.css',
  '/',
];

// Use the stale-while-revalidate strategy
self.addEventListener('fetch', event => event.respondWith(staleWhileRevalidate(event.request)));

/**
 * @param {Request} request
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Avoid a try-catch block using the catch promise method
  const networkResponse = await fetch(request).catch(() =>
    new Response('Request Timeout', { status: 408, headers: { 'Content-Type': 'text/plain' } }),
  );

  // Cache the response to be used next time
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
  }

  return cachedResponse || networkResponse;
}

self.addEventListener('install', event => event.waitUntil(precacheResources(CACHE_PATHS)));

async function precacheResources(paths) {
  const cache = await caches.open(CACHE_NAME);
  cache.addAll(paths);
}
