# data-viz-portfolio

Single source of truth for Thomas Colin's interactive data visualizations, exhibited at
[**thomasc91.github.io**](https://thomasc91.github.io).

Every visualization lives self-contained under `projects/<slug>/`. The site is driven by
**one registry** — `projects/manifest.json` — which builds the gallery and every project page.
Add a viz: drop a folder in `projects/`, add one object to the manifest, and it appears everywhere.

## Structure

```
index.html          → gallery, rendered from the manifest
project.html        → uniform per-project page (?slug=<slug>)
projects/
  manifest.json     → THE single source of truth
  bond-vehicles/    scrollytelling force layout
  hinge-swipes/     animated bubble timeline
  nic-cage/         donut + eye-tracking
  tom-cruise/       donut + eye-tracking
  chart-library/    bar / line / multi-line / beeswarm / network reference
  got-books/        per-book GoT network data + pages
  lab/              experimental work (Three.js, flametree, …)
assets/             shared shell (portfolio.css, portfolio.js)
archive/            previous site files for reference
```

## Stack

Static HTML/CSS/JS. No build step. D3 v3–v7. Deploys to GitHub Pages from `master`.
Three.js / R3F experiments land in `projects/lab/`.

## Run locally

```
python3 -m http.server 8000
# open http://localhost:8000
```

(For historical data-vis viz work and approaches see the gallery.)
