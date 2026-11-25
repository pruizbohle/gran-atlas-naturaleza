'use strict';
// MEC-09D · Diferencias aprobadas posteriores a cada entrega, normalizadas de forma explícita y acotada.
// Las pruebas históricas que comparan catálogos con la revisión de su entrega siguen exigiendo
// igualdad exacta en todo lo demás. Cada excepción está documentada en docs/mec09d/matriz-221.csv.
//
// 1. Especies: la variante Melánico del oso negro asiático (asia_esp_0523) se sustituyó por Albino
//    (commit eaeb392, «Replace the Tibetan bear morph»); los avistamientos melánicos guardados se
//    muestran como «Melánico (histórico)». Ningún otro campo de especie cambia.
// 2. Investigación: INV 3.40 deja de consumir el Mapa de Asia (asia_1.reqItemConsume=false) y amplía
//    textos descriptivos (cartografía permanente, prospecciones de relictos). Costes, requisitos,
//    objetos exigidos y efectos se siguen comparando exactos.
// 3. Catálogos con clave (ITEMS, RECIPES, rutas, expediciones): las entradas existentes deben ser
//    idénticas; las entradas nuevas de etapas posteriores (mapas INV 3.40, objetos regionales,
//    expediciones y yacimientos MEC-09B) son aditivas.
const json=x=>JSON.parse(JSON.stringify(x));
const BEAR='asia_esp_0523';
function species(current,old,id){const x=json(current),y=json(old);if(id===BEAR&&x&&y){if(JSON.stringify(x.special)!==JSON.stringify(['Albino','Notable']))throw new Error('asia_esp_0523: variante aprobada inesperada');delete x.special;delete y.special;}return [x,y];}
function speciesCatalog(assert,current,old){for(const[id,s]of Object.entries(old)){const[x,y]=species(current[id],s,id);assert.deepEqual(x,y,id);}}
function research(list){return json(list).map(n=>{delete n.desc;if(n.id==='asia_1')delete n.reqItemConsume;return n;});}
function researchPrefix(assert,current,old){assert.deepEqual(research(current.slice(0,old.length)),research(old));assert.deepEqual(json(current.slice(0,old.length).map(n=>String(n.effect))),json(old.map(n=>String(n.effect))));}
function keyed(assert,current,old,label){const x=json(current),y=json(old);if(Array.isArray(y)){const ids=new Set(y.map(e=>e.id));assert.deepEqual(x.filter(e=>ids.has(e.id)),y,label);}else for(const id of Object.keys(y))assert.deepEqual(x[id],y[id],label+' '+id);}
// same(assert,key,actual,expected): comparación por clase de catálogo con las excepciones anteriores.
function same(assert,key,current,old,label=key){
 if(key==='SPECIES'){assert.deepEqual(Object.keys(current).sort(),Object.keys(old).sort(),label+' ids');speciesCatalog(assert,current,old);return;}
 if(key==='RESEARCH_NODES'){researchPrefix(assert,current,old);return;}
 if(key==='CONTINENT_RULES3300'){for(const[c,r]of Object.entries(old)){const x=json(current[c]);if(x&&x.cartography!==undefined&&json(r).cartography===undefined)delete x.cartography;assert.deepEqual(x,json(r),label+' '+c);}return;}
 if(current&&typeof current==='object'&&old&&typeof old==='object'){keyed(assert,current,old,label);return;}
 assert.deepEqual(json(current),json(old),label);
}
// 4. Tasas de espécimen: LEG-02 (7cd5110, treinta legendarios únicos) añade la categoría Legendario a las
//    especies de LEGENDARY_SPECIMENS que aún no la tenían. Las demás categorías y tasas son exactas.
let legendCache=null;function legendIds(g){if(g&&g.LEGENDARY_SPECIMENS)return new Set(g.LEGENDARY_SPECIMENS.map(l=>l.speciesId));if(!legendCache)legendCache=new Set(require('./live-game.cjs').harness().window.__atlasTest.LEGENDARY_SPECIMENS.map(l=>l.speciesId));return legendCache;}
function rates(assert,g,id,current,old){const x=json(current),y=json(old);if(x.Legendario!==undefined&&y.Legendario===undefined){const legend=legendIds(g);assert.ok(legend.has(id),id+': Legendario solo en especies legendarias LEG-02');assert.equal(x.Legendario,0.0001,id);delete x.Legendario;}assert.deepEqual(x,y,id);}
// 5. Libro de ingresos MEC-01 (769477a): los abonos de dinero pasan por earnMoney(n,fuente), que suma
//    exactamente n a state.money y solo registra la procedencia. ledger() devuelve la forma anterior.
const EARN=/function earnMoney\(amount,source\)\{const n=Number\(amount\);if\(!Number\.isFinite\(n\)\|\|n<=0\)return 0;state\.money\+=n;globalThis\.AtlasMEC01\?\.credit\(state,n,source\);return n;\}/;
function ledger(src){return String(src).replace(/earnMoney\(([^,()]+),'[a-z]+'\);/g,'state.money+=$1;');}
function earnMoneyIsExact(assert,appSource){assert.match(appSource,EARN,'earnMoney suma exactamente el importe');}
// 6. MEC-08 (e930fad) hizo extensibles los módulos de logros y encargos sin cambiar sus definiciones:
//    se comparan las definiciones exportadas (id, métrica, objetivo, premio…) en lugar de los bytes.
function moduleCatalog(assert,file,currentSource,oldSource){const name=/achievements/.test(file)?'AtlasAchievements3360':'AtlasCommissions3370';const load=src=>{const c={};c.globalThis=c;require('node:vm').runInNewContext(src,c);return c[name].catalog;};const cur=json(load(currentSource)),old=json(load(oldSource));assert.equal(cur.length,old.length,file);assert.deepEqual(cur,old,file);}
// 7. MUSEUM_RELICTS se rediseñó en 03bf329: veinte relictos de descubrimiento solo en Campo.
function relictShape(assert,relicts){assert.equal(relicts.length,20);assert.equal(new Set(relicts.map(r=>r.id)).size,20);for(const r of relicts)assert.ok(r.name&&r.latin&&r.region&&r.habitats.length&&r.times.length&&r.locality&&r.habitatDetail,r.id);}
module.exports={json,species,speciesCatalog,research,researchPrefix,keyed,same,rates,ledger,earnMoneyIsExact,moduleCatalog,relictShape,BEAR};
