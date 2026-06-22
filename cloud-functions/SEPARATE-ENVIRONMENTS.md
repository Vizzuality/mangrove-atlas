# Separate Staging and Production Analysis Cloud Functions

## Problem

Currently the `analysis` Cloud Function is deployed from **both** the `develop` and `master` branches to the **same function name** in the same GCP project. This means:

- A change merged to `develop` immediately overwrites the function that production users are hitting.
- There is no safe way to test new calculation logic on staging before it reaches production.
- Rolling back a bad deploy on develop also rolls back production, and vice versa.

The client (`NEXT_PUBLIC_ANALYSIS_API_URL`) points to a single base URL with no per-environment differentiation.

---

## Proposed Solution

Deploy two independently named functions in the **same GCP project** (`mangrove-atlas-246414`, region `us-central1`):

| Environment | Branch  | GCP Function Name    | URL                                                                              |
|-------------|---------|----------------------|----------------------------------------------------------------------------------|
| Staging     | develop | `analysis-staging`   | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-staging`  |
| Production  | master  | `analysis-production`| `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-production`|

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
    if [ "${{ github.ref }}" = "refs/heads/master" ]; then
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

> **`workflow_dispatch` behaviour:** when triggered manually it will deploy to `analysis-staging` unless the workflow is dispatched from the `master` branch. This is intentional — manual deploys from `master` should go to production.

---

### 2. Vercel Environment Variables

`NEXT_PUBLIC_ANALYSIS_API_URL` must now include the **full function URL** (base domain + function name) instead of just the base domain. This is because the hooks (see §3) will no longer append a `/analysis` path suffix.

Update in the Vercel project dashboard:

| Vercel Environment | Variable                        | New Value                                                                                 |
|--------------------|---------------------------------|-------------------------------------------------------------------------------------------|
| Preview (staging)  | `NEXT_PUBLIC_ANALYSIS_API_URL`  | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-staging`           |
| Production         | `NEXT_PUBLIC_ANALYSIS_API_URL`  | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-production`        |

No other Vercel variables need to change.

---

### 3. Client Hooks — Remove the `/analysis` path

**Background on the URL change:**  
Axios resolves a URL starting with `/` as an absolute path against the origin, discarding any path in `baseURL`. With the new `baseURL` of `https://…/analysis-staging`, calling `url: '/analysis'` would resolve to `https://…/analysis` — the *old* function — because the leading `/` strips the base path. Changing to `url: ''` (empty string) tells Axios to use `baseURL` verbatim.

The 5 hook files that call `AnalysisAPI` all follow the same pattern:

```ts
AnalysisAPI.request({
  method: 'post',
  url: '/analysis',   // ← this line in each file
  ...
})
```

Change `url: '/analysis'` → `url: ''` in each of the following files:

| File                                                                   | Approximate Line |
|------------------------------------------------------------------------|-----------------|
| `src/containers/datasets/habitat-extent/hooks.tsx`                     | 48              |
| `src/containers/datasets/net-change/hooks.tsx`                         | (search for `url: '/analysis'`) |
| `src/containers/datasets/height/hooks.tsx`                             | (search for `url: '/analysis'`) |
| `src/containers/datasets/biomass/hooks.tsx`                            | (search for `url: '/analysis'`) |
| `src/containers/datasets/blue-carbon/hooks.tsx`                        | (search for `url: '/analysis'`) |

Quick grep to find all occurrences before editing:
```bash
grep -rn "url: '/analysis'" src/containers/datasets/
```

---

### 4. Local Environment Files

**`.env`** — Update the `NEXT_PUBLIC_ANALYSIS_API_URL` entry to clarify the per-environment values:

```dotenv
# Analysis cloud function — set the full function URL per environment
# Staging:
NEXT_PUBLIC_ANALYSIS_API_URL=https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-staging
# Production:
# NEXT_PUBLIC_ANALYSIS_API_URL=https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-production
```

**`.env.test`** — Update to point at the staging function (line with `NEXT_PUBLIC_ANALYSIS_API_URL`):

```dotenv
NEXT_PUBLIC_ANALYSIS_API_URL=https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-staging
```

---

### 5. `env.mjs` — No changes required

`NEXT_PUBLIC_ANALYSIS_API_URL` is already defined as a `z.string().url()` — accepting any valid URL — so no schema change is needed.

---

## Migration Steps (Zero-Downtime)

The goal is to have `analysis-production` up and serving before cutting over, so production users never hit a cold or missing function.

### Phase 1 — Deploy the production function (from current master, before any code changes)

1. Go to **Actions → Deploy analysis cloud functions to google** on GitHub.
2. Click **Run workflow**, select the `master` branch.
3. The workflow currently deploys `analysis` — but after merging the workflow change (§1 above) from a `master`-targeting dispatch, it will deploy `analysis-production`.

   > Because the workflow change must land before this step, the ordering is: **merge the workflow PR into `develop` first, then cherry-pick / merge to `master`, then trigger the deploy from `master`.**

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

1. Merge the hooks change (§3) and env file updates (§4) to `develop`.
2. Update Vercel env vars (§2) — do this **before** the Vercel preview deploy picks up the new code, so both the env var and the code change land together.
3. Validate on the Vercel staging preview:
   - Open a staging deploy.
   - Draw a polygon on the map.
   - Confirm the analysis widgets load (network tab should show requests to `…/analysis-staging`).

### Phase 4 — Promote to production

1. Merge `develop` → `master` (normal release).
2. Confirm Vercel production deploy uses `NEXT_PUBLIC_ANALYSIS_API_URL` pointing to `analysis-production`.
3. Verify analysis on production.

### Phase 5 — Decommission the old shared function (optional)

Once both environments are stable and confirmed, delete the old `analysis` function from GCP to avoid confusion:

```bash
gcloud functions delete analysis --region=us-central1 --project=mangrove-atlas-246414
```

---

## Rollback Plan

Because the old `analysis` function still exists until Phase 5:

- **Client rollback:** revert `NEXT_PUBLIC_ANALYSIS_API_URL` in Vercel to `https://us-central1-mangrove-atlas-246414.cloudfunctions.net` and revert the hooks change (restore `url: '/analysis'`). No GCP changes needed.
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
- [ ] Trigger manual workflow dispatch from `master` to create `analysis-production`
- [ ] Verify `analysis-production` is live and responding
- [ ] Verify `analysis-staging` is deployed from `develop`
- [ ] Update Vercel env vars (staging + production) before the next client deploy
- [ ] Update hooks (`url: '/analysis'` → `url: ''`) in all 5 files
- [ ] Update `.env` and `.env.test`
- [ ] Validate staging Vercel deploy calls `analysis-staging`
- [ ] Validate production Vercel deploy calls `analysis-production`
- [ ] Delete old `analysis` function (after stability confirmed)
