#!/bin/bash

ls -lat service/movieEngine/src/data/

SCRIPT_DIR_PATH=$(dirname "$0")/
source ${SCRIPT_DIR_PATH}../../setting/.env

REQUEST_ID=${1:-test_from_curl}

ls ${SCRIPT_DIR_PATH}asset/narration.csv
ls ${SCRIPT_DIR_PATH}asset/dummy_image1.png

NARRATION_TEXT=$(cat ${SCRIPT_DIR_PATH}asset/narration.csv)

curl -X POST \
  -F "title=test_シマリス兄弟とふしぎなショッピングモール。" \
  -F "narrationCsv=${NARRATION_TEXT}" \
  -F "requestId=${REQUEST_ID}" \
  -F "fileList[]=@${SCRIPT_DIR_PATH}asset/dummy_image0.png" \
  -F "fileList[]=@${SCRIPT_DIR_PATH}asset/dummy_image1.png" \
  -F "fileList[]=@${SCRIPT_DIR_PATH}asset/dummy_image2.png" \
  -F "fileList[]=@${SCRIPT_DIR_PATH}asset/dummy_image3.png" \
  -F "fileList[]=@${SCRIPT_DIR_PATH}asset/dummy_image4.png" \
  "http://${MOVIE_API_IP}:${MOVIE_API_PORT}/api/v1/prompt/register/main"

