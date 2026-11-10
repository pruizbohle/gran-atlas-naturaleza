'use strict';
const cp=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function historical(commit,selected){const temp=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-historical-')),checkout=path.join(temp,'source');try{cp.execFileSync('git',['worktree','add','--detach',checkout,commit],{cwd:root,stdio:'inherit'});const files=selected||fs.readdirSync(checkout+'/tests').filter(f=>f.endsWith('.test.cjs')).map(f=>'tests/'+f);console.log('Historical runtime:',commit);cp.execFileSync(process.execPath,['--test',...files],{cwd:checkout,stdio:'inherit'});}finally{try{cp.execFileSync('git',['worktree','remove','--force',checkout],{cwd:root,stdio:'inherit'});}finally{fs.rmSync(temp,{recursive:true,force:true});}}}
historical('33c99b3'); // 430 exact 3.30.0 tests, unchanged expectations and source.
historical('043a9e5',['tests/polar-v3310.test.cjs']); // 11 exact 3.31.0 production tests.
historical('28deed5',['tests/marine-v3320.test.cjs']); // 12 exact3.32 production checks.
console.log('Current production runtime: 3.33.0');
cp.execFileSync(process.execPath,['--test','tests/deep-v3330.test.cjs'],{cwd:root,stdio:'inherit'});
