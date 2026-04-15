const CACHE = 'tfw-v1'

// Assets to precache on install
const PRECACHE = ['/']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Remove old caches
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Never intercept API routes — always go to network
  if (url.pathname.startsWith('/api/')) return

  // Network-first for navigation (HTML pages) so content stays fresh
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(request, clone))
          return res
        })
        .catch(() => caches.match(request).then((cached) => cached ?? caches.match('/')))
    )
    return
  }

  // Cache-first for static assets (_next/static, fonts, icons, etc.)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/fonts/') ||
    /\.(svg|png|jpg|ico|woff2?)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((res) => {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(request, clone))
            return res
          })
      )
    )
    return
  }
})
