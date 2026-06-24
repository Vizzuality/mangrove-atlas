# Separate Environments — Deployment Next Steps

This document covers what still needs to happen after the code changes in this PR are merged.
For the full design rationale, see [SEPARATE-ENVIRONMENTS.md](./SEPARATE-ENVIRONMENTS.md).

---

## Before merging the PR

Keep `NEXT_PUBLIC_ANALYSIS_API_URL` as the **bare base domain** in every Vercel environment.
Add a new `NEXT_PUBLIC_ANALYSIS_API_PATH` variable holding the function name per environment.
`AnalysisAPI`'s `baseURL` is composed as `${URL}/${PATH}` in `src/services/api.ts`.

In the **Vercel project dashboard**:

| Vercel environment | Variable                        | Value |
|--------------------|---------------------------------|-------|
| All                | `NEXT_PUBLIC_ANALYSIS_API_URL`  | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net` (unchanged) |
| Preview (staging)  | `NEXT_PUBLIC_ANALYSIS_API_PATH` | `analysis-staging` |
| Production         | `NEXT_PUBLIC_ANALYSIS_API_PATH` | `analysis-production` |

> ⚠️ Set `NEXT_PUBLIC_ANALYSIS_API_PATH` **before** any Vercel deploy picks up the new code.
> If the path var is missing when the code goes live, env validation (`env.mjs`) fails the build.

---

## After merging to `develop`

The workflow (`.github/workflows/deploy-analysis.yml`) now fires on changes to the workflow
file itself, so merging the PR automatically deploys `analysis-staging`.

**Verify it's live:**
```bash
curl -X POST \
  "https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-staging" \
  -H "Content-Type: application/json" \
  -d '{"geometry": {"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}}'
```

**Verify the Vercel staging deploy:**
1. Open a Vercel preview/staging deploy.
2. Draw a polygon on the map.
3. Open the browser network tab and confirm requests go to `…/analysis-staging`.

---

## After merging `develop` → `main`

The same workflow fires on merge to `main` and deploys `analysis-production`.

**Verify it's live:**
```bash
curl -X POST \
  "https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-production" \
  -H "Content-Type: application/json" \
  -d '{"geometry": {"type":"Polygon","coordinates":[[[0,0],[1,0],[1,1],[0,1],[0,0]]]}}'
```

**Verify the Vercel production deploy:**
Same as above — draw a polygon, confirm network requests go to `…/analysis-production`.

---

## Troubleshooting — CORS / 403 on a newly deployed function

A freshly deployed `analysis-staging` / `analysis-production` will return **403 Forbidden** (which
the browser surfaces as a **CORS error**) until it is granted public invoke permission. The old
shared `analysis` function already has it; new functions created by the deploy action do **not**
inherit it.

Grant `allUsers` the invoker role once per function:

```bash
# Gen2 (Cloud Run backed)
gcloud run services add-iam-policy-binding analysis-staging \
  --region=us-central1 --project=mangrove-atlas-246414 \
  --member=allUsers --role=roles/run.invoker

# Gen1
gcloud functions add-invoker-policy-binding analysis-staging \
  --region=us-central1 --project=mangrove-atlas-246414 --member=allUsers
```

Repeat for `analysis-production`. To check which generation a function is:

```bash
gcloud functions describe analysis-staging --region=us-central1 \
  --project=mangrove-atlas-246414 --gen2 2>/dev/null && echo gen2 || echo gen1
```

> While `analysis-staging` is not yet public, point local dev at the working shared function:
> `NEXT_PUBLIC_ANALYSIS_API_PATH=analysis`.

---

## Future function changes

Edit `cloud-functions/analysis/` on a feature branch as usual:

```
feature branch  →  merge to develop  →  analysis-staging updated
                →  merge to main   →  analysis-production updated
```

There is only one source directory. The branch determines which GCP function is deployed.

---

## Cleanup (once both environments are stable)

Delete the old shared `analysis` function — it is no longer used:

```bash
gcloud functions delete analysis \
  --region=us-central1 \
  --project=mangrove-atlas-246414
```

---

## Rollback

If something goes wrong after the client code is live:

1. Set `NEXT_PUBLIC_ANALYSIS_API_PATH` in Vercel back to `analysis` (the old shared function).
2. `NEXT_PUBLIC_ANALYSIS_API_URL` stays the bare base — no URL or hook changes needed.
3. The old `analysis` function still exists until the cleanup step above — no GCP changes needed.
