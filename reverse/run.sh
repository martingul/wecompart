#!/bin/bash
docker run \
    -v frontend_data:/usr/share/nginx/html \
    --network wecompart_prod \
    -p 80:80 \
    --name reverse \
    reverse