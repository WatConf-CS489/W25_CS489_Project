ifneq ($(PROD),)
export COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml
endif

.PHONY: up
# start services
up:
	docker compose up --build -d

.PHONY: down
# stop services
down:
	docker compose down

.PHONY: revision
# create a new Alembic migration
revision:
	./backend/scripts/revision.sh $(MESSAGE)

.PHONY: shell
# start the backend container with a shell (don't start the server)
shell:
	docker compose run --rm -it backend bash

.PHONY: exec
# start a *new* shell in the backend container
exec:
	docker compose exec -it backend bash -c "source .venv/bin/activate && bash"
