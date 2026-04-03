#!/bin/bash
# setup-secrets.sh
# Ensures all required secret files exist.
# For dev: auto-generates sensible defaults if files are missing.
set -e
SECRETS_DIR="./secrets"
mkdir -p "$SECRETS_DIR"
generated=()
# ── db_password ──────────────────────────────────────────────────────────────
if [ ! -s "$SECRETS_DIR/db_password.txt" ]; then
  echo "dev_password" > "$SECRETS_DIR/db_password.txt"
  generated+=("db_password.txt  → 'dev_password'")
fi
# ── minio_password ───────────────────────────────────────────────────────────
if [ ! -s "$SECRETS_DIR/minio_password.txt" ]; then
  echo "minioadmin" > "$SECRETS_DIR/minio_password.txt"
  generated+=("minio_password.txt → 'minioadmin'")
fi
# ── pgadmin_password ─────────────────────────────────────────────────────────
if [ ! -s "$SECRETS_DIR/pgadmin_password.txt" ]; then
  echo "pgadmin" > "$SECRETS_DIR/pgadmin_password.txt"
  generated+=("pgadmin_password.txt → 'pgadmin'")
fi
# ── better_auth_secret ───────────────────────────────────────────────────────
if [ ! -s "$SECRETS_DIR/better_auth_secret.txt" ]; then
  openssl rand -hex 32 > "$SECRETS_DIR/better_auth_secret.txt"
  generated+=("better_auth_secret.txt → (random 32-byte hex)")
fi
# ── dev HTTPS certificate ────────────────────────────────────────────────────
if [ ! -s "$SECRETS_DIR/dev-cert.pem" ] || [ ! -s "$SECRETS_DIR/dev-key.pem" ]; then
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$SECRETS_DIR/dev-key.pem" \
    -out "$SECRETS_DIR/dev-cert.pem" \
    -subj "/C=FR/ST=IDF/L=Paris/O=ft_transcendence/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"
  generated+=("dev-cert.pem/dev-key.pem → self-signed localhost TLS cert")
fi
# ── Report ───────────────────────────────────────────────────────────────────
if [ ${#generated[@]} -gt 0 ]; then
  echo "⚙️  Auto-generated dev secrets (safe defaults — change for production!):"
  for entry in "${generated[@]}"; do
    echo "   • $entry"
  done
else
  echo "✅ All secrets already configured."
fi
