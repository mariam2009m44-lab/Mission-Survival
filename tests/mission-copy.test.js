import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const data = await readFile(new URL("../src/data.js", import.meta.url), "utf8");

test("English and Arabic mission copy matches the five-day campaign", () => {
  assert.match(data, /five-day lunar outpost exercise/i);
  assert.match(data, /five-day mission to generate your report/i);
  assert.match(data, /لمدة خمسة أيام/);
  assert.match(data, /الأيام الخمسة/);
  assert.doesNotMatch(data, /three-day|three days|ثلاثة أيام|الأيام الثلاثة/i);
});
