'use strict';
const cp=require('node:child_process');
// Exact historical runtimes/expectations plus the twenty existing current checks.
cp.execFileSync(process.execPath,['scripts/validate-abyssal-v3340.cjs'],{stdio:'inherit'});
console.log('GM05 current production checks: integridad, economía, arte y compatibilidad');
cp.execFileSync(process.execPath,['--test','tests/gm05-integrity.test.cjs','tests/gm05-economy.test.cjs','tests/gm05-art.test.cjs','tests/gm05-compatibility.test.cjs'],{stdio:'inherit'});
