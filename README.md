# Carvantage website

Static site, no build step. Open `index.html` or run `python3 -m http.server 8080` in this folder.

## Editing

- **Your details** (town, phone, WhatsApp number, email, Instagram, viewing hours): `assets/js/site.js`, the `SITE` object at the top. Set `draft: false` to remove the dashed placeholder boxes.
- **Stock**: `assets/js/cars.js`. One object per car. Set `status` to `available`, `reserved` or `sold`. Put photo paths in `photos` (e.g. `assets/img/stock/ab12cde-1.jpg`); an empty list shows "Photos coming soon".
- **Reviews**: add to `SITE.reviews` in `site.js`; the section appears on the homepage once there's at least one.
- **Owner introduction and initials card**: `index.html`, the `#about` section.
- **Hero illustration**: `assets/img/closer-car.svg`. This is brand artwork; inventory photographs belong in each car's `photos` list.
- **Colours, type, spacing**: `assets/css/tokens.css` (the site uses a light editorial canvas with dark brand sections; change the "jobs" there, not the raw colours). Page styles: `assets/css/site.css`.

## Pages

- `index.html` – homepage with search, promises, latest cars, process, sell/part-exchange, bio, contact
- `cars.html` – search by make/model/trim, filter by budget/type/fuel/gearbox, and sort; removable filters live in the URL and support browser back/forward. Filters collapse on mobile.
- `car.html?id=…` – car page: photos, key facts, "what's wrong with it", service/MOT history, spec, arrange a viewing, ask on WhatsApp, part exchange
- `sell.html` – sell your car / part exchange form; opens WhatsApp (or email) with the details filled in. `sell.html?px=<car id>` pre-selects a part exchange.

Forms don't need a server: everything goes through WhatsApp or email.

The homepage shows the three most recently added cars. Cars with no photos use a clearly labelled illustration. The viewing dialog supports keyboard focus, Escape to close, and focus return; the sell form checks required fields, year and mileage before preparing an enquiry. Selected photos are previews only and need to be sent separately in WhatsApp.
