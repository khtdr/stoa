#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit

if [ ! -t 0 ]; then
    lines=""
    while IFS= read -r line; do
        lines="${lines}"$'\n'"${line}"
    done
fi

echo "$lines" | node bin/stoa.d/app.js "$@"
