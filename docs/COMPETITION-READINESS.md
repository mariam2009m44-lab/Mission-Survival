# TECNOVA — NASA Space Apps 2026 Competition Readiness

Last reviewed: 14 November 2026  
Official selected challenge: **Build a Junior Astronaut Mission Trainer** (2026 Challenge 03)  
Official challenge page: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

## 1. Challenge fit

The official brief asks for an interactive game or app that lets students run a lunar or Martian outpost and experience trade-offs involving life support, radiation shielding, power and food production.

| Official requirement | TECNOVA implementation | Evidence in the product |
|---|---|---|
| Interactive game or app for students | Mobile-first installable app, browser 3D base, bilingual onboarding and child-friendly tasks | Android Capacitor build, PWA install path, guided tour |
| Run a lunar or Martian outpost | Lunar South Pole training outpost with candidate-region selection | Five-day mission campaign and landing-region selector |
| Balance life support | Oxygen and water reserves, resource alerts and recovery choices | Mission decisions, low-resource responses and final resource report |
| Radiation shielding | Crew-protection reserve and fictional solar-alert decision | Day 3 mission scenario, CRaTER source explanation |
| Power | Power reserve, solar station and trade-offs against oxygen/water/greenhouse choices | NASA South Pole illumination model and mission decision deltas |
| Food production | Food reserve, greenhouse trial versus stored food | Day 5 decision and Canadian Space Agency learning resources |
| Make success/failure depend on decisions | Five sequential decisions, resource thresholds, interrupted/success states and decision-impact timeline | Mission engine and final debrief |
| Keep learning engaging | 3D walkable stations, NOVA explanations, quick checks, badges and Arabic/English UI | Five station challenges, four training modules and progress report |

**Assessment:** strong direct alignment with the selected challenge. The strongest differentiator is the combination of an explorable outpost, a five-day resource-management campaign, and a report that shows how decisions changed connected reserves.

## 2. NASA and partner evidence — describe it precisely

The app includes a Science Lab and mission-linked source cards. It must not imply that every resource value is calculated from raw NASA telemetry.

- **NASA SVS lunar illumination:** the app presents NASA's 2026 modeled South Pole illumination sequence (4,381 frames at two-hour steps, based on LRO terrain). It is a model, not a new 2026 observation or a live power reading.
- **LRO CRaTER:** cited as lunar-orbit particle-energy measurements. These are not direct radiation readings inside a future surface habitat.
- **LRO Diviner:** cited as lunar-surface thermal-radiance observations from orbit, not interior habitat temperature.
- **NASA CaRD:** cited as ground-based prototype research using simulated lunar regolith, not an operating lunar oxygen plant.
- **NASA ISS ECLSS:** cited for a water-recovery technology milestone on the ISS, not a guaranteed lunar-base recovery rate.
- **NASA DONKI:** optional live space-weather event context. The feed does not forecast a lunar crew dose and does not alter game values.
- **Canadian Space Agency:** food-production and mini-greenhouse educational resources, not measured lunar crop yields.

The resource engine uses illustrative game units to teach trade-offs. These are not engineering limits, operational guidance, or telemetry. Keep this distinction in the demo and project description.

## 3. Product boundaries to disclose

- NOVA is a bilingual, curated, source-grounded retrieval assistant. It is **not** a generative chatbot, NASA-GPT, or an official NASA service.
- Explorer profiles and progress are saved locally on the device. Cloud accounts and cross-device sync are not enabled in the current public configuration.
- The optional WebXR entry point depends on a compatible headset, browser and secure context. The normal 3D experience is not the same as tested headset VR; no headset validation is claimed.
- The Android workflow produces a **debug APK** for testing, not a signed Play Store release.
- Automated validation passed 105 tests on commit e8e7c6c. The current changes must pass their own workflow before being described as validated. Automated tests do not replace testing on a physical Android device.

## 4. Final judging-strength checklist

Use the five common Space Apps judging dimensions as a preparation lens. Local-event instructions may add requirements, so follow the team's actual event page and the official project form.

| Dimension | What TECNOVA should demonstrate |
|---|---|
| Impact | A child can understand why a lunar outpost must balance scarce resources and crew safety |
| Creativity | 3D exploration plus a five-day decision campaign, station activities and NOVA |
| Validity | NASA/partner references are visible, dated and accompanied by limitations; simulation assumptions are explicit |
| Relevance | Show the exact four challenge systems: life support, radiation shielding, power and food production |
| Presentation | A short, English-first live walkthrough; open links; clear explanation of what is simulated and what comes from NASA |

## 5. Suggested live demo sequence

1. Open the public app in English and show the junior-astronaut profile and spacecraft selection.
2. Enter the lunar outpost and briefly walk to one interactive station.
3. Open the mission, select a NASA-studied candidate region and show the five-day campaign.
4. Make one decision that improves one reserve while consuming another.
5. Show the NASA source card attached to the decision and explain its limitation.
6. Complete the remaining stages or use a prepared, clearly labelled demonstration profile to show the final decision-impact report.
7. End on the Science Lab's challenge-alignment panel and public GitHub repository.

Avoid claiming that a simulation meter is a real sensor, that the selected candidate site is approved for landing, or that NOVA is a NASA AI.

## 6. Suggested 30-second demo narration

"TECNOVA is a junior astronaut mission trainer built for NASA Space Apps 2026 Challenge 03. Students manage a lunar South Pole outpost across five mission days, balancing oxygen, water, power, crew protection and food. They explore a 3D base, learn through five station challenges, and see how each decision changes the simulated reserves. NASA and Canadian Space Agency references are linked to the relevant lessons, with clear limits separating research data from game values. TECNOVA turns complex space-systems trade-offs into an accessible, bilingual learning experience."

## 7. Suggested seven-slide fallback

1. **Problem:** space STEM content often hides the trade-offs that determine mission success.
2. **Challenge:** Build a Junior Astronaut Mission Trainer — official Challenge 03.
3. **Solution:** TECNOVA, a bilingual junior-astronaut lunar outpost trainer.
4. **Experience:** 3D base, five stations, five-day campaign and NOVA.
5. **Science:** NASA illumination model, CRaTER, Diviner, CaRD, ISS ECLSS and CSA resources — with limits.
6. **Impact and validation:** child-friendly learning, decision-impact report, automated test results and honest product boundaries.
7. **Demo and access:** public app, public repository, APK debug-test artifact and team/contact details.

Confirm the current 2026 submission form's demo format and any local-event presentation rules before uploading. The seven-slide / 30-second format is a conservative presentation plan, not a claim that the 2026 form has been independently verified here.

## 8. AI and third-party material disclosure

Suggested project-page disclosure:

"AI assistance was used to support code drafting/refactoring, interface wording, tests and documentation. The project team reviewed and tested the implementation. Scientific claims are linked to NASA or space-agency sources and include stated limitations. NOVA uses a curated retrieval library and does not generate free-form answers. No NASA logo, insignia or mission identity was generated or modified."

List the licences and attributions for all third-party code, libraries, images, fonts, audio and datasets in the final submission. Check the repository's dependency and asset licences before submitting.

## 9. Official submission timing

The NASA Space Apps 2026 homepage states that project submission opens on Saturday, 14 November at 9:00 AM and closes on Sunday, 15 November at 11:59 PM local time. Submit through the Project tab on the team's official Space Apps page. Registration, selected local/virtual event, team membership and the chosen official challenge must be correct on that page.

Official event page: https://www.spaceappschallenge.org/2026/  
Official legal/material attribution terms: https://www.spaceappschallenge.org/legal/

This document is a product-readiness aid, not a substitute for the current official submission form or local-event instructions.
