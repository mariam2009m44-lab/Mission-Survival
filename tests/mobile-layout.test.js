import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../styles/kids-comfort.css", import.meta.url), "utf8");

test("mobile navigation reserves five readable touch targets", () => {
  assert.match(css, /\.mobile-nav\{[\s\S]*?grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(css, /\.mobile-nav button\{[\s\S]*?min-height:54px/);
  assert.match(css, /\.mobile-nav button span:last-child\{[\s\S]*?white-space:normal/);
});

test("NOVA launcher and panel stay above the bottom navigation dock", () => {
  assert.match(css, /\.nova-launcher\{[\s\S]*?bottom:calc\(78px \+ env\(safe-area-inset-bottom\)\)!important/);
  assert.match(css, /\.nova-panel\{[\s\S]*?bottom:calc\(142px \+ env\(safe-area-inset-bottom\)\)!important/);
});


test("3D movement pad uses four explicit grid areas and large touch targets", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  assert.match(worldCss, /grid-template-areas:"\. forward \." "left back right"/);
  assert.match(worldCss, /grid-template-columns:48px minmax\(132px,148px\) 48px!important/);
  assert.match(worldCss, /grid-template-rows:50px 46px!important/);
  assert.match(worldCss, /\.scene-pad>\[data-move\]/);
  assert.match(worldCss, /\.scene-pad>\[data-move="forward"\]\{grid-area:forward/);
  assert.match(worldCss, /right:14px!important/);
  assert.match(worldCss, /height:100%!important;min-width:0!important;min-height:0!important/);
});

test("forward movement button includes a clear bilingual hold instruction", async () => {
  const scene = await readFile(new URL("../src/scene3d.js", import.meta.url), "utf8");
  assert.match(scene, /class="scene-forward-button" data-move="forward"/);
  assert.match(scene, /HOLD TO WALK/);
  assert.match(scene, /اضغطي مطولًا للتحرك/);
});

test("station action reserves space for the side-mounted D-pad on narrow phones", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  assert.match(worldCss, /@media\(max-width:760px\)\{[\s\S]*?\.scene-interact\{[\s\S]*?max-width:calc\(100% - 190px\)!important/);
  assert.match(worldCss, /@media\(max-width:360px\)\{[\s\S]*?\.scene-interact\{[\s\S]*?max-width:calc\(100% - 184px\)!important/);
});


test("mobile 3D controls use the same direct-child grid on narrow screens", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  const unified = worldCss.slice(worldCss.lastIndexOf("TECNOVA unified four-direction movement pad"));
  assert.match(unified, /@media\(max-width:760px\)/);
  assert.match(unified, /grid-template-areas:"\. forward \." "left back right"/);
  assert.match(unified, /grid-template-columns:42px minmax\(112px,132px\) 42px!important/);
  assert.match(unified, /left:8px!important/);
  assert.doesNotMatch(unified, /\.scene-pad\s*>\s*div/);
});

test("desktop 3D controls retain their original right-pad and centered action layout", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  const desktop = worldCss.slice(worldCss.lastIndexOf("/* Desktop keeps its original centered action"));
  assert.match(desktop, /@media\(min-width:761px\)/);
  assert.match(desktop, /\.scene-pad\{[\s\S]*?right:12px!important/);
  assert.match(desktop, /\.scene-interact\{[\s\S]*?left:50%!important[\s\S]*?translateX\(-50%\)!important/);
});


test("mobile 3D cockpit keeps HUD actions in the content column and camera controls separate", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  const responsive = worldCss.slice(worldCss.lastIndexOf("/* Responsive cockpit pass"));
  assert.match(responsive, /grid-template-columns:8px minmax\(0,1fr\)!important/);
  assert.match(responsive, /\.scene-hud \.scene-auto-walk\{[\s\S]*?grid-column:2!important/);
  assert.match(responsive, /\.scene-camera-switch\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(responsive, /\.scene-child-tip\{display:none\}/);
  assert.match(responsive, /\.scene-focus\{[\s\S]*?flex-wrap:nowrap/);
});

test("3D touch controls retain separate action zones and compact landscape grid sizing",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const unified=css.slice(css.lastIndexOf("TECNOVA unified four-direction movement pad"));
 assert.match(unified,/\.lunar-3d-stage \.scene-pad\{/);
 assert.match(unified,/\.lunar-3d-stage \.scene-interact/);
 assert.match(unified,/orientation:landscape\) and \(max-height:520px/);
 assert.match(unified,/grid-template-columns:42px minmax\(112px,124px\) 42px!important/);
 assert.match(unified,/grid-template-rows:46px 42px!important/);
});

test("final 3D movement cascade consistently places all four direct-child controls",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const finalCss=css.slice(css.lastIndexOf("TECNOVA unified four-direction movement pad"));
 assert.match(finalCss,/grid-template-areas:"\. forward \." "left back right"/);
 assert.match(finalCss,/\[data-move="left"\]\{grid-area:left/);
 assert.match(finalCss,/\[data-move="back"\]\{grid-area:back/);
 assert.match(finalCss,/\[data-move="right"\]\{grid-area:right/);
 assert.match(finalCss,/@media\(orientation:landscape\) and \(max-height:520px\)/);
});

test("small landscape tablets keep the compact two-thumb cockpit after desktop rules",async()=>{
 const worldCss=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const compact=worldCss.slice(worldCss.lastIndexOf("Small tablets in landscape"));
 assert.match(compact,/min-width:761px/);
 assert.match(compact,/max-width:900px/);
 assert.match(compact,/\.scene-viewport\{height:100svh!important/);
 assert.match(compact,/\.scene-pad\{left:7px!important[\s\S]*?width:130px!important/);
 assert.match(compact,/\.scene-interact\{left:auto!important;right:7px!important[\s\S]*?width:108px!important/);
});

test("mobile cockpit keeps camera, status, movement and station action in separate touch zones",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const cockpit=css.slice(css.lastIndexOf("MOBILE COCKPIT REBUILD v2"));
 assert.match(cockpit,/height:clamp\(460px,76svh,650px\)!important/);
 assert.match(cockpit,/\.scene-camera-switch\{[\s\S]*?top:8px!important[\s\S]*?height:40px!important/);
 assert.match(cockpit,/\.scene-hud\{[\s\S]*?top:56px!important[\s\S]*?max-height:calc\(100% - 188px\)!important/);
 assert.match(cockpit,/\.scene-pad\{[\s\S]*?left:8px!important[\s\S]*?bottom:calc\(8px \+ env\(safe-area-inset-bottom,0px\)\)!important/);
 assert.match(cockpit,/\.scene-interact\{[\s\S]*?right:8px!important[\s\S]*?width:104px!important/);
 assert.doesNotMatch(cockpit,/\.scene-pad\s*>\s*div/);
});

test("mobile cockpit v2 has dedicated compact rules for narrow phones and landscape devices",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const cockpit=css.slice(css.lastIndexOf("MOBILE COCKPIT REBUILD v2"));
 assert.match(cockpit,/@media\(max-width:360px\)/);
 assert.match(cockpit,/@media\(orientation:landscape\) and \(max-height:520px\) and \(max-width:900px\)/);
});


test("3D movement keys are cleared when the app loses focus or is backgrounded",async()=>{
 const scene=await readFile(new URL("../src/scene3d.js",import.meta.url),"utf8");
 assert.match(scene,/const clearMovementInput = \(\) => keys\.clear\(\)/);
 assert.match(scene,/window\.addEventListener\("blur", clearMovementInput\)/);
 assert.match(scene,/document\.addEventListener\("visibilitychange", clearMovementInput\)/);
 assert.match(scene,/window\.removeEventListener\("blur", clearMovementInput\)/);
 assert.match(scene,/document\.removeEventListener\("visibilitychange", clearMovementInput\)/);
});

test("landscape movement buttons retain 42px touch targets and visible keyboard focus",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const unified=css.slice(css.lastIndexOf("TECNOVA unified four-direction movement pad"));
 assert.match(unified,/grid-template-rows:46px 42px!important/);
 assert.match(unified,/grid-template-columns:42px minmax\(112px,124px\) 42px!important/);
 assert.match(unified,/focus-visible/);
});

test("final D-pad spacing reserves a full lower arrow row without clipping",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const fix=css.slice(css.lastIndexOf("FINAL D-PAD SPACING FIX"));
 assert.match(fix,/height:122px!important;min-height:122px!important/);
 assert.match(fix,/grid-template-rows:16px 42px 42px!important/);
 assert.match(fix,/bottom:calc\(14px \+ env\(safe-area-inset-bottom,0px\)\)!important/);
 assert.match(fix,/overflow:visible!important/);
 assert.match(fix,/@media\(max-width:360px\)[\s\S]*?height:112px!important/);
 assert.match(fix,/@media\(orientation:landscape\) and \(max-height:520px\)[\s\S]*?height:116px!important/);
});
