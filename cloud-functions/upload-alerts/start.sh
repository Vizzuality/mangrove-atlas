#!/bin/bash

case "$1" in
  extract)
    type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
    docker-compose build && docker-compose run upload_alerts ogrmerge.py -overwrite_ds -single -progress -f geojson -o /home/data/results.json /home/data/vecs/*.gpkg
    ;;
  compress)
    type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
    docker-compose build && docker-compose run upload_alerts gzip -k ./data/results.json
    ;;
  backup)
    type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
    docker-compose build && echo "Work in progress..."
    ;;
  prepare)
    type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
    docker-compose build && docker-compose run upload_alerts npm start
    ;;
  upload)
    type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
    docker-compose build && echo "Work in progress..."
    ;;
  *)
    echo "Usage: start.sh {extract|compress|backup|prepare|upload}" >&2
    exit 1
    ;;
esac

exit 0
