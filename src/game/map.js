// map — function declarations; initialized by ordered scripts.
function provinceInit(n){return {owner:n.owner,units:{},inf:n.core?Math.max(1,Math.round(n.wealth/3)):0,cav:n.core&&n.terrain==='plain'&&n.wealth>=6?1:0,art:n.core&&n.wealth>=7?1:0,sloop:n.port&&n.wealth>=4?1:0,frigate:n.port&&n.wealth>=7?1:0,line:n.port&&['Лондон','Амстердам','Париж','Тулон','Копенгаген','Стокгольм','Венеция','Константинополь','Лиссабон','Мадрид','Генуя'].includes(n.name)?1:0,farm:0,workshop:0,market:0,dock:0,fort:0,road:0,depot:0,unrest:0,move:0,seaMove:0,build:0,morale:78,blockaded:false}}

function selectProvince(i){if(dragged){dragged=false;return}if(mission){const m=mission;mission=null;if(m.from!==i){if(m.type==='army')march(m.from,i);else if(m.type==='fleet')sail(m.from,i);else if(m.type==='landing')landing(m.from,i);else blockade(m.from,i)}drawAll();return}selected=i;drawAll()}

function dateLabel(){return `${s.day} ${MONTHS[s.month-1]} ${s.year}`}

function provinceFill(n,p){if(mode==='political')return F[p.owner].color;if(mode==='terrain')return TERR[n.terrain][1];if(mode==='economy'){let k=n.wealth+p.workshop*3+p.market*2;return k<5?'#69737a':k<9?'#8c987f':k<14?'#a5a069':'#d6bc79'}if(mode==='unrest')return p.unrest<20?'#648b75':p.unrest<45?'#af9e61':p.unrest<70?'#be7659':'#b34a4d';let k=p.depot*3+p.road*2+(n.port?1:0);return k<1?'#654e56':k<3?'#77745d':k<5?'#719885':'#55a9a5'}

function drawMap(){const focus=selected;eosUpdateRegions();let labels='',markers='';for(let i=0;i<N.length;i++){const n=N[i],p=s.provinces[i],cap=CAP[p.owner]===i,isActive=i===focus;if(cap||isActive)labels+=`<text class="majorlabel ${isActive?'':'subtle'}" x="${n.x}" y="${n.y-12}">${esc(isActive?n.name:cap?F[p.owner].name:'')}</text>`;if((p.owner===s.player||isActive)&&(armies(p)>2||vessels(p)>1)){markers+=`<rect class="armytag" x="${n.x-13}" y="${n.y-1}" width="26" height="19" rx="4"/><text class="armytext" x="${n.x}" y="${n.y+12}">${armies(p)>0?armies(p):'⚓'}</text>`}}$('towns').innerHTML=labels;$('forces').innerHTML=markers;$('coast').setAttribute('d',GEO.land);$('seanames').innerHTML=GEO.labels.map(p=>`<text class="sea-label" x="${p.x}" y="${p.y}">${esc(p.name)}</text>`).join('');refreshOrdersLayer();$('legend').innerHTML=(mode==='political'?F.map((f,i)=>`<span><i class="key" style="background:${f.color}"></i>${esc(f.name)}${i===s.player?' ★':''}</span>`):`<span><i class="key" style="background:${mode==='terrain'?'#829177':mode==='economy'?'#d6bc79':mode==='unrest'?'#b34a4d':'#55a9a5'}"></i>${{terrain:'Окраска по типу местности',economy:'Насыщенность хозяйства и рынков',unrest:'Красный — сильное недовольство',supply:'Развитие дорог и армейских складов'}[mode]}</span>`);document.querySelectorAll('.mode').forEach(el=>el.classList.toggle('chosen',el.dataset.mode===mode));updateTransform()}

function zoomMap(k,centerX=800,centerY=540){let nz=clamp(zoom*k,1,24);if(nz===zoom)return;panX=centerX-(centerX-panX)*(nz/zoom);panY=centerY-(centerY-panY)*(nz/zoom);zoom=nz;clampPan();updateTransform()}

function resetMap(){zoom=1;panX=panY=0;updateTransform()}

function focusMap(){let n=N[selected];zoom=1.9;panX=800-n.x*zoom;panY=540-n.y*zoom;clampPan();updateTransform()}

function tabProvince(){let n=N[selected],p=s.provinces[selected],ours=own(selected);let r=`<div class="headingrow"><h2 style="margin:0">${esc(n.name)}</h2>${button('◎',"focusMap()",false,'title="Центрировать карту"')}</div><p><span class="flag" style="background:${F[p.owner].color}"></span>${esc(F[p.owner].name)}</p><div class="row-inline"><span class="badge">${TERR[n.terrain][0]}</span><span class="badge">${n.port?'⚓ Морское побережье':'Сухопутный регион'}</span><span class="badge">Население: ${n.pop}</span></div><div class="kv"><span>Налоговая база</span><b>${n.income}</b></div><div class="kv"><span>Местные беспорядки</span><b class="${p.unrest>55?'bad':'good'}">${p.unrest}%</b></div><div class="kv"><span>Гарнизон</span><b>${defendersVisible(selected)?armies(p):'неизвестно'}</b></div><div class="kv"><span>Прибрежный флот</span><b>${defendersVisible(selected)?vessels(p):'неизвестно'}</b></div><h3>Инфраструктура</h3>`;for(let [k,name] of [['farm','Поля и фермы'],['workshop','Мануфактуры'],['market','Рынки'],['road','Дороги'],['depot','Военные склады'],['dock','Верфи'],['fort','Укрепления']])r+=`<div class="kv"><span>${name}</span><b>${p[k]}</b></div>`;if(ours){r+=`<h3>Постройки ${p.build?'· работы в этом сезоне завершены':''}</h3><div class="buttonrow">`;for(let k of Object.keys(BUILD)){if(k==='dock'&&!n.port)continue;r+=affordBtn(BUILD[k].label,`construct('${k}')`,BUILD[k].cost,!p.build&&p[k]<(['fort','road','depot','dock'].includes(k)?3:5))}r+='</div>'}else{r+='<p class="note">Выберите собственную провинцию для строительства. Для нападения перейдите во вкладку «Армия».</p>'}return r}

function v6scaleLabel(){let el=$('v6mapscale');if(el)el.textContent=`МАСШТАБ ×${zoom.toFixed(1)} · ${zoom<=1.05?'ОБЗОР ЕВРОПЫ':zoom<4?'РЕГИОНЫ':zoom<14?'ПРОВИНЦИИ':'ТАКТИЧЕСКИЙ АТЛАС'}`}

function v7geology(i){let n=N[i],hash=(i*73+Math.round(n.lat*11)+Math.round(n.lon*13)+937)%101,rock=n.terrain==='mountain'||n.terrain==='hills';return {iron:rock?1+hash%3:hash%11===0?1:0,copper:rock&&hash%5<2?1+hash%2:hash%29===0?1:0}}

function v7renderMapDetails(){if(!s)return;if(zoom<5){let prev=$('v7-map-details');if(prev)prev.innerHTML='';v7DetailsKey='';return}let world=$('world');if(!world)return;
 let layer=$('v7-map-details');if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.id='v7-map-details';layer.setAttribute('pointer-events','none');world.insertBefore(layer,$('coast'))}
 let x0=(-panX)/zoom-7,y0=(-panY)/zoom-7,x1=(1600-panX)/zoom+7,y1=(1080-panY)/zoom+7;
 let sig=[Math.round(x0/15),Math.round(y0/15),Math.round(zoom*2)/2,mode].join(':');if(v7DetailsKey===sig)return;v7DetailsKey=sig;
 let defs=$('map')?.querySelector('defs');if(defs&&!$('v7-terrain-plain'))defs.insertAdjacentHTML('beforeend',`<pattern id="v7-terrain-plain" patternUnits="userSpaceOnUse" width="2.6" height="2.6"><path d="M.2 1.2 Q1.4 .1 2.5 1.7" fill="none" stroke="#fbdfb5" stroke-width=".15"/><circle cx="1.8" cy=".4" r=".13" fill="#40504c"/></pattern><pattern id="v7-terrain-hills" patternUnits="userSpaceOnUse" width="2.8" height="2.8"><path d="M-.5 2.7 Q.9 .2 2.9 2.2 M.3 2.8 Q1.1 1.2 2 2.5" fill="none" stroke="#fff2cc" stroke-width=".20"/><path d="M.3 .7 L1 .3 L1.4 .8" fill="none" stroke="#34433c" stroke-width=".14"/></pattern><pattern id="v7-terrain-mountain" patternUnits="userSpaceOnUse" width="2.9" height="2.9"><path d="M-1 2.9 L.8 .5 L1.4 1.2 L2 .2 L4 2.8" fill="none" stroke="#e3e6db" stroke-width=".23"/><path d="M-.2 1.5 L.6 1.8 L1.4 1.4" fill="none" stroke="#393d3a" stroke-width=".2"/></pattern><pattern id="v7-terrain-taiga" patternUnits="userSpaceOnUse" width="2.8" height="2.8"><path d="M.9 .4 L.2 1.6 L1.6 1.6 Z M2.2 1.2 L1.5 2.5 L2.8 2.5 Z" fill="#204d36" stroke="#bdd0af" stroke-width=".08"/></pattern><pattern id="v7-terrain-steppe" patternUnits="userSpaceOnUse" width="2.7" height="2.7"><path d="M0 1.8 Q1 1.1 1.8 1.8 M1.6 .5 L2.2 .2" stroke="#f7d59f" stroke-width=".16" fill="none"/></pattern>`);
 let h='',roads=0,towns=0;let w=Math.max(.04,1.4/zoom),roadsSeen=new Set();
 for(let i=0;i<N.length;i++){
  let n=N[i];if(n.x<x0||n.x>x1||n.y<y0||n.y>y1)continue;
  let p=s.provinces[i],z=1/zoom;
  h+=`<path d="${n.path}" fill="url(#v7-terrain-${n.terrain})" stroke="none" opacity="${mode==='terrain'?.41:.30}"/>`;
  if(zoom>9&&(i%4===0||n.core)){
   let kind=n.terrain;let symbol=kind==='mountain'?`<path d="M-11,6 L-2,-9 L4,1 L10,-8 L18,6 Z" fill="none" stroke="#d7d7bf" stroke-width="1.3"/>`:kind==='forest'?`<path d="M-11,7 L-5,-7 L1,7Z M1,7L8,-10L15,7Z" fill="#2e533f" stroke="#bad0b1" stroke-width=".8"/>`:
   `<path d="M-12,7 L-3,2 L5,6 L12,1" stroke="#d5c094" fill="none" stroke-width="1"/>`;
   let icon=`<path d="M-6,6 L-6,-2 L0,-8 L6,-2 L6,6 Z" fill="#dcc79c" stroke="#5d5040" stroke-width=".8"/><rect x="-1" y="0" width="3" height="6" fill="#5e5647"/>`;
   h+=`<g transform="translate(${n.x.toFixed(1)} ${n.y.toFixed(1)}) scale(${z.toFixed(5)})" opacity=".78">${n.core?icon:symbol}</g>`;towns++;
  }
  if(zoom>=9&&n.adj?.length&&roads<600&&i%3===0){for(let j of n.adj){if(i>=j||j>=N.length||j%2!==0||roadsSeen.has(i+':'+j))continue;let b=N[j];if(b.x<x0||b.x>x1||b.y<y0||b.y>y1||s.provinces[j].owner!==p.owner)continue;let dist=Math.hypot(n.x-b.x,n.y-b.y);if(dist>20)continue;roadsSeen.add(i+':'+j);roads++;h+=`<path d="M${n.x},${n.y} L${b.x},${b.y}" fill="none" stroke="#c3a37c" stroke-width="${w.toFixed(3)}" stroke-dasharray="${(3/zoom).toFixed(3)},${(2/zoom).toFixed(3)}" opacity=".63"/>`}}
 }
 layer.innerHTML=h;
}

function v8positionMap(){let v=v8get(),g=document.getElementById('v8movingfleet');if(!g){let world=document.getElementById('world');if(!world)return;g=document.createElementNS('http://www.w3.org/2000/svg','g');g.id='v8movingfleet';world.appendChild(g)}g.innerHTML=v.seaOrders.filter(o=>o.f===s.player).map(o=>{let {x,y}=o.position,a=N[o.from],b=N[o.to];return `<path d="M${a.x.toFixed(1)},${a.y.toFixed(1)} L${b.x.toFixed(1)},${b.y.toFixed(1)}" stroke="#efc384" stroke-dasharray="2 3" stroke-width=".7" opacity=".7" fill="none"/><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="3.2" fill="#ffd18b" stroke="#132936" stroke-width=".9"/><path d="M-2 2 L0 -4 L2 2 Z" fill="#f6ede0"/><text x="5" y="-3" fill="#f8e2b1" font-size="5" paint-order="stroke" stroke="#071b26" stroke-width="1">${o.remaining}д</text></g>`}).join('')}

function v9LocateProvince(i){if(!N[i]||s.provinces[i].owner!==s.player)return;v8close();selected=i;zoom=Math.max(zoom,22);panX=800-N[i].x*zoom;panY=540-N[i].y*zoom;clampPan();updateTransform();v6scaleLabel();tab='economy';drawAll();say('Выбран район '+N[i].name+' — откройте «Шахты и строительство»')}

function v14MapDecor(){ const world=document.getElementById('world'); if(!world) return; let old=document.getElementById('v14decor'); if(old) old.remove(); let g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.id='v14decor'; g.setAttribute('pointer-events','none'); g.innerHTML=`<path d="M86 220 C178 318, 228 425, 300 523" fill="none" stroke="#2aa2d1" stroke-width="5" stroke-dasharray="16 12" opacity=".82"/><path d="M462 549 C523 516, 598 474, 689 438 S897 359 1039 334 S1216 266 1348 170" fill="none" stroke="#2aa2d1" stroke-width="4.5" stroke-dasharray="14 10" opacity=".74"/><path d="M674 706 C765 688, 887 675, 1012 681 S1250 684 1370 687" fill="none" stroke="#2aa2d1" stroke-width="4.2" stroke-dasharray="14 10" opacity=".74"/><text x="925" y="258" class="sea-label">СЕВЕРНОЕ МОРЕ</text><text x="165" y="722" class="sea-label">СРЕДИЗЕМНОЕ МОРЕ</text><g transform="translate(1338 112)"><circle r="44" cx="0" cy="0" fill="#10263a" stroke="#c9aa6a" stroke-width="2.2"/><circle r="34" cx="0" cy="0" fill="none" stroke="#c9aa6a" stroke-opacity=".65"/><path d="M0-36 L6 -6 L0 -14 L-6 -6 Z M36 0 L6 6 L14 0 L6 -6 Z M0 36 L6 6 L0 14 L-6 6 Z M-36 0 L-6 6 L-14 0 L-6 -6 Z" fill="#e9d8a8"/><circle r="3" fill="#fff0c8"/></g>`; world.insertBefore(g,world.firstChild)}

function v15StateLabels(r){const u=REGIMENTS[r.type]||REGIMENTS.inf;const atk=u.atk*(1+r.training*.0009+r.experience*.0012+(r.weapon?.startsWith('gun')?.09:r.weapon?.includes('sabre')?.07:r.weapon?.includes('musket')?.05:0));return [atk,u.def*(1+r.experience*.001),u.speed,r.morale||70]}

function v16MapLabels(){
 const z=Math.max(1,typeof zoom==='number'?zoom:1);
 for(const node of document.querySelectorAll('#towns .majorlabel')){
   node.style.setProperty('font',`700 ${(node.classList.contains('subtle')?13:19)/z}px Georgia,serif`,'important');
   node.style.setProperty('stroke-width',2.6/z+'px','important');
   node.style.setProperty('letter-spacing',Math.max(.06,.8/z)+'px','important');
 }
 for(const node of document.querySelectorAll('#seanames .sea-label')){
   node.style.setProperty('font',`italic ${17/z}px Georgia,serif`,'important');
   node.style.setProperty('stroke-width',1.2/z+'px','important');
 }
}

function v17StyleMap(){const svg=document.getElementById('map'),world=document.getElementById('world');if(!svg||!world)return;
 const deco=document.getElementById('v14decor');if(deco)deco.remove();let relief=document.getElementById('v17-relief');if(!relief){relief=document.createElementNS('http://www.w3.org/2000/svg','g');relief.setAttribute('id','v17-relief');relief.setAttribute('pointer-events','none');const pts=N.filter(n=>n.port&&n.core).slice(0,100);relief.innerHTML=pts.map((n,i)=>`<circle cx="${n.x}" cy="${n.y}" r="${i%3===0?.9:.6}" fill="#f0d9a8" stroke="#202e35" stroke-width=".8"/>`).join('');world.appendChild(relief)}
 // Preserve labels, but keep the user-facing fontsize readable during zoom.
 document.querySelectorAll('.majorlabel').forEach(x=>{x.style.fill='#f4e6c8';x.style.fontFamily='Georgia,serif';x.style.stroke='#131b22';x.style.strokeWidth=2/Math.max(1,zoom)+'px'})
}

function v18MapLayers(){const world=document.getElementById('world');if(!world||!s)return;
 let overlay=document.getElementById('v18-geo');if(!overlay){overlay=document.createElementNS('http://www.w3.org/2000/svg','g');overlay.id='v18-geo';overlay.setAttribute('pointer-events','none');world.appendChild(overlay)}
 const important=N.filter(x=>x.port).filter((x,i)=>i%5===0).slice(0,45);
 const mountains=N.filter(x=>x.terrain==='mountain').filter((x,i)=>i%7===0).slice(0,95);
 overlay.innerHTML=`<g class="v18-ports">${important.map(x=>`<circle cx="${x.x}" cy="${x.y}" r="1.9" fill="#d9bc7c" stroke="#182833" stroke-width=".8"/><path d="M${x.x},${x.y-2.6}v4.2 m-2.4,-1 l2.4,2.5 l2.4,-2.5" fill="none" stroke="#e7d2a1" stroke-width=".7"/>`).join('')}</g><g class="v18-peaks">${mountains.map(x=>`<path d="M${x.x-3.2},${x.y+2}l3.2,-5.3 3.2,5.3z" fill="#d2d0bd" stroke="#4e6459" stroke-width=".55" opacity=".60"/>`).join('')}</g>`;
}

function v19GeoDecor(){const world=document.getElementById('world');if(!world||!s)return;let g=document.getElementById('v19-geo');if(!g){g=document.createElementNS('http://www.w3.org/2000/svg','g');g.id='v19-geo';g.setAttribute('pointer-events','none');world.appendChild(g)}const towns=N.filter((n,i)=>i%49===0).slice(0,95);const rivers=N.filter((n,i)=>n.terrain==='plain'&&i%113===0).slice(0,50);g.innerHTML=`<g opacity=".62">${rivers.map(n=>`<path d="M${n.x-7},${n.y-10} Q${n.x+3},${n.y} ${n.x+9},${n.y+12}" stroke="#4796b2" stroke-width="1.1" fill="none"/>`).join('')}</g><g>${towns.map(n=>`<circle cx="${n.x}" cy="${n.y}" r="1.6" fill="#e5d9b9" stroke="#5d4f37" stroke-width=".8"/><path d="M${n.x-2},${n.y+2}v-4l2-1.7 2 1.7v4Z" fill="#b79b6a"/>`).join('')}</g>`;g.style.opacity=zoom>4?'.95':zoom>2?'.42':'0'}

function v20MapBorders(){const world=document.getElementById('world');if(!world||!s)return;let layer=document.getElementById('v20-frontiers');if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.id='v20-frontiers';layer.setAttribute('pointer-events','none');world.appendChild(layer)}const arr=[];for(let i=0;i<N.length;i++){const n=N[i],owner=s.provinces[i]?.owner;if(!n.path||!n.adj?.some(j=>s.provinces[j]?.owner!==owner))continue;arr.push(`<path d="${n.path}" vector-effect="non-scaling-stroke" fill="none" stroke="#d6b36c" stroke-width="1.3" opacity=".60"/>`)}layer.innerHTML=arr.join('');let label=document.getElementById('v20-maplegend');if(!label){label=document.createElement('div');label.id='v20-maplegend';label.innerHTML='ЕВРОПА • 1700 · игровые границы приближённые';document.getElementById('mapviewport')?.appendChild(label)}}

function v23RiverCrossing(a,b){return V23_RIVER_SET.has(Math.min(a,b)+','+Math.max(a,b))}

function v23BuildFrontiers(){
 if(!s||!s.provinces)return '';
 const groups=new Map();
 for(const e of V22_BORDER_EDGES){
  const a=s.provinces[e[0]]?.owner,b=s.provinces[e[1]]?.owner;
  if(a===undefined||b===undefined||a===b)continue;
  const pair=a<b?a+':'+b:b+':'+a;
  let g=groups.get(pair);if(!g){g={edges:[],adj:new Map()};groups.set(pair,g)}
  const ak=v23SegmentKey(e[2],e[3]),bk=v23SegmentKey(e[4],e[5]);if(ak===bk)continue;
  const id=g.edges.length;g.edges.push({a:ak,b:bk,p:[e[2],e[3]],q:[e[4],e[5]]});
  for(const k of [ak,bk]){if(!g.adj.has(k))g.adj.set(k,[]);g.adj.get(k).push(id)}
 }
 let paths=[];
 for(const g of groups.values()){
  const used=new Uint8Array(g.edges.length);
  function follow(startEdge,startNode){let edgeId=startEdge,node=startNode,trail=[];
   for(let steps=0;steps<g.edges.length+1;steps++){
    const edge=g.edges[edgeId];if(!edge||used[edgeId])break;used[edgeId]=1;
    const atA=edge.a===node;
    if(!trail.length)trail.push(atA?edge.p:edge.q);
    trail.push(atA?edge.q:edge.p);
    node=atA?edge.b:edge.a;
    const near=g.adj.get(node)||[];
    const next=near.find(k=>!used[k]);
    if(next===undefined||near.length!==2)break;
    edgeId=next;
   }
   if(trail.length>1) paths.push(v23Spline(trail));
  }
  for(const [node,links] of g.adj){if(links.length!==2)for(const id of links){if(!used[id])follow(id,node)}}
  for(let i=0;i<g.edges.length;i++){if(!used[i])follow(i,g.edges[i].a)}
 }
 return paths.join('');
}

function v23HydrographicLayers(){
 const world=document.getElementById('world');if(!world||!s)return;
 let rivers=document.getElementById('v23-hydrography');
 if(!rivers){const defs=document.querySelector('#map defs');if(defs&&!document.getElementById('v23-landclip')){const cp=document.createElementNS('http://www.w3.org/2000/svg','clipPath');cp.id='v23-landclip';cp.setAttribute('clipPathUnits','userSpaceOnUse');const co=document.createElementNS('http://www.w3.org/2000/svg','path');co.setAttribute('d',GEO.land);cp.appendChild(co);defs.appendChild(cp)}
 rivers=document.createElementNS('http://www.w3.org/2000/svg','g');rivers.id='v23-hydrography';rivers.setAttribute('pointer-events','none');rivers.setAttribute('clip-path','url(#v23-landclip)');
  rivers.innerHTML='<path class="v23-river-back" d="'+V23_RIVER_D+'"/><path class="v23-river" d="'+V23_RIVER_D+'"/>';
  const port=world.querySelector('#v21-ports');
  if(port)world.insertBefore(rivers,port);else world.insertBefore(rivers,world.querySelector('#towns'));
 }
 rivers.style.display=V23_SHOW_RIVERS?'':'none';
 let frontiers=document.getElementById('v23-frontiers');
 if(!frontiers){frontiers=document.createElementNS('http://www.w3.org/2000/svg','g');frontiers.id='v23-frontiers';frontiers.setAttribute('pointer-events','none');
  frontiers.innerHTML='<path class="v23-frontier-halo"/><path class="v23-frontier-ink"/>';
  world.insertBefore(frontiers,world.querySelector('#towns'));
 }
 const d=v23BuildFrontiers();
 frontiers.querySelectorAll('path').forEach(path=>{if(path.getAttribute('d')!==d)path.setAttribute('d',d)});
 v23ToggleDetail();
}

function v23RiversToggle(){V23_SHOW_RIVERS=!V23_SHOW_RIVERS;const g=document.getElementById('v23-hydrography');if(g)g.style.display=V23_SHOW_RIVERS?'':'none';const b=document.getElementById('v23-river-button');if(b){b.classList.toggle('chosen',V23_SHOW_RIVERS);b.setAttribute('aria-pressed',V23_SHOW_RIVERS?'true':'false')}}

function v23BuildMapControl(){const toolbar=document.querySelector('.maptools .left');if(!toolbar||document.getElementById('v23-river-button'))return;let b=document.createElement('button');b.id='v23-river-button';b.textContent='≈ Реки';b.className='mode chosen';b.title='Показать или скрыть природные реки';b.setAttribute('aria-pressed','true');b.onclick=v23RiversToggle;toolbar.appendChild(b)}

// Keep geometry nodes alive; only changed attributes are written.
function eosUpdateRegions(){
 const group=$('regions');
 if(group.children.length!==N.length){
  const fragment=document.createDocumentFragment();
  for(let i=0;i<N.length;i++){const node=document.createElementNS('http://www.w3.org/2000/svg','path');node.dataset.i=i;fragment.appendChild(node)}
  group.replaceChildren(fragment);
 }
 for(let i=0;i<N.length;i++){
  const node=group.children[i],n=N[i],p=s.provinces[i];
  for(const [key,value] of [['class','province '+(i===selected?'focus':'')],['d',n.path],['fill',provinceFill(n,p)],['fill-opacity',mode==='political'?'.91':'.96']]){
   if(node.getAttribute(key)!==value)node.setAttribute(key,value);
  }
 }
}
