#!/usr/bin/env python3
"""GM-01: read-only comparison of the original XLSX with the effective 3.28 runtime.
Requires audit-only openpyxl and Node. Never writes the workbook or production files.
"""
import argparse, collections, csv, hashlib, io, json, re, subprocess, tempfile, unicodedata, warnings
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / 'docs/gm01/decisions.json'
CONTINENTS = {'América del Norte':'Norteamérica', 'América del Sur':'Sudamérica'}
NEW_MEDIA = {'Oceanía','Hielo','Mar','Mar profundo','Mar abisal'}
PHASES = [('GM-02', {'Oceanía'}), ('GM-03', {'Hielo'}), ('GM-04', {'Mar','Mar profundo','Mar abisal'})]

def sha(data): return hashlib.sha256(data).hexdigest()
def norm(value): return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', str(value or '')).strip()).casefold()
def labelkey(value): return ''.join(c for c in unicodedata.normalize('NFD', norm(value)) if not unicodedata.combining(c))
def joined(values): return ' | '.join(sorted({str(v) for v in values if v is not None and str(v)}))
def jtext(data): return json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + '\n'
def compact(data): return json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',',':'))
def csvtext(rows, fields=None):
    if not fields: fields = list(rows[0])
    s = io.StringIO(newline=''); w = csv.DictWriter(s, fieldnames=fields, lineterminator='\n'); w.writeheader(); w.writerows(rows); return s.getvalue()
def records(values, sheet):
    header = values[sheet][0]
    return [dict(zip(header, row)) | {'source_sheet':sheet, 'source_row':i+2} for i,row in enumerate(values[sheet][1:]) if row and row[0] is not None]
def canonical(name, decisions): return decisions['aliases'].get(name, {}).get('canonical', name)
def match_species(name, by_name, decisions):
    """Exact full scientific name or a documented alias; never genus/common-name/rank truncation."""
    key = canonical(name, decisions); ids = by_name.get(norm(key), [])
    return (ids[0], 'alias_documentado' if name != key else 'nombre_completo') if len(ids) == 1 else ('', 'ambiguo' if len(ids)>1 else 'sin_correspondencia')
def region_match(h, game_regions, decisions):
    if not h['Animales cargados']: return '', 'reservada', 'Celda sin fauna; no se propone convertirla en región funcional.'
    if h['ID hex'] in decisions['africa_crosswalk']:
        c = decisions['africa_crosswalk'][h['ID hex']]
        assert c['id'] in game_regions and game_regions[c['id']]['continent'] == 'África'
        return c['id'], c['scope'], c.get('note','Equivalencia nominal/geográfica explícita; ID histórico del juego conservado.')
    candidates = [r for r in game_regions.values() if r['continent'] == CONTINENTS.get(h['Continente / medio'], h['Continente / medio']) and labelkey(r['name']) == labelkey(h['Región geográfica'])]
    if len(candidates)==1: return candidates[0]['id'], 'equivalente', 'Mismo nombre y continente; el ID fuente no se utiliza como coordenada.'
    if len(candidates)>1: return '', 'revision', 'Varios destinos nominales; no elegir por similitud.'
    return '', 'pendiente', 'Sin región funcional equivalente; acceso y requisitos futuros no definidos en GM-01.'
def source_output_id(h):
    prefix = {'Oceanía':'oc', 'Hielo':'polar', 'Mar':'mar', 'Mar profundo':'profundo', 'Mar abisal':'abisal'}.get(h['Continente / medio'],'gm')
    return prefix + '_' + re.sub(r'[^a-z0-9]+','_',labelkey(h['Región geográfica'])).strip('_')
def prod_manifest():
    paths = [p for p in (ROOT/'www').rglob('*') if p.is_file()] + [ROOT/'package.json',ROOT/'capacitor.config.json']
    return {str(p.relative_to(ROOT)):sha(p.read_bytes()) for p in sorted(paths)}

def audit(workbook):
    decisions = json.loads(CONFIG.read_text()); original_hash = sha(workbook.read_bytes())
    if original_hash != decisions['expected_source_sha256']: raise ValueError('SHA-256 distinto de la fuente requerida; no se genera una comparación de otra versión.')
    warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')
    book = openpyxl.load_workbook(workbook, read_only=True, data_only=True)
    values = {s.title:[list(r) for r in s.values] for s in book}; book.close()
    assert list(values) == ['Resumen','Mapa','Hexágonos','Fauna','Catálogo especies','Metodología y fuentes']
    hexes, fauna, catalog = (records(values,s) for s in ['Hexágonos','Fauna','Catálogo especies'])
    with tempfile.TemporaryDirectory(prefix='atlas-gm01-') as tmp:
        input_file=Path(tmp)/'source-catalog.json'; input_file.write_text(jtext(catalog))
        runtime=json.loads(subprocess.check_output(['node','scripts/export-world-runtime-gm01.cjs',str(input_file)],cwd=ROOT,text=True))
    species=runtime['species']; game_regions={r['id']:r for r in runtime['regions']}
    by_name=collections.defaultdict(list)
    for sid,s in species.items(): by_name[norm(s['latin'])].append(sid)
    hex_by={h['ID hex']:h for h in hexes}; cat_by={s['ID especie']:s for s in catalog}; fauna_by_hex=collections.defaultdict(list); fauna_by_species=collections.defaultdict(list)
    for f in fauna: fauna_by_hex[f['ID hex']].append(f); fauna_by_species[f['ID especie']].append(f)
    map_cells=[]
    for row in values['Mapa']:
        for v in row:
            m=re.fullmatch(r'(\d{2})·(\d{2})\n(\d+) esp\.',v) if isinstance(v,str) else None
            if m:map_cells.append(('HX-'+m[1]+'-'+m[2],int(m[3])))
    checks={
        'source_hash_matches':original_hash==decisions['expected_source_sha256'],
        'source_counts_match':(len(hexes),len(catalog),len(fauna))==(209,900,1574),
        'unique_source_hex_ids':len(hex_by)==len(hexes),'unique_source_species_ids':len(cat_by)==len(catalog),
        'source_scientific_names_unique':len({norm(s['Nombre científico']) for s in catalog})==900,
        'all_source_references_valid':all(f['ID hex'] in hex_by and f['ID especie'] in cat_by for f in fauna),
        'source_scientific_names_agree':all(f['Nombre científico']==cat_by[f['ID especie']]['Nombre científico'] for f in fauna),
        'source_regions_and_media_agree':all(f['Región']==hex_by[f['ID hex']]['Región geográfica'] and f['Continente / medio']==hex_by[f['ID hex']]['Continente / medio'] for f in fauna),
        'source_hex_presence_counts_agree':all(h['Animales cargados']==len(fauna_by_hex[h['ID hex']]) for h in hexes),
        'source_catalog_presence_counts_agree':all(s['Hexágonos con registro']==len(fauna_by_species[s['ID especie']]) for s in catalog),
        'no_duplicate_source_pairs':len({(f['ID hex'],f['ID especie']) for f in fauna})==len(fauna),
        'map_covers_all_source_cells':len(map_cells)==209 and set(h for h,n in map_cells)==set(hex_by),
        'map_counts_agree':all(n==len(fauna_by_hex[h]) for h,n in map_cells),
        'summary_totals_agree':any(len(row)>12 and row[0]==209 and row[4]==103 and row[8]==1574 and row[12]==900 for row in values['Resumen']),
        'runtime_version_and_key':runtime['version']=='3.28.0' and runtime['saveKey']=='gran_atlas_v05',
        'runtime_counts_match':(len(species),len(game_regions),sum(len(r['species']) for r in game_regions.values()))==(710,79,1329),
        'no_duplicate_runtime_scientific_strings':all(len(ids)==1 for ids in by_name.values()),
        'no_duplicate_runtime_ids_or_pairs':len(game_regions)==len(runtime['regions']) and all(len(set(r['species']))==len(r['species']) for r in game_regions.values()),
        'runtime_all_references_valid':all(s in species for r in game_regions.values() for s in r['species']),
        'runtime_all_presences_manual_and_auto_reachable':all(x['manual'] and x['automaticSeason'] for r in game_regions.values() for x in r['reachability'].values()),
        'five_playable_continents':sum(bool(c['implemented']) for c in runtime['continents'])==5,
    }
    reference=json.loads((ROOT/'docs/expeditions-research-v3280/catalog-integrity.json').read_text())
    checks['existing_integrity_report_agrees']=(reference['species'],reference['regions'],reference['presences'])==(710,79,1329)
    assert all(checks.values()),{k:v for k,v in checks.items() if not v}
    findings=[]
    def issue(kind,severity,description,source_sheet='',source_row='',species_id='',hex_id='',game_ids='',evidence=''):
        key='GM01-'+str(len(findings)+1).zfill(4)
        findings.append(dict(issue_id=key,type=kind,severity=severity,source_sheet=source_sheet,source_row=source_row,source_species_id=species_id,source_hex_id=hex_id,game_ids=game_ids,description=description,evidence=evidence,action='Documentado; sin cambios de producción en GM-01'))
        return key
    region_rows=[]; crosswalk={}; region_issues=collections.defaultdict(list)
    for h in hexes:
        hid=h['ID hex']; rid,scope,note=region_match(h,game_regions,decisions); crosswalk[hid]=(rid,scope)
        collision=game_regions.get(hid); collision=collision if collision and collision['id']!=rid else None
        if collision:
            region_issues[hid].append(issue('colision_id_region','bloquea_importacion' if h['Animales cargados'] else 'contexto_reservado',f"{hid} de la fuente ({h['Región geográfica']}, {h['Continente / medio']}) está ocupado por {collision['name']} ({collision['continent']}). No reutilizar ni renombrar el ID histórico.",'Hexágonos',h['source_row'],hex_id=hid,game_ids=collision['id']))
        if scope=='parcial':region_issues[hid].append(issue('equivalencia_geografica_parcial','revision',note,'Hexágonos',h['source_row'],hex_id=hid,game_ids=rid,evidence='docs/gm01/decisions.json:africa_crosswalk'))
        r=game_regions.get(rid,{})
        region_rows.append(dict(row_kind='source',**{'source_'+key:h[key] for key in values['Hexágonos'][0]},source_sheet='Hexágonos',source_row=h['source_row'],source_medium=h['Continente / medio'],source_region=h['Región geográfica'],source_hex_id=hid,source_biome=h['Bioma (genérico)'],source_presence_count=len(fauna_by_hex[hid]),source_state=h['Estado'],source_map_row=h['Fila mapa'],source_map_column=h['Columna mapa'],game_id=rid,game_name=r.get('name',''),game_continent=r.get('continent',''),game_presence_count=len(r.get('species',[])),state='implementada' if rid and scope=='equivalente' else 'parcialmente_equivalente' if rid else 'reservada_sin_fauna' if scope=='reservada' else 'requiere_revision' if scope=='revision' else 'pendiente',equivalence_scope=scope,id_collision_game_id=collision['id'] if collision else '',id_collision_game_name=collision['name'] if collision else '',access_requirements=compact({'unlock':r.get('unlock'),'labels':[x['label'] for x in r.get('requirements',[])]}) if rid else 'No definidos para región futura' if h['Animales cargados'] else '',game_habitats=joined(r.get('habitats',[])),proposed_id_NOT_IMPLEMENTED=source_output_id(h) if h['Animales cargados'] and not rid else '',cartographic_notes=note+' No usar códigos HX como coordenadas ni recrear celdas reservadas.',issue_ids=joined(region_issues[hid])))
    mapped_regions={rid for rid,scope in crosswalk.values() if rid}
    for r in game_regions.values():
        if r['id'] not in mapped_regions:
            row={k:'' for k in region_rows[0]};row.update(row_kind='game_only',game_id=r['id'],game_name=r['name'],game_continent=r['continent'],game_presence_count=len(r['species']),state='ampliacion_juego_sin_equivalencia_1a1',equivalence_scope='sin_origen_1a1',access_requirements=compact({'unlock':r['unlock'],'labels':[x['label'] for x in r['requirements']]}),game_habitats=joined(r['habitats']),cartographic_notes='Región funcional histórica adicional; no es un alta pendiente ni se propone borrarla. Puede representar subáreas de una región fuente amplia.');region_rows.append(row)
    # Existing AM-01 and AM-04 annotations remain provenance, not new scientific certification.
    am=json.loads((ROOT/'docs/americas-audit/manual-decisions.json').read_text()); source_reviews=collections.defaultdict(list)
    am04={p['row']:p for p in json.loads((ROOT/'docs/sudamerica-v3230/source-presences.json').read_text())}
    for d in am['distribution_screening']:
        for f in fauna:
            if f['Nombre científico']==d['scientific_name'] and f['Región']==d['region']:
                source_reviews[f['source_row']].append(issue('distribucion_heredada','revision',d['reason'],'Fauna',f['source_row'],f['ID especie'],f['ID hex'],evidence='AM-01:docs/americas-audit/manual-decisions.json; decisión/subárea vigente AM-04: '+am04.get(f['source_row'],{}).get('subareaNote','No hay anotación AM-04 para esta fila')))
    for d in decisions['distribution_rules']:
        for f in fauna:
            if f['Nombre científico']!=d['taxon']:continue
            if d.get('region_contains') and labelkey(d['region_contains']) not in labelkey(f['Región']):continue
            if d.get('exclude_region_contains') and labelkey(d['exclude_region_contains']) in labelkey(f['Región']):continue
            source_reviews[f['source_row']].append(issue('distribucion_preliminar','revision',d['reason'],'Fauna',f['source_row'],f['ID especie'],f['ID hex'],evidence='Cribado GM-01, propuesta de revisión; no autoridad externa consultada'))
    source_matches={}; species_issues=collections.defaultdict(list)
    for s in catalog:
        name=s['Nombre científico']; source_matches[s['ID especie']]=match_species(name,by_name,decisions)
        if name in decisions['aliases']:
            species_issues[s['ID especie']].append(issue('equivalencia_documentada','informativo',name+' → '+decisions['aliases'][name]['canonical'],'Catálogo especies',s['source_row'],s['ID especie'],evidence=decisions['aliases'][name]['evidence']))
        if name in decisions['rank_or_identity_ambiguities']:
            d=decisions['rank_or_identity_ambiguities'][name]
            species_issues[s['ID especie']].append(issue('identidad_o_rango_no_resuelto','bloquea_alta',d['reason'],'Catálogo especies',s['source_row'],s['ID especie'],game_ids=joined(d['candidates']),evidence='Sin equivalencia canónica demostrada; conservar registros y candidatos separados'))
        if name in decisions['taxonomic_reviews']:
            species_issues[s['ID especie']].append(issue('concepto_taxonomico','revision',decisions['taxonomic_reviews'][name],'Catálogo especies',s['source_row'],s['ID especie'],evidence='AM-04 para los cinco conceptos existentes; cribado preliminar GM-01 para restantes'))
    source_presences=[]; confirmed_pairs=set(); ambiguous_pairs=set()
    for f in fauna:
        sid,method=source_matches[f['ID especie']];rid,scope=crosswalk[f['ID hex']]; r=game_regions.get(rid,{})
        candidates=decisions['rank_or_identity_ambiguities'].get(f['Nombre científico'],{}).get('candidates',[]); possible=[i for i in candidates if i in r.get('species',[])]
        if not rid:status='pendiente_region_reutilizar' if sid else 'pendiente_region_identidad_revision' if candidates or f['Nombre científico'] in decisions['rank_or_identity_ambiguities'] else 'pendiente_region_nueva_identidad'
        elif sid and sid in r['species']:status='implementada';confirmed_pairs.add((rid,sid))
        elif sid:status='pendiente_distribucion'
        else:status='conflicto_identidad'
        for cid in possible:ambiguous_pairs.add((rid,cid))
        difference=decisions.get('presence_differences',{}).get(str(f['source_row']))
        if difference:
            assert (f['Nombre científico'],f['ID hex'],rid)==(difference['source_taxon'],difference['source_hex'],difference['current_region'])
            other=difference['different_current_species_id']
            assert other in r['species'] and species[other]['latin']==difference['different_current_scientific'] and other!=sid
            status=difference['status']
            source_reviews[f['source_row']].append(issue('diferencia_distribucion_taxonomica','revision_fuente_no_alta',difference['reason'],'Fauna',f['source_row'],f['ID especie'],f['ID hex'],game_ids=other,evidence=difference['evidence']))
        reachable=r.get('reachability',{}).get(sid,{})
        source_presences.append(dict(row_kind='source',**{('source_'+k):v for k,v in f.items() if k not in ['source_sheet','source_row']},source_sheet='Fauna',source_row=f['source_row'],game_region_id=rid,game_species_id=sid,game_scientific=species[sid]['latin'] if sid else '',identity_match=method,region_equivalence_scope=scope,status=status,game_candidate_ids_NOT_EQUIVALENCE=joined(possible),manual_encounter=compact(reachable.get('manual')) if reachable.get('manual') else '',automatic_season=reachable.get('automaticSeason',''),source_distribution_review=joined(source_reviews[f['source_row']]),existing_AM04_subarea_note=am04.get(f['source_row'],{}).get('subareaNote',''),existing_AM04_geographic_status=am04.get(f['source_row'],{}).get('geographicStatus',''),documented_distribution_difference=difference['reason'] if difference else '',different_current_species_NOT_EQUIVALENCE=difference['different_current_species_id'] if difference else '',issue_ids=joined(species_issues[f['ID especie']]+region_issues[f['ID hex']]+source_reviews[f['source_row']])) )
    all_game_pairs={(r['id'],sid) for r in game_regions.values() for sid in r['species']}; extra_game_pairs=sorted(all_game_pairs-confirmed_pairs)
    presence_rows=list(source_presences)
    for rid,sid in extra_game_pairs:
        row={k:'' for k in source_presences[0]};reach=game_regions[rid]['reachability'][sid]
        row.update(row_kind='game_unmatched',game_region_id=rid,game_species_id=sid,game_scientific=species[sid]['latin'],identity_match='candidato_de_rango_no_aprobado' if (rid,sid) in ambiguous_pairs else 'sin_presencia_fuente_correspondiente',status='conflicto_equivalencia' if (rid,sid) in ambiguous_pairs else 'presencia_juego_sin_fuente',manual_encounter=compact(reach['manual']),automatic_season=reach['automaticSeason']);presence_rows.append(row)
    presence_by_source=collections.defaultdict(list)
    for r in source_presences:presence_by_source[r['source_ID especie']].append(r)
    species_rows=[]; mapped_species=set()
    for s in catalog:
        name=s['Nombre científico'];sid,method=source_matches[s['ID especie']];sp=species.get(sid,{});pres=presence_by_source[s['ID especie']];differences=[]
        if sid:
            mapped_species.add(sid)
            if s['Rareza (juego)'].replace('Muy raro','Muy rara')!=sp['rare']:differences.append('rareza: '+s['Rareza (juego)']+' / '+sp['rare'])
            cls=sp['taxonomy']['className'];group='Mamíferos' if cls=='Mammalia' else 'Aves' if cls=='Aves' else 'Peces' if cls in ['Actinopterygii','Chondrichthyes','Cephalopoda','Mollusca'] else 'Reptiles y anfibios'
            if group!=s['Grupo animal']:differences.append('grupo: '+s['Grupo animal']+' / '+group)
            if s['Subgrupo']!=sp['taxonomy']['subClass']:differences.append('subgrupo: '+s['Subgrupo']+' / '+sp['taxonomy']['subClass'])
            if labelkey(s['Nombre común'])!=labelkey(sp['name']):differences.append('nombre común: '+s['Nombre común']+' / '+sp['name'])
            pending=sum(r['status']!='implementada' for r in pres)
            if pending:differences.append(str(pending)+' presencias fuente aún sin concordancia funcional')
        if name in decisions['aliases']:category='D'
        elif name in decisions['rank_or_identity_ambiguities'] or name in decisions['taxonomic_reviews'] or any(source_reviews[p['source_row']] for p in pres):category='E'
        elif sid:category='B' if differences else 'A'
        else:category='C'
        if differences:
            species_issues[s['ID especie']].append(issue('diferencia_catalogo','conservar_actual','; '.join(differences),'Catálogo especies',s['source_row'],s['ID especie'],game_ids=sid,evidence='Comparación literal normalizada de datos; no se modifica balance ni taxonomía'))
        species_rows.append(dict(row_kind='source',**{'source_'+key:s[key] for key in values['Catálogo especies'][0]},source_sheet='Catálogo especies',source_row=s['source_row'],source_species_id=s['ID especie'],source_common=s['Nombre común'],source_scientific=name,canonical_equivalence=canonical(name,decisions),source_group=s['Grupo animal'],source_subgroup=s['Subgrupo'],source_rarity=s['Rareza (juego)'],source_presence_count=len(pres),source_fauna_rows=joined(p['source_row'] for p in pres),source_media=joined(p['source_Continente / medio'] for p in pres),category=category,game_id=sid,game_common=sp.get('name',''),game_scientific=sp.get('latin',''),game_taxonomy=compact(sp.get('taxonomy',{})) if sid else '',game_rarity=sp.get('rare',''),identity_match=method,candidate_ids_NOT_EQUIVALENCE=joined(decisions['rank_or_identity_ambiguities'].get(name,{}).get('candidates',[])),concordant_presence_count=sum(p['status']=='implementada' for p in pres),pending_or_conflicting_count=sum(p['status']!='implementada' for p in pres),needs_new_identity_concept=not bool(sid),new_identity_approved=False,differences=joined(differences),taxonomic_notes=decisions['taxonomic_reviews'].get(name,'') or decisions['rank_or_identity_ambiguities'].get(name,{}).get('reason',''),issue_ids=joined(species_issues[s['ID especie']])))
    for sid,sp in species.items():
        if sid not in mapped_species:
            row={k:'' for k in species_rows[0]};row.update(row_kind='game_only',category='FUERA_CORRESPONDENCIA_CANONICA',game_id=sid,game_common=sp['name'],game_scientific=sp['latin'],game_taxonomy=compact(sp['taxonomy']),game_rarity=sp['rare'],identity_match='Sin registro fuente canónico; puede figurar como candidato de rango, lo que no es una equivalencia',new_identity_approved=False);species_rows.append(row)
    # Fill late catalog issues into each source presence without losing its original columns.
    for p in source_presences:p['issue_ids']=joined(species_issues[p['source_ID especie']]+region_issues[p['source_ID hex']]+source_reviews[p['source_row']])
    profiles={genus:p for p in decisions['art_genus_profiles_preliminary'] for genus in p['genera']};art_rows=[]
    for s in species_rows:
        if s['row_kind']!='source' or s['game_id']:continue
        genus=s['source_scientific'].split()[0];p=profiles.get(genus);assert p,'Missing preliminary art profile for '+genus
        related=decisions['rank_or_identity_ambiguities'].get(s['source_scientific'],{}).get('candidates',[])
        art_rows.append(dict(source_sheet=s['source_sheet'],source_row=s['source_row'],source_species_id=s['source_species_id'],source_scientific=s['source_scientific'],source_common=s['source_common'],source_group=s['source_group'],source_subgroup=s['source_subgroup'],audit_category=s['category'],source_media=s['source_media'],engine_proposed=p['engine'],class_reference_PRELIMINARY=p['class_reference'],family_reference_PRELIMINARY=p['family_reference'],actual_classifier_results_NOT_VISUAL_APPROVAL=compact(runtime['candidates'][s['source_scientific']]['classifiers']),compatible_profile_PRELIMINARY=p['compatible_profile'],workload_PRELIMINARY=p['workload'],requires_specific_profile_NOT_NEW_ENGINE=p['workload']=='PERFIL_ESPECIFICO',risk=p['risk'],dimorphism_review=p['dimorphism_review'],configured_variants='Sin ID actual: no configuradas; no inferir de rareza ni familia',related_candidate_configs_NOT_TRANSFER=compact({i:{'variants':species[i]['configuredSpecials'],'dimorphism':species[i]['dimorphismConfig'],'rendered_route':species[i]['renderedAttributes']} for i in related}),status='Propuesta preliminar. No se ha generado ni aprobado una ilustración nueva.'))
    # Extra game taxonomy overlaps are not duplicate full scientific identities.
    broad=collections.defaultdict(list)
    for sid,sp in species.items():broad[' '.join(norm(sp['latin']).split()[:2])].append(sid)
    rank_overlaps={k:v for k,v in broad.items() if len(v)>1}
    for name,ids in rank_overlaps.items():issue('solapamiento_rango_juego','revision',name+': varios conceptos comparten binomio base (subespecies separadas o especie/subespecie); no son nombres científicos completos duplicados y no se fusionan automáticamente.',game_ids=joined(ids),evidence='Catálogo efectivo; comparación de rango solo como diagnóstico')
    source_status=collections.Counter(p['status'] for p in source_presences)
    media={}
    for medium in sorted({h['Continente / medio'] for h in hexes}):
        hs=[h for h in hexes if h['Continente / medio']==medium];ps=[p for p in source_presences if p['source_Continente / medio']==medium];taxa={canonical(p['source_Nombre científico'],decisions) for p in ps};matched={p['game_species_id'] for p in ps if p['game_species_id']};unmatched={canonical(p['source_Nombre científico'],decisions) for p in ps if not p['game_species_id']}
        media[medium]=dict(source_cells=len(hs),source_regions_with_fauna=sum(bool(h['Animales cargados']) for h in hs),reserved_without_fauna=sum(not h['Animales cargados'] for h in hs),source_presences=len(ps),source_nominal_taxa=len(taxa),mapped_source_regions=sum(bool(crosswalk[h['ID hex']][0]) for h in hs),pending_regions=sum(bool(h['Animales cargados']) and not crosswalk[h['ID hex']][0] for h in hs),current_reusable_ids=len(matched),unmatched_source_concepts=len(unmatched),statuses=dict(collections.Counter(p['status'] for p in ps)))
    phases=[];prior_new=set()
    for name,media_set in PHASES:
        ps=[p for p in source_presences if p['source_Continente / medio'] in media_set];unmatched={canonical(p['source_Nombre científico'],decisions) for p in ps if not p['game_species_id']};blocked=unmatched&set(decisions['rank_or_identity_ambiguities']);current={p['game_species_id'] for p in ps if p['game_species_id']};new=(unmatched-blocked)-prior_new;previous=(unmatched-blocked)&prior_new
        artset=[a for a in art_rows if canonical(a['source_scientific'],decisions) in new]
        phases.append(dict(phase=name,media=sorted(media_set),regions=sum(media[m]['pending_regions'] for m in media_set),presences=len(ps),current_reusable_ids=sorted(current),current_reusable_count=len(current),new_unrepresented_source_concepts=sorted(new),new_count_under_declared_source_concepts=len(new),reused_concepts_from_prior_phases=sorted(previous),reused_from_prior_count=len(previous),blocked_identity_concepts=sorted(blocked),blocked_count=len(blocked),art_workload=dict(collections.Counter(a['workload_PRELIMINARY'] for a in artset)),pending_region_records=[{'source_hex_id':r['source_hex_id'],'source_name':r['source_region'],'source_presence_count':r['source_presence_count'],'proposed_id_NOT_IMPLEMENTED':r['proposed_id_NOT_IMPLEMENTED'],'id_collision_game_id':r['id_collision_game_id']} for r in region_rows if r['row_kind']=='source' and r['source_medium'] in media_set and r['proposed_id_NOT_IMPLEMENTED']],current_reusable_species=[{'id':i,'scientific':species[i]['latin'],'common':species[i]['name']} for i in sorted(current)],approved_new_ids=0))
        prior_new.update(new)
    pending_concepts={s['canonical_equivalence'] for s in species_rows if s['row_kind']=='source' and not s['game_id']}
    checks.update(source_presence_rows_preserved_once=len(source_presences)==1574 and len({p['source_row'] for p in source_presences})==1574,source_catalog_rows_preserved_once=sum(s['row_kind']=='source' for s in species_rows)==900,source_hex_rows_preserved_once=sum(r['row_kind']=='source' for r in region_rows)==209,all_source_fields_preserved=all(all(p['source_'+k]==f[k] for k in values['Fauna'][0]) for p,f in zip(source_presences,fauna)),all_710_game_identities_represented={s['game_id'] for s in species_rows if s['game_id']}==set(species),all_79_functional_regions_represented={r['game_id'] for r in region_rows if r['game_id']}==set(game_regions),all_1329_game_pairs_accounted=confirmed_pairs|set(extra_game_pairs)==all_game_pairs,phase_new_sets_disjoint_and_complete=prior_new==pending_concepts-set(decisions['rank_or_identity_ambiguities']),all_pending_art_rows_accounted=len(art_rows)==sum(s['row_kind']=='source' and not s['game_id'] for s in species_rows),planning_ids_unique=len({r['proposed_id_NOT_IMPLEMENTED'] for r in region_rows if r['proposed_id_NOT_IMPLEMENTED']})==sum(bool(r['proposed_id_NOT_IMPLEMENTED']) for r in region_rows),planning_ids_do_not_collide=not any(r['proposed_id_NOT_IMPLEMENTED'] in game_regions for r in region_rows if r['proposed_id_NOT_IMPLEMENTED']))
    assert all(checks.values()),{k:v for k,v in checks.items() if not v}
    summary=dict(status='AUDITORIA_COMPARATIVA_COMPLETA_CON_REVISIONES_EXPLICITAS',scope='GM-01 documental. No se aprueban altas ni equivalencias no demostradas.',base_commit=decisions['base_commit'],base_game_commit=decisions['base_game_commit'],source=dict(filename=decisions['source_filename'],sha256=original_hash,hexagons=209,populated_cells=len(fauna_by_hex),reserved_cells=209-len(fauna_by_hex),species_records=900,presences=1574,sheets=[dict(name=name,physical_rows=len(rows),nonempty_rows=sum(any(v is not None for v in row) for row in rows),columns=max(map(len,rows),default=0)) for name,rows in values.items()],scientific_validation='Fuente ilustrativa con consultas GBIF sin validar; GM-01 no certifica ocurrencias.'),runtime=dict(version=runtime['version'],save_key=runtime['saveKey'],catalog_identities=len(species),functional_regions=len(game_regions),presences=len(all_game_pairs),implemented_continents=[c['id'] for c in runtime['continents'] if c['implemented']],visual_cells=sum(len(m['cells']) for m in runtime['meshes']),visual_nonfunctional_cells=sum(not c['regionIds'] for m in runtime['meshes'] for c in m['cells']),duplicate_full_scientific_names=0,rank_overlaps=rank_overlaps,source_manifest=runtime['sources']),comparison=dict(source_categories=dict(collections.Counter(s['category'] for s in species_rows if s['row_kind']=='source')),source_records_with_proven_game_identity=sum(s['row_kind']=='source' and bool(s['game_id']) for s in species_rows),current_canonical_ids_reused=len(mapped_species),game_ids_without_source_canonical_equivalence=len(species)-len(mapped_species),source_names_without_exact_full_name=sum(norm(s['Nombre científico']) not in by_name for s in catalog),documented_alias_records=len(decisions['aliases']),source_concepts_without_proven_current_identity=len(pending_concepts),unrepresented_concepts_without_rank_or_intent_block=len(pending_concepts-set(decisions['rank_or_identity_ambiguities'])),unresolved_rank_or_intent_concepts=sorted(pending_concepts&set(decisions['rank_or_identity_ambiguities'])),source_presence_statuses=dict(source_status),confirmed_game_pairs=len(confirmed_pairs),candidate_pairs_NOT_PROVEN_EQUIVALENCES=len(ambiguous_pairs-confirmed_pairs),additional_game_pairs_without_source=len(all_game_pairs-confirmed_pairs-ambiguous_pairs),additional_functional_regions_without_1to1_source=len(game_regions)-len(mapped_regions),pending_populated_regions=sum(m['pending_regions'] for m in media.values()),pending_new_region_presences=sum(p['status'].startswith('pendiente_region') for p in source_presences),pending_distribution_in_existing_regions=source_status['pendiente_distribucion'],documented_taxonomic_distribution_differences=source_status['diferencia_distribucion_taxonomica_documentada']),by_source_medium=media,phases=phases,art_workload_preliminary=dict(collections.Counter(a['workload_PRELIMINARY'] for a in art_rows)),issues=dict(total=len(findings),by_type=dict(collections.Counter(i['type'] for i in findings))),checks=checks,production_manifest=prod_manifest(),audit_input_manifest={path:sha((ROOT/path).read_bytes()) for path in ['scripts/audit-world-gm01.py','scripts/export-world-runtime-gm01.cjs','scripts/verify-world-gm01.py','docs/gm01/decisions.json','docs/americas-audit/manual-decisions.json','docs/sudamerica-v3230/source-presences.json','docs/sudamerica-v3230/TAXONOMY.md','docs/expeditions-research-v3280/catalog-integrity.json']},reproduction='python scripts/audit-world-gm01.py /path/to/Atlas_Fauna_Hexagonal_209_900_Especies.xlsx --check')
    # Workbook notes preserve their sheet/cell provenance without publishing the XLSX.
    notes=[dict(sheet=name,row=i+1,column=j+1,value=v) for name in ['Resumen','Metodología y fuentes'] for i,row in enumerate(values[name]) for j,v in enumerate(row) if v is not None]
    outputs={'regions.csv':csvtext(region_rows),'species.csv':csvtext(species_rows),'presences.csv':csvtext(presence_rows),'issues.csv':csvtext(findings),'art-audit.csv':csvtext(art_rows),'summary.json':jtext(summary),'game-snapshot.json':jtext(runtime),'source-notes.json':jtext(notes)}
    outputs['summary.md']=executive(summary)
    outputs['implementation-plan.md']=plan(summary)
    assert sha(workbook.read_bytes())==original_hash, 'Workbook changed during read-only audit'
    return outputs,summary

def executive(s):
    c=s['comparison']; lines=['# GM-01 · Auditoría del Globo Mundial','','**Comparación documental terminada; implementación no iniciada.** Las decisiones taxonómicas y geográficas pendientes siguen expresamente abiertas, sin impedir inventariar cada fila. No equivale a aprobar todas las distribuciones o nuevas identidades.','',f"Base `main`: `{s['base_commit']}`; código jugable `{s['base_game_commit']}`. Versión **3.28.0**, guardado **gran_atlas_v05**.",'',f"Excel `{s['source']['filename']}`, SHA-256 `{s['source']['sha256']}`. Lectura efectiva de las seis hojas: **209 celdas, 103 pobladas, 106 reservadas, 900 registros científicos y 1.574 presencias**. El archivo no se modifica ni se publica.",'',f"Motor efectivo: **710 identidades de catálogo, 79 regiones funcionales y 1.329 presencias**, cinco continentes. Hay **{s['runtime']['visual_cells']} celdas visuales**; {s['runtime']['visual_nonfunctional_cells']} no son regiones. Cero nombres científicos completos duplicados; los solapamientos de especie/subespecie se registran aparte, sin fusiones.",'','## Inventario por continente o medio','','| Fuente | Celdas con fauna | Reservadas | Regiones pendientes | Presencias fuente | Conceptos sin ID canónico actual |','| --- | ---: | ---: | ---: | ---: | ---: |']
    for medium,m in s['by_source_medium'].items():lines.append(f"| {medium} | {m['source_regions_with_fauna']} | {m['reserved_without_fauna']} | {m['pending_regions']} | {m['source_presences']} | {m['unmatched_source_concepts']} |")
    lines+=['','Los conceptos se comparten entre medios: **no sumar la última columna para obtener altas globales**. Las 106 celdas vacías no se convierten en regiones. Las equivalencias africanas parciales tampoco autorizan reducir toda una región amplia a su destino actual.', '', '## Identidades y presencias', '', f"De 900 filas de catálogo, {c['source_records_with_proven_game_identity']} tienen correspondencia demostrada con **{c['current_canonical_ids_reused']} IDs actuales**. Cuatro equivalencias documentadas conservan `Pecari tajacu → Dicotyles tajacu`, `Pudu mephistophiles → Pudella mephistophiles`, `Dasypus hybridus → Dasypus septemcinctus` y `Conepatus humboldtii → Conepatus chinga`. Solo el pecarí reúne dos registros nominales de esta fuente en una identidad: las 900 filas representan 899 conceptos tras esa decisión.", '',f"Quedan **{c['source_concepts_without_proven_current_identity']} conceptos fuente sin correspondencia canónica**: {c['unrepresented_concepts_without_rank_or_intent_block']} sin representación actual demostrada y **{len(c['unresolved_rank_or_intent_concepts'])} bloqueos de rango/intención** ({', '.join(c['unresolved_rank_or_intent_concepts'])}). No son 190 altas por resta ni 236 altas aprobadas. El número de conceptos sin representación es exacto bajo las equivalencias declaradas; las revisiones de complejos pueden cambiar la decisión biológica futura, nunca se resuelven inventando un sinónimo.", '',f"Hay {c['game_ids_without_source_canonical_equivalence']} IDs actuales sin registro fuente canónico después de los alias, incluidos candidatos de rango. Se conservan. `species.csv` contiene las 900 filas fuente y estos registros adicionales; no cuenta un candidato como correspondencia aprobada.", '',f"Las {s['source']['presences']} presencias originales permanecen una vez cada una en `presences.csv`, con todos sus campos, hoja, fila, ESP e HX. Concordancias de datos: **{c['confirmed_game_pairs']}**; candidatos de rango sin equivalencia aprobada: **{c['candidate_pairs_NOT_PROVEN_EQUIVALENCES']}**. Las regiones futuras reúnen **{c['pending_new_region_presences']} presencias**. Hay {c['pending_distribution_in_existing_regions']} asignaciones pendientes sin justificación documentada en regiones actuales; diferencias por corrección taxonómica histórica: {c['documented_taxonomic_distribution_differences']}, que requieren revisar la fuente, no ampliar automáticamente la fauna. Las {c['additional_game_pairs_without_source']} asignaciones adicionales del juego no se eliminan ni se califican automáticamente de error; se exportan junto a los candidatos, separadas de las filas fuente.", '', 'Concordancia de datos no significa ocurrencia científicamente validada. Se distinguen las equivalencias geográficas parciales y las alertas de AM-01/AM-04. Cada presencia actual tiene una combinación manual válida y estación automática alcanzable; no se modificaron filtros.', '', '## Incidencias prioritarias', '', '- `HX-06-07`: Amazonía en Excel y Sáhara en juego; se conserva `sa_amazonia`. Se inventarían colisiones adicionales si se reutilizaran IDs oceánicos/polares ocupados por regiones africanas.', '- Leopardo de fuente `Panthera pardus` frente a las dos subespecies actuales; gorila oriental frente a gorila de montaña; Dingo etiquetado `Canis familiaris`. No resolver por nombre común, género ni truncamiento.', '- Magreb, Fauna fila 607: la fuente dice `Canis aureus`; el juego usa allí `Canis lupaster`, explícitamente distinguido en el código. Se conservan ambas identidades y el registro original: no es un alias ni una orden de introducir el chacal euroasiático en África.', '- Cuatro equivalencias africanas son parciales; las diez regiones funcionales adicionales africanas no son regiones fuente pendientes ni duplicados que borrar.', '- Se conservan los cinco conceptos sudamericanos no resueltos por AM-04 y las alertas de distribución. Los conceptos marinos amplios y límites batimétricos quedan señalados para revisión, no certificados por un enlace GBIF.', '- El vocabulario actual no representa por sí solo pelágico, abisal o hielo antártico interior. Planificar hábitats compatibles después, sin meter toda la fauna oceánica en Costa para forzar encuentros.', '', '## Arte y planificación', '', f"`art-audit.csv` contiene {sum(s['art_workload_preliminary'].values())} registros sin ID canónico actual: perfiles y familias editoriales preliminares, clasificación actual consultada sin renderizar especies nuevas. No hay albinismo, melanismo, sexos ni especiales nuevos configurados. Los tres registros bloqueados no autorizan tres ilustraciones nuevas. Las cargas cuentan tratamientos de especie, no motores o familias nuevos.", '', 'Orden recomendado: resolver bloqueos de identidad y crosswalk → GM-02 Oceanía → GM-03 áreas polares → GM-04 superficie/profundidad/abisal → GM-05 consolidación y diferencias heredadas. [Plan exacto por conjuntos](implementation-plan.md).', '', '## Trazabilidad y validación', '', 'Categorías: A identidad vinculada sin diferencias comparadas; B identidad existente con diferencias; C sin identidad actual demostrada; D alias explícito; E revisión de identidad, distribución o concepto. Una E no significa necesariamente especie ausente. Las anotaciones de subárea vigentes de AM-04 se conservan por fila, junto al aviso histórico; un aviso no prueba un defecto funcional.', '', 'Clasificación de las 900 filas fuente: '+', '.join(k+' = '+str(v) for k,v in c['source_categories'].items())+'.', '', 'El snapshot se ejecuta en una VM aislada con almacenamiento en memoria. No lee partidas personales. Las condiciones de acceso se exportan del motor; cualquier indicador `met` del snapshot pertenece a ese estado inicial de prueba. La compatibilidad histórica se comprueba mediante las suites existentes, no mediante acceso a una partida del usuario.', '', '[Regiones](regions.csv) · [Especies](species.csv) · [Presencias](presences.csv) · [Incidencias](issues.csv) · [Arte preliminar](art-audit.csv) · [Totales y comprobaciones](summary.json) · [Snapshot efectivo](game-snapshot.json) · [Decisiones declaradas](decisions.json) · [Notas de fuente](source-notes.json).', '', 'Todas las verificaciones estructurales de `summary.json` pasan. El manifiesto de archivos productivos demuestra que esta auditoría no los cambia. Las pruebas existentes y la reproducción se registran separadamente en `validation.json`; no se altera `www/`, la versión ni se genera APK. Los CSV incluyen datos originales, efectivos y propuestas en columnas separadas.']
    return '\n'.join(lines)+'\n'
def plan(s):
    lines=['# Plan posterior a GM-01 · propuestas, no contenido implementado','','Los números se calculan por conjuntos de identidades completas y alias explícitos. “Nuevo” significa concepto fuente sin ID actual bajo esas reglas, **no alta taxonómica aprobada**. Un concepto creado en una fase anterior se reutiliza en la siguiente. No se asignan costos, umbrales ni investigaciones futuras en esta auditoría.','','## Revisión previa obligatoria','','Resolver la intención de Dingo/Canis familiaris antes del primer alta de GM-02. Mantener Panthera pardus y Gorilla beringei como conceptos de rango pendientes: no crear duplicados de sus candidatos actuales ni redistribuirlos sin decidir alcance. Revisar los avisos taxonómicos por fase y conservar el origen en todas las decisiones.','','| Fase | Regiones nuevas | Presencias fuente | IDs actuales reutilizables | Conceptos nuevos de esta fase | Reutilizados de fases previas | Conceptos bloqueados |','| --- | ---: | ---: | ---: | ---: | ---: | ---: |']
    for p in s['phases']:lines.append(f"| {p['phase']} | {p['regions']} | {p['presences']} | {p['current_reusable_count']} | {p['new_count_under_declared_source_concepts']} | {p['reused_from_prior_count']} | {p['blocked_count']} |")
    for p in s['phases']:
        lines += ['', '## '+p['phase']+' · '+', '.join(p['media']), '',f"**{p['regions']} regiones, {p['presences']} filas de presencia**. Reutilizar {p['current_reusable_count']} IDs actuales y {p['reused_from_prior_count']} conceptos que el orden previo ya incorporaría. {p['new_count_under_declared_source_concepts']} conceptos nominales no representados corresponden por primera vez a esta fase; {p['blocked_count']} quedan sin alta asignada por identidad/intención.", '', 'Carga artística por tratamiento de especie, preliminar: '+compact(p['art_workload'])+'. No implica ese número de motores nuevos.', '', 'IDs actuales reutilizables: '+(' | '.join(x['id']+' ('+x['scientific']+')' for x in p['current_reusable_species']) or 'Ninguno')+'.', '', 'Conceptos nuevos asignados a esta fase: '+joined(p['new_unrepresented_source_concepts'])+'.', '', 'Conceptos reutilizados de fases previas: '+(joined(p['reused_concepts_from_prior_phases']) or 'Ninguno')+'.', '', 'Bloqueos de identidad sin asignación: '+(joined(p['blocked_identity_concepts']) or 'Ninguno de rango/intención; subsisten revisiones científicas señaladas en issues.csv')+'.']
        lines+=['','Regiones fuente pendientes:']
        for region in p['pending_region_records']:
            lines.append('- '+region['source_name']+' · '+region['source_hex_id']+' · '+str(region['source_presence_count'])+' presencias · ID semántico propuesto, no implementado: `'+region['proposed_id_NOT_IMPLEMENTED']+'`'+(' · Colisión de HX con región actual: `'+region['id_collision_game_id']+'`' if region['id_collision_game_id'] else '')+'.')
        if p['phase']=='GM-02':lines+=['', 'Riesgos: nuevas bases de macrópodos, monotremas, falangeros, kiwi/casuario/aves del paraíso. No usar osos para koalas, erizos para equidnas ni avestruces sin adaptar. Mantener las identidades compartidas con futuros mares. El acceso continental se diseñará sin materiales que solo existan tras su propio bloqueo.']
        elif p['phase']=='GM-03':lines+=['','Riesgos: separar Ártico/Antártida y costa/borde de hielo del interior de casquetes. No añadir las 22 celdas de hielo vacías como regiones jugables. Focas, otáridos, morsas, narvales y grandes ballenas exigen anatomías propias y reutilización donde coincidan con Oceanía.']
        else:lines+=['','Subdividir la implementación interna en GM-04A superficie (12 regiones / 192 presencias), GM-04B profundo (5 / 44) y GM-04C abisal (2 / 3), manteniendo deduplicación de todo GM-04. El orden se justifica por hábitats y perfiles distintos, no por crear más celdas. Revisar batimetría, arrecifes y complejos de peces/cetáceos. Los 19 cefalópodos se mantienen en la categoría jugable Peces sin afirmar que sean peces biológicos.']
        lines+=['','Aceptación verificable: todas las filas fuente de los medios de esta fase trazadas una vez; mismos IDs para identidades compartidas; ninguna referencia inválida ni duplicado nominal; al menos una combinación de encuentro válida por presencia; mapas compactos solo con regiones acordadas, acceso alcanzable y sin ciclos; SVG revisados realmente en móvil y sin perfiles de familia ajena; regresión de partidas y de los cinco continentes previos.']
    lines+=['','## GM-05 · consolidación mundial','','No asignar nuevas regiones de las 106 celdas reservadas. Validar las 1.574 filas originales sin pérdidas, las adiciones históricas actuales, los rangos taxonómicos y las equivalencias parciales. La diferencia Canis aureus/Canis lupaster en Magreb exige revisar la fuente y conservar la corrección histórica; no agregar Canis aureus sin justificación. Los casos de leopardo/gorila y la fauna adicional del juego requieren decisiones explícitas, no altas automáticas. No se impone llegar a 900 restando o borrando contenido.', '', 'Las cifras de identidad aprobada y catálogo final se fijarán al resolver las revisiones, sin cambiar el inventario nominal comprobado. Repetir integridad, progresión, economía, arte, encuentros, guardado/offline, rendimiento y pruebas físicas Android antes del cierre. La auditoría GM-01 ya deja fuente, IDs, filas, conjuntos de reutilización y bloqueos para no volver a extraer ni cotejar el Excel desde cero.']
    return '\n'.join(lines)+'\n'

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('workbook',type=Path);parser.add_argument('--output',type=Path,default=ROOT/'docs/gm01');parser.add_argument('--check',action='store_true',help='Compare generated reports byte-for-byte; write nothing.');args=parser.parse_args()
    out=args.output.resolve()
    if out==ROOT or (out.is_relative_to(ROOT) and not out.is_relative_to(ROOT/'docs')):parser.error('Output inside repository must be under docs/; production/tool/test directories are forbidden.')
    if not args.workbook.is_file():parser.error('Excel fuente no accesible. GM-01 permanece bloqueada: se necesita el original; no se reconstruyen datos desde el juego.')
    before=prod_manifest();outputs,summary=audit(args.workbook)
    if args.check:
        differences=[name for name,data in outputs.items() if not (out/name).is_file() or (out/name).read_bytes()!=data.encode('utf-8')]
        if differences:raise SystemExit('Reports differ: '+', '.join(differences))
    else:
        out.mkdir(parents=True,exist_ok=True)
        for name,data in outputs.items():(out/name).write_text(data,encoding='utf-8',newline='')
    assert before==prod_manifest(), 'Production files changed during audit'
    print(json.dumps({'status':summary['status'],'check':args.check,'reports':len(outputs),'comparison':summary['comparison'],'phase_counts':[{k:v for k,v in p.items() if k.endswith('count') or k in ['phase','regions','presences','new_count_under_declared_source_concepts']} for p in summary['phases']]},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
