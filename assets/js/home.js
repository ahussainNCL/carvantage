/* Homepage: live search count and latest cars */
(function () {
  var form = document.getElementById("search"), budget = document.getElementById("budget"),
      chips = document.getElementById("bodyChips"), bodyInput = document.getElementById("bodyInput"),
      count = document.getElementById("searchCount"), btn = document.getElementById("searchBtn");

  function update() {
    var max = Number(budget.value) || Infinity, body = bodyInput.value;
    var n = U.available().filter(function (c) { return c.price <= max && (!body || c.body === body); }).length;
    btn.textContent = n === 0 ? "Show all cars" : "Show " + n + (n === 1 ? " car" : " cars");
    count.textContent = n === 0 ? "Nothing matches right now, but more arrives every week." : n + " of " + U.available().length + " in stock match.";
  }
  chips.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip"); if (!chip) return;
    chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
    bodyInput.value = chip.getAttribute("data-v"); update();
  });
  budget.addEventListener("change", update);
  form.addEventListener("submit", function () { if (!bodyInput.value) bodyInput.disabled = true; if (!budget.value) budget.disabled = true; });
  update();

  var latest = U.available().sort(function (a, b) { return b.added.localeCompare(a.added); }).slice(0, 6);
  document.getElementById("latestGrid").innerHTML = latest.map(U.carCard).join("");
})();
