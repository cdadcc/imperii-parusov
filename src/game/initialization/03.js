v18CSS.textContent=`
:root{--gold:#d7b77b;--cream:#f2dfb9;--ink:#eee8da}
body{font-family:Georgia,'Palatino Linotype',serif!important}
button,input,select,.mini,.note{font-family:'Segoe UI',Arial,sans-serif!important}
.brand h1{font-family:Georgia,'Palatino Linotype',serif!important;letter-spacing:1px}
.mapframe{border:1px solid #94784b!important;box-shadow:0 10px 36px #0009,inset 0 0 60px #030c16!important}
.panel{border-color:#785e3d!important;background:linear-gradient(170deg,#182c38,#0d1821)!important}
#map{filter:saturate(1.1) contrast(1.05)}
.v18-section{border:1px solid #6a573b;border-radius:10px;padding:14px;margin-bottom:14px;background:linear-gradient(155deg,#192b38,#0d1922);box-shadow:inset 0 1px 0 #d8b87815}
.v18-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;border-bottom:1px solid #635239;padding-bottom:10px;margin-bottom:12px;flex-wrap:wrap}.v18-h h2,.v18-h h3{font:700 25px Georgia,serif;color:#f0d6a3;margin:0}.v18-h h3{font-size:21px}.v18-h small{color:#b7c7ce}
.v18-cards{display:grid;grid-template-columns:repeat(2,minmax(230px,1fr));gap:12px}.v18-card{border:1px solid #675637;border-radius:9px;padding:10px;background:linear-gradient(175deg,#253746,#101a23)}.v18-card.is-active{border-color:#bfa36d}.v18-government-art{height:132px;overflow:hidden;position:relative;background:#162332;border:1px solid #6d6045;border-radius:7px}.v18-government-art img{max-height:135px;width:100%;object-fit:cover}.v18-government-art svg{width:100%;height:100%}.v18-card h3{font:700 19px Georgia,serif;color:#eedab0}.v18-mod{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:5px 0;font-size:12px}.v18-mod span{color:#c1cbd0}.v18-mod strong{color:#a4d3a7}.v18-cost{font-size:12px;color:#d6c199;margin:10px 0}.v18-card button{margin-top:8px;width:100%}
.v18-regmetrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.v18-controls{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.v18-controls button{flex:1;min-width:144px}
.v18-totals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:16px}.v18-totals div{padding:10px;background:#10212d;border:1px solid #4e6070;border-radius:8px;text-align:center}.v18-totals b{display:block;color:#ead09a;font:700 29px Georgia,serif}.v18-totals span{color:#bac8ce;font-size:12px}
.v18-operation-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.v18-operation{margin-bottom:8px;padding:8px;background:#122530;border:1px solid #4b5961;border-radius:7px}.v18-operation b{display:block;color:#e9d8b6}.v18-operation span{color:#bdcbd0;font-size:12px}
.v18-logrow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v18-logrow button{padding:9px;text-align:left}.v18-logrow button b{display:block}.v18-logrow button small{display:block;color:#c5cfcc}
.v18-rail{display:grid;gap:6px;margin-top:8px}.v18-rail button{background:linear-gradient(180deg,#274253,#132632);border-color:#846d46}
.v18-ports,.v18-peaks{transition:opacity .15s}
@media(max-width:1100px){.v18-cards,.v18-operation-grid,.v18-logrow{grid-template-columns:1fr}.v18-regmetrics{grid-template-columns:1fr}}
`;
document.head.appendChild(v18CSS);
const v18BeforePop=v10PopulationMonth;
v10PopulationMonth=function(){v18BeforePop();if(!s?.demography)return;
 let d=s.demography;
 for(let i=0;i<N.length;i++){
   let owner=s.provinces[i]?.owner;if(!Number.isInteger(owner))continue;
   let multiplier=globalMod(owner,'manpower');
   if(multiplier>1){let bonus=Math.round((d.population[i]||0)*.00016*(multiplier-1));
     d.manpower[i]=Math.min(Math.round((d.population[i]||0)*.075),Math.max(0,(d.manpower[i]||0)+bonus));
   }
 }
};
const v18BeforeLandDefense=power;
power=function(p,f,attack=false,where=0){let value=v18BeforeLandDefense(p,f,attack,where);if(!attack&&p){let infantry=UNITKEYS.some(k=>REGIMENTS[k]?.type==='Пехота'&&countUnit(p,k)>0);
 if(infantry)value*=globalMod(f,'infantryDef')/Math.max(.1,v18OriginalMod(f,'infantryDef'));}
 return value;};
const v18BeforeMilitaryLoss=militaryLoss;
militaryLoss=function(p,loss){let f=p?.owner;let adj=loss;
 if(Number.isInteger(f)&&f>=0&&f<F.length)adj=Math.floor(loss*globalMod(f,'armyLoss'));
 return v18BeforeMilitaryLoss(p,adj);};
const v18VisualFix=document.createElement('style');
v18VisualFix.id='v18-visualfix';
v18VisualFix.textContent=`
.v18-government-art{height:132px!important;background:linear-gradient(110deg,#2a3b4a,#111d26)!important;display:flex;justify-content:center;align-items:center}
.v18-government-art img{display:block!important;width:112px!important;height:128px!important;max-height:128px!important;object-fit:contain!important;border-left:2px solid #bea169;border-right:2px solid #bea169;box-shadow:0 0 22px #0005}
.v18-card h3{min-height:41px;margin-bottom:8px}.v18-section .v15-gauge{max-width:300px}
#map{background:radial-gradient(ellipse at 35% 24%,#2e6882,#0c3149 63%,#0c2231)!important}
`;
document.head.appendChild(v18VisualFix);
const V19_VERSION='XIX', V19_SAVE='imperii_parusov_v19_save';
const V19_LABELS={research:'Скорость исследований',education:'Рост образования',arsenalSpeed:'Скорость производства',arsenalCost:'Себестоимость вооружения',shipTime:'Время строительства кораблей',shipCost:'Стоимость кораблей',shipHull:'Прочность кораблей',shipSpeed:'Скорость эскадр',gunDamage:'Урон корабельной артиллерии',gunAccuracy:'Точность корабельных орудий',gunPen:'Пробитие орудий',gunRange:'Дальность корабельного огня',gunReload:'Скорость перезарядки',gunCost:'Стоимость корабельных орудий',navalPower:'Сила флота',armyCost:'Стоимость набора полков',infAttack:'Атака пехоты',infantryDef:'Оборона пехоты',cavalry:'Атака конницы',artillery:'Атака артиллерии',supply:'Эффективность снабжения',armySpeed:'Скорость марша',armyLoss:'Потери от истощения',regimentTime:'Срок подготовки полков',trade:'Торговые доходы',industry:'Эффективность мануфактур',fort:'Прочность крепостей',manpower:'Пополнение рекрутов'};
Object.assign(BONUS_NAMES,V19_LABELS);
const V19_LEGACY={
 'Образование':{research:1.007,education:1.008},'Хозяйство':{industry:1.006,arsenalCost:.996},'Морская торговля':{trade:1.007,shipCost:.997},'Управление':{research:1.004,trade:1.003},'Государственные реформы':{research:1.004,armyCost:.996},'Логистика':{supply:1.008,armySpeed:1.004},'Флот':{navalPower:1.006,shipSpeed:1.004},'Кораблестроение':{shipTime:.996,shipHull:1.005},'Морская артиллерия':{gunDamage:1.006,gunRange:1.004},'Артиллерия и осады':{artillery:1.007,armyLoss:.997},'Пехотное оружие':{infAttack:1.007,regimentTime:.996},'Пехотные формирования':{infantryDef:1.006,armyCost:.998},'Сухопутная война':{infAttack:1.006,infantryDef:1.005},'Конница':{cavalry:1.008,armySpeed:1.003}
};
const V19_RESEARCH=[
 ['v19_military_census','Послужные списки и военные реестры','Государственные реформы',['v18_recruit_census'],185,5,38,{manpower:1.07,regimentTime:.96,armyCost:.99}],
 ['v19_tax_observatory','Государственная налоговая инспекция','Хозяйство',['cadastre'],191,6,36,{trade:1.07,industry:1.05,armyCost:1.02}],
 ['v19_mint_standards','Монетные стандарты короны','Управление',['banking'],195,6,42,{trade:1.07,arsenalCost:.97,shipCost:.99}],
 ['v19_war_bonds','Военные займы и казначейские облигации','Государственные реформы',['banking'],212,6,43,{arsenalCost:.95,armyCost:.98,shipCost:1.03}],
 ['v19_ship_timber','Выдержка судостроительного дуба','Кораблестроение',['v15_oak'],218,6,47,{shipHull:1.09,shipCost:1.04,shipTime:1.02}],
 ['v19_balanced_hull','Балансировка киля и шпангоутов','Кораблестроение',['v18_hull_patterns'],243,7,56,{shipSpeed:1.07,shipHull:1.05,shipTime:1.02}],
 ['v19_copper_fasteners','Медные крепления обшивки','Кораблестроение',['coppering'],225,7,54,{shipHull:1.05,shipSpeed:1.03,shipCost:1.04}],
 ['v19_sail_cut','Крой парусов для манёвра','Флот',['rigging'],188,5,42,{shipSpeed:1.08,navalPower:1.03,shipCost:1.02}],
 ['v19_boarding_drill','Школа абордажных команд','Флот',['navalcollege'],225,6,50,{navalPower:1.08,regimentTime:.98,armyLoss:.99}],
 ['v19_convoy_signals','Конвойная сигнализация','Флот',['signals'],206,6,49,{shipSpeed:1.04,trade:1.08,navalPower:1.03}],
 ['v19_broadside_sequence','Последовательная бортовая стрельба','Морская артиллерия',['v15_quickfire'],251,7,60,{gunReload:1.10,gunAccuracy:1.06,gunCost:1.02}],
 ['v19_gunnery_tables','Баллистические таблицы','Морская артиллерия',['v18_bore_gauges'],245,7,60,{gunRange:1.10,gunAccuracy:1.07,gunReload:.98}],
 ['v19_breech_proof','Испытания казёнников','Морская артиллерия',['v17_iron_liners'],226,6,54,{gunPen:1.11,gunDamage:1.05,gunCost:1.06}],
 ['v19_foundry_calipers','Орудийные калибры и штангенциркули','Морская артиллерия',['gunfoundries'],224,6,49,{gunAccuracy:1.06,gunCost:.94,arsenalSpeed:1.03}],
 ['v19_crew_replacement','Резервные расчёты орудий','Морская артиллерия',['navalcollege'],209,6,50,{gunReload:1.08,armyLoss:.96,shipCost:1.01}],
 ['v19_horse_remount','Кавалерийские ремонтные станции','Конница',['v17_cavalry_remount'],216,6,48,{cavalry:1.09,armySpeed:1.04,armyCost:1.02}],
 ['v19_regiment_musicians','Полковые сигналы и барабанщики','Пехотные формирования',['v17_field_musicians'],207,6,46,{infantryDef:1.08,regimentTime:.95,armyCost:1.02}],
 ['v19_mobile_hospitals','Подвижные лазареты','Пехотные формирования',['v18_military_surgeons'],235,6,50,{armyLoss:.88,infantryDef:1.05,armySpeed:.99}],
 ['v19_cartridge_boxes','Стандарты патронных сумок','Пехотное оружие',['v15_cartridge'],183,5,43,{infAttack:1.08,regimentTime:.96,arsenalCost:1.02}],
 ['v19_bayonet_forge','Механизация ковки штыков','Пехотное оружие',['v15_bayonet'],212,6,52,{arsenalSpeed:1.10,arsenalCost:.93,infAttack:1.02}],
 ['v19_siege_trains','Осадные поезда и тяговые команды','Артиллерия и осады',['siege'],234,7,51,{artillery:1.11,armySpeed:.98,supply:1.06}],
 ['v19_field_fuses','Полевые огневые трубки','Артиллерия и осады',['artillery'],221,6,49,{artillery:1.09,gunDamage:1.03,arsenalCost:1.02}],
 ['v19_bridge_pontoons','Понтонные парки','Логистика',['roads'],215,6,48,{armySpeed:1.08,supply:1.07,armyCost:1.02}],
 ['v19_granary_audit','Учёт армейских провиантских складов','Логистика',['magazine'],199,6,46,{supply:1.12,armyLoss:.93,trade:1.02}],
 ['v19_wagon_wheels','Стандартизованные колёса обозов','Логистика',['v18_wagon_park'],220,6,52,{armySpeed:1.08,supply:1.08,arsenalCost:.98}],
 ['v19_geodesy','Геодезические академии','Образование',['v17_survey_cadets'],238,7,55,{research:1.10,armySpeed:1.03,education:1.04}],
 ['v19_academy_press','Учебные гравированные атласы','Образование',['v17_textbook_press'],218,6,52,{research:1.07,education:1.11,arsenalCost:1.01}],
 ['v19_engineering_schools','Школы прикладной механики','Образование',['universities'],235,6,55,{education:1.08,research:1.06,arsenalSpeed:1.08}],
 ['v19_mine_ventilation','Вентиляция шахт','Хозяйство',['mining'],199,6,46,{industry:1.10,arsenalCost:.97,trade:1.02}],
 ['v19_rolling_mills','Прокатные станки и листовое железо','Хозяйство',['blastfurnace'],256,7,58,{industry:1.09,arsenalSpeed:1.09,arsenalCost:.97}],
 ['v19_coastal_insurance','Страхование портовых грузов','Морская торговля',['insurance'],215,6,52,{trade:1.10,shipCost:.98,shipSpeed:1.02}],
 ['v19_naval_brokerage','Морская товарная биржа','Морская торговля',['trade'],220,6,49,{trade:1.11,shipCost:.97,arsenalCost:1.01}],
 ['v19_diplomatic_couriers','Постоянные дипломатические курьеры','Управление',['diplomacy'],201,6,45,{trade:1.05,research:1.04,armyCost:.99}],
 ['v19_staff_maps','Военные штабные карты','Государственные реформы',['staffcollege'],218,6,51,{armySpeed:1.06,infantryDef:1.05,supply:1.03}]
];
const V19_NEW={};
for(const [id,name,cat,req,cost,time,eduMin,mods] of V19_RESEARCH){V19_NEW[id]=mods;TECH.push({id,name,cat,req,cost,time,eduMin,mods,desc:'Модификаторы указаны на карточке и участвуют в расчётах кампании.'})}
const V19_OLD=new Map();
for(const t of TECH){if(!t.id.startsWith('v19_')&&!/^(v15_|v17_|v18_)/.test(t.id))V19_OLD.set(t.id,V19_LEGACY[t.cat]||{research:1.003,trade:1.003})}
const V19_MODS={};
for(const list of [V15_RESEARCH,V17_TECHS,V18_TECHS])for(const item of list){V19_MODS[item[0]]=item[item.length-1]}
for(const [id,m] of Object.entries(V19_NEW)) V19_MODS[id]=m;
for(const [id,m] of V19_OLD) V19_MODS[id]=m;
const v19GlobalBefore=globalMod;
const v19ModCache=new Map();
globalMod=function(f,key){const normal=v19GlobalBefore(f,key);return normal*(v19Aggregate(f)[key]||1)};
const V19_IMG_CACHE=new Map();
let v19Category='Морская артиллерия',v19Term='';
showTechTree=function(cat){if(cat&&TECH.some(t=>t.cat===cat))v19Category=cat;v19OpenTech()};
const v19BeforeHeader=v15Header;
v15Header=function(){return v19BeforeHeader().replace('</nav>',`<button class="${v15OverlayTab==='v19workshop'?'on':''}" onclick="v15Switch('v19workshop')">Портреты и 3D</button><button onclick="v19OpenTech()">Полное дерево</button></nav>`) };
const v19BeforeRender=v15Render;
v15Render=function(){if(v15OverlayTab==='v19workshop'){const el=document.getElementById('v15-window');if(!el||!s)return;el.innerHTML=v15Header()+`<div class="v15-h-body">${v19Workshop()}</div>`;try{v17InitCanvas();v17DrawModel()}catch(e){}return}v19BeforeRender()};
const v19BeforeIndustry=v15IndustryPanel;
v15IndustryPanel=function(){return v19FactoryReport()+v19BeforeIndustry()};
const v19OldAI=computerTurn;
computerTurn=function(){v19OldAI();if(!s)return;for(let f=0;f<F.length;f++){if(f===s.player||!regOf(f).length)continue;const land=regOf(f),front=land.filter(z=>N[z.i].adj.some(j=>withWar(f,s.provinces[j].owner))),sea=land.filter(z=>N[z.i].port),g=s.gold[f];
 if(!s.research[f]&&g>125){const options=TECH.filter(t=>!has(f,t.id)&&techAccessible(f,t)&&t.cost<Math.max(125,s.gold[f]*.55));if(options.length){const wartime=front.length>0,desired=wartime?['Логистика','Пехотные формирования','Пехотное оружие','Артиллерия и осады']:sea.length>1?['Кораблестроение','Флот','Морская артиллерия']:['Хозяйство','Образование'];options.sort((a,b)=>(desired.includes(b.cat)?4:0)-(desired.includes(a.cat)?4:0)+a.cost/1000-b.cost/1000);let t=options[0];s.gold[f]-=t.cost;s.research[f]={id:t.id,remaining:researchDays(t,f),total:researchDays(t,f)}}}
 const hub=front.sort((a,b)=>armies(b.p)-armies(a.p))[0]||land.find(z=>N[z.i].port)||land[0];if(!hub)continue;
 if(s.food[f]<24&&g>100){let ag=land.sort((a,b)=>(b.p.farm||0)-(a.p.farm||0))[0];if(ag.p.farm<4){ag.p.farm++;s.gold[f]-=75;}}
 else if(front.length&&hub.p.depot<2&&g>150){hub.p.depot++;s.gold[f]-=95;}
 else if(sea.length&&NATIONAL[f]?.quality==='navy'&&g>350&&s.wood[f]>50){let p=sea.sort((a,b)=>b.p.dock-a.p.dock)[0].p;if(!p.dock){p.dock=1;s.gold[f]-=135;s.wood[f]-=40;}}
 }};
const v19BeforeMesh=v8shipMesh;
v8shipMesh=function(type='frigate',design=null){const m=v19BeforeMesh(type,design);if(!design)return m;const seed=(Number(design.modelSeed)||v19hash(design.name||type))>>>0,k=seed%5,size=type==='line'?1.55:type==='frigate'?1.1:type==='transport'?1.16:.82,L=11*size,W=(type==='line'?3.4:2.8)*size;const gold=['#a58a57','#bd9c64','#bdab7b','#928768','#bf904e'][k];for(const sign of [-1,1]){
 for(let a=0;a<5+k;a++){const x=-L*.37+(a+.5)*(L*.74)/(5+k);v8cube(m,x,sign*W*.465,-.08*size,.20*size,.065*size,.18*size,'#161d20');v8seg(m,[x,sign*W*.49,.06],[x,sign*W*.49,-.20*size],gold,.7)}
 v8seg(m,[-L*.42,sign*W*.46,.24*size],[L*.42,sign*W*.46,.24*size],gold,.9);
 for(let i=0;i<3;i++){let x=L*(i-1)*.25;v8seg(m,[x,sign*W*.27,2.5*size],[x+((seed>>(i*2))&3)*.045*size,sign*W*.47,.25*size],'#bcb49c',.7)}
 }
 for(let i=0;i<3;i++){const x=L*(i-1)*.26;v8cube(m,x,0,1.65*size,.19*size,.18*size,.20*size,'#a58a67');v8seg(m,[x,0,1.70*size],[x,0,2.65*size],'#514639',1.0)}
 return m};
const v19OldCannon=v8cannon3d;
v8cannon3d=function(m,x,y,z,lb=12,side=1,scale=1){v19OldCannon(m,x,y,z,lb,side,scale);const len=(.38+.17*lb/12)*scale,sz=(.28+lb/70)*scale,r=(.065+lb/400)*scale;v8cube(m,x,y,z-.18*scale,sz*.85,.39*scale,.06*scale,'#6c4b31');v8cylinder(m,[x,y+side*len*.85,z+.05*scale],[x,y+side*len*.93,z+.05*scale],r*1.13,'#77706a',10);v8cube(m,x-sz*.28,y,z-.04*scale,.05*scale,.51*scale,.09*scale,'#634b35');v8cube(m,x+sz*.28,y,z-.04*scale,.05*scale,.51*scale,.09*scale,'#634b35')};
;
const v19OldDrawMap=drawMap;
drawMap=function(){v19OldDrawMap();v19GeoDecor()};
const v19OldTransform=updateTransform;
updateTransform=function(){v19OldTransform();let el=document.getElementById('v19-geo');if(el)el.style.opacity=zoom>4?'.95':zoom>2?'.42':'0'};
const v19OldSave=save;
save=function(){try{localStorage.setItem(V19_SAVE,JSON.stringify(s));say('Кампания XIX сохранена')}catch(e){v19OldSave()}};
const v19OldLoad=load;
load=function(){try{const txt=localStorage.getItem(V19_SAVE);if(!txt)return v19OldLoad();restoreSave(JSON.parse(txt));drawAll();say('Кампания XIX загружена')}catch(e){say('Не удалось открыть XIX: '+e.message)}};
const v19OldSaveQuiet=saveQuiet;
saveQuiet=function(){try{if(s)localStorage.setItem(V19_SAVE,JSON.stringify(s))}catch(e){}};
const v19Style=document.createElement('style');
v19Style.id='v19-css';
v19Style.textContent=`
:root{--gold:#d8b77b;--cream:#f1dcad;--ink:#ede7d7}
body{font-family:'Palatino Linotype',Georgia,serif!important}.brand h1,.panel h2,.v15-h-header h2{font-family:Georgia,serif!important;letter-spacing:.65px}.resourcebar{background:linear-gradient(180deg,#101e29,#09161e)!important}.resource{border-color:#6d5537!important;background:linear-gradient(180deg,#1b3441,#11222d)!important}.mapframe{border-color:#92754d!important}.maptools{background:linear-gradient(180deg,#213847,#0e2230)!important}
.v19-techtree{width:100%;color:#e8e0cd}.v19-techtree header{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:12px;border-bottom:1px solid #725b3b}.v19-techtree h2{margin:0;font:700 31px Georgia,serif;color:#f0d8a4}.v19-techtree header small{color:#b9c9cf}.v19-tech-dialog{width:min(1640px,96vw)!important;max-width:none!important;max-height:92vh!important;overflow:auto!important;background:#10202b!important;border:1px solid #a48451!important}.v19-techcats{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.v19-techcats button{font-size:12px;border:1px solid #536a74}.v19-techcats button.active{background:linear-gradient(#b38e56,#634d30);border-color:#c9aa79}.v19-search{display:flex;gap:14px;align-items:center;margin:9px 0}.v19-search input{min-width:300px;flex:1;background:#172d3a;color:#e8dac0;border:1px solid #775e3a;padding:11px}.v19-search span{color:#a9bec4}.v19-techgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}.v19-techcard{padding:9px;background:linear-gradient(180deg,#1d3441,#0d1922);border:1px solid #645538;border-radius:8px;display:flex;flex-direction:column;gap:6px}.v19-techcard.done{border-color:#5a987e}.v19-techcard>img{width:100%;height:124px;object-fit:cover;border:1px solid #b09562;border-radius:5px}.v19-techcard h3{margin:2px 0;font:700 18px Georgia,serif;color:#f5dda7}.v19-techcard p{color:#aebdc0;font-size:11px;min-height:40px;margin:0;line-height:1.35}.v19-gunstats{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px;padding:5px;background:#0b1a23;border:1px solid #53626a;border-radius:4px}.v19-gunstats b{color:#f2ce8c;font-size:11px;width:100%}.v19-gunstats span{font-size:10px;color:#bfd2d6;margin-right:4px}.v19-effects{padding:5px 0;border-top:1px solid #3f4f55;border-bottom:1px solid #3f4f55}.v19-effect{display:flex;justify-content:space-between;gap:8px;font-size:11px;line-height:1.75}.v19-effect span{color:#b7c6c9}.v19-effect strong.plus{color:#95c89f}.v19-effect strong.minus{color:#f0c788}.v19-prereq{font-size:10px;color:#c7b592;flex:1}.v19-techcard footer{display:flex;justify-content:space-between;align-items:center;gap:7px}.v19-techcard footer small{color:#d8c091}.v19-techcard button{padding:6px 8px;font-size:12px}
.v19-prod{padding:12px;border:1px solid #705b38;background:linear-gradient(180deg,#1b303b,#0d1820);border-radius:9px;margin-bottom:14px}.v19-prod h2{color:#f0d9a5;font:700 23px Georgia,serif;margin:4px 0}.v19-prod>p{color:#bbc7c9;font-size:12px}.v19-prodgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.v19-prodgrid article{padding:10px;border:1px solid #4f5a56;background:#112431;border-radius:8px}.v19-prodhead{display:flex;gap:9px;align-items:center}.v19-prodhead img{height:70px;width:96px;object-fit:cover;border:1px solid #a58a5a;border-radius:4px}.v19-prodhead small{display:block;color:#becacc}.v19-meter{height:7px;background:#0d181f;border-radius:5px;overflow:hidden;margin:9px 0}.v19-meter i{display:block;height:100%;background:linear-gradient(90deg,#6597ac,#cbb46e)}.v19-materials{display:grid;gap:2px}.v19-materials>div{display:flex;justify-content:space-between;color:#b8c9ce;font-size:11px}.v19-materials>div.short{color:#e6a197}.v19-change{display:flex;gap:6px;margin-top:9px}.v19-change select{min-width:0;flex:1;background:#172d3a;color:#f0ddba;border:1px solid #586a72}.v19-workcols{display:grid;grid-template-columns:1fr 2fr;gap:14px}.v19-wshop>header{margin:0 0 12px;border-bottom:1px solid #78613d}.v19-wshop h2{color:#f0d8a4}.v19-people{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v19-people>div{display:grid;gap:4px;border:1px solid #78613d;padding:5px;border-radius:6px;background:#14232d}.v19-people img{width:100%;height:176px;object-fit:cover}.v19-people b{font:700 13px Georgia,serif;color:#f0d8a4}.v19-advice{font-size:12px;color:#b7c9cb;padding:10px}
@media(max-width:1380px){.v19-techgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.v19-workcols{grid-template-columns:1fr}.v19-prodgrid{grid-template-columns:1fr}}@media(max-width:650px){.v19-techgrid,.v19-people{grid-template-columns:1fr}.v19-search{flex-direction:column}.v19-search input{min-width:0;width:100%}}
`;
document.head.appendChild(v19Style);
const v19OldAll=drawAll;
drawAll=function(){v19OldAll();const edition=document.querySelector('.brand .edition');if(edition)edition.textContent='XXI'};
const V19_FIELD_GEAR={
 v19_ramrod:{name:'Цилиндрический шомпол',tech:'v19_cartridge_boxes',work:.26,gold:.36,recipe:{iron:.028,wood:.006,coal:.002},bonus:{attack:1.06,defence:1.01},slot:'fire',quantity:120},
 v19_field_drum:{name:'Полковой барабан',tech:'v19_regiment_musicians',work:1.8,gold:2.5,recipe:{wood:1.2,leather:.4,copper:.16},bonus:{morale:1.08,defence:1.02},slot:'morale',quantity:4},
 v19_pioneers:{name:'Инженерный набор сапёра',tech:'v19_bridge_pontoons',work:1.3,gold:1.8,recipe:{iron:.5,wood:1.1,leather:.2},bonus:{attack:1.04,supply:1.07},slot:'engineering',quantity:8},
 v19_ammo_pouch:{name:'Патронная сумка',tech:'v19_cartridge_boxes',work:.18,gold:.25,recipe:{leather:.19,flax:.12},bonus:{attack:1.035,morale:1.02},slot:'ammunition',quantity:120}
};
for(const [key,item] of Object.entries(V19_FIELD_GEAR)){
 V6_EQUIP[key]={name:item.name,tech:item.tech,art:'musket',work:item.work,gold:item.gold,iron:item.recipe.iron||0,wood:item.recipe.wood||0};
 V8_EQUIP_RECIPES[key]=item.recipe;
}
const v19RegPanelPrior=v15RegPanel;
v15RegPanel=function(){return v19RegPanelPrior()+v19FieldPanel()};
const v19PowerPrior=power;
power=function(p,f,attack=false,where=0){let val=v19PowerPrior(p,f,attack,where);const list=p?.v15Regiments||[];if(!list.length)return val;const avg=list.reduce((a,r)=>a+v19GearFactor(r,attack?'attack':'defence')*(1+(v19GearFactor(r,'morale')-1)*.25),0)/list.length;return val*avg};
const v19FieldStyle=document.createElement('style');
v19FieldStyle.textContent=`.v19-field{padding:13px;border:1px solid #745e38;background:linear-gradient(180deg,#172e3a,#0c1a23);border-radius:8px;margin-top:14px}.v19-field h3{font:700 22px Georgia,serif;color:#f0d5a0}.v19-field p{color:#b7c8cc;font-size:12px}.v19-field-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.v19-field article{display:flex;flex-direction:column;gap:5px;border:1px solid #5b523c;border-radius:6px;padding:6px;background:#132432}.v19-field article img{width:100%;height:85px;object-fit:cover}.v19-field article b{font:700 15px Georgia,serif;color:#f2d8a6}.v19-field article small{color:#c0cdd0}.v19-field article button{margin-top:auto}.v19-field-total{padding:9px;margin-top:8px;color:#9ec99c;border-top:1px solid #5b523c}@media(max-width:1280px){.v19-field-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
document.head.appendChild(v19FieldStyle);
const V20_SAVE_KEY='empire_of_sails_v20_save';
const V20_MODULES={
 trumpet:{name:'Сигнальные рупоры',slot:'signals',tech:'v20_trumpet',recipe:{copper:.20,wood:.10,leather:.10},gold:3.5,work:1.3,mods:{commandDelay:.82,formationHold:1.06},desc:'Задержка приказов −18% · удержание линии +6%'},
 signalFlags:{name:'Межкорабельный комплект флагов',slot:'signals',tech:'v20_flags',recipe:{flax:.70,hemp:.24,wood:.14},gold:3.8,work:1.4,mods:{commandDelay:.88,formationHold:1.11,spotting:1.04},desc:'Задержка −12% · строй +11% · обнаружение +4%'},
 lightCarriage:{name:'Облегчённые пушечные лафеты',slot:'carriage',tech:'v20_carriage',recipe:{iron:1.6,wood:2.3,steel:.35},gold:9.5,work:3.1,mods:{carriageWeight:.88,gunReload:.96,recoilStress:1.08},desc:'Масса батарей −12% · перезарядка быстрее на 4% · износ креплений +8%'},
 recoilCarriage:{name:'Усиленные противооткатные лафеты',slot:'carriage',tech:'v20_recoil',recipe:{iron:2.3,wood:2.6,leather:.27},gold:11,work:3.3,mods:{gunAccuracy:1.07,carriageWeight:1.04,recoilStress:.83},desc:'Точность +7% · масса батарей +4% · износ −17%'},
 spyglass:{name:'Адмиральские подзорные трубы',slot:'navigation',tech:'v20_optics',recipe:{copper:.35,iron:.08,leather:.10},gold:7,work:2.0,mods:{spotting:1.18,gunAccuracy:1.03},desc:'Обнаружение +18% · точность +3%'},
 helmTackles:{name:'Усовершенствованные штуртросы',slot:'navigation',tech:'v20_helm',recipe:{hemp:.70,wood:.60,iron:.13},gold:5.5,work:1.9,mods:{turnRate:1.13,repairRate:.97},desc:'Скорость поворота +13% · скорость ремонта −3%'},
 magazine:{name:'Защищённые крюйт-камеры',slot:'safety',tech:'v20_magazine',recipe:{wood:1.5,iron:.30,leather:.22},gold:8,work:2.5,mods:{ammoCapacity:1.17,fireRisk:.76},desc:'Запас боеприпасов +17% · риск пожара −24%'},
 sickbay:{name:'Корабельный лазарет',slot:'safety',tech:'v20_surgeon',recipe:{flax:.35,wood:.80,copper:.13},gold:6,work:2.1,mods:{crewRecovery:1.17,supplyUse:1.045},desc:'Восстановление команды +17% · провиант +4,5%'}
};
const V20_SLOT_NAMES={signals:'Передача приказов',carriage:'Орудийные лафеты',navigation:'Управление и наблюдение',safety:'Защита экипажа'};
const V20_TECHS=[
 ['v20_trumpet','Морская артиллерия','Рупорная передача приказов',['signals'],23,152,{crewTraining:1.025}],
 ['v20_flags','Флот','Сигнальные книжки и вымпелы',['signals','navigation'],31,178,{spotting:1.025}],
 ['v20_carriage','Кораблестроение','Облегчённые корабельные лафеты',['guncarriages'],30,174,{repairRate:1.025}],
 ['v20_recoil','Морская артиллерия','Противооткатные платформы',['guncarriages'],36,186,{gunAccuracy:1.015}],
 ['v20_optics','Флот','Наблюдательная оптика флота',['navigation'],29,163,{spotting:1.025}],
 ['v20_helm','Кораблестроение','Штуртросы и рулевые блоки',['rigging'],26,148,{turnRate:1.025}],
 ['v20_magazine','Морская артиллерия','Безопасные артиллерийские погреба',['gunfoundries'],35,188,{fireRisk:.975}],
 ['v20_surgeon','Флот','Корабельная медицинская служба',['navalcollege'],37,177,{crewRecovery:1.03}],
 ['v20_line','Флот','Школа удержания боевой линии',['linebattle','signals'],39,202,{formationHold:1.16,commandDelay:.94}],
 ['v20_formation','Флот','Эскадренные манёвры по сигналу',['v20_line'],43,213,{formationHold:1.12,turnRate:1.07}],
 ['v20_shores','Логистика','Гидрографическая съёмка берегов',['navigation'],27,155,{landingPrep:1.14,landingCasualty:.92}],
 ['v20_marine','Флот','Школа корабельной пехоты',['v20_shores'],38,210,{boardingPower:1.17,landingPrep:1.08}],
 ['v20_depots','Логистика','Прибрежные провиантские станции',['logistics'],31,173,{seaSupply:1.13,convoyLoss:.94}],
 ['v20_training','Образование','Экзамены навигационных офицеров',['academies','navigation'],35,187,{crewTraining:1.12,commandDelay:.95}],
 ['v20_pumps','Кораблестроение','Корабельные помпы нового образца',['shipyards'],32,185,{damageControl:1.17,shipCost:1.025}],
 ['v20_pay','Управление','Унификация морского жалования',['banking'],29,165,{crewMorale:1.09,upkeep:1.06}],
 ['v20_couriers','Управление','Военные курьерские станции',['roads'],26,142,{armyCommandDelay:.90,armySupply:1.05}],
 ['v20_fieldmusic','Пехотные формирования','Полковые барабаны и рожки',['drill'],25,148,{regimentMorale:1.08,regimentSupply:1.025}],
 ['v20_sappers','Логистика','Инженерные понтонные парки',['roads','sappers'],34,196,{riverCrossing:1.16,roadCost:1.04}],
 ['v20_fiscal','Хозяйство','Контроль качества морских поставок',['banking','shipyards'],37,198,{navalProcurement:1.08,corruptionLoss:.95}]
];
for(const [id,cat,name,req,eduMin,cost,mods] of V20_TECHS){if(!TECH.some(t=>t.id===id))TECH.push({id,cat,name,req:req.filter(x=>TECH.some(t=>t.id===x)),eduMin,cost,time:5,desc:Object.entries(mods).map(([k,v])=>`${k} ${v<1?'−':'+'}${Math.round(Math.abs(v-1)*100)}%`).join(' · ')});}
const V20_BONUS_LABELS={commandDelay:'Задержка приказа',formationHold:'Удержание линии',carriageWeight:'Масса артиллерии',recoilStress:'Износ лафета',gunAccuracy:'Точность залпа',gunReload:'Время перезарядки',spotting:'Дальность обнаружения',turnRate:'Скорость поворота',repairRate:'Скорость ремонта',ammoCapacity:'Ёмкость погребов',fireRisk:'Риск пожара',crewRecovery:'Восстановление команды',supplyUse:'Расход провианта',landingPrep:'Подготовка десанта',landingCasualty:'Потери при высадке',boardingPower:'Абордажная сила',seaSupply:'Обеспеченность эскадры',convoyLoss:'Потери конвоев',crewTraining:'Рост навыков экипажа',damageControl:'Борьба за живучесть',crewMorale:'Мораль экипажа',upkeep:'Содержание',armyCommandDelay:'Задержка армейских приказов',armySupply:'Снабжение армии',regimentMorale:'Мораль полков',regimentSupply:'Потребление полков',riverCrossing:'Форсирование рек',roadCost:'Стоимость мостов и дорог',navalProcurement:'Качество закупки',corruptionLoss:'Потери от коррупции'};
Object.assign(BONUS_NAMES,V20_BONUS_LABELS);
for(const t of TECH.filter(t=>t.id.startsWith('v20_'))){const m=Object.values(V20_MODULES).find(x=>x.tech===t.id);const eff=V20_TECHS.find(x=>x[0]===t.id)?.[6]||{};t.desc=(m?'Открывает модуль «'+m.name+'». ':'')+Object.entries(eff).map(([k,v])=>`${V20_BONUS_LABELS[k]||BONUS_NAMES[k]||k} ${v<1?'−':'+'}${(Math.abs(v-1)*100).toFixed(Math.abs(v-1)<.05?1:0)}%`).join(' · ');}
for(const [id,o] of Object.entries(V20_MODULES)){
 if(!V6_EQUIP[id])V6_EQUIP[id]={name:o.name,tech:o.tech,work:o.work,art:'industry',gold:o.gold,...o.recipe};
 if(typeof V8_EQUIP_RECIPES!=='undefined')V8_EQUIP_RECIPES[id]=o.recipe;
}
const v20BaseMod=globalMod;
globalMod=function(f,key){let m=v20BaseMod(f,key);for(const [id,cat,name,req,edu,cost,mods] of V20_TECHS)if(has(f,id)&&mods[key]!==undefined)m*=mods[key];return m};
const V20_STATE=()=>{if(!s)return null; s.v20 ||= {contact:null,seen:{},captainXP:{},fleetReports:[],lastModelSeed:1,taskQueue:[]};return s.v20};
const V20_FORMATIONS={line:{name:'Линия баталии',cohesion:1.12,turn:.91,spacing:11},column:{name:'Кильватерная колонна',cohesion:1.04,turn:1.02,spacing:9},loose:{name:'Свободное построение',cohesion:.80,turn:1.23,spacing:16}};
const v20OldDesigner=v17ShipDesigner;
v17ShipDesigner=function(){const d=v17Blueprint(),base=v20OldDesigner();return d?base.replace('</div></div></section>',v20ModuleCard(d)+'</div></div></section>'):base;};
const v20BaseStats=v6designStats;
v6designStats=function(d){const st=v20BaseStats(d),mods=v20ModsFor(d),h=V6_HULLS[d.type]; if(!h)return st;
 if(mods.carriageWeight){const before=st.weight;st.weight=before*mods.carriageWeight;st.speed=Math.max(3,st.speed*(1+Math.min(.16,(before-st.weight)/Math.max(1,h.tonnage)*.8)));if(st.weight>h.tonnage*.18&&!st.errors.some(e=>e.includes('перегружают'))) {st.valid=false;st.errors.push('Перегрузка корпуса орудиями')}}
 st.reloadSec=Math.round(17*globalMod(d.f,'gunReload')*(mods.gunReload||1));st.commandMultiplier=globalMod(d.f,'commandDelay')*(mods.commandDelay||1);st.formationMultiplier=globalMod(d.f,'formationHold')*(mods.formationHold||1);st.turnMultiplier=globalMod(d.f,'turnRate')*(mods.turnRate||1);st.moduleCount=Object.keys(d.modules||{}).length;st.days=Math.ceil(st.days*(1+.012*st.moduleCount)); st.gold=Math.ceil(st.gold*(1+.018*st.moduleCount));return st};
const v20BuildBase=v6buildShip;
v6buildShip=function(id){let d=v6design(id);if(!d)return;const stock=s.equipment[s.player],req=Object.values(d.modules||{});for(const k of req){const m=V20_MODULES[k];if(!m||!has(s.player,m.tech))return say('Не исследован корабельный модуль: '+(m?.name||k));if((stock[k]||0)<1)return say('На складе нет модуля «'+m.name+'». Назначьте на производство его комплект.');}
 const before=s.production.length;v20BuildBase(id);if(s.production.length>before){for(const k of req)stock[k]--;const q=s.production[s.production.length-1];if(q.key==='customship')q.design.modules={...d.modules};} };
const v20OldFleetPanel=v15ShipPanel;
v15ShipPanel=function(){return v20FleetPanel()+v20OldFleetPanel()};
const v20OldFleetUI=v8fleetUI;
v8fleetUI=function(){return v20FleetPanel()+v20OldFleetUI()};
const v20OldFleetSpeed=v8fleetSpeed;
v8fleetSpeed=function(fl){const ships=v8shipsOf(fl);return ships.length?Math.min(...ships.map(v20VesselSpeed)):0};
const v20OldMesh=v8shipMesh;
v8shipMesh=function(type='frigate',design=null){const m=v20OldMesh(type,design),size=type==='line'?1.55:type==='frigate'?1.1:type==='transport'?1.16:.82,L=11*size,W=(type==='line'?3.4:2.8)*size,seed=(design?.modelSeed||169)%997;
 for(let side of [-1,1]){const y=side*W*.32;for(let j=0;j<18;j++){let x=(-.42+j*.05)*L;v8seg(m,[x,y,.22*size],[x,y,.51*size],'#b99b66',.65);if(j>0)v8seg(m,[(x-L*.05),y,.48*size],[x,y,.48*size],'#c6a579',.7);}for(let j=0;j<9;j++){let x=(-.36+j*.084)*L;v8seg(m,[x,y,.43*size],[x-L*.04,0,.51*size],'#9d855f',.4)}}
 for(let j=0;j<5;j++){const x=(-.31+j*.15)*L;v8cube(m,x,0,.30*size,L*.055,W*.16,.11*size,'#7e6044');v8cube(m,x,0,.38*size,L*.025,W*.05,.10*size,'#ad8a5b')}
 const stern=-(.46*L),paint=['#b38b48','#b7a16b','#9d6d3b'][seed%3];for(let j=-2;j<=2;j++){v8seg(m,[stern,j*W*.09,.38*size],[stern,j*W*.09,1.15*size],paint,.9);v8cube(m,stern-.08,j*W*.09,.93*size,.13*size,W*.054,.27*size,'#425761')}
 v8cube(m,stern-.1,0,1.22*size,L*.06,W*.56,.15*size,paint);
 if(design?.modules?.signals==='trumpet'){for(let x of [-1,1])v8cylinder(m,[L*.29,x*W*.11,.50*size],[L*.38,x*W*.13,.83*size],.05*size,'#bc9a59',8)}
 if(design?.modules?.signals==='signalFlags'){v8seg(m,[-L*.21,0,5.0*size],[-L*.21,0,7.3*size],'#a98d5f',.65);v8sail(m,-L*.21,6.5*size,.72*size,.54*size,'#c54334')}
 if(design?.modules?.navigation==='spyglass')v8cylinder(m,[L*.24,0,.58*size],[L*.37,0,.62*size],.034*size,'#d1b36e',9);
 if(design?.modules?.safety==='sickbay')v8cube(m,L*.28,0,.54*size,L*.13,W*.20,.25*size,'#dcd7c6');
 return m};
const v20OldMeshFor=v8meshFor;
v8meshFor=function(entity){if(entity.kind==='ship'&&entity.design){const mod=JSON.stringify(entity.design.modules||{}),key=`v20:${entity.type}:${entity.design.modelSeed||0}:${entity.design.batteries.map(x=>x.gun+x.count).join(':')}:${mod}`;if(!V8_MESH_CACHE[key])V8_MESH_CACHE[key]=v8shipMesh(entity.type,entity.design);return V8_MESH_CACHE[key]}return v20OldMeshFor(entity)};
const v20OldGun=v8cannon3d;
v8cannon3d=function(m,x,y,z,lb=12,side=1,scale=1){const s0=scale,span=(.34+.019*lb)*scale,r=(.065+.0021*lb)*scale;v8cube(m,x,y,z-.17*s0,.53*s0,.32*s0,.16*s0,'#855633');for(const k of [-1,1]){const wy=y+k*.20*s0;v8cylinder(m,[x-.16*s0,wy-.042*s0,z-.20*s0],[x-.16*s0,wy+.042*s0,z-.20*s0],.105*s0,'#614529',14);v8cylinder(m,[x+.19*s0,wy-.042*s0,z-.20*s0],[x+.19*s0,wy+.042*s0,z-.20*s0],.105*s0,'#614529',14)}v8cylinder(m,[x,y,z+.03*s0],[x,y+side*span,z+.03*s0],r,'#323b41',12);v8cylinder(m,[x,y+side*span,z+.03*s0],[x,y+side*(span+.07*s0),z+.03*s0],r*1.11,'#2b3338',12);v8seg(m,[x-.23*s0,y,z+.04*s0],[x+.23*s0,y,z+.04*s0],'#b08c56',.8);
};
const v20CoastMeshBase=v8meshFor;
v8meshFor=function(entity){if(entity.kind==='coast'){const key='v20coast';if(!V8_MESH_CACHE[key])V8_MESH_CACHE[key]=v20CoastMesh();return V8_MESH_CACHE[key]}return v20CoastMeshBase(entity)};
const v20OpenOriginal=v8Open3DBattle;
v8Open3DBattle=function(kind='sea',campaign=false,context=null){v20OpenOriginal(kind,campaign,context);if(kind!=='sea'||!V8_SCENE||!v8Battle)return;
 const sc=V8_SCENE,fl=context?.fleet||s.fleets.find(x=>x.f===s.player),hostile=context?.enemyFleet; if(hostile){const real=v8shipsOf(hostile);sc.units=sc.units.filter(u=>u.team==='friendly').concat(real.slice(0,6).map((sh,i)=>({id:100+i,shipId:sh.id,kind:'ship',type:sh.type,design:sh.design,pos:[25,i*11-10,0],angle:Math.PI,hp:sh.hp,maxHp:sh.maxHp,team:'enemy',name:sh.name,cooldown:3+i,turn:0,ammo:sh.ammo||80,firepower:v6shipPower(sh,hostile.admiral)})));}
 if(context?.drill)document.querySelector('#v8-window .v8-w-header small')?.replaceChildren(document.createTextNode('УЧЕБНОЕ СРАЖЕНИЕ · без потерь кампании'));
 v8Battle.v20={squadron:fl,formation:fl?.formation||'line',commands:[],timeScale:.5,order:'hold',coast:context?.to,enemyFleet:hostile||null};
 sc.units.filter(u=>u.kind==='ship').forEach((u,i)=>{const real=s.ships.find(sh=>sh.id===u.shipId);u.knots=real?v20VesselSpeed(real):8;u.desiredHeading=u.angle;u.actualSpeed=u.knots;u.targetSpeed=u.knots;u.ammo=real?.ammo??80;u.lineOffset=i;u.commandAt=0;});
 if(context?.openSea&&context?.to!=null&&N[context.to]?.port)sc.units.push({id:800,kind:'coast',pos:[16,-65,0],angle:0,hp:999,maxHp:999,team:'neutral',name:'Прибрежье'});
 const panel=document.getElementById('v8-stage');if(panel){let ctrl=document.createElement('div');ctrl.className='v20-tactical-controls';ctrl.id='v20-tactical-controls';ctrl.innerHTML=`<span>УПРАВЛЕНИЕ БОЕМ</span><button onclick="v8battleCommand('pause')">Ⅱ / ▶</button><button onclick="v8battleCommand('left')">↶ Курс</button><button onclick="v8battleCommand('right')">↷ Курс</button><button onclick="v8battleCommand('fire')">Бортовой залп</button><button onclick="v8battleCommand('sail')">Паруса</button><button onclick="v20BattleSpeed(.25)">¼×</button><button class="sel" onclick="v20BattleSpeed(.5)">½×</button><button onclick="v20BattleSpeed(1)">1×</button><button onclick="v20BattleSpeed(2)">2×</button><button onclick="v20BattleOrder('line')">Держать линию</button><button onclick="v20BattleOrder('chase')">Преследовать</button><button onclick="v20BattleOrder('retreat')">Отходить</button><button onclick="v20BeachLanding()" ${!fl?.embarked?.length?'disabled':''}>Высадить десант</button>`;panel.appendChild(ctrl);}
 v20BattleHud();
};
const v20OldCommand=v8battleCommand;
v8battleCommand=function(cmd){if(!v8Battle?.v20||V8_SCENE?.kind!=='sea')return v20OldCommand(cmd);if(cmd==='pause')return v20OldCommand(cmd);if(cmd==='sail'){v8Battle.sails=!v8Battle.sails;return;}const unit=v8select3dUnit();if(!unit)return;if(['left','right','fire'].includes(cmd))return v20QueueOrder(unit,cmd);return v20OldCommand(cmd)};
const v20OriginalStep=v8sceneStep;
v8sceneStep=function(rawDt){const sc=V8_SCENE,b=v8Battle?.v20;if(!b||sc?.kind!=='sea')return v20OriginalStep(rawDt);if(sc.paused)return;const dt=rawDt*b.timeScale;sc.time+=dt;if(v8Battle)v8Battle.elapsed+=dt;for(const item of [...b.commands]){if(sc.time<item.when)continue;const u=sc.units.find(x=>x.id===item.id);if(!u||u.hp<=0){b.commands.splice(b.commands.indexOf(item),1);continue}if(item.cmd==='heading'){u.desiredHeading=item.extra.angle;u.order='manual'}else if(item.cmd==='left'){u.desiredHeading-=Math.PI/6;u.order='manual'}else if(item.cmd==='right'){u.desiredHeading+=Math.PI/6;u.order='manual'}else if(item.cmd==='fire'){if(u.cooldown<=0)v8fire(u)}else if(item.cmd==='retreat'){u.targetSpeed=u.knots;u.desiredHeading=Math.PI;u.order='retreat'}else if(item.cmd==='chase'){u.order='chase';u.targetSpeed=u.knots}else if(item.cmd==='line'){u.order='line';u.targetSpeed=u.knots*.82};b.commands.splice(b.commands.indexOf(item),1)}
 const friendly=sc.units.filter(x=>x.kind==='ship'&&x.team==='friendly'&&x.hp>0), enemy=sc.units.filter(x=>x.kind==='ship'&&x.team==='enemy'&&x.hp>0),lead=friendly[0];
 for(const u of [...friendly,...enemy]){u.cooldown=Math.max(0,(u.cooldown||0)-dt);let real=s.ships.find(x=>x.id===u.shipId);if(real)u.knots=v20VesselSpeed(real);let speed=(u.knots||8)*(u.hp/Math.max(1,u.maxHp))**.25;
 if(u.team==='friendly'){if(u.order==='line'&&lead&&u!==lead){const idx=friendly.indexOf(u),gap=(V20_FORMATIONS[b.formation]?.spacing||11),o=v20ShipOrganization(b.squadron);speed*=v26Station(u,lead,idx,gap,o.hold,b.squadron?.f??s.player);}if(u.order==='chase'&&enemy.length){const tgt=enemy.reduce((a,x)=>Math.hypot(x.pos[0]-u.pos[0],x.pos[1]-u.pos[1])<Math.hypot(a.pos[0]-u.pos[0],a.pos[1]-u.pos[1])?x:a,enemy[0]);u.desiredHeading=Math.atan2(tgt.pos[1]-u.pos[1],tgt.pos[0]-u.pos[0]);}if(v8Battle.sails===false)speed*=.48;}
 else if(friendly.length){v26EnemyTactics(u,friendly,enemy)}
 speed*=v27Sailing(u,real);const diff=Math.atan2(Math.sin((u.desiredHeading??u.angle)-u.angle),Math.cos((u.desiredHeading??u.angle)-u.angle));const turning=(real?v20ShipMod(real,'turnRate'):1)*(V20_FORMATIONS[u.team==='friendly'?b.formation:'line']?.turn||1);u.angle+=Math.max(-dt*.18*turning,Math.min(dt*.18*turning,diff));u.actualSpeed+=(speed-u.actualSpeed)*Math.min(1,dt*.6);u.pos[0]+=Math.cos(u.angle)*u.actualSpeed*dt*.105;u.pos[1]+=Math.sin(u.angle)*u.actualSpeed*dt*.105;
 u.pos[0]=Math.max(-180,Math.min(180,u.pos[0]));u.pos[1]=Math.max(-150,Math.min(150,u.pos[1]));}
 sc.smoke=sc.smoke.filter(x=>x.age<1.7);for(const x of sc.smoke)x.age+=dt;
 if(Math.floor(sc.time*2)!==Math.floor((sc.time-dt)*2)){v20BattleHud();for(const btn of document.querySelectorAll('#v8-unit-strip button[data-unit]')){const u=sc.units.find(x=>x.id===+btn.dataset.unit),e=btn.querySelector('.v10-unit-health>i');if(u&&e)e.style.width=Math.max(0,100*u.hp/Math.max(1,u.maxHp))+'%'}}
 if(friendly.length===0||enemy.length===0)v8finish3dBattle(!!friendly.length);
};
const v20OldFinish=v8finish3dBattle;
v8finish3dBattle=function(won){const b=v8Battle,sc=V8_SCENE;if(!b?.campaign||!b.context?.openSea||!sc)return v20OldFinish(won);for(const unit of sc.units){if(!unit.shipId)continue;const ship=s.ships.find(x=>x.id===unit.shipId);if(ship){ship.hp=Math.max(0,Math.round(unit.hp));ship.ammo=Math.max(0,Math.round(unit.ammo??ship.ammo??100));ship.crew=Math.max(0,Math.round(ship.crew*(.74+.26*ship.hp/Math.max(1,ship.maxHp))))}}const destroyed=s.ships.filter(x=>x.hp<=0);for(const sh of destroyed)log(`Потерян корабль «${sh.name}»`);s.ships=s.ships.filter(x=>x.hp>0);let f=b.context.fleet,enemy=b.context.enemyFleet;if(f){f.seaMorale=Math.max(10,Math.min(100,(f.seaMorale??75)+(won?5:-12)));}V20_STATE().fleetReports.unshift({date:dateLabel(),ours:f?.name||'',other:enemy?.name||'',won});v8Stop3D();v8close();drawAll();say(won?'Контакт завершён: победа. Повреждения сохранены.':'Эскадра отошла. Повреждения сохранены.');};
const v20OldFresh=fresh;
fresh=function(f=0){v20OldFresh(f);V20_STATE();v20EnsureNavies();};
const v20OldRestore=restoreSave;
restoreSave=function(data){v20OldRestore(data);V20_STATE();v20EnsureNavies()};
const v20OldAdvanceDay=advanceDay;
advanceDay=function(){v20OldAdvanceDay();v20ScanContact();v20AIMonth()};
const v20OldSave=save;
save=function(){try{localStorage.setItem(V20_SAVE_KEY,JSON.stringify(s));say('Кампания XX сохранена')}catch(e){return v20OldSave()}};
const v20OldLoad=load;
load=function(){try{const txt=localStorage.getItem(V20_SAVE_KEY);if(!txt)return v20OldLoad();restoreSave(JSON.parse(txt));drawAll();say('Кампания XX загружена')}catch(e){say('Ошибка загрузки: '+e.message)}};
const v20OldSaveQuiet=saveQuiet;
saveQuiet=function(){try{if(s)localStorage.setItem(V20_SAVE_KEY,JSON.stringify(s))}catch(e){}};
const V20_ICON_SHAPES=[
 '<path d="M48 120 104 93 186 92 240 112 170 128Z" fill="#926f40" stroke="#49351d" stroke-width="4"/><path d="M95 98 210 55 231 66 108 112" stroke="#c9a45e" stroke-width="11" fill="none"/>',
 '<path d="M84 146V42M162 146V42" stroke="#7a5939" stroke-width="7"/><path d="M84 45 Q125 68 82 95L126 95 118 44Z" fill="#e0d0a0" stroke="#89704a" stroke-width="3"/><path d="M162 45Q205 62 160 90L215 89 206 44Z" fill="#c74541" stroke="#8e362b" stroke-width="3"/>',
 '<path d="M46 115H222L231 141H39Z" fill="#80532e" stroke="#50331d" stroke-width="3"/><circle cx="88" cy="138" r="23" fill="#6b472c" stroke="#b89863" stroke-width="5"/><circle cx="185" cy="138" r="23" fill="#6b472c" stroke="#b89863" stroke-width="5"/><path d="M70 84H229" stroke="#3a4244" stroke-width="24"/>',
 '<rect x="68" y="70" width="150" height="65" fill="#684a34" stroke="#b49a6b" stroke-width="4"/><path d="M62 120H224" stroke="#2f3535" stroke-width="19"/><circle cx="102" cy="141" r="17" fill="#503c2b"/><circle cx="182" cy="141" r="17" fill="#503c2b"/>',
 '<path d="M50 125 208 67" stroke="#5e4830" stroke-width="16" stroke-linecap="round"/><path d="M75 119 237 59" stroke="#c4a76c" stroke-width="11"/><ellipse cx="221" cy="61" rx="20" ry="14" fill="#342d22" stroke="#e5c77e" stroke-width="5"/>',
 '<path d="M55 60L222 130M223 59L54 130" stroke="#906f43" stroke-width="13"/><circle cx="138" cy="94" r="22" fill="#bea66c" stroke="#4b4028" stroke-width="7"/>',
 '<rect x="58" y="53" width="161" height="99" rx="8" fill="#8d683f" stroke="#523c26" stroke-width="5"/><path d="M65 99H213M138 60V147" stroke="#c5a66a" stroke-width="9"/><circle cx="138" cy="99" r="18" fill="#b88f50"/>',
 '<path d="M52 135Q120 85 213 131L201 145H65Z" fill="#cfb592" stroke="#795a3c" stroke-width="5"/><path d="M71 128Q129 64 197 126" stroke="#b94133" stroke-width="9" fill="none"/><path d="M94 70 175 70" stroke="#ac9c74" stroke-width="6"/>',
 '<path d="M47 133H236L218 155H64Z" fill="#6b5039"/><path d="M103 140V47M179 140V55" stroke="#775b40" stroke-width="6"/><path d="M105 48 153 110H108Z" fill="#f2e6c6"/><path d="M182 56 229 107H185Z" fill="#cfccb2"/>',
 '<path d="M46 132H232L220 148H60Z" fill="#806447"/><path d="M84 130V46M151 130V40M202 130V55" stroke="#73563d" stroke-width="6"/><path d="M87 48 131 106H89ZM154 43 192 99H157ZM206 56 236 105H209Z" fill="#e9ddc0"/>',
 '<path d="M49 112Q122 62 233 112" stroke="#80623a" stroke-width="7" fill="none"/><path d="M52 119L80 144 155 144 230 119" fill="none" stroke="#a88953" stroke-width="11"/><path d="M125 132V55" stroke="#e6c47d" stroke-width="5"/>',
 '<path d="M60 145 140 54 226 142" stroke="#9a7c4e" stroke-width="12" fill="none"/><path d="M70 131 210 131" stroke="#755b37" stroke-width="7"/><circle cx="140" cy="77" r="16" fill="#bba47a"/>',
 '<path d="M58 124H220V145H58Z" fill="#816640" stroke="#4b3525" stroke-width="3"/><path d="M86 124V57H188V124" fill="#b7a57b" stroke="#6d593a" stroke-width="5"/><path d="M104 76H170M104 93H170" stroke="#4a6573" stroke-width="8"/>',
 '<path d="M68 137V54H211V137Z" fill="#cabd99" stroke="#5d4b31" stroke-width="4"/><path d="M93 70H186M93 88H186M93 106H160" stroke="#516570" stroke-width="5"/><circle cx="71" cy="135" r="22" fill="#9f8659"/>',
 '<path d="M76 142 146 52 224 142Z" fill="#e0d6ba" stroke="#8f805a" stroke-width="5"/><path d="M145 54V140M93 118H198" stroke="#9d854f" stroke-width="5"/>',
 '<path d="M64 142H222V56H64Z" fill="#c4ad7f" stroke="#7b583a" stroke-width="5"/><path d="M64 88H222M116 55V143M168 55V143" stroke="#6d4d33" stroke-width="5"/>',
 '<path d="M58 139V83Q137 22 223 83V139" fill="#867055" stroke="#59442f" stroke-width="5"/><path d="M84 111H199M138 52V139" stroke="#e0c187" stroke-width="7"/>',
 '<path d="M56 133 138 44 226 133" fill="#b9ab88" stroke="#5c533f" stroke-width="5"/><path d="M92 137V81H184V137" fill="#815f42"/><path d="M105 92H173" stroke="#d4bd8b" stroke-width="5"/>',
 '<path d="M54 131Q126 52 230 131" stroke="#bd9b5d" stroke-width="17" fill="none"/><path d="M61 119H223" stroke="#574739" stroke-width="5"/><circle cx="92" cy="132" r="19" fill="#725a42"/><circle cx="195" cy="132" r="19" fill="#725a42"/>',
 '<path d="M70 136V60H214V136Z" fill="#aa8958" stroke="#684a31" stroke-width="5"/><path d="M100 55V134M138 55V134M177 55V134" stroke="#e3c789" stroke-width="4"/><circle cx="140" cy="96" r="18" fill="#63818d"/>'
];
const v20PriorTechPic=v19TechPicture;
v19TechPicture=function(t){if(!t?.id?.startsWith('v20_'))return v20PriorTechPic(t);let idx=V20_TECHS.findIndex(row=>row[0]===t.id);if(idx<0)return v20PriorTechPic(t);let color=['#c9b17b','#acc4c3','#d5a889','#c5bba0','#a6bed4'][idx%5],id=idx+1;return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 178"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eee0c4"/><stop offset="1" stop-color="${color}"/></linearGradient></defs><rect width="280" height="178" rx="3" fill="url(#g)"/><path d="M15 18H266M15 163H266" stroke="#a89065" stroke-width="3"/><circle cx="241" cy="32" r="17" fill="none" stroke="#80623b" stroke-width="3"/><text x="241" y="37" font-family="Georgia" text-anchor="middle" font-size="13" fill="#715a3c">${id}</text>${V20_ICON_SHAPES[idx]}<text x="140" y="168" text-anchor="middle" font-family="Georgia" font-size="11" fill="#4a3b2a">КОРОЛЕВСКАЯ АКАДЕМИЯ • ${1700+id}</text></svg>`)};
const v20OldTechMods=v19TechMods;
v19TechMods=function(t){if(t.id?.startsWith('v20_'))return V20_TECHS.find(x=>x[0]===t.id)?.[6]||{};return v20OldTechMods(t)};
for(const a of ADVISERS){a.v14portrait=v20Portrait(a.name,a.role);a.v12portrait=a.v14portrait;a.v20portrait=a.v14portrait}
for(const n of NATIONAL){n.v14portrait=v20Portrait(n.ruler,n.title);n.v12portrait=n.v14portrait;n.v20portrait=n.v14portrait}
const v20OldPortrait=v15Portrait;
v15Portrait=function(name,role){return v20Portrait(name,role)};
const v20OldDrawMap=drawMap;
drawMap=function(){v20OldDrawMap();v20MapBorders()};
zoomMap=function(k,centerX=800,centerY=540){let nz=clamp(zoom*k,1,650);if(nz===zoom)return;panX=centerX-(centerX-panX)*(nz/zoom);panY=centerY-(centerY-panY)*(nz/zoom);zoom=nz;clampPan();updateTransform();v6scaleLabel()};
v20InstallUI();
for(const n of NATIONAL) V15_PEOPLE[n.ruler]=n.v20portrait||v20Portrait(n.ruler,n.title);
for(const a of ADVISERS) V15_PEOPLE[a.id]=a.v20portrait||v20Portrait(a.name,a.role);
for(const a of V6_ADMIRALS) V15_PEOPLE[a.name]=v20Portrait(a.name,'Адмирал');
const v20OldPower=power;
power=function(province,f,attack=false,where=0){return v20OldPower(province,f,attack,where)*globalMod(f,'regimentMorale')*globalMod(f,'armySupply')};
const v20OldStateLabels=v15StateLabels;
v15StateLabels=function(r){const p=v20OldStateLabels(r);p[0]*=globalMod(s.player,'regimentMorale');p[1]*=globalMod(s.player,'regimentMorale');return p};
const v20OldFire=v8fire;
v8fire=function(u){if(V8_SCENE?.kind!=='sea'||u.kind!=='ship')return v20OldFire(u);const ship=s.ships.find(x=>x.id===u.shipId);const enemy=V8_SCENE.units.filter(x=>x.team!==u.team&&x.kind==='ship'&&x.hp>0).sort((a,b)=>Math.hypot(a.pos[0]-u.pos[0],a.pos[1]-u.pos[1])-Math.hypot(b.pos[0]-u.pos[0],b.pos[1]-u.pos[1]))[0];const prior=enemy?.hp??0,was=u.cooldown||0;const allUnits=V8_SCENE.units;V8_SCENE.units=allUnits.filter(x=>x.kind!=='coast');try{v20OldFire(u)}finally{V8_SCENE.units=allUnits}if(!ship||u.cooldown<=was||u.cooldown<=0)return;u.cooldown*=v20ShipMod(ship,'gunReload');ship.v20Wear=(ship.v20Wear||0)+.03*v20ShipMod(ship,'recoilStress');u.cooldown*=1+Math.min(.18,(ship.v20Wear||0)*.002);if(enemy&&enemy.hp<prior){const target=s.ships.find(x=>x.id===enemy.shipId),gun=v20ShipMod(ship,'gunAccuracy'),armor=target?.design?.modules?.safety==='magazine'?.96:1;enemy.hp=Math.max(0,prior-(prior-enemy.hp)*gun*armor)} };
const v20OldSupplyDaily=v9FleetSupplyDaily;
v9FleetSupplyDaily=function(){if(!s)return;const before=new Map(s.fleets.map(fl=>[fl.id,fl.provisions||0]));v20OldSupplyDaily();for(const fl of s.fleets){const was=before.get(fl.id)??0,spent=Math.max(0,was-(fl.provisions||0));const eff=globalMod(fl.f,'seaSupply');if(spent>0&&eff>1)fl.provisions+=spent*(1-1/eff)}};
const v20OldMarch=march;
march=function(from,to){const f=s.player,c=s.orders.length;v20OldMarch(from,to);if(s.orders.length>c&&has(f,'v20_couriers')){const o=s.orders[s.orders.length-1];if(o.kind==='army'){o.remaining=Math.max(1,Math.ceil(o.remaining*globalMod(f,'armyCommandDelay')));o.total=o.remaining}}};
const v20OldComplete=v6completeShip;
v6completeShip=function(q){const before=new Set(s.ships.map(x=>x.id));v20OldComplete(q);if(q.key!=='customship')return;const sh=s.ships.find(x=>!before.has(x.id));if(sh&&sh.design?.modules?.safety==='magazine')sh.ammo=Math.round((sh.ammo||100)*v20ShipMod(sh,'ammoCapacity'));};
const v20OldDrawAll=drawAll;
drawAll=function(){v20OldDrawAll();if(s?.v20?.contact)v20ContactOverlay();};
const v20EarlierAI=v20AIMonth;
v20AIMonth=function(){const day=s.day,month=s.month,year=s.year;v20EarlierAI();if(day!==1||month%2!==0)return;const st=V20_STATE(),index=year*12+month;if(st.lastPatrol===index)return;st.lastPatrol=index;v20AIPatrolOrders();for(const fl of s.fleets.filter(x=>x.f!==s.player)){if(v8get().seaOrders.some(x=>x.fleetId===fl.id))continue;for(const sh of v8shipsOf(fl)){if(sh.hp>=sh.maxHp*.97||s.gold[fl.f]<35||s.wood[fl.f]<3)continue;sh.hp=Math.min(sh.maxHp,sh.hp+sh.maxHp*.045*globalMod(fl.f,'damageControl'));s.gold[fl.f]-=7;s.wood[fl.f]-=2;}}};
const v20OriginalScan=v20ScanContact;
v20ScanContact=function(){v20OriginalScan();if(s?.v20?.contact)return;const v=V20_STATE(),all=v8get().seaOrders;const our=all.filter(o=>o.f===s.player&&o.position&&o.remaining>0),their=all.filter(o=>o.f!==s.player&&o.position&&o.remaining>0);if(!our.length||!their.length)return;const now=(s.year||1700)*400+(s.month||1)*31+(s.day||1);for(const a of our){const own=s.fleets.find(x=>x.id===a.fleetId);if(!own)continue;for(const b of their){const enemy=s.fleets.find(x=>x.id===b.fleetId);if(!enemy||!v8shipsOf(enemy).length)continue;const d=Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y);const visibility=19*(.7+v20ShipOrganization(own).value/90);if(d>visibility)continue;const id=own.id+'/'+enemy.id;if((v.seen[id]||0)>now)continue;v.contact={id,ours:own.id,theirs:enemy.id,coast:b.to};pauseGame();v20ContactOverlay();log(`В море замечена эскадра «${enemy.name}».`);return;}}};
const V21_KEY='empire_of_sails_v21_save';
const V21_TECHS=[
 ['v21_signal_drill','Флот','Адмиральские сигнальные учения',['v20_formation'],46,215,{signalReliability:1.12,formationHold:1.04,crewTraining:1.04}],
 ['v21_lamp_codes','Флот','Кодовая книга сигнальных фонарей',['v20_flags'],41,206,{nightSignals:1.25,spotting:1.05,signalReliability:1.06}],
 ['v21_watch_bells','Флот','Вахтенные расписания эскадры',['v20_training'],38,181,{seaEndurance:1.11,crewFatigue:.92,commandDelay:.98}],
 ['v21_iron_breeches','Морская артиллерия','Усиленные казённые части пушек',['v19_breech_proof'],58,262,{gunPen:1.09,recoilStress:.94,gunCost:1.03}],
 ['v21_cartouche','Морская артиллерия','Стандарты морских картузов',['v19_gunnery_tables'],53,238,{gunReload:1.07,arsenalSpeed:1.06,fireRisk:1.025}],
 ['v21_drydock_gauges','Кораблестроение','Доковые измерительные шаблоны',['drydock'],51,240,{shipTime:.96,shipHull:1.04,arsenalCost:1.01}],
 ['v21_repair_teams','Кораблестроение','Корабельные аварийные команды',['v20_pumps'],47,232,{damageControl:1.09,crewRecovery:1.06,upkeep:1.02}],
 ['v21_roster_rolls','Пехотные формирования','Полевые списки рот',['v19_military_census'],42,194,{manpower:1.04,regimentMorale:1.04,regimentSupply:1.02}],
 ['v21_mobile_mills','Логистика','Походные мельницы и пекарни',['v19_granary_audit'],49,222,{supply:1.08,regimentSupply:.95,armySpeed:.98}],
 ['v21_port_quarantine','Хозяйство','Карантинная служба портов',['v20_surgeon'],47,216,{crewRecovery:1.07,trade:1.04,upkeep:1.025}],
 ['v21_gazettes','Образование','Печатные атласы и морские ведомости',['v19_academy_press'],44,209,{education:1.06,research:1.055,spotting:1.03}],
 ['v21_courier_chain','Управление','Сеть армейских курьеров',['v20_couriers'],45,205,{armyCommandDelay:.91,riverCrossing:1.04,trade:1.01}]
];
const V21_LABELS={signalReliability:'Надёжность сигналов',nightSignals:'Ночная сигнализация',seaEndurance:'Выносливость экипажа',crewFatigue:'Накопление усталости',regimentSupply:'Расход снабжения полков',signalRange:'Дальность сигнала'};
Object.assign(BONUS_NAMES,V21_LABELS,V20_BONUS_LABELS);
for(const [id,cat,name,requirements,education,cost,mods] of V21_TECHS){
 if(TECH.some(t=>t.id===id))continue;
 const effects=Object.entries(mods).map(([k,v])=>`${BONUS_NAMES[k]||k}: ${v<1?'−':'+'}${(Math.abs(v-1)*100).toFixed(1)}%`).join(' · ');
 TECH.push({id,cat,name,req:requirements.filter(x=>TECH.some(t=>t.id===x)),eduMin:education,cost,time:6,mods,desc:effects});
}
const v21GlobalBase=globalMod;
globalMod=function(f,k){let x=v21GlobalBase(f,k);for(const [id,,,,,,mods] of V21_TECHS){if(has(f,id)&&mods[k]!=null)x*=mods[k]}return x};
const V21_MODULES={
 lampSignals:{name:'Фонари с кодовыми заслонками',slot:'signals',tech:'v21_lamp_codes',recipe:{copper:.36,wood:.20,flax:.24},gold:7.2,work:2.5,mods:{commandDelay:.91,signalReliability:1.14,nightSignals:1.18},desc:'Задержка приказов −9% · надёжность сигналов +14% · ночная сигнализация +18%'},
 weatherGlass:{name:'Барометр и гидрометр навигатора',slot:'navigation',tech:'v21_gazettes',recipe:{copper:.45,iron:.22,leather:.14},gold:7.8,work:2.6,mods:{seaEndurance:1.08,spotting:1.07,turnRate:.98},desc:'Морская выносливость +8% · обнаружение +7% · скорость поворота −2%'},
 hullPartitions:{name:'Переборки и аварийные помпы',slot:'safety',tech:'v21_repair_teams',recipe:{wood:2.4,iron:.48,hemp:.12},gold:10.2,work:3.4,mods:{damageControl:1.13,fireRisk:.93,carriageWeight:1.035},desc:'Борьба за живучесть +13% · риск пожара −7% · масса оборудования +3,5%'}
};
Object.assign(V20_MODULES,V21_MODULES);
for(const [id,v] of Object.entries(V21_MODULES)){
 V6_EQUIP[id]={name:v.name,tech:v.tech,work:v.work,art:'naval',gold:v.gold,...v.recipe};
 if(typeof V8_EQUIP_RECIPES!=='undefined')V8_EQUIP_RECIPES[id]=v.recipe;
}
const v21OrgBase=v20ShipOrganization;
v20ShipOrganization=function(fl){const base=v21OrgBase(fl);if(!fl||!base.ships)return {...base,reliability:0,fatigue:0,stationError:0};
 const vessels=v8shipsOf(fl);const fatigue=vessels.reduce((a,sh)=>a+v21ShipFatigue(sh),0)/vessels.length;
 const baseClarity=Math.min(1.18,Math.max(.35,.92-fatigue*.0034));
 const moduleRel=vessels.reduce((a,sh)=>a*v20ShipMod(sh,'signalReliability'),1)**(1/vessels.length);
 const techBonus=globalMod(fl.f,'seaEndurance');
 const holdFactor=Math.max(.60,1-fatigue*.0035),value=Math.max(1,Math.round(base.value*holdFactor));
 const reliability=Math.min(99,Math.max(30,Math.round(100*baseClarity*moduleRel)));
 const delay=Math.max(.8,Math.round(base.delay*(1+fatigue*.005)/Math.max(.80,Math.min(1.25,techBonus)) *10)/10);
 const stationError=Math.round(Math.max(2,(100-value)*.35+(100-reliability)*.12));
 return {...base,value,delay,hold:base.hold*holdFactor,reliability,fatigue:Math.round(fatigue),stationError};
};
const v21OrderLatencyBase=v20OrderLatency;
v20OrderLatency=function(u){const base=v21OrderLatencyBase(u);const fl=v8Battle?.v20?.squadron, o=v20ShipOrganization(fl);
 const sc=V8_SCENE,flag=sc?.units.find(x=>x.team==='friendly'&&x.kind==='ship'&&x.hp>0);
 const range=flag&&u&&flag!==u?Math.hypot(flag.pos[0]-u.pos[0],flag.pos[1]-u.pos[1]):0;
 const relPenalty=1+(100-(o.reliability||85))*.002;
 const distancePenalty=Math.max(1,range/34);
 return Math.max(.8,base*relPenalty*distancePenalty);
};
const v21QueueBase=v20QueueOrder;
v20QueueOrder=function(u,cmd,extra){v21QueueBase(u,cmd,extra);const b=v8Battle?.v20;if(!b||!b.commands.length)return;
 const o=v20ShipOrganization(b.squadron),q=b.commands[b.commands.length-1];
 if(q.id===u.id&&o.reliability<85)q.when+=(85-o.reliability)*.045;
};
const v21HudBase=v20BattleHud;
v20BattleHud=function(){v21HudBase();const b=v8Battle?.v20,el=document.getElementById('v8-battle-hud');if(!b||!el)return;
 const o=v20ShipOrganization(b.squadron);
 el.insertAdjacentHTML('beforeend',`<span class="v21-hud-extra"> · сигнал ${o.reliability}% · отклонение линии ~${o.stationError}% · усталость ${o.fatigue}%</span>`);
};
const v21FleetUIBase=v8fleetUI;
