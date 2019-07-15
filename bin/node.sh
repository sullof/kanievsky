#!/usr/bin/env bash

docker stop kanievsky
docker rm kanievsky

#!/usr/bin/env bash

source .env && docker run -d \
  --name kanievsky \
  -p 8080 \
  -v $PWD:/usr/src/app \
  -e VIRTUAL_HOST=kanievsky.com,www.kanievsky.com \
  -e LETSENCRYPT_HOST=kanievsky.com,www.kanievsky.com \
  -e LETSENCRYPT_EMAIL=admin@kanievsky.com \
  -w /usr/src/app node:carbon npm run start

