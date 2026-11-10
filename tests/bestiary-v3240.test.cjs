'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {harness}=require('./helpers/live-game.cjs'),{withoutBestiaryPagination}=require('./helpers/legacy-source.cjs');
const ids=html=>[...html.matchAll(/class="species-card [^"]*"[^>]*data-id="([^"]+)"/g)].map(m=>m[1]);
const click=(g,page)=>g.handlePanelAction({target:{closest:()=>({dataset:{action:'bestiary-page',id:String(page)}})}});
function known(g){for(const id of Object.keys(g.SPECIES)){g.state.discovered[id]=true;g.state.stages[id]=1;}}
function allPages(g){const first=g.renderBestiary(),pages=Number(first.match(/data-pages="(\d+)"/)[1]),out=[];for(let page=0;page<pages;page++){g.bestiaryPage=page;const batch=ids(g.renderBestiary());assert.ok(batch.length<=32);out.push(...batch);}return out;}
test('Bestiary opens 32 of 807 cards, preserves global counters and only generates visible SVGs',()=>{
 const g=harness().window.__atlasTest;known(g);const cache=g.spriteCacheSize,html=g.renderBestiary();assert.equal(g.BESTIARY_PAGE_SIZE,32);assert.equal(ids(html).length,32);assert.match(html,/Identificadas 807\/807/);assert.match(html,/807 de 807 visibles/);assert.match(html,/data-pages="26" data-total="807"/);assert.equal(g.spriteCacheSize-cache,32);assert.equal((html.match(/data-bestiary-pager/g)||[]).length,2);
});
test('all six existing sort orders and the monograph filter exactly match the 3.23.1 full renderer across every page',()=>{
 const g=require('./helpers/oceania-review.cjs').baselineHarness().window.__atlasTest,legacy=harness({},null,{gameSource:withoutBestiaryPagination(require('./helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8')))}).window.__atlasTest;
 for(const hide of [false,true])for(const sort of ['alpha','rarity','type'])for(const descending of [false,true]){for(const a of [g,legacy]){a.state.bestiarySort=sort;a.state.bestiaryDescending=descending;a.state.bestiaryHideMonographs=hide;for(const[id,index]of Object.keys(a.SPECIES).map((id,index)=>[id,index])){a.state.stages[id]=5;if(index%3===0)a.state.published[id]=true;}}
  const expected=ids(legacy.renderBestiary()),actual=allPages(g);assert.equal(new Set(actual).size,actual.length);assert.deepEqual(actual,expected,[sort,descending,hide].join(':'));assert.equal(actual.length,hide?473:710);
 }
});
test('page navigation never changes saved data, and the page survives tab changes but resets on reload',()=>{
 const h=harness(),g=h.window.__atlasTest;g.openTab('bestiary');g.persist();const raw=h.store.gran_atlas_v05,before=JSON.stringify(g.state);click(g,7);assert.equal(g.bestiaryPage,7);assert.equal(JSON.stringify(g.state),before);assert.equal(h.store.gran_atlas_v05,raw);g.openTab('field');g.openTab('bestiary');assert.equal(g.bestiaryPage,7);g.persist();assert.ok(!Object.keys(JSON.parse(h.store.gran_atlas_v05)).some(k=>/bestiaryPage|pagination/i.test(k)));assert.equal(harness(h.store).window.__atlasTest.bestiaryPage,0);
});
test('invalid navigation is ignored; filters clamp the page and all-hidden catalog stays usable',()=>{
 const g=harness().window.__atlasTest;g.openTab('bestiary');g.bestiaryPage=22;g.renderBestiary();for(const id of Object.keys(g.SPECIES).slice(0,797))g.state.published[id]=true;g.state.bestiaryHideMonographs=true;assert.equal(ids(g.renderBestiary()).length,10);assert.equal(g.bestiaryPage,0);for(const id of Object.keys(g.SPECIES))g.state.published[id]=true;const empty=g.renderBestiary();assert.equal(ids(empty).length,0);assert.match(empty,/Página 1\/1/);assert.match(empty,/0–0 de 0/);assert.equal((empty.match(/ disabled/g)||[]).length,4);for(const bad of [-1,NaN,Infinity,'junk',1.5]){click(g,bad);assert.equal(g.bestiaryPage,0);}click(g,999);assert.equal(g.bestiaryPage,0);
});
test('unpublished 5/5 entries stay accessible, and rediscovering a species does not mutate its collection when paging',()=>{
 const g=harness().window.__atlasTest;g.state.bestiaryHideMonographs=true;g.state.stages.zorro_rojo=5;g.state.specialFound.zorro_rojo={Albino:true,Notable:true};g.state.sexSeen.zorro_rojo={male:true,female:true};const before=JSON.stringify(g.state);assert.ok(allPages(g).includes('zorro_rojo'));assert.equal(JSON.stringify(g.state),before);g.state.published.zorro_rojo=true;assert.ok(!allPages(g).includes('zorro_rojo'));
});
test('specimen collections remain empty until requested; repeated full navigation reuses a bounded cache',()=>{
 const g=harness().window.__atlasTest;known(g);const html=g.renderBestiary();assert.equal((html.match(/<div data-specimen-content><\/div>/g)||[]).length,32);allPages(g);const size=g.spriteCacheSize;assert.equal(size,807);allPages(g);assert.equal(g.spriteCacheSize,size);assert.equal(Object.keys(g.SPECIES).length,807);
});
