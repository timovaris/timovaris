// Tämä on esimerkki palvelutyöntekijästä
const CACHE_NAME = 'v2';
const urlsToCache = [
  './',
  './index.html',
  './kello.png',
  './pikachu.gif',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics
  if (event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('mitatanaanliputetaan.vercel.app')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then(
            response => {
              // Don't cache API calls
              if (event.request.url.includes('mitatanaanliputetaan.vercel.app')) {
                return response;
              }
              
              // Clone the response
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            }
          );
        })
    );
  }
});
