.PHONY: up
# start services
up:
	docker compose up --build -d

.PHONY: down
# stop services
down:
	docker compose down

.PHONY: reset
# stop services and remove volumes
reset:
	docker compose down -v

.PHONY: revision
# create a new Alembic migration
revision:
	./backend/scripts/revision.sh $(MESSAGE)

.PHONY: upgrade
# upgrade the database
upgrade:
	docker compose run --rm backend flask db upgrade

.PHONY: shell
# start the backend container with a shell (don't start the server)
shell:
	docker compose run --rm -it backend bash

.PHONY: exec
# start a *new* shell in the backend container
exec:
	docker compose exec -it backend bash -c "source .venv/bin/activate && bash"

.PHONY: logs
# show logs
logs:
	docker compose logs -f

ifeq ($(OS),Windows_NT)
COMPOSE_SEPARATOR = ;
else
COMPOSE_SEPARATOR = :
endif

ifneq ($(PROD),)
export COMPOSE_FILE = docker-compose.yml$(COMPOSE_SEPARATOR)docker-compose.prod.yml
endif

.PHONY: seed
seed:
	@set -o allexport && source backend/envs/dev.env && set +o allexport; \
	docker cp backend/src/seed.sql db:/seed.sql; \
	docker exec -it db psql -U $$POSTGRES_USER -d $$POSTGRES_DB -f /seed.sql