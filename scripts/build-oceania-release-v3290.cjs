'use strict';
// Materialize a full external staging tree. Never edits checkout/public version or deploys.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {candidateGameSource,candidate}=require('../tests/helpers/oceania-review.cjs');
const ROOT=path.resolve(__dirname,'..'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function gates(){
 const blockers=candidate.pendingScientificReviews.map(name=>'scientific:'+name);
 if(!candidate.approvedForProduction)blockers.push('candidate-not-approved');
 const file=path.join(ROOT,'docs/gm02/release-validation.json');
 if(!fs.existsSync(file))blockers.push('final-release-validation-missing');
 else{
  const approval=JSON.parse(fs.readFileSync(file));
  if(approval.artValidated!==true||approval.releaseValidated!==true)blockers.push('final-validation-false');
  if(approval.runtimeSha256!==sha(fs.readFileSync(path.join(ROOT,'www/js/oceania-runtime-v3290.js')))||approval.artSha256!==sha(fs.readFileSync(path.join(ROOT,'www/js/oceania-art-v3290.js'))))blockers.push('validation-hashes-do-not-match');
 }
 return blockers;
}
function paths(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?paths(path.join(dir,e.name)):[path.join(dir,e.name)]);}
function build(output,{preview=false}={}){
 const blockers=gates();if(blockers.length&&!preview)throw Error('Release blocked: '+blockers.join(', '));
 const out=path.resolve(output),relative=path.relative(ROOT,out);
 if(out===ROOT||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Staging output must be outside repository');
 if(fs.existsSync(out))throw Error('Staging output must not exist; no destructive replacement is allowed');
 const parent=fs.realpathSync(path.dirname(out));if(parent===ROOT||parent.startsWith(ROOT+path.sep))throw Error('Output parent resolves inside repository');
 const www=path.join(out,'www');fs.mkdirSync(www,{recursive:true});fs.cpSync(path.join(ROOT,'www'),www,{recursive:true});
 let app=candidateGameSource();const marker="(function(){\nconst STORAGE_KEY=";const start=app.indexOf(marker);if(start<0)throw Error('Cannot locate production app start');app=app.slice(start);
 const literal='const oceaniaReview='+JSON.stringify(candidate)+';';if(app.split(literal).length!==2)throw Error('Candidate catalog seam changed');
 app=app.replace(literal,`const oceaniaReview=globalThis.AtlasOceaniaRuntime3290;\nif(!oceaniaReview||(!oceaniaReview.approvedForProduction&&!${preview}))throw Error('Oceanian release is not approved');`);
 app=app.replaceAll('3.28.0','3.29.0');fs.writeFileSync(path.join(www,'js/app.js'),app);
 let html=fs.readFileSync(path.join(www,'index.html'),'utf8').replaceAll('3.28.0','3.29.0').replaceAll('Expediciones del naturalista','Oceanía');
 const entry='<script src="js/app.js?v=3.29.0"></script>';
 if(!html.includes(entry))throw Error('App entry changed');
 html=html.replace(entry,['oceania-runtime-v3290','oceania-art-v3290','oceania-geography-v3290'].map(n=>'<script src="js/'+n+'.js?v=3.29.0"></script>').join('\n  ')+'\n  '+entry);
 if(preview)html=html.replace('</head>','<meta name="atlas-channel" content="unpublished-preview"></head>').replace('<body>','<body><span style="position:fixed;top:1px;left:50%;font:8px system-ui;z-index:9999;pointer-events:none;background:#eee5d1">PREVIEW NO PUBLICADA</span>');
 fs.writeFileSync(path.join(www,'index.html'),html);
 for(const file of ['js/save-manager.js','js/mobile-ui.js','js/update-client-v3212.js']){
  const p=path.join(www,file);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll('3.28.0','3.29.0').replaceAll('actualizar-v3280.html','actualizar-v3290.html'));
 }
 const update=fs.readFileSync(path.join(www,'actualizar-v3280.html'),'utf8').replaceAll('3.28.0','3.29.0').replaceAll('Expediciones del naturalista','Oceanía').replace('y 10 en Sudamérica.','10 en Sudamérica y 8 en Oceanía.');
 fs.writeFileSync(path.join(www,'actualizar-v3290.html'),update);fs.writeFileSync(path.join(www,'actualizar.html'),update);
 const release=JSON.parse(fs.readFileSync(path.join(www,'atlas-release.json')));release.version='3.29.0';release.channel=preview?'unpublished-preview':'release';release.cells.Oceanía=8;release.oceania={regions:8,taxa:97,presences:131};fs.writeFileSync(path.join(www,'atlas-release.json'),JSON.stringify(release)+'\n');
 let sw=fs.readFileSync(path.join(www,'sw.js'),'utf8');
 const oldCache=sw.match(/const CACHE='([^']+)'/)[1],revision='gran-atlas-v3.29.0-oceania-'+(preview?'preview-':'')+sha(fs.readFileSync(path.join(www,'js/oceania-art-v3290.js'))).slice(0,10);
 sw=sw.replace(oldCache,revision).replaceAll('3.28.0','3.29.0');
 const assets=['actualizar-v3290.html','js/oceania-runtime-v3290.js','js/oceania-art-v3290.js','js/oceania-geography-v3290.js','laboratorio-oceania-v3290.html','laboratorio-arte-oceania-v3290.html','js/oceania-data-v3290.js','js/lab/oceania-map-v3290.js','js/lab/oceania-catalog-v3290.js','js/lab/oceania-art-lab-v3290.js'];
 sw=sw.replace('const ASSETS=[','const ASSETS=['+assets.map(p=>JSON.stringify('./'+p)).join(',')+',');
 const auth="new URL('./actualizar-v3280.html',self.registration.scope).pathname";
 if(!sw.includes(auth))throw Error('Safe updater authorization seam changed');
 sw=sw.replace(auth,"new URL('./actualizar-v3290.html',self.registration.scope).pathname,"+auth);
 fs.writeFileSync(path.join(www,'sw.js'),sw);
 for(const asset of assets)if(!fs.existsSync(path.join(www,asset)))throw Error('Missing offline asset '+asset);
 const pkg=JSON.parse(fs.readFileSync(path.join(ROOT,'package.json')));pkg.version='3.29.0';fs.writeFileSync(path.join(out,'package.json'),JSON.stringify(pkg,null,2)+'\n');
 const cap=JSON.parse(fs.readFileSync(path.join(ROOT,'capacitor.config.json')));cap.appName='Gran Atlas Beta 3.29.0';fs.writeFileSync(path.join(out,'capacitor.config.json'),JSON.stringify(cap,null,2)+'\n');
 for(const file of ['android-native/AtlasExportPlugin.java','android-native/AtlasImportPlugin.java','scripts/install-atlas-export.py','scripts/configure-android-version.py']){fs.mkdirSync(path.dirname(path.join(out,file)),{recursive:true});fs.copyFileSync(path.join(ROOT,file),path.join(out,file));}
 const manifest={version:'3.29.0',channel:preview?'unpublished-preview':'release',approved:!blockers.length,blockers,cache:revision,sourceAppSha256:sha(fs.readFileSync(path.join(ROOT,'www/js/app.js'))),sourceRuntimeSha256:sha(fs.readFileSync(path.join(ROOT,'www/js/oceania-runtime-v3290.js'))),sourceArtSha256:sha(fs.readFileSync(path.join(ROOT,'www/js/oceania-art-v3290.js'))),files:Object.fromEntries(paths(www).sort().map(p=>[path.relative(www,p),sha(fs.readFileSync(p))]))};
 fs.writeFileSync(path.join(out,'staging-manifest.json'),JSON.stringify(manifest,null,2)+'\n');return manifest;
}
if(require.main===module){try{const args=process.argv.slice(2),output=args.find((a,i)=>args[i-1]==='--output');if(args.includes('--status'))console.log(JSON.stringify({approved:gates().length===0,blockers:gates()},null,2));else{if(!output)throw Error('Pass --output /external/new/directory and --preview for unapproved builds');console.log(JSON.stringify(build(output,{preview:args.includes('--preview')}),null,2));}}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={build,gates};
