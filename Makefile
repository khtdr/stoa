NPM=pnpm

all: build

help:
	@echo make "build     # Builds the STOA application"
	@echo make "dev       # Build and test, watching for changes"
	@echo make "repl      # Launch the REPL"
	@echo make "install   # Builds and installs to ~/bin"
	@echo make "test      # Builds, installs, and tests"
	@echo make "coverage  # Builds coverage reports"
	@echo make "deps      # Builds node_modules"
	@echo make "packages  # Builds stoa-ltk and repl-kit"

build: deps
	@npx tsup --keep-names --no-splitting \
	          --out-dir ./bin src/stoa.ts \
	          --sourcemap
silent-build: deps
	@make build &>/dev/null

build-watch: deps
	@npx tsup --watch \
	          --keep-names --no-splitting \
	          --out-dir ./bin src/stoa.ts

packages: repl-kit stoa-ltk

repl-kit:
	npx tsup --dts --no-splitting \
	    --out-dir ./packages/repl-kit  \
	    lib/repl-kit/index.ts

stoa-ltk:
	npx tsup --dts --no-splitting \
	    --out-dir ./packages/stoa-ltk  \
	    lib/stoa-ltk/index.ts

test: silent-build
	@./bin/run-test-suite.sh

silent-test:
	@make test &>/dev/null

test-watch: build
	@npx nodemon -e sh,stoa,txt,js -w tests -w bin/stoa.js -x './tests/run.sh'

dev:
	@make build
	@make -j 2 build-watch test-watch

install: build
	@mkdir -p ~/bin
	@cp bin/stoa.js ~/bin
	cp bin/stoa ~/bin
	@chmod +x ~/bin/stoa
	stoa -v

coverage: silent-build
	@npx nyc --extends "@istanbuljs/nyc-config-typescript" \
	         --exclude-after-remap \
	         --reporter html --reporter text --reporter text-summary \
             make silent-test

repl:
	@make build >/dev/null
	@bin/stoa --repl

lint:
	@npx tsc --noEmit

snapshots:
	@bin/run-snapshots.sh

graph:
	@npx depcruise --include-only "^(src|lib)" --output-type dot src | dot -T png > images/dependency-graph.png
	@npx depcruise --include-only "^(src|lib)" --output-type ddot src | dot -T png > images/ddot.png
	@npx depcruise --include-only "^(src|lib)" --output-type archi src | dot -T png > images/archi.png

deps: Makefile node_modules

node_modules: package.json
	${NPM} install

clean:
	rm -rf node_modules
	rm -rf coverage
	rm -f bin/stoa.js

uninstall:
	rm ~/bin/stoa.js
	rm ~/bin/stoa
