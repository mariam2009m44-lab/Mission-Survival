import test from "node:test";
import assert from "node:assert/strict";
import {validateProgress} from "../backend/worker.js";

test("backend accepts a compact guest progress snapshot",()=>{
 const result=validateProgress({language:"ar",trainingDone:["power","life-support"],stats:{missions:2,totalXp:250,bestScore:91},mission:{difficulty:"standard",started:true,phase:"active",day:1,site:"malapert",siteName:"Malapert Massif",resources:{power:88,oxygen:70,water:64,food:76,shield:95},history:[{day:1,choiceId:"batteries",delta:{power:10,oxygen:-3}}]}});
 assert.equal(result.language,"ar");
 assert.deepEqual(result.trainingDone,["power","life-support"]);
 assert.equal(result.stats.totalXp,250);
 assert.equal(result.mission.resources.power,88);
 assert.equal(result.mission.history.length,1);
});
test("backend clamps values and strips unapproved personal fields",()=>{
 const result=validateProgress({name:"A child's full name",email:"private@example.com",language:"xx",stats:{missions:999999999,totalXp:-50,bestScore:500},trainingDone:["safe","bad value"],mission:{resources:{power:500,oxygen:-4},history:Array.from({length:8},(_,i)=>({day:i+1,choiceId:"x".repeat(90)}))}});
 assert.equal(result.language,"ar");
 assert.deepEqual(result.trainingDone,["safe"]);
 assert.equal(result.stats.missions,100000);
 assert.equal(result.stats.totalXp,0);
 assert.equal(result.stats.bestScore,100);
 assert.equal(result.mission.resources.power,100);
 assert.equal(result.mission.resources.oxygen,0);
 assert.equal(result.mission.history.length,5);
 assert.equal("name" in result,false);
 assert.equal("email" in result,false);
});
test("backend rejects non-object progress",()=>{
 assert.equal(validateProgress(null),null);
 assert.equal(validateProgress([]),null);
});

test("backend preserves mission completion metadata for safe restoration",()=>{
 const result=validateProgress({mission:{difficulty:"training",started:true,phase:"complete",day:4,resources:{power:80,oxygen:70,water:60,food:90,shield:95},history:[],xp:350,result:"success",saved:true}});
 assert.equal(result.mission.xp,350);
 assert.equal(result.mission.result,"success");
 assert.equal(result.mission.saved,true);
});

test("backend keeps the minimum decision fields needed to resume a mission",()=>{const result=validateProgress({mission:{difficulty:"training",history:[{day:2,stageIndex:1,choiceIndex:0,choiceId:"isru",title:"Extract oxygen",why:"Use local resources"}]}});const row=result.mission.history[0];assert.equal(result.mission.difficulty,"training");assert.equal(row.stageIndex,1);assert.equal(row.choiceIndex,0);assert.equal(row.title,"Extract oxygen");assert.equal(row.why,"Use local resources");});
