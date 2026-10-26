/* Linux Gamer Life - offline shell and installability. */
// Bump CACHE when you need to force a fresh offline cache.
const CACHE = "lgl-v2";

const CORE = [
  "/",
  "/index.html",
  "/about.html",
  "/videos.html",
  "/community.html",
  "/projects.html",
  "/toolkit.html",
  "/mysetup.html",
  "/ai.html",
  "/404.html",
  "/manifest.json",
  "/assets/css/site.css",
  "/assets/js/theme.js",
  "/assets/js/nav.js",
  "/assets/js/jokes.js",
  "/assets/js/panels.js",
  "/assets/js/terminal.js",
  "/assets/js/site-terminal.js",
  "/assets/js/site.js",
  "/data/projects.js",
  "/data/supporters.js",
  "/assets/fonts/inter-latin.woff2",
  "/assets/fonts/inter-latin-ext.woff2",
  "/assets/fonts/jetbrains-mono-latin.woff2",
  "/assets/fonts/jetbrains-mono-latin-ext.woff2",
  "/assets/img/logo.svg",
  "/assets/img/logo.png",
  "/assets/img/apple-touch-icon.png",
  "/assets/img/icon-192.png",
  "/assets/img/icon-512.png",
  "/assets/img/icon-maskable-192.png",
  "/assets/img/icon-maskable-512.png",
  "/assets/img/videos/solus.jpg",
  "/assets/img/videos/opensuse.jpg",
  "/assets/img/videos/debian.jpg",
  "/assets/img/videos/arch.jpg",
  "/assets/img/videos/void.jpg",
  "/assets/img/videos/nixos.jpg",
  "/assets/img/videos/playtron.jpg",
  "/assets/img/videos/regataos.jpg",
  "/assets/img/videos/bazzite.jpg",
  "/assets/img/videos/pikaos.jpg",
  "/assets/img/videos/garuda.jpg",
  "/assets/img/videos/nobara.jpg",
  "/assets/img/videos/steamos.jpg",
  "/assets/img/videos/cachyos.jpg",
  "/assets/img/videos/ubuntu.jpg",
  "/assets/img/videos/wayland.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/sw.js")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === "navigate") return caches.match("/index.html");
          return Response.error();
        })
      )
  );
});
