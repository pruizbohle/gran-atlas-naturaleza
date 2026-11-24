# MEC-05 · Museo evolutivo, gabinetes y exposiciones funcionales → V5.6.5 Beta

Rama `mec-05/v5.6.5-beta`, creada desde `mec-04/v5.6.4-beta` (`96fc9a5`). No se fusiona a `main`. **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó.

El Museo conserva todas sus funciones históricas y gana un sistema de especialización:

- Cada uno de los cinco gabinetes de coleccionables da beneficios propios, reales y limitados en actividades del Atlas.
- Las 32 colecciones forman exposiciones temáticas con cuatro hitos.
- La Sociedad controla las ampliaciones IV y V.

Las bonificaciones se **derivan en cada consulta de las piezas expuestas ahora**: no se guardan ni se acumulan, y desaparecen al retirar las piezas. **Todos los valores son provisionales** (BAL-01).

## 1. Correcciones de MEC-04

| Observación | Corrección |
| --- | --- |
| El indicador de investigaciones contaba todo `state.purchases` | Ahora cuenta solo los nodos de `RESEARCH_NODES`. Las compras, los encargos y otros registros no cuentan |
| Regiones: se contaban las desbloqueadas | Hay cuatro estados: **desbloqueada** (`regionUnlocked`), **visitada** (`regionsVisited`), **explorada** (visitada y con alguna especie descubierta) y **completada** (todas sus especies descubiertas). La Sociedad usa las **visitadas**; la métrica pasa a llamarse «Regiones visitadas». La pestaña Rango muestra los cuatro recuentos. Los rangos ya reconocidos no se revocan (prueba 2) |
| Auditoría de dependencias | Ampliada; ver la sección 2 |
| 113 regiones en la auditoría y 125 en los metadatos | El arnés de pruebas histórico no carga los catálogos GM-06/GM-07 que sí carga `www/index.html`. GM-06 añade **12 regiones** (113 + 12 = 125) y, junto con GM-07, las 55 especies restantes (945 → 1.000). El arnés tiene ahora la opción `full`, que los carga, y la auditoría se ejecuta con las dos configuraciones |

## 2. Auditoría de dependencias

`tests/helpers/mec04-audit.cjs` conserva el verificador de MEC-04 y documenta sus supuestos sintéticos en el propio código y en el resultado (`assumptions`):

| | Supuesto | Qué se exige como prueba real |
| --- | --- | --- |
| S1 | Dinero y conocimiento suficientes para pagar costos | Nunca cuentan como prueba de ingresos |
| S2 | No se simula la duración de los ingresos ni de las expediciones | Al menos una fuente **renovable** de ingresos ejecutable en ese estado (premios de expediciones, monografías, ingreso del Museo) y una expedición disponible. Ya no se usa «ingresos infinitos» sin más |
| S3 | Monografías y prestigio | Solo especies avistables: `eligibleSpecies` en algún hábitat, hora y estación de su región, o por sondeo en regiones profundas y abisales con su investigación comprada. +1 de prestigio por monografía; no se cuentan otras fuentes de prestigio |
| S4 | Mapas y preparaciones | Cada material base necesita una fuente real accesible en ese estado: botín de una expedición disponible, capa cartográfica de una ruta disponible, mercado con Astillero, Gabinete de especímenes de una especie accesible o receta con materiales accesibles. Sin fuente, la fabricación queda bloqueada y se informa (`blockedMaterials`) |
| S5 | Coleccionables | Una actividad ejecutable que los entregue. El comercio se comprueba generando ofertas reales del mercado durante 40 periodos, con el rango y la Caravana de ese estado |
| S6 | Regiones | Se visitan con `setRegion` al desbloquearse |

**Resultados** (`auditoria-dependencias.json`):

| | Arnés histórico | Catálogo completo (`full`) |
| --- | --- | --- |
| Rango final | 20 | 20 |
| Regiones visitadas | 113 / 113 | 125 / 125 |
| Investigaciones | 57 / 57 | 57 / 57 |
| Monografías posibles | 945 / 945 | 1.000 / 1.000 |
| Piezas obtenibles | 431 / 431 | 431 / 431 |
| Materiales sin fuente | ninguno | ninguno |
| Bloqueos | ninguno | ninguno |

- **Rango 10 (una colección completa)**: la primera colección completable es «Instrumentos de exploración», ya en el **rango 1** con instalaciones en nivel II. Al llegar al rango 9 se pueden completar las 32 colecciones, y la auditoría guarda la fuente ejecutable de cada pieza de las tres primeras.
- **Mapas**: los fragmentos de Asia y África salen del botín de las rutas europeas. Los de Sudamérica, Oceanía y Polos salen de su capa cartográfica, tras la investigación previa. El mapa del mundo se hace con su receta, que no consume mapas.
- **Sin dependencias circulares nuevas**: ningún rango exige el Museo, y el Museo IV–V exige rango.

## 3. Configuración central del Museo

`www/js/mec05-museum.js` (`AtlasMEC05`) reúne:

- los niveles (rango y referencia de arte);
- los gabinetes;
- los puntos por rareza (Común 1, Poco común 1,5, Raro 2,5, Muy raro 4);
- las actividades con su límite y los beneficios;
- los hitos temáticos;
- las referencias artísticas;
- la clasificación de las salas;
- los campos preparados para artefactos.

Los costos, el prestigio y las capacidades siguen en `MUSEUM_LEVELS` (app.js, MEC-01), sin cambios.

| Sala | Motor (sin duplicar) | Bonificación |
| --- | --- | --- |
| Exposiciones zoológicas | `state.museum.exhibits`, `exhibitIncome` | Ingreso histórico por rareza, sin cambios |
| Gabinetes de coleccionables | `state.museum.cabinets` (MEC-01) | **Nueva**: por gabinete y por temáticas |
| Fósiles y reconstrucciones | `state.museum.collections`, `MUSEUM_FOSSIL_RECIPES` | Histórica: `MUSEUM_FOSSIL_SETS` sobre el ingreso |
| Relictos | `state.museum.relicts`, `MUSEUM_RELICTS` | Histórica: `MUSEUM_RELICT_SETS` sobre el ingreso; hitos de conocimiento |
| Artefactos científicos | `state.museum.collections` (artefactos) | Ninguna nueva; MEC-06 |
| Proyectos curatoriales | `state.museum.curation` | Histórica: +1 % de ingreso por punto (máx. 20) |

## 4. Niveles del Museo

| Nivel | Nombre | Costo | Prestigio | Animales | Piezas por gabinete | Rango de Sociedad | Arte |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Galería de fauna | £0 | 0 | 3 | 4 | — | `museum-level-1` |
| 2 | Sala de historia natural | £300 | 2 | 7 | 8 | — | `museum-level-2` |
| 3 | Gran galería zoológica | £900 | 5 | 12 | 12 | — | `museum-level-3` |
| 4 | Pabellón de ciencias | £50.000 | 60 | 18 | 16 | 11 · Curador | `museum-level-4` |
| 5 | Gabinete de maravillas | £500.000 | 150 | 25 | 20 | 14 · Miembro del Consejo | `museum-level-5` |

- Los niveles I–III no exigen rango; los requisitos de rango son configurables (`AtlasMEC05.LEVELS`).
- La ampliación comprueba rango, dinero y prestigio y se ejecuta en una transacción atómica: si el guardado falla, no cambia nada.
- Las partidas que ya tenían IV o V los conservan, con sus capacidades y exposiciones.
- MEC-04 queda conectado: `museum:ampliaciones` (rango 11) y el nuevo `museum:maravillas` (rango 14), con `MUSEUM_RANKS.active = true`.

## 5. Gabinetes y bonificaciones

**Modelo.** El aporte de cada beneficio se calcula así:

- **Piezas**: puntos de rareza de las piezas expuestas ahora × valor por punto, hasta su máximo.
- **Temáticas**: suma de los hitos activos de las colecciones del gabinete × factor temático, también hasta su máximo.

Las dos partes se suman. Dentro de una actividad, los beneficios se **suman** y el total se limita con el tope de la actividad. Nada se multiplica entre sí, y cada pieza cuenta una vez: los duplicados no suman.

El resultado es un porcentaje aditivo sobre el valor base de la actividad: probabilidad × (1 + total), conocimiento × total como extra, o precio × (1 − total).

| Gabinete | Beneficio (id) | Actividad | Valor por punto | Máx. por piezas | Factor temático |
| --- | --- | --- | --- | --- | --- |
| Botánica | `botanica-campo` | Campo · hallazgos ambientales botánicos | 2 % | 30 % | ×1 |
| Botánica | `botanica-expedicion` | Expedición botánica · coleccionables | 1,5 % | 20 % | ×1 |
| Geología | `geologia-prospeccion` | Prospección geológica · hallazgos | 1,5 % | 20 % | ×1 |
| Geología | `geologia-especializada` | Prospección especializada · hallazgos | 1 % | 15 % | ×1 |
| Oceanografía | `oceanografia-campo` | Campo · hallazgos ambientales marinos | 2 % | 30 % | ×1 |
| Oceanografía | `oceanografia-expedicion` | Expedición oceanográfica · coleccionables | 1,5 % | 20 % | ×1 |
| Historia | `historia-comercio` | Caravana · compra de piezas del gabinete de Historia | 0,5 % | 10 % | ×0.25 |
| Historia | `historia-arqueologia` | Expedición arqueológica · coleccionables | 1,5 % | 20 % | ×1 |
| Historia natural y exploración | `exploracion-conocimiento-exp` | Conocimiento de expediciones | 1 % | 15 % | ×1 |
| Historia natural y exploración | `exploracion-conocimiento-pro` | Conocimiento de prospecciones | 1 % | 15 % | ×1 |
| Historia natural y exploración | `exploracion-reconocimiento` | Reconocimiento naturalista · coleccionables | 1 % | 15 % | ×1 |

### Matriz de bonificaciones

| Actividad (clave) | Tipo | Valor base | Límite total | Gabinetes | Se fija |
| --- | --- | --- | --- | --- | --- |
| Campo · hallazgos ambientales botánicos (`campo:ambiental:botanica`) | probabilidad | tasa ambiental (MEC-03) | 60 % | Botánica | al realizarse |
| Campo · hallazgos ambientales marinos (`campo:ambiental:oceanografia`) | probabilidad | tasa ambiental (MEC-03) | 60 % | Oceanografía | al realizarse |
| Expedición botánica · coleccionables (`expedicion:botanica`) | probabilidad | tirada de la modalidad | 40 % | Botánica | al iniciar (job.mec.museum) |
| Expedición oceanográfica · coleccionables (`expedicion:oceanografica`) | probabilidad | tirada de la modalidad | 40 % | Oceanografía | al iniciar (job.mec.museum) |
| Expedición arqueológica · coleccionables (`expedicion:arqueologica`) | probabilidad | tirada de la modalidad | 40 % | Historia | al iniciar (job.mec.museum) |
| Reconocimiento naturalista · coleccionables (`expedicion:reconocimiento`) | probabilidad | tirada de la modalidad | 40 % | Historia natural y exploración | al iniciar (job.mec.museum) |
| Prospección geológica · hallazgos (`prospeccion:geologica`) | probabilidad | tirada de la prospección | 40 % | Geología | al iniciar (job.mec.museum) |
| Prospección especializada · hallazgos (`prospeccion:especializada`) | probabilidad | tirada de la prospección | 40 % | Geología | al iniciar (job.mec.museum) |
| Caravana · compra de piezas del gabinete de Historia (`comercio:compra-historia`) | descuento | precio de la oferta | 15 % | Historia | al realizarse |
| Conocimiento de expediciones (`conocimiento:expediciones`) | conocimiento | conocimiento de la expedición | 25 % | Historia natural y exploración | al iniciar (job.mec.museum) |
| Conocimiento de prospecciones (`conocimiento:prospecciones`) | conocimiento | conocimiento de la prospección | 25 % | Historia natural y exploración | al iniciar (job.mec.museum) |

**Capas independientes.** `AtlasMEC05Actions.breakdown(actividad)` devuelve el desglose por capas (equipamiento, investigaciones, Campamento, Sociedad y Museo). Solo la capa del Museo es nueva; las demás se describen tal como las aplica hoy su propio motor y no se mezclan.

**Cómo actúa cada beneficio:**

- **Campo ambiental**: sigue habiendo **una sola tirada**. Por debajo de la tasa base, la pieza sale del pozo completo, como antes. En las bandas adicionales (base × bonificación), sale de una pieza del gabinete. No cambian las probabilidades de materiales animales, legendarios, variantes ni relictos.
- **Expediciones y prospecciones**: se aplica la instantánea fijada al iniciar (`job.mec.museum`).
- **Comercio**: el descuento se aplica al comprar y se muestra en la confirmación. Un descuento no es un ingreso.
- **Política del campo**: las búsquedas manuales y automáticas (también los tramos offline pendientes) usan los beneficios vigentes al procesarse.
- **Trabajos anteriores**: las expediciones y prospecciones en curso al migrar quedan marcadas sin bonificación (`migrated: true`).

## 6. Exposiciones temáticas

Se distingue entre colección **descubierta** (registro permanente de MEC-01), **poseída** ahora y **expuesta** ahora. El modelo está en `AtlasMEC05Actions.collections()`.

- Una exposición temática exige las piezas físicamente expuestas.
- Cada colección aporta solo su hito más alto, y solo mientras se mantiene.
- El primer hito cabe siempre en un gabinete de nivel I (4 piezas). Si el siguiente no cabe con la capacidad actual, la interfaz lo indica.
- Reorganizar la exposición no da recompensas permanentes.

Hitos: Conjunto inicial (+3 %) · Exposición parcial (+5 %) · Exposición avanzada (+8 %) · Colección completa exhibida (+12 %).

| Colección | Gabinete | Piezas | Inicial | Parcial | Avanzada | Completa |
| --- | --- | --- | --- | --- | --- | --- |
| Herbario del mundo | Botánica | 20 | 3 | 8 | 14 | 20 |
| Semillas extraordinarias | Botánica | 12 | 3 | 5 | 9 | 12 |
| Pigmentos del mundo | Botánica | 12 | 3 | 5 | 9 | 12 |
| Piedras preciosas | Geología | 20 | 3 | 8 | 14 | 20 |
| Minerales extraordinarios | Geología | 12 | 3 | 5 | 9 | 12 |
| Ámbar y resinas fósiles | Geología | 12 | 3 | 5 | 9 | 12 |
| Meteoritos | Geología | 12 | 3 | 5 | 9 | 12 |
| Los siete mares | Oceanografía | 7 | 3 | 4 | 5 | 7 |
| Secretos de Atlántida | Oceanografía | 5 | 3 | 4 | — | 5 |
| Conchas de los océanos | Oceanografía | 20 | 3 | 8 | 14 | 20 |
| Curiosidades de marineros | Oceanografía | 12 | 3 | 5 | 9 | 12 |
| Corales del mundo | Oceanografía | 20 | 3 | 8 | 14 | 20 |
| Numismática | Historia | 20 | 3 | 8 | 14 | 20 |
| Objetos de civilizaciones | Historia | 20 | 3 | 8 | 14 | 20 |
| Armería histórica | Historia | 12 | 3 | 5 | 9 | 12 |
| Máscaras y figurillas | Historia | 12 | 3 | 5 | 9 | 12 |
| Cartografía antigua | Historia | 12 | 3 | 5 | 9 | 12 |
| Huevos de aves | Historia natural y exploración | 20 | 3 | 8 | 14 | 20 |
| Fósiles menores | Historia natural y exploración | 12 | 3 | 5 | 9 | 12 |
| Instrumentos de exploración | Historia natural y exploración | 12 | 3 | 5 | 9 | 12 |
| Gabinete de maravillas | Historia natural y exploración | 12 | 3 | 5 | 9 | 12 |
| Hojas y frondas del mundo | Botánica | 12 | 3 | 5 | 9 | 12 |
| Rocas y formaciones geológicas | Geología | 12 | 3 | 5 | 9 | 12 |
| Algas del mundo | Oceanografía | 12 | 3 | 5 | 9 | 12 |
| Medallas y condecoraciones históricas | Historia | 12 | 3 | 5 | 9 | 12 |
| Arquitecturas animales | Historia natural y exploración | 12 | 3 | 5 | 9 | 12 |
| Maderas del mundo | Botánica | 12 | 3 | 5 | 9 | 12 |
| Pteridomanía | Botánica | 12 | 3 | 5 | 9 | 12 |
| Metales raros | Geología | 12 | 3 | 5 | 9 | 12 |
| Siete maravillas antiguas | Historia | 7 | 3 | 4 | 5 | 7 |
| Imágenes daguerrotipadas | Historia natural y exploración | 20 | 3 | 8 | 14 | 20 |
| Rarezas y mitos | Historia natural y exploración | 12 | 3 | 5 | 9 | 12 |

## 7. Ingresos y funcionamiento offline

- El ingreso zoológico mantiene su fórmula (`museumRate`). Se presenta desglosado:
  - ingreso base;
  - bonificaciones existentes: investigación, medallón, conjuntos fósiles, curaduría y conjuntos de relictos;
  - bonificaciones nuevas: ninguna;
  - total por segundo y proyección por hora;
  - límite offline de 8 h.
- MEC-05 no añade ingresos nuevos; todo sigue pasando por `earnMoney`.
- Pruebas (18):
  - las reglas en línea y offline son equivalentes;
  - el límite de 8 h se respeta;
  - recargar no vuelve a pagar;
  - retirar una exposición cambia los ingresos futuros, no los históricos.

## 8. Fósiles, relictos y artefactos

- **Fósiles**: se distinguen la reconstrucción obtenida o catalogada, la exhibida (la galería muestra toda reconstrucción catalogada), el conjunto completo, la bonificación histórica y la nueva (0). El motor nuevo no las vuelve a contar. No hay recetas ni dinosaurios nuevos.
- **Relictos**: no cambian. Siguen descubriéndose en el campo con sus indicios y mantienen sus conjuntos e hitos. No se entregan como recompensa temática y su probabilidad no cambia.
- **Artefactos**: 20 catalogables (5 históricos y 15 de la beta). Llevan los campos `catalogued`, `exhibited`, `instrument`, `equipment` y `futureFunction`, preparados para MEC-06. No se tocan recetas ni artefactos adquiridos.

## 9. Interfaz

- **Exposiciones**: arriba, la vista general del Museo, con nivel, capacidad zoológica, capacidad de cada gabinete, ingreso pasivo desglosado, bonificaciones activas, temáticas activas, próxima ampliación y requisitos pendientes. El botón de ampliar indica el rango y queda desactivado si falta.
- **Gabinetes** (sala `samples`, rotulada «Gabinetes» desde la 5.6.0): arriba, un panel «Gabinetes de coleccionables · efectos». Cada gabinete muestra piezas disponibles, expuestas, capacidad usada, bonificación actual, conjuntos temáticos y progreso al siguiente. Debajo siguen el selector con búsqueda, filtros, paginación y ventanas emergentes.
- **Vista previa**: la ficha de cada pieza muestra el efecto real de exponerla o retirarla antes de hacerlo.
- **Sexta pestaña**: se evaluó y **no se añadió**. La sala ya se llama «Gabinetes» y una sexta pestaña rompería el contrato histórico de cinco salas, además de saturar la barra móvil de 412 px.
- Comprobado en Chrome sin interfaz (412 × 900), sin errores de consola.

## 10. Referencias artísticas

Todas son estables y van sin archivo (`file: null`); se mantienen las ilustraciones y los marcadores actuales:

- Niveles: `museum-level-1` … `museum-level-5`.
- Gabinetes: `cabinet-botanica`, `cabinet-geologia`, `cabinet-oceanografia`, `cabinet-historia` y `cabinet-exploracion`.
- Salas: `museum-vitrine-zoologica`, `museum-exhibit-fossil`, `museum-exhibit-relict` y `museum-exhibit-artifact`.
- Temáticas: `theme-inicial`, `theme-parcial`, `theme-avanzada` y `theme-completa`.

## 11. Guardado y migración

- Se conservan:
  - el nivel del Museo, las especies exhibidas y las reconstrucciones;
  - los artefactos, los relictos, los gabinetes y sus reservas;
  - las colecciones descubiertas, las bonificaciones históricas y los proyectos curatoriales;
  - los ingresos.
- **No se guarda ningún modificador derivado**: al cargar o importar, las bonificaciones se reconstruyen desde `state.museum.cabinets` (prueba 21). Solo los trabajos guardan su instantánea, `job.mec.museum`.
- La ampliación es atómica. Las piezas expuestas siguen protegidas contra venta, trueque, solicitudes y consumo (prueba 9).
- Se validaron partidas nuevas, partidas con IV–V sin rango, partidas de MEC-04 con trabajos sin instantánea y exportación e importación.

## 12. Pruebas

`tests/mec05.test.cjs`: **22 de 22 aprobadas**, con efectos reales en los motores.

| Punto | Comprobación |
| --- | --- |
| 1 | Las compras y encargos falsos no cuentan; una investigación real sí |
| 2 | Desbloquear no cuenta y visitar sí; cuatro estados de región; un rango 9 previo no se revoca |
| 3, 22 | Auditoría con los dos catálogos: rango 20, todo visitable y publicable, materiales con fuente, ingresos renovables, colección antes del rango 10; sin ciclos |
| 4 | Cinco niveles con capacidades, costos y prestigio históricos |
| 5 | I–III sin rango; IV con rango 11; V con rango 14; dinero y prestigio; vista bloqueada |
| 6 | Partida con nivel V y rango 1: conserva nivel, capacidades y exposiciones |
| 7 | `museumRate` intacta y desglose coherente; los gabinetes no cambian el ingreso |
| 8 | Capacidad de cada gabinete en los cinco niveles |
| 9 | Pieza expuesta: no se vende, no se consume, no entra en trueques |
| 10 | Cada gabinete cambia solo sus actividades; cinco beneficios distintos |
| 11 | La banda botánica convierte una tirada fallida en un hallazgo botánico sin cambiar la base; la prospección geológica acierta con la misma tirada; hay conocimiento extra; descuento real sin ingreso; conocimiento extra en la expedición |
| 12 | Retirar desactiva; la vista previa coincide con el resultado |
| 13 | Duplicados, recálculo y suma con límite sin multiplicar; instantánea igual al valor vigente; capas |
| 14 | Umbrales para las 32 colecciones; los cuatro hitos; retirar anula la temática; aviso de capacidad |
| 15 | Descubierta, poseída y expuesta; el registro permanece tras quedarse sin piezas |
| 16 | Cinco ciclos de exponer y retirar sin recompensas; animal retirado y reexpuesto sin reembolso ni premio |
| 17 | Bonificaciones fósiles y de relictos una sola vez; 20 artefactos con sus campos |
| 18 | Offline con límite de 8 h, sin doble pago, igual en línea; retirar no toca el historial |
| 19 | La prospección usa la instantánea tras retirar; una expedición sin Museo no gana después; trabajos migrados sin bonificación |
| 20 | Fallo de guardado al ampliar: sin cambios; reintento correcto |
| 21 | Exportar e importar reconstruye las bonificaciones; instantáneas conservadas |
| 23 | Invariantes de MEC-01 a MEC-04, 125 regiones y 1.000 especies con el catálogo completo, versión, caché, `release:verify` y sin `android/` |

### Suite completa (línea base MEC-04 frente a MEC-05)

| | MEC-04 `96fc9a5` | MEC-05 |
| --- | --- | --- |
| Pruebas | 938 | 960 (+22 de MEC-05) |
| Aprobadas | 722 | 744 |
| Fallidas | 216 | 216 (las mismas, aserciones históricas preexistentes) |
| Regresiones | — | **0** |
| Archivo que agota los 600 s | `global-v3240` | `global-v3240` |

**Cambios en pruebas existentes** (ninguna se eliminó ni se debilitó):
- MEC-04:
  - El auxiliar `meet()` marca también como visitadas las regiones que exige un rango, por el cambio de indicador.
  - La prueba 11/16 comprueba ahora que la conexión con el Museo está activa; antes esperaba «preparada».
  - La prueba 20 compara la versión con `package.json` en lugar del literal 5.6.4.
- MEC-04 (auditoría, prueba 13): el verificador ampliado exige pruebas reales. Sus aserciones no cambian.
- Pruebas de MEC-01, MEC-02, MEC-03 y MEC-04: 14/14, 12/12, 17/17 y 15/15.

Resultados por prueba: [`linea-base-mec04.json`](linea-base-mec04.json) y [`resultado.json`](resultado.json). `release:verify` incluye `tests/mec05.test.cjs`.

## 13. Pendientes

- **BAL-01**: valores por punto, límites, hitos temáticos, descuento y rangos IV–V.
- **MEC-06**: funciones individuales de los artefactos (campos ya preparados) y su relación con el Taller.
- **Arte**: niveles, gabinetes, vitrinas e indicadores temáticos (referencias estables).
- **Encargos históricos del gabinete de Historia**: no se implementaron; ya tiene dos beneficios reales (comercio y arqueología).

## 14. Confirmación

No se generó ni se publicó ninguna APK, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó. No se modificaron ilustraciones zoológicas, variantes pigmentarias ni el fondo del Campamento. No se eliminaron fósiles, artefactos ni mecánicas, y no se añadieron ayudas de desarrollo a la progresión. El desarrollo se detiene aquí para la auditoría externa; no se avanzó a MEC-06.
