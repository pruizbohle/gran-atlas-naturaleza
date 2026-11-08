'use strict';
const fs=require('node:fs'),{chromium}=require('playwright'),{catalog,style}=require('./review-northamerica-v3221.cjs');
(async()=>{const c=catalog(),a=c.AtlasNorthReview,b=c.AtlasNorthBefore3221,ids=[...new Set(a.regions.flatMap(r=>r.species))],dir='docs/norteamerica-v3221',browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:1360,height:900}}),counts={};
for(const [key,match,skins] of [
 ['albinos',id=>a.species[id].special.includes('Albino'),['normal','albino']],['melanics',id=>a.species[id].special.includes('Melánico'),['normal','melanico']],
 ['dimorphism',id=>!!a.dimorphism[id],['male','female']],['epic-exceptional',id=>a.categories[id]?.some(c=>['Épico','Excepcional'].includes(c)),['normal','epico','excepcional']],
 ['before-after',id=>a.species[id].origin==='na3220'&&a.sprite(id)!==b.sprite(id),['before','after']],
 ['similar-morphologies',id=>['Cervidae','Antilocapridae','Canidae','Felidae','Mephitidae','Procyonidae','Trochilidae','Psittacidae','Viperidae','Ambystomatidae','Emydidae','Testudinidae'].includes(require('../docs/norteamerica-v3221/art-audit.json').find(r=>r.id===id).family),['normal']]
]){const rows=ids.filter(match);counts[key]=rows.length;let checks=0;
const html='<style>'+style+'.grid{grid-template-columns:repeat(6,1fr)}.pair svg{width:92px;height:92px}</style><h1>Norteamérica 3.22.1 · '+key+' · '+rows.length+' identidades</h1><div class="grid">'+rows.map(id=>'<article class="card paircard"><div class="pair">'+skins.filter(s=>!['epico','excepcional'].includes(s)||a.categories[id]?.includes(s==='epico'?'Épico':'Excepcional')).map(s=>{const svg=s==='before'?b.sprite(id):['male','female'].includes(s)?a.sprite(id,'normal',s):a.sprite(id,s==='after'?'normal':s);checks++;return '<div>'+svg+'<small>'+s+'</small></div>';}).join('')+'</div><p>'+a.species[id].name+'</p><p class="latin">'+a.species[id].latin+'</p></article>').join('')+'</div>';
await page.setContent(html);const invalid=await page.locator('svg').evaluateAll(s=>s.filter(el=>!el.getBBox().width||!el.getBBox().height).length);if(invalid)throw Error('Empty rendering '+key);await page.screenshot({path:dir+'/'+key+'.png',fullPage:true});counts[key+'SVGs']=checks;}
fs.writeFileSync(dir+'/variant-evidence.json',JSON.stringify(counts,null,2)+'\n');console.log(counts);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
