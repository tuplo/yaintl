#!/usr/bin/env bash
set -euo pipefail

main() {
  rm -rf dist

  tsc --build tsconfig.build.json
  rm dist/index.js dist/*.tsbuildinfo
  rm -rf dist/helpers

  esbuild src/index.ts \
    --bundle \
    --format=esm \
    --minify \
    --outfile=dist/index.esm.js

  esbuild src/index.ts \
    --bundle \
    --format=cjs \
    --minify \
    --outfile=dist/index.cjs.js
}

main
