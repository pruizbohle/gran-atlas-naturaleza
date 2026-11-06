// Effective production inventory, including additions after GLOBAL_BIOMES_FULL.
'use strict';
const fs=require('node:fs');
const {SPECIES,SEXUAL_DIMORPHISM}=require('../tests/helpers/catalog.cjs').catalog();
const {classifyBird}=require('../www/js/bird-art-v3193.js');
const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
const rows=Object.entries(SPECIES).filter(([,sp])=>classifyBird(sp));
const header=['id','nombre','nombre_cientifico','kind_persistido','familia_visual','dimorfismo_existente','variantes_existentes'];
const csv=[header,...rows.map(([id,sp])=>[id,sp.name,sp.latin,sp.kind,classifyBird(sp),SEXUAL_DIMORPHISM[id]?.type||'',sp.special.join(' | ')])].map(row=>row.map(quote).join(',')).join('\n')+'\n';
const file='docs/aves-v3193/inventario.csv';
if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==csv)throw Error('Stale bird inventory');}
else{fs.mkdirSync('docs/aves-v3193',{recursive:true});fs.writeFileSync(file,csv);}
console.log(`${rows.length} birds; ${new Set(rows.map(([,sp])=>classifyBird(sp))).size} visual families.`);
