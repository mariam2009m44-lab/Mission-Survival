import {KEY} from "./data.js";
export function initialState(){return{language:"en",introSeen:false,welcomeGuideDone:false,welcomeGuideStep:0,view:"overview",difficulty:"standard",commander:null,trainingDone:[],quizFeedback:{},mission:null,stats:{missions:0,totalXp:0,bestScore:0},missionArchive:[],feed:{status:"idle",events:[]},soundEnabled:true,musicEnabled:true};}
export function loadState(){try{const saved=JSON.parse(localStorage.getItem(KEY)||"null");if(!saved)return initialState();const base=initialState();return{...base,...saved,language:saved.language==="ar"?"ar":"en",trainingDone:Array.isArray(saved.trainingDone)?saved.trainingDone:[],quizFeedback:{...(saved.quizFeedback||{})},stats:{...base.stats,...(saved.stats||{})},missionArchive:Array.isArray(saved.missionArchive)?saved.missionArchive:[],feed:{...base.feed,...(saved.feed||{})}};}catch{return initialState();}}
export function saveState(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
const PROFILES_KEY = "tecnova-local-profiles-v1";
export function loadProfiles() {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
    return Array.isArray(value) ? value.filter(x => x && typeof x.id === "string" && x.state && x.state.commander).slice(-8) : [];
  } catch { return []; }
}
export function saveProfiles(profiles) {
  try { localStorage.setItem(PROFILES_KEY, JSON.stringify(Array.isArray(profiles) ? profiles.slice(-8) : [])); return true; }
  catch { return false; }
}
