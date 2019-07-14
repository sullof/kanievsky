#!/usr/bin/env bash

./git.sh pull
npm i
npm run build
pm2 update
