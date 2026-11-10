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

EC-01B y EC-01C implementados en commits independientes. Ningún objeto nuevo: se reutilizan cuatro recetas y sus materiales. Campos aditivos: `commerce` (secuencia, trabajos, doce recibos), `craftedItems` y `progressionVersion3300`. La migración histórica acredita preparaciones inferidas por acceso continental previo; posteriores adquisiciones directas no acreditan fabricación. Las regiones permanecen en sus posiciones y se conserva el catálogo fuente congelado; los requisitos se aplican a copias de sus registros en ejecución.

Resultados locales: 430/430 pruebas Node pasan, incluidas 14 pruebas nuevas de comercio, progresión, migración real 3.29.0 y exportación/importación. Se conservan los contratos históricos de expansiones anteriores mediante extracción de los bloques EC3300, y se prueba la progresión vigente por separado. La prueba global recorre investigación, materiales, fabricación y 87 regiones sin consumir prestigio.

Chromium: 320, 360, 390, 412 y 1280 px sin desbordamiento; navegación a Taller y Cuadrante; 24 h pendientes, 72 h offline, reinicio y pago único. Cien actualizaciones conservan el nodo del contador. Laboratorio aislado de ocho escenarios, disponible offline, sin acceso al almacenamiento real. Emulación táctil, sin prueba en Android físico. Evidencias y capturas en `docs/commerce-v3300`.

Simulación reproducible: `node scripts/simulate-commerce-v3300.cjs`. Tres estados de 72 h, diez búsquedas manuales y una salida científica por hora, subvención horaria y Museo con 0/3/8 especies. Libras finales: temprana £12.120, intermedia £231.724, avanzada £615.259. Los grandes ingresos intermedios/avanzados proceden del Museo existente, no de Comercio; no se cambiaron. El informe declara recursos y supuestos, sin afirmar un tiempo humano de completitud. Todas las recetas obligatorias tienen fuentes europeas; el máximo requisito 275 es inferior a las 807 monografías posibles.

Control de arbitraje: potencial monetario estricto en cinco trueques y ocho estudios existentes, incluyendo donación de madera y conversión de notas. Comprar los materiales de una donación cuesta £250 para recuperar £80. Comprar flores y pergamino para 40 conocimientos cuesta £165 para recuperar £25 al canjear notas. El ciclo £100 → 70 conocimiento → £43,75 es deficitario. No se venden mapas continentales ni herramientas terminadas; las salidas rentables requieren tiempo real.

Rendimiento: 200 renderizados comerciales medidos en Node VM y 100 sincronizaciones del contador medidas en Chromium (véase informe; no son tiempos de dispositivo real). Comercio no genera SVG ni agrega temporizadores: usa el tick existente. Las transacciones comerciales revierten la mutación en memoria si falla el guardado duradero, y permiten reintentar el regreso.

Comandos de validación:

- `node --test tests/*.test.cjs`
- `node scripts/check-commerce-v3300.cjs`
- `node scripts/simulate-commerce-v3300.cjs`
- `node scripts/build-commerce-release-v3300.cjs` (caché y manifiesto reproducibles)

Actualización web: versión 3.30.0 en entrada, exportaciones, configuración y metadatos; caché íntegra nueva, conservando las rutas de actualización anteriores. El actualizador persiste y requiere cerrar otras pestañas antes de activar la nueva caché. No se genera ni firma APK. Publicada y verificada en [GitHub Pages](https://pruizbohle.github.io/gran-atlas-naturaleza/). Despliegue `33e6aacb347abcb12862a84506fd54d1e75816c5`: [workflow correcto](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42816057959), con 430 pruebas aprobadas. La comprobación HTTPS confirmó los hashes de los 127 archivos web sin diferencias. Prueba pública a 360 px: compra de material, salida de 24 h, plaza ocupada, recarga offline con viaje e inventario conservados y laboratorio offline, sin errores de JavaScript. Informes `published-report.json` y `published-browser.json`.

La CI descarga el historial completo (`fetch-depth: 0`) porque las pruebas de compatibilidad leen directamente el commit real 3.29.0. Comprobaciones públicas repetibles: `python3 scripts/check-commerce-published-hashes-v3300.py` y `node scripts/check-commerce-published-v3300.cjs`.
