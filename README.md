# sunhacks website

Static site for [sunhacks.io](https://sunhacks.io). The site presents sunhacks 9.0 on November 14–15, 2026 at Student Pavilion, ASU Tempe Campus, with this year's camp theme, weekend schedule, sponsors, and community partners.

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
- `assets/images/sponsors/`: supplied 2026 sponsor logos and [source notes](assets/images/sponsors/README.md).
- `assets/images/partners/`: official ASU club logos and [source notes](assets/images/partners/README.md).
- `assets/images/team/`: team headshots and [source notes](assets/images/team/README.md). Names and event roles are in the `#team` section of `index.html`.
- `assets/meta-image.jpg`: the themed 1200 × 630 social preview.

Keep unannounced details marked as coming soon until the organizing team confirms them. The page and FAQ work without JavaScript or third-party CSS/icon libraries.

## Schedule and sponsors

The schedule is a static, abridged version of the [9.0 Run of Show](https://docs.google.com/spreadsheets/d/1YhSFn9QvkA8NSAmDWaHfWBWsC4fYGCnS14UoLwR9lhU/edit?gid=0#gid=0), reviewed November 12, 2026. Edit the two `.agenda` lists in `index.html` when event times change; there is no live spreadsheet dependency. Times are local to ASU Tempe (Arizona/MST, UTC−07:00).

Only attendee-facing highlights are included. Internal setup, deliveries, staffing, and cleanup are omitted. Saturday's opening ceremony is 11:15 AM, confirmed by the organizer (the source originally said PM). Workshop and activity details are intentionally omitted. The schedule links to `https://links.sunhacks.io/livesite`, where the Notion livesite will provide exact workshop schedules and event updates. The sheet's `Public Summary` tab had a `#REF!` error, so the source is the `Run of Show` tab.

Sponsor sizing is controlled by `.sponsor-lead` (JFFVentures), `.sponsor-major` (Amazon Tempe Town Lake Campus), `.sponsor-featured` (TinyFish and General Dynamics), and `.sponsor-supporting` (the remaining ten sponsors). Partners are a separate list beneath the sponsor cloud.

## Verification

Check desktop and narrow mobile layouts, keyboard navigation and FAQ toggles, local image loads, and the Discord/contact links. Respect reduced-motion settings and keep visible focus indicators when updating styles.
