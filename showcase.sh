#!/bin/bash -e

if [ "$1" == "watch" ]; then
  npx onchange -v 'src/**/*.stories.*' -- node ./cli.js
else
  node ./cli.js
fi

