#!/bin/sh
set -e

ES_URL="http://elasticsearch:9200"
AUTH="-u elastic:${ELASTIC_PASSWORD}"

echo "=== Elasticsearch post-startup setup ==="

# ── 1. Set kibana_system password ────────────────────────────────────────────
echo "[1/4] Setting kibana_system password..."
curl -sf $AUTH -X POST "${ES_URL}/_security/user/kibana_system/_password" \
  -H "Content-Type: application/json" \
  -d "{\"password\": \"${ELASTIC_PASSWORD}\"}"
echo " OK"

# ── 2. Register filesystem snapshot repository ──────────────────────────────
echo "[2/4] Registering filesystem snapshot repository..."
curl -sf $AUTH -X PUT "${ES_URL}/_snapshot/fs-snapshots" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "fs",
    "settings": {
      "location": "/snapshots",
      "compress": true
    }
  }'
echo " OK"

# ── 3. Create SLM policy: daily snapshot at 2 AM ───────────────────────────
echo "[3/4] Creating SLM policy (daily snapshots at 02:00)..."
curl -sf $AUTH -X PUT "${ES_URL}/_slm/policy/daily-snapshots" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
echo " OK"

# ── 4a. Create ILM policy: wait for snapshot then delete after 72h ───────────
echo "[4a/4] Creating ILM retention policy (delete after 72h)..."
curl -sf $AUTH -X PUT "${ES_URL}/_ilm/policy/ft-logs-retention" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
echo " OK"

# ── 4b. Create index template to apply ILM to all log indices ────────────────
echo "[4b/4] Creating index template..."
curl -sf $AUTH -X PUT "${ES_URL}/_index_template/ft-logs-template" \
  -H "Content-Type: application/json" \
  -d '{
    "index_patterns": ["ft_transcendence-logs-*"],
    "template": {
      "settings": {
        "index.lifecycle.name": "ft-logs-retention"
      }
    },
    "priority": 100
  }'
echo " OK"

echo "=== Setup complete ==="
