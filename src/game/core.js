// core — function declarations; initialized by ordered scripts.
function nationalMod(f,k){return NATIONAL[f]?.mods[k]??1}

function adviserMod(f,k){let v=1;for(let id of s?.advisers?.[f]||[]){const a=ADVISERS.find(a=>a.id===id);if(a?.mods[k]!==undefined)v*=a.mods[k]}return v}

function globalMod(f,k){return nationalMod(f,k)*adviserMod(f,k)}

function bonusLine(k,v){let val=k==='stability'?`+${v} пунктов`:`${v>=1?'+':'−'}${Math.round(Math.abs(v-1)*100)}%`;return `${BONUS_NAMES[k]||k}: ${val}`}

function hireAdviser(id){let a=ADVISERS.find(x=>x.id===id),f=s.player;if(!a)return;let x=s.advisers[f];if(x.includes(id)){x.splice(x.indexOf(id),1);log(`${a.name} отправлен в отставку.`)}else{if(x.length>=3)return say('Одновременно можно назначить только трёх советников');if(!spend(cost(a.money)))return;x.push(id);if(a.mods.stability)s.stability[f]=clamp(s.stability[f]+a.mods.stability,0,100);log(`${a.name} назначен советником двора.`)}drawAll()}

function cannonBest(f,key){let upper=key==='sloop'?6:key==='frigate'?18:42;let min=key==='line'?12:key==='frigate'?6:4;return [...CANNONS].reverse().find(c=>c.lb<=upper&&c.lb>=min&&has(f,c.id))||CANNONS.find(c=>c.lb===min)}

function advisorsQuarter(f){let salary=(s.advisers?.[f]||[]).reduce((a,id)=>a+(ADVISERS.find(z=>z.id===id)?.salary||0),0);s.gold[f]-=salary;return salary}

function say(text){let node=$('toast');node.textContent=text;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2600)}

function log(msg){s.log.unshift({turn:s.turn,year:s.year,season:s.season,month:s.month,day:s.day,msg});s.log=s.log.slice(0,75)}

function cost(g=0,f=0,t=0,i=0){return {gold:g,food:f,wood:t,iron:i}}

function affordable(c,f=s.player){return s.gold[f]>=c.gold&&s.food[f]>=c.food&&s.wood[f]>=c.wood&&s.iron[f]>=c.iron}

function spend(c,f=s.player){if(!affordable(c,f)){say('Недостаточно средств или ресурсов');return false} s.gold[f]-=c.gold;s.food[f]-=c.food;s.wood[f]-=c.wood;s.iron[f]-=c.iron;return true}

function fresh(f=0){mapSignature='';s={v:5,player:f,year:YEAR0,month:1,day:1,season:0,turn:0,orders:[],production:[],orderSeq:0,gold:F.map((_,i)=>i===f?460:250),food:F.map(()=>220),wood:F.map(()=>145),iron:F.map(()=>95),prestige:F.map(()=>0),stability:F.map(()=>77),exhaustion:F.map(()=>0),tax:F.map(()=>1),legitimacy:F.map(()=>70),relations:F.map((_,i)=>F.map((_,j)=>i===j?100:(i+j)%4===0?-25:3)),tech:F.map(()=>[]),research:F.map(()=>null),wars:[],warStart:{},allies:[],treaties:[],spy:F.map(()=>F.map(()=>0)),blockades:[],provinces:N.map(provinceInit),education:F.map((_,i)=>i===0?38:i===4?42:i===17?39:i===10?25:25),advisers:F.map(()=>[]),log:[],action:3,ended:false,finance:{income:0,expense:0,grain:0,wood:0,iron:0},seed:Math.floor(Math.random()*99999)};F.forEach((f,i)=>{let cap=CAP[i];if(cap>=0&&s.provinces[cap].owner===i){s.provinces[cap].inf+=2;s.provinces[cap].fort=1;s.provinces[cap].market=1;s.provinces[cap].dock=N[cap].port?1:0}});selected=CAP[s.player]>=0?CAP[s.player]:0;mission=null;tab='province';mode='political';log('1 января 1700 года. Государства Европы ожидают приказов. Время остановлено.');isPlaying=false;drawAll();closeModal();drawClock()}

function save(){try{localStorage.setItem('empire_of_sails_v5_save',JSON.stringify(s));say('Кампания сохранена в этом браузере')}catch(e){say('Локальное сохранение недоступно — экспортируйте файл кампании')}}

function load(){try{let raw=JSON.parse(localStorage.getItem('empire_of_sails_v5_save')||'null');if(!raw)throw Error('Сохранение не найдено');restoreSave(raw);say('Кампания загружена') }catch(e){showModal(`<h2>Не удалось загрузить</h2><p>${esc(e.message)}</p><button onclick="closeModal()">Понятно</button>`)}}

function newGame(){showModal(`<h2>⚜ Начало новой кампании</h2><p>Детальная карта Европы, 1700 год, свыше 3300 игровых провинций. Выберите державу, измените историю через торговлю, реформы, войны и военно-морское господство.</p><p class="mini">На карте ${N.length} игровых регионов, ${F.length} государств, ${TECH.length} технологий. Административные границы и владения приблизительны, сюжет — альтернативная история.</p><div class="cols"><div><label>Выберите державу</label><select id="startingRealm">${F.map((f,i)=>`<option value="${i}" ${i===0?'selected':''}>${esc(f.name)}</option>`).join('')}</select></div><div><label>Специализация</label><div class="slot" id="startTrait">${esc(F[0].style)}</div></div></div><div class="buttonrow"><button class="main wide" id="goStart">Начать кампанию ⟶</button><button class="ghost wide" onclick="closeModal()">Вернуться к карте</button></div>`);$('startingRealm').onchange=e=>$('startTrait').textContent=F[+e.target.value].style;$('goStart').onclick=()=>{fresh(+$('startingRealm').value);saveQuiet()}}

function button(text,cmd,disabled=false,extra=''){return `<button ${disabled?'disabled':''} onclick="${cmd}" ${extra}>${text}</button>`}

function affordBtn(text,cmd,c,ok=true){return button(`${text}<br><small>${price(c)}</small>`,cmd,!ok||!affordable(c))}

function beginMission(t){const p=s.provinces[selected];if(!own(selected))return;if(t==='army'&&(armies(p)<=1||p.move))return say('Нужны войска, ещё не совершавшие марш');if(['fleet','blockade','landing'].includes(t)&&(!N[selected].port||vessels(p)<1||p.seaMove))return say('В порту должен находиться готовый флот');if(t==='landing'&&armies(p)<2)return say('Для десанта нужны полки');mission={type:t,from:selected};tab=t==='army'||t==='landing'?'army':'fleet';say('Выберите провинцию назначения на карте');drawAll()}

function construct(k){let n=N[selected],p=s.provinces[selected],b=BUILD[k];if(!own(selected)||!b||p.build)return say('В этой провинции уже ведётся строительство');if(k==='dock'&&!n.port)return say('Внутренняя провинция не имеет верфи');if(p[k]>=(['fort','road','depot','dock'].includes(k)?3:5))return say('Достигнут предел улучшения');if(!spend(b.cost))return;p[k]++;p.build=1;log(`${n.name}: завершено строительство — ${b.label.toLowerCase()}.`);drawAll()}

function defendersVisible(i){return own(i)||s.spy[s.player][s.provinces[i].owner]>s.turn||N[i].adj.some(x=>own(x))}

function battleText(label,from,to,attack,defend,lossA,lossD,won){return `<h2>⚔ ${esc(label)}</h2><p>${esc(N[from].name)} → ${esc(N[to].name)}</p><div class="cols"><div class="slot"><b>Атакующая сторона</b><div class="kv"><span>Мощь</span><b>${attack.toFixed(1)}</b></div><div class="kv"><span>Потери</span><b>${lossA}</b></div></div><div class="slot"><b>Обороняющаяся сторона</b><div class="kv"><span>Мощь</span><b>${defend.toFixed(1)}</b></div><div class="kv"><span>Потери</span><b>${lossD}</b></div></div></div><p style="color:${won?'#b6e3c5':'#efaa9d'}">${won?'Позиции противника захвачены.':'Наступление отбито, части отступили.'}</p><button class="main" onclick="closeModal()">Продолжить</button>`}

function march(from,to){let a=s.provinces[from],b=s.provinces[to],f=s.player;
 if(!own(from)||!N[from].adj.includes(to))return say('Марш возможен лишь в соседнюю сухопутную провинцию');
 if(b.owner!==f&&!withWar(f,b.owner))return say('Для наступления необходимо объявить войну');
 if(armies(a)<=1)return say('Для выхода нужен гарнизон хотя бы из двух полков');
 let force=detachLand(a);if(armies(force)<1)return say('Нет войск для марша');
 let duration=travelDays(from,to,force,f);let order={id:++s.orderSeq,kind:'army',f,from,to,force,remaining:duration,total:duration};s.orders.push(order);
 log(`➤ Приказ на марш: ${N[from].name} → ${N[to].name}, ${armies(force)} полк(ов), прибытие через ${duration} дн.`);
 drawAll()
}

function blockade(from,to){const a=s.provinces[from],b=s.provinces[to];if(!own(from)||!vessels(a)||!canSail(from,to)||!N[to].port||!withWar(s.player,b.owner))return say('Для блокады нужен флот и вражеский порт в зоне дальности');if(navalPower(a,s.player)<navalPower(b,b.owner)*1.2)return say('Вражеская эскадра сильнее: блокада невозможна');if(s.blockades.some(x=>x.from===from&&x.to===to))return say('Этот порт уже блокирован');s.blockades.push({from,to,owner:s.player});a.seaMove=1;log(`⚓ Морская блокада порта ${N[to].name}.`);drawAll()}

function dip(op){const f=s.player,t=dipTarget;if(f===t)return;const base=has(f,'diplomacy')?25:35;if(op==='improve'){if(s.action<1||!spend(cost(base)))return;s.action--;s.relations[f][t]=clamp(s.relations[f][t]+25,-100,100);s.relations[t][f]=clamp(s.relations[t][f]+15,-100,100);log(`Отправлено посольство: отношения с «${F[t].name}» улучшены.`)}else if(op==='war'){if(withAlliance(f,t))return say('Прежде необходимо расторгнуть союз');if(withWar(f,t))return say('Война уже идёт');if(s.action<2)return say('Объявление войны требует 2 дипломатических приказа');s.action-=2;s.wars.push(code(f,t));s.warStart[code(f,t)]=s.turn;s.relations[f][t]=-100;s.relations[t][f]=-100;s.stability[f]=clamp(s.stability[f]-3,0,100);log(`⚔ ${F[f].name} объявила войну державе «${F[t].name}».`)}else if(op==='peace'){if(!withWar(f,t))return say('Между странами нет войны');if(s.action<1)return say('Нет дипломатических приказов');let ours=regOf(f).length, theirs=regOf(t).length,ok=s.exhaustion[t]>14||s.exhaustion[f]>20||ours>theirs*.9||s.relations[f][t]>10;if(!ok){log(`${F[t].name} отклонила предложение о мире.`)}else{s.wars=s.wars.filter(x=>x!==code(f,t));delete s.warStart[code(f,t)];s.exhaustion[f]=Math.max(0,s.exhaustion[f]-16);s.exhaustion[t]=Math.max(0,s.exhaustion[t]-16);log(`Подписан мирный договор с «${F[t].name}».`)}s.action--}else if(op==='alliance'){if(withWar(f,t))return say('Нельзя заключить союз во время войны');if(withAlliance(f,t)){s.allies=s.allies.filter(x=>x!==code(f,t));log(`Союз с «${F[t].name}» расторгнут.`)}else{if(s.relations[f][t]<35)return say('Для союза необходимы отношения не ниже +35');s.allies.push(code(f,t));log(`С «${F[t].name}» заключён союз.`)}s.action=Math.max(0,s.action-1)}else if(op==='trade'){if(withWar(f,t))return say('Невозможно торговать с врагом');if(withTrade(f,t)){s.treaties=s.treaties.filter(x=>x!==code(f,t));log(`Торговый договор с «${F[t].name}» расторгнут.`)}else{if(s.relations[f][t]<0)return say('Для торговли нужны нейтральные или добрые отношения');s.treaties.push(code(f,t));log(`Заключён торговый договор с «${F[t].name}».`)}s.action=Math.max(0,s.action-1)}else if(op==='spy'){if(s.action<1||!spend(cost(50)))return;s.action--;s.spy[f][t]=s.turn+5;log(`Торговые агенты изучили расположение войск державы «${F[t].name}».`)}else if(op==='gift'){if(s.action<1||!spend(cost(80)))return;s.action--;s.relations[f][t]=clamp(s.relations[f][t]+35,-100,100);log(`Отправлены дары ко двору «${F[t].name}».`)}drawAll()}

function setTaxes(k){s.tax[s.player]=k;log(`Установлена налоговая политика: ${['низкие','обычные','высокие'][k]} налоги.`);drawAll()}

function court(op){let f=s.player;if(op==='festival'){if(!spend(cost(120)))return;s.stability[f]=clamp(s.stability[f]+9,0,100);s.legitimacy[f]=clamp(s.legitimacy[f]+4,0,100);log('Празднества и благотворительность успокоили города.')}else if(op==='reform'){if(s.action<1||!spend(cost(180)))return;s.action--;s.stability[f]=clamp(s.stability[f]+5,0,100);s.prestige[f]+=8;log('Государственная реформа укрепляет престиж двора.')}else if(op==='levy'){if(s.stability[f]<25)return say('Народное доверие слишком низкое');s.gold[f]+=210;s.stability[f]=clamp(s.stability[f]-11,0,100);regOf(f).forEach(({p})=>p.unrest=clamp(p.unrest+8,0,100));log('Введён чрезвычайный сбор для казны.')}else if(op==='tradeMission'){let ships=regOf(f).reduce((a,{p})=>a+p.sloop+p.frigate,0),ports=regOf(f).filter(({i})=>N[i].port).length;if(!ships||!ports)return say('Нужны торговые суда в собственных портах');if(s.action<1)return say('Нет свободных государственных приказов');s.action--;let reward=Math.round((ships*7+ports*3)*(has(f,'trade')?1.35:1)*(has(f,'insurance')?1.2:1));s.gold[f]+=reward;s.prestige[f]+=1;log(`Торговый рейс принёс ${reward} монет казне.`)}drawAll()}

function maintenance(f){let salary=advisorsQuarter(f);let ps=regOf(f),rev=0,expense=salary,grain=0,wood=0,iron=0;let blockadeSet=new Set(s.blockades.filter(x=>x.owner!==f).map(x=>x.to));for(let {p,i} of ps){let region=N[i];let base=region.income*(s.tax[f]===0?.76:s.tax[f]===2?1.55:1)*(has(f,'cadastre')?1.14:1);let infra=p.workshop*(has(f,'manufactory')?12:9)+p.market*(has(f,'banking')?9:7)+p.dock*2+p.road*(has(f,'roads')?2:1)+p.workshop*(has(f,'textile')?5:0)+p.market*(has(f,'mercantilism')?4:0);let trade=s.treaties.filter(x=>x.split(':').map(Number).includes(f)).length*p.market*(has(f,'insurance')?4:3)*(has(f,'convoys')?1.19:1);let riotFactor=1-p.unrest/165;let stabilityFactor=.65+s.stability[f]/250;let block=blockadeSet.has(i)?0.55:1;let speciality=(F[f].trait==='merchant'?1.08:F[f].trait==='trade'?1.05:1)*globalMod(f,'trade');rev+=(base+infra*globalMod(f,'industry')+trade)*riotFactor*stabilityFactor*block*speciality*(has(f,'centralbank')?1.12:1);grain+=region.pop*1.5+p.farm*(has(f,'enclosure')?20:has(f,'cropcycle')?17:has(f,'agriculture')?13:9);wood+=((region.terrain==='taiga'||region.terrain==='mountain')?3:1)*(region.econWeight||1)+p.dock*(region.port?1:0);iron+=p.workshop*(has(f,'manufactory')?7:5)+((region.terrain==='mountain'||region.terrain==='hills')?2:1)*(has(f,'mining')?2:1)*(region.econWeight||1);expense+=p.inf*1.8+p.cav*3.1+p.art*4+p.sloop*3.1+p.frigate*7.5+p.line*15;for(let [uk,uq] of Object.entries(armyUnits(p)))expense+=uq*(REGIMENTS[uk]?.supply||1.5)*1.7;let r=(s.tax[f]===2?4:s.tax[f]===0?-2:0)+(s.stability[f]<40?3:0)+(p.owner!==region.owner?1:0)-(has(f,'civilservice')?2:0)-p.market; p.unrest=clamp(p.unrest+r+(p.unrest>45?1:-1),0,100);if(p.unrest>80&&Math.random()<.12){if(p.inf>1)p.inf--;if(f===s.player)log(`В ${region.name} вспыхнули беспорядки: гарнизон понёс потери.`)}if(p.owner!==region.owner&&!p.depot&&!p.road&&!region.port&&!N[i].adj.some(j=>s.provinces[j].owner===f)){p.morale=clamp(p.morale-8,15,100);if(Math.random()<.13&&p.inf>1)p.inf--;}p.build=0;p.move=0;p.seaMove=0;p.morale=clamp(p.morale+5,20,100)}let consumption=ps.reduce((sum,{p})=>sum+p.inf*1.28+p.cav*1.9+p.art*1.5+Object.entries(armyUnits(p)).reduce((a,[k,q])=>a+q*(REGIMENTS[k]?.supply||1.4),0),0)*(has(f,'logistics')?.82:1)*(has(f,'fieldcarts')?.9:1)*(has(f,'quartermasters')?.86:1);grain-=consumption;let winter=s.season===3;if(winter)grain*=.7;s.gold[f]+=Math.floor(rev-expense);s.food[f]+=Math.floor(grain);s.wood[f]+=Math.floor(wood);s.iron[f]+=Math.floor(iron);let cap=350+ps.length*40;if(!has(f,'grainstore')&&s.food[f]>cap)s.food[f]=Math.round(cap+(s.food[f]-cap)*.4);if(s.food[f]<0){let bad=Math.abs(s.food[f]);s.food[f]=0;s.stability[f]=clamp(s.stability[f]-3,0,100);for(let {p} of ps)if(p.inf>1&&Math.random()<.14)p.inf--;if(f===s.player)log(`⚠ Голод и нехватка провианта. Дефицит: ${bad} единиц.`)}if(s.gold[f]<-200){s.gold[f]=-200;s.stability[f]=clamp(s.stability[f]-4,0,100);if(f===s.player)log('⚠ Казна истощена. Финансовый кризис подрывает доверие к власти.')}if(s.tax[f]===0)s.stability[f]=clamp(s.stability[f]+1,0,100);if(s.tax[f]===2)s.stability[f]=clamp(s.stability[f]-1,0,100);if(s.exhaustion[f]>0)s.exhaustion[f]=clamp(s.exhaustion[f]-(!s.wars.some(x=>x.split(':').includes(String(f)))?4:1),0,100);if(f===s.player)s.finance={income:Math.floor(rev),expense:Math.floor(expense),grain:Math.floor(grain),wood:Math.floor(wood),iron:Math.floor(iron)}}

function computerTurn(){for(let f=0;f<F.length;f++){if(f===s.player)continue;let ownProvs=regOf(f);if(!ownProvs.length)continue;let cap=CAP[f],hub=s.provinces[cap]?.owner===f?cap:ownProvs[0].i;let h=s.provinces[hub];if(s.gold[f]>150&&s.wood[f]>35){let r=ownProvs[Math.floor(Math.random()*ownProvs.length)];if(r.p.workshop<2&&Math.random()<.5){r.p.workshop++;s.gold[f]-=115;s.wood[f]-=20}else if(r.p.farm<2){r.p.farm++;s.gold[f]-=70;s.wood[f]-=20}}if(s.gold[f]>310&&s.wood[f]>70&&Math.random()<.45){let ports=ownProvs.filter(({i})=>N[i].port);if(ports.length){let p=ports[Math.floor(Math.random()*ports.length)].p;if(!p.dock){p.dock=1;s.gold[f]-=135;s.wood[f]-=40;s.iron[f]-=20}else if(s.iron[f]>45){p.frigate++;s.gold[f]-=165;s.wood[f]-=70;s.iron[f]-=40}}}if(s.gold[f]>110&&s.food[f]>30){let front=ownProvs.filter(({i})=>N[i].adj.some(j=>withWar(f,s.provinces[j].owner)));let p=(front.length?front[Math.floor(Math.random()*front.length)].p:h);if(armies(p)<18){p.inf+=2;s.gold[f]-=105;s.food[f]-=30}}if(!s.research[f]&&s.gold[f]>210&&Math.random()<.28){let pool=TECH.filter(t=>!has(f,t.id)&&techAccessible(f,t)&&s.gold[f]>t.cost+100);if(pool.length){let t=pool[Math.floor(Math.random()*pool.length)];s.research[f]={id:t.id,remaining:researchDays(t,f),total:researchDays(t,f)};s.gold[f]-=t.cost}}if(Math.random()<.55){let fronts=[];for(let {p,i} of ownProvs)if(!p.move&&armies(p)>=4)for(let j of N[i].adj)if(s.provinces[j].owner!==f&&withWar(f,s.provinces[j].owner))fronts.push([i,j]);fronts.sort((a,b)=>power(s.provinces[b[0]],f,true,b[1])-power(s.provinces[a[0]],f,true,a[1]));for(let [from,to] of fronts.slice(0,2)){let a=s.provinces[from],b=s.provinces[to];if(power(a,f,true,to)>power(b,b.owner,false,to)*1.22){let force=detachLand(a);if(armies(force)>0){let days=travelDays(from,to,force,f);s.orders.push({id:++s.orderSeq,kind:'army',f,from,to,force,remaining:days,total:days});if(b.owner===s.player||f===s.player)log(`⚑ ${F[f].name}: армия выступила к ${N[to].name}.`) }}}}if(Math.random()<.035&&s.turn>7&&ownProvs.length>3&&s.relations[f][s.player]<-35&&!withWar(f,s.player)&&!withAlliance(f,s.player)&&ownProvs.some(({i})=>N[i].adj.some(j=>s.provinces[j].owner===s.player))){s.wars.push(code(f,s.player));s.warStart[code(f,s.player)]=s.turn;log(`⚠ ${F[f].name} объявила войну вашему государству!`);pauseGame()}// Enemy admirals patrol active fronts and threaten hostile ports with blockade.
 if(s.turn>2&&Math.random()<.14){let ports=ownProvs.filter(({i,p})=>N[i].port&&vessels(p)>=2);
 let chosen=null;for(let {p,i} of ports){let tg=N.map((n,j)=>j).filter(j=>N[j].port&&s.provinces[j].owner!==f&&withWar(f,s.provinces[j].owner)&&canSailFor(f,i,j)&&navalPower(p,f)>navalPower(s.provinces[j],s.provinces[j].owner)*1.3&&!s.blockades.some(b=>b.to===j));
 if(tg.length){chosen={from:i,to:tg[0]};break}}if(chosen){s.blockades.push({...chosen,owner:f});if(s.provinces[chosen.to].owner===s.player)log(`⚓ Флот ${F[f].name} установил блокаду у ${N[chosen.to].name}.`)}}
 // Maritime commerce can grow without the player's involvement.
 if(s.turn%5===0&&Math.random()<.13){let t=Math.floor(Math.random()*F.length);if(t!==f&&!withWar(f,t)&&s.relations[f][t]>20&&!withTrade(f,t))s.treaties.push(code(f,t))}
 if(Math.random()<.022&&s.turn>3&&ownProvs.length>3){let target=ownProvs.flatMap(({i})=>N[i].adj.map(j=>s.provinces[j].owner)).filter(t=>t!==f&&t!==s.player&&!withWar(f,t)&&!withAlliance(f,t));if(target.length){let t=target[Math.floor(Math.random()*target.length)];s.wars.push(code(f,t));s.warStart[code(f,t)]=s.turn;log(`Между «${F[f].name}» и «${F[t].name}» вспыхнула война.`)}}}}

function aiPeace(){s.warStart=s.warStart||{};for(let key of [...s.wars]){let [a,b]=key.split(':').map(Number);let elapsed=s.turn-(s.warStart[key]??0);if(elapsed<7)continue;let tired=s.exhaustion[a]+s.exhaustion[b];let accept=elapsed>18||tired>30;if(!accept||Math.random()>.15)continue;s.wars=s.wars.filter(x=>x!==key);delete s.warStart[key];s.exhaustion[a]=Math.max(0,s.exhaustion[a]-14);s.exhaustion[b]=Math.max(0,s.exhaustion[b]-14);log(`Послы держав «${F[a].name}» и «${F[b].name}» заключили мир.`)}}

function events(){if(Math.random()>.17)return;let ps=regOf(s.player);if(!ps.length)return;let r=ps[Math.floor(Math.random()*ps.length)],event=Math.floor(Math.random()*5);if(event===0){s.gold[s.player]+=50;log(`Купцы города ${N[r.i].name} вернули таможенные долги. Казна +50.`)}else if(event===1){s.food[s.player]+=50;log(`Богатый урожай в ${N[r.i].name}: +50 провианта.`)}else if(event===2){r.p.unrest=clamp(r.p.unrest+13,0,100);log(`На ${N[r.i].name} распространились слухи о бунте.`)}else if(event===3){s.wood[s.player]+=30;log('Верфи получили новую поставку древесины (+30).')}else{s.prestige[s.player]+=2;log('Иностранные послы оценили церемониал двора (+2 престижа).')}}

function restoreSave(data){
 if(!data||![5].includes(data.v)||data.provinces?.length!==N.length||!Number.isInteger(data.player)||data.player<0||data.player>=F.length)throw Error('Сохранение несовместимо с текущей картой');
 pauseGame();mapSignature='';s=data;s.v=5;s.education=s.education||F.map(()=>25);s.advisers=s.advisers||F.map(()=>[]);s.month=s.month||s.season*3+1;s.day=s.day||1;s.orders=s.orders||[];s.production=s.production||[];s.orderSeq=s.orderSeq||0;
 for(let p of s.provinces)p.units=p.units||{};
 for(let r of s.research){if(r&&r.total<=10){r.remaining*=55;r.total*=55}}
 selected=s.provinces[CAP[s.player]]?.owner===s.player?CAP[s.player]:regOf(s.player)[0]?.i??0;
 mission=null;drawAll();closeModal();drawClock();
}

function pauseGame(){isPlaying=false;drawClock()}

function togglePause(){if(!s||s.ended)return;if($('modal').classList.contains('visible'))return;
 isPlaying=!isPlaying;clockAccumulator=0;lastFrame=performance.now();drawClock()}

function speedSet(i){gameSpeed=clamp(Number(i)||1,1,5);clockAccumulator=0;lastFrame=performance.now();drawClock()}

function clockFrame(now){if(!lastFrame)lastFrame=now;let elapsed=Math.min(200,now-lastFrame);lastFrame=now;
 if(isPlaying&&!s.ended){clockAccumulator+=elapsed;let steps=0;while(clockAccumulator>=DAY_INTERVAL[gameSpeed]&&steps<12&&isPlaying){clockAccumulator-=DAY_INTERVAL[gameSpeed];advanceDay();steps++}
 if(steps){drawClock();if(steps>0&&(s.day%3===0||steps>=5||!isPlaying))drawAll();else refreshOrdersLayer()}}
 clockHandle=requestAnimationFrame(clockFrame)}

function advanceDay(){if(!s||s.ended)return;
 let next=new Date(s.year,s.month-1,s.day+1,12);let oldMonth=s.month,oldQuarter=Math.floor((oldMonth-1)/3);
 s.year=next.getFullYear();s.month=next.getMonth()+1;s.day=next.getDate();s.season=Math.floor((s.month-1)/3);
 advanceResearch();advanceProduction();advanceOrders();
 if(s.day===1&&oldMonth!==s.month){improveEducationMonthly();monthlyUpdate();if(s.season!==oldQuarter)quarterTurn()}
 if(s.ended)pauseGame()
}

function monthlyUpdate(){for(let f=0;f<F.length;f++){
   let city=regOf(f);if(!city.length)continue;
   let training=s.production.filter(q=>q.f===f&&REGIMENTS[q.key]).length;
   if(training>25)s.stability[f]=clamp(s.stability[f]-1,0,100);
 }
}

function quarterTurn(){F.forEach((_,f)=>maintenance(f));
 s.blockades=s.blockades.filter(x=>s.provinces[x.from]?.owner===x.owner&&vessels(s.provinces[x.from])>0&&withWar(x.owner,s.provinces[x.to].owner));
 computerTurn();aiPeace();events();s.turn++;s.action=3;
 const ps=regOf(s.player);
 if(!ps.length){s.ended=true;showModal('<h2>Конец династии</h2><p>Ваше государство утратило все территории.</p><button onclick="newGame()">Новая кампания</button>')}
 else if(ps.length>=Math.ceil(N.length*.47)){s.ended=true;showModal('<h2>Великая империя</h2><p>Ваше государство контролирует почти половину стратегической карты.</p><button onclick="closeModal()">Осмотреть владения</button>')}
 else log(`Квартальный отчёт: ${dateLabel()}. Провинций — ${ps.length}, состояние казны — ${fmt(s.gold[s.player])}.`);
 drawAll();saveQuiet()
}

function detachLand(p,limit=Infinity){let force={inf:0,cav:0,art:0,units:{},fort:0,depot:0,morale:p.morale};let leave=1,remaining=limit;
 for(let k of UNITKEYS){let available=countUnit(p,k);if(k==='inf'&&available>0){available--;leave=0}
 else if(leave&&available>0){available--;leave=0}
 let qty=Math.min(available,remaining);if(qty<=0)continue;
 if(['inf','cav','art'].includes(k)){force[k]+=qty;p[k]-=qty}
 else{force.units[k]=qty;p.units[k]-=qty}
 remaining-=qty;if(remaining<=0)break}
 return force}

function addLand(dst,force){for(let k of ['inf','cav','art'])dst[k]=(dst[k]||0)+(force[k]||0);
 dst.units=dst.units||{};for(let [k,q] of Object.entries(force.units||{}))dst.units[k]=(dst.units[k]||0)+q}

function travelDays(from,to,force,f){let n=N[to],dx=N[from].x-n.x,dy=N[from].y-n.y;
 let rough={plain:1,steppe:1.02,hills:1.22,taiga:1.35,mountain:1.75}[n.terrain]||1;
 let slower=Object.entries(force.units||{}).some(([k,v])=>v>0&&k==='heavyart')||force.art>2?1.27:1;
 let cav=(force.cav>0||(force.units?.hussars||0)>0)&&armies(force)===force.cav+(force.units?.hussars||0)?0.77:1;
 let d=(13+Math.sqrt(dx*dx+dy*dy)*.19)*rough*slower*cav;
 if(has(f,'roads'))d*=.9;if(has(f,'surveys'))d*=.91;if(has(f,'pontoons'))d*=.92;if(has(f,'studs')&&force.cav>0)d*=.93;if(has(f,'generalstaff'))d*=.82;if(s.provinces[from].road)d*=.9;
 return clamp(Math.round(d),6,95)
}

function advanceOrders(){let arrive=[];for(let o of s.orders){o.remaining--;if(o.remaining<=0)arrive.push(o)}if(!arrive.length)return;
 s.orders=s.orders.filter(o=>!arrive.includes(o));
 for(let o of arrive){if(o.kind==='army')resolveLandOrder(o);else if(o.kind==='fleet')resolveFleetOrder(o);else if(o.kind==='landing')resolveLandingOrder(o)}
}

function resolveLandOrder(o){let from=s.provinces[o.from],b=s.provinces[o.to],f=o.f;
 if(!b)return;let attacker=o.force;let enemy=b.owner;
 if(b.owner===f){addLand(b,attacker);b.morale=Math.round((b.morale+attacker.morale)/2);if(f===s.player)log(`➤ Армия прибыла в ${N[o.to].name}: ${armies(attacker)} полк(ов).`);return}
 if(!withWar(f,enemy)){if(from.owner===f){addLand(from,attacker)}if(f===s.player)log(`Приказ отменён: война с ${F[enemy].name} завершена.`);return}
 let A=power(attacker,f,true,o.to)*(.88+Math.random()*.24),D=power(b,enemy,false,o.to)*(.88+Math.random()*.24);
 if(v23RiverCrossing(o.from,o.to)){A*=v23AssaultFactor(f);if(f===s.player||enemy===s.player)log('Речная переправа: атакующая армия несёт дополнительный штраф.');}
 let won=A>D,lA=Math.min(armies(attacker)-1,Math.max(0,Math.ceil(armies(attacker)*(won?.19:.42)*Math.min(1,D/Math.max(A,1))))),lD=Math.min(armies(b),Math.max(1,Math.ceil(armies(b)*(won?.66:.22)*Math.min(1,A/Math.max(D,1)))));
 if(has(f,'fieldmedicine'))lA=Math.floor(lA*.81);
 militaryLoss(attacker,lA);militaryLoss(b,lD);
 s.exhaustion[f]=clamp(s.exhaustion[f]+(won?1:4),0,100);s.exhaustion[enemy]=clamp(s.exhaustion[enemy]+(won?4:1),0,100);
 if(won){b.owner=f;s._maprevision=(s._maprevision||0)+1;let remnants={inf:b.inf,cav:b.cav,art:b.art,units:{...b.units}};b.inf=b.cav=b.art=0;b.units={};addLand(b,attacker);b.morale=clamp(attacker.morale-8,35,95);b.unrest=65;s.prestige[f]+=4;
  if(f===s.player||enemy===s.player)log(`⚔ ${F[f].name} заняла ${N[o.to].name}. Потери ${lA} / ${lD} полк.`);
 }else{if(from.owner===f)addLand(from,attacker);else{let retreat=N[o.to].adj.find(x=>s.provinces[x].owner===f);if(retreat!==undefined)addLand(s.provinces[retreat],attacker)}
  if(f===s.player||enemy===s.player)log(`⚔ Атака на ${N[o.to].name} отбита. Потери ${lA} / ${lD} полк.`)}
 if(f===s.player||enemy===s.player){pauseGame();showModal(battleText('Сухопутное сражение',o.from,o.to,A,D,lA,lD,won))}
}

function endTurn(){/* Compatibility for older scripts: advance one day, not a full season. */advanceDay();drawAll()}

function tip(e,i){const n=N[i],p=s.provinces[i],t=$('tooltip'),v=$('mapviewport');t.style.display='block';let rect=v.getBoundingClientRect();t.style.left=clamp(e.clientX-rect.left+14,6,rect.width-235)+'px';t.style.top=clamp(e.clientY-rect.top+10,6,rect.height-100)+'px';let visible=defendersVisible(i);t.innerHTML=`<b>${esc(n.name)}</b><div>${esc(F[p.owner].name)} · ${TERR[n.terrain][0]}${n.port?' · ⚓ Порт':''}</div><div>Гарнизон: ${visible?armies(p)+' частей':'неизвестен'} · стабильность провинции: ${100-p.unrest}%</div><div>Хозяйство: ${n.wealth+p.workshop*3+p.market*2} · Форт: ${p.fort}</div>`}

function updateTransform(){let svg=$('world');svg.setAttribute('transform',`translate(${panX} ${panY}) scale(${zoom})`)}

function clampPan(){panX=clamp(panX,1600*(1-zoom),0);panY=clamp(panY,1080*(1-zoom),0)}

function v6art(type,css='thumb'){let src=V6_ART[type]||V6_ART.industry;return `<div class="v6-art ${css}" style="background-image:url('${src}')"></div>`}

function v6img(t){let cat=t.cat||'';return t.art|| (t.id?.startsWith('gun')?'cannon':V6_ICON_CAT[cat]||'academy')}

function v6name(s0){return String(s0??'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]))}

function v6mod(f,k){return globalMod(f,k)}

function v6bonus(k,m){return `${({'gunCost':'Стоимость изготовления орудий','arsenalSpeed':'Скорость производства','shipHull':'Прочность корпуса','shipSpeed':'Макс. скорость судна','gunAccuracy':'Точность орудий','infantryAtk':'Атака пехоты','infantryDef':'Оборона пехоты','armySpeed':'Скорость марша','armyLoss':'Боевые потери','regimentTime':'Время подготовки полков','arsenalCost':'Цена производства','treasury':'Налоговые поступления','gunDamage':'Урон пушек','gunReload':'Скорость перезарядки','shipPower':'Морская мощь','shipCost':'Стоимость кораблей','shipTime':'Время постройки','research':'Скорость исследований'})[k]||k}: ${m<1?'−':'+'}${Math.round(Math.abs(m-1)*100)}%`}

function v6effects(f,k){let lines=[];if(NATIONAL[f]?.mods?.[k]!==undefined)lines.push([NATIONAL[f].title,(NATIONAL[f].mods[k]-1)*100]);for(let id of s.advisers?.[f]||[]){let a=ADVISERS.find(z=>z.id===id);if(a?.mods?.[k]!==undefined)lines.push([a.name,(a.mods[k]-1)*100])}for(let id of s.tech?.[f]||[]){let m=V6_TECH_BONUSES[id]?.[k];if(m!==undefined)lines.push([TECH.find(x=>x.id===id)?.name||id,(m-1)*100])}return lines}

function v6percent(f,k){let m=v6mod(f,k);return `<div class="v6-line"><div class="kv"><b>${v6bonus(k,m)}</b><span>×${m.toFixed(3)}</span></div>${v6effects(f,k).map(([n,v])=>`<div class="kv"><span>${v6name(n)}</span><b class="${v<0?'v6-green':'v6-gold'}">${v>=0?'+':'−'}${Math.abs(v).toFixed(0)}%</b></div>`).join('')}</div>`}

function v6state(){if(!s)return;s.v=6;
 s.equipment=s.equipment||F.map((_,i)=>Object.fromEntries(Object.keys(V6_EQUIP).map(k=>[k,k==='musket'?1300:k==='gun4'?30:k==='gun6'?20:k==='uniform'?1100:k==='gunpowder'?70:0])));
 s.factories=s.factories||[];s.shipDesigns=s.shipDesigns||[];s.ships=s.ships||[];s.fleets=s.fleets||[];s.fleetOrders=s.fleetOrders||[];s.v6seq=s.v6seq||100000;
 for(let p of s.provinces){p.regimentRecords=p.regimentRecords||[]}
}

function v6atlas(initial=false){if(!s)return;let cap=CAP[s.player]>=0?CAP[s.player]:0,pt=N[cap];zoom=initial?7.5:Math.max(zoom,5);panX=800-pt.x*zoom;panY=540-pt.y*zoom;clampPan();updateTransform();v6scaleLabel()}

function v6industrialCapacity(f){return Math.max(2,Math.ceil(regOf(f).reduce((n,{p})=>n+p.workshop*.32,0)))}

function v6unitCost(k,f){let e=V6_EQUIP[k];return {gold:Math.round(e.gold*globalMod(f,'arsenalCost')*(k.startsWith('gun')?globalMod(f,'gunCost'):1)*100)/100,iron:e.iron,wood:e.wood}}

function v6hullReady(t){return !V6_HULLS[t].req||has(s.player,V6_HULLS[t].req)}

function v6makeDesign(type){let h=V6_HULLS[type],id=++s.v6seq;let design={id,f:s.player,type,name:`Проект «${h.label}» №${id%10000}`,batteries:h.decks.map(d=>({gun:'gun4',count:Math.min(d.max,type==='line'?8:Math.min(8,d.max))})),tech:[]};s.shipDesigns.push(design);v6CurrentDesign=id;v6FleetPage='designer';drawAll()}

function v6design(id){return s.shipDesigns.find(d=>d.id===id&&d.f===s.player)}

function v6designChange(id,deck,field,val){let d=v6design(id),h=d&&V6_HULLS[d.type];if(!d||!h)return;let row=d.batteries[deck];if(field==='gun')row.gun=val;else row.count=clamp(Math.floor(+val||0),0,h.decks[deck].max);drawAll()}

function v6renameDesign(id){let d=v6design(id),input=$('v6designname');if(d&&input&&input.value.trim()){d.name=input.value.trim().slice(0,64);drawAll()}}

function v6designStats(d){let h=V6_HULLS[d.type],f=d.f,guns=0,weight=0,attack=0,reload=0,iron=0;let equip={};
 let valid=true,errors=[];for(let i=0;i<h.decks.length;i++){let deck=h.decks[i],row=d.batteries[i],gun=CANNONS.find(z=>z.id===row.gun);if(!gun||row.count>deck.max||gun.lb>deck.maxLb){valid=false;errors.push(`${deck.name}: выбранный калибр / количество не допускаются`);continue}if(row.count%2){valid=false;errors.push(`${deck.name}: количество должно быть чётным`)}if(!v6canEquip(f,row.gun)){valid=false;errors.push(`${gun.lb}-фунтовые орудия не исследованы`)}guns+=row.count;weight+=gun.weight*row.count;attack+=gun.atk*row.count/2;reload+=gun.reload*row.count;iron+=gun.iron*row.count/10;equip[row.gun]=(equip[row.gun]||0)+row.count}
 let maxWeight=h.tonnage*.18;if(weight>maxWeight){valid=false;errors.push(`Орудия перегружают корпус: ${weight.toFixed(1)} / ${maxWeight.toFixed(1)} т`)}if(!v6hullReady(d.type)){valid=false;errors.push(`Проект корпуса требует технологию «${TECH.find(t=>t.id===h.req)?.name||h.req}»`)}
 let base=h.baseGold+guns*.55,material=h.iron+Math.round(iron),gold=Math.ceil(base*globalMod(f,'shipCost')*(has(f,'shipyards')?.82:1)),wood=h.wood,days=Math.ceil(h.days*globalMod(f,'shipTime')*(has(f,'blockandpulleys')?.9:1));
 let speed= Math.max(4,h.speed*(1-Math.max(0,weight/h.tonnage-.045)*1.25)*globalMod(f,'shipSpeed'));let hp=Math.round(h.hp*globalMod(f,'shipHull'));let crewMin=Math.ceil(guns*5+h.crew*.42),crew=Math.min(h.crew,Math.ceil(crewMin*1.28));let shots=(attack/Math.max(1,reload/Math.max(1,guns)))*globalMod(f,'gunDamage')*globalMod(f,'gunReload');
 return {guns,weight,attack:attack*globalMod(f,'gunDamage'),speed,hp,crew,crewMax:h.crew,crewMin,iron:material,wood,gold,days,equip,valid,errors,shots,range:Math.max(200,...d.batteries.filter(x=>x.count>0).map(x=>CANNONS.find(g=>g.id===x.gun)?.range||0))};}

function v6hireCrew(id){let sh=v6ship(id);if(!sh||!own(sh.port)||!N[sh.port].port)return;let diff=sh.crewMax-sh.crew;if(diff<1)return;let c=Math.ceil(diff*.12);if(!spend({gold:c,food:Math.ceil(diff*.012),wood:0,iron:0}))return;sh.crew=sh.crewMax;drawAll()}

function v6testQuote(f,type='frigate'){let id=s.shipDesigns.find(x=>x.f===f&&x.type===type)?.id;if(!id)return null;return v6designStats(v6design(id))}

function v6battleInit(){let b=s.tactical;if(!b||b.units)return;let friendly=b.attacker===s.player;let p=s.provinces[b.to],a=b.kind==='land'?b.force:null,def=p;
 let entries=[];let unitId=0;function push(side,label,type,hp,x,y){if(hp<=0)return;entries.push({id:++unitId,side,label,type,hp,maxHp:hp,x,y,acted:false})}
 if(b.kind==='land'){
 const armies0=[a,def];armies0.forEach((force,j)=>{let playerSide=(j===0)===friendly?'player':'enemy';let x=playerSide==='player'?2:8;let qty=armies(force);push(playerSide,'Пехотная линия','inf',Math.max(6,Math.min(30,8+qty*1.4)),x,1);if((force.cav||0)+(force.units?.dragoons||0)>0)push(playerSide,'Кавалерия','cav',Math.max(6,Math.min(20,5+qty*.7)),x,3);if((force.art||0)+(force.units?.heavyart||0)>0)push(playerSide,'Артиллерия','art',Math.max(5,Math.min(20,5+qty*.5)),x,5)})
 }else{let fleet=s.fleets.find(x=>x.id===b.fleetId),sh=s.ships.filter(z=>z.fleetId===fleet.id),enemy=s.ships.filter(z=>z.f===b.defender&&z.port===b.to),enemyStrength=vessels(s.provinces[b.to]);for(let i=0;i<Math.min(3,Math.max(1,sh.length));i++){let ship=sh[i],stats=ship?v6designStats({...ship.design,f:ship.f}):null;push('player',ship?.name||'Фрегат','ship',Math.round(8+(ship?.hp||80)/9),2,1+i*2);let u=entries[entries.length-1];let adm=fleet.admiral===null?null:V6_ADMIRALS[fleet.admiral];u.fire=Math.max(2,Math.round((ship?v6shipPower(ship,fleet.admiral):12)/2.8*(adm?.mod.gunReload||1)*(adm?.mod.gunAccuracy||1)));u.reach=Math.min(6,Math.max(2,Math.floor((stats?.range||500)/150)));u.shipId=ship?.id}
 for(let i=0;i<Math.min(3,Math.max(1,enemy.length||enemyStrength));i++){let ship=enemy[i],stats=ship?v6designStats({...ship.design,f:ship.f}):null;push('enemy',ship?.name||'Вражеский корабль','ship',Math.round(12+(ship?.hp||90)/12+enemyStrength*2),8,1+i*2);let u=entries[entries.length-1];u.fire=Math.max(2,Math.round((stats?.attack||8+enemyStrength*2)/3));u.reach=Math.min(6,Math.max(2,Math.floor((stats?.range||520)/150))) }
 }
 b.units=entries;b.selected=entries.find(x=>x.side==='player')?.id||null;b.action='fire';b.log=['Ожидаются приказы командующего.'];b.turn=1}

function v6battleDecision(){v6battleInit();let b=s.tactical;if(!b)return;let ours=b.units.filter(u=>u.side==='player'),enemy=b.units.filter(u=>u.side==='enemy');showModal(`<h2 class="v6-title">${b.kind==='land'?'Сухопутное сражение':'Морское столкновение'}</h2><p>${v6name(N[b.from].name)} → ${v6name(N[b.to].name)}</p><div class="v6-grid"><div class="v6-panel">${v6art(b.kind==='land'?'infantry':'ship','large')}<b>Ваши силы: ${ours.length} подразделений</b></div><div class="v6-panel">${v6art(b.kind==='land'?'battle':'naval','large')}<b>Противник: ${enemy.length} подразделений</b></div></div><p class="mini">Можно управлять боем вручную или доверить исход автоматическому расчёту. Тактический режим — первый прототип: перемещение, дальность, залпы, потери и ответные действия ИИ.</p><div class="buttonrow"><button class="main" onclick="v6battleOpen()">Принять командование</button><button onclick="v6autoBattle()">Автоматический расчёт</button></div>`)}

function v6tacticAction(a){if(s.tactical){s.tactical.action=a;v6battleOpen()}}

function v6tile(x,y){let b=s.tactical;if(!b)return;let u=b.units.find(z=>z.hp>0&&z.x===x&&z.y===y),selected=b.units.find(z=>z.id===b.selected&&z.hp>0);if(u?.side==='player'){b.selected=u.id;return v6battleOpen()}if(!selected||selected.acted)return say('Выберите часть, ещё не получившую приказ');let d=Math.abs(selected.x-x)+Math.abs(selected.y-y),range=selected.type==='art'?5:selected.type==='ship'?(selected.reach||4):selected.type==='inf'?3:1,move=selected.type==='cav'?3:selected.type==='ship'?2:selected.type==='art'?1:2;
 if(b.action==='move'){if(u||d>move||d===0)return say('Нужно выбрать свободную клетку в пределах хода');selected.x=x;selected.y=y;selected.acted=true;b.log.push(`${selected.label}: выполнен манёвр.`)}else{if(!u||u.side!=='enemy'||d>range)return say(`Цель должна быть в пределах ${range} клеток`);let attack=selected.type==='art'?5:selected.type==='ship'?(selected.fire||6):selected.type==='cav'?4:3;let effect=selected.type==='ship'?globalMod(s.player,'gunDamage')*globalMod(s.player,'gunAccuracy')*globalMod(s.player,'gunReload')*globalMod(s.player,'shipPower')*globalMod(s.player,'navalPower'):globalMod(s.player,'infantryAtk')*globalMod(s.player,'infAttack');let damage=Math.max(1,Math.round(attack*effect*(.85+Math.random()*.35)));u.hp-=damage;selected.acted=true;b.log.push(`${selected.label}: цель «${u.label}», урон −${damage}.`)}v6checkBattle()?null:v6battleOpen()}

function v6enemyTurn(){let b=s.tactical;if(!b)return;let players=b.units.filter(u=>u.side==='player'&&u.hp>0);for(let e of b.units.filter(u=>u.side==='enemy'&&u.hp>0)){if(!players.length)break;let closest=players.slice().sort((a,c)=>(Math.abs(e.x-a.x)+Math.abs(e.y-a.y))-(Math.abs(e.x-c.x)+Math.abs(e.y-c.y)))[0],dist=Math.abs(e.x-closest.x)+Math.abs(e.y-closest.y),range=e.type==='art'?5:e.type==='ship'?(e.reach||4):e.type==='inf'?3:1;
 if(dist>range){let dx=Math.sign(closest.x-e.x),dy=Math.sign(closest.y-e.y),nx=e.x+dx,ny=e.y+dy;if(nx>=0&&nx<11&&ny>=0&&ny<7&&!b.units.some(z=>z.hp>0&&z.x===nx&&z.y===ny)){e.x=nx;e.y=ny}continue}let damage=Math.max(1,Math.round((e.type==='ship'?(e.fire||5):e.type==='art'?4:3)*(.7+Math.random()*.5)));if(b.kind==='land')damage=Math.max(1,Math.round(damage/globalMod(s.player,'infantryDef')));closest.hp-=damage;b.log.push(`${e.label}: ответный огонь, урон −${damage}.`)}
 b.turn++;for(let u of b.units)u.acted=false;b.selected=b.units.find(u=>u.side==='player'&&u.hp>0)?.id||null;v6checkBattle()?null:v6battleOpen()}

function v6checkBattle(){let b=s.tactical;if(!b)return true;let ours=b.units.some(u=>u.side==='player'&&u.hp>0),enemy=b.units.some(u=>u.side==='enemy'&&u.hp>0);if(!ours||!enemy||b.turn>=22){let friendlyHealth=b.units.filter(x=>x.side==='player').reduce((a,u)=>a+Math.max(0,u.hp),0),enemyHealth=b.units.filter(x=>x.side==='enemy').reduce((a,u)=>a+Math.max(0,u.hp),0);v6finishBattle(ours&&!enemy?true:!ours&&enemy?false:friendlyHealth>=enemyHealth);return true}return false}

function v6autoBattle(){let b=s.tactical;if(!b)return;v6battleInit();let ownStrength=b.units.filter(u=>u.side==='player').reduce((a,u)=>a+u.hp*(b.kind==='sea'?(u.fire||4)/4:1),0)*(.8+Math.random()*.4),other=b.units.filter(u=>u.side==='enemy').reduce((a,u)=>a+u.hp*(b.kind==='sea'?(u.fire||4)/4:1),0)*(.8+Math.random()*.4);v6finishBattle(ownStrength>=other)}

function v6finishBattle(playerWon){let b=s.tactical;if(!b)return;let attWon=b.attacker===s.player?playerWon:!playerWon;let p=s.provinces[b.to];if(b.kind==='land'){let force=b.force,from=s.provinces[b.from];let lossA=Math.min(armies(force)-1,Math.floor(armies(force)*(attWon?.2:.46))),lossD=Math.min(armies(p),Math.floor(armies(p)*(attWon?.42:.18)));lossA=Math.round(lossA*globalMod(b.attacker,'armyLoss'));lossD=Math.round(lossD*globalMod(b.defender,'armyLoss'));militaryLoss(force,Math.max(0,lossA));militaryLoss(p,Math.max(0,lossD));if(attWon){p.owner=b.attacker;p.inf=p.cav=p.art=0;p.units={};addLand(p,force);p.morale=65;p.unrest=60;s._maprevision=(s._maprevision||0)+1;s.prestige[b.attacker]+=3}else if(from?.owner===b.attacker)addLand(from,force);log(`${attWon?'Наступающие овладели':'Защитники удержали'} ${N[b.to].name}. Потери ${lossA}/${lossD} полков.`)}else{let fleet=s.fleets.find(z=>z.id===b.fleetId),ships=s.ships.filter(z=>z.fleetId===b.fleetId);for(let sh of ships){sh.hp=Math.max(1,Math.round(sh.hp*(playerWon?.88:.59)));sh.crew=Math.max(8,Math.round(sh.crew*(playerWon?.91:.70)));sh.experience+=3}if(playerWon){takeSeaLoss(p,Math.max(1,Math.ceil(vessels(p)*.48)));fleet.port=b.to;ships.forEach(sh=>sh.port=b.to)}else{fleet.port=b.from;ships.forEach(sh=>sh.port=b.from)}log(`Морское сражение у ${N[b.to].name}: ${playerWon?'победа вашей эскадры':'эскадра отступила'}.`)}
 s.tactical=null;closeModal();mapSignature='';drawAll();showModal(`<h2>${playerWon?'Победа':'Поражение'}</h2><p>${b.kind==='land'?'Сухопутное':'Морское'} сражение завершено.</p><p>Результаты нанесены на стратегическую карту: изменились состояние войск, гарнизоны и / или корабли.</p><button class="main" onclick="closeModal()">Вернуться на карту</button>`)}

function v6refitLandBattery(recordId,gun){let p=s.provinces[selected];if(p.owner!==s.player)return;let r=p.regimentRecords?.find(x=>x.id===recordId);if(!r||!r.equipment||REGIMENTS[r.key]?.type!=='Артиллерия')return;let e=V6_EQUIP[gun],f=s.player;if(!e||!gun.startsWith('gun')||!v6canEquip(f,gun))return say('Неизученное орудие');let qty=r.equipment.required;if((s.equipment[f][gun]||0)<qty)return say(`Нужно ${qty} орудий на складе`);let old=r.equipment.item;if(old===gun)return;s.equipment[f][old]=(s.equipment[f][old]||0)+qty;s.equipment[f][gun]-=qty;r.equipment.item=gun;r.gunBonus=(CANNONS.find(x=>x.id===gun)?.atk||1)/(CANNONS.find(x=>x.id==='gun4')?.atk||1);drawAll()}

function v7fx(tech){let mods=V6_TECH_BONUSES[tech.id]||V7_TECH_EFFECTS[tech.id]||{};return [...Object.entries(mods).map(([k,m])=>v6bonus(k,m)),...(V7_LEGACY_TECH_EFFECTS[tech.id]||[])]}

function v7state(){if(!s)return;s.v=7;s.equipment=s.equipment||F.map(()=>Object.fromEntries(Object.keys(V6_EQUIP).map(k=>[k,k==='musket'?1300:k==='gun4'?30:k==='gun6'?20:k==='uniform'?1100:k==='gunpowder'?70:0])));s.factories=s.factories||[];s.shipDesigns=s.shipDesigns||[];s.ships=s.ships||[];s.fleets=s.fleets||[];s.fleetOrders=s.fleetOrders||[];s.v6seq=s.v6seq||100000;s.steel=s.steel||F.map((_,i)=>i===s.player?38:24);s.copper=s.copper||F.map((_,i)=>i===s.player?37:28);s.shipImports=s.shipImports||[];s.v7mines=s.v7mines||{};
 for(let f=0;f<F.length;f++)for(let [k,it] of Object.entries(V6_EQUIP))if(s.equipment?.[f]?.[k]===undefined)s.equipment[f][k]=0;
}

function v7mine(i,k){v7state();let p=s.provinces[i],geo=v7geology(i);if(!p||p.owner!==s.player)return;let stats=s.v7mines[i]||(s.v7mines[i]={iron:0,copper:0,smelter:0});if((stats[k]||0)>=3)return say('Максимальный уровень — 3');if(k!=='smelter'&&!geo[k])return say('Месторождение не найдено');
 let price=k==='smelter'?{gold:120,iron:22,wood:18,food:0}:{gold:80+stats[k]*45,iron:9,wood:16,food:0};if(!spend(price))return;stats[k]++;log(`${N[i].name}: построено ${k==='iron'?'железорудное предприятие':k==='copper'?'медное предприятие':'металлургическая мануфактура'}.`);drawAll()}

function v7quarterExtraction(){v7state();for(let [index,level] of Object.entries(s.v7mines)){let i=+index,p=s.provinces[i],f=p?.owner;if(f===undefined)continue;let geo=v7geology(i);
 s.iron[f]+=Math.floor((level.iron||0)*geo.iron*2.1);s.copper[f]+=Math.floor((level.copper||0)*geo.copper*1.7);
 let amt=Math.min(Math.floor((level.smelter||0)*5),Math.floor(s.iron[f]/2),Math.floor(s.wood[f]/1.5));if(amt>0){s.iron[f]-=amt*2;s.wood[f]-=Math.ceil(amt*1.5);s.steel[f]+=amt}
 }}

function v7marketSeller(resource,qty){return F.map((x,i)=>i).filter(i=>i!==s.player&&!withWar(i,s.player)&&s[resource][i]>=qty+4).sort((a,b)=>s[resource][b]-s[resource][a])[0]}

function v7buy(resource,qty){v7state();qty=+qty;if(!V7_METALS[resource]||!Number.isInteger(qty)||qty<=0)return;let supplier=v7marketSeller(resource,qty);if(supplier===undefined)return say('У других держав нет свободных запасов этого ресурса.');
 let cost0=Math.ceil(V7_METALS[resource].price*qty*(1+Math.max(0,-s.relations[s.player][supplier])/200));if(s.gold[s.player]<cost0)return say('Недостаточно золота для импорта');
 s.gold[s.player]-=cost0;s.gold[supplier]+=cost0;s[resource][supplier]-=qty;let days=18+Math.floor(qty/10);s.shipImports.push({id:++s.v6seq,resource,qty,supplier,f:s.player,remaining:days,total:days});log(`Заказ на импорт: ${V7_METALS[resource].name}, ${qty} ед. из ${F[supplier].name}, стоимость ${cost0} зол., поставка ${days} дней.`);drawAll()}

function v7idVariation(t){let v=Array.from(t.id).reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,19);return v%7}

function v7startNation(f){let p=NATIONAL[f];return `<div class="v7-hero"><div class="v7-img portrait" style="background-image:url('${V6_ART[p.quality==='navy'?'naval':p.quality==='army'?'infantry':'advisor']}')"></div><div><h3>${v6name(F[f].name)}</h3><p>Правитель: ${v6name(p.ruler)}</p><p>Специализация: ${v6name(p.title)}</p></div></div>${v7modPanel(f,p.mods,'Начальные бонусы — точные коэффициенты')}`}

function v7court(){v7state();let f=s.player,profile=NATIONAL[f],appointed=s.advisers[f]||[],ed=edu(f);let x=`<h2 class="v6-title">Корона, министры и национальные идеи</h2><div class="v7-hero"><div class="v7-img portrait" style="background-image:url('${V6_ART.advisor}')"></div><div><b>${v6name(profile.ruler)}</b><p>${v6name(F[f].name)}</p><div class="kv"><span>Стабильность</span><b>${Math.round(s.stability[f])}%</b></div><div class="kv"><span>Образование</span><b>${ed.toFixed(1)} / 100</b></div></div></div>`;
 x+=v7modPanel(f,profile.mods,`Специализация: ${profile.title}`);
 x+=`<div class="v7-panel"><h3>Национальная система образования</h3><div class="kv"><span>Множитель исследований</span><b>×${((.70+ed*.009)*globalMod(f,'research')*(has(f,'academies')?1.13:1)).toFixed(3)}</b></div><p class="mini">Минимум образования для проектов: шлюп 24 · фрегат 40 · линейный корабль 60. Исследование и проектирование — разные процессы.</p><button onclick="investEducation()">Финансировать школы</button></div>`;
 x+='<h3>Королевский совет · 3 должности</h3><div class="v7-advisors">';for(let a of ADVISERS){let sel=appointed.includes(a.id);x+=`<div class="v7-advisor"><div class="v7-img" style="background-image:url('${V6_ART[a.id==='shipminister'?'ship':a.role==='Флот'?'naval':'advisor']}')"></div><div><b>${v6name(a.name)}</b><small>${v6name(a.role)} · жалование ${a.salary} зол./квартал</small>${Object.entries(a.mods).map(([k,m])=>`<div class="v7-tech-bonus">${v6bonus(k,m)}</div>`).join('')}<button onclick="hireAdviser('${a.id}')" ${!sel&&appointed.length>=3?'disabled':''}>${sel?'Отозвать':`Назначить · ${a.money} зол.`}</button></div></div>`}x+='</div><h3>Итоговые действующие эффекты</h3>';for(let k of ['research','shipCost','shipTime','shipPower','armyCost','infantryAtk','treasury'])x+=v6percent(f,k);return x}

function v7refitReg(id,key){let rec=s.provinces[selected].regimentRecords?.find(z=>z.id===id);if(!rec||!V6_EQUIP[key]||!v6canEquip(s.player,key))return say('Сначала исследуйте модель');let req=rec.equipment.required,inv=s.equipment[s.player];if((inv[key]||0)<req)return say(`На складе необходимо ${req} шт.`);inv[rec.equipment.item]+=req;inv[key]-=req;rec.equipment.item=key;rec.weaponMod=V6_EQUIP[key].atk||1;drawAll()}

function v7atlas(){if(!s)return;let c=CAP[s.player]>=0?CAP[s.player]:0,pt=N[c];zoom=15;panX=800-pt.x*zoom;panY=540-pt.y*zoom;clampPan();updateTransform();v6scaleLabel()}

function v7audit(k){let f=s.player,mod=globalMod(f,k);return {modifier:mod,percent:Math.round((mod-1)*1000)/10,sources:v6effects(f,k),stock:{iron:s.iron[f],copper:s.copper[f],steel:s.steel[f]}}}

function v7wideMarkup(){return `<div class="atlas-head"><div><h2>${v7WideScreen==='fleet'?'Королевское Адмиралтейство':'Министерство промышленности'}</h2><small>Рабочий экран · государственные запасы и приказы изменяются немедленно</small></div><button onclick="closeModal()">Закрыть</button></div><div class="v7-wide-body">${v7WideScreen==='fleet'?v7FleetTab():v7industry()}</div>`}

function v8WeaponPlate(variant){
 const defs={
 sabre1700:{hue:'#c5c1b2',curve:12,guard:1,name:'1700'},cavalrySabre:{hue:'#cdd7d5',curve:34,guard:2,name:'1740'},officerSabre:{hue:'#f4dba8',curve:3,guard:3,name:'1760'}
 };
 const a=defs[variant]||defs.sabre1700;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 210"><defs><radialGradient id="bg"><stop stop-color="#63594b"/><stop offset="1" stop-color="#1d2425"/></radialGradient><linearGradient id="steel"><stop stop-color="#f6f6eb"/><stop offset=".37" stop-color="${a.hue}"/><stop offset=".65" stop-color="#5d6772"/><stop offset="1" stop-color="#eae9d4"/></linearGradient></defs><rect width="350" height="210" fill="url(#bg)"/><path d="M18 180 L332 180 M18 28 L332 28" stroke="#c9a773" opacity=".42"/><g transform="rotate(-19 172 104)"><path d="M72 122 Q${150+a.curve} ${88-a.curve} 312 56 L335 48 Q203 110 80 131Z" fill="url(#steel)" stroke="#d3d1bf" stroke-width="1.3"/><path d="M72 126 L45 136 L18 155" fill="none" stroke="#7a543b" stroke-width="15" stroke-linecap="round"/><path d="M21 154 L45 137" stroke="#d6b071" stroke-width="3"/><path d="M74 113 Q${66-a.guard*5} 94 51 91 Q${35+a.guard*4} 108 70 145" fill="none" stroke="#d6b67d" stroke-width="5"/><path d="M60 125 Q50 150 33 147" fill="none" stroke="#e3c47f" stroke-width="3"/><circle cx="74" cy="126" r="5" fill="#f6d6a0"/></g><text x="20" y="201" font-family="Georgia" font-size="13" fill="#e6d3a6">ОРУЖЕЙНАЯ ПАЛАТА · ${a.name}</text></svg>`);
}

function v8get(){if(!s)return null;v7state();if(!s.v8){s.v8={version:8,resources:{},sites:{},lines:[],imports:[],seaOrders:[],missions:[],convoys:{},supply:{},monthly:{},id:30000,navalDate:0};}
 let v=s.v8;
 for(let f=0;f<F.length;f++){
  v.resources[f] ||= Object.fromEntries(Object.entries(V8_INITIAL).map(([k,x])=>[k,Math.round(x*(regOf(f).length/Math.max(1,regOf(s.player).length)*.3+.7))]));
  if(!v.convoys[f])v.convoys[f]={merchant:f===0?14:Math.max(3,Math.round(regOf(f).length/45)),escort:0};
 }
 // Migration of former abstract manufactories: convert their active production to the new allocation model.
 if(!v.migrated){for(const line of s.factories.filter(x=>x.f===s.player)){v.lines.push({id:++v.id,f:line.f,key:line.key,factories:1,eff:.28,work:line.work||0,produced:line.produced||0,priority:2,active:line.active!==false,blocked:''})}s.factories=s.factories.filter(x=>x.f!==s.player);v.migrated=true;}
 return v;
}

function v8lineAdd(key){let v=v8get(),f=s.player,it=V6_EQUIP[key];if(!it||!v6canEquip(f,key))return say('Это вооружение ещё не исследовано');if(v8factoryLimit(f)-v8factoryAssigned(f)<1)return say('Нет свободных мануфактур — увеличьте промышленность');let line=v.lines.find(x=>x.f===f&&x.key===key);if(line){line.factories++;}else v.lines.push({id:++v.id,f,key,factories:1,eff:.15,work:0,produced:0,priority:2,active:true,blocked:''});v8Refresh()}

function v8lineSlots(id,delta){let v=v8get(),line=v.lines.find(x=>x.id===id&&x.f===s.player);if(!line)return;if(delta>0&&v8factoryAssigned(line.f)>=v8factoryLimit(line.f))return say('Все мануфактуры уже заняты');line.factories=Math.max(0,Math.min(40,line.factories+delta));line.eff=Math.max(.12,line.eff-.015);if(!line.factories){v.lines=v.lines.filter(x=>x!==line)}v8Refresh()}

function v8linePriority(id,d){let line=v8get().lines.find(x=>x.id===id&&x.f===s.player);if(line){line.priority=Math.max(1,Math.min(3,line.priority+d));v8Refresh()}}

function v8linePause(id){let line=v8get().lines.find(x=>x.id===id&&x.f===s.player);if(line){line.active=!line.active;v8Refresh()}}

function v8canPay(f,price,recipe){if(s.gold[f]+1e-7<price)return 'Недостаточно денег';for(const [k,q] of Object.entries(recipe))if(q>0&&v8stock(f,k)+1e-7<q)return `Нет сырья: ${V8_MATERIALS[k]?.name||k}`;return ''}

function v8baseMonth(){let v=v8get();for(let f=0;f<F.length;f++){
  const regs=regOf(f);if(!regs.length)continue;
  const cultivated=Math.max(1,regs.reduce((n,x)=>n+(x.p.farm||0)*1.4+(x.p.workshop||0)*.09,0));
  const hills=regs.reduce((n,x)=>n+(N[x.i].terrain==='mountain'?1:N[x.i].terrain==='hill'?.5:0),0);
  const forests=regs.reduce((n,x)=>n+(N[x.i].terrain==='forest'||N[x.i].terrain==='taiga'?1:0),0);
  for(const [k,amount] of Object.entries({coal:hills*.12+cultivated*.03,saltpeter:cultivated*.12,sulfur:hills*.09,hemp:cultivated*.28,flax:cultivated*.28,leather:cultivated*.15,horses:cultivated*.12}))v8changeStock(f,k,amount);
  v8changeStock(f,'wood',forests*.05);
 }
 for(let [id,site] of Object.entries(v.sites)){let i=+id,p=s.provinces[i];if(!p)continue;let f=p.owner,geo=v7geology(i);if(site.coal)v8changeStock(f,'coal',site.coal*7*(1+geo.iron*.12));if(site.hemp)v8changeStock(f,'hemp',site.hemp*7);if(site.saltpeter)v8changeStock(f,'saltpeter',site.saltpeter*5);if(site.farm)v8changeStock(f,'food',site.farm*10);if(site.road)p.road=Math.max(p.road||0,site.road);if(site.depot)p.depot=Math.max(p.depot||0,site.depot);if(site.forge){let n=Math.min(site.forge*5,v8stock(f,'iron')/2,v8stock(f,'wood')*1.5);v8changeStock(f,'iron',-n*2);v8changeStock(f,'wood',-n*.66);v8changeStock(f,'steel',n)} }
 v8rebuildSupply();
}

function v8convoyCapacity(f){let v=v8get();return Math.round(v.convoys[f].merchant*40*(has(f,'v8_convoy')?1.2:1))}

function v8convoyUsed(f){return v8get().imports.filter(q=>q.f===f&&q.status==='sea').reduce((a,q)=>a+q.qty,0)}

function v8import(k,qty){qty=Number(qty);let v=v8get(),f=s.player,m=V8_MATERIALS[k];if(!m||!Number.isFinite(qty)||qty<=0)return;qty=Math.min(150,Math.round(qty));const sellers=F.map((_,i)=>i).filter(i=>i!==f&&!withWar(f,i)&&v8stock(i,k)>=qty+1).sort((a,b)=>v8stock(b,k)-v8stock(a,k));let seller=sellers[0];if(seller===undefined)return say('На доступных рынках нет достаточного объёма ресурсов');let sea=sellers.length?N.filter((n,i)=>s.provinces[i].owner===f&&n.port).length>0&&N.some((n,i)=>s.provinces[i].owner===seller&&n.port):false;if(sea&&v8convoyUsed(f)+qty>v8convoyCapacity(f))return say('Не хватает свободной вместимости торговых конвоев');let cash=Math.ceil(qty*m.price*(1+Math.max(0,-s.relations[f][seller])/200)),days=(sea?19:10)+Math.ceil(qty/25);if(s.gold[f]<cash)return say('Казна не покрывает импортный контракт');v8changeStock(f,'gold',-cash);v8changeStock(seller,'gold',cash);v8changeStock(seller,k,-qty);
 v.imports.push({id:++v.id,f,seller,resource:k,qty,days,total:days,status:sea?'sea':'road',cash,risk:sea?.065:0});log(`Импорт ${m.name.toLowerCase()}: ${qty} ${m.unit}, стоимость ${cash}, прибытие через ${days} дней.`);v8Refresh()}

function v8importsDay(){let v=v8get();for(let shipment of v.imports){shipment.days--;if(shipment.days>0)continue;let p=.04*(shipment.status==='sea'?1.8:1);let block=s.blockades.some(b=>b.to===CAP[shipment.f]||b.owner===shipment.seller);if(block)p+=.20;let escorts=v.seaOrders.filter(o=>o.f===shipment.f&&['escort','patrol'].includes(o.type)).reduce((a,o)=>a+(s.fleets.find(fl=>fl.id===o.fleetId)?v8shipsOf(s.fleets.find(fl=>fl.id===o.fleetId)).filter(sh=>sh.type!=='transport').length:0),0);p*=Math.max(.28,1-escorts*.20)*globalMod(shipment.f,'convoyLoss');if(shipment.status==='sea'&&Math.random()<p){let left=Math.max(0,Math.floor(shipment.qty*(.4+Math.random()*.6)));v8changeStock(shipment.f,shipment.resource,left);if(shipment.f===s.player)log(`Конвой атакован: доставлено ${left}/${shipment.qty} ${V8_MATERIALS[shipment.resource].name}.`)}else{v8changeStock(shipment.f,shipment.resource,shipment.qty);if(shipment.f===s.player)log(`Поставка прибыла: ${shipment.qty} ${V8_MATERIALS[shipment.resource].name}.`)} }v.imports=v.imports.filter(q=>q.days>0)}

function v8baseDaily(){let v=v8get();v8manufactureDay();v8importsDay();v8advanceSea();v8dailyArmySupply();if(s.day===1)v8baseMonth()}

function v8ownedPorts(f=s.player){return N.map((n,i)=>({n,i})).filter(({n,i})=>n.port&&s.provinces[i].owner===f).sort((a,b)=>distKm(a.n,N[CAP[f]||0])-distKm(b.n,N[CAP[f]||0]))}

function v8makeTransport(i=selected){let v=v8get(),p=s.provinces[i],f=s.player;if(!p||p.owner!==f||!N[i].port)return say('Выберите собственный морской порт');if(edu(f)<27)return say('Для закладки транспорта образование должно быть не ниже 27');const bill={gold:145*globalMod(f,'shipCost'),wood:70,iron:24,steel:5,copper:2,hemp:16,flax:12};let bad=Object.entries(bill).find(([k,q])=>v8stock(f,k)+1e-7<q);if(bad)return say(`Недостаток для транспорта: ${V8_MATERIALS[bad[0]]?.name||bad[0]}, требуется ${bad[1].toFixed(1)}`);for(let [k,q] of Object.entries(bill))v8changeStock(f,k,-q);v.transportQueue ||= [];v.transportQueue.push({id:++v.id,f,port:i,days:90,total:90});log(`${N[i].name}: транспорт заложен на верфи, срок 90 дней.`);v8Refresh()}

function v8transportDay(){const v=v8get();v.transportQueue ||= [];for(let q of v.transportQueue){if(--q.days>0)continue;let h=V6_HULLS.transport,d={id:++s.v6seq,type:'transport',name:'Транспортное судно',f:q.f,batteries:[{gun:'gun4',count:0}],tech:[]},hp=h.hp,ship={id:++s.v6seq,f:q.f,type:'transport',name:`Транспорт «${N[q.port].name}» №${s.v6seq%1000}`,design:d,port:q.port,hp,maxHp:hp,crew:75,crewMax:90,experience:0,fleetId:null,ammo:75,condition:100,transportCapacity:1600};s.ships.push(ship);if(q.f===s.player)log(`${N[q.port].name}: готов транспорт ${ship.name}, вместимость 1600 человек.`)}v.transportQueue=v.transportQueue.filter(x=>x.days>0)}

function v8seedTransport(){let v=v8get();if(v.seededTransport)return;v.seededTransport=true;let f=s.player,i=v8ownedPorts(f)[0]?.i;if(i===undefined)return;let h=V6_HULLS.transport,d={id:++s.v6seq,type:'transport',name:'Купеческий транспорт',f,batteries:[{gun:'gun4',count:0}],tech:[]};s.ships.push({id:++s.v6seq,f,type:'transport',name:f===0?'HMS Supply':'Королевский транспорт',design:d,port:i,hp:h.hp,maxHp:h.hp,crew:80,crewMax:90,experience:0,fleetId:null,ammo:100,condition:100,transportCapacity:1600})}

function v8unload(id){let fleet=s.fleets.find(x=>x.id===id&&x.f===s.player);if(!fleet||!(fleet.embarked||[]).length||!own(fleet.port))return say('Для разгрузки нужен собственный порт');let p=s.provinces[fleet.port],cnt=fleet.embarked.reduce((a,x)=>a+x.count,0);p.inf+=cnt;fleet.embarked=[];log(`Эскадра ${fleet.name}: выгружено ${cnt} полков в ${N[fleet.port].name}.`);v8Refresh()}

function v8amphibiousAssault(fleet,to){let port=s.provinces[to],troops=(fleet.embarked||[]).reduce((a,x)=>a+x.count,0);if(troops<1)return say('Десант отменён: полков нет на борту');let escort=v8shipsOf(fleet).filter(x=>x.type!=='transport').length,force=troops*(1+escort*.12)*(v8supplyOf(fleet.port)/100),def=Math.max(1,armies(port))*(1+(port.fort||0)*.25);let won=force*(.78+Math.random()*.35)>=def;if(won){let was=port.owner;port.owner=fleet.f;port.inf+=troops;fleet.embarked=[];fleet.port=to;for(let sh of v8shipsOf(fleet))sh.port=to;s._maprevision=(s._maprevision||0)+1;log(`${fleet.name}: десант взял ${N[to].name} у державы ${F[was].name}.`)}else{let losses=Math.max(1,Math.ceil(troops*.4));fleet.embarked=[{kind:'inf',count:Math.max(0,troops-losses)}].filter(x=>x.count>0);log(`У ${N[to].name} десант отбит. Потеряно ${losses} полков.`)}return won}

function v8fmt(x,d=0){return Number(x||0).toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d})}

function v8pic(key){let e=V6_EQUIP[key],src=V6_ART[e?.art||key]||V6_ART.industry;return `<img src="${src}" alt="${esc(e?.name||key)}" class="v8-line-image" loading="lazy">`}

function v8receiptText(k){return Object.entries(v8recipe(k)).filter(([_,q])=>q>0).map(([r,q])=>`<span class="${v8stock(s.player,r)>=q?'v8-good':'v8-bad'}">${V8_MATERIALS[r]?.icon||r} ${v8fmt(q,2)}</span>`).join(' · ')+` · ◈ ${v8fmt(v8unitCash(s.player,k),2)}`}

function v8overview(){let f=s.player,v=v8get(),idle=v8factoryLimit(f)-v8factoryAssigned(f),total=v.lines.filter(x=>x.f===f).reduce((a,x)=>a+x.produced,0),working=v.lines.filter(x=>x.f===f&&x.active&&x.factories&&!x.blocked).length;
 return `<div class="v8-kpi"><div><b>${v8factoryAssigned(f)} / ${v8factoryLimit(f)}</b><small>Заводы заняты / всего</small></div><div><b>${idle}</b><small>Свободные мануфактуры</small></div><div><b>${working}</b><small>Действующие линии</small></div><div><b>${v8fmt(total)}</b><small>Выпущено за кампанию</small></div><div><b>${v8fmt(s.gold[f])}</b><small>Монет в казне</small></div></div>`}

function v8buyMerchant(){let v=v8get(),f=s.player;if(s.gold[f]<135||s.wood[f]<22||v8stock(f,'hemp')<7)return say('Для купеческого судна: 135 монет, 22 древесины, 7 пеньки');v8changeStock(f,'gold',-135);v8changeStock(f,'wood',-22);v8changeStock(f,'hemp',-7);v.convoys[f].merchant++;v8Refresh()}

function v8addReserve(id){let sh=Number(document.getElementById('v8-addship')?.value);if(sh){v6addShip(id,sh);v8Refresh()}}

function v8launch(id,type){let to=Number(document.getElementById('v8-destination')?.value);if(!to)return say('Выберите порт назначения');v8orderSea(id,to,type)}

function v8topbar(){if(!s)return;let nav=document.getElementById('v8-global-nav');if(!nav)return;let f=s.player,v=v8get(),free=v8factoryLimit(f)-v8factoryAssigned(f),sailing=v.seaOrders.filter(x=>x.f===f).length;const sline=document.getElementById('v8-nav-stats');if(sline)sline.textContent=`Мануфактуры: ${v8factoryAssigned(f)}/${v8factoryLimit(f)} · свободно ${free} · эскадры в море: ${sailing} · конвои: ${v8convoyUsed(f)}/${v8convoyCapacity(f)}`}

function v8initToolbar(){if(!document.getElementById('v8-global-nav')){let nav=document.createElement('div');nav.id='v8-global-nav';nav.className='v8-global-nav';nav.innerHTML=`<button class="v8-nav-btn main" onclick="v8open('production','lines')">Производство</button><button class="v8-nav-btn" onclick="v8open('production','materials')">Экономика и сырьё</button><button class="v8-nav-btn" onclick="v8open('production','logistics')">Логистика</button><button class="v8-nav-btn" onclick="v8open('fleet')">Флот и операции</button><button class="v8-nav-btn" onclick="v8open('models')">3D-верфь и битвы</button><button class="v8-nav-btn" onclick="showTechTree('Пехотное оружие')">Дерево исследований</button><span id="v8-nav-stats" class="v8-nav-caption"></span>`;document.querySelector('.resourcebar').before(nav)}if(!document.getElementById('v8-backdrop')){let el=document.createElement('div');el.id='v8-backdrop';el.className='v8-backdrop';el.innerHTML='<div class="v8-window" id="v8-window"></div>';document.body.append(el)}v8topbar()}

function v8soldier(m,x,y,z,kind='inf',coat='#a8463a',motion=0){const h=.38;if(kind==='cav'){v8cube(m,x,y,z+.50,.80,.32,.35,'#6f523b');v8cube(m,x+.33,y,z+.64,.25,.24,.33,'#74533a');for(let dx of [-.24,.23])for(let dy of [-.12,.12])v8cylinder(m,[x+dx,y+dy,z+.35],[x+dx+motion*.07,y+dy,z],.045,'#51443b',6);z+=.78}
 v8cylinder(m,[x,y,z+.2],[x,y,z+.74],.13,coat,7);v8cylinder(m,[x,y,z+.78],[x,y,z+.97],.13,'#dfb696',7);v8cylinder(m,[x-.07,y,z+.10],[x-.07+motion*.05,y,z-.03],.055,'#30353a',6);v8cylinder(m,[x+.07,y,z+.10],[x+.07-motion*.05,y,z-.03],.055,'#30353a',6);v8cylinder(m,[x,y,z+.93],[x,y,z+1.08],.18,'#202c32',7);v8cylinder(m,[x,y-.14,z+.66],[x+.42,y-.14,z+.66],.026,'#41382d',6);if(kind==='inf')v8seg(m,[x+.40,y-.14,z+.65],[x+.67,y-.14,z+.84],'#a7a9a3',1.5)}

function v8battleCommand(cmd){let b=v8Battle,sc=V8_SCENE;if(!b||!sc)return;const unit=v8select3dUnit();if(cmd==='pause')sc.paused=!sc.paused;else if(cmd==='fire'){if(unit?.cooldown<=0)v8fire(unit);else say('Орудия ещё перезаряжаются')}else if(cmd==='left'&&unit)unit.turn=-1;else if(cmd==='right'&&unit)unit.turn=1;else if(cmd==='sail')b.sails=!b.sails;else if(cmd==='advance'&&unit){unit.order='advance'}else if(cmd==='retreat'&&unit){unit.order='retreat'}else if(cmd==='formation'&&unit){unit.form=unit.form==='line'?'column':'line';delete V8_MESH_CACHE[unit.kind+':'+unit.type+':'+unit.form]}}

function v8fire(u){let sc=V8_SCENE;if(!sc||u.hp<=0)return;let enemies=sc.units.filter(x=>x.team!==u.team&&x.hp>0),nearest=enemies.sort((a,b)=>Math.hypot(a.pos[0]-u.pos[0],a.pos[1]-u.pos[1])-Math.hypot(b.pos[0]-u.pos[0],b.pos[1]-u.pos[1]))[0];if(!nearest)return;let d=Math.hypot(nearest.pos[0]-u.pos[0],nearest.pos[1]-u.pos[1]);if(d>(sc.kind==='land'?42:62))return say('Цель вне дальности стрельбы');let angle=Math.atan2(nearest.pos[1]-u.pos[1],nearest.pos[0]-u.pos[0]),bearing=Math.abs(Math.atan2(Math.sin(angle-u.angle),Math.cos(angle-u.angle)));let firingArc=sc.kind==='land'?Math.PI*.85:(bearing>Math.PI*.22&&bearing<Math.PI*.88);if(!firingArc)return say('Борт не наведён на противника');let n=sc.kind==='land'?u.kind==='art'?24:11:Math.max(10,(u.firepower||22)*.35),hit= Math.max(1,n*(.4+Math.random()*.4)*(1-d/95));nearest.hp=Math.max(0,nearest.hp-hit);u.cooldown=sc.kind==='sea'?5.8:u.kind==='art'?6:3;for(let i=0;i<7;i++)sc.smoke.push({x:u.pos[0]+Math.random()*3,y:u.pos[1]+Math.random()*3,z:1+Math.random()*2,age:0});if(u.team==='friendly')v8Battle.lastHit=`${u.name} → ${nearest.name}: урон ${Math.round(hit)}`}

function v8sceneStep(dt){let sc=V8_SCENE,b=v8Battle;if(!sc||sc.paused)return;sc.time+=dt;if(b)b.elapsed+=dt;for(let u of sc.units){if(u.hp<=0)continue;u.cooldown=Math.max(0,(u.cooldown||0)-dt);if(sc.kind==='sea'&&u.kind==='ship'){u.angle+=(u.turn||0)*dt*.20;u.pos[0]+=Math.cos(u.angle)*dt*.22*(b?.sails===false&&u.team==='friendly'?.3:1);u.pos[1]+=Math.sin(u.angle)*dt*.22*(b?.sails===false&&u.team==='friendly'?.3:1);if(u.pos[0]>60)u.pos[0]=-60;else if(u.pos[0]<-60)u.pos[0]=60;if(u.team==='enemy'){let target=sc.units.find(x=>x.team==='friendly'&&x.hp>0);if(target){let angle=Math.atan2(target.pos[1]-u.pos[1],target.pos[0]-u.pos[0]);let diff=Math.atan2(Math.sin(angle-u.angle),Math.cos(angle-u.angle));u.turn=diff>0?1:-1;if(Math.abs(diff)>.48&&u.cooldown===0)v8fire(u)}}}else if(sc.kind==='land'){if(u.order==='advance'||u.order==='retreat'){let sign=u.team==='friendly'?1:-1;u.pos[0]+=(u.order==='advance'?sign:-sign)*dt*(u.kind==='cav'?3:u.form==='column'?1.8:.9);if(Math.abs(u.pos[0])>26)u.order=null}if(u.team==='enemy'&&u.cooldown<=0)v8fire(u)}}
 sc.smoke=sc.smoke.filter(x=>x.age<1.7);for(let x of sc.smoke)x.age+=dt;
 if(b&&Math.floor(b.elapsed*2)!==Math.floor((b.elapsed-dt)*2)){let hud=document.getElementById('v8-battle-hud');if(hud){let own=sc.units.filter(x=>x.team==='friendly'),foe=sc.units.filter(x=>x.team==='enemy'),sum=a=>Math.round(a.reduce((n,x)=>n+x.hp,0));hud.textContent=`Бой: ${Math.floor(b.elapsed/60)}:${String(Math.floor(b.elapsed%60)).padStart(2,'0')} · Свои ${sum(own)} HP · Противник ${sum(foe)} HP · ${b.lastHit||'Выберите часть и отдайте приказ'}`}}
 if(b&&sc.units.some(x=>x.team==='friendly')&&(!sc.units.some(x=>x.team==='enemy'&&x.hp>0)||!sc.units.some(x=>x.team==='friendly'&&x.hp>0)))v8finish3dBattle(sc.units.some(x=>x.team==='friendly'&&x.hp>0))}

function v8ExportCurrentOBJ(){let sc=V8_SCENE;if(!sc||!sc.units.length)return;let entity=sc.units[0],mesh=v8meshFor(entity),name=(entity.name||entity.kind||'model').replace(/[^a-z0-9а-яё _-]/ig,'').replace(/\s+/g,'_');let buf=['# Imperii Parusov VIII / procedural 3D model','o '+name];let k=0;for(let face of mesh.faces){for(let p of face.p)buf.push(`v ${p[0].toFixed(5)} ${p[1].toFixed(5)} ${p[2].toFixed(5)}`);buf.push(`f ${++k} ${++k} ${++k}`)}let blob=new Blob([buf.join('\n')],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(name||'ship')+'.obj';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000)}

function v9AddDesign(type){if(!V6_HULLS[type])return;s.shipDesigns||=[];v6makeDesign(type);v6FleetPage='designer';v8close();tab='fleet';drawAll();v7openWide('fleet')}

function v9PreviewHull(type){
 v8Window='models';v8initToolbar();document.getElementById('v8-backdrop').classList.add('open');
 const hull=V6_HULLS[type]||V6_HULLS.sloop;
 document.getElementById('v8-window').innerHTML=`<div class="v8-w-header"><div><h2>3D-верфь · ${esc(hull.label)}</h2><small>ОРИГИНАЛЬНЫЙ ПРОЦЕДУРНЫЙ КОРПУС · ПОВОРОТ МЫШЬЮ · КОЛЕСО — ПРИБЛИЖЕНИЕ</small></div><button onclick="v8close()">Закрыть</button></div><div class="v8-w-body"><div class="v9-ship-spec"><b>Артиллерийских мест: ${hull.max}</b><b>Экипаж: ${hull.crew}</b><b>Скорость: ${hull.speed} уз.</b><b>Водоизмещение: ${hull.tonnage} т</b><b>Строительство: ${hull.days} суток</b></div><canvas id="v8-canvas" style="display:block;width:100%;height:560px;border-radius:12px;background:#183644"></canvas><div class="v8-row"><button onclick="v8Rotate3D(-.24)">↶ Развернуть</button><button onclick="v8Rotate3D(.24)">↷ Развернуть</button><button onclick="v8Zoom3D(1.2)">+ Масштаб</button><button onclick="v8Zoom3D(.83)">− Масштаб</button><button onclick="v8ExportCurrentOBJ()">Экспорт OBJ</button></div></div>`;
 const design={batteries:hull.decks.map(d=>({gun:'gun4',count:Math.min(d.max,8)*2> d.max ? Math.floor(d.max/2)*2 : Math.min(8,d.max)}))};
 const ship={id:1,kind:'ship',type,design,meshKey:'v9_'+type,pos:[0,0,0],angle:0,hp:100,maxHp:100,team:'friendly',name:hull.label};
 v8startScene({kind:'preview',units:[ship],time:0,smoke:[],yaw:.7,pitch:.34,scale:type==='line'?3.15:4.05,cx:0,cy:0,paused:true});
}

function v9EnsureDiplomacy(){if(document.getElementById('v9-diplomacy'))return;
 let div=document.createElement('aside');div.id='v9-diplomacy';div.className='v9-diplomacy';div.setAttribute('aria-label','Дипломатические переговоры');document.body.append(div);
 document.addEventListener('contextmenu',e=>{const p=e.target.closest?.('#map [data-i]');if(!p)return;e.preventDefault();e.stopPropagation();if(!s)return;const id=Number(p.getAttribute('data-i'));if(!Number.isInteger(id)||!s.provinces[id])return;selected=id;v9SelectedDiplomat=s.provinces[id].owner;dipTarget=v9SelectedDiplomat;v9RenderDip();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')v9CloseDip()});
 document.addEventListener('pointerdown',e=>{if(!e.target.closest?.('#v9-diplomacy')&&!e.target.closest?.('#map [data-i]'))v9CloseDip()});
}

function v9DipAct(action){if(v9SelectedDiplomat==null)return;dipTarget=v9SelectedDiplomat;dip(action);v9RenderDip()}

function v9state(){const v=v8get();v.v9 ||= {contracts:[],lastRun:-1};return v.v9}

function v9FindRoute(f,t){const myPorts=v8ownedPorts(f),theirPorts=v8ownedPorts(t);let sea=myPorts.length>0&&theirPorts.length>0;let a=N[CAP[f]]||N[0],b=N[CAP[t]]||N[1],km=Math.max(250,distKm(a,b));return {sea,km,days:Math.round((sea?11:6)+km/(sea?330:155))}}

function v9MarketQuote(t,k,qty){let f=s.player,base=V8_MATERIALS[k]?.price||1,r=s.relations[f][t],route=v9FindRoute(f,t),tariff=withTrade(f,t)?.92:1.13,risk=1+Math.max(0,-r)/220;
 return {total:Math.ceil(qty*base*tariff*risk*(1+Math.min(.18,route.km/30000))),days:route.days+Math.ceil(qty/35),route};}

function v9Buy(){v9Seller=+document.getElementById('v9-market-seller')?.value;v9Resource=document.getElementById('v9-market-resource')?.value||'iron';v9Amount=+document.getElementById('v9-market-qty')?.value||25;v9PlaceTrade(v9Seller,v9Resource,v9Amount)}

function v9NewContract(){let seller=+document.getElementById('v9-market-seller')?.value,k=document.getElementById('v9-market-resource')?.value,qty=+document.getElementById('v9-market-qty')?.value;
 let minStock=+document.getElementById('v9-market-target')?.value;if(!V8_MATERIALS[k]||!F[seller]||seller===s.player||qty<1||minStock<0)return say('Неверные данные торгового договора');
 const c={id:++v8get().id,seller,resource:k,qty:Math.min(300,Math.round(qty)),target:Math.round(minStock||qty*2),frequency:30,nextTick:v9DayIndex()+30,enabled:true};v9state().contracts.push(c);log(`Открыт долгосрочный договор: ${F[seller].name}, ${V8_MATERIALS[k].name}, ежемесячно до ${c.target} ед.`);v8Refresh(false)}

function v9DayIndex(){return ((s.year-1700)*12+s.month-1)*31+s.day}

function v9ContractsDaily(){if(!s||!s.v8)return;let state=v9state(),now=v9DayIndex();if(state.lastRun===now)return;state.lastRun=now;
 for(let c of state.contracts){if(!c.enabled||now<c.nextTick)continue;c.nextTick=now+(c.frequency||30);let inTransit=s.v8.imports.filter(q=>q.f===s.player&&q.resource===c.resource).reduce((x,q)=>x+q.qty,0),need=c.target-v8stock(s.player,c.resource)-inTransit;if(need<=0)continue;v9PlaceTrade(c.seller,c.resource,Math.min(c.qty,Math.floor(need)),true)}
}

function v9ContractToggle(id){const c=v9state().contracts.find(x=>x.id===id);if(c)c.enabled=!c.enabled;v8Refresh(false)}

function v9ContractDelete(id){const st=v9state();st.contracts=st.contracts.filter(x=>x.id!==id);v8Refresh(false)}

function v9Needs(){let f=s.player,needs={};for(let k of Object.keys(V8_MATERIALS))needs[k]=0;
 for(let line of v8get().lines.filter(x=>x.f===f&&x.active&&x.factories>0)){let eq=V6_EQUIP[line.key];if(!eq)continue;let rate=line.factories*globalMod(f,'arsenalSpeed')*(.35+(line.eff||.15)*.65)/Math.max(.04,eq.work||1);let recipe=v8recipe(line.key,f);for(let [k,amount] of Object.entries(recipe))if(k in needs)needs[k]+=rate*amount}
 return needs;
}

function v9QuoteUpdate(){const el=document.getElementById('v9-trade-quote');if(!el)return;let t=+document.getElementById('v9-market-seller')?.value,k=document.getElementById('v9-market-resource')?.value,q=+document.getElementById('v9-market-qty')?.value;let v=v9MarketQuote(t,k,q||1);el.textContent=`${F[t]?.name||''} · ${v.total} монет · ${v.days} дней · ${v.route.sea?'морской конвой':'сухопутный тракт'}`}

function v9SourceDirectory(k){if(!V8_MATERIALS[k])return '';let own=[];for(let i=0;i<N.length;i++)if(s.provinces[i].owner===s.player){own.push({i,score:v9ResourcePotential(i,k)})}own.sort((a,b)=>b.score-a.score);return `<div class="v9-source-table"><h4>Перспективные районы · ${V8_MATERIALS[k].name.toLowerCase()}</h4><div class="v9-sources">${own.slice(0,6).map(({i,score})=>`<button onclick="v9LocateProvince(${i})"><strong>${esc(N[i].name)}</strong><small>${esc(TERR[N[i].terrain]?.[0]||N[i].terrain)} · условный потенциал: ${score}/7</small></button>`).join('')}</div><p>Геологическая оценка является игровой реконструкцией, а не исторической геологической картой. Для железа и меди требуются рудники; для стали — кузница и топливо.</p></div>`}

function v9SourceChange(){let k=document.getElementById('v9-source-key')?.value||'iron';let e=document.getElementById('v9-source-content');if(e)e.innerHTML=v9SourceDirectory(k)}

function v10n(n){return Math.max(0,Math.round(n||0)).toLocaleString('ru-RU')}

function v10fmtPop(n){return n>=1e6?+(n/1e6).toFixed(2)+' млн':n>=1e3?+(n/1e3).toFixed(1)+' тыс.':v10n(n)}

function v10pc(n){return Math.max(0,Math.min(100,Number(n)||0))}

function v10bar(label,value,color='#bfa473',text=null){return `<div class="v10-barrow"><span>${label}</span><div class="v10-bar"><i style="width:${v10pc(value)}%;background:${color}"></i></div><b>${text===null?Math.round(value)+'%':text}</b></div>`}

function v10initDemography(){if(!s)return;if(s.demography&&s.demography.population?.length===N.length&&s.demography.manpower?.length===N.length)return;
 const sums=F.map((_,f)=>N.reduce((a,n,i)=>a+((s.provinces[i].owner===f)?Math.max(.001,n.pop||.02):0),0));
 const d={version:10,population:[],manpower:[],bornTotal:0,conscripted:0,monthlyDelta:0,lastPeriod:'',snapshot:[]};
 for(let i=0;i<N.length;i++){let f=s.provinces[i].owner;let share=Math.max(.001,N[i].pop||.02)/Math.max(1,sums[f]);let p=Math.max(55,Math.round((V10_START_POP[f]||2)*1e6*share));d.population.push(p);d.manpower.push(Math.round(p*.055))}
 d.snapshot=F.map((_,f)=>v10NationalPop(f,d));s.demography=d;
}

function v10NationalPop(f,d=s.demography){if(!d?.population)return 0;let pop=0;for(let i=0;i<N.length;i++)if(s.provinces[i].owner===f)pop+=d.population[i]||0;return pop}

function v10PopulationMonth(){v10initDemography();let d=s.demography,f=s.player,old=d.snapshot?.[f]||v10NationalPop(f),national=F.map((_,k)=>v10NationalPop(k,d)),changes=0;
 for(let i=0;i<N.length;i++){let p=d.population[i];if(!p)continue;let o=s.provinces[i],owner=o.owner,rate=.00078,unrest=o.unrest||0;if(unrest>60)rate-=.00055;if(s.food[owner]<Math.max(1,national[owner]/1e6*.6))rate-=.00115;if(s.wars.some(w=>w.split(':').includes(String(owner))))rate-=.00016;
  let delta=Math.round(p*rate);d.population[i]=Math.max(40,p+delta);d.manpower[i]=Math.min(Math.round(d.population[i]*.075),Math.max(0,(d.manpower[i]||0)+Math.max(0,Math.round(p*.00016))));if(owner===f)changes+=delta}
 let pop=v10NationalPop(f);d.monthlyDelta=pop-old;d.snapshot=F.map((_,k)=>v10NationalPop(k,d));d.lastPeriod=`${s.month}/${s.year}`;
 // Civilian mouths consume food every month; hungry states face demographic losses above.
 for(let k=0;k<F.length;k++){let popk=d.snapshot[k]||0;s.food[k]=Math.max(0,(s.food[k]||0)-popk/1e6*.27);s.gold[k]+=(popk/1e6)*.045*(s.stability[k]/100)}
}

function v10ApplyChrome(){const tabs=document.getElementById('tabs');if(tabs)for(let btn of tabs.querySelectorAll('button[data-tab]')){let id=btn.dataset.tab;if(btn.dataset.v10icon)continue;btn.dataset.v10icon='yes';const span=document.createElement('span');span.className='v10-tabglyph';span.innerHTML=v10icon(id,19);btn.prepend(span)};let logo=document.querySelector('.brand small');if(logo)logo.textContent='КОРОНЫ • МАНУФАКТУРЫ • ФЛОТ • КАРТА ЕВРОПЫ'}

function v14flag(f){const c=F[f]?.color||'#666'; const nm=F[f]?.name||''; const initials=nm.split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase(); return v14svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 56"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect x="1" y="1" width="86" height="54" rx="5" fill="url(#g)" stroke="#d3b074" stroke-width="2"/><rect x="1" y="1" width="86" height="14" fill="#132130" opacity=".45"/><text x="44" y="36" text-anchor="middle" fill="#fff4d9" font-size="21" font-family="Georgia">${initials}</text></svg>`)}

function v14ApplyTheme(){if(document.getElementById('v14-style'))return; const st=document.createElement('style'); st.id='v14-style'; st.textContent=`
 body{background:radial-gradient(circle at 20% -10%,#234660 0,transparent 25%),linear-gradient(180deg,#071018,#0b151d 30%,#081119 100%)!important;color:#f0e7d2}
 .top{padding:6px 16px 10px!important;background:linear-gradient(180deg,#112130,#09131a 46%,#081117 100%)!important;border-bottom:1px solid #8b6a39!important;box-shadow:0 10px 32px rgba(0,0,0,.36)!important}
 .brand h1{font:700 34px/1 Georgia,serif!important;color:#ecd59c!important;letter-spacing:.5px}.brand small{font-size:10px!important;letter-spacing:3px!important;color:#c3ced1!important}
 .turn{background:linear-gradient(180deg,#1a2f3f,#10202b)!important;border:1px solid #66553a!important;border-radius:6px!important;color:#f0d9a4!important;font:700 16px Georgia,serif!important;padding:12px 20px!important}
 .speed button,.topactions button{background:linear-gradient(180deg,#203646,#12202a)!important;border:1px solid #596a73!important;border-radius:4px!important;color:#ecdfc5!important;min-height:38px!important}.topactions button.main{background:linear-gradient(180deg,#b48e54,#6e512c)!important;border-color:#dab97c!important}
 .resourcebar{padding:10px 18px!important;background:linear-gradient(180deg,#101a23,#091118)!important;border-top:1px solid rgba(255,255,255,.04)!important;border-bottom:1px solid #6f5836!important;gap:8px!important}.resource{min-width:96px!important;padding:10px 10px 8px!important;background:linear-gradient(180deg,#172631,#0f1820)!important;border:1px solid #5d4c32!important;border-radius:5px!important}.resource b{font:700 24px Georgia,serif!important;color:#f0d9a4!important}.resource span{font-size:10px!important;letter-spacing:1.4px!important;color:#c2ccd0!important;text-transform:uppercase}
 .shell{padding:10px!important;gap:10px!important;display:grid!important;grid-template-columns:1.45fr .55fr!important}.mapframe{border:1px solid #715737!important;border-radius:8px!important;background:#092333!important;box-shadow:0 0 0 1px rgba(211,177,112,.12),0 14px 40px rgba(0,0,0,.35),inset 0 0 36px rgba(0,0,0,.45)!important;overflow:hidden}.maptools{padding:8px 10px!important;background:linear-gradient(180deg,#162734,#0f1a21)!important;border-bottom:1px solid #715737!important}.maptools button,.mode{background:linear-gradient(180deg,#213847,#15242d)!important;border:1px solid #596973!important;border-radius:4px!important;color:#eee1c7!important}.mode.chosen,.tabs button.active{background:linear-gradient(180deg,#b58d52,#6e512c)!important;border-color:#d8b67a!important;color:#fff5e0!important}.mapviewport{background:#082030!important}
 #map{background:radial-gradient(ellipse at 50% 30%,#2b6989 0,#17415d 35%,#0a2434 75%,#07141d 100%)!important}
 .sidebar{display:grid!important;grid-template-rows:auto auto 1fr!important;gap:10px!important}.panel{background:linear-gradient(180deg,#162734,#0f181f)!important;border:1px solid #715737!important;border-radius:8px!important;box-shadow:0 0 0 1px rgba(211,177,112,.08),0 10px 28px rgba(0,0,0,.26)!important}.panel h2,.panel h3{font-family:Georgia,serif!important;color:#ecd59c!important}.headingrow{border-bottom:1px solid #53462f!important;padding-bottom:6px!important}.badge{background:linear-gradient(180deg,#223846,#12212b)!important;border:1px solid #7d6540!important;color:#efdbab!important}
 .tabs{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}.tabs button{padding:11px 4px!important;background:linear-gradient(180deg,#213847,#14242d)!important;border:1px solid #566772!important;border-radius:4px!important;color:#f1e4cb!important;font-weight:700!important}
 .feed{max-height:260px!important;background:linear-gradient(180deg,#101a22,#0b1218)!important}.feed li{border-bottom:1px solid rgba(255,255,255,.05)!important;color:#d7d0bf!important}
 .foot{padding:7px 18px!important;background:#071018!important;border-top:1px solid #6e5635!important;color:#8fa4ab!important}
 .majorlabel{font:700 27px Georgia,serif!important;fill:#f2ead4!important;stroke:#1a2229!important;stroke-width:3!important;letter-spacing:1.2px}.majorlabel.subtle{font-size:14px!important}
 .sea-label{fill:#7fb4c8!important;font:italic 18px Georgia,serif!important;letter-spacing:3px!important;opacity:.52!important}
 .province{stroke:#352515!important;stroke-width:1.05!important}
 .v14-flagwrap{display:flex!important;align-items:center!important;gap:8px!important;padding:2px 8px!important;border:1px solid #7c6440!important;border-radius:6px!important;background:linear-gradient(180deg,#223746,#13222c)!important;cursor:pointer}.v14-flag{width:60px!important;height:38px!important;display:block;border:1px solid #d1b075;border-radius:4px}
 .v14-overview{display:grid;gap:10px}.v14-hero{display:grid;grid-template-columns:88px 1fr;gap:10px;align-items:start}.v14-hero img{width:88px;height:108px;object-fit:cover;border:1px solid #c5a873;border-radius:6px}.v14-hero h3{margin:2px 0 4px!important;font:700 28px Georgia,serif!important;color:#f0d8a5}.tiny-label{font-size:10px!important;letter-spacing:1.8px!important;color:#c0ccd0!important;text-transform:uppercase}.v14-kpi{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v14-kpi .box{padding:10px 8px;border:1px solid #485968;border-radius:6px;background:linear-gradient(180deg,#162531,#101a22);text-align:center}.v14-kpi .box b{display:block;font:700 28px Georgia,serif;color:#f0d8a5}.v14-kpi .box span{display:block;font-size:11px;color:#bfc9cc}.v14-idea{margin-top:2px;padding:8px;border:1px solid #485968;border-radius:6px;background:#111a21}.v14-row{display:flex;justify-content:space-between;gap:10px;padding:2px 0;font-size:12px}.v14-row span{color:#c0c9cd}.v14-row b{color:#f0e0be}.good{color:#93d08a!important}.v14-council{display:flex;gap:6px;margin-top:8px}.v14-council img{width:42px;height:52px;object-fit:cover;border:1px solid #c4a873;border-radius:4px}
 .modal{background:linear-gradient(180deg,#162734,#0f181f)!important;border:1px solid #7b6240!important;border-radius:8px!important}.modal h2,.modal h3{font-family:Georgia,serif!important;color:#ecd59c!important}
 .v14-techmodal{width:min(1700px,95vw)!important;max-width:none!important}.v14-techhead{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding-bottom:10px;border-bottom:1px solid #574a32}.v14-techhead h2{margin:0;font:700 34px Georgia,serif;color:#efd79f}.v14-techcats{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.v14-techcats button{background:linear-gradient(180deg,#223746,#14232d);border:1px solid #5f6e77;border-radius:4px;color:#f1e3c9;padding:10px 14px}.v14-techcats button.active{background:linear-gradient(180deg,#b58d52,#6e512c);border-color:#d8b67a}.v14-techgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.v14-techcard{position:relative;padding:8px;border:1px solid #54442f;border-radius:8px;background:linear-gradient(180deg,#182734,#111920)}.v14-techcard img{width:100%;height:118px;object-fit:cover;border-radius:6px;border:1px solid #a0885b;background:#d6c6a7}.v14-techcard h4{margin:8px 0 4px;font:700 18px Georgia,serif;color:#efd6a0}.v14-techcard small{display:block;color:#b8c4c8;min-height:34px}.v14-ribbon{position:absolute;top:8px;right:8px;padding:4px 7px;background:rgba(10,16,20,.85);border:1px solid #806640;border-radius:4px;font-size:11px;color:#f0d8a5}.v14-eff{display:flex;justify-content:space-between;gap:10px;font-size:12px}.v14-eff span{color:#b7c3c6}.v14-eff b{color:#9dd1a0}.v14-techfoot{display:flex;justify-content:space-between;align-items:center;margin-top:8px}.v14-req{font-size:11px;color:#ceb98d;min-height:26px}
 .v14-fleetlead,.v14-cannondeck{margin-bottom:12px}.v14-fleetgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v14-fleetcard{display:grid;grid-template-columns:148px 1fr;gap:10px;padding:8px;border:1px solid #55452f;border-radius:8px;background:linear-gradient(180deg,#182734,#111a22)}.v14-fleetcard img{width:148px;height:95px;object-fit:cover;border-radius:6px;border:1px solid #a58d62;background:#d1c09d}.v14-cannongrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v14-cannoncard{padding:8px;border:1px solid #54442f;border-radius:8px;background:linear-gradient(180deg,#182835,#101820)}.v14-cannoncard img{width:100%;height:110px;object-fit:cover;border-radius:6px;border:1px solid #9d8457;background:#d8caad}.v14-c-head h4{margin:6px 0 2px;font:700 18px Georgia,serif;color:#efd6a0}.v14-c-head small{color:#b6c2c7}.v14-barline{display:grid;grid-template-columns:110px 1fr 56px;gap:8px;align-items:center;font-size:11px;margin-top:5px}.v14-barline span{color:#b6c2c7}.v14-bar{height:8px;border-radius:999px;background:#182430;overflow:hidden}.v14-bar i{display:block;height:100%;border-radius:999px}
 @media (max-width:1500px){.shell{grid-template-columns:1fr!important}.v14-techgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.v14-fleetgrid,.v14-cannongrid{grid-template-columns:1fr}}
 `; document.head.appendChild(st)}

function v14bar(label,val,max,color,text){const pc=Math.max(6,Math.min(100,Math.round((val/max)*100)));return `<div class="v14-barline"><span>${label}</span><div class="v14-bar"><i style="width:${pc}%;background:${color}"></i></div><b>${text||val}</b></div>`}

function v14gunArt(key){try{return (typeof V6_ART!=='undefined'&&V6_ART[key])?V6_ART[key]:((typeof V6_ART!=='undefined'&&V6_ART.cannon)?V6_ART.cannon:'')}catch(e){return ''}}

function v14Cannon(c){const fire=(c.atk*10).toFixed(1), pen=Math.round(c.atk*8+c.lb/2), rng=c.range, rel=Math.round(100/Math.max(.7,c.reload));return `<div class="v14-cannoncard"><img src="${v14gunArt(c.id)}" alt="${c.lb}"><div class="v14-c-head"><h4>${c.lb}-фунтовая морская пушка</h4><small>${c.category}</small></div>${v14bar('Огневая мощь',c.atk,7.5,'#67af81',fire)}${v14bar('Бронепробитие',pen,90,'#d1b25a',pen)}${v14bar('Дальность',rng,900,'#5ca9d3',rng+' м')}${v14bar('Перезарядка',rel,100,'#c96c5a',rel+'%')}${v14bar('Производство',Math.max(10,50-c.lb/1.4),50,'#8b8f95','−'+Math.min(30,Math.round(c.lb/2))+'%')}</div>`}

function v15Hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}

function v15Random(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}

function v15Get(){if(!s)return null;s.v15 ||= {training:[],unlocked:[],next:1,created:15};return s.v15}

function v15SelectedReg(){let r=v15Regiments(selected);return r.find(x=>x.id===v15RegId)||r[0]}

function v15CannonStats(c,f=0){return {damage:c.atk*globalMod(f,'gunDamage'),penetration:c.lb*(globalMod(f,'gunAccuracy')||1),range:c.range,reload:Math.max(1.5,4.7*c.reload/Math.max(.5,globalMod(f,'gunReload')))}}

function v15Switch(tab){v15OverlayTab=tab;v15Render()}

function v15Rail(){if(!s)return;const el=document.getElementById('v15-rail');if(!el)return;const f=s.player,monarch=NATIONAL[f];let advisers=(s.advisers[f]||[]).map(id=>ADVISERS.find(x=>x.id===id)).filter(Boolean);
 el.innerHTML=`<div class="v15-railhead"><img src="${V15_PEOPLE[monarch.ruler]}" alt=""><div><small>${esc(F[f].name)}</small><h3>${esc(monarch.ruler)}</h3><span>${esc(monarch.title)}</span></div></div><div class="v15-railmetric"><span>Стабильность</span><b>${Math.round(s.stability[f])}%</b></div>${v15Gauge('Образование',edu(f),100,'#c9b373',edu(f).toFixed(1))}<h4>Совет короны</h4>${advisers.map(a=>`<button class="v15-person" onclick="tab='court';drawAll();v15Open('research')"><img src="${V15_PEOPLE[a.id]}" alt=""><span><b>${esc(a.name)}</b><small>${esc(a.role)}</small>${Object.entries(a.mods).slice(0,1).map(([k,v])=>`<strong>${esc(BONUS_NAMES[k]||k)} ${v<1?'−':'+'}${Math.round(Math.abs(v-1)*100)}%</strong>`).join('')}</span></button>`).join('')||'<small>Советники ещё не назначены</small>'}<h4>Управление</h4><button class="v15-main" onclick="v15Open('fleet')">Адмиралтейство ↗</button><button onclick="v15Open('regiments')">Оснащение армии ↗</button><button onclick="v15Open('research')">Технологии ↗</button><button onclick="v15Open('industry')">Мануфактуры ↗</button><button onclick="tab='court';drawAll()">Правитель и совет ↗</button>`;}

function v15Install(){if(document.getElementById('v15-overlay'))return;
 const ov=document.createElement('div');ov.id='v15-overlay';ov.innerHTML='<div id="v15-window"></div>';ov.onclick=e=>{if(e.target===ov)v15Close()};document.body.appendChild(ov);
 const rail=document.createElement('aside');rail.id='v15-rail';rail.className='v15-rail';document.querySelector('.shell')?.prepend(rail);
 const dock=document.createElement('section');dock.id='v15-bottomdock';dock.innerHTML=`<button onclick="v15Open('industry')"><img src="${(typeof V6_ART!=='undefined'&&V6_ART.industry)||''}" alt=""><span><b>Производство</b><small>Заводы · склады · импорт</small></span></button><button onclick="v15Open('regiments')"><img src="${(typeof V6_ART!=='undefined'&&V6_ART.infantry)||''}" alt=""><span><b>Армии</b><small>Полки · снаряжение · учения</small></span></button><button onclick="v15Open('fleet')"><img src="${(typeof V6_ART!=='undefined'&&V6_ART.ship)||''}" alt=""><span><b>Флот</b><small>Эскадры · 3D · артиллерия</small></span></button>`;
 document.querySelector('.primary-column')?.appendChild(dock);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('v15-overlay')?.classList.contains('open')){e.preventDefault();v15Close()}});
}

function v15ApplyCSS(){if(document.getElementById('v15-style'))return;let style=document.createElement('style');style.id='v15-style';style.textContent=`
/* АТЛАС ИМПЕРИЙ XV · Топография и кабинет управления */
.shell{grid-template-columns:265px minmax(0,1fr)!important;gap:9px!important;max-width:none!important}
.shell>.v15-rail{grid-column:1;grid-row:1/4;align-self:start;position:sticky;top:8px;max-height:calc(100vh - 16px);overflow:auto;scrollbar-width:thin}
.shell>.primary-column{grid-column:2;grid-row:1}.shell>.sidebar{grid-column:2;grid-row:2;display:grid!important;grid-template-columns:1fr 1.2fr;gap:10px!important;align-items:start}.shell>.sidebar>.panel:last-child{display:none}.shell>.sidebar>.panel:nth-child(2){grid-column:2}
.v15-rail{background:linear-gradient(115deg,#172a34,#0b161f);border:2px ridge #b09159;border-radius:7px;padding:9px;box-shadow:0 8px 26px #0009,inset 0 0 0 2px #0b1720}
.v15-railhead{display:grid;grid-template-columns:95px 1fr;gap:9px;border-bottom:1px solid #8a6c42;padding:3px 0 12px}.v15-railhead img{width:95px;height:130px;object-fit:cover;border:2px solid #b18d54}.v15-railhead small{color:#aab5bb}.v15-railhead h3{margin:7px 0!important;font:700 19px Georgia,serif;color:#f1d7a3}.v15-railhead span{color:#c2b397;font-size:11px}
.v15-railmetric{display:flex;justify-content:space-between;padding:8px 0;color:#d5c7af}.v15-rail h4{font:700 16px Georgia,serif;color:#e4c48d;margin:13px 0 8px;border-bottom:1px solid #705634;padding-bottom:4px}
.v15-person{display:grid;grid-template-columns:54px 1fr;gap:7px;width:100%;text-align:left;background:linear-gradient(100deg,#1e313a,#0e1d28)!important;border:1px solid #80633c!important;padding:5px!important;margin:6px 0}.v15-person img{width:54px;height:72px;object-fit:cover;border:1px solid #b79b66}.v15-person small,.v15-person strong{display:block;font-size:10px;margin-top:3px}.v15-person strong{color:#9ed7a8}.v15-person b{font:700 13px Georgia,serif;color:#f2ddb1}
.v15-rail>button:not(.v15-person){display:block;width:100%;margin-top:6px;font-weight:700}.v15-main{background:linear-gradient(180deg,#b28b4b,#684923)!important;border-color:#d9b377!important;color:#fcf0d3!important}
#v15-bottomdock{margin:10px 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}#v15-bottomdock>button{display:grid;grid-template-columns:108px 1fr;text-align:left;align-items:center;gap:8px;background:linear-gradient(145deg,#213340,#101b24);border:1px solid #8b6e44;padding:6px;height:102px}#v15-bottomdock img{width:108px;height:84px;object-fit:cover;background:#bdad8f;border:1px solid #bba170}#v15-bottomdock b{display:block;font:700 20px Georgia,serif;color:#f1daaa}#v15-bottomdock small{display:block;font-size:11px;margin-top:6px;color:#a9bec5}
#map{filter:contrast(1.06) saturate(1.05)}#map .province{stroke:#30261c!important;stroke-width:.95!important;fill-opacity:.96}#map .province:hover{stroke:#d7bc7a!important;stroke-width:2.4!important}#map .coastline{stroke:#e0cc93!important;opacity:.67!important}#map .sea-label{opacity:.7!important}
#v15-overlay{display:none;position:fixed;inset:0;z-index:999;background:rgba(1,8,12,.89);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:12px}#v15-overlay.open{display:flex}
#v15-window{width:min(1550px,100%);height:min(900px,96vh);display:flex;flex-direction:column;background:linear-gradient(175deg,#233342,#101b25 24%,#0c151e);border:3px ridge #ad884f;border-radius:10px;box-shadow:0 20px 70px #000d,inset 0 0 0 2px #121c22;overflow:hidden;color:#e8dfc9}
.v15-h-header{padding:10px 13px;border-bottom:2px ridge #a78a5a;display:flex;justify-content:space-between;align-items:center;gap:14px;background:linear-gradient(#253b46,#13232e)}.v15-h-header small{font-size:10px;color:#b9c8cb;letter-spacing:1.7px}.v15-h-header h2{margin:2px 0;font:700 27px Georgia,serif;color:#f3dca9}.v15-h-header nav{display:flex;flex-wrap:wrap;gap:5px}.v15-h-header button{padding:9px 11px;border-radius:3px}.v15-h-header button.on{background:linear-gradient(#a9824a,#654622);color:#fff4d5;border-color:#d3b273}.v15-close{font-size:20px}
.v15-h-body{padding:14px;overflow:auto;flex:1;scrollbar-color:#70593a #101924}.v15-h-body h3{font:700 20px Georgia,serif;color:#eccc8f;margin:7px 0 12px}.v15-h-body p{font-size:12px;color:#b7c8ca;line-height:1.5}
.v15-docklayout,.v15-reglayout{display:grid;grid-template-columns:37% minmax(0,1fr);gap:14px;align-items:start}.v15-docklist,.v15-reglist,.v15-dockhero,.v15-regmain{background:linear-gradient(145deg,#1b2d39,#111d26);border:1px solid #79613c;border-radius:7px;padding:10px;min-width:0}
.v15-shiptile,.v15-regtile{width:100%;display:grid;grid-template-columns:125px 1fr;gap:10px;text-align:left;align-items:center;padding:6px;margin:6px 0;border:1px solid #3f5865;background:#111f29;border-radius:5px}.v15-shiptile.selected,.v15-regtile.selected,.v15-equipment button.selected{border-color:#d7b277;background:#36402f}.v15-shiptile img,.v15-regtile img{width:125px;height:78px;object-fit:cover;background:#ad9d80;border:1px solid #9f885c}.v15-shiptile b,.v15-regtile b{font:700 15px Georgia,serif;color:#f1d7a0;display:block}.v15-shiptile small,.v15-regtile small{display:block;color:#b0c1c8;margin:5px 0}
.v15-shiptitle{display:flex;justify-content:space-between;gap:10px;align-items:center}.v15-shiptitle h3{font:700 27px Georgia,serif!important;margin:0!important}.v15-shipimage{position:relative;margin:10px 0;border:2px solid #b59665;border-radius:7px;overflow:hidden;background:#2c4654}.v15-shipimage>img{display:block;width:100%;height:215px;object-fit:cover}.v15-shipimage>div{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-around;gap:5px;background:#0b131bdc;padding:10px 5px;color:#edd8aa}
.v15-shipactions{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0 15px}.v15-batteries{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.v15-batteries>div{display:grid;border:1px solid #5d523f;padding:5px;border-radius:5px;background:#13202b}.v15-batteries img{width:100%;height:90px;object-fit:cover;background:#bfac88}.v15-batteries span{color:#b7c5ca;font-size:11px;margin-top:5px}.v15-batteries b{color:#ead4a6}
.v15-gauge{display:grid;grid-template-columns:105px 1fr 64px;gap:8px;align-items:center;margin:7px 0;font-size:11px}.v15-gauge>span{color:#c3cbd0}.v15-gauge>i{display:block;height:10px;background:#111923;border:1px solid #485d66;overflow:hidden;border-radius:8px}.v15-gauge>i>b{display:block;height:100%;border-radius:8px}.v15-gauge strong{text-align:right;color:#e7d5a9}
.v15-regscene{display:grid;grid-template-columns:1fr 125px;gap:10px;border:1px solid #716142;padding:8px;background:#182938;margin-bottom:10px}.v15-regscene>img{width:100%;height:180px;object-fit:cover;background:#c9b99c}.v15-regscene>div img{width:105px;height:145px;object-fit:cover;border:1px solid #c4a46f}.v15-regscene>div strong{font:700 14px Georgia,serif;color:#e7d5a9;display:block;margin:0 0 6px}
.v15-equipment{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.v15-equipment>button{background:#1b2b36;border:1px solid #615238;padding:5px;text-align:left}.v15-equipment img{width:100%;height:85px;object-fit:cover;background:#ccb895}.v15-equipment b,.v15-equipment small{display:block}.v15-equipment b{color:#ead2a3;margin:4px 0}.v15-equipment small{color:#adbec5;font-size:10px}
.v15-numbers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:5px 0 15px}.v15-numbers>div{padding:12px;border:1px solid #6e583a;background:#14222c}.v15-numbers small{display:block;color:#afc2c8}.v15-numbers b{font:700 22px Georgia,serif;color:#edd5a4}
.v15-techgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.v15-technode{padding:7px;border:1px solid #635237;border-radius:6px;background:#15242f}.v15-technode.done{outline:1px solid #769e70}.v15-technode.available{outline:1px solid #c1a06a}.v15-techpicture img{width:100%;height:130px;object-fit:cover;background:#bdb098;border:1px solid #b29765}.v15-technode>b{display:block;font:700 16px Georgia,serif;color:#efd9aa;margin:8px 0 3px}.v15-technode>small{display:block;color:#a6b9c1;font-size:11px;margin-bottom:6px}.v15-effect{display:flex;justify-content:space-between;gap:8px;font-size:11px;margin:4px 0}.v15-effect strong{color:#95d1a3}.v15-techfoot{display:flex;gap:5px;align-items:center;justify-content:space-between;margin:10px 0 0}.v15-techfoot button{font-size:11px}
.v15-stockgrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.v15-stockgrid>div,.v15-linegrid>div{padding:10px;border:1px solid #594930;background:#14232e;border-radius:6px}.v15-stockgrid strong,.v15-stockgrid b,.v15-stockgrid span{display:block}.v15-stockgrid strong{font-size:11px;color:#aebfc5}.v15-stockgrid b{font:700 25px Georgia,serif;color:#efdcac}.v15-stockgrid span{font-size:10px;color:#8aa1a9}.v15-linegrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.v15-linegrid img{width:100%;height:95px;object-fit:cover;background:#ccb996}.v15-linegrid b,.v15-linegrid span,.v15-linegrid small{display:block;margin:5px 0}.v15-linegrid b{font:700 16px Georgia,serif;color:#ead6a8}.v15-linegrid span{color:#afc3cb}
@media(max-width:1100px){.shell{display:block!important}.shell>.v15-rail{position:static;margin-bottom:10px;max-height:none}.shell>.sidebar{display:flex!important}.v15-railhead{grid-template-columns:76px 1fr}.v15-railhead img{width:76px;height:105px}.v15-docklayout,.v15-reglayout{grid-template-columns:1fr}.v15-techgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.v15-h-header{flex-wrap:wrap}}
@media(max-width:680px){.v15-equipment,.v15-techgrid,.v15-batteries,.v15-stockgrid,.v15-linegrid,#v15-bottomdock{grid-template-columns:1fr 1fr}.v15-shipimage>div{font-size:10px}.v15-shiptile,.v15-regtile{grid-template-columns:100px 1fr}.v15-shiptile img,.v15-regtile img{width:100px}}
`;document.head.appendChild(style)}

function v16(){if(!s)return null;s.v16||={version:16,gunRefits:[],crewDrill:[],logistics:{},seq:160000,records:[]};return s.v16}

function v16Logistics(f=s.player){let v=v16();v.logistics[f]||={autoImport:false,limits:{iron:55,steel:25,copper:30,wood:75,coal:30,saltpeter:15,sulfur:15,hemp:35,flax:30,food:90},lastMonth:''};return v.logistics[f]}

function v16SetReserve(key,qty){let p=v16Logistics(),q=Math.max(0,Math.min(500,Number(qty)||0));if(!Object.hasOwn(p.limits,key))return;p.limits[key]=q;v16Render();say(`Целевой запас: ${V8_MATERIALS[key].name} — ${q}`)}

function v16ToggleAutoImport(){const p=v16Logistics();p.autoImport=!p.autoImport;v16Render()}

function v16ImportMonth(){const f=s.player,p=v16Logistics(f),month=`${s.year}-${s.month}`;if(!p.autoImport||p.lastMonth===month||s.day!==2)return;p.lastMonth=month;let n=0;for(const [k,target] of Object.entries(p.limits)){if(n>=2||s.gold[f]<100)break;let available=v8stock(f,k);if(available>=target*.7)continue;let qty=Math.max(25,Math.min(100,Math.ceil((target-available)/25)*25));let previous=v8get().imports.length;v8import(k,qty);if(v8get().imports.length>previous)n++}}

function v16CrewSchool(id){let sh=s.ships.find(x=>x.id===id&&x.f===s.player),v=v16();if(!sh)return;if(v.crewDrill.some(x=>x.shipId===id))return say('Экипаж уже проходит учения');if(s.gold[s.player]<35||s.food[s.player]<5||(s.equipment[s.player].gunpowder||0)<2)return say('Нужно 35 монет, 5 провианта и 2 пороха');s.gold[s.player]-=35;s.food[s.player]-=5;s.equipment[s.player].gunpowder-=2;v.crewDrill.push({shipId:id,remaining:28});log(`${sh.name}: тренировка артиллеристов, 28 дней.`);v16Render();drawAll()}

function v16GunStats(c,pattern='standard',f=s.player){let p=V16_GUN_PATTERN[pattern]||V16_GUN_PATTERN.standard;return {damage:c.atk*p.damage*globalMod(f,'gunDamage'),penetration:c.lb*p.penetration*globalMod(f,'gunPen'),range:c.range*p.range*globalMod(f,'gunRange'),reload:c.reload/(p.reload*globalMod(f,'gunReload')),weight:c.weight*p.weight,cost:c.iron*p.cost}}

function v16Refit(id,pattern){let sh=s.ships.find(x=>x.id===id&&x.f===s.player),p=V16_GUN_PATTERN[pattern],v=v16();if(!sh||!p)return;if(pattern==='long'&&!has(s.player,'v16_long_barrel'))return say('Исследуйте длинные корабельные стволы');if(pattern==='short'&&!has(s.player,'v16_light_guns'))return say('Исследуйте облегчённые лафеты');if(v.gunRefits.some(x=>x.shipId===id))return say('Корабль уже находится на перевооружении');if(!N[sh.port]?.port||s.provinces[sh.port]?.owner!==sh.f)return say('Перевооружение возможно только в своём порту');if(v8get().seaOrders.some(o=>s.fleets.find(f=>f.id===o.fleetId&&f.id===sh.fleetId)))return say('Верните эскадру в порт');const count=(sh.design?.batteries||[]).reduce((a,b)=>a+b.count,0);let steel=Math.ceil(count*.035),wood=Math.ceil(count*.12),iron=Math.ceil(count*.12),gold=Math.ceil(count*.8);if(s.steel[s.player]<steel||s.wood[s.player]<wood||s.iron[s.player]<iron||s.gold[s.player]<gold)return say(`Нужно ${gold} монет, ${steel} стали, ${wood} дерева и ${iron} железа`);s.steel[s.player]-=steel;s.wood[s.player]-=wood;s.iron[s.player]-=iron;s.gold[s.player]-=gold;v.gunRefits.push({shipId:id,pattern,remaining:Math.max(8,Math.ceil(count*.25))});log(`${sh.name}: модернизация батарей начата.`);v16Render();drawAll()}

function v16Metric(label,value,max,display,color){return `<div class="v16-meter"><span>${label}</span><i><i style="width:${Math.max(5,Math.min(100,value/max*100))}%;background:${color}"></i></i><strong>${display}</strong></div>`}

function v16ApplyCSS(){if(document.getElementById('v16style'))return;const style=document.createElement('style');style.id='v16style';style.textContent=`
 .v16-ministry,.v16-regtools,.v16-gunfit{padding:14px 8px;border-top:1px solid #7b6440;color:#e9dfc7}.v16-hero{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin:0 0 12px}.v16-hero h3{margin:0;font:700 23px Georgia,serif;color:#f0d49f}.v16-note{font-size:12px;color:#aebfc3;line-height:1.5}.v16-tag{background:#1d3442;border:1px solid #6c583c;border-radius:5px;padding:7px 9px;color:#e2d0a5;font-size:12px}.v16-resourcegrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.v16-resource{padding:12px;background:linear-gradient(180deg,#1a303d,#101b25);border:1px solid #5f513a;border-radius:8px}.v16-rhead{display:flex;align-items:center;gap:8px}.v16-rhead>div{flex:1}.v16-rhead small,.v16-resource small{display:block;color:#b0bdc2;font-size:10px}.v16-rhead strong{font:700 20px Georgia,serif;color:#f0d8a5}.v16-resourceico{min-width:38px;height:38px;display:grid;place-items:center;border:1px solid #ddcca5;border-radius:7px;color:#172329;font:bold 14px Georgia,serif}.v16-short{color:#db937c!important}.v16-track{height:7px;border-radius:99px;background:#0a141d;overflow:hidden;margin:10px 0}.v16-track i{height:100%;display:block}.v16-res-controls{display:flex;gap:8px;justify-content:space-between;align-items:flex-end}.v16-res-controls label{font-size:11px;color:#bbced1}.v16-res-controls input{display:block;width:73px;background:#11242f;color:#f0d8a5;border:1px solid #71808b;border-radius:4px;padding:5px;margin-top:5px}.v16-res-controls button{padding:7px;font-size:11px}.v16-two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.v16-two section{border:1px solid #615037;background:#101c27;border-radius:8px;padding:10px}.v16-row{display:flex;justify-content:space-between;border-bottom:1px solid #334957;padding:6px 0;font-size:12px}.v16-formgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.v16-formgrid button{min-height:66px;background:linear-gradient(180deg,#1d3340,#10202b);text-align:left}.v16-formgrid b,.v16-formgrid small{display:block}.v16-formgrid small{font-size:10px;color:#b5c2c6}.v16-on{outline:2px solid #d0a85e!important;border-color:#cfaa68!important}.v16-metgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:8px 0;margin:8px 0}.v16-metgrid>div{padding:10px;border:1px solid #46576a;border-radius:7px}.v16-metgrid b,.v16-metgrid strong{display:block}.v16-presetgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.v16-pattern{background:#10212d;padding:12px;border:1px solid #5f5138;border-radius:8px}.v16-pattern img{width:100%;height:95px;object-fit:cover;border:1px solid #b69a67;border-radius:5px;background:#a88b64}.v16-pattern b,.v16-pattern small{display:block;margin:5px 0}.v16-pattern small{min-height:32px;color:#afbbc3}.v16-pattern button{margin-top:10px;width:100%}.v16-meter{display:grid;grid-template-columns:90px 1fr 65px;gap:5px;align-items:center;font-size:11px;margin:5px 0}.v16-meter>span{color:#b7c8cb}.v16-meter>i{height:8px;background:#0a1520;border-radius:8px;overflow:hidden}.v16-meter>i>i{height:100%;display:block}.v16-meter strong{color:#e5d5aa}.v16-supplylink{display:block;width:100%;margin-top:9px;background:linear-gradient(180deg,#7c623a,#43321e);border-color:#a68858}
 @media(max-width:1400px){.v16-resourcegrid{grid-template-columns:repeat(3,minmax(0,1fr))}.v16-presetgrid{grid-template-columns:1fr}.v16-formgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:800px){.v16-resourcegrid,.v16-two,.v16-metgrid{grid-template-columns:1fr 1fr}.v16-res-controls{flex-wrap:wrap}}
 `;document.head.appendChild(style)}

function v16StrategicAITurn(){
 for(let f=0;f<F.length;f++){
  if(f===s.player)continue;
  const provinces=regOf(f);if(!provinces.length)continue;
  const isAtWar=s.wars.some(x=>x.split(':').includes(String(f)));
  const border=provinces.filter(x=>N[x.i].adj.some(j=>withWar(f,s.provinces[j].owner)));
  const food=s.food[f],iron=s.iron[f],gold=s.gold[f],wood=s.wood[f];
  const role=NATIONAL[f]?.quality||'court';
  // Deliberate industry investment: explicit costs, scarcity-aware, one additional decision per quarter.
  if(food<90&&gold>=75&&wood>=21){
   let best=provinces.filter(x=>x.p.farm<5).sort((a,b)=>b.i===CAP[f]?1:a.i===CAP[f]?-1:b.p.market-a.p.market)[0];
   if(best){best.p.farm++;s.gold[f]-=75;s.wood[f]-=21;}
  }else if(iron<55&&gold>=125&&wood>=24){
   let best=provinces.filter(x=>x.p.workshop<4).sort((a,b)=>b.p.road-a.p.road)[0];
   if(best){best.p.workshop++;s.gold[f]-=125;s.wood[f]-=24;}
  }else if(border.length&&food>=80&&gold>=105&&wood>=30){
   let best=border.sort((a,b)=>(b.p.depot?0:1)-(a.p.depot?0:1))[0];
   if(best&&best.p.depot<3){best.p.depot++;s.gold[f]-=95;s.wood[f]-=30;}
  }
  // Replace indiscriminate research only when the AI has no project and an appropriate reserve.
  if(!s.research[f]&&gold>250){
   let categories=isAtWar?['Логистика','Артиллерия и осады','Пехотные формирования']:role==='navy'?['Кораблестроение','Морская артиллерия','Флот']:role==='research'?['Образование','Хозяйство']:['Хозяйство','Государственные реформы','Логистика'];
   const candidates=TECH.filter(t=>!has(f,t.id)&&techAccessible(f,t)&&t.cost+95<=s.gold[f]);
   candidates.sort((a,b)=>{let sa=(categories.includes(a.cat)?100:0)+(a.eduMin||0)*.05-a.cost*.05, sb=(categories.includes(b.cat)?100:0)+(b.eduMin||0)*.05-b.cost*.05;return sb-sa});
   const choice=candidates[0];if(choice){s.gold[f]-=choice.cost;let days=researchDays(choice,f);s.research[f]={id:choice.id,remaining:days,total:days}}
  }
 }
}

function v17State(){if(!s)return null;if(!s.v17)s.v17={version:17,policies:{},policyCooldown:{},selectedDesign:null,seed:171700,events:[],allocation:{}};return s.v17}

function v17SetPolicy(key){if(!V17_POLICIES[key])return;const v=v17State(),f=s.player,now=s.turn||0;if(v.policyCooldown[f]>now)return say('Недавно изменена государственная политика. Дождитесь следующего квартала.');if((s.gold[f]||0)<130||s.action<1)return say('Нужно 130 монет и один дипломатический указ');s.gold[f]-=130;s.action--;v.policies[f]=key;v.policyCooldown[f]=now+1;s.stability[f]=clamp(s.stability[f]+V17_POLICIES[key].stability,0,100);log(`Утверждена государственная доктрина «${V17_POLICIES[key].name}».`);v15Render();drawAll()}

function v17KitFactor(r,kind){let x=1;for(const item of Object.values(r?.v17Kit||{})){if(!item?.key)continue;let a=V17_ACCESSORIES[item.key];if(a)x*=1+((a.bonus[kind]||1)-1)*Math.min(1,item.count/(item.key==='wagon'?1:Math.max(1,r.headcount||800)))}return x}

function v17NewSeed(){let v=v17State();v.seed=(Math.imul(v.seed,1664525)+1013904223)>>>0;return v.seed}

function v17SelectBlueprint(id){v17State().selectedDesign=id;v15Render()}

function v17Blueprint(){let designs=s.shipDesigns.filter(d=>d.f===s.player),v=v17State();return designs.find(x=>x.id===v.selectedDesign)||designs[0]||null}

function v17RandomizeBlueprint(){let d=v17Blueprint();if(!d)return say('Сначала создайте проект корпуса');d.modelSeed=v17NewSeed();v15Render();log('Чертёжное бюро изменило внешний вариант корпуса «'+d.name+'».')}

function v17CreateBlueprint(type){
 const before=s.shipDesigns.length;
 const issues=(typeof v7shipGate==='function')?v7shipGate(type):[];
 if(issues.length){say(issues[0]);v15Open('fleet');return}
 v6makeDesign(type);
 if(s.shipDesigns.length>before)v17State().selectedDesign=s.shipDesigns[s.shipDesigns.length-1].id;
 v15Open('fleet')
}

function v17InitCanvas(){const c=document.getElementById('v17-preview');if(!c)return;if(c.dataset.ready!=='1'){c.dataset.ready='1';let down=null;c.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(!down)return;V17_CAM.yaw+=(e.clientX-down[0])*.008;V17_CAM.pitch=Math.max(.08,Math.min(1.1,V17_CAM.pitch+(e.clientY-down[1])*.005));down=[e.clientX,e.clientY];cancelAnimationFrame(V17_CAM.frame);V17_CAM.frame=requestAnimationFrame(v17DrawModel)});c.addEventListener('pointerup',()=>down=null);c.addEventListener('wheel',e=>{e.preventDefault();V17_CAM.zoom=Math.max(.45,Math.min(2.5,V17_CAM.zoom*(e.deltaY<0?1.1:.9)));v17DrawModel()},{passive:false})}v17DrawModel()}

function v17Css(){if(document.getElementById('v17styles'))return;const style=document.createElement('style');style.id='v17styles';style.textContent=`
 :root{--gold:#d1ac69;--cream:#f4e3bd}body{font-family:'Segoe UI',Tahoma,Arial,sans-serif!important}.brand h1,.panel h2,.v15-rail h3{font-family:Georgia,serif!important}
 #map{background:radial-gradient(ellipse at 46% 38%,#285a75,#10374c 64%,#091d29)!important}#oceantexture{opacity:.26}.province{stroke-width:.7px!important;stroke:#3b3130!important}.province.focus{stroke:#ffe5ac!important;stroke-width:2px!important}.mapframe{box-shadow:0 14px 36px #0008,inset 0 0 30px #0006!important}
 .v17-sectionhead{border-bottom:1px solid #78603e;margin:5px 0 12px;padding-bottom:9px}.v17-sectionhead h3,.v17-sectionhead h2{font:700 23px Georgia,serif;color:#efdbb2;margin:0 0 4px}.v17-sectionhead small{color:#bac6ca;font-size:12px}
 .v17-policygrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.v17-policycard,.v17-techcard,.v17-kit{background:linear-gradient(180deg,#1b2c38,#111c25);border:1px solid #6d593a;border-radius:8px;padding:10px}.v17-policycard.chosen{box-shadow:inset 0 0 0 2px #c1a36a}.v17-policycard h3{font:700 19px Georgia,serif;margin:6px 0;color:#ead4a9}.v17-policycard p{font-size:12px;color:#c2cbd0;min-height:46px}.v17-policy-plate img{width:100%;height:130px;object-fit:cover}.v17-policycard button{margin-top:10px;width:100%}
 .v17-mod{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:4px 0;border-bottom:1px solid #46505c6b;font-size:12px}.v17-mod span{color:#b6c9d0}.v17-mod b{color:#9fce99;white-space:nowrap}.v17-status-note,.v17-kit-summary,.v17-note{margin-top:10px;padding:10px;background:#11212c;border-left:3px solid #b79454;color:#c5d0d4;font-size:12px}
 .v17-techgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.v17-techcard img,.v17-kit img{width:100%;height:112px;object-fit:cover;border-radius:5px;border:1px solid #9c835c}.v17-techcard b{display:block;color:#efd9ab;font:700 16px Georgia,serif;margin:7px 0}.v17-techcard small,.v17-kit small{display:block;color:#b8c5c9;margin-bottom:8px}.v17-techcard button{width:100%;margin-top:8px}
 .v17-kitgrid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}.v17-kit strong{display:block;min-height:38px;font-family:Georgia,serif;color:#eed7aa}.v17-kit button{width:100%;margin-top:8px;font-size:11px}.v17-outfit{padding:12px 0}
 .v17-admiral{display:flex;gap:14px;align-items:center;margin:0 0 12px;padding:10px;border:1px solid #735b3a;border-radius:8px;background:linear-gradient(180deg,#1c2f3c,#101b24)}.v17-admiral img{width:94px;height:106px;object-fit:cover;border-radius:6px;border:1px solid #ceb47f}.v17-admiral h3{margin:4px 0;font:700 22px Georgia,serif;color:#f0d6a4}.v17-admiral small{color:#a8bdc2}.v17-admiralmods{display:flex;gap:20px;flex-wrap:wrap;margin-top:7px}.v17-ship-designer{padding:12px 14px;border:1px solid #77603c;border-radius:10px;background:linear-gradient(180deg,#182b38,#0e1a24);margin-bottom:13px}.v17-design-grid{display:grid;grid-template-columns:minmax(400px,1fr) 320px;gap:12px}.v17-canvas-shell{position:relative;background:linear-gradient(#16415d,#102230);border:1px solid #90754b;border-radius:6px;overflow:hidden}.v17-canvas-shell canvas{width:100%;height:auto;display:block;touch-action:none;cursor:grab}.v17-overprint{position:absolute;left:6px;bottom:6px;background:#0a1920cf;padding:6px 9px;color:#e2d5b4;font-size:11px}.v17-design-controls h3{margin:0 0 8px;font:700 18px Georgia,serif}.v17-design-controls select{margin-bottom:8px}.v17-design-controls button{margin-bottom:8px}.v17-buttonrow{display:flex;gap:5px}.v17-buttonrow button{flex:1;font-size:11px;padding:9px 4px}
 @media(max-width:1400px){.v17-policygrid{grid-template-columns:repeat(2,minmax(0,1fr))}.v17-techgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.v17-kitgrid{grid-template-columns:repeat(3,minmax(0,1fr))}.v17-design-grid{grid-template-columns:1fr}}
 `;document.head.appendChild(style)}

function v17FlagData(f){let main=F[f]?.color||'#547180';let svg;if(f===0){svg='<rect width="100" height="65" fill="#142e66"/><path d="M-12 -8L112 73M112 -8L-12 73" stroke="#faf8ea" stroke-width="16"/><path d="M-12 -8L112 73M112 -8L-12 73" stroke="#d3423c" stroke-width="7"/><path d="M50 0V65M0 32H100" stroke="#f4ead8" stroke-width="20"/><path d="M50 0V65M0 32H100" stroke="#ce3432" stroke-width="10"/>'}else{svg=`<rect width="100" height="65" fill="${main}"/><path d="M10 10H90V55H10Z" fill="none" stroke="#d8c59c" stroke-width="2"/><text x="50" y="43" fill="#f8ead0" text-anchor="middle" font-family="Georgia" font-size="28">${f%2?'♜':'✠'}</text>`};return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 65">${svg}</svg>`)}

function v18State(){if(!s)return null;let v=s.v18;
 if(!v){v={version:18,ministries:{},projects:[],next:19000,aiTicks:0};s.v18=v}
 v.ministries ||= {};v.projects ||= [];v.next ||=19000;return v}

function v18Ministry(key){const m=V18_MINISTRIES[key],f=s.player,v=v18State();if(!m)return;
 if(v.ministries[f]===key)return say('Эта комиссия уже действует');
 if(s.gold[f]<m.cost||s.action<1)return say(`Для реформы нужны ${m.cost} монет и один указ`);
 s.gold[f]-=m.cost;s.action--;v.ministries[f]=key;log('Корона учредила ведомство: '+m.title);v15Render();drawAll();}

function v18ModLine(k,x){return `<div class="v18-mod"><span>${esc(BONUS_NAMES[k]||k)}</span><strong class="${x<1?'discount':'boost'}">${x<1?'−':'+'}${Math.round(Math.abs(x-1)*100)}%</strong></div>`}

function v18Replenish(regId){if(!own(selected))return say('Выберите собственную провинцию');const r=v15Regiments(selected).find(x=>x.id===regId);if(!r)return;
 const o=v18RegStat(r),need=Math.max(0,o.quota-r.headcount);if(!need)return say('Численность полка полная');
 let f=s.player,reserve=s.demography?.manpower?.[selected]??0;let accepted=Math.min(need,Math.floor(reserve),Math.floor(s.gold[f]*10),Math.floor(s.food[f]*8));
 if(accepted<=0)return say('Не хватает рекрутов, денег или провианта');
 s.gold[f]-=Math.ceil(accepted/10);s.food[f]-=accepted/8;if(s.demography?.manpower)s.demography.manpower[selected]-=accepted;
 r.headcount+=accepted;r.morale=Math.min(100,(r.morale||65)+2);log(`${r.name}: пополнение +${accepted} человек, резерв провинции уменьшился.`);v15Render();drawAll();}

function v18CrewStatus(sh){sh.v18Crew||={sailing:Math.max(12,sh.seamanship||20),gunnery:Math.max(12,sh.gunnery||20),boarding:Math.max(12,sh.boarding||18),stamina:85};return sh.v18Crew}

function v18OperationsScreen(){const f=s.player,orders=s.orders.filter(x=>x.f===f),fleets=s.fleets.filter(x=>x.f===f),regi=regOf(f).reduce((acc,z)=>acc+armies(z.p),0),ships=s.ships.filter(x=>x.f===f);
 return `<section class="v18-section"><div class="v18-h"><h2>Оперативный штаб</h2><small>Один календарь для армий, эскадр, обучения и промышленности</small></div><div class="v18-totals"><div><b>${regi}</b><span>Полков</span></div><div><b>${ships.length}</b><span>Кораблей</span></div><div><b>${fleets.length}</b><span>Эскадр</span></div><div><b>${orders.length}</b><span>Приказов</span></div></div><div class="v18-operation-grid"><div><h3>Военные приказы</h3>${orders.slice(0,18).map(o=>`<div class="v18-operation"><b>${o.kind==='army'?'Сухопутный марш':'Морская операция'}</b><span>${esc(N[o.from]?.name||'?')} → ${esc(N[o.to]?.name||'?')}</span>${v15Gauge('Переход',Math.max(0,o.total-o.remaining),Math.max(1,o.total),'#9db7bd',Math.max(0,o.remaining)+' дн.')}</div>`).join('')||'<small>Действующих маршей пока нет.</small>'}</div><div><h3>Адмиралтейство</h3>${fleets.slice(0,12).map(fl=>`<div class="v18-operation"><b>${esc(fl.name)}</b><span>Судов: ${v8shipsOf(fl).length} · ${Number.isInteger(fl.port)?esc(N[fl.port]?.name||'порт'):'море'}</span></div>`).join('')||'<small>Эскадры не сформированы.</small>'}<div class="v18-controls"><button onclick="v15Switch('fleet')">Перейти во флот</button><button onclick="v15Switch('regiments')">Открыть полки</button></div></div></div></section>`;}

function v19Aggregate(f){const tech=s?.tech?.[f]||[],sig=tech.length+':'+tech.slice(-3).join('/');let cache=v19ModCache.get(f);if(cache?.sig===sig)return cache.mods;const mods={};for(const id of tech){const row=V19_NEW[id]||V19_OLD.get(id);if(!row)continue;for(const [key,val] of Object.entries(row))mods[key]=(mods[key]||1)*val}v19ModCache.set(f,{sig,mods});return mods}

function v19fmtMod(k,v){return `<div class="v19-effect"><span>${esc(V19_LABELS[k]||BONUS_NAMES[k]||k)}</span><strong class="${v<1?'minus':'plus'}">${v<1?'−':'+'}${(Math.abs(1-v)*100).toFixed(Math.abs(v-1)<.01?1:0)}%</strong></div>`}

function v19hash(x){let h=2166136261;for(let i=0;i<x.length;i++)h=Math.imul(h^x.charCodeAt(i),16777619);return h>>>0}

function v19WeaponSpec(t){const c=CANNONS.find(z=>z.id===t.id);if(!c)return '';return `<div class="v19-gunstats"><b>Образец ${c.lb} фн</b><span>Урон ${c.atk.toFixed(1)}</span><span>Дальность ${c.range} м</span><span>Масса ${c.weight.toFixed(1)} т</span><span>Перезарядка ×${c.reload.toFixed(2)}</span></div>`}

function v19ChooseCategory(cat){v19Category=cat;v19OpenTech()}

function v19Workshop(){const ds=(s.shipDesigns||[]).filter(d=>d.f===s.player),f=s.player,p=NATIONAL[f],ads=(s.advisers[f]||[]).map(id=>ADVISERS.find(a=>a.id===id)).filter(Boolean);return `<section class="v19-wshop"><header><h2>Королевская мастерская</h2><small>Генерация портретов и 3D-кораблей работает локально · сохранённый seed воспроизводит одну и ту же модель</small></header><div class="v19-workcols"><div><h3>Корона и советники</h3><div class="v19-people"><div><img src="${v15Portrait(p.ruler,'Монарх')}" alt="монарх"><b>${esc(p.ruler)}</b></div>${ADVISERS.map(a=>`<div><img src="${v15Portrait(a.name,a.role)}" alt="советник"><b>${esc(a.name)}${ads.includes(a)?' ✓':''}</b></div>`).join('')}</div><div class="v19-advice">Портреты отличаются за счёт имени и роли; генератор формирует SVG-портреты и сохраняет их в автономной игре.</div></div><div><h3>Обзор проектов · 3D</h3>${v17ShipDesigner()}</div></div></section>`}

function v19Retool(id,key){const v=v8get(),line=v.lines.find(x=>x.id===id&&x.f===s.player),eq=V6_EQUIP[key];if(!line||!eq)return say('Линия недоступна');if(!v6canEquip(s.player,key))return say('Сначала изучите образец');if(line.key===key)return say('Это изделие уже производится');const old=line.key,prev=line.eff;line.key=key;line.eff=Math.max(.12,prev*.45);line.work=0;line.blocked='';log(`Перепрофилирование: ${V6_EQUIP[old]?.name||old} → ${eq.name}. Эффективность ${Math.round(prev*100)}% → ${Math.round(line.eff*100)}%.`);v15Render();drawAll()}

function v19GearFactor(reg,kind){let val=1;for(const row of Object.values(reg.v19Gear||{})){const it=V19_FIELD_GEAR[row.key];if(!it)continue;const ratio=Math.max(0,Math.min(1,row.count/it.quantity));val*=1+((it.bonus[kind]||1)-1)*ratio;}return val}

function v20SetDesignModule(id,slot,key){const d=s.shipDesigns.find(x=>x.id===id&&x.f===s.player);if(!d)return;let v=key&&V20_MODULES[key];if(v&&(v.slot!==slot||!has(s.player,v.tech)))return say('Сначала исследуйте эту модификацию');d.modules ||= {};if(!key)delete d.modules[slot];else d.modules[slot]=key;drawAll(); if(document.getElementById('v15-window')?.offsetParent!==null)v15Render()}

function v20ModsFor(d){const mods={};for(const key of Object.values(d?.modules||{})){const obj=V20_MODULES[key];if(obj)for(const [k,v] of Object.entries(obj.mods))mods[k]=(mods[k]||1)*v;}return mods;}

function v20EnsureNavies(){const state=V20_STATE();if(!state||state.naviesInitialized)return;state.naviesInitialized=true;
 for(let f=0;f<F.length;f++){if(f===s.player||s.fleets.some(x=>x.f===f))continue;const port=N.map((n,i)=>({n,i,p:s.provinces[i]})).filter(x=>x.n.port&&x.p.owner===f).sort((a,b)=>((b.p.line||0)*3+(b.p.frigate||0)*2+(b.p.sloop||0))-((a.p.line||0)*3+(a.p.frigate||0)*2+(a.p.sloop||0)))[0];if(!port)continue;const shipsCount=Math.min(3,(port.p.sloop||0)+(port.p.frigate||0)+(port.p.line||0));if(shipsCount<1)continue;const fleet={id:++s.v6seq,f,name:`${F[f].name}: эскадра ${port.n.name}`,port:port.i,admiral:f%V6_ADMIRALS.length,embarked:[],formation:'line',provisions:130,seaMorale:80};s.fleets.push(fleet);
 const types=[];for(const [k,c] of [['line',port.p.line||0],['frigate',port.p.frigate||0],['sloop',port.p.sloop||0]])for(let j=0;j<Math.min(3,c);j++)types.push(k);
 for(const type of types.slice(0,shipsCount)){const h=V6_HULLS[type],design={f,type,name:`Проект ${h.label}`,modelSeed:f*101+shipsCount,modules:{},batteries:h.decks.map((dk,j)=>({gun:type==='line'?'gun12':type==='frigate'?'gun9':'gun4',count:Math.min(dk.max,type==='line'?16:type==='frigate'?12:6)}))};const st=v6designStats(design);s.ships.push({id:++s.v6seq,f,name:`${F[f].name}: ${h.label} №${s.v6seq%100}`,type,design,port:port.i,fleetId:fleet.id,hp:st.hp,maxHp:st.hp,crew:Math.round(h.crew*.83),crewMax:h.crew,ammo:80,crewSkills:{sailing:25+f%20,gunnery:22+f%15}});}
 }
}

function v20BattleSpeed(x){if(!v8Battle?.v20)return;v8Battle.v20.timeScale=x;document.querySelectorAll('#v20-tactical-controls button').forEach(b=>b.classList.toggle('sel',b.textContent===(x===.25?'¼×':x===.5?'½×':x+'×')))}

function v20OrderLatency(u){const sh=s.ships.find(x=>x.id===u.shipId),fl=v8Battle?.v20?.squadron,o=v20ShipOrganization(fl);return o.delay*(sh?v20ShipMod(sh,'commandDelay')/Math.max(.6,globalMod(sh.f,'commandDelay')):1)}

function v20QueueOrder(u,cmd,extra){if(!u||!v8Battle?.v20)return;const b=v8Battle.v20;const when=(V8_SCENE?.time||0)+v20OrderLatency(u);b.commands.push({id:u.id,cmd,extra,when});v8Battle.lastHit=`Приказ «${cmd}» передан · задержка ${Math.round(when-V8_SCENE.time)} с`;v20BattleHud()}

function v20BattleOrder(kind){const sc=V8_SCENE,b=v8Battle?.v20;if(!b||!sc)return;b.order=kind;if(kind==='line')b.formation='line';for(const u of sc.units.filter(x=>x.team==='friendly'&&x.kind==='ship'&&x.hp>0))v20QueueOrder(u,kind);v20BattleHud()}

function v20BattleHud(){const b=v8Battle?.v20;const hud=document.getElementById('v8-battle-hud');if(!b||!hud)return;const o=v20ShipOrganization(b.squadron),alive=V8_SCENE?.units.filter(x=>x.hp>0&&x.team==='friendly')||[];hud.innerHTML=`<b>ОРГАНИЗАЦИЯ ${o.value}/100</b> · задержка команды ${o.delay} с · строй: ${V20_FORMATIONS[b.formation]?.name||'линия'} · скорость боя ×${b.timeScale} · ${alive.length} кораблей · ${b.commands.length} ожидающих приказов`}

function v20AIMonth(){const st=V20_STATE();if(s.day!==1)return;const month=s.year*12+s.month;if(st.lastAIMonth===month)return;st.lastAIMonth=month;
 const v=v8get();for(let f=0;f<F.length;f++){if(f===s.player)continue;const fl=s.fleets.find(x=>x.f===f&&v8shipsOf(x).length);if(!fl)continue;const org=v20ShipOrganization(fl);if(org.value<62&&s.gold[f]>140){fl.seaMorale=Math.min(100,(fl.seaMorale||75)+2);s.gold[f]-=12;}if(s.food[f]<45&&s.gold[f]>160){s.gold[f]-=28;s.food[f]+=28;}if(!s.research[f]&&edu(f)>32){const candidates=V20_TECHS.filter(t=>!has(f,t[0])&&TECH.find(z=>z.id===t[0])&&techAccessible(f,TECH.find(z=>z.id===t[0])));const preferred=candidates.find(x=>x[0]==='v20_flags'||x[0]==='v20_line')||candidates[0];if(preferred&&s.gold[f]>preferred[5]*1.5){s.gold[f]-=preferred[5];s.research[f]={id:preferred[0],remaining:researchDays(TECH.find(t=>t.id===preferred[0]),f),total:researchDays(TECH.find(t=>t.id===preferred[0]),f)};}}}
}

function v20AIPatrolOrders(){if(!s||!s.v8)return;const v=v8get();for(const f of Array.from({length:F.length},(_,i)=>i)){if(f===s.player)continue;const fl=s.fleets.find(x=>x.f===f&&v8shipsOf(x).length);if(!fl||v.seaOrders.some(x=>x.fleetId===fl.id)||fl.port==null)continue;if(s.gold[f]<75)continue;const origin=N[fl.port];if(!origin?.port)continue;const ports=N.map((n,i)=>({n,i})).filter(({n,i})=>n.port&&i!==fl.port&&s.provinces[i].owner===f&&adjacentSea(seaZone(origin),seaZone(n))&&distKm(origin,n)>75);if(ports.length<1)continue;ports.sort((a,b)=>Math.abs(distKm(origin,a.n)-480)-Math.abs(distKm(origin,b.n)-480));const target=ports[0],speed=v8fleetSpeed(fl),days=Math.max(9,Math.ceil(distKm(origin,target.n)/(Math.max(3,speed)*7.8)+3));v.seaOrders.push({id:++v.id,f,fleetId:fl.id,type:'patrol',from:fl.port,to:target.i,remaining:days,total:days,progress:0,position:{x:origin.x,y:origin.y}});}}

function V21_STATE(){if(!s)return null;s.v21 ||= {drills:[],aiDate:-1};return s.v21;}

function v21Daily(){if(!s)return;const st=V21_STATE(),orders=v8get().seaOrders;
 const atSea=new Set(orders.filter(x=>x.remaining>0).map(x=>x.fleetId));
 for(const fl of s.fleets){const offshore=atSea.has(fl.id)||fl.port==null;
  for(const sh of v8shipsOf(fl)){
   const rate=globalMod(fl.f,'crewFatigue');
   const relief=globalMod(fl.f,'seaEndurance');
   sh.v21Fatigue=Math.max(0,Math.min(100,v21ShipFatigue(sh)+(offshore?1.15*rate/Math.max(.75,relief):(-2.5*relief))));
  }
 }
 for(const drill of [...st.drills]){drill.days--;if(drill.days>0)continue;
  const fl=s.fleets.find(x=>x.id===drill.fleetId);
  if(fl){for(const sh of v8shipsOf(fl)){sh.crewSkills ||= {};sh.crewSkills.sailing=Math.min(100,(sh.crewSkills.sailing||20)+7*globalMod(fl.f,'crewTraining'));sh.v21Fatigue=Math.min(100,v21ShipFatigue(sh)+9)}fl.seaMorale=Math.min(100,(fl.seaMorale??75)+4);log(`Эскадра «${fl.name}»: закончена сигнальная и строевая подготовка.`)}
  st.drills.splice(st.drills.indexOf(drill),1);
 }
}

function v22State(){if(!s)return null;s.v22 ||= {refits:[],policy:{},lastAI:0};return s.v22;}

function v22ModText(k,v){return `<span>${esc(BONUS_NAMES[k]||V20_BONUS_LABELS?.[k]||k)}</span><b class="${v<1?'v22-neg':'v22-pos'}">${v<1?'−':'+'}${(100*Math.abs(1-v)).toFixed(1)}%</b>`;}

function v22Advance(){const st=v22State();for(const q of [...st.refits]){q.remaining--;if(q.remaining>0)continue;
 const sh=s.ships.find(x=>x.id===q.shipId);if(sh){sh.design ||= {type:sh.type,batteries:[],f:sh.f};sh.design.modules||={};const old=sh.design.modules[q.slot];sh.design.modules[q.slot]=q.key;
 if(old&&V20_MODULES[old])s.equipment[sh.f][old]=(s.equipment[sh.f][old]||0)+1;
 log(`Корабль «${sh.name}»: установлен модуль «${V20_MODULES[q.key]?.name}».`);}
 st.refits.splice(st.refits.indexOf(q),1);
 }
 // Operating expenditures of each current ministry apply at quarterly boundaries (policy is distinct).
 if(s.day===1&&[1,4,7,10].includes(s.month))for(const [fstr,key] of Object.entries(st.policy)){let f=+fstr;if(V22_POLICIES[key])s.gold[f]=Math.max(0,s.gold[f]-V22_POLICIES[key].upkeep)}
}

function v22PolicyChoose(key){const p=V22_POLICIES[key],f=s.player;if(!p)return;if(v22State().policy[f]===key)return;
 if(s.gold[f]<p.cost)return say('Недостаточно денег для выбранного курса');
 s.gold[f]-=p.cost;v22State().policy[f]=key;log(`Кабинет министров: ${p.name}.`);drawAll();if(document.getElementById('v15-overlay')?.classList.contains('open'))v15Render();}

function v22Demand(){const f=s.player,lines=v8get().lines.filter(x=>x.f===f&&x.factories&&x.active),demand={},producing=[];
 for(const q of lines){let e=V6_EQUIP[q.key];if(!e)continue;const units=q.factories*globalMod(f,'arsenalSpeed')*(.35+q.eff*.65)/Math.max(.04,e.work||1);
 producing.push({key:q.key,count:units});for(const [k,v] of Object.entries(v8recipe(q.key,q.f)))if(v>0)demand[k]=(demand[k]||0)+units*v;
 }
 return {demand,producing};}

function v22UpdateMarkers(){const layer=document.getElementById('v22-local-detail');if(!layer)return;layer.style.display=zoom>=20?'':'none';
 if(zoom<20)return;const scale=Math.max(.002,1/zoom);
 for(const el of layer.children){el.setAttribute('transform',`translate(${el.getAttribute('data-x')},${el.getAttribute('data-y')}) scale(${scale})`);}
}

function v23AssaultFactor(f){const pontoon=has(f,'pontoons'),survey=has(f,'surveys');return 1-(.12*(pontoon?.45:1)*(survey?.75:1));}

function v23SegmentKey(x,y){return Math.round(x*10)+':'+Math.round(y*10)}

function v23Spline(points){
 if(points.length<2)return '';
 const fmt=p=>p[0].toFixed(1)+','+p[1].toFixed(1);
 let path='M'+fmt(points[0]);
 for(let i=0;i<points.length-1;i++){
  let p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];
  let dx=p2[0]-p1[0],dy=p2[1]-p1[1],len=Math.hypot(dx,dy),curve=Math.min(.85,len*.14);
  let h=(Math.sin((p1[0]+p2[0])*.71+(p1[1]+p2[1])*.47)*.5+.5)*2-1;
  let nx=len>0?-dy/len:0,ny=len>0?dx/len:0;
  let a=[p1[0]+(p2[0]-p0[0])/6+nx*curve*h,p1[1]+(p2[1]-p0[1])/6+ny*curve*h];
  let b=[p2[0]-(p3[0]-p1[0])/6-nx*curve*h,p2[1]-(p3[1]-p1[1])/6-ny*curve*h];
  path+='C'+fmt(a)+' '+fmt(b)+' '+fmt(p2);
 }
 return path;
}

function v23ToggleDetail(){
 const level=typeof zoom==='number'?zoom:1;
 const svg=document.getElementById('map');if(!svg)return;
 svg.classList.toggle('v23-overview',level<2.3);
 svg.classList.toggle('v23-district',level>=2.3);
 const rivers=document.getElementById('v23-hydrography');if(rivers)rivers.style.opacity=level<1.5?'.7':'1';
}

function v24Install(){
 const nav=document.createElement('nav');nav.id='v24-nav';nav.setAttribute('aria-label','Управление державой');
 nav.innerHTML=[['map','Карта'],['court','Государство'],['dip','Дипломатия'],['economy','Экономика'],['industry','Производство'],['regiments','Армия'],['fleet','Флот'],['research','Исследования'],['province','Провинция'],['help','Справка']].map(([k,n])=>`<button onclick="v24Panel('${k}')">${n}</button>`).join('');nav.insertAdjacentHTML('beforeend',`<button onclick="v8open('production','logistics')">Логистика</button><button onclick="v8open('models')">3D-верфь</button>`);document.getElementById('resources').after(nav);
 const brand=document.querySelector('.brand');brand.insertAdjacentHTML('afterbegin','<div class="v24-country"><img id="v24-flag" alt="Флаг державы"><strong id="v24-nation"></strong></div>');
 const menu=document.createElement('details');menu.className='v24-menu';menu.innerHTML='<summary>Кампания ▾</summary><div></div>';document.querySelector('.topactions').appendChild(menu);for(const id of ['save','load','export','import','new'])menu.querySelector('div').appendChild(document.getElementById(id));
 const primary=document.querySelector('.primary-column'),workspace=document.createElement('div');workspace.id='v24-workspace';primary.prepend(workspace);const researchEl=document.createElement('section');researchEl.id='v24-research';workspace.appendChild(researchEl);workspace.appendChild(document.querySelector('.mapframe'));
 const dock=document.createElement('section');dock.id='v24-dock';workspace.after(dock);
 const sidebar=document.querySelector('.sidebar');const close=document.createElement('button');close.id='v24-inspector-close';close.textContent='Закрыть панель ✕';close.onclick=()=>document.body.classList.remove('v24-inspector');sidebar.prepend(close);
 document.getElementById('techtop').onclick=()=>v24Panel('research');
 document.querySelectorAll('#v15-rail>button').forEach(b=>{if(b.textContent.includes('совет'))b.onclick=()=>v24Panel('court')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('v24-inspector','v24-research')}});
}

function v26State(){return s.v26 ||= {charters:{},changed:{}}}

function v26EnemyTactics(u,friendly,enemy){const targets=friendly.map(t=>({t,d:Math.hypot(t.pos[0]-u.pos[0],t.pos[1]-u.pos[1])})).sort((a,b)=>(a.d*(.6+.4*a.t.hp/a.t.maxHp))-(b.d*(.6+.4*b.t.hp/b.t.maxHp)));const {t,d}=targets[0],bearing=Math.atan2(t.pos[1]-u.pos[1],t.pos[0]-u.pos[0]),outmatched=friendly.reduce((a,x)=>a+x.hp,0)>enemy.reduce((a,x)=>a+x.hp,0)*1.8;u.v26Tactic=(u.hp/u.maxHp<.28||(u.ammo??100)<8||outmatched)?'withdraw':d<38?'broadside':'intercept';u.desiredHeading=u.v26Tactic==='withdraw'?bearing+Math.PI:u.v26Tactic==='broadside'?bearing+(Math.sin(u.angle-bearing)>=0?1:-1)*Math.PI/2:Math.atan2(t.pos[1]+Math.sin(t.angle)*(t.actualSpeed||5)*1.5-u.pos[1],t.pos[0]+Math.cos(t.angle)*(t.actualSpeed||5)*1.5-u.pos[0]);if(u.cooldown<=0&&d<55&&u.v26Tactic!=='withdraw')v8fire(u)}

function v27Course(deg){const u=v8select3dUnit();if(!u||u.team!=='friendly'||u.kind!=='ship')return say('Выберите свой корабль');v20QueueOrder(u,'heading',{angle:deg*Math.PI/180});v20BattleHud()}

function v27Center(){const u=v8select3dUnit();if(!u||!V8_SCENE)return;V8_SCENE.cx=u.pos[0];V8_SCENE.cy=u.pos[1]}
