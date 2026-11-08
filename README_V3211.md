# El Gran Atlas v3.21.1 — Atlas interactivo

El Atlas se convierte en una carta de expedición compacta: continente, mapa protagonista y ficha con acción contextual. Conserva las 57 regiones, sus coordenadas HX, especies, costes, prestigio, investigaciones y reglas de desbloqueo.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio cartográfico](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-atlas-v3211.html)

## Representación e interacción

- Pergamino, mar gris verdoso, rosa de los vientos, trazos finos y terreno SVG reutilizable según hábitat. No se utilizan imágenes remotas, filtros pesados ni librerías de producción nuevas.
- Región actual, ruta abierta, oportunidad de desbloqueo y región bloqueada tienen símbolos distintos. La selección usa un contorno independiente y `aria-pressed`; el foco de teclado tiene un contorno continuo visible.
- Selector nativo de ocho continentes. Europa, Asia, África y Norteamérica muestran sus regiones reales; Sudamérica, Oceanía, Polos y Océanos conservan cartas futuras bloqueadas, sin hexágonos ni regiones inventadas.
- Tocar un territorio actualiza su ficha y el resaltado. Conserva todos los nodos del mapa, sus listeners, el zoom y el desplazamiento. Enter/Espacio seleccionan; las flechas permiten recorrer territorios. Cada región tiene nombre accesible completo aunque el rótulo cartográfico esté abreviado.
- Desplazamiento interno en ambos ejes, mediante toque, teclado o barras. Zoom de 85%, 100%, 125% y 150%; el control central vuelve a 100%. «Mi ubicación» centra y selecciona la región actual, regresando a su continente si es necesario.
- La ficha presenta nombre, estado, especies identificadas, porcentaje, barra y acción de al menos 44 px. Los requisitos y hábitats completos quedan en «Ficha». La navegación del mapa, el selector y la ficha tienen controles de al menos 44 px.
- La posición y el zoom se recuerdan por continente durante la sesión, también al volver desde Campo. Son datos visuales en memoria: no añaden campos al formato del guardado.

## Reglas y transición a Campo

`regionRequirementsMet`, `continentStatus`, `unlockRegion`, `travelToRegion` y `setRegion` mantienen exactamente sus implementaciones de 3.21.0. Los indicadores de requisitos solo explican el estado; la autoridad de desbloqueo sigue siendo `regionRequirementsMet`.

Europa conserva sus umbrales de prestigio. Asia requiere su investigación y prestigio. África conserva mapa, estudios o ruta previamente habilitada y prestigio. Norteamérica conserva cartografía, mapa y prestigio; la navegación al Nuevo Mundo se presenta como antecedente de su investigación, sin añadir una comprobación nueva al desbloqueo. El prestigio no se consume.

Viajar sigue cambiando la región y abriendo Campo con el entorno correspondiente, sin tiempos ni costes nuevos. Seleccionar un territorio no viaja ni desbloquea. Las pantallas de Campo, Cuaderno, Bestiario, Museo, Inventario, Investigación y Expediciones conservan sus módulos.

Se corrigió únicamente el texto informativo antiguo de regiones: Europa 10, Asia 21, África 24 y Norteamérica 2. Estas cantidades ya existían en el catálogo anterior.

## Auditoría móvil

Mediciones reales en Chromium Linux, partida inicial, Europa, región actual y detalles cerrados. Referencia anterior `27a71e1`. El límite inferior descuenta el dock; las cajas se miden dentro del viewport CSS solicitado. Los estilos usan `100dvh` y áreas seguras. En Atlas móvil se ocultan las estadísticas generales redundantes, conservando el encabezado y acceso a Respaldos. Este ajuste no se aplica a Campo.

| Viewport | Scroll antes | Scroll después | Mapa visible después | Acción y ficha |
| --- | ---: | ---: | ---: | --- |
| 320 × 640 | 470 px | 0 px | 212 px | Visibles sobre el dock |
| 360 × 740 | 354 px | 0 px | 311 px | Visibles sobre el dock |
| 390 × 844 | 235 px | 0 px | 415 px | Visibles sobre el dock |
| 412 × 915 | 150 px | 0 px | 486 px | Visibles sobre el dock |
| 1440 × 1000 | 0 px | 0 px | 411 px | Mapa y ficha en dos columnas |

En móvil, la ficha inicial pasa de unos 314–329 px a unos 175 px. La acción termina aproximadamente 20 px antes del dock en los cuatro tamaños. El desplazamiento necesario para explorar territorios se realiza dentro del mapa. Abrir requisitos permite scroll secundario deliberadamente.

[Mediciones anteriores](docs/atlas-v3211/before.json) · [Mediciones nuevas](docs/atlas-v3211/after.json) · [Antes en 320 px](docs/atlas-v3211/before-320x640.png) · [Después en 320 px](docs/atlas-v3211/after-320x640.png) · [Después en 390 px](docs/atlas-v3211/after-390x844.png).

Se revisaron capturas de los cuatro continentes, región bloqueada, carta futura y escritorio: [África](docs/atlas-v3211/390x844-África-current.png), [Asia bloqueada](docs/atlas-v3211/320x640-Asia-locked.png), [continente futuro](docs/atlas-v3211/320x640-future.png), [escritorio](docs/atlas-v3211/after-1440x1000.png).

## Validación

- **218 pruebas Node aprobadas**, sin fallos ni omisiones; nueve son específicas de esta versión. Se comprueban requisitos por continente, desbloqueo, viaje, conservación del progreso, coordenadas HX, presentación accesible, aislamiento del laboratorio y reproducibilidad de sus datos.
- **100 casos responsive**: cinco tamaños, cuatro estados seleccionados en cada continente implementado y los cuatro continentes futuros. Mapa, selector, ficha, estado y acción quedan visibles, sin desbordamiento horizontal del documento ni superposición con el dock.
- **57 regiones seleccionadas en 320 × 640**, comprobando su ficha y acción sobre el dock. Toques sobre polígonos, teclado, arrastre con eventos táctiles, zoom, memoria de posición entre continentes y navegación de ida/vuelta con Campo verificados.
- Desbloqueo real sin consumir prestigio y viaje real a Campo comprobados en navegador. Las pantallas vecinas se abren y muestran sus componentes esperados, sin errores JavaScript.
- Cero reconstrucciones del mapa durante el tick inactivo medido. La selección conserva la identidad del SVG y de sus hexágonos.
- Juego y laboratorio cargan offline después de instalar el worker, con el navegador offline y el servidor local devolviendo error. El cambio de continente continúa disponible desde la caché.
- El laboratorio no modifica el almacenamiento del jugador. Usa una copia generada del catálogo, de los predicados y de la proyección visual de producción, junto al shell real sin scripts de juego. No contiene una implementación manual independiente de desbloqueos.
- **Regresión visual de Campo aprobada**: sus 44 combinaciones, 48 ambientes/horarios, navegación, exploración y guardado offline. La proyección, CSS y módulos gráficos de Campo permanecen idénticos a 3.21.0.
- Siguen pasando los contratos históricos: 28 funciones de juego, catálogo, siete motores gráficos, 3.473 combinaciones de sprites, respaldo/restauración y simulación determinista de 1 s, 1 h y 8 h con idénticos bytes persistidos y llamadas aleatorias.

[Informe completo del navegador](docs/atlas-v3211/browser-report.json) · [Regresión de Campo](docs/atlas-v3211/field-regression.json). Los viewports y gestos se probaron en Chromium; no se ha realizado una prueba física en Android.

## Rendimiento y guardados

La selección modifica solo atributos/clases de los hexágonos y el contenido de la ficha. No se añaden temporizadores ni redibujos periódicos. Cambiar de continente o abrir Atlas construye su carta una vez; seleccionar no reconstruye todos sus territorios.

Los JSON de medición conservan nueve ensayos de apertura completa con layout forzado y sprites en caché. El mapa nuevo incluye más detalle SVG; estas mediciones no se presentan como una mejora de apertura ni como resultados de hardware Android. La actualización frecuente de selección se verifica por conservación de los nodos; Campo y Bestiario conservan sus renderizadores anteriores.

Las claves, estructura, recuperación, importación y exportación de la partida se mantienen. Solo cambia la etiqueta informativa de versión a 3.21.1. El worker precarga una revisión completa, incluidos los módulos y laboratorio nuevos; conserva la activación en espera para clientes antiguos.

## Archivos principales

- `www/js/app.js`: proyección del Atlas, selección parcial y conexión de controles visuales.
- `www/js/atlas-ui-v3211.js`, `www/js/atlas-map-v3211.js`, `www/css/atlas-v3211.css`: componentes, cartografía e interacción visual.
- `www/laboratorio-atlas-v3211.html`, `www/js/lab/atlas-lab-v3211.js`, `www/js/lab/atlas-catalog-v3211.js`: revisión aislada con cinco tamaños y estados de muestra.
- `scripts/build-atlas-lab-v3211.cjs`, `scripts/review-atlas-v3211.cjs`, `scripts/check-atlas-browser-v3211.cjs`: generación y verificación reproducibles.
- `tests/atlas-v3211.test.cjs`, `tests/fixtures/atlas-v3210.json`, harness: contratos nuevos y referencia de mecánicas/Campo. Las pruebas anteriores solo actualizan expectativas de versión y caché.
- `www/index.html`, `www/sw.js`, `www/js/save-manager.js`, `package.json`, `capacitor.config.json`, workflows: versión, recursos y comprobación de sintaxis. El identificador Android permanece igual.
- `docs/atlas-v3211/`, este informe y `README.md`: evidencias y documentación.

## Reproducción

```sh
node --test tests/*.test.cjs
node scripts/build-atlas-lab-v3211.cjs --check
ATLAS_REVIEW_REF=27a71e1 ATLAS_REVIEW_MODE=before node scripts/review-atlas-v3211.cjs
ATLAS_REVIEW_REF=working ATLAS_REVIEW_MODE=after node scripts/review-atlas-v3211.cjs
node scripts/check-atlas-browser-v3211.cjs
```

Los scripts de navegador requieren Playwright para Node y `/usr/bin/chromium`. En este entorno se usa `NODE_PATH=/workspace/atlas-tools/node_modules`, sin añadir dependencias al juego. Los servidores locales se cierran al finalizar. La comparación histórica de capturas requiere que el commit anterior esté disponible; las pruebas de CI usan hashes de referencia y funcionan con un checkout superficial.
