"""
Update the deforestation alerts Mapbox tileset.

Downloads the latest edited.json from GCS, builds an .mbtiles file with
tippecanoe, and uploads it to Mapbox as a replacement for the existing
deforestation-alerts tileset.

Requires:
  - Environment variables: MAPBOX_USER, MAPBOX_SECRET_TOKEN
  - GCP credentials (Application Default Credentials or GOOGLE_APPLICATION_CREDENTIALS)
  - tippecanoe on $PATH
"""

import argparse
import json
import logging
import os
import subprocess
import tempfile
from datetime import date, datetime
from pathlib import Path

import boto3
import dotenv
import geopandas as gpd
import pandas as pd
import requests

dotenv.load_dotenv(Path(__file__).parent / ".env")
from google.cloud import storage

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
GCP_PROJECT = "mangrove-atlas-246414"
GCS_BUCKET = "mangrove_atlas"
GCS_PREFIX = "deforestation-alerts/"
TILESET_NAME = "deforestation-alerts"
SOURCE_LAYER = "alerts"

MAPBOX_USER = os.environ.get("MAPBOX_USER", "")
MAPBOX_TOKEN = os.environ.get("MAPBOX_SECRET_TOKEN", "")

CURRENT_DATE = date.today()

# Tippecanoe parameters — must match the existing notebook exactly.
TIPPECANOE_ARGS = [
    "tippecanoe",
    "-o", "",          # placeholder, filled at call time
    "--force",
    "-zg",
    "--extend-zooms-if-still-dropping",
    "--drop-densest-as-needed",
    "--drop-rate=1",
    "--order-by=priority",
    "--maximum-tile-bytes=500000",
    "--no-feature-limit",
    "-l", SOURCE_LAYER,
    "",                # input file placeholder
]

KEEP_PROPS = {"confident", "first_obs_date", "last_obs_date", "scr5_obs_date", "created_at"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def find_latest_folder(bucket: storage.Bucket) -> str:
    """Return the most recent YYYY-MM-DD folder under the alerts prefix."""
    iterator = bucket.list_blobs(prefix=GCS_PREFIX, delimiter="/")
    # Must consume the iterator before accessing .prefixes
    for _ in iterator:
        pass
    folders = set()
    for prefix in iterator.prefixes:
        folder = prefix.rstrip("/").split("/")[-1]
        try:
            datetime.strptime(folder, "%Y-%m-%d")
            folders.add(folder)
        except ValueError:
            continue

    if not folders:
        raise RuntimeError(f"No date folders found under gs://{GCS_BUCKET}/{GCS_PREFIX}")

    latest = sorted(folders)[-1]
    logging.info(f"Latest folder: {latest}")
    return latest


def download_edited_json(bucket: storage.Bucket, folder: str, dest: Path) -> Path:
    """Download edited.json from GCS to a local file."""
    blob_path = f"{GCS_PREFIX}{folder}/edited.json"
    blob = bucket.blob(blob_path)
    out = dest / "edited.json"
    logging.info(f"Downloading gs://{GCS_BUCKET}/{blob_path} ...")
    blob.download_to_filename(str(out))
    logging.info(f"Downloaded {out.stat().st_size / 1e6:.1f} MB")
    return out


def ndjson_to_geodataframe(path: Path) -> gpd.GeoDataFrame:
    """Read an NDJSON file (one JSON object per line) into a GeoDataFrame."""
    records = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    logging.info(f"Read {len(records):,} records")
    df = pd.DataFrame(records)
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.longitude, df.latitude), crs="EPSG:4326")
    return gdf


def date_priority(date_str) -> int:
    """Compute a priority score: recent alerts get higher priority.

    Identical to the logic in deforestation-alerts-tiles.ipynb.
    """
    if not date_str or pd.isna(date_str):
        return 0
    try:
        d = datetime.strptime(str(date_str), "%Y-%m-%d").date()
        delta = abs((CURRENT_DATE - d).days)
        return max(0, 2600 - delta)
    except ValueError:
        return 0


def preprocess(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Keep only the needed properties and add a priority score."""
    keep = [c for c in KEEP_PROPS if c in gdf.columns]
    gdf = gdf[keep + ["geometry"]].copy()
    gdf["priority"] = gdf["scr5_obs_date"].apply(date_priority)
    logging.info(f"Priority range: {gdf['priority'].min()} – {gdf['priority'].max()}")
    return gdf


def run_tippecanoe(geojson_path: Path, mbtiles_path: Path) -> None:
    """Run tippecanoe with alerts-specific parameters."""
    cmd = [
        "tippecanoe",
        "-o", str(mbtiles_path),
        "--force",
        "-zg",
        "--extend-zooms-if-still-dropping",
        "--drop-densest-as-needed",
        "--drop-rate=1",
        f"--order-by=priority",
        "--maximum-tile-bytes=500000",
        "--no-feature-limit",
        "-l", SOURCE_LAYER,
        str(geojson_path),
    ]
    logging.info(f"Running tippecanoe ...")
    subprocess.run(cmd, check=True)
    size_mb = mbtiles_path.stat().st_size / 1e6
    logging.info(f"Created {mbtiles_path.name} ({size_mb:.1f} MB)")


def upload_to_mapbox(mbtiles_path: Path) -> dict:
    """Upload .mbtiles to Mapbox via the Uploads API."""
    full_tileset = f"{MAPBOX_USER}.{TILESET_NAME}"

    # 1. Get temporary S3 credentials
    logging.info(f"Requesting Mapbox upload credentials for {full_tileset} ...")
    creds_resp = requests.post(
        f"https://api.mapbox.com/uploads/v1/{MAPBOX_USER}/credentials",
        params={"access_token": MAPBOX_TOKEN},
    )
    creds_resp.raise_for_status()
    creds = creds_resp.json()

    # 2. Upload to S3
    logging.info(f"Uploading {mbtiles_path.name} to S3 ...")
    s3 = boto3.client(
        "s3",
        aws_access_key_id=creds["accessKeyId"],
        aws_secret_access_key=creds["secretAccessKey"],
        aws_session_token=creds["sessionToken"],
        region_name="us-east-1",
    )
    s3.upload_file(str(mbtiles_path), creds["bucket"], creds["key"])

    # 3. Register tileset
    logging.info(f"Registering tileset {full_tileset} ...")
    upload_resp = requests.post(
        f"https://api.mapbox.com/uploads/v1/{MAPBOX_USER}",
        params={"access_token": MAPBOX_TOKEN},
        json={
            "url": creds["url"],
            "tileset": full_tileset,
            "name": "Deforestation Alerts",
        },
    )
    upload_resp.raise_for_status()
    result = upload_resp.json()
    logging.info(f"Upload queued — id: {result.get('id')}")
    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Update deforestation alerts Mapbox tileset")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Download and process data but skip the Mapbox upload. "
             "Output files are saved to data/pipelines/output/.",
    )
    args = parser.parse_args()

    client = storage.Client(project=GCP_PROJECT)
    bucket = client.bucket(GCS_BUCKET)

    # In dry-run mode, save output locally; otherwise use a temp directory.
    if args.dry_run:
        out_dir = Path(__file__).parent / "output"
        out_dir.mkdir(exist_ok=True)
        _run_pipeline(bucket, out_dir, upload=False)
    else:
        if not MAPBOX_USER or not MAPBOX_TOKEN:
            raise RuntimeError("MAPBOX_USER and MAPBOX_SECRET_TOKEN must be set")
        with tempfile.TemporaryDirectory() as tmpdir:
            _run_pipeline(bucket, Path(tmpdir), upload=True)


def _run_pipeline(bucket: storage.Bucket, work_dir: Path, upload: bool):
    # 1. Find latest data and download
    folder = find_latest_folder(bucket)
    edited_path = download_edited_json(bucket, folder, work_dir)

    # 2. Convert to GeoDataFrame and preprocess
    gdf = ndjson_to_geodataframe(edited_path)
    gdf = preprocess(gdf)

    # 3. Write GeoJSON for tippecanoe
    geojson_path = work_dir / "alerts_preprocessed.geojson"
    gdf.to_file(geojson_path, driver="GeoJSON")
    del gdf  # free memory
    logging.info(f"Wrote {geojson_path.name}")

    # 4. Run tippecanoe
    mbtiles_path = work_dir / "alerts.mbtiles"
    run_tippecanoe(geojson_path, mbtiles_path)

    # 5. Upload to Mapbox (or skip in dry-run)
    if upload:
        result = upload_to_mapbox(mbtiles_path)
        logging.info(f"Done. Tileset: {result.get('tileset')}")
    else:
        logging.info(f"Dry run complete. Output files in: {work_dir}")
        logging.info(f"  - {geojson_path.name} ({geojson_path.stat().st_size / 1e6:.1f} MB)")
        logging.info(f"  - {mbtiles_path.name} ({mbtiles_path.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
