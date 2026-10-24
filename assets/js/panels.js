/* Shared terminal panels for every page. */
(function () {
  "use strict";

  var TEMPLATES = {
    about: [
      '<p class="tty-modal__cmd">$ cat about.txt</p>',
      '<p class="tty-note">I have been a gamer for decades. In 2025 I left Windows behind and moved completely to Linux. I am not a Linux professional, and I am not a developer. I am learning as I go, picking up tips from others, and improving my setup along the way.</p>',
      '<p class="tty-links">',
      '<button type="button" class="tty-command" data-cmd="story">story</button> <span>/</span> ',
      '<button type="button" class="tty-command" data-cmd="ai">ai</button> <span>/</span> ',
      '<button type="button" class="tty-command" data-cmd="disclaimer">disclaimer</button> <span>/</span> ',
      '<button type="button" class="tty-command" data-cmd="contact">contact</button>',
      '</p>'
    ].join(""),

    ai: [
      '<p class="tty-modal__cmd">$ cat ai.txt</p>',
      '<p class="tty-note">AI tools are part of my workflow, and I am open about it. They help me draft code, understand error messages, and get past the parts of a project where I would otherwise stall. Some of the projects here are heavily AI-assisted; the Debian installer experiment is openly described as vibecoded.</p>',
      '<p class="tty-note">What AI does not do is decide what gets published. Every script and app is run on my own systems, read through, and adjusted until I understand what it is doing. If something is untested or experimental, I say so. AI is a tool for getting started, not a substitute for testing or judgement, especially when a command is going to change your system.</p>',
      '<p class="tty-links"><button type="button" class="tty-command" data-cmd="statement">statement</button></p>'
    ].join(""),

    disclaimer: [
      '<p class="tty-modal__cmd">$ cat disclaimer.txt</p>',
      '<p class="tty-note">All instructions and commands on this site and in the videos are used at your own risk. Linux Gamer Life (LGL) and linuxgamerlife.net accept no responsibility for data loss, system damage, security issues, or any other problems.</p>',
      '<p class="tty-note">Always read and understand commands before running them.</p>',
      '<p class="tty-links"><button type="button" class="tty-command" data-cmd="legal">legal</button></p>'
    ].join(""),

    journey: [
      '<p class="tty-modal__cmd">$ cat journey.log</p>',
      '<div class="tty-row"><span class="tty-key">Before</span><div><h3>Three decades on Windows</h3><p>Gaming, tinkering and the odd fresh install, always with Windows underneath.</p></div></div>',
      '<div class="tty-row"><span class="tty-key">2025</span><div><h3>The switch</h3><p>Left Windows behind completely. Not a dual boot, not a spare machine. Everything moved.</p></div></div>',
      '<div class="tty-row"><span class="tty-key">Now</span><div><h3>Fedora and KineticWE</h3><p>Fedora as the base, KineticWE and Noctalia on Wayland, with a Mac around for the rare thing that still needs one.</p></div></div>',
      '<div class="tty-row"><span class="tty-key">Sharing</span><div><h3>Recording the process</h3><p>Videos about the wins, the mistakes, the games and the fixes. The tools are a side effect of solving my own problems.</p></div></div>',
      '<p class="tty-quote">I am learning as I go, picking up tips from others, and improving my setup along the way.</p>'
    ].join(""),

    principles: [
      '<p class="tty-modal__cmd">$ cat principles.txt</p>',
      '<ol class="tty-principles">',
      '<li><span>[01]</span><div><h3>Community</h3><p>A space where people can share what they have learned and nobody has to figure Linux out alone.</p></div></li>',
      '<li><span>[02]</span><div><h3>The journey</h3><p>The discoveries, mistakes, challenges and fixes, shown as they happen rather than after the fact.</p></div></li>',
      '<li><span>[03]</span><div><h3>Linux gaming</h3><p>An honest look at gaming on Linux from a relatively new user: the progress and the problems.</p></div></li>',
      '<li><span>[04]</span><div><h3>Indie games</h3><p>Showing how well indie and AA games run on Linux, and giving the people who make them more visibility.</p></div></li>',
      '</ol>'
    ].join(""),

    videos: [
      '<p class="tty-modal__cmd">$ ls ~/videos</p>',
      '<div class="tty-list">',
      '<a class="tty-item" href="https://www.youtube.com/playlist?list=PLLnoZ1SyCjvUGIZjfQHtchwKDyeykM2XX" target="_blank" rel="noopener"><span class="tty-key">01</span><div><h3>I Switched&hellip;</h3><p>The story of leaving Windows after decades, and what actually changed.</p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="https://www.youtube.com/playlist?list=PLEzm9EeXX1UE" target="_blank" rel="noopener"><span class="tty-key">02</span><div><h3>Linux Distro Challenge</h3><p>Six distributions, one user, and a fair amount of reinstalling.</p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="videos.html"><span class="tty-key">03</span><div><h3>Playing Games on Linux</h3><p>Actually playing the games, not just benchmarking them.</p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="videos.html"><span class="tty-key">04</span><div><h3>I Installed&hellip;</h3><p>What happens when things get installed: apps, tools and the occasional mess.</p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="https://www.youtube.com/playlist?list=PLLnoZ1SyCjvXUoptxPPi5mZBIlWPTyRUS" target="_blank" rel="noopener"><span class="tty-key">05</span><div><h3>Gaming on Linux</h3><p>What gaming on Linux is really like day to day.</p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="videos.html"><span class="tty-key">06</span><div><h3>In the Comments Section</h3><p>Answering the questions, corrections and suggestions from the community.</p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="https://www.youtube.com/playlist?list=PLLnoZ1SyCjvVTFfZdu8mbn0vjhhSGXOXc" target="_blank" rel="noopener"><span class="tty-key">07</span><div><h3>Indie Spotlight</h3><p>Indie and AA games, tested on Linux and shown off properly.</p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '</div>',
      '<p class="tty-more"><span class="tty__prompt">lgl@fedora:~$</span> <button type="button" class="tty-command" data-cmd="cd ~/videos">cd ~/videos</button> <span class="tty-comment"># all series</span></p>'
    ].join(""),

    projects: [
      '<p class="tty-modal__cmd">$ ls ~/projects</p>',
      '<p class="tty-note">I am not a developer. These are small tools I made because I needed them, shared in the hope they save someone else a job. They are MIT licensed and used at your own risk.</p>',
      '<p class="tty-note" data-projects-count></p>',
      '<div class="tty-list" data-projects-list></div>',
      '<p class="tty-more"><span class="tty__prompt">lgl@fedora:~$</span> <button type="button" class="tty-command" data-cmd="cd ~/projects">cd ~/projects</button> <span class="tty-comment"># full project page</span></p>'
    ].join(""),

    toolkit: [
      '<p class="tty-modal__cmd">$ cat toolkit.txt</p>',
      '<p class="tty-note">One Copr repo for the LGL desktop apps. Enable it once, then install what you need.</p>',
      '<div class="tty-code-block">',
      '<p class="tty-code" id="toolkit-cmd">sudo dnf copr enable linuxgamerlife/lgl-toolkit<br>sudo dnf install lgl-system-loadout</p>',
      '<button type="button" class="tty-copy" data-copy="#toolkit-cmd">copy</button>',
      '</div>',
      '<p class="tty-more"># in the toolkit</p>',
      '<div class="tty-list">',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">01</span><div><h3>System Loadout</h3><p>Fedora setup wizard. <span class="tty-comment">lgl-system-loadout</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">02</span><div><h3>Papercutter</h3><p>Wallpaper editor. <span class="tty-comment">lgl-papercutter</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">03</span><div><h3>Scheduler Manager</h3><p>sched-ext front end. <span class="tty-comment">lgl-scheduler-manager</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">04</span><div><h3>Colour Picker</h3><p>Sample and copy colours. <span class="tty-comment">lgl-colour-picker</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">05</span><div><h3>Emoji Picker</h3><p>Search and copy emoji. <span class="tty-comment">lgl-emoji-picker</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">06</span><div><h3>DNF Helper</h3><p>Inspect RPM packages and dependencies. <span class="tty-comment">lgl-dnf-helper</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">07</span><div><h3>Keychron Helper</h3><p>Configure Keychron keyboards. <span class="tty-comment">lgl-keychron-helper</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '</div>',
      '<p class="tty-more"># separate repos</p>',
      '<div class="tty-list">',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">08</span><div><h3>Power Profile Manager</h3><p>Switch tuned profiles. <span class="tty-comment">lgl-powerprofile-manager</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">09</span><div><h3>cliamp</h3><p>Terminal music player. <span class="tty-comment">lgl-cliamp</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '<a class="tty-item" href="toolkit.html"><span class="tty-key">10</span><div><h3>VM Curator</h3><p>QEMU/KVM TUI. <span class="tty-comment">lgl-vm-curator</span></p></div><span class="tty-btn" aria-hidden="true">open</span></a>',
      '</div>',
      '<p class="tty-more"><span class="tty__prompt">lgl@fedora:~$</span> <button type="button" class="tty-command" data-cmd="cd ~/toolkit">cd ~/toolkit</button> <span class="tty-comment"># install guide</span></p>'
    ].join(""),

    discounts: [
      '<p class="tty-modal__cmd">$ cat discounts.txt</p>',
      '<p class="tty-note">Affiliate and referral links. A purchase may earn the channel a commission or credit, at no extra cost to you. Codes, stock and prices can change, so check the final price at the shop.</p>',
      '<div class="tty-list">',
      '<div class="tty-item"><span class="tty-key">01</span><div><h3><a href="https://x.la/@linuxgamerlife/dune-awakening-store" target="_blank" rel="noopener sponsored">Dune: Awakening</a></h3><p>Code AGCO7U · 10% off</p><button type="button" class="tty-copy" data-copy="AGCO7U">copy code</button></div><a class="tty-btn" href="https://x.la/@linuxgamerlife/dune-awakening-store" target="_blank" rel="noopener sponsored">open</a></div>',
      '<div class="tty-item"><span class="tty-key">02</span><div><h3><a href="https://x.la/@linuxgamerlife/conan-exiles" target="_blank" rel="noopener sponsored">Conan Exiles</a></h3><p>Code QOL9UH · 20% off</p><button type="button" class="tty-copy" data-copy="QOL9UH">copy code</button></div><a class="tty-btn" href="https://x.la/@linuxgamerlife/conan-exiles" target="_blank" rel="noopener sponsored">open</a></div>',
      '<div class="tty-item"><span class="tty-key">03</span><div><h3><a href="https://www.keychron.com/?ref=linuxgamerlife" target="_blank" rel="noopener sponsored">Keychron keyboards and mice</a></h3><p>Referral link</p></div><a class="tty-btn" href="https://www.keychron.com/?ref=linuxgamerlife" target="_blank" rel="noopener sponsored">open</a></div>',
      '<div class="tty-item"><span class="tty-key">04</span><div><h3><a href="https://nodecraft.com/r/linuxgamerlife" target="_blank" rel="noopener sponsored">Nodecraft game servers</a></h3><p>30% off</p></div><a class="tty-btn" href="https://nodecraft.com/r/linuxgamerlife" target="_blank" rel="noopener sponsored">open</a></div>',
      '<div class="tty-item"><span class="tty-key">05</span><div><h3><a href="https://www.boot.dev?promo=LINUXGAMERLIFE" target="_blank" rel="noopener sponsored">boot.dev</a></h3><p>25% off with LINUXGAMERLIFE</p><button type="button" class="tty-copy" data-copy="LINUXGAMERLIFE">copy code</button></div><a class="tty-btn" href="https://www.boot.dev?promo=LINUXGAMERLIFE" target="_blank" rel="noopener sponsored">open</a></div>',
      '<div class="tty-item"><span class="tty-key">06</span><div><h3><a href="https://go.getproton.me/SH2Jq" target="_blank" rel="noopener sponsored">Proton VPN</a></h3><p>Referral link</p></div><a class="tty-btn" href="https://go.getproton.me/SH2Jq" target="_blank" rel="noopener sponsored">open</a></div>',
      '</div>',
      '<p class="tty-more"><span class="tty__prompt">lgl@fedora:~$</span> <button type="button" class="tty-command" data-cmd="cd ~/setup">cd ~/setup</button> <span class="tty-comment"># full setup and deals</span></p>'
    ].join(""),

    setup: [
      '<p class="tty-modal__cmd">$ cat setup.txt</p>',
      '<dl class="tty-facts">',
      '<div><dt>OS</dt><dd>Fedora Linux 44</dd></div>',
      '<div><dt>Kernel</dt><dd>7.2.11-200.fc44</dd></div>',
      '<div><dt>CPU</dt><dd>AMD Ryzen 9 9950X3D</dd></div>',
      '<div><dt>GPU</dt><dd>AMD Radeon RX 9070 XT</dd></div>',
      '<div><dt>Memory</dt><dd>64 GB</dd></div>',
      '<div><dt>Session</dt><dd>Wayland / KineticWE</dd></div>',
      '<div><dt>Shell</dt><dd>zsh / kitty</dd></div>',
      '</dl>',
      '<p class="tty-links">',
      '<button type="button" class="tty-command" data-cmd="cd ~/setup">cd ~/setup</button> <span>/</span> ',
      '<button type="button" class="tty-command" data-cmd="mainmachine">mainmachine</button>',
      '</p>'
    ].join(""),

    contact: [
      '<p class="tty-modal__cmd">$ cat contact.txt</p>',
      '<p class="tty-note">There is no contact form and no mailing list. The quickest way to reach me is in the comments on YouTube, in chat on Twitch, or by opening an issue on GitHub. Bug reports with a clear description and the command you ran are always welcome.</p>',
      '<p class="tty-links">',
      '<button type="button" class="tty-command" data-cmd="youtube">youtube</button> <span>/</span> ',
      '<button type="button" class="tty-command" data-cmd="twitch">twitch</button> <span>/</span> ',
      '<button type="button" class="tty-command" data-cmd="github">github</button>',
      '</p>'
    ].join(""),

    tdlr: [
      '<p class="tty-modal__cmd">$ cat tdlr.txt</p>',
      '<h3 class="tty-community">The short version</h3>',
      '<p class="tty-note">I am not a Linux professional, and I am not a developer. I am learning as I go, using AI tools carefully, picking up tips from other people, and improving my setup along the way. Sometimes I still reach for the Mac for DaVinci Resolve or Ableton, and I know I am lucky to have that option.</p>',
      '<p class="tty-note">This site is about the journey: what works, what does not, and how I deal with the challenges in between. If you are thinking about switching, or you are just curious what gaming and everyday life on Linux is really like, I hope you will stick around.</p>',
      '<p class="tty-note">Happy Linux-ing. lgl</p>'
    ].join("")
  };

  var CONTENT = ["about", "journey", "principles", "videos", "projects", "toolkit", "setup", "community", "contact", "discounts", "ai", "disclaimer", "tdlr"];
  var ALIASES = { tldr: "tdlr" };

  var modal = null;
  var body = null;
  var titleEl = null;
  var form = null;
  var input = null;
  var statusEl = null;
  var lastFocus = null;
  var history = [];
  var historyIndex = -1;
  var completionState = { value: "", matches: [], index: -1 };
  var pendingSudo = false;

  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "tty-modal";
    modal.id = "tty-modal";
    modal.hidden = true;
    modal.innerHTML = [
      '<div class="tty-modal__backdrop" data-close></div>',
      '<div class="tty-modal__panel" role="dialog" aria-modal="true" aria-labelledby="tty-modal-title" tabindex="-1">',
      '<div class="tty-modal__bar"><span id="tty-modal-title">panel</span></div>',
      '<div class="tty-modal__body" id="tty-modal-body"></div>',
      '<p class="tty-modal__status" id="tty-modal-status" aria-live="polite" hidden></p>',
      '<form class="tty-modal__form" id="tty-modal-form">',
      '<label class="tty__sr" for="tty-modal-input">Type exit to close</label>',
      '<span class="tty__prompt" aria-hidden="true">lgl@fedora:~$</span>',
      '<input class="tty-modal__input" id="tty-modal-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="exit / esc to close">',
      '</form>',
      '</div>'
    ].join("");
    document.body.appendChild(modal);

    body = document.getElementById("tty-modal-body");
    titleEl = document.getElementById("tty-modal-title");
    form = document.getElementById("tty-modal-form");
    input = document.getElementById("tty-modal-input");
    statusEl = document.getElementById("tty-modal-status");

    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) {
        close();
        return;
      }
      var commandButton = event.target.closest("[data-cmd]");
      if (commandButton) {
        run(commandButton.getAttribute("data-cmd"));
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        if (document.querySelector(".tty-joke")) return;
        event.preventDefault();
        close();
      }
    });

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
      if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();
        complete();
      }
    });

    modal.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      if (document.activeElement === input) return;
      var focusable = modal.querySelectorAll("a[href], button:not([disabled]), input");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function status(text) {
    ensureModal();
    if (!text) {
      statusEl.hidden = true;
      statusEl.textContent = "";
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = text;
  }

  function renderProjects() {
    var list = body.querySelector("[data-projects-list]");
    var count = body.querySelector("[data-projects-count]");
    if (!list) return;
    var data = window.LGL_PROJECTS;
    if (!data || !data.projects) {
      var missing = document.createElement("p");
      missing.className = "tty-note";
      missing.textContent = "Project data could not be loaded.";
      list.replaceWith(missing);
      return;
    }
    var labels = { apps: "Desktop app", setup: "Setup script", desktop: "Desktop", experiments: "Experiment" };
    list.replaceChildren();
    data.projects.forEach(function (project, index) {
      var row = document.createElement("a");
      row.className = "tty-item";
      row.href = project.repo_url || "https://github.com/linuxgamerlife/" + project.repo;
      row.target = "_blank";
      row.rel = "noopener";

      var number = document.createElement("span");
      number.className = "tty-key";
      number.textContent = String(index + 1).padStart(2, "0");

      var bodyEl = document.createElement("div");
      var title = document.createElement("h3");
      title.textContent = project.title;
      var meta = document.createElement("p");
      var text = labels[project.category] || project.category || "";
      if (project.tags && project.tags.length) {
        text += (text ? " / " : "") + project.tags.slice(0, 2).join(", ");
      }
      meta.textContent = text;
      bodyEl.appendChild(title);
      bodyEl.appendChild(meta);

      var arrow = document.createElement("span");
      arrow.className = "tty-btn";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "open";

      row.appendChild(number);
      row.appendChild(bodyEl);
      row.appendChild(arrow);
      list.appendChild(row);
    });
    if (count) count.textContent = data.projects.length + " projects";
  }

  function open(name) {
    ensureModal();
    var key = ALIASES[name] || name;
    if (!TEMPLATES[key]) return false;
    lastFocus = document.activeElement;
    titleEl.textContent = key;
    body.innerHTML = TEMPLATES[key];
    if (key === "projects") renderProjects();
    status("");
    modal.hidden = false;
    document.body.classList.add("tty-modal-open");
    body.scrollTop = 0;
    input.value = "";
    historyIndex = history.length;
    completionState.value = "";
    pendingSudo = false;
    input.focus({ preventScroll: true });
    return true;
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("tty-modal-open");
    pendingSudo = false;
    status("");
    var target = document.getElementById("tty-input") || document.getElementById("site-tty-input") || lastFocus;
    if (target && typeof target.focus === "function") target.focus({ preventScroll: true });
  }

  function isOpen() {
    return !!(modal && !modal.hidden);
  }

  function complete() {
    var commands = CONTENT.concat([
      "tldr", "exit", "theme", "cd", "story", "contact", "statement", "mainmachine", "legal",
      "help", "ls", "lsblk", "lspci", "clear", "sudo", "rm", "mkdir", "pwd", "echo",
      "whoami", "cat", "fastfetch", "vim", "nano", "shutdown", "reboot", "apt", "pacman", "dnf"
    ]).concat(Object.keys(window.LGLLinks || {}));
    var result = window.LGLComplete(input.value, commands, Object.keys(window.LGLTheme.themes), completionState);
    if (!result) return;
    input.value = result.value;
    if (result.matches.length > 1) {
      status(result.matches.join("  "));
    } else {
      status("");
    }
  }

  function run(raw) {
    ensureModal();
    var value = String(raw || "").trim();
    if (!value) return;
    history.push(value);
    historyIndex = history.length;
    var parts = value.split(/\s+/);
    var name = parts[0].toLowerCase();
    var argument = parts.slice(1).join(" ");
    var key = ALIASES[name] || name;

    if (pendingSudo) {
      pendingSudo = false;
      if (value.toLowerCase() === "yes") {
        status("sudo: authentication accepted.");
        if (window.LGLHack) window.LGLHack();
        else status("just kidding. this is a static website.");
      } else {
        status("sudo: aborted. probably for the best.");
      }
      return;
    }

    if (name === "sudo") {
      status("We trust you have received the usual lecture from the local System\nAdministrator. It usually boils down to these three things:\n#1) Respect the privacy of others.\n#2) Think before you type.\n#3) With great power comes great responsibility.\ntype yes to continue");
      pendingSudo = true;
      return;
    }

    if (name === "rm") {
      if (/(^|\s)-[a-z]*r/i.test(argument)) {
        if (window.LGLJoke) window.LGLJoke("rm -rf /");
        else status("rm: deleting everything in 5... JUST KIDDING.");
      } else {
        status("rm: refusing to delete anything on a website.");
      }
      return;
    }

    if (name === "mkdir") {
      if (window.LGLJoke) window.LGLJoke("mkdir");
      else status("mkdir: creating a very large directory... JUST KIDDING.");
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
      status(FUNNY[name]);
      return;
    }

    if (name === "pwd") {
      status("/home/lgl");
      return;
    }
    if (name === "echo") {
      status(argument);
      return;
    }
    if (name === "whoami") {
      status("linuxgamerlife");
      return;
    }
    if (name === "cat") {
      if (!argument || argument.toLowerCase() === "manifesto.txt") {
        status("Left Windows. Kept the games.\nI spent decades gaming on Windows, then moved everything to Linux in 2025.");
      } else {
        status("cat: " + argument + ": No such file or directory");
      }
      return;
    }
    if (name === "fastfetch") {
      status(window.LGLFastfetch ? window.LGLFastfetch() : "fastfetch: not available");
      return;
    }

    if (name === "exit") {
      close();
      return;
    }
    if (name === "clear") {
      status("");
      return;
    }
    if (name === "help") {
      status("about  journey  principles  videos  projects  toolkit  setup  community  discounts  ai  disclaimer  tdlr\nstory  contact  statement  mainmachine  legal\n./about  ./videos  ./community  ./projects  ./toolkit  ./setup\ncd ~/videos  theme <name>  ls  lsblk  lspci\nsudo  rm  mkdir  pwd  echo  whoami  cat  fastfetch  exit");
      return;
    }
    if (name === "ls") {
      status("about/  journey/  principles/  videos/  projects/  toolkit/  setup/  community/  contact/  discounts/\ntdlr.txt  ai.txt  disclaimer.txt  themes/");
      return;
    }
    if (name === "lsblk") {
      status(window.LGLLsblk ? window.LGLLsblk() : "lsblk: not available");
      return;
    }
    if (name === "lspci") {
      status(window.LGLLspci ? window.LGLLspci() : "lspci: not available");
      return;
    }
    if (name === "theme") {
      if (!argument) {
        status("current: " + window.LGLTheme.current() + "\navailable: " + Object.keys(window.LGLTheme.themes).join("  ") + "\nusage: theme blue");
      } else if (argument.toLowerCase() === "reset") {
        window.LGLTheme.reset();
        status("theme reset to " + window.LGLTheme.current());
      } else if (window.LGLTheme.apply(argument.toLowerCase())) {
        status("theme set to " + argument.toLowerCase());
      } else {
        status("unknown theme: " + argument);
      }
      return;
    }
    if (window.LGLOpenLink && window.LGLOpenLink(name)) {
      status("opening " + name + "...");
      return;
    }
    if (/^(cd|open|go)(\s|$)/i.test(value)) {
      if (window.LGLNavigate && window.LGLNavigate(value)) return;
      status("cd: no such directory: " + argument);
      return;
    }
    if (TEMPLATES[key]) {
      open(key);
      return;
    }
    if (window.LGLNavigate && window.LGLNavigate(name)) return;
    status('command not found: "' + value + '". type help.');
  }

  window.LGLPanels = {
    open: open,
    close: close,
    isOpen: isOpen,
    content: CONTENT,
    aliases: ALIASES
  };
})();
