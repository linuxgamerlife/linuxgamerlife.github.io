# linuxgamerlife.github.io

The Linux Gamer Life website: a static, no-build site for GitHub Pages.

Live at **https://linuxgamerlife.github.io** (eventually `linuxgamerlife.net`).

## What is in here

| Path | What it does |
| --- | --- |
| `index.html` | Home: hero, goals, featured apps, toolkit and community calls to action |
| `projects.html` | All projects, filterable by category, with GitHub and Copr links |
| `toolkit.html` | LGL Toolkit install guide, per-app commands and copy buttons |
| `videos.html` | The seven video series |
| `community.html` | Social links and the supporter roll |
| `about.html` | Story, AI use statement, disclaimer, contact |
| `404.html` | Not-found page |
| `assets/css/site.css` | The whole design system (tokens at the top) |
| `assets/js/site.js` | Nav, copy buttons, reveal animations, project and supporter rendering |
| `data/projects.json` | Generated project snapshot. **Do not edit by hand.** |
| `data/projects.js` | The same snapshot as a script, so the site also works from `file://` |
| `data/curation.json` | Hand-written titles, descriptions, categories and tags |
| `data/supporters.js` | Supporter export used by the overlay and the community page |
| `scripts/fetch_projects.py` | Rebuilds `data/projects.json` from GitHub + Copr |
| `.github/workflows/` | Nightly data refresh and GitHub Pages deployment |

There is no framework, no package manager and no build step. HTML, one CSS file,
one JS file, plus JSON.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765>. Opening `index.html` directly from the file manager
works too: project data is loaded through `data/projects.js` rather than a JSON fetch.

## Editing content

- **Page copy**: edit the HTML directly.
- **Colours, spacing, type**: the `:root` block at the top of `assets/css/site.css`.
  The palette is built around `--accent: #d05eac` (the overlay magenta) and
  `--accent-2: #9a6bff` (violet).
- **Project descriptions, tags, categories, featured order**: `data/curation.json`.
  Categories are `apps`, `setup`, `desktop` and `experiments`.

After changing `data/curation.json`, regenerate the snapshot:

```bash
python3 scripts/fetch_projects.py
```

The script needs no dependencies. Set `GH_TOKEN` or `GITHUB_TOKEN` to avoid
GitHub's unauthenticated rate limit. It also writes the counts used by the
home-page stats.

### Pulling in a new repository

Add an entry to `data/curation.json`, run the script, commit both files. If the
repository is packaged, include the Copr reference:

```json
"copr": { "project": "linuxgamerlife/lgl-toolkit", "package": "lgl-example" }
```

### Updating the supporter roll

The community page reads `data/supporters.js`, which is the same file the stream
overlay uses. Copy the regenerated file over:

```bash
cp "/mnt/nas_media/Members and Subs/overlay-data.js" data/supporters.js
```

Names are displayed exactly as they appear in the export. The list is public in
this repository, just as it is in the existing Google Sites embed.

## Deploying to GitHub Pages

1. Create a **public** repository named `linuxgamerlife.github.io`.
2. Push this directory to its `main` branch.
3. In the repository, open **Settings → Pages** and set **Source** to
   **GitHub Actions**.
4. The `Deploy to GitHub Pages` workflow publishes on every push. The first run
   creates the site at `https://linuxgamerlife.github.io`.

The nightly `Refresh project data` workflow commits a new `data/projects.json`
when repositories or Copr projects change, which then triggers a deploy.

### Moving to linuxgamerlife.net later

1. Add a file named `CNAME` containing `linuxgamerlife.net`.
2. At the DNS provider, point the apex at GitHub Pages:
   `A 185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and `CNAME www → linuxgamerlife.github.io`.
3. Replace `https://linuxgamerlife.github.io` with `https://linuxgamerlife.net`
   in the `<link rel="canonical">`, Open Graph and Twitter tags of every page,
   plus `sitemap.xml` and `robots.txt`.
4. Enable **Enforce HTTPS** in the Pages settings once the certificate is issued.

Keep the Google Site published until the new one is verified. DNS can take a day
to settle.

## Credits

Design and content © Linux Gamer Life. Code is MIT licensed (see `LICENSE`).
Supporter names remain the property of their respective owners.
