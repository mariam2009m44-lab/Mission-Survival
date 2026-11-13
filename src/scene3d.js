const THREE_URL="https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
let mounted=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function addStylesFallback(root){
 root.classList.add("scene-fallback");
 const fallback=document.createElement("div");fallback.className="scene-fallback-art";fallback.innerHTML='<div class="fallback-earth"></div><div class="fallback-moon"></div><div class="fallback-habitat"></div><div class="fallback-rover"></div><div class="fallback-caption">LUNAR SOUTH POLE · 3D PREVIEW MODE</div>';
 root.append(fallback);
}
function makeScene(THREE,root){
 const canvas=root.querySelector("canvas");const scene=new THREE.Scene();scene.background=new THREE.Color(0x070d18);scene.fog=new THREE.FogExp2(0x070d18,.012);
 const camera=new THREE.PerspectiveCamera(43,1,.1,180);camera.position.set(15,12,19);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 scene.add(new THREE.HemisphereLight(0x9eb9df,0x1c2430,1.65));
 const sun=new THREE.DirectionalLight(0xffe6bd,3.2);sun.position.set(-12,18,9);scene.add(sun);
 const fill=new THREE.PointLight(0x4aa9ff,38,45);fill.position.set(7,7,-8);scene.add(fill);
 const terrainMat=new THREE.MeshStandardMaterial({color:0x69717c,roughness:1,metalness:0});
 const geo=new THREE.PlaneGeometry(54,54,120,120);geo.rotateX(-Math.PI/2);
 const pos=geo.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let h=.16*Math.sin(x*.7)*Math.cos(z*.52)+.09*Math.sin(x*1.9+z*.8);for(const c of [[-8,-4,3],[7,5,4],[-2,10,2.5],[12,-9,3]]){const d=Math.hypot(x-c[0],z-c[1]);h-=.62*Math.exp(-Math.pow(d/c[2],2)*2);h+=.17*Math.exp(-Math.pow((d-c[2]*.78)/.42,2));}pos.setY(i,h);}
 geo.computeVertexNormals();const ground=new THREE.Mesh(geo,terrainMat);ground.receiveShadow=true;scene.add(ground);
 const grid=new THREE.GridHelper(52,52,0x52677e,0x26384d);grid.position.y=-.12;grid.material.transparent=true;grid.material.opacity=.11;scene.add(grid);
 const craterMat=new THREE.MeshStandardMaterial({color:0x3e4856,roughness:1});
 for(const [x,z,r] of [[-8,-4,3],[7,5,4],[-2,10,2.5],[12,-9,3]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.12,8,64),new THREE.MeshStandardMaterial({color:0x89919a,roughness:1}));ring.rotation.x=Math.PI/2;ring.position.set(x,.03,z);scene.add(ring);const bowl=new THREE.Mesh(new THREE.CircleGeometry(r*.9,48),craterMat);bowl.rotation.x=-Math.PI/2;bowl.position.set(x,-.02,z);scene.add(bowl);}
 const mat=(color,metalness=.15,roughness=.55)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const white=mat(0xd5e1ed,.55,.35),dark=mat(0x25364b,.55,.42),gold=mat(0xc58d48,.6,.38),glass=new THREE.MeshPhysicalMaterial({color:0x3e83a8,metalness:.25,roughness:.16,transparent:true,opacity:.62});
 const group=new THREE.Group();scene.add(group);
 function box(w,h,d,m,x,y,z,parent=group){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o;}
 function cyl(rt,rb,h,m,x,y,z,parent=group){const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,24),m);o.position.set(x,y,z);parent.add(o);return o;}
 // Habitat: pressure cylinder, airlock and antenna.
 const habitat=new THREE.Group();habitat.position.set(-2,0,1);group.add(habitat);
 cyl(1.45,1.55,1.8,white,0,1,0,habitat);
 const dome=new THREE.Mesh(new THREE.SphereGeometry(1.44,32,18,0,Math.PI*2,0,Math.PI/2),glass);dome.position.y=1.9;habitat.add(dome);
 box(.8,1.05,.7,dark,1.75,.55,.1,habitat);cyl(.07,.07,1.8,gold,-.85,2.45,0,habitat);
 const dish=new THREE.Mesh(new THREE.SphereGeometry(.55,20,12,0,Math.PI),white);dish.position.set(-.85,3.3,0);dish.rotation.z=.4;habitat.add(dish);
 // Solar farm with blue photovoltaic cells.
 const solar=new THREE.Group();solar.position.set(4,0,-1);group.add(solar);
 for(let row=0;row<2;row++)for(let col=0;col<3;col++){const p=box(2.1,.09,1.25,new THREE.MeshStandardMaterial({color:0x174b79,metalness:.55,roughness:.25}),col*2.3,1.2,row*1.65,solar);p.rotation.x=-.22;for(let k=1;k<5;k++)box(.025,.018,1.2,mat(0x79c9ef,.5,.35),col*2.3-1.05+k*.42,1.26,row*1.65,solar);cyl(.06,.06,1.1,white,col*2.3, .55,row*1.65,solar);}
 // Lander.
 const lander=new THREE.Group();lander.position.set(-8,0,-5);group.add(lander);
 cyl(1.05,1.35,1.45,gold,0,2,0,lander);cyl(.55,.55,.5,dark,0,2.95,0,lander);
 for(let i=0;i<4;i++){const a=i*Math.PI/2+.4,x=Math.cos(a)*1.5,z=Math.sin(a)*1.5;box(.12,1.65,.12,white,x,1.05,z,lander);box(.72,.12,.72,dark,x,.22,z,lander);}
 // Rover.
 const rover=new THREE.Group();rover.position.set(5,0,6);group.add(rover);
 box(1.7,.65,1.25,white,0,.85,0,rover);box(.65,.5,.6,gold,-.15,1.42,-.1,rover);
 for(const x of [-.72,.72])for(const z of [-.72,.72]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.2,20),dark);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.45,z);rover.add(wheel);}
 const mast=cyl(.045,.045,1.5,white,.45,1.8,0,rover);mast.rotation.z=-.15;
 // Junior commander avatar: a child-proportioned astronaut in a clear helmet.
 let commander={avatar:"blue",name:"Commander"};try{commander={...commander,...(JSON.parse(localStorage.getItem("lunar-outpost-trainer-v2")||"{}").commander||{})};}catch{}
 const avatarPalette={blue:{accent:0x42dfff,hair:0x56382d,skin:0xe7ae88},purple:{accent:0xc28cff,hair:0x49302c,skin:0xe6ae88},gold:{accent:0xffbf59,hair:0x211b18,skin:0xd99570},green:{accent:0x62e2b2,hair:0x3e2a24,skin:0xe8b28f}};
 const chosen=avatarPalette[commander.avatar]||avatarPalette.blue,accentMat=mat(chosen.accent,.35,.28),skinMat=mat(chosen.skin,0,.72),hairMat=mat(chosen.hair,0,.8);
 const astronaut=new THREE.Group();astronaut.position.set(1,0,5);group.add(astronaut);
 const torso=new THREE.Mesh(new THREE.SphereGeometry(.43,24,18),white);torso.scale.set(.88,1.18,.72);torso.position.y=.88;astronaut.add(torso);
 const neck=cyl(.12,.13,.18,skinMat,0,1.35,0,astronaut);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.31,24,20),skinMat);head.scale.set(.92,1.08,.86);head.position.set(0,1.62,.015);astronaut.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.32,20,14,0,Math.PI*2,0,Math.PI*.62),hairMat);hair.position.set(0,1.76,-.01);astronaut.add(hair);
 for(const x of [-.115,.115]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,12,10),dark);eye.position.set(x,1.64,.276);astronaut.add(eye);}
 const smile=new THREE.Mesh(new THREE.TorusGeometry(.075,.012,8,20,Math.PI),mat(0x8d4c45,0,.7));smile.position.set(0,1.52,.275);smile.rotation.z=Math.PI;astronaut.add(smile);
 const helmet=new THREE.Mesh(new THREE.SphereGeometry(.405,28,20),glass);helmet.position.set(0,1.63,0);astronaut.add(helmet);
 const helmetRing=new THREE.Mesh(new THREE.TorusGeometry(.395,.035,10,48),accentMat);helmetRing.position.set(0,1.57,0);astronaut.add(helmetRing);
 const backpack=box(.62,.78,.3,dark,0,.9,-.42,astronaut);
 box(.38,.22,.09,accentMat,0,1.05,-.59,astronaut);
 for(const x of [-.43,.43]){const arm=cyl(.13,.16,.62,white,x,.92,0,astronaut);arm.rotation.z=x*.45;const glove=new THREE.Mesh(new THREE.SphereGeometry(.14,14,12),white);glove.position.set(x*1.22,.64,.08);astronaut.add(glove);const leg=box(.2,.58,.22,white,x*.55,.27,0,astronaut);leg.rotation.z=-x*.12;box(.25,.13,.34,dark,x*.55,.02,.04,astronaut);}
 const chestBadge=box(.24,.18,.035,accentMat,.12,1.02,.29,astronaut);
 // Navigation beacon.
 const beacon=new THREE.PointLight(0x55dfff,22,8);beacon.position.set(-2,3.5,1);group.add(beacon);
 const starsGeo=new THREE.BufferGeometry(),stars=new Float32Array(900*3);for(let i=0;i<900;i++){stars[i*3]=(Math.random()-.5)*100;stars[i*3+1]=Math.random()*42+5;stars[i*3+2]=(Math.random()-.5)*100;}starsGeo.setAttribute("position",new THREE.BufferAttribute(stars,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xc8ddff,size:.12,transparent:true,opacity:.8})));
 const target=new THREE.Vector3(0,.4,0);let radius=25,azimuth=.72,polar=1.08,drag=false,lastX=0,lastY=0,raf=0;
 function cameraUpdate(){camera.position.set(target.x+radius*Math.sin(polar)*Math.sin(azimuth),target.y+radius*Math.cos(polar),target.z+radius*Math.sin(polar)*Math.cos(azimuth));camera.lookAt(target);}
 function resize(){const w=Math.max(1,root.clientWidth),h=Math.max(1,root.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 const ro=new ResizeObserver(resize);ro.observe(root);resize();cameraUpdate();
 canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener("pointermove",e=>{if(!drag)return;azimuth-=(e.clientX-lastX)*.006;polar=clamp(polar+(e.clientY-lastY)*.005,.38,1.48);lastX=e.clientX;lastY=e.clientY;cameraUpdate();});
 canvas.addEventListener("pointerup",()=>drag=false);canvas.addEventListener("pointercancel",()=>drag=false);
 canvas.addEventListener("wheel",e=>{e.preventDefault();radius=clamp(radius+e.deltaY*.018,13,36);cameraUpdate();},{passive:false});
 const focus={base:[0,.5,0],habitat:[-2,1,1],power:[4,1,-1],rover:[5,1,6],lander:[-8,1,-5]};
 root.querySelectorAll("[data-scene-focus]").forEach(b=>b.addEventListener("click",()=>{const v=focus[b.dataset.sceneFocus];if(v){target.set(...v);radius= b.dataset.sceneFocus==="base"?25:14;cameraUpdate();root.querySelectorAll("[data-scene-focus]").forEach(x=>x.classList.toggle("active",x===b));}}));
 const clock=new THREE.Clock();
 function animate(){raf=requestAnimationFrame(animate);const t=clock.getElapsedTime();if(!drag){azimuth+=.0007;}astronaut.position.y=.035+Math.sin(t*1.8)*.035;beacon.intensity=17+Math.sin(t*2.4)*5;cameraUpdate();renderer.render(scene,camera);}
 animate();
 return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();geo.dispose();starsGeo.dispose();};
}
function mount(){
 const app=document.querySelector("#app");if(!app)return;
 const hero=app.querySelector(".moon-wrap");const heading=app.querySelector(".heading");const label=heading?.querySelector(".eyebrow")?.textContent||"";
 const target=hero||(/MISSION DAY|SIMULATION \/ TRAINING ENVIRONMENT/i.test(label)?heading:null);
 if(!target)return;
 let root=app.querySelector(".lunar-3d-stage");
 if(!root){root=document.createElement("section");root.className="lunar-3d-stage";root.innerHTML='<div class="scene-topline"><span>LIVE 3D · LUNAR SOUTH POLE</span><span class="scene-hint">DRAG TO ORBIT · SCROLL TO ZOOM</span></div><div class="scene-viewport"><canvas aria-label="Interactive three-dimensional lunar outpost scene"></canvas><div class="scene-loading">INITIALIZING 3D TERRAIN…</div></div><div class="scene-toolbar"><div class="scene-focus"><button class="active" data-scene-focus="base">BASE</button><button data-scene-focus="habitat">HABITAT</button><button data-scene-focus="power">SOLAR FARM</button><button data-scene-focus="rover">ROVER</button><button data-scene-focus="lander">LANDER</button></div><span class="scene-caption">CONCEPTUAL TRAINING ENVIRONMENT · NOT FLIGHT HARDWARE</span></div>';
  if(hero){hero.innerHTML="";hero.append(root);}else target.after(root);
  }
 if(root.dataset.ready)return;root.dataset.ready="loading";
 import(THREE_URL).then(THREE=>{if(!root.isConnected)return;root.dataset.ready="true";root.querySelector(".scene-loading")?.remove();root._dispose=makeScene(THREE,root.querySelector(".scene-viewport"));}).catch(()=>{root.dataset.ready="fallback";root.querySelector(".scene-loading")?.remove();addStylesFallback(root.querySelector(".scene-viewport"));});
}
let activeRoot=null;
const observer=new MutationObserver(()=>{if(activeRoot&&!activeRoot.isConnected){activeRoot._dispose?.();activeRoot=null;}mount();});
observer.observe(document.querySelector("#app"),{childList:true,subtree:true});
mount();
const appRoot=document.querySelector("#app");
const capture=new MutationObserver(()=>{const next=appRoot.querySelector(".lunar-3d-stage");if(next&&next!==activeRoot)activeRoot=next;});
capture.observe(appRoot,{childList:true,subtree:true});

