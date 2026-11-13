import test from "node:test";
import assert from "node:assert/strict";
import {answerNova,NOVA_PROMPTS} from "../src/nova.js";

test("NOVA answers lunar AI questions with official NASA and model links",()=>{
 const r=answerNova("What is the NASA IBM lunar foundation model?","en");
 assert.match(r.answer,/not a conversational chatbot/i);
 assert.ok(r.sources.some(x=>x[1].includes("science.nasa.gov")));
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
test("NOVA prompt suggestions are bilingual",()=>{
 assert.equal(NOVA_PROMPTS.length,4);
 assert.ok(NOVA_PROMPTS.every(p=>p.en&&p.ar));
});

import {readFile} from "node:fs/promises";

test("offline service worker precaches NOVA and rotates the cache",async()=>{
 const sw=await readFile(new URL("../service-worker.js",import.meta.url),"utf8");
 assert.match(sw,/lunar-outpost-app-v4/);
 assert.match(sw,/\.\/src\/nova\.js/);
 assert.match(sw,/\.\/src\/scene3d\.js/);
 assert.match(sw,/cdn\.jsdelivr\.net/);
});
test("science manifest records the NASA-IBM model and LROC 68B schedule",async()=>{
 const raw=await readFile(new URL("../data/mission-science.json",import.meta.url),"utf8");
 const manifest=JSON.parse(raw);
 assert.ok(manifest.datasets.some(d=>d.id==="nasa-ibm-lunar-foundation-model"));
 assert.ok(manifest.datasets.some(d=>d.id==="lro-lroc-release-68b"&&d.scheduled_public_release_date==="2026-11-13"));
});
