import test from "node:test";
import assert from "node:assert/strict";
import {createMission,startMission,choose,nextDay,summary,analyzeMission,completeStationTask,resourceAlerts,applyResourceResponse} from "../src/engine.js";
import {DAYS,SOURCES,MODULES} from "../src/data.js";
test("the challenge is implemented as five distinct mission days",()=>{const m=startMission(createMission());assert.equal(DAYS.length,5);assert.equal(new Set(DAYS.map(d=>d.dayNumber)).size,5);assert.deepEqual(DAYS.map(d=>d.dayNumber),[1,2,3,4,5]);assert.deepEqual(Object.keys(m.resources).sort(),["food","oxygen","power","shield","water"]);assert.deepEqual(DAYS.map(d=>d.id),["launch","isru","solar-safety","water-recovery","food-strategy"]);assert.ok(DAYS.every(d=>d.choices.length===2));assert.match(DAYS[3].title,/Day 4/);assert.match(DAYS[4].title,/Day 5/);});
test("difficulty modes have different starting reserves",()=>{assert.ok(createMission("training").resources.oxygen>createMission("standard").resources.oxygen);assert.ok(createMission("standard").resources.oxygen>createMission("expert").resources.oxygen);});
test("a choice applies declared changes and moves to debrief",()=>{const m=startMission(createMission());m.site="malapert";m.siteName="Malapert Massif";const before={...m.resources};const r=choose(m,0);assert.equal(r.day,1);assert.equal(m.phase,"debrief");assert.equal(m.resources.power,before.power+30);assert.equal(m.resources.oxygen,before.oxygen);});
test("a second choice is blocked until the next day",()=>{const m=startMission(createMission());m.site="malapert";choose(m,0);const after={...m.resources};assert.equal(choose(m,1),null);assert.deepEqual(m.resources,after);});
test("a complete run generates a five-day report with one decision per day",()=>{const m=startMission(createMission());m.site="malapert";m.siteName="Malapert Massif";for(let d=0;d<DAYS.length;d++){const record=choose(m,0);assert.ok(record);assert.equal(record.day,d+1);if(d<DAYS.length-1)assert.equal(nextDay(m),true);}assert.equal(m.phase,"complete");assert.equal(m.result,"success");assert.equal(summary(m).decisions,5);assert.equal(summary(m).history[4].day,5);assert.equal(summary(m).xp,350);});
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
test("station tasks reward learning and update only their declared resources once",()=>{const m=startMission(createMission("standard")),before={...m.resources};const result=completeStationTask(m,"oxygen");assert.equal(result.xp,25);assert.equal(m.xp,25);assert.equal(m.resources.oxygen,Math.min(100,before.oxygen+10));assert.equal(m.resources.power,before.power-8);assert.deepEqual(completeStationTask(m,"oxygen"),null);assert.equal(m.stationTasks.length,1);});
test("station tasks can be completed during the decision-review pause",()=>{const m=startMission(createMission("standard"));m.site="malapert";choose(m,1);assert.equal(m.phase,"debrief");const beforePower=m.resources.power;const result=completeStationTask(m,"solar");assert.ok(result);assert.equal(result.xp,25);assert.equal(m.xp,75);assert.equal(m.resources.power,Math.min(100,beforePower+12));assert.equal(completeStationTask(m,"solar"),null);});
test("station tasks reject unknown stations and missions that have not started or are complete",()=>{const m=createMission();assert.equal(completeStationTask(m,"oxygen"),null);startMission(m);m.phase="complete";assert.equal(completeStationTask(m,"solar"),null);m.phase="active";assert.equal(completeStationTask(m,"moon-base"),null);});
test("all five station tasks preserve resource bounds",()=>{const m=startMission(createMission("training"));for(const id of ["habitat","oxygen","solar","greenhouse","rover"])assert.ok(completeStationTask(m,id));for(const value of Object.values(m.resources))assert.ok(value>=0&&value<=100);assert.equal(m.xp,125);});

test("low resource alerts identify every shortage and rank the critical one first",()=>{const m=startMission(createMission("expert"));m.resources.oxygen=8;m.resources.power=22;m.resources.water=45;const alerts=resourceAlerts(m);assert.deepEqual(alerts.map(x=>x.id),["oxygen","power"]);assert.equal(alerts[0].severity,"critical");});
test("oxygen recovery choices apply disclosed trade-offs and cannot be repeated in one day",()=>{const m=startMission(createMission("standard"));m.resources.oxygen=12;const beforePower=m.resources.power;const r=applyResourceResponse(m,"oxygen","backup");assert.equal(m.resources.oxygen,26);assert.equal(m.resources.power,beforePower-6);assert.equal(r.delta.power,-6);assert.equal(resourceAlerts(m).find(x=>x.id==="oxygen").handled,true);assert.equal(applyResourceResponse(m,"oxygen","inspect"),null);});
test("water, power, food and shielding each have guided responses",()=>{for(const [resource,action] of [["water","recovery"],["power","conserve"],["food","reserve"],["shield","shelter"]]){const m=startMission(createMission("standard"));m.resources[resource]=10;const result=applyResourceResponse(m,resource,action);assert.ok(result);assert.ok(m.resources[resource]>10);}});
test("resource responses are unavailable for healthy systems and completed missions",()=>{const m=startMission(createMission("standard"));assert.equal(applyResourceResponse(m,"oxygen","backup"),null);m.resources.oxygen=5;m.phase="complete";assert.equal(applyResourceResponse(m,"oxygen","backup"),null);});
test("resource response action rejects unknown choices and invalid resources",()=>{const m=startMission(createMission("standard"));m.resources.oxygen=10;assert.equal(applyResourceResponse(m,"oxygen","invented"),null);assert.equal(applyResourceResponse(m,"unknown","backup"),null);});
test("a recovery action that exhausts another critical resource interrupts the mission",()=>{const m=startMission(createMission("expert"));m.resources.oxygen=10;m.resources.power=4;const result=applyResourceResponse(m,"oxygen","backup");assert.ok(result);assert.equal(m.resources.power,0);assert.equal(m.phase,"complete");assert.equal(m.result,"interrupted");});

test("station recovery that exhausts a critical reserve interrupts the mission",()=>{const m=startMission(createMission("expert"));m.resources.power=3;const result=completeStationTask(m,"oxygen");assert.ok(result);assert.equal(result.interrupted,true);assert.equal(m.resources.power,0);assert.equal(m.phase,"complete");assert.equal(m.result,"interrupted");assert.equal(m.xp,50);});

test("water shortage knowledge check is bilingual, includes the four-choice scenario and NASA hydration reference",async()=>{const {readFile}=await import("node:fs/promises");const source=await readFile(new URL("../src/main.js",import.meta.url),"utf8");assert.match(source,/const WATER_CHECK_QUESTIONS=/);assert.match(source,/Monitor potable water levels, inspect the recycling system, and postpone non-essential water use/);assert.match(source,/متابعة مستوى مياه الشرب، وفحص نظام الاستعادة/);assert.match(source,/2\.5 L \/ person \/ day/);assert.match(source,/NASA-STD-3001/);assert.match(source,/case"water-quiz"/);});
test("water shortage quiz only applies the simulated recovery response after the correct scenario answer",()=>{const m=startMission(createMission("standard"));m.resources.water=12;const before={...m.resources};const result=applyResourceResponse(m,"water","recovery");assert.ok(result);assert.equal(m.resources.water,Math.min(100,before.water+14));assert.equal(m.resources.power,before.power-7);assert.equal(m.responseHistory.at(-1).resourceId,"water");});

test("mission analysis compares final reserves with the selected difficulty baseline without mutating the mission",()=>{
 const m=startMission(createMission("standard"));
 m.resources.water=42;m.resources.power=91;m.stationTasks=["solar"];
 const before=JSON.stringify(m);
 const result=analyzeMission(m);
 assert.equal(result.score,Math.round((65+42+91+80+95)/5));
 assert.equal(result.lowest.id,"water");
 assert.equal(result.highest.id,"shield");
 assert.equal(result.resources.find(x=>x.id==="water").start,65);
 assert.equal(result.resources.find(x=>x.id==="water").change,-23);
 assert.equal(result.resources.find(x=>x.id==="power").change,26);
 assert.equal(result.stationTasks,1);
 assert.deepEqual(result.critical,[]);
 assert.equal(JSON.stringify(m),before);
});
test("mission analysis flags critical reserves while preserving all five systems",()=>{
 const m=startMission(createMission("expert"));
 m.resources.oxygen=12;m.resources.water=18;
 const result=analyzeMission(m);
 assert.deepEqual(result.critical,["oxygen","water"]);
 assert.equal(result.resources.length,5);
});

test("mission analysis builds a chronological, transparent decision and recovery impact log",()=>{
 const m=startMission(createMission("standard"));
 m.site="malapert";
 choose(m,0);
 m.resources.oxygen=18;
 const response=applyResourceResponse(m,"oxygen","backup");
 assert.ok(response);
 const result=analyzeMission(m);
 assert.equal(result.timeline.length,2);
 assert.equal(result.timeline[0].kind,"decision");
 assert.equal(result.timeline[0].day,1);
 assert.equal(result.timeline[1].kind,"recovery");
 assert.equal(result.timeline[1].day,1);
 assert.equal(result.timeline[1].delta.oxygen,14);
 assert.equal(result.timeline[1].delta.power,-6);
 assert.equal(result.timeline[1].before.oxygen,18);
 assert.equal(result.timeline[1].after.oxygen,32);
});
test("mission analysis keeps decision history usable when older saves lack recovery history",()=>{
 const m=startMission(createMission("standard"));
 m.site="malapert";
 choose(m,0);
 delete m.responseHistory;
 const result=analyzeMission(m);
 assert.equal(result.timeline.length,1);
 assert.equal(result.timeline[0].kind,"decision");
});

test("station task resource changes are recorded in the mission impact report",()=>{
 const m=startMission(createMission("standard"));
 const before={...m.resources};
 const task=completeStationTask(m,"greenhouse");
 assert.equal(task.day,1);
 assert.equal(task.delta.water,8);
 assert.equal(task.delta.food,8);
 assert.equal(task.delta.power,-4);
 const report=analyzeMission(m);
 const entry=report.timeline.find(item=>item.kind==="station");
 assert.ok(entry);
 assert.equal(entry.day,1);
 assert.equal(entry.delta.water,8);
 assert.equal(entry.before.water,before.water);
 assert.equal(entry.after.water,Math.min(100,before.water+8));
 assert.deepEqual(summary(m).stationTasks,["greenhouse"]);
 assert.equal(summary(m).stationHistory.length,1);
});
test("starting a fresh mission clears the previous station impact log",()=>{
 const m=startMission(createMission("standard"));
 completeStationTask(m,"solar");
 startMission(m);
 assert.deepEqual(m.stationHistory,[]);
});

test("mission impact timeline uses a stable event order within each mission day",()=>{
 const m=startMission(createMission("standard"));
 m.site="malapert";
 choose(m,0);
 m.resources.oxygen=18;
 applyResourceResponse(m,"oxygen","backup");
 completeStationTask(m,"solar");
 assert.deepEqual(analyzeMission(m).timeline.map(event=>event.kind),["decision","recovery","station"]);
});
