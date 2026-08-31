# Testing

> **Audience**: developers working on Mangrove Atlas.
> **Purpose**: inventory of every test in the repo, how to run each tier, and the conventions to follow when adding new ones.

---

## Architecture overview

All tests live under `tests/` — there are no colocated tests in `src/`. Two runners share the directory, split by a **load-bearing naming convention**:

| Suffix | Runner | Where |
| --- | --- | --- |
| `*.spec.ts` | Playwright (`playwright.config.ts`, `testMatch: '**/*.spec.ts'`) | `tests/` and `tests/a11y/` |
| `*.test.ts(x)` | Vitest (`vitest.config.ts`) | `tests/unit/`, `tests/component/`, `tests/integration/` only |

Naming a Vitest file `*.spec.ts`, or placing it outside the three Vitest directories, will make the wrong runner pick it up (or none at all).

Tiers:

- **E2E** — `tests/*.spec.ts` (10 files), Playwright against a standalone Next.js build.
- **Accessibility (runtime)** — `tests/a11y/*.spec.ts` (5 files), Playwright + axe-core.
- **Component** — `tests/component/**/*.test.tsx` (6 files), Vitest + React Testing Library in jsdom.
- **Unit** — `tests/unit/**/*.test.ts` (20 files), Vitest.
- **Integration** — `tests/integration/` is wired into the Vitest config but currently empty (placeholder tier).
- **Cloud functions** — `cloud-functions/alerts-tiler/test/` (1 file), Mocha + Sinon + c8 on a separate npm toolchain.

---

## Commands

| Command | What it runs |
| --- | --- |
| `pnpm test` | All Playwright suites — e2e **and** a11y (`tests/**/*.spec.ts`) |
| `pnpm test-ui` | Playwright interactive UI mode |
| `pnpm exec playwright test tests/navigation.spec.ts` | A single Playwright spec |
| `pnpm exec playwright test tests/a11y` | Accessibility suite only |
| `pnpm test:unit` | Vitest (unit + component) once |
| `pnpm test:unit:watch` | Vitest in watch mode |
| `pnpm test:unit:coverage` | Vitest with v8 coverage report (`coverage/`) |
| `pnpm lint:a11y` | oxlint static accessibility analysis (jsx-a11y rules) |
| `cd cloud-functions/alerts-tiler && npm test` | Mocha cloud-function test (npm, not pnpm) |

Playwright's `webServer` builds and serves the **standalone** production bundle (`pnpm build`, copy `public/` and `.next/static` into `.next/standalone`, then `node .next/standalone/server.js`), loading `.env.test` with `override: true` first. First run is slow (600 s webServer timeout); test/expect/navigation timeouts are 120 s, action timeout 10 s.

---

## E2E tests (Playwright) — `tests/`

Chromium only. WebGL is disabled via launch flags (`--disable-gpu --disable-software-rasterizer --disable-webgl`) so mapbox-gl fails cleanly instead of hanging; the Firefox project has been removed from the config and specs still carry `test.fixme(browserName === 'firefox')` guards. `reducedMotion: 'reduce'` is set globally to stabilise animations. All specs must import `test`/`expect` from `tests/fixtures/test` — never from `@playwright/test` (see [Fixtures & helpers](#fixtures--helpers)).

| File | Covers |
| --- | --- |
| `tests/app.spec.ts` | Smoke: every `<img>` on `/` resolves HTTP 200 (broken-image guard). |
| `tests/categories.spec.ts` | Category picker writes `?category=` to the URL; each of the 5 categories renders exactly the widgets declared in `src/containers/widgets/constants`. |
| `tests/drawing-tool.spec.ts` | Largest e2e suite: open/leave the drawing tool, GeoJSON upload (happy + malformed paths), custom-area reset via worldwide, leave-confirmation alert flows, polygon removal, and the GMW-1067 regression (reset must not trigger a 400 request). `can draw a polygon` is `test.fixme`. |
| `tests/interactivity.spec.ts` | Expand/collapse-all widgets: button label flips and all widget content in `distribution_and_change` hides/shows. |
| `tests/layers.spec.ts` | Data-driven: contextual layers via widget toggles, contextual basemaps activated via URL, worldwide layer toggles, country layer activate/deactivate. |
| `tests/legend.spec.ts` | Legend ordering after activating net-change + alerts; keyboard drag-reorder of a legend item using dnd-kit's `role="status"` live region as the settle signal. |
| `tests/logo-desktop.spec.ts` | Desktop logo click returns pathname to `/` (pathname only — map URL-sync re-adds `bounds=`). |
| `tests/national-dashboard.spec.ts` | Multi-source National Dashboard against a mocked API (`tests/fixtures/national-dashboard.json`): distinct rows per source, unique switch `aria-label`s, both layers active simultaneously, per-source year picker. |
| `tests/navigation.spec.ts` | Main menu links, blog/news dialog (open → first post → back to list), help guide flow. |
| `tests/planet-date-select.spec.ts` | Planet mosaics popup with 30 mocked mosaics: popup height is capped and scrolls to reach every date. |

---

## Accessibility tests

Accessibility is enforced in **three layers**:

1. **Static** — `pnpm lint:a11y` runs oxlint with 35 `jsx-a11y/*` rules enabled by name (`.oxlintrc.json`, all other categories off). Runs in CI and on staged files in the pre-commit hook.
2. **Token-level** — `tests/unit/styles/contrast.test.ts` reads `tailwind.config.mjs` with `chroma-js` and asserts body-text tokens ≥ 4.5:1 on white and non-text tokens ≥ 3:1. Every palette token must be explicitly classified (body-text / non-text / decorative-only), so adding a token without classifying it fails the test. Also checks `text-black/85` and `/60` composited alpha ramps.
3. **Runtime** — `tests/a11y/*.spec.ts` runs axe-core (via `@axe-core/playwright`) against 8 routes with WCAG 2.0/2.1 A+AA and 2.2 AA tags.

| File | Covers |
| --- | --- |
| `tests/a11y/home.spec.ts` | `/` and `/country/IDN` scans (anchored on a settled widget, never `networkidle`); exactly one non-empty `h1` naming the location; skip link is the first Tab stop and targets `#main-content`. |
| `tests/a11y/auth.spec.ts` | `/auth/signin`, `/auth/signup`, `/auth/forgot-password`: scan + exactly one `main` landmark each. |
| `tests/a11y/embedded.spec.ts` | `/embedded/country/IDN` scan + `main` landmark. |
| `tests/a11y/print-report.spec.ts` | `/print-report/country/IDN` scan + `main` landmark. |
| `tests/a11y/error-pages.spec.ts` | 404 page scan + `main` landmark. |

Helpers:

- `tests/a11y/utils/axe.ts` — `expectNoViolations(page, { route, include?, exclude?, disableRules? })` and `WCAG_TAGS`. Attaches the full violation JSON to the Playwright report and pretty-prints impact/rule/helpUrl/failing nodes on failure.
- `tests/a11y/known-issues.ts` — the **a11y debt ledger**: a per-route map of intentionally disabled axe rules, each entry annotated with the remediation phase that must delete it. Delete entries as phases land; delete the file (and the `getKnownIssues` call) once the object is empty.

---

## Component tests (Vitest + React Testing Library) — `tests/component/`

jsdom environment, `@testing-library/jest-dom` matchers via `vitest.setup.ts`. Env vars for `env.mjs` are supplied by defaults in `vitest.config.ts`, overlaid by `.env`, `.env.local`, `.env.test`, `.env.test.local`.

| File | Covers |
| --- | --- |
| `tests/component/components/chart/data-table.test.tsx` | Chart data table: one row per data point even when x-values repeat (no duplicate React keys); positional row names when unlabeled. |
| `tests/component/components/chart/pie-accessibility.test.tsx` | Each pie sector gets an accessible name from its data label. |
| `tests/component/components/map/controls/share.test.tsx` | Share control copies the *current* location (not the mount-time one); embed URL keeps the path separator; no trailing slash at root; re-reads location on each open. |
| `tests/component/containers/datasets/net-change/chart.test.tsx` | `NetChangeChart` renders the brush SVG only when `configBrush` is set. |
| `tests/component/containers/navigation/menu/profile/account.test.tsx` | Profile update: saving an org preserves existing roles; new role appended to `user_roles`; free-text role sent as `user_role_other`. |
| `tests/component/containers/widget/header.test.tsx` | Widget collapse control is a `button` inside the heading, reports `aria-expanded`/`aria-controls`, toggles from the keyboard. |

---

## Unit tests (Vitest) — `tests/unit/`

### Dataset widgets

| File | Covers |
| --- | --- |
| `tests/unit/containers/datasets/alerts/hooks.test.ts` | `getBrushYearLabelIndices`: even spacing, dropping repeated years, single-year collapse, empty series. |
| `tests/unit/containers/datasets/biomass/hooks.test.ts` | `getColorKeys`: indicator → color by position; empty map when no data. |
| `tests/unit/containers/datasets/blue-carbon/get-data.test.ts` | `getBlueCarbonData`: carbon-density band ordering + percentages, agb/toc/soc → Mt, `noData` flag. |
| `tests/unit/containers/datasets/flood-protection/hooks.test.ts` | `getFormattedValue` for population vs area/stock: millions prefix, thousands separators, decimal rules. |
| `tests/unit/containers/datasets/habitat-change/hooks.test.ts` | `widgetData`: `value → net_change` mapping keeping name/iso; `undefined` when no data. |
| `tests/unit/containers/datasets/habitat-extent/get-data.test.ts` | `getHabitatExtentData`: selected year → legend + chart data in km², ×100 scaling for `ha`. |
| `tests/unit/containers/datasets/height/hooks.test.ts` | `getColorKeys`, `getData` (percentage-of-total, null on empty), `getBars` config. |
| `tests/unit/containers/datasets/locations/hooks.test.ts` | `locationQueryOptions` builds the React Query key from location type + id. |
| `tests/unit/containers/datasets/net-change/hooks.test.ts` | Largest unit file: `getFormat`, `formatAxisTick` (incl. the km²→ha double-convert regression), `getWidgetData` (year ordering, gain/loss sign + scaling, cumulative net), `getEvenlySpacedTicks`, `getNetChangeSources` (one combined `gain-loss-v4` raster source per year, start year excluded). |
| `tests/unit/containers/widgets/utils.test.ts` | `findCategoryByWidgets`: exact match, ignores `widgets_deck_tool`, falls back to `all_datasets`. |

### Hooks

| File | Covers |
| --- | --- |
| `tests/unit/hooks/layers/index.test.ts` | `updateLayers`: remove active, prepend inactive, add to empty list. |
| `tests/unit/hooks/location-navigation/index.test.ts` | `buildPath` per location type; `locationToNavTarget` for country/wdpa/custom-area, worldwide fallbacks. |
| `tests/unit/hooks/use-sync-location/index.test.ts` | `parse` pathname → location: root, each segment+id, `/embedded` and `/print-report` prefix stripping, unknown segment. |

### Lib, store, components, styles

| File | Covers |
| --- | --- |
| `tests/unit/components/chart/chart-tick.test.ts` | `shouldShowTickLabel`: label thinning, always-first/last, crowding avoidance, `MAX_TICK_LABELS` default. |
| `tests/unit/lib/classnames/index.test.ts` | `cn`: merges names, drops falsy, resolves Tailwind conflicts via `twMerge`. |
| `tests/unit/lib/format/index.test.ts` | Number formatters (`numberFormat`, `adaptiveFormat`, `formatAxis`, `formatMillion`, …) — incl. keeping small sub-integer values visible instead of rounding to "0". |
| `tests/unit/lib/utils/index.test.ts` | `normalize` (diacritics, trim/lowercase) and `sortObject` (key + array-value sorting, no mutation). |
| `tests/unit/store/layers/index.test.ts` | `parseAsLayers` nuqs parser: valid JSON, fallback to default layer on invalid, serialize round-trip. |
| `tests/unit/store/map/index.test.ts` | `parseAsBounds` nuqs parser: valid JSON, null on invalid, serialize round-trip. |
| `tests/unit/styles/contrast.test.ts` | Design-token contrast guard (see [Accessibility tests](#accessibility-tests), layer 2). |

---

## Cloud functions

- `cloud-functions/alerts-tiler/test/index.test.js` — `fetchAlertsTiler` returns a parseable Mapbox vector tile for a given x/y/z + date range. Mocha + Sinon + c8, run with `npm test` inside the function directory (cloud functions use npm lockfiles, not pnpm workspaces).
  - ⚠️ **Not run by any CI workflow**, and currently broken: it asserts `res.status.calledOnceWith(200)` but `getMocks()` only stubs `res.send`, so `res.status` is never a Sinon stub.
- No tests exist in `cloud-functions/analysis`, `fetch-alerts`, `fetch-alerts-heatmap`, or `upload-alerts`.

---

## Fixtures & helpers

| File | Purpose |
| --- | --- |
| `tests/fixtures/test.ts` | **The central Playwright fixture — specs must import `test`/`expect` from here, not `@playwright/test`.** Seeds `welcomeIntroMessage`/`guideLocalStorage` in localStorage pre-hydration (kills the welcome-dialog overlay race) and fails the test on any `pageerror` (while only logging `console.error`). Also exports `visibleByTestId(page, testId)` — fresnel renders both mobile and desktop layouts into the DOM, so shared test-ids appear twice and trip strict mode. |
| `tests/fixtures/global-setup.ts` | Playwright `globalSetup`: seeds the same localStorage keys into `test-results/.auth/storage-state.json`. |
| `tests/fixtures/drawing-tool.ts` | `useDrawingTool(page)` page object: `open()`, `draw()`, `uploadGeojson(file)` (waits on `POST /spatial_file/converter` with a 60 s timeout overriding the 10 s action timeout), plus expected bounds values. |
| `tests/fixtures/sidebar.ts` | `useSidebar(page)`: `clickWordwide()`, `clickSearch()`. |
| `tests/fixtures/national-dashboard.json` | Multi-source National Dashboard API response mock. |
| `tests/documents/geojson.json` / `geojson-incorrect.json` | Drawing-tool upload payloads (valid FeatureCollection vs bare MultiPolygon Feature). |

---

## CI

| Workflow | Trigger | Runs |
| --- | --- | --- |
| `.github/workflows/playwright.yml` | PRs → `develop` | `pnpm exec playwright test` (chromium only), builds the standalone bundle in-workflow; uploads `playwright-report/` and `test-results/` artifacts (30-day retention). |
| `.github/workflows/unit-tests.yml` | PRs → `develop` | Two jobs: `a11y-lint` (`pnpm lint:a11y`) and `vitest` (`pnpm test:unit:coverage`). |

Local gate: `.husky/pre-commit` runs `pnpm check-types` then lint-staged (`eslint --fix` + `oxlint` on staged `*.{js,jsx,ts,tsx}`).

---

## Coverage

`pnpm test:unit:coverage` uses the v8 provider (reporters: `text`, `text-summary`, `html` → `coverage/`). The include list is deliberately scoped to the **logic layer** — `src/lib`, `src/store`, `src/hooks`, `src/utils`, `src/containers/widgets/utils.tsx`, `src/containers/datasets/*/get-data.tsx` — the view layer is intentionally excluded from the denominator because Playwright covers it end-to-end.

---

## Adding a new test

1. **Pick the tier**: pure function → `tests/unit/` (mirror the `src/` path); rendered component behaviour → `tests/component/`; user flow or route-level behaviour → `tests/` (e2e); accessibility scan of a new route → `tests/a11y/`.
2. **Name it correctly**: `*.test.ts(x)` for Vitest, `*.spec.ts` for Playwright — see [Architecture overview](#architecture-overview).
3. **Playwright specs** import `test`/`expect` from `tests/fixtures/test`, use `data-testid` selectors (via `visibleByTestId` when the element exists in both fresnel layouts), and settle on a concrete element — never `networkidle`.
4. **A11y specs** call `expectNoViolations` from `tests/a11y/utils/axe.ts`; a rule that can't pass yet goes into `tests/a11y/known-issues.ts` with the remediation phase that will remove it.
5. **Coverage** only counts logic-layer files (see above) — putting logic in `src/lib`/`src/hooks`/`get-data.tsx` keeps it measurable.
