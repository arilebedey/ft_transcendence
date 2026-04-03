#!/usr/bin/env bash
# ── Kibana Saved Objects Import/Export ──────────────────────────────────────
#
# Usage:
#   ./scripts/elk-setup.sh import   Wait for Kibana, then import saved objects
#   ./scripts/elk-setup.sh export   Export current Kibana objects to NDJSON
#
# The NDJSON file lives at docker/elk/kibana-saved-objects.ndjson
# ────────────────────────────────────────────────────────────────────────────

set -euo pipefail

KIBANA_URL="${KIBANA_URL:-http://localhost:5601}"
ELASTIC_USER="${ELASTIC_USER:-elastic}"
ELASTIC_PASSWORD="${ELASTIC_PASSWORD:-changeme}"
NDJSON_FILE="docker/elk/kibana-saved-objects.ndjson"
MAX_WAIT=120  # seconds

AUTH="-u ${ELASTIC_USER}:${ELASTIC_PASSWORD}"

wait_for_kibana() {
  echo "⏳ Waiting for Kibana to be ready (max ${MAX_WAIT}s)…"
  local elapsed=0
  while [ $elapsed -lt $MAX_WAIT ]; do
    if curl -sf $AUTH "${KIBANA_URL}/api/status" | grep -q '"level":"available"' 2>/dev/null; then
      echo "✅ Kibana is ready."
      return 0
    fi
    sleep 3
    elapsed=$((elapsed + 3))
  done
  echo "❌ Kibana did not become ready within ${MAX_WAIT}s."
  return 1
}

do_import() {
  if [ ! -f "$NDJSON_FILE" ]; then
    echo "⚠️  No saved objects file found at ${NDJSON_FILE}. Skipping import."
    return 0
  fi

  wait_for_kibana

  echo "📦 Importing saved objects from ${NDJSON_FILE}…"
  local response
  response=$(curl -s -w "\n%{http_code}" \
    $AUTH \
    -X POST "${KIBANA_URL}/api/saved_objects/_import?overwrite=true" \
    -H "kbn-xsrf: true" \
    -F "file=@${NDJSON_FILE}")

  local http_code
  http_code=$(echo "$response" | tail -1)
  local body
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    local success_count
    success_count=$(echo "$body" | grep -o '"successCount":[0-9]*' | cut -d: -f2)
    echo "✅ Import complete: ${success_count:-0} object(s) imported."
  else
    echo "❌ Import failed (HTTP ${http_code}):"
    echo "$body"
    return 1
  fi
}

do_export() {
  wait_for_kibana

  echo "📤 Exporting all saved objects from Kibana…"
  curl -s $AUTH \
    -X POST "${KIBANA_URL}/api/saved_objects/_export" \
    -H "kbn-xsrf: true" \
    -H "Content-Type: application/json" \
    -d '{
      "type": ["dashboard", "visualization", "lens", "index-pattern", "search", "map"],
      "includeReferencesDeep": true
    }' \
    -o "$NDJSON_FILE"

  if [ -s "$NDJSON_FILE" ]; then
    local count
    count=$(wc -l < "$NDJSON_FILE" | tr -d ' ')
    echo "✅ Exported ${count} object(s) to ${NDJSON_FILE}"
  else
    echo "❌ Export produced an empty file."
    rm -f "$NDJSON_FILE"
    return 1
  fi
}

case "${1:-}" in
  import) do_import ;;
  export) do_export ;;
  *)
    echo "Usage: $0 {import|export}"
    exit 1
    ;;
esac
