.PHONY: up
# start services
up: crypt/unlocked
	docker compose up --build -d --wait

.PHONY: deploy
deploy:
ifeq ($(LIVE),)
	@+$(MAKE) deploy LIVE=1
else
	docker compose build
	$(foreach service,frontend backend nginx,\
		docker save watconf-$(service) | gzip | docker -H "ssh://me@watconf.kabir.dev" load;)
	docker -H "ssh://me@watconf.kabir.dev" compose up -d --wait
endif

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

.PHONY: test
# run backend tests
test:
	docker compose run --rm backend pytest

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
else ifneq ($(LIVE),)
export COMPOSE_FILE = docker-compose.yml$(COMPOSE_SEPARATOR)docker-compose.live.yml
endif

.PHONY: seed
seed:
	set -o allexport && source backend/envs/dev.env && source backend/envs/common.env && set +o allexport; \
	docker cp backend/src/seed.sql db:/seed.sql; \
	docker exec -it db psql -U $$POSTGRES_USER -d $$POSTGRES_DB -f seed.sql

crypt/unlocked:
	git crypt unlock crypt/crypt.key
	touch crypt/unlocked
