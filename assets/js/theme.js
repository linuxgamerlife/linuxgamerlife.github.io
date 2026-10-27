/* Shared live theme switcher for the whole site. */
(function () {
  "use strict";

  var THEMES = {
    forest: {
      logo: "assets/theme/harry-green/logo.svg",
      apple: "assets/theme/harry-green/apple-touch-icon.png",
      vars: {
        "--bg": "#050a07", "--bg-2": "#08110c", "--bg-3": "#0c1911",
        "--line": "rgba(126, 200, 145, 0.16)", "--line-strong": "rgba(142, 222, 160, 0.36)",
        "--accent": "#8bd17c", "--accent-2": "#5fa86b", "--accent-3": "#2d6b44",
        "--accent-soft": "rgba(139, 209, 124, 0.12)",
        "--ink": "#edf8ef", "--muted": "#a5b9aa", "--faint": "#718879",
        "--ok": "#8bd17c", "--glow": "0 0 32px -22px rgba(139, 209, 124, 0.35)"
      }
    },
    monochrome: {
      logo: "assets/theme/monochrome/logo.svg",
      apple: "assets/theme/monochrome/apple-touch-icon.png",
      vars: {
        "--bg": "#050505", "--bg-2": "#0b0b0b", "--bg-3": "#151515",
        "--line": "rgba(255, 255, 255, 0.14)", "--line-strong": "rgba(255, 255, 255, 0.36)",
        "--accent": "#f2f2f2", "--accent-2": "#c4c4c4", "--accent-3": "#6f6f6f",
        "--accent-soft": "rgba(255, 255, 255, 0.1)",
        "--ink": "#fbfbfb", "--muted": "#b9b9b9", "--faint": "#808080",
        "--ok": "#f2f2f2", "--glow": "0 0 32px -22px rgba(255, 255, 255, 0.28)"
      }
    },
    pink: {
      logo: "assets/theme/light-pink/logo.svg",
      apple: "assets/theme/light-pink/apple-touch-icon.png",
      vars: {
        "--bg": "#17131c", "--bg-2": "#1f1a27", "--bg-3": "#2a2235",
        "--line": "rgba(255, 196, 210, 0.16)", "--line-strong": "rgba(255, 214, 224, 0.32)",
        "--accent": "#f4a3b8", "--accent-2": "#d97a9e", "--accent-3": "#a34f74",
        "--accent-soft": "rgba(244, 163, 184, 0.14)",
        "--ink": "#fdf2f7", "--muted": "#cbb6c2", "--faint": "#a38c9a",
        "--ok": "#ffb59e", "--glow": "0 0 32px -22px rgba(217, 122, 158, 0.35)"
      }
    },
    blue: {
      logo: "assets/theme/deep-blue/logo.svg",
      apple: "assets/theme/deep-blue/apple-touch-icon.png",
      vars: {
        "--bg": "#040913", "--bg-2": "#071326", "--bg-3": "#0b1e3a",
        "--line": "rgba(120, 175, 255, 0.16)", "--line-strong": "rgba(150, 200, 255, 0.32)",
        "--accent": "#6fb4ff", "--accent-2": "#2f6fd0", "--accent-3": "#123b73",
        "--accent-soft": "rgba(111, 180, 255, 0.14)",
        "--ink": "#eaf4ff", "--muted": "#a4b9d4", "--faint": "#7d93b2",
        "--ok": "#6ee7b7", "--glow": "0 0 32px -22px rgba(47, 111, 208, 0.35)"
      }
    },
    green: {
      logo: "assets/theme/harry-green/logo.svg",
      apple: "assets/theme/harry-green/apple-touch-icon.png",
      vars: {
        "--bg": "#040b08", "--bg-2": "#07130e", "--bg-3": "#0a1c14",
        "--line": "rgba(126, 245, 185, 0.16)", "--line-strong": "rgba(156, 255, 204, 0.32)",
        "--accent": "#6df2ad", "--accent-2": "#2fbf82", "--accent-3": "#12634a",
        "--accent-soft": "rgba(109, 242, 173, 0.14)",
        "--ink": "#ecfff5", "--muted": "#a3c2b3", "--faint": "#7d9c8d",
        "--ok": "#6ee7b7", "--glow": "0 0 32px -22px rgba(47, 191, 130, 0.35)"
      }
    },
    purple: {
      logo: "assets/theme/deep-purple/logo.svg",
      apple: "assets/theme/deep-purple/apple-touch-icon.png",
      vars: {
        "--bg": "#08050f", "--bg-2": "#0f0a1d", "--bg-3": "#150d29",
        "--line": "rgba(176, 140, 255, 0.16)", "--line-strong": "rgba(196, 160, 255, 0.32)",
        "--accent": "#d05eac", "--accent-2": "#9a6bff", "--accent-3": "#6f4bd8",
        "--accent-soft": "rgba(208, 94, 172, 0.14)",
        "--ink": "#f6f2ff", "--muted": "#b3a8c9", "--faint": "#8a80a3",
        "--ok": "#6ee7b7", "--glow": "0 0 32px -22px rgba(154, 107, 255, 0.35)"
      }
    }
  };

  var bakedTheme = "monochrome";
  var currentTheme = "monochrome";

  function detectBakedTheme() {
    var accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().toLowerCase();
    Object.keys(THEMES).forEach(function (name) {
      if (THEMES[name].vars["--accent"] === accent) bakedTheme = name;
    });
    currentTheme = bakedTheme;
    return bakedTheme;
  }

  function updateAssets(theme) {
    document.querySelectorAll(".brand img, .footer__brand img").forEach(function (img) {
      img.src = theme.logo;
    });
    var icon = document.querySelector('link[rel="icon"]');
    if (icon) icon.href = theme.logo;
    var apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (apple) apple.href = theme.apple;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme.vars["--bg"];
    document.documentElement.setAttribute("data-theme", currentTheme);
    var label = document.getElementById("tty-theme");
    if (label) label.textContent = currentTheme;
  }

  function apply(name, persist) {
    var theme = THEMES[name];
    if (!theme) return false;
    Object.keys(theme.vars).forEach(function (key) {
      document.documentElement.style.setProperty(key, theme.vars[key]);
    });
    currentTheme = name;
    document.documentElement.setAttribute("data-theme", name);
    updateAssets(theme);
    if (persist !== false) {
      try {
        if (name === bakedTheme) localStorage.removeItem("lgl-theme:" + bakedTheme);
        else localStorage.setItem("lgl-theme:" + bakedTheme, name);
      } catch (error) { /* no-op */ }
    }
    return true;
  }

  function reset() {
    try { localStorage.removeItem("lgl-theme:" + bakedTheme); } catch (error) { /* no-op */ }
    return apply("pink", true);
  }

  function init() {
    detectBakedTheme();
    document.documentElement.setAttribute("data-theme", currentTheme);
    try {
      var stored = localStorage.getItem("lgl-theme:" + bakedTheme);
      if (stored && THEMES[stored]) apply(stored, false);
    } catch (error) { /* no-op */ }
    var label = document.getElementById("tty-theme");
    if (label) label.textContent = currentTheme;
  }

  window.LGLTheme = {
    themes: THEMES,
    apply: apply,
    reset: reset,
    current: function () { return currentTheme; },
    baked: function () { return bakedTheme; }
  };

  init();
})();
