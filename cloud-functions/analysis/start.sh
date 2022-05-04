#!/bin/bash

case "$1" in
  dev)
    type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
    docker-compose build && docker-compose up
    ;;
  upload)
    type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
    docker-compose build && echo "Work in progress..."
    ;;
  *)
    echo "Usage: start.sh {dev}" >&2
    exit 1
    ;;
esac

exit 0
