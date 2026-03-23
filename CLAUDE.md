# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Start development server
npm run build       # Production build (outputs to /build)
npm test            # Run Jest tests
npm run netlify-dev # Run local Netlify dev environment (includes API proxy redirects)
```

To run a single test file:
```bash
npm test -- --testPathPattern="ComponentName"
```

## Architecture

**MangaStack** is a React SPA for reading manga via the MangaDex V5 API, deployed on Netlify.

### API Routing

All API calls are proxied through Netlify redirects (defined in `netlify.toml`):
- `/api/*` → `https://api.mangadex.org` (MangaDex V5 API)
- `/mangadb/*` → `mangadb-search.herokuapp.com` (full-text search)
- `/mdh/*` → `mangadb-search.herokuapp.com` (chapter image serving)
- `/image/*` → `mangadb-search.herokuapp.com` (cover image proxy)

Use `npm run netlify-dev` locally to have these redirects active; plain `npm start` won't proxy API calls.

### V5 API Response Transformation

MangaDex V5 returns a different structure than V2. `src/hooks/toV2.js` converts V5 responses into a simplified format that the rest of the app consumes. When working with API data, trace through `toV2.js` to understand the shape of objects passed to components.

### State Management

Redux store with two slices, persisted to `localStorage` key `'state'` on every change:
- `settings`: theme (`light`/`dark`), language, NSFW filter, low-resolution toggle
- `mangaList`: array of `{ mangaInfo, chapterInfo }` objects tracking reading progress

### Data Fetching

Custom hooks in `src/hooks/` handle all API fetching:
- `mangadex-api.js`: `useMangaData`, `useChapters`, `useCoverArt`, etc. — MangaDex V5 endpoints
- `mangadb-api.js`: `useSearchResults` — fast search via external service

Components call these hooks and handle loading/error states locally; no async actions in Redux.

### Styling

Material-UI v4 with `makeStyles()` for component-scoped styles. Two themes defined in `src/themes/themes.js` — dark theme uses orange as primary color. Responsive breakpoints follow MUI's xs/sm/md/lg/xl system.

### Hardcoded Data

`src/assets/popularManga.js` and `src/assets/topRatedManga.js` contain static manga lists rendered on the homepage for SEO purposes — these are intentionally not fetched dynamically.

## Code Style

Prettier config (`.prettierrc`): single quotes, trailing commas (ES5), arrow parens always, semicolons on.
