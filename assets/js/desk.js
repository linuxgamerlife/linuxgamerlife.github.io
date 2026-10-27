/* Desktop shell: top bar, PC1 rail, dock and side panels.
   The home page ships its own shell markup; every content page is wrapped here
   so the whole site shares the same chrome. */
(function () {
  "use strict";

  var PAGE_META = {
    home: { title: "HOME", path: "~/" },
    projects: { title: "PROJECTS", path: "~/projects" },
    toolkit: { title: "TOOLKIT", path: "~/toolkit" },
    videos: { title: "VIDEOS", path: "~/videos" },
    community: { title: "COMMUNITY", path: "~/community" },
    about: { title: "ABOUT", path: "~/about" },
    mysetup: { title: "SETUP", path: "~/setup" },
    ai: { title: "AI STATEMENT", path: "~/ai" },
    "404": { title: "NOT FOUND", path: "~/404" }
  };

  var PAGES = [
    { page: "home", href: "index.html", label: "home" },
    { page: "projects", href: "projects.html", label: "projects" },
    { page: "toolkit", href: "toolkit.html", label: "toolkit" },
    { page: "videos", href: "videos.html", label: "videos" },
    { page: "mysetup", href: "mysetup.html", label: "setup" },
    { page: "community", href: "community.html", label: "community" },
    { page: "about", href: "about.html", label: "about" },
    { page: "ai", href: "ai.html", label: "ai" }
  ];

  var DOCK = [
    {
      page: "home",
      href: "index.html",
      label: "Home",
      icon: '<path d="m4 7 4 5-4 5"/><path d="M12 17h8"/>'
    },
    {
      page: "videos",
      href: "videos.html",
      label: "Videos",
      icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>'
    },
    {
      page: "projects",
      href: "projects.html",
      label: "Projects",
      icon: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'
    },
    {
      page: "toolkit",
      href: "toolkit.html",
      label: "Toolkit",
      icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
    },
    {
      page: "mysetup",
      href: "mysetup.html",
      label: "Setup",
      icon: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'
    },
    {
      page: "community",
      href: "community.html",
      label: "Community",
      icon: '<path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'
    },
    {
      page: "merch",
      href: "https://merch.linuxgamerlife.net",
      external: true,
      label: "Merch",
      icon: '<path d="M8 4 10 2h4l2 2 4 2-2 5-3-1v11H9V10l-3 1-2-5z"/>'
    },
    {
      page: "ai",
      href: "ai.html",
      label: "AI statement",
      icon: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'
    }
  ];

  function icon(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }

  /* ---------- PC1 rail ---------- */
  function statsMarkup() {
    return '' +
      '<div class="kwe-stats__head"><span>PC1</span><span class="kwe-online">online</span></div>' +
      '<section class="kwe-stat">' +
        '<div class="kwe-stat__label"><span>GPU</span><span>12%</span></div>' +
        '<p class="kwe-stat__name">Radeon RX 9070 XT</p>' +
        '<div class="kwe-bar"><i style="width:12%"></i></div>' +
        '<svg class="kwe-spark" viewBox="0 0 120 20" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,17 8,15 16,16 24,11 32,13 40,9 48,12 56,7 64,10 72,6 80,9 88,5 96,8 104,4 112,7 120,3"/></svg>' +
        '<div class="kwe-stat__meta"><span>52°C</span><span>16 GB</span><span>2.4 GHz</span></div>' +
      '</section>' +
      '<section class="kwe-stat">' +
        '<div class="kwe-stat__label"><span>CPU</span><span>8%</span></div>' +
        '<p class="kwe-stat__name">Ryzen 9 9950X3D</p>' +
        '<div class="kwe-bar"><i style="width:8%"></i></div>' +
        '<svg class="kwe-spark" viewBox="0 0 120 20" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,16 8,14 16,15 24,9 32,12 40,8 48,11 56,6 64,9 72,5 80,8 88,4 96,7 104,3 112,6 120,2"/></svg>' +
        '<div class="kwe-stat__meta"><span>47°C</span><span>16C / 32T</span><span>5.7 GHz</span></div>' +
      '</section>' +
      '<section class="kwe-stat">' +
        '<div class="kwe-stat__label"><span>RAM</span><span data-stat="ramPct">29%</span></div>' +
        '<p class="kwe-stat__name" data-stat="ram">17.4 / 60 GB</p>' +
        '<div class="kwe-bar"><i data-stat-ram-bar style="width:29%"></i></div>' +
        '<div class="kwe-stat__meta"><span>DDR5</span><span>6000 MT/s</span></div>' +
      '</section>' +
      '<section class="kwe-stat">' +
        '<div class="kwe-stat__label"><span>DISKS</span><span data-stat-disk-count>3</span></div>' +
        '<div data-stat-disks>' +
          '<div class="kwe-disk"><span>SN850X 4TB</span><span>94%</span></div>' +
          '<div class="kwe-bar kwe-bar--disk"><i style="width:94%"></i></div>' +
          '<div class="kwe-disk"><span>P310 2TB</span><span>67%</span></div>' +
          '<div class="kwe-bar kwe-bar--disk"><i style="width:67%"></i></div>' +
          '<div class="kwe-disk"><span>SN850X 1TB</span><span>37%</span></div>' +
          '<div class="kwe-bar kwe-bar--disk"><i style="width:37%"></i></div>' +
        '</div>' +
      '</section>' +
      '<div class="kwe-stats__foot"><span>uptime <span data-stat="uptime">4d 12h</span></span><span>kernel <span data-stat="kernelShort" title="7.2.11-200.fc44.x86_64">7.2.11</span></span></div>';
  }

  /* ---------- Top bar ---------- */
  function topnavMarkup(currentPage) {
    var links = ['home', 'about', 'videos', 'community'].map(function (name) {
      var href = name === 'home' ? 'index.html' : (name === 'about' ? 'about.html' : name + '.html');
      var current = name === currentPage ? ' aria-current="page"' : '';
      return '<a href="' + href + '"' + current + '>' + name.charAt(0).toUpperCase() + name.slice(1) + '</a>';
    }).join('');
    links += '<a href="https://merch.linuxgamerlife.net" target="_blank" rel="noopener">Merch</a>';
    return '<nav class="kwe-topnav" aria-label="Top bar shortcuts">' + links + '</nav>';
  }

  function topbarMarkup(currentPage) {
    return '' +
      '<div class="kwe-topbar__status">' +
        '<span>CPU 3%</span>' +
        '<span>GPU 12%</span>' +
        '<span>62°C</span>' +
      '</div>' +
      topnavMarkup(currentPage) +
      '<div class="kwe-topbar__right">' +
        '<span data-stat="osShort">Fedora 44</span>' +
        '<span class="kwe-brand-case">KineticWE</span>' +
        '<span id="kwe-clock">12:53 · Tue 27 Oct</span>' +
      '</div>';
  }

  /* ---------- Side panels ---------- */
  function nowMarkup() {
    return '' +
      '<div class="kwe-window__bar">' +
        '<span class="kwe-window__title"><span class="kwe-win-icon" aria-hidden="true">●</span> LGL://NOW</span>' +
        '<span class="kwe-now__live">live</span>' +
      '</div>' +
      '<div class="kwe-now__body">' +
        '<div class="kwe-now__row"><span>PC1</span><span class="kwe-now__ok">online</span></div>' +
        '<div class="kwe-now__row"><span>Session</span><span>KineticWE · Wayland</span></div>' +
        '<div class="kwe-now__row"><span>Setup</span><span>PC1 · PC2 · NSM · Mac mini</span></div>' +
        '<div class="kwe-now__row"><span>Toolkit</span><span>8 apps, one Copr repo</span></div>' +
      '</div>';
  }

  function pagesMarkup(currentPage) {
    var links = PAGES.map(function (item) {
      var current = item.page === currentPage ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + current + '><span>' + item.label + "</span></a>";
    }).join("");
    return '' +
      '<div class="kwe-window__bar">' +
        '<span class="kwe-window__title"><span class="kwe-win-icon" aria-hidden="true">//</span> LGL://PAGES</span>' +
      '</div>' +
      '<nav class="kwe-pages__list" aria-label="Site pages">' + links + "</nav>";
  }

  /* ---------- Dock ---------- */
  function dockMarkup(currentPage) {
    return DOCK.map(function (item) {
      var current = item.page === currentPage ? ' aria-current="page"' : "";
      var external = item.external ? ' target="_blank" rel="noopener"' : "";
      return '<a class="kwe-dock__item" href="' + item.href + '" title="' + item.label + '" aria-label="' + item.label + '"' + external + current + ">" + icon(item.icon) + "</a>";
    }).join("");
  }

  /* ---------- Build ---------- */
  function buildShell(main, page) {
    var meta = PAGE_META[page] || { title: page.toUpperCase(), path: "~/" + page };
    document.body.classList.add("has-desk");

    var desk = document.createElement("div");
    desk.className = "kwe-desk";
    desk.innerHTML = '' +
      '<div class="kwe-topbar">' + topbarMarkup(page) + '</div>' +
      '<div class="kwe-grid">' +
        '<aside class="kwe-stats" aria-label="PC1 system status">' + statsMarkup() + '</aside>' +
        '<div class="kwe-main"></div>' +
        '<aside class="kwe-side">' +
          '<section class="kwe-window kwe-now" aria-label="Linux Gamer Life now">' + nowMarkup() + '</section>' +
          '<section class="kwe-window kwe-pages" aria-label="Site pages">' + pagesMarkup(page) + '</section>' +
        '</aside>' +
      '</div>';

    main.parentNode.insertBefore(desk, main);

    var win = document.createElement("section");
    win.className = "kwe-window kwe-page";
    win.innerHTML = '' +
      '<div class="kwe-window__bar">' +
        '<span class="kwe-win-title"><span class="kwe-win-icon" aria-hidden="true">&gt;_</span> LGL://' + meta.title + '</span>' +
        '<span class="kwe-win-meta">' + meta.path + ' · <span id="tty-theme">forest</span></span>' +
      '</div>';

    var mainCol = desk.querySelector(".kwe-main");
    win.appendChild(main);
    mainCol.appendChild(win);

    var dock = document.createElement("nav");
    dock.className = "kwe-dock";
    dock.setAttribute("aria-label", "Quick launch");
    dock.innerHTML = dockMarkup(page);
    mainCol.appendChild(dock);
  }

  /* ---------- Stats, theme label and clock ---------- */
  function paintStats() {
    var stats = window.LGL_STATS;
    if (!stats) return;

    document.querySelectorAll("[data-stat]").forEach(function (el) {
      var key = el.getAttribute("data-stat");
      if (stats[key] == null) return;
      el.textContent = key === "ramPct" ? stats[key] + "%" : stats[key];
      if (key === "kernelShort" && stats.kernel) el.title = stats.kernel;
    });

    var diskWrap = document.querySelector("[data-stat-disks]");
    if (diskWrap && Array.isArray(stats.disks)) {
      diskWrap.replaceChildren();
      stats.disks.forEach(function (disk) {
        var row = document.createElement("div");
        row.className = "kwe-disk";
        var label = document.createElement("span");
        label.textContent = disk.label;
        var pct = document.createElement("span");
        pct.textContent = disk.pct + "%";
        row.appendChild(label);
        row.appendChild(pct);
        diskWrap.appendChild(row);

        var bar = document.createElement("div");
        bar.className = "kwe-bar kwe-bar--disk";
        var fill = document.createElement("i");
        fill.style.width = Math.max(0, Math.min(100, Number(disk.pct) || 0)) + "%";
        bar.appendChild(fill);
        diskWrap.appendChild(bar);
      });
      var diskCount = document.querySelector("[data-stat-disk-count]");
      if (diskCount) diskCount.textContent = stats.disks.length;
    }

    var ramBar = document.querySelector("[data-stat-ram-bar]");
    if (ramBar && stats.ramPct != null) {
      ramBar.style.width = Math.max(0, Math.min(100, Number(stats.ramPct) || 0)) + "%";
    }
  }

  function startClock() {
    var clock = document.getElementById("kwe-clock");
    if (!clock) return;
    var tick = function () {
      var now = new Date();
      clock.textContent = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
        " · " + now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
    };
    tick();
    window.setInterval(tick, 30000);
  }

  function setThemeLabel() {
    var label = document.getElementById("tty-theme");
    if (!label) return;
    label.textContent = window.LGLTheme ? window.LGLTheme.current() : "forest";
  }

  var page = document.body.dataset.page || "";
  var main = document.getElementById("main");

  if (main && !document.querySelector(".kwe-desk")) {
    buildShell(main, page);
  }

  setThemeLabel();
  paintStats();
  window.addEventListener("load", function () {
    setThemeLabel();
    paintStats();
  });
  startClock();
})();
