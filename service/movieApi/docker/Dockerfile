FROM node:20-slim

WORKDIR /app

RUN apt update -y
RUN apt install -y jq curl

COPY ./service/movieApi/src/package.json /app/

RUN yarn install

COPY ./service/movieApi/src /app

