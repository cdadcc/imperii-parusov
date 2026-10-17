tabEconomy=function(){v10initDemography();let f=s.player,p=v10NationalPop(f),m=v10Manpower(),change=s.demography.monthlyDelta||0;return `<div class="v10-econhead"><div>${v10icon('people',26)}<small>НАСЕЛЕНИЕ</small><b>${v10fmtPop(p)}</b></div><div>${v10icon('army',26)}<small>РЕКРУТЫ</small><b>${v10fmtPop(m)}</b></div><div>${v10icon('crown',26)}<small>СТАБИЛЬНОСТЬ</small><b>${s.stability[f]}%</b></div><div>${v10icon('coin',26)}<small>КАЗНА</small><b>${v8fmt(s.gold[f],0)}</b></div></div><div class="v10-econdelta">Прирост жителей за последний месяц: <b style="color:${change>=0?'#9ac29a':'#d18e7e'}">${change>=0?'+':''}${v10n(change)}</b> • Фермы и продовольственные склады обеспечивают рост населения.</div>${v10PrevTabEconomy()}`};
const v10PrevTabPanel=tabPanel;
tabPanel=function(){v10PrevTabPanel();v10ApplyChrome();if(tab==='fleet'&&document.getElementById('tabcontent')){let content=document.getElementById('tabcontent');content.insertAdjacentHTML('afterbegin',`<div class="v10-quickfleet"><button onclick="v8open('fleet')">${v10icon('fleet',18)} Адмиралтейство</button><button onclick="v8open('models')">${v10icon('sail',18)} 3D-верфь</button><button onclick="v8Open3DBattle('sea')">${v10icon('fort',18)} Морской бой</button></div>`)}};
const v10PreviousMesh=v8meshFor;
v8meshFor=function(entity){let m=v10PreviousMesh(entity);if(m.v10detailed)return m;m.v10detailed=true;
 if(entity.kind==='ship'){
  let t=entity.type||'frigate',scale=V9_SCALES[t]||1,L=11*scale,beam=(t==='line'?3.4:2.8)*scale/2,master=t==='line'?3:t==='cutter'?1:t==='brig'?2:3;
  if(t==='xebec'||t==='cutter')m.faces=m.faces.filter(f=>!['#e6d5b2','#f1e3c8'].includes(f.color));
  // Distinct deck details: quarterdeck stairs, gun carriages, lifelines and copper strakes.
  for(let side of [-1,1]){
   for(let q of [-.42,-.18,.10,.32])v8seg(m,[L*q,side*beam*.88,.16*scale],[L*(q+.06),side*beam*.88,.31*scale],'#c1a071',.8);
   for(let deck=0;deck<(t==='line'?3:t==='frigate'||t==='corvette'?2:1);deck++){
    for(let j=0;j<13;j++){let x=(-.40+j*.066)*L;let y=side*beam*(.54+(1-Math.abs(x)/(L*.55))*.17),z=-.56*scale+deck*.27*scale;v8seg(m,[x,y,z],[x+L*.042,y,z],'#a78559',.55)}
   }
   v8seg(m,[-L*.49,side*beam*.54,-1.07*scale],[L*.43,side*beam*.52,-.85*scale],'#91704b',1.6);
   // Standing rigging and visible ratlines.
   for(let k=0;k<master;k++){let x=master===1?0:((-master+1)/2+k)*L*.23,top=(k===1?9:7.4)*scale;
    for(let j=0;j<9;j++){let z=(1.0+j*.59)*scale;if(z>top*.84)break;let yy=side*beam*(.89-.73*(z/top));v8seg(m,[x-.21*scale,yy,z],[x+.21*scale,yy,z],'#847052',.52)}
    v8seg(m,[x-.30*scale,side*beam*.77,.38*scale],[x,0,top],'#6e5942',.68);v8seg(m,[x+.30*scale,side*beam*.77,.38*scale],[x,0,top],'#6e5942',.68);
   }
  }
  // Complex masts and masthead flags vary by ship type.
  let mastXs=master===1?[0]:master===2?[-L*.16,L*.20]:[-L*.26,0,L*.23];
  mastXs.forEach((x,i)=>{let tall=(i===1?10.5:8.4)*scale;v8cylinder(m,[x,0,tall*.71],[x,0,tall*1.09],.04*scale,'#93744c',7);v8seg(m,[x,-beam*.87,tall*.24],[x,-beam*.87,tall*.60],'#6b5538',.7);
   for(let k=0;k<2;k++){let z=tall*(.63+k*.18),width=scale*(k?1.9:2.7);v8seg(m,[x,-width,z],[x,width,z],'#a58252',2.6)}
   for(let y of [-1,1])v8seg(m,[x,0,tall],[x+scale*.34,beam*y*.9,.27*scale],'#877054',.8);
  });
  // Curved stern gallery and decorative rails, not an identical flat rectangle.
  for(let k=-4;k<=4;k++){let y=k*beam*.135,x=-L*.48-.18*scale*(1-(y/beam)**2);v8cube(m,x,y,.60*scale,.14*scale,.095*scale,.31*scale,k%2?'#a88a59':'#31454c')}
  if(t==='line'){for(let side of [-1,1])for(let i=-3;i<=3;i++)v8cube(m,L*.23+i*L*.05,side*beam*.80,.96*scale,.18*scale,.10*scale,.28*scale,'#b49a65')}
  if(t==='brig'||t==='cutter'){for(let x of mastXs){v8seg(m,[x,0,6*scale],[x+L*.25,0,7.6*scale],'#b2976a',2);v8tri(m,[x,.08*scale,6.15*scale],[x+L*.25,.08*scale,7.6*scale],[x+L*.22,.08*scale,3.3*scale],'#e4d5b8')}}
  if(t==='xebec'){for(let x of mastXs){v8tri(m,[x-2.15*scale,.24*scale,3.45*scale],[x+2.15*scale,.24*scale,9.25*scale],[x+1.72*scale,.24*scale,3.05*scale],'#e5d5bb')}}
  // Hull ornaments and anchor cables.
  for(let side of [-1,1]){v8cylinder(m,[L*.36,side*beam*.73,.19*scale],[L*.38,side*beam*.76,-.30*scale],.074*scale,'#272c2d',9);v8seg(m,[L*.36,side*beam*.74,.10*scale],[L*.17,side*beam*.72,.39*scale],'#ad9272',1)}
 }else if(entity.kind==='gun'){
  let c=entity.lb||12,r=Math.max(.10,.16+c*.003);v8cube(m,-1.15,-.20,.37,1.2,.73,.15,'#835b37');for(let k=-1;k<=1;k++)v8seg(m,[-1.55+k*.23,-.35,.68],[-1.55+k*.23,.35,.68],'#aa8252',1.6);v8cylinder(m,[-1.1,0,.58],[-1.1,0,1.05],r*.37,'#b7a17a',8)
 }else if(entity.kind==='inf'||entity.kind==='cav'){for(let k=-5;k<=5;k++)v8seg(m,[k*.57,-.9,.05],[k*.57,-.9,.13],'#8c764c',.6)}
 return m;
};
const v10PrevSoldier=v8soldier;
v8soldier=function(m,x,y,z,kind='inf',coat='#a8463a',motion=0){v10PrevSoldier(m,x,y,z,kind,coat,motion);let mounted=kind==='cav',rise=mounted?.78:0;let Z=z+rise;
 v8cube(m,x-.14,y+.05,Z+.50,.22,.19,.20,'#a88c58'); // cartridge box
 v8seg(m,[x-.15,y+.05,Z+.61],[x+.15,y-.12,Z+.38],'#d1c1a1',1.2); // crossbelt
 v8cylinder(m,[x-.10,y-.13,Z+.63],[x+.74,y-.13,Z+.67],.028,'#5a4935',6); // firearm
 v8seg(m,[x+.74,y-.13,Z+.67],[x+1.00,y-.13,Z+.78],'#afb2ae',.95); // bayonet
 if(mounted){v8seg(m,[x+.38,y,Z+.41],[x+.65,y,Z+.10],'#3d2e23',1);v8cube(m,x,y,Z+.99,.27,.24,.08,'#ad996f')}
};
const v10OldStartScene=v8startScene;
v8startScene=function(sc){v10OldStartScene(sc);let c=V8_CANVAS;if(!c)return;let ratio=Math.min(1,1500/Math.max(1,c.width),920/Math.max(1,c.height));if(ratio<1){c.width=Math.round(c.width*ratio);c.height=Math.round(c.height*ratio)}};
const v10OldSave=save;
save=function(){try{v10initDemography();localStorage.setItem(V10_SAVE_KEY,JSON.stringify(s));say('Кампания X сохранена')}catch(e){say('Сохранение недоступно — экспортируйте JSON')}};
const v10OldLoad=load;
load=function(){try{let raw=JSON.parse(localStorage.getItem(V10_SAVE_KEY)||localStorage.getItem(V9_SAVE_KEY)||'null');if(!raw)throw Error('Нет сохранения');restoreSave(raw);v10initDemography();drawAll();say('Кампания X загружена')}catch(e){say('Ошибка загрузки: '+e.message)}};
const v10OldSaveQuiet=saveQuiet;
saveQuiet=function(){try{if(s){v10initDemography();localStorage.setItem(V10_SAVE_KEY,JSON.stringify(s))}}catch(e){}};
const v10OldPanel2=tabPanel;
tabPanel=function(){v10OldPanel2();if(tab==='army'){let pane=document.getElementById('tabcontent');if(pane&&!pane.querySelector('.v10-armydeck'))pane.insertAdjacentHTML('afterbegin',v10ArmyGlance())}};
const v10OldOpenBattle=v8Open3DBattle;
v8Open3DBattle=function(kind='sea',campaign=false,context=null){v10OldOpenBattle(kind,campaign,context);if(!V8_SCENE)return;let box=document.getElementById('v8-unit-strip');if(box){for(let btn of box.querySelectorAll('button[data-unit]')){let unit=V8_SCENE.units.find(u=>u.id===Number(btn.dataset.unit));if(!unit)continue;let art=unit.kind==='ship'?V6_ART[V6_HULLS[unit.type]?.art||'ship']:V6_ART[unit.kind==='cav'?'cavalry':unit.kind==='art'?'cannon':'infantry'];let text=esc(unit.name||'Отряд');btn.classList.add('v10-unit-tile');btn.innerHTML=`<img src="${art}" alt=""><span><b>${text}</b><small>${unit.kind==='ship'?'Корабль':unit.kind==='cav'?'Конница':unit.kind==='art'?'Батарея':'Пехота'}</small><i class="v10-unit-health"><i style="width:100%"></i></i></span>`}}
 const bar=document.querySelector('#v8-stage .v8-3d-controls');if(bar){bar.classList.add('v10-commandstrip');let names=kind==='sea'?[['pause','Пауза','help'],['fire','Залп','fort'],['left','Влево','sail'],['right','Вправо','sail'],['sail','Паруса','sail'],['camera','Камера','province']]:[['pause','Пауза','help'],['fire','Огонь','musket'],['left','Влево','road'],['right','Вправо','road'],['formation','Строй','army'],['advance','Атака','army'],['retreat','Отход','supply'],['camera','Камера','province']];bar.querySelectorAll('button').forEach((b,i)=>{let [cmd,title,ic]=names[i]||['','','province'];if(!title)return;b.setAttribute('title',title);b.innerHTML=`${v10icon(ic,19)}<small>${title}</small>`})}
};
let v10LastBattleUi=0;
const v10OldSceneStep=v8sceneStep;
v8sceneStep=function(dt){v10OldSceneStep(dt);if(!V8_SCENE||!v8Battle||!document.getElementById('v8-unit-strip'))return;let now=Date.now();if(now-v10LastBattleUi<440)return;v10LastBattleUi=now;for(let b of document.querySelectorAll('#v8-unit-strip button[data-unit]')){let u=V8_SCENE.units.find(x=>x.id===Number(b.dataset.unit));let p=b.querySelector('.v10-unit-health>i');if(u&&p)p.style.width=v10pc(100*(u.hp||0)/Math.max(1,u.maxHp||100))+'%'}};
if(typeof ADVISERS!=='undefined'){ADVISERS.forEach((a,i)=>a.v14portrait=v14portrait(a.name,a.role,['#22384a','#3e2f44','#1f3e3a','#40362a','#2d3847'][i%5],['#6e4e36','#5d4b6d','#5b6240','#6a4f3f','#4c5c73'][i%5]))}
if(typeof NATIONAL!=='undefined'){NATIONAL.forEach((n,i)=>n.v14portrait=v14portrait(n.ruler,n.title,['#243f56','#4a3540','#2f4a3a','#454030','#384355'][i%5],['#6b4d35','#67495c','#556742','#786049','#596d82'][i%5]))}
const v14OldShowTechTree=showTechTree;
showTechTree=function(cat=treeCat){treeCat=cat; const f=s.player,cats=[...new Set(TECH.map(t=>t.cat))],now=s.research[f],active=now&&TECH.find(t=>t.id===now.id); let h=`<div class="v14-techhead"><div><h2>Исследования державы</h2><small>${F[f].name} · ${s.tech[f].length}/${TECH.length} технологий${active?' · идёт: '+esc(active.name):''}</small></div><button onclick="closeModal()">✕</button></div><div class="v14-techcats">${cats.map(c=>`<button class="${c===cat?'active':''}" onclick="showTechTree('${c}')">${esc(c)}</button>`).join('')}</div><div class="v14-techgrid">`; for(const t of TECH.filter(t=>t.cat===cat)){const done=has(f,t.id), eligible=techAccessible(f,t), activeNow=now?.id===t.id, can=!done&&!now&&eligible&&s.gold[f]>=t.cost; const reqs=t.req.map(id=>TECH.find(x=>x.id===id)?.name||id).join(' · '); h+=`<div class="v14-techcard ${done?'done':activeNow?'active':can?'can':'lock'}"><div class="v14-ribbon">${done?'Изучено':activeNow?'Исследуется':can?'Доступно':'Заблокировано'}</div><img src="${v14techArt(t)}" alt=""><h4>${esc(t.name)}</h4><small>${esc(t.desc)}</small><div>${v14techEffects(t)}</div>${reqs?`<div class="v14-req">Требуется: ${esc(reqs)}</div>`:''}<div class="v14-techfoot"><span>${researchDays(t,f)} дн.</span><button ${can?'':'disabled'} onclick="research('${t.id}')">${done?'Освоено':activeNow?'В процессе':'◈ '+t.cost}</button></div></div>`} h+='</div>'; showModal(h); $('modalbody').classList.add('v14-techmodal') };
const v14OldTabFleet=tabFleet;
tabFleet=function(){ const f=s.player; const fleets=(s.fleets||[]).filter(x=>x.f===f).slice(0,4); const ships=(s.ships||[]).filter(x=>x.f===f); const cards=fleets.map(fl=>{const members=ships.filter(sh=>sh.squadronId===fl.id||sh.fleetId===fl.id).slice(0,4); const lead=members[0]; let art=''; try{if(typeof V6_ART!=='undefined'){art=V6_ART.ship||V6_ART.naval}}catch(e){} return `<div class="v14-fleetcard"><img src="${art}" alt=""><div><h4 style="margin:0 0 6px;font:700 19px Georgia,serif;color:#efd79f">${esc(fl.name)}</h4><div class="v14-eff"><span>Корабли</span><b>${members.length}</b></div><div class="v14-eff"><span>Порт приписки</span><b>${typeof fl.port==='number'?esc(N[fl.port].name):'в море'}</b></div><div class="v14-eff"><span>Готовность</span><b>${Math.max(72,96-members.length*2)}%</b></div></div></div>`}).join('')||'<div class="mini">Пока нет активных эскадр.</div>'; const gunDeck=`<section class="v14-cannondeck"><div class="headingrow"><h3 style="margin:0">Корабельная артиллерия</h3><span class="badge">Параметры как в Age of Sail</span></div><div class="v14-cannongrid">${CANNONS.map(c=>v14Cannon(c)).join('')}</div></section>`; return `<section class="v14-fleetlead"><div class="headingrow"><h2 style="margin:0">Флот и операции</h2><span class="badge">Эскадры ${fleets.length} · суда ${ships.length}</span></div><div class="v14-fleetgrid">${cards}</div></section>`+gunDeck+v14OldTabFleet() }
const v14OldRealmPanel=realmPanel;
realmPanel=function(){v14OldRealmPanel(); const f=s.player, idea=NATIONAL?.[f], advisors=(s.advisers[f]||[]).map(id=>ADVISERS.find(a=>a.id===id)).filter(Boolean); const ps=regOf(f), ships=ps.reduce((sum,z)=>sum+vessels(z.p),0), reg=ps.reduce((sum,z)=>sum+armies(z.p),0); $('flag').innerHTML=`<img class="v14-flag" src="${v14flag(f)}" alt="flag"><span>${F[f].style}</span>`; $('flag').classList.add('v14-flagwrap'); $('flag').onclick=()=>{tab='court';drawAll()}; $('countryoverview').innerHTML=`<div class="v14-overview"><div class="v14-hero">${idea?`<img src="${idea.v14portrait}" alt="${esc(idea.ruler)}">`:''}<div><div class="tiny-label">ДЕРЖАВА</div><h3>${F[f].name}</h3><div class="v14-row"><span>Население короны</span><b>${fmt(s.population?.[f]||5200000)}</b></div><div class="v14-row"><span>Военный резерв</span><b>${fmt((s.recruits?.[f]||286000))}</b></div></div></div><div class="v14-kpi"><div class="box"><b>${ps.length}</b><span>Провинции</span></div><div class="box"><b>${reg}</b><span>Полки</span></div><div class="box"><b>${ships}</b><span>Суда</span></div></div><div class="v14-idea"><div class="v14-row"><span>Стабильность</span><b>${Math.round(s.stability[f])}%</b></div><div class="v14-row"><span>Образование</span><b>${edu(f).toFixed(1)}</b></div><div class="v14-row"><span>Престиж</span><b>${Math.round(s.prestige[f])}</b></div>${idea?`<div class="tiny-label" style="margin-top:6px">НАЦИОНАЛЬНАЯ ИДЕЯ</div><div style="font:700 18px Georgia,serif;color:#efd8a4;margin:2px 0 5px">${esc(idea.title)}</div>${Object.entries(idea.mods).slice(0,3).map(([k,v])=>`<div class="v14-row"><span>${BONUS_NAMES[k]||k}</span><b class="good">${v<1?'−'+Math.round((1-v)*100):'+'+Math.round((v-1)*100)}%</b></div>`).join('')}`:''}<div class="v14-council">${advisors.slice(0,3).map(a=>`<img src="${a.v14portrait}" title="${esc(a.name)}">`).join('')}</div></div></div>` }
const v14OldDrawMap=drawMap;
drawMap=function(){v14OldDrawMap(); setTimeout(v14MapDecor,0)}
const v14OldDrawAll=drawAll;
drawAll=function(){v14OldDrawAll(); const tabs=document.querySelectorAll('#tabs button'); tabs.forEach(btn=>btn.innerHTML=btn.textContent) }
v14ApplyTheme();
const V15_RESEARCH = [
 ['v15_rifles','Унификация кремнёвых замков','Пехотное оружие',['flintlock'],4,165,{infAttack:1.05,arsenalSpeed:1.05}],
 ['v15_cartridge','Стандартизация бумажных патронов','Пехотное оружие',['v15_rifles'],5,185,{infAttack:1.04,arsenalCost:.95}],
 ['v15_bayonet','Инженерные штыки и палаши','Пехотное оружие',['bayonets'],4,145,{infAttack:1.05,armyCost:.97}],
 ['v15_drill','Полковая школа инструкторов','Пехотные формирования',['drill'],5,180,{armyCost:.95,infAttack:1.04}],
 ['v15_officer','Корпус штабных офицеров','Государственные реформы',['staffcollege'],6,210,{research:1.04,infAttack:1.05}],
 ['v15_magazines','Единые армейские магазины','Логистика',['magazine'],5,190,{supply:1.12,armyCost:.97}],
 ['v15_wagon','Военно-обозные депо','Логистика',['v15_magazines'],6,215,{supply:1.09,armySpeed:1.07}],
 ['v15_audits','Аудит казённых мануфактур','Хозяйство',['manufactory'],4,160,{arsenalCost:.94,trade:1.03}],
 ['v15_smelting','Точное литьё железных стволов','Морская артиллерия',['gunfoundries'],5,205,{gunDamage:1.08,gunCost:.95}],
 ['v15_elevating','Винтовые подъёмные механизмы','Морская артиллерия',['gunnery'],5,190,{gunAccuracy:1.10,gunReload:1.03}],
 ['v15_quickfire','Унифицированные корабельные расчёты','Морская артиллерия',['v15_elevating'],6,225,{gunReload:1.12,navalPower:1.04}],
 ['v15_oak','Стандарты дубовой обшивки','Кораблестроение',['shipyards'],5,185,{shipHull:1.10,shipCost:1.03}],
 ['v15_slipways','Стапели серийного судостроения','Кораблестроение',['v15_oak'],6,235,{shipTime:.88,shipCost:.96}],
 ['v15_signals','Боевые сигналы эскадр','Флот',['signals'],5,195,{navalPower:1.08,shipSpeed:1.03}],
 ['v15_blockade','Школа дальней блокады','Флот',['convoys'],6,220,{navalPower:1.06,trade:1.04}],
 ['v15_marine','Десантные роты и баркасы','Флот',['navigation'],5,205,{armyCost:.96,navalPower:1.04}],
 ['v15_grammar','Школы навигации и геометрии','Образование',['academies'],4,180,{research:1.08,education:1.08}],
 ['v15_science','Точные измерения и стандарты','Образование',['v15_grammar'],5,220,{research:1.10,arsenalSpeed:1.06}],
 ['v15_copper','Медная обшивка второго поколения','Кораблестроение',['coppering'],6,225,{shipSpeed:1.08,shipTime:.97}],
 ['v15_fieldcannon','Подвижные артиллерийские парки','Артиллерия и осады',['artillery'],5,195,{artillery:1.09,armySpeed:1.04}]
];
const V15_NEW_EFFECTS = Object.fromEntries(V15_RESEARCH.map(z=>[z[0],z[6]]));
for(const [id,name,cat,req,time,cost,mods] of V15_RESEARCH){
  if(!TECH.some(t=>t.id===id)) TECH.push({id,name,cat,req,time,cost,eduMin:30+Math.round(time*2),desc:Object.entries(mods).map(([k,v])=>`${BONUS_NAMES[k]||k} ${v<1?'−':'+'}${Math.round(Math.abs(v-1)*100)}%`).join(' · ')});
}
Object.assign(BONUS_NAMES,{arsenalSpeed:'Скорость вооружения',arsenalCost:'Себестоимость оружия',gunCost:'Стоимость орудий',gunDamage:'Урон корабельных пушек',gunReload:'Скорость перезарядки',gunAccuracy:'Точность орудий',supply:'Обеспечение армии',armySpeed:'Скорость похода',shipHull:'Прочность кораблей',shipSpeed:'Скорость кораблей'});
const v15PreviousGlobalMod=globalMod;
globalMod=function(f,k){let x=v15PreviousGlobalMod(f,k);for(const id of s?.tech?.[f]||[]){if(V15_NEW_EFFECTS[id]?.[k]!==undefined)x*=V15_NEW_EFFECTS[id][k]}return x};
const V15_PEOPLE={};
for(const n of NATIONAL)V15_PEOPLE[n.ruler]=v15Portrait(n.ruler,n.title);
for(const a of ADVISERS)V15_PEOPLE[a.id]=v15Portrait(a.name,a.role);
for(const a of V6_ADMIRALS)V15_PEOPLE[a.name]=v15Portrait(a.name,'Адмирал','navy');
let v15RegId=null,v15Tab='regiments';
const v15PreviousAdvanceDay=advanceDay;
advanceDay=function(){v15PreviousAdvanceDay();if(!s||s.ended)return;const v=v15Get();for(const t of v.training){t.remaining--;if(t.remaining<=0){const r=s.provinces[t.i]?.v15Regiments?.find(x=>x.id===t.regId);if(r){r.experience=Math.min(100,r.experience+12);r.training=Math.min(100,r.training+8);r.morale=Math.min(100,r.morale+5);if(s.provinces[t.i].owner===s.player)log(`${r.name}: учебный сбор окончен. Опыт +12, подготовка +8.`)}}}v.training=v.training.filter(x=>x.remaining>0)};
const v15PreviousPower=power;
power=function(p,f,attack=false,where=0){let val=v15PreviousPower(p,f,attack,where);if(p?.v15Regiments?.length){let troops=p.v15Regiments;let mul=troops.reduce((a,r)=>a+(r.experience/100)*.12+(r.training/100)*.09+(r.weapon?((r.weapon.startsWith('gun')?.085:.05))*Math.min(1,(r.gearCount||0)/Math.max(1,r.headcount||800)):0),0)/Math.max(1,troops.length);val*=1+Math.min(.28,mul);}return val};
const v15PreviousShipMesh=v8shipMesh;
v8shipMesh=function(type='frigate',design=null){let base=v15PreviousShipMesh(type,design),seed=design?.modelSeed??v15Hash((design?.name||type)+'|'+(design?.id||0)),rng=v15Random(seed);let size=type==='line'?1.55:type==='frigate'?1.1:type==='transport'?1.16:.82,L=11*size,W=(type==='line'?3.4:2.8)*size;
 // Детерминированная генерация кормы, вымпелов, галерей и декоративных надстроек.
 const accent=['#bc9a5b','#aeb9bc','#946847','#c0a66d'][Math.floor(rng()*4)],rake=.3+rng()*.6;
 for(const side of [-1,1]){for(let j=0;j<4;j++){let xx=-L*.38+j*L*.25;v8seg(base,[xx,side*W*.4,.32*size],[xx,side*W*.4,(.45+rng()*.12)*size],accent,1);}}
 v8cube(base,-L*.46,0,.60*size,L*.08,W*.63,.25*size,accent);
 for(let i=0;i<(type==='line'?5:3);i++){const yy=(i-(type==='line'?2:1))*W*.10;v8cube(base,-L*.51,yy,.64*size,.12*size,.07*size,.15*size,'#25343c');}
 for(let j=0;j<2;j++){let x=(j===0?-.16:.22)*L;v8seg(base,[x,0,(6.9+j)*size],[x+(j===0?-1:1)*rake*size,0,(7.6+j)*size],accent,1.2)}
 v8cube(base,L*.42,0,.60*size,L*.10,W*.48,.17*size,accent);
 // Гальюнная носовая решётка и оснастка, варьирующиеся по проекту.
 for(let j=0;j<4;j++){v8seg(base,[L*.43,(-.23+j*.15)*W,.22*size],[L*.6,(-.20+j*.13)*W,-.05*size],'#9d855f',.8)}
 return base;};
const v15PreviousMeshFor=v8meshFor;
v8meshFor=function(e){if(e.kind==='ship'){const sid=e.shipId||e.design?.id||e.id;const sd=v15Hash(String(sid)+'|'+(e.design?.name||e.type));e.design={...(e.design||{}),modelSeed:sd,batteries:e.design?.batteries||[]};e.meshKey='v15-'+e.type+'-'+sd+'-'+e.design.batteries.map(b=>b.gun+b.count).join('-')}return v15PreviousMeshFor(e)};
const v15OldCannon=v8cannon3d;
v8cannon3d=function(m,x,y,z,lb=12,side=1,scale=1){v15OldCannon(m,x,y,z,lb,side,scale);let sc=scale*(.6+lb/42*.55),r=(.045+lb*.0016)*scale;
 // Цапфы, медные обоймы, подкосы лафета, оси колёс.
 v8cylinder(m,[x,y,z+.045*sc],[x,y+side*.16*sc,z+.045*sc],r*1.12,'#bd9a60',10);
 v8cube(m,x,y,z-.15*sc,.46*sc,.50*sc,.08*sc,'#60472e');
 for(const dx of [-1,1])v8seg(m,[x+dx*.19*sc,y-.2*sc,z-.17*sc],[x+dx*.19*sc,y+.2*sc,z-.17*sc],'#332922',1.2)
};
const v15OldSupplyOf=v8supplyOf;
v8supplyOf=function(i){let q=v15OldSupplyOf(i);let f=s.provinces[i]?.owner;if(Number.isInteger(f))q=Math.min(100,q*globalMod(f,'supply'));return q};
const v15OldTravelDays=travelDays;
travelDays=function(from,to,force,f){return Math.max(4,Math.round(v15OldTravelDays(from,to,force,f)/globalMod(f,'armySpeed')))};
const v15OldShipPower=v6shipPower;
v6shipPower=function(sh,admiralIndex){return v15OldShipPower(sh,admiralIndex)*globalMod(sh.f,'gunAccuracy')};
const v15OldShowModel=v8ShowModel;
v8ShowModel=function(shipId){v15OldShowModel(shipId);if(V8_SCENE?.units?.[0]){V8_SCENE.units[0].shipId=shipId;V8_SCENE.units[0].meshKey=null}};
const v15PreviousFire=v8fire;
v8fire=function(u){let sc=V8_SCENE;if(!sc||sc.kind!=='sea'||u.kind!=='ship')return v15PreviousFire(u);
 if(u.hp<=0||u.cooldown>0)return;
 const nearest=sc.units.filter(z=>z.team!==u.team&&z.hp>0).sort((a,b)=>Math.hypot(u.pos[0]-a.pos[0],u.pos[1]-a.pos[1])-Math.hypot(u.pos[0]-b.pos[0],u.pos[1]-b.pos[1]))[0];if(!nearest)return;
 const batt=u.design?.batteries?.filter(z=>z.count>0)||[];const guns=batt.map(row=>({c:CANNONS.find(c=>c.id===row.gun)||CANNONS[0],count:row.count||0}));const total=guns.reduce((a,b)=>a+b.count,0);
 if(!total)return v15PreviousFire(u);
 const d=Math.hypot(u.pos[0]-nearest.pos[0],u.pos[1]-nearest.pos[1]);const maxRange=guns.reduce((a,g)=>Math.max(a,g.c.range),0)/12;
 if(d>maxRange)return;
 const angle=Math.atan2(nearest.pos[1]-u.pos[1],nearest.pos[0]-u.pos[0]);const bearing=Math.abs(Math.atan2(Math.sin(angle-u.angle),Math.cos(angle-u.angle)));
 if(!(bearing>Math.PI*.19&&bearing<Math.PI*.88))return;
 if(u.ammo===undefined)u.ammo=100;if(u.ammo<1)return;
 const weightedReload=guns.reduce((a,g)=>a+g.c.reload*g.count,0)/total;
 const power=guns.reduce((a,g)=>a+g.c.atk*g.count/2,0);
 const penetration=guns.reduce((a,g)=>a+g.c.lb*g.count,0)/total;
 const armor=(nearest.type==='line'?25:nearest.type==='frigate'?15:nearest.type==='transport'?6:9)*Math.max(.6,nearest.hp/Math.max(1,nearest.maxHp||nearest.hp));
 const penFactor=Math.min(1.25,Math.max(.3,penetration/Math.max(1,armor)));
 const crewRatio=(u.shipId?s.ships.find(x=>x.id===u.shipId)?.crew/(s.ships.find(x=>x.id===u.shipId)?.crewMax||1):1)||.75;
 const accuracy=Math.max(.12,(1-d/(maxRange*1.4))*(.70+Math.random()*.3));
 const hit=Math.max(.5,power*.16*penFactor*accuracy*Math.max(.3,crewRatio));
 nearest.hp=Math.max(0,nearest.hp-hit);u.cooldown=Math.max(2.2,weightedReload*4.8/Math.max(.55,globalMod(u.team==='friendly'?s.player:(nearest.shipId?s.ships.find(x=>x.id===nearest.shipId)?.f||0:0),'gunReload')));
 u.ammo-=1;sc.smoke ||= [];for(let i=0;i<9;i++)sc.smoke.push({x:u.pos[0]+Math.random()*2,y:u.pos[1]+Math.random()*2,z:1+Math.random()*2,age:0});
 if(u.team==='friendly'&&v8Battle)v8Battle.lastHit=`${u.name} → ${nearest.name}: ${Math.round(hit)} HP · пробитие ${Math.round(penFactor*100)}%`;
};
const v15PreviousFinish3DBattle=v8finish3dBattle;
v8finish3dBattle=function(won){if(v8Battle?.campaign&&V8_SCENE){for(const u of V8_SCENE.units||[]){if(u.shipId){const sh=s.ships.find(x=>x.id===u.shipId);if(sh)sh.ammo=Math.min(sh.ammo??100,u.ammo??100)}}}return v15PreviousFinish3DBattle(won)};
const V15_LEGACY_EFFECTS={
 flintlock:{infAttack:1.12},rankfire:{infAttack:1.12},platoonfire:{infAttack:1.12},
 shipyards:{shipCost:.82},professional_army:{infAttack:1.08},
 conscription:{armyCost:.87},rifling:{infAttack:1.08},
 blockandpulleys:{shipTime:.90},drydock:{shipTime:.89},portinspections:{shipTime:.85},
 studss:{armySpeed:1.04},academies:{research:1.13},
 v15_rifles:V15_NEW_EFFECTS.v15_rifles
};
if(typeof v14techEffects==='function'){
 v14techEffects=function(t){let mods=V15_NEW_EFFECTS[t.id]||V15_LEGACY_EFFECTS[t.id];
  if(!mods)return `<div class="v14-eff"><span>${esc(t.desc||'Открывает новый этап развития')}</span><b>Эффект базовой системы</b></div>`;
  return Object.entries(mods).map(([k,v])=>`<div class="v14-eff"><span>${esc(BONUS_NAMES[k]||k)}</span><b>${v<1?'−':'+'}${Math.round(Math.abs(1-v)*100)}%</b></div>`).join('')};
}
if(typeof v14Cannon==='function'){
 v14Cannon=function(c){let q=v15CannonStats(c,s?.player||0),prod=V6_EQUIP[c.id]?.work||c.lb;
  const bar=(label,val,max,color,txt)=>v14bar(label,val,max,color,txt);
  return `<div class="v14-cannoncard"><img src="${typeof V6_ART!=='undefined'&&(V6_ART[c.id]||V6_ART.cannon)||''}" alt="${c.lb}"><div class="v14-c-head"><h4>${c.lb}-фунтовая корабельная пушка</h4><small>Игровые характеристики конкретного образца</small></div>${bar('Мощность',q.damage,8,'#77ac87',q.damage.toFixed(1))}${bar('Пробитие',q.penetration,45,'#ceb074',q.penetration.toFixed(1))}${bar('Дальность',q.range,900,'#6fabc6',q.range+' м')}${bar('Перезарядка',Math.max(1,100-q.reload*7),100,'#bf7a70',q.reload.toFixed(1)+' с')}${bar('Трудозатраты',prod,48,'#989797',prod+' ед.')}</div>`;
 }
}
const v15OldComputerTurn=computerTurn;
computerTurn=function(){v15OldComputerTurn(); // Additional deterministic economic choices, based on shortages and threats.
 for(let f=0;f<F.length;f++){if(f===s.player)continue;const provs=regOf(f);if(!provs.length)continue;
 const enemy=provs.some(({i})=>N[i].adj.some(j=>withWar(f,s.provinces[j].owner)));
 const wantFarm=s.food[f]<Math.max(35,provs.length*.35),wantFoundry=s.iron[f]<Math.max(20,provs.length*.14);
 let best=null,score=-Infinity;for(const {i,p} of provs){let q=(wantFarm?5-p.farm:wantFoundry?4-p.workshop:3-p.market)+(p.road||0)*.5-(p.unrest||0)*.015;if(enemy&&N[i].adj.some(j=>withWar(f,s.provinces[j].owner)))q-=2;if(q>score){score=q;best=p}}
 if(best&&s.gold[f]>135&&s.wood[f]>25){if(wantFarm&&best.farm<5){best.farm++;s.gold[f]-=75;s.wood[f]-=20}else if(wantFoundry&&best.workshop<5&&s.iron[f]>5){best.workshop++;s.gold[f]-=115;s.wood[f]-=24;s.iron[f]-=5}else if(enemy&&best.depot<2){best.depot++;s.gold[f]-=100;s.wood[f]-=22}}
 }
};
let v15OverlayTab='fleet',v15ShipId=null,v15NewPortraitIndex=0;
const v15PreviousDrawAll=drawAll;
drawAll=function(){v15PreviousDrawAll();if(s&&document.getElementById('v15-rail'))v15Rail()};
v15ApplyCSS();
v15Install();
const V16_GUN_PATTERN={
 short:{name:'Короткий ствол',damage:1.08,range:.78,penetration:.83,reload:1.18,weight:.80,cost:.90,description:'Быстрый залп на малой дистанции'},
 standard:{name:'Стандартный ствол',damage:1,range:1,penetration:1,reload:1,weight:1,cost:1,description:'Универсальное орудие для линейного боя'},
 long:{name:'Длинный ствол',damage:1.13,range:1.23,penetration:1.21,reload:.81,weight:1.21,cost:1.18,description:'Повышенная дальность и пробитие'}
};
const V16_FORMATIONS={line:{name:'Линия',atk:1.08,def:1.08,speed:.96,morale:1.01},column:{name:'Колонна',atk:.93,def:.95,speed:1.15,morale:1.05},square:{name:'Каре',atk:.86,def:1.18,speed:.70,morale:1.07},skirmish:{name:'Рассыпной строй',atk:1.02,def:1.11,speed:1.12,morale:.95}};
const V16_RESEARCH=[
 ['v16_standard_tools','Измерительные шаблоны','Хозяйство',['precisiontools'],{arsenalCost:.95,arsenalSpeed:1.07},195,39],
 ['v16_naval_foundry','Калибровочные литейные формы','Морская артиллерия',['v15_smelting'],{gunCost:.92,gunAccuracy:1.07},210,42],
 ['v16_long_barrel','Длинные корабельные стволы','Морская артиллерия',['v15_smelting'],{gunRange:1.09,gunPen:1.08,gunReload:.98},240,45],
 ['v16_light_guns','Облегчённые корабельные лафеты','Морская артиллерия',['guncarriages'],{gunCost:.96,shipSpeed:1.03},185,36],
 ['v16_gun_crews','Инструкторы палубной артиллерии','Морская артиллерия',['v15_quickfire'],{gunReload:1.09,gunAccuracy:1.07},235,44],
 ['v16_divisional_train','Полковые обозные отделения','Логистика',['v15_wagon'],{supply:1.12,armySpeed:1.03},245,43],
 ['v16_supply_record','Книга армейских поставок','Логистика',['v15_magazines'],{supply:1.07,arsenalCost:.97},195,35],
 ['v16_bridges','Военно-полевые мосты','Логистика',['roads'],{armySpeed:1.09,supply:1.03},175,31],
 ['v16_sappers','Инженерные роты в поле','Артиллерия и осады',['siege'],{artillery:1.07,armySpeed:1.04},210,39],
 ['v16_counterbattery','Контрбатарейная школа','Артиллерия и осады',['v15_fieldcannon'],{artillery:1.13},230,45],
 ['v16_platoon_fire','Офицерские огневые команды','Пехотные формирования',['platoonfire'],{infAttack:1.09},205,37],
 ['v16_discipline','Учебные лагеря регулярной армии','Пехотные формирования',['v15_drill'],{armyCost:.94,infAttack:1.05},215,36],
 ['v16_crew_school','Морская школа команд','Флот',['navalcollege'],{navalPower:1.07,shipSpeed:1.04},220,40],
 ['v16_yard_cranes','Портовые подъёмные механизмы','Кораблестроение',['drydock'],{shipTime:.87,shipCost:.98},230,44],
 ['v16_hull_wood','Сезонная выдержка корабельного леса','Кораблестроение',['v15_oak'],{shipHull:1.12,shipCost:1.04},240,42],
 ['v16_merchant_school','Коммерческие морские школы','Морская торговля',['trade','academies'],{trade:1.11,research:1.03},185,31],
 ['v16_statute','Провинциальные счётные палаты','Государственные реформы',['civilservice'],{trade:1.07,education:1.08},200,37],
 ['v16_printing','Печатные технические наставления','Образование',['v15_science'],{research:1.10,education:1.14,arsenalSpeed:1.03},235,44]
];
const V16_EFFECTS={};
for(const [id,name,cat,req,mods,cost,eduMin] of V16_RESEARCH){
  V16_EFFECTS[id]=mods;
  if(!TECH.some(x=>x.id===id))TECH.push({id,name,cat,req,cost,time:Math.max(4,Math.ceil(cost/44)),eduMin,desc:Object.entries(mods).map(([k,v])=>`${BONUS_NAMES[k]||k}: ${v<1?'−':'+'}${Math.round(Math.abs(v-1)*100)}%`).join(' · ')});
}
Object.assign(BONUS_NAMES,{gunRange:'Дальность корабельных орудий',gunPen:'Пробитие корабельных орудий'});
const v16PriorGlobalMod=globalMod;
globalMod=function(f,k){let base=v16PriorGlobalMod(f,k);for(const id of s?.tech?.[f]||[])if(V16_EFFECTS[id]?.[k]!=null)base*=V16_EFFECTS[id][k];return base};
const v16OldPower=power;
power=function(p,f,attack=false,where=0){let base=v16OldPower(p,f,attack,where);if(!p?.v15Regiments?.length)return base;let reg=p.v15Regiments,mods=reg.map(r=>{let m=V16_FORMATIONS[r.formation||'line']||V16_FORMATIONS.line;let q=(attack?m.atk:m.def),fat=Math.max(.7,1-(r.fatigue||0)/350),ammo=Math.max(.67,(r.ammo??100)/100);return q*fat*ammo});return base*mods.reduce((a,b)=>a+b,0)/Math.max(1,mods.length)};
const v16OldShipPower=v6shipPower;
v6shipPower=function(sh,admiral){let pow=v16OldShipPower(sh,admiral);const p=V16_GUN_PATTERN[sh?.v16Pattern||'standard']||V16_GUN_PATTERN.standard;return pow*p.damage*p.penetration*(.80+.002*(sh?.gunnery||0))/.80};
const v16PriorCannonStats=v15CannonStats;
v15CannonStats=function(c,f=0){let out=v16PriorCannonStats(c,f);return {...out,penetration:out.penetration*globalMod(f,'gunPen'),range:out.range*globalMod(f,'gunRange')}};
const v16PriorFire=v8fire;
v8fire=function(u){if(!V8_SCENE||V8_SCENE.kind!=='sea'||u.kind!=='ship')return v16PriorFire(u);let sc=V8_SCENE;if(u.hp<=0||u.cooldown>0)return;const enemy=sc.units.filter(z=>z.team!==u.team&&z.hp>0).sort((a,b)=>Math.hypot(a.pos[0]-u.pos[0],a.pos[1]-u.pos[1])-Math.hypot(b.pos[0]-u.pos[0],b.pos[1]-u.pos[1]))[0];if(!enemy)return;const sh=s.ships.find(x=>x.id===u.shipId),f=sh?.f??s.player,rows=u.design?.batteries?.filter(x=>x.count>0)||[];if(!rows.length)return v16PriorFire(u);const pat=sh?.v16Pattern||'standard',arr=rows.map(r=>({n:r.count,st:v16GunStats(CANNONS.find(c=>c.id===r.gun)||CANNONS[0],pat,f)})),count=arr.reduce((a,z)=>a+z.n,0);if(!count)return;const dist=Math.hypot(u.pos[0]-enemy.pos[0],u.pos[1]-enemy.pos[1]),range=Math.max(...arr.map(z=>z.st.range))/12;if(dist>range)return;const theta=Math.atan2(enemy.pos[1]-u.pos[1],enemy.pos[0]-u.pos[0]),bearing=Math.abs(Math.atan2(Math.sin(theta-u.angle),Math.cos(theta-u.angle)));if(bearing<Math.PI*.19||bearing>Math.PI*.88)return;if(u.ammo==null)u.ammo=100;if(u.ammo<1)return;const power=arr.reduce((a,z)=>a+z.st.damage*z.n/2,0),penetration=arr.reduce((a,z)=>a+z.st.penetration*z.n,0)/count,reload=arr.reduce((a,z)=>a+z.st.reload*z.n,0)/count,armor=(enemy.type==='line'?25:enemy.type==='frigate'?15:enemy.type==='transport'?6:9)*Math.max(.6,enemy.hp/Math.max(1,enemy.maxHp||enemy.hp)),pen=Math.min(1.35,Math.max(.28,penetration/Math.max(1,armor))),crew=Math.max(.35,(sh?.crew||u.crew||70)/Math.max(1,sh?.crewMax||u.crewMax||100)),accuracy=Math.max(.10,(1-dist/(range*1.45))*(.67+Math.random()*.33))*(1+.0025*(sh?.gunnery||0))*globalMod(f,'gunAccuracy');const hit=Math.max(.5,power*.16*pen*accuracy*crew);enemy.hp=Math.max(0,enemy.hp-hit);u.cooldown=Math.max(2,reload*4.8/(1+.002*(sh?.gunnery||0)));u.ammo-=1;sc.smoke ||= [];for(let j=0;j<7;j++)sc.smoke.push({x:u.pos[0]+Math.random()*1.7,y:u.pos[1]+Math.random()*1.7,z:1+Math.random()*2,age:0});if(u.team==='friendly'&&v8Battle)v8Battle.lastHit=`${u.name} → ${enemy.name}: ${hit.toFixed(1)} урона · пробитие ${Math.round(pen*100)}%`};
const v16PriorMesh=v8shipMesh;
v8shipMesh=function(type='frigate',design=null){let m=v16PriorMesh(type,design);const r=v15Random(v15Hash('XVI|'+(design?.modelSeed||design?.id||design?.name||type)));const size=type==='line'?1.55:type==='frigate'?1.1:type==='transport'?1.16:.82,L=11*size,W=(type==='line'?3.4:2.8)*size;const gild=['#e3c27b','#b2ae99','#e3ad6a','#a8bbb8'][Math.floor(r()*4)];let trim=3+Math.floor(r()*4);for(let sgn of [-1,1]){for(let j=0;j<trim;j++){let x=-L*.42+(j+.5)*L*.76/trim;v8seg(m,[x,sgn*W*.43,-.12*size],[x+.08*size,sgn*W*.43,.26*size],gild,.5)}for(let j=0;j<4;j++){let x=-L*.38+(j+.5)*L*.74/4;v8cube(m,x,sgn*W*.38,.29*size,.19*size,.02*size,.07*size,gild)}}const flagR=r();for(let j=0;j<3;j++){const x=(-.13+j*.19)*L;v8seg(m,[x,0,5.1*size+j*.1*size],[x+(flagR-.5)*.8*size,.1*size,5.7*size+j*.1*size],'#eadab3',.75)}return m};
const v16PriorAdvance=advanceDay;
advanceDay=function(){v16PriorAdvance();if(!s||s.ended)return;const v=v16();for(let a of v.gunRefits){a.remaining--;if(a.remaining<=0){let sh=s.ships.find(x=>x.id===a.shipId);if(sh){sh.v16Pattern=a.pattern;log(`${sh.name}: переоснащение батарей завершено — ${V16_GUN_PATTERN[a.pattern].name}.`)}}}v.gunRefits=v.gunRefits.filter(x=>x.remaining>0);for(let a of v.crewDrill){a.remaining--;if(a.remaining<=0){let sh=s.ships.find(x=>x.id===a.shipId);if(sh){sh.gunnery=Math.min(100,(sh.gunnery||0)+12);sh.seamanship=Math.min(100,(sh.seamanship||0)+9);log(`${sh.name}: артиллерийские учения завершены. Навыки экипажа повышены.`)}}}v.crewDrill=v.crewDrill.filter(x=>x.remaining>0);if(s.day===2)v16ImportMonth()};
const v16PriorReg=v15RegPanel;
v15RegPanel=v16RegPanel;
const v16PriorShipPanel=v15ShipPanel;
v15ShipPanel=function(){let base=v16PriorShipPanel(),sh=s.ships.find(x=>x.id===v15ShipId&&x.f===s.player);return base+(sh?v16GunPanel(sh):'')};
const v16PriorHeader=v15Header;
v15Header=function(){let out=v16PriorHeader();return out.replace('</nav>',`<button class="${v15OverlayTab==='logistics'?'on':''}" onclick="v15Switch('logistics')">Снабжение</button></nav>`)};
const v16PriorRender=v15Render;
v15Render=function(){if(v15OverlayTab!=='logistics')return v16PriorRender();let el=document.getElementById('v15-window');if(!el||!s)return;el.innerHTML=v15Header()+`<div class="v15-h-body">${v16StockPanel()}</div>`};
const v16PriorRail=v15Rail;
v15Rail=function(){v16PriorRail();const el=document.getElementById('v15-rail');if(!el)return;el.insertAdjacentHTML('beforeend','<button class="v16-supplylink" onclick="v15Open(\'logistics\')">Снабжение и закупки ↗</button>')};
v16ApplyCSS();
const v16PriorScaleLabel=v6scaleLabel;
v6scaleLabel=function(){v16PriorScaleLabel();v16MapLabels()};
const v16OldUpdateTransform=updateTransform;
updateTransform=function(){v16OldUpdateTransform();v16MapLabels()};
const v16OldDrawMap=drawMap;
drawMap=function(){v16OldDrawMap();v16MapLabels()};
const v16OldComputerTurn=computerTurn;
computerTurn=function(){v16OldComputerTurn();v16StrategicAITurn()};
const V16_SAVE_KEY='empire_of_sails_v16_save';
const v16PreviousSave=save, v16PreviousLoad=load, v16PreviousQuiet=saveQuiet;
save=function(){try{v16();v8get();localStorage.setItem(V16_SAVE_KEY,JSON.stringify(s));say('Кампания XVI сохранена')}catch(e){say('Локальное сохранение недоступно: используйте экспорт JSON')}};
load=function(){try{let raw=JSON.parse(localStorage.getItem(V16_SAVE_KEY)||localStorage.getItem(V10_SAVE_KEY)||'null');if(!raw)throw Error('Нет сохранения');restoreSave(raw);v16();drawAll();say('Кампания XVI загружена')}catch(e){say('Загрузка не удалась: '+e.message)}};
saveQuiet=function(){try{if(s){v16();localStorage.setItem(V16_SAVE_KEY,JSON.stringify(s))}}catch(e){}};
const v16OldFleetSpeed=v8fleetSpeed;
v8fleetSpeed=function(fleet){const speed=v16OldFleetSpeed(fleet),members=v8shipsOf(fleet);if(!members?.length)return speed;const factor=Math.min(...members.map(sh=>sh.v16Pattern==='long'?.955:sh.v16Pattern==='short'?1.035:1));return Math.max(2.5,speed*factor)};
const V17_SAVE_KEY='imperii_parusov_v17_save';
const V17_POLICIES={
 balanced:{name:'Сбалансированная корона',desc:'Финансы и армия развиваются без перекоса',mods:{},stability:0},
 maritime:{name:'Морская держава',desc:'Больше кораблей, но сложнее снабжать сухопутные войска',mods:{shipTime:.89,shipCost:.94,navalPower:1.08,armyCost:1.08},stability:0},
 continental:{name:'Военное государство',desc:'Постоянные полки и осадные парки',mods:{infAttack:1.08,artillery:1.06,armyCost:.94,trade:.94},stability:-2},
 mercantile:{name:'Торговая республика',desc:'Больше доходов и науки, но дорогая оборона',mods:{trade:1.15,research:1.06,fort:.93},stability:1},
 academy:{name:'Академическое управление',desc:'Научные общества и образовательные реформы',mods:{education:1.18,research:1.10,shipCost:1.06,armyCost:1.04},stability:0}
};
const V17_TECHS=[
 ['v17_armoury_cadastre','Арсенальная перепись','Хозяйство',['manufactory'],125,4,22,{arsenalSpeed:1.08,arsenalCost:.97}],
 ['v17_steel_quality','Испытание кузнечной стали','Хозяйство',['v17_armoury_cadastre'],155,5,30,{gunCost:.94,industry:1.04}],
 ['v17_powder_rations','Пороховые нормы','Логистика',['magazine'],130,4,26,{armyLoss:.94,gunCost:.97}],
 ['v17_river_transports','Речные перевалки','Логистика',['roads'],155,5,35,{armySpeed:1.06,trade:1.04}],
 ['v17_officer_colleges','Школы унтер-офицеров','Образование',['academies'],140,5,31,{education:1.11,regimentTime:.94}],
 ['v17_textbook_press','Учебная печать','Образование',['v17_officer_colleges'],180,6,41,{research:1.08,education:1.10}],
 ['v17_survey_cadets','Кадетская геодезия','Образование',['v17_textbook_press'],190,6,46,{research:1.05,armySpeed:1.06}],
 ['v17_regiment_standards','Полковые знамёна','Пехотные формирования',['drill'],130,4,26,{infAttack:1.05,infantryDef:1.06}],
 ['v17_battalion_fire','Очередность залпов','Пехотное оружие',['flintlock'],165,5,37,{infAttack:1.09,regimentTime:1.03}],
 ['v17_field_musicians','Полковые музыканты','Пехотные формирования',['v17_regiment_standards'],165,5,42,{infantryDef:1.09,armyLoss:.96}],
 ['v17_cavalry_remount','Ремонтные конные депо','Конница',['cavalry'],135,4,29,{cavalry:1.07,armySpeed:1.05}],
 ['v17_iron_liners','Упрочнение каналов стволов','Морская артиллерия',['gunnery'],205,6,47,{gunPen:1.10,gunDamage:1.06,gunCost:1.04}],
 ['v17_quick_sponges','Банники нового образца','Морская артиллерия',['v17_iron_liners'],195,6,50,{gunReload:1.10,gunAccuracy:1.03}],
 ['v17_aimed_fire','Школа прицельного огня','Морская артиллерия',['v17_quick_sponges'],245,7,60,{gunRange:1.08,gunAccuracy:1.08}],
 ['v17_deck_reinforcement','Усиление орудийных палуб','Кораблестроение',['shipyards'],185,6,42,{shipHull:1.10,shipCost:1.04}],
 ['v17_blocks_pulleys','Система блоков и талей','Кораблестроение',['rigging'],170,5,40,{shipTime:.90,shipSpeed:1.04}],
 ['v17_galley_kitchens','Корабельные камбузы','Флот',['navigation'],160,5,44,{shipPower:1.05,shipTime:.97}],
 ['v17_signal_books','Кодовые книги эскадр','Флот',['signals'],205,6,55,{navalPower:1.08,shipSpeed:1.05}],
 ['v17_merchants_insurance','Купеческое страхование','Морская торговля',['trade'],170,5,37,{trade:1.12,shipCost:.98}],
 ['v17_state_contracts','Контрактные мануфактуры','Государственные реформы',['cadastre'],195,5,49,{arsenalCost:.92,armyCost:.96}]
];
for(let [id,name,cat,req,cost,time,eduMin,mods] of V17_TECHS){if(!TECH.some(x=>x.id===id))TECH.push({id,name,cat,req,cost,time,eduMin,mods,desc:Object.entries(mods).map(([k,v])=>`${BONUS_NAMES[k]||k}: ${v<1?'−':'+'}${Math.round(Math.abs(v-1)*100)}%`).join(' · ')})}
Object.assign(BONUS_NAMES,{artillery:'Урон артиллерии',infantryDef:'Оборона пехоты',gunPen:'Пробитие орудий',gunRange:'Дальность орудий',gunReload:'Скорость перезарядки',gunDamage:'Урон орудий',shipHull:'Прочность корпуса',regimentTime:'Срок подготовки',armyLoss:'Потери войск',gunAccuracy:'Точность орудий',shipSpeed:'Скорость кораблей',arsenalSpeed:'Скорость производства',arsenalCost:'Себестоимость продукции'});
const v17PriorMod=globalMod;
globalMod=function(f,k){let v=v17PriorMod(f,k);const p=V17_POLICIES[v17State()?.policies?.[f]||'balanced'];if(p?.mods?.[k]!=null)v*=p.mods[k];for(const t of V17_TECHS){if(has(f,t[0])&&t[7][k]!=null)v*=t[7][k]}return v};
const V17_PLATES={};
const v17OldTechPanel=v15TechPanel;
v15TechPanel=function(){return v17OldTechPanel()+v17NewTechBlock()};
const V17_ACCESSORIES={
 bayonet:{name:'Штык к мушкету',bonus:{attack:1.06,defence:1.03},count:90,tech:null,category:'Пехота'},
 sabre1700:{name:'Палаш',bonus:{attack:1.07,morale:1.02},count:75,tech:null,category:'Пехота и конница'},
 cavalrySabre:{name:'Кавалерийская сабля',bonus:{attack:1.10,defence:1.01},count:75,tech:null,category:'Конница'},
 uniform:{name:'Полковое обмундирование',bonus:{defence:1.04,morale:1.05},count:120,tech:null,category:'Все части'},
 wagon:{name:'Полковой обоз',bonus:{supply:1.13,defence:1.02},count:1,tech:'roads',category:'Все части'}
};
const v17OldRegPanel=v15RegPanel;
v15RegPanel=function(){return v17OldRegPanel()+v17AccessoryPanel()};
const v17OldPower=power;
power=function(p,f,attack=false,where=0){let val=v17OldPower(p,f,attack,where);if(!p?.v15Regiments?.length)return val;const factors=p.v15Regiments.map(r=>v17KitFactor(r,attack?'attack':'defence'));return val*factors.reduce((a,b)=>a+b,0)/factors.length};
const v17OldShipPanel=v15ShipPanel;
v15ShipPanel=function(){return v17ShipDesigner()+v17AdmiralCard()+v17OldShipPanel()};
let V17_CAM={yaw:.64,pitch:.48,zoom:1.0,frame:0};
const v17OldRender=v15Render;
v15Render=function(){if(v15OverlayTab==='policy'){const el=document.getElementById('v15-window');if(el)el.innerHTML=v15Header()+`<div class="v15-h-body">${v17PolicyPanel()}</div>`;return}v17OldRender();if(v15OverlayTab==='fleet')requestAnimationFrame(v17InitCanvas)};
const v17OldRail=v15Rail;
v15Rail=function(){v17OldRail();const rail=document.getElementById('v15-rail');if(rail&&!rail.querySelector('#v17-policy-button'))rail.insertAdjacentHTML('beforeend','<button id="v17-policy-button" class="v15-main" onclick="v15Open(\'policy\')">Государственные доктрины ↗</button>')};
const v17OldStartMesh=v8meshFor;
v8meshFor=function(entity){if(entity?.kind==='ship'&&entity.design?.modelSeed!=null){entity.meshKey=(entity.meshKey||entity.kind+':'+entity.type)+':variant-'+entity.design.modelSeed}return v17OldStartMesh(entity)};
v8cannon3d=function(m,x,y,z,lb=12,side=1,scale=1){let L=(.40+lb*.009)*scale,r=(.055+lb*.0016)*scale,chassis=(.37+lb*.003)*scale;
 v8cube(m,x,y,z-.10*scale,chassis,.35*scale,.15*scale,'#875e39');v8cube(m,x,y-side*.035*scale,z-.04*scale,chassis*.9,.29*scale,.045*scale,'#ac895b');
 for(let dx of [-chassis*.32,chassis*.32]){let px=x+dx;v8cylinder(m,[px,y-.22*scale,z-.15*scale],[px,y+.22*scale,z-.15*scale],.13*scale,'#5b402b',12);v8cylinder(m,[px,y-.23*scale,z-.15*scale],[px,y-.25*scale,z-.15*scale],.05*scale,'#bd985c',12)}
 v8cylinder(m,[x,y-side*.13*scale,z+.05*scale],[x,y+side*L,z+.06*scale],r,'#333a3e',13);
 v8cylinder(m,[x,y+side*(L*.83),z+.06*scale],[x,y+side*(L*.96),z+.06*scale],r*1.20,'#42494c',13);
 v8cylinder(m,[x,y-side*.15*scale,z+.06*scale],[x,y-side*.19*scale,z+.06*scale],r*1.43,'#485052',13);
 v8seg(m,[x-chassis*.31,y-side*.12*scale,z-.03*scale],[x+chassis*.31,y-side*.12*scale,z-.03*scale],'#947244',1.3);
};
const v17PriorMap=drawMap;
drawMap=function(){v17PriorMap();v17StyleMap()};
const v17PriorFresh=fresh;
fresh=function(f=0){v17PriorFresh(f);if(s)v17State()};
const v17PriorSave=save,v17PriorLoad=load,v17PriorQuiet=saveQuiet;
save=function(){try{localStorage.setItem(V17_SAVE_KEY,JSON.stringify(s));say('Кампания XVII сохранена')}catch(e){say('Сохранение недоступно — экспортируйте JSON')}};
load=function(){try{let raw=JSON.parse(localStorage.getItem(V17_SAVE_KEY)||localStorage.getItem(V16_SAVE_KEY)||'null');if(!raw)throw Error('Нет сохранения');restoreSave(raw);v17State();drawAll();say('Кампания XVII загружена')}catch(e){say('Не удалось загрузить: '+e.message)}};
saveQuiet=function(){try{if(s)localStorage.setItem(V17_SAVE_KEY,JSON.stringify(s))}catch(e){}};
const v17PriorAI=computerTurn;
computerTurn=function(){v17PriorAI();if(!s)return;const v=v17State();for(let f=0;f<F.length;f++){if(f===s.player||!regOf(f).length)continue;const preferred=NATIONAL[f]?.quality==='navy'?'maritime':NATIONAL[f]?.quality==='army'?'continental':NATIONAL[f]?.quality==='research'?'academy':'mercantile';if(v.policies[f])continue;if(s.gold[f]>=260){s.gold[f]-=130;v.policies[f]=preferred}}};
v17Css();
const v17PreviousNewGame=newGame;
newGame=function(){v17PreviousNewGame();if(!s)return;zoom=1.04;panX=0;panY=0;updateTransform();v6scaleLabel()};
const v17PrevMapDecor=v17StyleMap;
v17StyleMap=function(){v17PrevMapDecor();const world=document.getElementById('world');if(!world)return;let g=document.getElementById('v17-mountains');if(g)return;g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('id','v17-mountains');g.setAttribute('pointer-events','none');let marks=N.filter(x=>x.terrain==='mountain'||x.terrain==='hills').filter((x,i)=>i%9===0).slice(0,180);g.innerHTML=marks.map(x=>`<path d="M${x.x-2},${x.y+2} l2,-4 l2,4" stroke="#e5e1c8" stroke-width=".8" fill="none" opacity=".4"/>`).join('');world.appendChild(g)};
const v17BrandOriginal=drawAll;
drawAll=function(){v17BrandOriginal();const el=document.querySelector('.brand .edition');if(el)el.textContent='XVII'};
v14MapDecor=function(){};
const v17OldFreshView=fresh;
fresh=function(f=0){v17OldFreshView(f);if(s){zoom=1.04;panX=0;panY=0;updateTransform();v6scaleLabel();document.getElementById('v14decor')?.remove()}};
const v17PriorUI=drawAll;
drawAll=function(){v17PriorUI();if(!s)return;const brand=document.querySelector('.brand');if(brand){let fl=document.getElementById('v17-countryflag');if(!fl){fl=document.createElement('img');fl.id='v17-countryflag';fl.alt='Флаг державы';fl.title='Открыть государственный совет';fl.onclick=()=>{tab='court';drawAll()};brand.insertBefore(fl,brand.firstChild)}let url=v17FlagData(s.player);if(fl.src!==url)fl.src=url}
 const labelAllowed=['Швеция','Франция','Испания','Россия','Австрия','Пруссия','Речь Посполитая','Османская империя','Англия','Великобритания','Португалия','Нидерланды','Дания'];for(const n of document.querySelectorAll('#towns .majorlabel')){const name=n.textContent.trim();n.style.display=zoom<2.5&&!labelAllowed.some(x=>name.includes(x))&&!n.classList.contains('focus')?'none':''}}
const v17MoreStyle=document.createElement('style');
v17MoreStyle.textContent=`.brand{position:relative;padding-left:74px!important;min-height:59px;display:flex;flex-direction:column;justify-content:center}#v17-countryflag{position:absolute;left:0;top:1px;width:65px;height:45px;object-fit:cover;border:2px solid #cba86a;border-radius:4px;box-shadow:0 2px 14px #0007;cursor:pointer}#v17-countryflag:hover{filter:brightness(1.17)}.mapframe .majorlabel{paint-order:stroke}.v17-canvas-shell{min-height:380px}`;
document.head.appendChild(v17MoreStyle);
const V18_KEY='imperii_parusov_v18_save';
const V18_TECHS=[
 ['v18_recruit_census','Рекрутские реестры','Государственные реформы',['cadastre'],148,4,28,{armyCost:.96,manpower:1.08}],
 ['v18_inland_post','Почтовые тракты','Логистика',['roads'],164,5,30,{armySpeed:1.05,supply:1.08}],
 ['v18_wagon_park','Королевский обозный парк','Логистика',['magazine'],196,6,42,{armyLoss:.92,supply:1.12}],
 ['v18_artisan_training','Гильдейская подготовка мастеров','Хозяйство',['manufactory'],172,5,34,{arsenalSpeed:1.10,arsenalCost:.96}],
 ['v18_quartz_glass','Точное стеклоделие','Образование',['academies'],178,5,42,{research:1.04,education:1.08,gunAccuracy:1.03}],
 ['v18_cartographer','Королевские картографы','Образование',['navigation'],183,6,45,{research:1.05,shipSpeed:1.04,armySpeed:1.03}],
 ['v18_military_surgeons','Полковые хирурги','Пехотные формирования',['infantry_forms'],193,6,41,{armyLoss:.90,infantryDef:1.04}],
 ['v18_battle_drums','Сигнальные барабаны','Пехотные формирования',['drill'],142,4,27,{infantryDef:1.04,regimentTime:.94}],
 ['v18_hardened_steel','Закалённые клинки','Пехотное оружие',['flintlock'],173,5,40,{infAttack:1.06,gunCost:1.02}],
 ['v18_rapid_ramrods','Усовершенствованные шомпола','Пехотное оружие',['flintlock'],196,5,43,{infAttack:1.09,arsenalCost:1.03}],
 ['v18_siege_workshops','Подвижные осадные мастерские','Артиллерия и осады',['siege'],202,6,45,{artillery:1.07,armySpeed:1.03}],
 ['v18_shell_quality','Стандарты порохового заряда','Морская артиллерия',['gunnery'],218,6,49,{gunDamage:1.08,gunAccuracy:1.04,gunCost:1.03}],
 ['v18_bore_gauges','Калибровочные шаблоны','Морская артиллерия',['v18_shell_quality'],236,7,55,{gunPen:1.08,gunRange:1.04,gunReload:1.03}],
 ['v18_recoil_tackle','Противооткатные тали','Морская артиллерия',['guncarriages'],231,7,53,{gunReload:1.09,gunAccuracy:1.03,shipCost:1.02}],
 ['v18_bilge_pumps','Усовершенствованные осушительные насосы','Кораблестроение',['shipyards'],218,6,48,{shipHull:1.08,shipTime:1.03}],
 ['v18_hull_patterns','Типовые шаблоны корпусов','Кораблестроение',['shipyards'],212,6,46,{shipTime:.92,shipCost:.97,shipHull:1.02}],
 ['v18_fleet_supply','Эскадренное снабжение','Флот',['navigation'],224,7,50,{supply:1.08,shipSpeed:1.04,navalPower:1.03}],
 ['v18_signals','Боевые сигнальные таблицы','Флот',['signals'],238,7,57,{navalPower:1.07,gunAccuracy:1.05}],
 ['v18_port_insurance','Портовая страховая палата','Морская торговля',['insurance'],208,6,46,{trade:1.08,shipCost:.97}],
 ['v18_coastal_merchants','Каботажные торговые линии','Морская торговля',['convoys'],190,6,40,{trade:1.07,supply:1.05}],
 ['v18_depot_inspections','Инспекция армейских складов','Государственные реформы',['logistics'],204,6,44,{armyLoss:.94,supply:1.09,armyCost:1.02}],
 ['v18_auditors','Контроль государственных заказов','Государственные реформы',['banking'],219,6,47,{arsenalCost:.94,trade:1.04}]
];
Object.assign(BONUS_NAMES,{manpower:'Резерв рекрутов',armyLoss:'Потери армии',supply:'Эффективность снабжения',shipHull:'Прочность корпуса',gunPen:'Бронепробитие орудий',gunRange:'Дальность стрельбы',gunDamage:'Урон артиллерии',gunReload:'Скорость перезарядки',gunAccuracy:'Точность артиллерии',arsenalSpeed:'Выпуск мануфактур',arsenalCost:'Себестоимость производства',regimentTime:'Подготовка полков',infantryDef:'Оборона пехоты'});
for(const [id,name,cat,req,cost,time,eduMin,mods] of V18_TECHS){
 if(!TECH.some(t=>t.id===id))TECH.push({id,name,cat,req,cost,time,eduMin,mods,
 desc:Object.entries(mods).map(([k,val])=>`${BONUS_NAMES[k]||k}: ${val<1?'−':'+'}${Math.round(Math.abs(val-1)*100)}%`).join(' · ')});
}
const V18_MINISTRIES={
 military:{title:'Инспекция военного ведомства',label:'Военная реформа',cost:165,mods:{armyCost:.96,infantryDef:1.05,regimentTime:.96},upkeep:7},
 navy:{title:'Реформа Адмиралтейства',label:'Морская реформа',cost:195,mods:{shipTime:.94,navalPower:1.05,gunAccuracy:1.04},upkeep:9},
 commerce:{title:'Купеческая палата',label:'Торговая реформа',cost:150,mods:{trade:1.08,arsenalCost:.97},upkeep:7},
 education:{title:'Королевская учёная комиссия',label:'Реформа образования',cost:175,mods:{education:1.11,research:1.06},upkeep:8}
};
const v18OriginalMod=globalMod;
globalMod=function(f,key){let v=v18OriginalMod(f,key);for(const [id,_,__,___,____,_____,______,mods] of V18_TECHS){if(mods[key]!=null&&has(f,id))v*=mods[key]}
 const ministry=V18_MINISTRIES[v18State()?.ministries?.[f]];if(ministry?.mods[key]!=null)v*=ministry.mods[key];return v;};
const v18OldRegPanel=v15RegPanel;
v15RegPanel=function(){return v18OldRegPanel()+v18RegStatus()};
const v18OldLandPower=power;
power=function(p,f,attack=false,where=0){let val=v18OldLandPower(p,f,attack,where);if(!p?.v15Regiments?.length)return val;
 let regs=p.v15Regiments,rat=regs.reduce((tot,r)=>{let st=v18RegStat(r);return tot+st.ratio*(.72+.28*st.ammo/100)*(1-.18*st.fatigue/100)},0)/regs.length;
 return val*(.55+.45*rat)*(attack?globalMod(f,'infAttack')/Math.max(.2,v18OriginalMod(f,'infAttack')):1);}
const v18OldShipPanel=v15ShipPanel;
v15ShipPanel=function(){return v18OldShipPanel()+v18CrewPanel()};
const v18OldShipPower=v6shipPower;
v6shipPower=function(sh,admiral){let out=v18OldShipPower(sh,admiral);let c=v18CrewStatus(sh);return out*(.90+.002*c.gunnery)*(.94+.001*c.boarding)*globalMod(sh.f,'gunDamage')/Math.max(.1,v18OriginalMod(sh.f,'gunDamage'));}
const v18OldSpeed=v8fleetSpeed;
v8fleetSpeed=function(fleet){let sp=v18OldSpeed(fleet),ships=v8shipsOf(fleet);if(!ships?.length)return sp;const skill=ships.reduce((a,sh)=>a+v18CrewStatus(sh).sailing,0)/ships.length;
 return sp*(.90+.002*skill)*globalMod(fleet.f,'shipSpeed')/Math.max(.1,v18OriginalMod(fleet.f,'shipSpeed'));};
const v18OldAdvance=advanceDay;
advanceDay=function(){v18OldAdvance();if(!s||s.ended)return;const v=v18State();for(const q of v.projects){q.remaining--;if(q.remaining<=0){if(q.kind==='crew'){let sh=s.ships.find(x=>x.id===q.shipId);if(sh){let stats=v18CrewStatus(sh);stats[q.skill]=Math.min(100,stats[q.skill]+14);if(q.skill==='gunnery')sh.gunnery=Math.min(100,(sh.gunnery||20)+10);if(q.skill==='sailing')sh.seamanship=Math.min(100,(sh.seamanship||20)+10);log(`${sh.name}: завершены учения, навык «${q.skill}» +14.`)}}}}
 v.projects=v.projects.filter(x=>x.remaining>0);
 if(s.day===1&&s.month%3===1){for(let f=0;f<F.length;f++){const ministry=V18_MINISTRIES[v.ministries[f]];if(ministry)s.gold[f]-=ministry.upkeep}}
};
const v18OldSupply=v8supplyOf;
v8supplyOf=function(i){let q=v18OldSupply(i),p=s?.provinces?.[i];if(!p)return q;
 const mod=globalMod(p.owner,'supply')/Math.max(.1,v18OriginalMod(p.owner,'supply'));
 return Math.max(0,Math.min(100,q*mod+(p.depot||0)*2+(p.road||0)*1.5+(N[i]?.port?(p.dock||0)*.6:0)));};
const v18OldHeader=v15Header;
v15Header=function(){return v18OldHeader().replace('</nav>',`<button class="${v15OverlayTab==='operations'?'on':''}" onclick="v15Switch('operations')">Штаб</button><button class="${v15OverlayTab==='government'?'on':''}" onclick="v15Switch('government')">Ведомства</button><button class="${v15OverlayTab==='supplyMap'?'on':''}" onclick="v15Switch('supplyMap')">Логистика</button></nav>`)};
const v18OldRender=v15Render;
v15Render=function(){if(['operations','government','supplyMap'].includes(v15OverlayTab)){
 const el=document.getElementById('v15-window');if(!el||!s)return;el.innerHTML=v15Header()+`<div class="v15-h-body">${v15OverlayTab==='operations'?v18OperationsScreen():v15OverlayTab==='government'?v18GovernmentPanel():v18SupplyScreen()}</div>`;return;}
 v18OldRender();};
const v18OldRail=v15Rail;
v15Rail=function(){v18OldRail();const rail=document.getElementById('v15-rail');if(!rail||rail.querySelector('.v18-rail'))return;
 rail.insertAdjacentHTML('beforeend',`<div class="v18-rail"><button onclick="v15Open('operations')">Оперативный штаб</button><button onclick="v15Open('government')">Министерства</button><button onclick="v15Open('supplyMap')">Сеть снабжения</button></div>`);};
const v18OldDrawMap=drawMap;
drawMap=function(){v18OldDrawMap();v18MapLayers()};
const v18OldZoom=updateTransform;
updateTransform=function(){v18OldZoom();const el=document.getElementById('v18-geo');if(el){el.style.opacity=zoom<1.8?'.25':zoom<4?'.58':'.86'}};
const v18OldShipMesh=v8shipMesh;
v8shipMesh=function(type='frigate',design=null){let m=v18OldShipMesh(type,design);if(!design)return m;
 const k=(Number(design.modelSeed)||0)>>>0,L=(type==='line'?1.55:type==='frigate'?1.1:type==='transport'?1.16:.82)*11;
 const beam=(type==='line'?3.4:2.8)*(type==='line'?1.55:type==='frigate'?1.1:type==='transport'?1.16:.82)*.5;
 const col=['#dbc183','#b5ad8c','#c59561','#d8b76b'][k%4],count=4+(k%4);
 for(const side of [-1,1]){
   for(let i=0;i<count;i++){let x=-L*.39+(i+.5)*L*.77/count;
     v8cube(m,x,side*beam*.91,.05,.18,.07,.21,'#25272b');
     v8cube(m,x,side*beam*.93,.19,.23,.065,.038,col);
   }
   v8seg(m,[L*.32,side*beam*.78,.46],[L*.42,side*beam*.66,.93],col,1.1);
 }
 for(let i=0;i<3;i++){const x=L*(i-1)*.22;
  v8seg(m,[x,0,3.3],[x+((k>>i)&3)*.12,beam*.62,.35],'#ab9f80',.55);
  v8seg(m,[x,0,3.3],[x-((k>>(i+3))&3)*.12,-beam*.62,.35],'#ab9f80',.55);
 }
 return m;};
const v18OldComputer=computerTurn;
computerTurn=function(){v18OldComputer();if(!s)return;const v=v18State();v.aiTicks++;
 for(let f=0;f<F.length;f++){if(f===s.player)continue;const regions=regOf(f);if(!regions.length)continue;
  if(!v.ministries[f]&&s.gold[f]>250){let q=NATIONAL[f]?.quality||'trade';let choice=q==='navy'?'navy':q==='army'?'military':q==='research'?'education':'commerce';s.gold[f]-=V18_MINISTRIES[choice].cost;v.ministries[f]=choice;}
  if(s.gold[f]>220){let frontier=regions.filter(x=>N[x.i].adj?.some(adj=>s.provinces[adj]?.owner!==f));let candidate=frontier.sort((a,b)=>armies(b.p)-armies(a.p))[0]||regions.find(z=>N[z.i].port)||regions[0];
   if(candidate){const p=candidate.p;if((p.depot||0)<2&&armies(p)>1){s.gold[f]-=95;p.depot=(p.depot||0)+1;}else if((p.road||0)<2){s.gold[f]-=80;p.road=(p.road||0)+1;}}
  }
 }
};
for(let i=0;i<NATIONAL.length;i++){NATIONAL[i].v18Portrait=v18Portrait(NATIONAL[i].ruler,'Правитель')}
for(const ad of ADVISERS){ad.v18Portrait=v18Portrait(ad.name,ad.role)}
const v18OldFresh=fresh;
fresh=function(f=0){v18OldFresh(f);if(s)v18State()};
const v18OldSave=save;
save=function(){try{v18State();localStorage.setItem(V18_KEY,JSON.stringify(s));say('Кампания XVIII сохранена')}catch(e){say('Ошибка сохранения: используйте экспорт JSON')}};
const v18OldLoad=load;
load=function(){try{let x=localStorage.getItem(V18_KEY)||localStorage.getItem(V17_SAVE_KEY);if(!x)throw Error('Сохранение отсутствует');restoreSave(JSON.parse(x));v18State();drawAll();say('Кампания XVIII загружена')}catch(e){say('Ошибка загрузки: '+e.message)}};
saveQuiet=function(){try{if(s)localStorage.setItem(V18_KEY,JSON.stringify(s))}catch(e){}};
const v18OldAll=drawAll;
drawAll=function(){v18OldAll();const el=document.querySelector('.brand .edition');if(el)el.textContent='XVIII'};
const v18CSS=document.createElement('style');
v18CSS.id='v18-css';
