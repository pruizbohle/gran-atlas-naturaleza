/* El Gran Atlas · V5.6.1 Beta — MEC-01 · presentación de colecciones y gabinetes.
 * Solo genera HTML a partir de modelos que prepara app.js; no modifica la partida.
 * Las piezas pendientes usan la lámina genérica «?». Las no descubiertas
 * se muestran con una silueta sin nombre. */
(function(root){'use strict';
const esc=x=>String(x??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const fmt=n=>new Intl.NumberFormat('es-CL').format(Math.floor(Number(n)||0));
const pct=(a,b)=>b?Math.round(100*a/b):0;
const select=(attr,key,value,label,options)=>`<label class="mec01-field">${esc(label)}<select ${attr}="${esc(key)}">${options.map(([v,l])=>`<option value="${esc(v)}"${v===value?' selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
const bar=(have,total)=>`<div class="progress mec01-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${have}"><div style="width:${pct(have,total)}%"></div></div>`;

/* Inventario → Coleccionables */
function card(p){
 if(!p.discovered)return `<button type="button" class="mec01-card mec01-unknown" data-action="mec01-piece" data-id="${esc(p.id)}" aria-label="Pieza sin descubrir ${p.slot} de ${p.of}"><span class="mec01-silhouette" aria-hidden="true">?</span><strong>Sin descubrir</strong><small>${p.slot}/${p.of}</small></button>`;
 return `<button type="button" class="mec01-card${p.exhibited?' mec01-shown':''}${p.owned?'':' mec01-empty'}" data-action="mec01-piece" data-id="${esc(p.id)}"><span class="mec01-art" aria-hidden="true">${p.art||''}</span><strong>${esc(p.name)}</strong><small>${esc(p.rarity)} · ×${fmt(p.available)}${p.exhibited?' · '+p.exhibited+' en vitrina':''}</small></button>`;
}
function collections(m){
 const f=m.filters;
 const head=`<header class="mec01-head"><strong>Colecciones · BETA</strong><span>${fmt(m.discovered)}/${fmt(m.total)} piezas descubiertas · ${m.complete}/${m.collectionCount} colecciones completas</span>${bar(m.discovered,m.total)}</header>`;
 const filters=`<div class="mec01-filters">${select('data-mec01-filter','col',f.col,'Colección',[['all','Todas'],...m.collectionNames.map(n=>[n,n])])}${select('data-mec01-filter','rar',f.rar,'Rareza',[['all','Todas'],...m.rarities.map((n,i)=>[String(i),n])])}${select('data-mec01-filter','state',f.state,'Estado',[['all','Todas'],['found','Descubiertas'],['missing','Pendientes']])}</div>`;
 const groups=m.groups.map(g=>`<details class="mec01-group${g.complete?' mec01-complete':''}"${g.open?' open':''} data-mec01-group="${esc(g.name)}"><summary><span>${esc(g.name)}</span><small>${esc(g.cabinet)} · ${g.have}/${g.total}${g.complete?' · <b class="mec01-done">✓ Colección completa</b>':''}</small>${bar(g.have,g.total)}</summary><div class="mec01-grid">${g.pieces?(g.pieces.map(card).join('')||'<p class="small">Ninguna pieza coincide con el filtro.</p>'):'<p class="small">Abriendo la colección…</p>'}</div></details>`).join('');
 return `<section class="mec01-collections" aria-label="Colecciones">${head}${filters}${groups||'<p class="small">Ninguna colección coincide con el filtro.</p>'}<p class="small mec01-note">El avance usa el registro histórico de descubrimientos: una pieza descubierta sigue contando aunque salga del inventario. Las cantidades muestran las unidades disponibles (sin contar las reservadas en vitrinas).</p></section>`;
}
function detail(m){
 if(!m.discovered)return `<h3 id="mec01-dialog-title">Pieza sin descubrir</h3><p>Pertenece a la colección <b>${esc(m.collection)}</b> (${esc(m.cabinet)}).</p><p class="small">Aún no la has encontrado. Sus datos aparecerán al descubrirla.</p>${m.hint?`<p class="small">${esc(m.hint)}</p>`:''}`;
 // MEC-06: origen, lugar de hallazgo y lugar de compra (geografía de MEC-04) cuando el modelo los trae.
 const rows=[['Colección',m.collection],['Gabinete del Museo',m.cabinet],['Rareza',m.rarity],...(m.origin?[['Origen',m.origin],['Se encuentra en',m.findIn||'—'],['Se compra en',m.buyIn||'No se vende']]:[['Procedencia',m.continent||'Sin registrar']])];
 return `<div class="mec01-dialog-art" aria-hidden="true">${m.art||''}</div><h3 id="mec01-dialog-title">${esc(m.name)} <span class="mec01-beta">BETA</span></h3><p>${esc(m.description)}</p><dl class="mec01-dl">${rows.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl><h4>Existencias</h4><dl class="mec01-dl"><dt>En inventario</dt><dd>${fmt(m.owned)}</dd><dt>En exhibición</dt><dd>${fmt(m.exhibited)}</dd><dt>Disponible</dt><dd>${fmt(m.available)}</dd><dt>Disponible para intercambios</dt><dd>${fmt(m.tradable)}${m.protected?' (1 protegida)':''}</dd><dt>Obtenidas en total</dt><dd>${fmt(m.obtained)}</dd></dl><h4>Fuentes</h4><ul class="small">${m.sources.map(s=>`<li>${esc(s)}</li>`).join('')||'<li>Sin fuente registrada.</li>'}</ul>${m.registry?.length?`<h4>Registro de procedencia</h4><ul class="small">${m.registry.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}<p class="small">${esc(m.firstSeen)}</p>`;
}

/* Museo → Gabinetes */
function piece(p,action,label,disabled){return `<article class="m27-piece owned mec01-cab-piece"><div class="m27-plate"><span class="m27-art">${p.art||''}</span><strong>${esc(p.name)}</strong><span class="m27-tag">${esc(p.rarity)} · ${esc(p.collection)}${p.available!==undefined?' · ×'+fmt(p.available):''}</span></div><div class="m27-actions"><button type="button" class="btn alt" data-action="${action}" data-id="${esc(p.id)}"${disabled?' disabled':''}>${label}</button></div></article>`;}
function cabinet(c){
 const f=c.filters,key=esc(c.name);
 const filters=`<div class="mec01-filters"><label class="mec01-field">Buscar<input type="search" data-mec01-cab-query="${key}" value="${esc(f.q)}" maxlength="60" placeholder="Nombre de la pieza" autocomplete="off"></label>${select('data-mec01-cab-col',c.name,f.col,'Colección',[['all','Todas'],...c.collectionNames.map(n=>[n,n])])}${select('data-mec01-cab-rar',c.name,f.rar,'Rareza',[['all','Todas'],...c.rarities.map((n,i)=>[String(i),n])])}</div>`;
 const pager=c.pages>1?`<nav class="mec01-pager" aria-label="Páginas de ${key}"><button type="button" class="btn alt" data-action="mec01-cab-page" data-id="${key}|${c.page-1}"${c.page<=0?' disabled':''}>‹ Anterior</button><span>Página ${c.page+1} de ${c.pages} · ${fmt(c.matches)} piezas</span><button type="button" class="btn alt" data-action="mec01-cab-page" data-id="${key}|${c.page+1}"${c.page>=c.pages-1?' disabled':''}>Siguiente ›</button></nav>`:`<p class="small">${fmt(c.matches)} piezas disponibles para exponer.</p>`;
 return `<details class="m27-section mec01-cabinet" data-mec01-cabinet="${key}"${c.open?' open':''}><summary>${key} · ${c.used}/${c.capacity} expuestas · ${fmt(c.candidates)} disponibles${c.full?' · completo':''}</summary><div class="m27-fold-body"><div class="mec01-capacity"><span>Capacidad utilizada: ${c.used} de ${c.capacity} casillas</span>${bar(c.used,c.capacity)}</div><h4>Expuestas</h4><div class="m27-grid">${c.shown.map(p=>piece(p,'mec01-cab-withdraw','Retirar',false)).join('')||'<p class="m27-empty">No hay piezas expuestas en este gabinete.</p>'}</div><h4>Elegir piezas</h4>${filters}${pager}<div class="m27-grid">${c.list.map(p=>piece(p,'mec01-cab-expose','Exponer',c.full)).join('')||'<p class="m27-empty">'+(c.candidates?'Ninguna pieza coincide con la búsqueda.':'No tienes piezas disponibles de este gabinete. Caen de los animales con el Gabinete de especímenes.')+'</p>'}</div></div></details>`;
}
function cabinets(m){
 return `<div class="m27-room-heading"><h3>Gabinetes de colección · BETA</h3><small>${m.capacity} casillas por gabinete · nivel ${m.level} del museo</small></div><p class="m27-note">Exponer una pieza reserva una unidad de tu inventario sin gastarla; al retirarla vuelve a estar disponible. Por ahora las vitrinas no dan ingresos ni bonificaciones.</p>${m.cabinets.map(cabinet).join('')}`;
}

/* Ventana emergente propia (fuera del panel, para sobrevivir a los repintados). */
let box=null,lastFocus=null;
function close(){if(!box)return;box.hidden=true;box.innerHTML='';try{lastFocus?.focus?.({preventScroll:true});}catch(_){}}
function show(html){
 const doc=root.document;if(!doc?.createElement||!doc.body)return false;
 if(!box){
  box=doc.createElement('div');box.id='mec01-dialog';box.className='mec01-dialog';box.hidden=true;
  box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-labelledby','mec01-dialog-title');
  box.addEventListener('click',e=>{if(e.target===box||e.target.closest?.('[data-mec01-close]'))close();});
  box.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  doc.body.appendChild(box);
 }
 lastFocus=doc.activeElement;
 box.innerHTML=`<div class="mec01-dialog-card">${html}<button type="button" class="btn" data-mec01-close>Cerrar</button></div>`;
 box.hidden=false;box.querySelector?.('[data-mec01-close]')?.focus?.();
 return true;
}
root.AtlasMEC01UI=Object.freeze({collections,detail,cabinets,show,close});
})(typeof globalThis!=='undefined'?globalThis:window);
