SECRETS_DIR  = ./secrets
DEV_COMPOSE  = docker compose -f docker-compose.yaml
PROD_COMPOSE = docker compose -f docker-compose.prod.yaml
PROD_HOST    ?= localhost

.DEFAULT_GOAL := help

# ── Help ─────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "  ft_transcendence"
	@echo ""
	@echo "  ── Dev ─────────────────────────────────────────────────────────"
	@echo "    make dev              Setup secrets + start full dev stack"
	@echo "    make infra            Start only db, minio, pgadmin"
	@echo "    make migrate          Run DB migrations inside Docker"
	@echo "    make restart-backend  Restart only the backend container"
	@echo "    make restart-frontend Restart only the frontend container"
	@echo ""
	@echo "  ── Prod ────────────────────────────────────────────────────────"
	@echo "    make prod             Setup secrets + build + start prod stack"
	@echo ""
	@echo "  ── Build ───────────────────────────────────────────────────────"
	@echo "    make build            Rebuild dev application images"
	@echo "    make build-prod       Rebuild prod application images"
	@echo "    make clean-images     Remove local dev images"
	@echo ""
	@echo "  ── Teardown ────────────────────────────────────────────────────"
	@echo "    make down             Stop dev stack"
	@echo "    make down-prod        Stop prod stack"
	@echo "    make clean            Stop dev stack + remove volumes"
	@echo "    make clean-prod       Stop prod stack + remove volumes"
	@echo "    make fclean           Stop dev stack + remove volumes + images"
	@echo ""
	@echo "  ── Logs & Debug ────────────────────────────────────────────────"
	@echo "    make logs             Tail all dev service logs"
	@echo "    make logs-backend     Tail backend logs only"
	@echo "    make logs-frontend    Tail frontend logs only"
	@echo "    make shell-backend    Open a shell in the backend container"
	@echo "    make shell-frontend   Open a shell in the frontend container"
	@echo "    make ps               Show running dev containers"
	@echo "		 make fix-docker       Set DOCKER_API_VERSION to 1.44"
	@echo "    make populate         Populate databases with test data"
	@echo ""

# ── Setup ────────────────────────────────────────────────────────────────────

setup:
	@bash scripts/setup-secrets.sh

# ── Database ──────────────────────────────────────────────────────────────────

regenerate:
	cd server && rm -rf drizzle && npx drizzle-kit generate --name=init_tables

migrate:
	cd server && npx drizzle-kit migrate

# ── Dev ──────────────────────────────────────────────────────────────────────

dev: setup
	@echo "▶  Starting dev stack…"
	$(DEV_COMPOSE) up -d --build --remove-orphans
	@echo "▶  Running migrations…"
	$(DEV_COMPOSE) run --rm migrate
	@echo "✅ Dev stack is up."
	@echo "   Frontend  → https://localhost:5173"
	@echo "   Backend   → http://localhost:3000"
	@echo "   pgAdmin   → http://localhost:8085"
	@echo "   MinIO UI  → http://localhost:9001"

infra: setup
	@echo "▶  Starting infrastructure only…"
	-$(DEV_COMPOSE) rm -fs frontend backend
	$(DEV_COMPOSE) up -d db pgadmin minio minio-init --remove-orphans
	@echo "✅ Infra running (postgres, pgadmin, minio)."

# ── Per-service restart ───────────────────────────────────────────────────────

restart-backend:
	@echo "▶  Restarting backend…"
	$(DEV_COMPOSE) restart backend
	@echo "✅ Backend restarted."

restart-frontend:
	@echo "▶  Restarting frontend…"
	$(DEV_COMPOSE) restart frontend
	@echo "✅ Frontend restarted."

# ── Build ────────────────────────────────────────────────────────────────────

build: setup
	$(DEV_COMPOSE) build backend frontend
	@echo "✅ Dev images built."

build-prod: setup
	PROD_HOST=$(PROD_HOST) $(PROD_COMPOSE) build backend frontend
	@echo "✅ Prod images built."

clean-images:
	docker image rm -f ft_transcendence-backend:dev ft_transcendence-frontend:dev 2>/dev/null || true
	@echo "✅ Dev images removed."

# ── Prod ─────────────────────────────────────────────────────────────────────

prod: setup
	@echo "▶  Starting prod stack…"
	-$(DEV_COMPOSE) rm -fs frontend backend
	PROD_HOST=$(PROD_HOST) $(PROD_COMPOSE) up -d --build --remove-orphans
	@echo "▶  Running migrations…"
	PROD_HOST=$(PROD_HOST) $(PROD_COMPOSE) run --rm migrate
	@echo "✅ Prod stack is up."
	@echo "   Frontend  → https://$(PROD_HOST)"

# ── Teardown ─────────────────────────────────────────────────────────────────

down:
	$(DEV_COMPOSE) down --remove-orphans
	@echo "✅ Dev stack stopped."

down-prod:
	PROD_HOST=$(PROD_HOST) $(PROD_COMPOSE) down --remove-orphans
	@echo "✅ Prod stack stopped."

clean:
	$(DEV_COMPOSE) down -v --remove-orphans
	@echo "✅ Dev stack stopped and volumes removed."

clean-prod:
	PROD_HOST=$(PROD_HOST) $(PROD_COMPOSE) down -v --remove-orphans
	@echo "✅ Prod stack stopped and volumes removed."

fclean:
	$(DEV_COMPOSE) down -v --remove-orphans --rmi local
	@echo "✅ Dev full cleanup done (containers, volumes, images)."

re: clean regenerate dev

# ── Logs ─────────────────────────────────────────────────────────────────────

logs:
	$(DEV_COMPOSE) logs -f

logs-backend:
	$(DEV_COMPOSE) logs -f backend

logs-frontend:
	$(DEV_COMPOSE) logs -f frontend

# ── Shell access ──────────────────────────────────────────────────────────────

shell-backend:
	$(DEV_COMPOSE) exec backend /bin/sh

shell-frontend:
	$(DEV_COMPOSE) exec frontend /bin/sh

# ── Status ───────────────────────────────────────────────────────────────────

ps:
	$(DEV_COMPOSE) ps

fix-docker:
	export DOCKER_API_VERSION=1.44

populate:
	scripts/populateDbs/apply.sh

.PHONY: help setup \
        dev infra regenerate migrate restart-backend restart-frontend \
        build build-prod clean-images \
        prod populate fix-docker  \
        down down-prod clean clean-prod fclean re \
        logs logs-backend logs-frontend \
        shell-backend shell-frontend ps
