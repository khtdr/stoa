build: Makefile yarn.lock bin/stoa.d/src/app.js bin/stoa

clean:
	rm -rf bin

dev:
	make -B build WATCH="--watch"

run: build
	bin/stoa --repl

test:
	node_modules/.bin/jest

watch:
	node_modules/.bin/jest --watchAll

.PHONY: build clean dev test watch

bin/stoa: src/run.sh
	mkdir -p bin
	cp src/run.sh bin/stoa
	chmod +x bin/stoa

bin/stoa.d/src/app.js: src/*.ts
	node_modules/.bin/tsc src/app.ts --outDir bin/stoa.d --esModuleInterop --resolveJsonModule --noEmitOnError $(WATCH)

yarn.lock: package.json
	yarn install
	touch yarn.lock
