#!/bin/bash

set -e

BASE_URL="http://localhost:3000/api"
AUTH_URL="http://localhost:3000/api/auth"
BA_TOKEN="${BA_TOKEN:-}"

RAND=$(( RANDOM % 9000 + 1000 ))
TEST_EMAIL="testuser_${RAND}@example.com"
TEST_PASSWORD="Password123!"
TEST_NAME="Test User $RAND"

echo "=== 0. Register new user ==="
echo "Email: $TEST_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$AUTH_URL/sign-up/email" \
  -H "Content-Type: application/json" \
  -D - \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"$TEST_NAME\"
  }")

echo "$REGISTER_RESPONSE" | tail -n1 | jq

BA_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -i 'set-cookie:' | grep 'better-auth.session_token' | sed 's/.*better-auth.session_token=\([^;]*\).*/\1/' || true)

if [ -z "$BA_TOKEN" ]; then
  # If registration failed because the user already exists, try to sign in
  ERR_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1 | jq -r '.code // empty' 2>/dev/null || true)
  if [ "$ERR_CODE" = "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ]; then
    echo "User exists — attempting sign-in..."
    SIGNIN_RESPONSE=$(curl -s -X POST "$AUTH_URL/sign-in/email" \
      -H "Content-Type: application/json" \
      -D - \
      -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}")

    BA_TOKEN=$(echo "$SIGNIN_RESPONSE" | grep -i 'set-cookie:' | grep 'better-auth.session_token' | sed 's/.*better-auth.session_token=\([^;]*\).*/\1/' || true)

    if [ -z "$BA_TOKEN" ]; then
      echo "Error: Failed to extract session token from sign-in response"
      echo "Sign-in raw headers:"
      echo "$SIGNIN_RESPONSE" | head -20
      exit 1
    fi
  else
    echo "Error: Failed to extract session token from registration response"
    echo "Raw headers:"
    echo "$REGISTER_RESPONSE" | head -20
    exit 1
  fi
fi

echo "Session token: $(printf '%.20s' "$BA_TOKEN")..."
echo ""

echo "=== 1. Create a post ==="
POST_DATA=$(curl -s -X POST "$BASE_URL/posts" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "link": "https://example.com",
    "content": "Test post for likes"
  }')
echo "$POST_DATA" | jq
POST_ID=$(echo "$POST_DATA" | jq -r '.id // empty')

if [ -z "$POST_ID" ]; then
  echo "Error: Failed to create post"
  exit 1
fi

echo "Post ID: $POST_ID"
echo ""
echo "=== 2. Get initial like count (should be 0) ==="
curl -s "$BASE_URL/likes/post/$POST_ID/count" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq

echo ""
echo "=== 3. Check if liked by user (should be false) ==="
curl -s "$BASE_URL/likes/post/$POST_ID/is-liked" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq

echo ""
echo "=== 4. Toggle like ON ==="
curl -s -X POST "$BASE_URL/likes/toggle" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"postId\": $POST_ID}" | jq

echo ""
echo "=== 5. Get like count (should be 1) ==="
curl -s "$BASE_URL/likes/post/$POST_ID/count" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq

echo ""
echo "=== 6. Check if liked (should be true) ==="
curl -s "$BASE_URL/likes/post/$POST_ID/is-liked" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq

echo ""
echo "=== 7. List likes ==="
curl -s "$BASE_URL/likes/post/$POST_ID" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq

echo ""
echo "=== 8. Toggle like OFF ==="
curl -s -X POST "$BASE_URL/likes/toggle" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"postId\": $POST_ID}" | jq

echo ""
echo "=== 9. Get like count (should be 0) ==="
curl -s "$BASE_URL/likes/post/$POST_ID/count" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq

echo ""
echo "✅ Tests completed"
