# Features in progress

Work that exists on a branch but is **not** on `develop` and **not** deployed. This file
lives on `develop` so the list survives independently of the branches it describes — a
branch can be stale, renamed or force-pushed, and this stays readable.

Add a row when you push a feature branch. Delete the row when it merges (the code and its
own notes become the record at that point).

Note: `docs/` is otherwise untracked by design (see `a1197903`) — only this index is
committed. Detailed per-feature notes stay on their own branch.

| Feature | Branch | Ticket | Status | Blocked on |
| --- | --- | --- | --- | --- |
| Fly to a restoration site from the user profile | `fix/fly-to-restoration-site` | none | pushed, no PR | browser verification of the site id join |

## Fly to a restoration site from the user profile

Under **Menu → My profile → Saved areas**, the whole MRTT site row was one external link
to the MRTT tool. Now the external-link icon keeps that job and clicking the site **name**
moves the Atlas map to the site: it draws the site polygon as a magenta highlight overlay
and fits the camera to it. Clicking the drawn polygon opens the standard **RESTORATION
SITES** popup.

- Commits: `636b0294` (feature), `c9bf8f69` (notes)
- Full notes: `docs/profile-restoration-sites-fly-to.md` **on that branch**
- Touches: `containers/navigation/menu/profile/saved-areas/sites/`,
  `containers/map/highlighted-site/` (new), `store/map`,
  `containers/datasets/restoration-sites/hooks.tsx`
- Deliberate non-behaviours: no route change, dialog stays open, no map layer toggled,
  highlight persists until another site is picked
- Not verified in a browser yet. Main risk: `/sites` and `/widgets/sites` are joined by
  site id to get geometry, and it is not yet confirmed that those ids are the same id
  space. The site-name button exposes `data-geometry-type` to check this.
