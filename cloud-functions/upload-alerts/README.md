# Upload data to BigQuery from local files

A list of commands created to upload the data to BigQuery table from local files.

Requirements:

* Unix system with Bash or ZSH
* Docker

## How to use

### 0. You need access to Google Cloud Storage client's account.

Download `credentials.json` and save to the rooth of the project.

### 1. Extract data from .gpkg files and join the result in a single file

We assume you data is already downloaded and stored in the folder `./data/vecs`. All the files should have the extension `.gpkg`.
The result data will be saved to `./data/results.json`.

```
sh ./start.sh extract
```

NOTE: The whole data have a size of 9GB per year aprox. Ensure you have enough space.

### 2. Compress file to GZIP

The result data will be saved to `./data/results.json.gz`. This reduce significately the size of the file.

```
sh ./start.sh compress
```

### 3. Save original data to Google Cloud Storage as a backup

It will upload to Google Cloud Storage the compressed file created with the command above. We strongly recommends to store a backup of the data following this way:

```
sh ./start.sh backup
```

### 4. Prepare data before upload to BigQuery table

It transform the data `./data/results.json.gz` into `edited.json` file. **This file is what we need to upload to BigQuery table**.

```
sh ./start.sh prepare
```
NOTE: This command takes long time depending on your machine. Be patient, in case of error it should throw an error and stop.

### 5. Upload data to BigQuery table

It will upload to BigQuery table the file created by the command above.

```
# TEMPORAL
gsutil cp ./data/edited.json gs://mangrove_atlas/deforestation-alerts/africa/

bq load \
    --replace \
    --source_format=NEWLINE_DELIMITED_JSON \
    deforestation_alerts.alerts \
    gs://mangrove_atlas/deforestation-alerts/africa/edited.json
	./schema.json

# TO-DO
sh ./start.sh upload 
```

## Sync new data to BigQuery table

Follow this [link](../sync-alerts) to more info.
