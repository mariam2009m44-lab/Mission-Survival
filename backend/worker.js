const encoder = new TextEncoder();
const DEFAULT_ORIGINS = [
  "https://mariam2009m44-lab.github.io",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "https://localhost"
];
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
});
const base64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const fromBase64url = value => Uint8Array.from(atob(value.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
const safeAvatar = value => ["blue","purple","gold","green"].includes(value) ? value : "blue";
const safeLanguage = value => value === "en" ? "en" : "ar";

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(",")).split(",").map(x=>x.trim()).filter(Boolean);
  if (origin && !allowed.includes(origin)) return null;
  return {
    "access-control-allow-origin": origin || allowed[0],
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "Authorization,Content-Type",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}
async function issueToken(commanderId, secret) {
  const payload = base64url(encoder.encode(JSON.stringify({sub:commanderId,exp:Math.floor(Date.now()/1000)+60*60*24*30})));
  return payload+"."+await sign(payload,secret);
}
async function verifyToken(request, env) {
  const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i,"");
  const [payload,signature,...rest] = token.split(".");
  if (!payload || !signature || rest.length || !env.SESSION_SECRET) return null;
  const expected = await sign(payload,env.SESSION_SECRET);
  if (signature.length !== expected.length) return null;
  let diff = 0; for(let i=0;i<signature.length;i++) diff |= signature.charCodeAt(i)^expected.charCodeAt(i);
  if(diff) return null;
  try { const data=JSON.parse(new TextDecoder().decode(fromBase64url(payload))); return data.exp>Date.now()/1000?data.sub:null; } catch { return null; }
}

export function validateProgress(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const trainingDone = Array.isArray(input.trainingDone) ? input.trainingDone.filter(x=>typeof x==="string" && /^[a-z0-9_-]{1,40}$/i.test(x)).slice(0,20) : [];
  const statsIn = input.stats && typeof input.stats==="object" ? input.stats : {};
  const number = (v,max) => Number.isFinite(Number(v)) ? Math.max(0,Math.min(max,Math.floor(Number(v)))) : 0;
  let mission = null;
  if(input.mission && typeof input.mission==="object") {
    const m=input.mission;
    mission={
      difficulty:["training","standard","expert"].includes(m.difficulty)?m.difficulty:"standard",
      started:Boolean(m.started),
      phase:["briefing","active","debrief","complete"].includes(m.phase)?m.phase:"briefing",
      day:number(m.day,4),
      site:typeof m.site==="string"?m.site.slice(0,40):null,
      siteName:typeof m.siteName==="string"?m.siteName.slice(0,60):null,
      xp:number(m.xp,1000000),result:["success","interrupted"].includes(m.result)?m.result:null,saved:Boolean(m.saved),
      resources:{}
    };
    for(const key of ["power","oxygen","water","food","shield"]) mission.resources[key]=number(m.resources?.[key],100);
    mission.history=Array.isArray(m.history)?m.history.slice(-5).map(row=>({
      day:number(row.day,5),stageIndex:number(row.stageIndex,4),choiceIndex:number(row.choiceIndex,1),
      choiceId:typeof row.choiceId==="string"?row.choiceId.slice(0,50):"",
      title:typeof row.title==="string"?row.title.slice(0,120):"",why:typeof row.why==="string"?row.why.slice(0,500):"",
      site:typeof row.site==="string"?row.site.slice(0,40):null,
      delta:row.delta&&typeof row.delta==="object"?Object.fromEntries(Object.entries(row.delta).filter(([k,v])=>["power","oxygen","water","food","shield"].includes(k)&&Number.isFinite(Number(v))).map(([k,v])=>[k,Math.max(-100,Math.min(100,Number(v)))])): {}
    })): [];
  }
  return {
    schemaVersion:1,
    language:safeLanguage(input.language),
    trainingDone,
    stats:{missions:number(statsIn.missions,100000),totalXp:number(statsIn.totalXp,10000000),bestScore:number(statsIn.bestScore,100)},
    mission
  };
}

async function handle(request, env) {
  const cors=corsHeaders(request,env);
  if(!cors) return json({error:"origin_not_allowed"},403);
  if(request.method==="OPTIONS") return new Response(null,{status:204,headers:cors});
  const url=new URL(request.url),path=url.pathname.replace(/\/$/,"")||"/";
  if(path==="/health"&&request.method==="GET") return json({ok:true,service:"lunar-outpost-api",version:1},200,cors);
  if(!env.DB) return json({error:"database_not_configured"},503,cors);
  if(!env.SESSION_SECRET || env.SESSION_SECRET.length<32) return json({error:"server_secret_not_configured"},503,cors);
  if(path==="/v1/session"&&request.method==="POST"){
    let body;try{body=await request.json();}catch{return json({error:"invalid_json"},400,cors);}
    const id=crypto.randomUUID(),avatar=safeAvatar(body?.avatar),language=safeLanguage(body?.language),now=new Date().toISOString();
    await env.DB.prepare("INSERT INTO commanders (id, avatar, language, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").bind(id,avatar,language,now,now).run();
    const token=await issueToken(id,env.SESSION_SECRET);
    return json({commanderId:id,token,expiresIn:2592000},201,cors);
  }
  const commanderId=await verifyToken(request,env);
  if(!commanderId) return json({error:"unauthorized"},401,cors);
  if(path==="/v1/state"&&request.method==="GET"){
    const row=await env.DB.prepare("SELECT data_json, version, updated_at FROM commander_progress WHERE commander_id=?").bind(commanderId).first();
    return json({state:row?JSON.parse(row.data_json):null,version:row?.version||0,updatedAt:row?.updated_at||null},200,cors);
  }
  if(path==="/v1/state"&&request.method==="PUT"){
    const length=Number(request.headers.get("Content-Length")||0);
    if(length>24000) return json({error:"payload_too_large"},413,cors);
    let body;try{body=await request.json();}catch{return json({error:"invalid_json"},400,cors);}
    const state=validateProgress(body?.state);
    if(!state) return json({error:"invalid_state"},400,cors);
    const data=JSON.stringify(state),now=new Date().toISOString();
    await env.DB.prepare("INSERT INTO commander_progress (commander_id,data_json,version,updated_at) VALUES (?,?,1,?) ON CONFLICT(commander_id) DO UPDATE SET data_json=excluded.data_json,version=commander_progress.version+1,updated_at=excluded.updated_at").bind(commanderId,data,now).run();
    await env.DB.prepare("UPDATE commanders SET updated_at=?, language=? WHERE id=?").bind(now,state.language,commanderId).run();
    const row=await env.DB.prepare("SELECT version FROM commander_progress WHERE commander_id=?").bind(commanderId).first();
    return json({saved:true,version:row.version,updatedAt:now},200,cors);
  }
  return json({error:"not_found"},404,cors);
}

export default { fetch: handle };
