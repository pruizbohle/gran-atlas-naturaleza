'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),{performance}=require('node:perf_hooks'),{make,mature}=require('../tests/helpers/gm06-game.cjs');
const original=cp.execFileSync('git',['show','41a4bbd:www/js/app.js'],{encoding:'utf8',maxBuffer:8e6}),results={};
for(const mode of ['base3430','gm06']){
 const h=make(mode==='base3430'?{baseline:true,app:original}:{}),g=h.g,s=mature(h);for(const id of Object.keys(g.SPECIES)){s.discovered[id]=true;s.sightings[id]=20;s.stages[id]=1;}
 s.currentRegion='HX-01-09';s.atlasView='Europa';s.selectedJournal=g.REGIONS[0].species[0];
 const ops={atlas:()=>g.renderAtlas(),journal:()=>g.renderJournal(),bestiary:()=>g.renderBestiary(),automatic:()=>g.encounter('auto',h.now,true)};
 results[mode]={species:Object.keys(g.SPECIES).length};
 for(const[name,fn]of Object.entries(ops)){for(let i=0;i<3;i++)fn();const sample=[];for(let i=0;i<50;i++){const t=performance.now();fn();sample.push(performance.now()-t);}sample.sort((a,b)=>a-b);results[mode][name]={medianMs:+sample[25].toFixed(3),p95Ms:+sample[47].toFixed(3)};}
}
fs.writeFileSync('docs/gm06/pruebas/microbenchmark.json',JSON.stringify({method:'Node VM, warm cache, 50 repetitions, same historical British region and mature synthetic save; includes model/markup, excludes DOM/layout; automatic forced for deterministic availability',physicalAndroid:false,results},null,2)+'\n');console.log(results);
