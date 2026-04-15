# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm 10.x** (Node 22, see `.nvmrc`). Use `pnpm` — not `npm`/`yarn`.

```bash
pnpm dev              # dev server on :3000
pnpm build            # production build
pnpm lint             # ESLint (flat config, eslint.config.mjs)
pnpm check-types      # tsc --noEmit
pnpm test             # Playwright e2e (builds + starts prod server via webServer config)
pnpm test-ui          # Playwright interactive UI
npx playwright test tests/navigation.spec.ts   # single test file
```

Note: `pnpm test` runs `pnpm build && pnpm start` under the hood (see `playwright.config.ts` — `webServer.command`). It's slow; prefer a single-file run during iteration.

Env vars are validated by Zod via `@t3-oss/env-nextjs` in `env.mjs`. Missing/invalid vars throw at startup — add new vars there *and* in `runtimeEnv` (Next.js bundling requirement).

## Architecture

### App structure (Next.js Pages Router)

This is **Pages Router**, not App Router. The entire UI is served from a single catch-all route:

- `src/pages/[[...params]].tsx` — resolves `/`, `/country/:id`, `/wdpa/:id`, `/custom-area/:id` (allowed types hardcoded as `ALLOWED_LOCATION_TYPES`). Any other top-level path returns 404.
- `getServerSideProps` prefetches the location into React Query (dehydrated state) and normalizes the NextAuth session.
- Desktop vs mobile layouts are chosen at render time by `useWindowSize()` against `breakpoints.md` — both are imported, only one renders. This means layout switching is client-only; SSR renders neither.
- `src/pages/embedded.tsx` is a separate embeddable view.
- `proxy.ts` (matcher: `/api/:path*`) handles CORS for the embeddable/MRTT integrations and hides `/auth` in production.

### The widget system (most of the app)

Widgets are the core domain concept. Understanding this is the key to working in this repo:

1. **`src/containers/widgets/constants.ts`** — declarative registry: each widget has a `slug`, `name`, `locationType[]` (which views it applies to), `categoryIds[]`, `layersIds[]`, and optional `contextualLayers[]`. This is the source of truth for what widgets exist and where they show up. Also exports `CATEGORIES`, `LAYERS_BY_CATEGORY`, `ANALYSIS_WIDGETS_SLUGS`.
2. **`src/containers/datasets/<slug>/`** — implementation per widget. Conventional files:
   - `widget.tsx` — the card UI
   - `hooks.tsx` — React Query hook(s) for data; switches between main API and `AnalysisAPI` depending on `analysisAtom` / drawn geometry
   - `layer.tsx` — Mapbox source/layer config
   - `map-legend.tsx`, `chart.tsx`, `info.mdx`, `download.tsx`, `types.d.ts`
3. **`src/containers/datasets/index.tsx`** — the `WIDGETS` registry object mapping slug → widget component. `src/containers/widgets/index.tsx` iterates `widgetsAvailable` and renders `WIDGETS[slug]`. Adding a new widget requires entries in **both** places (plus a store atom if it has settings).
4. **`src/store/widgets/<slug>.ts`** — Recoil atoms for per-widget UI settings (selected year, unit, etc.). Index in `src/store/widgets/index.ts` holds cross-widget state (`activeWidgetsAtom` — URL-synced via `recoil-sync`, `widgetsCollapsedAtom`).

When a user draws or uploads a polygon (`drawingToolAtom` / `drawingUploadToolAtom`), the visible widget set is filtered to `ANALYSIS_WIDGETS_SLUGS` and data hooks reroute to `AnalysisAPI` (the `cloud-functions/analysis` endpoint) instead of the main API.

### State management

Two-tier split — don't mix them:

- **React Query v4 (`@tanstack/react-query` — v4, not v5)** for server state. All widget data hooks return the standard `useQuery` result. SSR prefetches via `dehydrate(queryClient)`.
- **Recoil + `recoil-sync`** for client state. `activeWidgetsAtom` (and some others) use `urlSyncEffect` to persist to the URL. Stores are organized by domain under `src/store/{analysis,drawing-tool,layers,locations,map,map-settings,sidebar,widgets,...}/`.

### API clients

`src/services/api.ts` exports multiple Axios instances — pick deliberately:

- `API` (default) — main backend, injects `Bearer` token from the NextAuth session via request interceptor
- `AnalysisAPI` — analysis cloud function (no auth)
- `BlogAPI`, `PlanetAPI`, `ClimateWatchAPI` — external proxies (see `next.config.js` rewrites for `/planet/*`, `/planet-api/*`, `/blog/*`)
- `NextAPI` — local `/api/*` routes
- `AuthAPI` — separate auth service, also token-injecting

Auth is NextAuth v4. Session is normalized in `getServerSideProps` and passed through; `accessToken` is attached by both `API` and `AuthAPI` interceptors.

### Cloud Functions (separate deployable)

`cloud-functions/` is **not** part of the Next.js build (excluded in `tsconfig.json` and `eslint.config.mjs`). Each subdirectory is an independent Google Cloud Function with its own `package.json`:

- `analysis/` — on-the-fly geospatial analysis for user-drawn polygons (habitat extent, net change, biomass, height, blue carbon). Called by `AnalysisAPI`.
- `fetch-alerts/`, `fetch-alerts-heatmap/` — deforestation alerts from Google Earth Engine (requires GEE `credentials.json`)
- `alerts-tiler/` — MVT tile server for alerts
- `upload-alerts/` — data pipeline to BigQuery

Each deploys independently via `.github/workflows/deploy-*.yml` on push to `develop`/`master` when its files change. Local dev: `npm install && npm run watch` in the subdir, then hit `localhost:8080`.

## Conventions that matter

- **Always `lodash-es`, never `lodash`.** Enforced by `no-restricted-imports` in ESLint.
- **Import ordering is ESLint-enforced** (`import/order` with extensive `pathGroups` in `eslint.config.mjs`). Path aliases: `@/*` → `src/*`, plus explicit `hooks/*`, `services/*`, `components/*`, `utils/*`, `types/*`, `styles/*`. New imports: let the linter sort them rather than guessing.
- **Styling is Tailwind v4** with `prettier-plugin-tailwindcss` sorting classes on save. `cn` helper at `@/lib/classnames`. Widget-shared class constants live in `src/styles/widgets.ts` (e.g. `WIDGET_CARD_WRAPPER_STYLE`, `WIDGET_SENTENCE_STYLE`).
- **i18n**: Transifex Native, locales `en`/`fr`/`es` (`localeDetection: false`). Strings that should not be translated get `className="notranslate"` (see numeric values in widgets).
- **Analytics**: use the `trackEvent` wrapper from `@/lib/analytics/ga` — only fires when `NEXT_PUBLIC_GA_ID` is set.
- **Print mode**: `printModeState` drives a print CSS path — many widget components have `print:` Tailwind variants. Don't strip them when refactoring.
- **Prettier**: single quotes, trailing commas `es5`, 100 char width. Pre-commit hook runs lint-staged (`.lintstagedrc.js`).

## Testing

Playwright only — no unit test framework is configured. Tests live in `tests/`, run against a **production build** (not dev), and use an auth storage state generated by `tests/fixtures/global-setup`. CI runs them on PRs to `develop` after the Vercel preview deploy (`.github/workflows/playwright.yml`). The `test-results/.auth/storage-state.json` and login flow are required for most specs.

## Deployment

Vercel for the Next.js app (`output: 'standalone'` is set — see `next.config.js` — but deploys go through Vercel, not the standalone output). Cloud functions deploy independently via the `deploy-*.yml` workflows. Do not expect the app and the cloud functions to deploy together.

