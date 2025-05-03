#!/bin/bash

set -e

cd terraform/modules/lambda_layer/nodejs 

npm install
npx prisma generate --schema=../../../../src/database/prisma/schema.prisma

ls -la
cd node_modules
ls | grep prisma
cd ..

cd .. && zip -rq fastfood2-lambda-layer.zip nodejs

echo "Lambda Layer gerado em fastfood2-lambda-layer.zip"
echo "Tamanho do arquivo zip: $(du -h fastfood2-lambda-layer.zip | cut -f1)"
