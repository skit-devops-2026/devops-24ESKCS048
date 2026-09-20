# Every team fills in the commands for their own stack.
# The CI pipeline calls these targets, so the names must not change.

.PHONY: install test build run docker-build docker-up

install:
	@echo "No dependencies to install"

test:
	bash scripts/test.sh

build:
	@echo "Static HTML/CSS/JS project - no build step required"

run:
	@echo "Run the project using a simple local server"
	python3 -m http.server 8000

# Needed from M4 onwards
docker-build:
	docker compose build

docker-up:
	docker compose up --build