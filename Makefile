NPM=pnpm

all: packages

packages: repl-kit stoa-ltk

repl-kit: deps
	npx tsup --dts --no-splitting \
	    --out-dir ./packages/repl-kit  \
	    lib/repl-kit/index.ts

stoa-ltk: deps
	npx tsup --dts --no-splitting \
	    --out-dir ./packages/stoa-ltk  \
	    lib/stoa-ltk/index.ts

stox: build-stox

build-stox: deps
	@cd stox && make build

build-watch-stox: deps
	@cd stox && make build-watch

test-stox: deps
	@cd stox && make test

test-watch-stox: deps
	@cd stox && make test-watch

dev-stox: deps
	@cd stox && make dev

install-stox: deps
	@cd stox && make install-stox

coverage-stox: deps
	@cd stox && make coverage

repl-stox: deps
	@cd stox && make repl

lint-stox: deps
	@cd stox && make lint

snapshot-stox: deps
	@cd stox && make snapshot

graphics:
	@npx depcruise --exclude "^node_modules" --ts-config --output-type archi stox/stox.ts | dot -T png > ./images/stox-code.png

clean-stox:
	@cd stox && make clean

uninstall-stox:
	@cd stox && make uninstall

deps: Makefile node_modules

node_modules: package.json
	${NPM} install
