# Carvantage website

Static site, no build step. Open `index.html` or run `python3 -m http.server 8080` in this folder.

## Editing

- **Your details** (town, phone, WhatsApp number, email, Instagram, viewing hours): `assets/js/site.js`, the `SITE` object at the top. The phone, WhatsApp and email values in there are dummies: replace them before going live. Set `draft: true` while filling things in (dashed boxes mark placeholders); with `draft: false` any placeholder copy is hidden rather than shown to the public.
- **Hero and owner photos**: set `heroPhoto` and `ownerPhoto` in `SITE` to image paths (e.g. `assets/img/hero.jpg`). Until then the hero shows the brand panel and the owner photo box is hidden.
- **Stock**: `assets/js/cars.js`. One object per car. Set `status` to `available`, `reserved` or `sold`. Put photo paths in `photos` (e.g. `assets/img/stock/ford-fiesta-2014-1.jpg`); an empty list shows "Photos coming soon". A `sold` car stays on the site with a "Sold" banner and in the "Recently sold" strip, which is good for trust; delete the object once it's a few weeks old.
- **Photos**: export at 1600×1200 (4:3, landscape) as JPEG, aim for under 250 KB each, name them `assets/img/stock/<car id>-<n>.jpg`. The first photo is the one on the cards. Condition notes can point at a photo number (`photo: 7`); that becomes a "Shown in photo 7" link that opens it.
- **Site address**: `url` in `SITE` must match the domain in `CNAME` and the URLs in `sitemap.xml`. It's used for share previews and search listings.
- **Reviews**: add to `SITE.reviews` in `site.js`; the section appears on the homepage once there's at least one.
- **Owner bio and photo**: `index.html`, the `#about` section.
- **Colours, type, spacing**: `assets/css/tokens.css` (the site uses a light editorial canvas with dark brand sections; change the "jobs" there, not the raw colours). Page styles: `assets/css/site.css`.

## Pages

- `index.html` – homepage with search, promises, latest cars, process, sell/part-exchange, bio, contact
- `cars.html` – browse with filters (budget, type, fuel, gearbox) and sort; filters live in the URL so links can be shared
- `car.html?id=…` – car page: photos, key facts, "what's wrong with it", service/MOT history, spec, arrange a viewing, ask on WhatsApp, part exchange
- `sell.html` – sell your car / part exchange form; opens WhatsApp (or email) with the details filled in. `sell.html?px=<car id>` pre-selects a part exchange.

Forms don't need a server: everything goes through WhatsApp or email.
