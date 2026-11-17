"""Rebuild the review candidate from explicit records; never rewrites legacy data."""
import csv, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
def read(p): return json.loads((ROOT/p).read_text())
def write(p, data): (ROOT/p).write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
baseline = read('docs/gm06/base-cartografia.json')
rows = list(csv.DictReader((ROOT/'docs/gm06/especies-propuestas.tsv').open(), delimiter='\t'))
definitions = [
 ('hudson','Bahía de Hudson','Norteamérica',137,'tundra,bosque,humedal,costa,banquisa_artica,agua_polar','Costas y cuencas subárticas; hielo estacional, aguas costeras y tierra separados por hábitat.'),
 ('labrador','Labrador subártico','Norteamérica',149,'tundra,bosque,rio,humedal,costa','Península continental; no se extiende la fauna boreal a toda la tundra ni se introduce el alce de Terranova.'),
 ('atlantico','Atlántico canadiense','Norteamérica',153,'rio,humedal,costa,costa_marina,agua_polar,archipielago,oceano_abierto','Terranova, golfo de San Lorenzo y litorales próximos; conserva identidad marina frente a Labrador.'),
 ('antillas','Antillas y Caribe insular','Norteamérica',177,'selva,bosque,rio,humedal,costa','Antillas Mayores y cayos: la presencia se especifica por isla, no en todo el hexágono.'),
 ('darien','Darién y Chocó','Sudamérica',182,'selva,bosque,rio,humedal,costa','Puente panameño-colombiano y bosques del Chocó; fauna asignada a subáreas.'),
 ('galapagos','Islas Galápagos','Sudamérica',197,'costa,desierto,pradera,bosque','Archipiélago volcánico independiente; especies terrestres y litorales, no un mar abierto.'),
 ('humboldt','Litoral del Pacífico suroriental','Sudamérica',197,'costa,costa_marina','Litoral de Perú y Chile asociado a Humboldt, al oeste de los Andes y al norte de Atacama.'),
 ('bosques','Bosques templados del sur','Sudamérica',227,'bosque,rio,humedal,costa','Selva valdiviana, Chiloé y bosques andinos húmedos; no toda la estepa patagónica.'),
 ('rojo','Arco del mar Rojo','África',83,'montana,desierto,costa,costa_marina,arrecife','Macizos áridos y costas entre el Nilo, Etiopía y Arabia; arrecifes en hábitat propio.'),
 ('sonda','Islas de la Sonda occidentales','Asia',48,'selva,bosque,rio,humedal,costa','Sumatra, Java y Borneo; localidades explícitas y distribución histórica distinguida de la actual.'),
 ('wallacea','Célebes y Molucas','Asia',48,'selva,bosque,humedal,costa','Célebes y archipiélagos moluqueños; no se mezclan endemismos de Borneo.'),
 ('melanesia','Melanesia oriental','Oceanía',269,'bosque,selva,costa','Nueva Caledonia y archipiélagos próximos; animales restringidos a sus islas documentadas.')]
regions=[dict(id='gm06_'+key,code='GM06-'+key.upper(),name=name,continent=cont,unlock={'prestige':p},habitats=hab.split(','),species=[],description=desc,origin='gm06') for key,name,cont,p,hab,desc in definitions]
bykey={d[0]:r for d,r in zip(definitions,regions)}
patagonia='sa_patagonia_y_tierra_del_fuego'
species={}; assignments={patagonia:[]}; notes={}
nocturnal={'Solenodon paradoxus','Dromiciops gliroides','Pteropus vampyrus'}
for row in rows:
 latin=row['latin']; sid='gm06_'+latin.lower().replace(' ','_')
 sp=dict(name=row['nombre'],latin=latin,rare='Raro',kind='fish' if row['clase']=='Actinopterygii' else 'gm06',color=row['color'],habitats=row['habitats'].split(','),times=['atardecer','noche'] if latin in nocturnal else ['amanecer','dia','atardecer'],seasons=['primavera','verano','otono','invierno'],special=['Notable'],dimorphism=False,origin='gm06',taxonomy={'className':row['clase'],'subClass':row['familia'],'family':row['familia']},gm06={'morph':row['morfologia'],'locality':row['localidad'],'sexRepresentation':'adulto representativo; sin variante sexual habilitada'})
 species[sid]=sp
 for zone in row['zonas'].split(','):
  rid=patagonia if zone=='patagonia' else bykey[zone]['id']
  assignments.setdefault(rid,[]).append(sid)
  notes[rid+'|'+sid]=row['localidad']
reuse={
 'hudson':[('polar_esp_ursus_maritimus','Costas y banquisa estacional'),('polar_esp_delphinapterus_leucas','Aguas costeras y estuarios'),('polar_esp_pusa_hispida','Banquisa y aguas subárticas'),('reno','Tundra y bosque; caribú'),('zorro_artico','Tundra costera')],
 'labrador':[('na_esp_lynx_canadensis','Bosques de la península'),('gloton','Bosques y tundra continentales'),('na_esp_martes_americana','Bosque boreal'),('na_esp_perisoreus_canadensis','Bosque boreal')],
 'atlantico':[('frailecillo_atlantico','Colonias e islas costeras'),('mar_esp_halichoerus_grypus','Golfo de San Lorenzo y costas atlánticas'),('mar_esp_gadus_morhua','Aguas atlánticas de la plataforma; hábitat oceánico del catálogo vigente'),('mar_esp_morus_bassanus','Colonias insulares y aguas atlánticas')],
 'antillas':[('na_esp_trichechus_manatus','Costas, estuarios y humedales antillanos'),('sa_esp_phoenicopterus_ruber','Lagunas salinas de Cuba y otras islas, no selva')],
 'bosques':[('sa_esp_pudu_puda','Bosques templados'),('sa_esp_rhinoderma_darwinii','Sotobosque húmedo'),('sa_esp_lycalopex_fulvipes','Chiloé y poblaciones continentales'),('sa_esp_campephilus_magellanicus','Bosques australes'),('sa_esp_enicognathus_ferrugineus','Bosques australes')],
 'humboldt':[('sa_esp_lontra_felina','Litoral rocoso'),('mar_esp_otaria_flavescens','Litorales de Perú y Chile')],
 'rojo':[('af_dugongo','Praderas marinas costeras'),('af_gacela_dorcas','Desiertos costeros'),('mar_esp_chelonia_mydas','Arrecifes y costas marinas')],
 'sonda':[('asia_esp_0436','Borneo: Pongo pygmaeus'),('asia_esp_0352','Borneo: Nasalis larvatus'),('asia_esp_0067','Sumatra, Borneo y Java; distribución discontinua'),('asia_esp_0165','Sumatra y Borneo; ámbito histórico más extenso')]
}
for key,items in reuse.items():
 for sid,note in items:
  rid=bykey[key]['id'];assignments.setdefault(rid,[]).append(sid);notes[rid+'|'+sid]=note
# Reuse verified widespread forest fauna from the adjoining mainland, without inventing species.
for sid in ['na_esp_panthera_onca','na_esp_tapirus_bairdii']:
 assignments.setdefault(bykey['darien']['id'],[]).append(sid);notes[bykey['darien']['id']+'|'+sid]='Darién; no extrapolación a todo el Chocó'
for r in regions:r['species']=assignments.pop(r['id'],[])
renames={
 'sa_caribe_sudamericano':'Litoral caribeño sudamericano','HX-08-10':'Bosques atlánticos ecuatoriales','HX-08-08':'Bosques guineanos occidentales',
 'HX-10-12':'Litoral sudoriental africano','HX-11-10':'Sabanas del sudeste africano','HX-07-14':'Archipiélagos del Índico occidental',
 'oc_desierto_australiano':'Interior árido australiano','oc_norte_tropical_australiano':'Australia tropical septentrional'}
# Bangweulu and Okavango retain their precise basin names: broadening scope is not justified by the current roster.
transfers={'HX-06-17':{'gm06_sonda':['asia_esp_0436','asia_esp_0352']},patagonia:{'gm06_bosques':['sa_esp_pudu_puda','sa_esp_rhinoderma_darwinii','sa_esp_lycalopex_fulvipes']}}
scopes={'HX-07-14':{'af_tortuga_aldabra':'Atolón de Aldabra; no todas las islas Seychelles','af_loro_negro_seychelles':'Praslin, Seychelles; no Aldabra','af_cernicalo_seychelles':'Islas graníticas de Seychelles; no atribuido a Aldabra'}}
data=dict(version='GM-06E revisión · destino 3.44.0',base='41a4bbd',species=species,regions=regions,additions=assignments,renames=renames,transfers=transfers,localities=notes,scopes=scopes,reserved=['Pacífico ecuatorial: referencia 9; sin región nueva'],special={'id':'rapa_nui','name':'Rapa Nui','title':'La isla solitaria del Pacífico','status':'Expediente de revisión; sin desbloqueo, recompensas ni especies jugables','records':['Chaetodon litus','Chrysiptera rapanui — identidad confirmada en ITIS 615094 y ficha MMA; archivo no jugable','Phaethon rubricauda','Onychoprion fuscatus','Sophora toromiro — botánica'],'history':'Sociedad rapanui en 1842. Sin bandera chilena, sin moáis originales ni patrimonio como botín.'})
write('docs/gm06/catalogo-candidato.json',data)
js='/* GM-06 candidate. Opt-in module; no persistence or economy changes. */\n(function(root){\n\"use strict\";\nconst data='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
js+='''function apply(species,regions){
 for(let i=0;i<regions.length;i++)regions[i]=JSON.parse(JSON.stringify(regions[i]));
 for(const [id,sp] of Object.entries(data.species)){
  if(species[id]||Object.values(species).some(old=>old.latin===sp.latin))throw Error('GM06 identidad duplicada: '+id);
  species[id]=sp;
 }
 for(const r of data.regions){if(regions.some(old=>old.id===r.id))throw Error('GM06 región duplicada');regions.push(JSON.parse(JSON.stringify(r)));}
 for(const [id,name]of Object.entries(data.renames)){const r=regions.find(r=>r.id===id);if(!r)throw Error('GM06 región histórica ausente '+id);r.name=name;}
 for(const [id,ids]of Object.entries(data.additions)){const r=regions.find(r=>r.id===id);r.species=[...new Set([...r.species,...ids])];}
 for(const [from,dests]of Object.entries(data.transfers))for(const [to,ids]of Object.entries(dests)){
  const a=regions.find(r=>r.id===from),b=regions.find(r=>r.id===to);
  a.species=a.species.filter(id=>!ids.includes(id));b.species=[...new Set([...b.species,...ids])];
 }
 for(const r of regions)for(const id of r.species){if(!species[id])throw Error('GM06 especie ausente '+id);}
 return data;
}
root.AtlasGM06=Object.freeze({...data,apply});
})(typeof globalThis!=='undefined'?globalThis:this);
'''
(ROOT/'www/js/gm06/catalog.js').write_text(js)
print(len(species),'new species;',len(regions),'new regions')
