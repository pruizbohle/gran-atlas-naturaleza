'use strict';
const fs=require('node:fs'),{catalogSource}=require('../tests/helpers/catalog.cjs');
const source=fs.readFileSync('www/js/app.js','utf8');
const extension=source.slice(source.indexOf('// AM-02: additive catalog'),source.indexOf('// END AM-02 catalog installation.')+'// END AM-02 catalog installation.'.length);
const graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
const output=`/* Generated production catalog and exact sprite router. Isolated; no storage or live game. */
(function(root){'use strict';
${catalogSource(source)}
${extension}
${graphics}
root.AtlasNorthReview={species:SPECIES,regions:REGIONS.filter(r=>r.continent==='Norteamérica'),dimorphism:SEXUAL_DIMORPHISM,categories:SPECIMEN_CATEGORIES,sprite:getSpriteMarkup,taxonomy:taxonomyInfo};
})(typeof globalThis!=='undefined'?globalThis:this);
`;
const path='www/js/lab/northamerica-catalog-v3220.js';
if(process.argv.includes('--check')){if(fs.readFileSync(path,'utf8')!==output)throw Error('North American laboratory differs from production');}else fs.writeFileSync(path,output);
