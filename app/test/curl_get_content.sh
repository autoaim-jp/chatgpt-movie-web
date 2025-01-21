#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/
source ${SCRIPT_DIR_PATH}../../setting/.env
ls -lat service/movieApi/src/data/output/

REQUEST_ID=${1:-01JDF4NWX3Q5HJ5C0TK7Y2XQ42}
_FILE_PATH=${2:-output.mp4}
FILE_PATH=/tmp/${_FILE_PATH}

mkdir -p $(dirname $FILE_PATH)

curl -s "http://${MOVIE_API_IP}:${MOVIE_API_PORT}/api/v1/file/content?requestId=${REQUEST_ID}&fileName=${_FILE_PATH}" -o $FILE_PATH

ls -la $FILE_PATH

