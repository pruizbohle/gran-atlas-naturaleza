/* V5.5.0 · Marco móvil estable: monedas, título de pestaña y pops. Solo presentación. */
(()=>{
  'use strict';
  const mq=window.matchMedia('(max-width:700px)');
  const $=id=>document.getElementById(id);
  const cur=$('frameCur'),pop=$('framePop'),name=$('frameTabName'),panel=$('panel');
  if(!cur||!pop||!name||!panel)return;
  const LABELS={atlas:'Atlas',field:'Campo',journal:'Cuaderno',research:'Investigación',society:'Sociedad',bestiary:'Bestiario',expeditions:'Campamento',objects:'Inventario',museum:'Museo',crown:'Corona'};
  const icon=(id,s=24)=>window.AtlasIcons530?.image(id,s)||'';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const txt=id=>($(id)?.textContent||'').trim();
  const currentTab=()=>document.querySelector('.mobile-dock-link.active,.tabs .tab.active')?.dataset.tab||'field';
  const crown=()=>{try{return typeof state!=='undefined'?Math.floor(Math.max(0,state.crownCoins||0)):0;}catch{return 0;}};
  const fmt=n=>new Intl.NumberFormat('es-CL').format(n);
  const POPS={
    conocimiento:()=>['conocimiento','Conocimiento · '+txt('statKnowledge'),'Lo que aprendes al observar, investigar y publicar.','Se gasta en estudios de Investigación y abre mejoras para tus observaciones.'],
    libras:()=>['libras','Libras · '+txt('statMoney'),'Moneda de la Sociedad.','Sirven para contratar naturalistas, comprar equipo y financiar expediciones.'],
    prestigio:()=>['prestigio','Prestigio · '+txt('statPrestige'),'Tu reputación científica.','Las monografías publicadas lo aumentan y desbloquean nuevas regiones del Atlas.'],
    corona:()=>['corona','Coronas · '+fmt(crown()),'Saldo histórico de partidas anteriores.','Se conservan entre partidas. Los fondos de juego se obtienen en Sociedad, expediciones y exhibiciones del Museo.','crown','Abrir Corona']
  };
  let open=null,scrim=null;
  function chips(){
    const set=(id,v)=>{const n=$(id);if(n&&n.textContent!==v)n.textContent=v;};
    set('frameKnowledge',txt('statKnowledge')||'0');set('frameMoney',txt('statMoney')||'£0');
    set('framePrestige',txt('statPrestige')||'0');set('frameCrown',fmt(crown()));
    const r=txt('regionPill').split('·')[0].trim();
    const reg=document.querySelector('.frame-region');
    if(reg&&r&&reg.textContent!==r)reg.textContent=r;
  }
  function title(){const t=currentTab();if(name.textContent!==LABELS[t])name.textContent=LABELS[t]||'';document.body.dataset.frameTab=t;}
  function close(){
    if(!open)return;
    document.body.classList.remove('fr-pop-guia','fr-pop-brujula','fr-sheet');
    pop.hidden=true;pop.innerHTML='';
    document.querySelectorAll('[data-pop][aria-expanded]').forEach(b=>b.setAttribute('aria-expanded','false'));
    scrim?.remove();scrim=null;open=null;
  }
  function show(key,btn){
    if(open===key){close();return;}
    close();open=key;
    btn.setAttribute('aria-expanded','true');
    if(key==='ficha'){document.body.classList.add('fr-sheet');}
    else if(key==='guia'||key==='brujula'){
      const sel=key==='guia'?'.ux3410-guide':'.ux3410-compass';
      const el=panel.querySelector(sel);
      if(el){if(key==='guia')el.open=true;document.body.classList.add('fr-pop-'+key);}
      else{
        pop.innerHTML='<b class="fp-t">'+icon(key==='guia'?'registro-cientifico':'brujula')+(key==='guia'?'Guía del naturalista':'Brújula del naturalista')+'</b>'+
          (key==='brujula'?'<p>La Brújula te indica la próxima ruta del Atlas.</p><button type="button" class="fp-go" data-go="atlas">Abrir Atlas</button>':'<p class="fp-sub">No hay indicaciones para esta pestaña.</p>');
        pop.hidden=false;}
    }else{
      const d=POPS[key]();
      pop.innerHTML='<b class="fp-t">'+icon(d[0])+esc(d[1])+'</b><p>'+esc(d[2])+'</p><p class="fp-sub">'+esc(d[3])+'</p>'+(d[4]?'<button type="button" class="fp-go" data-go="'+d[4]+'">'+esc(d[5])+'</button>':'');
      pop.hidden=false;
    }
    scrim=document.createElement('div');scrim.className='frame-scrim';scrim.addEventListener('click',close);document.getElementById('app').appendChild(scrim);
  }
  document.querySelectorAll('[data-pop]').forEach(b=>{b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>show(b.dataset.pop,b));});
  pop.addEventListener('click',e=>{
    const go=e.target.closest('[data-go]');
    if(go){close();document.querySelector('.tabs .tab[data-tab="'+go.dataset.go+'"]')?.click();}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  // Tocar un hexágono abre la ficha de la región
  panel.addEventListener('click',e=>{if(mq.matches&&currentTab()==='atlas'&&e.target.closest('.atlas-tile'))requestAnimationFrame(()=>show('ficha',document.querySelector('.frame-tool-info')));});
  // Aviso: el panel guarda sus controles; cualquier navegación cierra los pops.
  document.querySelectorAll('.mobile-dock-link').forEach(b=>b.addEventListener('click',close));
  // Subtítulo de región
  const brand=document.querySelector('.topbar .brand');
  if(brand&&!document.querySelector('.frame-region')){const r=document.createElement('div');r.className='frame-region';brand.after(r);}
  const obs=new MutationObserver(()=>{chips();title();});
  ['statKnowledge','statMoney','statPrestige','regionPill'].forEach(id=>{const n=$(id);if(n)obs.observe(n,{childList:true,characterData:true,subtree:true});});
  document.querySelectorAll('.tab').forEach(b=>obs.observe(b,{attributes:true,attributeFilter:['class']}));
  obs.observe(panel,{childList:true});
  setInterval(chips,1500);
  chips();title();
  mq.addEventListener?.('change',()=>{close();chips();title();});
})();
