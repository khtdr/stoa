build: Makefile yarn.lock src/app.js bin/stoa

clean:
	rm -rf src/*.js

dev:
	make -B build WATCH="--watch"

run: build
	bin/stoa --repl

test:
	node_modules/.bin/jest

watch:
	node_modules/.bin/jest --watchAll

.PHONY: build clean dev test watch

bin/stoa: bin/stoa.js src/run.sh
	mkdir -p bin
	cp src/run.sh bin/stoa
	chmod +x bin/stoa

bin/stoa.js: src/app.js
	node_modules/.bin/rollup src/app.js --file bin/stoa.js

src/app.js: src/*.ts
	node_modules/.bin/tsc src/app.ts $(WATCH) \
		--esModuleInterop --resolveJsonModule --noEmitOnError

yarn.lock: package.json
	yarn install
	touch yarn.lock
