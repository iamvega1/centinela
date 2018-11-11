CURRENT_DIRECTORY := $(shell pwd)

build:
	@cd application ; npm install

install:
	@docker run --rm -v $(CURRENT_DIRECTORY)/application:/var/www luis/nodejs npm install

test:
	@echo "There are no tests to run"

start:
	@fig up -d

stop:
	@fig stop

restart:
	@fig stop web
	@fig start web
	@tail -f logs/nodejs.log

clean:
	@fig rm --force

status:
	@fig ps

log:
	@fig logs web

cli:
	@fig run --rm web bash

.PHONY: build install test start stop restart clean status log cli