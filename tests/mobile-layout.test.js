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

test("mobile-only control overrides do not alter desktop layout", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  const mobileLayout = worldCss.slice(worldCss.lastIndexOf("/* Mobile-only two-thumb layout"));
  assert.match(mobileLayout, /@media\(max-width:760px\)/);
  assert.doesNotMatch(mobileLayout, /@media\(min-width:/);
});


test("mobile 3D cockpit keeps HUD actions in the content column and camera controls separate", async () => {
  const worldCss = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");
  const responsive = worldCss.slice(worldCss.lastIndexOf("/* Responsive cockpit pass"));
  assert.match(responsive, /grid-template-columns:8px minmax\(0,1fr\)!important/);
  assert.match(responsive, /\.scene-auto-walk\{[\s\S]*?grid-column:2!important/);
  assert.match(responsive, /\.scene-camera-switch\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(responsive, /\.scene-child-tip\{display:none\}/);
  assert.match(responsive, /\.scene-focus\{[\s\S]*?flex-wrap:nowrap/);
});
