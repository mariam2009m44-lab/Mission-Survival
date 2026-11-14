import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const scene = await readFile(new URL("../src/scene3d.js", import.meta.url), "utf8");

test("forward and backward movement follow the camera viewing direction", () => {
  assert.match(scene, /const dx=x\*Math\.cos\(azimuth\)-z\*Math\.sin\(azimuth\);const dz=-x\*Math\.sin\(azimuth\)-z\*Math\.cos\(azimuth\);/);
  const azimuth = 0.72;
  const forward = { x: -Math.sin(azimuth), z: -Math.cos(azimuth) };
  const backward = { x: Math.sin(azimuth), z: Math.cos(azimuth) };
  assert.ok(forward.x < 0 && forward.z < 0);
  assert.ok(backward.x > 0 && backward.z > 0);
});

test("the 3D canvas can receive keyboard focus on desktop", () => {
  assert.match(scene, /canvas\?\.setAttribute\("tabindex","0"\)/);
  assert.match(scene, /canvas\.focus\(\{preventScroll:true\}\)/);
});

test("touch movement controls map all four directions to the expected keys", () => {
  assert.match(scene, /forward: "w", back: "s", left: "a", right: "d"/);
  assert.match(scene, /btn\.addEventListener\("pointercancel", \(\) => set\(false\)\)/);
  assert.match(scene, /btn\.addEventListener\("lostpointercapture", \(\) => set\(false\)\)/);
});
