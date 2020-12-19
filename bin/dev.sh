#!/usr/bin/env bash

source .env && docker run -it --rm \
  --name kanievsky-dev \
  -p 1965 \
  -v $PWD:/usr/src/app \
  -e VIRTUAL_HOST=kanievsky.com.localhost \
  -e SECRET_SAULT=$SECRET_SAULT \
  -w /usr/src/app node:12.20.0-alpine3.10 yarn start
