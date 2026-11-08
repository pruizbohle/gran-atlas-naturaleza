'use strict';
// Only remove the additive AM-06 Bestiary UI blocks when checking historical
// whole-source fingerprints. Catalog, gameplay, art and saved-state contracts
// retain their original fixtures; the new pagination is exercised separately.
function withoutBestiaryPagination(source){return source
 .replace(/\$\{\/\* AM-06 BEGIN [^*]*\*\/[\s\S]*?\/\* AM-06 END [^*]*\*\/\}/g,'')
 .replace(/\/\* AM-06 BEGIN [^*]*\*\/[\s\S]*?\/\* AM-06 END [^*]*\*\//g,'')
 .replace(/\/\/ AM-06 BEGIN [^\n]+\n[\s\S]*?\/\/ AM-06 END [^\n]+\n/g,'');}
module.exports={withoutBestiaryPagination};
