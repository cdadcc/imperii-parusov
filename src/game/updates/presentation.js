// Procedural assets remain deterministic and respond to the equipped ship design.
const v28CampaignArt=v19TechPicture;
v19TechPicture=function(t){
 const shapes={v28_kitchens:'<path d="M65 76h130v40H65zM75 68h110M91 62q-15-17 0-28m39 28q-15-17 0-28m39 28q-15-17 0-28M65 90H48V76h17m130 14h17V76h-17M86 117v19m88-19v19"/><circle cx="91" cy="131" r="11"/><circle cx="169" cy="131" r="11"/>',v28_manifests:'<path d="M61 24h110v115H61zM80 47h66M80 64h66M80 81h35M80 98h35M80 115h35M185 45v76m-17-22q17 36 34 0m-31-16h28"/><circle cx="185" cy="39" r="7"/><path d="m122 95 9 9 21-27"/>'};
 if(!shapes[t.id])return v28CampaignArt(t);
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 160"><rect width="260" height="160" fill="#19323c"/><rect x="9" y="9" width="242" height="142" fill="none" stroke="#947f56"/><g fill="none" stroke="#ddc28c" stroke-width="2">${shapes[t.id]}</g></svg>`);
};
const v28PortraitBase=v15Portrait;
v15Portrait=function(name,role='Придворный',kind='court'){
 const raw=decodeURIComponent(v28PortraitBase(name,role,kind).split(',').slice(1).join(',')),random=v15Random(v15Hash(name+'|'+role+'|XXVIII'));
 let detail='<g fill="none" stroke="#6a4a3c" stroke-width=".55" opacity=".38">';
 for(let i=0;i<18;i++){const x=65+random()*51,y=111+random()*23;detail+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}l1.8 .6"/>`}
 detail+='</g><g stroke="#ead8ad" stroke-width=".6" opacity=".65">';
 for(let i=0;i<9;i++)detail+=`<path d="M${28+i*2} 175l-2 12M${132+i*2} 175l2 12"/>`;
 detail+='</g><path d="M62 87q11-5 20-1m18 0q11-4 20 1M66 117q7 4 15 1m20 0q7 3 15-1" fill="none" stroke="#795447" stroke-width=".7" opacity=".6"/>';
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(raw.replace('</svg>',detail+'</svg>'));
};
v20Portrait=v15Portrait;v21Portrait=v15Portrait;
for(const n of NATIONAL){V15_PEOPLE[n.ruler]=v15Portrait(n.ruler,n.title);n.v14portrait=n.v12portrait=n.v20portrait=V15_PEOPLE[n.ruler]}
for(const a of ADVISERS){V15_PEOPLE[a.id]=v15Portrait(a.name,a.role);a.v14portrait=a.v12portrait=a.v20portrait=V15_PEOPLE[a.id]}
for(const a of V6_ADMIRALS)V15_PEOPLE[a.name]=v15Portrait(a.name,'Адмирал');
const v28DetailedMesh=v8shipMesh;
v8shipMesh=function(type='frigate',d=null){
 const m=v28DetailedMesh(type,d),z=type==='line'?1.55:type==='frigate'?1.1:type==='transport'?1.16:.82;
 // Quarterdeck rail stanchions and stern lanterns, genuine projected geometry.
 for(const side of [-1,1]){
  for(let i=0;i<6;i++){const x=(-4.1+i*.38)*z;v8seg(m,[x,side*1.1*z,.75*z],[x,side*1.1*z,1.2*z],'#b59767',1)}
  v8seg(m,[-4.1*z,side*1.1*z,1.2*z],[-2.2*z,side*1.1*z,1.2*z],'#9b7849',1.3);
  v8cube(m,-4.15*z,side*.8*z,1.4*z,.17*z,.17*z,.3*z,'#d5b766');
 }
 return m;
};
const v28Info=tabHelp;
tabHelp=function(){return `<section class="v26-card"><h3>XXVIII · Обновление</h3><p>Морская тактическая акватория: 480 × 400 условных единиц, на 78% больше по площади, чем 360 × 300. Это расширение пространства манёвра, а не географии кампании. ИИ избегает близких союзных кораблей и возвращается от края акватории.</p><p>Добавлены полковые кухни, портовые ведомости и обозная субсидия. Во флоте доступны выбор флагмана, индивидуальный провиант и защищённый пост связи. Числа в описаниях — игровые коэффициенты.</p></section>`+v28Info()};
const v28PresentationCSS=document.createElement('style');
v28PresentationCSS.textContent=`.v28-note{padding:10px 16px;color:#d9c39a;background:#152b35;font:13px/1.6 'Segoe UI',sans-serif}.v28-fleet{border-top:3px solid #b49a62;box-shadow:0 6px 18px #0003}.v28-fleet h3{letter-spacing:.025em}.v28-fleet .v27-metrics small{color:#d0c3a8;font-size:12px}.v28-fleet td,.v28-fleet th{font-size:13px}.v28-fleet button{min-height:36px}.v28-fleet select:focus-visible,button:focus-visible{outline:2px solid #e2c47f;outline-offset:2px}`;
document.head.appendChild(v28PresentationCSS);
document.title='Империи парусов · XXVIII';
let v28SupplyVisible=false;
const v28ProvinceFill=provinceFill;
provinceFill=function(n,p){if(!v28SupplyVisible||p.owner!==s.player)return v28ProvinceFill(n,p);const i=N.indexOf(n),a=v27Supply(p,p.owner,i);return a.load>2?'#b75d48':a.load>1?'#ba9857':'#4d897b'};
function v28ToggleSupply(){v28SupplyVisible=!v28SupplyVisible;drawMap();v24Refresh()}
const v28SupplyRefresh=v24Refresh;
v24Refresh=function(){
 v28SupplyRefresh();const nav=document.getElementById('v24-nav');if(!nav)return;
 let button=document.getElementById('v28-supply-layer');
 if(!button){button=document.createElement('button');button.id='v28-supply-layer';button.onclick=v28ToggleSupply;nav.appendChild(button)}
 button.textContent=v28SupplyVisible?'Снабжение: зелёный ≤100%, охра ≤200%, красный >200%':'Карта снабжения';
 button.setAttribute('aria-pressed',String(v28SupplyVisible));
};
