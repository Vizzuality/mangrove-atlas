# Adopting Vitest for Mangrove Atlas

> Status: **Proposal / RFC** — not yet implemented.
> Author: engineering. Last updated: 2026-06-01.

## 1. What this document is for

Mangrove Atlas currently has **one** kind of automated test: Playwright end-to-end
specs in `tests/`, run against a production build. There is **no unit / integration
test layer** — no way to test a pure function, a React Query hook, a Jotai atom, a
reducer, or a single component in isolation without booting the whole app, logging
in, and driving a browser.

This document proposes adding **Vitest** as that missing layer, and lays out:

- the problem it solves and what we would (and would not) test with it,
- why Vitest specifically rather than Jest, `node:test`, Bun, or Playwright component testing,
- the concrete advantages and disadvantages **for this codebase**,
- a phased rollout plan, CI wiring, and the open decisions we need to make.

It is deliberately exhaustive so the team can approve, reject, or amend the approach
before any code lands.

## 2. Where we are today

| Aspect | Current state |
| --- | --- |
| E2E | Playwright `1.58.2`, specs in `tests/`, run against `next build && next start` (slow, see `playwright.config.ts` `webServer`). Auth storage state via `tests/fixtures/global-setup`. |
| Unit / integration | **None.** No Jest, no Vitest, no `node:test`. |
| Types | `tsc --noEmit` (`pnpm check-types`) — catches type errors, not behaviour. |
| Lint | ESLint flat config. |
| Stack relevant to testing | Next `16.2.6` (App Router, **Turbopack** default bundler), React `18.2`, TypeScript `5.9`, React Query `5.99`, Jotai `2.19`, nuqs `2.8`, Tailwind v4, Zod-validated env via `@t3-oss/env-nextjs`. |

### The gap, concretely

Things that are currently **impossible or wildly disproportionate** to test:

- **Pure logic** — `src/lib/*` helpers (`classnames`, `map-fly`, analytics wrappers),
  formatting/units utilities used across widgets, `cloud-functions/analysis` math.
- **Data hooks** — every `src/containers/datasets/<slug>/hooks.tsx` `useQuery` hook:
  query keys, `select`/transform functions, the main-API-vs-`AnalysisAPI` switch driven
  by `analysisAtom` / drawn geometry.
- **Store** — Jotai atoms in `src/store/**` (URL-synced `activeWidgetsAtom`,
  `widgetsCollapsedAtom`, drawing-tool state machines, derived atoms).
- **Registry integrity** — `WIDGETS` / `LAYERS` / `INFO` / `DOWNLOAD` in
  `src/containers/datasets/{index,registries}.tsx` vs `src/containers/widgets/constants.ts`:
  every slug present in both, no dangling layer/legend references. (We literally just
  shipped a circular-import 500 in this area — a cheap import-graph/registry test would
  have caught the regression class.)
- **Page resolution** — `ALLOWED_LOCATION_TYPES` handling and bounds prefetch logic in
  the catch-all `app/[[...params]]/page.tsx`.

A Playwright spec *can* cover some of this, but each costs a browser, a login, and tens
of seconds; you cannot assert on internal transforms, and failures are hard to localise.

## 3. What Vitest is for here (and what it is not)

Vitest fills the **bottom of the test pyramid**. The intended split:

```
        ╱ Playwright E2E ╲          few, slow, real browser, critical user journeys
      ╱   (keep as-is)     ╲
    ╱  Vitest integration   ╲       hooks + store + components w/ jsdom, mocked network
  ╱     Vitest unit          ╲      pure functions, transforms, registry invariants
```

**Vitest is for:** pure functions, React Query hook behaviour (with a mocked Axios /
MSW), Jotai atom logic, small component rendering via Testing Library + jsdom, registry
invariants, Zod schema edge cases.

**Vitest is *not* for:** real Mapbox GL rendering, real auth, multi-page flows, visual
regression, anything needing a real network or GPU. Those stay in Playwright. We are
**not** migrating the existing E2E specs.

## 4. Why Vitest and not something else

### 4.1 Option comparison

| Tool | Fit | Verdict |
| --- | --- | --- |
| **Vitest** | ESM-native, Vite-powered, Jest-compatible API, first-class TS/JSX/path-alias support, `happy-dom`/`jsdom` envs, watch mode, built-in coverage (v8), in-source testing, projects/workspaces. | **Recommended.** |
| **Jest** | The incumbent default. But: CJS-rooted, needs `ts-jest`/`babel-jest` + `@swc/jest` and ESM workarounds; `moduleNameMapper` to mirror our `@/*`/`hooks/*`/`services/*` aliases by hand; slower cold start; ongoing friction with ESM-only deps (we use `lodash-es`, `motion`, `react-map-gl`, MDX). | Workable but more config, slower, more ESM pain. |
| **`node:test` + tsx** | Zero deps, native. But no jsdom, no Testing Library integration story, no built-in mocking/coverage ergonomics, no watch UX comparable to Vitest. | Too low-level for component/hook tests. |
| **Bun test** | Very fast, Jest-like. But Bun is not our runtime (Node 22 / pnpm), would add a second toolchain, and Next/Turbopack/loader parity is unproven here. | Rejected — runtime mismatch. |
| **Playwright Component Testing** | Real browser components. But experimental, heavy per-test cost, no good fit for pure-logic/hook/atom tests, and we already have Playwright for the real-browser tier. | Complementary at best, not the unit layer. |

### 4.2 Why Vitest is the natural fit for *this* repo specifically

1. **Alias parity for free.** Our path aliases (`@/* → src/*`, plus `hooks/*`,
   `services/*`, `components/*`, `utils/*`, `types/*`, `styles/*`) are defined in
   `tsconfig.json`. With `vite-tsconfig-paths` Vitest reads them directly — no second
   copy of the alias map to keep in sync (Jest needs a hand-maintained `moduleNameMapper`).
2. **ESM-native.** The codebase leans on ESM-only packages (`lodash-es` is *enforced* by
   lint, plus `motion`, `react-map-gl`, MDX). Vitest runs these without transform hacks.
3. **Jest-compatible API.** `describe/it/expect/vi` — near-zero learning curve, and
   Testing Library works unchanged, so future contributors aren't learning something exotic.
4. **Speed + watch.** Vite transform pipeline + smart re-runs make TDD on a single util or
   hook feel instant, which is the whole point of adding this tier.
5. **One mental model with the build era we're in.** We just moved to Turbopack/ESM;
   Vitest matches that direction rather than dragging a CJS-era runner along.

> Note: Vitest does **not** use Turbopack; it uses Vite to transform test files. That is
> fine — tests don't need to match the production bundler, only to execute our modules.

## 5. Advantages

- **Fills the missing tier** — fast feedback on logic that E2E can't reach or localise.
- **Catches regression classes we just hit** — registry/import-graph invariants, hook
  transforms, atom transitions. (See the recent Turbopack circular-import 500.)
- **Cheap to run** — milliseconds per test vs tens of seconds per Playwright spec; runs on
  every PR without a Vercel preview or login.
- **Better failure locality** — a red unit test points at one function; a red E2E points at "somewhere".
- **Enables confident refactors** — the widget registry, data hooks, and store are central
  and currently untested; tests make changes there far less scary.
- **Low config burden** *here* — alias/ESM/TS handled by Vite + tsconfig-paths.
- **Coexists with Playwright** — different folder, different command, different CI job. No conflict.
- **Documents intent** — tests become executable specs for opaque transforms.

## 6. Disadvantages, costs, and risks

- **New toolchain to own** — another config, another set of deps to upgrade, another way
  to write tests. Two runners (Vitest + Playwright) means contributors must know which tier
  a given test belongs in. Mitigation: a short "what goes where" rule in `CLAUDE.md`/README.
- **jsdom/happy-dom ≠ real browser** — layout, Mapbox GL, `IntersectionObserver`,
  `matchMedia`, canvas/WebGL are absent or faked. Component tests can pass while the real UI
  breaks. Mitigation: keep DOM-heavy/visual coverage in Playwright; mock browser APIs explicitly.
- **Mocking surface is non-trivial** — to test hooks we must mock the Axios instances in
  `src/services/api.ts` (`API`, `AnalysisAPI`, …) and likely the NextAuth session. MSW is the
  cleanest option but is itself a dependency + setup. Mocking Mapbox/`react-map-gl` is fiddly.
- **Next App Router server components** — `async` server components and server-only APIs
  aren't Vitest's strong suit; we'd test the *logic* extracted from them, not RSC rendering.
- **Maintenance / flake risk** — a poorly mocked hook test can be as flaky as E2E. Coverage
  targets can become box-ticking. Mitigation: test behaviour/contracts, not implementation;
  no blanket coverage gate at first.
- **MDX + Tailwind v4** — `info.mdx` widgets need the MDX transform wired into Vitest;
  Tailwind classes are inert in jsdom (fine — we assert structure/roles, not styles).
- **Upfront time** — config + first patterns + CI wiring is ~1–2 days before payoff.
- **Possible false sense of security** — green unit tests don't prove the app boots; the
  500 we just fixed only reproduced in a real prod build. Unit tests complement, not replace, E2E.

## 7. Proposed setup

### 7.1 Dependencies (dev)

```
vitest @vitest/coverage-v8 @vitest/ui
jsdom                       # or happy-dom (lighter, slightly less complete)
@testing-library/react @testing-library/jest-dom @testing-library/user-event
vite-tsconfig-paths
@vitejs/plugin-react
msw                         # network mocking for hook/integration tests (phase 2)
```

### 7.2 `vitest.config.ts` (sketch)

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,                       // describe/it/expect without imports
    setupFiles: ['./vitest.setup.ts'],   // jest-dom matchers, matchMedia/IO polyfills
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/**', 'cloud-functions/**', 'node_modules/**'],
    coverage: { provider: 'v8', reportsDirectory: 'coverage' },
  },
});
```

Co-locate unit tests as `*.test.ts(x)` next to source. Keep Playwright's `tests/`
untouched and **excluded** from Vitest so the two never collide.

### 7.3 Scripts

```jsonc
{
  "test": "playwright test",            // unchanged — keep E2E as the meaning of `test`? (see §10)
  "test:unit": "vitest",                // watch
  "test:unit:run": "vitest run",        // CI
  "test:unit:ui": "vitest --ui",
  "test:unit:cov": "vitest run --coverage"
}
```

### 7.4 First example tests (high value, low mocking)

- `src/containers/widgets/constants.test.ts` — every `widgets[].slug` exists in `WIDGETS`;
  every `layersIds`/`categoryIds` resolves; `ANALYSIS_WIDGETS_SLUGS` ⊆ slugs.
- `src/containers/datasets/registries.test.ts` — `INFO`/`LAYERS`/`DOWNLOAD` keys are known
  slugs; no `undefined` values.
- `src/lib/*.test.ts` — pure helpers (classnames merge, number/unit formatting).
- A representative `hooks.tsx` test with a `QueryClientProvider` wrapper + mocked Axios,
  asserting query key + `select` transform and the `analysisAtom` reroute.

## 8. Rollout plan (phased)

**Phase 0 — decision (this doc).** Approve scope, naming, CI policy. *Output: sign-off.*

**Phase 1 — foundation (~0.5 day).** Add deps, `vitest.config.ts`, `vitest.setup.ts`,
scripts, exclude `tests/`. Land 3–5 pure-function + registry-invariant tests to prove the
pipeline. *Output: `pnpm test:unit:run` green locally + in CI.*

**Phase 2 — hooks & store (~1–2 days).** Add MSW + a `renderHook` test utility with
`QueryClientProvider` and a Jotai test `Provider`. Cover one data hook end-to-end and the
main-API-vs-`AnalysisAPI` switch; cover 2–3 core atoms. Establish the patterns others copy.

**Phase 3 — components (opt-in, ongoing).** Testing-Library tests for leaf, logic-bearing
components (widget controls, switches, selectors). Browser-API mocks as needed. No mandate
to backfill everything.

**Phase 4 — guardrails (later).** Optional soft coverage reporting (no hard gate initially);
add a "new util/hook ⇒ unit test" expectation to the contribution guide; document the
"which tier?" rule.

## 9. CI integration

- New GitHub Actions job `vitest` (or a step in the existing workflow) on PRs to `develop`:
  `pnpm install` → `pnpm test:unit:run`. Fast, no Vercel preview / browser needed — runs in
  parallel with `check-types`, `lint`, and the slower Playwright job.
- Keep the Playwright job exactly as-is (post-preview-deploy).
- Coverage uploaded as an artifact; **no blocking threshold** until the suite is mature.

## 10. Open decisions

1. **`pnpm test` semantics.** Keep `test` = Playwright and add `test:unit`, or repoint
   `test` to Vitest and rename E2E to `test:e2e`? (Recommend: keep `test` = Playwright for
   now to avoid breaking muscle memory / CI; revisit once Vitest is established.)
2. **`jsdom` vs `happy-dom`.** jsdom = more complete; happy-dom = faster. (Recommend jsdom first.)
3. **MSW vs hand-mocking Axios.** MSW is cleaner long-term but is setup now. (Recommend MSW in Phase 2.)
4. **Test file location.** Co-located `*.test.ts` (recommended) vs a top-level `unit/` dir.
5. **Coverage policy.** Report-only at first; decide on a gate (and target) after Phase 2.

## 11. Recommendation

Adopt **Vitest** for the unit/integration tier, keep **Playwright** for E2E, and roll out
in phases starting with zero-mock pure-logic and registry-invariant tests. The marginal
config cost is low for this stack (ESM + tsconfig path aliases make Vitest almost
config-free), and the highest-value targets — data hooks, store atoms, and the widget
registry — are exactly the central, currently-untested areas where regressions are most
expensive. Start small (Phase 1), prove the pattern on hooks/store (Phase 2), and let
component coverage grow opt-in.
