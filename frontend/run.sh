#!/bin/bash
docker run --rm \
    -v frontend_data:/frontend/dist \
    frontend:build