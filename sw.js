const CACHE='eiken4-listening-v7';
const ASSETS=['./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([
  self.clients.claim(),
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
])));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.mode==='navigate' || new URL(req.url).pathname.endsWith('/index.html')){
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(cache=>cache.put(req,c));return r}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{const c=resp.clone();caches.open(CACHE).then(cache=>cache.put(req,c));return resp})));
});
