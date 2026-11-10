# EC-01 — Comercio y progresión 3.30.0

## EC-01A: auditoría sobre 07cf5d8

El guardado continúa en `gran_atlas_v05`. `app.js` contiene inventario, recetas, investigación, expediciones, persistencia e importación en vivo; `save-manager.js` conserva campos aditivos. El tick limita los ingresos pasivos a ocho horas, pero resuelve viajes con Date.now() real. Ocho rutas científicas existentes: costa (90 s), norte (180 s), Alpes (300 s), Cárpatos (420 s), Balcanes (520 s), Etiopía (600 s), Namib y Atlántico (720 s). Conservan sus costes, premios, RNG y condiciones. La flota científica dispone de 2 plazas, 3 con investigación. El comercio tendrá una plaza independiente y no alterará esas ocho rutas.

La economía combina subvenciones (35 + 5 por especie descubierta/minuto), canje de 40 conocimientos por £25, £90 por monografía, ingresos de Museo por segundo y viajes científicos breves. No se modificarán probabilidades, naturalistas ni ingresos existentes. Los mercados no venderán mapas, fragmentos continentales, prestigio ni herramientas terminadas. No hay venta por libras. Los trueques serán unidireccionales y consumirán varias unidades para entregar una; no habrá arbitraje.

Objetos acumulativos existentes: África exige Brújula de latón; Norteamérica añade Cuadrante transatlántico; Sudamérica añade Catalejo de precisión; Oceanía añade Sombrero académico. Ninguno se consume como requisito. Recetas existentes: brújula = moneda antigua + fragmento de mapa; cuadrante = 3 latones + 2 lentes + 2 fragmentos + pergamino; catalejo = prismáticos + 2 lentes + 2 latones + 2 pergaminos; sombrero = sombrero de naturalista + gorro emplumado + tintero + 3 flores. El catalejo mejora encuentro manual y el sombrero mejora conocimiento. Los cuatro se pueden fabricar con botín europeo; los mercados y trueques facilitan suministros sin sustituir mapas ni investigación. No se agregan objetos ni catálogo biológico.

Umbrales auditados: Europa 0–9 (10 regiones); Asia 10–50 (21); África 53–122 (24); Norteamérica 125–164 (14); Sudamérica 167–194 (10); Oceanía 197–218 (8). Orden canónico: prestigio anterior ascendente, sin reordenar ni mover regiones del catálogo o mapa. Nuevos incrementos 1/2/3/4/5/6. Para evitar solapamientos, comienzos 0/10/53/125/182/233; finales 9/50/122/177/227/275. 807 especies permiten alcanzar esos requisitos mediante monografías; compilar Atlas también concede prestigio. Los continentes futuros se podrán añadir a la tabla sin implementar regiones ahora.

Migración: registro permanente de fabricación, inferido de herramientas presentes/equipadas y antecedentes de investigación históricos; acceso ganado conservado para siempre, sin consumir prestigio. Importación histórica recibe la misma migración. El comercio guarda plazos absolutos, secuencia, trabajos e historial; liquidación única antes del guardado. Se conserva todo campo anterior.

## Diseño comercial

Una plaza comercial, astillero requerido. Rutas 4/8/12/24 h, sin bonificaciones de duración: plazos reales independientes de la acumulación de ingresos offline. Costes £120/280/500/900 y 20/50/90/160 conocimientos; retornos £180/420/750/1350 más suministros deterministas. Requisitos de prestigio 0/10/53/125. Ganancia monetaria neta 15/17,5/20,83/18,75 libras por hora: complemento de los viajes científicos y Museo, sin sustituirlos. Botín determinista evita volver a sortear al recargar. Historial acotado a doce recibos.

## Validación y publicación

Pendiente de implementación y pruebas. No se ha publicado 3.30.0.
