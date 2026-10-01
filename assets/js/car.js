/* Car page */
(function () {
  var root = document.getElementById("car"), c = U.byId(U.param("id"));
  if (!c) {
    document.getElementById("crumb").textContent = "Not found";
    root.innerHTML = '<div class="empty" style="grid-column:1/-1"><h3>We can\'t find that car</h3><p>It may have sold. Have a look at what\'s in stock now.</p><a class="btn dark" href="cars.html">Cars for sale</a></div>';
    return;
  }
  var title = U.title(c), mot = U.motLabel(c.mot), S = window.SITE;
  document.title = title + " " + c.trim + " · " + U.gbp(c.price) + " · Carvantage";
  document.getElementById("crumb").textContent = title;

  function placeholder() {
    return '<div class="placeholder"><svg viewBox="0 0 200 80" fill="currentColor" aria-hidden="true"><path d="M8 64 3 42Q2 31 9 25L31 7Q38 1 48 1h62q11 0 19 7l26 19 31 5q11 2 12 13v11q0 8-8 8Z"/><circle class="hub" cx="46" cy="64" r="16" stroke="currentColor" stroke-width="6"/><circle class="hub" cx="158" cy="64" r="16" stroke="currentColor" stroke-width="6"/></svg><b>Photos coming soon</b><span class="small">Message us and we\'ll send a walkaround video today.</span></div>';
  }
  var photos = c.photos || [];
  var gallery = '<div class="gallery"><div class="main" id="mainShot">' + (photos[0] ? '<img src="' + U.esc(photos[0]) + '" alt="' + U.esc(title) + ', photo 1">' : placeholder()) + '<span class="mark">' + ICONS.logo + "</span></div>" +
    (photos.length > 1 ? '<div class="thumbs" role="list">' + photos.map(function (p, i) { return '<button type="button" role="listitem" data-i="' + i + '" aria-current="' + (i === 0) + '" aria-label="Photo ' + (i + 1) + '"><img src="' + U.esc(p) + '" alt=""></button>'; }).join("") + "</div>" : "") + "</div>";

  var statusWord = { available: "Available", reserved: "Reserved", sold: "Sold" }[c.status];
  var banner = c.status === "reserved" ? '<div class="banner reserved"><span class="status-pill reserved">Reserved</span><p class="small">Someone has paid a deposit on this car. Message us and we\'ll let you know if it comes back up.</p></div>' :
               c.status === "sold" ? '<div class="banner sold"><span class="status-pill sold">Sold</span><p class="small">This one\'s gone. We get similar cars in most weeks.</p></div>' : "";
  var waText = "Hi " + S.owner + ", I'm interested in the " + title + " " + c.trim + " (" + U.gbp(c.price) + ") on your website. Is it still available?";
  var buybox = '<aside class="buybox">' +
    (banner || '<span class="status-pill available">' + statusWord + "</span>") +
    '<div><h1 style="font-size:var(--t4)">' + U.esc(title) + '</h1><p class="muted">' + U.esc(c.trim) + "</p></div>" +
    '<p class="price num">' + U.gbp(c.price) + "<small>No admin fees. Part exchange welcome.</small></p>" +
    (c.status === "sold" ? '<a class="btn dark" href="cars.html">See cars for sale</a>' :
      '<button class="btn primary lg" type="button" id="viewBtn">Arrange a viewing</button>' +
      '<a class="btn wa" href="' + U.waLink(waText) + '" target="_blank" rel="noopener">' + ICONS.wa + "Ask about this car</a>" +
      '<a class="btn outline" href="sell.html?px=' + U.esc(c.id) + '">Part exchange your car</a>') +
    '<p class="px small muted">Viewings in <span data-cfg="town"></span>, seven days a week. Call or WhatsApp <a data-cfg="phone-link" href="#"></a>.</p>' +
    "</aside>";

  var facts = [["Mileage", c.miles.toLocaleString("en-GB")], ["Year", c.year], ["Fuel", c.fuel], ["Gearbox", c.gearbox], ["MOT", U.monthYear(c.mot), mot.short], ["Owners", c.owners], ["Keys", c.keys], ["Tax", c.tax]];
  var keyfacts = '<dl class="keyfacts">' + facts.map(function (f) { return "<div><dt>" + f[0] + '</dt><dd class="num' + (f[2] ? " short" : "") + '">' + U.esc(f[1]) + "</dd></div>"; }).join("") + "</dl>";

  var notes = c.notes && c.notes.length ? '<ul class="notes">' + c.notes.map(function (n) { return "<li><div>" + U.esc(n.text) + (n.photo ? "<small>Shown in photo " + n.photo + "</small>" : "") + "</div></li>"; }).join("") + "</ul>" : '<p class="muted">Nothing to report on this one. If we find anything before you collect, we\'ll tell you.</p>';
  var history = c.history && c.history.length ? '<ul class="timeline">' + c.history.map(function (h) { return "<li><time>" + U.monthYear(h.date) + "</time><span>" + U.esc(h.text) + "</span></li>"; }).join("") + "</ul>" : '<p class="muted">Ask us for the full history folder.</p>';
  var features = c.features && c.features.length ? '<ul class="feature-list">' + c.features.map(function (f) { return "<li>" + U.esc(f) + "</li>"; }).join("") + "</ul>" : "";
  var spec = '<dl class="spec-table">' + [["Engine", c.engine], ["Body", c.body + ", " + c.doors + " doors"], ["Colour", c.colour], ["Registration", "Shown at viewing"], ["Previous owners", c.owners], ["Keys", c.keys], ["Road tax", c.tax], ["MOT runs out", U.monthYear(c.mot)]].map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + U.esc(r[1]) + "</dd></div>"; }).join("") + "</dl>";

  var details = '<div class="car-details">' +
    '<div class="car-section" style="border-top:0;padding-top:var(--s6)"><p class="lede">' + U.esc(c.summary) + "</p>" + keyfacts + "</div>" +
    (c.status !== "sold" ? '<div class="car-section"><div><p class="eyebrow">Look closer</p><h2 style="margin-top:var(--s2)">What\'s wrong with it</h2><p class="sub">Every car this age has something. Here\'s what we found, so there are no surprises when you arrive.</p></div>' + notes + "</div>" +
    '<div class="car-section"><h2>Service and MOT history</h2>' + history + (mot.short ? '<div class="msg info">The MOT has under six months left, so we\'ll put a fresh 12 months on before you collect.</div>' : "") + "</div>" +
    (features ? '<div class="car-section"><h2>What it comes with</h2>' + features + "</div>" : "") +
    '<div class="car-section"><h2>Spec</h2>' + spec + "</div>" +
    '<div class="car-section"><h2>Your rights</h2><p class="sub">You\'re buying from a trader. Under the Consumer Rights Act 2015 the car must be of satisfactory quality for its age and price, as described, and fit for purpose. If a fault was there when you bought it, you can reject the car within 30 days for a full refund.</p></div>' : "") +
    "</div>";
  root.innerHTML = gallery + buybox + details;

  // Fill settings inside the freshly rendered HTML
  root.querySelectorAll("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    if (k === "phone-link") { el.href = "tel:" + S.phone.replace(/\s/g, ""); el.textContent = S.phone; } else el.textContent = S[k];
    if (S.draft) el.classList.add("todo");
  });

  // Gallery thumbs
  root.querySelectorAll(".thumbs button").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = Number(b.getAttribute("data-i"));
      document.getElementById("mainShot").querySelector("img").src = photos[i];
      root.querySelectorAll(".thumbs button").forEach(function (x) { x.setAttribute("aria-current", x === b); });
    });
  });

  // Viewing sheet
  var viewBtn = document.getElementById("viewBtn");
  if (viewBtn) viewBtn.addEventListener("click", function () {
    var days = [], d = new Date();
    for (var i = 0; i < 7; i++) {
      var day = new Date(d); day.setDate(d.getDate() + i);
      days.push(i === 0 ? "Today" : i === 1 ? "Tomorrow" : day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" }));
    }
    U.openSheet({
      title: "Arrange a viewing", returnTo: viewBtn,
      body: '<p class="muted">' + U.esc(title) + " · " + U.gbp(c.price) + '</p><div class="form">' +
        '<div class="field"><label for="vDay">Which day?</label><select class="select" id="vDay">' + days.map(function (x) { return "<option>" + x + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label for="vTime">What time?</label><select class="select" id="vTime"><option>Morning</option><option>Afternoon</option><option>Evening</option></select></div>' +
        '<div class="field full"><label for="vName">Your name</label><input class="input" id="vName" placeholder="First name"></div>' +
        '<div class="field full"><label for="vNote">Anything else?</label><input class="input" id="vNote" placeholder="e.g. I\'d like a test drive, or I have a part exchange"></div>' +
        '<div class="field full"><label>Your message</label><div class="preview" id="vPreview"></div></div></div>' +
        '<a class="btn wa lg" id="vSend" href="#" target="_blank" rel="noopener">' + ICONS.wa + "Send on WhatsApp</a>",
      onReady: function (el) {
        function build() {
          var name = el.querySelector("#vName").value.trim(), note = el.querySelector("#vNote").value.trim();
          var msg = "Hi " + S.owner + (name ? ", it's " + name : "") + ". I'd like to view the " + title + " " + c.trim + " (" + U.gbp(c.price) + ") " + el.querySelector("#vDay").value.toLowerCase() + " in the " + el.querySelector("#vTime").value.toLowerCase() + ". Is that ok?" + (note ? " " + note : "");
          el.querySelector("#vPreview").textContent = msg; el.querySelector("#vSend").href = U.waLink(msg);
        }
        el.querySelectorAll("select, input").forEach(function (i) { i.addEventListener("input", build); });
        build();
      }
    });
  });

  // Similar cars
  var similar = U.available().filter(function (x) { return x.id !== c.id && Math.abs(x.price - c.price) <= 1000; }).slice(0, 3);
  if (similar.length) {
    var sec = document.createElement("section"); sec.className = "section on-surface";
    sec.innerHTML = '<div class="wrap"><div class="sec-head"><div><p class="eyebrow">Similar money</p><h2>You might also like</h2></div><a class="link arrow" href="cars.html">All cars</a></div><div class="car-grid">' + similar.map(U.carCard).join("") + "</div></div>";
    document.querySelector("main").appendChild(sec);
  }
})();
