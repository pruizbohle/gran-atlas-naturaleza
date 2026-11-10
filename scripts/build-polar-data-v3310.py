import csv,json,re,unicodedata
from pathlib import Path
rows=[p for p in csv.DictReader(open('docs/gm01/presences.csv')) if p['row_kind']=='source' and p['source_Continente / medio']=='Hielo']
source={s['source_scientific']:s for s in csv.DictReader(open('docs/gm01/species.csv')) if s['row_kind']=='source'}
profiles={'Ursus maritimus':('polar_bear','Ursidae'),'Odobenus rosmarus':('walrus','Odobenidae'),'Balaena mysticetus':('bowhead','Balaenidae'),'Delphinapterus leucas':('beluga','Monodontidae'),'Monodon monoceros':('narwhal','Monodontidae'),'Gonatus fabricii':('squid','Gonatidae'),'Somniosus microcephalus':('shark','Somniosidae'),'Aptenodytes forsteri':('emperor','Spheniscidae'),'Pygoscelis adeliae':('adelie','Spheniscidae'),'Pagodroma nivea':('petrel','Procellariidae'),'Pagophila eburnea':('gull','Laridae'),'Somateria mollissima':('eider','Anatidae'),'Stercorarius maccormicki':('skua','Stercorariidae'),'Sterna paradisaea':('tern','Laridae')}
for n in ['Erignathus barbatus','Hydrurga leptonyx','Leptonychotes weddellii','Lobodon carcinophaga','Mirounga leonina','Ommatophoca rossii','Pusa hispida']:profiles[n]=('elephant_seal' if n.startswith('Mirounga') else 'leopard_seal' if n.startswith('Hydrurga') else 'bearded_seal' if n.startswith('Erignathus') else 'ringed_seal' if n.startswith('Pusa') else 'weddell_seal' if n.startswith('Leptonychotes') else 'crabeater_seal' if n.startswith('Lobodon') else 'ross_seal','Phocidae')
slug=lambda s:re.sub(r'[^a-z0-9]+','_',unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower()).strip('_')
ids={n:'zorro_artico' if n=='Vulpes lagopus' else 'polar_esp_'+slug(n) for n in {r['source_Nombre científico'] for r in rows}}
species={};conditions={}
for n,id in sorted(ids.items()):
 if n=='Vulpes lagopus':conditions[id]=['banquisa_artica'];continue
 s=source[n];profile,family=profiles[n];aquatic=profile in ['bowhead','beluga','narwhal','squid','shark']
 hab=['agua_polar'] if aquatic else ['banquisa_artica','agua_polar'] if family in ['Phocidae','Odobenidae'] else ['banquisa_artica'] if profile=='polar_bear' else ['banquisa_antartica','costa_antartica'] if profile=='emperor' else ['costa_antartica','agua_polar'] if profile=='adelie' else ['hielo_interior','costa_antartica','banquisa_antartica'] if profile=='petrel' else ['banquisa_artica','agua_polar'] if profile in ['eider','gull','tern'] else ['costa_antartica','agua_polar']
 if family=='Phocidae' and n not in ['Pusa hispida','Erignathus barbatus']:hab=['banquisa_antartica','agua_polar']
 conditions[id]=hab
 cls='Cephalopoda' if profile=='squid' else 'Chondrichthyes' if profile=='shark' else 'Aves' if s['source_group']=='Aves' else 'Mammalia'
 species[id]={'name':s['source_common'],'latin':n,'rare':s['source_rarity'],'kind':profile,'artProfile':profile,'family':family,'color':'#c4ced0','habitats':hab,'times':['amanecer','dia','atardecer','noche'],'seasons':['primavera','verano','otono','invierno'],'special':[],'dimorphism':False,'origin':'polar3310','taxonomy':{'className':cls,'subClass':s['source_subgroup']},'sourceScientific':n,'sourceSpeciesIds':[s['source_species_id']],'taxonomicStatus':'source-concept-retained','ecologyNote':'Encuentros en subáreas compatibles del sector; no representa presencia en toda su superficie. Sin variantes ni dimorfismo configurados.'}
regions=[];presences=[]
for i,name in enumerate(dict.fromkeys(p['source_Región'] for p in rows)):
 ps=[p for p in rows if p['source_Región']==name];rid='polar_'+slug(name);habs=list(dict.fromkeys(h for p in ps for h in conditions[ids[p['source_Nombre científico']]]));regions.append({'id':rid,'name':name,'code':ps[0]['source_ID hex'],'sourceHexId':ps[0]['source_ID hex'],'continent':'Polos','pole':'Ártico' if name.startswith('Hielo ártico') else 'Antártida','unlock':{'prestige':282+i*7},'habitats':habs,'species':[ids[p['source_Nombre científico']] for p in ps]})
 for p in ps:presences.append({'regionId':rid,'speciesId':ids[p['source_Nombre científico']],'sheet':p['source_sheet'],'row':int(p['source_row']),'sourceSpeciesId':p['source_ID especie'],'sourceScientific':p['source_Nombre científico'],'sourceHexId':p['source_ID hex'],'sourceBiome':p['source_Bioma'],'habitats':conditions[ids[p['source_Nombre científico']]]})
d={'version':'3.31.0','species':species,'regions':regions,'presences':presences,'ids':ids}
Path('www/js/polar-data-v3310.js').write_text('(function(root){const data='+json.dumps(d,ensure_ascii=False,indent=2)+';root.AtlasPolar3310=data;if(typeof module!=="undefined")module.exports=data;})(globalThis);\n')
Path('docs/gm03/catalog.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
