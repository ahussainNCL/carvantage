# Carvantage website

Static site, no build step. Open `index.html` or run `python3 -m http.server 8080` in this folder.

## Editing

- **Your details** (town, phone, WhatsApp number, email, Instagram, viewing hours): `assets/js/site.js`, the `SITE` object at the top. Set `draft: false` to remove the dashed placeholder boxes.
- **Stock**: `assets/js/cars.js`. One object per car. Set `status` to `available`, `reserved` or `sold`. Put photo paths in `photos` (e.g. `assets/img/stock/ab12cde-1.jpg`); an empty list shows "Photos coming soon".
- **Reviews**: add to `SITE.reviews` in `site.js`; the section appears on the homepage once there's at least one.
- **Owner bio and photo**: `index.html`, the `#about` section.
- **Colours, type, spacing**: `assets/css/tokens.css`. Page styles: `assets/css/site.css`.

## Pages

- `index.html` – homepage with search, promises, latest cars, process, sell/part-exchange, bio, contact
- `cars.html` – browse with filters (budget, type, fuel, gearbox) and sort; filters live in the URL so links can be shared
- `car.html?id=…` – car page: photos, key facts, "what's wrong with it", service/MOT history, spec, arrange a viewing, ask on WhatsApp, part exchange
- `sell.html` – sell your car / part exchange form; opens WhatsApp (or email) with the details filled in. `sell.html?px=<car id>` pre-selects a part exchange.

Forms don't need a server: everything goes through WhatsApp or email.
