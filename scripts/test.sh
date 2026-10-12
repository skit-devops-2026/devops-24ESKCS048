#!/usr/bin/env bash

set -e

echo "Running test suite..."

test -d css
test -d script
test -d html
test -f package.json
test -f server.js

# Verify server syntax
node --check server.js

echo "All tests passed."