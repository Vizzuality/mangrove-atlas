# Mangrove atlas cloud functions

Alerts and analysis accessing for the mangrove atlas project

## Cloud functions

[Documentation of the library](https://www.npmjs.com/package/@google-cloud/functions-framework) to simulate a cloud function in your local machine.
In order to deploy the cloud function you need to create a service account and a bucket in Google Cloud Storage.

### Fetch alerts

1. Go to the folder `fetch-alerts`
2. Download `credentials.json` and save to the root of the project (you will require access to google earth engine).
3. For development run `npm install && npm run watch`.
4. Open the browser and go to `http://localhost:8080/`

By default the endpoint returns all data for all locations and aggregated by month.

Params:

* `location_id`, location ID from Mangrove API. Optional.
* `start_date`, start date in format `YYYY-MM-DD`. Optional.
* `end_date`, end date in format `YYYY-MM-DD`. Optional.

Example request:  

``` bash
curl -X GET -G \
'http://localhost:8080/' \
-d id=3 \
-d name=Mario \
-d surname=Bros
```
Example response:

``` json
{
  "data": [
 {
   "id": "3",
   "name": "Mario",
   "surname": "Bros"
 }
  ]
}
```

#### Deploying the function

```bash
gcloud functions deploy fetch-alerts --runtime nodejs10 --trigger-http --memory 128MB --timeout 540s --region us-central1 --entry-point fetchAlerts --service-account-file ./credentials.json --source ./cloud-functions/fetch-alerts
```

``` bash
curl -m 70 -X GET https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts \
-H "Authorization:bearer $(gcloud auth print-identity-token)" \
-H "Content-Type:application/json" \
-d '{}'
-d id=3 \
-d name=Mario \
-d surname=Bros
```


### Fetch alerts heatmap (Map visualization)

1. Go to the folder `fetch-alerts-heatmap`
2. Download `credentials.json` and save to the root of the project (you will require access to google earth engine).
3. For development run `npm install && npm run watch`.
4. Open the browser and go to `http://localhost:8080/`

By default the endpoint returns all data for all locations and aggregated by month.

Params:

* `location_id=1`, location ID from Mangrove API. Optional.
* `format=geojson`, to export a geojson, it includes an aggregation for location

Example request:  

``` bash
curl -X GET -G \
'http://localhost:8080/' \
-d id=3 \
-d name=Mario \
-d surname=Bros
```
Example response:

``` json
{
  "data": [
 {
   "id": "3",
   "name": "Mario",
   "surname": "Bros"
 }
  ]
}
```

#### Deploying the function

```bash
gcloud functions deploy fetch-alerts --runtime nodejs10 --trigger-http --memory 128MB --timeout 540s --region us-central1 --entry-point fetchAlerts --service-account-file ./credentials.json --source ./cloud-functions/fetch-alerts
```

``` bash
curl -m 70 -X GET https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts \
-H "Authorization:bearer $(gcloud auth print-identity-token)" \
-H "Content-Type:application/json" \
-d '{}'
-d id=3 \
-d name=Mario \
-d surname=Bros
```

### Analysis

1. Go to the folder `analysis`
2. Download `credentials.json` and save to the root of the project (you will require access to google earth engine).
3. For development run `npm install && npm run watch`.
4. Open the browser and go to `http://localhost:8080/`

Example request:  

``` bash
curl -X GET -G \
'http://localhost:8080/' \
-d id=3 \
-d name=Mario \
-d surname=Bros
```
Example response:

``` json
{
  "data": [
 {
   "id": "3",
   "name": "Mario",
   "surname": "Bros"
 }
  ]
}
```

#### Deploying the function

```bash
gcloud functions deploy fetch-alerts --runtime nodejs10 --trigger-http --memory 128MB --timeout 540s --region us-central1 --entry-point fetchAlerts --service-account-file ./credentials.json --source ./cloud-functions/fetch-alerts
```

``` bash
curl -m 70 -X GET https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts \
-H "Authorization:bearer $(gcloud auth print-identity-token)" \
-H "Content-Type:application/json" \
-d '{}'
-d id=3 \
-d name=Mario \
-d surname=Bros
```

## Uploading alerts pipeline

### Instructions

* cd to the folder `upload-alerts`
* Download `credentials.json` and save to the root of the cloud function (`./credentials.json`).
* Put your `.gpkg` files in the folder `./data/vecs`.
* Run `make upload` to run the full pipe to transform and upload the data to BigQuery.
