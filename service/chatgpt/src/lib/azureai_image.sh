#!/bin/bash

source .env
DEPLOYMENT_NAME="dall-e-3"

CURRENT_TIME=$(date '+%Y%m%d_%H%M%S')
RESPONSE_DIR_PATH="./image/"
RESPONSE_FILE_PATH="${RESPONSE_DIR_PATH}__response.json"
IMAGE_FILE_PATH="${RESPONSE_DIR_PATH}${CURRENT_TIME}.png"

mkdir -p $RESPONSE_DIR_PATH

# 生成したい画像の説明（プロンプト）
PROMPT=${1:-"Create an image of the rocket flying through space, with the squirrel and turtle peering out of small windows, surrounded by twinkling stars. The style is black-and-white. Do not include any text in the image."}

# 画像生成APIへのリクエスト
curl -o $RESPONSE_FILE_PATH -X POST \
  "$ENDPOINT/openai/deployments/$DEPLOYMENT_NAME/images/generations?api-version=2024-02-15-preview" \
  -H "Content-Type: application/json" \
  -H "api-key: $API_KEY" \
  -d "{
        \"prompt\": \"$PROMPT\",
        \"n\": 1,
        \"size\": \"1024x1024\"
      }"

IMAGE_URL=$(cat $RESPONSE_FILE_PATH | jq -r '.data[0].url')

wget -O $IMAGE_FILE_PATH $IMAGE_URL

# rm -i $RESPONSE_FILE_PATH

echo "see: $IMAGE_FILE_PATH"
