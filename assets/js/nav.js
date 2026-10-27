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
    if (key === "merch") {
      window.LGLOpenMerch();
      return true;
    }
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

  var PATHS = ["~/videos", "~/projects", "~/about", "~/community", "~/toolkit", "~/setup", "~/merch", "~/ai", "~/disclaimer", "~", "home", "..", ".", "story", "contact", "testmachine", "nsm", "macmini", "pc1", "pc2", "theblackdon", "finley", "discounts", "keychron"];
  var NAV_COMMANDS = ["./home", "./about", "./videos", "./community", "./projects", "./toolkit", "./setup", "./merch", "./youtube", "./twitch", "./kick"];

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

  window.LGLMerch = {
    url: "https://merch.linuxgamerlife.net",
    productUrl: "https://merch.linuxgamerlife.net/products/fork-it-and-fix-it"
  };

  window.LGLOpenMerch = function () {
    var url = window.LGLMerch.url;
    var opened = window.open(url, "_blank", "noopener");
    if (!opened) {
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.click();
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
    if (lower === "man" || lower.indexOf("man ") === 0) {
      candidates = (window.LGLMan ? window.LGLMan.names() : []).map(function (name) {
        return "man " + name;
      });
    } else if (lower === "theme" || lower.indexOf("theme ") === 0) {
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
    floorp: {
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
    cachyos: { title: "CachyOS", url: "https://youtu.be/SVEnq_8AUK8", label: "youtu.be" },
    ubuntu: { title: "Ubuntu", url: "https://youtu.be/x7thWaJ6t2I", label: "youtu.be" },
    wayland: { title: "X11 vs Wayland", url: "https://youtu.be/WZXW7mfcf8Q", label: "youtu.be" },
    x11: { title: "X11 vs Wayland", url: "https://youtu.be/WZXW7mfcf8Q", label: "youtu.be" }
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

/* Manual pages for the terminal `man` command. */
(function () {
  "use strict";

  var MAN = {
    help: {
      name: "help",
      summary: "list the available commands",
      synopsis: "help",
      description: [
        "Prints every command in columns.",
        "Use man <topic> to read about a page, app or command."
      ],
      seeAlso: "man man, man theme"
    },
    man: {
      name: "man",
      summary: "format and display manual pages",
      synopsis: "man <topic>",
      description: [
        "Prints the manual page for a page, app or command. Run man on its own to list every topic."
      ],
      seeAlso: "man help, man videos"
    },
    videos: {
      name: "videos",
      summary: "browse every Linux Gamer Life video series",
      synopsis: "videos",
      description: [
        "Opens the videos app in a panel with all seven series, from I Switched... to Indie Spotlight.",
        "Every entry links to YouTube, and the panel leaves a link in the terminal after it closes."
      ],
      seeAlso: "man journey, man projects, videos.html"
    },
    journey: {
      name: "journey",
      summary: "follow the move from Windows to Linux",
      synopsis: "journey",
      description: [
        "Opens the LGL journey app: the switch away from Windows in 2025, what changed day to day, and what is still being learned."
      ],
      seeAlso: "man about, man videos"
    },
    principles: {
      name: "principles",
      summary: "what Linux Gamer Life stands for",
      synopsis: "principles",
      description: [
        "Community, the journey, Linux gaming and indie games: the four principles behind the channel and this site."
      ],
      seeAlso: "man about, man community"
    },
    about: {
      name: "about",
      summary: "who is behind Linux Gamer Life",
      synopsis: "about",
      description: [
        "Opens the about app: the short version, the setup, and links to the people and projects behind the site."
      ],
      seeAlso: "man journey, man contact"
    },
    community: {
      name: "community",
      summary: "join the Linux Gamer Life community",
      synopsis: "community",
      description: [
        "Opens the community app with the Discord, YouTube comments and other places to ask questions or share fixes."
      ],
      seeAlso: "man about, man contact"
    },
    projects: {
      name: "projects",
      summary: "small open-source tools built for Linux",
      synopsis: "projects",
      description: [
        "Opens the projects app: the LGL tools and experiments, with links to GitHub and Copr."
      ],
      seeAlso: "man toolkit, projects.html"
    },
    toolkit: {
      name: "toolkit",
      summary: "install the LGL Toolkit from Copr",
      synopsis: "toolkit",
      description: [
        "Opens the toolkit install guide. One Copr repository provides the colour picker, emoji picker, wallpaper editor, DNF helper, scheduler and power profile manager."
      ],
      seeAlso: "man projects, toolkit.html"
    },
    setup: {
      name: "setup",
      summary: "the machines, the desk and the gear",
      synopsis: "setup",
      description: [
        "Opens the setup app: PC1, PC2, the NSM and the Mac mini, plus storage, peripherals and recommendations."
      ],
      seeAlso: "man discounts, mysetup.html"
    },
    merch: {
      name: "merch",
      summary: "browse Linux Gamer Life products",
      synopsis: "merch | cd merch | ./merch",
      description: [
        "A collection of really amazing LGL products.",
        "Run merch to open the shop app, or use cd merch or ./merch to open the full shop."
      ],
      seeAlso: "https://merch.linuxgamerlife.net"
    },
    discounts: {
      name: "discounts",
      summary: "affiliate links, referrals and discount codes",
      synopsis: "discounts",
      description: [
        "Jumps to the deals section of the setup page. Some links earn the channel a small commission at no extra cost to you."
      ],
      seeAlso: "man setup, mysetup.html"
    },
    ai: {
      name: "ai",
      summary: "how generative AI is used here",
      synopsis: "ai",
      description: [
        "Opens the AI transparency statement: what AI helps with, what it never replaces, and how the final output is reviewed."
      ],
      seeAlso: "man disclaimer, ai.html"
    },
    disclaimer: {
      name: "disclaimer",
      summary: "risk, responsibility and affiliate disclosure",
      synopsis: "disclaimer",
      description: [
        "Opens the disclaimer. Commands and instructions are used at your own risk; always read them before running them."
      ],
      seeAlso: "man ai, about.html#disclaimer"
    },
    contact: {
      name: "contact",
      summary: "get in touch with Linux Gamer Life",
      synopsis: "contact",
      description: [
        "Opens the contact section with email and social links."
      ],
      seeAlso: "man about, about.html#contact"
    },
    theme: {
      name: "theme",
      summary: "switch the live site theme",
      synopsis: "theme <name> | theme reset",
      description: [
        "Changes the theme for the whole site and remembers it for this browser.",
        "Available themes: forest, monochrome, pink, blue, green and purple. theme reset returns to pink."
      ],
      seeAlso: "man help"
    },
    home: {
      name: "home",
      summary: "return to the home page",
      synopsis: "home",
      description: [
        "Navigates to the home page."
      ],
      seeAlso: "man cd"
    },
    cd: {
      name: "cd",
      summary: "navigate between pages",
      synopsis: "cd <path>",
      description: [
        "Changes page from the terminal. Examples: cd ~/videos, cd ~/projects, cd ~."
      ],
      seeAlso: "man home"
    },
    ls: {
      name: "ls",
      summary: "list pages and files",
      synopsis: "ls",
      description: [
        "Lists the pages and files available in the site's terminal."
      ],
      seeAlso: "man cd"
    }
  };

  var ALIASES = {
    story: "about",
    tdlr: "about",
    statement: "ai",
    legal: "disclaimer",
    mainmachine: "setup",
    testmachine: "setup",
    nsm: "setup",
    macmini: "setup",
    pc1: "setup",
    pc2: "setup",
    nix: "nixos",
    regata: "regataos",
    pika: "pikaos",
    steam: "steamos",
    cachy: "cachyos"
  };

  var VIDEOS = window.LGLVideos || {};
  Object.keys(VIDEOS).forEach(function (key) {
    var video = VIDEOS[key];
    MAN[key] = {
      name: key,
      summary: "watch " + video.title,
      synopsis: key,
      description: [
        "Opens the " + video.title + " video panel with the thumbnail, a short description and a link to YouTube."
      ],
      seeAlso: "man videos, videos.html"
    };
  });

  function wrap(text, width) {
    var words = String(text).split(/\s+/);
    var lines = [];
    var line = "";
    words.forEach(function (word) {
      if (!line) line = word;
      else if ((line + " " + word).length <= width) line += " " + word;
      else {
        lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function get(name) {
    var key = String(name || "").trim().toLowerCase();
    key = ALIASES[key] || key;
    return MAN[key] || null;
  }

  function render(name) {
    var page = get(name);
    if (!page) return null;

    var lines = [page.name.toUpperCase() + "(1) - LGL Manual", ""];
    lines.push("NAME");
    lines.push("     " + page.name + " - " + page.summary);
    lines.push("");
    lines.push("SYNOPSIS");
    lines.push("     " + page.synopsis);
    lines.push("");
    lines.push("DESCRIPTION");
    page.description.forEach(function (paragraph) {
      wrap(paragraph, 64).forEach(function (line) {
        lines.push("     " + line);
      });
      lines.push("");
    });
    if (page.seeAlso) {
      lines.push("SEE ALSO");
      lines.push("     " + page.seeAlso);
    }
    return lines.join("\n").replace(/\n+$/, "");
  }

  window.LGLMan = {
    names: function () { return Object.keys(MAN).sort(); },
    has: function (name) { return !!get(name); },
    render: render
  };
})();

/* Shared delayed countdown for the joke shutdown command. */
window.LGLCountdown = function (tick, done) {
  var count = 5;
  tick(count);
  var timer = window.setInterval(function () {
    count -= 1;
    if (count > 0) {
      tick(count);
    } else {
      window.clearInterval(timer);
      if (done) done();
    }
  }, 750);
};
