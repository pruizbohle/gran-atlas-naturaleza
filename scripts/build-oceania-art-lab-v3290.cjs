'use strict';
const fs=require('node:fs'),{catalogSource}=require('../tests/helpers/catalog.cjs'),{candidateGameSource}=require('../tests/helpers/oceania-review.cjs');
const source=candidateGameSource();
const north=source.slice(source.indexOf('// AM-02: additive catalog'),source.indexOf('// END AM-02 catalog installation.')+'// END AM-02 catalog installation.'.length);
const south=source.match(/\/\/ AM-04 BEGIN catalog\n[\s\S]*?\/\/ AM-04 END catalog\n/)[0];
const candidate=source.slice(source.indexOf('// AM-04 END catalog')+'// AM-04 END catalog'.length,source.indexOf('const RESEARCH_NODES=')).replace(/^[ \t]+$/gm,'');
const graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
const output=`/* Generated exact app catalog and SVG router plus isolated Oceanian insertion. No game/save code. */\n(function(root){'use strict';\n${catalogSource(source)}\n${north}\n${south}\n${candidate}\n${graphics}\nroot.AtlasOceaniaArtReview={species:SPECIES,regions:REGIONS.filter(r=>r.continent==='Oceanía'),dimorphism:SEXUAL_DIMORPHISM,categories:SPECIMEN_CATEGORIES,sprite:getSpriteMarkup,taxonomy:taxonomyInfo};\n})(typeof globalThis!=='undefined'?globalThis:this);\n`;
const path='www/js/lab/oceania-catalog-v3290.js';if(process.argv.includes('--check')){if(fs.readFileSync(path,'utf8')!==output)throw Error('Oceania laboratory differs from actual candidate router');}else fs.writeFileSync(path,output);
