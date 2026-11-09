'use strict';
const {withoutBestiaryPagination}=require('./helpers/legacy-source.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {catalog}=require('../scripts/load-southamerica-review-v3231.cjs'),{harness}=require('./helpers/live-game.cjs');
const context=catalog(),after=context.AtlasSouthReview,before=context.AtlasSouthBefore3231,data=context.AtlasSouthAmerica3230;
const audit=require('../docs/sudamerica-v3231/art-audit.json'),baseline=require('../docs/sudamerica-v3230/render-inventory.json');
const ids=Object.keys(data.taxa),hash=s=>crypto.createHash('sha256').update(s).digest('hex'),json=x=>JSON.parse(JSON.stringify(x));
const geometry=svg=>[...svg.matchAll(/\b(?:d|cx|cy|r|rx|ry|points|transform)="([^"]*)"/g)].map(m=>m[0]).join('|');
const skins=id=>['normal',...(after.species[id].special.includes('Albino')?['albino']:[]),...(after.species[id].special.includes('Melánico')?['melanico']:[]),...(after.categories[id]||[]).map(c=>({Notable:'alfa','Épico':'epico',Excepcional:'excepcional',Legendario:'legendario'}[c]))];

test('AM-05 preserves the complete gameplay source, 710 identities, 79 regions, ten South American regions and all 192 source records',()=>{
 for(const[file,digest]of Object.entries(require('./fixtures/southamerica-protected-v3230.json')))assert.equal(hash(file==='www/js/app.js'?withoutBestiaryPagination(fs.readFileSync(file,'utf8')):fs.readFileSync(file)),digest,file);
 assert.equal(Object.keys(after.species).length,710);assert.equal(after.regions.length,10);assert.equal(after.regions.reduce((n,r)=>n+r.species.length,0),192);assert.equal(ids.length,131);assert.equal(Object.keys(data.species).length,121);
 assert.equal(harness().window.__atlasTest.REGIONS.length,79);assert.equal(new Set(data.presences.map(p=>p.row)).size,192);
 assert.deepEqual(json(data.regions.map(r=>r.unlock.prestige).sort((a,b)=>a-b)),[167,170,173,176,179,182,185,188,191,194]);
});
test('the before comparison reproduces every real 3.23.0 SVG hash, rather than a new approximation',()=>{
 for(const row of baseline)assert.equal(hash(before.sprite(row.id)),row.sha256,row.latin);
 assert.equal(baseline.length,131);assert.equal(audit.length,131);assert.equal(new Set(audit.map(r=>r.id)).size,131);
 for(const row of audit){assert.equal(row.beforeSha256,hash(before.sprite(row.id)));assert.equal(row.afterSha256,hash(after.sprite(row.id)));assert.equal(row.scientific,after.species[row.id].latin);assert.equal(row.family,data.taxa[row.id].family);assert.match(row.finalStatus,/^A ·/);assert.ok(row.problem&&row.correction);}
});
test('all 36 A profiles, including ten shared identities, remain byte-identical in every configured variant and sex',()=>{
 const unchanged=audit.filter(r=>r.initialGrade==='A');assert.equal(unchanged.length,36);assert.equal(unchanged.filter(r=>r.reused).length,10);
 for(const row of unchanged)for(const skin of skins(row.id))for(const sex of after.dimorphism[row.id]?[null,'male','female']:[null])assert.equal(after.sprite(row.id,skin,sex),before.sprite(row.id,skin,sex),row.scientific+':'+skin+':'+sex);
});
test('95 interventions include actual geometry changes; every C/D profile changes anatomy instead of only its color',()=>{
 const counts=Object.fromEntries(['A','B','C','D'].map(grade=>[grade,audit.filter(r=>r.initialGrade===grade).length]));assert.deepEqual(counts,{A:36,B:33,C:57,D:5});
 for(const row of audit.filter(r=>r.initialGrade!=='A')){const svg=after.sprite(row.id);assert.match(svg,/data-sa-polish="3231"/);assert.notEqual(geometry(svg),geometry(before.sprite(row.id)),row.scientific);assert.match(svg,new RegExp('data-zoological-family="'+row.family+'"'));}
 const classes=Object.fromEntries(['Mammalia','Aves','Reptilia','Amphibia','Actinopterygii'].map(cls=>[cls,audit.filter(r=>r.className===cls).length]));assert.deepEqual(classes,{Mammalia:60,Aves:41,Reptilia:15,Amphibia:6,Actinopterygii:9});
});
test('regional polish never captures any of the 589 prior identities, and all their sprite routes remain identical',()=>{
 for(const[id,sp]of Object.entries(after.species).filter(([id])=>!data.species[id])){
  assert.equal(context.ATLAS_SOUTH_POLISH_V3231(sp,sp.color),null,id);assert.equal(context.ATLAS_SOUTH_DETAIL_V3231(sp,'<svg/>'),null,id);
  for(const skin of ['normal',...(sp.special.includes('Albino')?['albino']:[]),...(sp.special.includes('Melánico')?['melanico']:[])])for(const sex of after.dimorphism[id]?[null,'male','female']:[null])assert.equal(after.sprite(id,skin,sex),before.sprite(id,skin,sex),id+':'+skin+':'+sex);
 }
});
test('all eleven new dimorphisms retain structural differences: antlers, comb, crest, plumage and duck size',()=>{
 assert.equal(Object.keys(data.dimorphism).length,11);for(const id of Object.keys(data.dimorphism))assert.notEqual(geometry(after.sprite(id,'normal','male')),geometry(after.sprite(id,'normal','female')),id);
 for(const n of ['Blastocerus dichotomus','Hippocamelus antisensis','Hippocamelus bisulcus','Mazama americana','Ozotoceros bezoarticus','Pudella mephistophiles','Pudu puda']){const id=data.ids[n];assert.ok(after.sprite(id,'normal','male').includes('#a89b81'));assert.ok(!after.sprite(id,'normal','female').includes('#a89b81'));}
 const wood=data.ids['Campephilus magellanicus'];assert.match(after.sprite(wood,'normal','female'),/M77 34L84 34L84 38L78 38Z/);assert.notEqual(after.sprite(wood,'normal','male'),after.sprite(wood,'normal','female'));
});
test('21 albinos, two melanics, 121 Notables, seven Epics and two Exceptionals preserve geometry and central production styling',()=>{
 const fresh=Object.keys(data.species);assert.equal(fresh.filter(id=>after.species[id].special.includes('Albino')).length,21);assert.equal(fresh.filter(id=>after.species[id].special.includes('Melánico')).length,2);
 for(const[category,count]of [['Notable',121],['Épico',7],['Excepcional',2]])assert.equal(fresh.filter(id=>after.categories[id]?.includes(category)).length,count);assert.ok(!fresh.some(id=>after.categories[id]?.includes('Legendario')));
 for(const id of fresh)for(const skin of skins(id).filter(s=>['albino','melanico'].includes(s))){const normal=after.sprite(id),variant=after.sprite(id,skin);assert.equal(geometry(variant),geometry(normal));assert.notEqual(variant,normal);assert.ok(new Set([...variant.matchAll(/(?:fill|stroke)="(#[\da-f]{6})"/gi)].map(m=>m[1])).size>=4,id+':'+skin);}
});
test('all species and configured sex/skin combinations use valid bounded SVG markup matching the live game',()=>{
 const live=harness().window.__atlasTest;let count=0;for(const id of ids)for(const skin of skins(id))for(const sex of after.dimorphism[id]?[null,'male','female']:[null]){const svg=after.sprite(id,skin,sex);assert.equal(svg,live.getSpriteMarkup(id,skin,sex));assert.match(svg,/^<svg /);assert.ok(svg.endsWith('</svg>'));assert.doesNotMatch(svg,/NaN|undefined|Infinity|<script|<foreignObject|<image|https?:\/\//);assert.ok(svg.length<20000);count++;}assert.equal(count,357);
});
test('sprite caching does not exchange identities, pigmentation or sexes when requests interleave',()=>{
 const cases=ids.flatMap(id=>skins(id).flatMap(skin=>(after.dimorphism[id]?[null,'male','female']:[null]).map(sex=>({id,skin,sex,hash:hash(after.sprite(id,skin,sex))}))));
 for(let i=0;i<3;i++)for(const entry of [...cases].reverse())assert.equal(hash(after.sprite(entry.id,entry.skin,entry.sex)),entry.hash);
});
test('3.23.0 South American progress, old regions, inventory, museum, variants and expeditions survive save reload and Android export/import',async()=>{
 const h=harness(),a=h.window.__atlasTest,s=a.state;Object.assign(s,{currentRegion:'sa_amazonia',prestige:200,money:123456,knowledge:98765});for(const r of data.regions)s.regionUnlocked[r.id]=true;s.regionUnlocked['HX-06-07']=true;s.regionUnlocked['HX-02-09']=true;s.purchases.sudamerica_1=1;s.purchases.norteamerica_1=1;s.upgrades.southAmericaUnlocked=true;s.inventory.north_america_map=1;
 const id=data.ids['Hydrochoerus hydrochaeris'];s.sightings[id]=71;s.stages[id]=5;s.published[id]=true;s.specialFound[id]={Albino:true,Notable:true};s.museum.exhibits[id]=true;s.sexSeen[data.ids['Vultur gryphus']]={male:true,female:true};a.persist();const saved=JSON.parse(h.store.gran_atlas_v05),loaded=harness(h.store),b=loaded.window.__atlasTest;
 for(const key of ['currentRegion','regionUnlocked','prestige','money','knowledge','sightings','stages','published','inventory','museum','voyages','specialFound','legendaryFound','sexSeen','purchases'])assert.deepEqual(json(b.state[key]),saved[key],key);
 let exported;loaded.window.Capacitor.Plugins.AtlasExport.saveFile=async({content})=>(exported=JSON.parse(content),{uri:'content://test'});await loaded.elements.saveDownloadBtn.fire('click');assert.equal(exported.gameVersion,'3.26.0');const restored=harness();restored.window.AtlasSaveBridge.restoreGame(exported.game);assert.equal(restored.window.__atlasTest.state.currentRegion,'sa_amazonia');assert.equal(restored.window.__atlasTest.state.sightings[id],71);assert.deepEqual(json(restored.window.__atlasTest.state.specialFound[id]),saved.specialFound[id]);
});
test('the new release precaches production polish, exact comparisons, visual ledger and an independent safe updater',()=>{
 const sw=fs.readFileSync('www/sw.js','utf8'),html=fs.readFileSync('www/index.html','utf8'),lab=fs.readFileSync('www/laboratorio-sudamerica-v3230.html','utf8');assert.match(sw,/gran-atlas-v3\.26\.0-bestiary-1/);assert.equal(require('../www/atlas-release.json').version,'3.26.0');
 for(const path of ['actualizar-v3231.html','js/southamerica-polish-v3231.js','js/lab/southamerica-art-before-v3231.js','js/lab/southamerica-before-v3231.js','js/lab/southamerica-audit-v3231.js'])assert.ok(sw.includes("'./"+path+"'"),path);
 assert.ok(html.indexOf('southamerica-polish-v3231.js')<html.indexOf('southamerica-art-v3230.js'));assert.doesNotMatch(html,/southamerica-before-v3231/);assert.doesNotMatch(lab,/src="js\/app\.js/);for(const value of ['compare','before','sex-pair','similar','64','80','120'])assert.ok(lab.includes('value="'+value+'"'));
 for(const path of ['www/js/southamerica-polish-v3231.js','www/js/lab/southamerica-lab-v3230.js'])assert.doesNotMatch(fs.readFileSync(path,'utf8'),/localStorage|sessionStorage|setInterval|setTimeout|Math\.random/);
});
