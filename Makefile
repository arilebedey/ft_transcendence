SECRETS_DIR  = ./secrets
DEV_COMPOSE  = docker compose -f docker-compose.yaml
ELK_COMPOSE  = docker compose -f docker-compose.elk.yaml
DEV_ELK      = docker compose -f docker-compose.yaml -f docker-compose.elk.yaml

.DEFAULT_GOAL := dev

# ── Help ─────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "  ft_transcendence"
	@echo ""
	@echo "  ── Dev ─────────────────────────────────────────────────────────"
	@echo "    make dev              Start dev stack + ELK (Elastic/Logstash/Kibana)"
	@echo "    make infra            Start only db, minio, pgadmin"
	@echo "    make migrate          Run DB migrations inside Docker"
	@echo "    make restart-backend  Restart only the backend container"
	@echo "    make restart-frontend Restart only the frontend container"
	@echo ""
	@echo "  ── Build ───────────────────────────────────────────────────────"
	@echo "    make build            Rebuild dev application images"
	@echo "    make clean-images     Remove local app images only"
	@echo ""
	@echo "  ── Teardown ────────────────────────────────────────────────────"
	@echo "    make down             Stop dev stack"
	@echo "    make down-elk         Stop ELK stack only"
	@echo "    make export-elk       Export current Kibana dashboards to repo"
	@echo "    make import-elk       Manually re-import Kibana dashboards"
	@echo "    make clean            Stop dev stack + remove volumes"
	@echo "    make fclean           Stop dev stack + remove volumes + images"
	@echo ""
	@echo "  ── Logs & Debug ────────────────────────────────────────────────"
	@echo "    make logs             Tail all dev service logs"
	@echo "    make logs-backend     Tail backend logs only"
	@echo "    make logs-frontend    Tail frontend logs only"
	@echo "    make logs-elk         Tail ELK service logs"
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
	@echo "▶  Starting dev + ELK stack…"
	$(DEV_ELK) up -d --build --remove-orphans
	@echo "▶  Running migrations…"
	$(DEV_ELK) run --rm migrate
	@echo "▶  Importing Kibana dashboards (background)…"
	@bash scripts/elk-setup.sh import &
	@echo "✅ Dev + ELK stack is up."
	@echo "   Frontend      → https://localhost:5173"
	@echo "   Kibana        → https://localhost:5601"

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

clean-images:
	docker image rm -f ft_transcendence-backend:dev ft_transcendence-frontend:dev ft_transcendence-backend:migrate 2>/dev/null || true
	@echo "✅ Local app images removed."

# ── Teardown ─────────────────────────────────────────────────────────────────

down:
	$(DEV_COMPOSE) down --remove-orphans
	@echo "✅ Dev stack stopped."

down-elk:
	$(ELK_COMPOSE) down --remove-orphans
	@echo "✅ ELK stack stopped."

clean:
	$(DEV_ELK) down -v --remove-orphans
	@echo "✅ Dev + ELK stacks stopped and volumes removed."

fclean:
	$(DEV_ELK) down -v --remove-orphans --rmi all
	@echo "✅ Dev + ELK full cleanup done (containers, volumes, images)."

re: clean regenerate dev

# ── Logs ─────────────────────────────────────────────────────────────────────

logs:
	$(DEV_COMPOSE) logs -f

logs-backend:
	$(DEV_COMPOSE) logs -f backend

logs-frontend:
	$(DEV_COMPOSE) logs -f frontend

logs-elk:
	$(ELK_COMPOSE) logs -f

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

# ── ELK Dashboard Management ────────────────────────────────────────────────

export-elk:
	@bash scripts/elk-setup.sh export

import-elk:
	@bash scripts/elk-setup.sh import

.PHONY: help setup \
        dev dev-elk infra regenerate migrate restart-backend restart-frontend \
        build clean-images \
        populate fix-docker \
        down down-elk clean fclean re \
        logs logs-backend logs-frontend logs-elk \
        shell-backend shell-frontend ps \
        export-elk import-elk
