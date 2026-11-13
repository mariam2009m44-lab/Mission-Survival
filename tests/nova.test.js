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
