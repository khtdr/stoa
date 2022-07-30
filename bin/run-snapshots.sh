#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:./:$PATH

for test_script in *.stoa; do
  echo Snapshotting: $test_script
  touch ./$test_script.tokens.stdout ./$test_script.tokens.stderr
  touch ./$test_script.ast.stdout    ./$test_script.ast.stderr
  touch ./$test_script.eval.stdout   ./$test_script.eval.stderr
  ./$test_script -t 1> ./$test_script.tokens.stdout 2> ./$test_script.tokens.stderr
  ./$test_script -p 1>    ./$test_script.ast.stdout 2>    ./$test_script.ast.stderr
  ./$test_script    1>   ./$test_script.eval.stdout 2>   ./$test_script.eval.stderr
done
