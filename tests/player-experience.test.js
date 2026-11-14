import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async path => readFile(new URL("../" + path, import.meta.url), "utf8");
const [main, scene, css, worker] = await Promise.all([
  read("src/main.js"), read("src/scene3d.js"), read("styles/layout-system.css"), read("service-worker.js")
]);

test("player can reach sign-out and settings from the main application header", () => {
  assert.match(main, /class="profile-switch-trigger" data-action="switch-profile"/);
  assert.match(main, /class="profile-settings-trigger" data-action="settings"/);
  assert.match(main, /case"switch-profile"/);
  assert.match(main, /case"select-profile"/);
});

test("new explorers can sign in to the local profile portal and choose an astronaut and vehicle", () => {
  assert.match(main, /data-action="account-login"/);
  assert.match(main, /data-action="new-profile"/);
  assert.match(main, /data-avatar=/);
  assert.match(main, /data-vehicle=/);
  assert.match(main, /onboard-3d-preview/);
});

test("3D preview follows the selected identity and renders a selectable spacecraft", () => {
  assert.match(scene, /onboard-3d-preview/);
  assert.match(scene, /tecnova-preview-change/);
  assert.match(scene, /craftStyles/);
  assert.match(scene, /LUNA EXPLORER: broad solar wings/);
  assert.match(scene, /PIONEER: reinforced cargo carrier/);
  assert.match(scene, /new THREE.BoxGeometry\(4\.4/);
  assert.match(scene, /new THREE.BoxGeometry\(1\.35/);
  assert.match(scene, /MY SPACECRAFT/);
  assert.match(scene, /novaOffset/);
});

test("identity preview and profile controls stay usable on narrow screens", () => {
  assert.match(css, /profile-switch-trigger/);
  assert.match(css, /onboard-3d-preview/);
  assert.match(css, /@media\(max-width:700px\)/);
});

test("service worker advances the cache for the new player and 3D experience", () => {
  assert.match(worker, /lunar-outpost-app-v44/);
});
