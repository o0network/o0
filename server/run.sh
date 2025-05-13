#!/usr/bin/env bash

docker stop o0server || true
docker rm o0server || true

docker build -t o0server .

docker run \
  -p 5555:5555 \
  -d \
  --restart unless-stopped \
  --name o0server \
  -v "$(pwd)/videos:/app/videos" \
  --env-file .env \
  o0server