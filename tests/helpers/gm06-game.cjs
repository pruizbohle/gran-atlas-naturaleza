'use strict';
const fs=require('node:fs'),{make:uxMake}=require('./ux3410-game.cjs');
const read=p=>fs.readFileSync(p,'utf8');
const extra='getSpriteMarkup,automaticEligibleSpecies,taxonomyInfo,SPECIMEN_CATEGORIES,SPECIMEN_LEVELS,LEGENDARY_SPECIMENS,recordSpecimen,rollSpecimen,configuredSpecials,journalViewModel3250,bestiaryViewModel3260';
function make(options={}){
 let app=options.app||read('www/js/app.js');
 app=app.replace(/\n\}\)\(\);\s*$/,'\nwindow.__gm06Extra={'+extra+'};window.__gm06Geo=globalThis.AtlasGeography;\n})();');
 const modules=options.baseline?'':['catalog','geography','art'].map(n=>read('www/js/gm06/'+n+'.js')).join('\n');
 const h=uxMake({...options,headless:true,gameSource:modules+'\n'+app});Object.assign(h.g,h.window.__gm06Extra);h.geo=h.window.__gm06Geo;return h;
}
function mature(h){const s=h.g.initialState();s.money=1000000;s.knowledge=1000000;s.prestige=1000;s.helpers=0;
 for(const id of ['asia_1','africa_1','nuevo_mundo_1','norteamerica_1','sudamerica_1','oceania_1','polos_1','mares_superficiales_1','exploracion_profunda_1','exploracion_abisal_1','astillero','rutas_1','rutas_2','relictos_1']){const n=h.g.RESEARCH_NODES.find(n=>n.id===id);if(n){s.purchases[id]=1;n.effect(s);}}
 for(const id of Object.keys(h.g.ITEMS))s.inventory[id]=120;for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;
 h.window.AtlasSaveBridge.restoreGame(s);return h.g.state;
}
module.exports={make,mature};
