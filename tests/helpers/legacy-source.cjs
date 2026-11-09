'use strict';
// Only remove the additive AM-06 Bestiary UI blocks when checking historical
// whole-source fingerprints. Catalog, gameplay, art and saved-state contracts
// retain their original fixtures; the new pagination is exercised separately.
function withoutBestiaryPagination(source){return withoutJournalPresentation(source)
 .replace(/\$\{\/\* AM-06 BEGIN [^*]*\*\/[\s\S]*?\/\* AM-06 END [^*]*\*\/\}/g,'')
 .replace(/\/\* AM-06 BEGIN [^*]*\*\/[\s\S]*?\/\* AM-06 END [^*]*\*\//g,'')
 .replace(/\/\/ AM-06 BEGIN [^\n]+\n[\s\S]*?\/\/ AM-06 END [^\n]+\n/gm,'');}
// The 3.25 journal is additive; historical gameplay/art fixtures remain exact.
function withoutJournalPresentation(source){return withoutBestiaryPresentation(source).replace(/^[ \t]*\/\/ J-3250 BEGIN [^\n]+\n[\s\S]*?\/\/ J-3250 END [^\n]+\n/gm,'');}
function withoutBestiaryPresentation(source){return withoutMuseumPresentation(source).replace(/^[ \t]*\/\/ B-3260 BEGIN [^\n]+\n[\s\S]*?\/\/ B-3260 END [^\n]+\n/gm,'');}
function withoutMuseumPresentation(source){return source.replace(/^[ \t]*\/\/ M-3270 BEGIN [^\n]+\n[\s\S]*?\/\/ M-3270 END [^\n]+\n/gm,'');}
module.exports={withoutBestiaryPagination,withoutJournalPresentation,withoutBestiaryPresentation,withoutMuseumPresentation};
