# TECNOVA — Complete Scientific, Technical & Gameplay Audit

**Audit date:** 14 November 2026  
**Repository:** https://github.com/mariam2009m44-lab/Mission-Survival  
**Audited baseline:** main, commit `cb9ccda2a303c1a69c96503aecc118c72e107667`  
**Scope:** all 66 tracked files in the repository tree at the audited baseline, with detailed source review of the application entry points, simulation, evidence catalog, 3D renderer, storage, backend, Android/PWA configuration, workflows and tests.  
**Status:** evidence-based code and documentation audit; not a physical-device certification or a flight-systems engineering review.

## Executive summary

TECNOVA is a real, installable web application with a Capacitor Android packaging workflow, a procedural Three.js lunar-outpost scene, a five-day educational decision campaign, local player profiles, an offline-first PWA shell, a bilingual curated NOVA assistant, and a Science Lab containing links to NASA and Canadian Space Agency references.

The repository is not yet an operational lunar-habitat simulator, a live NASA-data-driven mission model, a generative AI assistant, or a production Android release. Its own documentation mostly discloses these boundaries correctly. The largest remaining gap is the difference between the challenge's broad life-support/system-management ambition and the implemented five-meter, five-decision educational model.

## Evidence classification now used in the Science Lab

| Class | Meaning | TECNOVA examples | How to interpret |
|---|---|---|---|
| A | Live external data | NASA CCMC DONKI event lookup | Fetched on request when online; not a lunar habitat forecast and does not change mission values |
| B | Official measured datasets | LRO CRaTER and Diviner archive products; RadLab instrument records | Real instrument/archive data with their own platform, time and measurement context |
| C | Scientific research and reference material | CaRD, Artemis candidate-region information, NASA ECLSS, OSDR, NASA-IBM Lunar Foundation Model, NASA Moon Trek, CSA food resources | Evidence and educational references; not automatically consumed by game mechanics |
| D | Educational assumptions and approximations | Any simplified interpretation or scenario assumptions shown by the app | Must be described as a teaching approximation, not an engineering result |
| E | Simulated gameplay values | Oxygen, water, power, food and crew-protection meters | Invented game units used for learning; never NASA telemetry, medical readings or operational safety limits |

The Science Lab now displays the A–E key and each listed source card has a provenance class. E is a gameplay classification rather than an external source.

## File-by-file findings

| File / location | Finding | Severity | Root cause / current behavior | Recommended correction | Verification |
|---|---|---:|---|---|---|
| `src/engine.js` — `createMission`, `choose`, `nextDay` | Five-day mission currently advances through one player-selected decision per day. There is no automatic elapsed-time or daily baseline consumption tick. | High | Resource changes occur from declared decision/station deltas and threshold responses. | Add an explicit, deterministic, documented daily model only after defining units, crew assumptions and balance tests; preserve current scenario choices. | Unit tests for every day, every resource, deterministic replay and boundary values. |
| `src/data.js` — `RESOURCES`, `DIFFICULTIES`, `DAYS` | Five meters exist: oxygen, water, power, food and radiation protection. Temperature, communications, equipment condition, crew workload and mission time are not modeled as state variables. | High | The current scope is a compact educational challenge game, not a full habitat digital twin. | Introduce any extra systems as clearly labelled training indicators with explicit interactions and no medical/engineering claims. | State-schema tests, scenario coverage and report consistency tests. |
| `src/engine.js` — `choose`, `analyzeMission` | Decisions have immediate resource deltas and a chronological report, but no separate delayed-effect scheduler or explicit trade-off rubric. The headline score is an average of five final meters. | High | Score is a simple resource average; it does not yet measure scientific reasoning or explain why a choice was justified. | Add transparent dimensions (resource stewardship, evidence use, objective completion, reflection) without awarding points merely for selecting a predetermined option. | Test scoring with counterexamples and inspect the report for traceable reasons. |
| `src/main.js` — `askNova` | NOVA receives the question and language only; it is not passed the current mission state, recent choice or resource warning. | High | `answerNova(clean, s.language)` is a curated retrieval lookup. | Add a safe, read-only mission-context summary to the response layer; retain uncertainty and source links. | Tests that context changes the response and that unsupported science questions remain qualified. |
| `src/nova.js` — `KNOWLEDGE`, `answerNova` | NOVA is a local curated bilingual response library, not a live generative model. | Medium | Static reviewed entries and keyword matching are intentionally used for offline behavior. | Keep the disclosure visible; improve retrieval tests and explain when no reviewed answer is available. Do not label it as NASA AI. | Arabic/English, unsupported-query, source-link and offline tests. |
| `src/main.js` — `loadFeed` | DONKI FLR/CME/SEP records are the only external science feed fetched live in the application. | Medium | The code calls the official CCMC API for a six-day date range; partial event-type failures are tolerated if at least one request succeeds. | Show per-type retrieval status and a clear “partial results” state if some categories fail; retain the non-forecast disclaimer. | Mock fetch tests for all success, partial success, empty data and total failure. |
| `src/data.js`, `src/main.js`, `data/mission-science.json` | CRaTER, Diviner, OSDR and RadLab are source references and archive/API links; the game does not ingest these datasets into live resource meters. | High | The current implementation is reference-led, not a telemetry-to-game pipeline. | Keep the explicit classification and do not imply that the data powers game mechanics. Any future ingestion needs a reproducible transform and provenance. | Static checks for forbidden “live habitat reading” claims and a review of each network call. |
| `src/data.js` — Artemis source card and launch story | The three scenario names (Malapert Massif, Nobile Rim 1, de Gerlache Rim 2) are among NASA's nine refined candidate regions published in October 2024. | Low | The game samples three candidates for a child-friendly planning scenario. | Continue calling them candidate regions, not selected, approved or guaranteed-safe landing sites. | Compare names and wording with NASA's 28 Oct 2024 release. |
| `src/scene3d.js` — `makeScene` | The outpost is a procedural Three.js training scene, not a terrain model imported from LRO elevation/imagery or an engineering-accurate lunar environment. | Medium | Geometry, lighting, stations and characters are generated in code. | Label it conceptual; improve performance and controls without describing it as physically realistic. A geospatial terrain import would need its own licensed/source-verified asset pipeline. | Import checks, WebGL fallback checks and visual tests on real target devices. |
| `src/scene3d.js` — renderer and controls | Renderer has a low-power mobile profile, visibility pause, resize observation, touch/keyboard controls and a fallback when Three.js fails. | Medium | Source tests cover control structure; they do not establish that every handset has correct hitboxes, frame rate or camera behavior. | Run manual device matrix and record device/browser/viewport; add browser-level interaction tests where possible. | Real Android devices at narrow and standard widths; WebGL context loss and touch testing. |
| `src/storage.js`, `src/main.js` — profiles | Player profiles and progress are local-device data. A local PIN verifier is present, but it is not an online identity system. | High | Profiles are stored in browser localStorage; the Cloudflare API is disabled in public config. | Describe “profile lock on this device,” not account authentication. Consider export/restore and clear profile deletion UX. | Multi-profile, reload, storage-denied and profile-switch tests. |
| `src/backend-config.js`, `src/backend.js`, `backend/worker.js`, `backend/schema.sql` | Cloudflare Worker/D1 support is present in source, but `API_BASE_URL` is an empty string, so public app runs in local mode. | Medium | No deployed Worker endpoint is configured in the client. | Do not claim cloud sync is active. If deployed later, add abuse controls/rate limiting, operational monitoring and explicit privacy notice. | Worker unit/integration tests and a deployed health/state round-trip. |
| `backend/worker.js` — guest sessions | Signed anonymous session tokens, origin allow-list, payload limits and field filtering exist. | Medium | Anonymous guest IDs are not a user login; server state is a compact snapshot. No rate-limiting logic is visible in this Worker source. | Add edge rate limiting before public exposure and test token expiry, malformed payloads and concurrent writes. | Security review plus controlled API tests. |
| `src/profile-security.js` and `src/storage.js` | PIN-derived hash is stored with profile data in local storage. | Medium | PBKDF2-SHA256 with a per-profile salt is used, but local storage is not a secure vault against someone with device/browser access. | Explain the local-only protection boundary; avoid storing real secrets or health data. | Tests for invalid PINs, constant-time comparison behavior and storage access failure. |
| `service-worker.js`, `manifest.webmanifest`, `scripts/build.mjs` | PWA caches the application shell and vendored Three.js files; build copies assets/styles/data into Capacitor's web directory. | Medium | First successful install/cache is required; live DONKI needs internet. | Add automated offline smoke tests and ensure cache version changes with every shell change. | Service-worker install/activate/fetch tests and offline browser run. |
| `capacitor.config.json`, `.github/workflows/android.yml` | Android CI creates a debug APK after npm tests/build and Capacitor sync. | Medium | Workflow uses `assembleDebug`; no signed release configuration is provided. | Keep artifact labelled debug/test APK. Do not describe it as a store-ready production build. | Workflow success and artifact download; signed release requires a separate controlled process. |
| `tests/mobile-layout.test.js`, `tests/scene3d-controls.test.js` | Mobile/3D checks are mostly source/CSS assertions rather than actual viewport screenshots or device automation. | Medium | The test suite does not emulate a complete browser or physical Android device. | Add Playwright/browser smoke tests and a documented manual Android matrix. | Test at 320, 360, 390 and  Android tablet widths plus touch and back navigation. |
| `src/main.js` | Large UI module combines routing, markup, event delegation, profile flows, mission, Science Lab and NOVA. | Medium | A monolithic file increases regression risk and slows full review. | Refactor incrementally into view/controller modules after the competition-critical fixes; do not do a wholesale rewrite before submission. | Module-level tests and no behavior changes across the refactor. |
| `index.html`, `styles.css`, `styles/*.css` | CSS is split across base and several feature layers; cascade conflicts have occurred in the 3D controls. | Medium | Repeated overrides across shared styles can produce narrow-screen regressions. | Keep one authoritative final control layout and add visual regression tests. | Computed-style/browser tests and physical viewport review. |

## NASA and partner source verification

| Source | Official publisher | Type / date | Actual evidence | App use and boundary | Status |
|---|---|---|---|---|---|
| DONKI | NASA CCMC | A — live external event service; new official host effective 30 Sep 2026 | Near-real-time event analyses, model outputs and notifications for FLR/CME/SEP | App fetches event records on request; no prediction of lunar habitat dose and no game-value changes | Official endpoint and migration confirmed |
| LRO CRaTER | NASA PDS / LRO | B — Release 67, 15 Sep 2026; coverage through 30 Jun 2026 | Calibrated charged-particle energy/LET products measured in lunar orbit | Source link and example record only; not a habitat dosimeter | Release announcement confirmed |
| LRO Diviner | NASA PDS / LRO | B — Release 67; calibrated products covering 16 Mar–15 Jun 2026 | Lunar surface thermal-radiance observations from orbit | Source link only; not interior habitat temperature | Product listed in PDS Release 67 |
| LRO LOLA illumination | NASA Scientific Visualization Studio | C — model released 5 Oct 2022; 2026 sequence at two-hour steps | Simulated illumination/shadow using LRO LOLA terrain and ephemeris | Explains planning constraints; not live power telemetry | Official product page confirmed |
| NASA CaRD | NASA Johnson / NASA TechPort | C — prototype testing reported 13 Feb 2026 | Integrated ground prototype using concentrated solar energy and simulated lunar regolith; NASA report confirms carbon monoxide production during the integrated test | Explains ISRU research; not a working lunar oxygen plant or operational crew supply | Official NASA report confirmed |
| Artemis III candidate regions | NASA | C — refined list published 28 Oct 2024 | Nine candidate regions for further study, not approved landing sites | TECNOVA uses three names as fictional planning choices | Official NASA list confirmed |
| ECLSS water recovery | NASA | C — 20 Jun 2023 | ISS ECLSS demonstrated up to 98% total water recovery after Brine Processor Assembly | Reference only; no 98% rate is used in the game model | Official NASA milestone confirmed |
| OSDR | NASA Open Science Data Repository | C — public REST API and study metadata | Space-biology datasets, study metadata and downloadable files | Linked reference only; no live health data or diagnosis | Official NASA API page confirmed |
| RadLab | NASA OSDR | B/C — public instrument data API | Radiation instrument readings with timestamps, dose-rate, flux and spacecraft context | Linked reference only; many records are ISS; never a lunar-habitat reading | Official API documentation confirmed |
| NASA–IBM Lunar Foundation Model | NASA / IBM Research | C — announced 10 Sep 2026 | Open-source geospatial/image foundation model trained primarily on LRO data | Research link only; not NOVA's chatbot engine and not a direct ice sensor | Official NASA announcement confirmed |
| Canadian Space Agency food toolkit | Canadian Space Agency | C — educational reference | Food-production, astronaut nutrition and plant-learning resources | Teaching reference; no lunar crop yield is measured by TECNOVA | Official CSA page confirmed |
| CSA mini-greenhouse activity | Canadian Space Agency | C — classroom activity | Earth-based mini-greenhouse learning activity and reflection questions | Not a validated lunar greenhouse or yield model | Official CSA page confirmed |

## Gameplay model: implemented versus not implemented

**Implemented:** five days; five resource meters; three difficulty presets; two choices per core day; immediate declared resource deltas; threshold-triggered recovery choices; five optional station activities; one final mission report with resource balance and decision timeline; local persistence; badges and XP.

**Not implemented as an engineering model:** automatic per-hour/day resource consumption; oxygen generation/partial pressure; water mass balance or water-quality state; food mass/nutrition model; electrical power generation/storage/load curves; thermal control; communication link budget/outage duration; equipment reliability/maintenance; crew workload/fatigue; elapsed mission clock; radiation dose calculation or shielding transport; probabilistic delayed consequences. These must not be inferred from the current five meters.

**Scoring limitation:** the headline score is the average final value of five game meters. It is not a validated measure of astronaut safety, scientific reasoning or real mission success.

## Privacy, safety and product boundaries

- No heart-rate, blood-pressure or real player-health sensor integration was found in the audited UI/data flow. Resource bars represent game units only.
- Public client config leaves Cloudflare API disabled; profiles and history are local. The Worker code is a backend foundation, not proof of a deployed service.
- NOVA is curated retrieval, not a generative model or NASA service. Google Gemini is a separate external link, not an embedded API integration.
- WebXR is optional and device/browser dependent. No physical headset validation is claimed.
- The Android workflow produces a debug APK. It is not a signed Play Store release.
- Do not put real medical information, passwords or private personal data into the training app.

## Verification matrix

| Area | Automated verification available | Manual verification still required |
|---|---|---|
| Mission logic | Node unit tests for choices, resource bounds, five-day completion and reports | Balance and educational playthrough with a child/educator |
| Scientific provenance | Source metadata and claim-boundary tests | Re-check provider archives whenever a new release is claimed |
| NOVA | Curated response/source tests | Test diverse Arabic dialect questions and unsupported questions |
| Navigation/profile | UI source tests and local profile tests | Real browser keyboard, Android back button and multi-profile walkthrough |
| Mobile layout | CSS/source assertions | Physical Android screen sizes, touch targets, rotation and safe areas |
| Three.js | Module/source checks and control assertions | WebGL device performance, touch camera behavior, fallback and context loss |
| PWA/offline | Build and service-worker source tests | Install, airplane mode, cache update and offline relaunch |
| Backend | Worker validation tests | Deployed Worker/D1 integration, rate limiting and operational monitoring |
| Android | CI debug build | Install/run on physical Android device; release signing separately |

## Prioritized upgrade plan

1. **P0 — Preserve and verify:** keep every current feature; run all tests, build and deploy; download the debug APK only after the artifact exists.
2. **P0 — Evidence transparency:** A–E classification is now shown in the Science Lab and source cards. Keep E visible beside all gameplay meters.
3. **P1 — Mission model:** document all five resource assumptions; add deterministic daily consumption only with unit tests and explicit illustrative units.
4. **P1 — NOVA context:** pass only a compact read-only mission snapshot to curated responses; no invented science and no medical advice.
5. **P1 — Gameplay quality:** add delayed consequences and a transparent multi-dimension debrief score, preserving current choices and station tasks.
6. **P2 — Mobile QA:** browser automation and a real-device test matrix for touch controls, safe areas, navigation and 3D performance.
7. **P2 — Backend hardening:** only if Cloudflare is deliberately deployed; add rate limiting, monitoring and clear cloud-sync consent.
8. **P2 — Maintainability:** split the large UI module in small behavior-preserving changes after the urgent submission path is stable.

## Official source URLs

- DONKI: https://ccmc.gsfc.nasa.gov/DONKI/ and https://ccmc.gsfc.nasa.gov/tools/DONKI/
- DONKI migration: https://ccmc.gsfc.nasa.gov/news/major-updates/
- LRO instruments: https://science.nasa.gov/mission/lro/spacecraft-and-instruments/
- PDS Release 67: https://pds.nasa.gov/datasearch/subscription-service/SS-20260915.shtml
- NASA lunar illumination model: https://svs.gsfc.nasa.gov/4930/
- NASA CaRD: https://www.nasa.gov/centers-and-facilities/johnson/sunlight-extracts-oxygen-from-regolith-using-solar-chemistry/
- NASA Artemis III regions: https://www.nasa.gov/news-release/nasa-provides-update-on-artemis-iii-moon-landing-regions/
- NASA ECLSS: https://www.nasa.gov/missions/station/nasa-achieves-water-recovery-milestone-on-international-space-station/
- NASA OSDR API: https://www.nasa.gov/osdr-api/
- NASA RadLab API: https://visualization.osdr.nasa.gov/radlab/gui/data-api/
- NASA–IBM Lunar Foundation Model: https://science.nasa.gov/science-research/artificial-intelligence-lunar-foundation-model/
- Canadian Space Agency food toolkit: https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
- Canadian Space Agency mini-greenhouse: https://www.asc-csa.gc.ca/eng/youth-educators/activities/mini-greenhouse-experiment.asp


## Final landing-region decision upgrade — 14 Nov 2026

The landing-region selector is now a functional first mission decision. It uses three names from NASA's Artemis III candidate-region study list, but the game does **not** claim any candidate is approved, safe, or proven to contain accessible ice. Each selection applies a distinct fictional cargo-priority package to the five illustrative game reserves:

- **Malapert Massif — Solar-support package:** +12 power, −6 water.
- **Nobile Rim 1 — Polar-science package:** +10 water, −8 power. This is a water-logistics allocation, not evidence of water ice at the site.
- **de Gerlache Rim 2 — Balanced mobility package:** +5 power, +6 crew-protection reserve, −5 food.

These are game-only loadout trade-offs, not measured properties of the named regions. The player can change the package before making the Day 1 payload decision. Once a mission decision is recorded, the landing package is locked. The Day 1 payload choice then stacks with the chosen package and affects the five-day resource state. The final report records the selected region, its package, the package's resource deltas, and the adjusted starting baseline; the impact timeline displays the landing strategy before later decisions.

Automated coverage added for all three profiles, distinct resource effects, re-selection before lock, lock after the first decision, fresh-mission reset, baseline/report consistency, and the full UI path. These tests verify deterministic game logic and rendered markup; they do not replace a physical-device walkthrough or validate actual lunar landing feasibility.


## Resource-scenario decisions restored — 14 Nov 2026

The final oxygen and potable-water scenario questions now produce a meaningful mission-state decision even when the corresponding reserve is not yet below the low-alert threshold. Correctly selecting the approved training response applies the action's declared trade-off once per mission: oxygen reserve +14 game units and power −6, or water reserve +14 game units and power −7. Each action adds 20 Resource Management XP, is recorded in the mission impact timeline as a scenario event, and is explained by NOVA. Re-answering the same scenario cannot farm additional resources or points. The separate low-reserve response controls remain threshold-gated and continue to be available when a resource falls below 30%.

These are deterministic educational game effects, not claims that a quiz creates oxygen or water in a real spacecraft. The simulated response represents allocating a backup reserve / running a recovery loop and includes an explicit power cost. Wrong answers do not change resources; they provide feedback without applying the action. Automated tests cover normal-reserve activation, costs, one-use limits, report history, and invalid mission phases.
