# 3.33.0 · Océanos profundos (GM-04B)

Cinco sectores jugables: Atlántico profundo norte, Pacífico profundo oriental, Índico profundo, Pacífico profundo suroccidental y Océano Austral profundo. **943 identidades, 111 regiones y 1741 presencias**. Las 44 filas fuente contienen 24 conceptos: 20 altas y cuatro reutilizados (Architeuthis, Gonatus, Isistius y Somniosus). Los 923 perfiles, 106 regiones y 1697 presencias anteriores permanecen intactos. No se inicia GM-04C. Android y su firma permanente continúan separados; no se genera APK.

## Datos y alcance científico

[Catálogo trazado](docs/gm04b/catalog.json) · [Decisiones y fuentes](docs/gm04b/decisions.md). Se consumen los CSV GM-01 sin reconstruir el Excel. Cada presencia conserva hoja, fila, HX, ESP, nombres originales y efectivos, método, evidencia y condiciones. Onykia ingens se unifica como Moroteuthopsis ingens. La fila 1486 cambia editorialmente Grimpoteuthis umbellata por G. abyssicola del mar de Tasmania; no se afirma sinonimia ni reidentificación de un espécimen. GBIF apoya nomenclatura, no distribución. La documentación explica subáreas y límites de estas decisiones.

## Métodos, acceso e integración

Campo profundo muestra un cuaderno de muestras reconstruidas a bordo, con sonda lastrada, cabo graduado, red vertical y draga. No implica observación directa desde cubierta. Sondeo/red de columna: 60 s, £10 y 2 conocimiento. Muestreo científico: 180 s, £30 y 5 conocimiento. Fauna de fondo y ejemplares grandes requieren muestreo. Una operación pendiente, plazo absoluto y semilla guardada; el resultado utiliza el intento original sin garantizar descubrimiento. Las ventanas son abstracciones de trabajo científico en la ambientación naturalista, no fechas históricas de los primeros muestreos de cada profundidad.

El naturalista automático clasifica muestras con probabilidades, cadencia y cupo horario anteriores. El Cuaderno interpreta las evidencias alimentarias como contenido digestivo/registro de expedición. Se mantienen cinco etapas, monografías, Museo, Bestiario de 32 tarjetas por página y categorías especiales. Los cefalópodos se agrupan en Peces para jugar y conservan su clase biológica Cephalopoda. No se crean dimorfismos ni pigmentaciones nuevos.

Investigación **Sondeo y muestreo de océanos profundos** después de Navegación superficial: £6000 y 5200 conocimiento. Prestigio 429, 438, 447, 456, 465 (+9 tras 420), no consumible. Se conservan las cinco acreditaciones anteriores y se fabrica un equipo de sondeo útil: 4 latones, 4 maderas talladas, 3 pergaminos y 1 morral reforzado. Todos los componentes y sus recetas son anteriores a profundidad; Campo europeo, mercado y trueques ya permiten obtenerlos. Las cuatro rutas comerciales de 4/8/12/24 h, costes y recompensas permanecen exactas. [Auditoría de 106 accesos y economía](docs/gm04b/progression-audit.json).

El Atlas oceánico tiene 17 celdas. Las 12 posiciones superficiales son exactas; las cinco profundas tienen color y prefijo propios. Es un esquema de sectores, no distancias reales. Auditoría de 15 pares vecinos mediante vértices compartidos y distancias reales de la malla.

## Arte y pruebas

[Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-profundo-v3330.html): 20 láminas, búsqueda, filtro de 17 familias y comparación a 64/80/120 px. [Revisión visual y correcciones](docs/gm04b/art-review.md), capturas por familia y tablero completo. Los 923 SVG anteriores, variantes y sexos se comparan literalmente contra 3.32.0.

Regresión diferenciada: 430 pruebas históricas de 3.30.0 (`33c99b3`), 11 de 3.31.0 (`043a9e5`), 12 de 3.32.0 (`28deed5`), todas sobre sus fuentes originales sin cambiar expectativas; **20 pruebas actuales de 3.33.0**. Cubren las 44 presencias mediante intentos temporizados y naturalistas reales, filtros anteriores completos, investigación, fabricación, cinco etapas, Museo, tasas, plazo/coste/cola, resolución con semilla, rollback total por cuota, guardados históricos, exportación/importación, operación y viaje de 24 h pendientes, pago único tras 72 h y ticker de producción.

Bestiario medido en Chromium CPU×4, ocho aperturas y catálogo completo: primera apertura 294,0→314,6 ms; mediana de reapertura 175,9→136,9 ms. La primera apertura aumenta 20,6 ms (+7%); una medición emulada no demuestra un cambio en Android físico. Se mantienen 32 tarjetas. No se informa heap porque el entorno no devolvió métricas. [Informe](docs/gm04b/performance-report.json).

Comandos reproducibles:

- `python3 scripts/build-deep-data-v3330.py`
- `node scripts/audit-deep-progression-v3330.cjs`
- `node scripts/validate-deep-v3330.cjs`
- `node scripts/check-deep-art-v3330.cjs`
- `node scripts/check-deep-performance-v3330.cjs`
- `node scripts/check-deep-pwa-v3330.cjs`
- `node scripts/build-deep-release-v3330.cjs`

La prueba PWA local 3.32.0→3.33.0 pasó: respaldo exacto, bloqueo con otra ventana, partida y viaje de 24 h conservados; fabricación, investigación, desbloqueo, viaje y operación desde la UI. La cuenta regresiva cambia sin reconstruir el panel; tras recargar offline, la operación conserva su semilla y termina una sola vez mediante el ticker. Atlas, Campo y laboratorio se prueban a 320/360/390/412/1280 px sin desbordamiento. [Informe](docs/gm04b/browser-report.json). Son pruebas de Chromium emulado, sin validación de teléfono Android físico.

## Publicación verificada

Integrada en `main` tras cinco commits independientes desde `28deed5`. Commit desplegado: `38555e6467486eb68d3854b92feebc2cfb3ed96d`. [GitHub Actions correcto](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42862983059). Los **147 archivos web** coinciden con sus hashes SHA-256, sin diferencias. El Service Worker contiene 146 URLs de caché que corresponden a 145 archivos únicos (raíz e index son dos URLs); descarga la revisión completa antes de activarse y mantiene `gran_atlas_v05`.

La navegación HTTPS pública confirmó versión 3.33.0, 17 celdas oceánicas, desbloqueo y viaje desde UI, selección de muestreo, inicio de operación y botón deshabilitado. Al recargar offline se conservan región y operación pendiente, y el laboratorio abre sus 20 láminas. Sin errores JavaScript. [Hashes públicos](docs/gm04b/published-report.json) · [Prueba pública](docs/gm04b/published-browser.json).

Enlaces comprobados: [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio profundo](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-profundo-v3330.html) · [Actualización con respaldo](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3330.html).

Verificación repetible: `node scripts/check-deep-published-v3330.cjs` y `ATLAS_DEPLOY_WORKFLOW=https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42862983059 python3 scripts/check-deep-published-hashes-v3330.py`.
