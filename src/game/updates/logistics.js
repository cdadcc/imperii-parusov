// XXVIII campaign logistics. Coefficients are game balance, not historical measurements.
const V28_CAMPAIGN_TECHS=[
 {id:'v28_kitchens',name:'Полковые походные кухни',cat:'Логистика',req:['v26_rest'],cost:205,time:33,eduMin:28,mods:{fieldRationCost:.8},desc:'Дополнительный расход пищи в режимах отдыха и готовности полка −20%. Не уменьшает базовое потребление населения и армии.'},
 {id:'v28_manifests',name:'Единые портовые грузовые ведомости',cat:'Управление',req:['logistics'],cost:190,time:31,eduMin:25,mods:{portHandling:.8},desc:'Денежная стоимость погрузки корабельного провианта −20%: 0,08 вместо 0,10 монеты за единицу. Количество пищи не изменяется.'}
];
TECH.push(...V28_CAMPAIGN_TECHS);
Object.assign(V19_LABELS,{fieldRationCost:'Дополнительный полковой рацион',portHandling:'Стоимость погрузки провианта'});
const v28CampaignMod=globalMod;
globalMod=function(f,k){let value=v28CampaignMod(f,k);for(const t of V28_CAMPAIGN_TECHS)if(has(f,t.id))value*=t.mods[k]??1;return value};
function v28Handling(f){return .1*globalMod(f,'portHandling')}
function v28GrantActive(f){return s.v28?.grants?.[f]===s.turn}
function v28Grant(){
 const f=s.player;if(v28GrantActive(f))return say('Обозная субсидия уже действует до конца квартала');
 if(s.gold[f]<90||s.action<1)return say('Требуется 90 монет и 1 действие');
 s.v28 ||= {};s.v28.grants ||= {};s.v28.grants[f]=s.turn;s.gold[f]-=90;s.action--;
 log('Обозная субсидия: ёмкость местного снабжения +25% до конца квартала. −90 монет, −1 действие.');drawAll();v24Panel('court');
}
const v28Supply=v27Supply;
v27Supply=function(p,f,i){const a=v28Supply(p,f,i),capacity=a.capacity*(v28GrantActive(f)?1.25:1),load=a.demand/Math.max(1,capacity);return {...a,capacity,load,factor:Math.max(.65,1-Math.max(0,load-1)*.12)}};
const v28Court=v7court;
v7court=function(){return v28Court()+`<section class="v26-card"><small>XXVIII · ВОЕННЫЙ СОВЕТ</small><h3>Обозная субсидия</h3><p>Найм подвод увеличивает ёмкость местного снабжения всех своих армий на 25% до конца текущего квартала. Стоимость: 90 монет и 1 действие. Субсидия снижает штраф перегрузки; при достаточном снабжении дополнительной боевой прибавки нет.</p><button onclick="v28Grant()" ${v28GrantActive(s.player)?'disabled':''}>${v28GrantActive(s.player)?'Действует до конца квартала':'Выделить субсидию'}</button></section>`};
const v28SupplyUI=v27SupplyCard;
v27SupplyCard=function(i=selected){return v28SupplyUI(i)+(s.provinces[i]?.owner===s.player?`<p class="v28-note">Обозная субсидия: ${v28GrantActive(s.player)?'+25% ёмкости до конца квартала':'не выделена'}. Походные кухни: дополнительный рацион ×${globalMod(s.player,'fieldRationCost').toFixed(2)}.</p>`:'')};
// Preserve wind-aware interception, but avoid collisions and steer back from map edges.
const v28Enemy=v26EnemyTactics;
v26EnemyTactics=function(u,friendly,enemy){
 if(!friendly.length)return;v28Enemy(u,friendly,enemy);
 const near=enemy.find(x=>x!==u&&Math.hypot(x.pos[0]-u.pos[0],x.pos[1]-u.pos[1])<9);
 if(near&&u.v26Tactic!=='withdraw'){
  const away=Math.atan2(u.pos[1]-near.pos[1],u.pos[0]-near.pos[0]);
  u.desiredHeading=away;u.v28Avoiding=true;
 }else u.v28Avoiding=false;
 if(Math.abs(u.pos[0])>222||Math.abs(u.pos[1])>182)u.desiredHeading=Math.atan2(-u.pos[1],-u.pos[0]);
 const w=v27Wind(),diff=Math.atan2(Math.sin(u.desiredHeading-w.from),Math.cos(u.desiredHeading-w.from));
 if(Math.abs(diff)<.65)u.desiredHeading=w.from+(diff<0?-1:1)*.78;
};
// NPCs load provisions before allocating new patrols and reject unaffordable voyages.
const v28PatrolOrders=v20AIPatrolOrders;
v20AIPatrolOrders=function(){
 const previous=new Set(v8get().seaOrders.map(o=>o.id));
 for(const fl of s.fleets)if(fl.f!==s.player&&!v28AtSea(fl))v28Resupply(fl.id,true);
 v28PatrolOrders();
 v8get().seaOrders=v8get().seaOrders.filter(o=>{
  if(previous.has(o.id)||o.f===s.player)return true;
  const fl=s.fleets.find(x=>x.id===o.fleetId),ships=fl?v8shipsOf(fl):[];
  return ships.length>0&&ships.every(sh=>v28Days(sh)>=o.remaining);
 });
};
