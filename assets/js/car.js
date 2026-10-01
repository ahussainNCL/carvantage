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
    return U.carPlaceholder(c);
  }
  var photos = c.photos || [];
  var gallery = '<div class="gallery"><div class="main" id="mainShot">' +
    (photos[0] ? '<button type="button" class="zoom" id="zoomBtn" aria-label="Open photos full size"><img src="' + U.esc(photos[0]) + '" alt="' + U.esc(title) + ', photo 1" width="1600" height="1200" fetchpriority="high"></button>' : placeholder()) +
    '<span class="mark">' + ICONS.logo + "</span></div>" +
    (photos.length > 1 ? '<ul class="thumbs">' + photos.map(function (p, i) { return '<li><button type="button" data-i="' + i + '" aria-current="' + (i === 0) + '" aria-label="Photo ' + (i + 1) + ' of ' + photos.length + '"><img src="' + U.esc(p) + '" alt="" width="400" height="300" loading="lazy" decoding="async"></button></li>'; }).join("") + "</ul>" : "") + "</div>";

  var statusWord = { available: "Available", reserved: "Reserved", sold: "Sold" }[c.status];
  var banner = c.status === "reserved" ? '<div class="banner reserved"><span class="status-pill reserved">Reserved</span><p class="small">Someone has paid a deposit on this car. Message us and we\'ll let you know if it comes back up.</p></div>' :
               c.status === "sold" ? '<div class="banner sold"><span class="status-pill sold">Sold</span><p class="small">This one\'s gone. We get similar cars in most weeks.</p></div>' : "";
  var waText = "Hi " + S.owner + ", I'm interested in the " + title + " " + c.trim + " (" + U.gbp(c.price) + ") on your website. " + (c.status === 'reserved' ? 'Please let me know if it becomes available again.' : 'Is it still available?');
  var buybox = '<aside class="buybox">' +
    (banner || '<span class="status-pill available">' + statusWord + "</span>") +
    '<div><h1 style="font-size:var(--t4)">' + U.esc(title) + '</h1><p class="muted">' + U.esc(c.trim) + "</p></div>" +
    '<p class="price num">' + U.gbp(c.price) + "<small>No admin fees. Part exchange welcome.</small></p>" +
    (c.status === "sold" ? '<a class="btn dark" href="cars.html">See cars for sale</a>' :
      (c.status === 'available' ? '<button class="btn primary lg" type="button" id="viewBtn">Arrange a viewing</button>' : '') +
      '<a class="btn wa" href="' + U.waLink(waText) + '" target="_blank" rel="noopener">' + ICONS.wa + "Ask about this car</a>" +
      (c.status === 'available' ? '<a class="btn outline" href="sell.html?px=' + U.esc(c.id) + '">Part exchange your car</a>' : '')) +
    '<p class="px small muted">Viewings in <span data-cfg="town"></span>, seven days a week. Call or WhatsApp <a data-cfg="phone-link" href="#"></a>.</p>' +
    (c.status !== "sold" ? '<ul class="trust small">' +
      '<li><a class="link" href="' + U.waLink("Hi " + S.owner + ", could you send me the history check (HPI) report for the " + title + " " + c.trim + "?") + '" target="_blank" rel="noopener">Ask for the history check report</a></li>' +
      '<li><a class="link" href="https://www.gov.uk/check-mot-history" target="_blank" rel="noopener">Check its MOT history on GOV.UK</a> <span class="muted">(we\'ll give you the reg)</span></li></ul>' : "") +
    "</aside>";

  var facts = [["Mileage", c.miles.toLocaleString("en-GB")], ["Year", c.year], ["Fuel", c.fuel], ["Gearbox", c.gearbox], ["MOT", mot.date, mot.short], ["Owners", c.owners], ["Keys", c.keys], ["Tax", c.tax]];
  var keyfacts = '<dl class="keyfacts">' + facts.map(function (f) { return "<div><dt>" + f[0] + '</dt><dd class="num' + (f[2] ? " short" : "") + '">' + U.esc(f[1]) + "</dd></div>"; }).join("") + "</dl>";

  // "Shown in photo N" becomes a button when that photo exists, otherwise plain text
  var notes = c.notes && c.notes.length ? '<ul class="notes">' + c.notes.map(function (n) {
    var ref = n.photo ? (photos[n.photo - 1] ? '<button type="button" class="note-photo" data-i="' + (n.photo - 1) + '">Shown in photo ' + n.photo + "</button>" : "") : "";
    return "<li><div>" + U.esc(n.text) + ref + "</div></li>";
  }).join("") + "</ul>" : '<p class="muted">Nothing to report on this one. If we find anything before you collect, we\'ll tell you.</p>';
  var history = c.history && c.history.length ? '<ul class="timeline">' + c.history.map(function (h) { return "<li><time>" + U.monthYear(h.date) + "</time><span>" + U.esc(h.text) + "</span></li>"; }).join("") + "</ul>" : '<p class="muted">Ask us for the full history folder.</p>';
  var features = c.features && c.features.length ? '<ul class="feature-list">' + c.features.map(function (f) { return "<li>" + U.esc(f) + "</li>"; }).join("") + "</ul>" : "";
  var spec = '<dl class="spec-table">' + [["Engine", c.engine], ["Body", c.body + ", " + c.doors + " doors"], ["Colour", c.colour], ["Registration", "Shown at viewing"], ["Previous owners", c.owners], ["Keys", c.keys], ["Road tax", c.tax], ["MOT runs out", mot.date]].map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + U.esc(r[1]) + "</dd></div>"; }).join("") + "</dl>";

  var motNote = mot.expired ? "The MOT has run out, so we\'ll put a fresh 12 months on before you collect." : "The MOT has under six months left, so we\'ll put a fresh 12 months on before you collect.";
  var details = '<div class="car-details">' +
    '<div class="car-section" style="border-top:0;padding-top:var(--s6)"><p class="lede">' + U.esc(c.summary) + "</p>" + keyfacts + "</div>" +
    (c.status !== "sold" ? '<div class="car-section"><div><p class="eyebrow">Condition</p><h2 style="margin-top:var(--s2)">What isn\'t perfect</h2><p class="sub">Every used car has marks. Here\'s what we found on this one — written down so nothing is a surprise when you arrive.</p></div>' + notes + "</div>" +
    '<div class="car-section"><h2>Service and MOT history</h2>' + history + (mot.short ? '<div class="msg info">' + motNote + "</div>" : "") + "</div>" +
    (features ? '<div class="car-section"><h2>What it comes with</h2>' + features + "</div>" : "") +
    '<div class="car-section"><h2>Spec</h2>' + spec + "</div>" +
    '<div class="car-section"><h2>Your rights</h2><p class="sub">You\'re buying from a trader. Under the Consumer Rights Act 2015 the car must be of satisfactory quality for its age and price, as described, and fit for purpose. If a fault was there when you bought it, you can reject the car within 30 days for a full refund.</p></div>' : "") +
    "</div>";
  // Three grid children so phones can reorder them: gallery, buy box, then the long details
  root.innerHTML = gallery + buybox + details;

  // Phone-only action bar so the price and the two main buttons are always one tap away
  if (c.status === "available") {
    var bar = document.createElement("div");
    bar.className = "action-bar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Quick actions");
    bar.innerHTML = '<div class="wrap"><p class="price num">' + U.gbp(c.price) + '<small>' + U.esc(title) + '</small></p>' +
      '<a class="btn wa" href="' + U.waLink(waText) + '" target="_blank" rel="noopener" aria-label="Ask about this car on WhatsApp">' + ICONS.wa + '</a>' +
      '<button class="btn primary" type="button" id="viewBtnBar">Arrange a viewing</button></div>';
    document.body.appendChild(bar);
    // Only show the bar once the buy box has scrolled out of view, so the buttons aren't on screen twice
    var box = root.querySelector(".buybox");
    if ("IntersectionObserver" in window && box) {
      bar.classList.add("is-hidden");
      bar.inert = true;
      new IntersectionObserver(function (entries) { bar.classList.toggle("is-hidden", entries[0].isIntersecting); bar.inert = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(box);
    }
  }

  // Fill settings inside the freshly rendered HTML
  root.querySelectorAll("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    if (k === "phone-link") { el.href = "tel:" + S.phone.replace(/\s/g, ""); el.textContent = S.phone; } else el.textContent = S[k];
    if (S.draft) el.classList.add("todo");
  });

  // Gallery: thumbs swap the main shot, main shot and note links open the lightbox
  var current = 0;
  function showPhoto(i) {
    current = i;
    var main = document.getElementById("mainShot").querySelector("img");
    if (main) { main.src = photos[i]; main.alt = title + ", photo " + (i + 1); }
    root.querySelectorAll(".thumbs button").forEach(function (x) { x.setAttribute("aria-current", Number(x.getAttribute("data-i")) === i); });
  }
  function lightbox(i, opener) {
    U.openLightbox(photos, i, { alt: title, returnTo: opener, onChange: showPhoto });
  }
  root.querySelectorAll(".thumbs button").forEach(function (b) {
    b.addEventListener("click", function () { showPhoto(Number(b.getAttribute("data-i"))); });
  });
  var zoom = document.getElementById("zoomBtn");
  if (zoom) zoom.addEventListener("click", function () { lightbox(current, zoom); });
  root.querySelectorAll(".note-photo").forEach(function (b) {
    b.addEventListener("click", function () { lightbox(Number(b.getAttribute("data-i")), b); });
  });

  // Search engines: a description for this car and structured data (Google reads JSON-LD added by scripts)
  var desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", title + " " + c.trim + ", " + U.gbp(c.price) + ". " + c.miles.toLocaleString("en-GB") + " miles, " + c.fuel.toLowerCase() + ", " + c.gearbox.toLowerCase() + ", " + mot.text + ". " + c.summary);
  var og = { "og:title": document.title, "og:description": desc ? desc.getAttribute("content") : "", "og:url": (S.url || "") + "/car.html?id=" + c.id };
  if (photos[0]) og["og:image"] = (S.url || "") + "/" + photos[0];
  Object.keys(og).forEach(function (k) { var m = document.querySelector('meta[property="' + k + '"]'); if (m) m.setAttribute("content", og[k]); });
  if (S.url) { var canon = document.createElement("link"); canon.rel = "canonical"; canon.href = og["og:url"]; document.head.appendChild(canon); }
  var ld = document.createElement("script"); ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Car",
    name: title + " " + c.trim, brand: { "@type": "Brand", name: c.make }, model: c.model, vehicleModelDate: String(c.year),
    bodyType: c.body, fuelType: c.fuel, vehicleTransmission: c.gearbox, color: c.colour, numberOfDoors: c.doors,
    numberOfPreviousOwners: c.owners, mileageFromOdometer: { "@type": "QuantitativeValue", value: c.miles, unitCode: "SMI" },
    image: photos.map(function (p) { return (S.url || "") + "/" + p; }), description: c.summary,
    offers: { "@type": "Offer", price: c.price, priceCurrency: "GBP", itemCondition: "https://schema.org/UsedCondition",
      availability: c.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: (S.url || "") + "/car.html?id=" + c.id, seller: { "@type": "AutoDealer", name: S.name, telephone: S.phone, address: { "@type": "PostalAddress", addressLocality: S.town, addressCountry: "GB" } } }
  });
  document.head.appendChild(ld);

  // Viewing sheet
  function openViewing(opener) {
    var days = [], d = new Date();
    for (var i = 0; i < 7; i++) {
      var day = new Date(d); day.setDate(d.getDate() + i);
      days.push(i === 0 ? "Today" : i === 1 ? "Tomorrow" : day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" }));
    }
    U.openSheet({
      title: "Arrange a viewing", returnTo: opener,
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
  }
  ["viewBtn", "viewBtnBar"].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener("click", function () { openViewing(b); });
  });

  // Similar cars
  // Same body type first, then nearest in price
  var similar = U.available().filter(function (x) { return x.id !== c.id && Math.abs(x.price - c.price) <= 1000; })
    .sort(function (a, b) { return ((b.body === c.body) - (a.body === c.body)) || (Math.abs(a.price - c.price) - Math.abs(b.price - c.price)); }).slice(0, 3);
  if (similar.length) {
    var sec = document.createElement("section"); sec.className = "section on-surface";
    sec.innerHTML = '<div class="wrap"><div class="sec-head"><div><p class="eyebrow">Similar price</p><h2>Other cars to consider</h2></div><a class="link arrow" href="cars.html">All cars</a></div><div class="car-grid">' + similar.map(U.carCard).join("") + "</div></div>";
    document.querySelector("main").appendChild(sec);
  }
})();
