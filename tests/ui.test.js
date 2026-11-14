import test from "node:test";
import assert from "node:assert/strict";
const root={innerHTML:"",listeners:{},addEventListener(type,handler){this.listeners[type]=handler;}};
const storage=new Map();
Object.defineProperty(globalThis,"document",{configurable:true,value:{querySelector:selector=>selector==="#app"?root:selector==="#commander-name"?{value:"Test Commander"}:null,documentElement:{}}});
Object.defineProperty(globalThis,"window",{configurable:true,value:{addEventListener(){},scrollTo(){}}});
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
 assert.match(root.innerHTML,/nova-welcome-guide/);
 assert.match(root.innerHTML,/أهلًا يا مستكشف/);
 await action("guide-next");
 assert.match(root.innerHTML,/دي قاعدتك على القمر/);
 await action("guide-next");
 assert.match(root.innerHTML,/خمس محطات/);
 await action("guide-next");
 assert.match(root.innerHTML,/اتعلم الأول، وبعدها قُد المهمة/);
 await action("guide-finish");
 assert.match(root.innerHTML,/اختاري رائدة الفضاء بتاعتك/);
 await action("create-profile");
 assert.match(root.innerHTML,/tecnova-home/);
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
 assert.match(root.innerHTML,/SCIENCE BEHIND THIS DAY/);
 assert.match(root.innerHTML,/svs\.gsfc\.nasa\.gov\/4930/);
 assert.match(root.innerHTML,/active-station-guide/);
 assert.match(root.innerHTML,/YOUR EXPLORER TASK/);
 assert.match(root.innerHTML,/Visit the five stations/);
 assert.match(root.innerHTML,/Find the glowing station/);
 for(const station of ["habitat","oxygen","solar","greenhouse","rover"])assert.match(root.innerHTML,new RegExp("assets/stations/"+station+"\\.svg"));
 await action("site-select",{site:"malapert","siteName":"Malapert Massif"});
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
 await nav("report");
 assert.match(root.innerHTML,/MISSION HISTORY/);
 assert.match(root.innerHTML,/Completed missions|المهمات المكتملة/);
 assert.match(root.innerHTML,/View mission decisions|عرض قرارات المهمة/);
 assert.match(root.innerHTML,/MISSION ARCHIVE/);
 await nav("science");
 assert.match(root.innerHTML,/LRO CRaTER/);
 assert.match(root.innerHTML,/9 SOURCES/);
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
 assert.match(root.innerHTML,/ليه قائد القاعدة يدرس الظلال/);
 await action("station-answer",{answer:"1"});
 assert.match(root.innerHTML,/مش دي الإجابة الصحيحة/);
 await action("station-answer",{answer:"0"});
 assert.match(root.innerHTML,/تم تسجيل اكتشافك|اكتشافك/);
 await action("station-close");
 assert.doesNotMatch(root.innerHTML,/station-modal/);
});
