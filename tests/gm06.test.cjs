'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const{make,mature}=require('./helpers/gm06-game.cjs'),copy=x=>JSON.parse(JSON.stringify(x));
const original=cp.execFileSync('git',['show','41a4bbd:www/js/app.js'],{encoding:'utf8',maxBuffer:8e6});
test('GM06 preserves 945 full records, 113 stable IDs and every historical access threshold',()=>{
 const a=make({baseline:true,app:original}),b=make();assert.equal(Object.keys(b.g.SPECIES).length,997);assert.equal(b.g.REGIONS.length,125);
 for(const[id,sp]of Object.entries(a.g.SPECIES))assert.deepEqual(copy(b.g.SPECIES[id]),copy(sp),id);
 for(const r of a.g.REGIONS){const n=b.g.REGIONS.find(x=>x.id===r.id);assert.ok(n,r.id);assert.deepEqual(copy(n.unlock),copy(r.unlock));assert.equal(n.continent,r.continent);}
 for(const k of ['ITEMS','RECIPES','LEGENDARY_SPECIMENS','SPECIMEN_LEVELS','TRADE_ROUTES','VOYAGES','SCIENTIFIC_MISSIONS'])assert.deepEqual(copy(b.g[k]),copy(a.g[k]),k);
 const source=fs.readFileSync('www/js/app.js','utf8'),withoutHooks=source.replace(/\n\/\/ GM-06 review candidate[\s\S]*?\n}\n/,'\n').replace(/    \(sp.origin==='gm06'\?globalThis.AtlasGM06Art.render\(sp\):null\)\|\|\n/,'').replace("r.continent===continent&&r.origin!=='gm06'","r.continent===continent");assert.equal(withoutHooks.replace(/\n\s*\n/g,'\n'),original.replace(/\n\s*\n/g,'\n'),'only three opt-in hooks may change the legacy engine');
});
test('GM06 all axial cells are unique and neighboring edges remain continuous; names do not determine positions',()=>{
 const h=make();for(const c of new Set(h.g.REGIONS.map(r=>r.continent))){const regions=h.g.REGIONS.filter(r=>r.continent===c),m=h.geo.layout(c,regions),audit=h.geo.audit(c,regions);assert.equal(Object.keys(m.positions).length,regions.length,c);assert.equal(new Set(m.cells.map(c=>c.q+','+c.r)).size,m.cells.length,c);assert.equal(audit.edgeErrors.length,0,c);if(h.geo.gm06Coordinates[c])assert.ok(audit.maxError<1e-7,c);}
 const r=h.g.REGIONS.filter(r=>r.continent==='África');assert.deepEqual(copy(h.geo.layout('África',r).positions),copy(h.geo.layout('África',r.map(r=>({...r,name:'Nombre alternativo'}))).positions));
 const p=(c,id)=>h.geo.layout(c,h.g.REGIONS.filter(r=>r.continent===c)).positions[id];
 assert.ok(p('África','HX-09-12').r<p('África','HX-10-09').r);
 assert.ok(p('Sudamérica','gm06_galapagos').x<p('Sudamérica','sa_andes_del_norte').x);
 assert.ok(p('Sudamérica','gm06_humboldt').x<p('Sudamérica','sa_andes_centrales').x);
 assert.ok(p('Sudamérica','gm06_humboldt').r<p('Sudamérica','sa_desierto_de_atacama').r);
 assert.ok(p('Sudamérica','sa_patagonia_y_tierra_del_fuego').r>p('Sudamérica','gm06_bosques').r);
 assert.ok(p('Oceanía','gm06_melanesia').r>p('Oceanía','oc_nueva_guinea').r);
 assert.ok(p('Oceanía','gm06_melanesia').r<p('Oceanía','oc_nueva_zelanda').r);
 for(const[c,id]of [['Sudamérica','gm06_galapagos'],['Norteamérica','gm06_antillas'],['Asia','gm06_sonda'],['Asia','gm06_wallacea'],['Oceanía','gm06_melanesia']]){const x=p(c,id),neighbors=h.geo.layout(c,h.g.REGIONS.filter(r=>r.continent===c)).cells.filter(z=>z.playable&&z.regionIds[0]!==id&&h.geo.directions.some(([dq,dr])=>x.q+dq===z.q&&x.r+dr===z.r));assert.equal(neighbors.length,0,id);}
});
test('GM06 scientific identities, complete assignment graph, habitats and all legacy sprites remain valid',()=>{
 const a=make({baseline:true,app:original}),h=make(),latin=Object.values(h.g.SPECIES).map(sp=>sp.latin.toLowerCase());assert.equal(new Set(latin).size,latin.length);
 const assigned=new Set(h.g.REGIONS.flatMap(r=>r.species));for(const id of Object.keys(h.g.SPECIES))assert.ok(assigned.has(id),'orphan '+id);
 for(const r of h.g.REGIONS)for(const id of r.species){const sp=h.g.SPECIES[id];assert.ok(sp,id);if(r.origin==='gm06'||sp.origin==='gm06')assert.ok(sp.habitats.some(h=>r.habitats.includes(h)),r.id+' '+id);}
 for(const id of Object.keys(a.g.SPECIES))for(const skin of ['normal','albino','melanico'])assert.equal(h.g.getSpriteMarkup(id,skin),a.g.getSpriteMarkup(id,skin),id+' '+skin);
 const fresh=Object.entries(h.g.SPECIES).filter(([,sp])=>sp.origin==='gm06'),svgs=fresh.map(([id])=>h.g.getSpriteMarkup(id));assert.equal(new Set(svgs).size,52);
 for(const[id,sp]of fresh){assert.equal(h.g.taxonomyInfo(id).family,sp.taxonomy.family);assert.ok(!sp.special.includes('Albino'));assert.ok(!sp.dimorphism);assert.deepEqual(copy(h.g.SPECIMEN_CATEGORIES[id]),['Notable','Épico','Excepcional']);for(const skin of ['normal','alfa','epico','excepcional']){const svg=h.g.getSpriteMarkup(id,skin);assert.match(svg,/<svg/);assert.doesNotMatch(svg.replace('http://www.w3.org/2000/svg',''),/<image|<script|https?:\/\//i);}}
});
test('GM06 every new animal can be encountered manually and automatically, studied and published through the real engine',()=>{
 const h=make({rng:()=>0.001}),g=h.g;let s=mature(h);const fresh=Object.entries(g.SPECIES).filter(([,sp])=>sp.origin==='gm06');for(const r of g.REGIONS.filter(r=>r.origin==='gm06'))delete s.regionUnlocked[r.id];const prestige=s.prestige;s.prestige=0;assert.equal(g.regionRequirementsMet(g.REGIONS.find(r=>r.id==='gm06_hudson')),false);s.prestige=prestige;
 for(const[id,sp]of fresh){const r=g.REGIONS.find(r=>r.species.includes(id));assert.ok(g.regionRequirementsMet(r),r.id+' access');g.unlockRegion(r.id);assert.ok(g.regionAccessible(r));g.setRegion(r.id);s=g.state;const habitat=sp.habitats.find(x=>r.habitats.includes(x));s.habitat=habitat;s.time=sp.times[0];s.season=sp.seasons[0];assert.ok(g.eligibleSpecies(r.id,habitat,s.time,s.season).includes(id));assert.ok(g.automaticEligibleSpecies(r.id,s.season).includes(id));
  // A one-species pool removes random selection while exercising the actual encounter path and record updates.
  const pool=r.species;r.species=[id];const before=s.sightings[id]||0;g.encounter('manual',h.now);assert.ok(s.sightings[id]>before,id+' manual');const manual=s.sightings[id];g.encounter('auto',h.now);assert.ok(s.sightings[id]>manual,id+' auto');r.species=pool;
  s.sightings[id]=640;s.feedObs[id]=12;g.recordSpecimen(id,{category:'Notable'},s);for(let st=s.stages[id]||0;st<5;st++){assert.ok(g.stageRequirements(id,st).allOk,id+' stage '+st);g.advanceSpecies(id);}const p=s.prestige;g.publishMonograph(id);g.publishMonograph(id);assert.equal(s.prestige,p+1,id);assert.ok(s.published[id]);
  s.selectedJournal=id;assert.match(g.renderJournal(),new RegExp(sp.latin.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.ok(g.bestiaryViewModel3260().total>=52);
 }
});
test('GM06 3.43 save keeps moved region, profile, pending jobs, history, awards, exhibits and backup format v1',async()=>{
 const a=make({baseline:true,app:original});let s=mature(a);for(const id of Object.keys(a.g.SPECIES)){s.discovered[id]=true;s.sightings[id]=640;s.feedObs[id]=12;s.stages[id]=5;s.published[id]=true;}
 s.currentRegion='sa_patagonia_y_tierra_del_fuego';s.regionsVisited={[s.currentRegion]:true};s.naturalistProfile3430={name:'Elena Ríos',avatar:'botanica'};s.museum.exhibits={frailecillo_atlantico:true,cisne_vulgar:true};s.purchases.ornito_1=1;for(const n of a.g.RESEARCH_NODES.filter(n=>/excava|paleontologia|relictos/.test(n.id))){s.purchases[n.id]=1;n.effect(s);}a.g.sail('coast');a.g.startTrade3300('coastal_trade');a.g.startExcavation('british_cliffs');s.museum.relictLeads[a.g.MUSEUM_RELICTS[0].id]=1;a.g.startRelictSurvey(a.g.MUSEUM_RELICTS[0].id);a.window.AtlasSaveBridge.restoreGame(copy(a.window.AtlasSaveBridge.getSaveData()));a.g.persist();const old=copy(a.window.AtlasSaveBridge.getSaveData()),store={'gran_atlas_v05':JSON.stringify(old)},b=make({store});
 assert.ok(old.voyages.length&&old.commerce.jobs.length&&old.museum.excavations.length&&old.museum.relictSurveys.length,'all four job queues represented');assert.ok(Object.keys(old.achievements.unlocked).length>20,'accredited legacy achievements represented');assert.ok(old.museum.curation.completed.british,'accredited legacy exhibition represented');
 for(const key of ['currentRegion','collectionId','naturalistProfile3430','discovered','sightings','stages','published','specialFound','inventory','regionUnlocked','voyages','commerce','museum','achievements','commissions'])assert.deepEqual(copy(b.g.state[key]),copy(old[key]),key);
 assert.ok(b.g.regionAccessible(b.g.REGIONS.find(r=>r.id===old.currentRegion)));assert.equal(b.g.state.regionsVisited[old.currentRegion],true);b.g.persist();const backup={format:'el-gran-atlas-save',formatVersion:1,gameVersion:'3.43.0',game:copy(b.window.AtlasSaveBridge.getSaveData())};const c=make({backup});await c.import();assert.equal(c.g.state.currentRegion,old.currentRegion);assert.deepEqual(copy(c.g.state.naturalistProfile3430),old.naturalistProfile3430);
});
