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
})();
