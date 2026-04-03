#!/bin/sh

set -eu

SERVER_NAME="${SERVER_NAME:-localhost}"

/ssl.sh "$SERVER_NAME"
envsubst '${SERVER_NAME}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
