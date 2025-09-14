#!/usr/bin/env bash

docker run -it --rm \
  --name kanievsky-dev \
  -p 1965 \
  -v $PWD:/usr/src/app \
  -e VIRTUAL_HOST=kanievsky.com.local \
  -e SHELL=/bin/bash \
  -w /usr/src/app node:20 bash /usr/src/app/bin/container-setup.sh
