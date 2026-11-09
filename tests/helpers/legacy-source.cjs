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
function withoutMuseumPresentation(source){return withoutDevelopment3280(source).replace(/^[ \t]*\/\/ M-3270 BEGIN [^\n]+\n[\s\S]*?\/\/ M-3270 END [^\n]+\n/gm,'');}
// 3.28 adds presentation, observational receipts and two explicitly authorized validations.
// Historical hashes retain their original fixtures; dedicated 3.28 tests exercise these changes.
function withoutDevelopment3280(source){return source.replace(/\/\* E-3280 BEGIN [^*]*\*\/[\s\S]*?\/\* E-3280 END [^*]*\*\//g,'').replace(/^[ \t]*\/\/ E-3280 BEGIN [^\n]+\n[\s\S]*?\/\/ E-3280 END [^\n]+\n/gm,'');}
function historicalVoyageState(snapshot){const s=JSON.parse(JSON.stringify(snapshot));delete s.voyageHistory;for(const j of s.voyages||[])delete j.startedAt;return s;}
module.exports={withoutDevelopment3280,historicalVoyageState,withoutBestiaryPagination,withoutJournalPresentation,withoutBestiaryPresentation,withoutMuseumPresentation};
