NPM=pnpm

all:
	@echo make "build     # Builds the STOA application"
	@echo make "dev       # Build and test, watching for changes"
	@echo make "repl      # Launch the REPL"
	@echo make "install   # Builds and installs to ~/bin"

build: deps
	npx tsup --keep-names --no-splitting \
	         --out-dir ./bin src/stoa.ts

build-watch: deps
	npx tsup --watch \
	         --keep-names --no-splitting \
	         --out-dir ./bin src/stoa.ts

dev:
	make build
	make -j 1 build-watch

repl:
	@make build >/dev/null
	@bin/stoa --repl

install: build
	mkdir -p ~/bin
	cp bin/stoa.js ~/bin
	cp bin/stoa ~/bin
	chmod +x ~/bin/stoa
	stoa --version

lint:
	npx tsc --noEmit

deps: Makefile node_modules

node_modules: package.json
	${NPM} install

clean:
	rm bin/stoa.js

uninstall:
	rm ~/bin/stoa.js
	rm ~/bin/stoa
