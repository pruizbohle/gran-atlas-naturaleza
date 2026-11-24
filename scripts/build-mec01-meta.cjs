'use strict';
// MEC-01 · genera www/js/mec01-catalog-meta.js (continente de procedencia de cada pieza)
// a partir de docs/v560-beta/drops-beta-v560.json. Uso: node scripts/build-mec01-meta.cjs [--write]
const fs=require('node:fs');
const d=JSON.parse(fs.readFileSync('docs/v560-beta/drops-beta-v560.json','utf8'));
const cont={};for(const i of d.items)if(i.cont)cont[i.id]=i.cont;
const out='/* El Gran Atlas · MEC-01 · procedencia de las piezas beta. Generado por scripts/build-mec01-meta.cjs desde docs/v560-beta/drops-beta-v560.json. */\n'+
 "(function(root){'use strict';root.AtlasBeta560Meta=Object.freeze({cont:Object.freeze("+JSON.stringify(cont)+")});})(typeof globalThis!=='undefined'?globalThis:window);\n";
const path='www/js/mec01-catalog-meta.js';
if(process.argv.includes('--write'))fs.writeFileSync(path,out);
else if(fs.readFileSync(path,'utf8')!==out){console.error('Ejecuta node scripts/build-mec01-meta.cjs --write');process.exit(1);}
console.log(JSON.stringify({pieces:Object.keys(cont).length,path}));
