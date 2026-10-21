/* Linux Gamer Life shared site behaviour */
(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  /* ---------- Mark the current page in the nav ---------- */
  var page = document.body.dataset.page;
  if (page) {
    var link = document.querySelector('.nav__links a[data-nav="' + page + '"]');
    if (link) link.setAttribute("aria-current", "page");
  }

  /* ---------- Copy to clipboard ---------- */
  function copyText(text, button) {
    var done = function () {
      var label = button.querySelector(".copy-btn__label");
      if (!label) return;
      var original = label.textContent;
      label.textContent = "Copied";
      button.classList.add("is-copied");
      setTimeout(function () {
        label.textContent = original;
        button.classList.remove("is-copied");
      }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
    } else {
      fallback(text, done);
    }
  }
  function fallback(text, done) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); done(); } catch (error) { /* no-op */ }
    document.body.removeChild(area);
  }
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var selector = button.getAttribute("data-copy");
      var source = selector ? document.querySelector(selector) : null;
      var text = source ? source.textContent.trim() : button.getAttribute("data-copy-text");
      if (text) copyText(text, button);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) { item.classList.add("is-in"); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealItems.forEach(function (item) { observer.observe(item); });
    }
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- Project stats ---------- */
  function updateStats(meta) {
    if (!meta) return;
    var values = {
      repos: meta.repos,
      copr_projects: meta.copr_projects,
      apps_packaged: meta.apps_packaged,
      stars: meta.stars
    };
    Object.keys(values).forEach(function (key) {
      if (!values[key] && values[key] !== 0) return;
      document.querySelectorAll('[data-stat="' + key + '"]').forEach(function (node) {
        node.textContent = values[key];
      });
    });
  }
  if (window.LGL_PROJECTS) updateStats(window.LGL_PROJECTS.meta);

  /* ---------- Project catalogue ---------- */
  var grid = document.getElementById("projects-grid");
  if (grid) {
    var filters = document.querySelectorAll("[data-filter]");
    var count = document.getElementById("projects-count");
    var all = [];

    var ICONS = {
      apps: '<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 9h16"/><path d="M8 6.5h.01M11 6.5h.01"/>',
      setup: '<path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M5 21h14"/>',
      desktop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
      experiments: '<path d="M9 3h6"/><path d="M10 3v5L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-11V3"/><path d="M7.5 15h9"/>'
    };
    function svg(paths) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
    }

    function render() {
      var active = document.querySelector('[data-filter][aria-pressed="true"]');
      var filter = active ? active.getAttribute("data-filter") : "all";
      var shown = all.filter(function (project) {
        return filter === "all" || project.category === filter;
      });
      grid.innerHTML = shown.map(function (project) {
        var repo = project.repo ? '<a class="project__link" href="https://github.com/linuxgamerlife/' + project.repo + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-1.9c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"/></svg>GitHub</a>' : "";
        var copr = project.copr ? '<a class="project__link" href="https://copr.fedorainfracloud.org/coprs/' + project.copr.project + '/" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m7.5 4.2 9 5.2"/></svg>Copr</a>' : "";
        var stars = project.stars ? '<span class="project__stars">' + svg('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>') + project.stars + "</span>" : "";
        return '<article class="project reveal is-in">' +
          '<div class="project__top"><span class="project__icon">' + svg(ICONS[project.category] || ICONS.experiments) + "</span>" +
          '<h3 class="project__name">' + esc(project.title) + "</h3>" + stars + "</div>" +
          '<p class="project__desc">' + esc(project.blurb) + "</p>" +
          '<div class="project__meta">' + project.tags.map(function (tag) { return '<span class="tag">' + esc(tag) + "</span>"; }).join("") + "</div>" +
          '<div class="project__links">' + repo + copr + "</div></article>";
      }).join("");
      if (count) count.textContent = shown.length + (shown.length === 1 ? " project" : " projects");
      if (!shown.length) grid.innerHTML = '<p class="projects-empty">Nothing in this category yet.</p>';
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        filters.forEach(function (other) { other.setAttribute("aria-pressed", "false"); });
        button.setAttribute("aria-pressed", "true");
        render();
      });
    });

    function applyProjects(data) {
      all = (data && data.projects) || [];
      updateStats(data && data.meta);
      render();
    }

    if (window.LGL_PROJECTS) {
      applyProjects(window.LGL_PROJECTS);
    } else {
      fetch("data/projects.json")
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .then(applyProjects)
        .catch(function () {
          grid.innerHTML = '<p class="projects-empty">The project list could not be loaded. Browse everything on <a class="link-arrow" href="https://github.com/linuxgamerlife" target="_blank" rel="noopener">GitHub</a>.</p>';
        });
    }
  }

  /* ---------- Supporters ---------- */
  var wall = document.getElementById("supporters");
  if (wall && window.OVERLAY_DATA) {
    var people = [];
    (window.OVERLAY_DATA.youtube || []).forEach(function (row) {
      people.push({ name: row[0], tier: row[1], tenure: row[2], platform: "YouTube" });
    });
    (window.OVERLAY_DATA.twitch || []).forEach(function (row) {
      people.push({ name: row[0], tier: row[1], tenure: row[2], platform: "Twitch" });
    });

    var groups = [
      { platform: "Twitch", tiers: ["Tier 3"], title: "Twitch Tier 3" },
      { platform: "Twitch", tiers: ["Tier 2"], title: "Twitch Tier 2" },
      { platform: "YouTube", tiers: ["Channel Superstar"], title: "Channel Superstars" },
      { platform: "YouTube", tiers: ["Channel Hero"], title: "Channel Heroes" },
      { platform: "Twitch", tiers: ["Tier 1"], title: "Twitch Tier 1" },
      { platform: "YouTube", tiers: ["Channel Supporter"], title: "Channel Supporters" }
    ];

    function tenure(person) {
      if (person.tenure == null) return "";
      if (person.platform === "YouTube" && person.tenure < 1) {
        var days = Math.max(1, Math.round(person.tenure * 30.44));
        return days + (days === 1 ? " day" : " days");
      }
      var months = Math.max(1, Math.round(person.tenure));
      return months + (months === 1 ? " month" : " months");
    }

    var html = groups.map(function (group) {
      var members = people.filter(function (person) {
        return person.platform === group.platform && group.tiers.indexOf(person.tier) !== -1;
      }).sort(function (a, b) { return b.tenure - a.tenure || a.name.localeCompare(b.name); });
      if (!members.length) return "";
      return '<section class="supporter-group">' +
        '<div class="supporter-group__head"><span class="supporter-platform supporter-platform--' + (group.platform === "YouTube" ? "yt" : "tw") + '">' + group.platform + "</span>" +
        "<h3>" + group.title + '</h3><span class="line"></span><span class="supporter-group__count">' + members.length + "</span></div>" +
        '<div class="supporters">' + members.map(function (person) {
          return '<div class="supporter"><span class="supporter__name">' + esc(person.name) + '</span><span class="supporter__tenure">' + tenure(person) + "</span></div>";
        }).join("") + "</div></section>";
    }).join("");

    wall.innerHTML = html;

    var totals = document.getElementById("supporter-totals");
    if (totals) {
      var yt = people.filter(function (p) { return p.platform === "YouTube"; }).length;
      var tw = people.length - yt;
      totals.innerHTML = "<span><b>" + people.length + "</b> supporters</span><span><b>" + yt + "</b> on YouTube</span><span><b>" + tw + "</b> on Twitch</span>";
    }
  }
})();
