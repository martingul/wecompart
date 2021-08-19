#!/usr/bin/env bash
# git pull or use git hooks to trigger on commit
# TODO make this a docker image writing into a volume shared with nginx
echo 'Installing dependencies...'
npm ci --prefix frontend

echo 'Building js...'
npm run --prefix frontend build:prod

echo 'Building css...'
# npm run --prefix frontend build:css

echo 'Copying files into docker container...'
cp frontend/src/index.html frontend/dist/
mkdir -p frontend/dist/assets/
cp -r frontend/src/assets/fonts/ frontend/dist/assets/
docker cp frontend/dist/. reverse:/usr/share/nginx/html/
echo 'Done.'