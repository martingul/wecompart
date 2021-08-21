#!/bin/bash
docker run --rm \
    -v frontend_data:/usr/share/nginx/html \
    --network wecompart_prod \
    -p 80:80 \
    --name reverse \
    reverse