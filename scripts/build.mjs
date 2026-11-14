import {cp,mkdir,rm} from "node:fs/promises";
import {resolve} from "node:path";

const root = process.cwd();
const out = resolve(root, "www");

// Keep the packaged Android/PWA bundle complete: index.html references
// styles/theme-polish.css, so the entire styles directory must be copied.
const entries = [
  "index.html",
  "styles.css",
  "styles",
  "manifest.webmanifest",
  "service-worker.js",
  "favicon.svg",
  "src",
  "assets",
  "data"
];

await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});

for (const entry of entries) {
  await cp(resolve(root, entry), resolve(out, entry), {recursive: true});
}

await mkdir(resolve(out, "vendor"), {recursive: true});
// Three.js 0.180 uses a sibling core module; both files must ship together.
await cp(resolve(root, "node_modules/three/build/three.module.js"), resolve(out, "vendor/three.module.js"));
await cp(resolve(root, "node_modules/three/build/three.core.js"), resolve(out, "vendor/three.core.js"));

console.log("Built TECNOVA web bundle in " + out);
