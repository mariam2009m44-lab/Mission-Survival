import test from "node:test";
import assert from "node:assert/strict";
import {createMission,startMission,choose,nextDay,summary} from "../src/engine.js";
import {DAYS,SOURCES,MODULES} from "../src/data.js";
test("three mission days contain five sequential decision stages",()=>{const m=startMission(createMission());assert.equal(new Set(DAYS.map(d=>d.dayNumber)).size,3);assert.equal(DAYS.length,5);assert.deepEqual(Object.keys(m.resources).sort(),["food","oxygen","power","shield","water"]);assert.deepEqual(DAYS.map(d=>d.id),["launch","isru","solar-safety","water-recovery","food-strategy"]);assert.ok(DAYS.every(d=>d.choices.length===2));});
test("difficulty modes have different starting reserves",()=>{assert.ok(createMission("training").resources.oxygen>createMission("standard").resources.oxygen);assert.ok(createMission("standard").resources.oxygen>createMission("expert").resources.oxygen);});
test("a choice applies declared changes and moves to debrief",()=>{const m=startMission(createMission());m.site="malapert";m.siteName="Malapert Massif";const before={...m.resources};const r=choose(m,0);assert.equal(r.day,1);assert.equal(m.phase,"debrief");assert.equal(m.resources.power,before.power+30);assert.equal(m.resources.oxygen,before.oxygen);});
test("a second choice is blocked until the next day",()=>{const m=startMission(createMission());m.site="malapert";choose(m,0);const after={...m.resources};assert.equal(choose(m,1),null);assert.deepEqual(m.resources,after);});
test("a complete run generates a five-decision report",()=>{const m=startMission(createMission());m.site="malapert";m.siteName="Malapert Massif";for(let d=0;d<DAYS.length;d++){assert.ok(choose(m,0));if(d<DAYS.length-1)assert.equal(nextDay(m),true);}assert.equal(m.phase,"complete");assert.equal(m.result,"success");assert.equal(summary(m).decisions,5);assert.equal(summary(m).xp,350);});
test("critical resource failure interrupts the mission",()=>{const m=startMission(createMission("expert"));m.site="malapert";m.resources.oxygen=0;choose(m,0);assert.equal(m.phase,"complete");assert.equal(m.result,"interrupted");});
test("all game resources remain between zero and one hundred",()=>{const m=startMission(createMission("training"));m.site="malapert";m.resources.power=98;choose(m,0);for(const v of Object.values(m.resources))assert.ok(v>=0&&v<=100);});
test("illumination source is explicitly a model",()=>{const x=SOURCES.find(v=>v.id==="illumination");assert.match(x.limit,/model/i);assert.match(x.date,/2022/);});
test("CRaTER coverage is correctly dated and qualified",()=>{const x=SOURCES.find(v=>v.id==="crater");assert.match(x.date,/30 Jun 2026/);assert.match(x.limit,/not direct readings/i);});
test("Diviner coverage is the verified 2026 interval",()=>{const x=SOURCES.find(v=>v.id==="diviner");assert.match(x.date,/16 Mar–15 Jun 2026/);});
test("the CRaTER primary file exposes verified detector-energy fields",()=>{const x=SOURCES.find(v=>v.id==="crater");assert.match(x.fields,/ENERGY.*keV/);assert.match(x.fields,/AMPL.*ADU/);});

test("each training module has a three-choice knowledge check",()=>{assert.equal(MODULES.length,4);for(const module of MODULES){assert.equal(module.options.length,3);assert.equal(module.arOptions.length,3);assert.ok(module.answer>=0&&module.answer<3);assert.ok(module.question&&module.explain);}});

test("sustainable commander badge requires all three sustainability actions",()=>{const m=startMission(createMission("training"));m.site="malapert";for(let i=0;i<DAYS.length;i++){const idx=DAYS[i].choices.findIndex(c=>c.id==="isru"||c.id==="water-recovery"||c.id==="greenhouse");choose(m,idx<0?0:idx);if(i<DAYS.length-1)nextDay(m);}assert.ok(summary(m).badges.some(b=>b.id==="sustainable-commander"));});

test("launch payload cannot be selected before a landing region",()=>{const m=startMission(createMission());assert.equal(choose(m,0),null);m.site="nobile";assert.ok(choose(m,0));});
test("final report preserves the selected candidate landing region",()=>{const m=startMission(createMission());m.site="malapert";m.siteName="Malapert Massif";for(let i=0;i<DAYS.length;i++){choose(m,0);if(i<DAYS.length-1)nextDay(m);}assert.equal(summary(m).siteName,"Malapert Massif");});
