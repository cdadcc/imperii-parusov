const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined, args:process.env.BROWSER_ARGS ? JSON.parse(process.env.BROWSER_ARGS) : []});
  try {
    for (const fallback of [false,true]) {
      const page = await browser.newPage({viewport:{width:1440,height:960}});
      const errors=[], bad=[], requests=[];
      page.on('pageerror', e=>errors.push(e.message));
      page.on('response', r=>{if(r.status()>=400)bad.push(r.url());});
      page.on('request', r=>requests.push(r.url()));
      if(fallback)await page.addInitScript(()=>{window.DecompressionStream=undefined;});
      await page.goto(process.env.GAME_URL || 'http://127.0.0.1:8765/', {waitUntil:'domcontentloaded'});
      await page.locator('#eos-loading').waitFor({state:'detached',timeout:90000});
      await page.locator('#goStart').click();
      await page.evaluate(()=>{
        if(N.length!==3399||TECH.length!==371)throw Error('Missing game data');
        v24Panel('research');
      });
      await page.locator('.v24-start').click();
      await page.evaluate(()=>{
        if(!s.research[s.player])throw Error('Research did not start');
        const old=s.research[s.player].remaining;advanceDay();
        if(s.research[s.player].remaining>=old)throw Error('Research did not advance');
        save();const gold=s.gold[s.player];s.gold[s.player]=0;load();
        if(s.gold[s.player]!==gold)throw Error('Save/load failed');
        v24Panel('court');
      });
      for(const tab of ['fleet','regiments','industry']){
        await page.evaluate(k=>v24Panel(k),tab);
        assert(await page.locator('#v15-window').isVisible());
        await page.evaluate(()=>v15Close());
      }
      const imageErrors=await page.evaluate(()=>[...document.images].filter(i=>i.src.includes('/assets/images/')&&i.complete&&!i.naturalWidth).map(i=>i.src));
      assert.deepEqual(imageErrors,[]);assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);
      assert(requests.some(u=>u.endsWith(fallback?'.json':'.json.gz')));
      if(!fallback)assert(!requests.some(u=>/\/data\/.*\.json$/.test(u)));
      await page.setViewportSize({width:390,height:844});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      console.log('PASS',fallback?'plain JSON fallback':'compressed data','research, daily simulation, save/load, fleet, army, industry, images, mobile');
      await page.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
