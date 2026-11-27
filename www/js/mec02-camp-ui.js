/* El Gran Atlas · V5.6.2 Beta — MEC-02 · ficha de instalación del Campamento.
 * Solo genera HTML a partir del modelo que prepara app.js. */
(function(root){'use strict';
const esc=x=>String(x??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const fmt=n=>new Intl.NumberFormat('es-CL').format(Math.floor(Number(n)||0));
const list=items=>items.length?`<ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:'';
function card(m){
 const campArt=root.AtlasCampArt;
 const illustration=campArt?.picture(campArt.entries[m.artRef]);
 const cap=m.capacity?`<div class="mec02-cap"><span>Capacidad: ${m.capacity.used} de ${m.capacity.total} ${esc(m.capacity.unit)}</span><div class="progress"><div style="width:${m.capacity.total?Math.min(100,Math.round(100*m.capacity.used/m.capacity.total)):0}%"></div></div></div>`:'';
 const acts=m.activities?`<p class="mec02-acts"><b>${m.activities.running}</b> en curso · <b>${m.activities.finished}</b> terminada${m.activities.finished===1?'':'s'}${m.activities.pending?' · <b>'+m.activities.pending+'</b> con recompensa por recoger':''} · ${fmt(m.activities.settled)} liquidada${m.activities.settled===1?'':'s'}</p>`:'';
 const next=m.next?`<section class="mec02-next"><h4>Próximo nivel: ${esc(m.next.roman)} · ${esc(m.next.name)}</h4>${list(m.next.functions)}<p class="small">Costo: £${fmt(m.next.cost.money)} y ${fmt(m.next.cost.knowledge)} de conocimiento · Prestigio mínimo ${fmt(m.next.prestige)} (se conserva) · Valores provisionales.</p>${m.next.reasons.length?`<p class="small mec02-missing">Falta: ${esc(m.next.reasons.join(' · '))}</p>`:''}<button type="button" class="btn${m.next.ok?' gold':' alt'}" data-action="mec02-upgrade" data-id="${esc(m.id)}"${m.next.ok?'':' disabled'}>Mejorar a ${esc(m.next.name)}</button></section>`:'<p class="mec02-max">Nivel máximo alcanzado.</p>';
 return `<section class="mec02-card" data-mec02-facility="${esc(m.id)}" aria-label="${esc(m.name)}, nivel ${esc(m.roman)} de V"><header><span class="mec02-art" data-art-ref="${esc(m.artRef)}" title="${illustration?'Ilustración de la instalación':'Ilustración provisional'}">${illustration||m.art||''}</span><div><span class="mec02-kicker">INSTALACIÓN · NIVEL ${esc(m.roman)}/V <span class="mec01-beta">BETA</span></span><h3>${esc(m.stageName)}</h3><p class="small">${esc(m.name)} · ${esc(m.status)}</p></div></header>${cap}${acts}<details class="mec02-functions"${m.openFunctions?' open':''}><summary>Funciones disponibles</summary>${list(m.functions)}</details>${m.controls||''}${next}</section>`;
}
root.AtlasCampMEC02UI=Object.freeze({card,esc,fmt});
})(typeof globalThis!=='undefined'?globalThis:window);
