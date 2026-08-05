# Fly to a restoration site from the user profile

> Status: **in review**, not merged. Branch `fix/fly-to-restoration-site`
> (commit `636b0294`), pushed, no PR opened yet.
> Not yet verified in a browser — see [Open questions](#open-questions).

## Why

Under **Menu → My profile → Saved areas**, a user's own MRTT restoration sites are
listed per landscape. The whole row used to be one external link to the MRTT tool,
so the only thing a user could do with their own site was leave the Atlas.

Split the row: the external-link icon keeps its job, and the site name moves the
Atlas map to that site.

## Behaviour

Clicking the site **name**:

1. writes the site's geometry + detail fields to a highlight overlay atom,
2. writes the geometry's bbox to `tmpCameraAtom`, which the map consumes and fits to.

The site is drawn as a magenta polygon (fill `0.25` + `2px` outline, `#CC61B0` — the
restoration-sites layer colour). Clicking that polygon opens the standard
**RESTORATION SITES** map popup.

Deliberate non-behaviours, all confirmed as wanted:

- **No route change.** An MRTT site is not an Atlas location, so `useLocationNavigation`
  is not used — only the camera moves. The URL `bounds` param still updates on move end
  via `useSyncURLBounds`.
- **The profile dialog stays open**, matching the sibling saved-locations rows.
- **No layer is toggled.** The `mangrove_rest_sites` widget layer is left exactly as the
  user had it; the highlight is independent of it.
- **The highlight persists** until another site is picked. It does not clear on closing
  the menu, navigating, or toggling layers.
- Sites with no geometry at all render the name as a plain `<span>`, not a dead button.

## Data flow

`/sites` (authenticated, the user's own sites) returns **neither geometry nor the site
detail fields** — only ids, names and section metadata. So the list joins by site id
against `/widgets/sites`, which carries `site_area`, `site_centroid`, `organizations`,
`causes_of_decline` and the rest.

| File | Role |
| --- | --- |
| `src/containers/datasets/restoration-sites/hooks.tsx` | `useRestorationSitesById()` — fetches `/widgets/sites` **unfiltered** (a user's sites are not necessarily inside the location being viewed) and selects into `Map<id, record>` |
| `src/containers/navigation/menu/profile/saved-areas/sites/index.tsx` | joins `/sites` rows against that map by id |
| `src/containers/navigation/menu/profile/saved-areas/sites/item.tsx` | derives geometry + bbox + popup properties, sets both atoms on click |
| `src/store/map/index.ts` | `highlightedSiteAtom` — `{ geometry, properties }`, replaced on each pick |
| `src/containers/map/highlighted-site/index.tsx` | the overlay `Source` + layers, rendered after `LayerManager` so it sits on top |

Geometry preference: `site_area` (polygon) → `site_centroid` (point). A centroid-only
site gets a `±0.05°` box for the camera (a zero-area bbox would send `fitBounds` to max
zoom) and a circle marker instead of a fill. A site with a polygon can never draw as a
dot — the circle layer only mounts for a genuine point.

### Popup reuse

The overlay's layer ids are prefixed `mangrove_rest_sites`
(`mangrove_rest_sites-highlight-fill` / `-line` / `-point`) and register themselves in
`interactiveLayerIdsAtom` on mount. The map's click handler keys the restoration-sites
popup off `layer.id.includes('mangrove_rest_sites')`, so the highlight inherits that
popup — same `LABELS`, same components, no new branch in `onClickHandler`.

The feature carries only the `LABELS` keys (`site_name`, `landscape_name`,
`organizations`, `intervention_types`, `causes_of_decline`, `ecological_aims`,
`socioeconomic_aims`, `community_activities`). `site_area` is deliberately kept off the
properties. Array values are serialised by mapbox and parsed back by the handler, same
as for the clustered points.

## Open questions

1. **Which geometry the join resolves.** The name button carries
   `data-geometry-type` (`Polygon` / `MultiPolygon` / `Point`) for exactly this check.
   During review, one site whose `/widgets/sites` record has a non-null `site_area`
   appeared to draw as a point. If `data-geometry-type` reads `Point` for such a site,
   the join is matching the wrong record — most likely the ids in `/sites` and
   `/widgets/sites` are not the same id space — and the popup would then show the wrong
   site's fields too. Resolve before merge.
2. **Hover cursor stays `grab`** over the polygon. `handleMouseMove` in
   `src/containers/map/index.tsx` has a hardcoded pointer list that never included
   `mangrove_rest_sites`, so the existing clustered points behave the same way. Adding
   both is a one-line change if wanted.
3. **When to clear the highlight** — currently never, except by picking another site.

## Verification checklist

Requires a logged-in user who owns MRTT sites; the Playwright suite has no coverage for
this area yet.

- [ ] `pnpm check-types` and `pnpm lint` clean for the touched files _(done)_
- [ ] Click a site name → map fits the site polygon, dialog stays open, route unchanged
- [ ] Click the drawn polygon → RESTORATION SITES popup with that site's fields
- [ ] A site with only `site_centroid` → circle marker, framed at ~5 km
- [ ] A site with no geometry → name not clickable, icon still works
- [ ] Click the icon → MRTT `/sites/:id/overview` in a new tab, map does not move
- [ ] Keyboard: Tab reaches name button and icon link separately, Enter triggers each
