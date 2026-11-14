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
