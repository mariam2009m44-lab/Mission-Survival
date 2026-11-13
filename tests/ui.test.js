import test from "node:test";
import assert from "node:assert/strict";
const root={innerHTML:"",listeners:{},addEventListener(type,handler){this.listeners[type]=handler;}};
const storage=new Map();
Object.defineProperty(globalThis,"document",{configurable:true,value:{querySelector:()=>root,documentElement:{}}});
Object.defineProperty(globalThis,"window",{configurable:true,value:{addEventListener(){},scrollTo(){}}});
Object.defineProperty(globalThis,"navigator",{configurable:true,value:{serviceWorker:{register:async()=>({})}}});
Object.defineProperty(globalThis,"location",{configurable:true,value:{protocol:"file:"}});
Object.defineProperty(globalThis,"localStorage",{configurable:true,value:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))}});
await import("../src/main.js?ui-smoke");
async function nav(id){await root.listeners.click({target:{closest:selector=>selector==="[data-nav]"?{dataset:{nav:id}}:null}});}
async function action(name,data={}){await root.listeners.click({target:{closest:selector=>selector==="[data-action]"?{dataset:{action:name,...data}}:null}});}
test("app renders, passes a training check, completes the mission and opens the science library",async()=>{
 assert.match(root.innerHTML,/A smarter outpost/);
 await nav("training");
 assert.match(root.innerHTML,/QUICK KNOWLEDGE CHECK/);
 await action("quiz",{id:"power",answer:"0"});
 assert.match(root.innerHTML,/Correct. Terrain and sunlight models/);
 await nav("mission");
 await action("start");
 for(let day=0;day<3;day++){await action("choose",{choice:"0"});if(day<2)await action("next");}
 assert.match(root.innerHTML,/MISSION SCORE/);
 await nav("science");
 assert.match(root.innerHTML,/LRO CRaTER/);
 assert.match(root.innerHTML,/DONKI/);
 assert.match(root.innerHTML,/2,310,946/);
 await action("language");
 assert.match(root.innerHTML,/مختبر العلوم|مكتبة العلوم الموثقة/);
});