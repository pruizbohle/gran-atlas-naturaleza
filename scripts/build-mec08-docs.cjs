'use strict';
// MEC-08 · genera las matrices de docs/mec08 desde el motor real (catálogo completo).
// Uso: node scripts/build-mec08-docs.cjs
const fs=require('node:fs'),path=require('node:path');
const {make}=require('../tests/helpers/mec01-game.cjs');
const OUT=path.join(__dirname,'..','docs','mec08');fs.mkdirSync(OUT,{recursive:true});
const h=make({now:1790000000000,headless:true,full:true}),x=h.x,X=x.AtlasMEC08,A=x.AtlasAchievements3360,C=x.AtlasCommissions3370;
const q=v=>{const s=Array.isArray(v)?v.join(' | '):v&&typeof v==='object'?JSON.stringify(v):String(v??'');return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
const csv=(file,head,rows)=>fs.writeFileSync(path.join(OUT,file),[head.join(';'),...rows.map(r=>r.map(q).join(';'))].join('\n')+'\n');
const NEW=new Set(X.ACHIEVEMENTS.map(a=>a.id));
const hist={world_unlocked:'world_unlocked_125 / visit_125',publish_945:'publish_1000',discover_900:'discover_1000'};
csv('logros.csv',['id','nombre','categoria','descripcion','metrica','objetivo','medalla','titulo','secreto','origen','politica_migracion','recompensa','arte'],
 A.catalog.map(d=>[d.id,d.name,A.categories[d.category],d.description,d.metric,d.target,d.tier,d.title||'',d.secret?'sí':'no',NEW.has(d.id)?'MEC-08':hist[d.id]?'histórico (intermedio de '+hist[d.id]+')':'histórico',d.migration||'histórico: retroactivo sin fecha original al normalizar',d.reward||'Medalla permanente',d.art||'medal-'+d.id]));
csv('medallas-titulos.csv',['id','medalla','titulo','categoria','condicion','multiplicador_economico'],A.catalog.filter(d=>d.title).map(d=>[d.id,d.tier,d.title,A.categories[d.category],d.metric+' ≥ '+d.target,'ninguno']));
csv('encargos.csv',['id','linea','nombre','descripcion','requisitos','dinero','conocimiento','objetos','previo','acceso','origen'],
 C.catalog.map(d=>[d.id,C.categories[d.line]?.name||d.line,d.name,d.description,d.requirements.map(r=>(r.label||r[2]||r.metric||r[0])+' ≥ '+(r.target??r[1])),d.reward?.money??d.money,d.reward?.knowledge??d.knowledge,d.reward?.items??d.items,d.previous||'',d.gate?JSON.stringify(d.gate):'',X.COMMISSIONS.some(c=>'enc_'+c.line+'_'+c.n===d.id)?'MEC-08':'histórico']));
const tpl=X.TEMPLATES.filter(t=>t.kind==='correspondencia'),pro=X.TEMPLATES.filter(t=>t.kind==='proyecto');
const tRow=t=>[t.id,t.name,t.description,t.objectives.map(o=>o.metric+' ('+o.mode+') '+(Array.isArray(o.target)?o.target.join('/'):o.target)),JSON.stringify(t.requires),'£'+t.reward.money+' · '+t.reward.knowledge+' conocimiento'+(t.reward.items?' · '+JSON.stringify(t.reward.items):''),t.art];
csv('plantillas.csv',['id','nombre','descripcion','objetivos (modo, objetivo por tramo de rango)','requisitos','recompensa_base','arte'],tpl.map(tRow));
csv('proyectos.csv',['id','nombre','descripcion','objetivos','requisitos','recompensa','arte'],pro.map(tRow));
const ymd=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const cal=[];for(const y of [2026,2027,2028])for(const e of X.EVENTS){const o=X.occurrence(e,y);cal.push([o.id,e.name,e.theme,y,ymd(o.start),ymd(o.end-1),e.days,e.rule.type==='equinoccio'?'equinoccio calculado (Meeus); instante UTC '+new Date(X.equinoxUTC(y,e.rule.month)).toISOString().slice(0,16):e.fictional?'fecha ficticia del Atlas':'fecha fija',e.external?'celebración externa adaptada':'propio del Atlas',e.description]);}
csv('eventos.csv',['ocurrencia','evento','tema','edicion','inicio_local','ultimo_dia','dias','regla','naturaleza','descripcion'],cal);
csv('recompensas.csv',['origen','id','dinero','conocimiento','objetos','canal','unicidad'],[
 ...X.COMMISSIONS.map(c=>['encargo permanente','enc_'+c.line+'_'+c.n,c.money,c.knowledge,c.items,'earnMoney(encargos) + inventario común','una vez (state.commissions.claimed)']),
 ...X.TEMPLATES.map(t=>[t.kind,t.id,t.reward.money,t.reward.knowledge,t.reward.items||{},'earnMoney(encargos) + addInventory','una vez por instancia (estado cobrado)']),
 ...X.EVENTS.map(e=>['evento',e.id,e.contract.reward.money,e.contract.reward.knowledge,e.contract.reward.items||{},'earnMoney(encargos) + addInventory','una vez por edición; medalla conmemorativa una vez']),
 ...X.ACHIEVEMENTS.map(a=>['logro',a.id,0,0,{},'medalla permanente','una vez; sin dinero'])]);
csv('modificadores-temporales.csv',['evento','actividad','valor','tope','capa','captura'],X.EVENTS.flatMap(e=>e.modifiers.map(m=>[e.id,m.activity,m.value,m.cap,'eventos (separada del Museo)',m.activity.startsWith('campo')?'en cada tirada de campo, mientras dura el evento':'al iniciar la actividad temporizada (snapshot)'])));
csv('arte.csv',['clase','referencia','estado'],[...X.ART.achievements.map(a=>['medalla',a,'pendiente']),...X.ART.titles.map(a=>['título',a,'pendiente']),...X.ART.commissions.map(a=>['encargo',a,'pendiente']),...X.ART.contracts.map(a=>['correspondencia/proyecto',a,'pendiente']),...X.ART.events.map(a=>['evento',a,'pendiente']),...X.ART.eventMedals.map(a=>['medalla conmemorativa',a,'pendiente'])]);
console.log(JSON.stringify({achievements:A.catalog.length,new:X.ACHIEVEMENTS.length,commissions:C.catalog.length,templates:tpl.length,projects:pro.length,events:X.EVENTS.length,calendar:cal.length}));
