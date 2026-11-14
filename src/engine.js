import "./mission-days.js";
import {DIFFICULTIES,DAYS,RESOURCES} from "./data.js";
export const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
export function createMission(difficulty="standard"){return{difficulty,started:false,phase:"briefing",day:0,site:null,siteName:null,resources:{...DIFFICULTIES[difficulty].values},history:[],stationTasks:[],xp:0,result:null,saved:false};}
export function startMission(m){m.started=true;m.phase="active";m.day=0;m.site=null;m.siteName=null;m.resources={...DIFFICULTIES[m.difficulty].values};m.history=[];m.stationTasks=[];m.xp=0;m.result=null;m.saved=false;return m;}
export function score(m){return Math.round(RESOURCES.reduce((sum,r)=>sum+m.resources[r.id],0)/RESOURCES.length);}
export function choose(m,index){if(!m||!m.started||m.phase!=="active")return null;const stage=DAYS[m.day],choice=stage?.choices[index];if(!choice||(m.day===0&&!m.site))return null;const before={...m.resources};for(const [key,delta] of Object.entries(choice.delta))if(Object.hasOwn(m.resources,key))m.resources[key]=clamp(m.resources[key]+delta);const record={day:stage.dayNumber||m.day+1,stageIndex:m.day,choiceIndex:index,choiceId:choice.id,site:m.site,siteName:m.siteName||null,title:choice.title,why:choice.why,delta:{...choice.delta},before,after:{...m.resources}};m.history.push(record);m.xp+=50;if(Object.values(m.resources).some(v=>v<=0)){m.phase="complete";m.result="interrupted";m.xp+=25;}else if(m.day===DAYS.length-1){m.phase="complete";m.result="success";m.xp+=100;}else m.phase="debrief";return record;}
const STATION_TASKS={habitat:{delta:{shield:6,oxygen:2}},oxygen:{delta:{oxygen:10,power:-8}},solar:{delta:{power:12}},greenhouse:{delta:{water:8,food:8,power:-4}},rover:{delta:{shield:4,power:-4}}};
export function completeStationTask(m,id){if(!m||!m.started||!["active","debrief"].includes(m.phase)||!Object.hasOwn(STATION_TASKS,id))return null;if(!Array.isArray(m.stationTasks))m.stationTasks=[];if(m.stationTasks.includes(id))return null;const before={...m.resources},delta={...STATION_TASKS[id].delta};for(const [key,value] of Object.entries(delta))if(Object.hasOwn(m.resources,key))m.resources[key]=clamp(m.resources[key]+value);m.stationTasks.push(id);m.xp+=25;return{id,delta,before,after:{...m.resources},xp:25};}
export function nextDay(m){if(!m||m.phase!=="debrief"||m.day>=DAYS.length-1)return false;m.day++;m.phase="active";return true;}
export function badges(m){const ids=m.history.map(x=>x.choiceId);const earned=[];if(m.resources.shield>90)earned.push({id:"crew-guardian",en:"Crew Guardian",ar:"حارس الطاقم",icon:"🛡️"});if(m.history.every(x=>Math.min(x.before.power,x.after.power)>=30))earned.push({id:"energy-engineer",en:"Energy Engineer",ar:"مهندس الطاقة",icon:"⚡"});if(ids.includes("isru")&&ids.includes("water-recovery")&&ids.includes("greenhouse"))earned.push({id:"sustainable-commander",en:"Sustainable Commander",ar:"القائد المستدام",icon:"🌱",hidden:true});return earned;}

export const RESOURCE_RESPONSES={
 oxygen:{
  backup:{delta:{oxygen:14,power:-6},en:"Switch to the backup oxygen reserve",ar:"التحويل إلى احتياطي الأكسجين",enWhy:"The simulation uses stored backup oxygen. Power is consumed by the life-support system.",arWhy:"تستخدم المحاكاة احتياطي الأكسجين المخزن، مع استهلاك طاقة لتشغيل نظام دعم الحياة."},
  inspect:{delta:{oxygen:8,power:-3},en:"Inspect the habitat life-support loop",ar:"فحص دورة دعم الحياة في السكن",enWhy:"The crew checks the simulated air loop and isolates the issue. This is a game action, not a real operating procedure.",arWhy:"يفحص الطاقم دورة الهواء داخل المحاكاة ويعزل المشكلة. ده إجراء داخل اللعبة وليس تعليمات تشغيل حقيقية."}
 },
 water:{
  recovery:{delta:{water:14,power:-7},en:"Activate the water-recovery system",ar:"تشغيل نظام استعادة المياه",enWhy:"The recovery loop adds water to the simulated reserve and uses electrical power.",arWhy:"تضيف دورة الاستعادة مياه إلى الاحتياطي الافتراضي وتستهلك طاقة كهربائية."},
  inspect:{delta:{water:7,power:-2},en:"Check the water-loop status",ar:"فحص حالة دورة المياه",enWhy:"A system check improves the simulated reserve slightly and uses a little power.",arWhy:"يرفع فحص النظام الاحتياطي الافتراضي قليلًا ويستهلك قدرًا بسيطًا من الطاقة."}
 },
 power:{
  conserve:{delta:{power:15},en:"Switch off non-essential loads",ar:"إيقاف الأحمال غير الضرورية",enWhy:"The outpost reduces optional electricity use to rebuild its simulated power reserve.",arWhy:"تقلل القاعدة استهلاك الكهرباء غير الضروري لاستعادة احتياطي الطاقة في المحاكاة."},
  solar:{delta:{power:10},en:"Review solar-array and battery status",ar:"مراجعة الألواح الشمسية والبطاريات",enWhy:"The crew completes a simulated power-system check and restores a small reserve.",arWhy:"ينفذ الطاقم فحصًا افتراضيًا لنظام الطاقة ويستعيد جزءًا صغيرًا من الاحتياطي."}
 },
 food:{
  reserve:{delta:{food:12},en:"Use the stored meal reserve",ar:"استخدام مخزون الوجبات",enWhy:"The crew uses food already stored at the outpost. The simulation does not create new food.",arWhy:"يستخدم الطاقم الطعام المخزن بالفعل في القاعدة؛ المحاكاة لا تنتج طعامًا جديدًا."},
  greenhouse:{delta:{food:8,water:-3,power:-5},en:"Prioritize the greenhouse recovery plan",ar:"إعطاء الأولوية لخطة استعادة الصوبة",enWhy:"The long-term food plan improves the simulated reserve but needs water and power.",arWhy:"تحسن خطة الغذاء طويلة المدى الاحتياطي الافتراضي لكنها تحتاج إلى الماء والطاقة."}
 },
 shield:{
  shelter:{delta:{shield:14,power:-5},en:"Move the crew to the designated shelter",ar:"انتقال الطاقم إلى المأوى المحدد",enWhy:"The training scenario prioritizes sheltering and pauses some power-intensive work.",arWhy:"يعطي السيناريو التدريبي الأولوية للمأوى ويوقف بعض الأعمال المستهلكة للطاقة."},
  pause:{delta:{shield:8,power:-2},en:"Pause non-essential surface work",ar:"إيقاف الأعمال السطحية غير الضرورية",enWhy:"The crew reduces exposure in the scenario by pausing optional surface tasks.",arWhy:"يقلل الطاقم التعرض في السيناريو بإيقاف المهام السطحية الاختيارية."}
 }
};
export function resourceAlerts(m){
 if(!m?.resources)return [];
 return RESOURCES.filter(r=>m.resources[r.id]<30).map(r=>({id:r.id,value:m.resources[r.id],severity:m.resources[r.id]<15?"critical":"warning",responses:RESOURCE_RESPONSES[r.id],handled:Array.isArray(m.responseHistory)&&m.responseHistory.some(x=>x.key===m.day+":"+r.id)})).sort((a,b)=>a.value-b.value);
}
export function applyResourceResponse(m,resourceId,actionId){
 if(!m?.started||!["active","debrief"].includes(m.phase)||!Object.hasOwn(RESOURCE_RESPONSES,resourceId))return null;
 if(!m.resources||m.resources[resourceId]>=30)return null;
 if(!Array.isArray(m.responseHistory))m.responseHistory=[];
 const key=m.day+":"+resourceId;
 if(m.responseHistory.some(x=>x.key===key))return null;
 const action=RESOURCE_RESPONSES[resourceId][actionId];if(!action)return null;
 const before={...m.resources};
 for(const [id,delta] of Object.entries(action.delta))if(Object.hasOwn(m.resources,id))m.resources[id]=clamp(m.resources[id]+delta);
 m.responseHistory.push({key,day:m.day+1,resourceId,actionId,delta:{...action.delta},before,after:{...m.resources}});
 if(Object.values(m.resources).some(value=>value<=0)){m.phase="complete";m.result="interrupted";m.xp=(m.xp||0)+25;}
 return {resourceId,actionId,delta:{...action.delta},before,after:{...m.resources},en:action.en,ar:action.ar,enWhy:action.enWhy,arWhy:action.arWhy};
}

export function summary(m){return{score:score(m),xp:m.xp,decisions:m.history.length,result:m.result,resources:{...m.resources},history:[...m.history],site:m.site,siteName:m.siteName||null,badges:badges(m)};}
