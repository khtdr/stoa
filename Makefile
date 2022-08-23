NPM := pnpm
BUILD_ARGS := --no-splitting --sourcemap --minify --keep-names
BUILD_CMD := npx tsup ${BUILD_ARGS}
REPL_SRC := $(shell find . -wholename './lib/repl-kit/*.ts')
STOA_SRC := $(shell find . -wholename './lib/stoa-ltk/*.ts')
STOX_SRC := $(shell find . -wholename './stox/*.ts')
TEST_SRC := $(shell find . -wholename './stox/tests/*')

all: build

packages/repl-kit/index.js: node_modules ${REPL_SRC}
	@${BUILD_CMD} --dts --out-dir ./packages/repl-kit lib/repl-kit/index.ts

package/stoa-ltk/index.js: node_modules ${STOA_SRC}
	@${BUILD_CMD} --dts --out-dir ./packages/stoa-ltk  lib/stoa-ltk/index.ts

bin/stox.js: node_modules ${STOA_SRC} ${REPL_SRC} ${STOX_SRC}
	@${BUILD_CMD} --out-dir ./bin stox.ts

node_modules: package.json
	${NPM} install

./images/stox-code.png: bin/stox.js
	@npx depcruise --exclude "^node_modules" --ts-config --output-type archi stox.ts \
	               | dot -T png > ./images/stox-code.png

.PHONY: all build build-watch clean coverage dev graphics install lint silent-test snapshot test uninstall


chonk: node_modules ${REPL_SRC}
	mkdir -p tmp
	@${BUILD_CMD} --dts --out-dir ./tmp lib/repl-kit/demo.ts
	node ./tmp/demo.js

build: packages/repl-kit/index.js packages/stoa-ltk/index.js bin/stox.js

# build-watch:
# 	@npx tsup --keep-names --no-splitting --sourcemap --watch \
# 	          --out-dir ../bin stox.ts

clean:
	rm -rf node_modules
	rm -rf coverage
	rm -f ./bin/stox.js
	@touch Makefile

coverage:
	@make bin/stox.js 1>/dev/null
	@npx nyc --extends "@istanbuljs/nyc-config-typescript" \
	         --exclude-after-remap \
	         --reporter html --reporter text-summary --reporter text \
	         make silent-test

# dev:
# 	@make build
# 	@make -j 2 build-watch test-watch

graphics: build ./images/stox-code.png

install: bin/stox.js
	@mkdir -p ~/bin
	@cp ./bin/stox.js ~/bin
	@cp ./bin/stox ~/bin
	@chmod +x ~/bin/stox
	which stox
	stox -v

lint:
	npx tsc --noEmit

silent-test:
	@make bin/stox.js 1>/dev/null
	@./bin/test-stox.sh 1>/dev/null

snapshot: build
	./bin/snapshot-stox-tests.sh

test: bin/stox.js ${TEST_SRC}
	@./bin/test-stox.sh

# test-watch: build
# 	@npx nodemon -e sh,stox,stderr,stdout,js -w tests -w ../bin/stox.js -x '../bin/test-stox.sh'

uninstall:
	rm ~/bin/stox.js
	rm ~/bin/stox
