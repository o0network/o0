#!/usr/bin/env bash

CHROME_PATH=/Applications/Google\ Chrome.app
O0_PATH=/Applications/o0.app

mkdir -p $O0_PATH
ln -s "$CHROME_PATH" "$O0_PATH"
unlink "$CHROME_PATH/Contents/Info.plist"
unlink "$CHROME_PATH/Contents/Resources/app.icns"

cp "$CHROME_PATH/Contents/Info.plist" "$O0_PATH/Contents/Info.plist"
sed -i '' 's/Google Chrome/o0/g' "$O0_PATH/Contents/Info.plist"

cp ./app.icns "$O0_PATH/Contents/Resources/app.icns"
cp ./o0 "$O0_PATH/Contents/Resources/MacOS/o0"

plutil -insert CFBundleDarkSystemIconName -string "o0-dark" "$O0_PATH/Contents/Info.plist"
plutil -insert CFBundleLightSystemIconName -string "o0-light" "$O0_PATH/Contents/Info.plist"

# <key>CFBundleIconFile</key>
# <string>AppIcon</string>

mkdir o0.iconset/light o0.iconset/dark

for f in o0.iconset/*~light.png; do
    mv "$f" "o0.iconset/light/$(basename "$f" "~light.png").png"
done

for f in o0.iconset/*~dark.png; do
    mv "$f" "o0.iconset/dark/$(basename "$f" "~dark.png").png"
done

iconutil -c icns o0.iconset/light -o light.icns
iconutil -c icns o0.iconset/dark -o dark.icns
