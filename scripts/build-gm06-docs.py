import csv,json,pathlib,re
root=pathlib.Path(__file__).resolve().parents[1];docs=root/'docs/gm06'
def read(p):return json.loads((docs/p).read_text())
data=read('catalogo-candidato.json');gbif=read('sources/gbif-identidades.json');mdd={x['sciName'].replace('_',' '):x for x in read('sources/mdd-2.5-extracto.json')}
base=read('base-cartografia.json');regions={r['id']:r for r in base['regions']};regions.update({r['id']:r for r in data['regions']})
for id,name in data['renames'].items():regions[id]['name']=name
rows=[]
for id,sp in data['species'].items():
 latin=sp['latin'];g=gbif[latin];primary=''
 if latin in mdd:primary='https://www.mammaldiversity.org/taxon/'+mdd[latin]['id']
 elif sp['taxonomy']['className']=='Reptilia':primary='https://reptile-database.reptarium.cz/'+latin.replace(' ','/')
 elif sp['taxonomy']['className']=='Aves':primary='https://www.avilist.org/checklist/v2026/ — referencia de sistema; no comparación con XLSX descargado'
 else:primary='https://www.fishbase.se/TrophicEco/FishEcoList.php?ve_code=5' if 'rojo' in str(data['localities']) and sp['gm06']['morph']!='salmon' else 'https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/multiple-populations-atlantic-salmon-2025.html'
 rid=[key.split('|')[0] for key in data['localities'] if key.endswith('|'+id)]
 rows.append({'id':id,'nombre':sp['name'],'cientifico':latin,'familia':sp['taxonomy']['family'],'clase':sp['taxonomy']['className'],'regiones':' | '.join(regions[r]['name'] for r in rid),'localidad':sp['gm06']['locality'],'habitats':','.join(sp['habitats']),'rareza_candidata':sp['rare'],'GBIF_status':g.get('status','ERROR'),'GBIF_confianza':g.get('confidence',''),'GBIF_uso_aceptado':g.get('acceptedUsageKey',g.get('usageKey','')),'fuente_taxonomica':primary,'contraste_identidad':'https://api.gbif.org/v1/species/match?strict=true&name='+latin.replace(' ','%20'),'observacion':'Sinónimo Phalacrocorax harrisi en CDF/GBIF; Nannopterum en referencia aviar elegida' if latin=='Nannopterum harrisi' else 'MDD incluye mondaca; bozinovici separado' if latin=='Dromiciops gliroides' else '—'})
def tsv(name,rows):
 with (docs/name).open('w') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]),delimiter='\t',lineterminator='\n');w.writeheader();w.writerows(rows)
tsv('especies-revision.tsv',rows)
tsv('asociaciones-nuevas.tsv',[{'region_id':key.split('|')[0],'region':regions[key.split('|')[0]]['name'],'especie_id':key.split('|')[1],'tipo':'nueva ficha' if key.split('|')[1] in data['species'] else 'reutilización','localidad':note} for key,note in data['localities'].items()])
manifest=read('coleccionables-referencia.json');pieces={p['ID']:p for p in manifest['pieces']}
links={'hudson':['FIL-04','MAR-06'],'labrador':['MAR-01'],'atlantico':['MAR-01'],'antillas':['AMB-09','AMB-12','CON-07','COR-01'],'darien':['GEM-09','AMB-03'],'galapagos':['MAR-04'],'humboldt':['CIV-10','MAS-09'],'bosques':[],'patagonia':['MAP-09'],'rojo':['COR-03'],'sonda':['BOT-12'],'wallacea':[],'melanesia':['MAR-04'],'rapa_nui':[]}
proposals={'hudson':'Registro de York Factory y navegación de Hudson','labrador':'Carta de ríos y costas subárticas','atlantico':'Lámina de colonias y bancos atlánticos','antillas':'Correspondencia de historia natural por isla','darien':'Registro de selva y documentación de rutas; Boyacá no equivale a Darién','galapagos':'Láminas zoológicas y cartas de navegación específicas','humboldt':'Registros del guano y minerales; piezas culturales solo documentadas o reproducidas','bosques':'Láminas de bosque templado y herbario','patagonia':'Documentación de canales australes; Ancud como futuro 1843','rojo':'Carta de navegación y documentación de Moca','sonda':'Registro botánico de alcanfor y localidades de Rafflesia','wallacea':'Documentación de clavo, nuez moscada y macis por isla','melanesia':'Registro de sándalo y correspondencia marítima','rapa_nui':'Lámina de toromiro e ilustraciones documentales; no patrimonio como botín'}
collectionrows=[]
for key,ids in links.items():
 for id in ids:
  p=pieces[id];collectionrows.append({'zona':key,'estado':'existente en manifiesto; solo planificación','ID':id,'pieza':p['Pieza'],'procedencia_exacta':p['Procedencia sugerida'],'coleccion':p['Colección'],'condicion':'Futuro: sello de 1851' if id=='FIL-04' else 'Documentación o reproducción legítima' if id.startswith(('CIV','MAS')) else 'Afinidad temática; no nueva procedencia ni recompensa'})
 collectionrows.append({'zona':key,'estado':'propuesta no presente en manifiesto','ID':'—','pieza':proposals[key],'procedencia_exacta':'por definir con documentación','coleccion':'sin asignación operativa','condicion':'Sin inventario, rareza, precio, puntos o sistema de obtención'})
tsv('matriz-coleccionables.tsv',collectionrows)
# Capture the actual comparison, rather than converting old failures into a success claim.
logs={name:pathlib.Path('/tmp/'+file).read_text() for name,file in [('base','gm06-baseline-tests.log'),('candidate','gm06-final-suite.log')]}
def summary(s):
 failures=sorted(set(re.findall(r'^✖ (.+?) \([\d.]+ms\)',s,re.M)))
 return {'counts':dict(re.findall(r'ℹ (tests|pass|fail|duration_ms) ([^\n]+)',s)),'failures':failures}
report={k:summary(v) for k,v in logs.items()};report['newFailures']=sorted(set(report['candidate']['failures'])-set(report['base']['failures']));report['resolvedFailures']=sorted(set(report['base']['failures'])-set(report['candidate']['failures']))
(docs/'pruebas/suite-comparada.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Matrices:',len(rows),'species;',len(data['localities']),'associations;',len(collectionrows),'planning links')
