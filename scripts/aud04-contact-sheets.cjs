'use strict';
// Read-only contact sheets for AUD-04; output outside production by default.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/auditoria-v501/aud04-inventario-artistico.json'),'utf8'));
const args=process.argv.slice(2);const option=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1]};const group=option('--class','all'),family=option('--family','all'),mode=option('--mode','variants');
if(!['variants','dimorphism','family'].includes(mode))throw Error('mode: variants, dimorphism or family');
const out=path.resolve(option('--out',path.join(os.tmpdir(),'atlas-aud04-'+mode+'.html')));
const production=path.join(root,'www');if(out===production||out.startsWith(production+path.sep))throw Error('Output must stay outside production www');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const asset=(file,size)=>pathToFileURL(path.join(root,'www/naturalist-art/plates',size===512?'':String(size),file)).href;
const plate=(file,label)=>file?'<div class="plate"><strong>'+esc(label)+'</strong>'+[64,128].map(size=>'<div class="pair"><figure class="light"><img src="'+esc(asset(file,size))+'" width="'+size+'" height="'+size+'" loading="lazy"></figure><figure class="dark"><img src="'+esc(asset(file,size))+'" width="'+size+'" height="'+size+'" loading="lazy"></figure></div>').join('')+'<a href="'+esc(asset(file,512))+'">Original 512</a></div>':'';
const csv=JSON.parse(fs.readFileSync(path.join(root,'docs/cientifica-v496/inventario-auditoria-v50.json'),'utf8'));
const specimens=csv.specimens.filter(s=>(group==='all'||s.className===group)&&(family==='all'||s.family===family));const variants=new Map(audit.variants.map(v=>[v.id+'/'+v.variant,v]));
const auditDir=path.join(root,'docs/auditoria-v501');
for(const name of fs.readdirSync(auditDir).filter(name=>/^aud04-.*\.json$/.test(name)&&name!=='aud04-inventario-artistico.json').sort()){
 const review=JSON.parse(fs.readFileSync(path.join(auditDir,name),'utf8'));
 for(const row of review.variants||[]){
  if(row.status&&row.finding)variants.set(row.id+'/'+row.variant,{visualState:row.status,observation:row.finding});
 }
}
const current=path.join(root,'docs/arte-v507/inventario-aud04.json');
if(fs.existsSync(current)){
 for(const row of JSON.parse(fs.readFileSync(current,'utf8')).variants)variants.set(row.id+'/'+row.variant,row);
}
const dimorphism=new Map(audit.dimorphism.map(v=>[v.id,v]));const selected=specimens.filter(s=>mode==='family'||(mode==='variants'?s.routes.albino||s.routes.melanico:s.routes.male&&s.routes.female));
const grouped=new Map();for(const s of selected.sort((a,b)=>a.family.localeCompare(b.family)||a.latin.localeCompare(b.latin))){let list=grouped.get(s.family)||[];list.push(s);grouped.set(s.family,list);}
const sections=[...grouped].map(([f,list])=>'<section><h2>'+esc(f)+' · '+list.length+'</h2>'+list.map(s=>{let keys=mode==='variants'?['normal','albino','melanico']:mode==='dimorphism'?['normal','male','female']:['normal'];return '<article><h3>'+esc(s.latin)+'</h3><small>'+esc(s.id)+' · '+esc(s.className)+'</small><div class="plates">'+keys.map(k=>plate(s.routes[k],k+(variants.get(s.id+'/'+k)?' · '+variants.get(s.id+'/'+k).visualState:''))).join('')+'</div>'+keys.flatMap(k=>{const v=variants.get(s.id+'/'+k);return v?.observation?['<p>'+esc(k)+': '+esc(v.observation)+'</p>']:[]}).join('')+(mode==='dimorphism'?'<p>Rutas compartidas: '+esc(JSON.stringify(dimorphism.get(s.id)?.shared||{}))+'</p>':'')+'</article>'}).join('')+'</section>').join('');
const html='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AUD-04 · '+esc(mode)+'</title><style>body{font:15px system-ui,sans-serif;background:#f4efe4;color:#332d24;margin:24px}section{margin:24px 0}article{border:1px solid #c7bdac;padding:14px;margin:12px 0;background:#fffdf7;break-inside:avoid}h3,p{margin:8px 0}.plates,.pair{display:flex;flex-wrap:wrap;gap:8px}.plate{min-width:270px}.pair figure{margin:4px 0;display:grid;place-items:center;width:128px;height:128px}.light{background:#eee5d1}.dark{background:#24343b}img{object-fit:contain}a{color:#385d76}</style><h1>AUD-04 · '+esc(mode)+'</h1><p>'+selected.length+' fichas · '+grouped.size+' familias · 64/128 px sobre fondo claro y oscuro; original 512 enlazado. La presencia de una lámina no acredita aprobación visual.</p>'+sections+'</html>';
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);console.log(out);
