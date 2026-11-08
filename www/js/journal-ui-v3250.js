/* Cuaderno del naturalista: presentation only. The game supplies gated facts
 * and the results of stageRequirements(); this module never changes a save. */
(function(root){
 'use strict';
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 // Engines also attach diagnostic family/profile metadata. Strip it from the
 // journal's illustrations, where that metadata could spoil identification.
 function illustration(markup){return String(markup).replace(/\s(?:data-[\w-]+|aria-label|title)=(?:"[^"]*"|'[^']*')/g,'').replace(/<(?:title|desc)\b[^>]*>[\s\S]*?<\/(?:title|desc)>/g,'');}
 const unknown='<span class="j25-unknown" aria-hidden="true">?</span>';
 function sheet(m){
  const p=m.selected,n=p.next;
  const stamps=['Vista','Nombre','Conducta','Hábitos','Estudio'].map((name,i)=>`<li class="j25-stamp ${i<p.stage?'earned':i===p.stage?'current':''}" ${i===p.stage?'aria-current="step"':''}><span aria-hidden="true">${['I','II','III','IV','V'][i]}</span><small>${name}</small><span class="sr-only">${i<p.stage?'completada':i===p.stage?'próxima':'pendiente'}</span></li>`).join('');
  const objectives=n?[
   ['Avistamientos',`${p.sightings}/${n.needSight}`,n.sightOk],['Conocimiento',`${m.knowledge}/${n.knowledge}`,n.knowledgeOk],['Libras',`£${m.money}/£${n.money}`,n.moneyOk],
   ...(n.extra==='Ninguno'?[]:[[p.extraLabel,p.extraProgress,n.extraOk]])
  ].map(([label,value,ok])=>`<div class="j25-objective ${ok?'complete':'pending'}"><span aria-hidden="true">${ok?'✓':'○'}</span><span>${escape(label)}<b>${escape(value)}</b></span><span class="sr-only">${ok?'Cumplido':'Pendiente'}</span></div>`).join(''):'';
  return `<article class="journal-sheet j25-sheet ${p.stage===5?'j25-finished':''}" aria-label="Ficha de investigación">
   <div class="j25-folio"><span>DIARIO DEL NATURALISTA · 1842</span><span>LÁMINA ${String(p.slot+1).padStart(2,'0')}</span></div>
   <div class="j25-plate"><div class="j25-portrait" role="img" aria-label="${p.discovered?'Ilustración del espécimen observado':'Espécimen aún no observado'}">${p.discovered?illustration(p.sprite):unknown}<small>DEL NATURAL</small></div><div class="j25-identity"><span class="j25-kicker">${p.stage===5?'Estudio completo':'Cuaderno de campo'}</span><h2>${escape(p.name)}</h2><em>${escape(p.latin)}</em><div class="j25-rarity">${escape(p.rarity)}</div><span class="j25-sightings">${p.sightings} avistamientos · ${p.stage}/5</span></div></div>
   <ol class="j25-stages" aria-label="Cinco etapas de investigación">${stamps}</ol>
   <section class="j25-research ${n?.allOk?'j25-ready':''}" aria-label="Investigación actual">${n?`<div class="j25-next"><span>PRÓXIMO OBJETIVO</span><strong>${escape(n.label)}</strong></div><div class="j25-objectives">${objectives}</div><button type="button" class="btn j25-advance" data-action="advance-species" data-journal-slot="${p.slot}" ${n.allOk?'':'disabled'}>${n.allOk?'✦ Investigar':'Investigación pendiente'} · ${p.stage+1}/5</button>`:`<div class="j25-completion"><span class="j25-seal" aria-hidden="true">V<br>ESTUDIO</span><div><strong>Monografía completa</strong><p>${p.published?'Publicada en la Sociedad.':'Lista para presentar en la Sociedad.'}</p>${p.published?'':`<button type="button" class="btn alt" data-action="journal-society">Ir a Sociedad</button>`}</div></div>`}</section>
   <div class="j25-notes">
    <details><summary>Observaciones <span>${p.sightings} registros</span></summary><div class="j25-note-body j25-observations"><span>Avistamientos <b>${p.sightings}</b></span><span>Alimentación <b>${p.food}/10</b></span><span>Especiales <b>${p.specials}</b></span><span>Dimorfismo <b>${escape(p.sexProgress)}</b></span></div></details>
    <details><summary>Registro zoológico <span>Notas de campo</span></summary><div class="j25-note-body"><p>${escape(p.taxonomy)}</p><p><b>Hábitats:</b> ${escape(p.habitats)}</p><p><b>Horarios:</b> ${escape(p.times)}</p><p><b>Estaciones:</b> ${escape(p.seasons)}</p></div></details>
    <details><summary>Especímenes <span>Hallazgos observados</span></summary><div class="j25-note-body">${p.variants?illustration(p.variants):'<p>Sin variantes observadas.</p>'}${p.sexes?illustration(p.sexes):''}</div></details>
   </div><footer class="j25-colophon">EL GRAN ATLAS · SOCIEDAD DE HISTORIA NATURAL</footer>
  </article>`;
 }
 function render(m){
  const q=normalize(m.query),visible=m.items.filter(p=>normalize(p.name).includes(q)).length;
  return `<div class="journal-v3250"><header class="j25-heading"><h1>Cuaderno del naturalista</h1><span>${escape(m.region)} · ${m.identified}/${m.items.length} identificadas</span></header><div class="j25-layout"><aside class="j25-directory" aria-label="Especies de la región"><div class="j25-filters"><label class="sr-only" for="journalRailSearch">Buscar especie conocida</label><input id="journalRailSearch" type="search" placeholder="Buscar especie" autocomplete="off" value="${escape(m.query)}"><label class="sr-only" for="journalRailSort">Ordenar especies</label><select id="journalRailSort" aria-label="Ordenar especies"><option value="catalog" ${m.sort==='catalog'?'selected':''}>Catálogo</option><option value="sightings" ${m.sort==='sightings'?'selected':''}>Más avistadas</option></select><span id="journalRailCount" aria-live="polite">${visible?visible+' especies':'Sin resultados'}</span></div><nav id="journalSpeciesRail" class="j25-rail" aria-label="Selector de especies de la región">${m.items.map(p=>`<button type="button" class="j25-animal ${p.slot===m.selected.slot?'selected':''}" data-action="select-journal" data-journal-slot="${p.slot}" ${p.slot===m.selected.slot?'aria-current="true"':''} ${normalize(p.name).includes(q)?'':'hidden'} aria-label="${escape(p.name)}, ${p.sightings} avistamientos, ${p.stage} de 5"><span class="j25-avatar">${p.discovered?illustration(p.sprite):unknown}</span><span class="j25-animal-name">${escape(p.name)}</span><span class="j25-animal-progress">${p.stage}/5 · ${p.sightings}</span></button>`).join('')}</nav></aside><div id="journalSelectedSheet">${sheet(m)}</div></div></div>`;
 }
 root.AtlasJournalUI=Object.freeze({render,sheet,illustration,normalize});
})(globalThis);
