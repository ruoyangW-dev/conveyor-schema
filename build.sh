#!/bin/bash
set -e
[ -d "lib" ] && rm -R lib
yarn run lib
# uncomment when first tar file created
# rm conveyor-schema-*.tgz
yarn pack --quiet