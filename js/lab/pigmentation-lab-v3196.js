/* Read-only production gallery: no game bootstrap, storage or observation calls. */
(function(){
'use strict';
const api=globalThis.ATLAS_DIMORPHISM_LAB,$=id=>document.getElementById(id);
const norm=x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const rows=Object.entries(api.SPECIES).map(([id,sp])=>{
 const mammal=ATLAS_MAMMAL_ART_V3194.classify(sp,id),bird=ATLAS_BIRD_ART_V3193.classify(sp),herp=(!mammal&&!bird?(api.getSpriteMarkup(id).match(/data-herp-family="([^"]+)"/)||[])[1]:null);
 return {id,sp,family:mammal||bird||herp||sp.kind,group:mammal?'Mamíferos':bird?'Aves':herp?'Reptiles y anfibios':'Peces'};
});
function draw(){
 document.documentElement.style.setProperty('--size',$('size').value+'px');
 document.body.classList.toggle('dark',$('background').value==='dark');
 document.body.classList.toggle('silhouette',$('view').value==='silhouette');
 const technical=$('technical').checked,variant=$('variant').value;
 const selected=rows.filter(r=>(technical||r.sp.special.some(v=>v==='Albino'||v==='Melánico'))&&
  ($('group').value==='all'||r.group===$('group').value)&&(variant==='all'||r.sp.special.includes(variant))&&
  norm(r.sp.name+' '+r.sp.latin).includes(norm($('search').value)));
 $('counts').textContent=`Albino: ${rows.filter(r=>r.sp.special.includes('Albino')).length} especies · Melánico: ${rows.filter(r=>r.sp.special.includes('Melánico')).length} especies · Mostrando: ${selected.length}`;
 $('gallery').replaceChildren();
 for(const group of ['Mamíferos','Aves','Reptiles y anfibios','Peces']){
  const matches=selected.filter(r=>r.group===group);if(!matches.length)continue;
  const heading=document.createElement('h2');heading.textContent=group;
  const grid=document.createElement('section');grid.className='grid';$('gallery').append(heading,grid);
  for(const r of matches){
   const card=document.createElement('article');card.className='card';card.dataset.speciesId=r.id;
   const h=document.createElement('h3');h.textContent=r.sp.name;
   const latin=document.createElement('p');latin.className='latin';latin.textContent=r.sp.latin;
   const pair=document.createElement('div');pair.className='pair';
   for(const [label,skin] of [['Normal','normal'],['Albino','albino'],['Melánico','melanico']]){
    const configured=skin==='normal'||r.sp.special.includes(label),fig=document.createElement('figure');
    if(configured||technical)fig.innerHTML=api.getSpriteMarkup(r.id,skin);
    else {const empty=document.createElement('div');empty.className='unavailable';empty.textContent='—';fig.append(empty);}
    const caption=document.createElement('figcaption');caption.textContent=label;
    if(!configured){const detail=document.createElement('small');detail.textContent=technical?'Técnica · no coleccionable':'No configurada';caption.append(detail);}
    fig.append(caption);pair.append(fig);
   }
   const meta=document.createElement('p');meta.className='meta';meta.textContent=`Familia visual: ${r.family} · Disponibles: ${r.sp.special.join(', ')||'ninguna'} · Configuración: catálogo de producción`;
   card.append(h,latin,pair,meta);grid.append(card);
  }
 }
}
for(const id of ['size','background','view','group','variant','technical','search'])$(id).addEventListener('input',draw);
draw();
})();
