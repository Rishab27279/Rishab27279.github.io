# Rishab K Pattnaik — portfolio

One static page. No frameworks, no build step, no dependencies.

```
index.html    the page, with the blueprint SVGs inlined
styles.css    three colours, two themes
script.js     theme toggle + mobile menu (~25 lines)
*_logo.png    org logos, 64px, each linked to the org's site
```

## Editing

Content is plain HTML — every entry is one `<li class="row">`. Copy a row, change
the `href`, name, description and year.

## Themes

Light and dark come from three CSS variables in `styles.css`:

```css
:root                  { --bg: #F7F2EA; --fg: #22262B; --accent: #C43B18; }
:root[data-theme=dark] { --bg: #1D2024; --fg: #F2EEE6; --accent: #F0836A; }
```

Everything else derives from those with `color-mix()`. Changing the accent
changes the whole page. The theme is stored in `localStorage` and defaults to
the OS setting; the inline script in `<head>` applies it before first paint so
there's no flash.

## The blueprint artwork

The line drawings are generated, not drawn — a Python script plots a wavelet
subband decomposition (the subject of two of the papers listed on the page).
They stroke in `currentColor`, so **one drawing works in both themes** rather
than needing a light and a dark copy.

The generator lives in `tools/art_gen.py` and is not served. To change the art:

```sh
python3 tools/art_gen.py          # writes tools/art/hero.svg and deco.svg
```

then paste the output over the matching `<svg>` block in `index.html`. Swapping
in your own hand-drawn SVG works too — give it `stroke="currentColor"` and
`fill="none"` and it will theme itself.

## Fonts

Instrument Serif (display), Inclusive Sans (body), JetBrains Mono (labels) —
all open licence, loaded from Google Fonts in one request.

## Running locally

```sh
python3 -m http.server 8000
```

## Notes

- `netlify/functions/chat.mjs` is the backend for the old chat widget. The
  widget isn't on the page any more; the file is kept in case it comes back.
- `.nojekyll` stops GitHub Pages running the files through Jekyll. Leave it.
