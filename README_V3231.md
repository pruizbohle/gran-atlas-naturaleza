# El Gran Atlas v3.23.1 — Sudamérica pulida

AM-05 revisa las **131 especies sudamericanas** mediante SVG reales de producción. Conserva 36 ilustraciones y modifica 95: 33 de nivel B, 57 de nivel C y cinco de nivel D. No incorpora especies, regiones, objetos, investigaciones ni mecánicas.

| Lote | Especies | A: conservadas | B: detalles | C: anatomía | D: error grave |
|---|---:|---:|---:|---:|---:|
| AM-05A · Mamíferos | 60 | 8 | 21 | 28 | 3 |
| AM-05B · Aves | 41 | 24 | 11 | 4 | 2 |
| AM-05C · Reptiles y anfibios | 21 | 3 | 0 | 18 | 0 |
| AM-05D · Peces | 9 | 1 | 1 | 7 | 0 |
| Total | **131** | **36** | **33** | **57** | **5** |

El inventario completo, con ID, nombre científico, familia, gravedad inicial, problema, corrección, estado final y hashes antes/después, está en [art-audit.csv](docs/sudamerica-v3231/art-audit.csv) y [art-audit.json](docs/sudamerica-v3231/art-audit.json). Allí se enumeran las 95 especies intervenidas. Los niveles son una evaluación artística del estilo del juego, no una certificación taxonómica.

## Ilustraciones y evidencia

Las correcciones de mayor alcance incluyen los dos delfines de río, el oso hormiguero sedoso, las posturas de los primates, las proporciones de roedores y camelinos, los apoyos de cérvidos, el cóndor, los ñandúes, el hoacín, el chajá, las curvas de serpientes, los hocicos de cocodrilianos y siete perfiles de peces. El arapaima tiene cola redondeada y aletas posteriores; el surubí muestra cabeza aplanada y seis barbillones; *Electrophorus* presenta cuerpo alargado y aleta anal continua. El disco se conserva y el tetra recibe detalles menores.

Las **diez especies compartidas con Norteamérica conservan exactamente sus ilustraciones**, incluso variantes y sexos configurados. El módulo nuevo devuelve el control al motor anterior para los perfiles A. La fábrica sudamericana original solo incorpora dos puntos de resolución; no se sustituye su arquitectura ni se alteran motores globales.

Se inspeccionaron los SVG renderizados de los cuatro grupos, las variantes, el dimorfismo y las láminas a 64, 80 y 120 px. Las comparaciones usan el catálogo y el enrutador de producción congelados de la 3.23.0: sus 131 hashes normales coinciden con la evidencia original de AM-04.

| Evidencia | Antes/después | Lámina actual |
|---|---|---|
| Mamíferos | [Comparación](docs/sudamerica-v3231/mammals-compare.png) | [60 especies](docs/sudamerica-v3231/mammals.png) |
| Aves | [Comparación](docs/sudamerica-v3231/birds-compare.png) | [41 especies](docs/sudamerica-v3231/birds.png) |
| Reptiles y anfibios | [Comparación](docs/sudamerica-v3231/herps-compare.png) | [21 especies](docs/sudamerica-v3231/herps.png) |
| Peces | [Comparación](docs/sudamerica-v3231/fish-compare.png) | [Nueve especies](docs/sudamerica-v3231/fish.png) |
| Albinos | [Comparación](docs/sudamerica-v3231/albinos-compare.png) | [Pigmentación](docs/sudamerica-v3231/albinos.png) |
| Melánicos | [Comparación](docs/sudamerica-v3231/melanics-compare.png) | [Pigmentación](docs/sudamerica-v3231/melanics.png) |
| Dimorfismo | [Comparación](docs/sudamerica-v3231/dimorphism-compare.png) | [Machos y hembras](docs/sudamerica-v3231/dimorphism.png) |
| Épicos y excepcionales | [Comparación](docs/sudamerica-v3231/epic-exceptional-compare.png) | [Halos conservados](docs/sudamerica-v3231/epic-exceptional.png) |

También se incluyen [morfologías similares](docs/sudamerica-v3231/similar-morphologies.png), las [131 ilustraciones a 64 px](docs/sudamerica-v3231/all-at-64px.png) y [a 80 px](docs/sudamerica-v3231/all-at-80px.png). La comparación del laboratorio admite clase, familia, región, nombre científico original o aceptado, gravedad inicial, integración, variantes, macho/hembra y tamaños 64/80/120 px; mantiene paginación compacta y no accede a partidas.

## AM-05E · Variantes, dimorfismo e identidades

Las 121 incorporaciones de AM-04 mantienen **21 albinos, dos melánicos, 121 Notables, siete Épicos, dos Excepcionales y once dimorfismos**. Incluyendo las especies reutilizadas, las láminas muestran 24 especies con albinismo, cuatro con melanismo y doce dimorfismos. Los contornos y patrones siguen legibles al aplicar pigmentación; geometría, halos, probabilidades y recompensas usan el sistema central existente.

Se verificaron los once casos nuevos: cóndor, carpintero negro, gallito de las rocas, pato real, ciervo de los pantanos, taruca, huemul, venado de las pampas, venado colorado y ambos pudúes. Los machos de los siete cérvidos conservan astas; las hembras carecen de ellas. Se refinan carúncula del cóndor, cresta y plumaje del gallito, y cresta/rojo peribucal de la hembra del carpintero negro. El pato conserva diferencias de tamaño y carúnculas.

No se modifica ninguna identidad ni sinonimia de AM-04. *Inia boliviensis* y *Inia geoffrensis* mantienen IDs y presencias separados; comparten un perfil externo conservador, sin inventar una diferencia diagnóstica gráfica. Permanecen explícitos los conceptos amplios pendientes de *Leopardus colocola*, *L. tigrinus*, *Saimiri sciureus*, *Electrophorus electricus* y *Arapaima gigas*. No se detectaron ni crearon duplicados de catálogo; la reutilización de un perfil de familia no implica fusionar especies.

## AM-05F · Funcionalidad y partidas

Se conservan **710 especies mundiales, 79 regiones, diez regiones sudamericanas y las 192 presencias trazables del Excel**. El código de juego, los datos sudamericanos, su geografía, las mallas históricas, los datos/ilustraciones norteamericanos y los estilos de Campo/Atlas permanecen idénticos a la 3.23.0; sus hashes se verifican en las pruebas.

| Región | Presencias | Prestigio conservado |
|---|---:|---:|
| Caribe sudamericano | 18 | 167 |
| Llanos del Orinoco | 11 | 170 |
| Andes del Norte | 16 | 173 |
| Andes Centrales | 11 | 176 |
| Amazonía | 41 | 179 |
| Pantanal | 26 | 182 |
| Cerrado brasileño | 17 | 185 |
| Desierto de Atacama | 10 | 188 |
| Pampas | 22 | 191 |
| Patagonia y Tierra del Fuego | 20 | 194 |

Las **274 pruebas Node pasan**. Incluyen 384 encuentros ponderados dirigidos —manual y automático para cada presencia—, filtros ecológicos, encuentros múltiples/censos y límite horario, cinco etapas de Cuaderno para las 121 especies nuevas, publicación única, Bestiario mundial, desbloqueos sin gasto de prestigio, investigaciones, viajes y persistencia. La prueba dirigida selecciona un resultado de la distribución original para cubrir cada especie; no cambia el algoritmo del juego.

En Chromium se verifican viajes y encuentros manuales por la interfaz en las diez regiones, naturalistas mediante el `tick` real, Cuaderno, Bestiario de 710 especies, navegación táctil y modo offline. Los naturalistas se prueban con varios ciclos de tiempo simulado, manteniendo sus tasas originales. La validación XML usa 357 combinaciones sudamericanas de especie/variante/sexo y las 710 identidades mundiales. La regresión norteamericana revisa sus catorce regiones y 382 combinaciones gráficas.

Se probaron **320×640, 360×740, 390×844 y 412×915**. En las 40 combinaciones de región/resolución, el mapa completo y la acción de viaje son visibles sin desbordamiento horizontal ni desplazamiento vertical del documento. Campo conserva visibles el encuentro, la acción principal y el progreso del Cuaderno. El laboratorio se prueba también en comparación doble a los tres tamaños. Evidencia y mediciones: [browser-report.json](docs/sudamerica-v3231/browser-report.json) y [regresión norteamericana](docs/sudamerica-v3231/northamerica-regression/browser-report.json).

Se probó actualización real con service worker desde **3.21.2, 3.22.1 y 3.23.0**. Se mantiene la revisión antigua hasta aceptación, se bloquea la activación si hay otra ventana abierta, se verifica respaldo bruto idéntico y se conservan región, desbloqueos, avistamientos, monografías, variantes, inventario, Museo y expediciones. La partida 3.23.0 incluye progreso en Amazonía y conserva además el Sáhara histórico `HX-06-07`. Se prueban recarga offline, exportación/importación Android simulada y la clave `gran_atlas_v05`. Solo cambia la etiqueta de versión del exportador, sin cambios de formato ni estructura.

## Rendimiento y límite de la validación

La [comparación de rendimiento](docs/sudamerica-v3231/performance-report.json) usa el mismo catálogo de 710 especies, navegador, página y sesión CDP con CPU ×4, orden ABBA y tres muestras de render/layout caliente por visita. La mediana de apertura completa del Bestiario pasa de **2.299 ms a 2.460 ms**, aproximadamente **+7 %**, con variación entre muestras. La serialización se mantiene alrededor de 1–1,3 ms y el estado tiene el mismo tamaño. La caché caliente de las 131 ilustraciones se recorre en 0,42 ms en esta ejecución. El laboratorio mantiene 32 tarjetas iniciales; los recursos comparativos antiguos se cargan solo allí, no en el juego.

El Bestiario completo de 710 tarjetas sigue siendo una operación costosa en esta prueba exigente y queda registrado para **AM-06**. No se introduce una refactorización del renderizador general para disimular ese coste. No se añadieron temporizadores, dependencias, trabajo gráfico al bucle principal ni cambios de observación. Las mediciones son de Chromium con emulación móvil, **no una prueba en un Android físico** ni una garantía universal de rendimiento.

## Reproducción y publicación

```sh
node --test tests/*.test.cjs
node scripts/build-southamerica-lab-v3230.cjs --check
node scripts/build-southamerica-audit-v3231.cjs --check
node scripts/build-northamerica-lab-v3220.cjs --check
node scripts/build-atlas-lab-v3211.cjs --check
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/review-southamerica-v3231.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-southamerica-browser-v3231.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-northamerica-regression-v3231.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-pwa-upgrade-v3231.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/benchmark-southamerica-v3231.cjs
```

Las pruebas de navegador requieren Playwright y Chromium; la batería Node de CI no incorpora dependencias nuevas. Las referencias históricas de los ensayos PWA/rendimiento están en el historial Git; las pruebas Node de CI usan fixtures locales y funcionan con checkout superficial.

La versión visible, metadatos Capacitor, exportador, recursos y caché offline pasan a 3.23.1. Se añade una [entrada nueva de actualización segura](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3231.html), conservando el mecanismo anterior. Los workflows [Deploy El Gran Atlas](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/static.yml) y [Android APK de prueba](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-debug.yml) ejecutan las pruebas antes de publicar. Su resultado real, SHA y artefacto se comprueban después del push y se informan en la entrega, evitando afirmar éxito anticipadamente.

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/)
- [Laboratorio sudamericano actualizado](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-sudamerica-v3230.html)
- [Publicación Android v3.23.1](https://github.com/pruizbohle/gran-atlas-naturaleza/releases/tag/v3.23.1)
- [Archivos modificados](docs/sudamerica-v3231/FILES.md)

El APK se valida leyendo su manifiesto binario, versión 3.23.1/código 32301, paquete estable, todos los archivos web y los plugins nativos de importación/exportación. Es una compilación de prueba; actualizar una instalación previa requiere además la misma firma. El respaldo Android conserva su flujo actual.
