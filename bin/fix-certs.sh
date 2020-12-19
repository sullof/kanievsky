#!/usr/bin/env bash

cd /vol/etc/nginx/certs

ln -s ./$1/chain.pem $2.chain.pem
ln -s  ./$1/fullchain.pem $2.crt
ln -s ./dhparam.pem $2.dhparam.pem
ln -s ./$1/key.pem $2.key
