#!/bin/bash

SCRIPT_DIR_PATH=$(dirname "$0")/
source ${SCRIPT_DIR_PATH}../../setting/.env

curl "http://${MOVIE_API_IP}:${MOVIE_API_PORT}/api/v1/file/latest?requestId=${1:-01JHYZX90CBKHMCZJ9DZ3NAA52}"

