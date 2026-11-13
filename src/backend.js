import {API_BASE_URL} from "./backend-config.js";
const SESSION_KEY="lunar-outpost-cloud-session-v1";
let timer=null,lastState=null,syncStatus="local";
const enabled=()=>Boolean(API_BASE_URL&&/^https:\/\//.test(API_BASE_URL));
const readSession=()=>{try{return JSON.parse(localStorage.getItem(SESSION_KEY)||"null");}catch{return null;}};
const writeSession=value=>{try{localStorage.setItem(SESSION_KEY,JSON.stringify(value));}catch{}};
async function request(path,options={},token=null){
  const response=await fetch(API_BASE_URL.replace(/\/$/,"")+path,{...options,headers:{"content-type":"application/json",...(token?{authorization:"Bearer "+token}:{}),...(options.headers||{})}});
  const data=await response.json().catch(()=>({error:"invalid_response"}));
  if(!response.ok)throw new Error(data.error||"api_error_"+response.status);
  return data;
}
function snapshot(state){
  const m=state.mission;
  return {
    language:state.language==="en"?"en":"ar",
    trainingDone:Array.isArray(state.trainingDone)?state.trainingDone.slice(0,20):[],
    stats:{missions:state.stats?.missions||0,totalXp:state.stats?.totalXp||0,bestScore:state.stats?.bestScore||0},
    mission:m?{difficulty:m.difficulty,started:m.started,phase:m.phase,day:m.day,site:m.site,siteName:m.siteName,resources:m.resources,history:m.history}:null
  };
}
async function sessionFor(state){
  let session=readSession();
  if(session?.token&&session?.commanderId)return session;
  const created=await request("/v1/session",{method:"POST",body:JSON.stringify({avatar:state.commander?.avatar,language:state.language})});
  session={token:created.token,commanderId:created.commanderId};writeSession(session);return session;
}
export async function syncNow(state){
  if(!enabled()){syncStatus="local";return{status:"local"};}
  try{
    const session=await sessionFor(state);
    const result=await request("/v1/state",{method:"PUT",body:JSON.stringify({state:snapshot(state)})},session.token);
    syncStatus="synced";return{status:"synced",version:result.version};
  }catch(error){
    syncStatus="offline";return{status:"offline",error:error.message};
  }
}
export function scheduleSync(state){
  lastState=state;
  if(!enabled()){syncStatus="local";return;}
  clearTimeout(timer);
  timer=setTimeout(()=>{if(lastState)syncNow(lastState);},900);
}
export function getSyncStatus(){return enabled()?syncStatus:"local";}
export function isCloudEnabled(){return enabled();}

if(typeof window!=="undefined")window.addEventListener("online",()=>{if(lastState&&enabled())syncNow(lastState);});
