# El Gran Atlas v3.23.0 — Sudamérica completa

AM-04 incorpora **diez regiones jugables, diez hexágonos y las 192 presencias originales**. Sudamérica tiene **131 identidades: diez reutilizadas y 121 nuevas**. El catálogo mundial pasa de 589 a **710 especies** y de 69 a **79 regiones**. No se crean Legendarios, materiales, objetos, recetas ni expediciones.

## Fuentes y decisiones

Se reutilizan `docs/americas-audit.md`, los CSV de especies/regiones/presencias/incidencias y el plan AM-01. Se comprobó el Excel original `Atlas_Fauna_Hexagonal_209_900_Especies.xlsx`, SHA-256 `5cd22412e6b251d8f02a90e4c8303e02946d5e5d26855589d2c6750649fe4350`: las 192 filas de Fauna coinciden con AM-01, sus regiones coinciden con Hexágonos y sus IDs/binomios con Catálogo especies. Mapa se consulta como procedencia; su geometría de 209 celdas no se importa.

[Verificación de fuente](docs/sudamerica-v3230/source-verification.json) · [192 presencias trazadas](docs/sudamerica-v3230/source-presences.json) · [131 identidades, IDs, variantes e integración](docs/sudamerica-v3230/SPECIES.md).

Las diez reutilizadas conservan exactamente sus IDs, datos, rarezas y dibujos: **Ara macao, Bradypus variegatus, Caracara plancus, Ctenosaura similis, Dicotyles tajacu, Myrmecophaga tridactyla, Odocoileus virginianus, Panthera onca, Pelecanus occidentalis y Puma concolor**. Se mantienen sus prefijos `na_`; no se crean copias sudamericanas.

Se consultó la taxonomía oficial de **ASM Mammal Diversity Database**, publicada el 28-07-2026, en el commit `749c2de16a949099cfc13ccbd2b86d427641e844`. El [extracto consultado](docs/sudamerica-v3230/taxonomy-mdd-extract.json), sus notas y la [licencia](docs/sudamerica-v3230/MDD-LICENSE.txt) quedan archivados. Tres correspondencias documentadas:

| Nombre original | Nombre utilizado |
|---|---|
| Pudu mephistophiles | Pudella mephistophiles |
| Dasypus hybridus | Dasypus septemcinctus |
| Conepatus humboldtii | Conepatus chinga |

Ninguna correspondencia renombra un ID histórico ni produce duplicados. **Inia boliviensis e Inia geoffrensis permanecen separados**, con conceptos restringidos y cuencas diferenciadas siguiendo MDD.

Se conservan explícitamente cinco conceptos pendientes: **Leopardus colocola, Leopardus tigrinus, Saimiri sciureus, Electrophorus electricus y Arapaima gigas**. La localidad de fuente no permite resolverlos de manera unívoca bajo tratamientos modernos. No se inventan equivalencias con especies segregadas ni se elimina su fila. La consulta al Catalog of Fishes fue bloqueada por la política de red del entorno; no se afirma una validación ictiológica externa que no ocurrió.

[Doce decisiones taxonómicas prioritarias](docs/sudamerica-v3230/TAXONOMY.md) · [registro estructurado](docs/sudamerica-v3230/taxonomic-decisions.json).

Las **30 presencias con alertas geográficas** tienen una decisión explícita de subárea. Permanecen pendientes de localidad/origen dos registros: **Primolius couloni en Andes del Norte** y **Colossoma macropomum en Pantanal**. Se mantienen como registros ilustrativos de la planilla, sin certificar población nativa ni inventar un traslado. Las demás notas delimitan piedemonte, vertientes bajas, bosque guayanés, cuencas, salares altoandinos, litoral rocoso y bosques norpatagónicos según el caso.

[Subáreas y límites de interpretación](docs/sudamerica-v3230/SUBAREAS.md). Esta trazabilidad no incorpora una mecánica de subáreas: la exploración conserva el algoritmo existente y las 192 asignaciones jugables de fuente.

## Regiones, cartografía y acceso

Todos los IDs son semánticos. **Amazonía usa `sa_amazonia`; `HX-06-07` continúa siendo el Sáhara**. El código HX original solo se almacena como procedencia. Los códigos visibles `SA-01` a `SA-10` identifican la región y no determinan coordenadas.

| Región | ID estable | Fauna | Prestigio acumulado |
|---|---|---:|---:|
| Caribe sudamericano | sa_caribe_sudamericano | 18 | 167 |
| Llanos del Orinoco | sa_llanos_del_orinoco | 11 | 170 |
| Andes del Norte | sa_andes_del_norte | 16 | 173 |
| Andes Centrales | sa_andes_centrales | 11 | 176 |
| Amazonía | sa_amazonia | 41 | 179 |
| Pantanal | sa_pantanal | 26 | 182 |
| Cerrado brasileño | sa_cerrado_brasileno | 17 | 185 |
| Desierto de Atacama | sa_desierto_de_atacama | 10 | 188 |
| Pampas | sa_pampas | 22 | 191 |
| Patagonia y Tierra del Fuego | sa_patagonia_y_tierra_del_fuego | 20 | 194 |

La retícula axial tiene filas de **2–3–2–2–1 celdas**, radio 46 y **18 pares vecinos que comparten dos vértices y un lado real**. Es conexa, sin celdas decorativas ni agrupaciones. El error numérico máximo de borde es inferior a `10^-8`. La cordillera queda al oeste, las cuencas al este y Patagonia al extremo austral. Su silueta es una composición compacta, no cartografía a escala.

`www/js/southamerica-geography-v3230.js` añade la composición y delega literalmente en el módulo anterior para los otros cuatro continentes. Sus coordenadas, tamaños, islas, zoom, controles y mallas se conservan. [Auditoría geométrica y combinaciones de exploración](docs/sudamerica-v3230/functional-report.json) · [mapa 320](docs/sudamerica-v3230/map-320.png) · [mapa 412](docs/sudamerica-v3230/map-412.png).

La única investigación nueva es **Cartografía de Sudamérica**, `sudamerica_1`, en la rama Expediciones: **£3.400 y 3.000 conocimiento**, antecedente `norteamerica_1`. Continúa Navegación al Nuevo Mundo → Cartografía de Norteamérica → Cartografía de Sudamérica. No se necesita un objeto nuevo ni materiales sudamericanos: no existe una dependencia circular de acceso. No exige todas las monografías ni todos los animales de Norteamérica. Comprar la investigación no abre automáticamente las regiones; cada una conserva su umbral. **El prestigio no se consume**.

Para mantener intactos los perfiles compartidos, Llanos incluye bosque de ribera entre sus cuatro filtros; Patagonia usa pradera para los ambientes abiertos/esteparios, bosque, costa y humedal. Los hábitats, horarios, estaciones y paletas son configuración explícita de juego, no columnas atribuidas al Excel. Todos los registros tienen al menos una combinación válida. Se normaliza `Muy raro` a `Muy rara` únicamente en las altas nuevas; ninguna rareza existente se modifica.

## Ilustraciones y variantes

El módulo regional conserva la arquitectura de `SPECIES`, la ruta central SVG, la caché, la pigmentación y los sistemas de especímenes. Las diez especies compartidas utilizan sus motores originales. Las 121 nuevas se agrupan en perfiles anatómicos por familia y morfología, sin imágenes externas, emojis como sustitutos ni nuevas dependencias.

Se renderizaron e inspeccionaron las **131 ilustraciones normales**: [60 mamíferos](docs/sudamerica-v3230/mammals.png), [41 aves](docs/sudamerica-v3230/birds.png), [21 reptiles/anfibios](docs/sudamerica-v3230/herps.png) y [nueve peces](docs/sudamerica-v3230/fish.png). Las [huellas de render](docs/sudamerica-v3230/render-inventory.json) identifican cada especie, familia, origen e incertidumbre taxonómica. Se ajustaron durante la revisión la aleta caudal y dorsal de Inia y la cresta del cóndor. No se declara realizada la auditoría artística definitiva AM-05: quedan para esa etapa el afinado comparativo de proporciones, pelajes, articulaciones y patrones entre perfiles cercanos.

Configuración de las **121 altas nuevas**:

| Configuración | Cantidad |
|---|---:|
| Albino | 21 |
| Melánico | 2 |
| Notable | 121 |
| Épico | 7 |
| Excepcional | 2 |
| Dimorfismo | 11 |
| Legendarios nuevos | 0 |

Los pigmentos son una selección de configuración, no una lista exhaustiva o certificación de todas las variantes biológicas. Melanismo se limita a los nuevos Leopardus geoffroyi/tigrinus. Las categorías Notable/Épico/Excepcional son las existentes del juego. No se cambian probabilidades ni recompensas.

Los once dimorfismos nuevos corresponden a cóndor, carpintero negro, gallito de las rocas, pato real, ciervo de los pantanos, taruca, huemul, venado de las pampas, venado colorado y ambos pudúes. Se diferencian astas, crestas, carúnculas, tamaño o plumaje según el perfil. El venado de cola blanca conserva su configuración norteamericana.

Incluyendo reutilizadas, las láminas muestran [24 albinos](docs/sudamerica-v3230/albinos.png), [cuatro melánicos](docs/sudamerica-v3230/melanics.png), [doce pares de sexo](docs/sudamerica-v3230/dimorphism.png) y [ocho identidades con Épico/Excepcional](docs/sudamerica-v3230/epic-exceptional.png). Se validaron **357 SVG** de especies, variantes y sexos con el mismo renderizador de producción y DOMParser del navegador.

## Integración y compatibilidad

La integración de `app.js` consiste en siete bloques marcados AM-04: catálogo, investigación, reconstrucción del flag de compra, activación del continente, acceso/proyección del Atlas y dos entradas gráficas. Al retirar esos bloques se obtiene **exactamente el `app.js` publicado en 3.22.1**. No se reescriben funciones de observación, censo, velocidad, economía, Museo, expediciones o persistencia.

Se preservan los **589 registros anteriores, 69 regiones y 382 combinaciones SVG norteamericanas**, además de todos los archivos de datos, motores y laboratorio norteamericanos. Su generador excluye los bloques nuevos para conservar el snapshot anterior sin cambios. Se mantienen recetas, objetos, investigaciones anteriores y Legendarios. Los laboratorios históricos conservan sus snapshots; el laboratorio general del Atlas ahora contempla Sudamérica y la comparación histórica sigue limitada a sus cuatro continentes originales.

[Hashes protegidos](tests/fixtures/southamerica-protected-v3221.json) · [regresión móvil norteamericana](docs/sudamerica-v3230/northamerica-regression/browser-report.json).

Se conserva `gran_atlas_v05`, el formato de partida, exportación/importación y el sistema de actualización segura. Desde **3.21.2** y **3.22.1** se verifican la revisión antigua coherente hasta aceptar, el bloqueo con otra ventana abierta, el **respaldo exacto** y la conservación de región actual, avistamientos, publicaciones, variantes, inventario, prestigio, investigaciones, Museo y expediciones. El Sáhara mantiene su ID y progreso. Las regiones sudamericanas nuevas siguen sin desbloquearse por una actualización.

[Actualización desde 3.21.2](docs/sudamerica-v3230/upgrade-3.21.2-report.json) · [desde 3.22.1](docs/sudamerica-v3230/upgrade-3.22.1-report.json). Se prueban también exportación/importación de avances nuevos y reconstrucción del flag desde la compra al recargar. No se borra almacenamiento ni se fuerzan reinicios.

## Pruebas funcionales, móvil y rendimiento

**263/263 pruebas Node aprobadas**, sintaxis de los módulos y generadores reproducibles comprobados. Las fixtures originales no se cambian para hacer pasar pruebas.

- **384 encuentros efectivos**: manual y automático por cada una de las 192 presencias, usando el selector ponderado de producción. El argumento garantizado se usa solo en esa prueba para evitar el resultado aleatorio «sin avistamiento»; el juego no cambia sus probabilidades.
- Las diez regiones prueban grupos de tres especies distintas, censo manual ×3, automático ×2 y límite de 100 registros por especie/hora.
- Las 121 especies nuevas completan las cinco etapas y publican monografía una sola vez. Cuaderno y Bestiario funcionan con el catálogo de 710 especies.
- Se compra la investigación a través de su tarjeta real, se desbloquea y viaja por todas las regiones y se comprueba que no se gasta prestigio.
- Naturalistas ejecutan el `tick` real en las diez regiones. La generación de SVG no consume aleatoriedad de juego ni cambia la partida.
- Offline: juego, diez celdas sudamericanas, catorce norteamericanas y laboratorio con sus 131 especies disponibles.

En **320×640, 360×740, 390×844 y 412×915** se prueban 40 selecciones/viajes del Atlas, 40 vistas de Campo, 16 casos de variantes y cuatro casos del laboratorio. El mapa completo, región y acción quedan visibles sin desbordamiento horizontal ni solaparse con la navegación inferior. Se prueba navegación táctil tras ampliar zoom. Las capturas de variantes utilizan registros controlados de prueba; no son una modificación de las tasas de encuentro.

[Informe de navegador](docs/sudamerica-v3230/browser-report.json) · [Campo 320](docs/sudamerica-v3230/field-320.png) · [laboratorio 320](docs/sudamerica-v3230/lab-320.png) · [laboratorios cartográficos](docs/sudamerica-v3230/atlas-labs-report.json).

La regresión de Norteamérica añade **56 comprobaciones de Atlas, 56 de Campo y 16 variantes**, viajes y encuentros por las catorce regiones y uso offline, sin errores JavaScript. Sus sprites y configuraciones permanecen idénticos.

El [benchmark](docs/sudamerica-v3230/performance-report.json) usa Chromium, una sesión de CPU ×4, orden ABBA y GC antes de medir heap. Es una comparación entre catálogos distintos: 589 frente a 710 especies conocidas. La mediana de reapertura del Bestiario completo pasa de **1,94 s a 3,44 s**; este peor caso sigue teniendo un coste perceptible y no se presenta como una mejora de rendimiento. En la prueba móvil sin ralentización se midieron aproximadamente 941 ms en frío y 683 ms al reabrir. La serialización mediana del guardado completo es **1,01 ms**; el heap JavaScript recogido queda entre **6,9 y 7,4 MB** (no representa toda la memoria de Chromium). El laboratorio abre solo 32 tarjetas, permite recorrer las 131 y reutiliza la caché; recorrer sus SVG ya cacheados tarda unos **0,5 ms** en esta medición. No se añaden procesos periódicos ni trabajo nuevo al bucle de observación.

Las pruebas móviles son **emuladas en Chromium, no en un teléfono Android físico**. Se conserva Capacitor y `com.elgranatlas.naturaleza.beta314`; la versión nativa es `3.23.0`, código `32300`. El APK debug se comprueba tras generarse. Una instalación sobre un APK anterior también exige la misma firma: los runners efímeros no garantizan una clave debug común. Se conservan los plugins nativos de respaldo y las indicaciones de [README_RESPALDOS_ANDROID.md](README_RESPALDOS_ANDROID.md).

## Laboratorio sudamericano

`www/laboratorio-sudamerica-v3230.html` muestra las diez regiones y todas las especies con clase, familia, nombres, dibujo, motor, procedencia, subáreas, variantes, sexo y condición nueva/reutilizada. Permite filtrar por región, clase, familia, nombre común/científico y estado de integración, y buscar tanto el nombre original como el aceptado. Tiene tamaños 64/80/120 px y paginación 32/64/131. Su miniatura cartográfica usa la geometría real. No carga `app.js` ni lee o modifica partidas.

## Reproducción

```sh
python scripts/build-southamerica-v3230.py
node scripts/build-southamerica-lab-v3230.cjs --check
node scripts/build-atlas-lab-v3211.cjs --check
node scripts/build-northamerica-lab-v3220.cjs --check
node --test tests/*.test.cjs
node scripts/report-southamerica-v3230.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/review-southamerica-v3230.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-southamerica-browser-v3230.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-northamerica-regression-v3230.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-atlas-labs-v3230.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-pwa-upgrade-v3230.cjs
ATLAS_UPGRADE_FROM=3.21.2 NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-pwa-upgrade-v3230.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/benchmark-southamerica-v3230.cjs
```

Los scripts de navegador requieren Playwright y `/usr/bin/chromium`, fuera de las dependencias del juego. Sus comparaciones históricas necesitan `78daf2d` y `07a6f06`; las pruebas Node de CI usan fixtures y no requieren historial profundo ni conexión. La generación de datos utiliza fuentes locales verificadas y las decisiones taxonómicas archivadas, sin descargar una autoridad cambiante durante el build.

## Entrega y publicación

[Archivos modificados](docs/sudamerica-v3230/FILES.md). Se actualizan versión visible, consultas de recursos, datos, acceso, cartografía, recursos offline, service worker, laboratorio, pruebas, documentación y metadatos Android. Las rutas seguras anteriores siguen aceptadas; el cliente abre la ruta nueva para evitar HTML anterior en caché.

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/).
- [Actualizar conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3230.html).
- [Laboratorio sudamericano](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-sudamerica-v3230.html).
- [GitHub Actions](https://github.com/pruizbohle/gran-atlas-naturaleza/actions): Deploy El Gran Atlas y Android APK de prueba.
- [Release 3.23.0](https://github.com/pruizbohle/gran-atlas-naturaleza/releases/tag/v3.23.0), disponible cuando el workflow publique el APK.

El commit publicado y el resultado real de ambos workflows se verifican al cerrar la ejecución, sin dar por exitoso un workflow en curso. `scripts/verify-southamerica-apk-v3230.py` comprueba el manifiesto binario, versión/código, ID de aplicación, plugins de importación/exportación y todos los archivos web del APK descargado contra producción.
