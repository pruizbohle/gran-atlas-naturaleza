# 3.34.0 · Fosas abisales (GM-04C)

Dos fosas jugables y tres presencias originales: **945 especies, 113 regiones y 1744 presencias**. Dos identidades nuevas de Liparidae y reutilización íntegra de Bathypterois grallator. Se conservan las 943 especies, 111 regiones, 1741 presencias y todas las ilustraciones anteriores. El cierre geográfico de GM-04 no inicia GM-05 ni altera Android o su firma.

## Datos y ciencia

[Catálogo trazado](docs/gm04c/catalog.json) · [Decisiones y fuentes](docs/gm04c/decisions.md). Filas Fauna 1322, 1323 y 1485, con ESP, HX, nombre, rareza y bioma originales. Los IDs semánticos mantienen Madagascar en `HX-09-14`.

Pez trípode: planicie periférica de 4000–4720 m, dentro de su rango documentado, sin asignarlo a profundidad hadal ni certificar una localidad puntual de Marianas. Pseudoliparis swirei: capturas documentadas de Marianas, 6898–7966 m. Kermadec: ventana conservadora de la localidad tipo, 6660–6770 m. El nombre fuente Notoliparis kermadecensis se conserva; se usa Pseudoliparis kermadecensis según Eschmeyer y la revisión de 2025. Es un cambio de género, sin fusionar ambas especies ni extenderlas a otras fosas. Los límites son subconjuntos operativos del juego, no rangos completos o afirmaciones de endemismo universal.

## Juego, acceso y compatibilidad

**Sondeo extraordinario**: 300 s, £60 y 10 conocimiento, con selección de subárea. Los dos peces caracol requieren ese protocolo; el trípode también admite muestreo científico anterior de 180 s, £30 y 5 conocimiento. Los encuentros mantienen su probabilidad original y pueden no producir identificación. El sistema comparte la cola de una operación de 3.33.0, plazos absolutos, semilla guardada, recibos y rollback completo si no se puede guardar. La automatización respeta protocolo y subárea con cadencia y cupo anteriores.

Campo y Cuaderno explican que recuperar estas muestras hadales excede las capacidades históricas de 1842 y es una abstracción lúdica. Las láminas se reconstruyen científicamente; no hay observación directa desde cubierta, submarinos ni robots. Las evidencias de dieta proceden de muestras/documentación. Se conservan las cinco etapas, publicaciones, Museo y Bestiario paginado.

Investigación abisal tras sondeo profundo: £6800 y 5800 conocimiento. Prestigio **475 y 485**, +10 después de 465, no consumible. Se reutiliza el equipo de sondeo y las seis acreditaciones anteriores; no hay instrumento ni material obligatorio nuevo. [Auditoría económica y de los 111 accesos anteriores](docs/gm04c/progression-audit.json). Los 943 monografiables previos superan el umbral 485 sin depender de fauna abisal. Esto prueba ausencia de un ciclo de acceso, no equilibrio completo de tiempos de progresión.

El Atlas tiene 19 sectores oceánicos (12 superficiales, 5 profundos y 2 fosas), con colores diferenciados. Conserva las 17 posiciones anteriores. La auditoría geométrica comprueba 16 pares vecinos por distancia y vértices compartidos. El mapa es un esquema sin distancias reales deducidas de HX.

## Arte y validación

[Laboratorio abisal](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-abisal-v3340.html): tres identidades, filtro familiar, búsqueda por nombre fuente o actual y comparación a 64/80/120 px. Los peces caracol tienen piel pálida gelatinosa, ojo pequeño, disco ventral y aletas continuas; la pectoral escotada de swirei se distingue de la corta sin escotadura de Kermadec. No bioluminiscencia ni variantes biológicas inventadas. [Revisión renderizada y corrección del disco](docs/gm04c/art-review.md). Todas las variantes y sexos anteriores permanecen literalmente iguales.

Pruebas históricas sin editar sobre sus fuentes originales: 430 de 3.30.0, 11 de 3.31.0, 12 de 3.32.0 y 20 de 3.33.0, **473 históricas**. **20 actuales de 3.34.0**: tres presencias, filtros y muestras reales, naturalistas y ticker, acceso, monedas, cola compartida con operación antigua, resolución determinista, guardados y exportación/importación antigua/nueva, viaje de 24 h, retorno de 72 h y pago único, Museo, Cuaderno y todos los SVG anteriores. Las pruebas históricas no se presentan como comprobaciones del catálogo actual.

Bestiario Chromium CPU×4, 943→945 identidades, ocho aperturas: primera apertura 395,0→390,4 ms; mediana de reapertura 215,8→169,8 ms. Son mediciones emuladas con variación visible entre muestras, no evidencia de mejora en teléfonos físicos. Se mantienen 32 tarjetas por página. El entorno no devolvió métricas de heap. [Informe](docs/gm04c/performance-report.json).

Comandos reproducibles:

- `python3 scripts/build-abyssal-data-v3340.py`
- `node scripts/audit-abyssal-progression-v3340.cjs`
- `node scripts/validate-abyssal-v3340.cjs`
- `node scripts/check-abyssal-art-v3340.cjs`
- `node scripts/check-abyssal-performance-v3340.cjs`
- `node scripts/check-abyssal-pwa-v3340.cjs`
- `node scripts/build-abyssal-release-v3340.cjs`

La actualización PWA local 3.33.0→3.34.0 pasó con respaldo exacto y rechazo al existir otra ventana. Conserva una operación científica de 180 s y un viaje de 24 h. La operación antigua se completa una vez; investigación, desbloqueo de ambas fosas, subárea hadal y sondeo extraordinario se ejecutan desde UI. Se conserva la cola compartida, el contador cambia sin reconstruir el panel y, después de recargar offline, se resuelve una operación desde otra fosa y otra local con recibos únicos. Atlas, Campo y laboratorio se comprueban a 320/360/390/412/1280 px. [Informe](docs/gm04c/browser-report.json).

Preparados 154 archivos web con SHA-256 y 152 archivos únicos offline. El guardado sigue en `gran_atlas_v05`. README principal y páginas de actualización actuales anuncian 3.34.0; las páginas numeradas anteriores conservan su contexto histórico. La verificación HTTPS se añadirá tras publicar en Pages.
