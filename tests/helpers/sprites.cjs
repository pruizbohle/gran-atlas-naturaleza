// Evaluate the production data and sprite generators without booting the game.
const fs=require('node:fs');
const vm=require('node:vm');
function sprites(source=fs.readFileSync('www/js/app.js','utf8'), modern=false){
 const data=source.slice(source.indexOf('const SPECIES={'),source.indexOf('const GLOBAL_BIOMES_FULL='));
 const graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
 const engines=modern?['herp-art-v3192','bird-art-v3193','mammal-art-v3194'].map(n=>fs.readFileSync('www/js/'+n+'.js','utf8')).join('\n'):'';
 return vm.runInNewContext(engines+'\n'+data+'\n'+graphics+'\n({SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,polishedSpeciesSprite:typeof polishedSpeciesSprite===\'function\'?polishedSpeciesSprite:null})');
}
module.exports={sprites};
