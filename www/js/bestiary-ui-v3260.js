/* Bestiary presentation and accessible dialog. No catalog or save mutations. */
(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 let illustrationSerial=0;
 function art(svg){
  let safe=root.AtlasJournalUI.illustration(svg).replace(/\saria-(?:labelledby|describedby)=(?:"[^"]*"|'[^']*')/g,'');
  // Coat clip-path IDs can themselves contain a scientific name. Rename both
  // definitions and references; per-instance IDs also avoid cross-card clips.
  const definitions=[...safe.matchAll(/\sid=(['"])(.*?)\1/g)];
  if(definitions.length){const prefix='b26-plate-'+(++illustrationSerial)+'-';for(const [i,match]of definitions.entries()){
   const original=match[2],opaque=prefix+i;
   safe=safe.replaceAll('id="'+original+'"','id="'+opaque+'"').replaceAll("id='"+original+"'","id='"+opaque+"'").replaceAll('url(#'+original+')','url(#'+opaque+')').replaceAll('"#'+original+'"','"#'+opaque+'"').replaceAll("'#"+original+"'","'#"+opaque+"'");
  }}
  return safe;
 }
 const options=(items,value)=>items.map(([id,label])=>`<option value="${esc(id)}" ${String(value)===String(id)?'selected':''}>${esc(label)}</option>`).join('');
 function pager(m){return `<nav data-bestiary-pager data-page="${m.page}" data-pages="${m.pages}" data-total="${m.matches}" class="b26-pager" aria-label="Páginas del Bestiario"><button type="button" class="btn alt" data-action="bestiary-page" data-id="${m.page-1}" ${m.page===0?'disabled':''} aria-label="Página anterior">←</button><span role="status">Página ${m.page+1}/${m.pages} · ${m.matches?m.page*32+1:0}–${Math.min(m.matches,(m.page+1)*32)} de ${m.matches}</span><button type="button" class="btn alt" data-action="bestiary-page" data-id="${m.page+1}" ${m.page===m.pages-1?'disabled':''} aria-label="Página siguiente">→</button></nav>`;}
 function cards(m){return `${pager(m)}<div class="species-grid b26-grid">${m.cards.map(p=>`<article class="bestiary-specimen-entry b26-entry"><button type="button" class="species-card b26-card ${p.discovered?'':'b26-unknown'}" data-action="b26-open" data-b26-slot="${p.slot}" ${p.discovered?'aria-haspopup="dialog"':'disabled'} aria-label="${esc(p.name)}, ${p.sightings} avistamientos, investigación ${p.stage}/5${p.discovered?', abrir ficha':''}"><span class="b26-card-art" aria-hidden="true">${p.discovered?art(p.sprite):'<span class="b26-question">?</span>'}</span><strong>${esc(p.name)}</strong><em>${esc(p.latin)}</em><span class="b26-card-count">${p.sightings} avistamientos · ${p.stage}/5</span><span class="b26-stage-dots" aria-hidden="true">${Array.from({length:5},(_,i)=>`<i class="${i<p.stage?'done':''}"></i>`).join('')}</span><span class="b26-card-status">${p.published?'Monografía publicada':p.discovered?'Espécimen observado':'Sin descubrir'}</span></button><details data-b26-collection="${p.slot}" class="b26-collection"><summary>Colección de especímenes</summary><div data-specimen-content></div></details></article>`).join('')||'<p class="b26-empty" role="status">No hay coincidencias. Prueba otros criterios o limpia los filtros.</p>'}</div>${m.pages>1?pager(m):''}`;}
 function render(m){const f=m.filters;return `<section class="b26-root"><header class="b26-heading"><div><span class="b26-eyebrow">GABINETE ZOOLÓGICO · 1842</span><h1 tabindex="-1">Bestiario del naturalista</h1></div><span>${m.identified}/${m.total}<small>identificadas</small></span></header><div class="b26-controls"><label class="b26-search"><span class="sr-only">Buscar por nombre conocido</span><input id="b26-search" type="search" maxlength="120" autocomplete="off" placeholder="Buscar nombre común o científico" value="${esc(f.query)}"></label><div class="b26-filter-row"><label>Grupo<select data-b26-filter="group">${options([['all','Todos'],['Mamífero','Mamíferos'],['Ave','Aves'],['Reptil/Anfibio','Reptiles y anfibios'],['Pez','Peces']],f.group)}</select></label><label>Avistamientos<select data-b26-filter="sightings">${options([['all','Todos'],['zero','Sin avistamientos'],...['1','10','50','100','200','500'].map(n=>[n,'Al menos '+n])],f.sightings)}</select></label></div><div class="b26-sort-row"><label>Orden<select data-b26-filter="sort">${options([['alpha','Alfabético'],['rarity','Rareza'],['type','Tipo'],['sightings','Avistamientos']],f.sort)}</select></label><button type="button" class="btn alt" data-action="b26-direction" aria-label="${f.descending?'Orden descendente; cambiar a ascendente':'Orden ascendente; cambiar a descendente'}">${f.descending?'↓':'↑'}</button><button type="button" class="b26-clear" data-action="b26-clear">Limpiar filtros</button></div><details class="b26-advanced"><summary>Más filtros <span>progreso · subgrupo · monografías</span></summary><div class="b26-filter-row"><label>Subgrupo conocido<select data-b26-filter="subgroup">${options([['all','Todos'],...m.subgroups.map(g=>[g,g])],f.subgroup)}</select></label><label>Progreso<select data-b26-filter="progress">${options([['all','Todo'],['unknown','No descubiertas'],['discovered','Descubiertas'],['incomplete','Investigación incompleta'],['complete','Investigación 5/5'],['published','Monografía publicada']],f.progress)}</select></label></div><label class="b26-hide"><input type="checkbox" data-b26-filter="hide" ${f.hide?'checked':''}>Ocultar monografías publicadas</label><p class="b26-privacy">Los nombres y la clasificación se revelan mediante el Cuaderno.</p></details></div><div id="b26-results">${cards(m)}</div></section>`;}
 function modal(m){return `<header class="b26-dialog-header"><div><span class="b26-eyebrow">LÁMINA DEL NATURALISTA · ${m.stage}/5</span><h2 id="b26-dialog-title">${esc(m.name)}</h2><em>${esc(m.latin)}</em></div><button type="button" class="b26-close" data-action="b26-close" aria-label="Cerrar ficha" autofocus>×</button></header><div class="b26-dialog-body"><div class="b26-portrait" role="img" aria-label="Ilustración del espécimen observado">${art(m.sprite)}</div><div class="b26-meta"><span>${esc(m.rarity)}</span><span>${esc(m.group||'Clasificación por estudiar')}</span></div><div class="b26-observations"><span>Avistamientos<b>${m.sightings}</b></span><span>Investigación<b>${m.stage}/5</b></span><span>Alimentación<b>${m.food}</b></span><span>Monografía<b>${m.published?'Publicada':m.stage===5?'Completa':'En estudio'}</b></span></div><section class="b26-distribution"><h3>Dónde encontrarla</h3>${m.regions.map(r=>`<article class="b26-region"><div><strong>${esc(r.name)}</strong><small>${esc(r.continent)} · ${esc(r.statusLabel)}</small></div><div class="b26-region-actions">${r.accessible?`<button type="button" class="btn" data-action="b26-travel" data-b26-region="${r.slot}">${r.current?'Volver a Campo':'Viajar a Campo'}</button>`:''}<button type="button" class="btn alt" data-action="b26-atlas" data-b26-region="${r.slot}">${r.accessible?'Ver en Atlas':r.ready?'Ver en Atlas · desbloqueo disponible':'Ver requisitos'}</button></div></article>`).join('')}</section><details class="b26-secondary"><summary>Notas y especímenes observados</summary><p>${esc(m.taxonomy)}</p><p><b>Hábitats:</b> ${esc(m.habitats)}</p><p><b>Horarios:</b> ${esc(m.times)}</p><p><b>Estaciones:</b> ${esc(m.seasons)}</p><div class="b26-found">${m.variants.map(v=>`<span>${esc(v)}</span>`).join('')||'Sin variantes observadas.'}</div><p>${esc(m.sexes)}</p><p>Las ilustraciones de variantes están en la colección desplegable de la tarjeta.</p></details>${m.journalAvailable?'<button type="button" class="btn alt b26-journal" data-action="b26-journal">Abrir en el Cuaderno de esta región</button>':''}</div>`;}
 let dialog=null,opener=null,scroll=0,overflow='',inert=[],onAction=null,onClose=null;
 function close({restore=true}={}){
  if(!dialog?.hasAttribute('open'))return;
  if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');
  document.body.style.overflow=overflow;document.body.classList.remove('b26-modal-open');
  for(const[node,value]of inert)node.inert=value;inert=[];
  onClose?.();onClose=null;
  if(restore){root.scrollTo?.({top:scroll,behavior:'instant'});if(opener?.isConnected)opener.focus({preventScroll:true});}
  dialog.innerHTML='';opener=null;onAction=null;
 }
 function show(m,callbacks,source){
  if(!dialog){
   dialog=document.createElement('dialog');dialog.className='b26-dialog';dialog.id='b26-species-dialog';dialog.setAttribute('aria-labelledby','b26-dialog-title');dialog.setAttribute('aria-modal','true');document.body.appendChild(dialog);
   dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
   let outside=false;
   const beyond=e=>{const b=dialog.getBoundingClientRect();return e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom;};
   dialog.addEventListener('pointerdown',e=>{outside=e.target===dialog&&beyond(e);});
   dialog.addEventListener('click',e=>{const button=e.target.closest?.('[data-action]');if(button){if(button.dataset.action==='b26-close')close();else onAction?.(button.dataset.action,button.dataset.b26Region);}else if(outside&&e.target===dialog&&beyond(e))close();outside=false;});
   dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const focusable=[...dialog.querySelectorAll('button:not(:disabled),summary,a[href],input,select')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
  }
  const wasOpen=dialog.hasAttribute('open');
  dialog.innerHTML=modal(m);onAction=callbacks.action;onClose=callbacks.close;
  if(!wasOpen){scroll=root.scrollY||0;opener=source||document.activeElement;overflow=document.body.style.overflow;document.body.style.overflow='hidden';document.body.classList.add('b26-modal-open');inert=[...document.body.children].filter(n=>n!==dialog).map(n=>[n,n.inert]);for(const[n]of inert)n.inert=true;if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('role','dialog');dialog.setAttribute('open','');}}
  dialog.querySelector('.b26-close')?.focus({preventScroll:true});
 }
 function bind(element,change,collection){
  element.querySelector('#b26-search')?.addEventListener('input',e=>change('query',e.target.value));
  element.addEventListener('change',e=>{const key=e.target.dataset.b26Filter;if(key)change(key,key==='hide'?e.target.checked:e.target.value);});
  element.addEventListener('toggle',e=>{const details=e.target;if(!details.open||details.dataset.b26Collection===undefined)return;const target=details.querySelector('[data-specimen-content]');if(target&&!target.hasChildNodes())target.innerHTML=collection(Number(details.dataset.b26Collection));},true);
 }
 function refresh(element,m){
  element.querySelector('#b26-results').innerHTML=cards(m);
  element.querySelector('[data-b26-filter="subgroup"]').innerHTML=options([['all','Todos'],...m.subgroups.map(g=>[g,g])],m.filters.subgroup);
  for(const control of element.querySelectorAll('[data-b26-filter]')){const key=control.dataset.b26Filter;if(key==='hide')control.checked=m.filters.hide;else control.value=m.filters[key];}
  const search=element.querySelector('#b26-search');if(search.value!==m.filters.query)search.value=m.filters.query;
  const direction=element.querySelector('[data-action="b26-direction"]');direction.textContent=m.filters.descending?'↓':'↑';direction.setAttribute('aria-label',m.filters.descending?'Orden descendente; cambiar a ascendente':'Orden ascendente; cambiar a descendente');
 }
 root.AtlasBestiaryUI=Object.freeze({render,cards,modal,bind,show,close,refresh,normalize,illustration:art});
})(globalThis);
