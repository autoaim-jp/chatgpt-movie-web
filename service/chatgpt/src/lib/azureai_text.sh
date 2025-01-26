#!/bin/bash

DEPLOYMENT_NAME="gpt-4o"

# 結果のJSONの出力先
RESPONSE_JSON_FILE_PATH=${1:-/tmp/response.json}

# 入力のJSON
PROMPT_JSON_FILE_PATH=${2:-/tmp/prompt.json}

# APIエンドポイント
API_URL="${AZUREAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-08-01-preview"

# APIキーのチェック
if [ -z "$AZUREAI_GPT4_API_KEY" ]; then
  echo "Error: The environment variable OPENAI_CHATGPT_API_KEY is not set."
  exit 1
fi

# curlコマンドでAPIにリクエストを送信
curl -X POST "$API_URL" \
     -H "api-key: $AZUREAI_GPT4_API_KEY" \
     -H "Content-Type: application/json" \
     -d @"$PROMPT_JSON_FILE_PATH" \
     -o "$RESPONSE_JSON_FILE_PATH"

# リクエストのステータスをチェック
if [ $? -eq 0 ]; then
  echo "Request successful. Response saved to $RESPONSE_JSON_FILE_PATH"
else
  echo "Error: Request failed."
  exit 1
fi

