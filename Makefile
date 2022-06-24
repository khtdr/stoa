all:
	@echo make "build     # Builds the STOA application"
	@echo make "test      # Builds and runs the test suite"
	@echo make "dev       # Build and test, watching for changes"
	@echo make "repl      # Launch the REPL"
	@echo make "install   # Builds and installs to ~/bin"

build: deps
	npx tsup --keep-names --no-splitting \
	         --out-dir ./bin src/stoa.ts

build-watch: deps
	npx tsup --watch --ignore-watch ./.tests \
	         --keep-names --no-splitting \
	         --out-dir ./bin src/stoa.ts

test: test-build test-jest

test-build:
	npx tsup --keep-names --no-splitting \
	         --out-dir .tests tests

test-jest:
	npx jest

test-build-watch:
	npx tsup --watch --keep-names --no-splitting \
	         --ignore-watch ./src --ignore-watch ./bin \
	         --out-dir .tests tests

test-jest-watch:
	npx jest --watchAll

dev:
	make build test-build
	make -j 3 test-jest-watch test-build-watch build-watch

repl:
	@make build >/dev/null
	@bin/stoa --repl

install: build
	mkdir -p ~/bin
	cp bin/stoa.js ~/bin
	cp bin/stoa ~/bin
	chmod +x ~/bin/stoa
	stoa --version

deps: Makefile node_modules

node_modules: package.json
	yarn install

