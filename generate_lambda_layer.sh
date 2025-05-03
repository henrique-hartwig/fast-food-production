#bin/bash

rm -rf .build
tsc
cd terraform/modules/lambda_layer/nodejs 
npm install
cd .. && zip -r fastfood-lambda-layer.zip nodejs