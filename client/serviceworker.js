const CACHE_NAME = "hiit-v1";

self.addEventListener("fetch", e => {
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
        e.respondWith(networkThenCache(e.request));
    }
});

/**
 * Employs the network-fallback-to-cache strategy to fetch the response to a request.
 * @param {Request} request 
 * @returns {Response}
 */
async function networkThenCache(request) {
    // Ask the network first, then hit the cache if we're offline.
    const cache = await caches.open(CACHE_NAME);
    let response;
    try {
        response = await fetch(request);
        cache.put(request, response.clone());
    } catch (_error) {
        response = await cache.match(request);
    }
    return response;
}
