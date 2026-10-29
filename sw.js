/* Linux Gamer Life - offline shell and installability. */
// Bump CACHE when you need to force a fresh offline cache.
const CACHE = "lgl-v29";

const CORE = [
  "/",
  "/index.html",
  "/about.html",
  "/videos.html",
  "/community.html",
  "/projects.html",
  "/toolkit.html",
  "/launchcommands.html",
  "/mysetup.html",
  "/ai.html",
  "/404.html",
  "/manifest.json",
  "/assets/css/site.css",
  "/assets/css/desk.css",
  "/assets/css/launch-options.css",
  "/assets/js/theme.js",
  "/assets/js/desk.js",
  "/assets/js/nav.js",
  "/assets/js/jokes.js",
  "/assets/js/launch-options.js",
  "/assets/js/panels.js",
  "/assets/js/terminal.js",
  "/assets/js/site-terminal.js",
  "/assets/js/site.js",
  "/data/projects.js",
  "/data/stats.js",
  "/data/launch-options.js",
  "/data/supporters.js",
  "/assets/fonts/inter-latin.woff2",
  "/assets/fonts/inter-latin-ext.woff2",
  "/assets/fonts/jetbrains-mono-latin.woff2",
  "/assets/fonts/jetbrains-mono-latin-ext.woff2",
  "/assets/theme/monochrome/logo.svg",
  "/assets/theme/monochrome/logo.png",
  "/assets/theme/monochrome/apple-touch-icon.png",
  "/assets/theme/harry-green/logo.svg",
  "/assets/theme/harry-green/logo.png",
  "/assets/theme/harry-green/apple-touch-icon.png",
  "/assets/theme/light-pink/logo.svg",
  "/assets/theme/light-pink/logo.png",
  "/assets/theme/light-pink/apple-touch-icon.png",
  "/assets/theme/deep-blue/logo.svg",
  "/assets/theme/deep-blue/logo.png",
  "/assets/theme/deep-blue/apple-touch-icon.png",
  "/assets/theme/deep-purple/logo.svg",
  "/assets/theme/deep-purple/logo.png",
  "/assets/theme/deep-purple/apple-touch-icon.png",
  "/assets/theme/gruvbox/logo.svg",
  "/assets/theme/gruvbox/logo.png",
  "/assets/theme/gruvbox/apple-touch-icon.png",
  "/assets/theme/tokyo/logo.svg",
  "/assets/theme/tokyo/logo.png",
  "/assets/theme/tokyo/apple-touch-icon.png",
  "/assets/theme/nord/logo.svg",
  "/assets/theme/nord/logo.png",
  "/assets/theme/nord/apple-touch-icon.png",
  "/assets/theme/mocha/logo.svg",
  "/assets/theme/mocha/logo.png",
  "/assets/theme/mocha/apple-touch-icon.png",
  "/assets/theme/dracula/logo.svg",
  "/assets/theme/dracula/logo.png",
  "/assets/theme/dracula/apple-touch-icon.png",
  "/assets/theme/everforest/logo.svg",
  "/assets/theme/everforest/logo.png",
  "/assets/theme/everforest/apple-touch-icon.png",
  "/assets/theme/kanagawa/logo.svg",
  "/assets/theme/kanagawa/logo.png",
  "/assets/theme/kanagawa/apple-touch-icon.png",
  "/assets/theme/rosepine/logo.svg",
  "/assets/theme/rosepine/logo.png",
  "/assets/theme/rosepine/apple-touch-icon.png",
  "/assets/theme/solarized/logo.svg",
  "/assets/theme/solarized/logo.png",
  "/assets/theme/solarized/apple-touch-icon.png",
  "/assets/theme/onedark/logo.svg",
  "/assets/theme/onedark/logo.png",
  "/assets/theme/onedark/apple-touch-icon.png",
  "/assets/theme/monokai/logo.svg",
  "/assets/theme/monokai/logo.png",
  "/assets/theme/monokai/apple-touch-icon.png",
  "/assets/theme/halloween/logo.svg",
  "/assets/theme/halloween/logo.png",
  "/assets/theme/halloween/apple-touch-icon.png",
  "/assets/theme/cream/logo.svg",
  "/assets/theme/cream/logo.png",
  "/assets/theme/cream/apple-touch-icon.png",
  "/assets/theme/gold/logo.svg",
  "/assets/theme/gold/logo.png",
  "/assets/theme/gold/apple-touch-icon.png",
  "/assets/img/logo.svg",
  "/assets/img/logo.png",
  "/assets/img/apple-touch-icon.png",
  "/assets/img/icon-192.png",
  "/assets/img/icon-512.png",
  "/assets/img/icon-maskable-192.png",
  "/assets/img/icon-maskable-512.png",
  "/assets/img/merch/fork-it-and-fix-it.png",
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
