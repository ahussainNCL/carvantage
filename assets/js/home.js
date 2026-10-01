/* Homepage: search bar with live count, stock badge, latest cars */
(function () {
  var form = document.getElementById("search"), btn = document.getElementById("searchBtn"), stock = document.getElementById("stockCount");
  var sel = { budget: document.getElementById("budget"), body: document.getElementById("body"), fuel: document.getElementById("fuel"), gearbox: document.getElementById("gearbox") };
  var keys = Object.keys(sel);

  function update() {
    var max = Number(sel.budget.value) || Infinity;
    var n = U.available().filter(function (c) {
      return c.price <= max && (!sel.body.value || c.body === sel.body.value) && (!sel.fuel.value || c.fuel === sel.fuel.value) && (!sel.gearbox.value || c.gearbox === sel.gearbox.value);
    }).length;
    btn.textContent = n === 0 ? "Show all cars" : "Search " + n + (n === 1 ? " car" : " cars");
  }
  keys.forEach(function (k) { sel[k].addEventListener("change", update); });
  // Keep the URL clean: only send filters that are set. Re-enable on back navigation.
  form.addEventListener("submit", function () { keys.forEach(function (k) { if (!sel[k].value) sel[k].disabled = true; }); });
  window.addEventListener("pageshow", function () { keys.forEach(function (k) { sel[k].disabled = false; }); });
  if (stock) { var n = U.available().length; stock.textContent = n + (n === 1 ? " car" : " cars") + " in stock"; }
  update();

  var latest = U.available().sort(function (a, b) { return b.added.localeCompare(a.added); }).slice(0, 8);
  document.getElementById("latestGrid").innerHTML = latest.map(U.carCard).join("");
})();
