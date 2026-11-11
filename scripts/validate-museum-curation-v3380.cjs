'use strict';const cp=require('node:child_process');
// Retain540 unchanged assertions:473 exact historical and67 on the current runtime.
cp.execFileSync(process.execPath,['scripts/validate-commissions-v3370.cjs'],{stdio:'inherit'});
console.log('MUS 3.38.0 current runtime:12 projects, capacities, economics, ten exporters and active campaigns');
cp.execFileSync(process.execPath,['--test','tests/mus3380-baseline.test.cjs','tests/mus3380-catalog.test.cjs','tests/mus3380-state.test.cjs','tests/mus3380-ui.test.cjs','tests/mus3380-playability.test.cjs','tests/mus3380-compatibility.test.cjs'],{stdio:'inherit'});
