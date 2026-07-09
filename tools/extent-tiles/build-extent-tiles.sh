#!/usr/bin/env bash
#
# Build self-hosted habitat-extent vector tiles (GEE-free) and publish to GCS.
# See README.md. Source = GMW published per-year vector (.gpkg/shp), NOT GEE.
#
# Pipeline per year:  GMW vector -> GeoJSONSeq -> tippecanoe (MVT, layer
# gmw_v4_extent_<year>, z0-12) -> explode to {z}/{x}/{y}.pbf -> gsutil to GCS
# with gzip + cache + CORS.
#
set -euo pipefail

# ---- configure -------------------------------------------------------------
# Years the app exposes. Keep in sync with the habitat-extent widget.
YEARS=(1996 2007 2008 2009 2010 2015 2016 2017 2018 2019 2020)

# Directory holding the GMW source vector files, one per year. Expected name
# pattern below (adjust to your download). Get GMW data from Zenodo / UNEP-WCMC
# Ocean Data Viewer — NOT Google Earth Engine.
SRC_DIR="${SRC_DIR:-./gmw-source}"
SRC_PATTERN="gmw_v4_extent_%s.gpkg"   # %s = year

# GCS destination.
BUCKET="${BUCKET:-mangrove_atlas}"
PREFIX="${PREFIX:-tilesets/gmw_extent}"

# Tiling.
MINZOOM=0
MAXZOOM=12
WORK_DIR="${WORK_DIR:-./.extent-tiles-work}"

# ---- preflight -------------------------------------------------------------
for bin in ogr2ogr tippecanoe tile-join gsutil; do
  command -v "$bin" >/dev/null 2>&1 || { echo "ERROR: '$bin' not found on PATH"; exit 1; }
done
mkdir -p "$WORK_DIR"

build_year() {
  local year="$1"
  local layer="gmw_v4_extent_${year}"
  local src; src="$(printf "${SRC_DIR}/${SRC_PATTERN}" "$year")"
  local geojson="${WORK_DIR}/${layer}.geojsonl"
  local mbtiles="${WORK_DIR}/${layer}.mbtiles"
  local tiles_dir="${WORK_DIR}/${layer}"

  [ -f "$src" ] || { echo "WARN: missing source $src — skipping $year"; return 0; }

  echo ">> [$year] vector -> GeoJSONSeq"
  rm -f "$geojson"
  ogr2ogr -f GeoJSONSeq -t_srs EPSG:4326 "$geojson" "$src"

  echo ">> [$year] tippecanoe -> MVT (layer=$layer, z${MINZOOM}-${MAXZOOM})"
  rm -f "$mbtiles"
  # -l fixes the MVT layer name to match the frontend source-layer.
  # --drop/coalesce-densest-as-needed keeps dense low zooms under the tile limit.
  tippecanoe \
    -o "$mbtiles" \
    -l "$layer" \
    -Z"$MINZOOM" -z"$MAXZOOM" \
    --drop-densest-as-needed \
    --coalesce-densest-as-needed \
    --simplification=4 \
    --force \
    "$geojson"

  echo ">> [$year] explode MBTiles -> {z}/{x}/{y}.pbf"
  rm -rf "$tiles_dir"
  # tile-join --output-to-directory writes {z}/{x}/{y}.pbf (gzip-compressed MVT).
  tile-join --output-to-directory="$tiles_dir" --force "$mbtiles"

  echo ">> [$year] upload -> gs://${BUCKET}/${PREFIX}/${year}/"
  # .pbf are gzip MVT: set encoding + type + cache so Mapbox GL parses and the
  # browser/SW/CDN reuse them. rsync uploads only changed tiles.
  gsutil -m -h "Content-Type:application/x-protobuf" \
             -h "Content-Encoding:gzip" \
             -h "Cache-Control:public, max-age=2592000" \
    rsync -r "$tiles_dir" "gs://${BUCKET}/${PREFIX}/${year}"
}

for y in "${YEARS[@]}"; do
  build_year "$y"
done

echo ">> ensure bucket CORS allows browser GET"
gsutil cors set "$(dirname "$0")/bucket-cors.json" "gs://${BUCKET}" || \
  echo "WARN: could not set CORS (may need bucket-admin); see bucket-cors.json"

cat <<EOF

Done. Point the app at the tiles:
  NEXT_PUBLIC_EXTENT_TILES_URL=https://${BUCKET}.storage.googleapis.com/${PREFIX}/{year}/{z}/{x}/{y}.pbf
EOF
