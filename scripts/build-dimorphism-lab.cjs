'use strict';
// Extract the production catalog and pure sprite router, excluding every game/save initializer.
const fs=require('node:fs');
const {catalogSource}=require('../tests/helpers/catalog.cjs');
const source=require('../tests/helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8')).replace(/\/\/ AM-04 BEGIN [^\n]+\n[\s\S]*?\/\/ AM-04 END [^\n]+\n/g,'');
const content='/* Generated from app.js; run node scripts/build-dimorphism-lab.cjs. No game bootstrap. */\n(function(){\n'+catalogSource(source)+'\n'+source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'))+'\nglobalThis.ATLAS_DIMORPHISM_LAB={SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,SPECIMEN_LEVELS,SPECIMEN_CATEGORIES,LEGENDARY_SPECIMENS,configuredSpecials,specimenRates,rollSpecimen,recordSpecimen,legendaryForSpecies};\n})();\n';
const path='www/js/lab/dimorphism-production.js';
if(process.argv.includes('--check')){if(fs.readFileSync(path,'utf8')!==content)throw Error('Stale production lab');}else fs.writeFileSync(path,content);
