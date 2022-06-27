# Mangrove atlas cloud functions

Alerts and analysis accessing for the mangrove atlas project

## Cloud functions

[Documentation of the library](https://www.npmjs.com/package/@google-cloud/functions-framework) to simulate a cloud function in your local machine.

deployment_name: mangrove-atlas-alerts

### Fetch alerts

1. Go to the folder `fetch-alerts`
2. Download `credentials.json` and save to the root of the project (you will require access to google earth engine).
3. For development run `npm install && npm run watch`.
4. Open the browser and go to `http://localhost:8080/`

By default the endpoint returns all data for all locations and aggregated by month.

Params:

* `location_id=1`, location ID from Mangrove API. Optional.
* `format=geojson`, to export a geojson, it includes an aggregation for location

### Fetch alerts heatmap (Map visualization)

1. Go to the folder `fetch-alerts-heatmap`
2. Download `credentials.json` and save to the root of the project (you will require access to google earth engine).
3. For development run `npm install && npm run watch`.
4. Open the browser and go to `http://localhost:8080/`

By default the endpoint returns all data for all locations and aggregated by month.

Params:

* `location_id=1`, location ID from Mangrove API. Optional.
* `format=geojson`, to export a geojson, it includes an aggregation for location

### Analysis

1. Go to the folder `analysis`
2. Download `credentials.json` and save to the root of the project (you will require access to google earth engine).
3. For development run `npm install && npm run watch`.
4. Open the browser and go to `http://localhost:8080/`

## Uploading alerts pipeline

### Instructions

* cd to the folder `upload-alerts`
* Download `credentials.json` and save to the root of the cloud function (`./credentials.json`).
* Put your `.gpkg` files in the folder `./data/vecs`.
* Run `make upload` to run the full pipe to transform and upload the data to BigQuery.
