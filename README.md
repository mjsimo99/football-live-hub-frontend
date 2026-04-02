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

## Static API (Current Setup)

The app currently uses static API data from:

- `public/mock/matches.json`

Axios reads this JSON through `src/services/api/api.ts` to simulate backend integration cleanly.

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

2. Start dev server:

```bash
npm run dev
```

3. Build production:

```bash
npm run build
```

## Notes For Future Developers

- Replace `/mock/matches.json` with real backend endpoints when API is ready.
- Keep API logic inside `services/api` and avoid API calls directly in UI components.
- Shared live state is managed via `LiveMatchesContext`.
- Maintain reusability by extending existing components before creating duplicates.
