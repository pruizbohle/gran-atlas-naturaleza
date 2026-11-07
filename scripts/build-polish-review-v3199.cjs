'use strict';
const fs=require('node:fs');
const registry={};
for(const row of JSON.parse(fs.readFileSync('docs/polish-v3199/mammals-audit.json','utf8')).rows)registry[row.id]=[row.before,row.problem,row.correction,row.result];
const fish=fs.readFileSync('docs/polish-v3199/fish.md','utf8');
for(const line of fish.split('\n')){const id=line.match(/`([^`]+)`/);if(!line.startsWith('|')||!id)continue;const columns=line.split('|').slice(1,-1).map(s=>s.trim());registry[id[1]]=['Motor inline de producción v3.19.8.',columns[1],columns[2],'Revisado a 56 y 120 px, además de silueta; véase auditoría individual de peces.'];}
const report=fs.readFileSync('docs/polish-v3199/legend-relicts.md','utf8'),legendIds=['silverback','ambar','niebla','fenrir','atlas','centinela','basalto','seda','junco','ancora','ascua','remonte'],relictIds=['coelacanth_indic','atlas_lion','seychelles_sheathbat','gabon_dwarf_croc','angonoka','african_lungfish','white_sturgeon','gharial','olm_balkans'];
for(const [section,ids] of [['Legendarios',legendIds],['Relictos',relictIds]]){const text=report.split('## '+section+'\n')[1].split('\n## ')[0];const rows=text.split('\n').filter(line=>line.startsWith('| ')&&!line.startsWith('| ---')&&!line.includes('Problema anterior')).map(line=>line.split('|').slice(1,-1).map(s=>s.trim()));if(rows.length!==ids.length)throw Error('Incomplete '+section);rows.forEach((row,i)=>registry[ids[i]]=['Lámina de producción v3.19.8.',row[2],row[3],row[4]]);}
if(Object.keys(registry).length!==308)throw Error('Expected 308 individual review records, got '+Object.keys(registry).length);
const notes=[],mapping={};for(const[id,record]of Object.entries(registry)){const serialized=JSON.stringify(record);let index=notes.findIndex(n=>JSON.stringify(n)===serialized);if(index<0){index=notes.length;notes.push(record);}mapping[id]=index;}
const text='/* Generated individual visual audit; no game state. */\n(function(root){const notes='+JSON.stringify(notes)+',mapping='+JSON.stringify(mapping)+';root.ATLAS_POLISH_REVIEW={get(id){return Object.hasOwn(mapping,id)?notes[mapping[id]]:null;},count:'+Object.keys(registry).length+'};})(globalThis);\n';
const path='www/js/lab/polish-review-v3199.js';if(process.argv.includes('--check')){if(fs.readFileSync(path,'utf8')!==text)throw Error('Stale individual audit');}else fs.writeFileSync(path,text);
