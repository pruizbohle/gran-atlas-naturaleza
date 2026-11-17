'use strict';
const cp=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-3430-reference-')),checkout=path.join(temporary,'source');
try{
 cp.execFileSync('git',['worktree','add','--detach',checkout,'41a4bbdc90a16ebdb612f67591ea6e2dd9dfe259'],{cwd:root,stdio:'inherit'});
 console.log('REFERENCE: unchanged 3.43.0 release verification, including historical 3.42.0 contracts.');
 cp.execFileSync('npm',['run','release:verify'],{cwd:checkout,stdio:'inherit'});
}finally{try{cp.execFileSync('git',['worktree','remove','--force',checkout],{cwd:root,stdio:'inherit'});}finally{fs.rmSync(temporary,{recursive:true,force:true});}}
console.log('CURRENT: GM06 catalog, geography, art, continuity and native backup compatibility.');
cp.execFileSync(process.execPath,['--test','tests/gm06.test.cjs','tests/gm06-audit.test.cjs','tests/gm06-release.test.cjs','tests/cp3430-ui.test.cjs','tests/cp3430-migrations.test.cjs','tests/and3420-save.test.cjs','tests/ux3410-compass.test.cjs','tests/ux3410-navigation.test.cjs','tests/ux3410-events.test.cjs'],{cwd:root,stdio:'inherit'});
cp.execFileSync(process.execPath,['scripts/build-gm06-release.cjs'],{cwd:root,stdio:'inherit'});
