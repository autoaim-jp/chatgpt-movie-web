#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/
source ${SCRIPT_DIR_PATH}../../setting/.env
ls -lat service/movieEngine/src/data/

echo "hello test by curl" > /tmp/sample_movie_rabbitmq.txt
curl -X POST \
  -F "test=test" \
  "http://${MOVIE_API_IP}:${MOVIE_API_PORT}/api/v1/prompt/register/dummy"

