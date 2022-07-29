#!/usr/bin/env bash

cd "$(dirname "$0")" || exit
export PATH=../bin:$PATH

for test_script in *.stoa; do
  echo $test_script
  # do stuff!
  # ...
done
