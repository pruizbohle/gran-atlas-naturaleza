'use strict';
const fs=require('node:fs'),crypto=require('node:crypto');
const {catalog}=require('./load-southamerica-review-v3231.cjs');
const c=catalog(),after=c.AtlasSouthReview,before=c.AtlasSouthBefore3231,data=c.AtlasSouthAmerica3230;
const hash=svg=>crypto.createHash('sha256').update(svg).digest('hex');
// Grades, findings, corrections and approval are the maintained HUMAN visual
// review in art-audit.json. Regeneration updates fingerprints/exports only;
// a changed SVG never assigns itself a grade or an approval.
const review=JSON.parse(fs.readFileSync('docs/sudamerica-v3231/art-audit.json','utf8'));
if(review.length!==131||new Set(review.map(r=>r.id)).size!==131)throw new Error('Incomplete visual review');
const rows=review.map(row=>{
 const sp=after.species[row.id],taxon=data.taxa[row.id];
 if(!sp||!taxon||row.scientific!==sp.latin||row.family!==taxon.family||!['A','B','C','D'].includes(row.initialGrade))throw new Error('Invalid visual review: '+row.id);
 const oldSVG=before.sprite(row.id),newSVG=after.sprite(row.id);
 if(row.initialGrade==='A'&&oldSVG!==newSVG)throw new Error('An approved A profile changed: '+row.scientific);
 return {...row,beforeSha256:hash(oldSVG),afterSha256:hash(newSVG)};
});
const columns=Object.keys(rows[0]),csv=value=>/[",\n]/.test(String(value))?'"'+String(value).replace(/"/g,'""')+'"':String(value);
const files={
 'docs/sudamerica-v3231/art-audit.json':JSON.stringify(rows,null,2)+'\n',
 'docs/sudamerica-v3231/art-audit.csv':columns.join(',')+'\n'+rows.map(row=>columns.map(key=>csv(row[key])).join(',')).join('\n')+'\n',
 'www/js/lab/southamerica-audit-v3231.js':'/* AM-05 visual ledger, isolated from saves. */\nglobalThis.AtlasSouthAudit3231='+JSON.stringify(rows)+';\n'
};
for(const[file,content]of Object.entries(files))if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==content)throw new Error('Stale AM-05 audit: '+file);}else fs.writeFileSync(file,content);
console.log(rows.reduce((counts,row)=>(counts[row.initialGrade]=(counts[row.initialGrade]||0)+1,counts),{}));
