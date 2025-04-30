#bin/bash

set -e

rm -rf .build
tsc
cd terraform/modules/lambda_layer/nodejs 
npm install
cd .. && zip -r lambda_layer.zip nodejs