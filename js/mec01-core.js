/* El Gran Atlas · V5.6.1 Beta — MEC-01 · núcleo de mecánicas.
 * Lógica pura, sin DOM: drops por canal, registro permanente de coleccionables,
 * reservas de gabinetes y libro de ingresos. Los niveles del Museo (MUSEUM_LEVELS)
 * y los hitos naturales (NATURAL_MILESTONES) viven en app.js, porque funcionan
 * también sin los datos beta.
 * Todo valor numérico marcado como «provisional» es un marcador de posición:
 * MEC-01 no calibra economía ni probabilidades. Ver docs/mec01/README.md. */
(function(root){'use strict';
const SCHEMA=1;
const RARITY_NAMES=Object.freeze(['Común','Poco común','Raro','Muy raro']);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const count=v=>{const n=Math.floor(Number(v));return Number.isFinite(n)&&n>0?n:0;};

/* ---------------------------------------------------------------------------
 * 1. Fuentes de obtención. Solo «campo» está activa en MEC-01; las demás quedan
 * declaradas para que un sistema futuro las active con configure()/resolver.
 * ------------------------------------------------------------------------- */
const SOURCES=Object.freeze({
 campo:{label:'Campo',active:true},
 expediciones:{label:'Expediciones',active:false},
 comercio:{label:'Comercio',active:false},
 excavaciones:{label:'Excavaciones',active:false},
 prospecciones:{label:'Prospecciones',active:false},
 encargos:{label:'Encargos',active:false},
 eventos:{label:'Eventos especiales',active:false}
});

/* ---------------------------------------------------------------------------
 * 2. Canales de drops. Los materiales animales históricos (SPECIES_DROPS) no se
 * configuran aquí: conservan su función original maybeSpeciesDrop, su tabla y
 * su tirada (2 % manual · 0,5 % automática), que se ejecuta siempre primero.
 * Los tres canales nuevos tiran de forma independiente entre sí y respecto del
 * histórico. Sus tasas son PROVISIONALES: reproducen en promedio la tasa que
 * cada categoría tenía en la beta 5.6.0 (tirada única de 2 % / 0,5 % y reparto
 * por peso de rareza dentro del pozo de cada especie).
 * ------------------------------------------------------------------------- */
const HISTORIC_CHANNEL=Object.freeze({id:'historicos',label:'Materiales animales históricos',
 fixed:true,rates:{campo:{manual:0.02,auto:0.005}},note:'Tabla SPECIES_DROPS y función maybeSpeciesDrop sin cambios.'});
const DEFAULT_CHANNELS=Object.freeze([
 {id:'nuevosMateriales',label:'Nuevos materiales animales',tipo:1,weights:[12,5,1.8,0.4],provisional:true,
  rates:{campo:{manual:0.002,auto:0.0005}}},
 {id:'coleccionables',label:'Coleccionables',tipo:0,weights:[12,5,1.8,0.4],provisional:true,
  rates:{campo:{manual:0.019,auto:0.00475}}},
 {id:'rarezas',label:'Rarezas y mitos',tipo:2,weights:[12,5,1.8,0.4],provisional:true,
  rates:{campo:{manual:0.0004,auto:0.0001}}}
]);

function buildCatalog(B,meta=root.AtlasBeta560Meta){
 const items=new Map(),collections=new Map(),cabinets=[];
 if(!B||!Array.isArray(B.items))return {items,collections,cabinets,pieces:[]};
 B.items.forEach((row,index)=>{
  const [id,name,tipo,gab,col,rar]=row;
  const item={id,name,tipo,cabinet:gab,collection:col,rarity:rar,index,
   collectible:tipo===0||tipo===2,continent:meta?.cont?.[id]||null,origin:meta?.origen?.[id]||null};
  items.set(id,item);
  if(item.collectible){
   if(!collections.has(col))collections.set(col,{name:col,cabinet:gab,ids:[]});
   collections.get(col).ids.push(id);
   if(!cabinets.includes(gab))cabinets.push(gab);
  }
 });
 return {items,collections,cabinets,pieces:[...items.values()].filter(i=>i.collectible).map(i=>i.id)};
}

function createDrops(B,options={}){
 const catalog=options.catalog||buildCatalog(B);
 const channels=new Map(DEFAULT_CHANNELS.map(c=>[c.id,{...c,rates:JSON.parse(JSON.stringify(c.rates)),weights:[...c.weights]}]));
 const sources=new Map(Object.entries(SOURCES).map(([k,v])=>[k,{...v}]));
 const resolvers=new Map();
 // Objetos históricos que la beta reasignó a otras especies: se excluyen de los canales
 // nuevos para que su obtención siga siendo exactamente la original.
 const exclude=new Set(options.exclude||[]);
 // Pozo de campo: el pozo por especie de la beta, separado por categoría.
 const fieldPools=new Map();
 for(const [species,list] of Object.entries(B?.bySpecies||{})){
  const byChannel={};
  for(const index of list){
   const row=B.items[index];if(!row||exclude.has(row[0]))continue;
   const channel=[...channels.values()].find(c=>c.tipo===row[2]);if(!channel)continue;
   (byChannel[channel.id]||=[]).push(row[0]);
  }
  fieldPools.set(species,byChannel);
 }
 resolvers.set('campo',(channelId,ctx)=>fieldPools.get(ctx.species)?.[channelId]||[]);
 function pick(ids,weights,random){
  const w=ids.map(id=>weights[catalog.items.get(id)?.rarity]??0);
  const total=w.reduce((a,b)=>a+b,0);if(!(total>0))return null;
  let roll=random()*total;
  for(let k=0;k<ids.length;k++){roll-=w[k];if(roll<0)return ids[k];}
  return ids[ids.length-1];
 }
 function roll(source,ctx={}){
  const random=ctx.random||Math.random,mode=ctx.manual?'manual':'auto',out=[];
  const src=sources.get(source);if(!src||!src.active)return out;
  const resolver=resolvers.get(source);if(!resolver)return out;
  for(const channel of channels.values()){
   const rate=channel.rates[source]?.[mode];
   if(!(rate>0))continue;
   const pool=resolver(channel.id,ctx);
   if(!pool||!pool.length)continue; // sin pozo no se consume ninguna tirada
   if(random()>=rate)continue;
   const id=pick(pool,channel.weights,random);
   if(id)out.push({channel:channel.id,id,source});
  }
  return out;
 }
 return {
  catalog,roll,excluded:()=>[...exclude],
  channels:()=>[HISTORIC_CHANNEL,...channels.values()].map(c=>JSON.parse(JSON.stringify(c))),
  sources:()=>Object.fromEntries([...sources].map(([k,v])=>[k,{...v}])),
  pool:(source,channelId,ctx)=>[...(resolvers.get(source)?.(channelId,ctx)||[])],
  configure(channelId,source,rates){const c=channels.get(channelId);if(!c||!sources.has(source))return false;c.rates[source]={manual:Number(rates.manual)||0,auto:Number(rates.auto)||0};return true;},
  registerSource(id,def={}){if(!sources.has(id))sources.set(id,{label:def.label||id,active:!!def.active});return sources.get(id);},
  activateSource(id,resolver){const s=sources.get(id);if(!s||typeof resolver!=='function')return false;resolvers.set(id,resolver);s.active=true;return true;}
 };
}

/* ---------------------------------------------------------------------------
 * 3. Registro permanente de coleccionables (independiente del inventario).
 * state.collectionRegistry = {schema, pieces:{id:{firstAt,firstSource,obtained,sources}}}
 * Una pieza registrada no se borra nunca, aunque salga del inventario.
 * ------------------------------------------------------------------------- */
function normalizeRegistry(state,catalog,now=Date.now()){
 const reg=plain(state.collectionRegistry)?state.collectionRegistry:{};
 const pieces=plain(reg.pieces)?reg.pieces:{};
 const clean={};
 for(const [id,p] of Object.entries(pieces)){
  if(!catalog.items.get(id)?.collectible||!plain(p))continue;
  const sources={};
  if(plain(p.sources))for(const [k,v] of Object.entries(p.sources)){const n=count(v);if(n)sources[k]=n;}
  clean[id]={firstAt:Number.isFinite(p.firstAt)?p.firstAt:null,firstSource:typeof p.firstSource==='string'?p.firstSource:'desconocida',
   obtained:Math.max(count(p.obtained),Object.values(sources).reduce((a,b)=>a+b,0)),sources};
 }
 // Migración: toda pieza que el jugador ya posee queda registrada como descubierta.
 let migrated=0;
 const inv=plain(state.inventory)?state.inventory:{};
 for(const id of catalog.pieces){
  const have=count(inv[id]);
  if(have&&!clean[id]){clean[id]={firstAt:null,firstSource:'migracion',obtained:have,sources:{migracion:have}};migrated++;}
  else if(have&&clean[id].obtained<have){const extra=have-clean[id].obtained;clean[id].obtained=have;clean[id].sources.migracion=(clean[id].sources.migracion||0)+extra;}
 }
 state.collectionRegistry={schema:SCHEMA,pieces:clean,
  migratedAt:Number.isFinite(reg.migratedAt)?reg.migratedAt:(migrated?now:null),
  migratedPieces:count(reg.migratedPieces)+migrated};
 return state.collectionRegistry;
}
function recordPiece(state,catalog,id,qty=1,source='desconocida',now=Date.now()){
 if(!catalog.items.get(id)?.collectible)return false;
 const n=count(qty);if(!n)return false;
 if(!plain(state.collectionRegistry)||!plain(state.collectionRegistry.pieces))normalizeRegistry(state,catalog,now);
 const pieces=state.collectionRegistry.pieces;
 const first=!pieces[id];
 const p=pieces[id]||(pieces[id]={firstAt:now,firstSource:source,obtained:0,sources:{}});
 p.obtained+=n;p.sources[source]=(p.sources[source]||0)+n;
 return first;
}
// Reconciliación ligera en tiempo de juego: unidades que otro módulo escribió directamente
// en el inventario (sin addInventory) se registran como «otros». No toca piezas ya contadas.
function reconcileRegistry(state,catalog,source='otros',now=Date.now()){
 if(!plain(state.collectionRegistry)||!plain(state.collectionRegistry.pieces))return normalizeRegistry(state,catalog,now);
 const pieces=state.collectionRegistry.pieces,inv=plain(state.inventory)?state.inventory:{};
 for(const id of catalog.pieces){
  const have=count(inv[id]);if(!have)continue;
  const p=pieces[id];
  if(!p)recordPiece(state,catalog,id,have,source,now);
  else if(p.obtained<have)recordPiece(state,catalog,id,have-p.obtained,source,now);
 }
 return state.collectionRegistry;
}
function discovered(state,id){return !!state?.collectionRegistry?.pieces?.[id];}
function discoveredCount(state,catalog){const p=state?.collectionRegistry?.pieces||{};return catalog.pieces.reduce((n,id)=>n+(p[id]?1:0),0);}

/* ---------------------------------------------------------------------------
 * 4. Gabinetes: una pieza expuesta reserva una unidad del inventario, sin
 * descontarla. Retirarla la libera. state.museum.cabinets = {gabinete:[ids]}
 * conserva el formato de la beta 5.6.0.
 * ------------------------------------------------------------------------- */
function cabinetsOf(state){
 state.museum=plain(state.museum)?state.museum:{};
 if(!plain(state.museum.cabinets))state.museum.cabinets={};
 return state.museum.cabinets;
}
function reserved(state,id){
 const cab=state?.museum?.cabinets;if(!plain(cab))return 0;
 let n=0;for(const list of Object.values(cab))if(Array.isArray(list))for(const x of list)if(x===id)n++;
 return n;
}
function pieceStatus(state,catalog,id){
 const owned=count(state?.inventory?.[id]),res=Math.min(owned,reserved(state,id));
 return {id,discovered:discovered(state,id),owned,exhibited:res,available:Math.max(0,owned-res),tradable:Math.max(0,owned-res),
  obtained:state?.collectionRegistry?.pieces?.[id]?.obtained||0};
}
function normalizeCabinets(state,catalog,capacity){
 const cab=cabinetsOf(state),clean={},used=new Map(),removed=[];
 for(const g of catalog.cabinets)clean[g]=[];
 for(const [g,list] of Object.entries(cab)){
  if(!Array.isArray(list))continue;
  for(const id of list){
   const item=catalog.items.get(id);
   if(!item?.collectible){removed.push(id);continue;}
   const target=item.cabinet; // una pieza solo puede ir en su propio gabinete
   const owned=count(state.inventory?.[id]),u=used.get(id)||0;
   if(u>=owned||u>=1||clean[target].length>=capacity){removed.push(id);continue;}
   used.set(id,u+1);clean[target].push(id);
  }
 }
 state.museum.cabinets=clean;
 return removed;
}
function expose(state,catalog,id,capacity){
 const item=catalog.items.get(id);if(!item?.collectible)return {ok:false,reason:'no-collectible'};
 const cab=cabinetsOf(state),list=cab[item.cabinet]=Array.isArray(cab[item.cabinet])?cab[item.cabinet]:[];
 if(list.includes(id))return {ok:false,reason:'already'};
 if(list.length>=capacity)return {ok:false,reason:'full'};
 if(pieceStatus(state,catalog,id).available<1)return {ok:false,reason:'unavailable'};
 list.push(id);return {ok:true};
}
function withdraw(state,catalog,id){
 const item=catalog.items.get(id);if(!item)return {ok:false,reason:'unknown'};
 const list=cabinetsOf(state)[item.cabinet];if(!Array.isArray(list))return {ok:false,reason:'absent'};
 const at=list.indexOf(id);if(at<0)return {ok:false,reason:'absent'};
 list.splice(at,1);return {ok:true};
}
// Consumo futuro (venta, intercambio, receta): solo unidades no reservadas.
function consume(state,catalog,id,qty=1){
 const n=count(qty),st=pieceStatus(state,catalog,id);
 if(!n||st.available<n)return false;
 state.inventory[id]-=n;return true;
}

/* ---------------------------------------------------------------------------
 * 5. Libro de ingresos. Solo registra entradas reales de dinero en el momento
 * en que ocurren (earnMoney en app.js). Los gastos no lo tocan.
 * state.moneyLedger = {schema,total,bySource,migration}
 * ------------------------------------------------------------------------- */
const INCOME_SOURCES=Object.freeze({
 descubrimientos:'Descubrimientos',publicaciones:'Publicaciones',subvenciones:'Subvenciones',
 canjeNotas:'Canje de notas de campo',museo:'Museo',expediciones:'Expediciones',comercio:'Comercio',
 encargos:'Encargos y misiones',taller:'Taller',recompensas:'Recompensas',
 artefactos:'Artefactos del Museo (MEC-06)',demostraciones:'Demostraciones científicas (MEC-06)',otros:'Otras fuentes',
 sinDesglose:'Antes de MEC-01 (sin desglose)'
});
function normalizeLedger(state,now=Date.now(),options={}){
 const l=state.moneyLedger;
 if(plain(l)&&Number.isFinite(l.total)){
  const bySource={};let sum=0;
  if(plain(l.bySource))for(const [k,v] of Object.entries(l.bySource)){const n=Number(v);if(Number.isFinite(n)&&n>0){bySource[k]=n;sum+=n;}}
  state.moneyLedger={schema:SCHEMA,total:Math.max(Number(l.total)||0,sum),bySource,migration:plain(l.migration)?l.migration:null};
  return state.moneyLedger;
 }
 // Migración. Una partida anterior no guarda su historial de ingresos. Como
 // saldo = capital inicial + ingresos − gastos, los ingresos son al menos
 // (saldo − capital inicial). Se usa esa estimación con el mayor de: el saldo
 // actual y el acumulado de la beta 5.6.0. MEC-03: es una estimación sin desglose, no un
 // historial exacto; el acumulado experimental de la beta no garantiza una cota inferior.
 // Una partida sin ningún avistamiento se considera nueva: el capital no es ingreso.
 const capital=Math.max(0,Number(options.startingCapital)||0);
 const money=Math.max(0,Number(state.money)||0);
 const beta=Math.max(0,Number(state.beta560?.moneyEarned)||0);
 const played=Object.keys(plain(state.discovered)?state.discovered:{}).length>0||
  Object.values(plain(state.sightings)?state.sightings:{}).some(n=>Number(n)>0);
 const baseline=played?Math.max(0,Math.max(money,beta)-capital):0;
 const method=!played?'partida-nueva':beta>money?'beta560.moneyEarned':'saldo-actual';
 state.moneyLedger={schema:SCHEMA,total:baseline,bySource:baseline>0?{sinDesglose:baseline}:{},
  migration:{at:now,baseline,method,startingCapital:capital}};
 return state.moneyLedger;
}
function credit(state,amount,source='otros'){
 const n=Number(amount);if(!Number.isFinite(n)||n<=0)return 0;
 if(!plain(state.moneyLedger)||!Number.isFinite(state.moneyLedger.total))normalizeLedger(state,Date.now(),{startingCapital:0});
 const key=own(INCOME_SOURCES,source)?source:'otros';
 state.moneyLedger.total+=n;
 state.moneyLedger.bySource[key]=(state.moneyLedger.bySource[key]||0)+n;
 return n;
}

root.AtlasMEC01=Object.freeze({
 version:'5.6.1-beta',build:'MEC-01',schema:SCHEMA,RARITY_NAMES,
 SOURCES,HISTORIC_CHANNEL,DEFAULT_CHANNELS,INCOME_SOURCES,
 buildCatalog,createDrops,
 normalizeRegistry,reconcileRegistry,recordPiece,discovered,discoveredCount,
 reserved,pieceStatus,normalizeCabinets,expose,withdraw,consume,
 normalizeLedger,credit
});
})(typeof globalThis!=='undefined'?globalThis:window);
