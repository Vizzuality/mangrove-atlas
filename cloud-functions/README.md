# mangrove-atlas-data
Data processing for the mangrove atlas project

## Cloud functions

[Documentation of the library](https://www.npmjs.com/package/@google-cloud/functions-framework) to simulate a cloud function in your local machine.

### Fetch alerts

Go to thefolder `fetch-alerts` and run `npm run start`.

By default the endpoint returns all data for all locations and aggregated by month.

Params:

* `location_id=1`, location ID from Mangrove API. Optional.
* `format=geojson`, to export a geojson, it includes an aggregation for location

