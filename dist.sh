#!/bin/sh
set -ex
mkdir -p dist
rm -f dist/ida-bot.zip
zip -r -FS dist/ida-bot.zip * --exclude '*.git*' \
  --exclude '*/.DS_Store' \
  --exclude '.*' \
  --exclude 'node_modules/*' \
  --exclude 'dist/*' \
  --exclude 'src/*' \
  --exclude '*.sh' \
  --exclude '*.config.js' \
  --exclude 'package*.json' \
  --exclude 'screenshots/*' \
  --exclude '_site/*' \
  --exclude 'updates.json' \
  --exclude 'index.html' \
  --exclude 'web-ext-artifacts/*'

rm -rf dist/ida-bot
unzip dist/ida-bot.zip -d dist/ida-bot
