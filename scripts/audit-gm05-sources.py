#!/usr/bin/env python3
"""Derive the GM05 current view from frozen GM01 and the real runtime; never edit history."""
import collections,csv,hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;OUT=ROOT/'docs/gm05';OUT.mkdir(exist_ok=True)
def read(name):
 with (ROOT/'docs/gm01'/f'{name}.csv').open() as f:return list(csv.DictReader(f))
def write(name,rows):
 with (OUT/name).open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader();w.writerows(rows)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
runtime=json.loads((OUT/'runtime-audit.json').read_text());species=runtime['species'];regions={r['id']:r for r in runtime['regions']};witness={(p['regionId'],p['speciesId']):p for p in runtime['presences']}
closure=json.loads((ROOT/'docs/gm04c/world-closure.json').read_text());planned=closure['source']['plannedPhaseRows'];sr=[x for x in read('species') if x['row_kind']=='source'];pr=[x for x in read('presences') if x['row_kind']=='source'];gr=[x for x in read('regions') if x['row_kind']=='source'];issues=read('issues');frozen={}
for p in (ROOT/'docs/gm01').glob('*'):
 if p.is_file():
  relative=str(p.relative_to(ROOT));expected=subprocess.check_output(['git','show','9da9808:'+relative],cwd=ROOT)
  assert p.read_bytes()==expected,relative;frozen[relative]=digest(p)
assert (len(sr),len(pr),len(gr),len(issues))==(900,1574,209,413)
phase_files={'GM02':['docs/gm02/scientific-decisions.json','docs/gm02/dingo-decision.json','docs/gm02/petauroides-decision.json'],'GM03':['docs/gm03/catalog.json','docs/gm03/decisions.md'],'GM04A':['docs/gm04a/catalog.json','docs/gm04a/decisions.md'],'GM04B':['docs/gm04b/catalog.json','docs/gm04b/decisions.md'],'GM04C':['docs/gm04c/catalog.json','docs/gm04c/decisions.md']}
commits={k:subprocess.check_output(['git','log','-1','--format=%H','9da9808','--',files[0]],cwd=ROOT,text=True).strip() for k,files in phase_files.items()}
base_regions={r['source_hex_id']:r for r in gr};concordance=[];esp=collections.defaultdict(set);row_index={};pair_sources=collections.defaultdict(list)
for p in pr:
 row=p['source_row'];phase=planned.get(row);rid=phase['regionId'] if phase else p['game_region_id'];sid=phase['speciesId'] if phase else p['game_species_id'];status=p['status'];equivalence=True;note='Concordancia nominal conservada; no certifica localidad exacta.'
 if phase:
  status='incorporada_posteriormente';note='Decisión '+phase['phase']+'; conservar concepto y ámbito documentados, no inferir sinonimia de una corrección editorial.'
 elif status=='conflicto_identidad':equivalence=False;sid='';note='Rango/intención de fuente pendiente. Los candidatos del juego no son una equivalencia aprobada.'
 elif status=='diferencia_distribucion_taxonomica_documentada':equivalence=False;sid='';note=p['documented_distribution_difference']
 assert rid in regions,(row,rid)
 observed=[i for i in (p['game_candidate_ids_NOT_EQUIVALENCE'].split(' | ')+[p['different_current_species_NOT_EQUIVALENCE']]) if i and i in regions[rid]['species']]
 if sid:
  assert sid in regions[rid]['species'],(row,rid,sid);assert witness[rid,sid]['manual'] and witness[rid,sid]['automatic'];esp[p['source_ID especie']].add(sid);pair_sources[rid,sid].append(int(row))
 record={'source_sheet':p['source_sheet'],'source_row':int(row),'source_species_id':p['source_ID especie'],'source_hex_id':p['source_ID hex'],'source_scientific':p['source_Nombre científico'],'region_id':rid,'approved_species_id':sid,'effective_scientific':species[sid]['latin'] if sid else '', 'observed_candidates_not_equivalence':' | '.join(observed),'review_status':status,'equivalence_approved':equivalence,'decision':note,'evidence':' | '.join(phase_files[phase['phase']]) if phase else 'docs/gm01/presences.csv; docs/gm01/decisions.json','subsequent_commit':commits[phase['phase']] if phase else '9da9808','original_record_json':json.dumps(p,ensure_ascii=False,sort_keys=True)}
 concordance.append(record);row_index[row]=record
assert len({r['source_row'] for r in concordance})==1574
source_species=[];canonical=set()
for s in sr:
 ids=set(esp[s['source_species_id']]);
 if s['game_id'] in species:ids.add(s['game_id'])
 canonical.update(ids);source_species.append({'source_id':s['source_species_id'],'source_sheet':s['source_sheet'],'source_row':s['source_row'],'source_scientific':s['source_scientific'],'production_ids':' | '.join(sorted(ids)),'approved_correspondence':bool(ids),'treatment':'one-source-to-multiple-explicit-editorial-concepts' if len(ids)>1 else 'canonical' if ids else 'pending-rank-intent','source_issue_ids':s['issue_ids']})
retained=sorted(set(species)-canonical);assert len(canonical)==898 and len(retained)==47
species_rows=[]
for sid,s in species.items():
 source_ids=[r['source_id'] for r in source_species if sid in r['production_ids'].split(' | ')]
 species_rows.append({'id':sid,'scientific':s['latin'],'common':s['name'],'group':s['taxonomyEffective']['className'],'subgroup':s['taxonomyEffective']['subClass'],'family_explicit':s.get('familyEffective',''),'family_review':'explicit' if s.get('familyEffective') else 'not-explicit-in-legacy-schema; no invented family','rarity':s['rare'],'region_count':len(s['regions']),'regions':' | '.join(s['regions']),'habitats':' | '.join(s['habitats']),'times':' | '.join(s['times']),'seasons':' | '.join(s['seasons']),'source_species_ids':' | '.join(source_ids),'source_review':'canonical-source-linked' if source_ids else 'retained-historical-additional-identity','variants':' | '.join(s['variants']),'normal_svg_sha256':s['normalSpriteSha256']})
# All issue IDs survive exactly once. Resolved means an evidenced treatment, not global certification.
resolved_taxa={'ESP-1038':'GM04A','ESP-0023':'GM02','ESP-0982':'GM04A','ESP-0076':'GM02','ESP-0135':'GM02','ESP-1006':'GM04A','ESP-0295':'GM02','ESP-1041':'GM04A','ESP-0925':'GM02','ESP-0943':'GM02'}
ledger=[]
for i in issues:
 kind=i['type'];sid=i['source_species_id'];row=row_index.get(i['source_row']) if i['source_sheet']=='Fauna' else None;state='Pendiente';evidence=i['evidence'] or 'docs/gm01/decisions.json';reason='Advertencia científica/localidad sin evidencia suficiente para cambiar producción.';commit='9da9808'
 if kind=='diferencia_catalogo':state='Sin defecto demostrado';reason='Diferencia literal de rareza/clasificación: una diferencia de fuente no demuestra duplicación ni error de balance.'
 elif kind in ['equivalencia_documentada','equivalencia_geografica_parcial']:state='Contexto histórico';reason='Equivalencia explícita preexistente conservada, con los límites históricos; no requiere otra migración.'
 elif kind=='colision_id_region':
  region=base_regions.get(i['source_hex_id']);populated=region and int(region['source_presence_count'])>0;state='Resuelta' if populated else 'Contexto histórico';reason='Destinos funcionales separados y verificados; ID histórico no renombrado.' if populated else 'Celda fuente reservada no activada; colisión nominal no es región nueva ni defecto.';evidence='docs/gm05/presences-concordance.csv; docs/gm04c/world-closure.json'
 elif sid in resolved_taxa and kind in ['concepto_taxonomico','identidad_o_rango_no_resuelto']:
  phase=resolved_taxa[sid];state='Resuelta';reason='Decisión explícita posterior sobre el concepto fuente; se conservan límites y nombres originales.';evidence=' | '.join(phase_files[phase]);commit=commits[phase]
 elif kind=='distribucion_heredada' and row:
  original=next(p for p in pr if p['source_row']==i['source_row'])
  if original['existing_AM04_geographic_status']=='kept-with-explicit-subarea':state='Contexto histórico';reason='Subárea editorial explícita conservada por AM-04; no se generaliza a toda la región.'
 elif kind=='distribucion_preliminar' and row and row['review_status']=='incorporada_posteriormente':state='Contexto histórico';reason='Cribado preliminar anterior a los ámbitos explícitos de la fase marina; no certifica una localidad uniforme.';evidence=row['evidence'];commit=row['subsequent_commit']
 elif kind=='diferencia_distribucion_taxonomica':state='Sin defecto demostrado';reason='Canis aureus y Canis lupaster se conservan distintos. Diferencia fuente/juego justificada; registro fuente no equivale a presencia nativa certificada.'
 ledger.append({'issue_id':i['issue_id'],'original_type':kind,'state':state,'source_sheet':i['source_sheet'],'source_row':i['source_row'],'source_species_id':sid,'source_hex_id':i['source_hex_id'],'production_ids':i['game_ids'],'decision':reason,'evidence':evidence,'commit':commit,'original_description':i['description']})
assert {r['issue_id'] for r in ledger}=={r['issue_id'] for r in issues} and len(ledger)==413
write('presences-concordance.csv',concordance);write('source-species-concordance.csv',source_species);write('production-species-audit.csv',species_rows);write('issues-current.csv',ledger)
report={'baseline':'9da9808','production':{'identities':len(species),'regions':len(regions),'presences':len(runtime['presences']),'unreachable':len(runtime['errors'])},'source':{'catalogRows':900,'faunaRows':1574,'cells':209,'populated':sum(int(r['source_presence_count'])>0 for r in gr),'reserved':sum(int(r['source_presence_count'])==0 for r in gr)},'sourceStatuses':dict(collections.Counter(r['review_status'] for r in concordance)),'canonicalRuntimeIds':len(canonical),'retained47WithoutCanonicalSource':retained,'issues':dict(collections.Counter(r['state'] for r in ledger)),'historicalCounterDiscrepancy':{'file':'docs/gm01/summary.json','stored':[209,0],'correctDerivedView':[103,106],'historyUnchanged':True},'historicalManifest':frozen,'subsequentCommits':commits,'limits':['No identity merged, deleted or added.','945 structural/runtime records checked; individual current external authorities not consulted for every taxon.',f"Family is not explicitly represented in {sum(not s.get('familyEffective') for s in species.values())} legacy identities; no inferred family is certified.",'Range conflicts and uncertain source localities remain pending.']}
(OUT/'source-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['historicalManifest','retained47WithoutCanonicalSource','subsequentCommits']},ensure_ascii=False))
