build: Makefile yarn.lock bin/stoa.d/app.js bin/stoa

clean:
	rm -rf bin

dev:
	make -B build WATCH="--watch"

run: build
	bin/stoa --repl

test:
	jest

watch:
	jest --watchAll

.PHONY: build clean dev test watch

bin/stoa: src/run.sh
	cp src/run.sh bin/stoa
	chmod +x bin/stoa

bin/stoa.d/app.js: bin/stoa.d src/*.ts
	tsc src/app.ts --outDir bin/stoa.d --noEmitOnError $(WATCH)

bin/stoa.d:
	mkdir -p bin/stoa.d

yarn.lock: package.json
	yarn install
	touch yarn.lock
