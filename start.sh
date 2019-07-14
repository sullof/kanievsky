#!/usr/bin/env bash

CORES=1

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    CORES=$(cat /proc/cpuinfo | awk '/^processor/{print $3}' | wc -l)
fi

source .env && pm2 start index.js -i $CORES --name TrongridIO --exp-backoff-restart-delay=50 --update-env
pm2 save
