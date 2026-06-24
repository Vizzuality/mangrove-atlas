# Separate Staging and Production Analysis Cloud Functions

## Problem

Currently the `analysis` Cloud Function is deployed from **both** the `develop` and `main` branches to the **same function name** in the same GCP project. This means:

- A change merged to `develop` immediately overwrites the function that production users are hitting.
- There is no safe way to test new calculation logic on staging before it reaches production.
- Rolling back a bad deploy on develop also rolls back production, and vice versa.

The client (`NEXT_PUBLIC_ANALYSIS_API_URL`) points to a single base URL with no per-environment differentiation.

> **Approach note:** `NEXT_PUBLIC_ANALYSIS_API_URL` stays the **bare** cloud-functions base
> (`https://us-central1-mangrove-atlas-246414.cloudfunctions.net`) — a shared, generic value. The
> per-environment function name lives in a **separate** variable, `NEXT_PUBLIC_ANALYSIS_API_PATH`
> (`analysis` / `analysis-staging` / `analysis-production`). `AnalysisAPI`'s `baseURL` is composed
> as `${URL}/${PATH}` in `src/services/api.ts`. This keeps the base URL reusable and isolates the
> per-env difference to one small variable.

---

## Proposed Solution

Deploy two independently named functions in the **same GCP project** (`mangrove-atlas-246414`, region `us-central1`):

| Environment | Branch  | GCP Function Name    | URL                                                                              |
|-------------|---------|----------------------|----------------------------------------------------------------------------------|
| Staging     | develop | `analysis-staging`   | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-staging`  |
| Production  | main  | `analysis-production`| `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-production`|

- GCP project, region, runtime, and GEE credentials remain shared (no new GCP project needed).
- Vercel already manages separate environments — only the env var value needs updating.
- No new GitHub Secrets are required (same `gcp_credentials` and `GEE_CREDENTIALS_JSON`).

---

## Changes Required

### 1. GitHub Actions — `deploy-analysis.yml`

**File:** `.github/workflows/deploy-analysis.yml`

The `deploy` step (line 35–45) always deploys `name: 'analysis'` regardless of which branch triggered the run. Change it to derive the function name from the branch.

**Current (lines 35–45):**
```yaml
- id: 'deploy'
  name: GC Functions deployment
  uses: 'google-github-actions/deploy-cloud-functions@v2'
  timeout-minutes: 10
  with:
    name: 'analysis'
    runtime: 'nodejs22'
    entry_point: 'analyze'
    memory_mb: '256'
    region: 'us-central1'
    source_dir: 'cloud-functions/analysis'
```

**After:**
```yaml
- name: Set function name
  id: function-name
  run: |
    if [ "$GITHUB_REF" = "refs/heads/main" ]; then
      echo "name=analysis-production" >> "$GITHUB_OUTPUT"
    else
      echo "name=analysis-staging" >> "$GITHUB_OUTPUT"
    fi

- id: 'deploy'
  name: GC Functions deployment
  uses: 'google-github-actions/deploy-cloud-functions@v2'
  timeout-minutes: 10
  with:
    name: '${{ steps.function-name.outputs.name }}'
    runtime: 'nodejs22'
    entry_point: 'analyze'
    memory_mb: '256'
    region: 'us-central1'
    source_dir: 'cloud-functions/analysis'
```

The `test` step at the end (line 47–49) uses `${{ steps.deploy.outputs.url }}` and will automatically point to the correct function — no change needed there.

> **`workflow_dispatch` behaviour:** when triggered manually it will deploy to `analysis-staging` unless the workflow is dispatched from the `main` branch. This is intentional — manual deploys from `main` should go to production.

---

### 2. Vercel Environment Variables

Keep `NEXT_PUBLIC_ANALYSIS_API_URL` as the **bare base domain** in every environment. Add a new
`NEXT_PUBLIC_ANALYSIS_API_PATH` variable holding the function name per environment. `AnalysisAPI`'s
`baseURL` is composed from the two (see §3).

Update in the Vercel project dashboard:

| Vercel Environment | Variable                        | Value                                                                |
|--------------------|---------------------------------|----------------------------------------------------------------------|
| All                | `NEXT_PUBLIC_ANALYSIS_API_URL`  | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net` (bare, unchanged) |
| Preview (staging)  | `NEXT_PUBLIC_ANALYSIS_API_PATH` | `analysis-staging`                                                   |
| Production         | `NEXT_PUBLIC_ANALYSIS_API_PATH` | `analysis-production`                                                |

No other Vercel variables need to change.

---

### 3. Axios baseURL composition — `src/services/api.ts`

The `AnalysisAPI` instance composes its `baseURL` from the bare base URL and the per-environment
function name:

```ts
export const AnalysisAPI = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_ANALYSIS_API_URL}/${process.env.NEXT_PUBLIC_ANALYSIS_API_PATH}`,
  headers: { 'Content-Type': 'application/json' },
});
```

The 5 hook files that call `AnalysisAPI` use `url: ''`, so Axios uses the composed `baseURL`
verbatim. No hook edits are needed — the per-environment routing is entirely driven by
`NEXT_PUBLIC_ANALYSIS_API_PATH`:

| File                                               |
|----------------------------------------------------|
| `src/containers/datasets/habitat-extent/hooks.tsx` |
| `src/containers/datasets/net-change/hooks.tsx`     |
| `src/containers/datasets/height/hooks.tsx`         |
| `src/containers/datasets/biomass/hooks.tsx`        |
| `src/containers/datasets/blue-carbon/hooks.tsx`    |

---

### 4. Local Environment Files

Keep `NEXT_PUBLIC_ANALYSIS_API_URL` as the bare base; add `NEXT_PUBLIC_ANALYSIS_API_PATH`.

**`.env`** / **`.env.local`**:

```dotenv
# Analysis cloud function — bare base domain (shared, unchanged)
NEXT_PUBLIC_ANALYSIS_API_URL=https://us-central1-mangrove-atlas-246414.cloudfunctions.net
# Function name per environment: analysis | analysis-staging | analysis-production
NEXT_PUBLIC_ANALYSIS_API_PATH=analysis-staging
```

**`.env.test`** — bare base + staging path:

```dotenv
NEXT_PUBLIC_ANALYSIS_API_URL=https://us-central1-mangrove-atlas-246414.cloudfunctions.net
NEXT_PUBLIC_ANALYSIS_API_PATH=analysis-staging
```

**`.env.default`** — add the new key (empty placeholder):

```dotenv
NEXT_PUBLIC_ANALYSIS_API_URL=
NEXT_PUBLIC_ANALYSIS_API_PATH=
```

**`.github/workflows/playwright.yml`** — pass the path var to the test job alongside the URL:

```yaml
NEXT_PUBLIC_ANALYSIS_API_PATH: ${{ secrets.NEXT_PUBLIC_ANALYSIS_API_PATH }}
```

---

### 5. `env.mjs` — add the new variable

`NEXT_PUBLIC_ANALYSIS_API_PATH` must be registered in both `client` and `runtimeEnv`:

```js
// client schema
NEXT_PUBLIC_ANALYSIS_API_PATH: z.enum(['analysis', 'analysis-staging', 'analysis-production']),
// runtimeEnv
NEXT_PUBLIC_ANALYSIS_API_PATH: process.env.NEXT_PUBLIC_ANALYSIS_API_PATH,
```

`NEXT_PUBLIC_ANALYSIS_API_URL` stays `z.string().url()` — unchanged.

---

## Migration Steps (Zero-Downtime)

The goal is to have `analysis-production` up and serving before cutting over, so production users never hit a cold or missing function.

### Phase 1 — Deploy the production function (from current main, before any code changes)

1. Go to **Actions → Deploy analysis cloud functions to google** on GitHub.
2. Click **Run workflow**, select the `main` branch.
3. The workflow currently deploys `analysis` — but after merging the workflow change (§1 above) from a `main`-targeting dispatch, it will deploy `analysis-production`.

   > Because the workflow change must land before this step, the ordering is: **merge the workflow PR into `develop` first, then cherry-pick / merge to `main`, then trigger the deploy from `main`.**

   Alternative: temporarily set `name` to `analysis-production` in the workflow, push directly to a branch, dispatch manually.

4. Verify the new function is responding:
   ```bash
   curl -X POST \
     "https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-production" \
     -H "Content-Type: application/json" \
     -d '{"geometry": {...}}'
   ```

### Phase 2 — Deploy the staging function

1. Merge the workflow change (§1) to `develop`. The workflow will automatically deploy `analysis-staging`.
2. Verify the staging function is responding at `…/analysis-staging`.

### Phase 3 — Update the client

1. Merge the `api.ts` baseURL change (§3), `env.mjs` change (§5), and env file updates (§4) to `develop`.
2. Update Vercel env vars (§2) — set `NEXT_PUBLIC_ANALYSIS_API_PATH` (URL stays bare) **before** the Vercel preview deploy picks up the new code, so both the env var and the code change land together.
3. Validate on the Vercel staging preview:
   - Open a staging deploy.
   - Draw a polygon on the map.
   - Confirm the analysis widgets load (network tab should show requests to `…/analysis-staging`).

### Phase 4 — Promote to production

1. Merge `develop` → `main` (normal release).
2. Confirm Vercel production deploy has `NEXT_PUBLIC_ANALYSIS_API_PATH=analysis-production`.
3. Verify analysis on production.

### Phase 5 — Decommission the old shared function (optional)

Once both environments are stable and confirmed, delete the old `analysis` function from GCP to avoid confusion:

```bash
gcloud functions delete analysis --region=us-central1 --project=mangrove-atlas-246414
```

---

## Rollback Plan

Because the old `analysis` function still exists until Phase 5:

- **Client rollback:** set `NEXT_PUBLIC_ANALYSIS_API_PATH` in Vercel back to `analysis` (the old shared function). `NEXT_PUBLIC_ANALYSIS_API_URL` stays the bare base — no URL or hook changes needed. No GCP changes needed.
- **Function rollback:** GCP retains previous revisions of a Cloud Function; you can redeploy from the previous source or trigger a prior workflow run.

---

## Other Cloud Functions: Why They Are Not Affected

### fetch-alerts, alerts-tiler, fetch-alerts-heatmap

These three functions remain as **single shared functions** (no staging/production split at this time). They are completely independent of the analysis split and will continue to work unchanged.

**Why they are not affected by this plan:**

The alerts family uses a separate, hardcoded Axios instance (`src/services/cloud-functions/index.ts`):

```ts
const API_cloud_functions = axios.create({
  baseURL: 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net',
});
```

This file is not touched by this plan. The alerts hooks (`src/containers/datasets/alerts/hooks.tsx` and `src/containers/datasets/alerts-staging/hooks.tsx`) call paths like `/fetch-alerts` against this hardcoded base, which remains valid. Their deployment workflows (`deploy-fetch-alerts.yml`, `deploy-alerts-tiler.yml`, `deploy-fetch-alerts-heatmap.yml`) are also untouched.

**On `alerts-staging`:**  
`src/containers/datasets/alerts-staging/` is a **client-side UI experiment** (a new alerts widget under a feature flag), not a reference to a separate cloud function. It currently calls the same shared `fetch-alerts`, `alerts-tiler`, and `fetch-alerts-heatmap` functions as the production alerts widget. This behaviour is preserved unchanged.

### Applying the same split to alerts functions in the future

If the alerts functions need staging/production separation later, the same pattern applies:

1. In each workflow, derive the function name from the branch (same step as §1 above):
   - `fetch-alerts` → `fetch-alerts-staging` / `fetch-alerts-production`
   - `alerts-tiler` → `alerts-tiler-staging` / `alerts-tiler-production`
   - `fetch-alerts-heatmap` → `fetch-alerts-heatmap-staging` / `fetch-alerts-heatmap-production`

2. Make `src/services/cloud-functions/index.ts` env-var driven (introduce `NEXT_PUBLIC_CLOUD_FUNCTIONS_API_URL`) so Vercel can point each environment at the right base URL.

3. Update Vercel to set `NEXT_PUBLIC_CLOUD_FUNCTIONS_API_URL` per environment.

4. The hardcoded URLs in `alerts-staging/hooks.tsx` (for the heatmap and tiler tile sources) would also need to be replaced with the env var.

This is deliberately out of scope now to keep the change set small and the risk low.

---

## Out of Scope (this plan)

- Splitting `fetch-alerts`, `alerts-tiler`, and `fetch-alerts-heatmap` — covered above with a forward-looking note.
- Making `src/services/cloud-functions/index.ts` env-var driven — a prerequisite for the alerts split, not needed now.
- Separate GEE service accounts per environment — not needed at this stage; both functions share `GEE_CREDENTIALS_JSON`.
- Infrastructure-as-code (Terraform/Pulumi) for the GCP functions — worth considering if the number of managed functions grows.

---

## Checklist

- [ ] Merge workflow change (`deploy-analysis.yml`) to `develop`
- [ ] Trigger manual workflow dispatch from `main` to create `analysis-production`
- [ ] Verify `analysis-production` is live and responding
- [ ] Verify `analysis-staging` is deployed from `develop`
- [ ] Set `NEXT_PUBLIC_ANALYSIS_API_PATH` in Vercel (staging + production) before the next client deploy; keep `NEXT_PUBLIC_ANALYSIS_API_URL` bare
- [ ] Compose `AnalysisAPI` baseURL from URL + PATH in `src/services/api.ts`
- [ ] Add `NEXT_PUBLIC_ANALYSIS_API_PATH` to `env.mjs` (client schema + runtimeEnv)
- [ ] Update `.env`, `.env.test`, `.env.default`, and `playwright.yml`
- [ ] Validate staging Vercel deploy calls `analysis-staging`
- [ ] Validate production Vercel deploy calls `analysis-production`
- [ ] Delete old `analysis` function (after stability confirmed)
