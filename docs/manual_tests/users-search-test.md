#### Get test tokens via /auth/sign-up/email:

```sh
export BA_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -D - \
  -d '{"email": "user1@test.com", "password": "password123", "name": "User One"}' \
  | grep -i "set-cookie" | grep -o "better-auth.session_token=[^;]*" | cut -d= -f2)
echo $BA_TOKEN
```

### Create users

```sh
for i in 1 2 3 4 5; do
  curl -s -X POST http://localhost:3000/api/auth/sign-up/email \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"searchtest$i@test.com\", \"password\": \"password123\", \"name\": \"SearchTest User$i\"}" \
    | jq .user.name
done
```

### Fetch users

```sh
curl -s "http://localhost:3000/api/users/search?q=SearchTest" \
  -H "Cookie: better-auth.session_token=$BA_TOKEN" | jq
```
