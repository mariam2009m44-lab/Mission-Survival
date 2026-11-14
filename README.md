# TECNOVA — Lunar Outpost Space Adventure

An installable, mobile-first mission trainer for NASA Space Apps 2026 challenge **Build a Junior Astronaut Mission Trainer**.

The app teaches young learners to command a lunar South Pole training outpost, understand connected life-support systems, and make five days of resource decisions. Its science library separates modeled illumination, lunar-orbit instrument measurements, space-weather event records and partner-agency learning resources.

## TECNOVA experience
- Cinematic first-launch planetarium with animated 3D planets, Saturn rings, Earth, lunar surface, stars and a floating astronaut illustration.
- Browser-based 3D experience with a first-person astronaut view for phones and computers, plus an optional WebXR immersive-VR entry point for compatible headsets and secure browsers. Headset support is detected at runtime; unsupported devices retain the normal 3D experience.
- In headset mode, tracked headset pose drives the camera and controller selection supports simple point-to-move exploration; keyboard/touch and first-person camera remain available as fallbacks.
- Child-friendly station guidance explains how to follow glowing signs, approach a station and interact with NOVA.
- Responsive child-friendly welcome screen with Arabic/English controls and a skip-intro option.
- Interactive Three.js lunar outpost with a walkable astronaut, NOVA robot, habitat, rover, solar farm, greenhouse and oxygen lab.

## VR and accessibility notes

WebXR immersive VR is optional and depends on the headset, browser, permissions and secure-context support. The app does not claim that every phone or browser can launch headset VR. The first-person browser mode is separate from headset VR and works as a non-headset fallback. The lunar world remains a conceptual educational environment, not a flight simulator.

## Rebuild highlights
- Modular ES modules for mission data, simulation, persistence and UI.
- Mobile-first app shell, desktop navigation and touch-friendly mobile navigation.
- First-run junior commander profile with four custom astronaut avatars (local demo profile, not online authentication).
- Five-day campaign with five linked decision stages, three NASA-studied candidate landing-region scenarios, comic interludes, five resource meters, an optional station-task checklist and achievement badges.
- Interactive Three.js lunar outpost scene with orbit/zoom controls and focus points for the habitat, solar farm, rover and lander.
- Lightweight visual fallback if the 3D renderer cannot load; the Three.js module is cached after first successful load for offline use.
- English-first interface for global judging, with a one-tap Arabic language mode.
- Four science-training modules and three NASA-studied candidate landing-region scenarios.
- Five-day simulation with five sequential decisions, guided/standard/expert difficulty, comic story beats, a live task bar and hidden sustainability badge.
- In-mission fieldwork guide listing all five walkable stations, showing discovery progress, and explaining how optional NOVA challenges award bonus XP and adjust illustrative game reserves.
- Science library with source dates, data coverage and limitations, plus mission-day evidence cards that connect each decision to an official reference.
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
| NASA OSDR | Searchable space-biology and astronaut-health research metadata and study files | Research datasets, not live astronaut-health telemetry or individual diagnosis |\n| NASA RadLab | Instrument radiation records including dose-rate fields and instrument/time context | Many records are from ISS instruments, not direct lunar surface-habitat readings |\n| NASA ISS ECLSS | Water recovery and filtration learning reference; reported up to 98% total recovery on ISS in 2023 | ISS result, not a proven lunar-base recovery rate; game values remain illustrative |

A sample CRaTER product linked in the app is a 31 March 2026 primary-science file with 2,310,946 records and a listed size of 257.86 MB. The primary file schema includes spacecraft time, detector amplitudes (ADU) and deposited energy (keV) across detectors D1–D6. The app links to the archive record rather than bundling the large raw data file.

See [the complete scientific and technical audit](docs/COMPLETE-AUDIT.md), docs/RESEARCH.md and data/mission-science.json for provenance. The Science Lab classifies each evidence item A–E and distinguishes the live DONKI feed from archived datasets, research references and simulated game values. The OSDR and RadLab public API documentation is linked from the Science Lab and NOVA knowledge cards.

## Cloud backend

A Cloudflare Worker + D1 backend foundation is included in `backend/`. It supports signed anonymous guest sessions and server-side progress storage while preserving local/offline play. The server intentionally avoids collecting names, emails, birth dates, location, or chat messages. Guest sessions are device-specific and are not cross-device accounts.

The backend is not live until a Cloudflare D1 database and Worker are deployed and `API_BASE_URL` in `src/backend-config.js` is set. Follow [docs/BACKEND.md](docs/BACKEND.md) for setup. Until then, the app correctly remains in local-save mode.

## Mobile game feel and accessibility

- Original procedural ambient space soundtrack generated locally with the Web Audio API, plus independently controlled synthesized interface sound effects. Audio starts after a user gesture and can be muted separately; no copyrighted tracks or external audio downloads are used.
- Brief success feedback and optional light haptics on supported devices, with reduced-motion support.
- Mobile safe-area spacing, touch-friendly controls and flexible screen orientation.

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
The floating NOVA assistant is a bilingual, source-grounded educational retrieval interface. It matches questions to a small curated knowledge library and attaches official source links. It does not call a hosted generative model, does not claim to be NASA-GPT, and explicitly identifies itself as a project feature rather than an official NASA service. The NOVA panel also offers a clearly labeled external hand-off to Google Gemini at gemini.google.com; Gemini opens separately and is not embedded in NOVA. An in-app Gemini API connection would require a deployed secure server-side proxy and a private API key.

NASA-GPT is described by NASA Ames as an internally hosted tool for NASA staff. Separately, NASA and IBM announced a public open-source Lunar Foundation Model on 10 September 2026. That model is for lunar imagery/geospatial analysis (e.g. crater mapping and polar-ice prospectivity), not conversational chat. See the NASA research announcement and model/code links in the Science Lab.

As of 13 November 2026, the LRO PDS release schedule lists LROC Release 68B for public release on that date, with a nominal acquisition window of 16 July–15 August 2026. This is a scheduled camera-data release; actual product availability should be checked in the archive.
