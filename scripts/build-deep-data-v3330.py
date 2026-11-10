import csv,json,re,unicodedata
from pathlib import Path
rows=[p for p in csv.DictReader(open('docs/gm01/presences.csv')) if p['row_kind']=='source' and p['source_Continente / medio']=='Mar profundo']
source={s['source_scientific']:s for s in csv.DictReader(open('docs/gm01/species.csv')) if s['row_kind']=='source'}
base=json.load(open('docs/gm04b/base-species-v3320.json'));current={s['latin']:id for id,s in base.items()};tax=json.load(open('docs/gm04b/gbif-nomenclature.json'))
corrections={'Onykia ingens':'Moroteuthopsis ingens','Grimpoteuthis umbellata':'Grimpoteuthis abyssicola'}
slug=lambda s:re.sub(r'[^a-z0-9]+','_',unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower()).strip('_')
profiles={'Anoplogaster brachycera':'short_fangtooth','Anoplogaster cornuta':'fangtooth','Argyropelecus aculeatus':'hatchetfish','Bathypterois grallator':'tripodfish','Benthosema glaciale':'lanternfish','Ceratias holboelli':'deep_angler','Chauliodus macouni':'viperfish','Chlamydoselachus anguineus':'frilled_shark','Dissostichus mawsoni':'antarctic_toothfish','Eurypharynx pelecanoides':'gulper_eel','Grimpoteuthis abyssicola':'dumbo_octopus','Haliphron atlanticus':'sevenarm_octopus','Histioteuthis reversa':'jewel_squid','Idiacanthus antrostomus':'blackdragon','Macropinna microstoma':'barreleye','Mesonychoteuthis hamiltoni':'colossal_squid','Mitsukurina owstoni':'goblin_shark','Moroteuthopsis ingens':'hooked_squid','Stomias boa':'scaly_dragonfish','Vampyroteuthis infernalis':'vampire_squid'}
lights={'Argyropelecus aculeatus':'Fotóforos ventrales, contrailuminación','Benthosema glaciale':'Fotóforos corporales y ventrales','Ceratias holboelli':'Esca luminosa de hembra adulta','Chauliodus macouni':'Fotóforos ventrales y radio dorsal anterior prolongado','Histioteuthis reversa':'Fotóforos compuestos ventrales y perioculares','Idiacanthus antrostomus':'Barbilla y fotóforos de hembra adulta','Mesonychoteuthis hamiltoni':'Fotóforos oculares, sin iluminación de todo el manto','Stomias boa':'Barbilla y fotóforos ventrales','Vampyroteuthis infernalis':'Órganos luminosos en extremos de brazos; no tinta'}
ids={n:current.get(n,'deep_esp_'+slug(n)) for n in {corrections.get(p['source_Nombre científico'],p['source_Nombre científico']) for p in rows}}
new={}
for p in rows:
 original=p['source_Nombre científico'];n=corrections.get(original,original);id=ids[n]
 if id in base or id in new:continue
 s=source[original];cls='Cephalopoda' if s['source_subgroup']=='Cefalópodos' else 'Chondrichthyes' if s['source_subgroup']=='Escualos y rayas' else 'Actinopterygii';family=tax[n]['family']
 if n=='Grimpoteuthis abyssicola':family='Grimpoteuthidae'
 new[id]={'name':s['source_common'],'latin':n,'sourceScientific':original,'sourceSpeciesIds':[s['source_species_id']],'origin':'deep3330','artProfile':profiles[n],'kind':profiles[n],'color':'#697784','family':family,'taxonomy':{'className':cls,'subClass':s['source_subgroup']},'gameGroup':'Pez','rare':s['source_rarity'].replace('Muy raro','Muy rara'),'habitats':[],'times':['amanecer','dia','atardecer','noche'],'seasons':['primavera','verano','otono','invierno'],'special':[],'dimorphism':False,'bioluminescence':lights.get(n,''),'plateNote':'Hembra adulta de referencia, sin configurar dimorfismo jugable' if n in ['Ceratias holboelli','Idiacanthus antrostomus'] else 'Referencia anatómica de muestra; no observación directa desde cubierta','ecologyNote':'Registro indirecto por red, muestra conservada o examen de evidencia de expedición. No implica ver un animal vivo desde cubierta.'}
regions=[];presences=[];defs={r['source_region']:r for r in csv.DictReader(open('docs/gm01/regions.csv')) if r['source_medium']=='Mar profundo' and r['source_presence_count']!='0'}
for i,name in enumerate(dict.fromkeys(p['source_Región'] for p in rows)):
 ps=[p for p in rows if p['source_Región']==name];r=defs[name];rid=r['proposed_id_NOT_IMPLEMENTED']
 for p in ps:
  original=p['source_Nombre científico'];n=corrections.get(original,original);id=ids[n];cold=name=='Océano Austral profundo';benthic=n in ['Bathypterois grallator','Grimpoteuthis abyssicola','Dissostichus mawsoni'];large=n in ['Architeuthis dux','Somniosus microcephalus','Chlamydoselachus anguineus','Mitsukurina owstoni','Mesonychoteuthis hamiltoni']
  h='fondo_profundo_frio' if cold and benthic else 'fondo_batial' if benthic else 'columna_profunda_fria' if cold else 'columna_mesopelagica' if name in ['Atlántico profundo norte','Pacífico profundo oriental'] and n in ['Benthosema glaciale','Argyropelecus aculeatus','Gonatus fabricii','Isistius brasiliensis','Macropinna microstoma','Idiacanthus antrostomus','Chauliodus macouni'] else 'columna_batial'
  methods=['muestreo'] if benthic or large else ['sondeo','muestreo']
  note='Red vertical: evidencia de columna de agua; muestra clasificada a bordo.' if not benthic and not large else 'Muestreo de fondo con draga o evidencia de captura científica; examen indirecto a bordo.' if benthic else 'Muestra diagnóstica o evidencia de captura de expedición; no observación directa en profundidad.'
  if n=='Grimpoteuthis abyssicola':note+=' Corrección editorial al mar de Tasmania (2821–3180 m); el original umbellata permanece trazado.'
  if n=='Macropinna microstoma':note+=' Escudo cefálico transparente, ojos tubulares; no es bioluminiscencia.'
  if n=='Vampyroteuthis infernalis':note+=' Columna pobre en oxígeno; evidencia alimentaria de nieve marina, no depredación supuesta.'
  if n=='Isistius brasiliensis':note+=' El registro profundo no modifica su migración nocturna superficial existente.'
  p_out={'regionId':rid,'speciesId':id,'sourceSheet':p['source_sheet'],'sourceRow':int(p['source_row']),'sourceHexId':p['source_ID hex'],'sourceSpeciesId':p['source_ID especie'],'sourceScientific':original,'effectiveScientific':n,'sourceCommon':p['source_Nombre común'],'sourceRarity':p['source_Rareza (juego)'],'sourceBiome':p['source_Bioma'],'habitats':[h],'times':['amanecer','dia','atardecer','noche'],'seasons':['primavera','verano','otono','invierno'],'methods':methods,'evidenceNote':note}
  presences.append(p_out)
  if id in new:new[id]['habitats']=list(dict.fromkeys(new[id]['habitats']+[h]))
 pp=[p for p in presences if p['regionId']==rid];regions.append({'id':rid,'name':name,'code':r['source_hex_id'],'sourceHexId':r['source_hex_id'],'continent':'Océanos','depthTier':'profundo','unlock':{'prestige':429+i*9},'habitats':list(dict.fromkeys(h for p in pp for h in p['habitats'])),'species':[p['speciesId'] for p in pp]})
d={'version':'3.33.0','sourceNames':24,'newSpecies':len(new),'reusedSpecies':4,'species':new,'regions':regions,'presences':presences,'ids':ids,'corrections':corrections}
assert len(new)==20 and len(presences)==44 and len(regions)==5
Path('www/js/deep-data-v3330.js').write_text('(function(root){const data='+json.dumps(d,ensure_ascii=False,indent=2)+';root.AtlasDeep3330=data;if(typeof module!=="undefined")module.exports=data;})(globalThis);\n')
Path('docs/gm04b/catalog.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print('943 identities / 111 regions / 1741 presences; 20 new, four reused')
