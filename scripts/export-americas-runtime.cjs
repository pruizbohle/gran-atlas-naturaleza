'use strict';
// Read-only audit: evaluate the complete production catalog in an isolated test VM.
const fs=require('node:fs'),crypto=require('node:crypto');
const {harness}=require('../tests/helpers/live-game.cjs');
const app=fs.readFileSync('www/js/app.js','utf8');
const engines=['mammal-art-v3194','bird-art-v3193','herp-art-v3192'];
const bridge='\nwindow.__americasAudit={SPECIES,REGIONS,SEXUAL_DIMORPHISM,RESEARCH_NODES,RECIPES,ITEMS,VOYAGES,GLOBAL_BIOMES_FULL,taxonomyInfo,spriteFor,regionRequirementsMet,ATLAS_CONTINENTS,configuredSpecials};\n';
const instrumented=app.replace(/\n\}\)\(\);\s*$/,bridge+'})();');
if(instrumented===app)throw Error('Audit bridge could not be injected');
const gameSource=engines.map(n=>fs.readFileSync('www/js/'+n+'.js','utf8')).join('\n')+'\n'+instrumented;
const a=harness({},null,{gameSource}).window.__americasAudit;
const mammal=require('../www/js/mammal-art-v3194.js'),bird=require('../www/js/bird-art-v3193.js'),fish=require('../www/js/fish-art-v3191.js'),herp=require('../www/js/herp-art-v3192.js');
function classify(sp){return {mammal:mammal.classifyMammal(sp),bird:bird.classifyBird(sp),fish:fish.classifyFish(sp),herp:herp.classifyHerp(sp)};}
const species=Object.fromEntries(Object.entries(a.SPECIES).map(([id,sp])=>{
 const svg=a.spriteFor(sp.kind,sp.color,'normal',id),attrs=Object.fromEntries([...svg.matchAll(/data-([\w-]+)="([^"]+)"/g)].map(m=>[m[1],m[2]]));
 return [id,{...sp,taxonomy:a.taxonomyInfo(id),artClassifiers:classify(sp),artAttributes:attrs,svgSha256:crypto.createHash('sha256').update(svg).digest('hex'),dimorphismConfig:a.SEXUAL_DIMORPHISM[id]||null,configuredSpecials:a.configuredSpecials(sp)}];
}));
let candidates={};if(process.argv[2]){const w=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),headers=w.Fauna[0];for(const row of w.Fauna.slice(1)){const r=Object.fromEntries(headers.map((h,i)=>[h,row[i]]));if(!['América del Norte','América del Sur'].includes(r['Continente / medio']))continue;const sp={latin:r['Nombre científico'],name:r['Nombre común']};candidates[sp.latin]={...sp,classifiers:classify(sp)};}}
const sources=['www/js/app.js',...engines.map(n=>'www/js/'+n+'.js'),'www/js/fish-art-v3191.js'].map(path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}));
console.log(JSON.stringify({sources,species,regions:a.REGIONS,research:a.RESEARCH_NODES,recipes:a.RECIPES,items:a.ITEMS,voyages:a.VOYAGES,biomes:a.GLOBAL_BIOMES_FULL,continents:a.ATLAS_CONTINENTS,candidates},null,2));
