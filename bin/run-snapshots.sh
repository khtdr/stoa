#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:./:$PATH

for test_script in *.stoa; do
  echo $test_script
  ./$test_script -t > $test_script.tokens.txt
  ./$test_script -p > $test_script.ast.txt
  ./$test_script > $test_script.stdout.txt
done
