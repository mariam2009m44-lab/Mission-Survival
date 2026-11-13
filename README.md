# LUNAR OUTPOST — Junior Astronaut Mission Trainer

An installable, mobile-first mission trainer for NASA Space Apps 2026 challenge **Build a Junior Astronaut Mission Trainer**.

The app teaches young learners to command a lunar South Pole training outpost, understand connected life-support systems, and make three days of resource decisions. Its science library separates modeled illumination, lunar-orbit instrument measurements, space-weather event records and partner-agency learning resources.

## Rebuild highlights
- Modular ES modules for mission data, simulation, persistence and UI.
- Mobile-first app shell, desktop navigation and touch-friendly mobile navigation.
- Interactive Three.js lunar outpost scene with orbit/zoom controls and focus points for the habitat, solar farm, rover and lander.
- Lightweight visual fallback if the 3D renderer cannot load; the Three.js module is cached after first successful load for offline use.
- English and Arabic interface modes.
- Four science-training modules.
- Three-day simulation with guided, standard and expert difficulty.
- Science library with source dates, data coverage and limitations.
- Optional DONKI event lookup using NASA CCMC's migrated 2026 API.
- Local progress storage and offline caching.
- PWA manifest and Capacitor Android build path.

## Verified science
| Source | App use | Boundary |
|---|---|---|
| NASA SVS lunar illumination | 2026 modeled sunlight/shadow sequence, 4,381 frames at two-hour steps | Model for 2026 released in 2022, not new 2026 observations |
| LRO CRaTER PDS Release 67 | Calibrated lunar-orbit particle-energy data through 30 June 2026 | Orbital measurements, not direct surface-habitat readings |
| LRO Diviner PDS Release 67 | Calibrated thermal-radiance data, 16 March–15 June 2026 | Surface measurements, not interior habitat temperature |
| NASA CCMC DONKI | Optional recent event records | Research context, not lunar radiation forecasts |
| Canadian Space Agency | Food-production and mini-greenhouse learning activities | Educational material, not measured lunar crop yields |

A sample CRaTER product linked in the app is a 31 March 2026 primary-science file with 2,310,946 records and a listed size of 257.86 MB. The primary file schema includes spacecraft time, detector amplitudes (ADU) and deposited energy (keV) across detectors D1–D6. The app links to the archive record rather than bundling the large raw data file.

See docs/RESEARCH.md and data/mission-science.json for provenance.

## Install as an app

### Android APK
The Build Android APK GitHub Actions workflow can create a debug APK:
1. Open the repository Actions tab.
2. Choose Build Android APK.
3. Select Run workflow.
4. Download the lunar-outpost-debug-apk artifact after the run completes.

A debug APK is for testing. A Play Store release requires a properly signed release build.

### Installable web app
On HTTPS, open the site in a supported mobile browser and choose Install app or Add to Home screen. Core files are cached after the first successful visit. DONKI live events require internet access.

## Development
Requirements: Node.js 22 or later and npm.
- npm install
- npm test
- npm run build
- npx cap add android
- npm run android:sync
- npx cap open android

## Competition research
The 2026 hackathon takes place on 14–15 November 2026. As of 13 November, 2026 global winners have not been announced; NASA's published timeline places global winners in January 2027. The research therefore studies the 2025 winners as references, not projects to copy.

## AI disclosure
AI assistance was used to help draft and refactor code, interface text, tests and documentation. Scientific claims and data limitations are tied to the cited official sources. No NASA logo or mission insignia was generated or modified.

## NOVA lunar-science copilot
The floating NOVA assistant is a bilingual, source-grounded educational retrieval interface. It matches questions to a small curated knowledge library and attaches official source links. It does not call a hosted generative model, does not claim to be NASA-GPT, and explicitly identifies itself as a project feature rather than an official NASA service.

NASA-GPT is described by NASA Ames as an internally hosted tool for NASA staff. Separately, NASA and IBM announced a public open-source Lunar Foundation Model on 10 September 2026. That model is for lunar imagery/geospatial analysis (e.g. crater mapping and polar-ice prospectivity), not conversational chat. See the NASA research announcement and model/code links in the Science Lab.

As of 13 November 2026, the LRO PDS release schedule lists LROC Release 68B for public release on that date, with a nominal acquisition window of 16 July–15 August 2026. This is a scheduled camera-data release; actual product availability should be checked in the archive.
