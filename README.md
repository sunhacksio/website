# sunhacks website

Static site for [sunhacks.io](https://sunhacks.io). The `2026-dev` version announces the November 14–15, 2026 event at Student Pavilion, ASU Tempe Campus, with this year's camp theme.

## Local preview

No build step or package installation is required. From this directory, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. GitHub Pages can serve these files directly.

## Editing

- `index.html`: event information, links, native FAQ disclosures, and social metadata.
- `assets/coming-soon.css`: responsive styles, theme color variables, and font fallbacks.
- `assets/images/2026/`: optimized supplied artwork and [source notes](assets/images/2026/README.md).
- `assets/meta-image.jpg`: the themed 1200 × 630 social preview.

Keep unannounced details marked as coming soon until the organizing team confirms them. The page and FAQ work without JavaScript or third-party CSS/icon libraries.

## Verification

Check desktop and narrow mobile layouts, keyboard navigation and FAQ toggles, local image loads, and the Discord/contact links. Respect reduced-motion settings and keep visible focus indicators when updating styles.
