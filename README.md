# Football Live App (React + Vite + TypeScript)

A modular, scalable, frontend-only football matches platform inspired by Yalla Shoot / Kora Live.

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS v4 (`@tailwindcss/vite`)
- React Router
- Axios
- React Helmet Async (SEO)

## Features

- Home page with:
  - today's matches
  - live matches section (auto-refresh every 30 seconds)
  - upcoming matches
- Match details page with:
  - embedded iframe player
  - multi-server selector
  - league and status info
- Search & filter page:
  - by league
  - by date
  - by status (live / upcoming / finished)
- Responsive navbar and footer
- Reusable components (cards, badges, skeletons, loader)
- Dark sports UI theme
- RTL/LTR toggle support (Arabic-ready)
- NotFound 404 page
- Ads integration placeholder section

## Project Structure

```txt
src/
  components/
    common/
    layout/
    matches/
  context/
  hooks/
  layouts/
  pages/
  routes/
  services/api/
  types/
  utils/
```

## Live API Only

The app now uses real fixtures from TheSportsDB free API only.

- Live API base URL env: `VITE_SPORTSDB_BASE_URL` (default: `https://www.thesportsdb.com/api/v1/json`)
- Live API key env: `VITE_SPORTSDB_API_KEY` (free public key: `123`)

All API logic is inside `src/services/api/api.ts`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - type-check and build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create/update `.env`:

```bash
VITE_FOOTBALL_API_BASE_URL=https://v3.football.api-sports.io
VITE_SPORTSDB_BASE_URL=https://www.thesportsdb.com/api/v1/json
VITE_SPORTSDB_API_KEY=123
```

3. Start dev server:

```bash
npm run dev
```

4. Build production:

```bash
npm run build
```

## Notes For Future Developers

- Keep API logic inside `services/api` and avoid API calls directly in UI components.
- Shared live state is managed via `LiveMatchesContext`.
- Maintain reusability by extending existing components before creating duplicates.
