'use strict';
const cp=require('node:child_process');
// Historical suites use exact original worktrees; retained integration suites use current files.
cp.execFileSync(process.execPath,['scripts/validate-world-v3350.cjs'],{stdio:'inherit'});
console.log('ACH 3.36.0 current runtime: catalogue, migration, Society UI and all80 attainable witnesses');
cp.execFileSync(process.execPath,['--test','tests/ach3360-catalog.test.cjs','tests/ach3360-runtime.test.cjs','tests/ach3360-ui.test.cjs','tests/ach3360-attainability.test.cjs'],{stdio:'inherit'});
