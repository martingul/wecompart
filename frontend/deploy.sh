#!/bin/bash
npm ci
npm run build:prod
# npm run build:css

mkdir -p dist/assets
cp -r src/assets/fonts/ dist/assets/
cp src/index.html dist/index.html

# TODO delete files not in dist/