/* Interactive Steam launch-command builder, shared by the page and app panel. */
(function () {
  "use strict";

  function markup() {
    return '' +
      '<div class="lo-tools">' +
        '<label class="lo-search"><span aria-hidden="true">⌕</span><input type="search" data-lo-search placeholder="Filter by flag, engine, use case or explanation" aria-label="Filter launch options"></label>' +
        '<button type="button" class="lo-btn" data-lo-preset="nvidia" title="Load the NVIDIA/Wayland experimental profile">NVIDIA profile</button>' +
        '<button type="button" class="lo-btn" data-lo-preset="amd" title="Load the AMD/RADV profile">AMD profile</button>' +
        '<button type="button" class="lo-btn" data-lo-clear-selected title="Clear selected options">Clear selected</button>' +
        '<button type="button" class="lo-btn" data-lo-clear-output title="Reset the output to %command%">Clear output</button>' +
        '<button type="button" class="lo-btn lo-btn--warn" data-lo-reset title="Clear selected options, output and filters">Reset all</button>' +
      '</div>' +
      '<div class="lo-filterbar">' +
        '<span class="lo-group-label">Filter</span>' +
        '<div class="lo-fchips" data-lo-cats></div>' +
        '<div class="lo-selects">' +
          '<label>Engine<select data-lo-engine>' +
            '<option value="any">Any</option>' +
            '<option value="Source 1">Source 1</option>' +
            '<option value="Source 2">Source 2</option>' +
            '<option value="Unreal">Unreal</option>' +
            '<option value="Unity">Unity</option>' +
            '<option value="Rockstar">Rockstar</option>' +
          '</select></label>' +
          '<span class="lo-hint" data-lo-count></span>' +
        '</div>' +
      '</div>' +
      '<div class="lo-warnings" data-lo-warnings aria-live="polite"></div>' +
      '<div class="lo-tablewrap">' +
        '<table class="lo-table">' +
          '<thead><tr><th class="lo-pick-col">Pick</th><th class="lo-option-col">Launch option</th><th class="lo-scope-col">Scope</th><th class="lo-when-col">Use when</th><th>Explanation</th></tr></thead>' +
          '<tbody data-lo-rows></tbody>' +
        '</table>' +
      '</div>' +
      '<div class="lo-builder">' +
        '<div class="lo-row"><div class="lo-chips" data-lo-chips></div><span class="lo-hint">Edit placeholders like &lt;width&gt; or &lt;rate&gt; directly in the output.</span></div>' +
        '<div class="lo-output"><input type="text" spellcheck="false" data-lo-output aria-label="Generated launch options"><button type="button" class="lo-btn lo-btn--primary" data-lo-copy>Copy</button><span class="lo-copyok" data-lo-copyok hidden>Copied</span></div>' +
      '</div>';
  }

  function mount(root) {
    if (!root || root.getAttribute("data-launch-mounted")) return null;
    var data = window.LGL_LAUNCH;
    if (!data) return null;
    root.setAttribute("data-launch-mounted", "true");
    root.classList.add("lo-app");
    root.innerHTML = markup();

    var CATS = data.cats;
    var CAT_LABEL = data.catLabel;
    var OPTIONS = data.options;
    var USE_WHEN = data.useWhen;
    var PAIR_RULES = data.pairRules;
    var RENDERERS = data.renderers;
    var WINDOW_MODES = data.windowModes;
    var SYNC_MODES = data.syncModes;
    var WRAP_ORDER = { gamemoderun: 0, mangohud: 1 };

    var state = { cat: "all", engine: "any", q: "" };
    var selected = new Set();
    var shownCount = 0;

    function $(selector) { return root.querySelector(selector); }
    var tbody = $("[data-lo-rows]");
    var chips = $("[data-lo-chips]");
    var output = $("[data-lo-output]");
    var searchBox = $("[data-lo-search]");
    var warningsEl = $("[data-lo-warnings]");
    var catChipsEl = $("[data-lo-cats]");
    var engineSel = $("[data-lo-engine]");
    var countHint = $("[data-lo-count]");
    var copyOk = $("[data-lo-copyok]");

    function updateCount() {
      countHint.textContent = "Showing " + shownCount + " / " + OPTIONS.length + " · " + selected.size + " selected";
    }

    function selectedOptions() {
      return OPTIONS.filter(function (option) { return selected.has(option.id); });
    }

    function selectedKeys() {
      return new Set(selectedOptions().map(function (option) { return option.k; }));
    }

    function toggleKey(key) {
      var targets = OPTIONS.filter(function (option) { return option.k === key; });
      if (!targets.length) return;
      var allOn = targets.every(function (option) { return selected.has(option.id); });
      targets.forEach(function (option) {
        if (allOn) selected.delete(option.id);
        else selected.add(option.id);
      });
      renderRows();
      updateBuilder();
    }

    function matches(option) {
      if (state.cat !== "all" && option.c.indexOf(state.cat) === -1) return false;
      if (state.engine !== "any" && option.role === "flag" && option.e && option.e.indexOf(state.engine) === -1) return false;
      if (state.q) {
        var info = USE_WHEN[option.k];
        var hay = (option.k + " " + option.ex + " " + (info ? info.u + " " + info.p.join(" ") : "") + " " +
          (option.cr ? "community-reported " : "") + option.c.join(" ") + " " + (option.e || []).join(" ")).toLowerCase();
        if (hay.indexOf(state.q) === -1) return false;
      }
      return true;
    }

    function renderCatChips() {
      catChipsEl.replaceChildren();
      CATS.forEach(function (cat) {
        var count = OPTIONS.filter(function (option) {
          return cat.id === "all" || option.c.indexOf(cat.id) !== -1;
        }).length;
        var button = document.createElement("button");
        button.type = "button";
        button.className = "lo-fchip" + (state.cat === cat.id ? " is-active" : "");
        button.setAttribute("aria-pressed", state.cat === cat.id ? "true" : "false");
        button.appendChild(document.createTextNode(cat.label));
        var number = document.createElement("span");
        number.className = "lo-fchip__n";
        number.textContent = count;
        button.appendChild(number);
        button.addEventListener("click", function () {
          state.cat = cat.id;
          renderCatChips();
          renderRows();
        });
        catChipsEl.appendChild(button);
      });
    }

    function badge(text, className) {
      var span = document.createElement("span");
      span.className = "lo-badge lo-badge--" + className;
      span.textContent = text;
      return span;
    }

    function renderRows() {
      tbody.replaceChildren();
      var shown = OPTIONS.filter(matches);

      if (!shown.length) {
        var emptyRow = document.createElement("tr");
        var emptyCell = document.createElement("td");
        emptyCell.colSpan = 5;
        emptyCell.className = "lo-empty";
        emptyCell.textContent = "No options match these filters.";
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
      }

      shown.forEach(function (option) {
        var tr = document.createElement("tr");
        tr.dataset.id = option.id;
        if (selected.has(option.id)) tr.classList.add("is-selected");

        var pick = document.createElement("td");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = selected.has(option.id);
        checkbox.setAttribute("aria-label", "Select " + option.k);
        checkbox.addEventListener("change", function () {
          if (checkbox.checked) selected.add(option.id);
          else selected.delete(option.id);
          tr.classList.toggle("is-selected", checkbox.checked);
          updateBuilder();
        });
        pick.appendChild(checkbox);

        var keyCell = document.createElement("td");
        keyCell.className = "lo-k";
        keyCell.textContent = option.k;

        var scope = document.createElement("td");
        var badges = document.createElement("div");
        badges.className = "lo-badges";
        option.c.forEach(function (id) { badges.appendChild(badge(CAT_LABEL[id] || id, id)); });
        if (option.e && option.e.length) {
          option.e.forEach(function (engine) { badges.appendChild(badge(engine, "engine")); });
        } else if (option.role === "flag") {
          badges.appendChild(badge("Any engine", "general"));
        }
        if (option.cr) {
          var cr = badge("Community-reported", "community");
          cr.title = "Widely reported in community guides, but not documented by the engine vendor. Verify per game.";
          badges.appendChild(cr);
        }
        scope.appendChild(badges);

        var explanation = document.createElement("td");
        explanation.className = "lo-ex";
        explanation.textContent = option.ex;

        var when = document.createElement("td");
        when.className = "lo-usewhen";
        var info = USE_WHEN[option.k];
        if (info) {
          var use = document.createElement("div");
          use.textContent = info.u;
          when.appendChild(use);
          if (info.p && info.p.length) {
            var pairs = document.createElement("div");
            pairs.className = "lo-pairs";
            var label = document.createElement("span");
            label.className = "lo-pairs__label";
            label.textContent = "Pairs with";
            pairs.appendChild(label);
            info.p.forEach(function (pairKey) {
              var targets = OPTIONS.filter(function (item) { return item.k === pairKey; });
              var button = document.createElement("button");
              button.type = "button";
              button.className = "lo-pairchip" + (targets.length && targets.every(function (item) { return selected.has(item.id); }) ? " is-on" : "");
              button.textContent = pairKey;
              button.title = "Click to add or remove " + pairKey;
              button.addEventListener("click", function () { toggleKey(pairKey); });
              pairs.appendChild(button);
            });
            when.appendChild(pairs);
          }
        } else {
          when.textContent = "—";
        }

        tr.append(pick, keyCell, scope, when, explanation);
        tbody.appendChild(tr);
      });

      shownCount = shown.length;
      updateCount();
    }

    function computeWarnings() {
      var keys = selectedKeys();
      var chosen = selectedOptions();
      var list = [];
      function has(key) { return keys.has(key); }
      function add(level, title, message) { list.push({ level: level, title: title, message: message }); }

      var nvidiaOnly = chosen.filter(function (option) { return option.c.indexOf("nvidia") !== -1 && option.c.indexOf("amd") === -1; });
      var amdOnly = chosen.filter(function (option) { return option.c.indexOf("amd") !== -1 && option.c.indexOf("nvidia") === -1; });
      if (nvidiaOnly.length && amdOnly.length) {
        add("danger", "NVIDIA and AMD options mixed",
          "Selected " + nvidiaOnly[0].k + " (NVIDIA) together with " + amdOnly[0].k +
          " (AMD). Vendor-specific variables are ignored or harmful on the other GPU — keep only the set that matches your card.");
      }

      PAIR_RULES.forEach(function (rule) {
        if (has(rule.a) && has(rule.b)) add(rule.level, rule.title, rule.msg);
      });

      if (has("AMD_VULKAN_ICD=AMDVLK")) {
        var radv = chosen.filter(function (option) { return option.k.indexOf("RADV_") === 0; });
        if (radv.length) {
          add("warn", "RADV tuning with AMDVLK",
            "AMD_VULKAN_ICD=AMDVLK bypasses RADV, so " + radv.map(function (option) { return option.k; }).join(", ") +
            " has no effect. Use AMD_VULKAN_ICD=RADV or drop those variables.");
        }
      }

      var hasNvidiaOnly = chosen.some(function (option) { return option.c.indexOf("nvidia") !== -1 && option.c.indexOf("amd") === -1; });
      if (has("LOW_LATENCY_LAYER=1") && hasNvidiaOnly && !has("LOW_LATENCY_LAYER_REFLEX=1")) {
        add("info", "Low-latency layer is in Anti-Lag mode",
          "LOW_LATENCY_LAYER exposes VK_AMD_anti_lag by default. On NVIDIA hardware add LOW_LATENCY_LAYER_REFLEX=1 so the layer advertises VK_NV_low_latency2 and the game's Reflex menu is served.");
      }

      var vsyncOverrides = [
        { k: "MESA_VK_WSI_PRESENT_MODE=mailbox", what: "forces Mesa's Vulkan present mode" },
        { k: "VKD3D_SWAPCHAIN_PRESENT_MODE=mailbox", what: "forces the DX12 present mode" },
        { k: "vblank_mode=0", what: "disables frame-sync waiting" },
        { k: "-NoVSync", what: "turns vsync off for the engine" }
      ].filter(function (item) { return has(item.k); });
      if (vsyncOverrides.length) {
        add("warn", "Turn off vsync in the game",
          vsyncOverrides.map(function (item) { return item.k + " (" + item.what + ")"; }).join(", ") +
          ". These act outside the game's own settings, so set V-Sync to Off in the game's graphics menu (and match or clear MangoHud/GOverlay vsync) — otherwise the two fight and the in-game toggle appears to do nothing.");
      }

      var renderers = new Map();
      ["70", "80", "81", "90", "95", "100", "110"].forEach(function (version) {
        if (has("-dxlevel " + version)) renderers.set("DX" + version, "-dxlevel " + version);
      });
      keys.forEach(function (key) { if (RENDERERS[key]) renderers.set(RENDERERS[key], key); });
      if (renderers.size > 1) {
        add("danger", "Conflicting renderer backends",
          "The game can only use one API: " + Array.from(renderers.values()).join(", ") +
          ". Remove every renderer flag except the one you want.");
      }

      var modes = new Map();
      keys.forEach(function (key) { if (WINDOW_MODES[key]) modes.set(WINDOW_MODES[key], key); });
      if (modes.size > 1) {
        add("warn", "Conflicting window modes",
          "Both " + Array.from(modes.values()).join(" and ") +
          " are selected. The last one the game parses wins, so behaviour is unpredictable.");
      }

      var syncs = SYNC_MODES.filter(has);
      if (syncs.length > 1) {
        add("warn", "Conflicting NTSYNC switches",
          syncs.join(" and ") + " are both selected. NTSYNC is on automatically when /dev/ntsync exists; PROTON_USE_NTSYNC is the legacy opt-in and PROTON_NO_NTSYNC disables it — keep at most one.");
      }

      var engines = chosen.filter(function (option) { return option.e && option.e.length; });
      outer:
      for (var i = 0; i < engines.length; i += 1) {
        for (var j = i + 1; j < engines.length; j += 1) {
          var a = engines[i].e;
          var b = engines[j].e;
          if (!a.some(function (engine) { return b.indexOf(engine) !== -1; })) {
            add("warn", "Options from different engines",
              engines[i].k + " (" + a.join("/") + ") and " + engines[j].k + " (" + b.join("/") +
              ") come from different engines. A game only reacts to its own engine's flags; the others are dead weight and can be parsed as bogus values.");
            break outer;
          }
        }
      }

      if (has("-vulkan") && (has("VKD3D_CONFIG=dxr") || has("VKD3D_CONFIG=descriptor_heap") || has("PROTON_VKD3D_HEAP=1"))) {
        add("danger", "D3D12 translation flags with a Vulkan renderer",
          "VKD3D_* and PROTON_VKD3D_HEAP only apply when the game goes through vkd3d-proton (D3D12 → Vulkan). Forcing the game's own Vulkan renderer bypasses them.");
      }

      return list;
    }

    function renderWarnings() {
      warningsEl.replaceChildren();
      computeWarnings().forEach(function (warning) {
        var item = document.createElement("div");
        item.className = "lo-warn lo-warn--" + warning.level;
        var icon = document.createElement("span");
        icon.className = "lo-warn__icon";
        icon.textContent = warning.level === "danger" ? "⛔" : warning.level === "warn" ? "⚠" : "ℹ";
        var body = document.createElement("div");
        var title = document.createElement("div");
        title.className = "lo-warn__title";
        title.textContent = warning.title;
        var message = document.createElement("div");
        message.className = "lo-warn__msg";
        message.textContent = warning.message;
        body.append(title, message);
        item.append(icon, body);
        warningsEl.appendChild(item);
      });
    }

    function updateBuilder() {
      chips.replaceChildren();

      var chosen = selectedOptions();
      var seen = new Set();
      var unique = [];
      chosen.forEach(function (option) {
        if (!seen.has(option.k)) {
          seen.add(option.k);
          unique.push(option);
        }
      });

      var env = unique.filter(function (option) { return option.role === "env"; });
      var wrappers = unique.filter(function (option) { return option.role === "wrapper"; })
        .sort(function (a, b) {
          var aOrder = WRAP_ORDER[a.k.split(" ")[0]];
          var bOrder = WRAP_ORDER[b.k.split(" ")[0]];
          return (aOrder == null ? 9 : aOrder) - (bOrder == null ? 9 : bOrder);
        });
      var flags = unique.filter(function (option) { return option.role === "flag"; });

      [env, wrappers, flags].forEach(function (group) {
        group.forEach(function (option) {
          var chip = document.createElement("span");
          chip.className = "lo-chip" + (option.role === "flag" ? " lo-chip--flag" : "");
          chip.textContent = option.k;
          chips.appendChild(chip);
        });
      });

      var parts = [];
      env.forEach(function (option) { parts.push(option.k); });
      var gamescope = wrappers.some(function (option) { return option.k.indexOf("gamescope") === 0; });
      wrappers.forEach(function (option) { parts.push(option.k); });
      if (gamescope) parts.push("--");
      parts.push("%command%");
      flags.forEach(function (option) { parts.push(option.k); });

      output.value = parts.join(" ");
      renderWarnings();
      updateCount();
    }

    function resetFilters() {
      state.cat = "all";
      state.engine = "any";
      state.q = "";
      searchBox.value = "";
      engineSel.value = "any";
      renderCatChips();
    }

    function applyPreset(keys) {
      var wanted = new Set(keys);
      OPTIONS.forEach(function (option) {
        if (wanted.has(option.k)) selected.add(option.id);
      });
      renderRows();
      updateBuilder();
    }

    function copyOutput() {
      function done() {
        copyOk.hidden = false;
        window.setTimeout(function () { copyOk.hidden = true; }, 1200);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(output.value).then(done).catch(function () {
          output.select();
          document.execCommand("copy");
          done();
        });
      } else {
        output.select();
        document.execCommand("copy");
        done();
      }
    }

    $("[data-lo-preset='nvidia']").addEventListener("click", function () {
      selected.clear();
      resetFilters();
      applyPreset([
        "MANGOHUD=1", "PROTON_ENABLE_WAYLAND=1", "PROTON_VKD3D_HEAP=1",
        "PROTON_ENABLE_NVAPI=1", "PROTON_USE_NTSYNC=1", "LOW_LATENCY_LAYER=1",
        "LOW_LATENCY_LAYER_REFLEX=1"
      ]);
    });
    $("[data-lo-preset='amd']").addEventListener("click", function () {
      selected.clear();
      resetFilters();
      applyPreset([
        "MANGOHUD=1", "PROTON_USE_NTSYNC=1", "RADV_PERFTEST=gpl",
        "MESA_VK_WSI_PRESENT_MODE=mailbox", "LOW_LATENCY_LAYER=1", "gamemoderun"
      ]);
    });

    searchBox.addEventListener("input", function (event) {
      state.q = event.target.value.trim().toLowerCase();
      renderRows();
    });
    engineSel.addEventListener("change", function (event) {
      state.engine = event.target.value;
      renderRows();
    });

    $("[data-lo-clear-selected]").addEventListener("click", function () {
      selected.clear();
      renderRows();
      updateBuilder();
    });
    $("[data-lo-clear-output]").addEventListener("click", function () {
      output.value = "%command%";
    });
    $("[data-lo-reset]").addEventListener("click", function () {
      selected.clear();
      resetFilters();
      renderRows();
      updateBuilder();
    });
    $("[data-lo-copy]").addEventListener("click", copyOutput);

    renderCatChips();
    renderRows();
    updateBuilder();

    return {
      reset: function () {
        selected.clear();
        resetFilters();
        renderRows();
        updateBuilder();
      }
    };
  }

  function autoMount() {
    document.querySelectorAll("[data-launch-app]").forEach(mount);
  }

  window.LGLLaunchApp = { mount: mount, markup: markup };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
})();
