SECRETS_DIR = ./secrets
DEV_COMPOSE = docker compose -f docker-compose.yaml
PROD_COMPOSE = docker compose -f docker-compose.prod.yaml

TARGET_ENV := dev
ifneq ($(filter prod,$(MAKECMDGOALS)),)
TARGET_ENV := prod
endif
ifneq ($(filter dev,$(MAKECMDGOALS)),)
TARGET_ENV := dev
endif

ifeq ($(TARGET_ENV),prod)
ACTIVE_COMPOSE = $(PROD_COMPOSE)
else
ACTIVE_COMPOSE = $(DEV_COMPOSE)
endif

all: setup up

setup:
	@bash scripts/setup-secrets.sh

build:
	@if [ "$(TARGET_ENV)" = "prod" ]; then \
		$(PROD_COMPOSE) build backend frontend; \
		echo "Built application images for prod stack"; \
	else \
		echo "No application image build in dev mode (services run from base images). Use: make build prod"; \
	fi

clean-images:
	@if [ "$(TARGET_ENV)" = "prod" ]; then \
		docker image rm -f ft_transcendence-backend:prod ft_transcendence-frontend:prod 2>/dev/null || true; \
		echo "Removed application images for prod stack"; \
	else \
		echo "No local application images managed in dev mode"; \
	fi

up:
	-$(PROD_COMPOSE) rm -fs frontend backend
	$(DEV_COMPOSE) up -d --remove-orphans
	$(MAKE) migrate
	@echo "Services running in dev mode (frontend, backend, postgres, pgadmin, minio)"

ifeq ($(firstword $(MAKECMDGOALS)),prod)
prod: setup
	-$(DEV_COMPOSE) rm -fs frontend backend
	$(PROD_COMPOSE) up -d --build --remove-orphans
	$(MAKE) migrate
	@echo "Services running in production mode"
else
prod:
	@:
endif

ifeq ($(firstword $(MAKECMDGOALS)),dev)
dev: setup up
else
dev:
	@:
endif

install:
	cd server && npm install && cd ../frontend && npm install && cd ..

regenerate:
	rm -rf server/drizzle && cd server && npx drizzle-kit generate --name=init_tables  && cd ..

migrate:
	cd server && npx drizzle-kit migrate && cd ..

down:
	$(ACTIVE_COMPOSE) down --remove-orphans
	@echo "Stopped $(TARGET_ENV) stack"

clean:
	$(ACTIVE_COMPOSE) down -v --remove-orphans
	@echo "Volumes cleaned for $(TARGET_ENV) stack (data removed)"

fclean:
	$(ACTIVE_COMPOSE) down -v --remove-orphans --rmi local
	@echo "Full cleanup done for $(TARGET_ENV) stack (containers, volumes, local images removed)"

re: clean regenerate all install migrate

logs:
	$(ACTIVE_COMPOSE) logs -f

ps:
	$(ACTIVE_COMPOSE) ps

fix-docker:
	export DOCKER_API_VERSION=1.44

.PHONY: all setup build clean-images up dev prod down clean fclean re logs ps fix-docker migrate regenerate
