#!/usr/bin/env bash

source .env && node_modules/.bin/pm2 start index.js --name kanievsky --exp-backoff-restart-delay=50 --update-env
node_modules/.bin/pm2 save
