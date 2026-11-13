import {cp,mkdir,rm} from "node:fs/promises";
import {resolve} from "node:path";
const root=process.cwd(),out=resolve(root,"www");
const entries=["index.html","styles.css","manifest.webmanifest","service-worker.js","favicon.svg","src","assets","data"];
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const entry of entries)await cp(resolve(root,entry),resolve(out,entry),{recursive:true});
console.log("Built Lunar Outpost web bundle in "+out);