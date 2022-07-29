#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:./:$PATH

for test_script in *.stoa; do
  echo $test_script
  # do stuff!
  # ...
  # $test_script -p > $test_script.ast.txt
done
