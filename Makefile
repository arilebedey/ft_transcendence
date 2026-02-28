SECRETS_DIR = ./secrets

all: setup build up

setup:
	@bash scripts/setup-secrets.sh

build:
	docker compose build

up:
	docker compose up -d
	@echo "🎯 Services running (postgres & pgadmin)"

install:
	cd server && npm install && cd ../frontend && npm install && cd ..

regenerate:
	rm -rf server/drizzle && cd server && npx drizzle-kit generate --name=init_tables  && cd ..

migrate:
	cd server && npx drizzle-kit migrate && cd ..

down:
	docker compose down

clean: down
	docker compose down -v
	@echo "💥 Volumes cleaned (data gone)"

re: clean regenerate all install migrate

logs:
	docker compose logs -f

ps:
	docker compose ps

fix-docker:
	export DOCKER_API_VERSION=1.44

.PHONY: all setup build up down clean re logs ps fix-docker migrate regenerate
