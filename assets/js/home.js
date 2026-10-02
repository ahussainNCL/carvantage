/* Homepage: live search count and latest cars */
(function () {
  var form = document.getElementById("search"), budget = document.getElementById("budget"),
      chips = document.getElementById("bodyChips"), bodyInput = document.getElementById("bodyInput"),
      count = document.getElementById("searchCount"), btn = document.getElementById("searchBtn"), matches = 0;

  function update() {
    var max = Number(budget.value) || Infinity, body = bodyInput.value;
    var n = U.available().filter(function (c) { return c.price <= max && (!body || c.body === body); }).length;
    matches = n;
    btn.textContent = n === 0 ? "Show all cars" : "Show " + n + (n === 1 ? " car" : " cars");
    var sc = document.getElementById("stripCount"); if (sc) sc.textContent = U.available().length;
    count.textContent = n === 0 ? "No matches. Explore all our stock instead." : n + " of " + U.available().length + " cars match your search";
  }
  chips.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip"); if (!chip) return;
    chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
    bodyInput.value = chip.getAttribute("data-v"); update();
  });
  budget.addEventListener("change", update);
  form.addEventListener("submit", function () { bodyInput.disabled = !bodyInput.value || matches === 0; budget.disabled = !budget.value || matches === 0; });
  window.addEventListener("pageshow", function () { bodyInput.disabled = false; budget.disabled = false; });
  update();

  var latest = U.available().sort(function (a, b) { return b.added.localeCompare(a.added); }).slice(0, 3);
  document.getElementById("latestGrid").innerHTML = latest.map(U.carCard).join("");


  /* Buy-steps: sync scroll-snap dots on narrow viewports (CSS handles the carousel) */
  (function initBuySteps() {
    var track = document.querySelector(".steps");
    var dots = document.querySelectorAll(".steps-dots .steps-dot");
    if (!track || !dots.length) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll(".step"));
    if (cards.length !== dots.length) return;

    function scrollLeftFor(i) {
      var trackBox = track.getBoundingClientRect();
      var cardBox = cards[i].getBoundingClientRect();
      return cardBox.left - trackBox.left + track.scrollLeft;
    }
    function activeIndex() {
      var origin = track.getBoundingClientRect().left, best = 0, bestDist = Infinity;
      for (var i = 0; i < cards.length; i++) {
        var d = Math.abs(cards[i].getBoundingClientRect().left - origin);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      return best;
    }
    function setCurrent(i) {
      dots.forEach(function (dot, n) {
        if (n === i) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }
    function goTo(i) {
      if (!window.matchMedia("(max-width: 560px)").matches) return;
      track.scrollTo({ left: scrollLeftFor(i), behavior: "smooth" });
      setCurrent(i);
    }
    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { setCurrent(activeIndex()); ticking = false; });
    }, { passive: true });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); });
    });
    cards.forEach(function (card, i) {
      card.addEventListener("focus", function () { goTo(i); });
    });
  })();

  // Structured data for the business, built from SITE so it never drifts from the page
  var S = window.SITE, ld = document.createElement("script"); ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "AutoDealer",
    name: S.name, url: S.url || location.origin, telephone: S.phone, email: S.email,
    address: { "@type": "PostalAddress", addressLocality: S.town, addressCountry: "GB" },
    areaServed: S.area, description: "Used cars from " + U.gbp(S.minPrice) + " to " + U.gbp(S.maxPrice) + ". History checked, faults listed, MOT date up front.",
    openingHours: "Mo-Su 09:00-20:00", priceRange: U.gbp(S.minPrice) + " - " + U.gbp(S.maxPrice),
    sameAs: S.instagram ? ["https://instagram.com/" + S.instagram] : []
  });
  document.head.appendChild(ld);
})();
