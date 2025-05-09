#!/usr/bin/env bash

MEDIA_DIR="src/assets/media"
THUMBNAIL_DIR="src/assets/thumbnails"

mkdir -p $THUMBNAIL_DIR

if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Please install it and try again."
    echo "Install using: brew install ffmpeg (macOS) or apt-get install ffmpeg (Ubuntu)"
    exit 1
fi

for video in $MEDIA_DIR/*.mp4; do
    filename=$(basename "$video" .mp4)

    thumbnail="$THUMBNAIL_DIR/$filename.jpg"

    echo "Generating thumbnail for $video..."

    ffmpeg -y -ss 00:00:00 -i "$video" -vframes 1 -q:v 2 "$thumbnail" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "Created thumbnail: $thumbnail"
    else
        echo "Failed to create thumbnail for $video"
    fi
done