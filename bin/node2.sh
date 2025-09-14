#!/usr/bin/env bash

docker stop kanievsky2
docker rm kanievsky2

#!/usr/bin/env bash

docker run -d \
  --name kanievsky2 \
  -p 1965 \
  -v $PWD:/usr/src/app \
  -e VIRTUAL_HOST=gaelkanievsky.com,www.gaelkanievsky.com \
  -e LETSENCRYPT_HOST=gaelkanievsky.com,www.gaelkanievsky.com \
  -e LETSENCRYPT_EMAIL=admin@kanievsky.com \
  -w /usr/src/app node:22 npm run start
