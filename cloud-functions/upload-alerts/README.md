# Upload data to BigQuery from local files

A list of commands created to upload the data to BigQuery table from local files.

Requirements:

* Unix system with Bash or ZSH
* Docker and docker-compose installed
* Google Cloud SDK installed
* Makefile installed

**Note**: We assume you data is already downloaded and stored in the folder `./data/vecs`. All the files should have the extension `.gpkg`.
**Note**: You need access to Google Cloud Storage client's account: download `credentials.json` and save to the root of the cloud function (`./credentials.json`).

## Instructions

* Download `credentials.json` and save to the root of the cloud function (`./credentials.json`).
* Put your `.gpkg` files in the folder `./data/vecs`.
* Run `make upload` to run the full pipe to transform and upload the data to BigQuery.

## Pipe overview, what it does

### 1. Extract data from .gpkg files and join the result in a single file

The result data will be saved to `./data/results.json`.

```
make extract
```

**NOTE:** The whole data have a size of 9GB per year aprox. Ensure you have enough space.

### 2. Compress file to GZIP

The result data will be saved to `./data/results.json.gz`. This reduce significately the size of the file.

```
make compress
```

### 3. Save original data to Google Cloud Storage as a backup

It will upload to Google Cloud Storage the compressed file created with the command above. We strongly recommends to store a backup of the data following this way:

```
make backup
```

### 4. Prepare data before upload to BigQuery table

It transform the data `./data/results.json.gz` into `edited.json` file. **This file is what we need to upload to BigQuery table**.

```
make prepare
```

**NOTE:** This command takes long time depending on your machine. Be patient, in case of error it should throw an error and stop.

### 5. Upload data to BigQuery table

It will upload to BigQuery table the file created by the command above. In order to do so we need to first upload the file to Google Cloud Storage. And later from the Google Cloud Storage we can upload the file to BigQuery table. all of this is handle in the next command

```bash
make load-bq 
```

**NOTE:** This command will drop the data in bigquery and replace it with the new data.

### Todo

* Validate the data before upload to BigQuery table  
* Add a command to append the data to BigQuery table from Google Cloud Storage instead of replacing it
