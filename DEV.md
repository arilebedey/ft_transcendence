### 1. Clone this repo

```sh
git clone git@github.com:arilebedey/ft_transcendence.git
```

### 2. Create a branch

```sh
git checkout desired-branch-to-branch-off-of
git branch test-or-feature-branch
git checkout test-or-feature-branch

# later
git commit
git push origin main
```

### 3. Install NVM to manage node version

[Guide to installing NVM](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating)
Install NVM and install Node 25

```sh
nvm install 25.5.0
nvm use 25.5.0
```

### 4. Launch PostgreSQL DB in Docker

Run the docker container that houses the db and pgadmin interface

```sh
# at root of repo (where compose file is located)
docker compose up -d
```

### 5. Launch the NestJS server

```sh
cd server
npm run dev
```

### 6. Test the NestJS server

Test auth module

```sh
curl http://localhost:3000/api/auth/ok
// should return
// {"ok":true}%
```
