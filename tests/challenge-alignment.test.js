import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async path => readFile(new URL("../" + path, import.meta.url), "utf8");

test("Science Lab maps every official Junior Astronaut Mission Trainer requirement to a visible feature", async () => {
  const main = await read("src/main.js");
  assert.match(main, /NASA SPACE APPS 2026 · OFFICIAL CHALLENGE 03/);
  assert.match(main, /function challengeAlignment\(\)/);
  for (const phrase of ["OUTPOST OPERATIONS", "OXYGEN · WATER", "CREW SAFETY", "NASA ILLUMINATION MODEL", "GREENHOUSE · STORES", "STUDENTS · INTERACTIVE"]) {
    assert.ok(main.includes(phrase), "missing challenge mapping: " + phrase);
  }
  assert.match(main, /not calculations from NASA telemetry/i);
  assert.match(main, /challengeAlignment\(\)/);
});

test("the five-day mission keeps its science evidence distinct from illustrative game values", async () => {
  const days = await read("src/mission-days.js");
  const data = await read("src/data.js");
  const science = await read("data/mission-science.json");
  assert.match(days, /five-day mission/);
  assert.match(days, /dayTitles/);
  assert.match(data, /id:"illumination"/);
  assert.match(data, /id:"crater"/);
  assert.match(data, /id:"card"/);
  assert.match(data, /id:"eclss"/);
  assert.match(science, /NASA MODEL/);
  assert.match(science, /not direct readings inside a lunar surface habitat/);
});

test("competition readiness notes disclose product boundaries and the required submission path", async () => {
  const guide = await read("docs/COMPETITION-READINESS.md");
  assert.match(guide, /Build a Junior Astronaut Mission Trainer/);
  assert.match(guide, /11:59 PM local time/);
  assert.match(guide, /NOVA is a bilingual, curated/);
  assert.match(guide, /debug APK/);
  assert.match(guide, /AI assistance/);
});
