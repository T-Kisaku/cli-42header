#!/usr/bin/env bash
set -a
source project.env
set +a

mkdir -p dist

if [ -n "$TARGET" ]; then
  deno compile \
    --allow-run \
    --allow-env \
    --env-file=project.env \
    --allow-read \
    --allow-write \
    --target="$TARGET" \
    --output="./dist/$BINARY_NAME-$TARGET" \
    src/main.ts
else
  deno compile \
    --allow-run \
    --allow-env \
    --env-file=project.env \
    --allow-read \
    --allow-write \
    --output="$BINARY_NAME" \
    src/main.ts
fi

