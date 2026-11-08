#!/usr/bin/env python3
"""AM-01 read-only workbook/runtime audit. Writes documentation only; never saves XLSX/game data."""
import argparse, collections, csv, hashlib, io, json, re, subprocess, tempfile, unicodedata, warnings
from pathlib import Path
import openpyxl

ROOT=Path(__file__).resolve().parent.parent
CONTINENTS=['América del Norte','América del Sur']
GAME_CONTINENT={'América del Norte':'Norteamérica','América del Sur':'Sudamérica'}

def digest(data): return hashlib.sha256(data).hexdigest()
def norm(value): return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',str(value or '')).strip()).casefold()
def joined(values): return ' | '.join(sorted(set(str(v) for v in values if v is not None and str(v))))
def csv_text(rows,headers=None):
    out=io.StringIO(newline=''); writer=csv.DictWriter(out,fieldnames=headers or list(rows[0]),lineterminator='\n');writer.writeheader();writer.writerows(rows);return out.getvalue()
def jtext(value): return json.dumps(value,ensure_ascii=False,indent=2,sort_keys=True)+'\n'
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('workbook',type=Path);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    warnings.filterwarnings('ignore',category=UserWarning,module='openpyxl')
    book=openpyxl.load_workbook(args.workbook,data_only=True,read_only=True)
    values={s.title:[list(row) for row in s.values] for s in book}
    decisions=json.loads((ROOT/'docs/americas-audit/manual-decisions.json').read_text())
    with tempfile.TemporaryDirectory(prefix='atlas-am01-') as tmp:
        source=Path(tmp)/'workbook.json';source.write_text(jtext(values))
        runtime=json.loads(subprocess.check_output(['node','scripts/export-americas-runtime.cjs',str(source)],cwd=ROOT,text=True))
    def records(sheet):
        return [dict(zip(values[sheet][0],row))|{'source_sheet':sheet,'source_row':i+2} for i,row in enumerate(values[sheet][1:]) if row[0] is not None]
    fauna,hexes,catalog=records('Fauna'),records('Hexágonos'),records('Catálogo especies')
    americas=[r for r in fauna if r['Continente / medio'] in CONTINENTS]
    source_taxa=sorted({r['Nombre científico'] for r in americas},key=norm)
    canonical=lambda name: decisions['planning_aliases'].get(name,name)
    by_taxon={name:[r for r in americas if r['Nombre científico']==name] for name in source_taxa}
    by_plan={name:[r for r in americas if canonical(r['Nombre científico'])==name] for name in sorted(set(map(canonical,source_taxa)))}
    game_by_name=collections.defaultdict(list)
    for sid,sp in runtime['species'].items(): game_by_name[norm(sp['latin'])].append(sid)
    game_regions={r['id']:r for r in runtime['regions']}
    findings=[]
    def issue(kind,severity,taxon='',region='',description='',rows=None):
        item={'issue_id':'AM01-'+str(len(findings)+1).zfill(3),'type':kind,'severity':severity,'scientific_name':taxon,'region':region,'source_rows':joined(rows or [r['source_row'] for r in by_taxon.get(taxon,[]) if not region or r['Región']==region]),'description':description,'resolution':'Pendiente; no aplicado al juego'};findings.append(item);return item['issue_id']
    for taxon,reason in decisions['taxonomic_reviews'].items():
        assert taxon in by_taxon,taxon;issue('taxonomia','revision',taxon,description=reason)
    for old,new in decisions['planning_aliases'].items():
        issue('sinonimia','bloqueo_importacion',old,description=decisions['taxon_alias_notes'][old],rows=[r['source_row'] for r in by_plan[new]])
    for finding in decisions['distribution_screening']:
        rows=[r for r in americas if r['Nombre científico']==finding['scientific_name'] and r['Región']==finding['region']];assert rows,finding
        issue('distribucion',finding['severity'],finding['scientific_name'],finding['region'],finding['reason'])
    for name,reason in decisions['unsafe_art_routes'].items(): issue('arte','revision',name,description=reason)
    issue('clasificacion_fuente','revision','Ambystoma mexicanum',description='La fuente lo sitúa en Ranas y sapos; es un caudado de Ambystomatidae. Preparar clasificación y perfil de salamandra/ajolote, no rana.')
    issue('clasificacion_fuente','revision','Micrathene whitneyi',description='La fuente usa Aves terrestres; revisar subgrupo Rapaces/Strigidae, sin inferir que es un pájaro paseriforme.')
    for hx in hexes:
        if hx['Continente / medio'] in CONTINENTS and hx['ID hex'] in game_regions:
            current=game_regions[hx['ID hex']]
            if current['continent']!=GAME_CONTINENT[hx['Continente / medio']]:
                issue('colision_id_region','bloqueo_importacion',region=hx['Región geográfica'],description='El ID fuente '+hx['ID hex']+' pertenece actualmente a '+current['name']+' ('+current['continent']+'). No reutilizar ni renombrar el ID guardado; crear identidad sudamericana independiente y mantener sourceHexId.',rows=[r['source_row'] for r in americas if r['ID hex']==hx['ID hex']])
    species_rows=[];plan_art={};existing_ids=set();rarity_conflicts=[]
    rarity_normal={'Muy raro':'Muy rara'}
    for name in source_taxa:
        rows=by_taxon[name];key=canonical(name);all_rows=by_plan[key];ids=game_by_name.get(norm(key),[])
        if len(ids)>1: issue('colision_catalogo','bloqueo_importacion',name,description='Múltiples IDs efectivos para el mismo nombre normalizado: '+joined(ids))
        sid=ids[0] if len(ids)==1 else '';sp=runtime['species'].get(sid,{})
        family=decisions['family_by_genus'][name.split()[0]];notes=[];differences=[]
        proposed_class={'Mamíferos':'Mammalia','Aves':'Aves','Peces':'Actinopterygii'}.get(rows[0]['Grupo animal'])
        if not proposed_class:proposed_class='Amphibia' if family in ['Phyllomedusidae','Ambystomatidae','Ceratophryidae','Dendrobatidae','Hemiphractidae','Centrolenidae','Bufonidae','Ranidae','Rhinodermatidae'] else 'Reptilia'
        source_rares=sorted({r['Rareza (juego)'] for r in rows});source_groups=sorted({r['Grupo animal'] for r in rows})
        if sp:
            existing_ids.add(sid)
            if {rarity_normal.get(x,x) for x in source_rares}!={sp['rare']}:
                reason='Rareza de fuente '+joined(source_rares)+' frente al juego '+sp['rare']+'. Conservar la del juego hasta una decisión de balance independiente.'
                differences.append(reason);rarity_conflicts.append(name);issue('rareza','conservar_actual',name,description=reason)
            if name=='Aquila chrysaetos':
                reason='taxonomyInfo devuelve Aves terrestres; la fuente la clasifica como rapaz. Revisar categoría interna sin cambiar probabilidad.';differences.append(reason);issue('clasificacion','revision',name,description=reason)
            if name=='Lagopus lagopus':
                reason=decisions['taxon_alias_notes'][name];differences.append(reason);issue('nombre','revision',name,description=reason)
            category='B' if differences else 'A'
        elif name!=key: category='D'
        elif name in decisions['taxonomic_reviews'] or len(ids)>1: category='E'
        else: category='C'
        if name in decisions['taxonomic_reviews']:notes.append(decisions['taxonomic_reviews'][name])
        if name in decisions['taxon_alias_notes']:notes.append(decisions['taxon_alias_notes'][name])
        if len({r['Continente / medio'] for r in all_rows})>1:notes.append('Una sola identidad compartida por Norteamérica y Sudamérica; conservar todas las presencias.')
        classes=runtime['candidates'][name]['classifiers'];routes=joined(k+':'+v for k,v in classes.items() if v)
        base=decisions['compatible_bases'].get(family,'Sin perfil americano compatible confirmado; crear perfil propio en el motor del grupo.')
        if sp:
            workload='REVISAR_EXISTENTE' if name in decisions['unsafe_art_routes'] else 'REUTILIZAR_EXISTENTE'
            route=joined(k+':'+str(v) for k,v in sp['artAttributes'].items() if k.endswith('family') or k.endswith('morph'))
            art_note='No se necesita un sprite nuevo por extender la distribución; comprobar variantes y escala.'
        else:
            workload='NUEVO_PERFIL' if family not in decisions['compatible_bases'] or name in decisions['new_profile_species'] else 'ADAPTAR_BASE'
            route=routes or 'Sin coincidencia en clasificadores de producción'
            art_note='Estimación editorial: '+('anatomía/perfil específico nuevo, dentro de un motor existente o su extensión.' if workload=='NUEVO_PERFIL' else 'extender clasificación, morfología y paleta con una base anatómica compatible; no está listo para usar.')
        if name in decisions['unsafe_art_routes']:art_note+=' '+decisions['unsafe_art_routes'][name]
        if category=='D':workload='ALIAS_SIN_SPRITE_ADICIONAL';art_note='Comparte el futuro perfil con '+key+'.'
        else:plan_art[key]=workload
        sex='Configurado: '+jtext(sp['dimorphismConfig']).strip() if sp.get('dimorphismConfig') else decisions['sexual_review_by_genus'].get(name.split()[0],'Sin dimorfismo configurado. Revisar evidencia por especie; no presupone ausencia biológica de dimorfismo.')
        new_id=sid or ('am_'+norm(key).replace(' ','_') if key not in decisions['taxonomic_reviews'] else 'PENDIENTE_REVISION_TAXONOMICA')
        issue_ids=joined(f['issue_id'] for f in findings if f['scientific_name']==name)
        species_rows.append({'scientific_name':name,'common_names':joined(r['Nombre común'] for r in rows),'source_species_ids':joined(r['ID especie'] for r in rows),'source_group':joined(source_groups),'source_subgroup':joined(r['Subgrupo'] for r in rows),'proposed_class_reference':proposed_class,'zoological_family_reference':family,'family_validation':'Referencia manual; autoridad pendiente','continents':joined(r['Continente / medio'] for r in rows),'regions':joined(r['Región'] for r in rows),'source_presence_count':len(rows),'source_rows':joined(r['source_row'] for r in rows),'category':category,'planning_taxon':key,'existing_id':sid,'existing_name':sp.get('name',''),'existing_taxonomy':jtext(sp['taxonomy']).strip() if sp else '', 'source_rarity':joined(source_rares),'game_rarity':sp.get('rare',''),'source_biomes':joined(r['Bioma'] for r in rows),'game_habitats':joined(sp.get('habitats',[])),'game_regions':joined(r['name'] for r in runtime['regions'] if sid and sid in r['species']),'proposed_id_NOT_IMPLEMENTED':new_id,'needs_new_identity':bool(not sid and category!='D'),'existing_svg_route':route,'compatible_base_reference':base,'art_workload':workload,'art_notes':art_note,'sexual_dimorphism':sex,'existing_pigment_variants':joined(x for x in sp.get('special',[]) if x in ['Albino','Melánico']) if sp else 'No configuradas; no inferir de la fuente','existing_specimen_categories':joined(x for x in sp.get('configuredSpecials',[]) if x not in ['Albino','Melánico']),'differences':joined(differences),'taxonomic_notes':joined(notes),'issue_ids':issue_ids})
    species_by_name={r['scientific_name']:r for r in species_rows}
    region_rows=[]
    for hx in hexes:
        if hx['Continente / medio'] not in CONTINENTS:continue
        name=hx['Región geográfica'];rows=[r for r in americas if r['ID hex']==hx['ID hex']];occupied=game_regions.get(hx['ID hex']);live=occupied if occupied and occupied['continent']==GAME_CONTINENT[hx['Continente / medio']] else None;config=decisions['regions'][name]
        taxa={canonical(r['Nombre científico']) for r in rows};shared={t for t in taxa if len({r['ID hex'] for r in by_plan[t]})>1}
        shared_here={t for t in taxa if len({r['ID hex'] for r in by_plan[t] if r['Continente / medio']==hx['Continente / medio']})>1}
        unchanged=live and {runtime['species'][i]['latin'] for i in live['species']}=={r['Nombre científico'] for r in rows}
        assert not live or unchanged,'Prototype distribution differs from workbook'
        assert set(config['proposed_habitats'])<=set(runtime['biomes'])
        assert len(config['proposed_habitats'])<=4
        region_rows.append({'region':name,'continent':hx['Continente / medio'],'source_hex_id':hx['ID hex'],'source_row':hx['source_row'],'source_map_row':hx['Fila mapa'],'source_map_column':hx['Columna mapa'],'source_biome':hx['Bioma (genérico)'],'source_presence_count':len(rows),'source_unique_scientific_names':len({r['Nombre científico'] for r in rows}),'planning_unique_taxa':len(taxa),'shared_taxa_count_americas':len(shared),'shared_taxa_count_same_continent':len(shared_here),'shared_scientific_names':joined(shared),'source_fauna_rows':joined(r['source_row'] for r in rows),'game_status':'Existente funcional; distribución coincide' if live else ('Celda visual de contexto; no es región funcional' if hx['Continente / medio']=='América del Norte' else 'No implementada; continente solo como entrada no jugable'),'existing_region_id':live['id'] if live else '', 'source_hex_id_collision':occupied['name']+' ('+occupied['continent']+')' if occupied and not live else '', 'proposed_region_id_NOT_IMPLEMENTED':live['id'] if live else (hx['ID hex'] if hx['Continente / medio']=='América del Norte' else 'sa_'+unicodedata.normalize('NFKD',norm(name)).encode('ascii','ignore').decode().replace(' ','_')), 'needs_functional_region':not bool(live),'existing_habitats':joined(live['habitats']) if live else '', 'proposed_habitats_NOT_IMPLEMENTED':joined(config['proposed_habitats']),'conceptual_latitude_NOT_COORDINATE':config['conceptual_latitude'],'conceptual_longitude_NOT_COORDINATE':config['conceptual_longitude'],'suggested_cartographic_position':config['suggested_position'],'integration_notes':'Mantener ID, requisitos y partida; no reconstruir ni mover el Atlas en AM-01. '+'Conservar mapas y desbloqueos actuales.' if live else 'ID fuente como referencia estable, independiente de coordenadas. Hábitats y posición son propuestas; revisión de distribuciones antes de importar. Sin cambios visuales en AM-01.','issues':joined(f['issue_id'] for f in findings if f['region']==name)})
    presence_rows=[]
    for r in americas:
        species=species_by_name[r['Nombre científico']];row_findings=[f for f in findings if (not f['scientific_name'] or f['scientific_name']==r['Nombre científico']) and (not f['region'] or f['region']==r['Región'])]
        distribution=[f for f in row_findings if f['type']=='distribucion']
        presence_rows.append({**r,'planning_taxon_NOT_IMPLEMENTED':canonical(r['Nombre científico']),'audit_category':species['category'],'existing_game_id':species['existing_id'],'distribution_screening':'REVISAR: '+joined(f['issue_id'] for f in distribution) if distribution else 'Sin incompatibilidad evidente en cribado; presencia no validada con registros externos','issue_ids':joined(f['issue_id'] for f in row_findings)})
    # Cross-sheet referential and coverage checks: never use formatting-only rows as records.
    hex_by_id={r['ID hex']:r for r in hexes};catalog_by_id={r['ID especie']:r for r in catalog};checks={}
    map_cells=[]
    for row in values['Mapa']:
        for value in row:
            match=re.fullmatch(r'(\d{2})·(\d{2})\n(\d+) esp\.',value) if isinstance(value,str) else None
            if match:map_cells.append(('HX-'+match[1]+'-'+match[2],int(match[3])))
    checks['map_has_exactly_all_hexes']=len(map_cells)==len(hexes) and {hid for hid,count in map_cells}==set(hex_by_id)
    checks['map_cell_counts_match_hexes']=all(count==hex_by_id[hid]['Animales cargados'] for hid,count in map_cells)
    checks['all_fauna_hex_ids_resolve']=all(r['ID hex'] in hex_by_id for r in fauna)
    checks['all_fauna_species_ids_resolve']=all(r['ID especie'] in catalog_by_id for r in fauna)
    checks['catalog_names_match_presences']=all(r['Nombre científico']==catalog_by_id[r['ID especie']]['Nombre científico'] for r in fauna)
    checks['all_hex_counts_match']=all(h['Animales cargados']==sum(r['ID hex']==h['ID hex'] for r in fauna) for h in hexes)
    checks['catalog_presence_counts_match']=all(c['Hexágonos con registro']==sum(r['ID especie']==c['ID especie'] for r in fauna) for c in catalog)
    checks['no_exact_species_region_duplicates']=not any(v>1 for v in collections.Counter((r['ID hex'],norm(r['Nombre científico'])) for r in fauna).values())
    checks['american_source_rows_preserved_once']=len(presence_rows)==len(americas)==len({r['source_row'] for r in presence_rows})
    checks['all_american_regions_accounted_for']=len(region_rows)==len({r['ID hex'] for r in americas})
    checks['both_existing_regions_match_source']=all(r['game_status'].startswith('Existente') for r in region_rows if r['source_hex_id'] in ['HX-01-05','HX-02-02'])
    checks['all_existing_ids_resolve']=all(not r['existing_id'] or r['existing_id'] in runtime['species'] for r in species_rows)
    checks['proposed_ids_are_one_per_taxon']=len({r['proposed_id_NOT_IMPLEMENTED'] for r in species_rows if r['category'] not in ['D','E']})==sum(r['category'] not in ['D','E'] for r in species_rows)
    checks['source_species_ids_are_unique']=len(catalog_by_id)==len(catalog)
    checks['source_hex_ids_are_unique']=len(hex_by_id)==len(hexes)
    checks['new_region_ids_do_not_replace_existing']=all(r['existing_region_id'] or r['proposed_region_id_NOT_IMPLEMENTED'] not in game_regions for r in region_rows)
    checks['proposed_region_ids_are_unique']=len({r['proposed_region_id_NOT_IMPLEMENTED'] for r in region_rows})==len(region_rows)
    checks['all_original_presence_fields_preserved']=all(all(a[k]==b[k] for k in values['Fauna'][0]) for a,b in zip(americas,presence_rows))
    assert all(checks.values()),checks
    counts={}
    for continent in CONTINENTS:
        rows=[r for r in americas if r['Continente / medio']==continent];taxa={r['Nombre científico'] for r in rows};keys={canonical(t) for t in taxa};regions=[r for r in region_rows if r['continent']==continent]
        counts[continent]={'regions':len(regions),'presences':len(rows),'source_unique_scientific_names':len(taxa),'planning_taxa_after_alias':len(keys),'existing_taxa':sum(bool(game_by_name.get(norm(k))) for k in keys),'without_game_identity':sum(not bool(game_by_name.get(norm(k))) for k in keys),'taxonomic_review_taxa':len(keys&set(decisions['taxonomic_reviews'])),'missing_functional_regions':sum(r['needs_functional_region'] for r in regions),'categories_by_source_name':dict(collections.Counter(species_by_name[t]['category'] for t in taxa)),'art_workload_by_planning_taxon':dict(collections.Counter(plan_art[t] for t in keys))}
    common_names=collections.defaultdict(set)
    for r in [*catalog,*runtime['species'].values()]:
        label=r.get('Nombre común',r.get('name'));latin=r.get('Nombre científico',r.get('latin'));common_names[norm(label)].add(latin)
    ambiguities={k:sorted(v) for k,v in common_names.items() if len(v)>1 and any(t in source_taxa for t in v)}
    planning_counts=collections.Counter(plan_art.values())
    summary={'source_workbook':{'file':args.workbook.name,'sha256':digest(args.workbook.read_bytes()),'user_confirmed_previous_file':True,'requested_filename':'Atlas_Fauna_Hexagonal_209_900_Especies(3).xlsx','sheets':[{'name':s.title,'physical_max_row':s.max_row,'columns':s.max_column,'nonempty_rows':sum(any(x is not None for x in row) for row in values[s.title])} for s in book]},'production_base_commit':subprocess.check_output(['git','log','-1','--format=%H','--','www','package.json','capacitor.config.json'],cwd=ROOT,text=True).strip(),'game_version':json.loads((ROOT/'package.json').read_text())['version'],'runtime_sources':runtime['sources'],'global_source':{'hexagons':len(hexes),'fauna_presences':len(fauna),'catalog_entries':len(catalog),'scientific_names':len({r['Nombre científico'] for r in fauna})},'game_catalog':{'species':len(runtime['species']),'functional_regions':len(runtime['regions'])},'continents':counts,'americas':{'source_presences':len(americas),'source_scientific_names':len(source_taxa),'planning_taxa_after_one_alias':len(by_plan),'shared_scientific_names_between_continents':sorted(set(r['Nombre científico'] for r in americas if r['Continente / medio']==CONTINENTS[0])&set(r['Nombre científico'] for r in americas if r['Continente / medio']==CONTINENTS[1])),'categories':dict(collections.Counter(r['category'] for r in species_rows)),'existing_taxa':len(existing_ids),'without_game_identity':len(by_plan)-len(existing_ids),'taxonomic_review_taxa':len(decisions['taxonomic_reviews']),'planning_alias_groups':len(decisions['planning_aliases']),'new_art_profiles_estimate':planning_counts['NUEVO_PERFIL'],'adapt_existing_bases_estimate':planning_counts['ADAPTAR_BASE'],'existing_art_reuse':planning_counts['REUTILIZAR_EXISTENTE'],'existing_art_review':planning_counts['REVISAR_EXISTENTE'],'candidate_classifier_missing':sum(not any(c['classifiers'].values()) for c in runtime['candidates'].values()),'existing_dimorphism_taxa':sum(bool(runtime['species'][i]['dimorphismConfig']) for i in existing_ids),'new_dimorphism_review_taxa':sum(not r['existing_id'] and r['category']!='D' and r['scientific_name'].split()[0] in decisions['sexual_review_by_genus'] for r in species_rows),'rarity_conflicts':rarity_conflicts,'distribution_findings':sum(f['type']=='distribucion' for f in findings)},'common_name_ambiguities':ambiguities,'checks':checks,'limitations':['No se verificaron externamente taxonomía ni registros georreferenciados. Cribado razonado con casos pendientes explícitos.','Las familias de referencia, posiciones y bases artísticas son propuestas manuales, no columnas del Excel.','La unión Pecari/Dicotyles es una propuesta de identidad para planificar; no se fusionaron datos del juego.','Las cifras de nuevas identidades y perfiles están condicionadas por 14 revisiones taxonómicas; no constituyen una importación aprobada.']}
    progression={'existing_research':[r for r in runtime['research'] if r['id'] in ['asia_1','africa_1','nuevo_mundo_1','norteamerica_1']],'existing_recipes':{k:v for k,v in runtime['recipes'].items() if 'map' in k or k=='oceanic_quadrant'},'atlantic_voyage':next(v for v in runtime['voyages'] if v['id']=='atlantic_survey'),'north_american_unlocks':[{k:r[k] for k in ['id','name','unlock']} for r in runtime['regions'] if r['continent']=='Norteamérica'],'existing_continent_flags':runtime['continents'],'missing_source_fields':['Familia zoológica formal','Horarios y estaciones por especie','Biomas específicos de cada especie (Bioma es genérico de región)','Dimorfismo e ilustraciones por sexo','Variantes y probabilidades de pigmentación','Costes, prestigio y requisitos de regiones nuevas','Autoridad taxonómica validada y evidencia de presencia georreferenciada']}
    game_rows=[{'game_id':sid,'scientific_name':s['latin'],'common_name':s['name'],'rarity':s['rare'],'kind':s['kind'],'habitats':joined(s['habitats']),'times':joined(s['times']),'seasons':joined(s['seasons']),'taxonomy':jtext(s['taxonomy']).strip(),'dimorphism_config':jtext(s['dimorphismConfig']).strip(),'pigments':joined(x for x in s['special'] if x in ['Albino','Melánico']),'specimen_categories':joined(s['configuredSpecials']),'art_route':jtext(s['artAttributes']).strip(),'existing_sprite_sha256':s['svgSha256']} for sid,s in sorted(runtime['species'].items())]
    docs={'docs/americas-species-audit.csv':csv_text(species_rows),'docs/americas-regions-audit.csv':csv_text(region_rows),'docs/americas-audit/source-presences.csv':csv_text(presence_rows),'docs/americas-audit/issues.csv':csv_text(findings),'docs/americas-audit/game-catalog-snapshot.csv':csv_text(game_rows),'docs/americas-audit/source-and-summary.json':jtext(summary),'docs/americas-audit/progression-snapshot.json':jtext(progression),'docs/americas-audit/workbook-notes.json':jtext({'summary_rows':[{'row':i+1,'values':row}for i,row in enumerate(values['Resumen']) if any(x is not None for x in row)],'methodology_rows':[{'row':i+1,'values':row}for i,row in enumerate(values['Metodología y fuentes']) if any(x is not None for x in row)],'map_scope':'Hoja Mapa inspeccionada en lectura; coordenadas originales no son las coordenadas del Atlas compacto.','map_data_cells':len(map_cells)})}
    for name,content in docs.items():
        path=ROOT/name
        if args.check:
            assert path.exists() and path.read_text()==content,'Outdated audit: '+name
        else:path.parent.mkdir(parents=True,exist_ok=True);path.write_text(content)
    print(jtext(summary['americas']).strip());print('CHECKS',len(checks),'PASS; generated documents',len(docs),'verified' if args.check else 'written')
if __name__=='__main__': main()
