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

## 2. Resultado actual (suite completa, 133 archivos)

| | MEC-09C | Ahora |
|---|---|---|
| Pruebas | 1145 | 1169 |
| Pasan | 924 | 1114 |
| Fallan | 221 | 55 |
| Regresiones (pasaban y ahora fallan) | – | **0** |
| Tiempos agotados | 0 | 0 |

`npm run release:verify` da 302 de 302.

Las 24 pruebas nuevas en el recuento tienen dos orígenes:
- **21 pruebas que antes no llegaban a ejecutarse.** `northamerica-v3220` y `southamerica-v3230` fallaban al cargar el archivo, de modo que el recuento las contaba como un solo fallo por archivo.
- **3 pruebas nuevas** en `tests/mec09d-worker.test.cjs`.

## 3. Las 221 pruebas históricas, una por una

La matriz está en `docs/mec09d/matriz-221.csv`, con una fila por prueba: estado en MEC-09C, estado actual, categoría, justificación, equivalente vigente y fallo original. El registro razonado está en `docs/mec09d/registro-resoluciones.json`.

| Categoría | Pasan ahora | Siguen fallando |
|---|---|---|
| ARNES: el error estaba en la preparación de la prueba | 37 | 0 |
| EXPECTATIVA: actualizada por un cambio aprobado y documentado | 114 | 0 |
| SUSTITUIDA: anclada a su revisión histórica, o reemplazada por una prueba vigente | 15 | 1 |
| PENDIENTE: revisión individual sin terminar | 0 | 54 |
| FUNCIONAL: error real del juego | 0 | 0 |
| **Total** | **166** | **55** |

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

### Las 55 que siguen fallando

- **54 pendientes de revisión individual.** Casi todas son huellas de publicación de versiones anteriores, por ejemplo nombres de caché `gran-atlas-v3.30.0-…`, bytes de módulos o laboratorios reproducibles.
  - 50 pasan en una revisión histórica concreta, indicada en la matriz: son candidatas a anclaje.
  - El anclaje se aplicará solo a pruebas de huella. Las que resulten ser de comportamiento se corregirán.
  - 4 no pasan en ninguna revisión probada. Habrá que estudiarlas una a una; podrían quedar como ANDROID o ENTORNO.
- **1 sustituida, con su anclaje sin aplicar todavía:** `stability-v3200 · offline worker`. Su equivalente ya pasa.

## 4. Herramientas nuevas en el repositorio

- `tests/helpers/runtime-data.cjs`: precarga los scripts de producción, opcionalmente de una revisión git.
- `tests/helpers/at-revision.cjs`: ejecuta una prueba o un archivo contra los archivos de una revisión. Con `pinFile`, `anchored` o `MEC09D_REV`, la revisión se propaga también a los procesos `node` hijos.
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
| §5–6 las 221 pruebas | Parcial: 166 resueltas y 55 pendientes, matriz entregada |
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

1. Terminar las 55 pruebas restantes: anclar las de huella y corregir las de comportamiento.
2. Escribir `mec09d-relicts`.
3. Continuar con §7–§39 en el orden de prioridad P0–P3.
