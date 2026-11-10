'use strict';
const fs=require('node:fs'),{catalogSource}=require('../tests/helpers/catalog.cjs'),source=require('../tests/helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8'));
const north=source.slice(source.indexOf('// AM-02: additive catalog'),source.indexOf('// END AM-02 catalog installation.')+'// END AM-02 catalog installation.'.length),south=source.match(/\/\/ AM-04 BEGIN catalog\n[\s\S]*?\/\/ AM-04 END catalog\n/)[0],graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
const output=`/* Generated exact production catalog and SVG router. Isolated from game state. */
(function(root){'use strict';
${catalogSource(source)}
${north}
${south}
${graphics}
root.AtlasSouthReview={species:SPECIES,regions:REGIONS.filter(r=>r.continent==='Sudamérica'),dimorphism:SEXUAL_DIMORPHISM,categories:SPECIMEN_CATEGORIES,sprite:getSpriteMarkup,taxonomy:taxonomyInfo};
})(typeof globalThis!=='undefined'?globalThis:this);
`;
const path='www/js/lab/southamerica-catalog-v3230.js';if(process.argv.includes('--check')){if(fs.readFileSync(path,'utf8')!==output)throw Error('South American lab differs from production');}else fs.writeFileSync(path,output);
