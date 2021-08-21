#!/bin/bash
docker run \
    -v frontend_data:/frontend/dist \
    frontend:build