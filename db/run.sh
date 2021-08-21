#!/bin/bash
docker run \
    --network wecompart_prod \
    -v db_data:/var/lib/postgresql/data \
    -p 5432:5432 \
    --env-file=.env \
    --name db \
    db