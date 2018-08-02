/** The name of the cache */
const CACHE = 'restaurant-reviews';
/** Resources to precache */
const urlsToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/dbhelper.js'
];

/**
 * Precache resources on SW install
 */
self.addEventListener('install', function(event) {
    console.log('The service worker is being installed.');

    //Ask the service worker to keep installing until the returning promise resolves.
    event.waitUntil(precache());
});

/**
 * Use cache first, then update the cache.
 */
self.addEventListener('fetch', function(event) {
    // Try to respondWith from cache...
    event.respondWith(fromCache(event.request));

    //...and waitUntil() to prevent the worker from being killed until the cache is updated.
    event.waitUntil(update(event.request));
});

/**
 * Open cache and add resourses to the cache
 * @returns {Promise} Promise resolves with empty void
 */
function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll(urlsToCache);
    });
}

/**
 * Open the cache and search for resourses. If nothing found fetch from the network.
 * @param {Request} request - A Request object
 * @returns {Promise} The result of cache search or network fetch.
 */
function fromCache(request) {
    return caches.open(CACHE)
        .then(function (cache) {
            return cache.match(request)
                .then(function (matching) {
                    return matching || fetch(request);
        });
    });
}

/**
 * Open the cache and update resources in the cache
 * @param {Request} request - A Request object
 * @returns {Response} - A Response object
 */
function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}

