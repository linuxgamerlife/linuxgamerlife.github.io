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
    },
    gruvbox: {
      logo: "assets/theme/gruvbox/logo.svg",
      apple: "assets/theme/gruvbox/apple-touch-icon.png",
      vars: {
        "--bg": "#1d2021", "--bg-2": "#282828", "--bg-3": "#32302f",
        "--line": "rgba(235, 219, 178, 0.15)", "--line-strong": "rgba(235, 219, 178, 0.34)",
        "--accent": "#fabd2f", "--accent-2": "#fe8019", "--accent-3": "#b8bb26",
        "--accent-soft": "rgba(250, 189, 47, 0.13)",
        "--ink": "#fbf1c7", "--muted": "#d5c4a1", "--faint": "#a89984",
        "--ok": "#b8bb26", "--glow": "0 0 32px -22px rgba(250, 189, 47, 0.32)"
      }
    },
    tokyo: {
      logo: "assets/theme/tokyo/logo.svg",
      apple: "assets/theme/tokyo/apple-touch-icon.png",
      vars: {
        "--bg": "#1a1b26", "--bg-2": "#1f2335", "--bg-3": "#24283b",
        "--line": "rgba(122, 162, 247, 0.16)", "--line-strong": "rgba(122, 162, 247, 0.34)",
        "--accent": "#7aa2f7", "--accent-2": "#bb9af7", "--accent-3": "#3d59a1",
        "--accent-soft": "rgba(122, 162, 247, 0.14)",
        "--ink": "#c0caf5", "--muted": "#a9b1d6", "--faint": "#737aa2",
        "--ok": "#9ece6a", "--glow": "0 0 32px -22px rgba(122, 162, 247, 0.35)"
      }
    },
    nord: {
      logo: "assets/theme/nord/logo.svg",
      apple: "assets/theme/nord/apple-touch-icon.png",
      vars: {
        "--bg": "#242933", "--bg-2": "#2e3440", "--bg-3": "#3b4252",
        "--line": "rgba(216, 222, 233, 0.15)", "--line-strong": "rgba(216, 222, 233, 0.34)",
        "--accent": "#88c0d0", "--accent-2": "#81a1c1", "--accent-3": "#5e81ac",
        "--accent-soft": "rgba(136, 192, 208, 0.14)",
        "--ink": "#eceff4", "--muted": "#d8dee9", "--faint": "#aebacf",
        "--ok": "#a3be8c", "--glow": "0 0 32px -22px rgba(136, 192, 208, 0.32)"
      }
    },
    mocha: {
      logo: "assets/theme/mocha/logo.svg",
      apple: "assets/theme/mocha/apple-touch-icon.png",
      vars: {
        "--bg": "#1e1e2e", "--bg-2": "#181825", "--bg-3": "#313244",
        "--line": "rgba(205, 214, 244, 0.15)", "--line-strong": "rgba(205, 214, 244, 0.34)",
        "--accent": "#cba6f7", "--accent-2": "#89b4fa", "--accent-3": "#585b70",
        "--accent-soft": "rgba(203, 166, 247, 0.14)",
        "--ink": "#cdd6f4", "--muted": "#a6adc8", "--faint": "#7f849c",
        "--ok": "#a6e3a1", "--glow": "0 0 32px -22px rgba(203, 166, 247, 0.34)"
      }
    },
    dracula: {
      logo: "assets/theme/dracula/logo.svg",
      apple: "assets/theme/dracula/apple-touch-icon.png",
      vars: {
        "--bg": "#282a36", "--bg-2": "#21222c", "--bg-3": "#44475a",
        "--line": "rgba(248, 248, 242, 0.14)", "--line-strong": "rgba(248, 248, 242, 0.32)",
        "--accent": "#bd93f9", "--accent-2": "#ff79c6", "--accent-3": "#6272a4",
        "--accent-soft": "rgba(189, 147, 249, 0.14)",
        "--ink": "#f8f8f2", "--muted": "#bfc1d0", "--faint": "#8b8fa8",
        "--ok": "#50fa7b", "--glow": "0 0 32px -22px rgba(189, 147, 249, 0.35)"
      }
    },
    everforest: {
      logo: "assets/theme/everforest/logo.svg",
      apple: "assets/theme/everforest/apple-touch-icon.png",
      vars: {
        "--bg": "#2d353b", "--bg-2": "#343f44", "--bg-3": "#3d484d",
        "--line": "rgba(211, 198, 170, 0.14)", "--line-strong": "rgba(211, 198, 170, 0.32)",
        "--accent": "#a7c080", "--accent-2": "#dbbc7f", "--accent-3": "#5c6a72",
        "--accent-soft": "rgba(167, 192, 128, 0.14)",
        "--ink": "#d3c6aa", "--muted": "#b8b9a8", "--faint": "#859289",
        "--ok": "#a7c080", "--glow": "0 0 32px -22px rgba(167, 192, 128, 0.32)"
      }
    },
    kanagawa: {
      logo: "assets/theme/kanagawa/logo.svg",
      apple: "assets/theme/kanagawa/apple-touch-icon.png",
      vars: {
        "--bg": "#1f1f28", "--bg-2": "#16161d", "--bg-3": "#2a2a37",
        "--line": "rgba(220, 215, 186, 0.14)", "--line-strong": "rgba(220, 215, 186, 0.32)",
        "--accent": "#7e9cd8", "--accent-2": "#957fb8", "--accent-3": "#54546d",
        "--accent-soft": "rgba(126, 156, 216, 0.14)",
        "--ink": "#dcd7ba", "--muted": "#c8c093", "--faint": "#727169",
        "--ok": "#98bb6c", "--glow": "0 0 32px -22px rgba(126, 156, 216, 0.34)"
      }
    },
    rosepine: {
      logo: "assets/theme/rosepine/logo.svg",
      apple: "assets/theme/rosepine/apple-touch-icon.png",
      vars: {
        "--bg": "#232136", "--bg-2": "#2a273f", "--bg-3": "#393552",
        "--line": "rgba(224, 222, 244, 0.14)", "--line-strong": "rgba(224, 222, 244, 0.32)",
        "--accent": "#c4a7e7", "--accent-2": "#ebbcba", "--accent-3": "#6e6a86",
        "--accent-soft": "rgba(196, 167, 231, 0.14)",
        "--ink": "#e0def4", "--muted": "#c0bdd8", "--faint": "#908caa",
        "--ok": "#9ccfd8", "--glow": "0 0 32px -22px rgba(196, 167, 231, 0.34)"
      }
    },
    solarized: {
      logo: "assets/theme/solarized/logo.svg",
      apple: "assets/theme/solarized/apple-touch-icon.png",
      vars: {
        "--bg": "#002b36", "--bg-2": "#073642", "--bg-3": "#0b4a58",
        "--line": "rgba(147, 161, 161, 0.18)", "--line-strong": "rgba(147, 161, 161, 0.36)",
        "--accent": "#2aa198", "--accent-2": "#268bd2", "--accent-3": "#6c71c4",
        "--accent-soft": "rgba(42, 161, 152, 0.14)",
        "--ink": "#fdf6e3", "--muted": "#93a1a1", "--faint": "#657b83",
        "--ok": "#859900", "--glow": "0 0 32px -22px rgba(42, 161, 152, 0.32)"
      }
    },
    onedark: {
      logo: "assets/theme/onedark/logo.svg",
      apple: "assets/theme/onedark/apple-touch-icon.png",
      vars: {
        "--bg": "#282c34", "--bg-2": "#21252b", "--bg-3": "#3a404c",
        "--line": "rgba(171, 178, 191, 0.15)", "--line-strong": "rgba(171, 178, 191, 0.34)",
        "--accent": "#61afef", "--accent-2": "#c678dd", "--accent-3": "#528bff",
        "--accent-soft": "rgba(97, 175, 239, 0.14)",
        "--ink": "#d7dae0", "--muted": "#abb2bf", "--faint": "#7f848e",
        "--ok": "#98c379", "--glow": "0 0 32px -22px rgba(97, 175, 239, 0.34)"
      }
    },
    monokai: {
      logo: "assets/theme/monokai/logo.svg",
      apple: "assets/theme/monokai/apple-touch-icon.png",
      vars: {
        "--bg": "#272822", "--bg-2": "#1e1f1c", "--bg-3": "#3e3d32",
        "--line": "rgba(248, 248, 242, 0.14)", "--line-strong": "rgba(248, 248, 242, 0.32)",
        "--accent": "#f92672", "--accent-2": "#fd971f", "--accent-3": "#75715e",
        "--accent-soft": "rgba(249, 38, 114, 0.14)",
        "--ink": "#f8f8f2", "--muted": "#c5c8b8", "--faint": "#8f908a",
        "--ok": "#a6e22e", "--glow": "0 0 32px -22px rgba(249, 38, 114, 0.35)"
      }
    },
    halloween: {
      logo: "assets/theme/halloween/logo.svg",
      apple: "assets/theme/halloween/apple-touch-icon.png",
      vars: {
        "--bg": "#0b0806", "--bg-2": "#140f0a", "--bg-3": "#1e150d",
        "--line": "rgba(255, 145, 45, 0.16)", "--line-strong": "rgba(255, 168, 74, 0.36)",
        "--accent": "#ff8c1a", "--accent-2": "#b06bff", "--accent-3": "#6b3b18",
        "--accent-soft": "rgba(255, 140, 26, 0.14)",
        "--ink": "#fff0dd", "--muted": "#d3b596", "--faint": "#96765b",
        "--ok": "#ffb347", "--glow": "0 0 32px -22px rgba(255, 140, 26, 0.35)"
      }
    },
    cream: {
      logo: "assets/theme/cream/logo.svg",
      apple: "assets/theme/cream/apple-touch-icon.png",
      vars: {
        "--bg": "#0c0a06", "--bg-2": "#13100a", "--bg-3": "#1c170f",
        "--line": "rgba(232, 210, 170, 0.16)", "--line-strong": "rgba(240, 222, 188, 0.34)",
        "--accent": "#e6c99a", "--accent-2": "#c69a5e", "--accent-3": "#6f5632",
        "--accent-soft": "rgba(230, 201, 154, 0.13)",
        "--ink": "#fbf3e2", "--muted": "#c9bba3", "--faint": "#93846c",
        "--ok": "#b7d39a", "--glow": "0 0 32px -22px rgba(230, 201, 154, 0.32)"
      }
    },
    gold: {
      logo: "assets/theme/gold/logo.svg",
      apple: "assets/theme/gold/apple-touch-icon.png",
      vars: {
        "--bg": "#080b05", "--bg-2": "#0d1208", "--bg-3": "#151b0c",
        "--line": "rgba(247, 211, 92, 0.16)", "--line-strong": "rgba(255, 224, 130, 0.34)",
        "--accent": "#f5c518", "--accent-2": "#9ab55a", "--accent-3": "#5c6b1e",
        "--accent-soft": "rgba(245, 197, 24, 0.13)",
        "--ink": "#fdf6d0", "--muted": "#c9c39a", "--faint": "#8f8a63",
        "--ok": "#a8d17a", "--glow": "0 0 32px -22px rgba(245, 197, 24, 0.34)"
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
