#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:$PATH

echo "Testing the evaluator (with parse errors)"

pass=0
fail=0
for test_script in *.stoa; do
    result=$(diff  <($test_script 2>&1) "${test_script}.stdout.txt" | sed '/^[[:space:]]*$/d')
    if [ -z "${result}" ]; then
      echo ✔ "${test_script}"
      ((pass+=1))
    else
      echo ❌ "${test_script}"
      echo 'diff <('"$test_script) ${test_script}.stdout.txt"
      echo "${result}"
      ((fail+=1))
    fi
done
echo Passing: $pass Failing: $fail
