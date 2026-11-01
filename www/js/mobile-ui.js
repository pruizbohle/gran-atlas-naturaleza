// Navegación exclusiva para pantallas móviles; el motor original sigue intacto.
(()=>{
  const menu=document.getElementById('mobileDrawer');
  const open=document.getElementById('mobileMenuOpen');
  const close=document.getElementById('mobileMenuClose');
  const backdrop=document.getElementById('mobileMenuBackdrop');
  const heading=document.getElementById('mobileViewTitle');
  const statToggle=document.getElementById('mobileStatsToggle');
  statToggle?.addEventListener('click',()=>{
    const expanded=document.body.classList.toggle('mobile-stats-open');
    statToggle.setAttribute('aria-expanded',String(expanded));
    statToggle.lastElementChild.textContent=expanded?'▴':'▾';
  });

  if(!menu||!open||!heading)return;
  const labels={atlas:'🗺️ Atlas',field:'🌿 Campo',journal:'📖 Cuaderno',research:'🔬 Investigación',society:'📜 Sociedad',bestiary:'🦉 Bestiario',expeditions:'⛵ Expediciones',objects:'🎒 Inventario',museum:'🏛️ Museo',crown:'👑 Corona'};
  const main=['atlas','field','journal','research'];
  function selected(){return Array.from(document.querySelectorAll('.mobile-dock-link.active,.mobile-menu-item.active')).find(e=>e.dataset.tab)?.dataset.tab||'field';}
  function sync(){
    const value=selected();
    heading.textContent=labels[value]||'🌿 Campo';
    open.classList.toggle('is-active', !main.includes(value));
    document.querySelector('.mobile-dock')?.setAttribute('aria-label','Navegación móvil · '+(labels[value]||''));
    document.querySelectorAll('.mobile-dock-link,.mobile-menu-item').forEach(b=>b.setAttribute('aria-current',b.classList.contains('active')?'page':'false'));
  }
  const shut=()=>{
    menu.hidden=true;
    document.body.classList.remove('mobile-menu-open');
    open.setAttribute('aria-expanded','false');
  };
  function reveal(){menu.hidden=false; document.body.classList.add('mobile-menu-open');open.setAttribute('aria-expanded','true');close.focus();}
  open.addEventListener('click',()=>menu.hidden?reveal():shut());
  close.addEventListener('click',()=>{shut();open.focus()});
  backdrop.addEventListener('click',()=>{shut();open.focus()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){shut();open.focus()}});
  document.querySelectorAll('.mobile-dock-link,.mobile-menu-item').forEach(b=>b.addEventListener('click',()=>{
    shut();sync();
    if(window.matchMedia('(max-width:700px)').matches) window.scrollTo({top:0,behavior:'instant'});
  }));
  document.getElementById('panel')?.addEventListener('click',e=>{
    if(e.target.closest('[data-action="select-journal"]') && !document.querySelector('.journal-v311') && window.matchMedia('(max-width:700px)').matches){
      requestAnimationFrame(()=>document.querySelector('.journal-detail')?.scrollIntoView({block:'start',behavior:'smooth'}));
    }
  });
  const observer=new MutationObserver(sync);
  document.querySelectorAll('.tab').forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['class']}));
  sync();
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
