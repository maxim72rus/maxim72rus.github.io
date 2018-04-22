'use strict';

var config = {
  version: '0.9',
  staticCacheItems: [
    "./",
	"./index.html",
	"./html/aut.html",
	"./html/calendar.html",
	"./html/calendar-add-event.html",
	"./html/calendar-day.html",
	"./html/doc-info.html",
	"./html/docs.html",
	"./js/aut.js",
	"./js/calendar.js",
	"./js/calendar-add-event.js",
	"./js/calendar-day.js",
	"./js/classes.js",
	"./js/doc-info.js",
	"./js/docs.js",
	"./js/jQuery mobile min.js",
	"./js/jQuery v3.3.1.js",
	"./js/main.js",
	"./js/menu.js",	
	"./css/styles.css",
	"./manifest.json",
	"./image/logo.jpg"
  ]
};

function cacheName (key, opts) {
  return `${opts.version}-${key}`;
}

function addToCache (cacheKey, request, response) {
  if (response.ok) {
    var copy = response.clone();
    caches.open(cacheKey).then( cache => {
      cache.put(request, copy);
    });
  }
  return response;
}

function fetchFromCache (event) {
  return caches.match(event.request).then(response => {
    if (!response) {
      throw Error(`${event.request.url} not found in cache`);
    }
    return response;
  });
}

self.addEventListener('install', event => {
  function onInstall (event, opts) {
    var cacheKey = cacheName('static', opts);
    return caches.open(cacheKey)
      .then(cache => cache.addAll(opts.staticCacheItems));
  }

  event.waitUntil(
    onInstall(event, config).then( () => self.skipWaiting() )
  );
});

self.addEventListener('activate', event => {
  function onActivate (event, opts) {
    return caches.keys()
      .then(cacheKeys => {
        var oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
        var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
        return Promise.all(deletePromises);
      });
  }

  event.waitUntil(
    onActivate(event, config)
      .then( () => self.clients.claim() )
  );
});

self.addEventListener('fetch', event => {
  function onFetch (event, opts) {
    var request = event.request;
    var acceptHeader = request.headers.get('Accept');
    var resourceType = 'static';
    var cacheKey;

    cacheKey = cacheName(resourceType, opts);
  }
  
  onFetch(event, config);
});