#!/bin/bash

ls -lat service/movieApi/src/data/

curl "http://localhost:25673/api/v1/chatgpt/response/lookup?requestId=${1:-01JDF284PZF2YNFKPSM71VFMTE}"

