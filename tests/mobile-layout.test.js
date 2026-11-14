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
