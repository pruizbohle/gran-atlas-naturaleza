// Evaluate the production data and sprite generators without booting the game.
const fs=require('node:fs');
const vm=require('node:vm');
function sprites(source=fs.readFileSync('www/js/app.js','utf8')){
 const data=source.slice(source.indexOf('const SPECIES={'),source.indexOf('const GLOBAL_BIOMES_FULL='));
 const graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
 return vm.runInNewContext(data+'\n'+graphics+'\n({SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,polishedSpeciesSprite:typeof polishedSpeciesSprite===\'function\'?polishedSpeciesSprite:null})');
}
module.exports={sprites};
