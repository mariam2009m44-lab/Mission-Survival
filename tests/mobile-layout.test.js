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


test("3D movement pad stays side-mounted with large touch targets", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  assert.match(worldCss, /\.lunar-3d-stage \.scene-pad\{[\s\S]*?left:12px!important[\s\S]*?top:50%!important[\s\S]*?transform:translateY\(-50%\)!important/);
  assert.match(worldCss, /\.lunar-3d-stage \.scene-pad>button,[\s\S]*?width:52px!important[\s\S]*?height:52px!important/);
  assert.match(worldCss, /\.lunar-3d-stage \.scene-interact\{[\s\S]*?right:14px!important/);
});


test("movement pad includes a clear label for first-time players", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  assert.match(worldCss, /\.lunar-3d-stage \.scene-pad::before\{[\s\S]*?content:"MOVE"/);
  assert.match(worldCss, /html\[dir="rtl"\] \.lunar-3d-stage \.scene-pad::before\{[\s\S]*?content:"حركة"/);
});


test("station action reserves space for the side-mounted D-pad on narrow phones", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  assert.match(worldCss, /@media\(max-width:760px\)\{[\s\S]*?\.scene-interact\{[\s\S]*?max-width:calc\(100% - 190px\)!important/);
  assert.match(worldCss, /@media\(max-width:360px\)\{[\s\S]*?\.scene-interact\{[\s\S]*?max-width:calc\(100% - 184px\)!important/);
});


test("mobile 3D controls use a compact left-hand D-pad and right-hand action area", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  const mobileLayout = worldCss.slice(worldCss.lastIndexOf("/* Mobile-only two-thumb layout"));
  assert.match(mobileLayout, /@media\(max-width:760px\)/);
  assert.match(mobileLayout, /grid-template-columns:repeat\(3,46px\)/);
  assert.match(mobileLayout, /\.scene-pad>div\{\s*display:contents!important/);
  assert.match(mobileLayout, /left:calc\(10px \+ env\(safe-area-inset-left,0px\)\)!important/);
  assert.match(mobileLayout, /right:calc\(10px \+ env\(safe-area-inset-right,0px\)\)!important/);
  assert.match(mobileLayout, /@media\(orientation:landscape\) and \(max-height:520px\)/);
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

test("3D touch controls use separate non-overlapping zones and retain compact landscape sizing",async()=>{const {readFile}=await import("node:fs/promises");const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");assert.match(css,/3D control zoning: keep camera, guidance, movement and interaction in separate lanes/);assert.match(css,/\.lunar-3d-stage \.scene-pad\{left:10px;bottom:10px/);assert.match(css,/\.lunar-3d-stage \.scene-interact\{right:10px;bottom:10px/);assert.match(css,/orientation:landscape\) and \(max-height:520px/);assert.match(css,/grid-template-columns:repeat\(3,42px\)/);});

test("final mobile 3D cascade separates camera bar, HUD, left movement pad and right action button",async()=>{const {readFile}=await import("node:fs/promises");const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");const i=css.lastIndexOf("Final cascade fix: override legacy");const finalCss=css.slice(i);assert.ok(i>0);assert.match(finalCss,/\.scene-camera-switch\{[\s\S]*?top:8px!important[\s\S]*?height:42px!important/);assert.match(finalCss,/\.scene-hud\{[\s\S]*?top:60px!important/);assert.match(finalCss,/\.scene-pad\{[\s\S]*?left:10px!important[\s\S]*?bottom:10px!important/);assert.match(finalCss,/\.scene-interact\{[\s\S]*?right:10px!important[\s\S]*?bottom:12px!important/);assert.match(finalCss,/@media\(orientation:landscape\) and \(max-height:520px\)/);});

test("small landscape tablets keep the compact two-thumb cockpit after desktop rules",async()=>{
 const worldCss=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const compact=worldCss.slice(worldCss.lastIndexOf("Small tablets in landscape"));
 assert.match(compact,/min-width:761px/);
 assert.match(compact,/max-width:900px/);
 assert.match(compact,/\.scene-viewport\{height:100svh!important/);
 assert.match(compact,/\.scene-pad\{left:7px!important[\s\S]*?width:130px!important/);
 assert.match(compact,/\.scene-interact\{left:auto!important;right:7px!important[\s\S]*?width:108px!important/);
});

test("mobile cockpit v2 keeps the camera, status, movement and station action in separate touch zones",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const cockpit=css.slice(css.lastIndexOf("MOBILE COCKPIT REBUILD v2"));
 assert.match(cockpit,/height:clamp\(460px,76svh,650px\)!important/);
 assert.match(cockpit,/\.scene-camera-switch\{[\s\S]*?top:8px!important[\s\S]*?height:40px!important/);
 assert.match(cockpit,/\.scene-hud\{[\s\S]*?top:56px!important[\s\S]*?max-height:calc\(100% - 188px\)!important/);
 assert.match(cockpit,/\.scene-pad\{[\s\S]*?left:8px!important[\s\S]*?bottom:calc\(8px \+ env\(safe-area-inset-bottom,0px\)\)!important/);
 assert.match(cockpit,/\.scene-interact\{[\s\S]*?right:8px!important[\s\S]*?width:104px!important/);
 assert.match(cockpit,/\.scene-pad>div\{display:contents!important/);
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

test("landscape movement buttons retain larger touch targets and visible keyboard focus",async()=>{
 const css=await readFile(new URL("../styles/kids-world.css",import.meta.url),"utf8");
 const refinement=css.slice(css.lastIndexOf("Landscape touch refinement"));
 assert.match(refinement,/grid-template-columns:repeat\(3,42px\)!important/);
 assert.match(refinement,/min-height:42px!important/);
 assert.match(refinement,/focus-visible/);
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
