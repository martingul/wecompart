#!/bin/bash
docker run --rm \
    --network wecompart_prod \
    -p 5000:5000 \
    --env-file=.env \
    --name api \
    api