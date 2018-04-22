'use strict';

var config = {
  version: '1',
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
	"./image/logo.jpg",
	"./manifest.json"
  ],
  offlinePage: '/offline/'
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

/*function offlineResponse (resourceType, opts) {
  if (resourceType === 'image') {
    return new Response(opts.offlineImage,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  } else if (resourceType === 'content') {
    return caches.match(opts.offlinePage);
  }
  return undefined;
}*/

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

  function shouldHandleFetch (event, opts) {
    var request            = event.request;
    var url                = new URL(request.url);
    var criteria           = {
      matchesPathPattern: opts.cachePathPattern.test(url.pathname),
      isGETRequest      : request.method === 'GET',
      isFromMyOrigin    : url.origin === self.location.origin
    };
    var failingCriteria    = Object.keys(criteria)
      .filter(criteriaKey => !criteria[criteriaKey]);
    return !failingCriteria.length;
  }

  function onFetch (event, opts) {
    var request = event.request;
    var acceptHeader = request.headers.get('Accept');
    var resourceType = 'static';
    var cacheKey;

   /* if (acceptHeader.indexOf('text/html') !== -1) {
      resourceType = 'content';
    } else if (acceptHeader.indexOf('image') !== -1) {
      resourceType = 'image';
    }*/

    cacheKey = cacheName(resourceType, opts);

    /*if (resourceType === 'content') {
      event.respondWith(
        fetch(request)
          .then(response => addToCache(cacheKey, request, response))
          .catch(() => fetchFromCache(event))
          .catch(() => offlineResponse(resourceType, opts))
      );
    } else {
      event.respondWith(
        fetchFromCache(event)
          .catch(() => fetch(request))
            .then(response => addToCache(cacheKey, request, response))
          .catch(() => offlineResponse(resourceType, opts))
      );
    }*/
  }
  //if (shouldHandleFetch(event, config)) {
    onFetch(event, config);
  //}

});
