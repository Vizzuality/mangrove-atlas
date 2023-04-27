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
* geometry, geojson of the area to filter. Optional, should be located in the body.

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

warning note:there is a problem with node16 and openssl as a quickaround do: `export OPENSSL_CONF=/dev/null`

Example request:  

``` bash
 curl --location -g --request POST 'http://localhost:8080?widgets[]=habitat-extent&widgets[]=net-change&widgets[]=tree-height&widgets[]=aboveground-biomass&widgets[]=blue-carbon' \
--header 'Content-Type: application/json' \
--data-raw '{
 "geometry": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                8.9208984375,
                                0.021972655711432625
                            ],
                            [
                                9.7998046875,
                                0.021972655711432625
                            ],
                            [
                                9.7998046875,
                                0.9667509997666425
                            ],
                            [
                                8.9208984375,
                                0.9667509997666425
                            ],
                            [
                                8.9208984375,
                                0.021972655711432625
                            ]
                        ]
                    ]
                }
            }
        ]
    }
}'
```

Example response:

``` json
{
  "habitat-extent": {
    "data": [
      {
        "indicator": "habitat_extent_area",
        "value": 823.5097862578755,
        "year": 1996
      },
   ...
      {
        "indicator": "coastal_extent",
        "value": 823509.7862576442,
        "year": 1996
      },
   ...
    ],
    "metadata": {}
  },
  "net-change": {
    "data": [
      {
        "gain": 5203856.324630438,
        "loss": 6039561.102233887,
        "net_change": -835704.7776034484,
        "year": 2007
      },
      
    ],
    "metadata": {}
  },
  "tree-height": {
    "data": [
      { "indicator": "0-5", "value": 3476.9607843136923 },
      { "indicator": "5-10", "value": 38342.53333333302 },
      { "indicator": "10-15", "value": 20638.188235293717 },
      { "indicator": "15-20", "value": 7419.0274509805295 },
      { "indicator": "20-65", "value": 13055.188235294063 }
    ],
    "metadata": { "avg": 12.401117966982184, "year": 2020 }
  },
  "aboveground-biomass": {
    "data": [
      { "indicator": "0-50", "value": 31374.227450980125 },
      { "indicator": "50-100", "value": 19976.75294117625 },
      { "indicator": "100-150", "value": 8399.317647059055 },
      { "indicator": "150-250", "value": 7164.070588235437 },
      { "indicator": "250-1600", "value": 16017.529411764608 }
    ],
    "metadata": { "avg": 167.95549554402743, "year": 2020 }
  },
  "blue-carbon": {
    "data": [
      { "indicator": "700-1400", "value": 10209.909803921679 },
      { "indicator": "1400-2100", "value": 73597.97647058626 },
      { "indicator": "2100-2800", "value": 730.8588235294117 }
    ],
    "metadata": { "avg": 1651.0303452118142, "year": 2016 }
  }
}
```

#### Deploying it to cloud functions

```bash
gcloud functions deploy fetch-alerts --runtime nodejs10 --trigger-http \
   --memory 256MB --timeout 540s --region us-central1 --entry-point Analysis \
   --service-account-file ./credentials.json --source ./cloud-functions/Analysis
```

``` bash
curl --location -g --request POST 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net/analysis?widgets[]=habitat-extent&widgets[]=net-change&widgets[]=tree-height&widgets[]=aboveground-biomass&widgets[]=blue-carbon' \
--header 'Content-Type: application/json' \
--data-raw '{
 "geometry": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                8.9208984375,
                                0.021972655711432625
                            ],
                            [
                                9.7998046875,
                                0.021972655711432625
                            ],
                            [
                                9.7998046875,
                                0.9667509997666425
                            ],
                            [
                                8.9208984375,
                                0.9667509997666425
                            ],
                            [
                                8.9208984375,
                                0.021972655711432625
                            ]
                        ]
                    ]
                }
            }
        ]
    }
}'

```

## Uploading alerts pipeline

### Instructions

* cd to the folder `upload-alerts`
* Download `credentials.json` and save to the root of the cloud function (`./credentials.json`).
* Put your `.gpkg` files in the folder `./data/vecs`.
* Run `make upload` to run the full pipe to transform and upload the data to BigQuery.
