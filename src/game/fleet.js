// fleet — function declarations; initialized by ordered scripts.
function shipGunnery(f,key){let c=cannonBest(f,key);let basic=key==='sloop'?CANNONS[0]:key==='frigate'?CANNONS[1]:CANNONS[3];return (c.atk/basic.atk)**.39*(1+(has(f,'gunfoundries')?.04:0)+(has(f,'guncarriages')?.07:0))}

function seaZone(n){let a=n.lon,b=n.lat,name=n.name;if(!n.port)return -1;if(['Крым','Черноморье','Синоп','Добруджа'].includes(name))return 6;if(name==='Константинополь'||name==='Бурса')return 5;if(b<45.8&&a>19)return 5;if(b<44.2&&a>10)return 5;if(b<44.2&&a>-6)return 4;if(b<45.8&&a<=-6)return 0;if(b>=54.4&&a>=12.5&&b<=66.5)return 3;if(b>=55.2&&a>=18)return 3;if(b>=56&&a<=13)return 2;if(b>=50.7&&a>-3.5&&a<9)return 2;if(b>=48.4&&a<=3&&a>-6)return 1;return 0}

function canSailFor(f,from,to){let a=N[from],b=N[to];if(!a.port||!b.port)return false;const za=seaZone(a),zb=seaZone(b),dist=distKm(a,b),range=has(f,'navigation')?2150:1300;return adjacentSea(za,zb)&&dist<range}

function navalPower(p,f){return (p.sloop*1.4*shipGunnery(f,'sloop')+p.frigate*(has(f,'frigatedesign')?4.35:3.6)*shipGunnery(f,'frigate')+p.line*(has(f,'linebattle')?11.0:has(f,'gunnery')?9.3:7.5)*shipGunnery(f,'line'))*globalMod(f,'navalPower')*(has(f,'rigging')?1.16:1)*(has(f,'signals')?1.22:1)*(F[f].trait==='navy'?1.13:1)*(has(f,'navalcollege')?1.12:1)}

function takeSeaLoss(p,loss){for(let k of ['sloop','frigate','line']){let l=Math.min(p[k],loss);p[k]-=l;loss-=l;if(!loss)break}}

function landing(from,to){let a=s.provinces[from],b=s.provinces[to],f=s.player;
 if(!own(from)||armies(a)<2||!vessels(a))return;
 if(!canSail(from,to))return say('Десантный маршрут недоступен');if(b.owner!==f&&!withWar(f,b.owner))return say('Для десанта требуется война');
 let limit=a.sloop+a.frigate*2+a.line*4;let land=detachLand(a,limit);
 if(armies(land)<1)return say('Для высадки нужны свободные полки');
 let days=seaTravelDays(from,to,f)+Math.max(5,Math.round(armies(land)*1.6));
 s.orders.push({id:++s.orderSeq,kind:'landing',f,from,to,force:land,remaining:days,total:days});
 log(`⚓ Десант вышел в море: ${N[from].name} → ${N[to].name}. Полков: ${armies(land)}, срок: ${days} дн.`);drawAll()
}

function research(id){let t=TECH.find(x=>x.id===id),f=s.player;if(!t||has(f,id)||s.research[f])return;
 if(!techAccessible(f,t))return say(`Недостаточно технологий или образования (нужно ${t.eduMin||0})`);
 if(!spend(cost(t.cost)))return;
 let days=researchDays(t,f);s.research[f]={id,remaining:days,total:days};
 log(`✦ Академия начинает исследование «${t.name}». Срок: ${days} дн.`);
 if($('modal').classList.contains('visible'))showTechTree();else drawAll()
}

function advanceResearch(){F.forEach((_,i)=>{let project=s.research[i];if(!project)return;
 if(--project.remaining<=0){if(!s.tech[i].includes(project.id))s.tech[i].push(project.id);
 let t=TECH.find(z=>z.id===project.id);if(i===s.player){log(`✦ Исследование завершено: ${t?.name||project.id}.`);if(s.autoPauseResearch!==false)pauseGame()}
 s.research[i]=null}})}

function researchDays(t,f){let scholar=(.70+edu(f)*.009)*globalMod(f,'research');let academy=has(f,'academies')?1.13:1;let techboost=(has(f,'universities')?1.07:1)*(has(f,'scientificmethod')?1.1:1)*(has(f,'technicalschools')?1.05:1);return Math.max(22,Math.ceil(t.time*55/(scholar*academy*techboost)))}

function seaTravelDays(from,to,f){let a=N[from],b=N[to],dist=Math.hypot(a.x-b.x,a.y-b.y),days=15+dist*.065;
 if(has(f,'rigging'))days*=.88;if(has(f,'navigation'))days*=.88;if(has(f,'coppering'))days*=.80;
 return clamp(Math.round(days),9,88)}

function resolveFleetOrder(o){let b=s.provinces[o.to],a=s.provinces[o.from],ships=o.force,f=o.f;if(!b)return;
 if(b.owner===f){b.sloop+=ships.sloop;b.frigate+=ships.frigate;b.line+=ships.line;if(f===s.player)log(`⚓ Эскадра прибыла в ${N[o.to].name}.`);return}
 if(!withWar(f,b.owner)){if(a.owner===f){a.sloop+=ships.sloop;a.frigate+=ships.frigate;a.line+=ships.line}return}
 let A=navalPower(ships,f)*(.9+Math.random()*.22),D=navalPower(b,b.owner)*(.9+Math.random()*.22),won=A>=D;
 let lost=won?Math.floor(vessels(ships)*.22):Math.ceil(vessels(ships)*.48),their=won?Math.ceil(vessels(b)*.65):Math.ceil(vessels(b)*.2);
 takeSeaLoss(ships,lost);takeSeaLoss(b,their);
 if(a.owner===f){a.sloop+=ships.sloop;a.frigate+=ships.frigate;a.line+=ships.line}
 if(f===s.player||b.owner===s.player){log(`⚓ Морское сражение у ${N[o.to].name}: ${won?'успешный рейд':'поражение эскадры'}.`);pauseGame();showModal(battleText('Морское сражение',o.from,o.to,A,D,lost,their,won))}
}

function resolveLandingOrder(o){let b=s.provinces[o.to],from=s.provinces[o.from],f=o.f,force=o.force;
 if(b.owner===f){addLand(b,force);if(f===s.player)log(`⚓ Десант прибыл в ${N[o.to].name}.`);return}
 if(!withWar(f,b.owner)){if(from.owner===f)addLand(from,force);return}
 let enemy=b.owner,A=power(force,f,true,o.to)*.78*(has(f,'navigation')?1.2:1),D=power(b,enemy,false,o.to)*(1+b.fort*.11);
 if(vessels(b)>0){let escort=from.owner===f?navalPower(from,f):0;if(escort<navalPower(b,enemy)*.75)A*=.55}
 let won=A*(.86+Math.random()*.25)>D;
 let lA=won?Math.floor(armies(force)*.24):Math.ceil(armies(force)*.5),lD=won?Math.ceil(armies(b)*.65):Math.floor(armies(b)*.18);
 militaryLoss(force,lA);militaryLoss(b,lD);
 if(won){b.owner=f;b.inf=b.cav=b.art=0;b.units={};addLand(b,force);b.unrest=65;b.morale=58}else if(from.owner===f)addLand(from,force);
 if(f===s.player||enemy===s.player){log(`⚓ Десант у ${N[o.to].name}: ${won?'высадка успешна':'высадка отбита'}.`);pauseGame();showModal(battleText('Морской десант',o.from,o.to,A,D,lA,lD,won))}
}

function tabFleet(){let n=N[selected],p=s.provinces[selected],ours=own(selected),queued=s.production.filter(q=>q.province===selected&&q.f===s.player&&['sloop','frigate','line'].includes(q.key));let r=`<h2>⚓ Адмиралтейство</h2><p>${esc(n.name)} · ${n.port?'морская гавань':'внутренний регион'}</p><div class="lowbar"><div class="metric"><b>${p.sloop}</b><span>Шлюпы</span></div><div class="metric"><b>${p.frigate}</b><span>Фрегаты</span></div><div class="metric"><b>${p.line}</b><span>Линейные</span></div></div><div class="kv"><span>Боевая сила</span><b>${navalPower(p,p.owner).toFixed(1)}</b></div><div class="kv"><span>Верфи</span><b>${p.dock} уровня</b></div><div class="kv"><span>Морской район</span><b>${n.port?SEAS[seaZone(n)]:'—'}</b></div>`;
 if(ours){r+='<h3>Корабельные заказы</h3><div class="buttonrow">';for(let k of ['sloop','frigate','line']){let c={...UNIT[k].cost};if(has(s.player,'shipyards'))c.gold=Math.round(c.gold*.82);r+=affordBtn(UNIT[k].label,`recruit('${k}')`,c,n.port&&p.dock>= (k==='line'?2:1))}r+='</div><h3>Приказы эскадрам</h3><div class="buttonrow">'+button('⚓ Морской переход',"beginMission('fleet')",vessels(p)===0)+button('⛓ Блокада порта',"beginMission('blockade')",vessels(p)===0)+'</div>'}
 for(let q of queued)r+=`<div class="queue-item"><b>${esc(UNIT[q.key].label)}</b> · ${q.remaining} дн.<div class="timebar"><i style="width:${Math.round((1-q.remaining/q.total)*100)}%"></i></div></div>`;
 for(let o of s.orders.filter(o=>o.f===s.player&&(o.from===selected||o.to===selected)&&o.kind!=='army'))r+=`<div class="orders-mini"><b>Эскадра в море</b><div class="mini">${N[o.from].name} → ${N[o.to].name} · ${o.remaining} дн.</div></div>`;
 r+=`<h3>💣 Корабельная артиллерия</h3><div class="gun-grid">${CANNONS.map(c=>`<div class="gun-row ${has(s.player,c.id)?'unlocked':'locked'}"><div class="gun-bore">${c.lb}<small>фн</small></div><div><b>${c.lb}-фунтовая пушка</b><small>${c.category}</small></div><div class="gun-params"><span>Урон ${c.atk.toFixed(1)}</span><span>Зарядка ${c.reload.toFixed(2)}×</span><span>Дальность ${c.range} м</span><span>Масса ${c.weight.toFixed(1)} т</span></div><span class="gun-status">${has(s.player,c.id)?'✓ Изучена':'🔒 Исследовать'}</span></div>`).join('')}</div><p class="mini">Технологии орудий повышают силу подходящих кораблей; большая пушка сильнее и тяжелее, но стреляет медленнее. Собственный конструктор корпусов и батарей будет отдельной системой.</p><div class="slot"><b>Текущие образцы вооружения</b><div class="kv"><span>Шлюпы</span><b>${cannonBest(s.player,'sloop').lb} фн</b></div><div class="kv"><span>Фрегаты</span><b>${cannonBest(s.player,'frigate').lb} фн</b></div><div class="kv"><span>Линейные корабли</span><b>${cannonBest(s.player,'line').lb} фн</b></div></div>`;r+='<div class="note">Строительство и переходы занимают время. Улучшения артиллерии требуют исследований и образования.</div>';return r
}

function v6buildShip(id){let d=v6design(id),port=selected,p=s.provinces[port];if(!d)return;if(p.owner!==s.player||!N[port].port||p.dock<1)return say('Выберите собственную провинцию с верфью');if(d.type==='line'&&p.dock<2)return say('Для линейного корабля нужна верфь второго уровня');let st=v6designStats(d);if(!st.valid)return say(st.errors[0]||'Недопустимый проект');let inv=s.equipment[s.player];for(let [gun,qty] of Object.entries(st.equip))if((inv[gun]||0)<qty)return say(`Недостаточно ${V6_EQUIP[gun].name}: требуется ${qty}, имеется ${inv[gun]||0}`);
 let cost0={gold:st.gold,iron:st.iron,wood:st.wood,food:0};if(!spend(cost0))return;for(let [g,n] of Object.entries(st.equip))inv[g]-=n;
 let q={id:++s.v6seq,f:s.player,province:port,key:'customship',design:JSON.parse(JSON.stringify(d)),remaining:st.days,total:st.days};s.production.push(q);log(`На верфи ${N[port].name} заложен «${d.name}» — ${st.guns} орудий, срок ${st.days} дн.`);v6FleetPage='squadrons';drawAll()}

function v6completeShip(q){let p=s.provinces[q.province];if(!p||p.owner!==q.f){if(q.f===s.player)log('Верфь потеряна: готовый корпус захвачен противником.');return}let st=v6designStats({...q.design,f:q.f}),id=++s.v6seq,ship={id,f:q.f,name:q.design.name.replace('Проект ','').replace(/ №\d+$/,'')+' «'+(id%1000)+'»',type:q.design.type,design:q.design,port:q.province,hp:st.hp,maxHp:st.hp,crew:Math.max(st.crewMin,Math.round(st.crew*.83)),crewMax:st.crewMax,fleetId:null,experience:0,ammo:100,condition:100};s.ships.push(ship);if(q.f===s.player)log(`Готов корабль «${ship.name}» (${st.guns} пушек). Находится в ${N[q.province].name}.`)}

function v6createFleet(){let input=$('v6fleetname'),text=input?.value.trim().slice(0,60)||`Королевская эскадра №${s.fleets.length+1}`;if(!own(selected)||!N[selected].port)return say('Выберите собственную гавань');s.fleets.push({id:++s.v6seq,f:s.player,name:text,port:selected,admiral:null});log(`Создана эскадра «${text}».`);drawAll()}

function v6fleetAdmiral(id,admiral){let f=s.fleets.find(x=>x.id===id&&x.f===s.player);if(!f)return;f.admiral=admiral==='none'?null:+admiral;drawAll()}

function v6addShip(fleetId,shipId){let f=s.fleets.find(x=>x.id===fleetId&&x.f===s.player),sh=s.ships.find(z=>z.id===shipId&&z.f===s.player);if(!f||!sh||sh.port!==f.port||sh.fleetId)return say('Корабль недоступен: другая гавань или уже в эскадре');sh.fleetId=fleetId;drawAll()}

function v6removeShip(shipId){let sh=s.ships.find(z=>z.id===shipId&&z.f===s.player);if(sh){sh.fleetId=null;drawAll()}}

function v6ship(id){return s.ships.find(z=>z.id===id&&z.f===s.player)}

function v6repairShip(id){let sh=v6ship(id);if(!sh||!own(sh.port)||!N[sh.port].port)return;let damage=sh.maxHp-sh.hp;if(damage<1)return;let c=Math.ceil(damage*.4*globalMod(s.player,'shipCost'));if(!spend({gold:c,wood:Math.ceil(damage*.06),iron:0,food:0}))return;sh.hp=sh.maxHp;log(`Отремонтирован корабль «${sh.name}».`);drawAll()}

function v6refitShip(id,deck,gunId){let sh=v6ship(id);if(!sh||!own(sh.port)||!N[sh.port].port)return;let d=sh.design,b=d.batteries[deck],h=V6_HULLS[d.type];if(!h||!h.decks[deck])return;let proto=CANNONS.find(x=>x.id===gunId);if(!proto||proto.lb>h.decks[deck].maxLb||!v6canEquip(s.player,gunId))return say('Орудие слишком тяжёлое или не изучено');let current=b.gun,qty=b.count;if(current===gunId)return;let inv=s.equipment[s.player];if((inv[gunId]||0)<qty)return say(`На складе только ${inv[gunId]||0} пушек, требуется ${qty}`);inv[gunId]-=qty;inv[current]=(inv[current]||0)+qty;let before=b.gun;b.gun=gunId;let stats=v6designStats({...d,f:s.player});if(!stats.valid){b.gun=before;inv[gunId]+=qty;inv[current]-=qty;return say(stats.errors[0])}sh.maxHp=stats.hp;sh.hp=Math.min(sh.hp,sh.maxHp);drawAll()}

function v6shipPower(sh,admiralIndex){let st=v6designStats({...sh.design,f:sh.f});let adm=admiralIndex===null?null:V6_ADMIRALS[admiralIndex];let factor=(adm?.mod.shipPower||1)*globalMod(sh.f,'shipPower')*globalMod(sh.f,'navalPower')*Math.max(.15,sh.hp/sh.maxHp)*Math.max(.4,sh.crew/st.crewMax);return st.attack*factor}

function v6fleetMove(id,target){let fleet=s.fleets.find(x=>x.id===id&&x.f===s.player),to=+target;if(!fleet||!Number.isInteger(to)||!N[to]?.port||to===fleet.port)return;if(s.fleetOrders.some(o=>o.fleetId===fleet.id))return say('Эскадра уже в плавании');if(s.provinces[to].owner!==s.player&&!withWar(s.player,s.provinces[to].owner))return say('Нельзя войти в чужой порт без объявления войны');let origin=N[fleet.port],dst=N[to];if(!adjacentSea(seaZone(origin),seaZone(dst)))return say('Маршрут требует промежуточной гавани: морские районы не соседние');let ships=s.ships.filter(z=>z.fleetId===fleet.id),speed=Math.min(12,...ships.map(z=>v6designStats({...z.design,f:z.f}).speed));if(!ships.length)return say('Добавьте корабли в эскадру');let adm=V6_ADMIRALS[fleet.admiral];speed*=adm?.mod.shipSpeed||1;let days=Math.max(3,Math.ceil(distKm(origin,dst)/(Math.max(3,speed)*8.5)+3));s.fleetOrders.push({id:++s.v6seq,f:s.player,fleetId:id,from:fleet.port,to,remaining:days,total:days});log(`Эскадра «${fleet.name}» вышла из порта: ${origin.name} → ${dst.name}, ${days} дней.`);drawAll()}

function v6advanceFleetMoves(){let completed=[];for(let o of s.fleetOrders){if(--o.remaining>0)continue;completed.push(o);let fleet=s.fleets.find(x=>x.id===o.fleetId);if(!fleet)continue;let b=s.provinces[o.to],enemy=b.owner!==fleet.f&&withWar(fleet.f,b.owner);if(enemy&&(vessels(b)>0||s.ships.some(z=>z.f===b.owner&&z.port===o.to))){s.tactical={kind:'sea',attacker:fleet.f,defender:b.owner,from:o.from,to:o.to,fleetId:fleet.id,turn:1,action:'fire',selected:null,units:null};pauseGame();v6battleOpen();}else{fleet.port=o.to;for(let sh of s.ships.filter(z=>z.fleetId===fleet.id))sh.port=o.to;if(fleet.f===s.player)log(`Эскадра «${fleet.name}» достигла ${N[o.to].name}.`)}}
 s.fleetOrders=s.fleetOrders.filter(o=>!completed.includes(o))}

function v6shipCard(sh,compact=false){let stat=v6designStats({...sh.design,f:sh.f});let inner=`<div class="v6-ship">${v6art('ship','v6-ship-image')}<div><b>${v6name(sh.name)}</b><p class="v6-small">${V6_HULLS[sh.type].label} · ${stat.guns} орудий · ${stat.speed.toFixed(1)} узла</p><div class="kv"><span>Экипаж</span><b>${sh.crew}/${sh.crewMax}</b></div><div class="kv"><span>Корпус</span><b>${Math.round(sh.hp)}/${sh.maxHp}</b></div><div class="kv"><span>Бортовой залп</span><b>${stat.attack.toFixed(1)}</b></div></div></div>`;return `<div class="v6-panel">${inner}<div class="buttonrow"><button onclick="v6CurrentShip=${sh.id};v6FleetPage='ship';drawAll()">Осмотреть палубы</button>${sh.fleetId?`<button onclick="v6removeShip(${sh.id})">Изъять из эскадры</button>`:''}</div></div>`}

function v6fleetTab(){v6state();let f=s.player,ownPort=own(selected)&&N[selected].port,ships=s.ships.filter(z=>z.f===f),fleets=s.fleets.filter(x=>x.f===f),portShips=ships.filter(z=>z.port===selected&&!z.fleetId),yards=s.production.filter(z=>z.f===f&&z.key==='customship');let h=`<h2 class="v6-title">Адмиралтейство</h2><div class="v6-tabs">${[['squadrons','Эскадры'],['dock','Корабли и верфи'],['designer','Конструктор'],['ship','Палубы и экипаж']].map(([id,n])=>`<button class="${v6FleetPage===id?'active':''}" onclick="v6FleetPage='${id}';drawAll()">${n}</button>`).join('')}</div>`;
 if(v6FleetPage==='designer'){let designs=s.shipDesigns.filter(x=>x.f===f),d=v6design(v6CurrentDesign)||designs[0];h+=`<div class="v6-section"><h3>Чертёжное бюро</h3></div>${v6art('ship','large')}<p class="mini">Каждый корабль строится по проекту. Тяжёлые батареи снижают скорость, а каждое орудие должно быть произведено и находиться на складе.</p><div class="v6-grid triple">${Object.entries(V6_HULLS).map(([k,x])=>`<button onclick="v6makeDesign('${k}')">${x.label}${v6hullReady(k)?'':' · не изучен'}</button>`).join('')}</div>`;
 h+=`<div class="v6-section"><h3>Сохранённые проекты (${designs.length})</h3></div><select class="v6-sel" onchange="v6CurrentDesign=+this.value;drawAll()">${designs.map(x=>`<option value="${x.id}" ${d?.id===x.id?'selected':''}>${v6name(x.name)}</option>`).join('')}</select>`;
 if(d){let hull=V6_HULLS[d.type],st=v6designStats(d);h+=`<div class="v6-panel"><b>Название проекта</b><div class="buttonrow"><input class="v6-sel" id="v6designname" value="${v6name(d.name)}"><button onclick="v6renameDesign(${d.id})">Переименовать</button></div><div class="v6-section"><h3>${hull.label} · ${hull.tonnage} т</h3></div>`;
 h+=hull.decks.map((deck,i)=>`<div class="v6-battery"><div><b>${v6name(deck.name)}</b><small style="display:block;color:#b5c2bc">Вместимость ${deck.max} · до ${deck.maxLb} фн</small></div><select onchange="v6designChange(${d.id},${i},'gun',this.value)">${CANNONS.filter(g=>g.lb<=deck.maxLb).map(g=>`<option value="${g.id}" ${d.batteries[i].gun===g.id?'selected':''}>${g.lb} фн</option>`).join('')}</select><input type="number" min="0" max="${deck.max}" step="2" value="${d.batteries[i].count}" onchange="v6designChange(${d.id},${i},'count',this.value)"></div>`).join('');
 h+=`<div class="v6-grid"><div class="v6-line"><div class="kv"><span>Орудий</span><b>${st.guns}/${hull.max}</b></div><div class="kv"><span>Скорость</span><b>${st.speed.toFixed(1)} уз.</b></div><div class="kv"><span>Расчётный экипаж</span><b>${st.crew} чел.</b></div><div class="kv"><span>Корпус</span><b>${st.hp} ед.</b></div></div><div class="v6-line"><div class="kv"><span>Золото</span><b>${st.gold}</b></div><div class="kv"><span>Древесина</span><b>${st.wood}</b></div><div class="kv"><span>Железо</span><b>${st.iron}</b></div><div class="kv"><span>Срок</span><b>${st.days} дней</b></div></div></div>`;
 h+=`<div class="v6-line"><b>Складские орудия</b>${Object.entries(st.equip).map(([k,q])=>`<div class="kv"><span>${V6_EQUIP[k].name} · требуется ${q}</span><b class="${(s.equipment[f][k]||0)>=q?'v6-green':'v6-red'}">есть ${s.equipment[f][k]||0}</b></div>`).join('')}</div>`;
 if(st.errors.length)h+=`<p class="v6-red">${st.errors.map(v6name).join(' · ')}</p>`;h+=`<button class="main wide" onclick="v6buildShip(${d.id})" ${st.valid&&ownPort?'':'disabled'}>Заложить корабль на верфи ${v6name(N[selected].name)} · ${st.days} дней</button></div>`}
 }else if(v6FleetPage==='ship'){let sh=v6ship(v6CurrentShip)||ships[0];if(!sh)h+='<div class="note">Постройте корабль в «Конструкторе».</div>';else{let st=v6designStats({...sh.design,f:sh.f}),hull=V6_HULLS[sh.type];h+=v6shipCard(sh,true)+`<div class="v6-section"><h3>Вооружение по палубам</h3></div><div class="v6-panel">${sh.design.batteries.map((row,i)=>`<div class="v6-battery"><div><b>${hull.decks[i].name}</b><small style="display:block;color:#b4c8c7">${row.count} × ${CANNONS.find(z=>z.id===row.gun)?.lb} фн</small></div><select onchange="v6refitShip(${sh.id},${i},this.value)">${CANNONS.filter(c=>c.lb<=hull.decks[i].maxLb).map(c=>`<option value="${c.id}" ${row.gun===c.id?'selected':''}>${c.lb} фн</option>`).join('')}</select><span class="v6-small">${Math.floor(s.equipment[f][row.gun]||0)} в запасе</span></div>`).join('')}</div>`;
 h+=`<div class="v6-section"><h3>Экипаж, ремонт и боеспособность</h3></div><div class="v6-line"><div class="kv"><span>Минимально необходимый экипаж</span><b>${st.crewMin} чел.</b></div><div class="kv"><span>Фактический экипаж</span><b>${sh.crew}/${sh.crewMax} чел.</b></div><div class="kv"><span>Прочность корпуса</span><b>${sh.hp}/${sh.maxHp}</b></div><div class="buttonrow"><button onclick="v6hireCrew(${sh.id})">Нанять матросов · ${Math.ceil((sh.crewMax-sh.crew)*.12)} зол.</button><button onclick="v6repairShip(${sh.id})">Ремонт корпуса</button></div></div>`}}
 else if(v6FleetPage==='dock'){h+=`<div class="v6-section"><h3>Верфи и готовые корабли</h3><span class="v6-small">${ships.length} построено</span></div><p class="mini">Выбранная гавань: ${v6name(N[selected].name)} · уровень верфи ${s.provinces[selected].dock}. Для закладки корабля выберите провинцию с верфью на карте.</p><button class="main wide" onclick="v6FleetPage='designer';drawAll()">Создать чертёж корабля</button>`;for(let sh of ships)h+=v6shipCard(sh);h+='<h3>В работе</h3>';for(let q of yards)h+=`<div class="v6-line"><b>${v6name(q.design.name)}</b><span class="v6-small"> · осталось ${q.remaining} дн. · ${v6name(N[q.province].name)}</span><div class="v6-progress"><i style="width:${Math.round((1-q.remaining/q.total)*100)}%"></i></div></div>`}
 else{h+=`<div class="v6-section"><h3>Боевые эскадры</h3><span class="v6-small">${fleets.length} соединений</span></div><div class="v6-panel"><b>Создание новой эскадры</b><input class="v6-sel" id="v6fleetname" placeholder="Например, Первая эскадра Ла-Манша"/><button onclick="v6createFleet()" ${ownPort?'':'disabled'}>Создать в выбранной гавани</button></div>`;
 for(let fleet of fleets){let grouped=ships.filter(z=>z.fleetId===fleet.id),available=ships.filter(z=>z.port===fleet.port&&!z.fleetId),travel=s.fleetOrders.find(o=>o.fleetId===fleet.id);let ports=N.filter((z,i)=>z.port&&i!==fleet.port&&adjacentSea(seaZone(N[fleet.port]),seaZone(z))&&(s.provinces[i].owner===f||withWar(f,s.provinces[i].owner))).slice(0,250);
 h+=`<div class="v6-panel" style="margin:10px 0"><h3>${v6name(fleet.name)}</h3><p class="mini">${v6name(N[fleet.port].name)} · ${grouped.length} судов · ${travel?`в море, осталось ${travel.remaining} дней`:'на якоре'}</p><label class="v6-lbl">Командующий эскадрой</label><select class="v6-sel" onchange="v6fleetAdmiral(${fleet.id},this.value)"><option value="none">Не назначен</option>${V6_ADMIRALS.map((a,i)=>`<option value="${i}" ${fleet.admiral===i?'selected':''}>${a.name}</option>`).join('')}</select>${fleet.admiral!==null?`<p class="mini">${Object.entries(V6_ADMIRALS[fleet.admiral].mod).map(([k,m])=>v6bonus(k,m)).join(' · ')}</p>`:''}`;
 h+=`<div class="v6-list" style="margin:8px 0">${grouped.map(sh=>v6shipCard(sh)).join('')||'<p class="mini">Эскадра пока не укомплектована.</p>'}</div>`;
 if(available.length)h+=`<div class="v6-line"><label class="v6-lbl">Добавить корабль во флот</label><div class="buttonrow"><select class="v6-sel" id="v6add${fleet.id}">${available.map(z=>`<option value="${z.id}">${v6name(z.name)} · ${v6designStats({...z.design,f}).guns} орудий</option>`).join('')}</select><button onclick="v6addShip(${fleet.id},+document.getElementById('v6add${fleet.id}').value)">＋ Добавить</button></div></div>`;
 h+=`<div class="v6-line"><label class="v6-lbl">Приказ на морской переход</label><select class="v6-sel" id="v6dest${fleet.id}">${ports.map(z=>`<option value="${z.id}">${v6name(z.name)} · ${v6name(F[s.provinces[z.id].owner].name)}</option>`).join('')}</select><button onclick="v6fleetMove(${fleet.id},+document.getElementById('v6dest${fleet.id}').value)" ${travel||!grouped.length?'disabled':''}>Отправить эскадру</button></div></div>`}
 if(!fleets.length)h+='<p class="mini">Заложите корабль по проекту, сформируйте эскадру, назначьте адмирала и пополните её резервными кораблями.</p>'
 }h+=`<div class="v6-section"><h3>Национальная морская школа</h3></div>${v6percent(f,'shipCost')}${v6percent(f,'shipTime')}`;return h}

function v7shipGate(type,f=s.player){let issues=[];if(edu(f)<V7_HULL_REQ[type])issues.push(`Образование ${edu(f).toFixed(1)} / нужно ${V7_HULL_REQ[type]}`);
 if(!(s.advisers?.[f]||[]).includes('shipminister'))issues.push('Требуется назначенный министр кораблестроения');
 const req=V6_HULLS[type]?.req;if(req&&!has(f,req))issues.push(`Технология: ${TECH.find(t=>t.id===req)?.name||req}`);
 return issues;}

function v7dailyShipments(){for(let q of s.shipImports){q.remaining--;if(q.remaining<=0){s[q.resource][q.f]+=q.qty;if(q.f===s.player)log(`Прибыло из ${F[q.supplier].name}: ${q.qty} ед. ${V7_METALS[q.resource].name.toLowerCase()}.`)}}s.shipImports=s.shipImports.filter(q=>q.remaining>0)}

function v7FleetTab(){v7state();let h=v6fleetTab(),f=s.player,design=s.shipDesigns.find(d=>d.id===v6CurrentDesign&&d.f===f)||s.shipDesigns.find(d=>d.f===f),st=design?v6designStats(design):null;
 let intro=`<div class="v7-panel v7-naval-check"><h3>Допуск к проектированию</h3><div class="kv"><span>Образование</span><b>${edu(f).toFixed(1)}/100</b></div><div class="kv"><span>Министр кораблестроения</span><b class="${s.advisers[f].includes('shipminister')?'v7-positive':'v7-negative'}">${s.advisers[f].includes('shipminister')?'Назначен':'Не назначен'}</b></div>${Object.keys(V6_HULLS).map(k=>`<div class="kv"><span>${V6_HULLS[k].label}</span><b class="${v7shipGate(k).length?'v7-negative':'v7-positive'}">${v7shipGate(k).length?v7shipGate(k).join('; '):'Проект доступен'}</b></div>`).join('')}<button onclick="tab='court';drawAll()">Открыть государственный совет</button></div>`;
 h=h.replace('</div>', '</div>'); // preserve original layout and append detailed real equipment instead of fake preview
 if(v6FleetPage==='designer'){h+=intro;if(st){h+=`<div class="v7-panel"><h3>Полная калькуляция проекта «${v6name(design.name)}»</h3><div class="kv"><span>Стоимость в стали</span><b>${st.steel} ед. · запас ${Math.floor(s.steel[f])}</b></div><div class="kv"><span>Стоимость в меди</span><b>${st.copper} ед. · запас ${Math.floor(s.copper[f])}</b></div><div class="kv"><span>Стоимость в железе</span><b>${st.iron} ед. · запас ${Math.floor(s.iron[f])}</b></div><div class="kv"><span>Стоимость строительства</span><b>−${Number(((1-globalMod(f,'shipCost'))*100).toFixed(1)).toLocaleString('ru-RU')}% от базовой цены (сочетание бонусов)</b></div>${v6percent(f,'shipCost')}${v6percent(f,'shipTime')}<div class="v7-arsenal-gallery">${design.batteries.map((b,i)=>`<div class="v7-factory-card"><div class="v7-img big" style="background-image:url('${V6_ART[b.gun]}')"></div><b>${v6name(V6_HULLS[design.type].decks[i].name)}</b><small>${b.count} × ${V6_EQUIP[b.gun].name}</small><small>Есть ${Math.floor(s.equipment[f][b.gun]||0)} ед.</small></div>`).join('')}</div></div>`}}
 else if(v6FleetPage==='squadrons')h+=`<div class="v7-panel"><h3>Действующие бонусы флота</h3>${v6percent(f,'shipCost')}${v6percent(f,'shipTime')}</div>`;
 return h}

function v7seedInitialFleet(f){if(s.v7InheritedFleet)return;s.v7InheritedFleet=true;
 let home=N.find((n,i)=>n.port&&s.provinces[i].owner===f&&(s.provinces[i].frigate||s.provinces[i].sloop||s.provinces[i].line));if(!home)return;
 let typeorder=['line','frigate','sloop'],names=f===0?{line:'HMS Sovereign',frigate:'HMS Resolute',sloop:'HMS Swift'}:{line:'Флагман «Корона»',frigate:'Фрегат «Надежда»',sloop:'Шлюп «Стремительный»'};
 let first=null;
 for(let kind of typeorder){let h=V6_HULLS[kind],p=s.provinces[home.id];if((p[kind]||0)<=0)continue;
 let calibers=kind==='line'?['gun24','gun18','gun9']:kind==='frigate'?['gun12','gun9','gun6']:['gun6','gun4'];
 let d={id:++s.v6seq,f,type:kind,name:names[kind],batteries:h.decks.map((deck,i)=>({gun:calibers[i]||'gun4',count:deck.max})),tech:[],legacy:true};
 let st=v6designStats(d),id=++s.v6seq;let sh={id,f,name:names[kind],type:kind,design:d,port:home.id,hp:st.hp,maxHp:st.hp,crew:Math.round(st.crew*.88),crewMax:st.crewMax,fleetId:null,experience:0,ammo:100,condition:100,legacy:true};s.ships.push(sh);
 // Remove exactly one abstract counter: the newly represented ship is not an additional free vessel.
 p[kind]--;if(!first)first=sh;
 }
 if(first){let fid=++s.v6seq;s.fleets.push({id:fid,f,name:f===0?'Первая королевская эскадра':'Первая национальная эскадра',port:home.id,admiral:0});first.fleetId=fid;v6CurrentShip=first.id;log('Корабли действующего флота внесены в адмиралтейские реестры. Остальные суда находятся в резерве гавани.');}
}

function v8shipIsTransport(sh){return sh&&sh.type==='transport'}

function v8shipsOf(fleet){return s.ships.filter(sh=>sh.fleetId===fleet.id&&sh.f===fleet.f)}

function v8fleetCapacity(fleet){return v8shipsOf(fleet).reduce((a,sh)=>a+(v8shipIsTransport(sh)?sh.transportCapacity||1600:Math.floor((sh.crewMax||80)*.14)),0)*(has(fleet.f,'v8_transport')?1.2:1)}

function v8fleetSpeed(fleet){let ships=v8shipsOf(fleet);if(!ships.length)return 0;return Math.max(3,Math.min(...ships.map(sh=>{let st=v6designStats({...sh.design,f:sh.f});return (st.speed||9)*Math.max(.45,sh.hp/sh.maxHp)*Math.max(.65,sh.crew/sh.crewMax)})))}

function v8orderSea(id,to,type='transfer'){let v=v8get(),fleet=s.fleets.find(x=>x.id===id&&x.f===s.player);to=+to;if(!fleet||!N[to]?.port||fleet.port===to)return say('Для похода нужны эскадра и другая прибрежная провинция');if(!v8shipsOf(fleet).length)return say('В эскадре отсутствуют корабли');if(v.seaOrders.some(o=>o.fleetId===id))return say('Эскадра уже выполняет поход');let enemy=s.provinces[to].owner;if(type==='landing'&&!withWar(fleet.f,enemy))return say('Десант возможен только во время войны');if(type==='landing'&&!(fleet.embarked||[]).length)return say('Погрузите пехотные полки на транспорты');if(type==='transfer'&&enemy!==fleet.f&&!withWar(fleet.f,enemy))return say('У вас нет права входа в этот порт');let a=N[fleet.port],b=N[to],speed=v8fleetSpeed(fleet),d=distKm(a,b),range=Math.ceil(d/(speed*1.852*11.5)*1.2)+2;let via=Math.abs(seaZone(a)-seaZone(b));let total=Math.max(4,range+via*3);v.seaOrders.push({id:++v.id,fleetId:id,f:fleet.f,from:fleet.port,to,type,remaining:total,total,progress:0,position:{x:a.x,y:a.y},loading:(fleet.embarked||[]).length>0});fleet.mission=type;log(`Эскадра «${fleet.name}»: ${type==='landing'?'десант':type==='patrol'?'патруль':type==='escort'?'эскорт':'морской переход'} ${a.name} → ${b.name}, ${total} дней.`);v8Refresh()}

function v8abortSea(id){let v=v8get(),order=v.seaOrders.find(o=>o.id===id&&o.f===s.player);if(!order)return;let fleet=s.fleets.find(x=>x.id===order.fleetId);if(fleet){fleet.mission='returning'}order.to=order.from;order.type='return';order.remaining=Math.max(2,Math.ceil((order.total-order.remaining)*.8)+2);order.total=order.remaining;order.progress=0;log(`Эскадра ${fleet?.name||''} возвращается в исходный порт.`);v8Refresh()}

function v8advanceSea(){let v=v8get();v8transportDay();for(let o of v.seaOrders){let fleet=s.fleets.find(x=>x.id===o.fleetId);if(!fleet){o.remaining=0;continue}o.remaining=Math.max(0,o.remaining-1);o.progress=Math.min(1,(o.total-o.remaining)/o.total);let a=N[o.from],b=N[o.to];o.position={x:a.x+(b.x-a.x)*o.progress,y:a.y+(b.y-a.y)*o.progress};
 if(o.remaining>0){if(s.day%8===0&&withWar(fleet.f,s.provinces[o.to].owner)&&Math.random()<.09){for(let sh of v8shipsOf(fleet))sh.hp=Math.max(1,sh.hp-Math.ceil(sh.maxHp*.018));if(fleet.f===s.player)log(`Вражеские каперы обстреляли эскадру ${fleet.name}: повреждения кораблей.`)}continue}
 let port=s.provinces[o.to],enemy=port.owner!==fleet.f&&withWar(fleet.f,port.owner);let defenders=vessels(port)+s.ships.filter(z=>z.f===port.owner&&z.port===o.to).length;
 if(enemy&&defenders>0){if(fleet.f===s.player){v8openBattle('sea',fleet.id,o.to);o.remaining=-1;continue}else{for(let sh of v8shipsOf(fleet))sh.hp=Math.max(1,sh.hp-sh.maxHp*.14)}}
 if(o.type==='landing'&&enemy){v8amphibiousAssault(fleet,o.to)}
 else if(!enemy&&o.type!=='landing'){fleet.port=o.to;for(let sh of v8shipsOf(fleet))sh.port=o.to;if(fleet.f===s.player)log(`${fleet.name} прибыла в ${N[o.to].name}.`)}
 if((o.type==='patrol'||o.type==='escort')&&!enemy){let temp=o.from;o.from=o.to;o.to=temp;o.remaining=o.total;o.progress=0;if(fleet.f===s.player)log(`${fleet.name}: патрульный маршрут продолжается.`)}else o.remaining=-1;
 }v.seaOrders=v.seaOrders.filter(o=>o.remaining>=0)}

function v8fleetUI(){let v=v8get(),f=s.player,fleets=s.fleets.filter(x=>x.f===f),ships=s.ships.filter(x=>x.f===f),portList=v8ownedPorts(f),fId=v8SelectedFleet||fleets[0]?.id,fl=fleets.find(x=>x.id===fId)||fleets[0];v8SelectedFleet=fl?.id||null;let active=v.seaOrders.find(x=>x.fleetId===fl?.id),availablePorts=portList.slice(0,100),canBoard=fl?.port!==undefined&&own(fl.port);
 let html=`<div class="v8-kpi"><div><b>${fleets.length}</b><small>Действующие эскадры</small></div><div><b>${ships.length}</b><small>Именных кораблей</small></div><div><b>${ships.filter(x=>x.type==='transport').length}</b><small>Транспортных судов</small></div><div><b>${v.seaOrders.filter(x=>x.f===f).length}</b><small>Операции в море</small></div></div><div class="v8-columns"><div><div class="v8-card"><h3>Эскадры и приказы Адмиралтейства</h3><div class="v8-row">${fleets.map(x=>`<button class="${x.id===v8SelectedFleet?'active':''}" onclick="v8SelectedFleet=${x.id};v8Refresh()">${esc(x.name)}</button>`).join('')}<button onclick="v8createSquadron()">+ Новая эскадра</button></div>`;
 if(fl){let shipsIn=v8shipsOf(fl),cap=v8fleetCapacity(fl),n=(fl.embarked||[]).reduce((a,x)=>a+x.count,0);html+=`<div class="v8-fleet-slot"><h3>${esc(fl.name)}</h3><p class="v8-muted">Порт приписки: ${esc(N[fl.port]?.name||'в море')} · Адмирал: ${V6_ADMIRALS[fl.admiral]?.name||'Не назначен'}</p><div class="v8-kpi"><div><b>${shipsIn.length}</b><small>Кораблей</small></div><div><b>${v8fmt(v8fleetSpeed(fl),1)}</b><small>Скорость эскадры, уз.</small></div><div><b>${Math.floor(cap/800)}</b><small>Вместимость, полков</small></div><div><b>${n}</b><small>Полков на борту</small></div></div>`;
 if(active)html+=`<div class="v8-underway">Морской приказ: ${active.type==='landing'?'Высадка':active.type==='escort'?'Эскорт':active.type==='patrol'?'Патруль':'Переход'} → ${N[active.to].name}. Прибытие через ${active.remaining} дней. <button onclick="v8abortSea(${active.id})">Отменить поход</button></div>`;
 html+=`<div class="v8-row"> <label>Адмирал</label><select onchange="v6fleetAdmiral(${fl.id},this.value);v8Refresh()"><option value="none">Без адмирала</option>${V6_ADMIRALS.map((a,i)=>`<option value="${i}" ${fl.admiral===i?'selected':''}>${esc(a.name)}</option>`).join('')}</select></div><h4>Боевые корабли и транспорты</h4>`;
 for(let sh of shipsIn){let st=v6designStats({...sh.design,f:sh.f});html+=`<div class="v8-underway"><b>${esc(sh.name)}</b> · ${sh.type==='transport'?'Войсковой транспорт':esc(V6_HULLS[sh.type].label)}<br><span class="v8-small">${st.guns} орудий · ${v8fmt(st.speed,1)} уз · экипаж ${sh.crew}/${sh.crewMax} · корпус ${Math.round(sh.hp)}/${sh.maxHp}</span> <button onclick="v8ShowModel(${sh.id})">3D-модель</button> <button onclick="v6removeShip(${sh.id});v8Refresh()">В резерв</button></div>`}
 let reserve=ships.filter(z=>!z.fleetId&&z.port===fl.port);html+=`<div class="v8-row"><label>Добавить корабль из резерва</label><select id="v8-addship"><option value="">Выбрать...</option>${reserve.map(x=>`<option value="${x.id}">${esc(x.name)} (${V6_HULLS[x.type].label})</option>`).join('')}</select><button onclick="v8addReserve(${fl.id})">В состав эскадры +</button></div>`;
 html+=`<div class="v8-line"></div><h4>Морские операции</h4><div class="v8-row"><label>Цель:</label><select id="v8-destination"><option value="">Порт или участок побережья</option>${[...availablePorts,...N.map((n,i)=>({n,i})).filter(({n,i})=>n.port&&s.provinces[i].owner!==f&&withWar(f,s.provinces[i].owner)).slice(0,120)].map(x=>`<option value="${x.i}">${esc(x.n.name)} · ${F[s.provinces[x.i].owner].name}</option>`).join('')}</select></div><div class="v8-row"><button onclick="v8launch(${fl.id},'transfer')">Морской переход</button><button onclick="v8launch(${fl.id},'escort')">Эскорт конвоев</button><button onclick="v8launch(${fl.id},'patrol')">Патруль</button><button onclick="v8launch(${fl.id},'landing')">Десантная операция</button></div><h4>Посадка сухопутных войск</h4><div class="v8-row"><input id="v8-troops" type="number" min="1" max="16" value="1"><button onclick="v8embark(${fl.id},${fl.port},Number($('v8-troops').value))" ${canBoard?'':'disabled'}>Погрузить полки</button><button onclick="v8unload(${fl.id})">Выгрузить</button></div>`;
 html+=`</div>`}else html+=`<p class="v8-muted">Эскадр нет. Создайте первую для назначения кораблей.</p>`;
 html+=`</div></div><div><div class="v8-card"><h3>Верфи и военно-морские транспорты</h3><p class="v8-muted">Для десанта нужны транспортные суда, охранение военных кораблей и пехота в порту. Вражеские эскадры могут перехватить поход.</p><div class="v8-row"><select id="v8-yardport">${portList.map(x=>`<option value="${x.i}" ${x.i===selected?'selected':''}>${esc(x.n.name)}</option>`).join('')}</select><button onclick="v8makeTransport(Number($('v8-yardport').value))">Заложить транспорт · 90 дней</button></div><p class="v8-small">Материалы: 145 монет, 70 древесины, 24 железа, 5 стали, 2 меди, 16 пеньки, 12 льна.</p>`;
 for(let q of v.transportQueue||[])if(q.f===f)html+=`<div class="v8-underway">Транспорт, порт ${N[q.port].name} · ${q.days} дней до завершения.</div>`;
 html+=`<div class="v8-line"></div><button onclick="tab='fleet';v6FleetPage='designer';v8close();drawAll();v7openWide('fleet')">Чертёжное бюро: проекты корпусов и батарей</button><button onclick="v8open('models')">Посмотреть 3D-ассеты</button></div><div class="v8-card"><h3>Условия похода</h3><p class="v8-muted">В расчёт времени включены морская дистанция, минимальная скорость эскадры и переходы между морскими районами. Корабли получают повреждения при перехвате; для высадки проверяются объявленная война, вместимость транспортов и сила гарнизона.</p></div></div></div>`;return html}

function v8createSquadron(){let f=s.player,id=++s.v6seq,p=v8ownedPorts(f)[0]?.i;if(p===undefined)return say('У страны нет собственного порта');s.fleets.push({id,f,port:p,name:`Новая эскадра №${s.fleets.filter(x=>x.f===f).length+1}`,admiral:null,embarked:[]});v8SelectedFleet=id;v8Refresh()}

function v9FleetSupplyInit(fl){if(fl.provisions===undefined)fl.provisions=75;if(fl.seaMorale===undefined)fl.seaMorale=90;if(fl.seaDays===undefined)fl.seaDays=0}

function v9FleetSupplyDaily(){if(!s)return;let active=v8get().seaOrders,ids=new Set(active.map(o=>o.fleetId));for(let fl of s.fleets){v9FleetSupplyInit(fl);if(!ids.has(fl.id))continue;let ships=v8shipsOf(fl);if(!ships.length)continue;let soldiers=(fl.embarked||[]).reduce((sum,x)=>sum+(x.count||0)*800,0),cost=.42+ships.length*.28+soldiers/15000;
 fl.provisions=Math.max(0,fl.provisions-cost);fl.seaDays++;
 if(fl.provisions<15){fl.seaMorale=Math.max(15,fl.seaMorale-(fl.provisions<=0?.28:.08));if(fl.provisions<=0){for(let ship of ships)ship.hp=Math.max(1,ship.hp-ship.maxHp*.0009);if(fl.f===s.player&&fl.seaDays%12===0)log(`${fl.name}: истощились запасы провианта. Требуется заход в собственный порт.`)}}else fl.seaMorale=Math.min(100,fl.seaMorale+.015)
 }}

function v9ReplenishFleet(id){let fl=s.fleets.find(x=>x.id===id&&x.f===s.player);if(!fl)return;v9FleetSupplyInit(fl);if(v8get().seaOrders.some(x=>x.fleetId===id))return say('Эскадра в море — пополнение возможно только после возвращения в собственный порт');if(!s.provinces[fl.port]||s.provinces[fl.port].owner!==fl.f||!N[fl.port].port)return say('Для снабжения необходим собственный действующий порт');
 let ships=v8shipsOf(fl),qFood=Math.ceil((100-fl.provisions)*.55+ships.length*.7),qPowder=Math.ceil(ships.reduce((a,sh)=>a+(100-(sh.ammo||0))*.014,0)),qGold=Math.ceil(ships.length*3+qFood*.35);
 if(s.food[fl.f]<qFood||s.gold[fl.f]<qGold||(s.equipment[fl.f].gunpowder||0)<qPowder)return say(`Требуется: провиант ${qFood}, порох ${qPowder}, деньги ${qGold}. Пополните национальный склад.`);
 s.food[fl.f]-=qFood;s.gold[fl.f]-=qGold;s.equipment[fl.f].gunpowder-=qPowder;fl.provisions=100;fl.seaMorale=Math.min(100,fl.seaMorale+15);
 for(let sh of ships)sh.ammo=100;log(`${fl.name}: погружены запасы провианта и боеприпасов. Списано ${qFood} провианта, ${qPowder} пороха, ${qGold} монет.`);v8Refresh(false);drawAll()}

function v10FleetDeck(){let sh=s.ships.filter(x=>x.f===s.player).slice(0,9),fl=s.fleets.filter(x=>x.f===s.player);return `<section class="v10-admiralty"><header>${v10icon('fleet',22)} <b>КОРАБЛИ И ЭСКАДРЫ</b><small>Нажмите на корабль — откроется 3D-модель</small></header><div class="v10-ships">${sh.map(x=>{let hp=Math.round(100*(x.hp||0)/Math.max(1,x.maxHp||100)),d=x.design?.batteries||[],guns=d.reduce((a,b)=>a+(b.count||0),0),f=fl.find(z=>z.shipIds?.includes(x.id))||null;return `<button class="v10-shipcard" onclick="v8ShowModel(${x.id})">${v10shipPicture(x)}<b>${esc(x.name)}</b><span>${guns} орудий · ${x.crew||0} чел.</span><div class="v10-bar"><i style="width:${v10pc(hp)}%;background:${hp<50?'#bc6f55':'#8cae9c'}"></i></div><small>${f?esc(f.name):'Корабль в резерве'} · корпус ${hp}%</small></button>`}).join('')||'<div>Нет собственных кораблей</div>'}</div></section>`}

function v15ShipPanel(){let fleets=(s.fleets||[]).filter(x=>x.f===s.player),ships=(s.ships||[]).filter(x=>x.f===s.player),sh=ships.find(x=>x.id===v15ShipId)||ships[0];v15ShipId=sh?.id||null;
 let fleet=sh?fleets.find(x=>x.id===sh.fleetId):null,st=sh?v6designStats({...sh.design,f:sh.f}):null;
 const cards=ships.slice(0,32).map(z=>{let stats=v6designStats({...z.design,f:z.f}),kind=V6_HULLS[z.type]?.label||z.type;return `<button class="v15-shiptile ${sh?.id===z.id?'selected':''}" onclick="v15ShipId=${z.id};v15Render()"><img src="${(typeof V6_ART!=='undefined'&&(V6_ART[V6_HULLS[z.type]?.art]||V6_ART.ship))||''}" alt=""><div><b>${esc(z.name)}</b><small>${esc(kind)} · ${stats.guns} орудий</small>${v15Gauge('Корпус',z.hp,z.maxHp,'#9dba94',Math.round(100*z.hp/z.maxHp)+'%')}</div></button>`}).join('');
 let batteries=sh?.design?.batteries||[];
 return `<div class="v15-docklayout"><aside class="v15-docklist"><h3>Личный состав эскадр <small>${fleets.length} эскадр · ${ships.length} кораблей</small></h3>${cards||'<p>Корабли отсутствуют. Создайте проект и заложите его на верфи.</p>'}<button class="v15-main" onclick="v15Close();v8open('fleet')">Эскадры и операции ↗</button></aside><section class="v15-dockhero">${sh?`<div class="v15-shiptitle"><h3>${esc(sh.name)}</h3><span>${esc(V6_HULLS[sh.type]?.label||sh.type)}</span></div><div class="v15-shipimage"><img src="${(typeof V6_ART!=='undefined'&&(V6_ART[V6_HULLS[sh.type]?.art]||V6_ART.ship))||''}" alt=""><div><strong>${st.guns} орудий</strong><strong>${st.speed.toFixed(1)} узлов</strong><strong>${sh.crew}/${sh.crewMax} человек</strong></div></div><div class="v15-shipactions"><button class="v15-main" onclick="v15Close();v8ShowModel(${sh.id})">Открыть 3D-модель ↗</button><button onclick="v15Close();tab='fleet';v6FleetPage='designer';drawAll()">Редактировать проекты</button><button onclick="v15Close();v8open('fleet')">Управление эскадрой</button></div>${v15Gauge('Корпус',sh.hp,sh.maxHp,'#9dba94',Math.round(sh.hp/sh.maxHp*100)+'%')}${v15Gauge('Экипаж',sh.crew,sh.crewMax,'#bda270')}${v15Gauge('Боекомплект',sh.ammo||0,100,'#83b2cb')}${v15Gauge('Опыт',sh.experience||0,100,'#c89c70')}<h3>Орудийные палубы</h3><div class="v15-batteries">${batteries.map((row,i)=>`<div><img src="${(typeof V6_ART!=='undefined'&&(V6_ART[row.gun]||V6_ART.cannon))||''}" alt=""><span>${esc(V6_HULLS[sh.type]?.decks[i]?.name||'Батарея')}</span><b>${row.count} × ${row.gun.replace('gun','')}-фн</b></div>`).join('')}</div><p>Процедурная 3D-модель имеет собственный генерируемый силуэт кормы и декоративные детали. Калибры и число пушек берутся из настоящего проекта корабля.</p>`:'<h3>Корабли ещё не построены</h3><p>Создайте индивидуальный проект, произведите орудия и заложите судно на верфи.</p>'}</section></div>`}

function v15Research(id){research(id);if(document.getElementById('modal')?.classList.contains('visible'))closeModal();v15Render()}

function v17ShipDesigner(){const designs=s.shipDesigns.filter(d=>d.f===s.player),d=v17Blueprint();let st=null;try{if(d)st=v6designStats(d)}catch(e){}let selection=designs.map(x=>`<option value="${x.id}" ${x.id===d?.id?'selected':''}>${esc(x.name)}</option>`).join('');return `<section class="v17-ship-designer"><div class="v17-sectionhead"><h3>Чертёжная мастерская · процедурные 3D-корпуса</h3><small>Изменение проекта не добавляет корабли бесплатно. Для постройки потребуются исследования, верфь, материалы и орудия.</small></div><div class="v17-design-grid"><div class="v17-canvas-shell"><canvas id="v17-preview" width="880" height="400"></canvas><div class="v17-overprint">Вращайте модель мышью · колесо — масштаб · параметры корпуса сохраняются в чертеже</div></div><div class="v17-design-controls"><h3>${d?esc(d.name):'Нет проекта'}</h3>${!d?`<div class="v17-note">Для чертежа нужен назначенный министр кораблестроения, достаточное образование и исследования корпуса. <button onclick="v15Close();tab='court';drawAll()">Открыть государственный совет</button></div>`:''}<select onchange="v17SelectBlueprint(+this.value)">${selection||'<option>Проектов нет</option>'}</select><div class="v17-buttonrow"><button onclick="v17CreateBlueprint('sloop')">+ Шлюп</button><button onclick="v17CreateBlueprint('frigate')">+ Фрегат</button><button onclick="v17CreateBlueprint('line')">+ Линейный</button></div><button class="v15-main" ${!d?'disabled':''} onclick="v17RandomizeBlueprint()">Новый вариант обводов и украшений</button>${st?`<div class="v17-mod"><span>Орудия на чертеже</span><b>${st.guns}</b></div><div class="v17-mod"><span>Расчётная скорость</span><b>${st.speed?.toFixed(1)||'—'} уз.</b></div><div class="v17-mod"><span>Экипаж</span><b>${st.crewMax||'—'}</b></div><div class="v17-mod"><span>Вариант корпуса</span><b>#${d.modelSeed||0}</b></div><div class="v17-mod"><span>Стоимость</span><b>${st.gold||'—'} ◈</b></div>`:''}<div class="v17-note">Изменение художественного варианта корпуса само по себе не меняет боевые характеристики. Их определяют чертёж батарей, технологии, материалы и экипаж.</div></div></div></section>`}

function v17AdmiralCard(){const fl=s.fleets.find(x=>x.f===s.player),ad=V6_ADMIRALS[fl?.admiral??0];if(!fl||!ad)return '';const portrait=v15Portrait(ad.name,'Адмирал');return `<section class="v17-admiral"><img src="${portrait}" alt="Портрет адмирала"><div><small>Командование действующей эскадрой</small><h3>${esc(ad.name)}</h3><b>${esc(fl.name)}</b><div class="v17-admiralmods">${Object.entries(ad.mod||{}).map(([k,v])=>`<div class="v17-mod"><span>${BONUS_NAMES[k]||k}</span><b>${v<1?'−':'+'}${Math.round(Math.abs(v-1)*100)}%</b></div>`).join('')}</div></div></section>`}

function v18ShipTrain(shipId,skill){const f=s.player,sh=s.ships.find(x=>x.id===shipId&&x.f===f),v=v18State();if(!sh)return;
 if(!['sailing','gunnery','boarding'].includes(skill))return;
 if(v.projects.some(x=>x.kind==='crew'&&x.shipId===shipId))return say('Этот экипаж уже проходит обучение');
 if(sh.port==null||!N[sh.port]||s.provinces[sh.port].owner!==f)return say('Учения требуют дружественного порта');
 const gold=skill==='gunnery'?48:35,food=skill==='boarding'?8:5,powder=skill==='gunnery'?4:1;
 if(s.gold[f]<gold||s.food[f]<food||(s.equipment[f].gunpowder||0)<powder)return say('Недостаточно денег, пороха или провианта');
 s.gold[f]-=gold;s.food[f]-=food;s.equipment[f].gunpowder-=powder;
 v.projects.push({id:++v.next,kind:'crew',shipId,skill,remaining:24,f});log(`${sh.name}: начаты учения экипажа (${skill}, 24 дня).`);v15Render();drawAll();}

function v20ShipMod(sh,k){return (v20ModsFor(sh?.design)[k]||1)*globalMod(sh?.f??s.player,k)}

function v20ShipOrganization(fleet){if(!fleet)return {value:0,delay:99,hold:0,formation:'line'};const ships=v8shipsOf(fleet);if(!ships.length)return {value:0,delay:99,hold:0,formation:fleet.formation||'line'};const n=ships.length,formation=fleet.formation||'line',fm=V20_FORMATIONS[formation]||V20_FORMATIONS.line;
 const crewAvg=ships.reduce((a,x)=>a+Math.min(1,x.crew/Math.max(1,x.crewMax)),0)/n;
 const trainAvg=ships.reduce((a,x)=>a+((x.crewSkills?.sailing||x.crewSkills?.gunnery||x.experience||20)),0)/n;
 const sizePenalty=Math.min(.35,Math.max(0,n-4)*.023),morale=Math.min(100,fleet.seaMorale??83)/100;
 const cohesion=ships.reduce((sum,sh)=>sum*v20ShipMod(sh,'formationHold'),1)**(1/n);
 const commands=ships.reduce((sum,sh)=>sum*v20ShipMod(sh,'commandDelay'),1)**(1/n);
 const adm=fleet.admiral!=null?1.08:1;
 const hold=Math.max(.3,Math.min(1.7,(.35+trainAvg*.005+crewAvg*.27)*fm.cohesion*cohesion*adm*(1-sizePenalty)*(.65+morale*.35)));
 const value=Math.max(1,Math.min(100,Math.round(hold*79)));
 const delay=+Math.max(1.0,Math.min(15,5.9/hold*commands)).toFixed(1);
 return {value,delay,hold,formation,ships:n,train:Math.round(trainAvg)};
}

function v20FleetFormat(id,form){let fl=s.fleets.find(x=>x.id===id&&x.f===s.player);if(!fl||!V20_FORMATIONS[form])return;fl.formation=form;log(`Эскадра «${fl.name}» перешла на построение «${V20_FORMATIONS[form].name}».`);drawAll();v8Refresh(false)}

function v20FleetPanel(){const fleets=s.fleets.filter(x=>x.f===s.player);return `<section class="v20-panel"><h3>Боевой порядок и управление эскадрами</h3><p>Скорость сохраняется отдельно для каждого корабля. Организация влияет на задержку приказов и устойчивость к нарушению линии.</p>${fleets.map(fl=>{const o=v20ShipOrganization(fl);return `<div class="v20-squadrow"><div><b>${esc(fl.name)}</b><small>${o.ships} кораблей · обучение ${o.train}% · организация ${o.value}/100</small><div class="v20-bar"><i style="width:${o.value}%"></i></div></div><div><span>Задержка приказа <strong>${o.delay} с</strong></span><select onchange="v20FleetFormat(${fl.id},this.value)">${Object.entries(V20_FORMATIONS).map(([k,v])=>`<option value="${k}" ${o.formation===k?'selected':''}>${v.name}</option>`).join('')}</select></div><button onclick="v20TacticalDrill(${fl.id})">Тактическая 3D-сцена</button></div>`}).join('')||'<p>Сначала сформируйте эскадру и назначьте в неё корабли.</p>'}</section>`}

function v20VesselSpeed(sh){const st=v6designStats({...sh.design,f:sh.f});const sail=sh.crewSkills?.sailing??sh.experience??20;return Math.max(2,(st.speed||8.5)*(sh.hp/Math.max(1,sh.maxHp))**.32*(.72+.28*sh.crew/Math.max(1,sh.crewMax))*(.86+sail*.0014));}

function v20StartContact(){if(!s)return;const v=V20_STATE();if(!v.contact)return;const contact=v.contact,ours=s.fleets.find(x=>x.id===contact.ours),theirs=s.fleets.find(x=>x.id===contact.theirs);if(!ours||!theirs||!v8shipsOf(ours).length||!v8shipsOf(theirs).length){v.contact=null;return say('Контакт потерян')};if(!withWar(ours.f,theirs.f))return say('Для атаки нейтральной эскадры сначала требуется объявить войну.');v.contact=null;v20ContactOverlay();v8Open3DBattle('sea',true,{fleet:ours,enemyFleet:theirs,openSea:true,to:theirs.port,contactId:contact.id});}

function v20IgnoreContact(){const state=V20_STATE();const c=state.contact;if(c){state.seen[c.id]=(s.year||1700)*400+(s.month||1)*31+(s.day||1)+30;state.contact=null;v20ContactOverlay();}}

function v20ContactOverlay(){let el=document.getElementById('v20-alert');if(!el){el=document.createElement('div');el.id='v20-alert';document.body.appendChild(el)}const c=s?.v20?.contact;if(!c){el.classList.remove('visible');el.innerHTML='';return;}const ours=s.fleets.find(x=>x.id===c.ours),theirs=s.fleets.find(x=>x.id===c.theirs);if(!ours||!theirs){el.classList.remove('visible');return}const war=withWar(ours.f,theirs.f);el.innerHTML=`<div class="v20-alert-top"><strong>⚑ Обнаружена эскадра</strong><button onclick="v20IgnoreContact()">✕</button></div><div class="v20-contacts"><div><b>${esc(ours.name)}</b><span>${v8shipsOf(ours).length} корабля · организация ${v20ShipOrganization(ours).value}%</span></div><span>≈</span><div><b>${esc(theirs.name)}</b><span>${v8shipsOf(theirs).length} корабля · ${war?'ВРАГ':'нейтралитет'}</span></div></div><p>Морской контакт у ${esc(N[c.coast]?.name||'побережья')}. Время остановлено, доступен тактический переход.</p><div class="v20-alert-actions"><button onclick="v20IgnoreContact()">Продолжить маршрут</button><button onclick="v20StartContact()" ${war?'':'disabled'}>Командовать боем — 3D</button></div>`;el.classList.add('visible')}

function v20ScanContact(){const v=V20_STATE();if(!v||v.contact)return;const orders=v8get().seaOrders.filter(o=>o.f===s.player&&o.remaining>0);if(!orders.length)return;const now=(s.year||1700)*400+(s.month||1)*31+(s.day||1);const rivals=s.fleets.filter(x=>x.f!==s.player&&x.port!=null&&v8shipsOf(x).length>0);for(const o of orders){const player=s.fleets.find(x=>x.id===o.fleetId);if(!player||!v8shipsOf(player).length||!o.position)continue;const skill=v20ShipOrganization(player);for(const other of rivals){const pt=N[other.port];if(!pt)continue;const d=Math.hypot(o.position.x-pt.x,o.position.y-pt.y),spotMod=v8shipsOf(player).reduce((p,sh)=>p*v20ShipMod(sh,'spotting'),1)**(1/Math.max(1,v8shipsOf(player).length));if(d>26*spotMod*(.6+skill.value/130))continue;let id=[player.id,other.id].join('/');if((v.seen[id]||0)>now)continue;v.contact={id,ours:player.id,theirs:other.id,coast:other.port};pauseGame();v20ContactOverlay();log(`Наблюдатели эскадры «${player.name}» обнаружили суда государства ${F[other.f].name}.`);return;}}}

function v20TacticalDrill(id){const fleet=s.fleets.find(x=>x.id===id&&x.f===s.player);if(!fleet||!v8shipsOf(fleet).length)return say('Для учений нужны реальные корабли в эскадре');v8Open3DBattle('sea',false,{fleet,drill:true});}

function v20BeachLanding(){const b=v8Battle?.v20,fl=b?.squadron,to=b?.coast;if(!b||!fl||!fl.embarked?.length||to==null)return say('Для высадки нужны транспорты с полками и участок побережья');if(!N[to]?.port)return say('Нет доступного берегового района');if(!withWar(fl.f,s.provinces[to].owner))return say('Высадка на нейтральный берег требует отдельного дипломатического разрешения');if(b.landed)return say('Десант уже высажен');b.landed=true;v8amphibiousAssault(fl,to);v20BattleHud();say(`Десантная операция у ${N[to].name}: результат внесён в кампанию`)}

function v21ShipFatigue(sh){return Math.min(100,Math.max(0,sh?.v21Fatigue||0))}

function v21TrainFleet(id){const fl=s.fleets.find(x=>x.id===id&&x.f===s.player);if(!fl||!v8shipsOf(fl).length)return say('Необходима действующая эскадра');
 const st=V21_STATE();if(st.drills.some(x=>x.fleetId===id))return say('Эскадра уже на учениях');
 if(fl.port==null)return say('Сначала верните эскадру в порт для учебного выхода');
 if(s.gold[s.player]<48||s.food[s.player]<10||(s.equipment[s.player]?.gunpowder||0)<4)return say('Учения: 48 монет, 10 провианта и 4 пороха');
 s.gold[s.player]-=48;s.food[s.player]-=10;s.equipment[s.player].gunpowder-=4;
 st.drills.push({fleetId:id,days:18});log(`Эскадра «${fl.name}»: начаты 18-дневные учения передачи сигналов.`);drawAll();
}

function v21FleetCards(){const f=s.player,st=V21_STATE();return `<section class="v21-panel"><h3>Сигнальная служба и боеготовность</h3><p>Каждый корабль сохраняет собственную скорость. Подготовка, усталость и оборудование влияют на получение приказов и удержание позиции.</p><div class="v21-grid">${s.fleets.filter(fl=>fl.f===f&&v8shipsOf(fl).length).map(fl=>{const o=v20ShipOrganization(fl),training=st.drills.find(x=>x.fleetId===fl.id);return `<div class="v21-fleet"><b>${esc(fl.name)}</b><small>${o.ships} кораблей · задержка ${o.delay} с</small><div class="v21-meter"><span>Организация</span><i><u style="width:${o.value}%"></u></i><strong>${o.value}%</strong></div><div class="v21-meter"><span>Передача сигналов</span><i><u style="width:${o.reliability}%"></u></i><strong>${o.reliability}%</strong></div><div class="v21-meter"><span>Усталость</span><i><u style="width:${o.fatigue}%;background:#c67f5c"></u></i><strong>${o.fatigue}%</strong></div><button ${training?'disabled':''} onclick="v21TrainFleet(${fl.id})">${training?'Учения · '+training.days+' дн.':'18 дней: учения сигналов'}</button></div>`}).join('')||'<div class="mini">Сначала сформируйте эскадру.</div>'}</div></section>`}

function v22RefitShip(id,key){const ship=s.ships.find(sh=>sh.id===id&&sh.f===s.player),item=V20_MODULES[key];if(!ship||!item)return say('Корабль или модуль недоступен');
 const fl=s.fleets.find(x=>x.id===ship.fleetId);
 if(!fl||fl.port==null||s.provinces[fl.port]?.owner!==s.player)return say('Корабль должен находиться в собственном порту');
 if(!has(s.player,item.tech))return say('Сначала изучите модуль');
 if((s.equipment[s.player]?.[key]||0)<1)return say('На складе нет комплекта: поставьте его на производственную линию');
 const q=v22State().refits;if(q.some(x=>x.shipId===id))return say('Корабль уже модернизируется');
 if(s.gold[s.player]<28||s.wood[s.player]<5||s.iron[s.player]<2)return say('Недостаточно ресурсов: 28 монет, 5 древесины и 2 железа');
 if(ship.design?.modules?.[item.slot]===key)return say('Модуль уже установлен');
 s.gold[s.player]-=28;s.wood[s.player]-=5;s.iron[s.player]-=2;s.equipment[s.player][key]--;
 q.push({shipId:id,key,slot:item.slot,remaining:14,total:14,port:fl.port});
 log(`${ship.name}: начата 14-дневная модернизация — ${item.name}.`);v15Render();drawAll();
}

function v23OrganicPolygon(path){
 return path.split(/\s*Z\s*/).filter(part=>part.trim()).map(ring=>{
  const points=[...ring.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/g)].map(m=>[+m[1],+m[2]]);
  if(points.length<3)return ring+' Z';
  const fmt=p=>p[0].toFixed(2)+','+p[1].toFixed(2);
  let d='M'+fmt(points[0]);
  for(let i=1;i<points.length;i++){let a=points[i-1],b=points[i],c=v23CurveControl(a,b);d+=' Q'+fmt(c)+' '+fmt(b)}
  const last=points[points.length-1],first=points[0];
  if(Math.hypot(last[0]-first[0],last[1]-first[1])>.1){let c=v23CurveControl(last,first);d+=' Q'+fmt(c)+' '+fmt(first)}
  return d+' Z';
 }).join(' ')
}

function v24Research(){
 const el=document.getElementById('v24-research');if(!el||!s)return;
 const f=s.player,cats=[...new Set(TECH.map(t=>t.cat))];v24Category ||= cats.find(c=>c==='Флот')||cats[0];
 let pool=TECH.filter(t=>v24Query?(t.name+' '+t.cat).toLowerCase().includes(v24Query.toLowerCase()):t.cat===v24Category);
 let t=TECH.find(t=>t.id===v24TechId);if(!t||!pool.includes(t)){t=pool.find(t=>!has(f,t.id)&&techAccessible(f,t))||pool[0];v24TechId=t?.id}
 const cur=s.research[f];
 const depth=(t,seen=new Set())=>{if(seen.has(t.id))return 0;const next=new Set(seen);next.add(t.id);return Math.min(5,1+Math.max(-1,...(t.req||[]).map(id=>{const p=TECH.find(x=>x.id===id);return p?depth(p,next):-1})));};
 const tiers=[...new Set(pool.map(x=>depth(x)))].sort((a,b)=>a-b);
 el.innerHTML=`<header class="v24-title"><div><small>КОРОЛЕВСКАЯ АКАДЕМИЯ</small><h2>Исследования</h2></div><button onclick="v24Panel('map')" aria-label="Закрыть исследования">✕</button></header><div class="v24-academy-status">${cur?'В работе: '+esc(TECH.find(x=>x.id===cur.id)?.name||cur.id)+' · '+Math.ceil(cur.remaining)+' дн.':'Выберите новое исследование'}<span>Образование ${edu(f).toFixed(1)} · изучено ${s.tech[f].length}/${TECH.length}</span></div><div class="v24-research-tools"><select aria-label="Отрасль исследований" onchange="v24TechCategory(this.value)">${cats.map(c=>`<option ${c===v24Category?'selected':''}>${esc(c)}</option>`).join('')}</select><input aria-label="Поиск технологий" placeholder="Поиск технологий…" value="${esc(v24Query)}" onchange="v24Query=this.value;v24TechId=null;v24Research()"></div><div class="v24-research-body"><div class="v24-tech-scroll">${pool.length?tiers.map(d=>`<section class="v24-tier"><h3>Ступень ${d+1}</h3><div class="v24-tier-grid">${pool.filter(x=>depth(x)===d).map(x=>`<button class="v24-tech ${x.id===t?.id?'selected':''} ${has(f,x.id)?'done':techAccessible(f,x)?'available':'locked'}" onclick="v24TechSelect('${x.id}')"><img src="${v19TechPicture(x)}" alt=""><b>${esc(x.name)}</b><small>${has(f,x.id)?'✓ Изучено':cur?.id===x.id?'◷ В работе':researchDays(x,f)+' дней'}</small></button>`).join('')}</div></section>`).join(''):'<p class="v24-empty">По этому запросу технологий нет.</p>'}</div><aside class="v24-tech-detail">${t?v24TechDetail(t):''}</aside></div>`;
}

function v26Station(u,lead,idx,gap,hold,f){const q=lead.angle,des=[lead.pos[0]-Math.cos(q)*gap*idx,lead.pos[1]-Math.sin(q)*gap*idx],dx=des[0]-u.pos[0],dy=des[1]-u.pos[1],forward=dx*Math.cos(q)+dy*Math.sin(q),cross=-dx*Math.sin(q)+dy*Math.cos(q);const precision=globalMod(f,'stationPrecision');u.desiredHeading=q+Math.atan2(cross*hold*precision,Math.max(gap,Math.abs(forward)+gap));return Math.max(.45,Math.min(1.15,(lead.actualSpeed||lead.knots||8)/Math.max(1,u.knots||8)+forward*.025))}

function v27Wind(sc=V8_SCENE){if(!sc)return {from:0,force:1};if(!sc.v27Wind){const seed=v15Hash((s.year||1700)+'/'+s.month+'/'+s.day+'/'+(v8Battle?.context?.to??0));sc.v27Wind={from:(seed%360)*Math.PI/180,force:.85+(seed%31)/100}}return sc.v27Wind}

function v27Polar(angle,from,close=1){const a=Math.abs(Math.atan2(Math.sin(angle-from),Math.cos(angle-from)));if(a<Math.PI/6)return .12;if(a<Math.PI/2)return Math.min(1.06,(.28+(a-Math.PI/6)/(Math.PI/3)*.72)*close);return 1-.18*(a-Math.PI/2)/(Math.PI/2)}

function v27Sailing(u,real){const w=v27Wind(),close=real?v20ShipMod(real,'closeHaul'):1;const factor=v27Polar(u.angle,w.from,close)*w.force;u.v27WindFactor=factor;return factor}
