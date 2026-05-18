#!/bin/bash
set -e

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: You have uncommitted changes. Please commit or stash them before deploying."
  exit 1
fi

SHA=$(git rev-parse --short HEAD)
echo "export const VERSION = \"${SHA}\";" > src/version.js

npm run build
gh-pages -d build

git checkout -- src/version.js
