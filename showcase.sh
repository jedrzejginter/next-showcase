#!/bin/bash -e
DIR=$(cd -P $(dirname "${BASH_SOURCE[0]}") && pwd)

if [ "$1" == "watch" ]; then
  npx onchange -v 'src/**/*.stories.*' -- node ${DIR}/cli.js
else
  node ${DIR}/cli.js
fi

