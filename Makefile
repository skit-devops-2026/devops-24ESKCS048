# Every team fills in the commands for their own stack.
# The CI pipeline calls these targets, so the names must not change.

.PHONY: install test build run docker-build docker-up

install:
	npm install

test:
	npm test
	bash scripts/test.sh

build:
	npm run build

run:
	npm start

# Needed from M4 onwards
docker-build:
	docker compose build

docker-up:
	docker compose up --build