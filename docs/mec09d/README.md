# MEC-09D · Informe de avance (estado parcial para auditoría)

**Estado: EN CURSO. No está cerrada.** Este documento registra el punto exacto en que se interrumpió el trabajo, para que pueda auditarse antes de continuar.

- Rama: `mec-09d/consolidation`, creada desde `1500e42` (cierre de MEC-09C).
- Versión: V5.6.9 Beta, sin cambios. La etiqueta de compilación MEC-09D todavía no se aplica.
- No se generó ningún APK. El APK público V4.9.6 está intacto.
- No se avanzó a MEC-09E.
- No hay cambios de balance: costes, probabilidades, recompensas y duraciones siguen iguales.
- No hay cambios en el juego publicado. `git diff 1500e42 -- www` está vacío.
  - El único archivo de `www` que se tocó, el laboratorio `www/js/lab/dimorphism-production.js`, se regeneró y después se devolvió a su contenido de `1500e42`. Regenerarlo rompía la cadena de laboratorios históricos de pulido 3.19.9 (ver «Observaciones»).
- Fuera de `tests/` y `docs/` cambia una sola línea: `scripts/gm05-runtime.cjs`. Es un auxiliar de pruebas que fabrica las credenciales cartográficas de INV 3.40 en la partida avanzada sintética.

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
| §4 integridad de contenido | Parcial: recuentos verificados en el arnés (1000/125, 30 legendarios, 20 relictos); falta el informe |
| §5–6 las 221 pruebas | **Hecho** (Continuación 1): 221 de 221 resueltas y trazadas una por una, 0 pendientes |
| §7 consolidación de las 96 funciones redefinidas | Pendiente |
| §8 guardado diferido | Pendiente |
| §9 auditoría transaccional | Pendiente |
| §10 fuente única de verdad | Pendiente |
| §11–13 431 piezas y 32 colecciones | Pendiente |
| §14–15 legendarios, relictos y pistas | Pendiente (falta `mec09d-relicts`) |
| §16 récords y comportamientos | Pendiente |
| §17 grafo de dependencias | Pendiente |
| §18 rutas, expediciones y yacimientos | Pendiente |
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

## 7. Próximo paso propuesto (a la espera de autorización)

1. Escribir `mec09d-relicts`.
2. Continuar con §7–§39 en el orden de prioridad P0–P3.
