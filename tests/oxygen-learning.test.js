import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const main = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../styles/kids-world.css", import.meta.url), "utf8");

test("low oxygen alerts include bilingual learning questions and recovery remains available", () => {
  assert.match(main, /OXYGEN KNOWLEDGE CHECK/);
  assert.match(main, /اختبار معرفة الأكسجين/);
  assert.match(main, /0\.84 kg \/ person-day/);
  assert.match(main, /4\.2 psi/);
  assert.match(main, /data-action="oxygen-quiz"/);
  assert.match(main, /case"oxygen-quiz"/);
  assert.match(main, /case"resource-response"/);
  assert.match(main, /NASA Life Support Requirements/);
  assert.match(main, /NASA OCHMO ECLSS/);
});

test("oxygen knowledge check is styled for narrow mobile screens and feedback states", () => {
  assert.match(styles, /\.oxygen-learning-card/);
  assert.match(styles, /\.oxygen-quiz-option\.correct/);
  assert.match(styles, /\.oxygen-quiz-option\.incorrect/);
  assert.match(styles, /@media\(max-width:560px\)/);
});

test("four-astronaut oxygen shortage scenario rewards the safe B choice in simulation", async () => {
  assert.match(main, /A lunar habitat houses four astronauts/);
  assert.match(main, /Review oxygen consumption, postpone non-essential activities/);
  assert.match(main, /Reduce the cabin oxygen percentage without checking safety limits/);
  assert.match(main, /index===2/);
  assert.match(main, /applyScenarioResponse\(s\.mission,"oxygen","backup"\)/);
  assert.match(main, /\+14.*Oxygen|Resource impact/);
  assert.match(main, /once per mission/);
  assert.match(main, /Resource Management points/);
  const engine = await readFile(new URL("../src/engine.js", import.meta.url), "utf8");
  assert.match(engine, /postpone optional activities and activate the backup reserve/);
  assert.match(engine, /not a real spacecraft procedure/);
});
