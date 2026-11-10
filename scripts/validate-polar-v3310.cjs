'use strict';
// Run the 430 historical tests unchanged against their actual 3.30.0 source.
// New expansion tests run separately against the current production source.
const cp=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-3300-baseline-')),checkout=path.join(temp,'source');
try{cp.execFileSync('git',['worktree','add','--detach',checkout,'33c99b3'],{cwd:root,stdio:'inherit'});const tests=fs.readdirSync(checkout+'/tests').filter(f=>f.endsWith('.test.cjs')).map(f=>'tests/'+f);cp.execFileSync(process.execPath,['--test',...tests],{cwd:checkout,stdio:'inherit'});}finally{try{cp.execFileSync('git',['worktree','remove','--force',checkout],{cwd:root,stdio:'inherit'});}finally{fs.rmSync(temp,{recursive:true,force:true});}}
cp.execFileSync(process.execPath,['--test','tests/polar-v3310.test.cjs'],{cwd:root,stdio:'inherit'});
