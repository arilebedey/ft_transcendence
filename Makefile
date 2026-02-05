SECRETS_DIR = ./secrets

all: setup build up

setup:
	@bash scripts/setup-secrets.sh

build:
	docker compose build

up:
	docker compose up -d
	@echo "🎯 Services running (postgres & pgadmin)"

down:
	docker compose down

clean: down
	docker compose down -v
	@echo "💥 Volumes cleaned (data gone)"

re: clean all

logs:
	docker compose logs -f

ps:
	docker compose ps

fix-docker:
	export DOCKER_API_VERSION=1.44

.PHONY: all setup build up down clean re logs ps 42
