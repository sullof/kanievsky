#!/usr/bin/env bash

docker stop kanievsky
docker rm kanievsky

#!/usr/bin/env bash

source .env && docker run -d \
  --name kanievsky \
  -p 1965 \
  -v $PWD:/usr/src/app \
  -e VIRTUAL_HOST=kanievsky.com,www.kanievsky.com,gaelkanievsky.com,www.gaelkanievsky.com \
  -e LETSENCRYPT_HOST=kanievsky.com,www.kanievsky.com,gaelkanievsky.com,www.gaelkanievsky.com \
  -e SECRET_SAULT=$SECRET_SAULT \
  -e LETSENCRYPT_EMAIL=admin@kanievsky.com \
  -w /usr/src/app node:12.20.0-alpine3.10 npm run start

