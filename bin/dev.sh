#!/usr/bin/env bash

source .env && docker run -it --rm \
  --name kanievsky-dev \
  -p 8080 \
  -v $PWD:/usr/src/app \
  -e VIRTUAL_HOST=kanievsky.com.localhost \
  -w /usr/src/app node:carbon yarn start
