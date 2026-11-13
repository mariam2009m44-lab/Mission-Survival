const THREE_URL="https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
let mounted=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function addStylesFallback(root){
 root.classList.add("scene-fallback");
 const fallback=document.createElement("div");fallback.className="scene-fallback-art";fallback.innerHTML='<div class="fallback-earth"></div><div class="fallback-moon"></div><div class="fallback-habitat"></div><div class="fallback-rover"></div><div class="fallback-caption">LUNAR SOUTH POLE · 3D PREVIEW MODE</div>';
 root.append(fallback);
}
function makeScene(THREE,root){
 const uiAr=(()=>{try{return JSON.parse(localStorage.getItem("lunar-outpost-trainer-v2")||"{}").language==="ar";}catch{return false;}})();
 const canvas=root.querySelector("canvas");const scene=new THREE.Scene();scene.background=new THREE.Color(0x070d18);scene.fog=new THREE.FogExp2(0x070d18,.012);
 const camera=new THREE.PerspectiveCamera(43,1,.1,180);camera.position.set(15,12,19);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 scene.add(new THREE.HemisphereLight(0x9eb9df,0x1c2430,1.65));
 const sun=new THREE.DirectionalLight(0xffe6bd,3.2);sun.position.set(-12,18,9);scene.add(sun);
 const fill=new THREE.PointLight(0x4aa9ff,38,45);fill.position.set(7,7,-8);scene.add(fill);
 const terrainMat=new THREE.MeshStandardMaterial({color:0x85869a,roughness:1,metalness:0});
 const geo=new THREE.PlaneGeometry(54,54,120,120);geo.rotateX(-Math.PI/2);
 const pos=geo.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let h=.16*Math.sin(x*.7)*Math.cos(z*.52)+.09*Math.sin(x*1.9+z*.8);for(const c of [[-8,-4,3],[7,5,4],[-2,10,2.5],[12,-9,3]]){const d=Math.hypot(x-c[0],z-c[1]);h-=.62*Math.exp(-Math.pow(d/c[2],2)*2);h+=.17*Math.exp(-Math.pow((d-c[2]*.78)/.42,2));}pos.setY(i,h);}
 geo.computeVertexNormals();const ground=new THREE.Mesh(geo,terrainMat);ground.receiveShadow=true;scene.add(ground);
 const grid=new THREE.GridHelper(52,52,0x52677e,0x26384d);grid.position.y=-.12;grid.material.transparent=true;grid.material.opacity=.11;scene.add(grid);
 const craterMat=new THREE.MeshStandardMaterial({color:0x555b72,roughness:1});
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
 // Interactive lunar stations. These are educational props, not engineering hardware.
 const greenhouse=new THREE.Group();greenhouse.position.set(-5,0,7);group.add(greenhouse);
 const greenhouseGlass=new THREE.Mesh(new THREE.SphereGeometry(1.25,24,16),new THREE.MeshPhysicalMaterial({color:0x75d7c4,transparent:true,opacity:.22,roughness:.12,metalness:.08,side:THREE.DoubleSide}));greenhouseGlass.scale.y=.72;greenhouseGlass.position.y=1.1;greenhouse.add(greenhouseGlass);
 for(let i=0;i<4;i++){const bed=box(.35,.18,1.25,mat(0x42634e),-1.05+i*.7,.28,0,greenhouse);bed.rotation.y=.08;for(let j=0;j<4;j++){const plant=cyl(.035,.055,.34,mat(0x69c58a),-1.05+i*.7,.48,j*.25-.4,greenhouse);plant.rotation.z=(j%2?-.25:.25);}}
 const oxygenLab=new THREE.Group();oxygenLab.position.set(-5,0,-3);group.add(oxygenLab);
 box(2.2,1.5,1.7,white,0,.8,0,oxygenLab);box(1.35,.65,.16,mat(0x214f6e),0,1.0,.88,oxygenLab);cyl(.35,.35,.5,gold,.72,1.85,0,oxygenLab);cyl(.13,.13,1.0,white,-.65,2.0,0,oxygenLab);
 const stations=[
  {id:"habitat",name:"Habitat & Life Support",ar:"السكن ودعم الحياة",position:new THREE.Vector3(-2,0,1),radius:3.2,info:"The habitat protects the crew and houses life-support systems. In a real mission, pressure, temperature, air quality and power are monitored continuously.",arInfo:"توفر القاعدة الحماية للطاقم وتضم أنظمة دعم الحياة. في المهمات الحقيقية تُراقَب باستمرار ضغوط المقصورة والحرارة وجودة الهواء والطاقة."},
  {id:"oxygen",name:"ISRU Oxygen Lab",ar:"مختبر استخلاص الأكسجين",position:new THREE.Vector3(-5,0,-3),radius:3.0,info:"ISRU means using local resources. NASA's 2026 CaRD work tested a ground prototype with simulated lunar soil; it is not an operating oxygen plant on the Moon.",arInfo:"يعني ISRU استخدام الموارد المحلية. اختبرت NASA في 2026 نموذجًا أوليًا أرضيًا باستخدام تربة قمرية محاكية؛ وليس مصنع أكسجين يعمل على القمر."},
  {id:"solar",name:"Solar Power Farm",ar:"مزرعة الطاقة الشمسية",position:new THREE.Vector3(4,0,-1),radius:3.0,info:"Solar arrays convert sunlight into electricity. Near the lunar south pole, terrain and long shadow periods make power planning especially important.",arInfo:"تحول الألواح الشمسية ضوء الشمس إلى كهرباء. قرب القطب الجنوبي للقمر تجعل التضاريس وفترات الظل الطويلة تخطيط الطاقة أمرًا مهمًا."},
  {id:"greenhouse",name:"Greenhouse & Water",ar:"الزراعة وإعادة تدوير المياه",position:new THREE.Vector3(-5,0,7),radius:3.0,info:"A closed growing system can help study food production and water use. It is a research challenge, not a promise of instant self-sufficiency.",arInfo:"يساعد نظام الزراعة المغلق في دراسة إنتاج الغذاء واستخدام المياه. لكنه تحدٍ بحثي وليس ضمانًا للاكتفاء الذاتي الفوري."},
  {id:"rover",name:"Rover Garage",ar:"مركبة الاستكشاف",position:new THREE.Vector3(5,0,6),radius:3.0,info:"Rovers help astronauts explore terrain and carry instruments. Routes must be planned around slopes, rocks, lighting and communication.",arInfo:"تساعد المركبات رواد الفضاء في استكشاف التضاريس وحمل الأجهزة. ويجب تخطيط المسارات مع مراعاة المنحدرات والصخور والإضاءة والاتصالات."}
 ];
 // Bright, readable station signs: the child can identify every place before walking to it.
 const stationColors={habitat:0x5bd8cf,oxygen:0x75b8ff,solar:0xffcf65,greenhouse:0x75df9a,rover:0xffa879};
 function stationSign(st){
  const canvasLabel=document.createElement("canvas");canvasLabel.width=640;canvasLabel.height=160;
  const ctx=canvasLabel.getContext("2d");ctx.clearRect(0,0,640,160);
  ctx.fillStyle="rgba(8,22,42,.88)";ctx.strokeStyle="#"+stationColors[st.id].toString(16).padStart(6,"0");ctx.lineWidth=8;
  ctx.beginPath();ctx.roundRect(12,12,616,136,34);ctx.fill();ctx.stroke();
  ctx.direction=uiAr?"rtl":"ltr";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillStyle="#ffffff";ctx.font="bold 37px Arial";ctx.fillText(uiAr?st.ar:st.name,320,80,560);
  const texture=new THREE.CanvasTexture(canvasLabel);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
  sprite.position.set(st.position.x,3.65,st.position.z);sprite.scale.set(4.5,1.12,1);group.add(sprite);
  return sprite;
 }
 const stationMarkers=stations.map(st=>{
  const color=stationColors[st.id],markerMaterial=mat(color,.25,.35);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.05,.055,10,48),markerMaterial);ring.rotation.x=Math.PI/2;ring.position.set(st.position.x,.1,st.position.z);group.add(ring);
  const beacon=new THREE.PointLight(color,7,6);beacon.position.set(st.position.x,1.7,st.position.z);group.add(beacon);
  const sign=stationSign(st);return{ring,beacon,sign,station:st};
 });
 // Friendly NOVA companion, built from rounded 3D forms rather than a flat chat icon.
 const nova=new THREE.Group();group.add(nova);
 const novaShell=mat(0x42cfe0,.28,.28),novaLight=mat(0xb5f5f4,.12,.24),novaDark=mat(0x17334d,.25,.3),novaGold=mat(0xffcf70,.25,.35);
 const novaBody=new THREE.Mesh(new THREE.SphereGeometry(.48,28,22),novaShell);novaBody.scale.set(1,1.05,.82);novaBody.position.y=.78;nova.add(novaBody);
 const novaHead=new THREE.Mesh(new THREE.SphereGeometry(.53,32,24),novaLight);novaHead.scale.set(1.05,.9,.82);novaHead.position.y=1.48;nova.add(novaHead);
 const face=new THREE.Mesh(new THREE.SphereGeometry(.43,28,20),novaDark);face.scale.set(1,.62,.28);face.position.set(0,1.48,.34);nova.add(face);
 for(const x of [-.17,.17]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.065,16,12),mat(0x72f7ff,.05,.18));eye.position.set(x,1.53,.47);nova.add(eye);}
 const mouth=new THREE.Mesh(new THREE.TorusGeometry(.09,.018,8,24,Math.PI),novaGold);mouth.position.set(0,1.34,.46);mouth.rotation.z=Math.PI;nova.add(mouth);
 const antenna=cyl(.045,.045,.34,novaShell,0,2.05,0,nova);const antennaOrb=new THREE.Mesh(new THREE.SphereGeometry(.105,16,12),novaGold);antennaOrb.position.set(0,2.25,0);nova.add(antennaOrb);
 for(const x of [-.53,.53]){const ear=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),novaShell);ear.position.set(x,1.48,0);nova.add(ear);const arm=cyl(.085,.11,.48,novaShell,x*.9,.8,0,nova);arm.rotation.z=x*.7;}
 const novaBadge=new THREE.Mesh(new THREE.TorusGeometry(.62,.035,8,40),novaGold);novaBadge.rotation.x=Math.PI/2;novaBadge.position.y=.18;nova.add(novaBadge);
 const novaLamp=new THREE.PointLight(0x53e9ff,5,5);novaLamp.position.set(0,1.8,0);nova.add(novaLamp);
 // Softly rounded lunar boulders and colorful mineral crystals make the terrain welcoming.
 for(let i=0;i<34;i++){
  const x=Math.sin(i*12.37)*22,z=Math.cos(i*7.91)*22;
  if(Math.hypot(x,z)<8)continue;
  const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(.22+(i%4)*.09,1),mat(i%3===0?0xaaa6b7:i%3===1?0x8e96aa:0xb8ad9c,0,.9));
  rock.position.set(x,.12,z);rock.scale.set(1.25,.75,1);rock.rotation.set(i*.3,i*.7,i*.2);group.add(rock);
 }
 const earth=new THREE.Mesh(new THREE.SphereGeometry(2.1,32,24),new THREE.MeshStandardMaterial({color:0x2e82c7,roughness:.72,metalness:.02}));
 earth.position.set(20,14,-25);scene.add(earth);
 const earthCloud=new THREE.Mesh(new THREE.SphereGeometry(2.13,32,24),new THREE.MeshBasicMaterial({color:0x91dcff,wireframe:true,transparent:true,opacity:.14}));earthCloud.position.copy(earth.position);scene.add(earthCloud);
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
 let followPlayer=true,nearby=null,moveX=0,moveZ=0;const keys=new Set(),moveSpeed=4.2;
 const status=root.querySelector("[data-scene-status]"),interactWrap=root.querySelector(".scene-interact"),interactButton=root.querySelector("[data-scene-interact]");
 function setStatus(text){if(status)status.textContent=text;}
 function interact(){if(!nearby)return;const st=nearby;root.dispatchEvent(new CustomEvent("lunar-station-interact",{bubbles:true,detail:{id:st.id,name:st.name,ar:st.ar,info:st.info,arInfo:st.arInfo}}));setStatus((uiAr?"تمت زيارة · ":"VISITED · ")+(uiAr?st.ar:st.name));}
 interactButton?.addEventListener("click",interact);
 function updateMovement(dt){let x=(keys.has("d")||keys.has("arrowright")?1:0)-(keys.has("a")||keys.has("arrowleft")?1:0)+moveX;let z=(keys.has("s")||keys.has("arrowdown")?1:0)-(keys.has("w")||keys.has("arrowup")?1:0)+moveZ;const length=Math.hypot(x,z);if(length>.01){x/=length;z/=length;const dx=x*Math.cos(azimuth)-z*Math.sin(azimuth),dz=x*Math.sin(azimuth)+z*Math.cos(azimuth);astronaut.position.x=clamp(astronaut.position.x+dx*moveSpeed*dt,-21,21);astronaut.position.z=clamp(astronaut.position.z+dz*moveSpeed*dt,-21,21);astronaut.rotation.y=Math.atan2(dx,dz);followPlayer=true;}
 const px=astronaut.position.x,pz=astronaut.position.z;let nearest=null,dist=Infinity;for(const st of stations){const d=Math.hypot(px-st.position.x,pz-st.position.z);if(d<dist){dist=d;nearest=st;}}
 const next=dist<nearest.radius?nearest:null;if(next!==nearby){nearby=next;if(interactWrap)interactWrap.hidden=!nearby;if(nearby){root.querySelector("[data-scene-nearby]").textContent=nearby.name;setStatus((uiAr?"في النطاق · ":"IN RANGE · ")+(uiAr?nearby.ar:nearby.name));}else setStatus(uiAr?"استكشفي القاعدة وابحثي عن محطة مضيئة":"Explore the outpost and find a glowing station");}
 for(const marker of stationMarkers){const pulse=1+Math.sin(clock.elapsedTime*2.5+marker.station.position.x)*.09;marker.ring.scale.setScalar(pulse);}
 if(followPlayer){target.lerp(new THREE.Vector3(px,.5,pz),Math.min(1,dt*3));}nova.position.set(px+1.55,Math.sin(clock.elapsedTime*2.1)*.12,pz+1.15);nova.rotation.y=Math.sin(clock.elapsedTime*.8)*.16;nova.position.y+=.92;
 }
 const onKeyDown=e=>{const key=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"," "].includes(key))e.preventDefault();keys.add(key);if(key==="e"||key==="enter")interact();};
 const onKeyUp=e=>keys.delete(e.key.toLowerCase());window.addEventListener("keydown",onKeyDown);window.addEventListener("keyup",onKeyUp);
 root.querySelectorAll("[data-move]").forEach(btn=>{const set=(on)=>{const dir=btn.dataset.move;const key={forward:"w",back:"s",left:"a",right:"d"}[dir];if(on)keys.add(key);else keys.delete(key);};btn.addEventListener("pointerdown",e=>{e.preventDefault();set(true);btn.setPointerCapture(e.pointerId);});btn.addEventListener("pointerup",()=>set(false));btn.addEventListener("pointercancel",()=>set(false));btn.addEventListener("lostpointercapture",()=>set(false));});
 root.querySelectorAll("[data-scene-focus]").forEach(b=>b.addEventListener("click",()=>{const v=focus[b.dataset.sceneFocus];if(v){followPlayer=false;target.set(...v);radius= b.dataset.sceneFocus==="base"?25:14;cameraUpdate();root.querySelectorAll("[data-scene-focus]").forEach(x=>x.classList.toggle("active",x===b));}}));
 const clock=new THREE.Clock();
 function animate(){raf=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;if(!drag&&!keys.size){azimuth+=.0007;}updateMovement(dt);astronaut.position.y=.035+Math.sin(t*1.8)*.035;beacon.intensity=17+Math.sin(t*2.4)*5;cameraUpdate();renderer.render(scene,camera);}
 animate();
 return()=>{cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener("keydown",onKeyDown);window.removeEventListener("keyup",onKeyUp);renderer.dispose();geo.dispose();starsGeo.dispose();};
}
function mount(){
 const app=document.querySelector("#app");if(!app)return;
 const hero=app.querySelector(".moon-wrap");const heading=app.querySelector(".heading");const label=heading?.querySelector(".eyebrow")?.textContent||"";
 const target=hero||(/MISSION DAY|SIMULATION \/ TRAINING ENVIRONMENT/i.test(label)?heading:null);
 if(!target)return;
 let root=app.querySelector(".lunar-3d-stage");
 if(!root){root=document.createElement("section");root.className="lunar-3d-stage";const uiAr=(()=>{try{return JSON.parse(localStorage.getItem("lunar-outpost-trainer-v2")||"{}").language==="ar";}catch{return false;}})();
 root.innerHTML='<div class="scene-topline"><span>LIVE 3D · LUNAR SOUTH POLE</span><span class="scene-hint">'+(uiAr?"WASD / الأسهم للحركة · E للتفاعل":"WASD / ARROWS TO MOVE · E TO INTERACT")+'</span></div><div class="scene-viewport"><canvas aria-label="Interactive three-dimensional lunar outpost scene"></canvas><div class="scene-loading">INITIALIZING 3D TERRAIN…</div><div class="scene-hud"><span class="scene-hud-dot"></span><b>'+(uiAr?"وضع الاستكشاف":"EXPLORATION MODE")+'</b><small data-scene-status>'+(uiAr?"اقتربي من محطة مضيئة":"Move near a glowing station")+'</small></div><div class="scene-interact" hidden><b data-scene-nearby>STATION</b><button type="button" data-scene-interact>'+(uiAr?"تفاعل ↗":"INTERACT ↗")+'</button></div><div class="scene-pad" aria-label="Movement controls"><button data-move="forward" aria-label="Move forward">▲</button><div><button data-move="left" aria-label="Move left">◀</button><button data-move="back" aria-label="Move back">▼</button><button data-move="right" aria-label="Move right">▶</button></div></div></div><div class="scene-toolbar"><div class="scene-focus"><button class="active" data-scene-focus="base">'+(uiAr?"القاعدة":"BASE")+'</button><button data-scene-focus="habitat">'+(uiAr?"السكن":"HABITAT")+'</button><button data-scene-focus="power">'+(uiAr?"الطاقة الشمسية":"SOLAR FARM")+'</button><button data-scene-focus="rover">'+(uiAr?"المركبة":"ROVER")+'</button><button data-scene-focus="lander">'+(uiAr?"المركبة الهابطة":"LANDER")+'</button></div><span class="scene-caption">'+(uiAr?"بيئة تدريب تصورية · ليست معدات طيران":"CONCEPTUAL TRAINING ENVIRONMENT · NOT FLIGHT HARDWARE")+'</span></div>';
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

