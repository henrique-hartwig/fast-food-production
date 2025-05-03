#!/bin/bash

set -e

cd terraform/modules/lambda_layer/nodejs 

npm install
npx prisma generate --schema=./src/database/prisma/schema.prisma

cd .. && zip -rq fastfood-lambda-layer.zip nodejs

echo "Lambda Layer gerado em fastfood-lambda-layer.zip"
