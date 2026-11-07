(function(){
'use strict';
const before=globalThis.ATLAS_POLISH_BEFORE,after=globalThis.ATLAS_POLISH_CURRENT,$=id=>document.getElementById(id),mammal=globalThis.ATLAS_MAMMAL_ART_V3194,fish=globalThis.ATLAS_FISH_ART_V3191;
const fold=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const notes={mammals:['Miembros, apoyos y transiciones de torso/cabeza de construcción desigual.','Curvas de contorno y miembros volumétricos articulados; perfiles y rasgos de taxón conservados.'],fish:['Aletas triangulares y perfiles compartidos en el motor histórico integrado.','Perfiles por especie, bases de aletas continuas, opérculos o branquias y caudales apropiadas.'],legendary:['Acabado desigual entre las doce láminas individuales.','Posturas exclusivas refinadas, proporciones y estructuras zoológicas integradas.'],relicts:['Geometría esquemática y rasgos especializados insuficientes.','Láminas especializadas: anatomía del linaje, contorno continuo y detalle contenido.']};
const relictFamilies={"coelacanth_indic": "Latimeriidae", "atlas_lion": "Felidae", "seychelles_sheathbat": "Emballonuridae", "gabon_dwarf_croc": "Crocodylidae", "angonoka": "Testudinidae", "african_lungfish": "Protopteridae", "white_sturgeon": "Acipenseridae", "gharial": "Gavialidae", "olm_balkans": "Proteidae"},legendFamilies={"silverback": "Hominidae", "ambar": "Felidae", "niebla": "Felidae", "fenrir": "Canidae", "atlas": "Elephantidae", "centinela": "Accipitridae", "basalto": "Varanidae", "seda": "Elapidae", "junco": "Crocodylidae", "ancora": "Testudinidae", "ascua": "Canidae", "remonte": "Salmonidae"};
const rows=[];
for(const [id,sp]of Object.entries(after.SPECIES)){
 const family=mammal.classify(sp,id);
 if(family)rows.push({id,name:sp.name,latin:sp.latin,group:'mammals',family:mammal.families[family],morph:family,sex:!!after.SEXUAL_DIMORPHISM[id]});
 else if(fish.classify?.(sp))rows.push({id,name:sp.name,latin:sp.latin,group:'fish',family:fish.classify(sp)});
}
for(const l of after.LEGENDARY_SPECIMENS){const sp=after.SPECIES[l.speciesId];rows.push({id:l.id,speciesId:l.speciesId,name:l.name+' — '+sp.name,latin:sp.latin,group:'legendary',family:legendFamilies[l.id]});}
for(const r of after.MUSEUM_RELICTS)rows.push({id:r.id,name:r.name,latin:r.latin,group:'relicts',family:relictFamilies[r.id]});
let page=0;const pageSize=24;
function sprite(api,row){return row.group==='relicts'?api.museumCardArt('relict',row.id):api.getSpriteMarkup(row.speciesId||row.id,row.group==='legendary'?'legendario':$('skin').value,row.sex?$('sex').value:null);}
function namespace(svg,prefix){return svg.replace(/(\s)id="([^"]+)"/g,(_,space,id)=>space+'id="'+prefix+id+'"').replace(/url\(#([^\)]+)\)/g,(_,id)=>'url(#'+prefix+id+')').replace(/(?:xlink:)?href="#([^"]+)"/g,(_,id)=>'href="#'+prefix+id+'"');}
function families(){const selected=$('family').value;$('family').replaceChildren(new Option('Todas',''));for(const f of [...new Set(rows.filter(r=>r.group===$('group').value).map(r=>r.family))].sort())$('family').add(new Option(f,f));if([...$('family').options].some(o=>o.value===selected))$('family').value=selected;}
function render(){
 $('sex').disabled=$('group').value!=='mammals';$('skin').disabled=['legendary','relicts'].includes($('group').value);
 const selected=rows.filter(r=>r.group===$('group').value&&(!$('family').value||r.family===$('family').value)&&fold(r.name+' '+r.latin+' '+r.id).includes(fold($('search').value)));
 page=Math.max(0,Math.min(page,Math.ceil(selected.length/pageSize)-1));
 $('count').textContent=selected.length+' láminas · 269 mamíferos, 18 peces y rayas, 12 Legendarios y 9 relictos · instantánea anterior: v3.19.8';
 $('page').textContent='Página '+(page+1)+' / '+Math.max(1,Math.ceil(selected.length/pageSize));$('previous').disabled=page===0;$('next').disabled=(page+1)*pageSize>=selected.length;
 $('gallery').style.setProperty('--sprite-size',$('size').value+'px');$('gallery').classList.toggle('dark',$('background').value==='dark');$('gallery').classList.toggle('silhouette',$('silhouette').checked);$('gallery').classList.toggle('only-after',!$('compare').checked);$('gallery').replaceChildren();
 for(const row of selected.slice(page*pageSize,(page+1)*pageSize)){
  const card=document.createElement('article');card.dataset.id=row.id;const old=sprite(before,row),current=sprite(after,row),geometry=svg=>[...svg.matchAll(/\b(?:d|points|cx|cy|rx|ry|r|transform)="([^"]*)"/g)].map(m=>m[0]).join('|'),changed=geometry(old)!==geometry(current);
  const pair=document.createElement('div');pair.className='pair';pair.innerHTML='<figure class="before"><div class="drawing">'+namespace(old,'before-'+row.id+'-')+'</div><figcaption>Antes · 3.19.8</figcaption></figure><figure class="after"><div class="drawing">'+namespace(current,'after-'+row.id+'-')+'</div><figcaption>Refinado · 3.19.9</figcaption></figure>';
  const name=document.createElement('h2');name.textContent=row.name;const label=document.createElement('div');label.className='family';label.textContent=row.latin+' · '+row.family+(row.sex?' · dimorfismo':'');const id=document.createElement('code');id.textContent=row.id;
  const state=document.createElement('div');state.className='state';state.textContent=changed?'Cambio de construcción SVG':'Sin cambio geométrico detectado';
  const detail=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Registro artístico';detail.append(summary);
  const audit=globalThis.ATLAS_POLISH_REVIEW.get(row.id);
  for(const [index,title] of ['Estado anterior','Problema','Corrección','Resultado inspeccionado'].entries()){const p=document.createElement('p');p.textContent=title+': '+audit[index];detail.append(p);}
  card.append(pair,name,label,id,state,detail);$('gallery').append(card);
 }
}
for(const id of ['search','family','size','sex','skin','background','silhouette','compare'])$(id).addEventListener('input',()=>{if(id==='search'||id==='family')page=0;render();});$('group').addEventListener('input',()=>{page=0;families();render();});$('previous').addEventListener('click',()=>{page--;render();});$('next').addEventListener('click',()=>{page++;render();});
families();render();
globalThis.ATLAS_POLISH_LAB={rows,sprite};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
