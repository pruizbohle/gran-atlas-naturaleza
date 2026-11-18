'use strict';
const cp=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-3440-reference-')),checkout=path.join(temporary,'source');
try{
 cp.execFileSync('git',['worktree','add','--detach',checkout,'2e0535d149ff9fd574397b78dc09bba31d16f7f3'],{cwd:root,stdio:'inherit'});
 console.log('REFERENCE: unchanged3.44.0 release verification,including historical release contracts.');
 cp.execFileSync('npm',['run','release:verify'],{cwd:checkout,stdio:'inherit'});
}finally{try{cp.execFileSync('git',['worktree','remove','--force',checkout],{cwd:root,stdio:'inherit'});}finally{fs.rmSync(temporary,{recursive:true,force:true});}}
console.log('CURRENT: M01 scoped art,final approval,offline release and save continuity.');
cp.execFileSync(process.execPath,['--test','tests/gm07-m01.test.cjs','tests/gm07-m01-release.test.cjs','tests/gm06.test.cjs','tests/gm06-audit.test.cjs','tests/cp3430-ui.test.cjs','tests/cp3430-migrations.test.cjs','tests/and3420-save.test.cjs','tests/ux3410-compass.test.cjs','tests/ux3410-navigation.test.cjs','tests/ux3410-events.test.cjs'],{cwd:root,stdio:'inherit'});
cp.execFileSync(process.execPath,['scripts/build-gm07-m01-release.cjs'],{cwd:root,stdio:'inherit'});
