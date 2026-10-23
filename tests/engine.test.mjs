import test from 'node:test';import assert from 'node:assert/strict';
import {freshSave,attemptEncounter,advanceResearch,applyOfflineProgress,boundedElapsed,researchCost,publish,hireScout} from '../www/js/engine.js';
const fox={id:'zorro',name:'Zorro rojo',rarity:'comun',habitats:['bosque'],times:['amanecer'],seasons:['primavera'],variants:[]};
test('primer encuentro registra especie y avistamiento',()=>{let s=freshSave();let x=attemptEncounter(s,[fox],()=>0);assert.equal(x.type,'sighting');assert.equal(s.sightings.zorro,1);assert.equal(s.discovered.zorro,true)});
test('investigación exige avistamiento y conocimiento y los descuenta',()=>{let s=freshSave();assert.equal(advanceResearch(s,fox),false);s.sightings.zorro=1;s.knowledge=8;assert.equal(advanceResearch(s,fox),true);assert.equal(s.research.zorro,1);assert.equal(s.knowledge,0);assert.equal(advanceResearch(s,fox),false)});
test('hitos requieren gastos en cada nivel',()=>{let s=freshSave();s.knowledge=1000;s.sightings.zorro=100;for(let i=0;i<5;i++)assert.equal(advanceResearch(s,fox),true);assert.equal(publish(s,fox),true);assert.equal(s.fame,1);assert.equal(publish(s,fox),false)});
test('offline máximo ocho horas y sin progreso ante reloj atrasado',()=>{let now=Date.now();assert.equal(boundedElapsed(now-86400000,now),28800);assert.equal(boundedElapsed(now+60000,now),0)});
test('automático recompensa y registra',()=>{let now=Date.now();let s=freshSave(now-10000);s.scouts=1;let res=applyOfflineProgress(s,[fox],now,()=>0);assert.equal(res.attempts,1);assert.equal(res.sightings,1);assert.equal(s.sightings.zorro,1)});
test('contratar naturalista usa conocimiento',()=>{let s=freshSave();assert.equal(hireScout(s),false);s.knowledge=50;assert.equal(hireScout(s),true);assert.equal(s.scouts,1)})
