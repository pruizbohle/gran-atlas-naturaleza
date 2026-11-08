#!/usr/bin/env python3
"""Build the North American data module from the confirmed AM-01 source rows. No game state."""
import csv,json,re,hashlib
from pathlib import Path
root=Path(__file__).resolve().parent.parent
pres=[r for r in csv.DictReader((root/'docs/americas-audit/source-presences.csv').open())if r['Continente / medio']=='América del Norte']
audit={r['scientific_name']:r for r in csv.DictReader((root/'docs/americas-species-audit.csv').open())}
regions=list(csv.DictReader((root/'docs/americas-regions-audit.csv').open()));dec=json.loads((root/'docs/americas-audit/manual-decisions.json').read_text())
# Habitats/times/paint are explicit game design, not columns invented in the source workbook.
# Broad source concepts are retained for Dasypus novemcinctus / Spilogale gracilis pending a finer regional authority.
canonical=lambda l:'Dicotyles tajacu' if l=='Pecari tajacu' else l
names=sorted(set(canonical(r['Nombre científico'])for r in pres))
ids={n:audit[n]['existing_id']or 'na_esp_'+n.lower().replace(' ','_')for n in names}
nocturnal=set('Alligator Ambystoma Ateles Aotus Brachylagus Canis Chrysemys Crotalus Cuniculus Dasypus Dicamptodon Dicotyles Didelphis Dipodomys Heloderma Herpailurus Incilius Lampropeltis Leopardus Lepus Lynx Martes Mephitis Micrathene Mustela Nasua Panthera Procyon Sorex Spilogale Strix Sylvilagus Taxidea Terrapene'.split())
kind={'Mammalia':'small','Aves':'forestbird','Reptilia':'lizard','Amphibia':'amphibian','Actinopterygii':'fish'}
family_kind={'Felidae':'cat','Canidae':'canid','Cervidae':'deer','Bovidae':'bison','Antilocapridae':'deer','Mustelidae':'mustelid','Leporidae':'hare','Atelidae':'primate','Cebidae':'primate','Tapiridae':'deer','Trichechidae':'sirenian','Anatidae':'swan','Accipitridae':'raptor','Falconidae':'raptor','Strigidae':'owl','Ardeidae':'heron','Pelecanidae':'pelican','Threskiornithidae':'wader','Ambystomatidae':'salamander','Alligatoridae':'crocodile','Boidae':'snake','Viperidae':'snake','Colubridae':'snake','Emydidae':'tortoise','Testudinidae':'tortoise'}
habitats={
'Mammalia':['bosque'],'Aves':['bosque'],'Reptilia':['bosque'],'Amphibia':['rio','humedal'],'Actinopterygii':['rio']}
family_hab={
'Atelidae':['selva','bosque'],'Cebidae':['selva','bosque'],'Bradypodidae':['selva','bosque'],'Myrmecophagidae':['selva','bosque'],'Tayassuidae':['bosque','selva','desierto'],'Cuniculidae':['selva','bosque','rio'],'Procyonidae':['bosque','selva','humedal'],'Trichechidae':['costa','rio','humedal'],'Heteromyidae':['desierto','estepa'],'Antilocapridae':['pradera','estepa'],'Bovidae':['montana','pradera'],'Cervidae':['bosque','pradera','montana'],'Leporidae':['bosque','pradera','estepa'],'Mustelidae':['bosque','pradera'],'Anatidae':['rio','humedal'],'Ardeidae':['humedal','costa','rio'],'Pelecanidae':['costa','rio','humedal'],'Threskiornithidae':['humedal','costa'],'Trochilidae':['bosque','pradera'],'Ramphastidae':['selva','bosque'],'Trogonidae':['selva','bosque','montana'],'Psittacidae':['selva','bosque','montana'],'Alligatoridae':['rio','humedal'],'Boidae':['selva','bosque'],'Viperidae':['desierto','estepa','bosque','pradera'],'Colubridae':['bosque','selva'],'Testudinidae':['desierto','estepa'],'Emydidae':['rio','humedal','bosque'],'Iguanidae':['selva','bosque'],'Corytophanidae':['selva','rio'],'Phrynosomatidae':['desierto','pradera'],'Helodermatidae':['desierto','estepa']}
overrides={
'Mephitis mephitis':['bosque','pradera','humedal'],'Phrynosoma cornutum':['desierto','pradera','estepa'],'Lepus americanus':['bosque','tundra'],'Lepus californicus':['pradera','estepa'],'Sylvilagus audubonii':['desierto','estepa','montana'],'Brachylagus idahoensis':['montana','estepa'],'Ochotona princeps':['montana'],'Oreamnos americanus':['montana'],'Ovis canadensis':['montana'],'Bison bison':['pradera'],'Cynomys ludovicianus':['pradera'],'Marmota flaviventris':['montana','pradera'],'Cervus canadensis':['bosque','montana'],'Lynx canadensis':['bosque','tundra'],'Mustela nigripes':['pradera'],'Taxidea taxus':['pradera','montana','bosque'],'Gopherus agassizii':['desierto'],'Ambystoma mexicanum':['rio','humedal'],'Ambystoma tigrinum':['rio','humedal','bosque'],'Ambystoma maculatum':['bosque','humedal'],'Dicamptodon tenebrosus':['bosque','rio'],'Agalychnis callidryas':['selva','humedal'],'Hyalinobatrachium fleischmanni':['selva','rio'],'Incilius alvarius':['desierto','rio'],'Lithobates sylvaticus':['bosque','tundra','humedal'],'Lithobates clamitans':['rio','humedal'],'Terrapene carolina':['bosque'],'Crotalus horridus':['bosque'],'Crotalus atrox':['desierto'],'Crotalus viridis':['pradera','estepa'],'Canis latrans':['pradera','desierto','estepa'],'Vulpes macrotis':['desierto'],'Geococcyx californianus':['desierto'],'Micrathene whitneyi':['desierto'],'Athene cunicularia':['pradera'],'Circus hudsonius':['pradera','humedal'],'Caracara plancus':['selva','pradera'],'Pharomachrus mocinno':['selva','bosque','montana'],'Spilogale gracilis':['bosque','desierto'],'Pica hudsonia':['pradera','montana'],'Tympanuchus cupido':['pradera']}
colors={'Felidae':'#b99b69','Canidae':'#a5997d','Cervidae':'#ae9071','Bovidae':'#8e7760','Atelidae':'#5e594e','Cebidae':'#b9a781','Procyonidae':'#8f9382','Mephitidae':'#3e4b48','Didelphidae':'#a2a79c','Dasypodidae':'#9a9587','Tayassuidae':'#777b6a','Caviidae':'#9d8869','Trichechidae':'#8eaaa6','Anatidae':'#a99c82','Trochilidae':'#759b83','Psittacidae':'#8baf79','Ramphastidae':'#56685c','Alligatoridae':'#708372','Boidae':'#afa17c','Viperidae':'#b8a17b','Amphibia':'#87986b','Actinopterygii':'#879c8e'}
sex={'Aix sponsa':'plumaje de pato joyuyo','Anas platyrhynchos':'plumaje de ánade real','Cardinalis cardinalis':'macho rojo y hembra parda','Archilochus colubris':'gorguera rubí masculina','Calypte anna':'cabeza/gorguera iridiscente masculina','Cervus canadensis':'astas del macho','Odocoileus virginianus':'astas del macho','Meleagris gallopavo':'barbas y abanico masculinos','Meleagris ocellata':'ornamentos masculinos'}
albino=set('Aix sponsa;Anas platyrhynchos;Alligator mississippiensis;Ambystoma mexicanum;Bison bison;Canis latrans;Cardinalis cardinalis;Cervus canadensis;Chrysemys picta;Crotalus atrox;Dasypus novemcinctus;Didelphis virginiana;Esox lucius;Iguana iguana;Lampropeltis californiae;Lepus americanus;Lynx rufus;Meleagris gallopavo;Mephitis mephitis;Odocoileus virginianus;Ovis canadensis;Panthera onca;Procyon lotor;Salvelinus fontinalis;Sciurus carolinensis;Sylvilagus floridanus;Trichechus manatus'.split(';'))
melanic={'Panthera onca','Sciurus carolinensis','Odocoileus virginianus','Canis latrans'}
epic={'Panthera onca','Bison bison','Alligator mississippiensis','Pharomachrus mocinno'};exceptional={'Panthera onca','Bison bison'}
new={};dim={};categories={}
for n in names:
 if audit[n]['existing_id']:continue
 a=audit[n];family=a['zoological_family_reference'];cl=a['proposed_class_reference'];g=n.split()[0]
 profile_h=overrides.get(n,family_hab.get(family,habitats[cl]))
 special=(['Albino']if n in albino else [])+(['Melánico']if n in melanic else [])+['Notable']
 new[ids[n]]={'name':a['common_names'].split(' | ')[0],'latin':n,'rare':'Muy rara'if a['source_rarity']=='Muy raro'else a['source_rarity'],'kind':family_kind.get(family,kind[cl]),'color':colors.get(family,colors.get(cl,'#9c997c')),'habitats':profile_h,'times':['amanecer','atardecer','noche']if (g in nocturnal and g not in ['Chrysemys','Terrapene'])or family=='Strigidae'or cl=='Amphibia' else ['amanecer','dia','atardecer'],'seasons':['primavera','verano','otono']if n in ['Archilochus colubris','Hylocichla mustelina']else ['primavera','verano','otono','invierno'],'special':special,'dimorphism':n in sex,'family':family,'taxonomy':{'className':cl,'subClass':'Salamandras y tritones' if family=='Ambystomatidae' else 'Búhos y lechuzas' if family=='Strigidae' else a['source_subgroup']},'origin':'na3220','sourceSpeciesIds':a['source_species_ids'].split(' | '),'artProfile':n.lower().replace(' ','-')}
 if n in sex:dim[ids[n]]={'type':'na3220','description':sex[n]}
 categories[ids[n]]=['Notable']+(['Épico']if n in epic else [])+(['Excepcional']if n in exceptional else [])
# All source assignments stay intact; source IDs are never treated as coordinates.
order=['Alaska','Columbia Británica','Yukón','Bosques boreales de Canadá','Montañas Rocosas','Grandes Llanuras','Región de los Grandes Lagos','Bosques del este norteamericano','Costa del Pacífico','Desierto de Sonora','Sierra Madre','Costa del golfo de México','Península de Yucatán','América Central'];prestige={n:125+3*i for i,n in enumerate(order)}
rr=[]
for r in regions:
 if r['continent']!='América del Norte' or r['existing_region_id']:continue
 name=r['region'];hab=dec['regions'][name]['proposed_habitats'][:]
 if name=='Montañas Rocosas':hab=['montana','bosque','pradera','rio']
 if name=='Bosques boreales de Canadá':hab=['bosque','tundra','rio','humedal']
 rr.append({'id':r['source_hex_id'],'name':name,'code':r['source_hex_id'],'continent':'Norteamérica','unlock':{'prestige':prestige[name]},'habitats':hab,'species':[ids[canonical(p['Nombre científico'])]for p in pres if p['ID hex']==r['source_hex_id']]})
# Reachability includes shared species without editing their pre-existing ecological profiles.
old={r['game_id']:r for r in csv.DictReader((root/'docs/americas-audit/game-catalog-snapshot.csv').open())}
for region in rr:
 for sid in region['species']:
  hab=new[sid]['habitats']if sid in new else old[sid]['habitats'].split(' | ')
  assert set(hab)&set(region['habitats']),(region['name'],sid,hab)
source=[{'row':int(p['source_row']),'hex':p['ID hex'],'sourceSpeciesId':p['ID especie'],'scientific':p['Nombre científico'],'id':ids[canonical(p['Nombre científico'])]}for p in pres]
data={'version':'3.22.0','sourceSha256':'5cd22412e6b251d8f02a90e4c8303e02946d5e5d26855589d2c6750649fe4350','sourceNames':129,'canonicalSpecies':128,'aliases':{'Pecari tajacu':'Dicotyles tajacu'},'ids':ids,'species':new,'regions':rr,'dimorphism':dim,'categories':categories,'presences':source}
js='/* Generated from the confirmed Excel via AM-01. Game ecology/paint are explicit AM-02 design. */\n(function(root){\n\'use strict\';\nconst data='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\nroot.AtlasNorthAmerica3220=data;if(typeof module===\'object\'&&module.exports)module.exports=data;\n})(typeof globalThis!==\'undefined\'?globalThis:this);\n'
(root/'www/js/northamerica-data-v3220.js').write_text(js)
(root/'docs/norteamerica-v3220/source-presences.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
print('Generated',len(new),'new taxa;',len(rr),'new regions;',len(source),'source presences;',len(dim),'new dimorphism profiles')
