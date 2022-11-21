#!/bin/sh
set -ex
# cleanup
rm -rf bundle
rm -rf build
# build bot
npm run build
# zip release version to be uploaded to chrome webstore
cd build
zip -r -FS bot.zip *
# cleanup
cd ..
cp -r build/ bundle
rm -rf build
