include setting/version.conf
SHELL=/bin/bash
PHONY=default init run rebuild help 

.PHONY: $(PHONY)

default: run-d

init: init-submodule init-module init-dir init-env
run-d: docker-compose-up-detatch
run: docker-compose-up
rebuild: docker-compose-down docker-compose-build

help:
	@echo "Usage: make init"
	@echo "Usage: make run-d"
	@echo "Usage: make run"
	@echo "Usage: make help"

init-submodule:
	git config -f .gitmodules submodule.xmodule-movie-core.branch master
	git submodule update --remote --init --recursive

init-module:
	cd ./service/movieEngine/src/lib/xmodule-movie-core/ && \
	git checkout . && \
	git clean -df

init-dir:
	mkdir -p ./service/movieEngine/src/data/
	mkdir -p ./service/movieApi/src/data/

init-env:
	@if [ ! -f service/movieApi/src/.env ]; then \
		echo "Copying .env.sample to .env for movieApi"; \
		cp service/movieApi/src/.env{.sample,}; \
		echo "EDIT service/movieApi/src/.env AND SET OPENAI_API_KEY!"; \
	fi
	@if [ ! -f service/movieEngine/src/.env ]; then \
		echo "Copying .env.sample to .env for movieEngine"; \
		cp service/movieEngine/src/.env{.sample,}; \
	fi
	@if [ ! -f service/chatgpt/src/.env ]; then \
		echo "Copying .env.sample to .env for chatgpt"; \
		cp service/chatgpt/src/.env{.sample,}; \
		echo "EDIT service/chatgpt/src/.env AND SET OPENAI_API_KEY!"; \
	fi

docker-compose-up-detatch:
	docker compose -p ${DOCKER_PROJECT_NAME} up -d

docker-compose-up:
	docker compose -p ${DOCKER_PROJECT_NAME} up

docker-compose-down:
	docker compose -p ${DOCKER_PROJECT_NAME} down --volumes

docker-compose-build:
	docker compose -p ${DOCKER_PROJECT_NAME} build



