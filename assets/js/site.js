/* Shared site code: settings, header/footer, helpers. Loads on every page. */
(function () {
  /* ---- Settings: edit these ----
     BEFORE GOING LIVE: phone and whatsapp below are dummy numbers (07700 900xxx is a
     reserved range that never connects) and the email domain does not match the site
     domain in CNAME. Replace all three, or every "call us" and "WhatsApp us" button on
     the site goes nowhere. */
  window.SITE = {
    draft: false,                             // true shows dashed boxes around things to fill in
    name: "Carvantage",
    tagline: "Look closer",
    url: "https://carvantage.uk",           // public address, no trailing slash (used for sharing links)
    town: "Altrincham",                       // where the cars are
    area: "Greater Manchester and Cheshire",  // wider area for the hero
    owner: "Abdullah",                        // owner's first name
    phone: "07700 900123",                    // shown on the site. DUMMY: replace
    whatsapp: "447700900123",                 // digits only, international format. DUMMY: replace
    email: "hello@carvantage.co.uk",          // DUMMY: replace
    instagram: "carvantage",                  // handle without @
    viewings: "By appointment, seven days a week, usually 9am to 8pm. We'll send the exact location when you book.",
    heroPhoto: "",                            // e.g. "assets/img/hero.jpg". Empty shows the brand panel
    ownerPhoto: "",                           // e.g. "assets/img/owner.jpg". Empty hides the photo box
    minPrice: 1000, maxPrice: 5000,
    reviews: [
      /* { name: "Sam", car: "Ford Fiesta", text: "..." } */
    ]
  };

  var S = window.SITE;
  var ICON = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M16 42V16h26M84 58v26H58" fill="none" stroke="#FF6A4D" stroke-width="8"/><path d="M62 36A20 20 0 1 0 62 64" fill="none" stroke="#F4F4F2" stroke-width="12"/></svg>';
  var WORDMARK = '<span class="wordmark" aria-hidden="true"><span>carvantage</span></span>';
  var WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z"/></svg>';
  var CAR = '<svg class="car-shape" viewBox="0 0 200 80" fill="currentColor" aria-hidden="true"><path d="M8 64 3 42Q2 31 9 25L31 7Q38 1 48 1h62q11 0 19 7l26 19 31 5q11 2 12 13v11q0 8-8 8Z"/><circle class="hub" cx="46" cy="64" r="16" stroke="currentColor" stroke-width="6"/><circle class="hub" cx="158" cy="64" r="16" stroke="currentColor" stroke-width="6"/></svg>';
  window.ICONS = { logo: ICON, wa: WA, car: CAR };

  /* ---- Helpers ---- */
  var U = window.U = {
    gbp: function (n) { return "£" + Math.round(n).toLocaleString("en-GB"); },
    miles: function (n) { return n.toLocaleString("en-GB") + " miles"; },
    monthYear: function (iso) {
      var d = new Date(iso.length === 7 ? iso + "-01" : iso);
      return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    },
    motLabel: function (iso) {
      var d = new Date(iso), now = new Date();
      var months = (d.getFullYear() - now.getFullYear()) * 12 + d.getMonth() - now.getMonth();
      var expired = d < now;
      return { text: expired ? "MOT expired" : "MOT to " + U.monthYear(iso), date: expired ? "Expired" : U.monthYear(iso), short: months < 6, expired: expired };
    },
    title: function (c) { return c.year + " " + c.make + " " + c.model; },
    esc: function (s) { return String(s).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); },
    waLink: function (text) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text); },
    param: function (k) { return new URLSearchParams(location.search).get(k); },
    byId: function (id) { return (window.CARS || []).find(function (c) { return c.id === id; }); },
    available: function () { return (window.CARS || []).filter(function (c) { return c.status !== "sold"; }); },
    photoUrl: function (c, i) { return c.photos && c.photos[i] ? c.photos[i] : null; }
  };

  /* Car card used on the homepage and browse page */
  U.carCard = function (c) {
    var mot = U.motLabel(c.mot);
    var tags = (c.features || []).slice(0, 2).map(function (f) {
      var good = /history|owner|cambelt|two keys|fresh mot|long mot/i.test(f);
      return '<span class="tag' + (good ? " good" : "") + '">' + U.esc(f) + "</span>";
    }).join("");
    var photo = c.photos && c.photos[0]
      ? '<img src="' + U.esc(c.photos[0]) + '" alt="' + U.esc(U.title(c)) + '" width="800" height="600" loading="lazy" decoding="async">'
      : '<div class="placeholder">' + CAR + '<span>Photos coming soon</span></div>';
    var statusWord = { available: "Available", reserved: "Reserved", sold: "Sold" }[c.status];
    return '<article class="car-card is-' + c.status + '">' +
      '<div class="shot">' + photo + '<span class="mark">' + ICON + '</span>' +
      '<span class="status status-pill ' + c.status + '">' + statusWord + '</span></div>' +
      '<div class="body">' +
      '<div class="card-heading"><div><h3><a href="car.html?id=' + U.esc(c.id) + '">' + U.esc(U.title(c)) + '</a></h3><p class="trim">' + U.esc(c.trim) + '</p></div><p class="price num">' + U.gbp(c.price) + "</p></div>" +
      '<dl class="card-spec num"><div><dt>Mileage</dt><dd>' + c.miles.toLocaleString("en-GB") + '</dd></div><div><dt>' + (mot.expired ? "MOT" : "MOT to") + '</dt><dd' + (mot.short ? ' class="short"' : '') + '>' + (mot.expired ? "Fresh one before sale" : U.monthYear(c.mot)) + '</dd></div><div><dt>Fuel</dt><dd>' + U.esc(c.fuel) + '</dd></div><div><dt>Gearbox</dt><dd>' + U.esc(c.gearbox) + "</dd></div></dl>" +
      '<div class="tags">' + tags + "</div>" +
      "</div></article>";
  };

  /* ---- Header and footer ---- */
  var page = location.pathname.split("/").pop() || "index.html";
  var links = [["index.html", "Home"], ["cars.html", "Cars for sale"], ["sell.html", "Sell your car"], ["index.html#about", "About us"], ["index.html#contact", "Contact"]];
  var nav = links.map(function (l) {
    var cur = l[0] === page ? ' aria-current="page"' : "";
    return '<a href="' + l[0] + '"' + cur + ">" + l[1] + "</a>";
  }).join("");
  var head = document.getElementById("site-head");
  if (head) {
    head.className = "site-head";
    head.innerHTML = (S.draft ? '<div class="draft-note"><div class="wrap"><span>Draft: things in <i></i> dashed boxes are placeholders to replace in <code>assets/js/site.js</code> and <code>cars.js</code>.</span></div></div>' : "") +
      '<div class="wrap"><a class="lockup" href="index.html" aria-label="' + S.name + ' home">' + WORDMARK + "</a>" +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
      '<nav class="site-nav" id="site-nav" aria-label="Main">' + nav + "</nav>" +
      '<a class="btn wa sm" href="' + U.waLink("Hi " + S.owner + ", I'm looking at your cars on the website.") + '" target="_blank" rel="noopener" aria-label="WhatsApp us">' + WA + '<span class="t">WhatsApp us</span></a></div>';
    var btn = head.querySelector(".menu-btn"), menu = head.querySelector(".site-nav");
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Close" : "Menu";
    });
  }
  var foot = document.getElementById("site-foot");
  if (foot) {
    foot.className = "site-foot";
    foot.innerHTML = '<div class="wrap"><a class="lockup" href="index.html" style="font-size:1.2rem">' + WORDMARK + "</a>" +
      "<nav aria-label=\"Footer\">" + nav + '<a href="mailto:' + S.email + '">' + S.email + "</a></nav>" +
      '<p class="legal">' + S.name + " is a sole trader selling used cars in <span data-cfg=\"town\"></span>. Prices include VAT where applicable. No admin fees. © " + new Date().getFullYear() + "</p></div>";
  }

  /* ---- Icons and budget selects that would otherwise be pasted into each page ---- */
  document.querySelectorAll("[data-icon]").forEach(function (el) { el.innerHTML = ICONS[el.getAttribute("data-icon")] || ""; });
  U.budgetSteps = function () {
    var steps = [], step = 1000, from = Math.ceil((S.minPrice + step) / step) * step;
    for (var v = from; v <= S.maxPrice; v += step) steps.push(v);
    return steps;
  };
  document.querySelectorAll("select[data-budget]").forEach(function (sel) {
    var def = sel.getAttribute("data-default") || "";
    sel.innerHTML = '<option value="">Any price</option>' + U.budgetSteps().map(function (v) {
      return '<option value="' + v + '"' + (String(v) === def ? " selected" : "") + ">Up to " + U.gbp(v) + "</option>";
    }).join("");
  });

  /* ---- Fill in settings on the page ---- */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    if (key === "whatsapp-link") { el.href = U.waLink(el.getAttribute("data-text") || "Hi " + S.owner); return; }
    if (key === "instagram-link") { el.href = "https://instagram.com/" + S.instagram; el.textContent = "@" + S.instagram; }
    else if (key === "phone-link") { el.href = "tel:" + S.phone.replace(/\s/g, ""); el.textContent = S.phone; }
    else if (key === "email-link") { el.href = "mailto:" + S.email; el.textContent = S.email; }
    else if (key in S) { el.textContent = S[key]; }
    if (S.draft && /town|area|owner|phone|email|instagram|viewings|bio/.test(key)) { el.classList.add("todo"); el.title = "Placeholder: set '" + key + "' in assets/js/site.js"; }
  });
  if (S.draft) document.body.classList.add("draft");
  // Placeholder copy only ever shows in draft mode, so nothing half-written reaches the public site
  document.querySelectorAll(".todo-text").forEach(function (el) {
    if (S.draft) { el.classList.add("todo"); el.title = "Placeholder text: replace this"; } else { el.hidden = true; }
  });
  // Photo slots: show the image when a path is set, otherwise the brand panel (or nothing)
  document.querySelectorAll("[data-photo]").forEach(function (el) {
    var key = el.getAttribute("data-photo"), src = S[key];
    if (src) { el.innerHTML = '<img src="' + U.esc(src) + '" alt="' + U.esc(el.getAttribute("data-alt") || "") + '" decoding="async">'; el.classList.add("has-photo"); el.hidden = false; }
    else if (el.hasAttribute("data-optional")) { el.hidden = true; }
    else if (S.draft) { el.classList.add("todo"); el.title = "Placeholder: set '" + key + "' in assets/js/site.js"; }
  });

  /* ---- Modal plumbing shared by the sheet and the lightbox: Esc closes, Tab stays inside, page doesn't scroll ---- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function modal(el, opts) {
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function close() {
      el.remove(); document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow;
      if (opts.onClose) opts.onClose();
      if (opts.returnTo && opts.returnTo.focus) opts.returnTo.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (opts.onKey && opts.onKey(e) === false) return;
      if (e.key !== "Tab") return;
      var items = Array.prototype.filter.call(el.querySelectorAll(FOCUSABLE), function (i) { return i.offsetParent !== null; });
      if (!items.length) { e.preventDefault(); return; }
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    el.addEventListener("click", function (e) { if (e.target === el) close(); });
    return close;
  }

  /* ---- WhatsApp message sheet ---- */
  U.openSheet = function (opts) {
    var old = document.querySelector(".sheet-dialog"); if (old) old.remove();
    var el = document.createElement("div");
    el.className = "sheet-dialog"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "sheet-title");
    el.innerHTML = '<div class="box"><div class="hd"><h3 id="sheet-title">' + U.esc(opts.title) + '</h3><button class="close" type="button" aria-label="Close">✕</button></div>' +
      (opts.body || "") + '<p class="small muted">' + (opts.note || "This opens WhatsApp with the message ready to send. You can edit it first.") + "</p></div>";
    document.body.appendChild(el);
    var close = modal(el, opts);
    el.querySelector(".close").addEventListener("click", close);
    if (opts.onReady) opts.onReady(el, close);
    var first = el.querySelector("input, select, textarea, button:not(.close)"); if (first) first.focus();
    return el;
  };

  /* ---- Lightbox: full-size photos, arrows / swipe to move, Esc to close ---- */
  U.openLightbox = function (photos, start, opts) {
    opts = opts || {};
    var old = document.querySelector(".lightbox"); if (old) old.remove();
    var i = Math.max(0, Math.min(start || 0, photos.length - 1)), n = photos.length;
    var el = document.createElement("div");
    el.className = "lightbox"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Photos");
    el.innerHTML = '<div class="lb-top"><span class="lb-count num" aria-live="polite"></span><button class="lb-btn close" type="button" aria-label="Close">✕</button></div>' +
      '<div class="lb-stage"><img alt="" decoding="async"></div>' +
      (n > 1 ? '<button class="lb-btn prev" type="button" aria-label="Previous photo">‹</button><button class="lb-btn next" type="button" aria-label="Next photo">›</button>' : "") +
      (opts.caption ? '<p class="lb-cap">' + U.esc(opts.caption) + "</p>" : "");
    document.body.appendChild(el);
    var img = el.querySelector("img"), countEl = el.querySelector(".lb-count");
    function show(k) {
      i = (k + n) % n;
      img.src = photos[i]; img.alt = (opts.alt || "Photo") + " " + (i + 1) + " of " + n;
      countEl.textContent = (i + 1) + " / " + n;
      [i + 1, i - 1].forEach(function (j) { if (n > 1) { var pre = new Image(); pre.src = photos[(j + n) % n]; } });
      if (opts.onChange) opts.onChange(i);
    }
    var close = modal(el, {
      returnTo: opts.returnTo,
      onKey: function (e) { if (e.key === "ArrowRight") show(i + 1); else if (e.key === "ArrowLeft") show(i - 1); }
    });
    el.querySelector(".close").addEventListener("click", close);
    if (n > 1) {
      el.querySelector(".prev").addEventListener("click", function () { show(i - 1); });
      el.querySelector(".next").addEventListener("click", function () { show(i + 1); });
      var x0 = null;
      el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      el.addEventListener("touchend", function (e) {
        if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
      });
    }
    show(i);
    el.querySelector(".close").focus();
    return el;
  };

  /* ---- Reviews (only shown when there are some) ---- */
  var rev = document.getElementById("reviews");
  if (rev && S.reviews.length) {
    rev.hidden = false;
    rev.querySelector(".review-list").innerHTML = S.reviews.map(function (r) {
      return '<blockquote class="panel"><p>“' + U.esc(r.text) + "”</p><footer><b>" + U.esc(r.name) + "</b> · " + U.esc(r.car) + "</footer></blockquote>";
    }).join("");
  }
})();
