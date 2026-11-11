'use strict';const cp=require('node:child_process');
// Retained524 suites: exact historical worktrees and unchanged current-runtime assertions.
cp.execFileSync(process.execPath,['scripts/validate-society-v3360.cjs'],{stdio:'inherit'});
console.log('ENC 3.37.0 current runtime: original13, new24, chains, claims, migration and playability');
cp.execFileSync(process.execPath,['--test','tests/enc3370-baseline.test.cjs','tests/enc3370-catalog.test.cjs','tests/enc3370-state.test.cjs','tests/enc3370-ui.test.cjs','tests/enc3370-playability.test.cjs'],{stdio:'inherit'});
