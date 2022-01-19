# Mangrove Atlas API

## Installation

* PostgreSQL 10+
* Ruby 2.6+

To install run `bundle install`. And start application running `rails s`.

## API documentation

**NOTE: CSV file should have `;` as separator.**


### Locations

Get all locations, sorted by name and Worldwide at the top.

```
curl "https://mangrove-atlas-api.herokuapp.com/api/locations"
```

Import locations from CSV

```
curl -X "POST" "https://mangrove-atlas-api.herokuapp.com/api/locations/import" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@[file_path]"
```

You have to replace `[file_path]`.
If you want to replace all locations, you have to add the param `?reset=true` in the url.

*Ranking by a mangrove data column*

This endpoint was created for Activity widget. In order to get a ranking of countries depending on column like `gain_m2`, `loss_m2` or `net_change_m2`.

```
curl "https://mangrove-atlas-api.herokuapp.com/api/locations?rank_by=gain_m2&start_date=1990&end_date=2000&limit=5"
```

| param | required | default value
|---|---|---|
| rank_by | yes | - |
| dir | no | desc |
| start_date | no | 1996 |
| end_date | no | 2017 |
| location_type | no | - |
| limit | no | 5 |



### Mangrove data (data for Widgets)

Get all mangrove data by a location.

```
curl "https://mangrove-atlas-api.herokuapp.com/api/locations/[location_id | iso]/mangrove_data"
```

Import mangrove data from CSV

```
curl -X "POST" "https://mangrove-atlas-api.herokuapp.com/api/mangrove_data/import" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@[file_path]"
```

You have to replace `[file_path]`.
If you want to replace all mangrove data, you have to add the param `?reset=true` in the url.

Import mangrove data from GeoJSON

```
curl -X "POST" "https://mangrove-atlas-api.herokuapp.com/api/locations/import_geojson" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@[file_path]"
```

```
curl -X "POST" "https://mangrove-atlas-api.herokuapp.com/api/mangrove_data/import_geojson" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@[file_path]"
```

You have to replace `[file_path]`.
If you want to replace all mangrove data, you have to add the param `?reset=true` in the url.


### Generating data for worldwide

To create or update the data for worlwide you can run

```
heroku run rake worldwide:location worldwide:mangrove_datum
```

It iterate over all locations and mangrove data tables to calc and sum the values for Worldwide.


## Deploy to staging

Merge your code in `develop` branch.

Add heroku site:

```
heroku git:remote -a mangroves-atlas-api
```

And deploy:

```
git push heroku develop:master
```
