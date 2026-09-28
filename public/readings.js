/* Meeting in a Pocket -- reading app.
   Reads window.AA_CONTENT (content.js) and renders:
     - a grouped table of contents (nav#toc)
     - one section at a time in the reading pane (main#reading / #article)
   On a phone, body[data-view] flips between "home" (contents) and "read"
   (article); style.css shows both side by side once the screen is wide
   enough that data-view stops mattering. The selected section is kept in
   location.hash so a link or a reload lands on the same page.
   Also keeps the "Names & Numbers" notes box saved to this browser only
   (localStorage), never sent anywhere. */
(function () {
  var data = window.AA_CONTENT;
  if (!data) return; // content.js failed to load; nothing to render

  var tocGroups = document.getElementById("tocGroups");
  var article = document.getElementById("article");
  var positionEl = document.getElementById("position");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var backBtn = document.getElementById("backBtn");

  document.getElementById("tagline").textContent = data.tagline;
  document.getElementById("disclaimer").textContent = data.disclaimer;

  // Flatten groups -> sections once, so "previous/next" can walk the whole
  // booklet and the toc buttons don't need to re-derive this each render.
  var flat = [];
  data.groups.forEach(function (g) {
    g.sections.forEach(function (s) { flat.push({ group: g.label, section: s }); });
  });
  var byId = {};
  flat.forEach(function (entry, i) { byId[entry.section.id] = i; });

  var currentIndex = 0;

  // ---- Table of contents -------------------------------------------------
  data.groups.forEach(function (g) {
    var wrap = document.createElement("div");
    wrap.className = "toc-group";

    var h = document.createElement("h2");
    h.textContent = g.label;
    wrap.appendChild(h);

    var list = document.createElement("ul");
    list.className = "toc-list";
    g.sections.forEach(function (s) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toc-btn";
      btn.dataset.sectionId = s.id;

      var label = document.createElement("span");
      label.textContent = s.title;
      btn.appendChild(label);

      var chev = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      chev.setAttribute("class", "chev");
      chev.setAttribute("width", "16"); chev.setAttribute("height", "16");
      chev.setAttribute("viewBox", "0 0 24 24"); chev.setAttribute("fill", "none");
      chev.setAttribute("stroke", "currentColor"); chev.setAttribute("stroke-width", "2.4");
      chev.setAttribute("stroke-linecap", "round"); chev.setAttribute("stroke-linejoin", "round");
      chev.setAttribute("aria-hidden", "true");
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M9 18l6-6-6-6");
      chev.appendChild(path);
      btn.appendChild(chev);

      btn.addEventListener("click", function () { select(byId[s.id], true); });
      li.appendChild(btn);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    tocGroups.appendChild(wrap);
  });

  // ---- Block renderers -----------------------------------------------------
  // Each content.js block type maps to one small DOM builder.
  var renderers = {
    p: function (b) {
      var p = document.createElement("p");
      p.className = "rblock rblock-p";
      p.textContent = b.text;
      return p;
    },
    h: function (b) {
      var h = document.createElement("h3");
      h.className = "rblock rblock-h";
      h.textContent = b.text;
      return h;
    },
    cite: function (b) {
      var p = document.createElement("p");
      p.className = "rblock rblock-cite";
      p.textContent = b.text;
      return p;
    },
    n: function (b) {
      var row = document.createElement("div");
      row.className = "rblock rblock-n";
      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = b.num;
      var p = document.createElement("p");
      p.textContent = b.text;
      row.appendChild(badge);
      row.appendChild(p);
      return row;
    },
    lead: function (b) {
      var p = document.createElement("p");
      p.className = "rblock rblock-lead";
      var strong = document.createElement("strong");
      strong.textContent = b.t;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(" " + b.d));
      return p;
    },
    kv: function (b) {
      var wrap = document.createElement("div");
      wrap.className = "rblock rblock-kv";
      var p = document.createElement("p");
      var strong = document.createElement("strong");
      strong.textContent = b.t;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(" — " + b.d));
      wrap.appendChild(p);
      if (b.r) {
        var ref = document.createElement("p");
        ref.className = "ref";
        ref.textContent = b.r;
        wrap.appendChild(ref);
      }
      return wrap;
    },
    row: function (b) {
      var row = document.createElement("div");
      row.className = "rblock rblock-row";
      var a = document.createElement("span"); a.textContent = b.t;
      var c = document.createElement("span"); c.textContent = b.d;
      row.appendChild(a); row.appendChild(c);
      return row;
    }
  };

  // The "Names & Numbers" section is interactive rather than static text:
  // a textarea saved only to this browser's localStorage.
  function renderNotesBox() {
    var KEY = "aa.namesNumbers";
    var wrap = document.createElement("div");

    var hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Jot down your sponsor, home group and phone numbers here. They stay on this device only (saved in this browser, never sent anywhere).";
    wrap.appendChild(hint);

    var label = document.createElement("label");
    label.className = "sr-only";
    label.setAttribute("for", "names");
    label.textContent = "Names and numbers";
    wrap.appendChild(label);

    var box = document.createElement("textarea");
    box.id = "names";
    box.rows = 10;
    box.placeholder = "Name – number";
    wrap.appendChild(box);

    var status = document.createElement("p");
    status.className = "hint";
    status.id = "namesStatus";
    status.setAttribute("role", "status");
    wrap.appendChild(status);

    try {
      box.value = localStorage.getItem(KEY) || "";
    } catch (e) {
      status.textContent = "This browser won’t save notes (private mode?).";
      return wrap;
    }

    var timer = null;
    box.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        try {
          localStorage.setItem(KEY, box.value);
          status.textContent = "Saved on this device.";
        } catch (e) {
          status.textContent = "Couldn’t save on this browser.";
        }
      }, 400);
    });

    return wrap;
  }

  // ---- Rendering the current section -------------------------------------
  function render() {
    var entry = flat[currentIndex];
    if (!entry) return;
    var s = entry.section;

    article.innerHTML = "";

    var kicker = document.createElement("div");
    kicker.className = "hint kicker";
    kicker.textContent = entry.group;
    article.appendChild(kicker);

    var h2 = document.createElement("h2");
    h2.textContent = s.title;
    article.appendChild(h2);

    if (s.notes) {
      article.appendChild(renderNotesBox());
    } else {
      s.blocks.forEach(function (b) {
        var build = renderers[b.type];
        if (build) article.appendChild(build(b));
      });
    }

    positionEl.textContent = (currentIndex + 1) + " of " + flat.length;

    // Highlight the active row in the table of contents.
    var buttons = tocGroups.querySelectorAll(".toc-btn");
    buttons.forEach(function (btn) {
      var active = btn.dataset.sectionId === s.id;
      btn.setAttribute("aria-current", active ? "true" : "false");
    });

    // Previous / next through the whole booklet.
    var prev = flat[currentIndex - 1];
    var next = flat[currentIndex + 1];
    setPagerButton(prevBtn, prev, "Previous");
    setPagerButton(nextBtn, next, "Next");
  }

  function setPagerButton(btn, entry, label) {
    if (!entry) { btn.hidden = true; btn.onclick = null; return; }
    btn.hidden = false;
    btn.innerHTML = "";
    var k = document.createElement("span"); k.className = "k"; k.textContent = label;
    var t = document.createElement("span"); t.className = "t"; t.textContent = entry.section.title;
    btn.appendChild(k); btn.appendChild(t);
    btn.onclick = function () { select(byId[entry.section.id], true); };
  }

  // Select a section by its flattened index. `showRead` switches the phone
  // to the reading view (ignored on a wide screen where both panes show).
  function select(index, showRead) {
    if (index < 0 || index >= flat.length) return;
    currentIndex = index;
    render();
    if (showRead) document.body.dataset.view = "read";
    article.scrollTop = 0;
    window.scrollTo(0, 0);
    history.replaceState(null, "", "#" + flat[index].section.id);
  }

  backBtn.addEventListener("click", function () {
    document.body.dataset.view = "home";
    window.scrollTo(0, 0);
  });

  // Land on the section named in the URL hash, if any; otherwise start at
  // the first section but stay on the contents screen on a phone.
  var hashId = decodeURIComponent(location.hash.replace("#", ""));
  if (hashId && byId.hasOwnProperty(hashId)) {
    select(byId[hashId], true);
  } else {
    select(0, false);
  }
})();
