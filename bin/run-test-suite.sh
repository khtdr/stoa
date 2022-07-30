#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:./:$PATH

test_stage() {
    stderr_TEMP=$(mktemp)
    stdout_TEMP=$(mktemp)
    ./$test_script $flags 1>/dev/null 2> $stderr_TEMP
    ./$test_script $flags 2>/dev/null 1> $stdout_TEMP
    stderr_RESP=$(diff $stderr_TEMP "${test_script}.${ext}.stderr")
    stdout_RESP=$(diff $stdout_TEMP "${test_script}.${ext}.stdout")
    if [ -z "${stderr_RESP}" ]; then
      echo "  ✔ ${err_title}"
      ((pass+=1))
    else
      echo "  ❌ ${err_title}"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stderr_RESP}"
      ((fail+=1))
    fi
    if [ -z "${stdout_RESP}" ]; then
      echo "  ✔ ${out_title}"
      ((pass+=1))
    else
      echo "  ❌ ${out_title}"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stdout_RESP}"
      ((fail+=1))
    fi
    rm $stderr_TEMP
    rm $stdout_TEMP
}

pass=0
fail=0
for test_script in *.stoa; do
    echo Testing: $test_script
    flags="-t"
    ext="tokens"
    err_title="Token errors"
    out_title="Token output"
    test_stage

    flags="-p"
    ext="ast"
    err_title="Parse errors"
    out_title="Parse tree"
    test_stage

    flags=""
    ext="eval"
    err_title="Runtime errors"
    out_title="Runtime output"
    test_stage
done
echo Passing: $pass Failing: $fail
echo
