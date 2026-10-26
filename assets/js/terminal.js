/* LGL://TTY - home terminal */
(function () {
  "use strict";

  var form = document.getElementById("tty-form");
  var input = document.getElementById("tty-input");
  var log = document.getElementById("tty-log");
  if (!form || !input || !log) return;

  var COMMANDS = [
    "about", "journey", "principles", "videos", "solus", "opensuse", "debian", "arch", "void", "nix", "nixos", "playtron", "regata", "regataos", "bazzite", "pika", "pikaos", "garuda", "nobara", "steam", "steamos", "cachy", "cachyos", "projects",
    "toolkit", "setup", "community", "discounts", "ai", "disclaimer", "tdlr",
    "story", "contact", "statement", "mainmachine", "testmachine", "nsm", "macmini", "legal",
    "doas", "brave", "vivaldi", "helium", "zen", "firefox", "waterfox", "floor",
    "ls", "lsblk", "lspci", "fastfetch", "theme", "clear", "exit", "help"
  ];
  var history = [];
  var historyIndex = -1;
  var completionState = { value: "", matches: [], index: -1 };
  var pendingSudo = false;
  var EXTRA_COMMANDS = ["sudo", "rm", "mkdir", "pwd", "echo", "vim", "nano", "shutdown", "reboot", "apt", "pacman", "dnf"];
  var themeApi = window.LGLTheme;

  function line(text, className) {
    var p = document.createElement("p");
    p.className = "tty-log-line" + (className ? " " + className : "");
    p.textContent = text;
    log.appendChild(p);
    return p;
  }

  function command(text) {
    var p = document.createElement("p");
    p.className = "tty-log-line";
    var prompt = document.createElement("span");
    prompt.className = "tty__prompt";
    prompt.textContent = "lgl@fedora:~$";
    p.appendChild(prompt);
    p.appendChild(document.createTextNode(" " + text));
    log.appendChild(p);
    return p;
  }

  function linkLine(label, href, external, linkText) {
    var p = document.createElement("p");
    p.className = "tty-log-line";
    p.appendChild(document.createTextNode(label + " "));
    var a = document.createElement("a");
    a.href = href;
    a.textContent = linkText || href.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (external) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    p.appendChild(a);
    log.appendChild(p);
    return p;
  }

  function printFastfetch() {
    var wrap = document.createElement("div");
    wrap.className = "ff";

    var art = document.createElement("pre");
    art.className = "ff__art";
    art.textContent = [
      "       .--.        ",
      "      |o_o |       ",
      "      |:_/ |       ",
      "     //   \\ \\      ",
      "    (|     | )     ",
      "   /'\\_   _/`\\    ",
      "   \\___)=(___/     "
    ].join("\n");

    var fields = document.createElement("div");
    fields.className = "ff__fields";
    [
      ["lgl@fedora", ""],
      ["-----------", ""],
      ["OS", "Fedora Linux 44 (Workstation)"],
      ["Host", "PC1"],
      ["Kernel", "7.2.11-200.fc44.x86_64"],
      ["DE", "KineticWE"],
      ["WM", "KWin (Wayland)"],
      ["Shell", "zsh 5.9"],
      ["Terminal", "kitty"],
      ["CPU", "AMD Ryzen 9 9950X3D"],
      ["GPU", "AMD Radeon RX 9070 XT"],
      ["Memory", "17.4 GiB / 60.0 GiB"]
    ].forEach(function (row, index) {
      var p = document.createElement("p");
      p.className = "ff__row" + (index < 2 ? " ff__head" : "");
      if (row[0]) {
        var key = document.createElement("span");
        key.className = "ff__key";
        key.textContent = row[0];
        p.appendChild(key);
      }
      if (row[1]) {
        var value = document.createElement("span");
        value.className = "ff__value";
        value.textContent = row[1];
        p.appendChild(value);
      }
      fields.appendChild(p);
    });

    wrap.appendChild(art);
    wrap.appendChild(fields);
    log.appendChild(wrap);
  }

  function complete() {
    var commands = COMMANDS.concat(EXTRA_COMMANDS, Object.keys(window.LGLLinks || {}));
    var result = window.LGLComplete(input.value, commands, Object.keys(themeApi.themes), completionState);
    if (!result) return;
    input.value = result.value;
    if (result.matches.length > 1) line(result.matches.join("  "), "is-comment");
  }

  function run(raw) {
    var value = raw.trim();
    if (!value) return;

    if (value.toLowerCase() === "clear") {
      log.innerHTML = "";
      pendingSudo = false;
      return;
    }

    command(value);
    history.push(value);
    historyIndex = history.length;

    var parts = value.split(/\s+/);
    var name = parts[0].toLowerCase();
    var argument = parts.slice(1).join(" ");

    if (pendingSudo) {
      pendingSudo = false;
      if (value.toLowerCase() === "yes") {
        line("sudo: authentication accepted.", "is-comment");
        if (window.LGLHack) window.LGLHack();
        else line("just kidding. this is a static website.", "is-comment");
      } else {
        line("sudo: aborted. probably for the best.", "is-comment");
      }
      return;
    }

    if (name === "sudo") {
      line("We trust you have received the usual lecture from the local System");
      line("Administrator. It usually boils down to these three things:");
      line("#1) Respect the privacy of others.");
      line("#2) Think before you type.");
      line("#3) With great power comes great responsibility.");
      line("type yes to continue", "is-comment");
      pendingSudo = true;
      return;
    }

    if (name === "rm") {
      if (/(^|\s)-[a-z]*r/i.test(argument)) {
        if (window.LGLJoke) window.LGLJoke("rm -rf /");
        else line("rm: deleting everything in 5... JUST KIDDING.", "is-comment");
      } else {
        line("rm: refusing to delete anything on a website.", "is-comment");
      }
      return;
    }

    if (name === "mkdir") {
      if (window.LGLJoke) window.LGLJoke("mkdir");
      else line("mkdir: creating a very large directory... JUST KIDDING.", "is-comment");
      return;
    }

    var FUNNY = {
      vim: "you are now trapped in vim. :q! ... just kidding.",
      nano: "nano is not installed. this is a website.",
      shutdown: "nice try.",
      reboot: "nice try.",
      apt: "this is a Fedora household.",
      pacman: "wrong distro, but I respect it.",
      dnf: "dnf is not available in this terminal. try the toolkit page."
    };
    if (FUNNY[name]) {
      line(FUNNY[name], "is-comment");
      return;
    }
    if (name === "pwd") {
      line("/home/lgl");
      return;
    }
    if (name === "echo") {
      line(argument);
      return;
    }

    if (name === "doas") {
      line(window.LGLDoas || "Sorry, cinnamon rolls are out of stock. Please come back later.");
      return;
    }

    var browser = window.LGLBrowsers && window.LGLBrowsers[name];
    if (browser) {
      linkLine(browser.text, browser.url, true, browser.label);
      return;
    }

    if (window.LGLOpenLink(name)) {
      line("opening " + name + "...", "is-comment");
      return;
    }

    if (/^(cd|open|go)(\s|$)/i.test(value)) {
      if (window.LGLNavigate && window.LGLNavigate(value)) return;
      line("cd: no such directory: " + argument, "is-error");
      return;
    }

    var video = window.LGLVideo && window.LGLVideo(name);
    if (video) linkLine(video.title + " · video", video.url, true, video.label);

    if (window.LGLPanels && window.LGLPanels.open(name)) return;
    if (window.LGLNavigate && window.LGLNavigate(name)) return;

    switch (name) {
      case "help":
        COMMANDS.filter(function (item) { return item !== "help"; }).forEach(function (item) { line(item); });
        line("cd ~/videos  cd ~/projects  cd ~/about  cd ~");
        line("./about  ./videos  ./community  ./projects  ./toolkit  ./setup");
        line("twitch youtube kick github copr kofi x kineticwe noctalia fedora theblackdon finley");
        line("keychron  lsblk  lspci  sudo  rm  mkdir  pwd  echo");
        line("help");
        break;

      case "fastfetch":
        printFastfetch();
        break;

      case "ls":
        line("about/  journey/  principles/  videos/  projects/  toolkit/  setup/  community/  contact/  discounts/");
        line("ai.txt  disclaimer.txt  tdlr.txt  manifesto.txt  themes/");
        break;

      case "lsblk":
        (window.LGLLsblk ? window.LGLLsblk().split("\n") : ["lsblk: not available"]).forEach(function (row) {
          line(row);
        });
        break;

      case "lspci":
        (window.LGLLspci ? window.LGLLspci().split("\n") : ["lspci: not available"]).forEach(function (row) {
          line(row);
        });
        break;

      case "whoami":
        line("linuxgamerlife");
        break;

      case "cat":
        if (argument === "manifesto.txt" || argument === "") {
          line("Left Windows. Kept the games.");
          line("I spent decades gaming on Windows, then moved everything to Linux in 2025.");
        } else {
          line("cat: " + argument + ": No such file or directory", "is-error");
        }
        break;

      case "theme":
        if (!argument) {
          line("current: " + themeApi.current());
          line("available: " + Object.keys(themeApi.themes).join("  "));
          line("usage: theme blue");
          line("usage: theme reset");
        } else if (argument.toLowerCase() === "reset") {
          themeApi.reset();
          line("theme reset to " + themeApi.current());
        } else if (themeApi.apply(argument.toLowerCase())) {
          line("theme set to " + argument.toLowerCase());
        } else {
          line("unknown theme: " + argument, "is-error");
        }
        break;

      case "exit":
        line("there is no escape. (this is a website.)", "is-comment");
        break;

      default:
        line("command not found: " + value + '. type "help".', "is-error");
        var jokes = ["the penguin declines.", "that command is not in this timeline.", "nice try.", "even sudo would not help.", "not today."];
        line(jokes[Math.floor(Math.random() * jokes.length)], "is-comment");
    }
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
    if (event.key === "Tab") {
      event.preventDefault();
      complete();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] || "";
      completionState.value = "";
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!history.length) return;
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
      completionState.value = "";
    }
  });

  document.querySelectorAll("[data-cmd]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-cmd");
      input.focus();
      run(value);
    });
  });

  document.querySelector(".tty").addEventListener("click", function (event) {
    if (event.target.closest("a, button, input, label")) return;
    var selection = window.getSelection();
    if (selection && selection.toString().length) return;
    input.focus();
  });

  input.focus({ preventScroll: true });

  document.addEventListener("keydown", function (event) {
    if (window.LGLPanels && window.LGLPanels.isOpen()) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length !== 1) return;
    var active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) return;
    input.focus({ preventScroll: true });
    input.value += event.key;
    event.preventDefault();
  });

  line('type "help" or use a shortcut below.', "is-comment");
})();
