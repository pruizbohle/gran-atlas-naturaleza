'use strict';
const cp=require('node:child_process');
// Keep566 reference tests unchanged:473 exact historical runtimes and93 current.
cp.execFileSync(process.execPath,['scripts/validate-museum-curation-v3380.cjs'],{stdio:'inherit'});
console.log('LOG3.39.0 current runtime: contracts, sources, economics, manifests, receipts, rollback and original economy');
cp.execFileSync(process.execPath,['--test','tests/log3390-contracts.test.cjs','tests/log3390-persistence.test.cjs','tests/log3390-integrity.test.cjs'],{stdio:'inherit'});
