#!/bin/bash

set -e

cd terraform/modules/lambda_layer/nodejs 

npm install
node_modules/.bin/prisma generate --schema=../../../../src/database/prisma/schema.prisma

echo "ECHOOOOO node_modules/@prisma/client"
ls -la node_modules/@prisma/client

echo "ECHOOOOO node_modules/.prisma"
ls -la node_modules/.prisma

echo "ECHO ACABOU ECHOOOO"

cd .. && zip -rq fast-food-lambda-layer.zip nodejs

echo "Lambda Layer gerado em fast-food-lambda-layer.zip"
echo "Tamanho do arquivo zip: $(du -h fast-food-lambda-layer.zip | cut -f1)"
