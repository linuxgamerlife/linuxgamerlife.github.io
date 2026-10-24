/* Terminal-style joke overlays. */
(function () {
  "use strict";

  var overlay = null;
  var timer = null;
  var lastFocus = null;
  var keyHandler = null;

  function close() {
    if (timer) clearInterval(timer);
    timer = null;
    if (keyHandler) {
      document.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    }
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function makeBox(text) {
    var width = 32;
    var inner = " " + text;
    var left = Math.max(0, Math.floor((width - inner.length) / 2));
    var right = Math.max(0, width - inner.length - left);
    var rule = "=".repeat(width + 2);
    return rule + "\n|" + " ".repeat(left) + inner + " ".repeat(right) + "|\n" + rule;
  }

  function build(label, title) {
    if (overlay) close();
    lastFocus = document.activeElement;

    overlay = document.createElement("div");
    overlay.className = "tty-joke";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "tty-joke-title");
    overlay.innerHTML = [
      '<div class="tty-joke__backdrop" data-joke-close></div>',
      '<div class="tty-joke__panel">',
      '<div class="tty-joke__bar"><span>LGL://TTY1</span><span class="tty-joke__label"></span></div>',
      '<div class="tty-joke__body">',
      '<h2 class="tty-joke__title" id="tty-joke-title"></h2>',
      '<ul class="tty-joke__log" aria-live="polite"></ul>',
      '<pre class="tty-joke__box" aria-live="polite"></pre>',
      '<p class="tty-joke__text"></p>',
      '<button class="tty-joke__close" type="button" data-joke-close>close [esc]</button>',
      "</div></div>"
    ].join("");

    overlay.querySelector(".tty-joke__label").textContent = label;
    overlay.querySelector(".tty-joke__title").textContent = title;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target.closest("[data-joke-close]")) close();
    });
    keyHandler = function (event) {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", keyHandler);

    return {
      box: overlay.querySelector(".tty-joke__box"),
      log: overlay.querySelector(".tty-joke__log"),
      text: overlay.querySelector(".tty-joke__text"),
      close: overlay.querySelector(".tty-joke__close")
    };
  }

  function addLog(refs, message) {
    var item = document.createElement("li");
    item.textContent = message;
    refs.log.appendChild(item);
  }

  function countdown(refs, prefix) {
    var n = 5;
    refs.box.textContent = makeBox(prefix + " 5...");
    refs.close.focus();

    timer = setInterval(function () {
      n -= 1;
      if (n >= 2) {
        refs.box.textContent = makeBox(prefix + " " + n + "...");
      } else {
        clearInterval(timer);
        timer = null;
        refs.box.textContent = makeBox("JUST KIDDING.");
        refs.text.textContent = "Nothing was deleted. This is a static website.";
        refs.close.focus();
      }
    }, 1000);
  }

  function openCountdown(label, title) {
    var refs = build(label, title);
    refs.text.textContent = "removing everything. please wait.";
    countdown(refs, "DELETING IN");
  }

  function openHack() {
    var refs = build("sudo", "HACKING INTO THE WEBSITE");
    refs.text.textContent = "this is definitely real.";
    var messages = [
      "installing php",
      "ignoring CVEs",
      "scanning the perimeter...",
      "ssh keys found",
      "disabling SSO",
      "disabling MFA",
      "escalating privileges...",
      "root access granted"
    ];
    var index = 0;

    function nextMessage() {
      if (index < messages.length) {
        addLog(refs, messages[index]);
        index += 1;
        timer = setTimeout(nextMessage, 1800);
      } else {
        timer = null;
        countdown(refs, "COUNTDOWN");
      }
    }

    nextMessage();
  }

  window.LGLJoke = openCountdown;
  window.LGLHack = openHack;
})();
