#!/bin/bash

set -e

rm -rf .build
tsc
npm install

npx prisma generate --schema=./src/database/prisma/schema.prisma

mkdir -p .build/nodejs
cp -r node_modules .build/nodejs/
cp package.json .build/nodejs/
cp package-lock.json .build/nodejs/ 2>/dev/null || true

cd .build && zip -r ../fastfood-lambda-layer.zip nodejs

echo "Lambda Layer gerado em fastfood-lambda-layer.zip"
