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

Install NVM and install Node 25:

```sh
nvm install 25.5.0
nvm use 25.5.0
```

### 4. Launch PostgreSQL DB in Docker

Run the docker container that houses the db and the pgadmin interface:

```sh
# at root of repo (where compose file is located)
make
```

If you're at 42, the docker version doesn't match the daemon, so use this hack before running the command:

```sh
make fix-docker
# or
export DOCKER_API_VERSION=1.44
```

### 5. Launch the NestJS server

```sh
cd server
nvm use
npm install
npm run dev
```

### 6. Test the NestJS server

Test auth module:

```sh
curl http://localhost:3000/api/auth/ok
# should return:
# `{"ok":true}%`
```

### 7. Apply the drizzle schema

The DB should be up and healthy (`docker ps`) before running this.

This creates the DB tables needed by Better Auth:

```sh
cd server
npx drizzle-kit migrate
```

### 8. Launch the front-end

```sh
cd frontend
nvm use
npm install
npm run dev
```

The opened port should be port `5173` because its the only one allowed on the NestJS server.

Open the webpage in a browser.

```
http://localhost:5173/
```

### 8. Test authentication

Sign up with a name, email and password.

Watch the server for errors (you already launched it 😜)

Changes to source files will appear instantly in the webpage.
