# Habitat-extent vector tiles (self-hosted, GEE-free)

One-off / per-release data job that turns **GMW published mangrove-extent vector** into cacheable
`{z}/{x}/{y}.pbf` (MVT) tiles on GCS, so the habitat-extent layer works **offline** and no longer
depends on Mapbox-hosted tilesets.

This is **not** a cloud function and **not** part of the Next.js build — it's a batch pipeline run by
data engineering when GMW publishes new data. The frontend consumes the result via
`NEXT_PUBLIC_EXTENT_TILES_URL` (see below).

> **No Google Earth Engine.** The project is migrating off GEE. Source the extent from GMW's published
> per-year vector (`.gpkg`/shapefile from Zenodo / UNEP-WCMC Ocean Data Viewer), **not** the GEE asset
> `gmw_v4112_mng_ext`. The GEE asset is only one mirror of the same dataset.

## Why these exact choices (must match the frontend)
- **Vector, not raster** — extent must stay interactive (per-feature hover/click/`feature-state`).
- **Layer name `gmw_v4_extent_<year>`** — `src/containers/datasets/habitat-extent/layer.tsx` reads
  `source-layer: gmw_v4_extent_<year>`. The MVT layer name MUST match (tippecanoe `-l`).
- **Zoom 0–12** — matches the source `maxzoom: 12` the frontend sets; Mapbox overzooms >12. Caching the
  full z0–12 pyramid is what makes every zoom render offline.
- **Same feature properties** as the current Mapbox tileset, so paint/filters are unchanged.

## Prerequisites
- `gdal`/`ogr2ogr` (vector conversion)
- `tippecanoe` (Felt, OSS) + `tile-join`/`mb-util` (explode MBTiles → `{z}/{x}/{y}.pbf`)
- `gcloud`/`gsutil` authenticated to the project (write to the `mangrove_atlas` bucket)

## Run
```bash
# edit the vars at the top of the script first (YEARS, SRC_DIR, BUCKET, PREFIX)
./build-extent-tiles.sh
```

## Output + wiring
Tiles land at `gs://<BUCKET>/<PREFIX>/<year>/{z}/{x}/{y}.pbf`. Point the app at them:
```
NEXT_PUBLIC_EXTENT_TILES_URL=https://<BUCKET>.storage.googleapis.com/<PREFIX>/{year}/{z}/{x}/{y}.pbf
```
`{year}` is substituted per active year by `useSource()`; `{z}/{x}/{y}` are filled by Mapbox GL.

## Critical gotchas
- **gzip:** tippecanoe/MVT `.pbf` are gzip-compressed. Upload with `Content-Encoding: gzip` +
  `Content-Type: application/x-protobuf`, or Mapbox GL fails to parse the tiles.
- **CORS:** the bucket must allow cross-origin GET (see `bucket-cors.json`), else the browser blocks tiles.
- **Cache-Control:** set a long max-age so browser/SW/CDN reuse tiles.
- **Big data:** global extent is large — use tippecanoe's `--drop-densest-as-needed` /
  `--coalesce-densest-as-needed` so low zooms don't blow the per-tile feature limit.

## Alternative: PMTiles (single file)
Instead of exploding to `{z}/{x}/{y}.pbf`, keep one `gmw_extent_<year>.pmtiles` on GCS and read it via
the OSS `pmtiles` protocol. Cleaner hosting, but the offline SW must handle HTTP range/`206` responses
(our current `{z}/{x}/{y}` caching does not) and the protocol addon is better supported on MapLibre.
Exploded tiles are the lower-friction choice for the current mapbox-gl + SW setup.
