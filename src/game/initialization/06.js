const v22DrawMapBase=drawMap;
drawMap=function(){v22DrawMapBase();const world=document.getElementById('world');if(!world)return;
 let layer=document.getElementById('v22-frontiers');if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','path');layer.id='v22-frontiers';layer.setAttribute('pointer-events','none');layer.setAttribute('fill','none');layer.setAttribute('stroke','#ddc997');layer.setAttribute('stroke-opacity','.83');layer.setAttribute('stroke-width','2.1');layer.setAttribute('stroke-linecap','round');world.insertBefore(layer,world.querySelector('#towns'));}
 const paths=[];for(const e of V22_BORDER_EDGES){if(s.provinces[e[0]].owner!==s.provinces[e[1]].owner)paths.push(`M${e[2]},${e[3]}L${e[4]},${e[5]}`);}
 layer.setAttribute('d',paths.join(''));
};
const v22AIBase=v20AIMonth;
v20AIMonth=function(){v22AIBase();if(s.day!==1)return;let marker=s.year*12+s.month,st=v22State();if(st.lastAI===marker)return;st.lastAI=marker;
 // No free morale or cannon-spawning: training, repairs and reserves cost treasury and materials.
 for(let f=0;f<F.length;f++){if(f===s.player)continue;
 const fleet=s.fleets.find(x=>x.f===f&&x.port!=null&&v8shipsOf(x).length);
 if(fleet&&s.gold[f]>135&&s.food[f]>60){const o=v20ShipOrganization(fleet);
 if(o.value<63){s.gold[f]-=14;s.food[f]-=4;fleet.seaMorale=Math.min(100,(fleet.seaMorale||70)+3);}}
 if(s.iron[f]<18&&s.gold[f]>95){s.gold[f]-=18;s.iron[f]+=7;}
 if(s.food[f]<30&&s.gold[f]>70){s.gold[f]-=21;s.food[f]+=22;}
 }
};
const v22AdvanceBase=advanceDay;
advanceDay=function(){v22AdvanceBase();v22Advance();};
const v22FreshBase=fresh;
fresh=function(f=0){v22FreshBase(f);v22State()};
const v22RestoreBase=restoreSave;
restoreSave=function(data){v22RestoreBase(data);v22State();};
const v22SaveBase=save;
save=function(){try{localStorage.setItem(V22_KEY,JSON.stringify(s));say('Кампания XXII сохранена');}catch(e){v22SaveBase();}};
const v22LoadBase=load;
load=function(){try{const raw=localStorage.getItem(V22_KEY);if(!raw)return v22LoadBase();restoreSave(JSON.parse(raw));drawAll();say('Кампания XXII загружена');}catch(e){say('Ошибка: '+e.message);}};
saveQuiet=function(){try{if(s)localStorage.setItem(V22_KEY,JSON.stringify(s));}catch(e){}};
const V22_STYLES=document.createElement('style');
V22_STYLES.id='v22-css';
V22_STYLES.textContent=`
.v22-panel{border:1px solid #806844;border-radius:10px;padding:13px;margin:12px 0;background:linear-gradient(150deg,#172b37,#0d1922);box-shadow:0 6px 24px #0003}
.v22-heading{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:10px}.v22-panel h3{margin:0!important;color:#e9d39d!important;font:700 21px Georgia,serif}.v22-heading small,.v22-panel p{color:#b0c5c6;font-size:12px}
.v22-policygrid,.v22-balancegrid,.v22-modcols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.v22-policy{display:grid;grid-template-columns:90px 1fr;gap:10px;background:linear-gradient(180deg,#1a313f,#10202a);border:1px solid #4d6470;border-radius:8px;padding:10px}.v22-policy.on{border-color:#d0af69}.v22-policy img{width:90px;height:110px;object-fit:cover;border:1px solid #a98e5c;border-radius:5px}.v22-policy b{display:block;color:#f0d7a3;font:700 16px Georgia,serif}.v22-policy p{margin:3px 0 6px!important;font-size:11px}.v22-policy small{display:block;margin:7px 0}.v22-policy button{font-size:12px;padding:7px}
.v22-modline{display:flex;gap:12px;justify-content:space-between;font-size:12px;margin:4px 0}.v22-modline span{color:#b7c4c8}.v22-pos{color:#9ed09b}.v22-neg{color:#e6b16d}.v22-modline strong{color:#ead4aa}
.v22-balancegrid{grid-template-columns:repeat(3,minmax(0,1fr))}.v22-balance{padding:9px;border:1px solid #48616e;border-radius:7px;background:#101f29}.v22-balance.critical{border-color:#bd7a55}.v22-balance b{color:#eed6a5}.v22-meter{height:7px;background:#182e3a;border-radius:10px;overflow:hidden}.v22-meter i{display:block;height:100%}.v22-module{padding:10px;border:1px solid #536775;border-radius:7px;background:#13232e}.v22-module>b,.v22-module small{display:block}.v22-module>b{color:#efd8a7}.v22-module small{margin:4px 0;color:#b7c7cd}.v22-module button{display:block;width:100%;text-align:left;margin-top:6px;font-size:12px;padding:7px}.v22-warning{margin-top:10px;color:#e9d09c}.v22-tech-badge{position:absolute;top:6px;left:6px;display:flex;gap:8px;color:#f3deb0;background:#13202be0;border:1px solid #a18451;padding:2px 5px;border-radius:3px;font:10px Georgia,serif;z-index:1}
.mapframe{border-color:#ac8651!important}.majorlabel{paint-order:stroke;stroke:#152330!important;stroke-width:3px!important}.sea-label{font-family:Georgia,serif!important}.province{stroke-width:.85}
@media(max-width:1350px){.v22-policygrid,.v22-balancegrid,.v22-modcols{grid-template-columns:1fr}}`;
document.head.appendChild(V22_STYLES);
const v22OldPortrait=v15Portrait;
const V22_PORTRAITS=new Map();
v15Portrait=function(name,role='Придворный',kind='court'){
 const key=name+'|'+role+'|'+kind;if(V22_PORTRAITS.has(key))return V22_PORTRAITS.get(key);
 const seed=v19hash(key),r=v15Random(seed),hairColors=['#d9d6c9','#a7a18f','#6d5f50','#cfbb91','#d6cfc6','#584d46'],coats=['#663539','#2e4c70','#59603a','#68412d','#4c536c','#3c645f'],skin=['#dab08f','#e3be9d','#c79774','#cfa079','#edcba9'];
 const hair=hairColors[Math.floor(r()*hairColors.length)],coat=coats[Math.floor(r()*coats.length)],face=skin[Math.floor(r()*skin.length)];
 const wig=Math.floor(r()*4),beard=r()>.64,hat=r()>.83,crown=/монарх|правитель|король/i.test(role),navy=/адмирал|флот|мор/i.test(role),nose=Math.round(88+r()*14),eyeDist=13+r()*6,chin=144+r()*9,eyebrow=75+r()*7,trim=['#cfaf72','#c0b08b','#ccb78e'][seed%3],side=wig===0?6:wig===1?13:wig===2?8:18;
 const ornaments=Array.from({length:9},(_,i)=>{let h=(seed+i*73)%130+35;return `<path d="M${28+i*12},${183+i%3*8} l3,-6 l3,6 M${27+i*12},${191+i%4*7}l5,5" stroke="${trim}" stroke-opacity=".6" stroke-width=".65" fill="none"/>`}).join('');
 const drawing=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><defs><linearGradient id="bg" x2="0.2" y2="1"><stop stop-color="#324354"/><stop offset="1" stop-color="#131c26"/></linearGradient><radialGradient id="skin"><stop stop-color="#f2d5b2"/><stop offset="1" stop-color="${face}"/></radialGradient><linearGradient id="coat" x2="1" y2="1"><stop stop-color="${coat}"/><stop offset="1" stop-color="#202934"/></linearGradient><filter id="paint"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="${seed%80}" result="noise"/><feBlend in="SourceGraphic" in2="noise" mode="soft-light"/></filter></defs>
 <rect width="200" height="240" fill="url(#bg)"/><rect x="7" y="7" width="186" height="226" rx="5" fill="none" stroke="${trim}" stroke-width="1.5"/>
 <path d="M30 238Q39 173 86 168H119Q163 174 172 238Z" fill="url(#coat)" stroke="${trim}" stroke-width="1.4"/>
 <path d="M68 170L98 211L125 169L116 241H78Z" fill="#e6ded0" stroke="#c9bba2"/>
 <path d="M90 168Q99 182 110 168L122 190L99 222L77 190Z" fill="${navy?'#294c72':'#e9e4da'}"/>
 <path d="M61 91C57 46 79 32 107 34C133 37 149 61 145 93L146 136C139 160 116 172 98 168C76 162 63 145 60 126Z" fill="url(#skin)"/>
 <path d="M59 96Q54 46 90 33Q128 20 147 66Q151 80 144 103Q130 72 121 73Q103 87 78 77Z" fill="${hair}"/>
 <path d="M${63-side/2} 86 Q${42-side} 114 ${53-side/4} 149 Q65 155 68 138L73 77Z M139 76Q157 116 144 151Q136 156 135 135L132 78Z" fill="${hair}" stroke="#756d61" stroke-width="1.2"/>
 <path d="M${85-eyeDist/2} ${eyebrow}l18 1M${111+eyeDist/2} ${eyebrow}l-18 1" stroke="#604d43" stroke-width="2.3"/>
 <ellipse cx="${100-eyeDist}" cy="91" rx="3.5" ry="2.5" fill="#30373c"/><ellipse cx="${100+eyeDist}" cy="91" rx="3.5" ry="2.5" fill="#30373c"/>
 <path d="M${nose} 100Q${nose-4} 121 99 121" fill="none" stroke="#a67f64" stroke-width="1.9"/>
 <path d="M87 ${chin}Q101 ${chin+5} 116 ${chin}" fill="none" stroke="#935c50" stroke-width="2"/>
 ${beard?'<path d="M72 133Q83 172 105 168Q120 163 127 133Q109 142 98 147Q81 143 72 133Z" fill="'+hair+'" opacity=".84"/>':''}
 ${hat?'<path d="M37 73Q100 44 163 73L146 51L128 33H70L54 52Z" fill="#24282e" stroke="'+trim+'" stroke-width="2"/>':''}
 ${crown?'<path d="M65 37L72 16L90 27L102 10L119 26L137 16L141 37Z" fill="#af8644" stroke="'+trim+'" stroke-width="2"/>':''}
 ${navy?'<path d="M57 182l16 -8M121 174l20 10" stroke="'+trim+'" stroke-width="5"/>':''}
 ${ornaments}<path d="M29 221L171 221" stroke="${trim}" stroke-width="2"/><circle cx="101" cy="186" r="5" fill="${trim}" stroke="#6f583b"/><rect x="12" y="12" width="12" height="12" fill="#8d704b" opacity=".5"/></svg>`;
 const out='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(drawing);V22_PORTRAITS.set(key,out);return out;
};
for(const n of NATIONAL)V15_PEOPLE[n.ruler]=v15Portrait(n.ruler,'Правитель');
for(const a of ADVISERS)V15_PEOPLE[a.id]=v15Portrait(a.name,a.role);
for(const a of V6_ADMIRALS)V15_PEOPLE[a.name]=v15Portrait(a.name,'Адмирал');
const v22AIPlannerBase=v20AIMonth;
v20AIMonth=function(){v22AIPlannerBase();if(!s||s.day!==1||((s.month-1)%3!==0))return;
 const st=v22State(),marker=s.year*12+s.month;if(st.lastInfrastructureAI===marker)return;st.lastInfrastructureAI=marker;
 for(let f=0;f<F.length;f++){if(f===s.player)continue;
  let owned=regOf(f);if(!owned.length)continue;
  const danger=owned.filter(({i})=>N[i].adj?.some(j=>s.provinces[j]?.owner!==f&&withWar(f,s.provinces[j].owner)));
  let priority=danger.length?'fort':s.food[f]<65?'farm':s.iron[f]<28?'workshop':owned.filter(x=>N[x.i].port).length?'dock':'road';
  const candidates=owned.filter(({i,p})=>p[priority]<(priority==='dock'?3:priority==='road'||priority==='fort'?3:5)&&(priority!=='dock'||N[i].port));
  candidates.sort((a,b)=>(b.p.market+b.p.workshop+N[b.i].wealth)-(a.p.market+a.p.workshop+N[a.i].wealth));
  if(!candidates.length)continue;const target=candidates[0],price=priority==='fort'?95:priority==='dock'?120:80;
  if(s.gold[f]>=price+100&&s.wood[f]>=8&&s.iron[f]>=4){s.gold[f]-=price;s.wood[f]-=8;s.iron[f]-=4;target.p[priority]++;}
 }
};
const v22BrandBase=drawAll;
drawAll=function(){v22BrandBase();const e=document.querySelector('.brand .edition');if(e)e.textContent='XXII';};
v8cannon3d=function(mesh,x,y,z,lb=12,side=1,scale=1){
 const c=Math.max(4,Math.min(42,lb)),s=scale,sz=s*(.29+c/85),length=s*(.46+c/150),r=s*(.075+c/490),sx=s*.23;
 const carriage='#806038',iron='#2f3940',bronze='#a58d63',near=y-side*.10*s,far=y+side*length;
 v8cube(mesh,x,near,z-.13*s,sz,.36*s,.19*s,carriage);
 for(const dx of [-sx,sx]){
  v8cylinder(mesh,[x+dx-.045*s,near-side*.15*s,z-.17*s],[x+dx+.045*s,near-side*.15*s,z-.17*s],.145*s,'#63472a',9);
  v8cylinder(mesh,[x+dx-.05*s,near+side*.17*s,z-.17*s],[x+dx+.05*s,near+side*.17*s,z-.17*s],.15*s,'#63472a',9);
 }
 const breech=[x,near-side*.06*s,z+.02*s],center=[x,near+side*(length*.52),z+.04*s],muzzle=[x,far,z+.06*s];
 v8cylinder(mesh,breech,center,r*1.18,iron,10);v8cylinder(mesh,center,muzzle,r*.93,iron,10);
 v8cylinder(mesh,[x,far-side*.037*s,z+.06*s],[x,far+side*.038*s,z+.06*s],r*1.25,bronze,10);
 v8cylinder(mesh,[x,near-side*.11*s,z+.01*s],[x,near-side*.075*s,z+.01*s],r*.65,'#485057',8);
 v8cylinder(mesh,[x-s*.21,near+side*.05*s,z+.03*s],[x+s*.21,near+side*.05*s,z+.03*s],r*.48,bronze,8);
 v8seg(mesh,[x,near-side*.08*s,z-.03*s],[x+.12*s,near-side*.18*s,z-.11*s],'#b6a07a',.5);
};
const v22MapLayerBase=drawMap;
drawMap=function(){v22MapLayerBase();const world=document.getElementById('world');if(!world)return;
 let layer=document.getElementById('v22-local-detail');if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.id='v22-local-detail';layer.setAttribute('pointer-events','none');world.appendChild(layer);}
 let centers=N.filter((n,i)=>(n.core||n.port)&&((s.provinces[i].dock||0)>0||(s.provinces[i].fort||0)>0||(s.provinces[i].workshop||0)>1)).slice(0,150);
 layer.innerHTML=centers.map(n=>{const p=s.provinces[n.id],port=!!n.port;
 return `<g class="v22-location" data-x="${n.x}" data-y="${n.y}"><rect x="-11" y="-11" width="22" height="22" rx="3" fill="#182f3a" stroke="#cbac75" stroke-width="1.5"/>${port?'<path d="M0 -7V8M-6 1H6M-5 5L0 9L5 5" fill="none" stroke="#e5d3a9" stroke-width="1.2"/>':'<path d="M-7 6V-3L0-7L7-3V6ZM-2 6V1H2V6" fill="none" stroke="#e5d3a9" stroke-width="1.2"/>'}<title>${esc(n.name)} · ${port?'морская гавань':'город'} · форт ${p.fort||0} · верфь ${p.dock||0}</title></g>`}).join('');
 v22UpdateMarkers();
};
const v22ZoomOld=zoomMap;
zoomMap=function(k,x=800,y=540){const target=clamp(zoom*k,1,900);if(target<=650){v22ZoomOld(k,x,y);}else if(target!==zoom){panX=x-(x-panX)*(target/zoom);panY=y-(y-panY)*(target/zoom);zoom=target;clampPan();updateTransform();v6scaleLabel();}v22UpdateMarkers();};
const v22MapTransformBase=updateTransform;
updateTransform=function(){v22MapTransformBase();v22UpdateMarkers();};
const V22_TECH_POOLS={
 'Морская артиллерия':['gunAccuracy','gunReload','gunPen','gunRange','gunCost','arsenalSpeed'],
 'Флот':['formationHold','commandDelay','crewTraining','spotting','navalPower','seaEndurance'],
 'Кораблестроение':['shipCost','shipTime','repairRate','turnRate','damageControl','arsenalCost'],
 'Образование':['research','education','crewTraining','arsenalSpeed','upkeep'],
 'Пехотные формирования':['infAttack','regimentMorale','armySupply','armySpeed','armyCommandDelay'],
 'Пехотное оружие':['infAttack','regimentMorale','arsenalCost','arsenalSpeed','armySupply'],
 'Логистика':['armySupply','regimentSupply','armySpeed','riverCrossing','seaSupply','arsenalCost'],
 'Хозяйство':['trade','arsenalSpeed','arsenalCost','industry','upkeep','research'],
 'Конница':['cavalry','armySpeed','regimentSupply','regimentMorale'],
 'Артиллерия и осады':['artillery','gunCost','arsenalSpeed','regimentMorale'],
 'Управление':['trade','armyCommandDelay','research','upkeep','manpower'],
 'Морская торговля':['trade','convoyLoss','shipCost','spotting','upkeep'],
 'Государственные реформы':['research','trade','education','upkeep','armySupply']
};
const V22_CANNON_TECH={
 gun4:{gunAccuracy:1.013,arsenalSpeed:1.009},
 gun6:{gunReload:.992,gunCost:.994},
 gun9:{gunPen:1.018,gunAccuracy:1.006},
 gun12:{gunRange:1.021,gunReload:.996},
 gun18:{gunPen:1.032,recoilStress:1.013},
 gun24:{gunAccuracy:1.026,gunCost:1.007},
 gun32:{gunPen:1.037,gunReload:1.012},
 gun42:{gunRange:1.042,gunCost:1.018}
};
for(const t of TECH){
 if(!V19_OLD.has(t.id))continue;
 if(V22_CANNON_TECH[t.id]){V19_OLD.set(t.id,V22_CANNON_TECH[t.id]);V19_MODS[t.id]=V22_CANNON_TECH[t.id];continue;}
 const pool=V22_TECH_POOLS[t.cat]||['research','trade','arsenalCost','upkeep'];
 const h=v19hash(t.id+'|'+t.cat),first=pool[h%pool.length],second=pool[(h*7+11>>>3)%pool.length];
 const other=first===second?pool[(pool.indexOf(first)+1+(h%3))%pool.length]:second;
 const improving=(k)=>['commandDelay','shipCost','shipTime','arsenalCost','gunCost','regimentSupply','crewFatigue','convoyLoss','upkeep','gunReload'].includes(k);
 const a=(4+(h%11))/1000,b=(3+((h>>>7)%12))/1000;
 const row={[first]:improving(first)?1-a:1+a,[other]:improving(other)?1-b:1+b};
 V19_OLD.set(t.id,row);V19_MODS[t.id]=row;
}
v19ModCache.clear();
const v22OldTechMods=v19TechMods;
v19TechMods=function(t){return t.mods || V22_CANNON_TECH[t.id] || v22OldTechMods(t);};
const v22DistinctBadgeStyle=document.createElement('style');
v22DistinctBadgeStyle.textContent='.v19-techcard{position:relative!important}.v22-tech-badge{top:6px!important;left:6px!important;z-index:2!important}.v19-techcard img{border-radius:7px}';
document.head.appendChild(v22DistinctBadgeStyle);
