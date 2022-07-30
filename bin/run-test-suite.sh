#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:./:$PATH

echo "Running the test suite"

pass=0
fail=0
for test_script in *.stoa; do
    stderr_TOKENS=$(mktemp)
    stderr_PARSER=$(mktemp)
    stderr_VALU8R=$(mktemp)

    ./$test_script -t 1>/dev/null 2> $stderr_TOKENS
    ./$test_script -p 1>/dev/null 2> $stderr_PARSER
    ./$test_script    1>/dev/null 2> $stderr_VALU8R

    stderr_TK=$(diff $stderr_TOKENS "${test_script}.tokens.stderr")
    stdout_TK=$(diff <($test_script -t 2>/dev/null) "${test_script}.tokens.stdout")

    stderr_PR=$(diff $stderr_PARSER "${test_script}.ast.stderr")
    stdout_PR=$(diff <($test_script -p 2>/dev/null) "${test_script}.ast.stdout")

    stderr_EV=$(diff $stderr_VALU8R "${test_script}.eval.stderr")
    stdout_EV=$(diff <($test_script 2>/dev/null) "${test_script}.eval.stdout")

    echo "Test: ${test_script}"
    if [ -z "${stderr_TK}" ]; then
      echo "  ✔ Token errors"
      ((pass+=1))
    else
      echo "  ❌ Token errors"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stderr_TK}"
      ((fail+=1))
    fi
    if [ -z "${stdout_TK}" ]; then
      echo "  ✔ Token output"
      ((pass+=1))
    else
      echo "  ❌ Token output"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stdout_TK}"
      ((fail+=1))
    fi

    if [ -z "${stderr_PR}" ]; then
      echo "  ✔ Parse errors"
      ((pass+=1))
    else
      echo "  ❌ Parse errors"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stderr_PR}"
      ((fail+=1))
    fi
    if [ -z "${stdout_PR}" ]; then
      echo "  ✔ Parse tree"
      ((pass+=1))
    else
      echo "  ❌ Parse tree"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stdout_PR}"
      ((fail+=1))
    fi

    if [ -z "${stderr_EV}" ]; then
      echo "  ✔ Runtime errors"
      ((pass+=1))
    else
      echo "  ❌ Runtime errors"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stderr_EV}"
      ((fail+=1))
    fi
    if [ -z "${stdout_EV}" ]; then
      echo "  ✔ Runtime Output"
      ((pass+=1))
    else
      echo "  ❌ Runtime Output"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stdout_EV}"
      ((fail+=1))
    fi
    rm $stderr_TOKENS
    rm $stderr_PARSER
    rm $stderr_VALU8R
done
echo Passing: $pass Failing: $fail
echo
