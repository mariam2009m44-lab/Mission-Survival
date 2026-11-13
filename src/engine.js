import {DIFFICULTIES,DAYS,RESOURCES} from "./data.js";
export const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
export function createMission(difficulty="standard"){return{difficulty,started:false,phase:"briefing",day:0,site:null,siteName:null,resources:{...DIFFICULTIES[difficulty].values},history:[],stationTasks:[],xp:0,result:null,saved:false};}
export function startMission(m){m.started=true;m.phase="active";m.day=0;m.site=null;m.siteName=null;m.resources={...DIFFICULTIES[m.difficulty].values};m.history=[];m.stationTasks=[];m.xp=0;m.result=null;m.saved=false;return m;}
export function score(m){return Math.round(RESOURCES.reduce((sum,r)=>sum+m.resources[r.id],0)/RESOURCES.length);}
export function choose(m,index){if(!m||!m.started||m.phase!=="active")return null;const stage=DAYS[m.day],choice=stage?.choices[index];if(!choice||(m.day===0&&!m.site))return null;const before={...m.resources};for(const [key,delta] of Object.entries(choice.delta))if(Object.hasOwn(m.resources,key))m.resources[key]=clamp(m.resources[key]+delta);const record={day:stage.dayNumber||m.day+1,stageIndex:m.day,choiceIndex:index,choiceId:choice.id,site:m.site,siteName:m.siteName||null,title:choice.title,why:choice.why,delta:{...choice.delta},before,after:{...m.resources}};m.history.push(record);m.xp+=50;if(Object.values(m.resources).some(v=>v<=0)){m.phase="complete";m.result="interrupted";m.xp+=25;}else if(m.day===DAYS.length-1){m.phase="complete";m.result="success";m.xp+=100;}else m.phase="debrief";return record;}
const STATION_TASKS={
habitat:{delta:{shield:6,oxygen:2}},
oxygen:{delta:{oxygen:10,power:-8}},
solar:{delta:{power:12}},
greenhouse:{delta:{water:8,food:8,power:-4}},
rover:{delta:{shield:4,power:-4}}
};
export function completeStationTask(m,id){
 if(!m||!m.started||!["active","debrief"].includes(m.phase)||!Object.hasOwn(STATION_TASKS,id))return null;
 if(!Array.isArray(m.stationTasks))m.stationTasks=[];
 if(m.stationTasks.includes(id))return null;
 const before={...m.resources},delta={...STATION_TASKS[id].delta};
 for(const [key,value] of Object.entries(delta))if(Object.hasOwn(m.resources,key))m.resources[key]=clamp(m.resources[key]+value);
 m.stationTasks.push(id);m.xp+=25;
 return{id,delta,before,after:{...m.resources},xp:25};
}
export function nextDay(m){if(!m||m.phase!=="debrief"||m.day>=DAYS.length-1)return false;m.day++;m.phase="active";return true;}
export function badges(m){const ids=m.history.map(x=>x.choiceId);const earned=[];if(m.resources.shield>90)earned.push({id:"crew-guardian",en:"Crew Guardian",ar:"حارس الطاقم",icon:"🛡️"});if(m.history.every(x=>Math.min(x.before.power,x.after.power)>=30))earned.push({id:"energy-engineer",en:"Energy Engineer",ar:"مهندس الطاقة",icon:"⚡"});if(ids.includes("isru")&&ids.includes("water-recovery")&&ids.includes("greenhouse"))earned.push({id:"sustainable-commander",en:"Sustainable Commander",ar:"القائد المستدام",icon:"🌱",hidden:true});return earned;}
export function summary(m){return{score:score(m),xp:m.xp,decisions:m.history.length,result:m.result,resources:{...m.resources},history:[...m.history],site:m.site,siteName:m.siteName||null,badges:badges(m)};}
