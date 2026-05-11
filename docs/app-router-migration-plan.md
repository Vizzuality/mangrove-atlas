# Pages Router → App Router Migration Plan

## Overview

Migrate the Global Mangrove Watch app from Next.js **Pages Router** (`src/pages/`) to **App Router** (`src/app/`) in a single branch. This migration also bundles three library upgrades that are necessary for full App Router compatibility.

| What | From | To |
|------|------|----|
| Routing | Pages Router (`src/pages/`) | App Router (`src/app/`) |
| State management | Recoil + recoil-sync | **Jotai** (atoms) + **nuqs** (URL params) |
| Server data | React Query v4 | **React Query v5** |
| Authentication | next-auth 4.24.13 | **next-auth 4.24.14** (latest stable v4, adapted for App Router) |

**Scale**: ~120 files to modify; 19 store files; 55+ files using `next/router`; all providers restructured.

---

## CRITICAL RULE: Verification Gate After Every Phase

> **Do NOT move to the next phase until the current phase is fully verified.**
>
> In our first attempt at this migration, we migrated the store files (Phase 5a/5b) but forgot to update **106 consumer files** that still imported from `'recoil'`. This was only caught much later and created a massive cleanup effort. **This must not happen again.**

After completing each phase, run these verification checks before proceeding:

### Phase-end checklist

1. **Grep for leftover imports** — search the entire `src/` for any old import that should have been removed in the current phase:
   ```bash
   # After Recoil migration (Phase 5):
   grep -r "from 'recoil'" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | grep -v 'src/pages/'
   
   # After next/router migration (Phase 7):
   grep -r "from 'next/router'" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | grep -v 'src/pages/' | grep -v 'src/lib/recoil/'
   
   # After React Query v5 migration (Phase 6):
   grep -r "Hydrate" src/ --include='*.ts' --include='*.tsx' | grep -v 'HydrationBoundary' | grep -v node_modules | grep -v 'src/pages/'
   grep -rn "useQuery(\[" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | grep -v 'src/pages/'
   ```

2. **Count remaining occurrences** — the number must be **zero** (excluding `src/pages/` and `src/lib/recoil/` which are deleted in Phase 10):
   ```bash
   # Example: after Phase 5 is "complete", this MUST return 0:
   grep -rc "from 'recoil'" src/ --include='*.ts' --include='*.tsx' | grep -v ':0$' | grep -v 'src/pages/' | grep -v 'src/lib/recoil/' | wc -l
   ```

3. **TypeScript check** — run `pnpm check-types` after every phase to catch broken imports early, not at the end.

4. **Review what changed vs what should have changed** — compare the number of files you edited against the number of files that import the old pattern. If you changed 19 store files but 106 other files consume those stores, the consumers must also be updated in the same phase.

**If any leftover is found, fix it before moving on. No exceptions.**

---

## Why each change is needed

| Change | Reason |
|--------|--------|
| App Router | Pages Router is legacy in Next.js 15+/16. App Router enables Server Components, streaming, and modern data fetching patterns. |
| Recoil → Jotai | Recoil is **unmaintained** by Meta and incompatible with Server Components. Jotai has a near-identical atom API and is actively maintained. |
| recoil-sync → nuqs | `recoil-sync` relies on `next/router` and `router.events` which don't exist in App Router. `nuqs` is purpose-built for Next.js App Router URL state. |
| React Query v4 → v5 | v5 has first-class App Router support: `HydrationBoundary` replaces `Hydrate`, improved SSR patterns. |
| next-auth 4.24.14 | Latest stable v4 with `getServerSession(authOptions)` — no `req`/`res` needed in Server Components. |

---

## Current Architecture (Pages Router)

```
src/pages/
├── _app.tsx                    ← Provider stack (Recoil, React Query, SessionProvider, etc.)
├── _document.tsx               ← HTML shell, media query styles
├── [[...params]].tsx           ← Main catch-all route (/, /country/:id, /wdpa/:id, /custom-area/:id)
├── embedded.tsx                ← Embeddable map view
├── 404.tsx / 500.tsx           ← Error pages
├── auth/                       ← signin, signup, forgot-password, password/reset
└── api/                        ← NextAuth handler, login, signup, me, send (email)
```

**Key patterns:**
- `getServerSideProps` in `[[...params]].tsx` prefetches location data into React Query
- `RecoilRoot` + `RecoilURLSyncNext` for URL-synced state (active widgets, layers, basemap, bounds, category)
- `useRouter().query` in ~30 widget hooks for location params
- `useRouter().asPath` in ~47 files for current URL
- Desktop/mobile layout chosen at render time via `useWindowSize()` against `breakpoints.md`

---

## Target Architecture (App Router)

```
src/app/
├── layout.tsx                  ← Server Component: HTML shell, fonts, GA, Transifex, SessionProvider
├── providers.tsx               ← 'use client': Jotai, nuqs NuqsAdapter, React Query, MapProvider, etc.
├── not-found.tsx               ← Replaces 404.tsx
├── error.tsx                   ← Replaces 500.tsx ('use client')
├── [[...params]]/
│   ├── page.tsx                ← Server Component: auth + data prefetch + HydrationBoundary
│   └── main-app-client.tsx     ← 'use client': layout switching, sets location atoms
├── embedded/page.tsx
├── auth/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── password/reset/page.tsx
└── api/
    ├── auth/
    │   ├── [...nextauth]/route.ts    ← NextAuth v4 Route Handler
    │   ├── login/route.ts
    │   ├── logout/route.ts
    │   ├── me/route.ts
    │   └── signup/route.ts
    └── send/route.ts
```

---

## Migration Phases

### Phase 1 — Dependencies

**Remove:**
```
recoil, recoil-sync, @recoiljs/refine
```

**Add (pinned versions):**
```
jotai@2.19.1
nuqs@2.8.9
```

**Upgrade:**
```
next-auth → 4.24.14
@tanstack/react-query → 5.99.0
```

**Verification gate:**
```bash
# Confirm old packages are gone and new ones installed
pnpm ls recoil recoil-sync @recoiljs/refine 2>&1 | grep -c "ERR"  # should be 3 (not found)
pnpm ls jotai nuqs next-auth @tanstack/react-query                 # all should show pinned versions
```

---

### Phase 2 — Project Configuration

**`next.config.js`:**
- **Remove** the `i18n` block entirely — it's Pages Router only and unused (Transifex Native handles all translations client-side via `window.Transifex.live`)
- Keep everything else: `output: 'standalone'`, rewrites, redirects, images, MDX/Turbopack config

**Verification gate:**
```bash
# Confirm i18n block is gone
grep -c "i18n" next.config.js  # should be 0
```

---

### Phase 3 — Root Layout & Providers

#### `src/app/layout.tsx` (Server Component)
Replaces `_app.tsx` + `_document.tsx`:
- `<html>` / `<body>` shell
- Font loading via `next/font/google` (Open Sans + Inter)
- `mediaStyles` injection via `<style>` tag
- Google Analytics scripts (conditional on `NEXT_PUBLIC_GA_ID`)
- Transifex Live scripts
- `<SessionProvider>` wrapper (from `next-auth/react`)
- `<Providers>` wrapper (client component)

#### `src/app/providers.tsx` ('use client')
Provider stack:
```
TXProvider (Transifex)
  └─ NuqsAdapter (from 'nuqs/adapters/next/app')
    └─ QueryClientProvider (React Query)
      └─ MediaContextProvider
        └─ MapProvider (react-map-gl)
          └─ TooltipProvider (Radix)
            └─ {children}
            └─ <Toaster />
```

**Verification gate:**
```bash
# Confirm files exist
ls src/app/layout.tsx src/app/providers.tsx
# Confirm no RecoilRoot or RecoilURLSyncNext in new files
grep -r "RecoilRoot\|RecoilURLSyncNext" src/app/  # should return nothing
# Confirm NuqsAdapter is present
grep "NuqsAdapter" src/app/providers.tsx           # should find it
```

---

### Phase 4 — Auth Configuration

#### Extract `authOptions` → `src/lib/auth.ts`
Move the NextAuth config (providers, JWT/session callbacks, cookies) from `pages/api/auth/[...nextauth].ts` to a shared file so both the Route Handler and Server Components can import it.

#### API Route Handlers
Convert all `pages/api/` routes to App Router Route Handlers:

| Old (Pages Router) | New (App Router) |
|---------------------|-------------------|
| `pages/api/auth/[...nextauth].ts` | `app/api/auth/[...nextauth]/route.ts` |
| `pages/api/auth/login.ts` | `app/api/auth/login/route.ts` |
| `pages/api/auth/logout.ts` (from containers) | `app/api/auth/logout/route.ts` |
| `pages/api/auth/me.ts` | `app/api/auth/me/route.ts` |
| `pages/api/auth/signup.ts` | `app/api/auth/signup/route.ts` |
| `pages/api/send.ts` | `app/api/send/route.ts` |

Key change: `NextApiRequest`/`NextApiResponse` → `Request`/`NextResponse`. Use `NextRequest` where cookie/header access is needed.

**Verification gate:**
```bash
# Confirm authOptions is in shared file
grep "export const authOptions" src/lib/auth.ts     # should find it
# Confirm all API route handlers exist and export correct HTTP methods
grep -r "export.*GET\|export.*POST" src/app/api/    # should show all route handlers
# Confirm old pages/api routes will be superseded
ls src/app/api/auth/\[...nextauth\]/route.ts src/app/api/auth/login/route.ts src/app/api/auth/logout/route.ts src/app/api/auth/me/route.ts src/app/api/auth/signup/route.ts src/app/api/send/route.ts
```

---

### Phase 5 — State Management: Recoil → Jotai + nuqs

#### 5a. Store files (`src/store/**/*.ts`)

19 store files. For **plain atoms** (no URL sync), mechanical replacement:

| Recoil | Jotai |
|--------|-------|
| `atom({ key: 'x', default: v })` | `atom(v)` |
| `import { atom } from 'recoil'` | `import { atom } from 'jotai'` |

#### 5b. URL-synced atoms → nuqs hooks

6 atoms that sync to URL query params are replaced with `nuqs` hooks:

| Old (Recoil + recoil-sync) | New (nuqs) |
|-----------------------------|------------|
| `activeWidgetsAtom` | `useActiveWidgets()` → `useQueryState('active-widgets', parseAsArrayOf(parseAsString).withDefault(...))` |
| `activeLayersAtom` | `useActiveLayers()` → `useQueryState('layers', parseAsJson<Layer[]>().withDefault(...))` |
| `activeCategoryAtom` | `useActiveCategory()` → `useQueryState('category', parseAsString.withDefault('distribution_and_change'))` |
| `basemapAtom` | `useBasemap()` → `useQueryState('basemap', parseAsString.withDefault('light'))` |
| `URLboundsAtom` | `useURLBounds()` → `useQueryState('bounds', parseAsArrayOf(parseAsArrayOf(parseAsFloat)).withDefault(null))` |
| `basemapContextualAtom` | `useBasemapContextual()` → `useQueryState('basemaps-contextual', parseAsString.withDefault(null))` |

All return `[value, setValue]` tuples (like `useState`).

#### 5c. Delete `src/lib/recoil/` entirely
Remove `useSyncURLNext.ts`, `devtools.tsx`, and `index.tsx`.

#### 5d. Consumer migration (~106 files)

For **plain atoms**:
```ts
// Before
import { useRecoilValue } from 'recoil';
const value = useRecoilValue(someAtom);

// After
import { useAtomValue } from 'jotai';
const value = useAtomValue(someAtom);
```

| Recoil hook | Jotai hook |
|-------------|------------|
| `useRecoilValue(atom)` | `useAtomValue(atom)` |
| `useSetRecoilState(atom)` | `useSetAtom(atom)` |
| `useRecoilState(atom)` | `useAtom(atom)` |

For **URL-synced atoms** (now hooks):
```ts
// Before
import { useRecoilValue } from 'recoil';
import { activeLayersAtom } from '@/store/layers';
const activeLayers = useRecoilValue(activeLayersAtom);

// After
import { useActiveLayers } from '@/store/layers';
const [activeLayers] = useActiveLayers();
```

**Verification gate (THIS IS THE MOST CRITICAL ONE):**
```bash
# ZERO files outside src/pages/ and src/lib/recoil/ may import from 'recoil'
grep -r "from 'recoil'" src/ --include='*.ts' --include='*.tsx' | grep -v 'src/pages/' | grep -v 'src/lib/recoil/'
# ^^^ MUST return nothing. If it returns ANY file, fix it before moving on.

# ZERO references to deleted atoms (they are now hooks)
grep -rn "activeWidgetsAtom\|activeLayersAtom\|activeCategoryAtom\|basemapContextualAtom" src/ --include='*.ts' --include='*.tsx' | grep -v 'src/pages/' | grep -v 'src/lib/recoil/' | grep -v 'src/store/'
# ^^^ MUST return nothing. Any hit means a consumer still imports the old atom instead of the new hook.

# ZERO references to basemapAtom or URLboundsAtom outside store files
grep -rn "basemapAtom\|URLboundsAtom" src/ --include='*.ts' --include='*.tsx' | grep -v 'src/pages/' | grep -v 'src/lib/recoil/' | grep -v 'src/store/'
# ^^^ MUST return nothing.

# ZERO references to useSetActiveCategory (removed hook)
grep -rn "useSetActiveCategory" src/ --include='*.ts' --include='*.tsx' | grep -v 'src/pages/'
# ^^^ MUST return nothing.

# Confirm src/lib/recoil/ is deleted
ls src/lib/recoil/ 2>&1  # should say "No such file or directory"

# TypeScript check
pnpm check-types
```
> **Lesson learned**: In our first attempt, we migrated the 19 store files but left 106 consumer files still importing `useRecoilValue`/`useRecoilState`/`useSetRecoilState` from `'recoil'`. The store definitions changed but nobody told the consumers. This phase is NOT done until every single consumer file is also updated.

---

### Phase 6 — React Query v4 → v5

#### Call signature changes

```ts
// Before (v4) — positional arguments
useQuery(['key', param], queryFn, { staleTime: 1000 })

// After (v5) — single object
useQuery({ queryKey: ['key', param], queryFn, staleTime: 1000 })
```

#### Other changes

| v4 | v5 |
|----|----|
| `Hydrate` | `HydrationBoundary` |
| `cacheTime` | `gcTime` |
| `isLoading` (mutations) | `isPending` |
| `onSuccess`/`onError` on `useQuery` | Removed (move to `useEffect`) — **not used in this codebase** |

Note: `useMutation` still supports `onSuccess`/`onError` in v5 — no change needed for mutations.

**Verification gate:**
```bash
# ZERO v4 positional-argument useQuery calls (3 args separated by commas)
# Look for useQuery([...], fn, — the old pattern
grep -rn "useQuery(\[" src/ --include='*.ts' --include='*.tsx' | grep -v 'src/pages/' | grep -v node_modules
# ^^^ MUST return nothing.

# ZERO imports of Hydrate (should be HydrationBoundary)
grep -rn "import.*Hydrate.*from '@tanstack/react-query'" src/ --include='*.ts' --include='*.tsx' | grep -v 'HydrationBoundary' | grep -v 'src/pages/'
# ^^^ MUST return nothing.

# ZERO isLoading from mutations (should be isPending)
# This one is tricky — isLoading is valid for useQuery but not for mutations.
# Manually spot-check auth hooks and subscription hooks.

pnpm check-types
```

---

### Phase 7 — `next/router` → `next/navigation` (55 files)

| Pages Router (`next/router`) | App Router (`next/navigation`) |
|------|------|
| `useRouter().push(url)` | `useRouter().push(url)` |
| `useRouter().replace(url, url, { shallow: true })` | `useRouter().replace(url)` |
| `router.asPath` | `usePathname()` (+ `useSearchParams()` if query needed) |
| `router.pathname` | `usePathname()` |
| `router.query.xxx` | `useSearchParams().get('xxx')` |
| `router.isReady` | Remove (always ready) |
| `router.events.on(...)` | Remove (no equivalent — replaced by nuqs) |

#### Location params pattern

~30 widget hooks access `router.query.params` for `locationType`/`locationId`. These are replaced with Jotai atoms set by the main page:

```ts
// src/store/locations/index.ts
export const locationTypeAtom = atom<string | null>(null);
export const locationIdAtom = atom<string | null>(null);

// Set in app/[[...params]]/main-app-client.tsx on mount
// Read in widget hooks via useAtomValue(locationTypeAtom)
```

**Verification gate:**
```bash
# ZERO imports of next/router or next/compat/router outside src/pages/ and src/lib/recoil/
grep -r "from 'next/router'\|from 'next/compat/router'" src/ --include='*.ts' --include='*.tsx' | grep -v 'src/pages/' | grep -v 'src/lib/recoil/'
# ^^^ MUST return nothing.

# ZERO uses of router.query, router.asPath, router.events, router.isReady
grep -rn "router\.query\|router\.asPath\|router\.events\|router\.isReady" src/ --include='*.ts' --include='*.tsx' | grep -v 'src/pages/' | grep -v 'src/lib/recoil/'
# ^^^ MUST return nothing.

# Confirm locationTypeAtom and locationIdAtom exist
grep "locationTypeAtom\|locationIdAtom" src/store/locations/index.ts  # should find both

pnpm check-types
```

---

### Phase 8 — Main Page Migration

#### `src/app/[[...params]]/page.tsx` (Server Component)
Replaces `getServerSideProps`:
```ts
export default async function Page({ params }) {
  const { params: urlParams } = await params;
  const [locationType, locationId] = urlParams ?? [];
  
  const session = await getServerSession(authOptions);  // v4 no-req/res
  const queryClient = new QueryClient();
  
  // Prefetch location data (same logic as getServerSideProps)
  // Use fetch() directly since Axios interceptors are client-only
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainAppClient locationType={locationType} locationId={locationId} />
    </HydrationBoundary>
  );
}
```

#### `src/app/[[...params]]/main-app-client.tsx` ('use client')
- Sets `locationTypeAtom`/`locationIdAtom` on mount
- `useWindowSize()` for desktop/mobile layout switching
- Renders `<DesktopLayout>` or `<MobileLayout>`

**Verification gate:**
```bash
# Confirm server component page and client component exist
ls src/app/\[\[...params\]\]/page.tsx src/app/\[\[...params\]\]/main-app-client.tsx
# Confirm no getServerSideProps in new files
grep "getServerSideProps" src/app/  # should return nothing
# Confirm HydrationBoundary is used
grep "HydrationBoundary" src/app/\[\[...params\]\]/page.tsx  # should find it
pnpm check-types
```

---

### Phase 9 — Other Pages

| Old | New |
|-----|-----|
| `pages/404.tsx` | `app/not-found.tsx` |
| `pages/500.tsx` | `app/error.tsx` (must be `'use client'`) |
| `pages/embedded.tsx` | `app/embedded/page.tsx` |
| `pages/auth/signin.tsx` | `app/auth/signin/page.tsx` |
| `pages/auth/signup.tsx` | `app/auth/signup/page.tsx` (update `next/compat/router` → `next/navigation`) |
| `pages/auth/forgot-password.tsx` | `app/auth/forgot-password/page.tsx` |
| `pages/auth/password/reset.tsx` | `app/auth/password/reset/page.tsx` (update `router.query.token` → `useSearchParams().get('token')`) |

**Verification gate:**
```bash
# Confirm all new page files exist
ls src/app/not-found.tsx src/app/error.tsx src/app/embedded/page.tsx
ls src/app/auth/signin/page.tsx src/app/auth/signup/page.tsx src/app/auth/forgot-password/page.tsx src/app/auth/password/reset/page.tsx
# Confirm no next/compat/router in new pages
grep "next/compat/router" src/app/  # should return nothing
pnpm check-types
```

---

### Phase 10 — Cleanup

1. **Delete** `src/pages/` entirely
2. **Delete** `src/lib/recoil/` entirely
3. Verify `proxy.ts` middleware still works with App Router routes

**Verification gate:**
```bash
# Confirm src/pages/ is gone
ls src/pages/ 2>&1  # should say "No such file or directory"
# Confirm src/lib/recoil/ is gone
ls src/lib/recoil/ 2>&1  # should say "No such file or directory"
# FINAL comprehensive sweep — nothing old should remain anywhere in src/
grep -r "from 'recoil'" src/           # MUST return nothing
grep -r "from 'next/router'" src/      # MUST return nothing
grep -r "from 'next/compat/router'" src/  # MUST return nothing
grep -r "RecoilRoot" src/              # MUST return nothing
grep -r "getServerSideProps" src/      # MUST return nothing
grep -r "NextApiRequest" src/          # MUST return nothing
```

---

### Phase 11 — Final Verification

```bash
pnpm check-types    # TypeScript — must pass with 0 errors
pnpm lint           # ESLint — fix import order issues
pnpm build          # Production build must succeed
```

**Manual smoke tests** (`pnpm dev`):
- [ ] `/` loads worldwide view with widgets
- [ ] `/country/{id}` loads country-specific widgets + map
- [ ] `/wdpa/{id}` loads protected area view
- [ ] `/custom-area/{id}` loads custom area view
- [ ] `/auth/signin` — login flow works
- [ ] `/auth/signup` — signup flow works
- [ ] Logout works
- [ ] URL state sync: active widgets, layers, bounds, basemap persist in query params
- [ ] Language switching via Transifex
- [ ] `/embedded` — embeddable map view
- [ ] Contact form (`/api/send`)
- [ ] Desktop ↔ mobile layout switching at 768px breakpoint
- [ ] Print mode (`print:` Tailwind variants)

**Automated tests:**
```bash
pnpm test           # Playwright e2e suite against production build
```

---

## File Impact Summary

| Category | Files | Change type |
|----------|-------|-------------|
| New `src/app/` files | ~20 | Created |
| Store files (`src/store/`) | 19 | Recoil → Jotai/nuqs |
| Widget hooks (`src/containers/datasets/*/hooks.tsx`) | ~30 | React Query v5 signatures + router → Jotai atoms |
| Widget UI (`src/containers/datasets/*/widget.tsx`, `layer.tsx`) | ~40 | Recoil → Jotai/nuqs hooks |
| Other containers/components | ~30 | Recoil → Jotai + router migration |
| API routes | 6 | Pages API → Route Handlers |
| Auth pages | 4 | Pages → App Router pages |
| Config | 2 | `next.config.js`, `package.json` |
| Deleted | ~15 | `src/pages/`, `src/lib/recoil/` |
| **Total** | **~145 files** | |

---

## Risk & Rollback

- **Branch**: `feat/app-router-migration` — all work isolated from `develop`
- **Rollback**: Revert the branch. Pages Router and App Router cannot coexist for the same routes.
- **Highest risk area**: URL state sync — the switch from `recoil-sync` + `shallow: true` routing to `nuqs` changes how query params are serialized/deserialized. Manual testing of bookmarked URLs is essential.
- **Auth risk**: `getServerSession(authOptions)` without `req`/`res` works since next-auth 4.22, but needs verification in the deployed environment with the `.globalmangrovewatch.org` cookie domain.
