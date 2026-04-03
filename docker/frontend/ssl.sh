#!/bin/sh
set -eu

CERT_DIR="/etc/nginx/ssl"
DOMAIN_NAME="${1:-localhost}"

mkdir -p "$CERT_DIR"

openssl req -x509 -days 365 -newkey rsa:2048 -nodes \
  -out "$CERT_DIR/server.crt" \
  -keyout "$CERT_DIR/server.key" \
  -subj "/C=FR/CN=$DOMAIN_NAME"

