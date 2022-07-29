NPM=pnpm

all: build

help:
	@echo make "build     # Builds the STOA application"
	@echo make "dev       # Build and test, watching for changes"
	@echo make "repl      # Launch the REPL"
	@echo make "install   # Builds and installs to ~/bin"
	@echo make "test      # Builds, installs, and tests"

build: deps
	npx tsup --keep-names --no-splitting \
	         --out-dir ./bin src/stoa.ts \
	         --sourcemap
silent-build: deps
	@make build &>/dev/null

build-watch: deps
	npx tsup --watch \
	         --keep-names --no-splitting \
	         --out-dir ./bin src/stoa.ts

test:
	@make build >/dev/null
	./bin/test-tokenizer.sh
	@echo
	./bin/test-parser.sh
	@echo
	./bin/test-evaluator.sh

silent-test:
	@make test &>/dev/null

test-watch: build
	npx nodemon -e sh,stoa,txt,js -w tests -w bin/stoa.js -x './tests/run.sh'

dev:
	make build
	make -j 2 build-watch test-watch

install: build
	mkdir -p ~/bin
	cp bin/stoa.js ~/bin
	cp bin/stoa ~/bin
	chmod +x ~/bin/stoa
	stoa -v

coverage: silent-build
	npx nyc --extends "@istanbuljs/nyc-config-typescript" \
	        --exclude-after-remap \
	        --reporter html --reporter text --reporter text-summary \
            make silent-test

repl:
	@make build >/dev/null
	@bin/stoa --repl

lint:
	@npx tsc --noEmit

graph:
	@npx depcruise --include-only "^src" --output-type dot src | dot -T png > dependency-graph.png

deps: Makefile node_modules

node_modules: package.json
	${NPM} install

clean:
	rm bin/stoa.js

uninstall:
	rm ~/bin/stoa.js
	rm ~/bin/stoa
