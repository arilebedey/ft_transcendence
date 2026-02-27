### Helpers

#### Get test tokens via /auth/sign-up/email:

```sh
export BA_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -D - \
  -d '{"email": "user1@test.com", "password": "password123", "name": "User One"}' \
  | grep -i "set-cookie" | grep -o "better-auth.session_token=[^;]*" | cut -d= -f2)
echo $BA_TOKEN
```

```sh
export BA_TOKEN2=$(curl -s -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -D - \
  -d '{"email": "user2@test.com", "password": "password123", "name": "User Two"}' \
  | grep -i "set-cookie" | grep -o "better-auth.session_token=[^;]*" | cut -d= -f2)
echo $BA_TOKEN2
```

#### Get IDs of test users

```sh
export USER2_ID=$(curl -s http://localhost:3000/api/users/me \
  -H "Cookie: better-auth.session_token=$BA_TOKEN2" | jq -r '.id')
echo $USER2_ID
```

```sh
export USER_ID=$(curl -s http://localhost:3000/api/users/me \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq -r '.id')
echo $USER_ID
```

### Success tests

#### Create chat with user 2 and export conversation id

```sh
export CONV_ID=$(curl -s -X POST http://localhost:3000/api/chat \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"participantId": "'"$USER2_ID"'"}' | tee /dev/stderr | jq -r '.id')
```

#### Send message

```sh
curl -s -X POST http://localhost:3000/api/chat/$CONV_ID/messages \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "hello from user 1"}' | jq
```

```sh
curl -s -X POST http://localhost:3000/api/chat/$CONV_ID/messages \
  -H "Cookie: better-auth.session_token=$BA_TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{"content": "hello from user 2"}' | jq
```

### More tests

```sh
# Create chat with self
# Expected: 400 — Cannot create chat with yourself
curl -s -X POST http://localhost:3000/api/chat \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"participantId": "'"$USER_ID"'"}'
```

```sh
# Create duplicate chat — same pair from user 2's perspective
# Expected: 201 — returns the SAME conversation (idempotent)
curl -s -X POST http://localhost:3000/api/chat \
  -H "Cookie: better-auth.session_token=$BA_TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{"participantId": "'"$USER_ID"'"}'
```

```sh
# More than message max length
# Code: 400
python3 -c "print('{\"content\": \"' + 'A'*5001 + '\"}')" | \
curl -s -X POST http://localhost:3000/api/chat/$CONV_ID/messages \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" \
  -H "Content-Type: application/json" \
  -d @-
```
