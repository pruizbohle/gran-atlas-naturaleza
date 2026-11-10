import csv,json
from pathlib import Path
rows=[p for p in csv.DictReader(open('docs/gm01/presences.csv')) if p['row_kind']=='source' and p['source_Continente / medio']=='Mar abisal']
base=json.load(open('docs/gm04c/base-species-v3330.json'));current={s['latin']:id for id,s in base.items()}
assert len(rows)==3 and {int(p['source_row']) for p in rows}=={1322,1323,1485}
corrections={'Notoliparis kermadecensis':'Pseudoliparis kermadecensis'}
ids={'Bathypterois grallator':current['Bathypterois grallator'],'Pseudoliparis swirei':'abisal_esp_pseudoliparis_swirei','Pseudoliparis kermadecensis':'abisal_esp_pseudoliparis_kermadecensis'}
defs={r['source_region']:r for r in csv.DictReader(open('docs/gm01/regions.csv')) if r['source_medium']=='Mar abisal' and r['source_presence_count']!='0'}
info={
 'Bathypterois grallator':('llanura_abisal_periferica',[4000,4720],['muestreo','extraordinario'],'Pacífico centro-occidental; planicie abisal de aproximación, no interior hadal ni localidad certificada de Marianas.','Intervalo lúdico conservador dentro del rango documentado 878–4720 m.','Muestra de fondo periférico y diagnóstico del pez trípode; no vive aquí a más de 6000 m.'),
 'Pseudoliparis swirei':('hadal_marianas',[6898,7966],['extraordinario'],'Marianas: subárea restringida a las capturas de la descripción de 2017.','Ventana de capturas verificadas de Gerringer et al. 2017; no se extrapola a otras fosas ni a imágenes sin ejemplar.','Examen de muestra diagnóstica y reconstrucción científica del sector de Marianas; no observación directa desde cubierta.'),
 'Pseudoliparis kermadecensis':('hadal_kermadec',[6660,6770],['extraordinario'],'Kermadec: subárea restringida al entorno de la localidad tipo.','Ventana conservadora de la localidad tipo según Eschmeyer; no pretende abarcar todos los registros posteriores.','Examen de muestra diagnóstica del sector Kermadec; nombre fuente Notoliparis conservado, combinación actual Pseudoliparis.')}
new={};presences=[];regions=[]
for p in rows:
 original=p['source_Nombre científico'];n=corrections.get(original,original);sid=ids[n];h,depth,methods,scope,basis,note=info[n];rid=defs[p['source_Región']]['proposed_id_NOT_IMPLEMENTED']
 if sid not in base:
  assert n not in current
  new[sid]={'name':'Pez caracol de las Marianas' if n.endswith('swirei') else 'Pez caracol de Kermadec','latin':n,'sourceScientific':original,'sourceCommon':p['source_Nombre común'],'sourceSpeciesIds':[p['source_ID especie']],'origin':'abyssal3340','kind':'mariana_snailfish' if n.endswith('swirei') else 'kermadec_snailfish','artProfile':'mariana_snailfish' if n.endswith('swirei') else 'kermadec_snailfish','color':'#c5b2b1','family':'Liparidae','taxonomy':{'className':'Actinopterygii','subClass':'Peces óseos'},'gameGroup':'Pez','rare':p['source_Rareza (juego)'].replace('Muy raro','Muy rara'),'habitats':[h],'times':['amanecer','dia','atardecer','noche'],'seasons':['primavera','verano','otono','invierno'],'special':[],'dimorphism':False,'bioluminescence':'','plateNote':'Reconstrucción de muestra; piel pálida gelatinosa, ojos pequeños, aletas continuas y disco pélvico. Sin luz biológica.','ecologyNote':scope+' '+basis}
 presences.append({'regionId':rid,'speciesId':sid,'sourceSheet':p['source_sheet'],'sourceRow':int(p['source_row']),'sourceHexId':p['source_ID hex'],'sourceSpeciesId':p['source_ID especie'],'sourceScientific':original,'effectiveScientific':n,'sourceCommon':p['source_Nombre común'],'sourceRarity':p['source_Rareza (juego)'],'sourceBiome':p['source_Bioma'],'habitats':[h],'times':['amanecer','dia','atardecer','noche'],'seasons':['primavera','verano','otono','invierno'],'methods':methods,'depthMeters':depth,'depthBasis':basis,'geographicScope':scope,'evidenceNote':note})
for i,(name,r) in enumerate(defs.items()):
 rid=r['proposed_id_NOT_IMPLEMENTED'];ps=[p for p in presences if p['regionId']==rid]
 regions.append({'id':rid,'name':name,'code':r['source_hex_id'],'sourceHexId':r['source_hex_id'],'continent':'Océanos','depthTier':'abisal','unlock':{'prestige':475+i*10},'habitats':list(dict.fromkeys(h for p in ps for h in p['habitats'])),'species':[p['speciesId'] for p in ps]})
ids['Notoliparis kermadecensis']=ids['Pseudoliparis kermadecensis']
d={'version':'3.34.0','sourceNames':3,'newSpecies':2,'reusedSpecies':1,'species':new,'regions':regions,'presences':presences,'ids':ids,'corrections':corrections}
assert len(new)==2 and len(regions)==2 and all(r['id'].startswith('abisal_') for r in regions)
Path('www/js/abyssal-data-v3340.js').write_text('(function(root){const data='+json.dumps(d,ensure_ascii=False,indent=2)+';root.AtlasAbyssal3340=data;if(typeof module!=="undefined")module.exports=data;})(globalThis);\n')
Path('docs/gm04c/catalog.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print('945 species /113 regions /1744 presences;2 new and1 reused;3 source rows')
