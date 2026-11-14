import test from "node:test";
import assert from "node:assert/strict";
import {answerNova,NOVA_PROMPTS} from "../src/nova.js";

test("NOVA answers lunar AI questions with official NASA and model links",()=>{
 const r=answerNova("What is the NASA IBM lunar foundation model?","en");
 assert.match(r.answer,/not a conversational chatbot/i);
 assert.ok(r.sources.some(x=>x[1].includes("science.nasa.gov")));
});
test("NOVA explains the 2026 NASA CaRD oxygen prototype accurately",()=>{
 const r=answerNova("How could oxygen be extracted from lunar soil?","en");
 assert.match(r.answer,/simulated lunar regolith/i);
 assert.match(r.answer,/not an operating plant on the Moon/i);
 assert.ok(r.sources.some(x=>x[1].includes("nasa.gov")));
});
test("NOVA recognizes Arabic lunar data questions",()=>{
 const r=answerNova("إيه أحدث بيانات القمر يوم 13 نوفمبر 2026؟","ar");
 assert.match(r.answer,/68B/);
 assert.ok(r.sources.length>0);
});
test("NOVA keeps CRaTER's orbital measurement limitation",()=>{
 const r=answerNova("Does CRaTER measure radiation on the lunar surface?","en");
 assert.match(r.answer,/not a direct radiation reading/i);
});
test("NOVA does not invent unsupported answers",()=>{
 const r=answerNova("Who won a fictional moon race on Neptune?","en");
 assert.match(r.answer,/won't invent an answer/i);
});

test("NOVA explains Moon basics in child-friendly Arabic and English with NASA sources",()=>{
 const en=answerNova("What is the Moon?","en");
 const ar=answerNova("إيه هو القمر؟","ar");
 assert.match(en.answer,/natural space companion/i);
 assert.match(ar.answer,/الجار الفضائي الطبيعي/);
 assert.ok(en.sources.some(x=>x[1].includes("spaceplace.nasa.gov")));
});
test("NOVA explains gravity, craters, water ice and breathable-air limits",()=>{
 assert.match(answerNova("Why is gravity weaker on the Moon?","en").answer,/one-sixth/i);
 assert.match(answerNova("Why are there craters on the Moon?","en").answer,/space rock hits/i);
 assert.match(answerNova("Is there water ice on the Moon?","en").answer,/permanently shadowed/i);
 assert.match(answerNova("Can people breathe on the Moon?","en").answer,/cannot breathe/i);
});
test("NOVA keeps bilingual suggested prompts kid-focused",()=>{
 assert.ok(NOVA_PROMPTS.some(p=>p.en==="What is the Moon?"));
 assert.ok(NOVA_PROMPTS.some(p=>p.en==="Can people breathe on the Moon?"));
});

test("NOVA prompt suggestions are bilingual",()=>{
 assert.equal(NOVA_PROMPTS.length,8);
 assert.ok(NOVA_PROMPTS.every(p=>p.en&&p.ar));
});

import {readFile} from "node:fs/promises";

test("offline service worker precaches NOVA and rotates the cache",async()=>{
 const sw=await readFile(new URL("../service-worker.js",import.meta.url),"utf8");
 assert.match(sw,/lunar-outpost-app-v60/); 
 assert.match(sw,/styles\/kids-comfort\.css/);
 assert.match(sw,/\.\/src\/nova\.js/);
 assert.match(sw,/\.\/src\/scene3d\.js/);
 assert.match(sw,/\.\/src\/mission-days\.js/);
 assert.match(sw,/\.\/vendor\/three\.module\.js/);
 assert.match(sw,/\.\/vendor\/three\.core\.js/);
 assert.match(sw,/assets\/stations\/habitat\.svg/);
 assert.match(sw,/astronaut-kids\.svg/);
 assert.match(sw,/cdn\.jsdelivr\.net/);
});
test("science manifest records the NASA-IBM model and LROC 68B schedule",async()=>{
 const raw=await readFile(new URL("../data/mission-science.json",import.meta.url),"utf8");
 const manifest=JSON.parse(raw);
 assert.ok(manifest.datasets.some(d=>d.id==="nasa-ibm-lunar-foundation-model"));
 assert.ok(manifest.datasets.some(d=>d.id==="lro-lroc-release-68b"&&d.scheduled_public_release_date==="2026-11-13"));
 assert.ok(manifest.datasets.some(d=>d.id==="nasa-iss-eclss-water-recovery"&&d.limitation.includes("not a lunar-base performance guarantee")));
});

test("commander onboarding and mission hub are available in the app shell",async()=>{const app=await readFile(new URL("../src/main.js",import.meta.url),"utf8");assert.match(app,/function onboarding\(\)/);assert.match(app,/function missionHub\(\)/);assert.match(app,/resourceSummary\(values\)/);assert.match(app,/NOVA COMIC/);});

test("3D scene reads the selected junior commander profile",async()=>{const scene=await readFile(new URL("../src/scene3d.js",import.meta.url),"utf8");assert.match(scene,/avatarPalette/);assert.match(scene,/lunar-outpost-trainer-v2/);});

test("3D exploration supports movement, nearby station interaction and NOVA event dispatch",async()=>{const scene=await readFile(new URL("../src/scene3d.js",import.meta.url),"utf8");const app=await readFile(new URL("../src/main.js",import.meta.url),"utf8");const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");assert.match(scene,/data-move/);assert.match(scene,/data-scene-interact/);assert.match(scene,/interactWhenArrived/);assert.match(scene,/autoWalkTarget=destination/);assert.match(scene,/lunar-station-interact/);assert.doesNotMatch(scene,/<div class="scene-interact" hidden>/);assert.match(scene,/ISRU Oxygen Lab/);assert.match(scene,/Greenhouse & Water/);assert.match(app,/app\.addEventListener\("lunar-station-interact"/);assert.match(app,/novaOpen=true/);assert.match(css,/\.lunar-3d-stage \.scene-interact\{\s*position:absolute!important;\s*z-index:8!important;\s*pointer-events:auto!important;/);assert.match(css,/\.lunar-3d-stage \.scene-interact button\{[\s\S]*?pointer-events:auto!important/);assert.match(css,/@media\(max-width:760px\)\{\s*\.lunar-3d-stage \.scene-interact\{[\s\S]*?right:auto!important;[\s\S]*?transform:none!important/);});

test("3D experience includes first-person mode and optional immersive WebXR",async()=>{
 const scene=await readFile(new URL("../src/scene3d.js",import.meta.url),"utf8");
 assert.match(scene,/renderer\.xr\.enabled=xrSupported/);
 assert.match(scene,/requestSession\("immersive-vr"/);
 assert.match(scene,/data-scene-vr/);
 assert.match(scene,/data-scene-first-person/);
 assert.match(scene,/renderer\.setAnimationLoop/);
 assert.match(scene,/Follow the glowing signs/);
 assert.match(scene,/Mission waypoint/);
 assert.match(scene,/data-scene-waypoint/);
 assert.match(scene,/data-scene-auto-walk/);
 assert.match(scene,/autoWalkTarget/);
 assert.match(scene,/low-power/);
 assert.match(scene,/new URL\("\.\.\/vendor\/three\.module\.js",import\.meta\.url\)/);
 assert.match(scene,/NEXT STOP ·/);
 assert.match(scene,/observeElementSize/);
 assert.match(scene,/visualViewport/);
 assert.match(scene,/if\(xrSupported\)for/);
 assert.match(scene,/renderer\.render\(scene,camera\)/);
 assert.match(scene,/renderer\.domElement\.style\.width=w\+"px"/);
});

test("TECNOVA visual theme is loaded and cached for offline use",async()=>{
 const css=await readFile(new URL("../styles/theme-polish.css",import.meta.url),"utf8");
 const worldCss=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
 const sw=await readFile(new URL("../service-worker.js",import.meta.url),"utf8");
 assert.match(html,/styles\/theme-polish\.css/);
 assert.match(sw,/styles\/theme-polish\.css/);
 assert.match(sw,/styles\/kids-world\.css/);
 assert.match(worldCss,/background:#070d18!important/);
 assert.match(css,/--cyan:#70dce2/);
 assert.match(css,/\.tecnova-panel/);
 assert.match(css,/\.mission-gateway/);
 assert.match(css,/prefers-reduced-motion/);
});


test("junior comfort layer is linked and cached for mobile and offline use",async()=>{
 const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
 const sw=await readFile(new URL("../service-worker.js",import.meta.url),"utf8");
 const css=await readFile(new URL("../styles/kids-comfort.css",import.meta.url),"utf8");
 assert.match(html,/styles\/kids-comfort\.css/);
 assert.match(sw,/styles\/kids-comfort\.css/);
 assert.match(css,/\.kid-quick-grid/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/env\(safe-area-inset-bottom\)/);
});


test("NOVA understands natural conversational rewording in English and Arabic",()=>{
 const en=answerNova("Can you tell me why the Moon has so many holes?","en");
 const ar=answerNova("إيه هو القمر؟","ar");
 assert.match(en.answer,/crater|bowl-shaped/i);
 assert.match(ar.answer,/الجار الفضائي الطبيعي/);
 assert.ok(en.sources.length>0);
});
test("NOVA responds safely to unsupported questions without pretending to be generative AI",()=>{
 const result=answerNova("Can you write a fantasy story about a robot on Mars?","en");
 assert.match(result.answer,/couldn't match that wording/i);
 assert.ok(result.sources.length>0);
});

test("TECNOVA includes a device-local profile portal, spacecraft selection and install help",async()=>{const app=await readFile(new URL("../src/main.js",import.meta.url),"utf8");const storage=await readFile(new URL("../src/storage.js",import.meta.url),"utf8");assert.match(app,/function accountGate\(\)/);assert.match(app,/function vehiclePicker\(\)/);assert.match(app,/data-action="choose-profile"/);assert.match(app,/data-action="new-journey"/);assert.match(app,/function installHelpOverlay\(\)/);assert.match(storage,/tecnova-local-profiles-v1/);});
test("NOVA launcher is available during intro, guide and profile setup",async()=>{
 const app=await readFile(new URL("../src/main.js",import.meta.url),"utf8");
 assert.match(app,/if\(!s\.introSeen\)\{app\.innerHTML=spaceIntro\(\)\+installHelpOverlay\(\)\+novaWidget\(\)/);
 assert.match(app,/if\(!s\.welcomeGuideDone\)\{app\.innerHTML=welcomeGuide\(\)\+installHelpOverlay\(\)\+novaWidget\(\)/);
 assert.match(app,/if\(s\.signedOut\)\{app\.innerHTML=accountGate\(\)\+installHelpOverlay\(\)\+novaWidget\(\)/);
  assert.match(app,/if\(!s\.commander\)\{app\.innerHTML=onboarding\(\)\+installHelpOverlay\(\)\+novaWidget\(\)/);
});

test("NOVA explains oxygen contingency safely without inventing operational instructions",()=>{
 const en=answerNova("What should a crew do if the oxygen supply is running low?","en");
 const ar=answerNova("إزاي نتعامل مع نقص الأكسجين؟","ar");
 assert.match(en.answer,/approved contingency checklist/i);
 assert.match(en.answer,/Never change cabin oxygen settings/i);
 assert.match(ar.answer,/قائمة الطوارئ الرسمية/);
 assert.ok(en.sources.some(x=>x[1].includes("nasa.gov")));
});
test("NOVA explains water recovery and distinguishes ISS results from lunar guarantees",()=>{
 const en=answerNova("How does water recycling work in space?","en");
 const ar=answerNova("إزاي نعيد تدوير المياه في الفضاء؟","ar");
 assert.match(en.answer,/98%/);
 assert.match(en.answer,/not a guarantee for a lunar base/i);
 assert.match(en.answer,/never drink untreated wastewater/i);
 assert.match(ar.answer,/مش ضمان لقاعدة على القمر/);
});

test("NOVA launcher exposes a valid expanded state without malformed HTML quotes",async()=>{
 const app=await readFile(new URL("../src/main.js",import.meta.url),"utf8");
 assert.ok(app.includes(`aria-expanded="'+String(novaOpen)+'"><img`));
 assert.ok(!app.includes(`aria-expanded="'+String(novaOpen)+'""><img`));
});


test("NOVA understands natural English and Egyptian Arabic descriptions of lunar craters",()=>{
 const en=answerNova("Why does the Moon have so many holes?","en");
 const ar=answerNova("ليه سطح القمر مليان حفر؟","ar");
 assert.match(en.answer,/bowl-shaped mark/i);
 assert.match(ar.answer,/الفوهة|فوهات/);
 assert.ok(en.sources.some(source=>source[1].includes("science.nasa.gov")));
 assert.ok(ar.sources.some(source=>source[1].includes("science.nasa.gov")));
});


test("NOVA explains NASA OSDR research API and its limits",()=>{
 const result=answerNova("What is the NASA OSDR API?","en");
 assert.match(result.answer,/public API/i);
 assert.match(result.answer,/not live health readings/i);
 assert.ok(result.sources.some(x=>x[1].includes("nasa.gov/osdr-api")));
});
test("NOVA explains RadLab dose-rate units and ISS-to-Moon limitation",()=>{
 const result=answerNova("What is the RadLab dose rate?","en");
 assert.match(result.answer,/µGy\/hour/);
 assert.match(result.answer,/not a direct radiation reading inside a lunar surface habitat/i);
 assert.ok(result.sources.some(x=>x[1].includes("radlab")));
});
test("NOVA links Google Gemini as a separate external chat, not an embedded API",async()=>{
 const app=await readFile(new URL("../src/main.js",import.meta.url),"utf8");
 assert.match(app,/https:\/\/gemini\.google\.com\/app/);
 assert.match(app,/Google Gemini opens separately/);
});
test("Science library lists OSDR and RadLab with explicit data limitations",async()=>{
 const data=await readFile(new URL("../src/data.js",import.meta.url),"utf8");
 const manifest=JSON.parse(await readFile(new URL("../data/mission-science.json",import.meta.url),"utf8"));
 assert.match(data,/id:"osdr"/);
 assert.match(data,/id:"radlab"/);
 assert.ok(manifest.datasets.some(x=>x.id==="nasa-osdr"&&x.limitation.includes("not live astronaut health telemetry")));
 assert.ok(manifest.datasets.some(x=>x.id==="nasa-radlab"&&x.limitation.includes("not direct radiation readings")));
});
