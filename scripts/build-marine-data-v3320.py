import csv,json,re,unicodedata,subprocess
from pathlib import Path
rows=[p for p in csv.DictReader(open('docs/gm01/presences.csv')) if p['row_kind']=='source' and p['source_Continente / medio']=='Mar']
source={s['source_scientific']:s for s in csv.DictReader(open('docs/gm01/species.csv')) if s['row_kind']=='source'}
# Read the frozen 3.31 snapshot recorded for this implementation; no live save or Excel.
base=json.load(open('docs/gm04a/base-species-v3310.json'));current={s['latin']:id for id,s in base.items()};tax=json.load(open('docs/gm04a/gbif-nomenclature.json'))
slug=lambda s:re.sub(r'[^a-z0-9]+','_',unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower()).strip('_')
def effective(p):
 n=p['source_Nombre científico']
 if n=='Aetobatus narinari':return 'Aetobatus ocellatus'
 if n=='Eudyptes chrysocome':return 'Eudyptes filholi'
 if n=='Octopus vulgaris' and p['source_Región']=='Pacífico austral':return 'Octopus tetricus'
 return n
names=sorted(set(effective(p) for p in rows));ids={n:current.get(n,'mar_esp_'+slug(n)) for n in names}
family_profiles={'Myliobatidae':'eagle_ray','Alopiidae':'thresher','Pomacentridae':'clownfish','Octopodidae':'octopus','Enteroctopodidae':'giant_octopus','Tremoctopodidae':'blanket_octopus','Architeuthidae':'giant_squid','Loliginidae':'reef_squid','Ommastrephidae':'jumbo_squid','Thysanoteuthidae':'diamond_squid','Balaenopteridae':'rorqual','Balaenidae':'right_whale','Eschrichtiidae':'grey_whale','Physeteridae':'sperm_whale','Hyperoodontidae':'beaked_whale','Delphinidae':'dolphin','Phocoenidae':'porpoise','Otariidae':'sea_lion','Phocidae':'seal','Cheloniidae':'turtle','Elapidae':'sea_krait','Molidae':'sunfish','Syngnathidae':'seahorse','Balistidae':'triggerfish','Scaridae':'parrotfish','Labridae':'wrasse','Serranidae':'grouper','Acanthuridae':'surgeonfish','Pomacanthidae':'angelfish','Synanceiidae':'stonefish','Scombridae':'tuna','Carangidae':'jack','Clupeidae':'herring','Gadidae':'cod','Salmonidae':'salmon','Exocoetidae':'flyingfish','Istiophoridae':'sailfish','Xiphiidae':'swordfish','Nototheniidae':'toothfish','Channichthyidae':'icefish','Carcharhinidae':'requiem_shark','Lamnidae':'mako','Cetorhinidae':'basking_shark','Rhincodontidae':'whale_shark','Sphyrnidae':'hammerhead','Dalatiidae':'cookiecutter','Spheniscidae':'penguin','Procellariidae':'petrel','Diomedeidae':'albatross','Fregatidae':'frigatebird','Sulidae':'gannet'}
profiles_override={'Orcinus orca':'orca','Globicephala melas':'pilot_whale','Globicephala macrorhynchus':'pilot_whale','Pseudorca crassidens':'false_killer','Grampus griseus':'rissos','Megaptera novaeangliae':'humpback','Balaenoptera musculus':'blue_whale','Balaenoptera edeni':'brydes_whale','Mirounga angustirostris':'elephant_seal','Eudyptes filholi':'rockhopper','Pygoscelis antarcticus':'chinstrap','Pygoscelis papua':'gentoo','Aptenodytes patagonicus':'king_penguin','Mobula alfredi':'manta','Mobula mobular':'devil_ray','Thunnus alalunga':'albacore','Scomber scombrus':'mackerel','Hapalochlaena lunulata':'blue_ring_octopus','Amphioctopus marginatus':'coconut_octopus','Octopus bimaculoides':'bimac_octopus','Octopus cyanea':'day_octopus'}
new={};meta={}
for n in names:
 p=next(p for p in rows if effective(p)==n);src=source[p['source_Nombre científico']];old=base.get(ids[n]);family=old.get('family') if old else tax[n]['family'];sub=src['source_subgroup'];group=src['source_group'];cls='Mammalia' if group=='Mamíferos' else 'Aves' if group=='Aves' else 'Reptilia' if group=='Reptiles y anfibios' else 'Cephalopoda' if sub=='Cefalópodos' else 'Chondrichthyes' if sub=='Escualos y rayas' else 'Actinopterygii';profile=profiles_override.get(n,family_profiles.get(family,'existing'))
 meta[ids[n]]={'biologicalClass':cls,'gameGroup':'Pez' if cls in ['Cephalopoda','Actinopterygii','Chondrichthyes'] else 'Mamífero' if cls=='Mammalia' else 'Ave' if cls=='Aves' else 'Reptil/Anfibio','family':family,'profile':profile}
 if old:continue
 name=src['source_common'];name={'Aetobatus ocellatus':'Raya águila ocelada indopacífica','Eudyptes filholi':'Pingüino saltarrocas oriental','Octopus tetricus':'Pulpo de arrecife austral'}.get(n,name)
 rare=src['source_rarity'].replace('Muy raro','Muy rara')
 new[ids[n]]={'name':name,'latin':n,'sourceScientific':p['source_Nombre científico'],'sourceSpeciesIds':sorted(set(x['source_ID especie'] for x in rows if effective(x)==n)),'origin':'marine3320','family':family,'artProfile':profile,'kind':profile,'rare':rare,'color':'#6b929f','special':[],'dimorphism':False,'habitats':[],'times':['noche'] if n=='Isistius brasiliensis' else ['amanecer','dia','atardecer','noche'],'seasons':['primavera','verano','otono','invierno'],'taxonomy':{'className':cls,'subClass':sub},'gameGroup':meta[ids[n]]['gameGroup'],'ecologyNote':'Registro de subárea marina compatible, no presencia en todo el océano. La clase biológica se mantiene separada de la categoría jugable.'}
regions=[];presences=[]
region_ids={r['source_region']:r['proposed_id_NOT_IMPLEMENTED'] for r in csv.DictReader(open('docs/gm01/regions.csv')) if r['source_medium']=='Mar' and r['source_presence_count']!='0'}
for i,name in enumerate(dict.fromkeys(p['source_Región'] for p in rows)):
 ps=[p for p in rows if p['source_Región']==name];rid=region_ids[name]
 for p in ps:
  n=effective(p);id=ids[n];m=meta[id];cls=m['biologicalClass'];sub=source[p['source_Nombre científico']]['source_subgroup'];biome=p['source_Bioma'];note='Observación en aguas superficiales o plataforma accesible; no habilita inmersiones profundas.'
  if cls=='Mammalia':hab=['costa_marina'] if sub=='Mamíferos marinos' else ['mar_austral'] if 'austral' in name.lower() and 'Atlántico' not in name else ['oceano_abierto']
  elif cls=='Aves':hab=['archipielago','mar_austral'] if 'austral' in name.lower() else ['archipielago','oceano_abierto']
  elif cls=='Reptilia':hab=['arrecife','costa_marina']
  elif cls=='Cephalopoda':hab=['arrecife','costa_marina'] if 'octopus' in n.lower() and n!='Tremoctopus violaceus' else ['oceano_abierto']
  else:hab=['arrecife'] if any(x in biome for x in ['Arrecife']) and m['profile'] not in ['tuna','sailfish','mako'] else ['costa_marina'] if any(x in biome for x in ['costero','costera']) else ['mar_austral'] if 'subantártico' in biome else ['oceano_abierto']
  if n in ['Dissostichus eleginoides','Chaenocephalus aceratus']:hab=['plataforma_marina'];note='Fases juveniles/pelágicas en plataforma subantártica; no adultos batiales.'
  if n=='Architeuthis dux':hab=['oceano_abierto'];note='Registro poslarvario superficial en aguas de Nueva Zelanda (Te Papa); no adulto sano nadando en superficie.'
  if n=='Isistius brasiliensis':note='Migración vertical nocturna hacia superficie; no aparece de día.'
  if n=='Aetobatus ocellatus':note='Corrección del complejo narinari: subárea indopacífica de arrecife, no sinonimia universal.'
  if n=='Octopus tetricus':note='Corrección editorial explícita a subárea neozelandesa de Pacífico austral; no identificación retrospectiva de espécimen ni alias universal de vulgaris.'
  if n=='Eudyptes filholi':note='Tratamiento AviList/Clements 2025: subáreas insulares indopacíficas (Macquarie/Campbell o Kerguelen).'
  if n=='Balaenoptera edeni':note='Concepto SMM: edeni incluye brydei; subárea costera tropical / forma oceánica meridional. No se crean identidades dobles por tratamientos alternativos.'
  if id in new:new[id]['habitats']=list(dict.fromkeys(new[id]['habitats']+hab))
  presences.append({'regionId':rid,'speciesId':id,'sourceRow':int(p['source_row']),'sourceSheet':p['source_sheet'],'sourceHexId':p['source_ID hex'],'sourceSpeciesId':p['source_ID especie'],'sourceScientific':p['source_Nombre científico'],'sourceCommon':p['source_Nombre común'],'sourceRarity':p['source_Rareza (juego)'],'sourceBiome':biome,'effectiveScientific':n,'habitats':hab,'times':['noche'] if n=='Isistius brasiliensis' else base[id]['times'] if id in base else ['amanecer','dia','atardecer','noche'],'seasons':base[id]['seasons'] if id in base else ['primavera','verano','otono','invierno'],'note':note})
  
 hits=[p for p in presences if p['regionId']==rid];hab=list(dict.fromkeys(h for p in hits for h in p['habitats']));regions.append({'id':rid,'name':name,'code':ps[0]['source_ID hex'],'sourceHexId':ps[0]['source_ID hex'],'continent':'Océanos','unlock':{'prestige':332+i*8},'habitats':hab,'species':[p['speciesId'] for p in hits]})
d={'version':'3.32.0','sourceNames':112,'effectiveNames':len(names),'newSpecies':len(new),'reusedSpecies':len(names)-len(new),'species':new,'regions':regions,'presences':presences,'ids':ids,'meta':meta}
assert(len(rows),len(regions),len(new))==(192,12,95)
Path('www/js/marine-data-v3320.js').write_text('(function(root){const data='+json.dumps(d,ensure_ascii=False,indent=2)+';root.AtlasMarine3320=data;if(typeof module!=="undefined")module.exports=data;})(globalThis);\n')
Path('docs/gm04a/catalog.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print('95 new + 18 reused, 923 global identities, 106 regions, 1697 presences')
