#!/usr/bin/env sh
api_key=$(cat credentials.json | jq -r '.stripe_test_key')
stripe --api-key "$api_key" "$@"
# docker run --rm -it --network host \
#     stripe/stripe-cli:latest --api-key "$api_key" "$@"
