#!/usr/bin/env bash

git reset --hard
git pull
pnpm i
pnpm build
bin/node.sh
