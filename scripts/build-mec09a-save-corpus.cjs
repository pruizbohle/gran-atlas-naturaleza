'use strict';
// MEC-09A · Genera partidas auténticas de versiones anteriores ejecutando el código de cada versión
// (git worktree temporal + su propio arnés) y guarda el corpus en tests/fixtures/mec09a-saves.json.
// Uso: node scripts/build-mec09a-save-corpus.cjs   (requiere el historial git local)
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),os=require('node:os');
const ROOT=path.join(__dirname,'..');
const REFS=[['5.4.0','0297658'],['5.4.2','e8e87a8'],['5.5.1','c2b0af0'],['5.6.0','main'],['MEC-01','mec-01/v5.6.1-beta'],['MEC-02','mec-02/v5.6.2-beta'],['MEC-03','mec-03/v5.6.3-beta'],['MEC-04','mec-04/v5.6.4-beta'],['MEC-05','mec-05/v5.6.5-beta'],['MEC-06','mec-06/v5.6.6-beta'],['MEC-07','mec-07/v5.6.7-beta'],['MEC-08','mec-08/v5.6.8-beta']];
const T0=1790000000000;
const bridge='\nwindow.__corpus={get state(){return state},encounter:typeof encounter==="function"?encounter:null,persist,publishMonograph:typeof publishMonograph==="function"?publishMonograph:null,setRegion:typeof setRegion==="function"?setRegion:null};\n})();';
const out=[];
for(const [label,ref] of REFS){
 const wt=fs.mkdtempSync(path.join(os.tmpdir(),'mec09a-wt-'));
 try{
  cp.execFileSync('git',['worktree','add','--detach',wt,ref],{cwd:ROOT,stdio:'ignore'});
  let now=T0,store,h,g,s,X={};
  const mecHelper=path.join(wt,'tests/helpers/mec01-game.cjs');
  if(fs.existsSync(mecHelper)){h=require(mecHelper).make({now:T0,headless:true});store=h.store;g=h.g;s=g.state;X=h.x||{};h.window.confirm=()=>true;
   Object.defineProperty(g,'__now',{value:v=>{h.now=v;}});}
  else{const {harness}=require(path.join(wt,'tests/helpers/live-game.cjs'));const Clock=class extends Date{constructor(...a){super(...(a.length?a:[now]));}static now(){return now;}};
   store={};h=harness(store,null,{bridge,Date:Clock});g=h.window.__corpus;s=g.state;}
  const setNow=v=>{now=v;if(g.__now)g.__now(v);};
  let seed=7;const R=Math.random;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  try{s.money+=1500;s.knowledge+=900;s.prestige+=40;for(let i=0;i<60;i++){setNow(now+61e3);g.encounter('manual',now,true);}
   s.inventory.brass_shard=(s.inventory.brass_shard||0)+5;s.inventory.river_pebble=(s.inventory.river_pebble||0)+3;
   const pieces=X.AtlasMEC03Catalog?.pieces||X.AtlasBeta560Actions?.catalog?.items;const pid=pieces?(pieces instanceof Map?[...pieces.keys()][0]:Object.keys(pieces)[0]):null;if(pid&&g.addInventory)g.addInventory(pid,2);
   if(X.AtlasCampMEC02?.upgrade){s.money+=1e5;s.knowledge+=1e5;for(const m of ['brass_shard','polished_lens','carved_wood','map_fragment','parchment_scrap','old_ink','river_pebble','ancient_coin'])s.inventory[m]=(s.inventory[m]||0)+50;try{X.AtlasCampMEC02.upgrade(s,'workshop');}catch(_){}}
   if(X.AtlasMEC08Actions?.board){const b=X.AtlasMEC08Actions.board(now);const o=b.offers[0];if(o)X.AtlasMEC08Actions.accept(o.id,now);if(X.AtlasMEC08Actions.acceptEvent){const occ=X.AtlasMEC08Actions.eventsNow(now)[0];if(occ)X.AtlasMEC08Actions.acceptEvent(occ.id,now);}}
   g.persist();}finally{Math.random=R;}
  const raw=store.gran_atlas_v05;if(!raw)throw Error('sin guardado en '+label);
  const st=JSON.parse(raw);
  const facts={money:Math.floor(st.money),knowledge:Math.floor(st.knowledge),prestige:Math.floor(st.prestige),
   discovered:Object.values(st.discovered||{}).filter(Boolean).length,sightings:Object.values(st.sightings||{}).reduce((a,b)=>a+(Number(b)||0),0),
   published:Object.values(st.published||{}).filter(Boolean).length,inventory:{brass_shard:st.inventory?.brass_shard||0,river_pebble:st.inventory?.river_pebble||0},
   purchases:Object.keys(st.purchases||{}).length,regionsUnlocked:Object.values(st.regionUnlocked||{}).filter(Boolean).length,
   registryPieces:Object.keys(st.collectionRegistry?.pieces||{}).length,achievements:Object.keys(st.achievements?.unlocked||{}).length,
   contracts:(st.mec08?.contracts||[]).length,naturalRecords:Object.keys(st.naturalRecords?.records||{}).length,camp:st.camp?.levels||null,rank:st.society?.rank??null};
  out.push({label,ref,commit:cp.execFileSync('git',['rev-parse','--short',ref],{cwd:ROOT}).toString().trim(),raw,facts});
  console.log(label,JSON.stringify(facts));
 }catch(e){console.log('ERROR',label,e.message.split('\n')[0]);}
 finally{try{cp.execFileSync('git',['worktree','remove','--force',wt],{cwd:ROOT,stdio:'ignore'});}catch(_){}}
}
fs.writeFileSync(path.join(ROOT,'tests/fixtures/mec09a-saves.json'),JSON.stringify(out,null,1)+'\n');
