# Recent Platform Changes

> Inventory of every change merged to `develop` between 2026-04-28 and 2026-05-07 (HEAD `6502e7b1`).

## Context

A large architectural migration landed on 2026-04-28 — the app moved off Pages Router onto the App Router, Recoil was replaced with Jotai + nuqs, and 39 ESLint errors were cleared. This document catalogues that migration plus everything shipped on top of it through the most recent `develop` commit.

Source of record: `git log` plus merged-PR listing filtered by date.

---

## 1. Routing & state-management overhaul (landmark)

### What changed

- **Routing**: `src/pages/` → `src/app/`. The Pages Router catch-all (`[[...params]].tsx`) was reimplemented as an App Router segment with the same `ALLOWED_LOCATION_TYPES` gate.
- **State management**: Recoil → **Jotai + nuqs**. URL-synced atoms (formerly `recoil-sync` + `urlSyncEffect`) now use nuqs query parsers.
- **Lint**: 39 ESLint errors resolved → 0. React Compiler compatibility fixes throughout.
- **Dependencies**: transitive security advisories cleared.
- **CI/Playwright**: welcome-dialog race, map-bounds race and WebGL guards stabilized.

### Follow-on commits inside the migration branch

| Commit | Subject |
|---|---|
| `3454903a` | smooth client-side navigation with persistent map state — map stays mounted across route changes; imperative `flyMapTo` via module-level ref; `isNavigatingAtom` blocks bounds writes during RSC transitions; default layers materialized into URL |
| `5e7385e4` | extract `DndContext` to providers; make layout SSR-compatible |
| `c230145f` | dynamic embedded route |
| `e5874b05` | extract `locationQueryOptions` to deduplicate server prefetch (`page.tsx` + `embedded/page.tsx`) |
| `36fbc8e8` | prevent map jump-back when switching locations |
| `fd78305b` | preserve bounds across location nav, write after fly |
| `4bc05ef4` | remove unused imports/declarations across 39 files |
| `932eaef4` | remove 59 unused exports across 28 files |
| `6a7039c0` | un-export 29 unused type exports across 15 files |
| `b0347bdb` | remove unused deps; move braces security pin to overrides |
| `e65718c0` | remove dead code, unused exports, `use-debounce` dep |
| `7ccc07bf` | map scroll zoom fix |
| `280a1758` | guard `JSON.parse` against undefined `NEXT_PUBLIC_FEATURED_FLAGS` |
| `db7f904e` | fix build break after `next@16.2.3` tsconfig auto-migration |
| `1c586549` | replace racy welcome-dialog dance with pre-hydration fixture |
| `fc9bc9a1` | guard `flyTo` callers against uninitialized `react-map-gl` refs |
| `321c484c` | enable `mapbox-gl` testMode under browser automation |
| `bcab7e18` | pin Playwright env defaults in committed `.env.test` |
| `9374fddc` | use standalone server and disable WebGL for stable CI tests |
| `05b6a33a` | enable source maps in CI to trace `undefined.name` crash |

---

## 2. Print Report dedicated page

- New route: `src/app/print-report/[[...params]]/{layout,page}.tsx`. Custom header, legend, logo. Server-side prefetch with `ALLOWED_LOCATION_TYPES` validation.
- Removed `print:hidden` / `print:border-hidden` across widget controls (alerts, carbon market potential, fisheries, flood protection, habitat change, habitat extent, mangroves in protected areas, customize widgets deck, widget-controls).
- White background in print mode; removed print-specific overflow/scaling on layouts and on the `height` chart.
- `ContextualLayersComponent` only renders active layers in print mode and hides controls.
- Follow-up `92133267` corrected map layers, controls, and disabled state in the report.
- `CLAUDE.md` updated to drop outdated `print:` Tailwind variant references.

---

## 3. Cross-app SSO between GMW and MRTT

Single sign-on between Global Mangrove Watch and the Mangrove Restoration Tracker Tool.

### Flow

1. User authenticates on either app.
2. Login sets a shared httpOnly cookie on `.globalmangrovewatch.org` via `/api/auth/sso/set-from-session`.
3. The other app calls `GET /api/auth/sso/authorize` → receives short-lived JWE code (30-second TTL).
4. Code exchanged at `POST /api/auth/sso/exchange` → backend access token + user info.
5. `SessionSync` client component restores the next-auth session from the cookie without exposing tokens to client JS.
6. Logout on either side calls `/api/auth/sso/logout` to clear the cookie cross-app.

### New API routes

| Endpoint | Purpose |
|---|---|
| `GET /api/auth/sso/authorize` | Issue authorization code if SSO cookie valid |
| `POST /api/auth/sso/exchange` | Exchange code for token + user info |
| `POST /api/auth/sso/sync` | MRTT sets SSO cookie on GMW after login |
| `POST /api/auth/sso/logout` | Clear SSO cookie (cross-app logout) |
| `GET /api/auth/sso/restore` | Restore next-auth session from SSO cookie |
| `POST /api/auth/sso/set-from-session` | Set SSO cookie from existing next-auth session |

### New libs

- `sso-code.ts` — JWE-based authorization code generation/verification (30 s TTL).
- `sso-config.ts` — allowed origins, redirect-URI validation, CORS headers.
- `sso-cookie.ts` — shared httpOnly cookie helpers.

### Bundled fixes

- `react-map-gl` `Map` components now have an `onError` handler — they crashed in CI when WebGL unavailable.
- Playwright test URL query params updated to nuqs format after the routing change.

### Post-merge follow-ups on `develop`

- `c98003ec` `setCookie` on auth pages.
- `a40c913b` markdown component.
- `a220ee5b` icons update.
- `3fef6fae` strip block comments from SSO route handlers.

---

## 4. GEE asset paths update

`cloud-functions/analysis` rewired to a new GEE project. Affects custom-area habitat-extent / net-change analyses.

| File | Change |
|---|---|
| `ExtentDataAsset.ts` | `projects/global-mangrove-watch/.../mangrove_extent-v3` → `projects/mangrove-atlas-246414/assets/land-cover/mangrove_extent-v3` |
| `GainDataAssets.ts` | same prefix change for `mangrove_extent_gain-v3` |
| `LossDataAssets.ts` | same prefix change for `mangrove_extent_loss-v3` |

Other assets (aboveground biomass, canopy height, blue carbon, coastlines) were not cloned and remain on the legacy project. Main API path untouched.

---

## 5. Alerts widget de-duplication

`AlertsWidget`: removed paragraph displaying total monitored-areas count. Hardcoded info dropped. Earlier related commit `7600aa9a` ("monitored alerts") on the same file.

---

## 6. Map bounds & navigation polish

| Commit | Effect |
|---|---|
| `36fbc8e8` | prevent map jump-back when switching locations |
| `fd78305b` | preserve bounds across location nav, write after fly |
| `e5874b05` | reusable `locationQueryOptions` (fetch-based, server-safe) used by main and embedded pages |
| `3454903a` | URL-construction fixes (worldwide `///`, trailing slashes, stale bounds); `isNavigatingAtom` blocks nuqs URL-bounds sync from reverting in-flight `router.push` |

---

## 7. Dependency security upgrades

### App-level

- `axios` 1.15.0 → 1.15.2. Earlier 1.14.x → 1.15.0: NO_PROXY SSRF bypass + cloud-metadata exfiltration — GHSA-3p68-rc4w-qgx5, GHSA-fvcv-3m26-pcqx.
- `dompurify` 3.3.3 → 3.4.0.
- `postcss` 8.4.31 → 8.5.10 dev.
- `next` → 16.2.3: Server Components DoS — GHSA-q4gf-8mx6-v5v3.
- `nodemailer` → 8.0.5: SMTP CRLF command injection — GHSA-vvjj-xcjg-gr5g.

### Override pins

- `axios>follow-redirects` 1.16.0 — auth-header leak on cross-domain redirect (GHSA-r4q5-vmmm-2653).
- `lint-staged>yaml` 2.8.3 — YAML stack overflow (GHSA-48c2-rrv3-qjmp).
- `minimatch>brace-expansion` — zero-step DoS (GHSA-f886-m6hf-6m8v).
- `picomatch` transitive — extglob ReDoS, POSIX-class method injection (GHSA-c2c7-rcm5-vvqj, GHSA-3v7f-55p6-f55p).
- `recharts>lodash` 4.18.1 — `_.template` code injection + `_.unset`/`_.omit` prototype pollution (GHSA-r5fr-rjxr-66jc, GHSA-f23m-r3pf-42rh).

### Cloud functions (independent deploys)

| Function | Upgrade |
|---|---|
| `analysis` | transitive deps cleared (high/moderate) |
| `alerts-tiler` | `mocha>serialize-javascript` 7.0.5 — CPU-exhaustion DoS (GHSA-qj8w-gfj5-8c6v); `axios` 1.15.0 SSRF fix |
| `fetch-alerts` | transitive deps cleared; `axios` 1.15.0 SSRF fix |
| `fetch-alerts-heatmap` | `axios` 1.15.0 SSRF fix |
| `upload-alerts` | `node-forge` 1.4.0 — cert-chain bypass, signature forgery, BigInteger DoS (4 advisories) |

### Pending Dependabot bumps

5 open against cloud-function packages (axios 1.15.2, protocol-buffers-schema, @xmldom/xmldom, uuid + bigquery, lodash).

---

## 8. Test stability

- `51487707` resolved post-routing-change Playwright failures.
- Earlier Playwright stability batch listed under §1.

---

## 9. Loose ends on `develop`

- `a40c913b` markdown component added.
- `a220ee5b` icons update.
- Local `fix/dialog-a11y-warnings` branch (`6502e7b1`): Radix Dialog a11y warnings + nested-button fix — not yet merged.

---

## 10. Open work in flight

- `feat: timeline slider for habitat extent widget` — open against `develop`.
- 5 open Dependabot PRs on cloud functions (see §7).

---

## Files touched

`git diff --stat` over the date range: **524 files changed, 4 236 insertions(+), 51 267 deletions(-)**.

Net deletion dominates because the migration removed the entire `src/pages/` tree and Recoil store wrappers.

Heavy-change areas:

- `src/app/`
- `src/app/api/auth/sso/`
- `src/containers/datasets/*/widget.tsx`
- `cloud-functions/analysis/src/data/`
- `package.json`, `pnpm-lock.yaml`

---

## Verification commands

```bash
# Merged PRs in window
gh pr list --repo Vizzuality/mangrove-atlas --state merged --base develop \
  --limit 30 --json number,title,mergedAt \
  --jq '.[] | select(.mergedAt > "2026-04-28")'

# Commit count in window
git log --oneline --no-merges --since=2026-04-28 develop | wc -l

# Open PRs
gh pr list --repo Vizzuality/mangrove-atlas --state open
```
