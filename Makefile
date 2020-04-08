bin/stoa.js: deps src/*.ts
	node_modules/.bin/parcel build ./src/app.ts \
		--no-source-maps --no-autoinstall --bundle-node-modules \
		--target node --out-dir bin --out-file stoa.js

bin/stoa.js-watch: deps src/*.ts
	node_modules/.bin/parcel watch ./src/app.ts \
		--no-source-maps --bundle-node-modules \
		--target node --out-dir bin --out-file stoa.js

watch:
	node_modules/.bin/concurrently "make test-watch" "make-stoa.js-watch"

test:
	node_modules/.bin/jest

test-watch:
	node_modules/.bin/jest --watchAll

run-repl: build
	bin/stoa --repl

install: bin/stoa.js
	mkdir -p ~/bin
	cp bin/stoa.js ~/bin
	cp bin/stoa ~/bin
	chmod +x ~/bin/stoa
	stoa --version

deps: Makefile yarn.lock

yarn.lock: package.json
	yarn install
	touch yarn.lock

.PHONY: bin/stoa.js-watch watch test test-watch run-repl install deps
