// The effective catalog includes later Africa/NA additions and existing alias migrations.
// The older sprites helper intentionally stops at GLOBAL_BIOMES_FULL and is not a full inventory.
const fs=require('node:fs'),vm=require('node:vm');
function catalogSource(source){
 const start=source.indexOf('const STORAGE_KEY='),end=source.indexOf('function mergeHistoricalBeardedVulture(');
 if(start<0||end<start)throw Error('Cannot locate the complete production catalog');
 return source.slice(start,end);
}
function catalog(source=fs.readFileSync('www/js/app.js','utf8'), expanded=false){
 const prelude=expanded?fs.readFileSync('www/js/northamerica-data-v3220.js','utf8'):'';
 const extension=expanded?source.slice(source.indexOf('// AM-02: additive catalog'),source.indexOf('// END AM-02 catalog installation.')+'// END AM-02 catalog installation.'.length):'';
 return vm.runInNewContext(prelude+'\n'+catalogSource(source)+'\n'+extension+'\n({SPECIES,SEXUAL_DIMORPHISM,REGIONS})');
}
module.exports={catalog,catalogSource};
