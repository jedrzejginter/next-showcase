#!/bin/sh

set -eo pipefail

npm run build
npm publish --access public
