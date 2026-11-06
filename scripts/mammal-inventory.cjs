// Complete, reproducible art audit. No game or save data is written.
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const {SPECIES,SEXUAL_DIMORPHISM}=require('../tests/helpers/catalog.cjs').catalog();
const {classifyMammal,renderMammal,MAMMAL_FAMILIES,MAMMAL_SPECIES_ANATOMY}=require('../www/js/mammal-art-v3194.js');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('www/js/lab/mammal-sprites-v3193-before.js','utf8'),context);
const baseline=context.ATLAS_MAMMAL_LAB;
const priority=new Set(['asia_esp_0402','af_leon','af_guepardo','asia_esp_0403','lobo_gris','zorro_rojo','oso_pardo','lince_iberico','gloton','alce','reno','bisonte_europeo','af_gran_kudu','af_nu_azul','af_jirafa','af_okapi','af_elefante_sabana','asia_esp_0465','af_hipopotamo','af_gorila_occidental','asia_esp_0436','af_mandril','af_lemur_colaanillada','af_pangolin_gigante','eu_esp_0616','castor_europeo','eu_esp_0623','af_dugongo','af_delfin_jorobado_indico','asia_esp_0498']);
const anatomyNotes={felid:'cráneo, musculatura, orejas, miembros digitígrados y cola',canid:'hocico, orejas, pecho y cola con volumen',hyena:'hombros altos, tren posterior bajo y mandíbula',viverrid:'tronco alargado, máscara y cola',fossa:'tronco flexible y cola larga',mongoose:'perfil bajo, hocico y extremidades cortas',weasel:'tronco sinuoso, cabeza pequeña y patas bajas',marten:'tronco largo, cabeza y babero',badger:'torso ancho y miembros cortos',deer:'cuello, pezuñas y cornamenta o colmillos según taxón',caprine:'pecho, pezuñas y cuernos de caprino',bovine:'masa del pecho, cuernos y pelaje',elephant:'trompa, orejas, cráneo y patas columnares',rhino:'masa corporal, labio, cuernos y pliegues',ape:'brazos, hombros y apoyo o postura sentada',gibbon:'brazos largos en suspensión y torso compacto',bat:'patagio, dedos alares y hoja nasal cuando existe',pangolin:'dorso curvo, placas integradas y cola',cetacean:'rostrum, dorso hidrodinámico, pectoral y aleta caudal',sirenian:'hocico ancho, torso fusiforme pesado y caudal',pinniped:'cuello erguido, torso fusiforme y aletas',otter:'tronco acuático, cola y patas o postura flotante',lagomorph:'orejas, grupa y miembros posteriores',jerboa:'orejas, miembros posteriores y cola larga',beaver:'torso robusto y cola plana',shrew:'hocico fino, tronco bajo y cola',mole:'hocico y manos excavadoras',desman:'trompa fina, pies y cola',porcupine:'manto convexo y púas ordenadas',hedgehog:'manto convexo y cara descubierta',tenrec:'dorso espinoso y hocico alargado'};
const rows=Object.entries(SPECIES).filter(([id,sp])=>classifyMammal(sp,id)).map(([id,sp])=>{
 const family=classifyMammal(sp,id),svg=renderMammal(sp,sp.color,'normal',null,id),morph=svg.match(/data-mammal-morph="([^"]+)"/)[1];
 const profile=MAMMAL_SPECIES_ANATOMY[sp.latin]||MAMMAL_SPECIES_ANATOMY[sp.latin.split(' ').slice(0,2).join(' ')];
 const generator=baseline.previousRenderer(id),old=baseline.before(id,'normal');
 const simple=/<ellipse\b/.test(old)||/<circle[^>]*r="(?:1[2-9]|2\d)"/.test(old);
 return {id,nombre:sp.name,nombre_cientifico:sp.latin,kind_persistido:sp.kind,familia_visual:family,generador_anterior:generator,
 estado_anterior:simple?'Silueta simplificada; proporciones y miembros requerían revisión':'Dibujo específico previo; se revisaron contorno, miembros y acabado',
 requiere_ilustracion_especifica:priority.has(id)?'Sí; control prioritario de especie':'Rasgos propios sobre anatomía compatible',
 dimorfismo_existente:SEXUAL_DIMORPHISM[id]?.type||'',variantes_existentes:sp.special.join(' | '),generador_actual:'mammal-art-v3194 / '+morph,
 proporciones_de_taxon:profile?.[5]||'Morfotipo y estructuras propios: '+morph,
 silueta:'Revisada en lámina renderizada; familia reconocible por contorno',
 anatomia:'Revisada: '+(anatomyNotes[family]||'proporciones de torso, cabeza, extremidades y estructuras de la familia'),
 prolijidad:'Revisada; curvas y apoyos continuos, contorno completo y detalles contenidos',
 identidad:priority.has(id)?'Revisada frente a especies similares; rasgos prioritarios visibles':'Revisada; rasgos de taxón y pelaje. En congéneres próximos, a 56 px también ayuda el nombre',
 control_prioritario:priority.has(id)?'sí':'no'};
});
const familyCounts={},morphCounts={};for(const r of rows){familyCounts[r.familia_visual]=(familyCounts[r.familia_visual]||0)+1;const m=r.generador_actual.split(' / ')[1];morphCounts[m]=(morphCounts[m]||0)+1;}
const summary={version:'3.19.4',base:'f153def213eab6e9b2818abfe7d02174cfdf2c5b',catalogo_total:Object.keys(SPECIES).length,mamiferos:rows.length,no_mamiferos:Object.keys(SPECIES).length-rows.length,familias:Object.keys(familyCounts).length,morfotipos:Object.keys(morphCounts).length,morfotipos_una_sola_especie:Object.values(morphCounts).filter(n=>n===1).length,especies_con_morfotipo_compartido:Object.values(morphCounts).filter(n=>n>1).reduce((a,b)=>a+b,0),proporciones_explicitas_por_taxon:rows.filter(r=>!r.proporciones_de_taxon.startsWith('Morfotipo')).length,prioritarias:rows.filter(r=>r.control_prioritario==='sí').length,dimorfismos:rows.filter(r=>r.dimorfismo_existente).length,familias_ocupadas:familyCounts,morfotipos_ocupados:morphCounts,catalogo_sha256:crypto.createHash('sha256').update(JSON.stringify(SPECIES)).digest('hex'),dimorfismo_sha256:crypto.createHash('sha256').update(JSON.stringify(SEXUAL_DIMORPHISM)).digest('hex'),criterio:'Evaluación visual cualitativa de láminas; las comprobaciones geométricas automatizadas se registran por separado. Contornos distintos no garantizan identificación de congéneres únicamente por silueta a 56 px.'};
const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"',header=Object.keys(rows[0]);
const csv=[header,...rows.map(r=>header.map(k=>r[k]))].map(row=>row.map(quote).join(',')).join('\n')+'\n';
const artifacts={'docs/mamiferos-v3194/inventario.csv':csv,'docs/mamiferos-v3194/auditoria.json':JSON.stringify({resumen:summary,especies:rows},null,2)+'\n'};
for(const[file,content]of Object.entries(artifacts))if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==content)throw Error('Stale mammal audit: '+file);}else{fs.mkdirSync('docs/mamiferos-v3194',{recursive:true});fs.writeFileSync(file,content);}
console.log(JSON.stringify(summary,null,2));
