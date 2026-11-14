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
 assert.equal(markup.split("<button").length-1,4);
 assert.equal(markup.split("<div").length-1,1,"no nested wrapper div");
 for(const direction of ["forward","back","left","right"]){
  assert.ok(markup.includes('data-move="'+direction+'"'));
 }
});

test("movement controls keep pointer capture, release handling and keyboard mapping",()=>{
 for(const token of [
  "btn.setPointerCapture(e.pointerId)",
  'btn.addEventListener("pointerdown"',
  'btn.addEventListener("pointerup"',
  'btn.addEventListener("pointercancel"',
  'btn.addEventListener("lostpointercapture"',
  'forward: "w", back: "s", left: "a", right: "d"',
  'const movementButtons=root.querySelectorAll(".scene-pad > button[data-move]")'
 ])assert.ok(scene.includes(token),"missing movement behavior: "+token);
});

test("both stylesheet layers use the same explicit four-way CSS grid areas",()=>{
 const areas='grid-template-areas:". forward ." "left back right"';
 assert.ok(baseCss.includes(areas));
 assert.ok(worldCss.includes(areas));
 assert.ok(worldCss.includes(".lunar-3d-stage .scene-pad>div{display:contents!important;flex:none!important}"));
 assert.ok(worldCss.includes("@media(orientation:landscape) and (max-height:520px)"));
 assert.ok(worldCss.includes("@media(max-width:360px)"));
});

test("NOVA eases its existing relative offset and preserves companion distance",()=>{
 for(const token of [
  "novaBaseOffset=new THREE.Vector3(1.55,0,-1.15)",
  "novaFollowYaw+=followTurn*(1-Math.exp(-dt*5.5))",
  "nova.position.lerp(novaTargetPosition,1-Math.exp(-dt*9))",
  "novaRelativePosition.setLength(novaBaseOffset.length())",
  "nova.rotation.y+=novaTurn*(1-Math.exp(-dt*8))"
 ])assert.ok(scene.includes(token),"missing NOVA following behavior: "+token);
});
