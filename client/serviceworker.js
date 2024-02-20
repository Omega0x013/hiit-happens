const CACHE_NAME = "hiit-v1";

self.addEventListener("fetch", async e => {
    if (e.request.url.match(/^\/api\//g)) {
        // handle the /api/ route specifically
        switch (e.request.method) {
            case "PUT":
            case "GET":
            case "PATCH":
            case "DELETE":
                return;
        }
    } else {
        e.respondWith(staleWhileRevalidate(e.request));
    }
});

/**
 * Return the cached response and update on the network if possible
 * @param {Request} req 
 */
async function staleWhileRevalidate(req) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(req);

    // save the network response; intentionally do nothing on error
    let networkResponse;
    try {
        networkResponse = await fetch(req);
        cache.put(req, networkResponse);
    } finally {
        // we don't care about the error
        return cachedResponse || networkResponse;
    }
}
