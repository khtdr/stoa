all: build

build:
	@npx tsup --keep-names --no-splitting --sourcemap \
	          --out-dir ../bin stox.ts
silent-build:
	@make build &>/dev/null

build-watch:
	@npx tsup --keep-names --no-splitting --sourcemap --watch \
	          --out-dir ../bin stox.ts

test: silent-build
	@../bin/test-stox.sh

silent-test:
	@make test &>/dev/null

test-watch: build
	@npx nodemon -e sh,stox,stderr,stdout,js -w tests -w ../bin/stox.js -x '../bin/test-stox.sh'

dev:
	@make build
	@make -j 2 build-watch test-watch

install: build
	@mkdir -p ~/bin
	@cp ../bin/stox.js ~/bin
	cp ../bin/stox ~/bin
	@chmod +x ~/bin/stox
	stox -v

coverage: silent-build
	@npx nyc --extends "@istanbuljs/nyc-config-typescript" \
	         --exclude-after-remap \
	         --reporter html --reporter text-summary --reporter text \
             make silent-test

repl:
	@make build >/dev/null
	@../bin/stox --repl

lint:
	@npx tsc --noEmit

snapshot:
	@../bin/run-snapshots.sh

graph:
	@npx depcruise --exclude "^node_modules" --ts-config "../tsconfig.json" --output-type dot src | dot -T png > ../images/deps.png
	@npx depcruise --exclude "^node_modules" --ts-config "../tsconfig.json" --output-type archi src | dot -T png > ../images/arch.png

clean:
	rm -rf node_modules
	rm -rf coverage
	rm -f ../bin/stox.js

uninstall:
	rm ~/bin/stox.js
	rm ~/bin/stox
