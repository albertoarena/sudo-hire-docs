# Art

`og-card.html` is the source of `public/og.png`, the image a shared link shows. After a change, render it again at 1200 by 630 pixels:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot="$PWD/public/og.png" "file://$PWD/art/og-card.html"
```
