/* Read-only gallery. No storage, game state or observation calls. */
(function(){
'use strict';
const api=globalThis.ATLAS_DIMORPHISM_LAB,$=id=>document.getElementById(id);
const added=new Set(['af_leon','af_mandril','af_babuino_hamadryas','af_gelada','asia_esp_0294','asia_esp_0864','asia_esp_0865','af_avestruz']);
const traits={antlers:'Astas; cuello y proporciones',reindeer:'Astas en ambos sexos; desarrollo y cuello',ibex:'Cuernos, barba y proporciones',gazelle:'Cuernos y garganta del macho',blackbuck:'Cuernos espiralados y pelaje adulto',mane:'Melena del macho adulto; leona sin melena',face:'Relieves y coloración facial adulta',mantle:'Manto del macho adulto; proporciones',monal:'Plumaje, cresta y patrones propios de cada taxón',tragopan:'Plumaje moteado y cara; sin órganos de cortejo desplegados',ostrich:'Macho negro y blanco; hembra gris parda',peafowl:'Tren ornamental del macho y cuello verde de la hembra',mandarinduck:'Velas alares del macho; anillo ocular de la hembra',pheasant:'Plumaje, cola y ornamentación específica',capercaillie:'Cola, plumaje y marcas de la hembra',shoveler:'Cabeza, pecho y plumaje moteado',finch:'Cabeza y pecho; bandas alares compartidas',bullfinch:'Pecho rosado o pardo; capucha negra compartida',blackbird:'Plumaje, pico y pecho',oriole:'Plumaje amarillo negro o verdoso'};
const norm=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const rows=Object.entries(api.SEXUAL_DIMORPHISM).map(([id,config])=>{const sp=api.SPECIES[id],m=ATLAS_MAMMAL_ART_V3194.classify(sp,id),b=ATLAS_BIRD_ART_V3193.classify(sp);const male=api.getSpriteMarkup(id,'normal','male'),female=api.getSpriteMarkup(id,'normal','female');return {id,sp,config,family:m||b||'reptile',group:m?'Mamíferos':b?'Aves':'Reptiles',male,female,problem:male===female||/NaN|undefined/.test(male+female)};});
function draw(){
 document.documentElement.style.setProperty('--size',$('size').value+'px');document.body.classList.toggle('silhouette',$('view').value==='silhouette');
 $('counts').textContent=`Previamente configuradas: ${rows.length-added.size} · Nuevas: ${added.size} · Total: ${rows.length} · Problemas detectados: ${rows.filter(r=>r.problem).length}`;
 $('gallery').replaceChildren();
 for(const group of ['Mamíferos','Aves','Reptiles']){
 const selected=rows.filter(r=>r.group===group&&($('origin').value==='all'||added.has(r.id)===($('origin').value==='new'))&&norm(r.sp.name+' '+r.sp.latin).includes(norm($('search').value)));if(!selected.length)continue;
 const heading=document.createElement('h2');heading.textContent=group;const grid=document.createElement('section');grid.className='grid';$('gallery').append(heading,grid);
 for(const row of selected){const card=document.createElement('article');card.className='card';card.dataset.speciesId=row.id;
 const h=document.createElement('h3');h.textContent=row.sp.name;const latin=document.createElement('p');latin.className='latin';latin.textContent=row.sp.latin;
 const pair=document.createElement('div');pair.className='pair';for(const [title,svg]of [['Macho',row.male],['Hembra',row.female]]){const fig=document.createElement('figure');fig.innerHTML=svg;const caption=document.createElement('figcaption');caption.textContent=title;fig.append(caption);pair.append(fig);}
 const meta=document.createElement('p');meta.className='meta';meta.textContent=`${added.has(row.id)?'Nueva':'Previamente configurada'} · ${row.family} · ${row.problem?'Pendiente: revisar SVG':'Implementada; control visual disponible'} · ${traits[row.config.type]}`;
 card.append(h,latin,pair,meta);grid.append(card);}
 }
}
for(const id of ['size','view','origin','search'])$(id).addEventListener('input',draw);draw();
})();
