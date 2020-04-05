BUILD: bin/stoa

CLEAN:
	rm -rf bin

DEV:
	make BUILD WATCH="--watch"

TEST:
	jest

XRAY:
	jest --watchAll

bin/stoa: Makefile yarn.lock bin/stoa.d/index.js
	echo "#!/usr/bin/env bash" > $@
	echo 'cd "$$(dirname "$$0")/.."' >> $@
	echo "cat - | node bin/stoa.d/index.js" >> $@
	chmod +x $@

#SRC_FILES=$(shell find src | grep \.ts\$)
#bin/stoa.d/index.js: bin/stoa.d $(SRC_FILES)
bin/stoa.d/index.js: bin/stoa.d src/*.ts
	tsc src/index.ts --outDir bin/stoa.d --noEmitOnError $(WATCH)

bin/stoa.d:
	mkdir -p bin/stoad.d

yarn.lock: package.json
	yarn install

.PHONY: BUILD DEV CLEAN TEST WATCH
