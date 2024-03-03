self.addEventListener('fetch', (event) => {
  /**
   * @type {Request}
   */
  const req = event.request
  const url = new URL(req.url)
  if (url.pathname === '/mirror') {
    event.respondWith((async () => {
      return await fetch(url.searchParams.get('xpi'))
    })())
    return
  } else {
    event.respondWith(fetch(req))
    return
  }
})
