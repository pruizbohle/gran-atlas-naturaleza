/* El Gran Atlas · V5.6.3 Beta — MEC-03 · obtención híbrida de coleccionables.
 * Lógica pura (sin DOM): pozos por fuente a partir de AtlasMEC03Catalog, tiradas,
 * protección de unidades, intercambios, ofertas rotativas de la Caravana, encargos de
 * coleccionistas, prospecciones, preparaciones del Taller y eventos (inactivos).
 * Todo costo, tiempo, probabilidad o proporción es PROVISIONAL. Ver docs/mec03/README.md. */
(function(root){'use strict';
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>{const n=Math.floor(Number(v));return Number.isFinite(n)&&n>0?n:0;};
const BIRDS=new Set(['stork','forestbird','songbird','raptor','seabird','owl','wader','pelican','heron','swan','kingfisher','ostrich','emperor','petrel','gull','adelie','eider','skua','tern','king_penguin','albatross','rockhopper','frigatebird','gannet','chinstrap','gentoo']);
/* Ampliación de los 8 materiales históricos a especies compatibles (además de SPECIES_DROPS,
 * que no cambia): se toma el reparto de la beta 5.6.0 y se filtra por tipo de animal. */
const HISTORIC_KINDS=Object.freeze({
 owl_feather:['raptor','owl'],heron_feather:['heron','stork','wader','pelican'],otter_whisker:['otter','mustelid'],
 antler_fragment:['deer'],animal_trace:null,wolf_tooth:['canid'],boar_tusk:['boar'],beaver_tail_scale:['beaver']
});

/* Tasas provisionales (no calibradas). */
const RATES=Object.freeze({
 ambiental:{manual:0.03,auto:0.0075},
 observacion:{manual:0.006,auto:0.0015},
 historicosAmpliados:{manual:0.005,auto:0.00125},
 expedicion:{normal:{rolls:1,chance:0.4},especializada:{rolls:2,chance:0.6},extraordinaria:{rolls:2,chance:0.5}},
 excavacion:{normal:{rolls:1,chance:0.25},profunda:{rolls:2,chance:0.35},especial:{rolls:3,chance:0.45}}
});
const VOYAGE_MODALITIES=Object.freeze({
 botanica:{label:'Expedición botánica',minLevel:2,costFactor:1.25,durationFactor:1.25,land:true,marine:false},
 reconocimiento:{label:'Reconocimiento naturalista',minLevel:2,costFactor:1.25,durationFactor:1.25,land:true,marine:true},
 oceanografica:{label:'Expedición oceanográfica',minLevel:3,costFactor:1.25,durationFactor:1.25,land:false,marine:true},
 arqueologica:{label:'Expedición arqueológica',minLevel:4,costFactor:1.5,durationFactor:1.25,land:true,marine:false},
 extraordinaria:{label:'Exploración extraordinaria',minLevel:5,costFactor:2,durationFactor:1.5,land:true,marine:true}
});
const PROSPECTIONS=Object.freeze({
 regional:{label:'Reconocimiento regional',minLevel:1,money:60,knowledge:40,seconds:1200,rolls:2,chance:0.7,knowledgeReward:30,finds:'Muestras botánicas, ambientales y hallazgos del territorio'},
 geologica:{label:'Prospección geológica',minLevel:2,money:120,knowledge:80,seconds:2400,rolls:2,chance:0.65,knowledgeReward:45,finds:'Minerales, piedras preciosas, metales, meteoritos, rocas, ámbar y fósiles menores'},
 especializada:{label:'Prospección especializada',minLevel:4,money:400,knowledge:250,seconds:5400,rolls:3,chance:0.7,knowledgeReward:90,finds:'Hallazgos geológicos de toda rareza, incluidas las piezas muy raras'}
});
const PREPARATIONS=Object.freeze({
 herbario:{label:'Preparación de herbario',minWorkshop:2,requires:{pressed_flower:4,parchment_scrap:1},collection:'Herbario del mundo'},
 madera:{label:'Muestras de madera',minWorkshop:2,requires:{carved_wood:3},collection:'Maderas del mundo'},
 pulido:{label:'Pulido de minerales',minWorkshop:3,requires:{river_pebble:4,polished_lens:1},collection:'Minerales extraordinarios'},
 reconstruccion:{label:'Reconstrucción de fragmentos',minWorkshop:3,requires:{fossil_fragment:6},collection:'Fósiles menores'},
 daguerrotipo:{label:'Procesamiento de daguerrotipos',minWorkshop:4,requires:{polished_lens:1,brass_shard:2,old_ink:1,parchment_scrap:1},collection:'Imágenes daguerrotipadas'}
});
const COMMISSIONS=Object.freeze([
 {id:'hidrografica',label:'Sociedad Hidrográfica',text:'Cartas de sonda para el registro de los siete mares.',requires:{items:{map_fragment:2,parchment_scrap:2}},reward:'Los siete mares',cooldownHours:8},
 {id:'almirantazgo',label:'Archivo del Almirantazgo',text:'Instrumental para las rutas de altura.',requires:{items:{brass_shard:3,old_ink:1}},reward:'Los siete mares',cooldownHours:8},
 {id:'cancilleria',label:'Cancillería de órdenes',text:'Una moneda repetida y una contribución para el registro de condecoraciones.',requires:{collection:{name:'Numismática',count:1},money:300},reward:'Medallas y condecoraciones históricas',cooldownHours:8},
 {id:'geografica',label:'Sociedad Geográfica',text:'Reconoce a quien vuelve de tres expediciones.',requires:{voyages:3,items:{parchment_scrap:2}},reward:'Medallas y condecoraciones históricas',cooldownHours:12},
 {id:'oologo',label:'Naturalista oólogo',text:'Dos huevos repetidos para su gabinete, a cambio de una pieza de su colección.',requires:{collection:{name:'Huevos de aves',count:2}},reward:'Arquitecturas animales',cooldownHours:8},
 {id:'jardin',label:'Jardín botánico',text:'Flores prensadas para el intercambio de semillas.',requires:{items:{pressed_flower:6}},reward:'Semillas extraordinarias',cooldownHours:8}
]);
/* Eventos: mecanismo funcional, pero los de calendario siguen desactivados hasta MEC-08.
 * Ninguna pieza depende solo de un evento (se valida en las pruebas). */
const EVENTS=Object.freeze([
 {id:'exposicion-universal',label:'Exposición de curiosidades (ejemplo)',active:false,calendar:'MEC-08',reward:'Gabinete de maravillas'}
]);
const PRICE=Object.freeze([150,500,1800,6000]);
const MARKET=Object.freeze({renewMs:24*3600e3,requestFactor:0.6,exchangeCount:[3,2,2,3]});

function seeded(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function hash(str){let h=2166136261>>>0;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}

function create(catalog,options={}){
 const P=catalog.pieces,ids=Object.keys(P),B=options.beta;
 const byCollection=new Map();for(const id of ids){const c=P[id].collection;if(!byCollection.has(c))byCollection.set(c,[]);byCollection.get(c).push(id);}
 const weight=id=>catalog.pieces[id]?.weight||1;
 function pick(list,random){
  const total=list.reduce((a,id)=>a+weight(id),0);if(!(total>0))return null;
  let r=random()*total;for(const id of list){r-=weight(id);if(r<0)return id;}return list[list.length-1];
 }
 const has=(list,x)=>Array.isArray(list)&&list.includes(x);
 // MEC-04: habitats acota el bioma de la búsqueda (manual: el seleccionado; automática: todos los de la región).
 const ambient=(region,habitats)=>!region?[]:ids.filter(id=>{const s=P[id].sources.campo,hs=(habitats||region.habitats).filter(h=>has(region.habitats,h));return s&&has(s.continents,region.continent)&&s.biomes.some(b=>hs.includes(b));});
 const regional=region=>!region?[]:ids.filter(id=>{const p=P[id],s=p.sources.prospecciones,c=p.sources.campo;
  return (s&&s.types.includes('regional')&&has(s.continents,region.continent)&&(s.biomes||[]).some(b=>has(region.habitats,b)))||(c&&has(c.continents,region.continent)&&c.biomes.some(b=>has(region.habitats,b)));});
 const geological=(region,type)=>!region?[]:ids.filter(id=>{const s=P[id].sources.prospecciones;
  if(!s||!has(s.continents,region.continent))return false;
  return type==='especializada'?s.types.some(t=>t==='geologica'||t==='especializada'):s.types.includes('geologica');});
 // Observación animal: por tipo de animal y continente de la especie (configuración por pieza).
 // Los 8 materiales históricos se amplían con el reparto de la beta filtrado por tipo de animal.
 const speciesContinents=options.speciesContinents||(()=>[]);
 const obsIds=ids.filter(id=>P[id].sources.observacion);
 const observation=new Map(),historic=new Map();
 const observationPool=sp=>{
  if(observation.has(sp))return observation.get(sp);
  const kind=options.speciesKind?.(sp),conts=speciesContinents(sp);
  const list=obsIds.filter(id=>{const o=P[id].sources.observacion;return o.species?o.species.includes(sp):o.kinds.includes(kind)&&o.continents.some(c=>conts.includes(c));});
  observation.set(sp,list);return list;
 };
 // Las 12 especies con drop histórico (SPECIES_DROPS) conservan exactamente su fuente original.
 const historicSpecies=options.historicSpecies||new Set();
 for(const [sp,list] of Object.entries(B?.bySpecies||{})){
  if(historicSpecies.has(sp))continue;
  const kind=options.speciesKind?.(sp),hist=[];
  for(const index of list){const id=B.items[index]?.[0];if(id&&Object.hasOwn(HISTORIC_KINDS,id)){const k=HISTORIC_KINDS[id];if(!k||k.includes(kind))hist.push(id);}}
  if(hist.length)historic.set(sp,hist);
 }
 const expedition=(voyageId,modality)=>ids.filter(id=>{const s=P[id].sources.expediciones;
  if(!s||!has(s.routes,voyageId))return false;
  if(modality==='normal')return s.modalities.includes('normal')||P[id].rarity===0;
  return s.modalities.includes(modality);});
 const dig=(siteId,mode)=>ids.filter(id=>{const s=P[id].sources.excavaciones;return s&&has(s.sites,siteId)&&s.modes.includes(mode);});
 const commerce=(level,continents,maxRarity)=>ids.filter(id=>{const p=P[id],s=p.sources.comercio;
  return s&&s.minCaravan<=level&&p.rarity<=maxRarity&&s.continents.some(c=>continents.has(c));});
 const preparation=(recipe,continents,maxRarity)=>ids.filter(id=>{const p=P[id];return p.sources.taller?.recipe===recipe&&p.rarity<=maxRarity&&p.continents.some(c=>continents.has(c));});
 const reward=(collection,continents)=>(byCollection.get(collection)||[]).filter(id=>P[id].continents.some(c=>continents.has(c)));
 function roll(list,{rolls=1,chance=1,random=Math.random}={}){const out=[];if(!list.length)return out;for(let i=0;i<rolls;i++){if(random()>=chance)continue;const id=pick(list,random);if(id)out.push(id);}return out;}

 /* Protección y existencias. Disponible para intercambio = en inventario − exhibidas −
  * (1 si la protección de la última unidad está activa y ninguna unidad está expuesta). */
 const prefs=state=>{state.collectionPrefs=plain(state.collectionPrefs)?state.collectionPrefs:{};if(typeof state.collectionPrefs.protectLast!=='boolean')state.collectionPrefs.protectLast=true;return state.collectionPrefs;};
 function stock(state,id,reserved){
  const owned=count(state.inventory?.[id]),exhibited=Math.min(owned,reserved(id)),available=owned-exhibited;
  const keep=prefs(state).protectLast&&owned>0&&exhibited===0?1:0;
  return {owned,exhibited,available,tradable:Math.max(0,available-keep),protected:keep};
 }
 // Selección automática de duplicados para un intercambio: misma colección o gabinete,
 // rareza mínima, nunca la pieza que se recibe ni unidades exhibidas o protegidas.
 function chooseGive(state,rule,target,reserved){
  const pool=ids.filter(id=>id!==target&&(!rule.collection||P[id].collection===rule.collection)&&(!rule.cabinet||P[id].cabinet===rule.cabinet)&&P[id].rarity>=(rule.minRarity||0));
  const units=pool.map(id=>[id,stock(state,id,reserved).tradable]).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const give={};let need=rule.count;
  for(const [id,n] of units){if(!need)break;const k=Math.min(n,need);give[id]=k;need-=k;}
  return need?null:give;
 }

 /* Ofertas de la Caravana: deterministas por (semilla, periodo, nivel) y persistentes. */
 function generateOffers({seed,period,fromLevel,toLevel,continents,state,reserved,exclude=[]}){
  const offers=[],used=new Set(exclude);
  for(let level=Math.max(2,fromLevel+1);level<=toLevel;level++){
   const rnd=seeded(hash(seed+':'+period+':'+level)),maxR=level-2;
   // Una pieza aparece en una sola oferta por periodo.
   const take=(list,n,mark=true)=>{const out=[],copy=list.filter(x=>!used.has(x));while(out.length<n&&copy.length){const id=pick(copy,rnd);out.push(id);copy.splice(copy.indexOf(id),1);if(mark)used.add(id);}return out;};
   const add=(o)=>offers.push({...o,id:'P'+period+'-'+level+'-'+offers.length,period,level,done:false});
   if(level===2){
    for(const id of take(commerce(2,continents,0),3))add({kind:'compra',merchant:'Mercader de curiosidades',piece:id,price:PRICE[0]});
    const t=take(commerce(2,continents,0),1)[0];
    if(t)add({kind:'intercambio',merchant:'Mercader de curiosidades',piece:t,give:{cabinet:P[t].cabinet,minRarity:0,count:MARKET.exchangeCount[0]}});
   }
   if(level===3){
    const conts=[...continents].filter(c=>c!=='Mundial').slice(0,8);
    for(const c of take(conts.map(x=>'#'+x),3,false).map(x=>x.slice(1))){
     // MEC-04: el comerciante vende lo que se compra en su continente, sea de allí, de
     // distribución mundial o del comercio europeo de colecciones (sources.comercio.continents).
     const local=commerce(3,new Set([c]),1);
     for(const id of take(local,2))add({kind:'compra',merchant:'Comerciante regional · '+c,continent:c,piece:id,price:PRICE[P[id].rarity]});
     const t=take(local,1)[0];if(t)add({kind:'intercambio',merchant:'Comerciante regional · '+c,continent:c,piece:t,give:{collection:P[t].collection,minRarity:P[t].rarity,count:MARKET.exchangeCount[1]}});
    }
   }
   if(level===4){
    for(const id of take(commerce(4,continents,2).filter(id=>P[id].rarity===2),2))add({kind:'compra',merchant:'Casa de subastas',piece:id,price:PRICE[2]});
    const owned=ids.filter(id=>P[id].sources.comercio&&stock(state,id,reserved).owned>0);
    for(const id of take(owned.length?owned:commerce(4,continents,2),2))add({kind:'solicitud',merchant:'Coleccionista de la Sociedad',piece:id,reward:Math.round(PRICE[P[id].rarity]*MARKET.requestFactor)});
   }
   if(level===5){
    for(const id of take(commerce(5,continents,3).filter(id=>P[id].rarity===3),1))add({kind:'compra',merchant:'Coleccionista especializado',piece:id,price:PRICE[3]});
    const t=take(commerce(5,continents,3).filter(id=>P[id].rarity===3),1)[0];
    if(t)add({kind:'intercambio',merchant:'Coleccionista especializado',piece:t,give:{cabinet:P[t].cabinet,minRarity:2,count:MARKET.exchangeCount[3]}});
   }
  }
  return offers;
 }
 return {catalog,ids,byCollection,pick,roll,ambient,regional,geological,observation:sp=>[...observationPool(sp)],historicExtra:sp=>[...(historic.get(sp)||[])],
  expedition,dig,commerce,preparation,reward,prefs,stock,chooseGive,generateOffers};
}

/* Cada pieza debe tener al menos una vía funcional que no sea un evento. */
function validate(catalog){
 const bad=[];
 for(const [id,p] of Object.entries(catalog.pieces)){const keys=Object.keys(p.sources).filter(k=>k!=='eventos');if(!keys.length)bad.push(id);}
 return bad;
}
root.AtlasMEC03=Object.freeze({version:'5.6.3-beta',build:'MEC-03',BIRDS,HISTORIC_KINDS,RATES,VOYAGE_MODALITIES,PROSPECTIONS,PREPARATIONS,COMMISSIONS,EVENTS,PRICE,MARKET,
 SOURCE_LABELS:Object.freeze({campo:'Campo · exploración ambiental',observacion:'Campo · observación animal',expediciones:'Expediciones',comercio:'Comercio (Caravana)',excavaciones:'Excavaciones',prospecciones:'Prospecciones',taller:'Taller',encargos:'Encargos de coleccionistas',eventos:'Eventos',migracion:'Migración de una partida anterior',otros:'Otra fuente'}),
 seeded,hash,create,validate});
})(typeof globalThis!=='undefined'?globalThis:window);
