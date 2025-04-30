#!/bin/bash

set -e

mkdir -p dist

for domain in order product product_category; do
  for usecase in $(ls .build/$domain/useCases); do
    mkdir -p dist/$domain
    zip -r dist/$domain/$usecase.zip \
      .build/$domain/domain \
      .build/$domain/useCases/$usecase \
      .build/database/prisma/prismaClient.ts \
      .build/utils
  done
done