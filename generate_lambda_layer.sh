#!/bin/bash

set -e

npm install --production
npx prisma generate --schema=./src/database/prisma/schema.prisma

cp -r node_modules ./nodejs/
cp package.json ./nodejs/
cp package-lock.json ./nodejs/
echo 'MOSTRA OS ARQUIVOS'
ls
zip -rq fastfood-lambda-layer.zip nodejs

echo "Lambda Layer gerado em fastfood-lambda-layer.zip"
