import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../styles/layout-system.css", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const worker = await readFile(new URL("../service-worker.js", import.meta.url), "utf8");

test("shared layout system is loaded after feature styles", () => {
  assert.match(html, /styles\/layout-system\.css/);
  assert.ok(html.indexOf("account-portal.css") < html.indexOf("layout-system.css"));
});

test("shared layout system protects narrow screens and safe areas", () => {
  assert.match(css, /overflow-x:clip/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /@media\(max-width:390px\)/);
  assert.match(css, /@media\(orientation:landscape\) and \(max-height:520px\)/);
});

test("shared layout system keeps keyboard focus and reduced motion accessible", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});

test("service worker caches the shared layout stylesheet and uses a new cache version", () => {
  assert.match(worker, /lunar-outpost-app-v42/);
  assert.match(worker, /\.\/styles\/layout-system\.css/);
});
