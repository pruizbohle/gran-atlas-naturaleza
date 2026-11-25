/* Brújula del naturalista: orientación pura, sin mutaciones de la partida. */
(function(root){
'use strict';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const action=(type,id,label)=>({type,id,label});
const model=(kind,title,detail,value,target,next)=>({kind,key:kind+':'+next.type+':'+next.id,title,detail,progress:{value:Math.max(0,Math.min(target,Number(value)||0)),target:Math.max(1,Number(target)||1)},action:next});
function suggest(s,c){
 const neutral=()=>model('neutral','Tu expedición continúa',c.explorationSummary||'Consulta tus registros y explora un territorio habilitado.',c.openRegions||0,c.regions.length,action('field',s.currentRegion,'Volver a Campo'));
 const visited=new Set();
 function studyGoal(required){const ready=c.studies.find(x=>x.ready);if(ready)return model('study','Un estudio puede avanzar',ready.label+' · '+ready.name,ready.stage,5,action('journal',ready.id,'Consultar estudio'));const current=c.studies.find(x=>x.inCurrent&&!x.published);return model('prestige','Preparar la próxima ruta','Prestigio '+Math.floor(s.prestige)+'/'+required+'. Las monografías publicadas aumentan tu prestigio.',s.prestige,required,action(current?'journal':'field',current?.id||s.currentRegion,current?'Consultar el Cuaderno':'Explorar en Campo'));}
 function research(id){
  if(visited.has('research:'+id))return null;visited.add('research:'+id);
  const n=c.research.find(n=>n.id===id);if(!n||s.purchases[id])return null;
  for(const previous of [...(n.req?[n.req]:[]),...(n.reqAll||[])])if(!s.purchases[previous])return research(previous);
  if(n.reqItem&&(s.inventory[n.reqItem]||0)<(n.reqItemQty||1))return material(n.reqItem,n.reqItemQty||1,n.name);
  const stage=c.stages.find(x=>x.research===id);
  if(stage){for(const item of stage.tools)if(!s.craftedItems[item])return material(item,1,n.name);if(stage.map&&!stage.cartographyReady)return material(stage.map,1,n.name);}
  if(c.canBuy(id))return model('research','Una investigación está preparada',n.name+' · consulta sus requisitos y costo antes de decidir.',1,1,action('research',id,'Consultar investigación'));
  if(s.money<n.money)return model('funding','Reunir financiación',n.name+' requiere £'+n.money+'; tienes £'+Math.floor(s.money)+'.',s.money,n.money,action('society','grants','Consultar financiación'));
  if(s.knowledge<n.knowledge)return model('knowledge','Ampliar los apuntes científicos',n.name+' requiere '+n.knowledge+' conocimientos; tienes '+Math.floor(s.knowledge)+'.',s.knowledge,n.knowledge,action('field',s.currentRegion,'Explorar en Campo'));
  return null;
 }
 function material(id,quantity,reason){
  if(visited.has('material:'+id))return null;visited.add('material:'+id);
  const item=c.items[id],have=s.inventory[id]||0;if(!item)return null;
  const recipe=c.recipes[id];
  if(recipe&&c.canCraft(id))return model('craft',id==='world_map'?'El Mapamundi está preparado':'Una preparación puede fabricarse',item.name+' · '+reason+'. Consulta la receta; la fabricación requiere tu decisión.',have,Math.max(1,quantity),action('recipe',id,'Consultar receta'));
  if(recipe){for(const [component,n]of Object.entries(recipe.requires)){if((s.inventory[component]||0)<n){const next=material(component,n,item.name);if(next)return next;}}return null;}
  const sources=c.sources(id),usable=sources.find(x=>x.available);
  if(usable)return model('material','Reunir '+item.name,'Tienes '+have+'/'+quantity+' para '+reason+'. '+usable.label,have,quantity,action('item',id,'Consultar procedencia'));
  const prerequisite=sources.find(x=>x.research&&!s.purchases[x.research]);if(prerequisite)return research(prerequisite.research);
  const prestige=sources.filter(x=>x.reachable&&x.prestige>s.prestige).sort((a,b)=>a.prestige-b.prestige)[0];if(prestige)return studyGoal(prestige.prestige);
  return null;
 }
 if(c.claimable.length){const m=c.claimable[0];return model('reward','Hay una recompensa disponible','Sociedad tiene un premio listo. Revisa el registro antes de reclamar.',1,1,action('mission',m.id,'Consultar recompensa'));}
 if(c.finished.length){const f=c.finished[0];return model('return','Un trabajo ha finalizado',f.label+' · consulta el registro; no se cobra desde la Brújula.',1,1,action(f.type,f.id,'Consultar regreso'));}
 const ready=c.regions.find(r=>r.ready&&!r.accessible);if(ready)return model('region','Hay una región disponible',ready.name+' reúne sus requisitos. Puedes consultar su ficha.',1,1,action('atlas',ready.id,'Consultar región'));
 const study=c.studies.find(x=>x.ready);if(study)return model('study','Un estudio puede avanzar',study.label+' · '+study.name,study.stage,5,action('journal',study.id,'Consultar estudio'));
 const unpublished=c.studies.find(x=>x.stage===5&&!x.published);if(unpublished)return model('publication','Una monografía está lista',unpublished.name+' ha completado sus cinco etapas.',5,5,action('publication',unpublished.id,'Consultar publicación'));
 const target=c.regions.filter(r=>!r.accessible).sort((a,b)=>a.prestige-b.prestige)[0];if(!target)return neutral();
 const stage=c.stages.find(x=>x.key===target.key);
 if(stage){const node=c.research.find(n=>n.id===stage.research);if(node&&!s.purchases[node.id])return research(node.id)||neutral();for(const tool of stage.tools)if(!s.craftedItems[tool])return material(tool,1,'la próxima ruta')||neutral();if(stage.map&&!stage.cartographyReady)return material(stage.map,1,'la próxima ruta')||neutral();}
 if(s.prestige<target.prestige)return studyGoal(target.prestige);
 return neutral();
}
function render(m,preference='visible'){
 if(preference==='hidden')return '<button type="button" class="ux3410-show" data-action="ux-compass-show">Mostrar Brújula del naturalista</button>';
 const collapsed=preference==='collapsed';return '<section class="ux3410-compass" aria-label="Brújula del naturalista" data-ux-compass><header><span class="ux3410-rose" aria-hidden="true">✥</span><h3>Brújula del naturalista</h3><button type="button" data-action="ux-compass-fold" aria-expanded="'+!collapsed+'" aria-label="'+(collapsed?'Desplegar':'Plegar')+' Brújula">'+(collapsed?'+':'−')+'</button><button type="button" data-action="ux-compass-hide" aria-label="Ocultar Brújula">×</button></header>'+(collapsed?'':'<div class="ux3410-direction"><strong>'+escape(m.title)+'</strong><p>'+escape(m.detail)+'</p>'+(m.kind==='neutral'?'':'<progress value="'+m.progress.value+'" max="'+m.progress.target+'" aria-label="Progreso del objetivo"></progress>')+'<button type="button" class="btn alt" data-action="ux-compass-go" data-id="'+escape(m.key)+'">'+escape(m.action.label)+'</button></div>')+'</section>';
}
const guideTopics={
  atlas:['Desbloquear regiones','Selecciona un hexágono y consulta sus requisitos. Publicar monografías da prestigio. Algunas rutas también piden una investigación, un mapa o equipo fabricado.', ['module','journal','Abrir Cuaderno']],
  field:['Registrar tus primeros avistamientos','Elige hábitat, horario y estación en Entorno. Pulsa Observar fauna y consulta el Cuaderno. El equipo y la contratación de naturalistas amplían tus opciones de búsqueda.', ['module','research','Ver apoyos en Investigación']],
  journal:['Completar una monografía','Elige una especie y revisa las cinco etapas. Reúne las observaciones, las evidencias y los recursos que pide cada una. Publica la monografía terminada en Sociedad.', ['society','publications','Consultar publicaciones']],
  research:['Investigar y preparar una expedición','Cada estudio muestra costos, prerrequisitos y bonificaciones. Consulta también el equipo y las recetas que pide la ruta de tu próximo destino.', ['module','objects','Abrir Inventario']],
  expeditions:['Enviar una expedición','En Campamento, abre el Astillero para consultar costos, requisitos y duración de cada ruta. Al regresar, revisa el recibo de libras, conocimiento, materiales y posibles indicios.', ['research','astillero','Consultar Astillero básico']],
  objects:['Obtener y fabricar materiales','Abre una ficha para ver sus fuentes, como Campo, expediciones, comercio o excavaciones. El Taller indica las cantidades necesarias para fabricar. Equipa las piezas para activar sus efectos.', ['module','expeditions','Abrir Campamento']],
  bestiary:['Consultar especies y legendarios','El Bestiario revela información a medida que identificas especies. Los ejemplares legendarios se encuentran excepcionalmente en Campo y cada identidad queda registrada una sola vez.', ['museum','exhibitions','Ver la colección del Museo']],
  museum:['Exhibiciones y relictos','Las monografías publicadas permiten exponer muestras de animales. En Relictos reúne indicios de ubicación, hábitat y horario. El hallazgo en Campo abre la ficha y su vitrina.', ['museum-room','relicts','Consultar Relictos']],
  society:['Publicaciones, encargos y reconocimientos','Publica los estudios que ya completaste y consulta los requisitos de encargos y subvenciones. Los reconocimientos registran hitos de tu expedición.', ['module','journal','Abrir Cuaderno']],
  crown:['Consultar el saldo histórico','La Corona conserva el saldo de las partidas anteriores. Los fondos de juego se obtienen en Sociedad, expediciones y exhibiciones del Museo.', ['society','grants','Consultar financiación']]
};
function guide(module){
 const topic=Object.hasOwn(guideTopics,module)?guideTopics[module]:null;
 if(!topic)return '';
 const [title,body,[type,id,label]]=topic;
 return '<details class="ux3410-guide"><summary>Guía del naturalista</summary><div><h2>'+escape(title)+'</h2><p>'+escape(body)+'</p>'+
  '<button type="button" class="ux3410-link" data-action="ux-open" data-id="'+type+'|'+id+'">'+escape(label)+'</button></div></details>';
}
const api=Object.freeze({suggest,render,escape,guide});if(typeof module==='object'&&module.exports)module.exports=api;root.AtlasExperience3410=api;
})(typeof globalThis!=='undefined'?globalThis:this);
