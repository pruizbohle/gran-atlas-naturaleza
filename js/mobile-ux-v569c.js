/* V5.6.9 Beta · MEC-09C · Capa de experiencia móvil. Solo presentación: no cambia reglas ni datos.
   - Bestiario: búsqueda siempre visible; grupo, avistamientos y orden plegados en «Filtros» (con recuento).
   - Navegación inferior: aria-current en la pestaña activa.
   - Subpestañas: la seleccionada se mantiene visible dentro de su fila desplazable.
   Idempotente: se reaplica tras cada renderizado del panel (MutationObserver agrupado por fotograma). */
(()=>{
  'use strict';
  const panel=document.getElementById('panel');if(!panel)return;
  const mq=window.matchMedia('(max-width:700px)');
  const ui={filtersOpen:false};
  function bestiary(){
    const c=panel.querySelector('.b26-controls');if(!c||!mq.matches)return;
    const selects=[...c.querySelectorAll('.b26-filter-row select,.b26-sort-row select')];
    const active=selects.filter(s=>s.selectedIndex>0).length+([...c.querySelectorAll('.b26-advanced select,.b26-advanced input:checked')].filter(e=>e.tagName==='INPUT'||e.selectedIndex>0).length);
    let bar=c.querySelector('.ux9c-filterbar');
    if(!bar){bar=document.createElement('div');bar.className='ux9c-filterbar';bar.innerHTML='<button type="button" class="ux9c-filters-toggle" aria-expanded="false"></button><small></small>';
      const search=c.querySelector('.b26-search');if(search)search.after(bar);else c.prepend(bar);
      bar.firstElementChild.addEventListener('click',()=>{ui.filtersOpen=!ui.filtersOpen;bestiary();});}
    const t=bar.firstElementChild,label='Filtros'+(active?' · '+active+' activos':'');
    if(t.textContent!==label)t.textContent=label;t.setAttribute('aria-expanded',String(ui.filtersOpen));
    c.classList.toggle('ux9c-collapsed',!ui.filtersOpen);
    const sum=[...selects].map(s=>s.selectedIndex>0?s.options[s.selectedIndex].text:null).filter(Boolean).join(' · ');
    const sm=bar.querySelector('small');if(sm.textContent!==sum)sm.textContent=sum;
  }
  // Inventario de textos (MEC-09C): C = contexto → plegado tras «ⓘ»; D = redundante → oculto en móvil.
  // Solo textos explicativos; nunca requisitos, costos, consumos irreversibles ni recompensas.
  const TEXTS=[
   {id:'museo-intro',sel:'[data-room] p.small,.m27-room p.small,section p.small',re:/^Organiza las vitrinas y los gabinetes existentes/,act:'info'},
   {id:'museo-diploma',sel:'p.small',re:/^Diploma sin recompensas económicas\./,act:'hide'},
   {id:'sociedad-subvencion',sel:'div.small,p.small',re:/^Subvención disponible cada \d+ s · Intercambio de libras/,act:'info'},
   {id:'inventario-buscar',sel:'.inv340-search',re:/^Buscar objetos/,act:'label'},
  ];
  const opened=new Set();
  function texts(){
    if(!mq.matches)return;
    for(const r of TEXTS)for(const el of panel.querySelectorAll(r.sel)){
      if(el.dataset.ux9cText)continue;const t=el.textContent.trim();if(!r.re.test(t))continue;el.dataset.ux9cText=r.id;
      if(r.act==='hide'){el.hidden=true;continue;}
      if(r.act==='label'){const lab=[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());const input=el.querySelector('input');if(input&&!input.getAttribute('aria-label'))input.setAttribute('aria-label','Buscar objetos');el.classList.add('ux9c-compact-label');continue;}
      const btn=document.createElement('button');btn.type='button';btn.className='ux9c-info-btn';btn.textContent='ⓘ Más información';btn.setAttribute('aria-expanded','false');
      const open=opened.has(r.id);el.dataset.ux9cInfo=open?'open':'closed';btn.setAttribute('aria-expanded',String(open));
      btn.addEventListener('click',()=>{const o=el.dataset.ux9cInfo!=='open';el.dataset.ux9cInfo=o?'open':'closed';btn.setAttribute('aria-expanded',String(o));if(o)opened.add(r.id);else opened.delete(r.id);});
      el.before(btn);
    }
  }
  function dock(){for(const b of document.querySelectorAll('.mobile-dock-link')){const on=b.classList.contains('active');if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');}}
  function keepActiveVisible(){
    for(const row of panel.querySelectorAll('.inventory-subtabs,.society-tabs,.er28-branches')){
      const a=row.querySelector('.active,.selected,[aria-pressed=true],[aria-selected=true]');if(!a||row.scrollWidth<=row.clientWidth)continue;
      const l=a.offsetLeft-row.offsetLeft,r=l+a.offsetWidth;if(l<row.scrollLeft||r>row.scrollLeft+row.clientWidth)row.scrollLeft=Math.max(0,l-16);
    }
  }
  let queued=false;
  function apply(){queued=false;try{bestiary();texts();dock();keepActiveVisible();}catch(e){console.error('MEC-09C UX:',e);}}
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(apply);}};
  new MutationObserver(schedule).observe(panel,{childList:true,subtree:true});
  document.querySelectorAll('.mobile-dock-link').forEach(b=>new MutationObserver(schedule).observe(b,{attributes:true,attributeFilter:['class']}));
  mq.addEventListener?.('change',schedule);
  schedule();
  window.AtlasMobileUX569c=Object.freeze({apply,state:()=>({...ui}),texts:()=>TEXTS.map(t=>({id:t.id,act:t.act,pattern:String(t.re)}))});
})();
