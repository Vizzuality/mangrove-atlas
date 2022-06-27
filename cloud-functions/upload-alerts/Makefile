FOLDER := $$(date +%Y-%m-%d)

.PHONY: upload

upload: extract compress prepare load-bq

gcs-login:
	@gcloud auth activate-service-account --key-file=./credentials.json

test-docker:
	@type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }

extract: clean
	@echo "Extracting data from  /data/vecs/*.gpkg into data/results.json ..."
	@docker-compose build && docker-compose run upload_alerts ogrmerge.py -overwrite_ds -single -progress -f geojson -o /home/data/results.json /home/data/vecs/*.gpkg

compress: ./data/results.json
	@echo "Compressing data/results.json into data/results.json.gz ..."
	@docker-compose build && docker-compose run upload_alerts gzip -k ./data/results.json

backup:
	@echo "Backing up data/results.json.gz to data/results.json.gz.bak ..."
	@docker-compose build && echo "Work in progress..."

prepare: ./data/results.json.gz
	@echo "Preparing data/results.json.gz for upload ..."
	@docker-compose build && docker-compose run upload_alerts npm start

upload-gcs: ./data/edited.json
	@echo "Uploading data/edited.json to GCS ..."
	@gsutil cp ./data/edited.json \
		gs://mangrove_atlas/deforestation-alerts/${FOLDER}/edited.json

load-bq: gcs-login | upload-gcs
	@echo "Loading data/edited.json into BigQuery ..."
	@bq load \
		--replace \
		--source_format=NEWLINE_DELIMITED_JSON \
		deforestation_alerts.alerts \
		gs://mangrove_atlas/deforestation-alerts/${FOLDER}/edited.json \
		./schema.json

clean:
	@rm -rfv ./data/*.json.gz  & rm -rfv ./data/*.json




