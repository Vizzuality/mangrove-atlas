# Mangrove atlas cloud functions

Alerts and analysis accessing for the mangrove atlas project

## Cloud functions

[Documentation of the library](https://www.npmjs.com/package/@google-cloud/functions-framework) to simulate a cloud function in your local machine.
In order to deploy the cloud function you need to create a service account and a bucket in Google Cloud Storage.

Also automatic deployment of the cloud function is available at push in develop/master

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
'http://localhost:8080?location_id=MOZ&start_date=2019-01-01&end_date=2022-01-01' 
```

Example response:

``` json
[
 {
 "date": {
 "value": "2020-01-01"
 },
 "count": 492
 }
]
```

#### Deploying the function

```bash
gcloud functions deploy fetch-alerts --runtime nodejs10 --trigger-http --memory 128MB --timeout 540s --region us-central1 --entry-point fetchAlerts --service-account-file ./credentials.json --source ./cloud-functions/fetch-alerts
```

``` bash
curl --request GET 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts?location_id=MOZ&start_date=2019-01-01&end_date=2022-01-01'
```

### Fetch alerts heatmap (Map visualization)

1. Go to the folder `fetch-alerts-heatmap`
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
'http://localhost:8080?location_id=MOZ&start_date=2019-01-01&end_date=2022-01-01' 
```

Example response:

``` json
{
    "type": "FeatureCollection",
    "name": "deforestation-alerts",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "count": 1,
                "intensity": 1
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    35.10860631785158,
                    -20.94996841295125
                ]
            }
        }
    ]
}
```

#### Deploying

```bash
gcloud functions deploy fetch-alerts-heatmap --runtime nodejs10 --trigger-http --memory 128MB --timeout 540s --region us-central1 --entry-point fetchAlertsHeatmap --service-account-file ./credentials.json --source ./cloud-functions/fetch-alerts-heatmap
```

``` bash
curl -X GET -G \
'https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts-heatmap?location_id=MOZ&start_date=2019-01-01&end_date=2022-01-01'
```

### Analysis

1. Go to the folder `analysis`
2. Download `credentials.json` and save to the root of the project (you will require access to google earth engine).
3. For development run `npm install && npm run watch`.
4. Open the browser and go to `http://localhost:8080/`

Example request:  

``` bash
curl --request POST \
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

#### Deploying it to cloud functions

```bash
gcloud functions deploy fetch-alerts --runtime nodejs10 --trigger-http \
   --memory 128MB --timeout 540s --region us-central1 --entry-point fetchAlerts \
   --service-account-file ./credentials.json --source ./cloud-functions/fetch-alerts
```

``` bash
curl  Post https://us-central1-mangrove-atlas-246414.cloudfunctions.net/fetch-alerts \
-H "Authorization:bearer $(gcloud auth print-identity-token)" \
-H "Content-Type:application/json" \
-d '{}'

```

## Uploading alerts pipeline

### Instructions

* cd to the folder `upload-alerts`
* Download `credentials.json` and save to the root of the cloud function (`./credentials.json`).
* Put your `.gpkg` files in the folder `./data/vecs`.
* Run `make upload` to run the full pipe to transform and upload the data to BigQuery.
