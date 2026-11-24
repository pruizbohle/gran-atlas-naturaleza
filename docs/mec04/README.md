# MEC-04 · Sociedad científica, rangos y desbloqueos → V5.6.4 Beta

Rama `mec-04/v5.6.4-beta`, creada desde `mec-03/v5.6.3-beta` (`469ce7c`). No se fusiona a `main`. **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de Android y no se tocó la APK pública autorizada.

La Sociedad tiene ahora **20 rangos** con requisitos variados (prestigio, especies, monografías, coleccionables, expediciones, investigaciones, ingresos históricos, regiones y colecciones), ascensos explícitos y permanentes, recompensas únicas y desbloqueos reales: niveles IV y V del Campamento, ofertas de la Caravana, encargos y cuatro categorías de financiación. Se corrigen además las observaciones de la auditoría de MEC-03 y se amplía la geografía de las actividades. **Todos los valores son provisionales** y quedan para BAL-01.

## 1. Correcciones de MEC-03

| Observación | Corrección |
| --- | --- |
| Hallazgos ambientales solo con avistamiento | La tirada ambiental se hace también en las búsquedas sin avistamiento. Hay **una tirada como máximo por búsqueda**, en cualquiera de las dos ramas. Una búsqueda automática sin fauna disponible no tira |
| Contexto ambiental | Hook `ambientContextMEC04(origen, contexto)`. Búsqueda manual: región actual y **bioma seleccionado**. Automática: región del tramo y todos sus biomas, como el equipo automático. Procesamiento offline: **la región histórica de cada tramo**, no la actual |
| Ofertas regionales sin piezas «Mundial» | Los comerciantes regionales ofrecen cualquier pieza comprable en su continente (`sources.comercio.continents`), incluidas las «Mundial» |
| Piezas comercializables que nunca aparecían | La prueba 4 recorre 500 días de mercado con la Caravana V: **las 224 piezas comercializables aparecen en ofertas reales** |
| Identidad de las ofertas | Las ofertas se guardan con su id (`P<periodo>-…`) y no se regeneran al recargar; las extraordinarias usan ids `P<periodo>-X-n` |
| Accesibilidad en cuatro niveles | Prueba 5: (1) cada pieza tiene fuente configurada; (2) está en un conjunto de recompensas; (3) es obtenible con las reglas del motor en una partida avanzada; (4) es alcanzable desde una partida nueva sin ayudas ni dependencias circulares |

## 2. Geografía: origen, hallazgo y compra

Cada pieza separa ahora tres datos, también en la matriz CSV (`docs/mec03/matriz-coleccionables.csv`, generada por `scripts/build-mec03-catalog.cjs`, columnas nuevas `lugar_de_origen`, `antes_mec04`, `se_encuentra_en` y `se_compra_en`):

- **Origen real** (`origin`, `place`): de dónde procede la pieza.
- **Dónde se encuentra** (`findIn`): continentes de campo, expediciones, excavaciones y prospecciones. Las piezas marinas indopacíficas se encuentran también en Asia y Oceanía.
- **Dónde se compra** (`buyIn`): continentes de comercio. Las colecciones culturales (monedas, sellos, medallas, objetos de civilizaciones, etc.) se compran también en Europa, que en 1842 era el gran mercado de coleccionismo; por eso una pieza de Asia puede venderse en Londres sin cambiar su origen.

- Piezas que eran «Mundial» antes de MEC-04: 131. Con origen corregido: 110. Siguen «Mundial»: 21.

| Pieza | Nombre | Motivo |
| --- | --- | --- |
| HEL-01 | Helecho macho | Helecho macho: distribución holártica. |
| HEL-02 | Helecho hembra | Helecho hembra: casi cosmopolita. |
| HEL-03 | Helecho real | Helecho real: casi cosmopolita. |
| HEL-04 | Helecho águila | Helecho águila: cosmopolita. |
| HEL-07 | Helecho espada | Helecho espada: tropical amplio. |
| HEL-09 | Helecho película | Helecho película: tropical amplio. |
| HEL-10 | Azolla | Azolla: casi cosmopolita. |
| GEM-13 | Diamante | Diamante: en 1842 procedía de la India y de Brasil; se mantiene «Mundial». |
| MTR-02 | Paladio | Paladio, rodio, iridio y osmio: en 1842 se obtenían del platino de Nueva Granada y de los Urales. |
| MTR-03 | Rodio | Ver MTR-02. |
| MTR-04 | Iridio | Ver MTR-02. |
| MTR-05 | Osmio | Ver MTR-02. |
| MTR-06 | Oro nativo | Oro nativo: distribución mundial. |
| MTR-07 | Plata nativa | Plata nativa: distribución mundial. |
| MTR-08 | Bismuto | Bismuto: varias procedencias europeas y americanas. |
| MTR-09 | Wolframita | Wolframita: varias procedencias. |
| CON-16 | Caracol oliva | Caracol oliva: género de distribución tropical amplia. |
| CON-20 | Tellina violeta | Tellina violeta: especie no identificada con certeza. |
| COR-15 | Coral sol | Coral sol: distribución tropical amplia. |
| RAR-01 | Bezoar | Bezoar: tradición de Persia, India y América. |
| RAR-12 | Colmillo apócrifo | Colmillo apócrifo: sin procedencia concreta. |

- Piezas sin fuente de actividad (solo comercio y encargos); ninguna depende únicamente del comercio: 12 (MED-01, MED-02, MED-03, MED-04, MED-05, MED-06, MED-07, MED-13, MED-09, MED-10, MED-11, MED-12); fuentes: comercio+encargos.

### Contenido nuevo para Asia, Sudamérica, Oceanía y Polos

Se reutilizan los motores de expediciones y excavaciones, con los mismos requisitos de Astillero, rutas y mapas (`www/js/mec04-society.js`, `AtlasMEC04Content`):

- Expedición `mesoamerica_survey` · Reconocimiento de Mesoamérica
- Expedición `asia_survey` · Reconocimiento de Anatolia y el Cáucaso
- Expedición `andes_survey` · Reconocimiento de los Andes
- Expedición `pacific_survey` · Reconocimiento del Pacífico austral
- Expedición `polar_survey` · Reconocimiento de los mares polares
- Yacimiento `anatolia_strata` · Estratos de Anatolia
- Yacimiento `andes_strata` · Estratos andinos
- Yacimiento `australia_strata` · Estratos del desierto australiano

Con esto las piezas de esos continentes ya no dependen solo de campo, prospecciones y comercio.

## 3. Rangos

Configuración única en `www/js/mec04-society.js` (`AtlasMEC04.RANKS`). Cada rango tiene `id`, `level`, `name`, `description`, `requires`, `benefits`/`unlocks`, `art`, `reward` y `balance: 'provisional'`. Se conservan los nombres y el prestigio de la tabla de la beta. Ningún rango exige todos los indicadores a la vez ni el 100 % de un catálogo.

| # | id | Rango | Requisitos | Desbloqueos | Recompensa única | Arte |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `aficionado` | Aficionado | Prestigio 0 | Subvención · apoyo inicial | — | `rank-01` |
| 2 | `corresponsal` | Corresponsal | Prestigio 5 · Especies descubiertas 10 | — | £150 · 60 conoc. | `rank-02` |
| 3 | `aspirante` | Aspirante | Prestigio 12 · Investigaciones realizadas 3 · Ingresos acumulados (£) 1000 | Subvención de campo | £300 · 120 conoc. | `rank-03` |
| 4 | `ayudante` | Ayudante de campo | Prestigio 25 · Especies descubiertas 40 · Coleccionables descubiertos 3 | Encargo · Cancillería de órdenes | £450 · 180 conoc. | `rank-04` |
| 5 | `observador` | Observador | Prestigio 45 · Monografías publicadas 10 · Regiones exploradas 5 | Instalaciones del Campamento: nivel IV (Astillero y Taller) | £600 · 240 conoc. | `rank-05` |
| 6 | `colector` | Colector | Prestigio 70 · Coleccionables descubiertos 15 · Expediciones completadas 3 | Financiación de expediciones; Instalaciones del Campamento: nivel IV (Caravana, Excavaciones y Prospecciones); Casa de subastas y solicitudes de coleccionistas; Encargo · Sociedad Geográfica | £800 · 300 conoc. | `rank-06` |
| 7 | `socio_auxiliar` | Socio auxiliar | Prestigio 100 · Especies descubiertas 100 · Investigaciones realizadas 12 · Ingresos acumulados (£) 20.000 | — | £1000 · 400 conoc. | `rank-07` |
| 8 | `socio_correspondiente` | Socio correspondiente | Prestigio 135 · Expediciones completadas 10 · Regiones exploradas 12 | Coleccionistas especializados; Encargo · publicación de estudios | £1300 · 500 conoc. | `rank-08` |
| 9 | `naturalista` | Naturalista | Prestigio 175 · Monografías publicadas 60 · Coleccionables descubiertos 40 | Instalaciones del Campamento: nivel V (Astillero, Caravana y Taller) | £1600 · 650 conoc. | `rank-09` |
| 10 | `socio_titular` | Socio titular | Prestigio 215 · Investigaciones realizadas 20 · Colecciones completadas 1 · Ingresos acumulados (£) 100.000 | Proyectos científicos; Instalaciones del Campamento: nivel V (Excavaciones y Prospecciones) | £2000 · 800 conoc. | `rank-10` |
| 11 | `curador` | Curador | Prestigio 255 · Especies descubiertas 250 · Coleccionables descubiertos 70 | Ampliaciones avanzadas del Museo (preparado para MEC-05) | £2500 · 1000 conoc. | `rank-11` |
| 12 | `academico` | Académico | Prestigio 295 · Regiones exploradas 30 · Expediciones completadas 25 | Ofertas extraordinarias; Encargo · colaboración institucional | £3000 · 1200 conoc. | `rank-12` |
| 13 | `explorador_mayor` | Explorador mayor | Prestigio 335 · Monografías publicadas 150 · Investigaciones realizadas 28 | — | £3500 · 1400 conoc. | `rank-13` |
| 14 | `consejo` | Miembro del Consejo | Prestigio 375 · Coleccionables descubiertos 110 · Ingresos acumulados (£) 500.000 | Patrocinio institucional | £4000 · 1600 conoc. | `rank-14` |
| 15 | `consejero_honorario` | Consejero honorario | Prestigio 410 · Especies descubiertas 400 · Colecciones completadas 3 | — | £4500 · 1800 conoc. | `rank-15` |
| 16 | `catedratico` | Catedrático | Prestigio 440 · Regiones exploradas 55 · Expediciones completadas 50 | — | £5000 · 2000 conoc. | `rank-16` |
| 17 | `director_seccion` | Director de sección | Prestigio 465 · Monografías publicadas 250 · Investigaciones realizadas 36 | — | £5500 · 2200 conoc. | `rank-17` |
| 18 | `vicepresidente` | Vicepresidente | Prestigio 480 · Coleccionables descubiertos 160 · Ingresos acumulados (£) 2.000.000 | — | £6000 · 2400 conoc. | `rank-18` |
| 19 | `presidente_honorario` | Presidente honorario | Prestigio 485 · Especies descubiertas 500 · Regiones exploradas 75 | — | £7000 · 2800 conoc. | `rank-19` |
| 20 | `gran_naturalista` | Gran Naturalista | Prestigio 500 · Monografías publicadas 300 · Coleccionables descubiertos 200 · Colecciones completadas 6 | — | £10.000 · 4000 conoc. | `rank-20` |

**Ingresos**: el requisito usa el libro de ingresos (`state.moneyLedger.total`), **nunca el saldo**. Gastar no reduce el progreso.

**Referencias de arte**: `rank-01` … `rank-20`, con `file: null`. La interfaz usa por ahora el sello de la Sociedad. No se generó arte definitivo.

## 4. Ascenso

- **Explícito**: botón «Ascender» en Sociedad → Rango, con confirmación que muestra el rango y la recompensa. Se asciende un nivel cada vez.
- **Persistente**: `state.society.rank` y `state.society.history` (rango, fecha, recompensa). El rango no baja por gastar, intercambiar, retirar exposiciones ni por un valor guardado menor que el historial (`normalize`).
- **Recompensa única**: `state.society.rewards[nivel]`, pagada con `earnMoney(…, 'recompensas')` dentro de una transacción. Si el guardado falla, no hay ascenso ni pago.
- **Sin mejoras gratuitas**: el ascenso no sube instalaciones; solo permite mejorarlas pagando su costo.

## 5. Desbloqueos

| Beneficio | Clave | Rango |
| --- | --- | --- |
| Subvención · apoyo inicial | `grant:apoyo` | 1 · Aficionado |
| Subvención de campo | `grant:campo` | 3 · Aspirante |
| Encargo · Cancillería de órdenes | `commission:cancilleria` | 4 · Ayudante de campo |
| Instalaciones del Campamento: nivel IV (Astillero y Taller) | `facility:L4` | 5 · Observador |
| Financiación de expediciones | `grant:expediciones` | 6 · Colector |
| Instalaciones del Campamento: nivel IV (Caravana, Excavaciones y Prospecciones) | `facility:L4b` | 6 · Colector |
| Casa de subastas y solicitudes de coleccionistas | `commerce:subastas` | 6 · Colector |
| Encargo · Sociedad Geográfica | `commission:geografica` | 6 · Colector |
| Coleccionistas especializados | `commerce:especialistas` | 8 · Socio correspondiente |
| Encargo · publicación de estudios | `commission:estudio` | 8 · Socio correspondiente |
| Instalaciones del Campamento: nivel V (Astillero, Caravana y Taller) | `facility:L5` | 9 · Naturalista |
| Proyectos científicos | `grant:proyectos` | 10 · Socio titular |
| Instalaciones del Campamento: nivel V (Excavaciones y Prospecciones) | `facility:L5b` | 10 · Socio titular |
| Ampliaciones avanzadas del Museo (preparado para MEC-05) (preparado, sin efecto hasta MEC-05) | `museum:ampliaciones` | 11 · Curador |
| Ofertas extraordinarias | `commerce:extraordinarias` | 12 · Académico |
| Encargo · colaboración institucional | `commission:institucional` | 12 · Académico |
| Patrocinio institucional | `grant:patrocinio` | 14 · Miembro del Consejo |

### Instalaciones

Los niveles **I–III nunca exigen rango**. IV y V exigen el rango indicado además de los requisitos de MEC-02. Los niveles ya construidos se conservan siempre, aunque el rango migrado sea menor.

| Instalación | I–III | IV | V |
| --- | --- | --- | --- |
| shipyard | sin rango | 5 · Observador | 9 · Naturalista |
| workshop | sin rango | 5 · Observador | 9 · Naturalista |
| caravan | sin rango | 6 · Colector | 9 · Naturalista |
| excavations | sin rango | 6 · Colector | 10 · Socio titular |
| surveys | sin rango | 6 · Colector | 10 · Socio titular |

### Comercio y encargos

- Ofertas de nivel IV: rango 6; nivel V: rango 8; extraordinarias (Caravana V): rango 12.
- Encargo `cancilleria`: rango 4 · Ayudante de campo.
- Encargo `geografica`: rango 6 · Colector.
- Encargo `estudio-publicado`: rango 8 · Socio correspondiente.
- Encargo `colaboracion-institucional`: rango 12 · Académico.

### Financiación

Apoyo inicial: la subvención histórica de la pestaña Subvenciones, sin cambios. Las demás categorías pagan a `subvenciones` en el libro, en transacción, y llevan su propio contador para no cobrarse dos veces:

| Categoría | Rango | Regla provisional |
| --- | --- | --- |
| Subvención de campo | 3 | `{"cooldownHours":6,"base":60,"perRegion":15,"source":"subvenciones"}` |
| Financiación de expediciones | 6 | `{"perVoyage":80,"maxVoyages":10,"source":"subvenciones"}` |
| Proyectos científicos | 10 | `{"everyMonographs":25,"perMilestone":600,"source":"subvenciones"}` |
| Patrocinio institucional | 14 | `{"cooldownHours":24,"base":1500,"perPrestige":6,"source":"subvenciones"}` |

`expediciones` paga cada expedición completada una sola vez (`grants.expediciones.funded`), hasta 10 por cobro. `proyectos` paga cada hito de 25 monografías una vez (`grants.proyectos.paid`). Campo y patrocinio tienen espera.

### Museo

`museum:ampliaciones` (rango 11) queda **preparado sin efecto** (`MUSEUM_RANKS.active = false`) para MEC-05.

## 6. Interfaz

Sociedad → **Rango**: insignia y nombre, próximo rango con el progreso de cada requisito (✓ o valor/objetivo) y un atajo a la pestaña correspondiente, botón «Ascender», funciones desbloqueadas, financiación con botones de cobro, ingresos acumulados (con la parte estimada sin desglose), historial de ascensos y la lista de los 20 rangos. Las mejoras bloqueadas del Campamento, las ofertas y los encargos muestran el motivo «Rango de Sociedad «Nombre» (n)».

Comprobación en navegador (Chrome sin interfaz, 412 × 900), sin errores de consola: pestaña Rango, ascenso a Corresponsal con confirmación y recompensa, atajo de requisito y los nuevos destinos en el Astillero.

## 7. Auditoría de dependencias

`tests/helpers/mec04-audit.cjs` juega la progresión con las reglas del motor (`regionRequirementsMet`, `canBuy`, recetas, `check` del Campamento, elegibilidad de rango) sin ayudas de desarrollo: solo suple recursos y los materiales históricos ya verificados. Se ejecuta desde una partida **inicial**, una **intermedia** (rango 5, solo Europa y Asia desbloqueadas) y una **avanzada** (todo desbloqueado salvo el rango). Las tres llegan al rango 20 sin bloqueos.

```json
{"steps":20,"rank":20,"levels":{"shipyard":5,"caravan":5,"workshop":5,"excavations":5,"surveys":5},"regions":113,"totalRegions":113,"research":57,"totalResearch":57,"pieces":431,"missingPieces":[],"voyages":["coast","north","alps","carpathians","balkans","ethiopia_survey","namib_survey","atlantic_survey","mesoamerica_survey","asia_survey","andes_survey","pacific_survey","polar_survey"],"missingVoyages":[],"sites":["british_cliffs","alpine_basin","namib_rocks","canadian_rocks","anatolia_strata","andes_strata","australia_strata"],"missingSites":[],"prospections":["regional","geologica","especializada"],"preparations":["herbario","madera","pulido","reconstruccion","daguerrotipo"],"commissions":["hidrografica","almirantazgo","cancilleria","geografica","oologo","jardin","estudio-publicado","colaboracion-institucional"],"blockedBy":[],"hitos":["mapa asia_map","mapa africa_map","mapa north_america_map","preparación brass_compass","preparación oceanic_quadrant","preparación field_telescope","preparación scholar_hat","preparación polar_coat","preparación sounding_kit","instalación shipyard 2","instalación caravan 2","instalación workshop 2","instalación excavations 2","instalación surveys 2","rango 2","mapa south_america_map","instalación shipyard 3","instalación caravan 3","instalación workshop 3","instalación excavations 3","instalación surveys 3","rango 3","mapa oceania_map","rango 4","mapa polar_map","mapa world_map","rango 5","instalación shipyard 4","instalación workshop 4","rango 6","instalación caravan 4","instalación excavations 4","instalación surveys 4","rango 7","rango 8","rango 9","instalación shipyard 5","instalación caravan 5","instalación workshop 5","rango 10","instalación excavations 5","instalación surveys 5","rango 11","rango 12","rango 13","rango 14","rango 15","rango 16","rango 17","rango 18","rango 19","rango 20"]}
```

Orden comprobado: los niveles V llegan después de los rangos 9 y 10 que los exigen, y ningún rango exige una instalación que dependa de un rango superior. **No hay dependencias circulares.** Durante la auditoría apareció una dependencia que el bot no cubría: las investigaciones continentales exigen preparaciones fabricadas (`CONTINENT_RESEARCH3300`) y los océanos exigen el mapa del mundo. Ambas son alcanzables con recetas existentes; el bot ahora las fabrica.

## 8. Migración

- **Rango**: `migrate()` reconoce el rango consecutivo más alto que los registros de la partida cumplen (`migration.method: 'registros-disponibles'`). El historial lo marca `migrated`.
- **Recompensas**: las de rangos migrados se registran como `migrated, paid: false`. **No se pagan ni se inventan ingresos.**
- **Ingresos**: el requisito usa `moneyLedger.total`, que incluye la estimación `sinDesglose` de MEC-01.
- **Financiación**: los contadores empiezan en la migración (las expediciones ya completadas no se financian de forma retroactiva).
- **Campamento**: los niveles existentes se conservan; mejorar a IV–V exige desde ahora el rango.
- La migración es idempotente y se conserva al exportar e importar.

## 9. Pruebas

`tests/mec04.test.cjs`: **15 de 15 aprobadas**. Cubren los 20 puntos de la sección 17; algunas pruebas agrupan varios.

| Punto | Comprobación |
| --- | --- |
| 1 | 3.000 búsquedas sin fauna compatible dan hallazgos ambientales, una tirada por búsqueda |
| 2 | Manual con el bioma seleccionado (costa ≠ bosque); automática con la región del tramo |
| 3 | El procesamiento offline usa la región histórica del tramo |
| 4 | Las 224 piezas comercializables aparecen en ofertas reales; «Mundial» en comercio regional; ofertas iguales tras recargar; protección intacta |
| 5 | 431 piezas, 32 colecciones, 27 materiales; 21 «Mundial» con motivo; accesibilidad en cuatro niveles |
| 6 | 20 rangos completos, nombres y prestigio de la beta, beneficios válidos, sin exigir el 100 % |
| 7, 8, 9 | Saldo no sustituye a ingresos; rechazo sin cambios; ascenso con historial, recompensa en el libro y persistencia |
| 10 | Rango intacto tras gastar, vaciar inventario y retirar exposiciones |
| 11, 16 | I–III sin rango; IV–V con rango; financiación, encargos, ofertas de nivel IV y extraordinarias; Museo preparado |
| 12 | Recompensas y financiación sin duplicados, también tras recargar |
| 13 | Auditoría desde partida inicial, intermedia y avanzada |
| 14, 15 | Partida antigua: rango 4 reconocido sin pagos inventados; instalaciones conservadas; idempotencia |
| 17 | Fallo de guardado durante ascenso y cobro: sin efectos a medias |
| 18, 19 | Exportación e importación; vuelta offline 7 h después |
| 20 | Invariantes de MEC-01/02/03, versión, caché offline, `release:verify`, matriz al día, sin `android/` |

### Suite completa (línea base MEC-03 frente a MEC-04)

| | MEC-03 `469ce7c` | MEC-04 |
| --- | --- | --- |
| Pruebas | 923 | 938 (+15 de MEC-04) |
| Aprobadas | 707 | 722 |
| Fallidas | 216 | 216 (las mismas, aserciones históricas preexistentes) |
| Regresiones | — | **0** |
| Archivo que agota los 600 s | `global-v3240` | `global-v3240` |

**Cambios en pruebas existentes** (ninguna se eliminó ni se debilitó):
- MEC-02, prueba 1: ahora comprueba que I–III no exigen rango y que IV–V exigen el rango activo (cambio de diseño de MEC-04). Los auxiliares `rich()`/`up()` de MEC-02 y MEC-03 fijan rango 20 para seguir probando los niveles IV–V.
- MEC-03, prueba 6: el comercio se comprueba contra `sources.comercio.continents` (dónde se compra), no contra el origen, por la separación de la sección 2.
- MEC-03, prueba 20 y comprobación de `gameVersion`: comparan con la versión vigente de `package.json` en lugar del literal 5.6.3.
- Pruebas de MEC-01, MEC-02 y MEC-03: 14/14, 12/12 y 17/17.

Resultados por prueba: [`linea-base-mec03.json`](linea-base-mec03.json) y [`resultado.json`](resultado.json). `release:verify` incluye ahora `tests/mec04.test.cjs`.

## 10. Pendientes

- **BAL-01**: umbrales de rango, recompensas, financiación y niveles de instalación exigidos son provisionales.
- **MEC-05**: efecto de los rangos sobre el Museo (beneficio ya declarado).
- **Arte**: 20 insignias definitivas (`rank-01`…`rank-20`).
- **Geografía**: revisión externa de las 21 piezas «Mundial» y de los orígenes corregidos; si hiciera falta, una etapa geográfica específica antes de MEC-09.

## 11. Confirmación

No se generó ni se publicó ninguna APK, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó. No se modificaron ilustraciones zoológicas, variantes pigmentarias ni el fondo del Campamento, y no se añadieron ayudas de desarrollo a la progresión. El desarrollo se detiene aquí para la auditoría externa; no se avanzó a MEC-05.
