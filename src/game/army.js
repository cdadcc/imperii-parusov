// army — function declarations; initialized by ordered scripts.
function recruit(k){let p=s.provinces[selected],f=s.player,u=REGIMENTS[k],ship=['sloop','frigate','line'].includes(k);
 if(!own(selected)||(!u&&!ship))return;
 if(u&&u.req&&!has(f,u.req))return say('Для этого полка ещё не изучена технология: '+TECH.find(t=>t.id===u.req)?.name);
 if(ship&&(!N[selected].port||p.dock<1))return say('Для корабля требуется действующая верфь');
 if(k==='line'&&p.dock<2)return say('Линейный корабль требует верфи II уровня');
 if(!ship&&(armies(p)+s.production.filter(x=>x.province===selected&&!['line','frigate','sloop'].includes(x.key)).length)>=32)return say('Гарнизон достиг предела в 32 полка');
 const orig=ship?UNIT[k].cost:unitCost(k),c={...orig};if(ship&&has(f,'shipyards'))c.gold=Math.ceil(c.gold*.82);if(ship)c.gold=Math.ceil(c.gold*globalMod(f,'shipCost'));if(!ship)c.gold=Math.ceil(c.gold*globalMod(f,'armyCost'));if(!ship&&has(f,'conscription'))c.gold=Math.ceil(c.gold*.87);if(!ship&&has(f,'muskets_standard')&&u?.type==='Пехота')c.iron=Math.ceil(c.iron*.86);
 if(!spend(c))return;
 let days=ship?({sloop:68,frigate:120,line:205}[k]):u.days;
 if(ship)days=Math.ceil(days*globalMod(f,'shipTime'));if(ship&&has(f,'blockandpulleys'))days=Math.ceil(days*.90);if(ship&&has(f,'portinspections'))days=Math.ceil(days*.85);
 if(ship&&has(f,'drydock'))days=Math.ceil(days*.89);
 if(!ship&&has(f,'staffcollege'))days=Math.ceil(days*.91);
 s.production.push({id:++s.orderSeq,f,province:selected,key:k,remaining:days,total:days});
 log(`${N[selected].name}: ${ship?'заложен корабль':'начата подготовка'} «${(u||UNIT[k]).label}». Срок: ${days} дн.`);drawAll()
}

function power(p,f,attack=false,where=0){const loc=N[where],mount=TERR[loc.terrain]?.[2]||1;let base=0,def=0;
 for(let k of UNITKEYS){let qty=countUnit(p,k);if(!qty)continue;let u=REGIMENTS[k],a=u.atk,d=u.def;
 if(u.type==='Конница'&&(loc.terrain==='plain'||loc.terrain==='steppe'))a*=1.23;
 if(u.type==='Конница'&&loc.terrain==='mountain')a*=.62;
 if(k==='lightinf'&&(loc.terrain==='taiga'||loc.terrain==='hills'||loc.terrain==='mountain')){a*=1.32;d*=1.28}
 if(k==='heavyart'&&attack&&s.provinces[where]?.fort)a*=1.3;
 if(k==='lineinf'&&has(f,'bayonetdrill'))a*=1.18;
 if(k==='lightinf'&&has(f,'rifling'))a*=1.27;if(k==='heavyart'&&has(f,'mortars'))a*=1.3;if(has(f,'sappers')&&attack&&s.provinces[where]?.fort)a*=1.08;
 if(u.type==='Пехота'){a*=globalMod(f,'infAttack');if(has(f,'professional_army')){a*=1.08;d*=1.09}
   a*=(1+(has(f,'drill')?.12:0)+(has(f,'flintlock')?.12:0)+(has(f,'rankfire')?.12:0)+(has(f,'platoonfire')?.12:0)+(has(f,'bayonets')?.11:0));
   d*=(1+(has(f,'infantry_forms')?.12:0)+(has(f,'columns')?.1:0))}
 if(u.type==='Конница')a*=globalMod(f,'cavalry')*(1+(has(f,'cavalry')?.15:0)+(has(f,'cavalrycharge')?.14:0));
 if(u.type==='Артиллерия')a*=globalMod(f,'artillery')*(1+(has(f,'artillery')?.2:0)+(has(f,'gribeauval')?.14:0)+(has(f,'powdermills')?.06:0));
 base+=qty*a;def+=qty*d;
 }
 let terrain=loc.terrain==='mountain'?1.36:loc.terrain==='taiga'?1.21:loc.terrain==='hills'?1.16:1;
 let supply=landSupply(p,f,where);let morale=.6+(p.morale||70)/200;
 if(attack)return base*(has(f,'roads')?1.06:1)*(has(f,'generalstaff')?1.12:1)*(F[f].trait==='army'?1.1:1)*(s.stability[f]/170+.59)*(s.exhaustion[f]>45?.88:1)*supply;
 return def*(1+(s.provinces[where]?.fort||0)*.19)*(has(f,'fortress_school')?1.13:1)*terrain*(F[f].trait==='fort'?1.11:1)*globalMod(f,'fort')*(1+(p.depot||0)*.05)*morale*supply
}

function militaryLoss(p,loss){let remaining=Math.max(0,Math.floor(loss));for(let k of ['militia','inf','lightinf','lineinf','fusiliers','cav','dragoons','hussars','art','lightart','grenadiers','cuirassiers','horseart','heavyart','guards']){let have=countUnit(p,k),n=Math.min(have,remaining);if(['inf','cav','art'].includes(k))p[k]-=n;else if(n&&p.units)p.units[k]-=n;remaining-=n;if(remaining<=0)break}}

function landSupply(p,f,i){let local=s.provinces[i],deficit=s.food[f]<80?.82:1;
 let road=local?.road||0,depot=local?.depot||0;let isolation=local?.owner===f||local?.owner===undefined?1:.9;
 return clamp((.85+road*.055+depot*.075)*(has(f,'quartermasters')?1.07:1)*deficit*isolation,.62,1.14)}

function tabArmy(){let n=N[selected],p=s.provinces[selected],visible=defendersVisible(selected),ours=own(selected),inbound=s.orders.filter(o=>o.to===selected&&o.f===s.player),outbound=s.orders.filter(o=>o.from===selected&&o.f===s.player),queued=s.production.filter(q=>q.province===selected&&q.f===s.player&&REGIMENTS[q.key]);
 let html=`<h2>⚔ Военный штаб</h2><p>${esc(n.name)} · ${esc(F[p.owner].name)}</p><div class="lowbar"><div class="metric"><b>${visible?armies(p):'?'}</b><span>Полков</span></div><div class="metric"><b>${visible?p.morale+'%':'?'}</b><span>Мораль</span></div><div class="metric"><b>${p.fort}</b><span>Укрепления</span></div></div>`;
 if(visible){for(let k of UNITKEYS){let q=countUnit(p,k);if(q)html+=`<div class="kv"><span>${REGIMENTS[k].icon} ${esc(REGIMENTS[k].label)}</span><b>${q}</b></div>`}}
 if(ours){html+='<h3>Приказы штаба</h3><div class="buttonrow">'+button('➤ Марш / наступление',"beginMission('army')",armies(p)<=1)+button('⚓ Морская высадка',"beginMission('landing')",!n.port||vessels(p)===0||armies(p)<2)+'</div>';
 html+=`<h3>Подготовка новых полков</h3><div class="row-inline"><span class="tagchip">${s.tech[s.player].length} технологий изучено</span><span class="tagchip">${queued.length} в подготовке</span></div>`;
 html+=`<select id="armyCategory">${REGCAT.map(k=>`<option ${k===armyCat?'selected':''}>${k}</option>`).join('')}</select><div class="recruit-grid">`;
 for(let k of UNITKEYS.filter(k=>REGIMENTS[k].type===armyCat)){let u=REGIMENTS[k],unlocked=!u.req||has(s.player,u.req),c={...unitCost(k)};if(has(s.player,'conscription'))c.gold=Math.ceil(c.gold*.87);
 let ok=unlocked&&affordable(c)&&armies(p)+queued.length<32;
 html+=`<div class="regiment-card ${unlocked?'':'locked'}"><div class="regiment-head"><span class="regiment-icon">${u.icon}</span><b>${esc(u.label)}</b></div><div class="regiment-stats"><span>Атака <strong>${u.atk.toFixed(2)}</strong></span><span>Оборона <strong>${u.def.toFixed(2)}</strong></span><span>Скорость <strong>${u.speed.toFixed(1)}</strong></span><span>Мораль <strong>${u.morale}</strong></span></div><div class="regiment-price">${unlocked?price(c):'🔒 '+esc(TECH.find(t=>t.id===u.req)?.name||u.req)}</div><button ${ok?'':'disabled'} onclick="recruit('${k}')">${unlocked?'Обучить · '+u.days+' дн.':'Не исследовано'}</button></div>`}
 html+='</div>';}
 if(queued.length){html+='<h3>Учебные лагеря</h3>';for(let q of queued)html+=`<div class="queue-item"><b>${esc(REGIMENTS[q.key]?.label)}</b><span class="muted"> · ${q.remaining} дн.</span><div class="timebar"><i style="width:${Math.round((1-q.remaining/q.total)*100)}%"></i></div></div>`}
 for(let o of [...outbound,...inbound])html+=`<div class="orders-mini"><b>${o.kind==='army'?'➤ Марш армии':'⚓ Морская операция'}</b><div class="mini">${esc(N[o.from].name)} → ${esc(N[o.to].name)} · ${o.remaining} дней до прибытия</div><div class="progress"><i style="width:${Math.round((1-o.remaining/o.total)*100)}%"></i></div></div>`;
 if(mission)html+=`<div class="note">Выберите пункт назначения на карте — приказ будет исполняться в ходе времени.</div>`;
 html+='<div class="note">Полки различаются атакой, обороной, скоростью, моралью и расходом провианта. Передвижение зависит от местности, дорог, штаба и типа соединения.</div>';
 return html
}

function v6armyTab(){let p=s.provinces[selected],f=s.player,ours=own(selected),n=N[selected],records=p.regimentRecords||[],units=[];for(let k of UNITKEYS){let qty=countUnit(p,k);if(qty>0)units.push({k,qty})}let h=`<h2 class="v6-title">Сухопутные войска</h2><p>${v6name(n.name)} · ${v6name(F[p.owner].name)}</p><div class="v6-grid"><div class="v6-panel"><div class="v6-art large" style="background-image:url('${V6_ART.infantry}')"></div><div class="kv"><span>Всего полков</span><b>${armies(p)}</b></div><div class="kv"><span>Мораль гарнизона</span><b>${p.morale}%</b></div></div><div class="v6-panel"><div class="v6-art large" style="background-image:url('${V6_ART.cannon}')"></div><div class="kv"><span>Дороги / склады</span><b>${p.road}/${p.depot}</b></div><div class="kv"><span>Фортификация</span><b>${p.fort}</b></div></div></div>`;
 if(!ours){h+='<p class="mini">Общие данные видны через разведку. Вооружение полков противника скрыто.</p>';return h}
 h+=`<div class="v6-section"><h3>Приказы</h3></div><div class="buttonrow"><button onclick="beginMission('army')" ${armies(p)<=1?'disabled':''}>Марш / наступление</button><button onclick="beginMission('landing')" ${!n.port||vessels(p)<=0?'disabled':''}>Морской десант</button></div>`;
 h+=`<div class="v6-section"><h3>Состав гарнизона</h3><span class="v6-small">${units.length} разновидностей</span></div><div class="v6-list">`;
 for(let {k,qty} of units){let u=REGIMENTS[k],art=u.type==='Артиллерия'?'cannon':u.type==='Конница'?'cavalry':'infantry';let atk=u.atk*globalMod(f,u.type==='Пехота'?'infAttack':'armyPower')*(u.type==='Пехота'?globalMod(f,'infantryAtk'):1);let def=u.def*globalMod(f,u.type==='Пехота'?'infantryDef':'armyPower');h+=`<div class="v6-panel"><div class="v6-tile">${v6art(art,'square')}<div><strong>${v6name(u.label)} · ${qty} полк.</strong><div class="v6-small">${v6name(u.type)}</div></div></div><div class="v6-grid"><div class="kv"><span>Атака</span><b>${atk.toFixed(2)}</b></div><div class="kv"><span>Оборона</span><b>${def.toFixed(2)}</b></div><div class="kv"><span>Мораль</span><b>${u.morale}</b></div><div class="kv"><span>Скорость</span><b>${u.speed.toFixed(1)}</b></div></div></div>`}
 h+='</div><div class="v6-section"><h3>Личные дела полков</h3></div>';for(let r of records){let battery=REGIMENTS[r.key]?.type==='Артиллерия'&&r.equipment;h+=`<div class="v6-line"><b>${v6name(r.name)}</b><div class="kv"><span>Личный состав</span><b>${r.strength} человек</b></div><div class="kv"><span>Мораль / опыт</span><b>${r.morale} / ${r.experience}</b></div><div class="kv"><span>Выданное вооружение</span><b>${r.equipment?`${V6_EQUIP[r.equipment.item]?.name} ×${r.equipment.required}`:'Ранее сформированный полк'}</b></div>${battery?`<label class="v6-lbl">Перевооружить батарею (со склада)</label><select class="v6-sel" onchange="v6refitLandBattery(${r.id},this.value)">${CANNONS.filter(c=>c.lb<=12).map(c=>`<option value="${c.id}" ${r.equipment.item===c.id?'selected':''}>${c.lb} фунтов · склад ${s.equipment[f][c.id]||0}</option>`).join('')}</select>`:''}</div>`}
 h+=`<div class="v6-section"><h3>Сформировать новый полк</h3></div><div class="v6-equip">`;
 for(let k of UNITKEYS){let u=REGIMENTS[k],unlocked=!u.req||has(f,u.req),cost0=unitCost(k),art=u.type==='Артиллерия'?'cannon':u.type==='Конница'?'cavalry':'infantry',required=u.type==='Пехота'?Math.round(k==='militia'?450:800):u.type==='Артиллерия'?2:0,equip=u.type==='Пехота'?'musket':u.type==='Артиллерия'?'gun4':null,avail=equip?s.equipment[f][equip]||0:0;
 h+=`<div class="v6-panel">${v6art(art,'large')}<b>${v6name(u.label)}</b><div class="kv"><span>Атака / защита</span><b>${u.atk.toFixed(2)} / ${u.def.toFixed(2)}</b></div><div class="kv"><span>Подготовка</span><b>${Math.ceil(u.days*globalMod(f,'regimentTime'))} дней</b></div><div class="kv"><span>Стоимость</span><b>${cost0.gold} зол.</b></div>${equip?`<div class="kv"><span>${V6_EQUIP[equip].name}</span><b class="${avail>=required?'v6-green':'v6-red'}">${avail}/${required}</b></div>`:''}<button ${!unlocked||!affordable(cost0)||equip&&avail<required?'disabled':''} onclick="recruit('${k}')">${unlocked?'Обучить и вооружить':'Сначала исследовать'}</button></div>`}
 h+='</div><div class="v6-section"><h3>Бонусы военной школы</h3></div>'+v6percent(f,'infantryAtk')+v6percent(f,'infantryDef');return h}

function v8dailyArmySupply(){let v=v8get(),f=s.player;const armyNodes=[];for(let i=0;i<N.length;i++){let p=s.provinces[i];if(p.owner!==f||armies(p)<=0)continue;armyNodes.push({i,p})}if(!armyNodes.length)return;
 let ration=armyNodes.reduce((a,{p})=>a+armies(p)*.003,0),powder=armyNodes.filter(x=>x.p.art>0).length*.015;let canEat=s.food[f]>=ration;s.food[f]=Math.max(0,s.food[f]-ration);if(powder>0)s.equipment[f].gunpowder=Math.max(0,(s.equipment[f].gunpowder||0)-powder);
 for(let {i,p} of armyNodes){let supply=v8supplyOf(i);if(!canEat||supply<22){p.morale=Math.max(10,(p.morale||70)-.014);if(s.day===1&&s.month%2===0&&Math.random()<.035){let k=Object.keys(p.units||{})[0];if(k)p.units[k]=Math.max(0,p.units[k]-1)}}else if(supply>60)p.morale=Math.min(100,(p.morale||70)+.005)}
}

function v8embark(id,province=selected,count=1){let v=v8get(),fleet=s.fleets.find(x=>x.id===id&&x.f===s.player),p=s.provinces[province];count=Math.max(1,Math.floor(+count||1));if(!fleet||!p||fleet.port!==province||p.owner!==s.player)return say('Эскадра и полки должны находиться в одном собственном порту');let max=Math.floor(v8fleetCapacity(fleet)/800),loaded=(fleet.embarked||[]).reduce((a,x)=>a+x.count,0);if(max<=0)return say('В эскадре нет места для полков: добавьте войсковой транспорт');if(loaded+count>max)return say(`Вместимость: ${max} полков, уже погружено ${loaded}`);if((p.inf||0)<count+1)return say('Для высадки недостаточно пехоты в гавани (1 полк остаётся гарнизоном)');p.inf-=count;fleet.embarked ||= [];fleet.embarked.push({kind:'inf',count,origin:province});log(`На корабли эскадры «${fleet.name}» погружено ${count} пехотных полков.`);v8Refresh()}

function v10Manpower(f=s.player){v10initDemography();let total=0;for(let i=0;i<N.length;i++)if(s.provinces[i].owner===f)total+=s.demography.manpower[i]||0;return Math.round(total)}

function v10ArmyGlance(){let p=s.provinces[selected],q=v8supplyOf(selected),morale=p.morale||75,pop=s.demography?.population?.[selected]||0,types=UNITKEYS.filter(k=>countUnit(p,k)>0).slice(0,5);return `<section class="v10-armydeck" aria-label="Военная сводка"><div class="v10-deckhead">${v10icon('army',23)}<b>ОПЕРАТИВНЫЙ ШТАБ</b><button onclick="v8Open3DBattle('land')">3D-сражение ↗</button></div><div class="v10-trooptiles">${types.map(k=>`<div class="v10-reg-icon">${v10icon(REGIMENTS[k].type==='Кавалерия'?'sail':REGIMENTS[k].type==='Артиллерия'?'fort':'musket',26)}<b>${countUnit(p,k)}</b><small>${esc(REGIMENTS[k].label)}</small></div>`).join('')||'<div class="v10-reg-icon">Гарнизон отсутствует</div>'}</div>${v10bar('Мораль полков',morale,'#9cb59b')}${v10bar('Обеспечение',q,q>40?'#88ada0':'#d38d65')}${v10bar('Рекрутский резерв',100*(s.demography?.manpower?.[selected]||0)/Math.max(1000,pop*.055),'#d6b577',v10fmtPop(s.demography?.manpower?.[selected]||0))}</section>`}

function v15Regiments(i){let p=s.provinces[i];p.v15Regiments ||= [];if(p.owner!==s.player)return p.v15Regiments;
 if(!p.v15Initialized){const keys=['inf','lineinf','fusiliers','militia','lightinf','grenadiers','guards','cav','dragoons','hussars','cuirassiers','art','lightart','heavyart'];for(const key of keys){let n=Math.min(6,countUnit(p,key));for(let j=0;j<n;j++)p.v15Regiments.push({id:++v15Get().next,type:key,headcount:(REGIMENTS[key]?.type==='Артиллерия'?120:REGIMENTS[key]?.type==='Конница'?500:800),name:`${p.v15Regiments.length+1}-й ${REGIMENTS[key]?.label||'полк'}`,experience:0,training:0,weapon:null,gearCount:0,morale:p.morale||70});}p.v15Initialized=true;}return p.v15Regiments;}

function v15Train(regId){let r=v15Regiments(selected).find(x=>x.id===regId),v=v15Get();if(!r)return;
 if(v.training.some(x=>x.regId===regId&&x.i===selected))return say('Полк уже на учениях');
 if(s.gold[s.player]<18||s.food[s.player]<3||(s.equipment[s.player].gunpowder||0)<1)return say('Для подготовки нужны 18 монет, 3 провианта и 1 единица пороха');
 s.gold[s.player]-=18;s.food[s.player]-=3;s.equipment[s.player].gunpowder-=1;
 v.training.push({i:selected,regId,remaining:21});log(`${r.name}: начаты полковые учения (21 день).`);v15Render();drawAll();}

function v15RegPanel(){const entries=v15Regiments(selected),r=v15SelectedReg(),f=s.player,p=s.provinces[selected];if(r&&!v15RegId)v15RegId=r.id;
 const categories=[['musket','Кремнёвый мушкет'],['bayonet','Штыки'],['sabre1700','Палаш 1700'],['cavalrySabre','Кавалерийская сабля'],['gun4','4-фунтовая батарея'],['gun6','6-фунтовая батарея'],['gun12','12-фунтовая батарея']];
 const art=n=>(typeof V6_ART!=='undefined'&&(V6_ART[n]||V6_ART[V6_EQUIP[n]?.art]||V6_ART.infantry))||'';
 return `<div class="v15-reglayout"><aside class="v15-reglist"><h3>Учебные лагеря · ${esc(N[selected].name)}</h3><small>Действующие полки в выбранной провинции</small>${entries.slice(0,30).map(z=>`<button class="v15-regtile ${r?.id===z.id?'selected':''}" onclick="v15RegId=${z.id};v15Render()"><img src="${art(z.weapon||'musket')}" alt=""><span><b>${esc(z.name)}</b><small>${esc(REGIMENTS[z.type]?.type||'Пехота')} · опыт ${z.experience}</small></span></button>`).join('')||'<p>В этой провинции нет полков. Наберите их во вкладке «Армия».</p>'}<button class="v15-main" onclick="v15Close();tab='army';drawAll()">Набор новых полков ↗</button></aside><section class="v15-regmain">${r?`<div class="v15-shiptitle"><h3>${esc(r.name)}</h3><span>${esc(REGIMENTS[r.type]?.label||r.type)}</span></div><div class="v15-regscene"><img src="${art(r.weapon||'musket')}" alt=""><div><strong>Командир полка</strong><img src="${V15_PEOPLE[NATIONAL[f].ruler]}" alt=""></div></div>${[['Атака',v15StateLabels(r)[0],3,'#a3bd91'],['Оборона',v15StateLabels(r)[1],3,'#7ca8b8'],['Мораль',r.morale||70,100,'#ceab71'],['Подготовка',r.training||0,100,'#c2a55f'],['Опыт',r.experience,100,'#a9b78e']].map(z=>v15Gauge(...z)).join('')}<h3>Оснащение из национального склада · ${r.gearCount||0}/${r.headcount||800} человек</h3><div class="v15-equipment">${categories.map(([key,label])=>{const eq=V6_EQUIP[key],req=eq.tech&&!has(f,eq.tech),stock=s.equipment[f][key]||0;return `<button ${req||stock<(key.startsWith('gun')?2:120)?'disabled':''} class="${r.weapon===key?'selected':''}" onclick="v15Equip(${r.id},'${key}')"><img src="${art(key)}" alt=""><b>${label}</b><small>Склад ${Math.floor(stock)} · требуется ${key.startsWith('gun')?2:120}</small></button>`}).join('')}</div><div class="v15-shipactions"><button class="v15-main" onclick="v15Train(${r.id})">Полковая муштра · 21 день</button><button onclick="v15Equip(${r.id},'')">Снять оснащение</button><button onclick="v15Close();v8open('production','lines')">Заказать снаряжение</button></div><p>Учения расходуют монеты, продовольствие и порох. Подготовка, опыт и выбранное оружие повышают расчётную эффективность полка в бою.</p>`:'<h3>Выберите собственный гарнизон на карте</h3>'}</section></div>`}

function v16Formation(id,type){const r=v15Regiments(selected).find(x=>x.id===id);if(!r||!V16_FORMATIONS[type])return;if(type==='square'&&REGIMENTS[r.type]?.type!=='Пехота')return say('Каре доступно только пехоте');if(type==='skirmish'&&REGIMENTS[r.type]?.type!=='Пехота')return say('Рассыпной строй доступен пехоте');r.formation=type;v16Render()}

function v16RegPanel(){const r=v15SelectedReg(),base=v16PriorReg();if(!r)return base;const formation=r.formation||'line';const form=V16_FORMATIONS[formation];const rep=`<section class="v16-regtools"><div class="v16-hero"><h3>Тактическая организация: ${esc(r.name)}</h3><span class="v16-tag">${REGIMENTS[r.type]?.type||'Полк'}</span></div><div class="v16-formgrid">${Object.entries(V16_FORMATIONS).filter(([k])=>!['square','skirmish'].includes(k)||REGIMENTS[r.type]?.type==='Пехота').map(([k,z])=>`<button class="${k===formation?'v16-on':''}" onclick="v16Formation(${r.id},'${k}')"><b>${z.name}</b><small>Атака ${Math.round((z.atk-1)*100)}% · Оборона ${Math.round((z.def-1)*100)}% · Марш ${Math.round((z.speed-1)*100)}%</small></button>`).join('')}</div><div class="v16-metgrid"><div><b>Боеприпасы</b>${v15Gauge('Запас',r.ammo??65,100,'#b1c68a',`${r.ammo??65}%`)}</div><div><b>Усталость</b>${v15Gauge('Усталость',r.fatigue||0,100,'#c78979',`${r.fatigue||0}%`)}</div><div><b>Строй</b><strong>${form.name}</strong></div></div><button class="v15-main" onclick="v16Resupply(${r.id})">Пополнить боеприпасы со склада (3–8 пороха, 3 провианта)</button></section>`;return base+rep}

function v18RegStat(r){const base=REGIMENTS[r.type]||REGIMENTS.inf,quota=base.type==='Артиллерия'?120:base.type==='Конница'?500:800;
 return {base,quota,ratio:Math.max(.05,Math.min(1,(r.headcount||0)/quota)),ammo:Math.max(0,r.v18Ammo??100),fatigue:Math.max(0,r.v18Fatigue??0)};}

function v18RegStatus(){const r=v15SelectedReg();if(!r)return '';const st=v18RegStat(r);return `<section class="v18-section"><div class="v18-h"><h3>Состояние полка · ${esc(r.name)}</h3><small>Фактическая численность влияет на боевую силу</small></div><div class="v18-regmetrics">${v15Gauge('Личный состав',r.headcount,st.quota,'#8cb49e',`${r.headcount} / ${st.quota}`)}${v15Gauge('Боезапас',st.ammo,100,'#d3b87d',Math.round(st.ammo)+'%')}${v15Gauge('Усталость',st.fatigue,100,'#c78077',Math.round(st.fatigue)+'%')}</div><div class="v18-controls"><button onclick="v18Replenish(${r.id})">Пополнить полк</button><button onclick="v18SupplyAmmo(${r.id})">Подвезти боеприпасы</button><button onclick="v15Train(${r.id})">Полевые учения · 21 день</button></div></section>`}

function v19FieldPanel(){const r=v15SelectedReg();if(!r)return '';let inv=s.equipment[s.player];return `<section class="v19-field"><h3>Полевое снаряжение полка</h3><p>Сначала исследуйте предмет, затем изготовьте его на мануфактуре. Неполная выдача уменьшает бонус пропорционально фактическому количеству.</p><div class="v19-field-grid">${Object.entries(V19_FIELD_GEAR).map(([key,it])=>{let have=r.v19Gear?.[it.slot],active=have?.key===key;return `<article><img src="${v19TechPicture({id:key,name:it.name})}" alt=""><b>${esc(it.name)}</b><small>Склад ${Math.floor(inv[key]||0)} · Штат ${it.quantity} ${active?'· Выдано '+have.count:''}</small>${Object.entries(it.bonus).map(([k,v])=>`<div class="v19-effect"><span>${{attack:'Атака',defence:'Оборона',morale:'Мораль',supply:'Снабжение'}[k]}</span><strong class="plus">+${Math.round((v-1)*100)}%</strong></div>`).join('')}<button ${!has(s.player,it.tech)?'disabled':''} onclick="v19EquipSupport(${r.id},'${key}')">${active?'Снять':'Выдать со склада'}</button></article>`}).join('')}</div><div class="v19-field-total">Эффективные бонусы: атака +${((v19GearFactor(r,'attack')-1)*100).toFixed(1)}% · оборона +${((v19GearFactor(r,'defence')-1)*100).toFixed(1)}% · мораль +${((v19GearFactor(r,'morale')-1)*100).toFixed(1)}%</div></section>`}

function v21FieldStores(){const reg=v15SelectedReg();if(!reg||!own(selected))return say('Выберите свой полк');
 if(s.food[s.player]<8||(s.equipment[s.player]?.gunpowder||0)<2||s.gold[s.player]<12)return say('Необходимо 8 провианта, 2 пороха и 12 монет');
 s.food[s.player]-=8;s.equipment[s.player].gunpowder-=2;s.gold[s.player]-=12;
 reg.v21Supplies=Math.min(100,(reg.v21Supplies??60)+28);log(`${reg.name}: обоз доставил запас продовольствия и пороха.`);v15Render();drawAll();
}

function v26Posture(k){const r=v15SelectedReg();if(!r||!V26_POSTURES[k])return;r.v26Posture=k;v15Render()}
