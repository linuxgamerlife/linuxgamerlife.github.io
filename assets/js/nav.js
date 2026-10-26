/* Shared path navigation for the terminal inputs. */
(function () {
  "use strict";

  var PAGES = {
    home: "index.html",
    about: "about.html",
    videos: "videos.html",
    community: "community.html",
    projects: "projects.html",
    toolkit: "toolkit.html",
    setup: "mysetup.html",
    mysetup: "mysetup.html",
    ai: "ai.html",
    disclaimer: "about.html#disclaimer",
    discounts: "mysetup.html#deals-title",
    story: "about.html",
    contact: "about.html#contact",
    statement: "ai.html",
    mainmachine: "mysetup.html#mainpc-title",
    testmachine: "mysetup.html#parts-title",
    nsm: "mysetup.html#nsm-title",
    macmini: "mysetup.html#mac-title",
    pc1: "mysetup.html#mainpc-title",
    pc2: "mysetup.html#parts-title",
    legal: "about.html#disclaimer",
    "..": "index.html",
    ".": "index.html"
  };

  function clean(raw) {
    var value = String(raw || "").trim().toLowerCase();
    value = value.replace(/^(cd|open|go)\s+/, "");
    value = value.replace(/^~\/?/, "");
    value = value.replace(/^\.\//, "");
    value = value.replace(/\/+$/, "");
    return value;
  }

  window.LGLNavigate = function (raw) {
    var key = clean(raw);
    if (!key || key === "~") key = "home";
    if (window.LGLOpenLink && window.LGLOpenLink(key)) return true;
    var target = PAGES[key];
    if (!target) return false;
    window.location.href = target;
    return true;
  };

  window.LGLPages = PAGES;
})();

(function () {
  "use strict";

  var LINKS = {
    youtube: "https://www.youtube.com/@LinuxGamerLife",
    twitch: "https://twitch.tv/linuxgamerlife",
    kick: "https://kick.com/linuxgamerlife",
    github: "https://github.com/linuxgamerlife",
    copr: "https://copr.fedorainfracloud.org/coprs/linuxgamerlife/",
    kofi: "https://ko-fi.com/linuxgamerlife",
    "ko-fi": "https://ko-fi.com/linuxgamerlife",
    x: "https://x.com/linuxgamerlife",
    gitlab: "https://theblackdon.dev/kineticwe",
    kineticwe: "https://theblackdon.dev/kineticwe",
    kineticos: "https://theblackdon.dev/kineticwe",
    kwe: "https://theblackdon.dev/kineticwe",
    kwe2: "https://theblackdon.dev/kineticwe",
    theblackdon: "https://www.youtube.com/@TheBlackDon",
    finley: "https://www.youtube.com/@finleyardov",
    keychron: "https://www.keychron.com/?ref=linuxgamerlife",
    noctalia: "https://noctalia.dev/",
    fedora: "https://fedoraproject.org/"
  };

  var PATHS = ["~/videos", "~/projects", "~/about", "~/community", "~/toolkit", "~/setup", "~/ai", "~/disclaimer", "~", "home", "..", ".", "story", "contact", "testmachine", "nsm", "macmini", "pc1", "pc2", "theblackdon", "finley", "discounts", "keychron"];
  var NAV_COMMANDS = ["./home", "./about", "./videos", "./community", "./projects", "./toolkit", "./setup", "./youtube", "./twitch", "./kick"];

  function commonPrefix(a, b) {
    var i = 0;
    while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i += 1;
    return a.slice(0, i);
  }

  window.LGLLinks = LINKS;
  window.LGLPaths = PATHS;
  window.LGLNavCommands = NAV_COMMANDS;

  window.LGLOpenLink = function (name) {
    var url = LINKS[String(name || "").toLowerCase()];
    if (!url) return false;
    var opened = window.open(url, "_blank", "noopener");
    if (!opened) {
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.click();
    }
    return true;
  };

  window.LGLComplete = function (raw, commands, themes, state) {
    var value = String(raw || "");
    var lower = value.trim().toLowerCase();
    if (!lower) return null;

    if (state && state.value === value && state.matches && state.matches.length) {
      state.index = (state.index + 1) % state.matches.length;
      var next = state.matches[state.index];
      state.value = next;
      return { value: next, matches: state.matches.slice() };
    }

    var candidates;
    if (lower === "theme" || lower.indexOf("theme ") === 0) {
      candidates = themes.map(function (name) { return "theme " + name; });
      candidates.push("theme reset");
    } else if (lower === "cd" || lower.indexOf("cd ") === 0) {
      candidates = PATHS.map(function (path) { return "cd " + path; });
    } else {
      candidates = commands.concat(NAV_COMMANDS);
    }
    var matches = candidates.filter(function (item) {
      return item.toLowerCase().indexOf(lower) === 0;
    });
    if (!matches.length) {
      if (state) {
        state.value = "";
        state.matches = [];
        state.index = -1;
      }
      return null;
    }
    var completed;
    var index;
    if (matches.length === 1) {
      completed = matches[0];
      index = 0;
    } else {
      var prefix = matches.reduce(commonPrefix);
      if (prefix.length > value.length && lower !== "theme") {
        completed = prefix;
        index = -1;
      } else {
        completed = matches[0];
        index = 0;
      }
    }
    if (state) {
      state.value = completed;
      state.matches = matches.slice();
      state.index = index;
    }
    return { value: completed, matches: matches };
  };
})();

(function () {
  "use strict";

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        var ok = document.execCommand("copy");
        document.body.removeChild(area);
        if (ok) resolve();
        else reject(new Error("copy failed"));
      } catch (error) {
        document.body.removeChild(area);
        reject(error);
      }
    });
  }

  window.LGLCopy = copyText;

  document.addEventListener("click", function (event) {
    if (!event.target || !event.target.closest) return;
    var button = event.target.closest("[data-copy]");
    if (!button) return;
    event.preventDefault();

    var value = button.getAttribute("data-copy");
    var source = null;
    if (value && /^[#.]/.test(value)) {
      try {
        source = document.querySelector(value);
      } catch (error) {
        source = null;
      }
    }
    var text = source ? source.innerText.trim() : (value || button.getAttribute("data-copy-text") || "");
    if (!text) return;

    var label = button.querySelector(".copy-btn__label");
    var target = label || button;
    var original = target.textContent;
    copyText(text).then(function () {
      target.textContent = "Copied";
      button.classList.add("is-copied");
      window.setTimeout(function () {
        target.textContent = original;
        button.classList.remove("is-copied");
      }, 1600);
    }).catch(function () {
      target.textContent = "Copy failed";
      window.setTimeout(function () {
        target.textContent = original;
        button.classList.remove("is-copied");
      }, 1600);
    });
  });
})();

(function () {
  "use strict";

  var LSPCI_DEVICES = [
    "Host bridge: AMD Raphael/Granite Ridge Root Complex",
    "VGA compatible controller: AMD Radeon RX 9070 XT (Navi 48)",
    "Audio device: AMD Navi 48 HDMI/DP Audio",
    "Non-Volatile memory controller: WD Black SN850X NVMe",
    "Non-Volatile memory controller: WD Black SN850X NVMe",
    "Non-Volatile memory controller: WD_BLACK SN7100 NVMe",
    "Ethernet controller: Realtek RTL8126 5GbE",
    "Network controller: Realtek RTL8922AE Wi-Fi 7",
    "Non-Volatile memory controller: WD SN770/SN5000 NVMe",
    "USB controller: AMD 800 Series USB 3.x",
    "SATA controller: AMD 600 Series SATA",
    "PCI bridge: ASMedia ASM4242 USB4",
    "USB controller: ASMedia ASM4242 USB 3.2",
    "USB controller: ASMedia ASM4242 USB4 / Thunderbolt 3",
    "VGA compatible controller: AMD Radeon 610M (iGPU)",
    "Audio device: AMD Ryzen HD Audio"
  ];

  function hex(max, digits) {
    return Math.floor(Math.random() * max).toString(16).padStart(digits, "0");
  }

  window.LGLLspci = function () {
    var used = {};
    var lines = LSPCI_DEVICES.map(function (device) {
      var address;
      do {
        address = hex(256, 2) + ":" + hex(32, 2) + "." + hex(8, 1);
      } while (used[address]);
      used[address] = true;
      return address + " " + device;
    });
    lines.sort();
    return lines.join("\n");
  };
})();

(function () {
  "use strict";

  var LSBLK = [
    "NAME          SIZE LABEL",
    "zram0           8G zram0",
    "nvme2n1     931.5G",
    "nvme0n1     931.5G",
    "├─nvme0n1p1   512M",
    "├─nvme0n1p2     2G",
    "├─nvme0n1p3   629G development",
    "└─nvme0n1p4   300G fedora_fedora",
    "nvme1n1       3.6T",
    "└─nvme1n1p1   3.6T Storage",
    "nvme3n1       1.8T",
    "└─nvme3n1p1   1.8T home"
  ];

  window.LGLLsblk = function () {
    return LSBLK.join("\n");
  };
})();

(function () {
  "use strict";

  window.LGLFastfetch = function () {
    return [
      "lgl@fedora",
      "-----------",
      "OS: Fedora Linux 44 (Workstation)",
      "Host: PC1",
      "Kernel: 7.2.11-200.fc44.x86_64",
      "DE: KineticWE",
      "WM: KWin (Wayland)",
      "Shell: zsh 5.9",
      "Terminal: kitty",
      "CPU: AMD Ryzen 9 9950X3D",
      "GPU: AMD Radeon RX 9070 XT",
      "Memory: 17.4 GiB / 60.0 GiB"
    ].join("\n");
  };
})();

(function () {
  "use strict";

  window.LGLDoas = "Sorry, cinnamon rolls are out of stock. Please come back later.";

  window.LGLBrowsers = {
    brave: {
      text: "Brave sucks :P",
      url: "https://brave.com/",
      label: "brave.com"
    },
    vivaldi: {
      text: "the browser of choice",
      url: "https://vivaldi.com/",
      label: "vivaldi.com"
    },
    helium: {
      text: "the other best browser",
      url: "https://helium.computer/",
      label: "helium.computer"
    },
    zen: {
      text: "Not so zen when you want to go horizontal",
      url: "https://zen-browser.app/",
      label: "zen-browser.app"
    },
    firefox: {
      text: "nice",
      url: "https://www.mozilla.org/firefox/",
      label: "mozilla.org/firefox"
    },
    waterfox: {
      text: "ok i guess",
      url: "https://www.waterfox.net/",
      label: "waterfox.net"
    },
    floor: {
      text: "different I guess?",
      url: "https://floorp.app/",
      label: "floorp.app"
    }
  };
})();

(function () {
  "use strict";

  window.LGLVideos = {
    solus: { title: "Solus Linux", url: "https://youtu.be/z_SKBA215mA", label: "youtu.be" },
    opensuse: { title: "openSUSE Tumbleweed", url: "https://youtu.be/UNGx4bOb1v0", label: "youtu.be" },
    debian: { title: "Debian 13", url: "https://youtu.be/FZYt7HV4Io8", label: "youtu.be" },
    arch: { title: "Arch Linux", url: "https://youtu.be/0jcEhbwc0cY", label: "youtu.be" },
    void: { title: "Void Linux", url: "https://youtu.be/svQ2Fjsa7v8", label: "youtu.be" },
    nixos: { title: "NixOS", url: "https://youtu.be/NrQ3q0JzV58", label: "youtu.be" },
    playtron: { title: "Playtron", url: "https://youtu.be/qzA5ATPBDQI", label: "youtu.be" },
    regataos: { title: "Regata OS", url: "https://youtu.be/eQYh7guSwrs", label: "youtu.be" },
    bazzite: { title: "Bazzite", url: "https://youtu.be/3I30PZoDpl4", label: "youtu.be" },
    pikaos: { title: "PikaOS", url: "https://youtu.be/1q0Qeu6C6eQ", label: "youtu.be" },
    garuda: { title: "Garuda Linux", url: "https://youtu.be/7t3ly_gU5Mg", label: "youtu.be" },
    nobara: { title: "Nobara Linux", url: "https://youtu.be/5K3nasa9RHw", label: "youtu.be" },
    steamos: { title: "SteamOS", url: "https://youtu.be/sIJ4LdsG42E", label: "youtu.be" },
    cachyos: { title: "CachyOS", url: "https://youtu.be/SVEnq_8AUK8", label: "youtu.be" }
  };

  var ALIASES = {
    nix: "nixos",
    regata: "regataos",
    pika: "pikaos",
    steam: "steamos",
    cachy: "cachyos"
  };

  window.LGLVideo = function (name) {
    return window.LGLVideos[ALIASES[name] || name] || null;
  };

  window.LGLAppendLink = function (text, url, label) {
    var log = document.getElementById("tty-log");
    if (log) {
      var line = document.createElement("p");
      line.className = "tty-log-line";
      line.appendChild(document.createTextNode(text + " "));
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = label;
      line.appendChild(link);
      log.appendChild(line);
      return true;
    }

    var out = document.querySelector(".site-tty__out");
    if (out) {
      out.textContent = text + " ";
      var siteLink = document.createElement("a");
      siteLink.href = url;
      siteLink.target = "_blank";
      siteLink.rel = "noopener";
      siteLink.textContent = label;
      out.appendChild(siteLink);
      return true;
    }

    return false;
  };
})();

(function () {
  "use strict";

  window.LGLGentoo = "Only strange people use gentoo. Strange people are awesome though.";
})();
