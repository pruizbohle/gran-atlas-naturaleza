import {MILESTONES,RESEARCH_COSTS,freshSave,normalizeSave,attemptEncounter,advanceResearch,publish,hireScout,applyOfflineProgress,rate,researchCost} from './engine.js';
import species from './species.js';
const KEY='gran-atlas-v01-save'; // Preservar partidas de v0.1
const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let save;try{save=normalizeSave(JSON.parse(localStorage.getItem(KEY)))}catch{save=freshSave()}
const report=applyOfflineProgress(save,species);let tab='explore',selected='zorro';let encounterDisplay=null;
function persist(){save.lastSavedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(save));$('saveStatus').textContent='Guardado ✓'}catch{$('saveStatus').textContent='Guardado no disponible'}}
function updateCounters(){const total=Object.values(save.sightings).reduce((a,b)=>a+b,0);$('knowledge').textContent=Math.floor(save.knowledge).toLocaleString('es-CL');$('total').textContent=total.toLocaleString('es-CL');$('known').textContent=Object.keys(save.discovered).length+'/9';$('fame').textContent=save.fame;}
function ui(){updateCounters();document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));renderPanel();}
const sprite=(a,variant='normal')=>a?`<img class="animal-sprite" src="assets/sprites/${a.id}-${a.id==='zorro'&&['albino','melanico','alfa'].includes(variant)?variant:'normal'}.svg" alt="${esc(a.name)}">`:'🐾';
const info=a=>{const n=save.sightings[a.id]||0,lv=save.research[a.id]||0;return {n,lv,next:MILESTONES[lv],cost:lv<5?researchCost(a,lv):0}};
function renderPanel(){const panel=$('panel');if(tab==='explore'){
  panel.innerHTML=`<div class="card"><h2 class="section">🌲 Salida de campo</h2><p class="muted">Selecciona condiciones. Un encuentro registra un avistamiento; los indicios sin encuentro también generan conocimiento.</p><div class="controls"><label>Hábitat<select id="habitat"><option value="bosque">🌳 Bosque</option><option value="pradera">🌾 Pradera</option><option value="rio">🌊 Río</option><option value="costa">⛵ Costa</option></select></label><label>Horario<select id="time"><option value="amanecer">🌅 Amanecer</option><option value="dia">☀️ Día</option><option value="tarde">🌇 Tarde</option><option value="noche">🌙 Noche</option></select></label><label>Estación<select id="season"><option value="primavera">🌱 Primavera</option><option value="verano">☀️ Verano</option><option value="otono">🍂 Otoño</option><option value="invierno">❄️ Invierno</option></select></label><label>Búsqueda automática<div class="badge spaced">${save.scouts} naturalistas · ${rate(save).toFixed(2)}/s</div></label></div><div class="scene"><div class="trees">🌲 🌳 🌿 🌳 🌲</div><div class="sprite">${encounterDisplay?.type==='sighting'?sprite(encounterDisplay.species,encounterDisplay.variant):'🔭'}</div><div class="message">${encounterDisplay?.type==='sighting'?`${encounterDisplay.first?'¡Nueva especie!':'Avistamiento'} · ${esc(encounterDisplay.species.name)}`:encounterDisplay?.type==='clue'?'🐾 Solo indicios · +2 conocimiento':'Explora para registrar animales'}</div>${encounterDisplay?.type==='sighting'?`<div class="encounter-tags"><span class="badge">${esc(encounterDisplay.species.rarity.replace('_',' '))}</span> <span class="badge">👁 ${(save.sightings[encounterDisplay.species.id]||0)}</span>${encounterDisplay.variant?` <span class="badge exceptional">✦ ${esc(encounterDisplay.variant)}</span>`:''}</div>`:''}</div><button id="search" class="primary">🔭 Buscar animales</button><p class="muted">Cada encuentro suma conocimiento y 1 avistamiento. Variantes especiales opcionales.</p></div><div class="card"><h3 class="section">📋 Diario</h3>${save.log.length?save.log.map(x=>`<div class="log">${esc(x)}</div>`).join(''):'<p class="muted">Aún no tienes observaciones.</p>'}</div>`;
  for(const k of ['habitat','time','season']){$(k).value=save.settings[k];$(k).onchange=e=>{save.settings[k]=e.target.value;persist();ui()}}$('search').onclick=()=>{encounterDisplay=attemptEncounter(save,species);persist();ui()};
}else if(tab==='journal'){
 panel.innerHTML=`<div class="card"><h2 class="section">📓 Cuaderno · HX-01-09</h2><p class="muted">Los hitos 1, 10, 20, 50 y 100 avistamientos solo habilitan la investigación. Cada ascenso consume conocimiento.</p><div class="animal-grid">${species.map(a=>{const i=info(a);return `<button class="animal ${selected===a.id?'selected':''}" data-species="${a.id}"><span class="emoji">${i.n?sprite(a,save.lastEncounter?.id===a.id?save.lastEncounter.variant:null):'❔'}</span><span class="name">${esc(a.name)}</span><br><span class="meta">${a.rarity.replace('_',' ')} · ${i.lv}/5 · ${i.n} 👁</span><span class="research-dots">${Array.from({length:5},(_,index)=>`<i class="${index<i.lv?'filled':''}"></i>`).join('')}</span></button>`}).join('')}</div></div>`;
 panel.querySelectorAll('[data-species]').forEach(b=>b.onclick=()=>{selected=b.dataset.species;ui()});let a=species.find(x=>x.id===selected),i=info(a);let stages=MILESTONES.map((n,x)=>`<span class="${x<i.lv?'done':''}">${n}</span>`).join('');
 panel.insertAdjacentHTML('beforeend',`<div class="card"><div class="row"><div><span class="badge">${a.rarity.replace('_',' ')}</span><h2 class="section spaced">${esc(a.name)}</h2><i class="muted">${i.lv?esc(a.scientific):'Nombre por investigar'}</i></div><div class="big">${i.n?sprite(a,save.lastEncounter?.id===a.id?save.lastEncounter.variant:null):'❔'}</div></div><p><b>Avistamientos:</b> ${i.n} / 100</p><div class="progress"><div style="width:${Math.min(100,i.n)}%"></div></div><div class="stages">${stages}</div><p class="muted">Progreso ${i.lv}/5 · ${i.lv<5?'Siguiente hito: '+i.next:'Estudio completado'} · ${i.lv<5?`Faltan ${Math.max(0,i.next-i.n)} encuentros`:'Monografía habilitada'}</p><p class="muted">Condiciones: ${a.habitats.join(' / ')} · ${a.times.join(' / ')} · ${a.seasons.join(' / ')}</p>${i.lv<5?`<div class="card"><div class="row"><span>👁 Requeridos</span><b>${i.n}/${i.next}</b></div><div class="row spaced"><span>📜 Costo</span><b>${i.cost} conocimiento</b></div></div><button class="primary" id="advance" ${i.n<i.next||save.knowledge<i.cost?'disabled':''}>🔬 Investigar a ${i.lv+1}/5</button>`:`<button class="primary" id="publish" ${save.published[a.id]?'disabled':''}>${save.published[a.id]?'✓ Monografía publicada':'📜 Publicar monografía · +1 prestigio'}</button>`}<p class="muted">Variantes observadas: ${esc(Object.entries(save.variants[a.id]||{}).map(([x,n])=>`${x} ×${n}`).join(' · ')||'ninguna')}</p></div>`);
 $('advance')?.addEventListener('click',()=>{if(advanceResearch(save,a)){persist();ui()}});$('publish')?.addEventListener('click',()=>{if(publish(save,a)){persist();ui()}});
}else if(tab==='staff'){
 const price=Math.ceil(40*1.65**save.scouts);panel.innerHTML=`<div class="card"><h2 class="section">🧰 Instrumentos y personal</h2><p class="muted">Los ayudantes usan las condiciones seleccionadas en Explorar y registran encuentros automáticamente, incluso durante hasta 8 horas offline.</p><div class="row"><div><b>✍️ Naturalistas</b><div class="muted">Contratados: ${save.scouts} · ${rate(save).toFixed(2)} búsquedas/seg.</div></div><span class="badge">Nivel ${save.scouts}</span></div><button class="primary spaced" id="hire" ${save.knowledge<price?'disabled':''}>Contratar · ${price} 📜</button></div><div class="card"><h3 class="section">Próximas mejoras</h3><p class="muted">Prismáticos, biblioteca, equipo y técnicas científicas se incorporarán tras validar el equilibrio del núcleo jugable.</p></div>`;$('hire').onclick=()=>{if(hireScout(save)){persist();ui()}};
}else{
 panel.innerHTML=`<div class="card"><h2 class="section">🎖️ Sociedad Científica</h2><p class="muted">Cada especie con investigación 5/5 permite publicar una monografía y conseguir 1 prestigio.</p><div class="row"><span>Monografías publicadas</span><b>${Object.keys(save.published).length}/9</b></div><div class="row spaced"><span>Prestigio conseguido</span><b>${save.fame}</b></div><p class="muted">El compendio de Islas Británicas se habilitará cuando estén publicadas las nueve monografías.</p></div><div class="card"><h3 class="section">🔒 Museo, Atlas mundial y árbol tecnológico</h3><p class="muted">Los sistemas posteriores se desarrollarán después de confirmar las reglas de descubrimiento e investigación.</p></div>`;
}}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;ui()});
$('resetSave').onclick=()=>{if(confirm('¿Borrar la partida guardada?')){save=freshSave();selected='zorro';encounterDisplay=null;persist();ui()}};
$('exportSave').onclick=()=>{persist();const blob=new Blob([JSON.stringify(save,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gran-atlas-partida.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
// Count passive encounters in foreground independently of the view currently shown.
// Evitar reconstruir el DOM cuando trabajan los naturalistas: un <select> abierto
// pierde el foco y se cierra si se reemplaza el panel completo.
let accumulator=0,lastTick=Date.now(),lastPersist=Date.now(),lastDiaryRefresh=0;
const tick=setInterval(()=>{
  const now=Date.now(),dt=Math.min(1,(now-lastTick)/1000);
  lastTick=now;
  if(document.hidden)return;
  accumulator+=rate(save)*dt;
  let changed=false;
  // Limitar trabajo por intervalo; el excedente queda en el acumulador.
  let iterations=0;
  while(accumulator>=1 && iterations<25){
    attemptEncounter(save,species,Math.random,'auto');
    accumulator--;iterations++;changed=true;
  }
  if(!changed)return;
  updateCounters();
  // El diario se actualiza sin reemplazar los selectores ni el área de juego.
  if(tab==='explore' && now-lastDiaryRefresh>=2500){
    lastDiaryRefresh=now;
    const diary=document.querySelector('#panel .card:nth-child(2)');
    if(diary){
      diary.replaceChildren();
      const title=document.createElement('h3');title.className='section';title.textContent='📋 Diario';diary.appendChild(title);
      for(const line of save.log){const item=document.createElement('div');item.className='log';item.textContent=line;diary.appendChild(item)}
    }
  }
  if(now-lastPersist>=5000){lastPersist=now;persist()}
},500);
document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();else{applyOfflineProgress(save,species);lastTick=Date.now();persist();ui()}});
window.addEventListener('pagehide',persist);setInterval(persist,15000);if(report.attempts)save.log.unshift(`📬 Al volver: ${report.sightings} avista
