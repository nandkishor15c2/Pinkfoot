# Pinkfoot Travel

A two-piece **fully local** travel website:

- **`pinkfoot-app/`** — React 19 + Vite + Tailwind v4 + Framer Motion frontend (home, search, product, destination, admin).
- **`pinkfoot-api/`** — Node + Express + SQLite + Multer backend that runs on `localhost:4000`. Stores everything in `pinkfoot-api/data/pinkfoot.db`; uploaded images live in `pinkfoot-api/uploads/`. No cloud services.

## Quick start

Open **two terminals**.

**Terminal 1 — backend:**
```bash
cd pinkfoot-api
npm install           # first time only
npm run seed          # seeds destinations / packages / reviews from the frontend mocks
npm run dev           # http://localhost:4000  (--watch reloads on file change)
```

**Terminal 2 — frontend:**
```bash
cd pinkfoot-app
npm install           # first time only
npm run dev           # http://localhost:5173
```

Open `http://localhost:5173` for the public site.

## Admin

- URL: `http://localhost:5173/admin/login`
- Default credentials (set in `pinkfoot-api/.env`):
  - email: `admin@pinkfoot.local`
  - password: `pinkfoot-admin`
- Change them before deploying anywhere — the JWT secret too.

Admin features:
- 📊 Dashboard with counts + latest leads
- 📦 Packages — create / edit / delete, upload cover + gallery images, edit itinerary, mark draft/published
- 🗺 Destinations — create / edit / delete, upload hero image
- 📨 Leads — view enquiries from the public booking form, set status (new / contacted / booked / closed)

## Public site routes

| Path | Page |
|---|---|
| `/` | Home (hero, search, destinations, trending packages, why-us, testimonials, newsletter) |
| `/search` | Listing with filters (budget, theme, duration, rating) + sort + grid/list view |
| `/packages/:slug` | Product detail (tabs, sticky booking sidebar, enquiry form → lead) |
| `/destinations` | All destinations grid |
| `/destinations/:slug` | Destination landing |
| `/about`, `/contact` | Static stubs |

## Backend endpoints

Public:

- `GET  /api/health`
- `GET  /api/destinations`
- `GET  /api/destinations/:slug`
- `GET  /api/packages?destination=&theme=&minBudget=&maxBudget=&minRating=&q=`
- `GET  /api/packages/:slug`
- `GET  /api/reviews?packageSlug=`
- `POST /api/leads`          (booking enquiries)
- `POST /api/auth/login`

Admin (require `Authorization: Bearer <jwt>`):

- `GET  /api/auth/me`
- `POST /api/destinations`            (multipart: `heroImage`)
- `PUT  /api/destinations/:id`
- `DELETE /api/destinations/:id`
- `POST /api/packages`                (multipart: `coverImage`, `gallery[]`)
- `PUT  /api/packages/:id`
- `DELETE /api/packages/:id`
- `POST /api/reviews`
- `DELETE /api/reviews/:id`
- `GET  /api/leads`
- `PATCH /api/leads/:id`
- `DELETE /api/leads/:id`

## Resilience

The frontend reads through `src/lib/useData.js`, which **falls back to the bundled mock data** when the API is offline. That means you can demo the public site without running the backend — but admin features and lead capture need the API running.

## Data + uploads

- DB file: `pinkfoot-api/data/pinkfoot.db` (SQLite, WAL mode)
- Image uploads: `pinkfoot-api/uploads/<filename>` — served at `http://localhost:4000/uploads/<filename>`
- Reset everything: `rm pinkfoot-api/data/pinkfoot.db* && cd pinkfoot-api && npm run seed`
- Reset with wipe of existing rows: `cd pinkfoot-api && npm run seed -- --wipe`

## File layout

```
Pinkfoot/
├── pinkfoot-app/          # React frontend
│   ├── src/
│   │   ├── components/    # Navbar, Footer, PackageCard, DestinationCard, …
│   │   ├── pages/         # HomePage, SearchPage, ProductPage, DestinationPage, …
│   │   │   └── admin/     # AdminLayout, AdminDashboard, AdminPackageForm, …
│   │   ├── data/          # mock JSON fallbacks
│   │   ├── lib/           # api.js (fetch wrapper), useData.js (hooks), auth.jsx
│   │   ├── index.css      # Tailwind v4 + brand tokens + utilities
│   │   └── App.jsx
│   └── .env               # VITE_API_BASE=http://localhost:4000
└── pinkfoot-api/          # Node backend
    ├── src/
    │   ├── server.js      # entrypoint
    │   ├── db.js          # SQLite schema + row mappers
    │   ├── auth.js        # JWT helpers + requireAdmin middleware
    │   ├── upload.js      # Multer disk storage
    │   ├── seed.js        # imports frontend mock data into SQLite
    │   └── routes/        # destinations / packages / reviews / leads / auth
    ├── data/              # SQLite DB (gitignored)
    ├── uploads/           # image files (gitignored)
    └── .env               # PORT, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET, CORS_ORIGIN
```

## Production build

The build step is wired but not deployed (everything stays local per current plan):

```bash
cd pinkfoot-app && npm run build       # outputs dist/
cd pinkfoot-app && npm run preview     # serves dist/ on http://localhost:4173
```

If you ever want to host this on a VPS later, the API and frontend can both run behind a single reverse proxy — no code changes needed beyond setting `VITE_API_BASE` and `CORS_ORIGIN`.
