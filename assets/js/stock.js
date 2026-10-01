/* Browse page: filters, sort, URL state */
(function () {
  var grid = document.getElementById("grid"), count = document.getElementById("count"),
      budget = document.getElementById("fBudget"), sort = document.getElementById("sort"),
      groups = document.querySelectorAll("[data-filter]");
  // Only accept URL values that match a real control, so a mistyped link can't produce "£NaN" or a stuck filter
  function pick(key, el) {
    var v = U.param(key) || "";
    var ok = Array.prototype.some.call(el.querySelectorAll("option, .chip"), function (o) { return (o.tagName === "OPTION" ? o.value : o.getAttribute("data-v")) === v; });
    return ok ? v : "";
  }
  var state = {
    budget: pick("budget", budget),
    body: pick("body", document.querySelector('[data-filter="body"]')),
    fuel: pick("fuel", document.querySelector('[data-filter="fuel"]')),
    gearbox: pick("gearbox", document.querySelector('[data-filter="gearbox"]')),
    sort: pick("sort", sort) || "new"
  };
  var toggle = document.getElementById("filterToggle"), filterRows = document.getElementById("filterRows");
  function activeCount() { return ["budget", "body", "fuel", "gearbox"].filter(function (k) { return state[k]; }).length; }
  function syncToggle() {
    if (!toggle) return;
    var n = activeCount();
    toggle.querySelector(".n").textContent = n ? " (" + n + ")" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      filterRows.classList.toggle("open", open);
    });
    // Start open on phones only when a filter came in from the URL, so people can see what's applied
    if (activeCount()) { toggle.setAttribute("aria-expanded", "true"); filterRows.classList.add("open"); }
  }

  function syncControls() {
    budget.value = state.budget; sort.value = state.sort;
    groups.forEach(function (g) {
      var key = g.getAttribute("data-filter");
      g.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-v") === state[key] ? "true" : "false"); });
    });
  }
  function syncUrl() {
    var p = new URLSearchParams();
    Object.keys(state).forEach(function (k) { if (state[k] && !(k === "sort" && state[k] === "new")) p.set(k, state[k]); });
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
  }
  function render() {
    var max = Number(state.budget) || Infinity;
    var list = U.available().filter(function (c) {
      return c.price <= max && (!state.body || c.body === state.body) && (!state.fuel || c.fuel === state.fuel) && (!state.gearbox || c.gearbox === state.gearbox);
    });
    var sorters = {
      "new": function (a, b) { return b.added.localeCompare(a.added); },
      "price-asc": function (a, b) { return a.price - b.price; },
      "price-desc": function (a, b) { return b.price - a.price; },
      "miles": function (a, b) { return a.miles - b.miles; },
      "year": function (a, b) { return b.year - a.year; }
    };
    list.sort(sorters[state.sort] || sorters["new"]);
    // reserved cars go after available ones whatever the sort
    list.sort(function (a, b) { return (a.status === "reserved") - (b.status === "reserved"); });
    var active = Object.keys(state).some(function (k) { return k !== "sort" && state[k]; });
    count.textContent = list.length + (list.length === 1 ? " car" : " cars") + (active ? " match" : " in stock");
    syncToggle();
    if (!list.length) {
      grid.innerHTML = '<div class="empty"><h3>Nothing matches those filters right now</h3><p>Stock changes every week. Tell us what you\'re after and we\'ll message you when something suitable comes in, or widen the filters.</p><div class="btn-row"><button class="btn outline" type="button" id="clear">Clear filters</button><a class="btn dark" target="_blank" rel="noopener" href="' + U.waLink("Hi, I'm looking for a " + [state.fuel, state.gearbox, state.body].filter(Boolean).join(" ").toLowerCase() + (state.budget ? " up to " + U.gbp(state.budget) : "") + ". Can you let me know when you get one in?") + '">Ask us to look out for one</a></div></div>';
      document.getElementById("clear").addEventListener("click", function () { state = { budget: "", body: "", fuel: "", gearbox: "", sort: state.sort }; syncControls(); syncUrl(); render(); });
    } else {
      grid.innerHTML = list.map(U.carCard).join("");
    }
    syncUrl();
  }
  groups.forEach(function (g) {
    g.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip"); if (!chip) return;
      state[g.getAttribute("data-filter")] = chip.getAttribute("data-v"); syncControls(); render();
    });
  });
  budget.addEventListener("change", function () { state.budget = budget.value; render(); });
  sort.addEventListener("change", function () { state.sort = sort.value; render(); });
  syncControls(); render();

  var sold = (window.CARS || []).filter(function (c) { return c.status === "sold"; });
  if (sold.length) {
    document.getElementById("soldStrip").hidden = false;
    document.getElementById("soldRow").innerHTML = sold.map(function (c) { return "<span><b>" + U.esc(U.title(c)) + "</b> · " + U.gbp(c.price) + "</span>"; }).join("");
  }
})();
