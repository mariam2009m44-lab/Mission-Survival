import test from "node:test";
import {webcrypto} from "node:crypto";
import assert from "node:assert/strict";
const root={innerHTML:"",listeners:{},addEventListener(type,handler){this.listeners[type]=handler;}};
const storage=new Map();
Object.defineProperty(globalThis,"crypto",{configurable:true,value:webcrypto});
let loginPin="123456";
Object.defineProperty(globalThis,"document",{configurable:true,value:{querySelector:selector=>selector==="#app"?root:selector==="#commander-name"?{value:"Test Commander"}:selector==="#profile-pin"||selector==="#profile-pin-confirm"?{value:"123456"}:selector==="#login-pin"?{value:loginPin}:null,documentElement:{}}});
Object.defineProperty(globalThis,"window",{configurable:true,value:{addEventListener(){},scrollTo(){},confirm:()=>true}});
Object.defineProperty(globalThis,"navigator",{configurable:true,value:{serviceWorker:{register:async()=>({})}}});
Object.defineProperty(globalThis,"location",{configurable:true,value:{protocol:"file:"}});
Object.defineProperty(globalThis,"localStorage",{configurable:true,value:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))}});
await import("../src/main.js?ui-smoke");
async function nav(id){await root.listeners.click({target:{closest:selector=>selector==="[data-nav]"?{dataset:{nav:id}}:null}});}
async function action(name,data={}){await root.listeners.click({target:{closest:selector=>selector==="[data-action]"?{dataset:{action:name,...data}}:null}});}
test("app completes junior commander onboarding, training, five mission decisions and science library",async()=>{
 assert.match(root.innerHTML,/YOUR NEXT ADVENTURE STARTS HERE/);
 await action("language");
 assert.match(root.innerHTML,/JUNIOR SPACE EXPLORERS/);
 assert.match(root.innerHTML,/intro-3d-world/);
 assert.match(root.innerHTML,/مغامرتك الجديدة/);
 await action("intro-start");
 assert.match(root.innerHTML,/account-portal/);
 assert.match(root.innerHTML,/Create your first explorer profile|أنشئ ملف المستكشف الأول/);
 await action("new-profile");
 assert.match(root.innerHTML,/اختاري رائدة الفضاء بتاعتك/);
 assert.match(root.innerHTML,/onboard-3d-preview/);
 assert.match(root.innerHTML,/data-avatar=/);
 assert.match(root.innerHTML,/data-vehicle=/);
 await action("create-profile");
 assert.match(root.innerHTML,/tecnova-home/);
 assert.match(root.innerHTML,/class="sidebar"/);
 assert.match(root.innerHTML,/class="mobile-nav"/);
 assert.equal((root.innerHTML.match(/data-nav="report"/g)||[]).length,3);
 assert.match(root.innerHTML,/lunar-3d-home/);
 assert.match(root.innerHTML,/TECNOVA/);
 await action("start");
 assert.match(root.innerHTML,/MISSION DAY 01 \/ 05/);
 assert.match(root.innerHTML,/sound-toggle/);
 assert.match(root.innerHTML,/music-toggle/);
 assert.match(root.innerHTML,/aria-pressed="true"/);
 await action("music");
 assert.match(root.innerHTML,/aria-pressed="false"/);
 await action("music");
 assert.match(root.innerHTML,/aria-pressed="true"/);
 await action("sound");
 assert.match(root.innerHTML,/sound-toggle/);
 await action("language");
 await nav("overview");
 assert.match(root.innerHTML,/A smarter outpost/);
 assert.match(root.innerHTML,/class="sidebar"/);
 assert.match(root.innerHTML,/class="mobile-nav"/);
 assert.match(root.innerHTML,/profile-switch-trigger/);
 assert.match(root.innerHTML,/profile-settings-trigger/);
 assert.doesNotMatch(root.innerHTML,/tecnova-bottom-nav/);
 assert.match(root.innerHTML,/Radiation protection/i);
 assert.match(root.innerHTML,/5 DECISION STAGES/);
 assert.match(root.innerHTML,/NOVA SCIENCE GUIDE/);
 assert.doesNotMatch(root.innerHTML,/CREW HEALTH|صحة الطاقم/);
 await nav("training");
 assert.match(root.innerHTML,/QUICK KNOWLEDGE CHECK/);
 await action("quiz",{id:"power",answer:"0"});
 assert.match(root.innerHTML,/Correct. Terrain and sunlight models/);
 await nav("mission");
 await action("start");
 assert.match(root.innerHTML,/fieldwork-panel/);
 assert.match(root.innerHTML,/OXYGEN KNOWLEDGE CHECK/);
 assert.match(root.innerHTML,/WATER KNOWLEDGE CHECK/);
 assert.match(root.innerHTML,/Solar-support package/);
 assert.match(root.innerHTML,/Polar-science package/);
 assert.match(root.innerHTML,/Balanced mobility package/);
 assert.match(root.innerHTML,/Answer the final scenario correctly to apply one mission decision/);
 await action("oxygen-quiz",{question:"0",answer:"0"});
 assert.match(root.innerHTML,/Correct\. This is a planning value/);
 await action("oxygen-quiz",{question:"2",answer:"1"});
 assert.match(root.innerHTML,/Correct! The backup-reserve training decision was applied/);
 assert.match(root.innerHTML,/\+14 Oxygen/);
 await action("water-quiz",{question:"0",answer:"0"});
 await action("water-quiz",{question:"2",answer:"1"});
 assert.match(root.innerHTML,/Correct! The training decision improved the simulated water reserve/);
 assert.match(root.innerHTML,/\+14 Water/);
 assert.match(root.innerHTML,/Correct\. This hydration allocation/);
 assert.match(root.innerHTML,/SCIENCE BEHIND THIS DAY/);
 assert.match(root.innerHTML,/svs\.gsfc\.nasa\.gov\/4930/);
 assert.match(root.innerHTML,/active-station-guide/);
 assert.match(root.innerHTML,/YOUR EXPLORER TASK/);
 assert.match(root.innerHTML,/Visit the five stations/);
 assert.match(root.innerHTML,/Find the glowing station/);
 for(const station of ["habitat","oxygen","solar","greenhouse","rover"])assert.match(root.innerHTML,new RegExp("assets/stations/"+station+"\\.svg"));
 await action("site-select",{site:"malapert"});
 assert.match(root.innerHTML,/ACTIVE MISSION LOADOUT/);
 assert.match(root.innerHTML,/SELECTED · PLAN ACTIVE/);
 for(let day=0;day<5;day++){
  await action("choose",{choice:"0"});
  if(day<4){
   await action("next");
   const evidenceUrls=[
    "nasa.gov/centers-and-facilities/johnson/sunlight-extracts-oxygen-from-regolith-using-solar-chemistry/",
    "pds.nasa.gov/datasearch/subscription-service/SS-20260915.shtml",
    "nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/",
    "asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/"
   ];
   if(day>0)assert.ok(root.innerHTML.includes(evidenceUrls[day]));
  }
 }
 assert.match(root.innerHTML,/MISSION SCORE/);
 assert.match(root.innerHTML,/Solar-support package/);
 assert.match(root.innerHTML,/Landing strategy/);
 assert.match(root.innerHTML,/START CHALLENGE 2/);
 await action("next-challenge");
 assert.match(root.innerHTML,/CHALLENGE 02/);
 assert.match(root.innerHTML,/ADVANCED CHALLENGE/);
 for(let step=0;step<5;step++)await action("challenge-two-answer",{answer:"0"});
 assert.match(root.innerHTML,/Systems Integrator/);
 await nav("report");
 assert.match(root.innerHTML,/MY BADGES/);
 assert.match(root.innerHTML,/Systems Integrator|خبير تكامل الأنظمة/);
 assert.match(root.innerHTML,/MISSION HISTORY|سجل المهمات/);
 assert.match(root.innerHTML,/My achievements|إنجازاتي/);
 assert.match(root.innerHTML,/class="mobile-nav"/);
 assert.match(root.innerHTML,/Completed missions|المهمات المكتملة/);
 assert.match(root.innerHTML,/View mission decisions|عرض قرارات المهمة/);
 assert.match(root.innerHTML,/MISSION ARCHIVE/);
 await nav("science");
 assert.match(root.innerHTML,/LRO CRaTER/);
 assert.match(root.innerHTML,/11 SOURCES/);
 assert.match(root.innerHTML,/DONKI/);
 assert.match(root.innerHTML,/2,310,946/);
 await action("language");
 assert.match(root.innerHTML,/مختبر العلوم|مكتبة العلوم الموثقة/);
});
test("walking to a lunar station opens a child-friendly discovery challenge",async()=>{
 const handler=root.listeners["lunar-station-interact"];
 assert.equal(typeof handler,"function");
 handler({detail:{id:"solar",name:"Solar Power Farm",ar:"مزرعة الطاقة الشمسية",info:"Solar panels use sunlight.",arInfo:"الألواح تستخدم ضوء الشمس."}});
 assert.match(root.innerHTML,/station-modal/);
 assert.match(root.innerHTML,/ليه قائد القاعدة يدرس الظلال قبل وضع الألواح الشمسية/);
 await action("station-answer",{answer:"1"});
 assert.match(root.innerHTML,/مش دي الإجابة الصحيحة/);
 await action("station-answer",{answer:"0"});
 assert.match(root.innerHTML,/تم تسجيل اكتشافك|اكتشافك/);
 await action("station-close");
 assert.doesNotMatch(root.innerHTML,/station-modal/);
});

test("signing out preserves the local explorer profile and achievements",async()=>{
 await action("switch-profile");
 assert.match(root.innerHTML,/account-portal/);
 const savedState=JSON.parse(storage.get("lunar-outpost-trainer-v2"));
 const savedProfiles=JSON.parse(storage.get("tecnova-local-profiles-v1"));
 assert.ok(savedProfiles.length>=1);
 assert.ok(savedProfiles[0].state.commander);
 assert.ok(savedProfiles[0].security?.salt);
 assert.ok(savedProfiles[0].security?.hash);
 assert.ok(savedProfiles[0].state.missionArchive.length>=1);
 assert.equal(savedProfiles[0].state.missionArchive[0].sitePlan.id,"malapert");
 assert.ok(savedState.signedOut);
 await action("choose-profile",{profileId:savedProfiles[0].id});
 assert.match(root.innerHTML,/login-pin/);
 loginPin="111111";
 await action("unlock-profile");
 assert.match(root.innerHTML,/account-portal/);
 loginPin="123456";
 await action("unlock-profile");
 assert.match(root.innerHTML,/class="shell/);
 await nav("report");
 assert.match(root.innerHTML,/MISSION HISTORY|سجل المهمات/);
});

test("starting a new journey closes the settings dialog",async()=>{
 await action("settings");
 assert.match(root.innerHTML,/tecnova-settings-backdrop/);
 await action("new-journey");
 assert.match(root.innerHTML,/MISSION DAY 01 \/ 05/);
 assert.doesNotMatch(root.innerHTML,/tecnova-settings-backdrop/);
});
