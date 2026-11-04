# Art

`og-card.html` is the source of `placeholder/og.png`, the image a shared link shows. The site uses a copy of it, `public/og.png`. After a change, render it again at 1200 by 630 pixels, then copy it to `public/og.png`:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot="$PWD/placeholder/og.png" "file://$PWD/art/og-card.html"
```

```
cp placeholder/og.png public/og.png
```
