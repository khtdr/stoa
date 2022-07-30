#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:./:$PATH

echo "Snapshotting the parse tree"

pass=0
fail=0
for test_script in *.stoa; do
    result=$(diff  <($test_script -p 2>&1) "${test_script}.ast.txt" | sed '/^[[:space:]]*$/d')
    if [ -z "${result}" ]; then
      echo ✔ "${test_script}"
      ((pass+=1))
    else
      echo ❌ "${test_script}"
      echo 'diff <('"$test_script) ${test_script}.ast.txt"
      echo "${result}"
      ((fail+=1))
    fi
done
echo Passing: $pass Failing: $fail
echo
