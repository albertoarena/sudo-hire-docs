# Art

`og-card.html` is the source of `public/og.png`, the image a shared link shows. After a change, render it again at 1200 by 630 pixels:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot="$PWD/public/og.png" "file://$PWD/art/og-card.html"
```

`apple-touch-icon.svg` is the source of `public/apple-touch-icon.png`, the icon iOS shows. It fills the square: iOS rounds the corners and fills transparent pixels with black. After a change, render it again at 180 by 180 pixels:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=180,180 \
  --screenshot="$PWD/public/apple-touch-icon.png" "file://$PWD/art/apple-touch-icon.svg"
```

`public/favicon.svg` is its own source. It needs no render.
