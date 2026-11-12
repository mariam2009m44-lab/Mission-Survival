# LUNAR OUTPOST: Mission Survival

A responsive, browser-based lunar outpost management simulation. Lead a five-day mission, make engineering decisions, and balance five essential habitat resources.

## Project structure

```text
Mission-Survival/
├── index.html      # Page structure and metadata
├── styles.css      # Responsive visual system and interface styles
├── app.js          # Mission state, decisions, scoring, and debrief
├── favicon.svg     # Browser tab icon
├── README.md       # Project documentation
└── .nojekyll       # Keep GitHub Pages from applying Jekyll processing
```

## Features

- Five lunar mission days with distinct engineering scenarios.
- Five resources to manage: oxygen, water, energy, food, and radiation shielding.
- Three decision paths per day, with visible resource trade-offs.
- Training, Standard, and Expert starting difficulty settings.
- A randomly assigned side objective for each new mission.
- Live telemetry, operational-risk indicators, and resource reserve tracking.
- Final mission score, resource-by-resource debrief, decision log, and achievement badges.
- Locally saved personal-best score and completed-mission count (stored only in the player's browser).
- Responsive layout for desktop and mobile.
- No build step, package installation, API key, backend, or external runtime dependency.
- GitHub Actions checks JavaScript syntax and verifies that the required front-end assets are present.

## Project checks

A GitHub Actions workflow runs on pushes and pull requests. It checks the JavaScript syntax and confirms that the HTML references the required CSS, JavaScript, and favicon files. This automated check does not replace a full browser play-test.

## Run locally

Download or clone the repository, then open `index.html` in a modern browser. The Google Fonts connection is optional; the page has local system-font fallbacks.

## Publish with GitHub Pages

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. Wait for the deployment to finish. The expected site address is:

   https://mariam2009m44-lab.github.io/Mission-Survival/

## Educational note

This is a simplified learning simulation. Resource values and decision effects are illustrative game mechanics, not spacecraft engineering specifications or operational guidance.
