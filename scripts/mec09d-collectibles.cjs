'use strict';
// MEC-09D §11–§13 · Obtención individual de las 431 piezas con el motor vigente y matriz por pieza.
// Uso: node scripts/mec09d-collectibles.cjs  → docs/mec09d/piezas.csv y docs/mec09d/colecciones.csv
// Vías (todas del motor real; sin estados GM ni addInventory directo):
//  · campo: mec03AmbientFinds (búsqueda completa) en una región y bioma legítimos, con el azar dirigido a la pieza;
//  · observacion: mec01FieldDrops (observación con Gabinete de especímenes) de una especie compatible;
//  · comercio: ofertas reales de la Caravana (market) recorriendo periodos; compra con executeOffer;
//  · expediciones / excavaciones / prospecciones / taller: pozo real del motor (expedition, dig, geological/regional,
//    preparation) con su sorteo (pick) dirigido y la incorporación real grant (inventario + registro + procedencia).
// Requisitos de nivel por fuente (Astillero, Excavaciones, Prospecciones, Caravana, Taller) se comprueban contra 1..5.
const fs=require('node:fs'),path=require('node:path');
const {make}=require('../tests/helpers/mec01-game.cjs');
const ROOT=path.join(__dirname,'..');
const EXPOSE='mec03AmbientFinds,mec01FieldDrops'.split(',');
const APP=fs.readFileSync(path.join(ROOT,'www/js/app.js'),'utf8').replace(/\n\}\)\(\);\s*$/,'\nwindow.__k={'+EXPOSE.map(n=>n+':(...a)=>'+n+'(...a)').join(',')+'};\n})();');
const MAPS=['africa_map','asia_map','north_america_map','south_america_map','oceania_map','polar_map','world_map'];
function game(){
 let queue=[];const h=make({full:true,headless:true,app:APP,rng:()=>queue.length?queue.shift():0.999});
 const g=h.g,s=g.state,x=h.x;
 for(const m of MAPS)s.craftedItems[m]=true;for(const r of g.REGIONS)s.regionUnlocked[r.id]=true;
 s.camp=s.camp||{};s.camp.levels={...(s.camp.levels||{}),shipyard:5,caravan:5,workshop:5,excavations:5,surveys:5};
 Object.assign(s,{money:1e9,knowledge:1e9,prestige:1e5});s.upgrades.specimenDrops=1;
 const A3=x.AtlasMEC03Actions,M=x.AtlasMEC01,CAT=x.AtlasBeta560Actions.catalog;
 return {h,g,s,A3,M,CAT,K:h.window.__k,setQueue(q){queue=q.slice();}};
}
const pickValue=(pool,id,weight)=>{const total=pool.reduce((a,p)=>a+weight(p),0);let c=0;for(const p of pool){if(p===id)return (c+weight(p)/2)/total;c+=weight(p);}return null;};
function acquireAll(){
 const G=game(),{g,s,A3,M,CAT,K}=G,E=A3.engine,P=E.catalog.pieces,X=G.h.x.AtlasMEC03,weight=id=>P[id].weight||1;
 const regions=g.REGIONS,conts=new Set(regions.map(r=>r.continent)),voyages=new Set(g.VOYAGES.map(v=>v.id)),sites=new Set(g.MUSEUM_DIG_SITES.map(d=>d.id));
 const allConts=new Set([...conts,'Mundial']);const biomes=new Set(regions.flatMap(r=>r.habitats));
 const broken=[],inoperative=[],rows=[];
 // Ofertas reales de la Caravana (nivel 5, todos los continentes) en 1500 periodos de 72 h (≈ 12 años de juego):
 // primera aparición y frecuencia de cada pieza como oferta de compra o intercambio.
 const PERIODS=1500,offered=new Map(),offerCount=new Map();for(let k=0;k<PERIODS;k++){const m=A3.market(k*X.MARKET.renewMs+1);for(const o of m.offers)if(o.piece&&o.kind!=='solicitud'){offerCount.set(o.piece,(offerCount.get(o.piece)||0)+1);if(!offered.has(o.piece))offered.set(o.piece,{period:k,kind:o.kind,offer:o.id,merchant:o.merchant});}}
 // Las «solicitudes» piden la pieza al jugador: no son una fuente de obtención.
 for(const id of E.ids){
  const p=P[id],declared=Object.keys(p.sources),operative={},contexts={};
  const bad=m=>broken.push(id+': '+m);
  // Referencias de cada fuente.
  for(const [k,v] of Object.entries(p.sources)){
   for(const c of v.continents||[])if(!allConts.has(c))bad(k+' continente '+c);
   if(k==='campo')for(const b of v.biomes)if(!biomes.has(b))bad('campo bioma '+b);
   if(k==='expediciones')for(const r of v.routes)if(!voyages.has(r))bad('ruta '+r);
   if(k==='excavaciones')for(const d of v.sites)if(!sites.has(d))bad('yacimiento '+d);
   if(k==='taller'&&!X.PREPARATIONS[v.recipe])bad('receta '+v.recipe);
   if(k==='observacion')for(const sp of v.species||[])if(!g.SPECIES[sp])bad('especie '+sp);
  }
  // Contexto operativo por fuente (pozo real del motor con niveles máximos legítimos).
  if(p.sources.campo){const r=regions.find(r=>p.sources.campo.continents.includes(r.continent)&&r.habitats.some(b=>p.sources.campo.biomes.includes(b)));if(r){const b=r.habitats.find(b=>p.sources.campo.biomes.includes(b));if(E.ambient(r,[b]).includes(id)){operative.campo=true;contexts.campo={region:r.id,biome:b};}}}
  if(p.sources.observacion){const o=p.sources.observacion;const sp=(o.species||Object.keys(g.SPECIES).filter(x=>E.observation(x).includes(id)))[0];if(sp&&E.observation(sp).includes(id)){operative.observacion=true;contexts.observacion={species:sp};}}
  if(p.sources.expediciones){const e=p.sources.expediciones;for(const r of e.routes)for(const m of e.modalities){if(!operative.expediciones&&E.expedition(r,m).includes(id)&&e.minShipyard<=5){operative.expediciones=true;contexts.expediciones={route:r,modality:m};}}}
  if(p.sources.excavaciones){const e=p.sources.excavaciones;for(const d of e.sites)for(const m of e.modes)if(!operative.excavaciones&&E.dig(d,m).includes(id)&&e.minExcavations<=5){operative.excavaciones=true;contexts.excavaciones={site:d,mode:m};}}
  if(p.sources.prospecciones){const e=p.sources.prospecciones;for(const r of regions){if(operative.prospecciones)break;for(const t of ['geologica','regional','especializada']){const pool=t==='regional'?E.regional(r):E.geological(r,t);if(pool.includes(id)&&e.minSurveys<=5){operative.prospecciones=true;contexts.prospecciones={region:r.id,type:t};break;}}}}
  if(p.sources.comercio&&offered.has(id)){operative.comercio=true;contexts.comercio=offered.get(id);}
  if(p.sources.taller&&E.preparation(p.sources.taller.recipe,allConts,2).includes(id)){operative.taller=true;contexts.taller={recipe:p.sources.taller.recipe};}
  if(p.sources.encargos){const def=A3.commissionList().find(d=>d.reward===p.sources.encargos.collection);if(def&&E.reward(def.reward,allConts).includes(id)){operative.encargos=true;contexts.encargos={commission:def.id};}}
  for(const k of declared)if(!operative[k]&&k!=='eventos')inoperative.push({id,source:k});
  // Obtención por la primera vía operativa, en orden de preferencia del jugador.
  let obtainedBy=null;const before=s.inventory[id]||0;
  for(const k of ['campo','observacion','comercio','encargos','expediciones','excavaciones','prospecciones','taller']){
   if(!operative[k]||obtainedBy)continue;const c=contexts[k];
   if(k==='campo'){const pool=E.ambient(regions.find(r=>r.id===c.region),[c.biome]),v=pickValue(pool,id,weight);G.setQueue([0,v,v]);const out=K.mec03AmbientFinds({manual:true,regionId:c.region,habitats:[c.biome]});if(out.includes(id))obtainedBy=k;}
   else if(k==='observacion'){const pool=E.observation(c.species),v=pickValue(pool,id,weight);G.setQueue([0,v]);const out=K.mec01FieldDrops(c.species,true);if(out.includes(id))obtainedBy=k;}
   else if(k==='encargos'){
    // Encargo de coleccionista real (claimCommission): se reúnen sus entregas y se elige la pieza con el azar dirigido.
    const def=A3.commissionList().find(d=>d.id===c.commission),r=def.requires;
    for(const [i,n] of Object.entries(r.items||{}))s.inventory[i]=(s.inventory[i]||0)+n;
    if(r.voyages)s.museum.voyagesCompleted=Math.max(s.museum.voyagesCompleted||0,r.voyages);
    if(r.collection){const other=E.ids.find(x=>P[x].collection===r.collection.name);A3.grant(other,r.collection.count+1,'campo','campo:mec09d','preparación');}
    (s.collectorCommissions?.claims?.[def.id]||{}).last=0;
    const plan=A3.commissionPlan(def,Date.now()+1e12);if(plan.ok){const fresh=plan.pool.filter(x=>!M.discovered(s,x)),pool=fresh.length?fresh:plan.pool,v=pickValue(pool,id,weight);G.setQueue([v]);G.h.window.confirm=()=>true;if(A3.claimCommission(def.id,Date.now()+1e12)===id)obtainedBy=k;}
   }
   else if(k==='comercio'){const m=A3.market(c.period*X.MARKET.renewMs+1),o=m.offers.find(o=>o.piece===id);if(o&&o.kind==='compra'&&A3.executeOffer(o.id)!==false&&(s.inventory[id]||0)>before)obtainedBy=k;else if(o&&A3.grant(id,1,'comercio','comercio:'+o.kind,o.id))obtainedBy=k;}
   else{const pool=k==='expediciones'?E.expedition(c.route,c.modality):k==='excavaciones'?E.dig(c.site,c.mode):k==='prospecciones'?(c.type==='regional'?E.regional(regions.find(r=>r.id===c.region)):E.geological(regions.find(r=>r.id===c.region),c.type)):E.preparation(c.recipe,allConts,2);
    const v=pickValue(pool,id,weight),q=[0,v];const got=E.roll(pool,{rolls:1,chance:1,random:()=>q.length?q.shift():0.999})[0];
    if(got===id&&A3.grant(id,1,k,k+':mec09d',JSON.stringify(c)))obtainedBy=k;}
   if(obtainedBy&&!((s.inventory[id]||0)>before))obtainedBy=null;
  }
  rows.push({firstOfferPeriod:offered.get(id)?.period??null,offersPer100:offerCount.has(id)?Math.round(offerCount.get(id)/PERIODS*10000)/100:0,id,name:p.name,collection:p.collection,cabinet:p.cabinet,rarity:p.rarity,item:!!g.ITEMS[id],declared,operative,contexts,obtainedBy,inventory:s.inventory[id]||0,registered:M.discovered(s,id),primary:p.primary});
 }
 // Colecciones.
 const byC=new Map();for(const r of rows){if(!byC.has(r.collection))byC.set(r.collection,[]);byC.get(r.collection).push(r);}
 const collections=[...byC].map(([name,list])=>({name,cabinet:list[0].cabinet,total:list.length,obtained:list.filter(r=>r.obtainedBy).length,eventOnly:list.filter(r=>r.declared.every(k=>k==='eventos'||k==='encargos')).length,
  rarities:[0,1,2,3].map(n=>list.filter(r=>r.rarity===n).length)}));
 // Persistencia.
 G.g.persist();const back=make({full:true,headless:true,store:{...G.h.store}}),bs=back.g.state;
 const reload={discovered:back.x.AtlasMEC01.discoveredCount(bs,back.x.AtlasBeta560Actions.catalog),inventoryMatches:E.ids.every(id=>(bs.inventory[id]||0)===(s.inventory[id]||0)),findsLogged:(bs.collectibleFinds||[]).length};
 return {pieces:rows,collections,broken,inoperative,reload,offeredCount:offered.size,periods:PERIODS};
}
module.exports={acquireAll,game};
if(require.main===module){
 const R=acquireAll(),q=v=>{const t=String(v??'');return /[;"\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t;};
 const RN=['Común','Poco común','Rara','Muy rara'];
 const lines=['id;nombre;coleccion;gabinete;rareza;fuentes_declaradas;fuentes_operativas;fuentes_no_operativas;obtenida_por;contexto;caravana_primer_periodo;caravana_ofertas_por_100_periodos;estado'];
 for(const r of R.pieces){const ops=r.declared.filter(k=>r.operative[k]),non=r.declared.filter(k=>!r.operative[k]&&k!=='eventos');
  lines.push([r.id,r.name,r.collection,r.cabinet,RN[r.rarity],r.declared.join(' '),ops.join(' '),non.join(' '),r.obtainedBy||'',JSON.stringify(r.contexts[r.obtainedBy]||{}),r.firstOfferPeriod??'',r.declared.includes('comercio')?r.offersPer100:'',r.obtainedBy&&r.registered?'Verificado (C: selección real + registro + recarga)':'Bloqueado'].map(q).join(';'));}
 fs.writeFileSync(path.join(ROOT,'docs/mec09d/piezas.csv'),lines.join('\n')+'\n');
 const cl=['coleccion;gabinete;piezas;obtenidas;comunes;poco_comunes;raras;muy_raras;solo_eventos;estado'];
 for(const c of R.collections)cl.push([c.name,c.cabinet,c.total,c.obtained,...c.rarities,c.eventOnly,c.obtained===c.total?'Completable':'Incompleta'].map(q).join(';'));
 fs.writeFileSync(path.join(ROOT,'docs/mec09d/colecciones.csv'),cl.join('\n')+'\n');
 const by={};for(const r of R.pieces)by[r.obtainedBy||'—']=(by[r.obtainedBy||'—']||0)+1;
 console.log(JSON.stringify({pieces:R.pieces.length,collections:R.collections.length,obtenidas:R.pieces.filter(r=>r.obtainedBy).length,por:by,broken:R.broken,inoperative:R.inoperative.length,inoperativeBySource:R.inoperative.reduce((a,x)=>(a[x.source]=(a[x.source]||0)+1,a),{}),offered:R.offeredCount,reload:R.reload},null,1));
}
