#!/usr/bin/env bash

docker stop o0netbot
docker rm o0netbot
docker build -t o0netbot .
docker run -d --restart unless-stopped -v $(pwd):/app --env-file .env o0netbot