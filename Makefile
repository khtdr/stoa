BIN_DIR=bin

TSC_0=stage-0/index.ts
SRC_0=$(shell find stage-0 | grep \.ts\$)
BIN_0=$(BIN_DIR)/stage-0
DIR_0=$(BIN_DIR)/stage-0.d
LIB_0=$(DIR_0)/index.js

$(BIN_0): Makefile bin $(LIB_0)
	echo "#!/usr/bin/env bash" > $@
	echo 'cd $$(dirname $$0)/..' >> $@
	echo "cat - | node $(LIB_0)" >> $@
	chmod +x $@

$(LIB_0): $(DIR_0) $(SRC_0)
	tsc $(TSC_0) --outDir $(DIR_0)

$(DIR_0):
	mkdir $(DIR_0)

bin:
	mkdir bin

clean:
	rm -rf bin

.PHONY: clean
