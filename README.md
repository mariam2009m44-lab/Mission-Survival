# LUNAR OUTPOST: Mission Survival

A responsive, browser-based lunar outpost management simulation. Lead a three-day mission, make meaningful engineering decisions, and balance five essential habitat resources.

## Project structure

- `index.html` — page structure and metadata
- `styles.css` — responsive visual system and interface styling
- `app.js` — mission state, decisions, task tracking, rewards, and debrief
- `favicon.svg` — browser tab icon
- `manifest.webmanifest` — web app metadata
- `service-worker.js` — offline asset cache
- `.github/workflows/validate.yml` — automated project checks

## Gameplay

The commander leads a three-day lunar expedition:

1. **Power and oxygen:** choose between conserving energy, prioritizing oxygen generation, or running a balanced maintenance cycle.
2. **Solar storm:** protect the crew in a shielded shelter, reinforce it with water stores, or limit activities while monitoring the alert.
3. **Water and food:** activate water recovery and greenhouse support, ration supplies, or use stored emergency provisions.

Each choice changes the five resource reserves: oxygen, water, energy, food, and radiation shielding. There is no universally perfect option; players must manage trade-offs.

## Player experience

- A live command task bar tracks oxygen, power, crew protection, and water/food goals.
- Short illustrated-style crew comic panels introduce each daily challenge and connect the story.
- NOVA is a mission companion that provides scientific context and hints without selecting a decision for the player.
- Training, Standard, and Expert difficulty settings adjust starting reserves.
- A randomized side objective adds replay variety.
- Decisions award XP; completed missions, strong resource management, and hidden conditions unlock achievement badges.
- The final mission report shows the score, remaining reserves, achievement badges, strongest and weakest systems, and the decision log.
- Personal-best score, completed missions, and earned XP are stored locally in the player's browser.

## Technical notes

- Responsive desktop and mobile layout.
- Offline caching of core game files after the first successful online visit.
- No build step, package installation, API key, backend, or external runtime dependency.
- GitHub Actions checks JavaScript syntax, manifest validity, required assets, and key gameplay interface hooks.

## Offline support

When hosted on HTTPS (including GitHub Pages), the service worker caches the core game files after the first successful visit. The simulation can then reopen offline on that browser and device. The first visit still requires an internet connection; Google Fonts may not be available offline.

## Run locally

Download or clone the repository and open `index.html` in a modern browser. The Google Fonts connection is optional; the page has local system-font fallbacks.

## Publish with GitHub Pages

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. Wait for the deployment to finish. The expected site address is:

   https://mariam2009m44-lab.github.io/Mission-Survival/

## Educational note

This is a simplified learning simulation. Resource values and decision effects are illustrative game mechanics, not spacecraft engineering specifications or operational guidance.
