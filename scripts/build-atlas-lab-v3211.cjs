'use strict';
const fs=require('node:fs'),{catalog}=require('../tests/helpers/catalog.cjs');
const source=fs.readFileSync('www/js/app.js','utf8'),regions=catalog(source,true).REGIONS;
const continents=source.slice(source.indexOf('const ATLAS_CONTINENTS='),source.indexOf('function regionRequirementsMet('));
const rules=source.slice(source.indexOf('function regionRequirementsMet('),source.indexOf('function unlockRegion(',source.indexOf('function regionRequirementsMet(')));
const projection=source.slice(source.indexOf('function atlasRegionModel('),source.indexOf('function renderAtlas('));
const shell=fs.readFileSync('www/index.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const output=`/* Generated from the production catalog, unlock predicates and view projection.
 * Isolated sample state only. Run node scripts/build-atlas-lab-v3211.cjs to regenerate. */
(function(root){'use strict';
const REGIONS=${JSON.stringify(regions)};
const southAmerica3230=true;
${continents}
function model(profile='current',continent='Europa',selectedId){
 const targets=REGIONS.filter(r=>r.continent===continent),initial=REGIONS[0].id;
 const state={currentRegion:initial,atlasView:continent,atlasSelectedRegion:selectedId||((profile==='current'?targets[0]:targets[1]||targets[0])?.id),prestige:profile==='locked'?0:300,upgrades:profile==='locked'?{}:{asiaUnlocked:1,africaUnlocked:1,newWorldUnlocked:1,northAmericaUnlocked:1,southAmericaUnlocked:1},inventory:profile==='locked'?{}:{africa_map:1,north_america_map:1},regionUnlocked:{[initial]:true},stages:{}};
 if(profile==='current'&&targets[0]){state.currentRegion=targets[0].id;state.regionUnlocked[targets[0].id]=true;}
 if(profile==='open'&&targets[1])state.regionUnlocked[targets[1].id]=true;
 for(const r of REGIONS)for(const id of r.species.slice(0,3))state.stages[id]=1;
 const stage=id=>state.stages[id]||0,fmt=value=>String(value);
 ${rules}
 ${projection}
 ${source.match(/\/\/ AM-04 BEGIN atlas-access\n[\s\S]*?\/\/ AM-04 END atlas-access\n/)[0]}
 return atlasViewModel();
}
const api=Object.freeze({model,continents:ATLAS_CONTINENTS,regions:REGIONS,shell:${JSON.stringify(shell)}});root.AtlasReviewData=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
`;
const path='www/js/lab/atlas-catalog-v3211.js';
if(process.argv.includes('--check')){if(!fs.existsSync(path)||fs.readFileSync(path,'utf8')!==output)throw Error('Atlas review data differs from production; regenerate it.');}
else fs.writeFileSync(path,output);
