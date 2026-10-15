const C='fmea-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);const same=u.origin===location.origin;
 if(same&&(r.mode==='navigate'||u.pathname.endsWith('.html'))){e.respondWith((async()=>{const k=await caches.open(C);
  try{const x=await fetch(r);if(x.ok){k.put(r,x.clone());if(/\/app\d*\.html$/.test(u.pathname))k.put('__last',new Response(u.pathname.split('/').pop()))}return x}
  catch(err){if(/\/ir\.html$/.test(u.pathname)){const l=await k.match('__last');if(l)return Response.redirect(new URL((await l.text())+u.search,u).href,302)}
   return (await k.match(r,{ignoreSearch:true}))||Response.error()}})());return}
 if(!same||u.pathname.endsWith('.glb')){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x.ok||x.type==='opaque')caches.open(C).then(k=>k.put(r,x.clone()));return x})));return}
 e.respondWith((async()=>{const k=await caches.open(C);const h=await k.match(r);const n=fetch(r).then(x=>{if(x.ok)k.put(r,x.clone());return x}).catch(()=>h);return h||n})())});
