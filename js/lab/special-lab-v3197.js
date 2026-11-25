(function(){
'use strict';
const api=ATLAS_DIMORPHISM_LAB,$=id=>document.getElementById(id);
const fold=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
// Reuse the Atlas's zoological engines as the group authority.
const group=sp=>{
 const svg=api.getSpriteMarkup(Object.keys(api.SPECIES).find(id=>api.SPECIES[id]===sp));
 if(/data-mammal/.test(svg))return 'Mamíferos';if(/data-bird/.test(svg))return 'Aves';
 if(/data-herp/.test(svg))return /frog|toad|salamander|newt/.test(sp.kind)?'Anfibios':'Reptiles';
 return /fish|shark|ray|eel|salmon|trout|sturgeon/.test(sp.kind)?'Peces':'Otros';
};
const ids=Object.keys(api.SPECIES).filter(id=>api.SPECIMEN_CATEGORIES[id].length).sort((a,b)=>api.SPECIES[a].name.localeCompare(api.SPECIES[b].name,'es'));
const groups=Object.fromEntries(ids.map(id=>[id,group(api.SPECIES[id])]));
$('group').innerHTML+=[...new Set(Object.values(groups))].sort().map(g=>`<option>${g}</option>`).join('');
$('simSpecies').innerHTML=ids.map(id=>`<option value="${id}">${api.SPECIES[id].name}</option>`).join('');$('simSpecies').value='zorro_rojo';
function render(){
 document.documentElement.style.setProperty('--plate-size',$('size').value+'px');
 const cards=[];
 for(const id of ids){const sp=api.SPECIES[id],l=api.legendaryForSpecies(id);
  if($('legendaryOnly').checked&&!l||$('group').value&&groups[id]!==$('group').value)continue;
  if(!fold(sp.name+' '+sp.latin+' '+(l?.name||'')).includes(fold($('search').value)))continue;
  for(const c of api.SPECIMEN_CATEGORIES[id]){
   if($('category').value&&$('category').value!==c)continue;
   let svg=api.getSpriteMarkup(id,api.SPECIMEN_LEVELS[c].skin);
   if(!$('halos').checked)svg=svg.replace(/<g data-specimen-halo="[^"]*"[\s\S]*?<\/g>/,'');
   cards.push(`<article class="specimen-card" data-category="${c}" data-species="${id}"><div class="meta">${groups[id]} · ${c}</div><h3>${c==='Legendario'?l.name+' — ':''}${sp.name}</h3><div class="pair">${$('compare').checked?`<figure>${api.getSpriteMarkup(id)}<figcaption>Normal</figcaption></figure>`:''}<figure>${svg}<figcaption>${c}</figcaption></figure></div><p class="meta">${sp.latin}</p>${c==='Legendario'?`<p>${l.description}</p><p class="meta">ID permanente: ${l.id} · una aparición por partida</p>`:''}</article>`);
  }
 }
 $('gallery').innerHTML=cards.join('');
 $('counts').textContent=Object.keys(api.SPECIMEN_LEVELS).map(c=>c+': '+ids.filter(id=>api.SPECIMEN_CATEGORIES[id].includes(c)).length+' fichas').join(' · ')+' · '+api.LEGENDARY_SPECIMENS.length+' individuos legendarios · '+cards.length+' láminas visibles';
}
for(const id of ['search','category','group','size','legendaryOnly','halos','compare'])$(id).addEventListener('input',render);
$('technical').innerHTML='<table><thead><tr><th>Especie</th><th>Notable</th><th>Épico</th><th>Excepcional</th><th>Legendario</th><th>Albino / Melánico</th></tr></thead><tbody>'+ids.map(id=>{const sp=api.SPECIES[id],rates=api.specimenRates(id);return '<tr><td>'+sp.name+'</td>'+Object.keys(api.SPECIMEN_LEVELS).map(c=>'<td>'+(rates[c]?(rates[c]*100).toFixed(3)+' %':'—')+'</td>').join('')+'<td>'+['Albino','Melánico'].map(c=>sp.special.includes(c)?(.01/sp.special.length*100).toFixed(3)+' %':'—').join(' / ')+'</td></tr>';}).join('')+'</tbody></table>';
$('simulate').addEventListener('click',async()=>{
 $('simulate').disabled=true;
 const n=Math.max(1,Math.min(5000000,Math.floor(Number($('observations').value)||1))),id=$('simSpecies').value;
 let seed=Number($('seed').value)>>>0;const rng=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
 const snapshot={upgrades:{ethology:Number($('ethology').value)},legendaryFound:{}},independent=Object.fromEntries(Object.keys(api.SPECIMEN_LEVELS).map(c=>[c,0])),unique={...independent},pigments={Albino:0,'Melánico':0};
 for(let i=0;i<n;i++){
  if(i%10000===0){$('result').textContent='Simulando… '+Math.round(i/n*100)+' %';await new Promise(resolve=>setTimeout(resolve,0));}
  const r=api.rollSpecimen(id,{upgrades:snapshot.upgrades},rng);if(r.category)independent[r.category]++;if(r.pigment)pigments[r.pigment]++;
  const once=api.rollSpecimen(id,snapshot,rng);if(once.category)unique[once.category]++;
  if(once.category==='Legendario')snapshot.legendaryFound[api.legendaryForSpecies(id).id]=true;
 }
 const frequency=Math.max(.00001,Math.min(1,Number($('frequency').value)/100||.00001));
 const lines=Object.entries(api.specimenRates(id,snapshot.upgrades.ethology)).map(([c,p])=>`${c}: ${independent[c]} (esperado ${(n*p).toFixed(1)}); partida única: ${unique[c]}. Por búsqueda manual base: ${(p*frequency*.5*100).toFixed(6)} %; automática base: ${(p*frequency*.38*100).toFixed(6)} %.`);
 $('simulate').disabled=false;
 $('result').textContent=`${n.toLocaleString('es')} observaciones elegibles de ${api.SPECIES[id].name}\n`+lines.join('\n')+'\nPigmentaciones: '+JSON.stringify(pigments)+'\nSin cambios en el progreso. La frecuencia regional, el censo, las mejoras y los cupos condicionan el tiempo real.';
});
render();
})();
