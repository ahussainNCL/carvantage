/* Sell / part exchange form: validates, then opens WhatsApp (or email) with the details */
(function () {
  var S = window.SITE, form = document.getElementById("sellForm"), err = document.getElementById("formError");
  var pxToggle = document.getElementById("pxToggle"), pxBox = document.getElementById("pxBox"), pxCar = document.getElementById("pxCar");

  // Stock list for part exchange
  pxCar.innerHTML += U.available().sort(function (a, b) { return a.price - b.price; }).map(function (c) { return '<option value="' + U.esc(c.id) + '">' + U.esc(U.title(c) + " " + c.trim) + " · " + U.gbp(c.price) + "</option>"; }).join("");
  var px = U.param("px"), pxCarObj = px ? U.byId(px) : null;
  if (px !== null) {
    pxToggle.checked = true; pxBox.hidden = false;
    if (pxCarObj) pxCar.value = px;
    document.getElementById("sellTitle").textContent = "Part exchange your car";
    document.getElementById("sellLede").innerHTML = "Tell us about your car and we'll give you a price for it and the amount to pay on top for " + (pxCarObj ? "the <b>" + U.esc(U.title(pxCarObj)) + "</b>" : "whichever of our cars you pick") + ". It opens WhatsApp with everything ready to send.";
  }
  pxToggle.addEventListener("change", function () { pxBox.hidden = !pxToggle.checked; });

  // Photo previews
  document.getElementById("photos").addEventListener("change", function (e) {
    var thumbs = document.getElementById("thumbs"); thumbs.innerHTML = "";
    Array.prototype.slice.call(e.target.files, 0, 10).forEach(function (f) {
      var img = document.createElement("img"); img.alt = ""; img.src = URL.createObjectURL(f); thumbs.appendChild(img);
    });
  });

  // Registration formatting and a soft sanity check (current, prefix, suffix and dateless styles)
  var reg = document.getElementById("reg"), regHint = document.getElementById("regHint");
  var UK_REG = /^([A-Z]{2}\d{2}[A-Z]{3}|[A-Z]\d{1,3}[A-Z]{3}|[A-Z]{3}\d{1,3}[A-Z]|[A-Z]{1,3}\d{1,4}|\d{1,4}[A-Z]{1,3})$/;
  reg.addEventListener("input", function () {
    var v = reg.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (/^[A-Z]{2}\d{2}[A-Z]{3}$/.test(v)) v = v.slice(0, 4) + " " + v.slice(4);
    reg.value = v;
  });
  reg.addEventListener("blur", function () { var v = reg.value.replace(/\s/g, ""); regHint.hidden = !v || UK_REG.test(v); });

  // Keep what's typed between visits to this tab, so coming back from WhatsApp doesn't wipe the form
  var STORE = "carvantage-sell";
  var fields = ["reg", "mm", "year", "miles", "mot", "notes", "ask", "name", "postcode"];
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORE) || "{}");
    fields.forEach(function (id) { if (saved[id]) document.getElementById(id).value = saved[id]; });
    ["cond", "hist"].forEach(function (n) { if (saved[n]) { var r = form.querySelector('[name=' + n + '][value="' + saved[n].replace(/"/g, "") + '"]'); if (r) r.checked = true; } });
    if (saved.px && !px) { pxToggle.checked = true; pxBox.hidden = false; if (U.byId(saved.px)) pxCar.value = saved.px; }
  } catch (e) { /* storage blocked: fine, the form still works */ }
  form.addEventListener("input", function () {
    try {
      var o = {};
      fields.forEach(function (id) { o[id] = document.getElementById(id).value; });
      o.cond = form.querySelector("[name=cond]:checked").value; o.hist = form.querySelector("[name=hist]:checked").value;
      o.px = pxToggle.checked ? (pxCar.value || "") : "";
      sessionStorage.setItem(STORE, JSON.stringify(o));
    } catch (e) { /* ignore */ }
  });

  document.getElementById("year").max = new Date().getFullYear() + 1;

  function val(id) { return (document.getElementById(id).value || "").trim(); }
  function validate() {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (i) {
      var field = i.closest(".field"), bad = !i.value.trim() || (i.type === "number" && !i.validity.valid);
      field.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    err.hidden = ok;
    if (!ok) form.querySelector(".invalid input, .invalid select").focus();
    return ok;
  }
  function message() {
    var cond = form.querySelector("[name=cond]:checked").value, hist = form.querySelector("[name=hist]:checked").value;
    var pxLine = pxToggle.checked ? "\nPart exchange against: " + (pxCar.value ? U.title(U.byId(pxCar.value)) + " " + U.byId(pxCar.value).trim + " (" + U.gbp(U.byId(pxCar.value).price) + ")" : "one of your cars, not decided yet") : "";
    var photos = document.getElementById("photos").files.length;
    return "Hi " + S.owner + ", it's " + val("name") + ". I'd like an offer on my car.\n\n" +
      "Reg: " + val("reg") + "\nCar: " + val("mm") + ", " + val("year") + "\nMileage: " + val("miles") + "\nMOT: " + (val("mot") || "not sure") +
      "\nCondition: " + cond + "\nService history: " + hist +
      (val("notes") ? "\nNotes: " + val("notes") : "") + pxLine +
      (val("ask") ? "\nHoping for: £" + val("ask").replace(/[£,\s]/g, "") : "") +
      "\nPostcode: " + val("postcode") +
      (photos ? "\n\nI have " + photos + " photo" + (photos > 1 ? "s" : "") + " to send next." : "");
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault(); if (!validate()) return;
    var link = U.waLink(message());
    err.className = "msg success"; err.hidden = false;
    err.innerHTML = '<div style="display:grid;gap:var(--s3)"><span>Your details are ready. Tap to open WhatsApp and send them.</span><a class="btn wa" href="' + link + '" target="_blank" rel="noopener">' + ICONS.wa + "Open WhatsApp</a></div>";
    err.querySelector("a").focus();
  });
  document.getElementById("emailBtn").addEventListener("click", function (e) {
    e.preventDefault(); if (!validate()) return;
    location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Offer on my " + val("mm") + " " + val("reg")) + "&body=" + encodeURIComponent(message());
  });
})();
