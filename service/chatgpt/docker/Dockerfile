FROM node:20-slim

WORKDIR /app

RUN apt update -y
RUN apt install -y curl

COPY ./service/chatgpt/src/package.json /app/

RUN yarn install

COPY ./service/chatgpt/src /app

