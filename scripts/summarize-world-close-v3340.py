"""Read-only reconciliation of frozen GM01 CSVs and final runtime, after public verification."""
import csv,json,subprocess,collections
from pathlib import Path
root=Path(__file__).resolve().parent.parent
published=json.loads((root/'docs/gm04c/published-report.json').read_text());browser=json.loads((root/'docs/gm04c/published-browser.json').read_text())
assert published['version']=='3.34.0' and not published['hashMismatches'] and browser['status']=='passed'
js="""const {harness}=require('./tests/helpers/live-game.cjs');const g=harness({},null,{bridge:'\\nwindow.__atlasTest={SPECIES,REGIONS,configuredSpecials,SEXUAL_DIMORPHISM,getSpriteMarkup,geometryCounts(){return [...new Set(REGIONS.map(r=>r.continent))].map(c=>({continent:c,cells:globalThis.AtlasGeography.layout(c,REGIONS.filter(r=>r.continent===c)).cells.length}))}};\\n})();'}).window.__atlasTest;console.log(JSON.stringify({species:g.SPECIES,regions:g.REGIONS,variants:Object.fromEntries(Object.entries(g.SPECIES).map(([id,s])=>[id,g.configuredSpecials(s)])),dimorphism:g.SEXUAL_DIMORPHISM,geometry:g.geometryCounts(),normalPlateCount:Object.keys(g.SPECIES).filter(id=>/^<svg/.test(g.getSpriteMarkup(id))).length}));"""
runtime=json.loads(subprocess.check_output(['node','-e',js],cwd=root,text=True))
read=lambda name:list(csv.DictReader(open(root/('docs/gm01/'+name+'.csv'))))
presences=[p for p in read('presences') if p['row_kind']=='source'];source_species=[s for s in read('species') if s['row_kind']=='source'];source_regions=[r for r in read('regions') if r['row_kind']=='source']
for file in ['species.csv','regions.csv','presences.csv','issues.csv']:
 assert (root/('docs/gm01/'+file)).read_bytes()==subprocess.check_output(['git','show','e060d0f:docs/gm01/'+file],cwd=root)
summary=json.loads((root/'docs/gm01/summary.json').read_text());species=runtime['species'];regions=runtime['regions'];region_index={r['id']:r for r in regions};esp=collections.defaultdict(set)
for sid,s in species.items():
 for k in s.get('sourceSpeciesIds',[]):esp[k].add(sid)
phase_data={name:json.loads((root/path).read_text()) for name,path in [('GM03','docs/gm03/catalog.json'),('GM04A','docs/gm04a/catalog.json'),('GM04B','docs/gm04b/catalog.json'),('GM04C','docs/gm04c/catalog.json')]}
new_rows={};phase_stats=[]
for name,d in phase_data.items():
 for p in d['presences']:
  row=p.get('sourceRow',p.get('row'));assert row not in new_rows
  assert p['speciesId'] in region_index[p['regionId']]['species']
  new_rows[row]={'phase':name,'regionId':p['regionId'],'speciesId':p['speciesId'],'sourceScientific':p['sourceScientific']};esp[p['sourceSpeciesId']].add(p['speciesId'])
 ids={p['speciesId'] for p in d['presences']};phase_stats.append({'phase':name,'newSpecies':len(d['species']),'reusedIds':sorted(ids-set(d['species'])),'sourcePresences':len(d['presences']),'regions':len(d['regions'])})
oceania_regions={r['sourceHexId']:r for r in regions if r['continent']=='Oceanía'}
for p in presences:
 if p['source_Continente / medio']!='Oceanía':continue
 rid=oceania_regions[p['source_ID hex']]['id'];found=esp[p['source_ID especie']]&set(region_index[rid]['species']);assert len(found)==1
 row=int(p['source_row']);assert row not in new_rows;new_rows[row]={'phase':'GM02','regionId':rid,'speciesId':next(iter(found)),'sourceScientific':p['source_Nombre científico']}
phase_stats.insert(0,{'phase':'GM02','newSpecies':97,'reusedIds':[],'sourcePresences':131,'regions':8})
planned=[p for p in presences if p['source_Continente / medio'] in ['Oceanía','Hielo','Mar','Mar profundo','Mar abisal']]
assert len(planned)==len(new_rows)==415 and {int(p['source_row']) for p in planned}==set(new_rows)
for p in planned:assert p['source_Nombre científico']==new_rows[int(p['source_row'])]['sourceScientific']
canonical=set();unresolved=[]
for s in source_species:
 ids=set(esp[s['source_species_id']]);
 if s['game_id'] in species:ids.add(s['game_id'])
 canonical.update(ids)
 if not ids:unresolved.append({'sourceSpeciesId':s['source_species_id'],'scientific':s['source_scientific'],'issueIds':s['issue_ids']})
assert {s['scientific'] for s in unresolved}=={'Gorilla beringei','Panthera pardus'}
assert sum(m['cells'] for m in runtime['geometry'])==117
assert runtime['normalPlateCount']==945
assert len(species)==945 and len(regions)==113 and sum(len(r['species']) for r in regions)==1744
assert len(canonical)==898 and len(set(species)-canonical)==47
for sr in source_regions:
 if not int(sr['source_presence_count']):continue
 rid=sr['proposed_id_NOT_IMPLEMENTED'] if sr['source_medium'] in ['Oceanía','Hielo','Mar','Mar profundo','Mar abisal'] else sr['game_id']
 assert rid in region_index,(sr['source_region'],rid)
old_status=collections.Counter(p['status'] for p in presences if int(p['source_row']) not in new_rows)
ocean_ids=set();ocean_new=set()
for key in ['GM04A','GM04B','GM04C']:
 d=phase_data[key];ocean_ids.update(p['speciesId'] for p in d['presences']);ocean_new.update(d['species'])
prestige=[]
for label,predicate in [('Europa',lambda r:r['continent']=='Europa'),('Asia',lambda r:r['continent']=='Asia'),('África',lambda r:r['continent']=='África'),('Norteamérica',lambda r:r['continent']=='Norteamérica'),('Sudamérica',lambda r:r['continent']=='Sudamérica'),('Oceanía',lambda r:r['continent']=='Oceanía'),('Polos',lambda r:r['continent']=='Polos'),('Mares superficiales',lambda r:r['id'].startswith('mar_')),('Océanos profundos',lambda r:r.get('depthTier')=='profundo'),('Fosas',lambda r:r.get('depthTier')=='abisal')]:
 rs=[r for r in regions if predicate(r)];prestige.append({'area':label,'regions':len(rs),'minimum':min(r['unlock']['prestige'] for r in rs),'maximum':max(r['unlock']['prestige'] for r in rs)})
report={'version':'3.34.0','deployedCommit':published['commit'],'workflow':published['workflow'],'gm05Started':False,'final':{'species':945,'regions':113,'presences':1744,'fullScientificStringsUnique':len({s['latin'] for s in species.values()})==945,'visualCells':sum(m['cells'] for m in runtime['geometry']),'visualNonfunctionalCells':4,'geometryByContinent':runtime['geometry']},'baselineGM01':{'version':'3.28.0','species':710,'regions':79,'presences':1329},'phases':phase_stats,'addedSinceGM01':{'species':235,'regions':34,'presences':415},'gm04Combined':{'regions':19,'presences':239,'newSpecies':len(ocean_new),'distinctEffectiveSpecies':len(ocean_ids),'distinctIdsReusedFromBeforeGM04':len(ocean_ids-ocean_new)},'source':{'catalogRows':900,'faunaRowsPreserved':1574,'cells':209,'cellsWithFaunaRecounted':103,'cellsWithoutFaunaRecounted':106,'plannedPhaseRowsNowImplemented':415,'plannedPhaseRows':new_rows,'oldSourcePresenceStatusesUnchanged':dict(old_status),'sourceCanonicalRuntimeIds':len(canonical),'retainedRuntimeIdsWithoutApprovedCanonicalSourceRecord':len(set(species)-canonical),'unresolvedRankConcepts':unresolved,'metadataDiscrepancy':{'file':'docs/gm01/summary.json','field':'source.populated_cells / source.reserved_cells','stored':[summary['source']['populated_cells'],summary['source']['reserved_cells']],'recounted':[103,106],'sourceCSVNotModified':True}},'sprites':{'allNormalPlatesPresent':runtime['normalPlateCount']==len(species),'previous943AndAllConfiguredVariantsSexesLiteralComparison':'passed in current production tests','new3340':2,'new3340BiologicalVariants':0,'new3340NotableProbabilityPerSpecimen':0.01,'configuredDimorphicIdentities':len(runtime['dimorphism'])},'prestige':prestige,'tests':{'historical':473,'current3340':20,'pwaUpgrade':'3.33.0 -> 3.34.0 passed','publicWebHashes':154,'publicBrowser':'passed','physicalAndroid':False},'notes':['Source correspondence is not validation of every distribution.','No historical GM01 issue file was marked globally resolved.','No GM05 gameplay, taxonomy, economy or signature changes performed.']}
(root/'docs/gm04c/world-closure.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['final','addedSinceGM01','gm04Combined']},ensure_ascii=False))
