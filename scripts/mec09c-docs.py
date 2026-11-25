# MEC-09C · Regenera la matriz de encuadre y los datos de la galería a partir de las medidas reales.
# Uso: python3 scripts/mec09c-docs.py
import json,csv,re,os
D=os.path.join(os.path.dirname(__file__),'..','docs','mec09c')+'/'
A={(x['save'],x['tab'],x['res']):x for x in json.load(open(D+'medidas-antes.json'))}
B={(x['save'],x['tab'],x['res']):x for x in json.load(open(D+'medidas-despues.json'))}
FIX={'atlas':'Marco compacto (200 px fijos); mapa sin cambios','field':'Prismáticos de la escena inicial dentro de su marco (ya no tapan el rótulo); contraste','journal':'Marco compacto','research':'Ramas en una fila desplazable; cabecera compacta; contraste AA de ramas y estados','society':'Subpestañas en una fila fija bajo la cabecera; registro numérico en una fila; aviso de evento a ancho completo; texto de subvención plegado (ⓘ)','bestiary':'Búsqueda visible; grupo, avistamientos y orden en «Filtros»; rótulo repetido retirado','expeditions':'Marco compacto; rótulos de instalación sin solape en 320 px','objects':'Subpestañas en una fila; rótulos repetidos retirados; desbordamiento interno corregido','museum':'Introducción plegada (ⓘ); notas repetidas por tarjeta retiradas'}
SCROLL={'atlas':'No requiere (mapa con desplazamiento propio)','field':'Hallazgos secundarios bajo la acción principal','journal':'Rail de especies y registro de etapas','research':'Listado de proyectos de la rama','society':'Contenido de la sección elegida (encargos, logros…)','bestiary':'Catálogo paginado de 32 fichas por página','expeditions':'No requiere (ilustración panorámica)','objects':'Cuadrícula paginada y ficha del objeto','museum':'Salas con exposiciones y gabinetes paginados'}
rows=[]
for k,a in A.items():
  if k[1].startswith('pop') or k not in B:continue
  d=B[k]
  rows.append({'partida':k[0],'pestana':a['tabName'],'resolucion':k[2],'tipo':a['kind'],
   'encabezado_antes':a['topbar'],'encabezado_despues':d['topbar'],'recursos_antes':a['resources'],'recursos_despues':d['resources'],'titulo_antes':a['title'],'titulo_despues':d['title'],
   'subpestanas_antes':a['subtabs'],'subpestanas_despues':d['subtabs'],'navegacion_antes':a['dock'],'navegacion_despues':d['dock'],'fijos_antes':a['fixed'],'fijos_despues':d['fixed'],
   'espacio_central_antes':a['panel'],'espacio_central_despues':d['panel'],'acciones_visibles_antes':a['actionsVisible'],'acciones_visibles_despues':d['actionsVisible'],
   'desbordamiento_h_antes':a['overflowX'],'desbordamiento_h_despues':d['overflowX'],'recortes_antes':a['clipped'],'recortes_despues':d['clipped'],
   'controles_pequenos_antes':a['smallTargets'],'controles_pequenos_despues':d['smallTargets'],'texto_visible_antes':a['visibleTextChars'],'texto_visible_despues':d['visibleTextChars'],
   'texto_menor_11px_antes':a['tinyTextChars'],'texto_menor_11px_despues':d['tinyTextChars'],'desplazamiento_vertical_despues':d['panelScroll'],
   'justificacion_desplazamiento':SCROLL.get(k[1],'') if d['panelScroll']>0 else '—','correcciones':FIX.get(k[1],''),'captura_antes':'capturas/antes/'+a['shot'],'captura_despues':'capturas/despues/'+d['shot']})
w=csv.DictWriter(open(D+'matriz-encuadre.csv','w',newline=''),fieldnames=list(rows[0]),delimiter=';');w.writeheader();w.writerows(rows)
keep=['save','tab','tabName','res','kind','shot','fixed','panel','subtabs','actionsVisible','smallTargets','visibleTextChars','overflowX','clipped','switchMs']
data=json.dumps({'antes':[{k:x.get(k) for k in keep} for x in A.values()],'despues':[{k:x.get(k) for k in keep} for x in B.values()]},ensure_ascii=False,separators=(',',':'))
g=open(D+'galeria.html').read();g=re.sub(r'const DATA=.*?;\n',lambda m:'const DATA='+data+';\n',g,count=1,flags=re.S);open(D+'galeria.html','w').write(g)
print(len(rows),'filas')
