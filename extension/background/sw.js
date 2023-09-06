self.addEventListener("fetch", function(event) {
  event.respondWith(
    new Response("Hello world", {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "text/plain"
      }
    })
  )
})
