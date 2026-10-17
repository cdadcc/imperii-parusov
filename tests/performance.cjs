// Run with BENCHMARK_ROOT serving both the archived HTML and the repository dist.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined});try{
 const context=await browser.newContext({viewport:{width:1280,height:900}});const results={};let oldSave;
 for(const kind of ['baseline','modular']){
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{let seed=127;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296)});
  const base=process.env.BENCHMARK_ROOT||'http://127.0.0.1:8773/';
  await page.goto(base+(kind==='baseline'?'empire_of_sails_v27.html':'imperii-parusov/dist/'),{waitUntil:'domcontentloaded'});
  if(kind==='modular')await page.locator('#eos-loading').waitFor({state:'detached',timeout:90000});
  await page.locator('#goStart').click();
  const result=await page.evaluate(()=>{
   const measure=(fn,n)=>{const a=[];for(let i=0;i<n;i++){const start=performance.now();fn();a.push(performance.now()-start)}return a};
   const map=measure(drawMap,6);const node=document.querySelector('#regions .province');drawMap();const reuse=node===document.querySelector('#regions .province');
   const i=0,p=s.provinces[i],owner=p.owner;mode='political';drawMap();p.owner=(owner+1)%F.length;drawMap();const color=document.querySelector('#regions .province').getAttribute('fill');if(color!==provinceFill(N[i],p))throw Error('Stale province colour');p.owner=owner;drawMap();
   v8Open3DBattle('sea',false,{drill:true});cancelAnimationFrame(V8_FRAME);V8_FRAME=0;V8_SCENE.paused=true;V8_SCENE.time=0;v8render3D();const render=measure(v8render3D,10),canvas=V8_CANVAS.toDataURL();
   const mesh=v8meshFor(V8_SCENE.units[0]);const vertices=typeof eosIndexMesh==='function'?eosIndexMesh(mesh).vertices.length:null;
   return {map,render,reuse,canvas,vertices,vertexUses:mesh.faces.length*3+mesh.segments.length*2};
  });
  result.canvasHash=crypto.createHash('sha256').update(result.canvas).digest('hex');delete result.canvas;results[kind]=result;
  if(kind==='baseline')oldSave=await page.evaluate(()=>JSON.stringify(s));
  else{
   assert(result.reuse,'Map geometry was recreated');
   await page.evaluate(data=>{v8Stop3D();restoreSave(JSON.parse(data));drawAll();if(N.length!==3399||!s.ships.length)throw Error('Old save import failed');v8Open3DBattle('sea',false,{drill:true});V8_SCENE.paused=true;window.draws=0;const base=v8render3D;v8render3D=function(){window.draws++;return base()};},oldSave);
   await page.evaluate(()=>new Promise(resolve=>{let n=0;function tick(){if(++n===8)resolve();else requestAnimationFrame(tick)}requestAnimationFrame(tick)}));
   const before=await page.evaluate(()=>window.draws);assert(before<=2,'Paused scene was repeatedly rendered');
   await page.evaluate(()=>{V8_SCENE.yaw+=.1});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert(await page.evaluate(()=>window.draws)>before,'Paused camera did not repaint');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 assert.equal(results.baseline.canvasHash,results.modular.canvasHash,'3D pixels changed');
 const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
 results.medians=Object.fromEntries(Object.entries(results).filter(([k])=>k!=='medians').map(([k,v])=>[k,{map_ms:median(v.map),render_ms:median(v.render)}]));
 fs.writeFileSync(process.env.BENCHMARK_OUTPUT||'/tmp/eos-performance.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.medians));console.log('PASS: identical 3D canvas pixels, preserved province nodes, ownership redraw, old save, paused render and camera');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
