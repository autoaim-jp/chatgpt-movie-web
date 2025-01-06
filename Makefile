include setting/version.conf

# .env が存在する場合のみ読み込む
ifneq (,$(wildcard setting/.env))
  include setting/.env
endif

SHELL=/bin/bash
PHONY=default init run rebuild help 

.PHONY: $(PHONY)

default: run-d

init: init-submodule init-module init-dir init-env
run-d: docker-compose-up-detatch
run: docker-compose-up
down: docker-compose-down
rebuild: docker-compose-down docker-compose-build

help:
	@echo "Usage: make init"
	@echo "Usage: make run-d"
	@echo "Usage: make run"
	@echo "Usage: make down"
	@echo "Usage: make rebuild"
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
	@if [ ! -f setting/.env ]; then \
		echo "Copying .env.sample to .env for Makefile"; \
	  cp setting/.env.sample setting/.env; \
	fi
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
	docker compose --env-file setting/.env -p ${DOCKER_PROJECT_NAME}_${APP_ENV} up -d

docker-compose-up:
	docker compose --env-file setting/.env -p ${DOCKER_PROJECT_NAME}_${APP_ENV} up

docker-compose-down:
	docker compose --env-file setting/.env -p ${DOCKER_PROJECT_NAME}_${APP_ENV} down --volumes

docker-compose-build:
	docker compose --env-file setting/.env -p ${DOCKER_PROJECT_NAME}_${APP_ENV} build



