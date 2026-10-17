v8fleetUI=function(){return v21FleetCards()+v21FleetUIBase()};
const v21FleetOverlayBase=v15ShipPanel;
v15ShipPanel=function(){return v21FleetCards()+v21FleetOverlayBase()};
const v21RegBase=v15RegPanel;
v15RegPanel=function(){const html=v21RegBase(),r=v15SelectedReg();return (r?`<section class="v21-panel"><h3>Полковой обоз и пополнение</h3><p>Запасы подразделения: <b>${r.v21Supplies??60}%</b>. Пополнение требует продовольствие, порох и казну.</p><button onclick="v21FieldStores()">Пополнить обоз — 8 провианта / 2 пороха / 12 ◈</button></section>`:'')+html};
const v21PowerBase=power;
power=function(p,f,attack=false,where=0){let x=v21PowerBase(p,f,attack,where);const records=p?.v15Regiments||[];if(records.length){let avg=records.reduce((a,r)=>a+(r.v21Supplies??60),0)/records.length;x*=.85+avg*.0015;}return x};
const v21ShipMeshBase=v8shipMesh;
v8shipMesh=function(type='frigate',design=null){let mesh=v21ShipMeshBase(type,design);if(!design)return mesh;const seed=design.modelSeed||1700,scale=type==='line'?1.55:type==='frigate'?1.10:type==='transport'?1.16:.82;
 const gunPorts=type==='line'?13:type==='frigate'?9:6;
 for(let side of [-1,1])for(let i=0;i<gunPorts;i++){
  const x=(-4.7+(i+.5)*9.4/gunPorts)*scale,y=side*1.16*scale;
  v8cube(mesh,x,y,.53*scale,.34*scale,.085*scale,.24*scale,'#211d1b');
  v8cube(mesh,x,y,.69*scale,.39*scale,.092*scale,.058*scale,['#b09250','#c0ab76','#84623d'][seed%3]);
 }
 for(let i=0;i<3+(seed%3);i++){const x=(-2.3+i*1.15)*scale;v8seg(mesh,[x,0,2.6*scale],[x+.55*scale,1.1*scale,.27*scale],'#b6ad8d',.45);v8seg(mesh,[x,0,2.6*scale],[x-.55*scale,-1.1*scale,.27*scale],'#b6ad8d',.45)}
 return mesh;
};
const v21OldAIPatrol=v20AIPatrolOrders;
v20AIPatrolOrders=function(){if(!s)return;let v=v8get();
 for(const fl of s.fleets){if(fl.f===s.player||fl.port==null)continue;const o=v20ShipOrganization(fl);
  if(o.fatigue>68||o.value<35){fl.v21RestUntil=(s.year*12+s.month)+1;}
 }
 const excluded=new Set(s.fleets.filter(fl=>fl.v21RestUntil&&(s.year*12+s.month)<=fl.v21RestUntil).map(fl=>fl.id));
 if(!excluded.size)return v21OldAIPatrol();
 // Temporarily mark resting fleets as already assigned; no changes to their real course or supply.
 const fake=Array.from(excluded, fleetId=>({fleetId,remaining:0,_v21:true}));v.seaOrders.push(...fake);
 try{v21OldAIPatrol()}finally{v.seaOrders=v.seaOrders.filter(x=>!x._v21)};
};
const v21OldAdvance=advanceDay;
advanceDay=function(){v21OldAdvance();v21Daily()};
const v21FreshBase=fresh;
fresh=function(f=0){v21FreshBase(f);V21_STATE()};
const v21RestoreBase=restoreSave;
restoreSave=function(data){v21RestoreBase(data);V21_STATE()};
const v21SaveBase=save;
save=function(){try{localStorage.setItem(V21_KEY,JSON.stringify(s));say('Кампания XXI сохранена')}catch(e){v21SaveBase()}};
const v21LoadBase=load;
load=function(){try{const data=localStorage.getItem(V21_KEY);if(!data)return v21LoadBase();restoreSave(JSON.parse(data));drawAll();say('Кампания XXI загружена')}catch(e){say('Ошибка загрузки: '+e.message)}};
saveQuiet=function(){try{if(s)localStorage.setItem(V21_KEY,JSON.stringify(s))}catch(e){}};
const v21DrawMapBase=drawMap;
drawMap=function(){v21DrawMapBase();const world=document.getElementById('world');if(!world)return;let layer=document.getElementById('v21-ports');if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.id='v21-ports';layer.setAttribute('pointer-events','none');world.appendChild(layer)}
 const ports=N.filter(n=>n.port&&n.core).slice(0,70);layer.innerHTML=ports.map(n=>`<g transform="translate(${n.x} ${n.y})"><circle r="3.4" fill="#f0d3a1" stroke="#1a2b34" stroke-width="1.3"/><path d="M-2.1 -1.7H2.1M0 -4V4M-3 1L0 4L3 1" fill="none" stroke="#213b48" stroke-width=".75"/></g>`).join('');
};
const v21UpdateBase=updateTransform;
updateTransform=function(){v21UpdateBase();const port=document.getElementById('v21-ports');if(port)port.style.opacity=zoom<1.5?'.3':zoom<4?'.65':'1';};
const v21CSS=document.createElement('style');
v21CSS.id='v21-css';
v21CSS.textContent=`
:root{--gold:#ddbd7c;--cream:#f1dfa9} .brand h1{font-family:Georgia,serif!important;letter-spacing:1.1px}
.v21-panel{margin:10px 0;padding:12px;border:1px solid #806747;border-radius:9px;background:linear-gradient(160deg,#1d303c,#0d1a23)}
.v21-panel h3{margin:0 0 5px!important;color:#f0d4a2;font:700 21px Georgia,serif}.v21-panel p{font-size:12px;line-height:1.45;color:#b6c9c8}
.v21-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.v21-fleet{padding:10px;background:#142632;border:1px solid #53697a;border-radius:7px}
.v21-fleet>b{display:block;color:#efd39e;font:700 17px Georgia,serif}.v21-fleet small{display:block;color:#b3c7ca;margin:4px 0 9px}
.v21-meter{display:grid;grid-template-columns:128px 1fr 44px;gap:9px;align-items:center;font-size:11px;margin:7px 0}.v21-meter>i{display:block;height:7px;border-radius:8px;background:#091722;overflow:hidden}.v21-meter u{display:block;height:100%;background:#83b7a1;text-decoration:none}.v21-meter strong{text-align:right;color:#e9d19c}.v21-fleet button{margin-top:8px}
.v21-hud-extra{color:#ead09c} .panel{border-color:#806847!important} .mapframe{border-color:#9f804c!important} .majorlabel{paint-order:stroke;stroke-width:3!important;stroke:#16242f!important}
@media(max-width:1280px){.v21-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(v21CSS);
for(const n of NATIONAL)V15_PEOPLE[n.ruler]=v21Portrait(n.ruler,'Правитель');
for(const a of ADVISERS)V15_PEOPLE[a.id]=v21Portrait(a.name,a.role);
for(const a of V6_ADMIRALS)V15_PEOPLE[a.name]=v21Portrait(a.name,'Адмирал');
const V22_KEY='empire_of_sails_v22_save';
const V22_TECHS=[
 ['v22_naval_dispatch','Флот','Дежурные сигнальные посты',['v21_signal_drill'],49,231,{signalReliability:1.07,commandDelay:.96,nightSignals:1.04}],
 ['v22_deep_soundings','Флот','Лоцманская промерная сеть',['v20_shores'],43,208,{spotting:1.08,landingPrep:1.07,seaSupply:1.03}],
 ['v22_cannon_tackle','Морская артиллерия','Тали для тяжёлых бортовых орудий',['v20_carriage'],48,245,{gunReload:.94,recoilStress:.96,gunCost:1.04}],
 ['v22_naval_rig','Кораблестроение','Стандартные сменные рангоуты',['rigging'],40,205,{repairRate:1.08,seaEndurance:1.05,shipCost:1.025}],
 ['v22_powder_tests','Морская артиллерия','Лаборатория испытания картузов',['v21_cartouche'],53,263,{gunAccuracy:1.07,fireRisk:.94,arsenalCost:1.025}],
 ['v22_dock_warehouses','Хозяйство','Портовые склады запасных частей',['v20_depots'],41,226,{seaSupply:1.09,repairRate:1.05,upkeep:1.025}],
 ['v22_wagon_records','Логистика','Ведомости армейских обозов',['v21_mobile_mills'],47,209,{armySupply:1.08,regimentSupply:.96,armyCommandDelay:.98}],
 ['v22_field_scouts','Пехотные формирования','Полковые разведчики и фельдъегери',['v20_couriers'],46,216,{armyCommandDelay:.90,armySpeed:1.04,regimentMorale:1.02}],
 ['v22_gunners_schools','Артиллерия и осады','Экзамены батарейных офицеров',['artillery'],39,192,{artillery:1.07,regimentMorale:1.03,arsenalCost:1.025}],
 ['v22_municipal_records','Управление','Перепись ремесленников и семей',['v19_military_census'],44,201,{manpower:1.05,trade:1.035,research:1.01}],
 ['v22_printed_maps','Образование','Гравированные географические атласы',['v21_gazettes'],48,243,{education:1.07,research:1.055,spotting:1.04}],
 ['v22_insurance','Морская торговля','Морское страхование грузов',['trade'],40,207,{trade:1.07,convoyLoss:.93,upkeep:1.01}],
 ['v22_granary_accounting','Хозяйство','Сезонные продовольственные ведомости',['grainstore'],33,169,{regimentSupply:.96,armySupply:1.06,arsenalSpeed:1.02}],
 ['v22_coastal_signals','Флот','Береговая оптическая сигнализация',['v22_naval_dispatch'],52,259,{signalReliability:1.055,spotting:1.075,commandDelay:.975}],
];
const V22_LABELS={convoyLoss:'Риск потерь конвоев',arsenalCost:'Стоимость изготовления',regimentMorale:'Мораль полков',armySupply:'Снабжение армии',signalReliability:'Надёжность сигналов',seaSupply:'Морское снабжение',recoilStress:'Износ лафетов',regimentSupply:'Расход снабжения полков'};
Object.assign(BONUS_NAMES,V22_LABELS);
for(const [id,cat,name,req,eduMin,cost,mods] of V22_TECHS){if(TECH.some(t=>t.id===id))continue;
 const effects=Object.entries(mods).map(([k,v])=>`${BONUS_NAMES[k]||k}: ${v<1?'−':'+'}${(Math.abs(v-1)*100).toFixed(1)}%`).join(' · ');
 TECH.push({id,name,cat,req:req.filter(r=>TECH.some(t=>t.id===r)),cost,time:5,eduMin,mods,desc:effects});}
const v22GlobalModPrev=globalMod;
globalMod=function(f,k){let x=v22GlobalModPrev(f,k);if(!s||!s.tech?.[f])return x;
 for(const [id,,,,,,mods] of V22_TECHS)if(has(f,id)&&mods[k]!=null)x*=mods[k];
 const st=s.v22;if(st?.policy?.[f]&&V22_POLICIES[st.policy[f]]?.mods[k]!=null)x*=V22_POLICIES[st.policy[f]].mods[k];
 return x;};
const V22_POLICIES={
 naval:{name:'Морской бюджет',desc:'Ускорение судоремонта и подготовки экипажей ценой повышенных расходов на флот.',cost:90,upkeep:8,mods:{repairRate:1.12,crewTraining:1.08,upkeep:1.045}},
 arsenal:{name:'Арсенальная мобилизация',desc:'Быстрее производство оружия и ниже себестоимость при более дорогой логистике.',cost:95,upkeep:9,mods:{arsenalSpeed:1.12,arsenalCost:.965,regimentSupply:1.045}},
 commerce:{name:'Купеческие привилегии',desc:'Повышенная торговая прибыль и надёжность конвоев; военные заказы становятся дороже.',cost:80,upkeep:7,mods:{trade:1.09,convoyLoss:.94,shipCost:1.035}},
 academy:{name:'Государственные школы',desc:'Образование и наука; содержание академий увеличивает общие расходы.',cost:110,upkeep:10,mods:{education:1.12,research:1.07,upkeep:1.025}}
};
const V22_MODULES={
 soundPipe:{name:'Медные переговорные трубы',slot:'signals',tech:'v22_naval_dispatch',recipe:{copper:.55,leather:.15,wood:.10},gold:8.2,work:2.6,mods:{commandDelay:.92,signalReliability:1.12,carriageWeight:1.01},desc:'Задержка приказа −8% · надёжность сигнала +12% · общая масса +1%'},
 shockAbsorb:{name:'Лафетные амортизаторы',slot:'carriage',tech:'v22_cannon_tackle',recipe:{iron:2.4,wood:1.3,leather:.65},gold:12,work:3.9,mods:{recoilStress:.78,gunAccuracy:1.055,carriageWeight:1.025},desc:'Износ лафетов −22% · точность +5,5% · масса батарей +2,5%'},
 pilotCharts:{name:'Прибрежные карты и лотлинии',slot:'navigation',tech:'v22_deep_soundings',recipe:{flax:.2,copper:.28,wood:.30},gold:6.9,work:2.4,mods:{spotting:1.105,landingPrep:1.10,seaEndurance:1.025},desc:'Обнаружение +10,5% · подготовка десанта +10% · выносливость +2,5%'},
 fireScreens:{name:'Защитные брандскрины',slot:'safety',tech:'v22_powder_tests',recipe:{iron:.6,wood:2.2,leather:.28},gold:9.8,work:3.1,mods:{fireRisk:.83,damageControl:1.09,supplyUse:1.02},desc:'Риск пожара −17% · борьба за живучесть +9% · снабжение +2%'}
};
Object.assign(V20_MODULES,V22_MODULES);
for(const [key,item] of Object.entries(V22_MODULES)){
 V6_EQUIP[key]={name:item.name,tech:item.tech,work:item.work,art:'naval',gold:item.gold,iron:item.recipe.iron||0,wood:item.recipe.wood||0,steel:item.recipe.steel||0,copper:item.recipe.copper||0};
 if(typeof V8_EQUIP_RECIPES!=='undefined')V8_EQUIP_RECIPES[key]=item.recipe;
}
const v22ShipPanelBase=v15ShipPanel;
v15ShipPanel=function(){const sh=(s.ships||[]).find(x=>x.id===v15ShipId)||s.ships.find(x=>x.f===s.player);return v22ShipPanelBase()+v22RefitCard(sh);};
const v22CourtBase=tabCourt;
tabCourt=function(){return v22PolicyUI()+v22CourtBase();};
const v22GovernmentBase=v18GovernmentPanel;
v18GovernmentPanel=function(){return v22PolicyUI()+v22GovernmentBase()};
const v22RailBase=v15Rail;
v15Rail=function(){v22RailBase();let el=document.getElementById('v15-rail');if(el&&!el.querySelector('.v22-cabinetbutton'))el.insertAdjacentHTML('beforeend',`<button class="v22-cabinetbutton" onclick="v15Open('government')">Программы государства ↗</button>`);};
const v22FactoryBase=v8factoryUI;
v8factoryUI=function(){return v22IndustryUI()+v22FactoryBase();};
const v22IndustryBase=v15IndustryPanel;
v15IndustryPanel=function(){return v22IndustryUI()+v22IndustryBase();};
const v22HullBase=v8shipMesh;
v8shipMesh=function(type='frigate',design=null){const mesh=v22HullBase(type,design);if(!design)return mesh;
 const size=type==='line'?1.55:type==='frigate'?1.10:type==='transport'?1.16:.82;
 const seed=design.modelSeed||Math.max(1,(design.id||7)*137),n=type==='line'?12:type==='frigate'?9:type==='transport'?5:6,L=11*size,beam=(type==='line'?3.4:2.8)*size/2;
 for(let side of [-1,1]){for(let i=0;i<n;i++){
   const x=-L*.37+(i+.5)*L*.74/n,y=side*beam*.80,z=-.27*size;
   v8cube(mesh,x,y,z,.30*size,.055*size,.29*size,'#342820');
   v8cube(mesh,x,side*(beam*.84),z+.09*size,.34*size,.05*size,.04*size,'#bba47a');
 }
 for(let j=0;j<4;j++){let x=-L*.37+j*L*.24;
  v8seg(mesh,[x,side*beam*.79,.30*size],[x,side*beam*.79,.72*size],'#b3966d',.7);
  v8seg(mesh,[x,side*beam*.79,.72*size],[x+L*.22,side*beam*.79,.72*size],'#b3966d',.55);
 }
 }
 for(let k=0;k<3+(seed%3);k++){const x=(-L*.26+k*L*.13);
 v8cube(mesh,x,0,.39*size,.30*size,.5*size,.23*size, k%2?'#896844':'#674832');}
 // Cabin windows, framing, and variation in brass fittings.
 for(let side of [-1,1])for(let k=0;k<3+(seed%2);k++)v8cube(mesh,-L*.45+k*.32*size,side*beam*.69,.64*size,.18*size,.08*size,.22*size,k%2?'#d3bc81':'#9d825b');
 return mesh;};
const v22SoldierBase=v8soldier;
v8soldier=function(m,x,y,z,kind='inf',coat='#a8463a',motion=0){v22SoldierBase(m,x,y,z,kind,coat,motion);
 if(kind==='inf'){v8cube(m,x,y,z+1.62,.42,.38,.14,'#232527');v8cube(m,x,y,z+1.73,.52,.28,.09,'#303035');
  v8seg(m,[x-.20,y,z+.43],[x+.24,y,z+1.06],'#d3bd91',.6);
 }else if(kind==='cav'){v8seg(m,[x-.12,y,z+1.0],[x+.85,y,z+1.75],'#c4c4c0',.70)};
};
const v22PictureBase=v19TechPicture;
v19TechPicture=function(t){const a=v22PictureBase(t);return a;};
const v22OpenTechBase=v19OpenTech;
v19OpenTech=function(){v22OpenTechBase();const cards=document.querySelectorAll('.v19-techcard');if(!cards.length)return;
 const all=[...document.querySelectorAll('.v19-techcard')];for(const el of all){const heading=el.querySelector('h3');if(!heading||el.querySelector('.v22-tech-badge'))continue;
 const t=TECH.find(x=>x.name===heading.textContent.trim());if(t)el.insertAdjacentHTML('afterbegin',v22TechBadge(t));}
};
