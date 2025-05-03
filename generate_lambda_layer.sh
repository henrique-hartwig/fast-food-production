#!/bin/bash

set -e

cd terraform/modules/lambda_layer/nodejs 

npm install
npx prisma generate --schema=../../../../src/database/prisma/schema.prisma

ls -la
cd node_modules
ls | grep prisma
cd ..

cd .. && zip -rq fastfood-lambda-layer.zip nodejs

echo "Lambda Layer gerado em fastfood-lambda-layer.zip"
echo "Tamanho do arquivo zip: $(du -h fastfood-lambda-layer.zip | cut -f1)"
