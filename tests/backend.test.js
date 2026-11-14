import test from "node:test";
import assert from "node:assert/strict";
import {validateProgress} from "../backend/worker.js";

test("backend accepts a compact guest progress snapshot",()=>{
 const result=validateProgress({language:"ar",trainingDone:["power","life-support"],stats:{missions:2,totalXp:250,bestScore:91},mission:{difficulty:"standard",started:true,phase:"active",day:4,site:"malapert",siteName:"Malapert Massif",resources:{power:88,oxygen:70,water:64,food:76,shield:95},history:[{day:5,stageIndex:4,choiceIndex:0,choiceId:"greenhouse",delta:{food:10,power:-3}}]}});
 assert.equal(result.language,"ar");assert.deepEqual(result.trainingDone,["power","life-support"]);assert.equal(result.stats.totalXp,250);assert.equal(result.mission.resources.power,88);assert.equal(result.mission.day,4);assert.equal(result.mission.history[0].day,5);assert.equal(result.mission.history[0].stageIndex,4);
});
test("backend clamps values and strips unapproved personal fields",()=>{
 const result=validateProgress({name:"A child's full name",email:"private@example.com",language:"xx",stats:{missions:999999999,totalXp:-50,bestScore:500},trainingDone:["safe","bad value"],mission:{resources:{power:500,oxygen:-4},history:Array.from({length:8},(_,i)=>({day:i+1,choiceId:"x".repeat(90)}))}});
 assert.equal(result.language,"ar");assert.deepEqual(result.trainingDone,["safe"]);assert.equal(result.stats.missions,100000);assert.equal(result.stats.totalXp,0);assert.equal(result.stats.bestScore,100);assert.equal(result.mission.resources.power,100);assert.equal(result.mission.resources.oxygen,0);assert.equal(result.mission.history.length,5);assert.equal("name" in result,false);assert.equal("email" in result,false);
});
test("backend rejects non-object progress",()=>{assert.equal(validateProgress(null),null);assert.equal(validateProgress([]),null);});
test("backend preserves mission completion metadata for safe restoration",()=>{
 const result=validateProgress({mission:{difficulty:"training",started:true,phase:"complete",day:4,resources:{power:80,oxygen:70,water:60,food:90,shield:95},history:[],xp:350,result:"success",saved:true}});
 assert.equal(result.mission.xp,350);assert.equal(result.mission.result,"success");assert.equal(result.mission.saved,true);
});
test("backend keeps the minimum decision fields needed to resume a five-day mission",()=>{
 const result=validateProgress({mission:{difficulty:"training",day:4,history:[{day:5,stageIndex:4,choiceIndex:0,choiceId:"greenhouse",title:"Food strategy",why:"Use the greenhouse"}]}});
 const row=result.mission.history[0];assert.equal(result.mission.day,4);assert.equal(row.day,5);assert.equal(row.stageIndex,4);assert.equal(row.choiceIndex,0);assert.equal(row.title,"Food strategy");assert.equal(row.why,"Use the greenhouse");
});
test("backend preserves only known completed station tasks",()=>{const result=validateProgress({mission:{stationTasks:["oxygen","greenhouse","unknown","oxygen"]}});assert.deepEqual(result.mission.stationTasks,["oxygen","greenhouse","oxygen"]);});


test("backend preserves report site labels and before/after resource snapshots",()=>{
 const result=validateProgress({mission:{site:"malapert",siteName:"Malapert Massif",history:[{day:1,stageIndex:0,choiceIndex:1,choiceId:"payload",title:"Payload plan",why:"Protect the crew",site:"malapert",siteName:"Malapert Massif",before:{power:75,oxygen:80,water:70,food:65,shield:90,private:"x"},after:{power:85,oxygen:80,water:70,food:65,shield:90},delta:{power:10}}]}});
 const mission=result.mission,row=mission.history[0];
 assert.equal(mission.siteName,"Malapert Massif");assert.equal(row.siteName,"Malapert Massif");
 assert.deepEqual(row.before,{power:75,oxygen:80,water:70,food:65,shield:90});
 assert.deepEqual(row.after,{power:85,oxygen:80,water:70,food:65,shield:90});
});

test("backend preserves one-response-per-resource guard history",()=>{const row={key:"2:oxygen",day:3,resourceId:"oxygen",actionId:"backup",delta:{oxygen:14,power:-6},before:{oxygen:10,power:20},after:{oxygen:24,power:14}};const result=validateProgress({mission:{started:true,phase:"active",day:2,responseHistory:[row,{key:"bad:oxygen",resourceId:"oxygen",actionId:"backup"}]}});assert.deepEqual(result.mission.responseHistory,[row]);});
