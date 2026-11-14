import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const main = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
const css = await readFile(new URL("../styles/layout-system.css", import.meta.url), "utf8");

test("a successful first campaign unlocks a distinct second systems challenge", () => {
  assert.match(main, /data-action="next-challenge"/);
  assert.match(main, /CHALLENGE_TWO_ORDER=\["habitat","oxygen","solar","greenhouse","rover"\]/);
  assert.match(main, /function challengeTwo\(/);
  assert.match(main, /case"challenge-two-answer"/);
  assert.match(main, /systems-integrator/);
  assert.match(main, /answerOrder\.splice/);
  assert.match(main, /lastExplanation/);
  assert.match(main, /ADVANCED CHALLENGE/);
  assert.match(main, /settingsOpen=false;break;}case"tour-next"/);
});

test("challenge two has responsive question cards and progress feedback", () => {
  assert.match(css, /challenge-two-progress/);
  assert.match(css, /challenge-two-option/);
  assert.match(css, /challenge-two-feedback/);
  assert.match(css, /@media\(max-width:640px\)/);
});
