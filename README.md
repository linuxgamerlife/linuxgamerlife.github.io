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

## Projects

The projects page is generated, not edited by hand. Add or update the copy in
`data/curation.json`, then run:

```bash
python3 scripts/fetch_projects.py
```

That refreshes GitHub stars, Copr packages and `data/projects.json` /
`data/projects.js`. A new public repository still needs a curation entry; the
nightly `Refresh project data` workflow updates metrics but does not invent
titles or descriptions.

## App windows

Terminal apps open as floating windows. Drag a window by its title bar, resize it
from the bottom-right corner, and open several at once. Click a window to bring it
to the front; Escape or the close button closes the focused window. On phones and
narrow screens the windows fill the viewport.

## Home stats

Run `python3 scripts/update_stats.py` on the machine whose stats you want to
show. It refreshes `data/stats.js` (OS, kernel, uptime, RAM and disk usage).
The GPU/CPU graphs are intentionally static.
