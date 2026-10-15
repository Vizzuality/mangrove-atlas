# ADR 001: MRTT sites in Saved Areas reuse the custom-area analysis pipeline

**Status:** Accepted
**Date:** 2026-10-15
**Jira:** GMW-1129

---

## Context

The Saved Areas panel must list the signed-in user's MRTT sites in a dedicated section and let them zoom to the site, see its boundary and run the widgets' analysis on it, without a delete action (sites are managed in MRTT only).

The backend has two sources for a site polygon: the registration answer for question 1.3 (source of truth, per site, authenticated) and the denormalised `sites.area` column, exposed only by the public `GET /widgets/sites` as `site_area`. The user-scoped `GET /sites` returns no geometry. A backfill task (`rake sites:sync_areas`, gmw-api) now derives `sites.area` from answer 1.3 with `ST_Union` of all features, so the copy is trustworthy once run.

GMW already has a pipeline for arbitrary polygons: a drawn or uploaded FeatureCollection goes into `drawingUploadToolAtom`, mapbox-gl-draw renders it, the location becomes `/custom-area`, and every widget hook reroutes to the analysis cloud function. Saved custom areas already reuse it.

## Decision

- An MRTT site is treated as a **custom area**: on click, its polygon is wrapped in a FeatureCollection, set as `uploadedGeojson`, analysis is enabled, and navigation goes to `/custom-area` with the bbox. No new location type, no new route, no new widget wiring.
- Geometry comes from a **frontend join**: `GET /sites` (user-scoped list) + `GET /widgets/sites` (geometry by id), parsed once and cached. Sites without a polygon render as plain text with an explanatory tooltip.
- The title shows the site name through `customAreaNameAtom` + derived `customAreaLabelAtom`, which only resolves while the active `uploadedGeojson` is the exact object the site set. Any new draw, upload or delete makes the label stale automatically, so no other writer of the upload atom needs to know about it.
- No delete control is rendered for MRTT sites; the MRTT external link stays as the management path.

## Alternatives considered

- **New `location_type: 'mrtt-site'` with its own route (`/mrtt-site/:id`)** and server-side prefetch like country / wdpa. Cleanest URL and shareable links, but requires a backend location record per site, changes `ALLOWED_LOCATION_TYPES`, the SSR prefetch, the location widget, and every widget hook's location switch. Disproportionate for the ticket; can supersede this ADR if shareable MRTT links become a requirement.
- **Backend change: add `area` to `GET /sites`.** Removes the second request and the public-endpoint dependency. Deferred: it is a gmw-api change with its own deploy, and `/widgets/sites` already exposes the same column. Recommended follow-up; this ADR does not block it.
- **Fetch answer 1.3 per site on click.** Reads the source of truth directly, but one authenticated request per click, duplicates the backend's geometry derivation in the client, and still fails for sites that never saved section 1.

## Consequences

**Positive**

- Zoom, boundary and all analysis widgets work on day one with no backend change.
- One pipeline for drawn, uploaded, saved-custom and MRTT polygons; fixes and tests apply to all.
- Name label cannot go stale or leak onto an unrelated polygon.

**Negative / risks**

- The `/custom-area` URL is not shareable or reloadable for an MRTT site; state lives in memory. Same limitation as drawn areas today.
- `GET /widgets/sites` is public and unfiltered; it is fetched once per session as a lookup table. Acceptable at current table size; revisit if it grows.
- Sites whose `sites.area` is null are not analysable until the backfill runs or the owner re-saves section 1 in MRTT.
