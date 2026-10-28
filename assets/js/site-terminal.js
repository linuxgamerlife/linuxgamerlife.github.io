/* Compact navigation terminal at the top of content pages. */
(function () {
  "use strict";

  var bar = document.querySelector("[data-site-tty]");
  if (!bar) return;

  var form = bar.querySelector(".site-tty__form");
  var input = bar.querySelector(".site-tty__input");
  var out = bar.querySelector(".site-tty__out");
  if (!form || !input || !out) return;

  var COMMANDS = ["help", "ls", "lsblk", "lspci", "clear", "theme", "cd", "about", "journey", "principles", "videos", "solus", "opensuse", "debian", "arch", "void", "nix", "nixos", "playtron", "regata", "regataos", "bazzite", "pika", "pikaos", "garuda", "nobara", "steam", "steamos", "cachy", "cachyos", "gentoo", "ubuntu", "wayland", "x11", "community", "projects", "toolkit", "launchcommands", "merch", "setup", "home", "discounts", "ai", "disclaimer", "tdlr", "story", "contact", "statement", "mainmachine", "testmachine", "nsm", "macmini", "legal", "sudo", "rm", "mkdir", "pwd", "echo", "doas", "brave", "vivaldi", "helium", "zen", "firefox", "waterfox", "floorp", "whoami", "cat", "fastfetch", "vim", "nano", "shutdown", "reboot", "apt", "pacman", "dnf", "man"]
    .concat(Object.keys(window.LGLLinks || {}));
  var pendingSudo = false;
  var history = [];
  var historyIndex = -1;
  var completionState = { value: "", matches: [], index: -1 };

  function say(text) {
    out.textContent = text;
  }

  function sayGrid(items) {
    out.textContent = "";
    var grid = document.createElement("span");
    grid.className = "tty-help-grid";
    items.forEach(function (item) {
      var cell = document.createElement("span");
      cell.textContent = item;
      grid.appendChild(cell);
    });
    out.appendChild(grid);
  }

  function sayLink(text, url, label) {
    out.textContent = text + " ";
    var link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = label;
    out.appendChild(link);
  }

  function run(raw) {
    var value = raw.trim();
    if (!value) return;
    history.push(value);
    historyIndex = history.length;
    var lower = value.toLowerCase();

    if (pendingSudo) {
      pendingSudo = false;
      if (lower === "yes") {
        say("sudo: authentication accepted.");
        if (window.LGLHack) window.LGLHack();
      } else {
        say("sudo: aborted. probably for the best.");
      }
      return;
    }
    if (lower === "sudo") {
      say("We trust you have received the usual lecture from the local System\nAdministrator. It usually boils down to these three things:\n#1) Respect the privacy of others.\n#2) Think before you type.\n#3) With great power comes great responsibility.\ntype yes to continue");
      pendingSudo = true;
      return;
    }
    if (lower === "rm" || lower.indexOf("rm ") === 0) {
      if (/\s-[a-z]*r/i.test(lower)) {
        if (window.LGLJoke) window.LGLJoke("rm -rf /");
        else say("rm: deleting everything in 5... JUST KIDDING.");
      } else {
        say("rm: refusing to delete anything on a website.");
      }
      return;
    }
    if (lower === "mkdir" || lower.indexOf("mkdir ") === 0) {
      if (window.LGLJoke) window.LGLJoke("mkdir");
      else say("mkdir: creating a very large directory... JUST KIDDING.");
      return;
    }
    if (lower === "shutdown") {
      var shutdownHead = "Your pc will shutdown in\n";
      if (window.LGLCountdown) {
        window.LGLCountdown(function (count) {
          say(shutdownHead + count);
        }, function () {
          say(shutdownHead + "shutdown: just kidding. this is a website.");
        });
      }
      return;
    }

    var FUNNY = {
      vim: "you are now trapped in vim. :q! ... just kidding.",
      nano: "nano is not installed. this is a website.",
      reboot: "nice try.",
      apt: "this is a Fedora household.",
      pacman: "wrong distro, but I respect it.",
      dnf: "dnf is not available in this terminal. try the toolkit page."
    };
    if (FUNNY[lower]) { say(FUNNY[lower]); return; }
    if (lower === "pwd") { say("/home/lgl"); return; }
    if (lower === "echo" || lower.indexOf("echo ") === 0) { say(value.slice(5).trim()); return; }
    if (lower === "doas") { say(window.LGLDoas || "Sorry, cinnamon rolls are out of stock. Please come back later."); return; }
    if (lower === "gentoo") { say(window.LGLGentoo || "Only strange people use gentoo. Strange people are awesome though."); return; }
    if (window.LGLBrowsers && window.LGLBrowsers[lower]) {
      var browser = window.LGLBrowsers[lower];
      sayLink(browser.text, browser.url, browser.label);
      return;
    }
    if (lower === "whoami") { say("linuxgamerlife"); return; }
    if (lower === "cat" || lower.indexOf("cat ") === 0) {
      var file = value.slice(4).trim();
      if (!file || file.toLowerCase() === "manifesto.txt") {
        say("Left Windows. Kept the games.\nI spent decades gaming on Windows, then moved everything to Linux in 2025.");
      } else {
        say("cat: " + file + ": No such file or directory");
      }
      return;
    }
    if (lower === "fastfetch") {
      say(window.LGLFastfetch ? window.LGLFastfetch() : "fastfetch: not available");
      return;
    }
    if (lower === "man" || lower.indexOf("man ") === 0) {
      var topic = value.slice(3).trim();
      if (!topic) {
        say("What manual page do you want?");
        sayGrid(window.LGLMan ? window.LGLMan.names() : []);
        return;
      }
      var page = window.LGLMan ? window.LGLMan.render(topic) : null;
      if (!page) {
        say("No manual entry for " + topic);
        return;
      }
      say(page);
      return;
    }
    if (lower === "cd merch" || lower === "cd ~/merch" || lower === "./merch") {
      window.LGLOpenMerch();
      sayLink("opening the full shop", window.LGLMerch.url, window.LGLMerch.url);
      return;
    }
    if (lower === "help") {
      var items = COMMANDS.concat(
        window.LGLNavCommands || [],
        (window.LGLPaths || []).map(function (path) { return "cd " + path; }),
        ["theme <name>", "theme reset", "man <topic>"]
      ).filter(function (item, index, all) { return all.indexOf(item) === index; }).sort();
      sayGrid(items);
      return;
    }
    if (lower === "ls") {
      say("about/  journey/  principles/  videos/  community/  projects/  toolkit/  launchcommands/  merch/  setup/  contact/  discounts/\nai.txt  disclaimer.txt  tdlr.txt  themes/");
      return;
    }
    if (lower === "lsblk") {
      say(window.LGLLsblk ? window.LGLLsblk() : "lsblk: not available");
      return;
    }
    if (lower === "lspci") {
      say(window.LGLLspci ? window.LGLLspci() : "lspci: not available");
      return;
    }
    if (lower === "clear") {
      pendingSudo = false;
      say("type help or cd ~/videos");
      return;
    }
    if (lower === "exit") {
      say("there is no escape. (this is a website.)");
      return;
    }
    if (lower === "theme" || lower.indexOf("theme ") === 0) {
      var theme = value.slice(5).trim().toLowerCase();
      if (!theme) {
        say("current: " + window.LGLTheme.current() + "  available: " + Object.keys(window.LGLTheme.themes).join("  "));
        return;
      }
      if (theme === "reset") {
        window.LGLTheme.reset();
        say("theme reset to " + window.LGLTheme.current());
        return;
      }
      if (window.LGLTheme.apply(theme)) {
        say("theme set to " + theme);
        return;
      }
      say("unknown theme: " + theme);
      return;
    }
    if (window.LGLOpenLink(value)) {
      say("opening " + value + "...");
      return;
    }
    if (window.LGLPanels && window.LGLPanels.open(lower)) {
      var video = window.LGLVideo && window.LGLVideo(lower);
      if (video) sayLink(video.title + " · video", video.url, video.label);
      else if (lower === "merch") sayLink("shop", window.LGLMerch.url, window.LGLMerch.url);
      else say("opening " + lower + "...");
      return;
    }
    if (window.LGLNavigate(value)) return;
    var jokes = ["the penguin declines.", "that command is not in this timeline.", "nice try.", "even sudo would not help.", "not today."];
    say('command not found: "' + value + '". type help.\n' + jokes[Math.floor(Math.random() * jokes.length)]);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = input.value;
    input.value = "";
    run(value);
  });

  input.addEventListener("input", function () {
    completionState.value = "";
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (!history.length) return;
      if (event.key === "ArrowUp") {
        historyIndex = Math.max(0, historyIndex - 1);
      } else {
        historyIndex = Math.min(history.length, historyIndex + 1);
      }
      input.value = history[historyIndex] || "";
      completionState.value = "";
      return;
    }
    if (event.key !== "Tab") return;
    event.preventDefault();
    var result = window.LGLComplete(input.value, COMMANDS, Object.keys(window.LGLTheme.themes), completionState);
    if (!result) return;
    input.value = result.value;
    if (result.matches.length > 1) say(result.matches.join("  "));
  });

  bar.addEventListener("click", function (event) {
    if (event.target.closest("a, button, input")) return;
    var selection = window.getSelection();
    if (selection && selection.toString().length) return;
    input.focus();
  });

  input.focus({ preventScroll: true });
})();
