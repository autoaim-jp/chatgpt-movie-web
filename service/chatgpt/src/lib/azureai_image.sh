#!/bin/bash

DEPLOYMENT_NAME="dall-e-3"

RESULT_IMAGE_FILE_PATH="${1:-"/tmp/generated_image.png"}"
TMP_JSON_FILE_PATH="${2:-"/tmp/result.json"}"
PROMPT_JSON_FILE_PATH="${3:-"/tmp/prompt.json"}"

# input
PROMPT="${4:-"cat"}"

# APIエンドポイント
API_URL="${AZUREAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/images/generations?api-version=2024-02-15-preview"

# APIキーのチェック
if [ -z "$AZUREAI_GPT4_API_KEY" ]; then
  echo "Error: The environment variable OPENAI_CHATGPT_API_KEY is not set."
  exit 1
fi

JSON_STR=$(jq -n --arg prompt "$PROMPT" --arg n "1" --arg size "1024x1024" \
  '{
    prompt: $prompt,
    n: ($n | tonumber),
    size: $size
  }')

echo "$JSON_STR" > $PROMPT_JSON_FILE_PATH


# 画像生成APIへのリクエスト
curl -o $TMP_JSON_FILE_PATH -X POST $API_URL \
  -H "Content-Type: application/json" \
  -H "api-key: $AZUREAI_GPT4_API_KEY" \
  -d "$JSON_STR"

IMAGE_URL=$(jq -r 'try .data[0].url // empty' ${TMP_JSON_FILE_PATH})

curl -o ${RESULT_IMAGE_FILE_PATH} "${IMAGE_URL}"

