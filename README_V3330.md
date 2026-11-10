# 3.33.0 · Océanos profundos (GM-04B)

Cinco sectores jugables: Atlántico profundo norte, Pacífico profundo oriental, Índico profundo, Pacífico profundo suroccidental y Océano Austral profundo. **943 identidades /111 regiones /1741 presencias**. Las44 filas fuente contienen24 conceptos:20 altas y cuatro reutilizados (Architeuthis, Gonatus, Isistius y Somniosus). Los923 perfiles,106 regiones y1697 presencias anteriores permanecen intactos. No se inicia GM-04C. Android y su firma permanente continúan separados; no se genera APK.

## Datos y alcance científico

[Catálogo trazado](docs/gm04b/catalog.json) · [Decisiones y fuentes](docs/gm04b/decisions.md). Se consumen los CSV GM-01 sin reconstruir el Excel. Cada presencia conserva hoja, fila, HX, ESP, nombres originales y efectivos, método, evidencia y condiciones. Onykia ingens se unifica como Moroteuthopsis ingens. La fila1486 cambia editorialmente Grimpoteuthis umbellata por G.abyssicola del mar de Tasmania; no se afirma sinonimia ni reidentificación de un espécimen. GBIF apoya nomenclatura, no distribución. La documentación explica subáreas y límites de estas decisiones.

## Métodos, acceso e integración

Campo profundo muestra un cuaderno de muestras reconstruidas a bordo, con sonda lastrada, cabo graduado, red vertical y draga. No implica observación directa desde cubierta. Sondeo/red de columna:60s, £10 y2 conocimiento. Muestreo científico:180s, £30 y5 conocimiento. Fauna de fondo y ejemplares grandes requieren muestreo. Una operación pendiente, plazo absoluto y semilla guardada; el resultado utiliza el intento original sin garantizar descubrimiento. Las ventanas son abstracciones de trabajo científico en la ambientación naturalista, no fechas históricas de los primeros muestreos de cada profundidad.

El naturalista automático clasifica muestras con probabilidades, cadencia y cupo horario anteriores. El Cuaderno interpreta las evidencias alimentarias como contenido digestivo/registro de expedición. Se mantienen cinco etapas, monografías, Museo, Bestiario de32 tarjetas por página y categorías especiales. Los cefalópodos se agrupan en Peces para jugar y conservan su clase biológica Cephalopoda. No se crean dimorfismos ni pigmentaciones nuevos.

Investigación **Sondeo y muestreo de océanos profundos** después de Navegación superficial:£6000 y5200 conocimiento. Prestigio429,438,447,456,465 (+9 tras420), no consumible. Se conservan las cinco acreditaciones anteriores y se fabrica un equipo de sondeo útil:4 latones,4 maderas talladas,3 pergaminos y1 morral reforzado. Todos los componentes y sus recetas son anteriores a profundidad; Campo europeo, mercado y trueques ya permiten obtenerlos. Las cuatro rutas comerciales de4/8/12/24h, costes y recompensas permanecen exactas. [Auditoría de106 accesos y economía](docs/gm04b/progression-audit.json).

El Atlas oceánico tiene17 celdas. Las12 posiciones superficiales son exactas; las cinco profundas tienen color y prefijo propios. Es un esquema de sectores, no distancias reales. Auditoría de15 pares vecinos mediante vértices compartidos y distancias reales de la malla.

## Arte y pruebas

[Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-profundo-v3330.html):20 láminas, búsqueda, filtro de17 familias y comparación64/80/120. [Revisión visual y correcciones](docs/gm04b/art-review.md), capturas por familia y tablero completo. Los923 SVG anteriores, variantes y sexos se comparan literalmente contra3.32.0.

Regresión diferenciada:430 pruebas históricas de3.30.0 (`33c99b3`),11 de3.31.0 (`043a9e5`),12 de3.32.0 (`28deed5`), todas sobre sus fuentes originales sin cambiar expectativas; **20 pruebas actuales de3.33.0**. Cubren44 presencias mediante intentos temporizados y naturalistas reales, filtros anteriores completos, investigación, fabricación, cinco etapas, Museo, tasas, plazo/coste/cola, resolución con semilla, rollback total por cuota, guardados históricos, exportación/importación, operación y viaje24h pendientes, pago único tras72h y ticker de producción.

Bestiario medido en Chromium CPU×4, ocho aperturas y catálogo completo:primera294,0→314,6ms; mediana de reapertura175,9→136,9ms. La primera apertura aumenta20,6ms (+7%); una medición emulada no demuestra un cambio en Android físico. Se mantienen32 tarjetas. No se informa heap porque el entorno no devolvió métricas. [Informe](docs/gm04b/performance-report.json).

Comandos reproducibles:

- `python3 scripts/build-deep-data-v3330.py`
- `node scripts/audit-deep-progression-v3330.cjs`
- `node scripts/validate-deep-v3330.cjs`
- `node scripts/check-deep-art-v3330.cjs`
- `node scripts/check-deep-performance-v3330.cjs`
- `node scripts/check-deep-pwa-v3330.cjs`
- `node scripts/build-deep-release-v3330.cjs`

La publicación y las pruebas PWA/HTTPS se documentan al finalizar la verificación.
