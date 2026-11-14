import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const scene = await readFile(new URL("../src/scene3d.js", import.meta.url), "utf8");
const kidsWorld = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
const baseCss = await readFile(new URL("../styles.css", import.meta.url), "utf8");

test("forward and backward movement follow the camera viewing direction", () => {
  assert.match(scene, /const dx=x\*Math\.cos\(azimuth\)-z\*Math\.sin\(azimuth\);const dz=-x\*Math\.sin\(azimuth\)-z\*Math\.cos\(azimuth\);/);
  assert.match(scene, /camera\.lookAt\(px-Math\.sin\(azimuth\)\*12,1\.5,pz-Math\.cos\(azimuth\)\*12\)/);
  const azimuth = 0.72;
  const forward = { x: -Math.sin(azimuth), z: -Math.cos(azimuth) };
  const backward = { x: Math.sin(azimuth), z: Math.cos(azimuth) };
  assert.ok(forward.x < 0 && forward.z < 0);
  assert.ok(backward.x > 0 && backward.z > 0);
});

test("the 3D canvas can receive keyboard focus on desktop", () => {
  assert.match(scene, /canvas\?\.setAttribute\("tabindex","0"\)/);
  assert.match(scene, /canvas\.focus\(\{preventScroll:true\}\)/);
});

test("touch movement controls map all four directions to the expected keys", () => {
  assert.match(scene, /forward: "w", back: "s", left: "a", right: "d"/);
  assert.match(scene, /btn\.addEventListener\("pointercancel", \(\) => set\(false\)\)/);
  assert.match(scene, /btn\.addEventListener\("lostpointercapture", \(\) => set\(false\)\)/);
});


test("NOVA follows smoothly with its original relative offset and stable distance", () => {
  assert.ok(scene.includes("novaBaseOffset=new THREE.Vector3(1.55,0,-1.15)"));
  assert.match(scene, /novaFollowYaw\+=followTurn/);
  assert.match(scene, /novaRotatedOffset\.copy\(novaBaseOffset\)\.applyAxisAngle\(novaUpAxis,novaFollowYaw\)/);
  assert.match(scene, /novaTargetPosition\.set\(px\+novaRotatedOffset\.x/);
  assert.match(scene, /nova\.position\.lerp\(novaTargetPosition,1-Math\.exp\(-dt\*9\)\)/);
  assert.doesNotMatch(scene, /novaRelativePosition|setLength\(novaBaseOffset\.length\(\)\)/);
  assert.match(scene, /nova\.position\.lerp\(novaTargetPosition,1-Math\.exp\(-dt\*9\)\)/);
  assert.match(scene, /nova\.rotation\.y\+=novaTurn\*\(1-Math\.exp\(-dt\*8\)\)/);
  assert.match(scene, /Math\.sin\(clock\.elapsedTime\*2\.1\)\*\.12/);
  assert.match(scene, /btn\.style\.touchAction = "none"/);
  assert.match(scene, /pointerleave/);
});


test("3D rendering pauses in the background and resumes when the app is visible", () => {
  assert.match(scene, /const handleVisibilityChange = \(\) => \{/);
  assert.match(scene, /if \(document\.hidden && !renderer\.xr\.isPresenting\) renderer\.setAnimationLoop\(null\)/);
  assert.match(scene, /else renderer\.setAnimationLoop\(animate\)/);
  assert.match(scene, /document\.addEventListener\("visibilitychange", handleVisibilityChange\)/);
  assert.match(scene, /document\.removeEventListener\("visibilitychange", handleVisibilityChange\)/);
});

test("astronaut has articulated arm and leg pivots with a movement-driven walk cycle", () => {
  assert.match(scene, /const animatedLimbs=\{arms:\[\],legs:\[\]\}/);
  assert.match(scene, /walkBlend=THREE\.MathUtils\.damp/);
  assert.match(scene, /animatedLimbs\.arms\.forEach/);
  assert.match(scene, /animatedLimbs\.legs\.forEach/);
  assert.match(scene, /const stride=Math\.sin\(t\*10\.5\)\*walkBlend/);
});

test("rover has detailed wheel hubs, tread lugs, and a scanning sensor mast", () => {
  assert.match(scene, /const roverWheels=\[\]/);
  assert.match(scene, /const treadMat=mat\(0x718198/);
  assert.match(scene, /const mastPivot=new THREE\.Group\(\)/);
  assert.match(scene, /mastPivot\.rotation\.y=Math\.sin\(t\*\.42\)\*\.62/);
});

test("mobile players get a large bilingual press-and-hold forward button", () => {
  assert.match(scene, /class="scene-forward-button" data-move="forward"/);
  assert.match(scene, /HOLD TO WALK/);
  assert.match(scene, /aria-pressed="false"/);
  assert.match(scene, /btn\.setAttribute\("aria-pressed", String\(on\)\)/);
  assert.match(scene, /btn\.classList\.toggle\("is-moving", on\)/);
});
test("astronaut life-support pack has twin oxygen cylinders and a live status indicator", () => {
  assert.match(scene, /const lifeSupportTanks=\[\]/);
  assert.match(scene, /lifeSupportStatus\.material\.emissiveIntensity/);
});


test("movement controls render as exactly four direct grid children with explicit areas", () => {
  const pad = scene.match(/<div class="scene-pad" role="group"[\s\S]*?<\/div>/)?.[0] || "";
  assert.ok(pad, "movement pad markup should exist");
  assert.equal((pad.match(/data-move=/g) || []).length, 4);
  assert.equal((pad.match(/<button\b/g) || []).length, 4);
  assert.equal((pad.match(/<div\b/g) || []).length, 1, "no nested wrapper should remain inside .scene-pad");
  for (const direction of ["forward", "left", "back", "right"]) assert.match(pad, new RegExp('data-move="' + direction + '"'));
  assert.match(kidsWorld, /grid-template-areas:\s*"\. forward \." "left back right"/);
  for (const direction of ["forward", "left", "back", "right"]) assert.ok(kidsWorld.includes(`[data-move="${direction}"]{grid-area:${direction}`));
  assert.doesNotMatch(kidsWorld, /\.scene-pad\s*>\s*div/);
  assert.doesNotMatch(baseCss, /\.scene-pad\s*>\s*div/);
});

test("movement buttons preserve pointer capture and clear on release or cancellation", () => {
  assert.match(scene, /btn\.setPointerCapture\(e\.pointerId\)/);
  assert.match(scene, /btn\.addEventListener\("pointerup", \(\) => set\(false\)\)/);
  assert.match(scene, /btn\.addEventListener\("pointercancel", \(\) => set\(false\)\)/);
  assert.match(scene, /btn\.addEventListener\("lostpointercapture", \(\) => set\(false\)\)/);
});


test("NOVA does not snap sideways to force distance during a turn",()=>{
 assert.doesNotMatch(scene,/novaRelativePosition|setLength\(novaBaseOffset\.length\(\)\)/);
 assert.match(scene,/novaFollowYaw\+=followTurn\*\(1-Math\.exp\(-dt\*5\.5\)\)/);
 assert.match(scene,/nova\.position\.lerp\(novaTargetPosition,1-Math\.exp\(-dt\*9\)\)/);
});
test("shared stylesheet uses explicit four-direction grid areas",()=>{
 assert.match(baseCss,/grid-template-areas:\s*"\. forward \." "left back right"/);
 for(const direction of ["forward","left","back","right"]) assert.ok(baseCss.includes('[data-move="'+direction+'"]{grid-area:'+direction));
 assert.doesNotMatch(baseCss,/\.scene-pad\s*>\s*div/);
});
