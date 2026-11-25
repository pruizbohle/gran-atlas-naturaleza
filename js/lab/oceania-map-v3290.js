/* Candidate-only Atlas lab. Uses production geometry/presentation/controller, never storage or game state. */
(function(){'use strict';
const data=globalThis.AtlasOceaniaSource3290,container=document.getElementById('candidate');
const habitats=['selva','costa','sabana','desierto','bosque','mediterraneo','bosque','bosque'];
const regions=data.sourceRegions.map((r,i)=>({id:r.id,name:r.name,continent:'Oceanía',habitats:[habitats[i]],status:'bloqueada',summary:r.species.length+' presencias fuente · acceso pendiente de integración',progress:0,requirements:[{label:'Integración y validación GM-02B pendientes',met:false}],identified:0,speciesCount:r.species.length}));
const mesh=AtlasGeography.layout('Oceanía',regions);
const model={continent:{id:'Oceanía',label:'Oceanía · candidato',implemented:true},continents:[{id:'Oceanía',label:'Oceanía · candidato',implemented:true}],regions,selectedId:regions[0].id,readyCount:0,board:mesh.board,cells:mesh.cells.map(c=>({...c,regions:regions.filter(r=>c.regionIds.includes(r.id))}))};
container.innerHTML=AtlasUI.render(model);const root=container.querySelector('.atlas-game');
function select(id){model.selectedId=id;AtlasMap.select(root,id,AtlasUI.regionPanel(regions.find(r=>r.id===id)));document.getElementById('candidateNotice').textContent=regions.find(r=>r.id===id).name+' · vista candidata, sin viaje ni desbloqueo';}
container.addEventListener('click',event=>{const tile=event.target.closest('.atlas-tile'),action=event.target.closest('[data-action]');if(tile)select(tile.dataset.id);if(action){if(action.dataset.action==='atlas-zoom')AtlasMap.zoom(root,action.dataset.id);else if(action.dataset.action==='atlas-center')AtlasMap.center(root,model.selectedId);else if(action.dataset.action==='atlas-requirements')root.querySelector('.atlas-requirements').open=true;}});
container.addEventListener('keydown',event=>{const tile=event.target.closest('.atlas-tile');if(!tile)return;if(event.key==='Enter'||event.key===' '){event.preventDefault();select(tile.dataset.id);}else AtlasMap.keyboard(event,tile);});
AtlasMap.restore(root,{fit:true});window.addEventListener('resize',()=>AtlasMap.restore(root,{fit:true}));
globalThis.OceaniaCandidateReview={model,mesh,select,audit:AtlasGeography.audit('Oceanía',regions)};
})();
