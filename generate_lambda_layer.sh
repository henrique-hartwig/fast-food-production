#bin/bash

rm -rf .build
tsc
cd terraform/modules/lambda_layer/nodejs 
npm install
cd .. && zip -r fast-food-lambda-layer.zip nodejs