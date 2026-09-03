# Toro TimeMaster 21200 — Maintenance PWA

An offline-capable progressive web app for tracking maintenance on a Toro
TimeMaster 21200 walk-behind mower (Briggs & Stratton 223cc, 30" cut).

Everything lives in `index.html` — no build step, no dependencies, no server.
State is kept in `localStorage` under the key `toro-v2`.

## Features

| Tab | What it does |
| --- | --- |
| **Dashboard** | Asset details, hour-meter reading, condition scores (deck / engine / transmission / ignition), service timeline |
| **Maintain** | Hour-based service schedule and the annual checklist, with overdue and due-soon alerts |
| **Parts** | Part numbers by category, each linked to a matching how-to video |
| **Diagnose** | Current issues and running notes |
| **Log** | Add service entries, oil changes, and part replacements to the timeline |
| **Shop** | Shopping list with per-part search links across six retailers |

Maintenance intervals follow the factory schedule: 5-hour break-in oil change,
then oil and air-filter service at 50 hours, spark plug and fastener checks at
100, air-filter replacement at 200.

## Running it

Service workers require a real origin, so open it over HTTP rather than as a
`file://` path:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

On iOS or Android, load that URL and use **Add to Home Screen** to install it
as a standalone app. Once loaded, the service worker caches all five files, so
it works with no network.

## Deploying

The repository root is the web root — publish it as-is. For GitHub Pages,
enable Pages on this branch with `/` as the source; no build is needed.

## Files

```
index.html          the entire app: markup, styles, data tables, and logic
manifest.json       PWA metadata (name, icons, theme colors, standalone display)
service-worker.js   cache-first offline shell
icons/              192px and 512px app icons
```

## Editing the data

The reference tables sit near the top of the `<script>` block in `index.html`:

- `PARTS` — part numbers, categories, and last-replaced dates
- `SCHED` — hour-based maintenance intervals
- `ANNUAL` — the yearly checklist
- `VIDEOS` — how-to video per part number
- `RETS` / `BEST` — retailers and the preferred retailer order per part
- `INIT` — the seed record used on first run, before anything is saved locally

Changing `INIT` only affects a fresh install. To pick up a new seed on a device
that has already saved state, clear the `toro-v2` key in `localStorage`.
