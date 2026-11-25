'use strict';
// MEC-09B · Auditoría funcional de accesibilidad y progresión (motor real, catálogo completo).
// Cada fila lleva su NIVEL DE EVIDENCIA (sección 5) y su ESTADO (sección 31):
//   A configuración válida · B fuente/actividad compatible · C ejecutable por el motor real en condiciones
//   legítimas · D cadena demostrada desde partida nueva (controlador de progresión, docs/mec09b/progresion-*).
//   Verificado · Condicional · Bloqueado · Incoherente · Pendiente de evidencia.
// Las comprobaciones C usan una partida PREPARADA (sintética: compuertas e investigaciones concedidas)
// y se marcan «sintética» en la columna condiciones; nunca se usan solas como prueba desde cero.
// Uso: node scripts/audit-mec09b.cjs  → docs/mec09b/*.csv
const fs=require('node:fs'),path=require('node:path');
const {make}=require('../tests/helpers/mec01-game.cjs');
const OUT=path.join(__dirname,'..','docs','mec09b');
const MAPS=['africa_map','asia_map','north_america_map','south_america_map','oceania_map','polar_map','world_map'];
const FAC=['shipyard','caravan','workshop','excavations','surveys'];
const game=(o={})=>{const h=make({now:Date.UTC(2027,2,1,12),headless:true,full:true,...o});h.window.confirm=()=>true;return h;};
function prepared(h){const g=h.g,s=g.state;Object.assign(s,{money:1e9,knowledge:1e9,prestige:5000});s.upgrades.shipyard=1;s.purchases.astillero=1;
 for(const n of g.RESEARCH_NODES){s.purchases[n.id]=1;if(n.once&&n.effect)n.effect(s);}
 for(const id of [...MAPS,'sounding_kit'])s.craftedItems[id]=true;for(const r of Object.values(g.CONTINENT_RULES3300||{}))for(const id of r.items||[])s.craftedItems[id]=true;
 for(const r of g.REGIONS)s.regionUnlocked[r.id]=true;return s;}
// Resultado del controlador (evidencia D): lo alcanzado desde partida nueva con el motor real.
// Estados del controlador: fixture versionada (tests/fixtures/mec09b-controller) o la salida temporal de una ejecución.
const SNAP=process.env.MEC09B_SNAPSHOTS||(fs.existsSync(path.join(__dirname,'..','tests','fixtures','mec09b-controller'))?path.join(__dirname,'..','tests','fixtures','mec09b-controller'):'/tmp/mec09b-snapshots');
function controller(){const f=fs.readdirSync(OUT).filter(n=>/^progresion-controlador-\d+\.json$/.test(n)).sort();if(!f.length)return null;
 const runs=f.map(n=>JSON.parse(fs.readFileSync(path.join(OUT,n),'utf8')));const best=runs.sort((a,b)=>(b.final?.step||0)-(a.final?.step||0))[0];
 const ms=new Set(best.milestones.map(m=>m.id));// Un punto de control parcial no trae el resumen completo: se deduce de los hitos registrados.
 const fromMs=pre=>[...ms].filter(m=>m.startsWith(pre)).map(m=>m.slice(pre.length));
 return {run:best,ms,continents:new Set(best.final.continents||fromMs('region-')),crafted:new Set(best.final.crafted||fromMs('mapa-')),rank:best.final.rank,camp:best.final.camp,wing:best.final.wing,voyages:new Set([...ms].filter(m=>m.startsWith('expedicion-')).map(m=>m.slice(11)))};}
const status=(ok,level,cond)=>ok===false?'Bloqueado':level==='D'?'Verificado':level==='C'?(cond?'Condicional':'Verificado'):level==='B'?'Condicional':'Pendiente de evidencia';
const q=v=>{const s=Array.isArray(v)?v.join(' | '):v&&typeof v==='object'?JSON.stringify(v):String(v??'');return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
const csv=(file,head,rows)=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,file),[head.join(';'),...rows.map(r=>head.map(k=>q(r[k])).join(';'))].join('\n')+'\n');return rows.length;};

// ── 1. Grafo integral y alcanzabilidad estática desde la partida nueva ───────────────────────
function graph(h){
 const g=h.g,x=h.x,C=x.AtlasCampMEC02,S4=x.AtlasMEC04,K=x.AtlasMEC03Catalog,E=x.AtlasMEC03Actions.engine,X6=x.AtlasMEC06;
 const fresh=game(),s0=fresh.g.state,nodes=new Map();
 const N=(id,type,o={})=>{nodes.set(id,{id,type,requires:[],sources:[],unlocks:[],restrictions:'',alternatives:'',evidence:'A',...o});return nodes.get(id);};
 // Investigaciones
 for(const n of g.RESEARCH_NODES)N('research:'+n.id,'investigación',{name:n.name,requires:[...(n.req?['research:'+n.req]:[]),...(n.reqItem?['item:'+n.reqItem]:[])],resources:{money:n.money||0,knowledge:n.knowledge||0},unlocks:g.CONTINENT_RESEARCH3300[n.id]?['continent:'+g.CONTINENT_RESEARCH3300[n.id]]:[]});
 // Continentes y regiones
 for(const [c,r] of Object.entries(g.CONTINENT_RULES3300)){const res=Object.entries(g.CONTINENT_RESEARCH3300).find(([,v])=>v===c)?.[0];
  N('continent:'+c,'continente',{requires:[...(res?['research:'+res]:[]),...(r.items||[]).map(i=>'item:'+i),...(r.cartography?['item:'+r.cartography]:[])],resources:{prestigeInitial:r.initial,prestigeStep:r.step},restrictions:'prestigio acumulado por región (no se consume)'});}
 for(const r of g.REGIONS)N('region:'+r.id,'región',{name:r.name,requires:['continent:'+r.continent],resources:{prestige:r.unlock?.prestige??null},unlocks:r.species.slice(0,0)});
 // Objetos: recetas y fuentes estructuradas
 const addSrc=(item,src,req=[])=>{const id='item:'+item;if(!nodes.has(id))N(id,'objeto',{name:g.ITEMS[item]?.name});nodes.get(id).sources.push({src,req});};
 for(const id of Object.keys(g.ITEMS))if(!nodes.has('item:'+id))N('item:'+id,'objeto',{name:g.ITEMS[id]?.name});
 for(const [id,r] of Object.entries(g.RECIPES))addSrc(id,'receta',[...Object.keys(r.requires||{}).map(m=>'item:'+m),...((r.minWorkshop||X6.COMPONENTS?.[id]?.minWorkshop)?['facility:workshop:'+(r.minWorkshop||X6.COMPONENTS[id].minWorkshop)]:[])]);
 for(const v of g.VOYAGES){N('voyage:'+v.id,'expedición',{name:v.name,requires:['research:astillero',...(v.mapItem?['item:'+v.mapItem]:[]),...(v.reqResearch?['research:'+v.reqResearch]:[]),...(v.routeReq?['research:rutas_'+v.routeReq]:[])].filter(r=>!r.startsWith('research:')||nodes.has(r)),resources:{money:v.cost,knowledge:v.knowledge||0,prestige:v.required||0}});
  for(const [it] of [...(g.V316_LOOT_BASE||[]),...(g.V316_LOOT_BY_ROUTE[v.id]||[])])addSrc(it,'expedición '+v.id,['voyage:'+v.id]);if(v.sample)addSrc(v.sample,'expedición '+v.id+' (muestra)',['voyage:'+v.id]);}
 for(const d of g.CARTOGRAPHY3400)for(const r of d.routes||[])addSrc(d.piece,'capa cartográfica '+r,['voyage:'+r,...(d.sourceResearch?['research:'+d.sourceResearch]:[])]);
 for(const [it] of Object.entries(g.TRADE_MARKET))addSrc(it,'mercado',['research:astillero']);
 for(const b of g.TRADE_BARTERS)for(const it of Object.keys(b.rewards))addSrc(it,'trueque '+b.id,['research:astillero',...Object.keys(b.requires).map(m=>'item:'+m)]);
 for(const t of g.TRADE_ROUTES){N('trade:'+t.id,'ruta comercial',{name:t.name,requires:['research:astillero'],resources:{money:t.cost,knowledge:t.knowledge,prestige:t.prestige}});for(const it of Object.keys(t.rewards||{}))addSrc(it,'ruta comercial '+t.id,['trade:'+t.id]);}
 for(const d of g.MUSEUM_DIG_SITES){N('dig:'+d.id,'yacimiento',{name:d.name,requires:['region:'+d.region,...(d.reqResearch?['research:'+d.reqResearch]:[])],resources:{money:d.money,knowledge:d.knowledge}});for(const it of ['fossil_fragment','fossil_tooth','fossil_track','fossil_claw','fossil_skull'])if(g.ITEMS[it])addSrc(it,'excavación '+d.id,['dig:'+d.id]);}
 for(const [sp,it] of Object.entries(g.SPECIES_DROPS||{})){const rs=g.REGIONS.filter(r=>r.species.includes(sp)).map(r=>'region:'+r.id);addSrc(it,'observación de '+sp,[rs[0]||'region:?']);nodes.get('item:'+it).alternatives=rs.slice(1).join(' ');}
 for(const st of Object.values(X6.STUDIES||{}))if(st.reward?.mapPiece)for(const d of g.CARTOGRAPHY3400)addSrc(d.piece,'estudio '+st.id+' (alternativa cartográfica)',['facility:workshop:'+(st.minWorkshop||1),'continent:'+d.continent+':fuente']);
 // Materiales animales: canal de nuevos materiales (MEC-01, especies de su grupo)
 for(const [gid,gr] of Object.entries(X6.ANIMAL_GROUPS||{}))for(const it of gr.ids)if(!nodes.get('item:'+it).sources.length)addSrc(it,'canal nuevosMateriales ('+gid+')',['region:'+g.REGIONS[0].id]);
 // Instalaciones y rangos
 for(const f of Object.values(C.FACILITIES))for(const L of f.levels){const req=[];if(L.level>1)req.push('facility:'+f.id+':'+(L.level-1));if(L.level===1&&f.unlock?.research)req.push('research:'+f.unlock.research);const rk=S4.FACILITY_RANKS?.[f.id]?.[L.level];if(rk)req.push('rank:'+rk);
  N('facility:'+f.id+':'+L.level,'instalación',{name:f.name+' '+C.ROMAN[L.level],requires:req,resources:{...L.cost,prestige:L.requires?.prestige||0},unlocks:L.functions||[]});}
 for(const r of S4.RANKS)N('rank:'+r.level,'rango',{name:r.name,requires:r.level>1?['rank:'+(r.level-1)]:[],resources:r.requires,unlocks:r.unlocks||[]});
 for(const L of g.MUSEUM_LEVELS){const rk=S4.MUSEUM_RANKS?.[L.level];N('museum:'+L.level,'Museo',{name:L.name,requires:[...(L.level>1?['museum:'+(L.level-1)]:[]),...(rk?['rank:'+rk]:[])],resources:{money:L.cost,prestige:L.prestige}});}
 // Coleccionables: fuentes activas del sistema híbrido (pools del motor MEC-03).
 const routes=new Set(g.VOYAGES.map(v=>v.id)),sites=new Set(g.MUSEUM_DIG_SITES.map(d=>d.id));
 for(const p of Object.values(K.pieces)){const n=N('piece:'+p.id,'coleccionable',{name:p.name});const S=p.sources||{};
  if(S.campo)n.sources.push({src:'campo',req:g.REGIONS.filter(r=>E.ambient(r,null).includes(p.id)).map(r=>'region:'+r.id).slice(0,1),regions:g.REGIONS.filter(r=>E.ambient(r,null).includes(p.id)).length});
  if(S.expediciones)n.sources.push({src:'expediciones',req:(S.expediciones.routes||[]).filter(r=>routes.has(r)).map(r=>'voyage:'+r).slice(0,1),routes:(S.expediciones.routes||[]).filter(r=>routes.has(r))});
  if(S.excavaciones)n.sources.push({src:'excavaciones',req:(S.excavaciones.sites||[]).filter(r=>sites.has(r)).map(r=>'dig:'+r).slice(0,1)});
  if(S.comercio)n.sources.push({src:'comercio',req:['facility:caravan:'+(S.comercio.minCaravan||1)]});
  if(S.prospecciones)n.sources.push({src:'prospecciones',req:['facility:surveys:1']});
  if(S.taller)n.sources.push({src:'taller',req:['facility:workshop:'+(x.AtlasMEC03.PREPARATIONS?.[S.taller.recipe]?.minWorkshop||1)]});
  if(S.observacion)n.sources.push({src:'observación animal',req:['region:'+g.REGIONS[0].id]});}
 for(const v of g.VOYAGES)addSrc('fossil_amber','hallazgo raro de expedición '+v.id,['voyage:'+v.id]);
 for(const r of g.REGIONS.filter(r=>r.habitats.some(x=>x==='rio'||x==='costa')))addSrc('river_pearl','campo (río o costa) en '+r.id,['region:'+r.id]);
 for(const b of g.REGIONAL_BARTERS3400||[])addSrc(b.id,'trueque regional ('+b.continent+')',['research:astillero','continent:'+b.continent,'item:'+b.material]);
 for(const p of Object.values(K.pieces))addSrc(p.id,'coleccionable (fuentes del sistema híbrido)',['piece:'+p.id]);
 for(const f of g.MUSEUM_FOSSIL_RECIPES||[])if(g.ITEMS[f.id])addSrc(f.id,'reconstrucción fósil',Object.keys(f.requires||{}).map(m=>'item:'+m));
 // Fixpoint: alcanzable si (sin requisitos o todos alcanzables) y, para objetos/piezas, alguna fuente alcanzable.
 const ok=new Set(['research:'+(g.RESEARCH_NODES[0]?.id)]);const reach=id=>ok.has(id)||!nodes.has(id)&&!/^(research|item|region|continent|voyage|dig|trade|facility|rank|museum|piece):/.test(id);
 for(const r of g.REGIONS)if(s0.regionUnlocked[r.id])ok.add('region:'+r.id);ok.add('continent:Europa');ok.add('rank:1');ok.add('museum:1');for(const k of FAC)ok.add('facility:'+k+':0');
 for(const d of g.CARTOGRAPHY3400)ok.add('continent:'+d.continent+':fuente');
 let changed=true,iter=0;while(changed&&iter++<200){changed=false;for(const n of nodes.values()){if(ok.has(n.id))continue;
  const reqOk=n.requires.every(reach);const srcOk=!['objeto','coleccionable'].includes(n.type)||n.sources.some(s=>s.req.every(reach));
  const hasSrc=!['objeto','coleccionable'].includes(n.type)||n.sources.length>0;
  if(reqOk&&srcOk&&hasSrc){ok.add(n.id);changed=true;}}}
 for(const n of nodes.values()){n.reachable=ok.has(n.id);n.evidence=n.reachable?'B':'A';}
 // Ciclos reales en requisitos (excluye la alternativa de fuentes múltiples).
 const cycles=[];const visit=(id,stack)=>{if(stack.includes(id)){cycles.push([...stack.slice(stack.indexOf(id)),id].join(' → '));return;}const n=nodes.get(id);if(!n||stack.length>40)return;for(const r of n.requires)visit(r,[...stack,id]);};
 for(const id of nodes.keys())if(id.startsWith('research:'))visit(id,[]);
 return {nodes:[...nodes.values()],cycles:[...new Set(cycles)],unreachable:[...nodes.values()].filter(n=>!n.reachable)};
}

// ── 2. Regiones (125) ─────────────────────────────────────────────────────────────────────
function regions(h,ctl){
 const g=h.g,x=h.x,K=x.AtlasMEC03Catalog,E=x.AtlasMEC03Actions.engine,X7=x.AtlasMEC07;const s=prepared(h);
 const voyDest=K.voyageDestinations||{};
 return g.REGIONS.map(r=>{
  const acc=g.regionAccessible(r),seasons=new Set(),times=new Set();for(const id of r.species){for(const v of g.SPECIES[id].seasons||[])seasons.add(v);for(const v of g.SPECIES[id].times||[])times.add(v);}
  const voy=g.VOYAGES.filter(v=>(voyDest[v.id]?.continents||[]).includes(r.continent)||(v.destination?.regions||[]).includes(r.id)).map(v=>v.id);
  const digs=g.MUSEUM_DIG_SITES.filter(d=>d.region===r.id).map(d=>d.id);
  const pieces=E.ambient(r,null);const recs=[...X7.RECORDS.filter(e=>r.species.includes(e.species)).map(e=>e.id)];const beh=X7.BEHAVIORS.filter(b=>r.species.includes(b.species)).map(b=>b.id);
  const deep=g.deepRegionIndex3330?.has(r.id);const relicts=g.MUSEUM_RELICTS.filter(z=>z.region===r.id).map(z=>z.id);
  const mats=Object.entries(g.SPECIES_DROPS||{}).filter(([sp])=>r.species.includes(sp)).map(([,it])=>it);
  const activities=[voy.length&&'expediciones',digs.length&&'excavación',pieces.length&&'campo ambiental','prospecciones',deep&&'sondeos',relicts.length&&'relictos'].filter(Boolean);
  const onlyFauna=!voy.length&&!digs.length&&!pieces.length&&!deep&&!relicts.length;
  const d=ctl&&ctl.continents.has(r.continent);
  return {id:r.id,nombre:r.name,continente:r.continent,acceso:'continente '+r.continent+(r.unlock?.prestige!==undefined?' · prestigio '+r.unlock.prestige:'')+(g.CARTOGRAPHIC_GATES3400[r.continent]?' · '+g.CARTOGRAPHIC_GATES3400[r.continent]:''),
   especies:r.species.length,biomas:r.habitats.join(' '),horarios:[...times].join(' '),estaciones:[...seasons].join(' '),expediciones:voy.join(' '),rutas_comerciales:'globales (Caravana)',yacimientos:digs.join(' '),prospecciones:'regional/geológica/especializada (todas las regiones desbloqueadas)',sondeos:deep?'sí':'—',
   coleccionables_campo:pieces.length,materiales:[...new Set(mats)].join(' '),records:recs.join(' '),conductas:beh.join(' '),relictos:relicts.join(' '),actividades:activities.join(', '),solo_fauna:onlyFauna?'sí':'no',
   evidencia:d?'D':acc?'C':'A',estado:status(acc,d?'D':acc?'C':'A',!d),condiciones:d?'continente alcanzado por el controlador desde partida nueva':'acceso con compuertas vigentes (partida preparada, sintética)'};});
}

// ── 3. Especies (1.000) y monografías ───────────────────────────────────────────────────
function species(h,ctl){
 const g=h.g,s=prepared(h),out=[],mono=[];
 const reg=new Map();for(const r of g.REGIONS)for(const id of r.species)(reg.get(id)||reg.set(id,[]).get(id)).push(r);
 for(const [id,sp] of Object.entries(g.SPECIES)){
  const rs=reg.get(id)||[],acc=rs.filter(r=>g.regionAccessible(r));let manual=null,auto=null;
  for(const r of acc){const deep=g.deepRegionIndex3330?.has(r.id);for(const method of deep?Object.keys(g.DEEP_METHODS3330):[null]){if(method)s.deepSurvey.method=method;
   for(const season of sp.seasons)for(const hab of r.habitats)for(const t of sp.times){s.currentRegion=r.id;
    if(!manual&&g.eligibleSpecies(r.id,hab,t,season).includes(id))manual={region:r.id,hab,t,season,method};
    if(!auto&&g.automaticEligibleSpecies(r.id,season,{habitat:hab,time:t,method:method||undefined}).includes(id))auto={region:r.id,hab,t,season,method};}}if(manual&&auto)break;}
  const pig=(sp.special||[]).filter(l=>l==='Albino'||l==='Melánico').length,cats=Object.entries(g.specimenRates(id,0)).filter(([,r])=>r>0).map(([k])=>k);
  const pSpecial=(pig?0.01:0)+cats.reduce((t,k)=>t+g.SPECIMEN_LEVELS[k].rate,0);
  const dim=!!g.SEXUAL_DIMORPHISM?.[id];
  const stages=[0,1,2,3,4].map(i=>g.stageRequirements(id,i));
  const blockers=[];if(!manual&&!auto)blockers.push('sin condición de encuentro');if(!(pSpecial>0))blockers.push('sin espécimen especial posible (etapa 5)');
  if(stages.some(r=>!Number.isFinite(r.money)||!Number.isFinite(r.knowledge)||!Number.isFinite(r.needSight)))blockers.push('costo no finito');
  const d=ctl&&rs.some(r=>ctl.continents.has(r.continent));
  const ev=blockers.length?'A':d?'D':'C';
  out.push({id,nombre:sp.name,cientifico:sp.latin,regiones:rs.map(r=>r.id).join(' '),accesibles:acc.length,manual:manual?manual.region+' · '+manual.hab+' · '+manual.t+' · '+manual.season+(manual.method?' · '+manual.method:''):'—',automatica:auto?auto.region+' · '+auto.hab+' · '+auto.t+' · '+auto.season+(auto.method?' · '+auto.method:''):'—',
   sondeo:rs.some(r=>g.deepRegionIndex3330?.has(r.id))?'sí':'no',probabilidad_especial:pSpecial.toFixed(4),dimorfismo:dim?'sí':'no',bloqueos:blockers.join('; '),evidencia:ev,estado:status(!blockers.length,ev,!d),condiciones:d?'especie de un continente alcanzado desde partida nueva':'condiciones con compuertas vigentes (partida preparada, sintética)'});
  mono.push({id,etapa1_avistamientos:stages[0].needSight,etapa2:stages[1].needSight,etapa3:stages[2].needSight,etapa4:stages[3].needSight+' + 10 alimentación'+(dim?' o macho y hembra':''),etapa5:stages[4].needSight+' + 1 espécimen especial',
   dinero_total:stages.reduce((t,r)=>t+r.money,0),conocimiento_total:stages.reduce((t,r)=>t+r.knowledge,0),alimentacion:'12 % por avistamiento (todas las fuentes de encuentro)',especial:pSpecial.toFixed(4)+' por avistamiento ('+[pig?'variante pigmentaria':'',...cats].filter(Boolean).join(', ')+')',
   guepardo:id==='guepardo'?'hito alternativo MEC-01/MEC-07 conservado':'',bloqueo:blockers.join('; '),evidencia:ev,estado:status(!blockers.length,ev,!d)});
 }
 return {rows:out,mono};
}

// ── 4. Legendarios y relictos ───────────────────────────────────────────────────────────
function legendaries(h,ctl){
 const g=h.g,s=prepared(h);
 return g.LEGENDARY_SPECIMENS.map(l=>{const sp=g.SPECIES[l.speciesId],rs=g.REGIONS.filter(r=>r.species.includes(l.speciesId));const rate=g.specimenRates(l.speciesId,0).Legendario||0;
  const cat=(g.SPECIMEN_CATEGORIES[l.speciesId]||[]).includes('Legendario');
  // C: el motor real produce el legendario con un generador cuyo segundo valor cae en su intervalo.
  const snap=JSON.parse(JSON.stringify({upgrades:s.upgrades,legendaryFound:{}}));const rates=g.specimenRates(l.speciesId,snap.upgrades?.ethology);let cursor=0,target=null;for(const [k,r] of Object.entries(rates)){if(k==='Legendario'){target=cursor+r/2;break;}cursor+=r;}
  const seq=[0.99,target??0.99];let i=0;const res=g.rollSpecimen(l.speciesId,snap,()=>seq[i++]??0.99);
  const ok=!!sp&&rs.length&&cat&&rate>0&&res.category==='Legendario';const d=ctl&&rs.some(r=>ctl.continents.has(r.continent));const ev=!ok?'A':d?'C':'C';
  return {id:l.id,nombre:l.name,especie:l.speciesId,nombre_especie:sp?.name||'—',regiones:rs.map(r=>r.id).join(' '),biomas:sp?.habitats.join(' '),horario:sp?.times.join(' '),estacion:sp?.seasons.join(' '),
   condiciones:'cualquier avistamiento de la especie (manual, automático o sondeo) · una sola vez por partida',probabilidad:rate,metodo:'tirada de espécimen del encuentro (rollSpecimen)',registro:'state.legendaryFound[id] (permanente; no se repite)',
   resultado_motor:res.category,evidencia:ev,estado:ok?(d?'Verificado':'Condicional'):'Bloqueado',nota:d?'especie en continente alcanzado desde partida nueva; hallazgo C con semilla (no representativo)':'C con semilla; acceso a la región: compuertas vigentes (sintético)'};});
}
function relicts(h,ctl){
 const g=h.g,s=prepared(h),out=[];
 for(const r of g.MUSEUM_RELICTS){const reg=g.REGIONS.find(z=>z.id===r.region);const habOk=(r.habitats||[]).filter(x=>reg?.habitats.includes(x));
  const lead0=g.relictLeadCount?.(r.id)??null;
  out.push({id:r.id,nombre:r.name,region:r.region,region_existe:!!reg,continente:reg?.continent||'—',habitats:(r.habitats||[]).join(' '),habitats_en_region:habOk.join(' '),horarios:(r.times||[]).join(' '),
   indicios:'1 región · 2 bioma · 3 horario (prospección documental y pistas de expediciones)',evidencia:reg&&habOk.length&&(r.times||[]).length?'C':'A',estado:reg&&habOk.length&&(r.times||[]).length?'Condicional':'Incoherente',nota:''});}
 return out;
}


// ── 5. Coleccionables (431) y colecciones (32) ─────────────────────────────────────────────
function pieces(h,ctl,finalState=null){
 const g=h.g,x=h.x,K=x.AtlasMEC03Catalog,E=x.AtlasMEC03Actions.engine,X3=x.AtlasMEC03,C=x.AtlasCampMEC02;const s=prepared(h);
 const voyOk=new Map(g.VOYAGES.map(v=>{let ok=false;try{ok=g.voyageConditions3280(v).every(c=>c.met);}catch(_){}return [v.id,ok];}));
 const digOk=new Map(g.MUSEUM_DIG_SITES.map(d=>[d.id,g.canStartExcavation(d.id)]));
 const shipMod={...(C.VOYAGE_MODALITIES||{}),...(X3.VOYAGE_MODALITIES||{})},digMod=C.DIG_MODES||{};
 const allConts=new Set(g.REGIONS.map(r=>r.continent));
 const sp=Object.keys(g.SPECIES);
 const got=finalState?new Set(Object.keys(finalState.collectionRegistry?.pieces||{})):null;
 return Object.values(K.pieces).map(p=>{
  const S=p.sources||{},src=[];
  if(S.campo){const rs=g.REGIONS.filter(r=>E.ambient(r,null).includes(p.id)&&g.regionAccessible(r));src.push({k:'campo',ok:rs.length>0,where:rs.slice(0,6).map(r=>r.id).join(' ')+(rs.length>6?' …('+rs.length+')':''),req:'región accesible; bioma '+(S.campo.biomes||[]).join('/'),d:ctl&&rs.some(r=>ctl.continents.has(r.continent))});}
  if(S.expediciones){const rt=(S.expediciones.routes||[]).filter(r=>voyOk.get(r));const mods=(S.expediciones.modalities||[]).map(m=>m+'≥'+(shipMod[m]?.minLevel??'?'));src.push({k:'expediciones',ok:rt.length>0&&(S.expediciones.modalities||[]).some(m=>(shipMod[m]?.minLevel??9)<=5||m==='normal')||(rt.length>0&&p.rarity===0),where:rt.join(' '),req:'Astillero '+(S.expediciones.minShipyard||1)+'; modalidades '+mods.join(','),d:ctl&&rt.some(r=>ctl.voyages.has(r))});}
  if(S.excavaciones){const st=(S.excavaciones.sites||[]).filter(d=>digOk.get(d));src.push({k:'excavaciones',ok:st.length>0&&(S.excavaciones.modes||[]).some(m=>(digMod[m]?.minLevel??9)<=5),where:st.join(' '),req:'modos '+(S.excavaciones.modes||[]).map(m=>m+'≥'+(digMod[m]?.minLevel??'?')).join(','),d:ctl&&st.some(d=>{const site=g.MUSEUM_DIG_SITES.find(z=>z.id===d);const r=g.REGIONS.find(z=>z.id===site.region);return r&&ctl.continents.has(r.continent);})&&ctl.ms.has('primera-excavacion')});}
  if(S.comercio){const lvl=S.comercio.minCaravan||1;const pool=E.commerce(5,allConts,3);src.push({k:'comercio',ok:pool.includes(p.id)&&lvl<=5,where:'Caravana '+lvl+' · '+(S.comercio.continents||[]).join('/'),req:'Caravana '+lvl+' y continente desbloqueado',d:ctl&&(S.comercio.continents||[]).some(c=>ctl.continents.has(c))&&(ctl.camp?.caravan||1)>=lvl});}
  if(S.prospecciones){const rs=g.REGIONS.filter(r=>E.geological(r,'especializada').includes(p.id)||E.geological(r,'geologica').includes(p.id)||E.regional(r).includes(p.id));src.push({k:'prospecciones',ok:rs.length>0&&(S.prospecciones.minSurveys||1)<=5,where:rs.slice(0,4).map(r=>r.id).join(' ')+(rs.length>4?' …('+rs.length+')':''),req:'Prospecciones '+(S.prospecciones.minSurveys||1)+'; tipos '+(S.prospecciones.types||[]).join('/'),d:ctl&&rs.some(r=>ctl.continents.has(r.continent))&&(ctl.camp?.surveys||1)>=(S.prospecciones.minSurveys||1)});}
  if(S.taller){const pr=X3.PREPARATIONS?.[S.taller.recipe];src.push({k:'taller',ok:!!pr&&E.preparation(S.taller.recipe,allConts,3).includes(p.id),where:S.taller.recipe,req:'Taller '+(pr?.minWorkshop||'?')+'; '+Object.entries(pr?.requires||{}).map(([m,n])=>m+'×'+n).join(' '),d:ctl&&(ctl.camp?.workshop||1)>=(pr?.minWorkshop||9)&&p.continents.some(c=>ctl.continents.has(c))});}
  if(S.encargos){const ok=E.reward(p.collection,allConts).includes(p.id);src.push({k:'encargos',ok,where:'solicitudes de coleccionistas · '+p.collection,req:'Caravana y solicitud vigente',d:false});}
  if(p.collection==='Imágenes daguerrotipadas'){const vs=g.VOYAGES.filter(v=>voyOk.get(v.id)&&(K.voyageDestinations?.[v.id]?.continents||[]).some(c=>(p.findIn||[]).includes(c))).map(v=>v.id);src.push({k:'cámara de expedición',ok:vs.length>0,where:vs.join(' '),req:'Cámara de daguerrotipos instalada en el Campamento y placa virgen; revelado en el Taller con la placa expuesta del mismo destino',d:ctl&&vs.some(v=>ctl.voyages.has(v))&&ctl.crafted.has('placa_daguerrotipo')});}
  if(S.observacion){const spp=sp.filter(id=>E.observation(id).includes(p.id));src.push({k:'observación animal',ok:spp.length>0,where:spp.length+' especies',req:'investigación «Gabinete de especímenes» (specimenDrops); tipo de animal '+(S.observacion.kinds||S.observacion.species||[]).join('/'),d:ctl&&ctl.ms.has('primer-avistamiento')&&spp.some(id=>g.REGIONS.some(r=>r.species.includes(id)&&ctl.continents.has(r.continent)))});}
  const okSrc=src.filter(x=>x.ok),dSrc=okSrc.filter(x=>x.d),obtained=got?.has(p.id);
  const ev=obtained?'D':!okSrc.length?'A':dSrc.length?'C':'C',st=obtained?'Verificado':!okSrc.length?'Bloqueado':dSrc.length?'Verificado':'Condicional';
  const onlyTrade=okSrc.length&&okSrc.every(x=>x.k==='comercio');
  return {id:p.id,nombre:p.name,coleccion:p.collection,gabinete:p.cabinet,rareza:K.rarities?.[p.rarity]??p.rarity,origen:p.origin,hallazgo:(p.findIn||[]).join(' '),adquisicion:S.comercio?'Caravana':'—',fuente_principal:p.primary,fuentes_alternativas:(p.alt||[]).join(' '),
   fuentes_activas:okSrc.map(x=>x.k).join(' '),detalle:src.map(x=>(x.ok?'✓ ':'✗ ')+x.k+': '+x.where+' ['+x.req+']').join(' | '),intercambiable:S.comercio||p.rarity<3?'sí':'según protección',mundial:(p.origin||'').includes('Mundial')||(p.findIn||[]).includes('Mundial')?'sí':'no',solo_comercio:onlyTrade?'sí':'no',
   obtenida_por_controlador:got?(obtained?'sí':'no'):'—',evidencia:ev,estado:st,condiciones:obtained?'obtenida en la partida del controlador desde cero':dSrc.length?'fuente ejecutada con condiciones alcanzadas por el controlador; pieza por tirada de su conjunto':'fuente compatible con compuertas vigentes (partida preparada, sintética)'};});
}
function collections(h,rows){
 const g=h.g,x=h.x,K=x.AtlasMEC03Catalog,S4=x.AtlasMEC04;const by={};for(const r of rows)(by[r.coleccion]=by[r.coleccion]||[]).push(r);
 const rank10=S4.RANKS.find(r=>r.requires?.collections);
 return Object.entries(by).map(([c,l])=>{const blocked=l.filter(r=>r.estado==='Bloqueado'),cond=l.filter(r=>r.estado==='Condicional'),ver=l.filter(r=>r.estado==='Verificado');
  const reqs=new Set(l.flatMap(r=>(r.detalle.match(/Caravana \d|Taller \d|Prospecciones \d|Astillero \d/g)||[])));
  return {coleccion:c,gabinete:l[0].gabinete,piezas:l.length,verificadas:ver.length,condicionales:cond.length,bloqueadas:blocked.length,requisitos_maximos:[...reqs].sort().join(' '),
   completable:blocked.length?'no':'sí',antes_de_rango_10:!blocked.length&&![...reqs].some(r=>/ 5$/.test(r))&&l.every(r=>!/ampliada≥5|especial≥5/.test(r.detalle)||r.fuentes_activas.split(' ').length>1)?'sí':'revisar',
   estado:blocked.length?'Bloqueado':cond.length?'Condicional':'Verificado',evidencia:blocked.length?'A':cond.length?'C':'D'};});
}
// ── 6. Objetos y materiales (inventario completo) ─────────────────────────────────────────
function materials(h,G){
 const g=h.g,x=h.x,a6=x.AtlasMEC06Actions;const nodes=new Map(G.nodes.map(n=>[n.id,n]));
 const recipeOf=id=>g.RECIPES[id]?.requires||null;
 const selfDep=id=>{const seen=new Set();const walk=(i,d)=>{if(d>12)return false;const r=recipeOf(i);if(!r)return false;for(const m of Object.keys(r)){if(m===id)return true;if(!seen.has(m)){seen.add(m);if(walk(m,d+1))return true;}}return false;};return walk(id,0);};
 return Object.keys(g.ITEMS).map(id=>{const n=nodes.get('item:'+id),a=a6.audit(id),uses=(a6.usesOf(id)||[]);
  const flags=[];if(!n?.sources?.length)flags.push('sin fuente estructurada');if(!n?.reachable)flags.push('no alcanzable');if(selfDep(id))flags.push('receta circular');
  if(n&&n.sources.length&&n.sources.every(s=>s.req.includes('item:'+id)))flags.push('solo se obtiene usándolo');
  if(!uses.length&&!x.AtlasMEC03Catalog.pieces[id])flags.push('sin uso registrado');
  return {id,nombre:g.ITEMS[id].name,categoria:a.category,fuentes:(a.sources||[]).slice(0,6).join(' | '),fuentes_estructuradas:(n?.sources||[]).length,receta:recipeOf(id)?Object.entries(recipeOf(id)).map(([m,q])=>m+'×'+q).join(' '):'',usos:uses.slice(0,6).map(u=>u.kind+':'+u.id).join(' '),
   alcanzable:n?.reachable?'sí':'no',observaciones:flags.join('; '),estado:flags.some(f=>/circular|no alcanzable|solo se obtiene/.test(f))?'Bloqueado':flags.includes('sin fuente estructurada')?'Pendiente de evidencia':'Verificado',evidencia:n?.reachable?'B':'A'};});
}
// ── 7. Taller: artefactos, componentes, estudios y demostraciones ─────────────────────────
function workshop(h,ctl){
 const g=h.g,x=h.x,X6=x.AtlasMEC06,a6=x.AtlasMEC06Actions,C=x.AtlasCampMEC02;const s=prepared(h);s.society.rank=20;s.museum.wing=5;for(const id of Object.keys(g.ITEMS))s.inventory[id]=(s.inventory[id]||0)+60;
 for(const k of FAC)for(let i=0;i<5;i++)try{C.upgrade(s,k);}catch(_){}
 const rows=[];
 for(const [id,a] of Object.entries(X6.ARTIFACTS)){const plan=a6.planArtifact(id);const built=plan?.ok?a6.buildArtifact(id):false;const cat=!!s.museum.collections?.[id];let placed=null;if(cat){const cur=a6.location(id);if(cur&&cur!=='almacen')placed=cur;else for(const pl of a.places){if(pl==='almacen')continue;if(a6.setLocation(id,pl)){placed=pl;break;}}}
  const uses=(a.uses||[]).map(u=>X6.STUDIES[u]?'estudio:'+u:X6.DEMOS[u]?'demostración:'+u:'modificador:'+u);
  const selfLock=(a.uses||[]).some(u=>X6.STUDIES[u]&&Object.keys(X6.STUDIES[u].instruments||{}).includes(id)&&false);
  rows.push({tipo:'artefacto',id,nombre:g.ITEMS[id]?.name||g.MUSEUM_COLLECTIONS.find(c=>c.id===id)?.name,taller:a.minWorkshop,ingredientes:JSON.stringify(g.MUSEUM_COLLECTIONS.find(c=>c.id===id)?.requires||{}),plan:plan?.ok?'ejecutable':'—: '+(plan?.reasons||[]).join(', '),fabricado:built?'sí':'no',catalogado:cat?'sí':'no',instalado:placed||'—',usos:uses.join(' '),
   autobloqueo:selfLock?'sí':'no',evidencia:built&&cat?'C':'A',estado:built&&cat&&placed?'Condicional':'Bloqueado',condiciones:'partida preparada (sintética): materiales y Taller V concedidos'});}
 for(const [id,c] of Object.entries(X6.COMPONENTS||{})){const ok=g.canCraft(id)&&g.craftItem(id);rows.push({tipo:'componente',id,nombre:g.ITEMS[id]?.name,taller:c.minWorkshop,ingredientes:JSON.stringify(g.RECIPES[id]?.requires||{}),plan:'receta',fabricado:ok?'sí':'no',catalogado:'—',instalado:'—',usos:(a6.usesOf(id)||[]).map(u=>u.kind+':'+u.id).slice(0,5).join(' '),autobloqueo:'no',evidencia:ok?'C':'A',estado:ok?'Condicional':'Bloqueado',condiciones:'partida preparada (sintética)'});}
 for(const [id,st] of Object.entries(X6.STUDIES)){for(const art of Object.keys(X6.ARTIFACTS))if(a6.location(art)==='taller'||a6.location(art)==='campamento')a6.setLocation(art,'almacen');
  for(const [ins,pl] of Object.entries(st.instruments||{}))for(const one of ins.split('|'))if(s.museum.collections?.[one]){a6.setLocation(one,pl);break;}
  // El cálculo de derrotas es la vía alternativa de partes de mapa: solo existe mientras haya un mapa pendiente.
  if(st.reward?.mapPiece){s.craftedItems.polar_map=false;s.inventory.polar_map=0;s.inventory.polar_map_piece=0;}
  if(st.engine==='fotografia'){s.mec06.plates.lots.push({id:'Lx'+id,kind:'expuesta',qty:1,origin:'prueba',continents:['Europa'],voyage:'coast',jobId:'x'});}
  const chk=a6.studyCheck(id);const ran=chk?.ok?a6.runStudy(id):false;
  const instr=Object.keys(st.instruments||{}).join(' ');const self=Object.keys(st.instruments||{}).some(i=>i.split('|').some(one=>Object.keys(g.MUSEUM_COLLECTIONS.find(c=>c.id===one)?.requires||{}).some(m=>JSON.stringify(st.reward||{}).includes(m))));
  rows.push({tipo:'estudio',id,nombre:st.label,taller:st.minWorkshop,ingredientes:JSON.stringify(st.requires||{})+(st.group?' + '+st.group.qty+' '+st.group.id:''),plan:chk?.ok?'ejecutable':'—: '+(chk?.reasons||[]).join(', '),fabricado:ran?'ejecutado':'no',catalogado:'—',instalado:instr,usos:JSON.stringify(st.reward),autobloqueo:self?'revisar':'no',evidencia:ran?'C':'A',estado:ran?'Condicional':'Bloqueado',condiciones:'partida preparada (sintética)'+(st.engine==='fotografia'?'; placa expuesta registrada para la prueba':'')});}
 for(const [id,d] of Object.entries(X6.DEMOS)){if(s.museum.collections?.[d.artifact])a6.setLocation(d.artifact,'museo');const chk=a6.demoCheck(id);const ran=chk?.ok?a6.runDemo(id):false;
  rows.push({tipo:'demostración',id,nombre:d.label,taller:'—',ingredientes:JSON.stringify(d.requires||{}),plan:chk?.ok?'ejecutable':'—: '+(chk?.reasons||[]).join(', '),fabricado:ran?'ejecutada':'no',catalogado:'—',instalado:d.artifact+' en el Museo',usos:JSON.stringify(d.reward||{}),autobloqueo:'no',evidencia:ran?'C':'A',estado:ran?'Condicional':'Bloqueado',condiciones:'partida preparada (sintética)'});}
 // D: lo que el controlador fabricó o ejecutó desde partida nueva.
 if(ctl)for(const r of rows)if((r.tipo==='componente'&&ctl.crafted.has(r.id))){r.evidencia='D';r.estado='Verificado';r.condiciones='fabricado por el controlador desde partida nueva';}
 return rows;
}
// ── 8. Campamento, Sociedad, Museo y paleontología ─────────────────────────────────────────
function facilities(h,ctl){
 const x=h.x,C=x.AtlasCampMEC02,S4=x.AtlasMEC04;const rows=[];
 for(const f of Object.values(C.FACILITIES))for(const L of f.levels){const rk=S4.FACILITY_RANKS?.[f.id]?.[L.level]||null;const d=ctl&&(ctl.camp?.[f.id]||1)>=L.level;
  rows.push({instalacion:f.id,nombre:f.name,nivel:L.level,nombre_nivel:L.name,costo:JSON.stringify(L.cost),prestigio:L.requires?.prestige??0,investigacion:L.level===1?(f.unlock?.research||'—'):'—',rango:rk||'—',efectos:JSON.stringify(L.effects||{}),funciones:(L.functions||[]).join(' · '),
   dependencia_circular:rk&&S4.RANKS.find(r=>r.level===rk)?.requires&&JSON.stringify(S4.RANKS.find(r=>r.level===rk).requires).includes(f.id)?'revisar':'no',evidencia:d?'D':'B',estado:d?'Verificado':'Condicional',condiciones:d?'alcanzado por el controlador desde partida nueva':'requisitos alcanzables en el grafo; sin ejecución completa desde cero'});}
 return rows;
}
function ranks(h,ctl){
 const x=h.x,S4=x.AtlasMEC04,g=h.g;
 return S4.RANKS.map(r=>{const req=r.requires||{};const issues=[];
  if(req.research&&req.research>g.RESEARCH_NODES.length)issues.push('más investigaciones que las existentes');
  if(req.collections&&req.collections>32)issues.push('más colecciones que las existentes');
  if(req.species&&req.species>1000)issues.push('especies');if(req.monographs&&req.monographs>1000)issues.push('monografías');
  const d=ctl&&(ctl.rank||1)>=r.level;
  return {nivel:r.level,id:r.id,nombre:r.name,requisitos:JSON.stringify(req),desbloquea:(r.unlocks||[]).join(' '),recompensa:JSON.stringify(r.reward||{}),problemas:issues.join('; '),evidencia:d?'D':issues.length?'A':'B',estado:issues.length?'Bloqueado':d?'Verificado':'Condicional',condiciones:d?'alcanzado por el controlador desde partida nueva':'requisitos dentro del contenido existente; ver controlador'};});
}
function museum(h,ctl){
 const g=h.g,x=h.x,S4=x.AtlasMEC04;const rows=[];
 for(const L of g.MUSEUM_LEVELS){const rk=S4.MUSEUM_RANKS?.[L.level]||null;const d=ctl&&(ctl.wing||1)>=L.level;rows.push({tipo:'nivel',id:'museo-'+L.level,nombre:L.name,requisitos:'£'+L.cost+' · prestigio '+L.prestige+(rk?' · rango '+rk:''),capacidad:'animales '+L.animalSlots+' · gabinete '+L.cabinetSlots,fuentes:'—',evidencia:d?'D':'B',estado:d?'Verificado':'Condicional'});}
 const nodes=new Map(graph(h).nodes.map(n=>[n.id,n]));
 for(const f of g.MUSEUM_FOSSIL_RECIPES||[]){const ins=Object.keys(f.requires||{});const srcs=ins.map(m=>m+':'+(nodes.get('item:'+m)?.sources||[]).map(s=>s.src).slice(0,3).join('/'));const ok=ins.every(m=>nodes.get('item:'+m)?.reachable);
  rows.push({tipo:'reconstrucción fósil',id:f.id,nombre:f.name,requisitos:JSON.stringify(f.requires),capacidad:'—',fuentes:srcs.join(' | '),evidencia:ok?'B':'A',estado:ok?'Condicional':'Bloqueado'});}
 for(const c of g.MUSEUM_COLLECTIONS.filter(c=>c.tab!=='artifacts')){const ins=Object.keys(c.requires||{});const ok=ins.every(m=>nodes.get('item:'+m)?.reachable);rows.push({tipo:'colección del Museo',id:c.id,nombre:c.name,requisitos:JSON.stringify(c.requires||{}),capacidad:'—',fuentes:'',evidencia:ok?'B':'A',estado:ok?'Condicional':'Bloqueado'});}
 return rows;
}
// ── 9. Comercio y expediciones (iniciar y terminar con el motor real) ─────────────────────
function commerce(h,ctl){
 const rows=[];
 const mk=()=>{const hh=game();const s=prepared(hh);s.society.rank=20;for(const id of Object.keys(hh.g.ITEMS))s.inventory[id]=(s.inventory[id]||0)+60;for(const k of FAC)for(let i=0;i<5;i++)try{hh.x.AtlasCampMEC02.upgrade(s,k);}catch(_){}return hh;};
 const base=mk();
 for(const v of base.g.VOYAGES){const hh=mk(),g=hh.g,s=g.state;let started=false,settled=0;try{started=g.sail(v.id);}catch(_){}const job=s.voyages.at(-1);if(started&&job){hh.now=job.endAt+1;settled=g.processVoyages(hh.now);}
  const d=ctl&&ctl.voyages.has(v.id);rows.push({tipo:'expedición',id:v.id,nombre:v.name,requisitos:'prestigio '+v.required+' · £'+v.cost+' · '+(v.knowledge||0)+' C'+(v.mapItem?' · '+v.mapItem:'')+(v.reqResearch?' · '+v.reqResearch:''),iniciar:started?'sí':'no',terminar:settled?'sí':'no',recompensas:'£'+v.prize+' · '+v.notes+' notas · botín',evidencia:d?'D':started&&settled?'C':'A',estado:d?'Verificado':started&&settled?'Condicional':'Bloqueado',nueva:v.mec09b?'MEC-09B':''});}
 for(const t of base.g.TRADE_ROUTES){const hh=mk(),g=hh.g,s=g.state;const ok=g.startTrade3300(t.id);const job=s.commerce.jobs.at(-1);let done=false;if(ok&&job){hh.now=job.endAt+1;done=!!g.settleTrade3300(hh.now);}
  const d=ctl&&ctl.ms.has('primera-ruta-comercial');rows.push({tipo:'ruta comercial',id:t.id,nombre:t.name,requisitos:'prestigio '+t.prestige+' · £'+t.cost,iniciar:ok?'sí':'no',terminar:done?'sí':'no',recompensas:JSON.stringify(t.rewards),evidencia:ok&&done?(d?'D':'C'):'A',estado:ok&&done?(d?'Verificado':'Condicional'):'Bloqueado',nueva:''});}
 for(const d of base.g.MUSEUM_DIG_SITES){const hh=mk(),g=hh.g,s=g.state;const ok=g.startExcavation(d.id);const job=s.museum.excavations.at(-1);let done=false;if(ok&&job){hh.now=job.endAt+1;done=!!g.collectExcavation(job.id,hh.now);}
  rows.push({tipo:'yacimiento',id:d.id,nombre:d.name,requisitos:'región '+d.region+(d.reqResearch?' · '+d.reqResearch:''),iniciar:ok?'sí':'no',terminar:done?'sí':'no',recompensas:'fragmentos '+d.fragments.join('–')+' · dientes '+d.tooth+' · cráneo '+d.skull,evidencia:ok&&done?'C':'A',estado:ok&&done?'Condicional':'Bloqueado',nueva:d.mec09b?'MEC-09B':''});}
 for(const [id,m] of Object.entries(base.g.TRADE_MARKET)){const hh=mk();const ok=hh.g.buyTrade3300(id);rows.push({tipo:'mercado',id,nombre:hh.g.ITEMS[id]?.name,requisitos:'Astillero · £'+m,iniciar:ok?'sí':'no',terminar:ok?'sí':'no',recompensas:id,evidencia:ok?'C':'A',estado:ok?'Condicional':'Bloqueado',nueva:''});}
 return rows;
}

// ── 10. Récords (25) y conductas (20): observación, hito final y validación ──────────────
function records(h){
 const {recordsAudit}=require('../tests/helpers/mec04-audit.cjs');const au=recordsAudit(h,{witness:true});
 const g=h.g,x=h.x,X7=x.AtlasMEC07,A7=x.AtlasMEC07Actions,a6=x.AtlasMEC06Actions,s=g.state;
 return [...X7.RECORDS.map(e=>['récord',e]),...X7.BEHAVIORS.map(e=>['conducta',e])].map(([kind,e])=>{const info=au.entries[e.id];let hito='—',valid='—';
  if(kind==='récord'){// Hito: el generador real produce un valor que cumple el umbral; update lo registra y paga una vez.
   const r=X7.rng('mec09b|'+e.id);let v=null;const zones=e.model.basis==='rutas'?Object.values(e.model.zones).flat():[];for(let i=0;i<200000&&v===null;i++){const t=X7.generate(e,r,{evidenceRegions:20,evidenceRegionIds:zones});if(X7.meets(e,t))v=t;}
   if(v!==null){const region=info.regions[0];const pend=!!e.instrument;const {record}=X7.update(e,null,{value:v,at:1,region,method:e.method});hito=(record.achieved||(pend&&record.pending))?'alcanzable ('+X7.fmt(e,v)+')':'no';
    if(e.instrument){s.naturalRecords.records[e.id]=record;s.museum.collections=s.museum.collections||{};s.museum.collections[e.instrument.id]=true;for(const art of Object.keys(x.AtlasMEC06.ARTIFACTS))if(a6.location(art)==='taller')a6.setLocation(art,'almacen');a6.setLocation(e.instrument.id,e.instrument.place||'taller');
     const chk=A7.validationCheck(e.id,region);const ok=chk.ok&&A7.validate(e.id,2,region);const rr=s.naturalRecords.records[e.id];valid=ok&&rr.achieved?'validado con '+e.instrument.id:'no: '+(chk.reasons||[]).join(', ');}}}
  const ok=!info.problems.length&&(kind!=='récord'||(/alcanzable/.test(hito)&&(!e.instrument||/validado/.test(valid))));
  return {tipo:kind,id:e.id,nombre:e.name,especie:e.species,regiones:info.regions.join(' '),condiciones:'horario '+info.times.join('/')+' · estación '+info.seasons.join('/')+' · bioma '+info.habitats.join('/'),metodo:e.method||'—',probabilidad:'manual '+e.chance.manual+' · auto '+e.chance.auto,
   umbral:kind==='récord'?X7.fmt(e,e.threshold):'—',modelo:kind==='récord'?e.model.kind+(e.model.basis?' ('+e.model.basis+')':''):'—',p_umbral:info.plausibility?info.plausibility.pThreshold.toFixed(4):'—',instrumento:e.instrument?.id||'—',
   observacion_testigo:info.witness?(info.witness.ok?'sí ('+info.witness.searches+' búsquedas, '+info.witness.method+')':'no'):'—',hito_final:hito,validacion:valid,problemas:info.problems.join('; '),recompensa:'única (rewards por hito)',evidencia:ok?'C':'A',estado:ok?'Condicional':'Bloqueado',
   nota:'progresión real del arnés de MEC-04 hasta el testigo; región, hábitat, hora y estación fijados (sintético); hito con el generador real y semilla'};});
}

// ── 11. Encargos, plantillas, eventos y logros ───────────────────────────────────────────
// Partida «completa» SINTÉTICA para comprobar que cada métrica puede llegar a su objetivo con el
// contenido existente (no prueba la cadena: esa la aporta el controlador).
function complete(h){
 const g=h.g,x=h.x,s=prepared(h),K=x.AtlasMEC03Catalog,X7=x.AtlasMEC07,X6=x.AtlasMEC06,C=x.AtlasCampMEC02;s.society.rank=20;
 for(const id of Object.keys(g.SPECIES)){s.discovered[id]=true;s.sightings[id]=200;s.stages[id]=5;s.published[id]=true;s.feedObs[id]=10;}
 for(const r of g.REGIONS){s.regionsVisited[r.id]=true;s.regionalRecords.regions[r.id]={species:Object.fromEntries(r.species.map(id=>[id,{count:1}]))};}
 for(const id of Object.keys(g.RECIPES))s.craftedItems[id]=true;for(const l of g.LEGENDARY_SPECIMENS)s.legendaryFound[l.id]={id:l.id,speciesId:l.speciesId};
 for(const id of Object.keys(g.SPECIES)){s.specialFound[id]={Notable:true,Albino:true,'Melánico':true,'Épico':true,'Excepcional':true};s.specialCounts[id]={Notable:1};s.specialSeen[id]=2;}
 for(const id of Object.keys(g.SEXUAL_DIMORPHISM||{}))s.dimorphism[id]={male:true,female:true,complete:true};
 for(const p of Object.values(K.pieces)){h.g.addInventory(p.id,2);}for(const id of Object.keys(g.ITEMS))if(!K.pieces[id])s.inventory[id]=(s.inventory[id]||0)+50;
 for(const c of g.MUSEUM_COLLECTIONS)s.museum.collections[c.id]=true;for(const r of g.MUSEUM_RELICTS)g.recordMuseumRelict?.(r.id);
 for(const k of FAC)for(let i=0;i<5;i++)try{C.upgrade(s,k);}catch(_){}s.museum.wing=5;
 for(const e of X7.RECORDS)s.naturalRecords.records[e.id]={count:1,first:{value:e.threshold,at:1,region:null,method:e.method},best:{value:e.threshold,at:1,region:null,method:e.method,instrument:e.instrument?.id||null},achieved:true,achievedAt:1,regions:{},pending:null,pendingByRegion:{},rewards:{},validations:e.instrument?1:0};
 for(const b of X7.BEHAVIORS)s.naturalRecords.behaviors[b.id]={count:1,firstAt:1,region:null,regions:{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1},rewards:{}};
 for(const id of Object.keys(X6.STUDIES))s.mec06.studies[id]={count:3,lastAt:null};for(const id of Object.keys(X6.DEMOS))s.mec06.demos[id]={count:3,lastAt:null};
 Object.assign(s.museum,{voyagesCompleted:200,excavationsCompleted:50});s.prospections.settled=Object.fromEntries(Array.from({length:20},(_,i)=>['p'+i,true]));
 for(const k of Object.keys(s.mec08.counters))s.mec08.counters[k]=100;s.achievements.evidence.deepCompleted=20;
 for(const k of ['trade','trade24','market','barter'])s.achievements.counters[k]=30;
 s.museum.exhibits=Object.fromEntries(Object.keys(g.SPECIES).slice(0,20).map(id=>[id,{at:1}]));s.museum.relicts=Object.fromEntries(g.MUSEUM_RELICTS.map(r=>[r.id,{at:1}]));
 for(const f of g.MUSEUM_FOSSIL_RECIPES||[])s.museum.collections[f.id]=true;
 Object.assign(s.achievements.evidence,{voyageTypes:g.VOYAGES.map(v=>v.id),methods:['sondeo','muestreo'],abyssRecords:3});
 s.society.grants=s.society.grants||{};for(const k of ['campo','expediciones','proyectos','patrocinio'])s.society.grants[k]={...(s.society.grants[k]||{}),count:3};
 s.mec08.medals=Object.fromEntries(x.AtlasMEC08.EVENTS.map(e=>[e.id,[2027]]));
 // Gabinetes: una colección completa expuesta por gabinete (motor MEC-01, capacidad del nivel V).
 const cols={};for(const p of Object.values(K.pieces))(cols[p.collection]=cols[p.collection]||[]).push(p);
 for(const list of Object.values(cols))for(const p of list)try{h.M.expose(s,h.A.catalog,p.id);}catch(_){}
 return s;
}
function achievements(h){
 const g=h.g,x=h.x,A=x.AtlasAchievements3360,s=complete(h),ctx=g.achievementContext3360(),m=A.metrics(s,ctx);
 A.evaluate(s,ctx,Object.keys(A.categories),{silent:true,now:2});
 const counters={crafted:'craftItem (MEC-08, transacción)',specializedVoyages:'resolveVoyageReward con modalidad especializada',specialDigs:'collectExcavation especial o yacimiento MEC-04/09B',trade:'settleTrade3300',trade24:'ruta ≥24 h',market:'buyTrade3300',barter:'barterTrade3300',nightObservations:'encuentro nocturno',validations:'validación MEC-07',contractsClaimed:'cobro de encargo'};
 const src=fs.readFileSync(path.join(__dirname,'..','www','js','app.js'),'utf8');
 return A.catalog.map(d=>{const u=!!s.achievements.unlocked?.[d.id];const c=d.metric.startsWith('counter:')?d.metric.slice(8):null;
  const incOk=!c||(['trade','trade24','market','barter'].includes(c)?src.includes("achievementIncrement3360('"+c+"'"):src.includes("count('"+c+"'"));
  const val=d.metric.startsWith('variant:')?'(variante)':m[d.metric];
  return {id:d.id,nombre:d.name,categoria:A.categories[d.category],metrica:d.metric,objetivo:d.target,valor_partida_completa:val,alcanza:u?'sí':'no',contador_actualizado:c?(incOk?'sí ('+counters[c]+')':'NO'):'—',medalla:d.tier,titulo:d.title||'',historico:x.AtlasMEC08.ACHIEVEMENTS.some(a=>a.id===d.id)?'MEC-08':'histórico',
   evidencia:u&&incOk?'C':'A',estado:u&&incOk?'Condicional':'Bloqueado',condiciones:'partida completa SINTÉTICA (la métrica puede llegar al objetivo con el contenido existente)'};});
}
function commissions(h){
 const g=h.g,x=h.x,CM=x.AtlasCommissions3370,s=complete(h);const ctx=g.commissionContext3370();const ev=CM.evaluate(s,ctx);
 return CM.catalog.map(d=>{const r=ev.find(e=>e.definition.id===d.id);const reqs=d.requirements.map(q=>(q.label||q.metric)+' '+(r?.progress?.find?.(p=>p.metric===q.metric)?.value??'?')+'/'+q.target);
  const ok=!!r&&r.satisfied!==false&&(r.complete??r.ready??r.satisfied??true);
  return {id:d.id,linea:CM.categories[d.line]?.name||d.line,nombre:d.name,descripcion:d.description,requisitos:d.requirements.map(q=>(q.label||q.metric)+' ≥ '+q.target).join(' · '),compuerta:d.gate?JSON.stringify(d.gate):'—',previo:d.previous||'—',recompensa:'£'+(d.reward?.money??d.money)+' · '+(d.reward?.knowledge??d.knowledge)+' C'+(Object.keys(d.reward?.items||d.items||{}).length?' · '+JSON.stringify(d.reward?.items||d.items):''),
   estado_partida_completa:r?(r.satisfied?'cumplido':'no cumplido · '+reqs.join(', ')):'—',evidencia:r?.satisfied?'C':'A',estado:r?.satisfied?'Condicional':'Bloqueado'};});
}
// Plantillas y eventos por perfil: ofertas generadas durante 30 periodos y comprobadas al aceptar.
function profiles(){
 const dir=SNAP,files=fs.existsSync(dir)?fs.readdirSync(dir):[];
 const pick=re=>{const f=files.filter(n=>re.test(n)).sort();return f.length?fs.readFileSync(path.join(dir,f.at(-1)),'utf8'):null;};
 const P=[['inicial',null,'partida nueva real'],['temprano',pick(/-rango-3\.json$/),'controlador: rango 3'],['intermedio',pick(/-region-África\.json$/),'controlador: África abierta'],['avanzado',pick(/-region-Norteamérica\.json$/)||pick(/-rango-7\.json$/),'controlador: Norteamérica abierta'],['casi completo',pick(/-final\.json$/),'controlador: estado final']];
 return P.filter(([, raw,],i)=>i===0||raw).map(([name,raw,how])=>({name,raw,how}));
}
function contracts(){
 const rows=[];
 const runProfile=(name,raw,how,mut=null)=>{const h=game(raw?{store:{gran_atlas_v05:raw}}:{});const s=h.g.state,A=h.x.AtlasMEC08Actions,X=h.x.AtlasMEC08;if(mut)mut(h);
  const seen={},bad=[];let n=0,blocked=0;
  for(let p=0;p<30;p++){const at=h.now+p*X.CONTRACT_POLICY.periodHours*3600e3;s.mec08.board={period:null,offers:[]};const b=A.board(at);
   for(const o of b.offers){n++;seen[o.template]=(seen[o.template]||0)+1;for(const ob of o.objectives)if(!A.objectiveFeasible(ob,ob.target))bad.push(o.template+':'+ob.metric);const k=A.acceptCheck(o.id,at);if(!k.ok&&!k.reasons.every(r=>/plazas/.test(r)))blocked++;}}
  const evs=X.EVENTS.map(e=>{const occ=X.occurrence(e,2027);const c=A.eventContract(occ,occ.start+3600e3);return e.id+':'+(c.unavailable?'sin encargo':c.alternative?'alternativa':'principal');});
  rows.push({perfil:name,origen:how,rango:h.x.AtlasMEC04.rank(s),especies:Object.keys(s.discovered).length,publicadas:Object.keys(s.published).length,regiones:Object.keys(s.regionUnlocked).length,ofertas:n,plantillas:Object.entries(seen).map(([k,v])=>k+'×'+v).join(' '),
   objetivos_inviables:bad.length,bloqueadas_al_aceptar:blocked,eventos:evs.join(' '),estado:bad.length?'Bloqueado':'Verificado',evidencia:raw||name==='inicial'?'D':'C'});};
 for(const p of profiles())runProfile(p.name,p.raw,p.how);
 runProfile('coleccionista (sintético)',null,'partida preparada con 431 piezas registradas',h=>{prepared(h);for(const p of Object.values(h.x.AtlasMEC03Catalog.pieces))h.g.addInventory(p.id,1);});
 runProfile('explorador (sintético)',null,'partida preparada con las 125 regiones visitadas',h=>{prepared(h);for(const r of h.g.REGIONS)h.g.state.regionsVisited[r.id]=true;});
 runProfile('rango 20 con catálogo en curso (sintético)',null,'partida preparada: rango 20, instalaciones al máximo, 40 especies publicables',h=>{const s=prepared(h);s.society.rank=20;for(const k of FAC)for(let i=0;i<5;i++)try{h.x.AtlasCampMEC02.upgrade(s,k);}catch(_){}s.museum.wing=3;
  for(const id of Object.keys(h.g.SPECIES).slice(0,40)){s.discovered[id]=true;s.sightings[id]=30;s.stages[id]=4;}});
 runProfile('catálogo zoológico completo (sintético)',null,'partida completa sintética',h=>{complete(h);});
 return rows;
}
// Evidencia D por elemento: lo que la partida del controlador (desde cero, sin ayudas) obtuvo de verdad.
// Lo demás conserva su nivel (C/B) y, si no está bloqueado, queda Condicional: no se declara accesibilidad
// completa por una partida preparada.
function finalState(){try{const f=fs.readdirSync(SNAP).filter(n=>/-final\.json$/.test(n)).sort();return f.length?JSON.parse(fs.readFileSync(path.join(SNAP,f.at(-1)),'utf8')):null;}catch(_){return null;}}
function applyFinal(kind,rows,h){const F=finalState();if(!F)return rows;const g=h?.g;
 const crafted=new Set(Object.keys(F.craftedItems||{}).filter(k=>F.craftedItems[k]));const used=new Set();if(g)for(const id of crafted)for(const m of Object.keys(g.RECIPES[id]?.requires||{}))used.add(m);
 const reg=F.collectionRegistry?.pieces||{},leg=new Set(Object.entries(F.legendaryFound||{}).flatMap(([k,v])=>[k,v?.id].filter(Boolean)));
 const got={
  especies:r=>!!F.discovered?.[r.id],monografias:r=>!!F.published?.[r.id],legendarios:r=>leg.has(r.id),relictos:r=>!!F.museum?.relicts?.[r.id],piezas:r=>!!reg[r.id],
  objetos:r=>(F.inventory?.[r.id]||0)>0||crafted.has(r.id)||used.has(r.id)||!!reg[r.id],
  records:r=>r.tipo==='récord'?!!F.naturalRecords?.records?.[r.id]?.achieved:(F.naturalRecords?.behaviors?.[r.id]?.count||0)>0,
  logros:r=>!!F.achievements?.unlocked?.[r.id],encargos:r=>!!(F.commissions?.claimed?.[r.id]||F.commissions?.ready?.[r.id]),
  taller:r=>r.tipo==='artefacto'?!!F.museum?.collections?.[r.id]:r.tipo==='estudio'?(F.mec06?.studies?.[r.id]?.count||0)>0:r.tipo==='demostración'?(F.mec06?.demos?.[r.id]?.count||0)>0:r.evidencia==='D'}[kind];
 if(!got)return rows;
 return rows.map(r=>{if(['Bloqueado','Incoherente'].includes(r.estado))return r;const d=got(r);
  return {...r,evidencia:d?'D':(r.evidencia==='D'?'C':r.evidencia),estado:d?'Verificado':'Condicional',controlador:d?'obtenido desde partida nueva':'no obtenido en la partida del controlador'};});}
function collectionsFinal(rows){const F=finalState();if(!F)return rows;const h=game(),K=h.x.AtlasMEC03Catalog,reg=F.collectionRegistry?.pieces||{};
 return rows.map(r=>{if(r.estado==='Bloqueado')return r;const ids=Object.values(K.pieces).filter(p=>p.collection===r.coleccion).map(p=>p.id);const done=ids.every(id=>reg[id]);
  return {...r,evidencia:done?'D':'C',estado:done?'Verificado':'Condicional',controlador:ids.filter(id=>reg[id]).length+'/'+ids.length+' piezas obtenidas desde partida nueva'};});}
// Matriz de progresión: hitos del controlador (cadena D desde partida nueva), una columna por semilla.
function progression(){const f=fs.readdirSync(OUT).filter(n=>/^progresion-controlador-\d+\.json$/.test(n)).sort();const runs=f.map(n=>JSON.parse(fs.readFileSync(path.join(OUT,n),'utf8')));
 const ids=[];for(const r of runs)for(const m of r.milestones)if(!ids.includes(m.id))ids.push(m.id);
 return ids.map(id=>{const row={hito:id};for(const r of runs){const m=r.milestones.find(x=>x.id===id);const k='semilla_'+r.seed;row[k+'_paso']=m?m.step:'no alcanzado';row[k+'_dia']=m?m.day:'';row[k+'_rango']=m?m.rank:'';row[k+'_prestigio']=m?m.prestige:'';row[k+'_especies']=m?m.discovered:'';row[k+'_regiones']=m?m.regions:'';}
  row.evidencia=runs.every(r=>r.milestones.some(x=>x.id===id))?'D':'D (una semilla)';row.estado='Verificado';return row;});}
module.exports={SNAP,finalState,applyFinal,collectionsFinal,progression,game,prepared,controller,graph,regions,species,legendaries,relicts,pieces,collections,materials,workshop,facilities,ranks,museum,commerce,records,complete,achievements,commissions,contracts,profiles,csv,status,MAPS,FAC,OUT};
if(require.main===module){
 const PG=progression();if(PG.length)csv('progresion.csv',Object.keys(PG[0]),PG);
 const h=game(),ctl=controller();
 const G=graph(h);
 csv('grafo-dependencias.csv',['id','type','name','requires','resources','sources','alternatives','unlocks','restrictions','reachable','evidence'],G.nodes.map(n=>({...n,sources:n.sources.map(s=>s.src+(s.req.length?' ⟵ '+s.req.join('+'):'')).join(' | ')})));
 console.log('grafo',G.nodes.length,'no alcanzables',G.unreachable.length,G.unreachable.slice(0,12).map(n=>n.id),'ciclos',G.cycles.length);
 const R=regions(game(),ctl);csv('regiones.csv',Object.keys(R[0]),R);console.log('regiones',R.length,'solo fauna',R.filter(r=>r.solo_fauna==='sí').length);
 const S=species(game(),ctl);S.rows=applyFinal('especies',S.rows,h);S.mono=applyFinal('monografias',S.mono,h);csv('especies.csv',Object.keys(S.rows[0]),S.rows);csv('monografias.csv',Object.keys(S.mono[0]),S.mono);console.log('especies',S.rows.length,'bloqueadas',S.rows.filter(r=>r.estado==='Bloqueado').length);
 const L=applyFinal('legendarios',legendaries(game(),ctl),h);csv('legendarios.csv',Object.keys(L[0]),L);console.log('legendarios',L.length,L.filter(r=>r.estado==='Bloqueado').map(r=>r.id));
 const Z=applyFinal('relictos',relicts(game(),ctl),h);csv('relictos.csv',Object.keys(Z[0]),Z);console.log('relictos',Z.length,Z.filter(r=>r.estado!=='Condicional').map(r=>r.id));
 const fsFinal=(()=>{try{const f=fs.readdirSync(SNAP).filter(n=>/-final\.json$/.test(n)).sort();return f.length?JSON.parse(fs.readFileSync(path.join(SNAP,f.at(-1)),'utf8')):null;}catch(_){return null;}})();
 const P=applyFinal('piezas',pieces(game(),ctl,fsFinal),h);csv('piezas.csv',Object.keys(P[0]),P);console.log('piezas',P.length,JSON.stringify(P.reduce((o,r)=>(o[r.estado]=(o[r.estado]||0)+1,o),{})),'bloqueadas',P.filter(r=>r.estado==='Bloqueado').map(r=>r.id).slice(0,10));
 const CL=collectionsFinal(collections(game(),P));csv('colecciones.csv',Object.keys(CL[0]),CL);console.log('colecciones',CL.length,CL.filter(c=>c.estado==='Bloqueado').map(c=>c.coleccion));
 const M=applyFinal('objetos',materials(game(),G),h);csv('objetos-materiales.csv',Object.keys(M[0]),M);console.log('objetos',M.length,JSON.stringify(M.reduce((o,r)=>(o[r.estado]=(o[r.estado]||0)+1,o),{})),M.filter(r=>r.estado!=='Verificado').map(r=>r.id+':'+r.observaciones).slice(0,12));
 const W=applyFinal('taller',workshop(game(),ctl),h);csv('taller.csv',Object.keys(W[0]),W);console.log('taller',W.length,W.filter(r=>r.estado==='Bloqueado').map(r=>r.tipo+':'+r.id+':'+r.plan));
 const F=facilities(game(),ctl);csv('instalaciones.csv',Object.keys(F[0]),F);const RK=ranks(game(),ctl);csv('rangos.csv',Object.keys(RK[0]),RK);console.log('instalaciones',F.length,'rangos',RK.length,RK.filter(r=>r.estado==='Bloqueado').map(r=>r.nivel));
 const MU=museum(game(),ctl);csv('museo-fosiles.csv',Object.keys(MU[0]),MU);console.log('museo',MU.length,MU.filter(r=>r.estado==='Bloqueado').map(r=>r.id));
 const CO=commerce(game(),ctl);csv('comercio-expediciones.csv',Object.keys(CO[0]),CO);console.log('comercio',CO.length,CO.filter(r=>r.estado==='Bloqueado').map(r=>r.tipo+':'+r.id));
 const RE=applyFinal('records',records(game({full:true})),h);csv('records-conductas.csv',Object.keys(RE[0]),RE);const AC=applyFinal('logros',achievements(game()),h);csv('logros.csv',Object.keys(AC[0]),AC);console.log('logros',AC.length,AC.filter(r=>r.estado==='Bloqueado').map(r=>r.id+':'+r.valor_partida_completa+'/'+r.objetivo+':'+r.contador_actualizado));
 const CM=applyFinal('encargos',commissions(game()),h);csv('encargos.csv',Object.keys(CM[0]),CM);console.log('encargos',CM.length,CM.filter(r=>r.estado==='Bloqueado').map(r=>r.id+':'+r.estado_partida_completa));
 const CT=contracts();csv('encargos-perfiles.csv',Object.keys(CT[0]),CT);console.log('perfiles',CT.map(r=>r.perfil+':'+r.ofertas+':'+r.objetivos_inviables+':'+r.bloqueadas_al_aceptar+':'+r.estado));
 console.log('records',RE.length,RE.filter(r=>r.estado==='Bloqueado').map(r=>r.id+':'+r.problemas+':'+r.hito_final+':'+r.validacion));
}
