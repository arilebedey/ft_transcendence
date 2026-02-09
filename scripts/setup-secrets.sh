#!/bin/bash

SECRETS_DIR="./secrets"

mkdir -p "$SECRETS_DIR"

touch "$SECRETS_DIR/db_password.txt"
touch "$SECRETS_DIR/pgadmin_password.txt"

errors=()

if [ ! -s "$SECRETS_DIR/db_password.txt" ]; then
  errors+=("Please write postgres password at $SECRETS_DIR/db_password.txt")
  errors+=("The dev DB password should be \`dev_password\`")
fi

if [ ! -s "$SECRETS_DIR/pgadmin_password.txt" ]; then
  errors+=("Please write pgadmin password at $SECRETS_DIR/pgadmin_password.txt")
fi

if [ ${#errors[@]} -gt 0 ]; then
  for error in "${errors[@]}"; do
    echo "$error"
  done
  exit 1
fi

echo "✅ Secrets configured"
