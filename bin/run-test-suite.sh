#!/usr/bin/env bash

cd "$(dirname "$0")/../tests" || exit
export PATH=../bin:./:$PATH

test_stage() {
    stderr_TEMP=$(mktemp)
    stdout_TEMP=$(mktemp)
    "./$test_script" "$flags" 1>/dev/null 2> "$stderr_TEMP"
    "./$test_script" "$flags" 2>/dev/null 1> "$stdout_TEMP"
    stderr_RESP=$(diff "$stderr_TEMP" "${test_script}.${ext}.stderr")
    stdout_RESP=$(diff "$stdout_TEMP" "${test_script}.${ext}.stdout")

    if [ -z "${stderr_RESP}" ]; then
      echo -n "✔"
      ((pass+=1))
    else
      echo -n "✖"
      echo "${ext}.stdout"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stderr_RESP}"
      ((fail+=1))
    fi
    if [ -z "${stdout_RESP}" ]; then
      echo -n "✔"
      ((pass+=1))
    else
      echo -n "✖"
      echo "${ext}.stdout"
      echo 'ACTUAL < -- > EXPECTED'
      echo "${stdout_RESP}"
      ((fail+=1))
    fi
    rm "$stderr_TEMP"
    rm "$stdout_TEMP"
}

pass=0
fail=0
for test_script in *.stoa; do
    echo Testing: "${test_script}"
    flags="-t"
    ext="tokens"
    test_stage

    flags="-p"
    ext="ast"
    test_stage

    flags=""
    ext="eval"
    test_stage

    echo
done
echo
total=$((pass+fail))
echo "Passing: $pass out of $total ($((pass*100/total))%)"
echo "Failing: $fail out of $total ($((fail*100/total))%)"
echo
