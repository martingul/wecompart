# git pull or use git hooks to trigger on commit
#!/usr/bin/env bash
echo 'Building js...'
npm run build:prod

echo 'Building css...'
npm run build:css

echo 'Copying files into docker container...'
cp src/index.html dist/
mkdir -p dist/assets/
cp -r src/assets/fonts/ dist/assets/
docker cp dist/. frontend:/usr/share/nginx/html/
docker cp nginx.conf frontend:/etc/nginx/conf.d/default.conf
echo 'Done.'