# MEC-09D · Informe de avance (estado parcial para auditoría)

**Preview web jugable:** [MEC-09D Preview 01](https://rawcdn.githack.com/pruizbohle/gran-atlas-naturaleza/700f983cf3ac5ab145eb3c1f3d3fd0cc3802ee55/index.html) (detalles en [preview-01.md](preview-01.md)).

**Estado: EN CURSO. No está cerrada.** Este documento registra el punto exacto en que se interrumpió el trabajo, para que pueda auditarse antes de continuar.

- Rama: `mec-09d/consolidation`, creada desde `1500e42` (cierre de MEC-09C).
- Versión: V5.6.9 Beta, sin cambios. La etiqueta de compilación MEC-09D todavía no se aplica.
- No se generó ningún APK. El APK público V4.9.6 está intacto.
- No se avanzó a MEC-09E.
- No hay cambios de balance: costes, probabilidades, recompensas y duraciones siguen iguales.
- La versión pública no cambia: GitHub Pages sigue publicando `main`.
- Cambios en `www` respecto de `1500e42`:
  - Hasta MEC-09D C1 no hubo ninguno. El laboratorio `www/js/lab/dimorphism-production.js` se regeneró y después se devolvió a su contenido de `1500e42`, porque regenerarlo rompía la cadena de laboratorios históricos de pulido 3.19.9 (ver «Observaciones»).
  - Desde MEC-09D.2 hay uno solo: la consolidación de `taxonomyInfo` en `www/js/app.js`. Su resultado es idéntico para las 1000 especies. Se regeneraron `atlas-integrity.json` y la revisión de caché de `sw.js`.
- Fuera de `www`, `tests/` y `docs/` cambian:
  - `scripts/gm05-runtime.cjs`, un auxiliar de pruebas que fabrica las credenciales cartográficas de INV 3.40;
  - `scripts/build-preview-mec09d.cjs`, que construye la Preview.

## 1. Línea base (MEC-09C, `1500e42`)

1145 pruebas: 924 pasan y 221 fallan. Sin tiempos agotados. Resultado por prueba en `docs/mec09c/resultado-suite-mec09c.json`.

## 2. Resultado actual (suite completa, 133 archivos; tras la Continuación 1, commit `fc047aa`)

| | MEC-09C | Ahora |
|---|---|---|
| Pruebas | 1145 | 1169 |
| Pasan | 924 | **1169** |
| Fallan | 221 | **0** |
| Regresiones (pasaban y ahora fallan) | – | **0** |
| Tiempos agotados | 0 | 0 |

`npm run release:verify` da 302 de 302.

Las 24 pruebas nuevas en el recuento tienen dos orígenes:
- **21 pruebas que antes no llegaban a ejecutarse.** `northamerica-v3220` y `southamerica-v3230` fallaban al cargar el archivo, de modo que el recuento las contaba como un solo fallo por archivo.
- **3 pruebas nuevas** en `tests/mec09d-worker.test.cjs`.

## 3. Las 221 pruebas históricas, una por una

La matriz está en `docs/mec09d/matriz-221.csv`, con una fila por prueba: estado en MEC-09C, estado actual, categoría, justificación, equivalente vigente y fallo original. El registro razonado está en `docs/mec09d/registro-resoluciones.json`.

| Categoría | Pruebas | Estado actual |
|---|---|---|
| ARNES: el error estaba en la preparación de la prueba | 37 | pasan |
| EXPECTATIVA: actualizada por un cambio aprobado y documentado | 120 | pasan |
| SUSTITUIDA: anclada a su revisión histórica o reemplazada por una prueba vigente equivalente | 64 | pasan |
| FUNCIONAL: error real del juego | 0 | – |
| ANDROID / ENTORNO | 0 | – |
| PENDIENTE | 0 | – |
| **Total** | **221** | **221 pasan** |

**No se ha encontrado ningún error funcional del juego.** Ninguna prueba se borró. La garantía es automática: `tests/helpers/mec09d-traceability.cjs` comprueba que todos los títulos de prueba de `1500e42` siguen declarados y que cada archivo histórico modificado lleva la marca `MEC-09D` junto a cada cambio.

### Causas principales resueltas

1. **Arnés sin los datos de producción**, unas 60 pruebas: «Faltan los datos polares», «Oceania requires the existing Atlas geometry», Sudamérica ausente.
   - `tests/helpers/runtime-data.cjs` ejecuta en el contexto de prueba, y en el orden de producción, los mismos scripts que `index.html` carga antes de `app.js`.
2. **Fuentes recortadas que ya no ejecutan.**
   - Los recortes heredados eliminan el bloque `CONTINENT_RULES3300`, del que dependen las capas posteriores.
   - Las pruebas de comportamiento usan ahora el motor vigente completo.
   - Los contratos históricos de expansión se anclan a `e0db247`, donde pasan íntegros, laboratorio incluido. Es el caso de `northamerica-v3220` y `southamerica-v3230`, ambos con equivalente vigente.
3. **Credenciales cartográficas permanentes de INV 3.40.** Las pruebas de acceso continental se preparan con los mapas fabricados. Donde la prueba recorre la progresión, los mapas de Sudamérica y Oceanía se reúnen con expediciones reales.
4. **Catálogo vigente.** El juego tiene 945 especies y 113 regiones en el arnés base, y 1000 y 125 con GM-06/07.
   - Las 87 regiones terrestres históricas conservan exactamente 807 especies y 1460 presencias.
   - Polos y Océanos son capas aditivas, y sus métodos propios se prueban en `polar-v3310`, `marine-v3320`, `deep-v3330` y `abyssal-v3340`.
5. **Diferencias aprobadas, explícitas y acotadas**, reunidas en `tests/helpers/approved-diffs.cjs`. Todo lo demás se sigue exigiendo exacto.
   - El oso tibetano pasa de Melánico a Albino (`eaeb392`). Es la única diferencia en las fichas de especie.
   - INV 3.40 deja de consumir el Mapa de Asia, amplía textos de investigación y añade el campo `cartography` a las reglas continentales.
   - LEG-02 (`7cd5110`) añade la categoría Legendario solo a especies legendarias.
   - En los catálogos con clave, las entradas existentes deben ser idénticas y las nuevas son aditivas.
   - `MUSEUM_RELICTS` se rediseñó en `03bf329` (20 relictos de Campo). Aquí se comprueba su forma; el comportamiento se comprobará en `mec09d-relicts`, que está pendiente.
6. **Interfaz posterior aprobada.**
   - Tarjetas del Bestiario 3.26 y sus filtros, que son memoria de sesión.
   - Paginación de 8 en Sociedad, con seis accesos.
   - Coleccionables 3.40, láminas raster 4.0.0, `animalMarkup` y `legendaryForSpecies`.
7. **Guardas «ninguna prueba histórica cambia» de AND08 y UX07.** Se sustituyen por la trazabilidad MEC-09D. La guarda de intervalos de UX07 se conserva.
8. **Trabajador sin conexión.** El modelo de precarga `addAll` se retiró cuando el trabajador pasó a descargas verificadas con manifiesto. Se sustituye por `tests/mec09d-worker.test.cjs`, que prueba el `www/sw.js` vigente y comprueba:
   - autorización de instalación;
   - verificación SHA-256 de todo el manifiesto;
   - recursos servidos primero desde caché, sin red;
   - un script ausente nunca se sirve como HTML;
   - una navegación sin conexión sirve `index.html`;
   - un archivo alterado aborta sin dejar una revisión parcial;
   - solo se borran cachés antiguas del juego.

### Continuación 1: cierre de las 55 restantes

**Guardas de catálogo y de fuentes (7), corregidas con diferencias aprobadas explícitas, sin anclaje.** Son UX05, LOG06, MUS01, ENC01, la entrada GM06, Android GM06 y la entrada M01.
- **UX05 «fuentes de probabilidad, premios y geometría».** No pasaba en ninguna revisión, así que la investigué a fondo. Solo difieren dos cosas:
  - los módulos de logros y encargos, que MEC-08 hizo extensibles. Sus 80 logros y 24 encargos son idénticos en id, métrica, objetivo y premio;
  - `settleTrade3300` y `resolveVoyageReward`, que abonan el dinero con `earnMoney(n,…)` del libro de ingresos MEC-01. La prueba verifica literalmente que esa función suma exactamente `n`.
  - **No cambia ninguna probabilidad ni ningún premio.** La prueba hermana «misma secuencia económica real produce la misma partida» pasa sobre el motor vigente.
- **Diferencias nuevas en `approved-diffs.cjs`:**
  - `ledger`, para el abono por el libro de ingresos MEC-01;
  - `moduleCatalog`, que compara las definiciones de logros y encargos de MEC-08;
  - `relictShape`, que comprueba la forma de los 20 relictos de `03bf329`;
  - el mensaje del registro sin emoji (`df95aca`).
- **Entradas GM06 y M01.** El orden de carga se comprueba sobre la entrada pública vigente. La identidad de cada publicación (versión y metadatos) se comprueba en su revisión.
- **Android GM06.** Ningún archivo Android ni el guardado nativo cambia en MEC-09D respecto de `1500e42`. El único cambio desde GM06 es la corrección aprobada de rutas UTF-8 (`23c28cc`).

**Pruebas de identidad histórica ancladas a su revisión (48).** Comprueban huellas de bytes, versiones de publicación, paquetes, precargas o laboratorios reproducibles de una entrega concreta. Cada una se ejecuta con los archivos de la última revisión en que su garantía se verificó y pasa allí íntegra. La matriz indica la revisión y el equivalente vigente de cada una: `release:verify`, `mec09d-worker`, las pruebas de catálogo con diferencias aprobadas y `persistence-v3240` para la equivalencia de 8 horas.

**Las cuatro sin revisión, investigadas una a una:**
- **UX05:** corregida, como se describe arriba.
- **El manifiesto GM06 y los dos empaquetadores de Oceanía 3.29.** Fallaban porque sus constructores listan y copian `www` con `readdirSync`, `cpSync` y `copyFileSync`, operaciones que el anclaje no redirigía. Con el anclaje ampliado pasan en `52446ca`, `e0db247` y `e0db247`.
- **No eran fallos de Android ni de entorno.**

**Prueba sustituida con anclaje pendiente.** `stability-v3200 · offline worker` está anclada ahora a `c3aa991` y su equivalente vigente es `mec09d-worker`.

**Ajustes de arnés para que el anclaje sea efectivo en archivos mixtos:**
- `live-game.cjs` lee el motor en cada llamada en lugar de al cargarse. El contenido vigente es el mismo.
- En `gm05-art` y `stability-v3200`, las fuentes se leen dentro de la prueba anclada.

## 4. Herramientas nuevas en el repositorio

- `tests/helpers/runtime-data.cjs`: precarga los scripts de producción, opcionalmente de una revisión git.
- `tests/helpers/at-revision.cjs`: ejecuta una prueba o un archivo contra los archivos de una revisión. Redirige lecturas, listados de directorio, `stat` y copias. Con `pinFile`, `anchored` o `MEC09D_REV`, la revisión se propaga también a los procesos `node` hijos. Las escrituras nunca se redirigen al repositorio.
- `tests/helpers/approved-diffs.cjs`: diferencias aprobadas y documentadas.
- `tests/helpers/mec09d-traceability.cjs`: garantía de que no se eliminan pruebas.
- `tests/mec09d-worker.test.cjs`: trabajador sin conexión vigente.

## 5. Observaciones registradas (sin corregir; son decisiones del propietario o de etapas futuras)

- **P3.** El Arco del mar Rojo (`gm06_rojo`) tiene 7 especies, por debajo del mínimo de 8 de 3.14. La prueba distingue regiones históricas `HX-` (mínimo 8) de las demás (mínimo 7). No se añaden especies, porque MEC-09D lo prohíbe.
- **P3.** Los laboratorios `www/js/lab/*` son instantáneas históricas.
  - Regenerar `dimorphism-production.js` desde el motor vigente rompe `polish-production-v3199.js` y su prueba de 487 especies.
  - Se mantienen congelados, y sus comprobaciones `--check` quedan como candidatas a anclaje.
- **Información.** El zorro ártico en el hielo marino polar tiene hábitat por presencia (`polarPresence3310`), no por ficha. Es correcto y está cubierto por `polar-v3310`.

## 6. Estado de las secciones de la especificación MEC-09D

| Sección | Estado |
|---|---|
| §3 línea base y commit de partida | Hecho |
| §4 integridad de contenido | **Hecho** (MEC-09D.3): [integridad-contenido.md](integridad-contenido.md) |
| §5–6 las 221 pruebas | **Hecho** (Continuación 1): 221 de 221 resueltas y trazadas una por una, 0 pendientes |
| §7 consolidación de las funciones redefinidas | Parcial (MEC-09D.2): inventario actual de 98/185 clasificado; `taxonomyInfo` consolidada (9 envolturas → 1 capa) con equivalencia sobre 1000 especies; cadenas de acceso, modelo de Atlas y normalización fijadas por equivalencia con `1500e42` ([funciones-redefinidas.md](funciones-redefinidas.md)) |
| §8 guardado diferido | Hecho (MEC-09D.2): [auditoria-guardado-transacciones.md](auditoria-guardado-transacciones.md) |
| §9 auditoría transaccional | Hecho (MEC-09D.2); F10 se mantiene como política aprobada (P3) |
| §10 fuente única de verdad | **Hecho** (MEC-09D.3): [fuente-unica.md](fuente-unica.md) |
| §11–13 piezas y colecciones | **Hecho** (MEC-09D.4): [coleccionables.md](coleccionables.md), con la matriz de piezas en `piezas.csv` y la de colecciones en `colecciones.csv` |
| §14–15 legendarios, relictos y pistas | **Hecho**: §14 ([legendarios.md](legendarios.md), 30/30 por encuentro real en Campo) y §15 (`mec09d-relicts`) |
| §16 récords y comportamientos | **Hecho** (MEC-09D.3): [records-conductas.md](records-conductas.md) |
| §17 grafo de dependencias | **Hecho** (MEC-09D.3): [grafo-progresion.md](grafo-progresion.md) |
| §18 rutas, expediciones y yacimientos | **Hecho** (MEC-09D.4): [actividades.md](actividades.md) |
| §19 `AVAIL` y encargos por perfil | Pendiente |
| §20 calendario y tiempo sin conexión | Pendiente |
| §21 placas y fotografía | Pendiente |
| §22–31 correcciones de interfaz | Pendiente |
| §32 rendimiento prolongado | Pendiente |
| §33 integración entre sistemas | Pendiente |
| §34 migraciones | Parcial: las de 3.28–3.41 pasan; falta el informe |
| §35 preparación de MEC-09E (solo puntos de integración) | Pendiente |
| §36 documentación Android (sin compilar) | Pendiente; la identidad Android está verificada sin cambios respecto de `1500e42` |
| §37 coherencia de versión, PWA e integridad | Pendiente (etiqueta MEC-09D) |
| §38 capturas | Pendiente |
| §39 pruebas 1–26 | Pendiente |
| §41 entregables | Parcial: este informe, la matriz y el registro |

## 7. MEC-09D.2 (tras la Preview 01)

**Resultado de la suite completa: 1200 de 1200 pruebas pasan** (136 archivos, 0 regresiones, sin tiempos agotados). Son 31 pruebas nuevas:
- `mec09d-consolidation`: 4;
- `mec09d-persistence`: 5;
- `mec09d-relicts`: 22.

**Commits:**

| Commit | Contenido |
|---|---|
| `0a4aaef` | §7 |
| `c020467` | §8–§9 |
| `0ff982c` | §15 |

**Único cambio en el juego:** la consolidación de `taxonomyInfo` en `www/js/app.js`. Su resultado es idéntico para las 1000 especies. Se regeneraron el manifiesto de integridad y la revisión de caché del trabajador sin conexión; la versión sigue siendo 5.6.9.

**Sin cambios de balance, contenidos ni mecánicas, y sin APK.**

**La Preview 01 sigue intacta**: rama `preview-mec09d-01`, commit `700f983`.

## 8. MEC-09D.3 · Integridad zoológica y grafo de progresión

**Suite completa: 1293 de 1293 pruebas pasan** (141 archivos, 0 regresiones, sin tiempos agotados). `release:verify`: 302 de 302.

**Pruebas nuevas:**

| Archivo | Pruebas | Contenido |
|---|---|---|
| `mec09d-integrity` | 4 | 1000 especies, 125 regiones y recursos gráficos |
| `mec09d-legendaries` | 33 | Una por legendario, más generales |
| `mec09d-records` | 46 | 25 récords y 20 conductas, más una general |
| `mec09d-graph` | 5 | Grafo de 1230 nodos |
| `mec09d-sot` | 5 | Fuente única |

**Commits:**

| Commit | Contenido |
|---|---|
| `c43d7ff` | §4 y §14 |
| `52d6c5c` | §16 |
| `ee182d4` | §17 |
| `14bb119` | §10 |

**Clasificación de lo encontrado:**

- **Errores funcionales:** ninguno.
- **Observaciones de contenido (decisión del propietario, sin cambios):**
  - **O1.** El relicto «Cocodrilo enano africano» es la misma especie que una ficha ordinaria del Bestiario en su misma región.
  - **O2.** El Arco del mar Rojo tiene 7 especies, una menos que el mínimo histórico de 8.
- **Observaciones artísticas:** ninguna. No faltan láminas normales, de pigmento, de sexo, legendarias ni de relicto.
- **Reservado para BAL-01/BAL-02:**
  - rareza efectiva de los legendarios (0,0001 por observación);
  - récords de profundidad e inmersión con alcance del umbral entre 0,10 % y 0,90 % por medición;
  - valores provisionales de las recompensas de MEC-07;
  - tiempos de progresión del camino crítico (16 pasos hasta las fosas abisales).
- **Mejora de rigor:** la fuente cartográfica del estudio «cálculo de derrotas» se resuelve a su investigación real, en lugar del seudonodo que MEC-09B daba por alcanzado.

No hubo cambios en el juego en MEC-09D.3: solo pruebas, el script de análisis y documentación.

## 9. MEC-09D.4 · Coleccionables, comercio y expediciones

**Resultado de la suite completa: 1333 de 1333 pruebas pasan** (143 archivos, 0 regresiones). `release:verify`: 302 de 302.

**Pruebas nuevas:**
- `mec09d-collectibles` (6): las 431 piezas obtenidas por la selección real del motor; 32 colecciones completables; duplicados y excedentes; persistencia.
- `mec09d-activities` (34): 19 expediciones, 4 rutas y 10 yacimientos uno por uno.

**Commits:**

| Commit | Contenido |
|---|---|
| `c6e4f39` | §11–§13 |
| `c338a94` | §18 y registro de asuntos para BAL |

**Clasificación de lo encontrado:**
- **Errores funcionales:** ninguno.
- **Referencias rotas:** ninguna.
- **Fuentes no operativas:** ninguna.
- **Correcciones:** ninguna necesaria en el juego.
- **Para BAL:** todo lo encontrado se reúne en [reservado-bal.md](reservado-bal.md): rotación lenta de la Caravana, fuentes únicas, rendimiento desigual de rutas y expediciones, colecciones lentas.
- **Decisiones del propietario:** siguen pendientes O1 y O2 (ver §4).

No hubo cambios en el juego: solo pruebas, scripts de análisis y documentación.

## 10. Próximo paso propuesto (a la espera de autorización)

Quedan:
- **§19–§21:** encargos y `AVAIL`, calendario, fotografía;
- **§22–§31:** correcciones de interfaz;
- **§32–§39:** rendimiento, integración entre sistemas, migraciones, preparación de MEC-09E, documentación Android, etiqueta de versión y capturas.
