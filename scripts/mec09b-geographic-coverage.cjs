'use strict';
// MEC-09B · Cobertura geográfica por continente antes y después de la ampliación funcional mínima.
// Uso: node scripts/mec09b-geographic-coverage.cjs → docs/mec09b/cobertura-geografica.csv
const fs=require('node:fs'),path=require('node:path');const {make}=require('../tests/helpers/mec01-game.cjs');
function coverage(){
 const h=make({headless:true,full:true}),g=h.g,K=h.x.AtlasMEC03Catalog,X=h.x.AtlasMEC09BContent;
 const isNew=id=>X.voyages.some(v=>v.id===id)||X.digSites.some(d=>d.id===id);
 const conts=[...new Set(g.REGIONS.map(r=>r.continent))];const rows=[];
 for(const c of conts){const regs=g.REGIONS.filter(r=>r.continent===c);
  const voy=g.VOYAGES.filter(v=>(K.voyageDestinations?.[v.id]?.continents||[]).includes(c));
  const digs=g.MUSEUM_DIG_SITES.filter(d=>regs.some(r=>r.id===d.region));
  rows.push({continente:c,regiones:regs.length,expediciones_antes:voy.filter(v=>!isNew(v.id)).length,expediciones_despues:voy.length,
   nuevas_expediciones:voy.filter(v=>isNew(v.id)).map(v=>v.id).join(' '),yacimientos_antes:digs.filter(d=>!isNew(d.id)).length,yacimientos_despues:digs.length,
   nuevos_yacimientos:digs.filter(d=>isNew(d.id)).map(d=>d.id).join(' '),
   regiones_por_expedicion_antes:voy.filter(v=>!isNew(v.id)).length?+(regs.length/voy.filter(v=>!isNew(v.id)).length).toFixed(1):'—',regiones_por_expedicion_despues:voy.length?+(regs.length/voy.length).toFixed(1):'—',
   carencia:[...X.voyages.filter(v=>v.destination.continents[0]===c).map(v=>v.gap),...X.digSites.filter(d=>regs.some(r=>r.id===d.region)).map(d=>d.gap)].join(' | ')||'—'});}
 return rows;
}
module.exports={coverage};
if(require.main===module){const rows=coverage(),head=Object.keys(rows[0]);
 const q=v=>{const s=String(v??'');return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 fs.writeFileSync(path.join(__dirname,'..','docs','mec09b','cobertura-geografica.csv'),[head.join(';'),...rows.map(r=>head.map(k=>q(r[k])).join(';'))].join('\n')+'\n');
 for(const r of rows)console.log(r.continente,r.regiones,r.expediciones_antes,'→',r.expediciones_despues,r.yacimientos_antes,'→',r.yacimientos_despues);}
