#!/bin/sh
set -e

ES_URL="http://elasticsearch:9200"
AUTH="-u elastic:${ELASTIC_PASSWORD}"
MAX_RETRIES="${MAX_RETRIES:-20}"
RETRY_DELAY="${RETRY_DELAY:-3}"

echo "=== Elasticsearch post-startup setup ==="

request_es() {
  method="$1"
  endpoint="$2"
  data="$3"
  step_label="$4"

  attempt=1
  while [ "$attempt" -le "$MAX_RETRIES" ]; do
    response_file="/tmp/es-response-${attempt}.json"
    http_code="$(
      curl -sS -o "$response_file" -w "%{http_code}" $AUTH \
        -X "$method" "${ES_URL}${endpoint}" \
        -H "Content-Type: application/json" \
        -d "$data"
    )"

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
      cat "$response_file"
      rm -f "$response_file"
      return 0
    fi

    body="$(cat "$response_file")"
    rm -f "$response_file"

    echo "[$step_label] Attempt ${attempt}/${MAX_RETRIES} failed with HTTP ${http_code}."
    if [ -n "$body" ]; then
      echo "$body"
    fi

    if [ "$attempt" -eq "$MAX_RETRIES" ]; then
      return 1
    fi

    sleep "$RETRY_DELAY"
    attempt=$((attempt + 1))
  done
}

# ── 1. Set kibana_system password ────────────────────────────────────────────
echo "[1/4] Setting kibana_system password..."
request_es "POST" "/_security/user/kibana_system/_password" \
  "{\"password\": \"${ELASTIC_PASSWORD}\"}" \
  "1/4"
echo " OK"

# ── 2. Register filesystem snapshot repository ──────────────────────────────
echo "[2/4] Registering filesystem snapshot repository..."
request_es "PUT" "/_snapshot/fs-snapshots" \
  '{
    "type": "fs",
    "settings": {
      "location": "/snapshots",
      "compress": true
    }
  }' \
  "2/4"
echo " OK"

# ── 3. Create SLM policy: daily snapshot at 2 AM ───────────────────────────
echo "[3/4] Creating SLM policy (daily snapshots at 02:00)..."
request_es "PUT" "/_slm/policy/daily-snapshots" \
  '{
    "schedule": "0 0 2 * * ?",
    "name": "<ft-logs-{now/d}>",
    "repository": "fs-snapshots",
    "config": {
      "indices": ["ft_transcendence-logs-*"],
      "ignore_unavailable": true,
      "include_global_state": false
    },
    "retention": {
      "expire_after": "30d",
      "min_count": 3,
      "max_count": 30
    }
  }' \
  "3/4"
echo " OK"

# ── 4a. Create ILM policy: wait for snapshot then delete after 72h ───────────
echo "[4a/4] Creating ILM retention policy (delete after 72h)..."
request_es "PUT" "/_ilm/policy/ft-logs-retention" \
  '{
    "policy": {
      "phases": {
        "hot": {
          "min_age": "0ms",
          "actions": {}
        },
        "delete": {
          "min_age": "72h",
          "actions": {
            "wait_for_snapshot": {
              "policy": "daily-snapshots"
            },
            "delete": {}
          }
        }
      }
    }
  }' \
  "4a/4"
echo " OK"

# ── 4b. Create index template to apply ILM to all log indices ────────────────
echo "[4b/4] Creating index template..."
request_es "PUT" "/_index_template/ft-logs-template" \
  '{
    "index_patterns": ["ft_transcendence-logs-*"],
    "template": {
      "settings": {
        "index.lifecycle.name": "ft-logs-retention"
      }
    },
    "priority": 100
  }' \
  "4b/4"
echo " OK"

echo "=== Setup complete ==="
