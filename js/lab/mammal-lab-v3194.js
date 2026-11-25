/* Standalone mammal review, using the production art and final palette passes. No storage. */
(function(){
'use strict';
const $=id=>document.getElementById(id),art=globalThis.ATLAS_MAMMAL_ART_V3194,api=globalThis.ATLAS_MAMMAL_LAB;
if(!art||!api){$('status').textContent='No se pudieron cargar los mamíferos. Recarga la página.';return;}
const families=Object.entries(art.families),norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const rows=Object.entries(api.SPECIES).map(([id,sp])=>({id,sp,family:art.classify(sp,id)}));
for(const [id,title] of families){const o=document.createElement('option');o.value=id;o.textContent=title;$('family').append(o);}
const comparisons={
 'wolf-fox':['Lobo / zorro',['lobo_gris','zorro_rojo']],
 'tiger-leopard':['Tigre / leopardo',['asia_esp_0402','af_leopardo']],
 'hare-rabbit':['Liebre / conejo',['liebre_europea','conejo_europeo']],
 'moose-deer':['Alce / ciervo',['alce','ciervo_rojo']],
 'bison-buffalo':['Bisonte / búfalo',['bisonte_europeo','af_bufalo_cafre']],
 'leopard-cheetah':['Leopardo / guepardo',['af_leopardo','af_guepardo']],
 'otter-sealion':['Nutria / lobo marino',['nutria_europea','af_lobo_marino_cabo']],
 'horse-tapir':['Caballo / tapir',['asia_esp_0184','asia_esp_0498']],
 'rhinos':['Rinoceronte blanco / negro',['af_rinoceronte_blanco','af_xlsx_rinoceronte_negro']],
 'gorilla-chimp':['Gorila / chimpancé',['af_gorila_occidental','af_chimpance']]
};
for(const [id,[name]] of Object.entries(comparisons)){const o=document.createElement('option');o.value=id;o.textContent=name;$('similar').append(o);}
const hasSkin=(sp,skin)=>skin==='normal'||sp.special.some(v=>skin==='albino'?/albin|leuc/i.test(v):skin==='melanico'?/mel[aá]nic/i.test(v):/notable|alfa/i.test(v));
function figure(svg,caption,old){const fig=document.createElement('figure');fig.className='figure'+(old?' before':'');const d=document.createElement('div');d.className='art';d.innerHTML=svg||'';const label=document.createElement('figcaption');label.textContent=caption;fig.append(d,label);return fig;}
function draw(){
 $('gallery').replaceChildren();let count=0,groups=0,missing=0;const skin=$('skin').value,sex=$('sex').value||null,query=norm($('search').value),pair=comparisons[$('similar').value]?.[1];
 for(const [family,title] of families){
  if($('family').value&&$('family').value!==family)continue;
  const items=rows.filter(row=>row.family===family&&(!pair||pair.includes(row.id))&&hasSkin(row.sp,skin)&&(!sex||api.SEXUAL_DIMORPHISM[row.id])&&norm(row.sp.name+' '+row.sp.latin).includes(query));if(!items.length)continue;
  groups++;const heading=document.createElement('h2');heading.className='group';heading.textContent=title;const n=document.createElement('small');n.textContent=items.length+' '+(items.length===1?'mamífero':'mamíferos');heading.append(n);const grid=document.createElement('section');grid.className='grid';grid.setAttribute('aria-label',title);$('gallery').append(heading,grid);
  for(const {id,sp} of items){count++;const card=document.createElement('article');card.className='card';card.dataset.speciesId=id;
   const svg=api.after(id,skin,sex),specialized=!!svg&&svg.includes('data-mammal-version="3.19.4"');if(!specialized)missing++;
   const figures=document.createElement('div');figures.className='figures';figures.append(figure(api.before(id,skin,sex),'Antes · 3.19.3',true),figure(svg,'Actual · 3.19.4',false));
   const name=document.createElement('h3');name.textContent=sp.name;const latin=document.createElement('p');latin.textContent=sp.latin;const tag=document.createElement('div');tag.className='family-tag';tag.textContent=title+' · '+family+(specialized?'':' · sin ilustración especializada');const variants=document.createElement('div');variants.className='variants';variants.textContent=[...new Set(sp.special.map(v=>/leuc/i.test(v)?'Albino':/mel[aá]nic/i.test(v)?'Melánico':v))].join(' · ')+(api.SEXUAL_DIMORPHISM[id]?' · ♂ / ♀':'');card.append(figures,name,latin,tag,variants);grid.append(card);
  }
 }
 $('status').textContent=count+' de '+rows.length+' mamíferos · '+groups+' familias visuales · '+missing+' sin ilustración especializada · '+$('size').value+' × '+$('size').value+' px'+(skin!=='normal'?' · solo variantes ya configuradas':'');
 if(!count){const p=document.createElement('p');p.textContent='No hay mamíferos con estos filtros.';$('gallery').append(p);}
}
$('size').onchange=()=>{document.documentElement.style.setProperty('--sprite-size',$('size').value+'px');draw();};
$('skin').onchange=()=>{if($('skin').value!=='normal')$('sex').value='';$('sex').disabled=$('skin').value!=='normal';draw();};
$('similar').onchange=()=>{$('family').value='';$('search').value='';draw();};
$('sex').onchange=$('family').onchange=draw;$('search').oninput=draw;
$('compact').onchange=()=>document.body.classList.toggle('compact',$('compact').checked);
$('compare').onchange=()=>document.body.classList.toggle('compare',$('compare').checked);
$('silhouette').onchange=()=>document.body.classList.toggle('silhouette',$('silhouette').checked);
draw();
})();
