'use strict';
const fs=require('node:fs'),dir='docs/gm07-m01/audit/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json')),rows=read('review-ledger'),old=read('reference-routes'),previous=read('previous-gm07-routes'),next=read('m01-routes');
const take=routes=>Object.fromEntries(rows.map(r=>[r.id,routes[r.id]]));
const finalMode=fs.existsSync(dir+'final-approval.json'),reviewed=JSON.parse(fs.readFileSync('docs/gm07-m01/revisions/'+(finalMode?'r2':'r1')+'/routes.json'));
const data={format:'el-gran-atlas-gm07-m01-laboratory',revision:finalMode?'M01-final':'M01-R2',finalMode,reference:'2e0535d',rows,summary:read('summary'),original:take(old),previous:take(previous),reviewed,proposal:take(next)};
const html=fs.readFileSync('scripts/gm07-m01-lab-template.html','utf8').replace('M01_DATA_HERE',JSON.stringify(data).replace(/</g,'\\u003c'));
fs.writeFileSync('www/laboratorio-marsupiales-monotremas.html',html);console.log('Offline32-species laboratory:',Buffer.byteLength(html),'bytes.');
