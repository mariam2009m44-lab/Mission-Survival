# Research dossier — LUNAR OUTPOST
Verification date: 13 November 2026.

## 1. Exact challenge
Build a Junior Astronaut Mission Trainer asks for an interactive game or app that lets students run a lunar or Martian outpost and experience trade-offs involving life support, radiation shielding, power and food production.
Official challenge: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

## 2. What the 2026 illumination date means
NASA SVS product: Illumination at the Moon's South Pole, 2023 to 2030.
- 2026 model sequence.
- Region within 2 degrees of the lunar South Pole.
- Two-hour time steps and 4,381 frames for 2026.
- Uses Lunar Reconnaissance Orbiter LOLA terrain mapping.
- Product: https://svs.gsfc.nasa.gov/4930/
- Source released 5 October 2022.
This is a model for the year 2026, not observations newly collected during 2026.

## 3. Actual 2026 lunar-orbit datasets

### CRaTER
NASA PDS Release 67, announced 15 September 2026, includes LRO-L-CRAT-3-CDR-CALIBRATED-V1.0 with data acquired through 30 June 2026.
Product announcement: https://pds.nasa.gov/datasearch/subscription-service/SS-20260915.shtml
Release-specific record: https://pds.nasa.gov/datasearch/subscription-service/data_product_information.cfm?dsid=LRO-L-CRAT-3-CDR-CALIBRATED-V1.0&releaseid=0067
The 31 March 2026 example primary-science file has 2,310,946 records and a listed size of 257.86 MB:
https://search-pdsppi.igpp.ucla.edu/search/view/?f=no&id=pds%3A%2F%2FPPI%2FLRO-L-CRAT-3-CDR-CALIBRATED-V1.0%2FDATA%2F2026%2F2026090%2FCRAT_L1_PRI_2026090_V01&o=1
The PDS label/format files identify primary-science fields including spacecraft time, detector amplitudes (D1–D6, ADU) and deposited energy in the six detectors (keV). The 31 March sample file contains 2,310,946 event records. CRaTER measures the lunar-orbit radiation environment behind detector materials, including tissue-equivalent plastic. It does not measure dose inside a future lunar habitat.

### Diviner
NASA PDS Release 67 includes LRO-L-DLRE-4-RDR-V1.0 calibrated radiance products acquired from 16 March through 15 June 2026:
https://pds.nasa.gov/datasearch/subscription-service/data_product_information.cfm?dsid=LRO-L-DLRE-4-RDR-V1.0&releaseid=0067
Diviner measures thermal emission from the lunar surface. Surface observations are not habitat interior temperatures.

### LRO instruments
NASA instrument overview: https://science.nasa.gov/mission/lro/spacecraft-and-instruments/

## 4. DONKI space-weather source
DONKI records event analyses and notifications, including flares, CMEs and solar energetic particle events.
- Web: https://ccmc.gsfc.nasa.gov/DONKI/
- Current API base: https://ccmc.gsfc.nasa.gov/DONKI-API/get/
- Migration announcement effective 30 September 2026: https://ccmc.gsfc.nasa.gov/news/major-updates/
- API overview and limitations: https://ccmc.gsfc.nasa.gov/tools/DONKI/
DONKI describes its real-time research information and simulations as prototyping/research context. It is not a lunar-surface radiation forecast. The app's optional feed does not modify game protection values.

## 5. Partner learning resources
Canadian Space Agency Food Production Toolkit:
https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
Space Farmer mini-greenhouse activity:
https://www.asc-csa.gc.ca/eng/youth-educators/activities/mini-greenhouse-experiment.asp
These are educational activities, not measured lunar greenhouse yields.

## 6. Winner research — learn from patterns, do not copy
NASA's 2025 global winners announcement:
https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/

- SpaceGenes+ — Best Use of Science: interactive dashboard exploring how radiation and microgravity relate to astronaut health at the molecular level. Lesson: make evidence explorable and useful.
- PureFlow — Best Mission Concept: interactive systems-engineering platform for designing and validating space habitats, including 3D models and tests against space-weather threats. Lesson: connect habitat systems and show decision trade-offs.
- Zumorroda-X — Art & Technology, Egypt: mini-games that teach how farmers adapt to heat waves, flooding and other environmental challenges. Lesson: playful learning and storytelling make data accessible.
- HerCode Space — Best Storytelling: combined NASA data, heliophysics concepts, illustrations and a story to teach children about space weather. Lesson: make science memorable without losing accuracy.
- Resonant Exoplanets — Best Use of Data: AI-assisted workflow to ingest telescope and satellite data and automate analysis. Lesson: show the data workflow and its outcome.
- QUEÑARIS — Local Impact: combined NASA satellite data, drones and AI to address a water and reforestation challenge. Lesson: make intended impact concrete.

The 2026 event is scheduled for 14–15 November. As of 13 November 2026, 2026 global winners have not yet been announced; NASA's timeline places them in January 2027. The 2025 examples are the latest completed winners, not 2026 winners.

## 7. Product decisions
1. Show source, dates, measurement type and limitations.
2. Label every resource meter as a simulation unit, not a real measurement.
3. Label the 2026 illumination sequence as a model.
4. Label CRaTER and Diviner as orbital observations, not habitat sensors.
5. Treat DONKI as optional context only.
6. Connect power, oxygen, shelter, water and food across three mission days.
7. Build as an installable PWA and provide a Capacitor Android packaging path.

## 8. NASA–IBM lunar AI model (announced 10 September 2026)
NASA announced the open-source NASA-IBM Lunar Foundation Model, trained primarily on Lunar Reconnaissance Orbiter data. NASA describes approximately two million image tiles in the training collection: more than one million high-resolution camera images at 1 m resolution and nearly 964,000 multispectral images at 100 m resolution. Additional lunar imagery and terrain data include GRAIL, Lunar Prospector and JAXA SELENE.

Potential downstream tasks include crater mapping, irregular mare patch segmentation and lunar polar ice prospectivity. The model is a geospatial/image foundation model, **not a public conversational chatbot** and not a direct ice sensor. Model predictions require scientific interpretation and validation.

- NASA announcement: https://science.nasa.gov/science-research/artificial-intelligence-lunar-foundation-model/
- Public model collection: https://huggingface.co/collections/nasa-ibm-ai4science/nasa-ibm-lunar-fm-and-downstream-models
- Open-source code: https://github.com/NASA-IMPACT/NASA-IBM-Lunar-Foundation-Model

## 9. NASA-GPT availability boundary
NASA Ames describes NASA-GPT as an internally hosted, non-cloud chatbot/search tool for NASA technical reports and repositories. Its published description says the team hoped to make it available to NASA-badged users; it does not establish a public chatbot for general use. Source: https://nas.nasa.gov/SC24/research/project09.php

NOVA in this project is therefore a separate, local, source-grounded educational assistant. It is not NASA-GPT, not made or endorsed by NASA, and does not call a generative AI service. It matches questions against a curated bilingual knowledge library and returns the relevant official sources. It deliberately declines to invent answers outside that library.

## 10. LRO LROC Release 68B — 13 November 2026 data watch
The LRO PDS Geosciences Node release schedule lists LROC Release 68B with a public-release date of 13 November 2026 and a nominal image acquisition window of 16 July–15 August 2026. This is a scheduled camera-data release. The schedule alone does not prove that every product is already available at the time of checking; verify actual products in the archive. It is not a new CRaTER or Diviner release.

Source and schedule: https://pds-geosciences.wustl.edu/missions/lro/
