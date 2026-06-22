# Separate Environments — Deployment Next Steps

This document covers what still needs to happen after the code changes in this PR are merged.
For the full design rationale, see [SEPARATE-ENVIRONMENTS.md](./SEPARATE-ENVIRONMENTS.md).

---

## Before merging the PR

Update `NEXT_PUBLIC_ANALYSIS_API_URL` in the **Vercel project dashboard** for both environments.
The hooks no longer append `/analysis` to the base URL — they now call the base URL verbatim —
so the full function URL must be set here.

| Vercel environment | New value |
|--------------------|-----------|
| Preview (staging)  | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-staging` |
| Production         | `https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis-production` |

> ⚠️ Do this **before** any Vercel deploy picks up the new hook code. If the env var still
> points to the old base domain when the hooks go live, every analysis request will 404.

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

## After merging `develop` → `master`

The same workflow fires on merge to `master` and deploys `analysis-production`.

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

## Future function changes

Edit `cloud-functions/analysis/` on a feature branch as usual:

```
feature branch  →  merge to develop  →  analysis-staging updated
                →  merge to master   →  analysis-production updated
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

1. Revert `NEXT_PUBLIC_ANALYSIS_API_URL` in Vercel back to `https://us-central1-mangrove-atlas-246414.cloudfunctions.net`.
2. Revert the hooks change (restore `url: '/analysis'` in the five hook files).
3. The old `analysis` function still exists until the cleanup step above — no GCP changes needed.
