'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),{make:gm06}=require('../tests/helpers/gm06-game.cjs');
const REF='2e0535d';
function make({candidate=false,...options}={}){
 let app=candidate?fs.readFileSync('www/js/app.js','utf8'):cp.execFileSync('git',['show',REF+':www/js/app.js'],{encoding:'utf8',maxBuffer:8e6});
 app=app.replace(/\n\}\)\(\);\s*$/,'\nwindow.__m01={getSpriteMarkup,SEXUAL_DIMORPHISM,configuredSpecials,variantToSkin,LEGENDARY_SPECIMENS,SPECIMEN_LEVELS,renderJournal,renderBestiary,renderMuseum,renderField,encounterCardMarkup,changeBestiaryFilter3260,stageRequirements,cacheSize:()=>spriteCache.size};\n})();');
 if(candidate)app=fs.readFileSync('www/js/gm07-m01/art.js','utf8')+'\n'+app;
 const h=gm06({...options,app});Object.assign(h.g,h.window.__m01);return h;
}
module.exports={REF,make};
