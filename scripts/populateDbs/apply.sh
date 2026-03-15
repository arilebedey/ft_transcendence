#!/bin/bash

SECRETS_DIR="./secrets"

if [ ! -s "$SECRETS_DIR/db_password.txt" ]; then
  echo "❌ Error: Please write the correct postgres password at $SECRETS_DIR/db_password.txt"
  exit 1
fi

export DB_PASSWORD=$(cat "$SECRETS_DIR/db_password.txt")
export DATABASE_URL="postgresql://dev_user:${DB_PASSWORD}@localhost:5432/dev_db"

cd scripts/populateDbs

if [ ! -d ".venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi

source .venv/bin/activate

echo "Installing dependencies..."
pip install -q -r requirements.txt

echo "Populating database..."
python3 populate.py --users 500 --posts-per-user 3 --likes 5000 --exec --no-dry-run
