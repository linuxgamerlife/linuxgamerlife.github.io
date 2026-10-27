# linuxgamerlife.github.io

Source for the Linux Gamer Life website, published with GitHub Pages at
https://linuxgamerlife.github.io.

Plain HTML, CSS and JavaScript with no build step. Project data is generated
from GitHub and Copr.

Content and design © Linux Gamer Life. Code is MIT licensed.

## Web app

The site includes `manifest.json`, `sw.js` and app icons so it can be installed
as a web app. Install from https://linuxgamerlife.net/ over HTTPS.

Bump `CACHE` in `sw.js` if you need to force a fresh offline cache after a major
asset change.

## Desktop shell

`assets/css/desk.css` and `assets/js/desk.js` provide the shared desktop
chrome: the top bar, PC1 stats rail, floating dock and side panels. The home
page ships its own shell markup; every other page is wrapped automatically by
`desk.js` around its `<main>`, so new pages only need the two includes.

## Home stats

Run `python3 scripts/update_stats.py` on the machine whose stats you want to
show. It refreshes `data/stats.js` (OS, kernel, uptime, RAM and disk usage).
The GPU/CPU graphs are intentionally static.
