import "./mission-days.js";
import {DIFFICULTIES,DAYS,RESOURCES,SITE_OPTIONS} from "./data.js";
export const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
export function createMission(difficulty="standard"){return{difficulty,started:false,phase:"briefing",day:0,site:null,siteName:null,sitePlan:null,resources:{...DIFFICULTIES[difficulty].values},history:[],stationTasks:[],stationHistory:[],responseHistory:[],xp:0,result:null,saved:false};}
export function selectLandingSite(m,siteId){
 if(!m||!m.started||m.phase!=="active"||m.day!==0||m.history?.length)return null;
 const option=SITE_OPTIONS.find(site=>site.id===siteId);if(!option)return null;
 const difficultyBase={...((DIFFICULTIES[m.difficulty]||DIFFICULTIES.standard).values)};
 const before={...difficultyBase};
 const after={...difficultyBase};
 for(const [key,delta] of Object.entries(option.delta))if(Object.hasOwn(after,key))after[key]=clamp(after[key]+delta);
 const preSiteResources=m.sitePlan?.preSiteResources?{...m.sitePlan.preSiteResources}:{...m.resources};
 const postSelectionChanges={};
 if(m.sitePlan?.appliedResources)for(const key of Object.keys(preSiteResources))postSelectionChanges[key]=(m.resources[key]??preSiteResources[key])-(m.sitePlan.appliedResources[key]??preSiteResources[key]);
 const appliedResources={...preSiteResources};
 for(const [key,delta] of Object.entries(option.delta))if(Object.hasOwn(appliedResources,key))appliedResources[key]=clamp(appliedResources[key]+delta);
 const currentAfter={...appliedResources};
 for(const [key,delta] of Object.entries(postSelectionChanges))if(Object.hasOwn(currentAfter,key))currentAfter[key]=clamp(currentAfter[key]+delta);
 m.site=option.id;m.siteName=option.name;
 m.sitePlan={id:option.id,name:option.name,ar:option.ar,strategy:option.strategy,arStrategy:option.arStrategy,detail:option.detail,arDetail:option.arDetail,delta:{...option.delta},before,after:{...after},preSiteResources,appliedResources};
 m.resources=currentAfter;
 return m.sitePlan;
}
export function startMission(m){m.started=true;m.phase="active";m.day=0;m.site=null;m.siteName=null;m.sitePlan=null;m.resources={...DIFFICULTIES[m.difficulty].values};m.history=[];m.stationTasks=[];m.stationHistory=[];m.responseHistory=[];m.xp=0;m.result=null;m.saved=false;return m;}
export function score(m){return Math.round(RESOURCES.reduce((sum,r)=>sum+m.resources[r.id],0)/RESOURCES.length);}
export function choose(m,index){if(!m||!m.started||m.phase!=="active")return null;const stage=DAYS[m.day],choice=stage?.choices[index];if(!choice||(m.day===0&&!m.site))return null;const before={...m.resources};for(const [key,delta] of Object.entries(choice.delta))if(Object.hasOwn(m.resources,key))m.resources[key]=clamp(m.resources[key]+delta);const record={day:stage.dayNumber||m.day+1,stageIndex:m.day,choiceIndex:index,choiceId:choice.id,site:m.site,siteName:m.siteName||null,title:choice.title,why:choice.why,delta:{...choice.delta},before,after:{...m.resources}};m.history.push(record);m.xp+=50;if(Object.values(m.resources).some(v=>v<=0)){m.phase="complete";m.result="interrupted";m.xp+=25;}else if(m.day===DAYS.length-1){m.phase="complete";m.result="success";m.xp+=100;}else m.phase="debrief";return record;}
const STATION_TASKS={habitat:{delta:{shield:6,oxygen:2}},oxygen:{delta:{oxygen:10,power:-8}},solar:{delta:{power:12}},greenhouse:{delta:{water:8,food:8,power:-4}},rover:{delta:{shield:4,power:-4}}};
export function completeStationTask(m,id){if(!m||!m.started||!["active","debrief"].includes(m.phase)||!Object.hasOwn(STATION_TASKS,id))return null;if(!Array.isArray(m.stationTasks))m.stationTasks=[];if(m.stationTasks.includes(id))return null;const before={...m.resources},delta={...STATION_TASKS[id].delta};for(const [key,value] of Object.entries(delta))if(Object.hasOwn(m.resources,key))m.resources[key]=clamp(m.resources[key]+value);m.stationTasks.push(id);m.xp+=25;const interrupted=Object.values(m.resources).some(value=>value<=0);if(interrupted){m.phase="complete";m.result="interrupted";m.xp+=25;}const record={id,day:m.day+1,phase:m.phase,delta,before,after:{...m.resources},xp:25,interrupted};if(!Array.isArray(m.stationHistory))m.stationHistory=[];m.stationHistory.push(record);return record;}
export function nextDay(m){if(!m||m.phase!=="debrief"||m.day>=DAYS.length-1)return false;m.day++;m.phase="active";return true;}
export function badges(m){const ids=m.history.map(x=>x.choiceId);const earned=[];if(m.resources.shield>90)earned.push({id:"crew-guardian",en:"Crew Guardian",ar:"حارس الطاقم",icon:"🛡️"});if(m.history.every(x=>Math.min(x.before.power,x.after.power)>=30))earned.push({id:"energy-engineer",en:"Energy Engineer",ar:"مهندس الطاقة",icon:"⚡"});if(ids.includes("isru")&&ids.includes("water-recovery")&&ids.includes("greenhouse"))earned.push({id:"sustainable-commander",en:"Sustainable Commander",ar:"القائد المستدام",icon:"🌱",hidden:true});return earned;}

export const RESOURCE_RESPONSES={
 oxygen:{
  backup:{delta:{oxygen:14,power:-6},en:"Review simulated consumption, postpone optional activities and activate the backup reserve",ar:"مراجعة الاستهلاك الافتراضي وتأجيل الأنشطة الاختيارية وتفعيل احتياطي الأكسجين",enWhy:"In this training scenario, the crew reduces non-essential demand and uses the simulated backup reserve. The oxygen reserve improves while the life-support system uses power. This is a game model, not a real spacecraft procedure.",arWhy:"في سيناريو التدريب، يقلل الطاقم الطلب غير الضروري ويستخدم احتياطي الأكسجين الافتراضي. يتحسن مخزون الأكسجين مع استهلاك طاقة لنظام دعم الحياة. ده نموذج داخل اللعبة وليس إجراءً حقيقيًا لتشغيل مركبة فضائية."},
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
export function applyScenarioResponse(m,resourceId,actionId){
 if(!m?.started||m.phase!=="active"||!Object.hasOwn(RESOURCE_RESPONSES,resourceId))return null;
 if(!m.resources||!Array.isArray(m.responseHistory))m.responseHistory??=[];
 const key="scenario:"+resourceId;
 if(m.responseHistory.some(x=>x.key===key))return null;
 const action=RESOURCE_RESPONSES[resourceId][actionId];if(!action)return null;
 const before={...m.resources};
 for(const [id,delta] of Object.entries(action.delta))if(Object.hasOwn(m.resources,id))m.resources[id]=clamp(m.resources[id]+delta);
 m.responseHistory.push({key,day:m.day+1,resourceId,actionId,delta:{...action.delta},before,after:{...m.resources},kind:"scenario"});
 if(Object.values(m.resources).some(value=>value<=0)){m.phase="complete";m.result="interrupted";m.xp=(m.xp||0)+25;}
 return {resourceId,actionId,delta:{...action.delta},before,after:{...m.resources},en:action.en,ar:action.ar,enWhy:action.enWhy,arWhy:action.arWhy};
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

export function summary(m){return{score:score(m),xp:m.xp,decisions:m.history.length,result:m.result,resources:{...m.resources},history:[...m.history],stationTasks:[...(m.stationTasks||[])],stationHistory:[...(m.stationHistory||[])],responseHistory:[...(m.responseHistory||[])],site:m.site,siteName:m.siteName||null,sitePlan:m.sitePlan?{...m.sitePlan,delta:{...m.sitePlan.delta}}:null,badges:badges(m)};}


/**
 * Explain the final state of a training mission without changing the saved mission.
 * Values are illustrative game units, never spacecraft telemetry.
 */
export function analyzeMission(m){
 const base=DIFFICULTIES[m?.difficulty]?.values||DIFFICULTIES.standard.values;
 const initial={...base};
 if(m?.sitePlan?.delta)for(const [key,delta] of Object.entries(m.sitePlan.delta))if(Object.hasOwn(initial,key))initial[key]=clamp(initial[key]+delta);
 const resources=RESOURCES.map(resource=>{
  const value=clamp(Number(m?.resources?.[resource.id]??initial[resource.id]));
  return {id:resource.id,name:resource.name,ar:resource.ar,start:initial[resource.id],value,change:value-initial[resource.id]};
 });
 const ranked=[...resources].sort((a,b)=>a.value-b.value);
 const average=resources.length?Math.round(resources.reduce((sum,item)=>sum+item.value,0)/resources.length):0;
 const spread=ranked.length?ranked.at(-1).value-ranked[0].value:0;
 const resilience=clamp(Math.round(average*.55+(ranked[0]?.value??0)*.30+(100-spread)*.15));
 const weakestId=ranked[0]?.id||"oxygen";
 const priorities={
  oxygen:{en:"Review oxygen reserve and the power cost of life-support recovery options.",ar:"راجعي احتياطي الأكسجين وتأثير خيارات استعادة دعم الحياة على الطاقة."},
  water:{en:"Review water recovery, storage and the energy needed to keep the loop running.",ar:"راجعي استعادة المياه وتخزينها والطاقة اللازمة لاستمرار دورة المعالجة."},
  power:{en:"Review sunlight availability, battery reserve and non-essential power demand.",ar:"راجعي توفر ضوء الشمس واحتياطي البطاريات والأحمال الكهربائية غير الضرورية."},
  food:{en:"Review stored meals and the water and power needs of the greenhouse plan.",ar:"راجعي مخزون الوجبات واحتياجات خطة الصوبة من المياه والطاقة."},
  shield:{en:"Review shelter planning and how surface activities affect crew protection.",ar:"راجعي تخطيط المأوى وتأثير الأنشطة خارج القاعدة على حماية الطاقم."}
 };
 const priority=priorities[weakestId];
 const risk=ranked[0]?.value<20?"critical":ranked[0]?.value<40?"watch":"stable";
 const decisions=Array.isArray(m?.history)?m.history:[];
 const responses=Array.isArray(m?.responseHistory)?m.responseHistory:[];
 const stationEvents=Array.isArray(m?.stationHistory)?m.stationHistory:[];
 const stationNames={habitat:{en:"Habitat station task",ar:"مهمة محطة السكن"},oxygen:{en:"Oxygen lab task",ar:"مهمة معمل الأكسجين"},solar:{en:"Solar farm task",ar:"مهمة مزرعة الطاقة"},greenhouse:{en:"Greenhouse task",ar:"مهمة الصوبة الزراعية"},rover:{en:"Rover garage task",ar:"مهمة مرآب المركبة"}};
 const timeline=[
  ...(m?.sitePlan?[{day:1,kind:"site",title:m.sitePlan.strategy||m.sitePlan.name,arTitle:m.sitePlan.arStrategy||m.sitePlan.ar,delta:{...(m.sitePlan.delta||{})},before:{...(m.sitePlan.before||base)},after:{...(m.sitePlan.after||initial)}}]:[]),
  ...decisions.map(event=>({day:Number(event.day)||1,kind:"decision",title:event.title||"Mission decision",delta:{...(event.delta||{})},before:{...(event.before||{})},after:{...(event.after||{})}})),
  ...responses.map(event=>{
   const action=RESOURCE_RESPONSES[event.resourceId]?.[event.actionId];
   const resource=RESOURCES.find(item=>item.id===event.resourceId);
   return {day:Number(event.day)||1,kind:event.kind==="scenario"?"scenario":"recovery",title:action?(action.en||action.ar):(resource?.name||"Resource recovery"),arTitle:action?(action.ar||action.en):(resource?.ar||"استعادة مورد"),delta:{...(event.delta||{})},before:{...(event.before||{})},after:{...(event.after||{})}};
  }),
  ...stationEvents.map(event=>{
   const name=stationNames[event.id]||{en:"Station task",ar:"مهمة محطة"};
   return {day:Number(event.day)||1,kind:"station",title:name.en,arTitle:name.ar,delta:{...(event.delta||{})},before:{...(event.before||{})},after:{...(event.after||{})}};
  })
 ].sort((a,b)=>a.day-b.day||(({site:0,decision:1,scenario:2,recovery:3,station:4}[a.kind]??9)-({site:0,decision:1,scenario:2,recovery:3,station:4}[b.kind]??9)));
 return {
  score:average,
  resilience,
  balance:100-spread,
  risk,
  priority:{resource:weakestId,en:priority.en,ar:priority.ar},
  decisions:decisions.length,
  stationTasks:Array.isArray(m?.stationTasks)?m.stationTasks.length:0,
  lowest:ranked[0]||null,
  highest:ranked.at(-1)||null,
  critical:ranked.filter(item=>item.value<20).map(item=>item.id),
  resources,
  timeline
 };
}
