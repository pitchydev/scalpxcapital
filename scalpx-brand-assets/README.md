# SCALPX — Brand Assets

Drop-in assets for the SCALPX website. The wordmark is a neutral **SCALP** with the accent
carried entirely by the **X**.

## Colors
| Token            | Hex       | Use                                   |
|------------------|-----------|---------------------------------------|
| Mint (accent)    | `#5EFF95` | The X, highlights, CTAs, focus rings  |
| Ink (surface)    | `#060807` | Primary near-black background         |
| Graphite         | `#0A0A0A` | Panels / dark logo on light bg        |
| White            | `#FFFFFF` | Text + mono logo on dark              |

> Note: SCALPX mint (`#5EFF95`) is intentionally distinct from FlowX's accent (`#3DFF8B`).

## Files

### /logo  — full wordmark (viewBox 130×19, SVG scales to any size)
- `scalpx-logo-primary.svg` / `.png` — white SCALP + mint X. **Use on dark backgrounds.**
- `scalpx-logo-white.svg`   / `.png` — all white (monochrome on dark/photos).
- `scalpx-logo-black.svg`   / `.png` — all near-black. **Use on light backgrounds.**

### /mark — the X only (icon glyph)
- `scalpx-mark-mint.svg` / `.png`, `scalpx-mark-white.svg` / `.png`, `scalpx-mark-black.svg`

### /icon — app icon & favicons (mint X in a rounded dark tile)
- `scalpx-icon.svg`, `favicon.svg` — vector source
- `scalpx-icon-512.png`, `scalpx-icon-192.png` — PWA / web app manifest
- `apple-touch-icon-180.png` — iOS home screen
- `favicon-32.png`, `favicon-16.png` — browser tab

### /social
- `scalpx-og-1200x630.png` — Open Graph / Twitter card image.

### /banners (PNG @2x, ready for hero sections / social)
- `scalpx-hero-1600x460.png`            — gradient glow + logo
- `scalpx-hero-gradient-1600x460.png`   — centered, smooth green field
- `scalpx-hero-photo-1600x460.png`      — light-streak photo
- `scalpx-trading-desk-1600x460.png`    — candlestick chart
- `scalpx-network-1600x460.png`         — motion streaks, centered
- `scalpx-square-1080.png`              — gradient square (social)
- `scalpx-square-photo-1080.png`        — photo square (social)
- `scalpx-speed-square-1080.png`        — vivid green square (social)

## Web usage snippets

```html
<!-- Favicons -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png" />

<!-- Open Graph -->
<meta property="og:image" content="https://YOURDOMAIN/scalpx-og-1200x630.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

## Guidance
- Keep clear space around the wordmark ≥ the cap-height of the letters.
- Reserve the mint accent for the X (primary), CTAs, and key highlights — not body text.
- Use SVG wherever possible; PNGs are provided for tools that don't accept SVG.
- Don't recolor, stretch, rotate, or add effects to the wordmark.
