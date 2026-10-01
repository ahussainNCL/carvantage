/* Stock search: validated, shareable filters and browser history. */
(function () {
  var grid = document.getElementById('grid'), count = document.getElementById('count'),
      budget = document.getElementById('fBudget'), sort = document.getElementById('sort'),
      search = document.getElementById('fSearch'), reset = document.getElementById('resetFilters'),
      activeFilters = document.getElementById('activeFilters'), groups = document.querySelectorAll('[data-filter]');
  var allowed = {
    budget: Array.from(budget.options, function (o) { return o.value; }),
    sort: Array.from(sort.options, function (o) { return o.value; })
  };
  groups.forEach(function (g) {
    allowed[g.dataset.filter] = Array.from(g.querySelectorAll('.chip'), function (c) { return c.dataset.v; });
  });
  function readState() {
    var params = new URLSearchParams(location.search), next = {};
    Object.keys(allowed).forEach(function (key) {
      var value = params.get(key) || '';
      next[key] = allowed[key].includes(value) ? value : (key === 'sort' ? 'new' : '');
    });
    next.q = (params.get('q') || '').trim().slice(0, 100);
    return next;
  }
  var state = readState(), searchTimer;
  var filterKeys = ['q', 'budget', 'body', 'fuel', 'gearbox'];
  function syncControls() {
    budget.value = state.budget; sort.value = state.sort; search.value = state.q;
    groups.forEach(function (g) {
      g.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.v === state[g.dataset.filter])); });
    });
  }
  function syncUrl(mode) {
    var params = new URLSearchParams();
    Object.keys(state).forEach(function (key) { if (state[key] && !(key === 'sort' && state[key] === 'new')) params.set(key, state[key]); });
    var url = location.pathname + (params.size ? '?' + params.toString() : '') + location.hash;
    if (url !== location.pathname + location.search + location.hash) history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
  }
  function filterLabel(key) {
    if (key === 'q') return 'Search: ' + state.q;
    if (key === 'budget') return 'Up to ' + U.gbp(state.budget);
    if (key === 'body' && state.body === 'MPV') return 'People carrier';
    return state[key];
  }
  function render(mode) {
    var max = Number(state.budget) || Infinity, query = state.q.toLowerCase();
    var list = U.available().filter(function (c) {
      return c.price <= max && (!state.body || c.body === state.body) && (!state.fuel || c.fuel === state.fuel) &&
        (!state.gearbox || c.gearbox === state.gearbox) && (!query || (c.year + ' ' + c.make + ' ' + c.model + ' ' + c.trim).toLowerCase().includes(query));
    });
    var sorters = {
      new: function (a, b) { return b.added.localeCompare(a.added); },
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      miles: function (a, b) { return a.miles - b.miles; },
      year: function (a, b) { return b.year - a.year; }
    };
    list.sort(function (a, b) {
      return (a.status === 'reserved') - (b.status === 'reserved') || sorters[state.sort](a, b);
    });
    var active = filterKeys.filter(function (key) { return state[key]; });
    var available = list.filter(function (c) { return c.status === 'available'; }).length;
    count.textContent = list.length + (list.length === 1 ? ' car' : ' cars') + (active.length ? (list.length === 1 ? ' matches' : ' match') : ' in stock') +
      (list.length !== available ? ' · ' + (list.length - available) + ' reserved' : '');
    reset.hidden = !active.length;
    activeFilters.hidden = !active.length;
    activeFilters.innerHTML = active.map(function (key) {
      var label = filterLabel(key);
      return '<button class="active-filter" type="button" data-remove="' + key + '" aria-label="' + U.esc('Remove ' + label) + '">' + U.esc(label) + ' <span aria-hidden="true">×</span></button>';
    }).join('');
    if (list.length) grid.innerHTML = list.map(U.carCard).join('');
    else {
      var request = [state.fuel, state.gearbox, state.body === 'MPV' ? 'people carrier' : state.body, state.q].filter(Boolean).join(' ');
      grid.innerHTML = '<div class="empty"><span class="empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></span><h3>No cars match just yet.</h3><p>Try a wider budget or fewer filters. Or tell us what you’re looking for and we’ll let you know when something suitable comes in.</p><div class="btn-row"><button class="btn dark" type="button" id="clear">Clear filters</button><a class="btn outline" target="_blank" rel="noopener" href="' + U.waLink("Hi, I'm looking for " + (request || 'a car') + (state.budget ? ' up to ' + U.gbp(state.budget) : '') + '. Can you let me know when you get one in?') + '">Tell us what you need ' + ICONS.arrow + '</a></div></div>';
      document.getElementById('clear').addEventListener('click', clearFilters);
    }
    syncUrl(mode);
  }
  function flushSearch() {
    clearTimeout(searchTimer);
    state.q = search.value.trim().slice(0, 100);
  }
  function clearFilters() {
    clearTimeout(searchTimer);
    filterKeys.forEach(function (key) { state[key] = ''; });
    syncControls(); render('push'); search.focus();
  }
  groups.forEach(function (g) {
    g.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip'); if (!chip) return;
      flushSearch(); state[g.dataset.filter] = chip.dataset.v; syncControls(); render('push');
    });
  });
  activeFilters.addEventListener('click', function (e) {
    var button = e.target.closest('[data-remove]'); if (!button) return;
    flushSearch(); state[button.dataset.remove] = ''; syncControls(); render('push');
    var next = activeFilters.querySelector('button'); (next || search).focus();
  });
  reset.addEventListener('click', clearFilters);
  budget.addEventListener('change', function () { flushSearch(); state.budget = budget.value; render('push'); });
  sort.addEventListener('change', function () { flushSearch(); state.sort = sort.value; render('push'); });
  search.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { state.q = search.value.trim().slice(0, 100); render(); }, 180);
  });
  search.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); flushSearch(); render(); } });
  window.addEventListener('popstate', function () { clearTimeout(searchTimer); state = readState(); syncControls(); render(); });
  syncControls(); render();

  var mobile = matchMedia('(max-width: 760px)'), disclosure = document.getElementById('filterDisclosure');
  function fitFilters() { disclosure.open = !mobile.matches; }
  mobile.addEventListener('change', fitFilters); fitFilters();

  var sold = (window.CARS || []).filter(function (c) { return c.status === 'sold'; });
  if (sold.length) {
    document.getElementById('soldStrip').hidden = false;
    document.getElementById('soldRow').innerHTML = sold.map(function (c) { return '<span><b>' + U.esc(U.title(c)) + '</b> · ' + U.gbp(c.price) + '</span>'; }).join('');
  }
})();
