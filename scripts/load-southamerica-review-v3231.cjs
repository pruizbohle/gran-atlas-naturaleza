'use strict';
const fs=require('node:fs'),vm=require('node:vm');
function catalog(){
 const context=vm.createContext({});
 for(const name of ['fish-art-v3191','herp-art-v3192','bird-art-v3193','mammal-art-v3194','legendary-art-v3197','northamerica-data-v3220','northamerica-polish-v3221','northamerica-art-v3220','southamerica-data-v3230','southamerica-polish-v3231','southamerica-art-v3230','lab/southamerica-catalog-v3230','lab/southamerica-art-before-v3231','lab/southamerica-before-v3231'])vm.runInContext(fs.readFileSync('www/js/'+name+'.js','utf8'),context);
 return context;
}
module.exports={catalog};
