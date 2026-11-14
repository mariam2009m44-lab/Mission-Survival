import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [scene,worldCss,baseCss]=await Promise.all([
 readFile(new URL("../src/scene3d.js",import.meta.url),"utf8"),
 readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8"),
 readFile(new URL("../styles.css",import.meta.url),"utf8")
]);

test("movement pad renders exactly four direct directional button children",()=>{
 const start=scene.indexOf('<div class="scene-pad"');
 assert.notEqual(start,-1,"movement pad markup exists");
 const end=scene.indexOf("</div>",start);
 assert.notEqual(end,-1,"movement pad closes");
 const markup=scene.slice(start,end+6);
 assert.equal((markup.match(/<button\\b/g)||[]).length,4);
 assert.equal((markup.match(/<div\\b/g)||[]).length,1,"no nested wrapper div");
 for(const direction of ["forward","back","left","right"]){
  assert.equal((markup.match(new RegExp('data-move="'+direction+'"',"g"))||[]).length,1);
 }
});

test("movement controls keep pointer capture, release handling and keyboard mapping",()=>{
 assert.match(scene,/setPointerCapture\\(e\\.pointerId\\)/);
 assert.match(scene,/addEventListener\\("pointerdown"/);
 assert.match(scene,/addEventListener\\("pointerup"/);
 assert.match(scene,/addEventListener\\("pointercancel"/);
 assert.match(scene,/addEventListener\\("lostpointercapture"/);
 assert.match(scene,/forward:\s*"w",\s*back:\s*"s",\s*left:\s*"a",\s*right:\s*"d"/);
 assert.match(scene,/movementButtons=root\\.querySelectorAll\\("\\.scene-pad > button\\[data-move\\]"\)/);
});

test("both stylesheet layers use the same explicit four-way CSS grid areas",()=>{
 const areas=/grid-template-areas:\s*["']\\. forward \\.["']\\s*["']left back right["']/;
 assert.match(baseCss,areas);
 assert.match(worldCss,areas);
 assert.match(worldCss,/\.lunar-3d-stage \.scene-pad>div\\{display:contents!important;flex:none!important\\}/);
 assert.match(worldCss,/@media\\(orientation:landscape\\) and \\(max-height:520px\\)/);
 assert.match(worldCss,/@media\\(max-width:360px\\)/);
});

test("NOVA eases its existing relative offset and preserves companion distance",()=>{
 assert.match(scene,/novaBaseOffset=new THREE\\.Vector3\\(1\\.55,0,-1\\.15\\)/);
 assert.match(scene,/novaFollowYaw\+=followTurn\\*\\(1-Math\\.exp\\(-dt\\*5\\.5\\)\\)/);
 assert.match(scene,/nova\\.position\\.lerp\\(novaTargetPosition,1-Math\\.exp\\(-dt\\*9\\)\\)/);
 assert.match(scene,/novaRelativePosition\\.setLength\\(novaBaseOffset\\.length\\(\\)\\)/);
 assert.match(scene,/nova\\.rotation\\.y\+=novaTurn\\*\\(1-Math\\.exp\\(-dt\\*8\\)\\)/);
});
