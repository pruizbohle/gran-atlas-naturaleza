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
function withoutDevelopment3280(source){return withoutOceania3290(source).replace(/\/\* E-3280 BEGIN [^*]*\*\/[\s\S]*?\/\* E-3280 END [^*]*\*\//g,'').replace(/^[ \t]*\/\/ E-3280 BEGIN [^\n]+\n[\s\S]*?\/\/ E-3280 END [^\n]+\n/gm,'');}
function historicalVoyageState(snapshot){const s=JSON.parse(JSON.stringify(snapshot));delete s.voyageHistory;if(s.upgrades?.oceaniaUnlocked===false)delete s.upgrades.oceaniaUnlocked;for(const j of s.voyages||[])delete j.startedAt;return s;}
module.exports={withoutDevelopment3280,historicalVoyageState,withoutBestiaryPagination,withoutJournalPresentation,withoutBestiaryPresentation,withoutMuseumPresentation};

// Remove only marked additive 3.29 installation/routing seams for immutable older fixtures.
function withoutOceania3290(source){return source.replace(/\n\/\/ OC3290 BEGIN [^\n]+\n[\s\S]*?\n\/\/ OC3290 END [^\n]+\n/g,'').replace(/\n[ \t]*\/\* OC3290 BEGIN (art|sex) \*\/[\s\S]*?\/\* OC3290 END \1 \*\//g,'').replaceAll('3.29.0','3.28.0');}
module.exports.withoutOceania3290=withoutOceania3290;
