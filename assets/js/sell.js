/* Sell / part exchange form: validates, then opens WhatsApp (or email) with the details */
(function () {
  var S = window.SITE, form = document.getElementById("sellForm"), err = document.getElementById("formError");
  var pxToggle = document.getElementById("pxToggle"), pxBox = document.getElementById("pxBox"), pxCar = document.getElementById("pxCar");

  // Stock list for part exchange
  pxCar.innerHTML += U.available().filter(function (c) { return c.status === 'available'; }).sort(function (a, b) { return a.price - b.price; }).map(function (c) { return '<option value="' + U.esc(c.id) + '">' + U.esc(U.title(c) + " " + c.trim) + " · " + U.gbp(c.price) + "</option>"; }).join("");
  var px = U.param("px");
  var pxCandidate = U.byId(px), selectedCar = pxCandidate && pxCandidate.status === 'available' ? pxCandidate : null;
  if (px !== null) {
    pxToggle.checked = true; pxBox.hidden = false;
    if (selectedCar) pxCar.value = px;
    document.getElementById("sellTitle").textContent = "Part exchange your car";
    document.getElementById("sellLede").innerHTML = "Tell us about your car and we'll give you a price for it — with any deductions explained — and the amount to pay on top for " + (selectedCar ? "the <b>" + U.esc(U.title(selectedCar)) + "</b>" : "one of our available cars") + ". It opens WhatsApp ready to send.";
  }
  pxToggle.addEventListener("change", function () { pxBox.hidden = !pxToggle.checked; });

  // Photo previews
  var photoUrls = [], photoCount = 0;
  document.getElementById("photos").addEventListener("change", function (e) {
    photoUrls.forEach(function (url) { URL.revokeObjectURL(url); }); photoUrls = [];
    var thumbs = document.getElementById("thumbs"); thumbs.innerHTML = "";
    var files = Array.from(e.target.files).filter(function (f) { return f.type.startsWith('image/'); }).slice(0, 10);
    photoCount = files.length;
    files.forEach(function (f, i) {
      var img = document.createElement("img"); img.alt = "Selected photo " + (i + 1); img.src = URL.createObjectURL(f); photoUrls.push(img.src); thumbs.appendChild(img);
    });
    document.getElementById("photoHint").textContent = (e.target.files.length > 10 ? 'Showing the first 10 photos. ' : '') + "Photos aren't attached automatically. Send them in the WhatsApp chat after your message.";
  });

  function resetPreparedMessage() {
    if (err.classList.contains('success')) { err.hidden = true; err.className = 'msg error'; err.textContent = 'Please check the fields marked above.'; }
  }
  form.addEventListener('input', resetPreparedMessage);
  form.addEventListener('change', resetPreparedMessage);

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
    if (saved.px && px === null) { pxToggle.checked = true; pxBox.hidden = false; if (U.byId(saved.px)) pxCar.value = saved.px; }
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
  function validField(input) {
    var value = input.value.trim();
    if (!value || (input.type === 'number' && !input.validity.valid)) return false;
    if (input.id === 'year') return /^\d{4}$/.test(value) && Number(value) >= 1900 && Number(value) <= new Date().getFullYear() + 1;
    if (input.id === 'miles') return /^\d[\d,\s]*$/.test(value) && Number(value.replace(/[,\s]/g, '')) >= 0;
    if (input.id === 'reg') return /^[A-Z0-9 ]{2,8}$/i.test(value);
    return true;
  }
  form.querySelectorAll('[required]').forEach(function (input) {
    var error = input.closest('.field').querySelector('.error');
    if (error) { error.id = input.id + 'Err'; input.setAttribute('aria-describedby', error.id + (input.id === 'reg' ? ' regHint' : '')); }
    if (input.id === 'year') error.textContent = 'Enter a four-digit year, e.g. 2014';
    if (input.id === 'miles') error.textContent = 'Enter the mileage as a number, e.g. 78,000';
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true' && validField(input)) { input.closest('.field').classList.remove('invalid'); input.removeAttribute('aria-invalid'); }
    });
  });
  function validate() {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (i) {
      var field = i.closest(".field"), bad = !validField(i);
      field.classList.toggle("invalid", bad); if (bad) ok = false;
      i.setAttribute('aria-invalid', String(bad));
    });
    err.className = 'msg error'; err.textContent = 'Please check the fields marked above.';
    err.hidden = ok;
    if (!ok) form.querySelector(".invalid input, .invalid select").focus();
    return ok;
  }
  function message() {
    var cond = form.querySelector("[name=cond]:checked").value, hist = form.querySelector("[name=hist]:checked").value;
    var pxLine = pxToggle.checked ? "\nPart exchange against: " + (pxCar.value ? U.title(U.byId(pxCar.value)) + " " + U.byId(pxCar.value).trim + " (" + U.gbp(U.byId(pxCar.value).price) + ")" : "one of your cars, not decided yet") : "";
    var photos = photoCount;
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
  document.getElementById("emailBtn").hidden = !S.email;
  document.getElementById("emailBtn").addEventListener("click", function (e) {
    e.preventDefault(); if (!validate()) return;
    location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Offer on my " + val("mm") + " " + val("reg")) + "&body=" + encodeURIComponent(message());
  });
})();
