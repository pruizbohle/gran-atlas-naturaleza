// The effective catalog includes later Africa/NA additions and existing alias migrations.
// The older sprites helper intentionally stops at GLOBAL_BIOMES_FULL and is not a full inventory.
const fs=require('node:fs'),vm=require('node:vm');
function catalogSource(source){
 const start=source.indexOf('const STORAGE_KEY='),end=source.indexOf('function mergeHistoricalBeardedVulture(');
 if(start<0||end<start)throw Error('Cannot locate the complete production catalog');
 return source.slice(start,end);
}
function catalog(source=fs.readFileSync('www/js/app.js','utf8')){
 return vm.runInNewContext(catalogSource(source)+'\n({SPECIES,SEXUAL_DIMORPHISM,REGIONS})');
}
module.exports={catalog,catalogSource};
