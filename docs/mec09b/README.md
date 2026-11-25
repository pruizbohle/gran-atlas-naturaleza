# MEC-09B · Auditoría funcional, accesibilidad y progresión integral

**Versión 5.6.9 Beta — compilación MEC-09B**, rama `mec-09b/functional-audit` (sobre MEC-09A, sin fusionar a `main`). No se generó ni publicó ninguna APK. No se avanza a MEC-09C.

Todos los valores de balance siguen **provisionales (BAL-01)**: MEC-09B no cambia costos, probabilidades, duraciones ni recompensas existentes. Los únicos valores nuevos (expediciones y yacimientos de cobertura geográfica) están en el rango de sus vecinos y quedan para BAL-01.

## 1. Niveles de evidencia y estados

| Nivel | Significado |
| --- | --- |
| A | La configuración es válida (ids, referencias, requisitos coherentes). |
| B | Existe una fuente o actividad compatible. |
| C | El motor real ejecuta la acción en una partida preparada. |
| D | Cadena real desde una **partida nueva** (controlador de progresión, sin ayudas). |

Las partidas preparadas son **sintéticas**: solo sirven para pruebas unitarias de reglas y se señalan en cada matriz (columna `condiciones` o `evidencia`). **La accesibilidad no se declara completa por estados sintéticos**: la evidencia D procede del controlador.

Estados (sección 31): **Verificado** (D, o C sin condiciones), **Condicional** (C/B con condiciones de juego, p. ej. un horario o una investigación), **Bloqueado**, **Incoherente**, **Pendiente de evidencia**.

## 2. Correcciones funcionales (sección 4)

| Punto | Problema | Corrección | Pruebas |
| --- | --- | --- | --- |
| 4.1 | Actividades con fecha efectiva anterior a `acceptedAt` (colas offline procesadas después) acreditaban objetivos incrementales. | `activityScope` excluye su aporte (`excluded`) en correspondencia, proyectos y eventos; `syncContracts` solo marca objetivos dentro de `[acceptedAt, endsAt)`. La posesión y lo histórico se evalúan con el estado vigente (pueden usar progreso previo). | `mec09b` 1, 1b |
| 4.2 | Una actividad posterior al cierre, procesada antes que una anterior pendiente, podía hacer caducar el evento. | La caducidad la decide solo el horizonte efectivo (`horizon`: cola automática y trabajos terminados sin liquidar). Probado con una cola real de búsquedas y una expedición real liquidada antes. | `mec09b` 2, 2b |
| 4.3 | Aceptar no volvía a comprobar la viabilidad. | `acceptCheck(id)`: plazas, requisitos y objetivos. Si la oferta ya no es alcanzable se bloquea con el motivo, sin penalización; la oferta se conserva tal cual y recargar no regenera el tablero. La tarjeta muestra el motivo y desactiva el botón. | `mec09b` 3 |
| 4.4 | `AVAIL` devolvía `Infinity` como única evidencia. | Cada métrica devuelve `{n, repeatable, why}` con condiciones reales (capacidad de gabinetes y Museo, temáticas, récords y conductas con especie accesible, demostraciones con artefacto catalogado, estudios con Taller e instrumentos, recetas con ingredientes obtenibles, piezas de campo por continente accesible, comercio con Caravana II, materiales animales con fuente, regiones accesibles). | `mec09b` 3b |
| 4.5 | Reglas genéricas de MEC-09A (R12 y «deep-equal») agrupaban fallos sin revisión individual. | Los 42 fallos afectados tienen veredicto individual y prueba equivalente vigente ([`correspondencia-pruebas-historicas.csv`](correspondencia-pruebas-historicas.csv)). Las presencias citadas (calamar gigante, frailecillo atlántico, gaviota marfil, pelícano) se comprueban en el motor. Ninguno esconde un error funcional vigente. | `mec09b` 4.5 |

## 3. Controlador de progresión (sección 30)

`scripts/mec09b-progression.cjs`: partida **nueva** real, reloj virtual (30 min por paso), solo acciones públicas del juego (búsquedas, Cuaderno, monografías, investigaciones, fabricación, desbloqueos, Museo, Campamento, ascensos, expediciones, comercio, excavaciones, prospecciones, sondeos, encargos), **sin ayudas de desarrollo**. Registra hitos, acciones, decisiones y estancamientos; guarda un punto de control cada 200 pasos.

Dos semillas (29 y 31), cada una desde la misma partida nueva:

| Hito | Semilla 29: paso (día) | Semilla 31: paso (día) |
| --- | --- | --- |
| Rango 3 | 71 (día 1.5) | 72 (día 1.52) |
| Asia | 74 (día 1.56) | 110 (día 2.33) |
| África | 218 (día 4.64) | 222 (día 4.73) |
| Norteamérica | 396 (día 8.45) | 402 (día 8.58) |
| Rango 7 | 349 (día 7.44) | 353 (día 7.53) |
| Mapa del mundo | 446 (día 9.52) | 487 (día 10.4) |
| Sudamérica | 592 (día 12.64) | 598 (día 12.77) |
| Oceanía | 780 (día 16.66) | 785 (día 16.77) |
| Rango 10 | 913 (día 19.51) | 920 (día 19.66) |
| Polos | 2227 (día 47.62) | 2242 (día 47.94) |
| Océanos | 2232 (día 47.72) | 2243 (día 47.96) |
| Primer sondeo profundo | 3419 (día 73.12) | 3405 (día 72.82) |
| Rango 20 | 4310 (día 92.18) | 4308 (día 92.14) |
| Último nivel V del Campamento | 5603 (día 119.85) | 5672 (día 121.32) |

| Estado final | Semilla 29 | Semilla 31 |
| --- | --- | --- |
| Pasos | 5683 | 5752 |
| Días de juego | 121.58 | 123.05 |
| Especies descubiertas | 1000 | 1000 |
| Monografías publicadas | 1000 | 1000 |
| Regiones desbloqueadas | 125 | 125 |
| Regiones visitadas | 117 | 117 |
| Rango | 20 | 20 |
| Museo (nivel) | 5 | 5 |
| Piezas registradas | 290 | 288 |
| Colecciones completas | 13 | 12 |
| Legendarios | 8 | 15 |
| Relictos | 4 | 2 |
| Récords | 25 | 25 |
| Conductas | 17 | 17 |
| Investigaciones | 57 | 57 |
| Campamento | 5/5/5/5/5 | 5/5/5/5/5 |

**Resultado D:** las 1.000 especies descubiertas y publicadas, las 125 regiones, los 8 continentes, el rango 20, los 25 niveles del Campamento y los 5 del Museo se alcanzan **desde cero, sin ayudas**. No se alcanzaron en estas partidas (quedan con evidencia C, Condicional): 143 piezas, 20 colecciones, 15 legendarios, 18 relictos. Dependen de tiradas o de repetir actividades, no de un bloqueo: su fuente sí se ejecutó desde cero (columna `condiciones`).

Política y limitaciones del controlador: es codicioso (región con más especies pendientes). Se estancó en rango 11 porque visitaba pocas regiones (rango 12 exige 30) y porque no buscaba la escama de castor que exige el morral reforzado. Era la política, no el juego. Después se detuvo en 992 especies (le faltaban presencias profundas con estrato y método propios) y en el nivel IV del Campamento (canjeaba el conocimiento por debajo de los 12.000 que pide el nivel V). Se añadieron a la política objetivos de material, la refabricación de intermedios, las presencias profundas pendientes y una reserva de conocimiento. Cada vez la ejecución se **reanudó desde su propio punto de control**, con el mismo estado guardado; cada reanudación consta en `decisions`. Los estados de los hitos están en [`tests/fixtures/mec09b-controller`](../../tests/fixtures/mec09b-controller) y se usan para los perfiles de encargos.

Matriz: [`progresion.csv`](progresion.csv) (hito × semilla: paso, día, rango, prestigio, especies, regiones). Registros completos: `progresion-controlador-29.json`, `progresion-controlador-31.json`.

## 4. Matrices de accesibilidad

| Área | Elementos | Resultado | Matriz |
| --- | --- | --- | --- |
| Regiones | 125 regiones; ninguna solo con fauna | Verificado 125 · evidencia D 125 | [`regiones.csv`](regiones.csv) |
| Especies | 1.000 | Verificado 1000 · evidencia D 1000 | [`especies.csv`](especies.csv) |
| Monografías (5 etapas, alimentación, dimorfismo, espécimen especial) | 1.000 | Verificado 1000 · evidencia D 1000 | [`monografias.csv`](monografias.csv) |
| Legendarios | 30 | Condicional 15, Verificado 15 · evidencia C 15, D 15 | [`legendarios.csv`](legendarios.csv) |
| Relictos e indicios | 20 | Condicional 18, Verificado 2 · evidencia C 18, D 2 | [`relictos.csv`](relictos.csv) |
| Récords y conductas (incluidos hito final y validación con instrumento) | 25 + 20 | Condicional 12, Verificado 33 · evidencia C 12, D 33 | [`records-conductas.csv`](records-conductas.csv) |
| Piezas (fuentes híbridas activas; el canal experimental sigue desactivado) | 431 | Condicional 143, Verificado 288 · evidencia C 143, D 288 | [`piezas.csv`](piezas.csv) |
| Colecciones | 32 | Condicional 20, Verificado 12 · evidencia C 20, D 12 | [`colecciones.csv`](colecciones.csv) |
| Objetos y materiales (ITEMS; los 20 artefactos están en taller.csv: 544 en total, como en MEC-06) | 524 | Condicional 159, Verificado 365 · evidencia B 159, D 365 | [`objetos-materiales.csv`](objetos-materiales.csv) |
| Taller: artefactos, componentes, estudios y demostraciones | 44 filas | Condicional 38, Verificado 6 · evidencia C 38, D 6 | [`taller.csv`](taller.csv) |
| Instalaciones del Campamento | 25 niveles | Verificado 25 · evidencia D 25 | [`instalaciones.csv`](instalaciones.csv) |
| Rangos de Sociedad | 20 | Verificado 20 · evidencia D 20 | [`rangos.csv`](rangos.csv) |
| Museo y reconstrucciones fósiles | 5 niveles + fósiles | Condicional 21, Verificado 5 · evidencia B 21, D 5 | [`museo-fosiles.csv`](museo-fosiles.csv) |
| Comercio y expediciones | 40 | Condicional 22, Verificado 18 · evidencia C 22, D 18 | [`comercio-expediciones.csv`](comercio-expediciones.csv) |
| Logros | 164 | Condicional 49, Verificado 115 · evidencia C 49, D 115 | [`logros.csv`](logros.csv) |
| Encargos permanentes | 36 | Condicional 12, Verificado 24 · evidencia C 12, D 24 | [`encargos.csv`](encargos.csv) |

Grafo de dependencias: 1230 nodos (regiones, especies, investigaciones, recetas, objetos, piezas, colecciones, instalaciones, rangos, expediciones, yacimientos), 0 inalcanzables, 0 ciclos ([`grafo-dependencias.csv`](grafo-dependencias.csv)).

## 5. Cartografía y dependencias continentales (secciones 7-8)

Cadena verificada en el controlador: Europa → `asia_map` (piezas de expedición) → `asia_1` → Asia → `africa_map` → África (brújula) → Norteamérica (cuadrante) → Sudamérica (catalejo, `south_america_map`) → Oceanía (`oceania_map`) → `polar_map` y `world_map` → Polos (abrigo polar: morral reforzado, escama de castor) → Océanos (`mares_superficiales_1`) → profundos y abisales (kit de sondeo). Sin ciclos; ninguna preparación se consume salvo los intermedios (el morral se consume en el abrigo y en el kit).

## 6. Cobertura geográfica (sección 10)

[`cobertura-geografica.md`](cobertura-geografica.md) y [`cobertura-geografica.csv`](cobertura-geografica.csv). Seis expediciones y tres yacimientos nuevos en regiones existentes (Asia, Sudamérica, Oceanía, Polos, Océanos), cada uno con su carencia medida, su contexto histórico y las piezas heredadas del destino vecino. Los destinos históricos no cambian. Desde partida nueva, el controlador usó 6 de las 6 expediciones nuevas: `himalaya_survey`, `malay_survey`, `amazon_survey`, `nz_survey`, `antarctic_survey`, `indian_ocean_survey`.

## 7. Revisión científica e histórica (sección 19)

[`cientifico-historico.md`](cientifico-historico.md): 31 observaciones de MEC-03. Clases: B 10, C 13, D 4 (DAG-13 a DAG-16), E 4 (ya corregidos: copihue, vainilla, maderas y daguerrotipos con procedencia concreta). No se eliminó ni sustituyó ninguna pieza. Hay propuesta para los D (recomendada: «Daguerrotipo de un grabado de …») y una propuesta opcional para NUM-05; ninguna se aplicó.

## 8. Placas daguerrotípicas (sección 22)

[`placas.md`](placas.md): `state.mec06.plates` con lotes `virgen` / `expuesta` / `revelada`, origen en cada alta, consumo FIFO, evidencia del destino, revelado único (Campamento o Taller) y migración sin procedencia inventada. Las existencias vírgenes coinciden siempre con el inventario.

## 9. Encargos, eventos y logros (secciones 27-29)

- 36 encargos permanentes: cumplibles con el contenido existente ([`encargos.csv`](encargos.csv)).
- 13 plantillas de correspondencia y 7 proyectos: generados durante 30 periodos en 9 perfiles. Hay perfiles reales del controlador (inicial, temprano, intermedio, avanzado, casi completo) y perfiles sintéticos señalados (coleccionista, explorador, rango 20 con catálogo en curso, catálogo completo). Ninguna oferta tiene objetivos inviables, ninguna queda bloqueada al aceptar, y las 20 plantillas aparecen en algún perfil ([`encargos-perfiles.csv`](encargos-perfiles.csv)).
- 10 eventos: encargo principal o alternativo según el perfil (columna `eventos`).
- 164 logros: cada métrica puede llegar a su objetivo con el contenido existente, y los contadores (`crafted`, `trade`, `trade24`, `market`, `barter`, `validations`, etc.) se incrementan en el código del juego ([`logros.csv`](logros.csv)).

## 10. Pruebas

Suite completa (131 archivos, `/tmp/runsuite.sh`, 600 s por archivo), comparada **prueba por prueba** con MEC-09A ([`comparacion-pruebas.csv`](comparacion-pruebas.csv), [`resultado-suite-mec09b.json`](resultado-suite-mec09b.json)):

| Conjunto | Pruebas | Aprobadas | Fallidas | Tiempo agotado |
| --- | --- | --- | --- | --- |
| MEC-09A (`742e91a`) | 1.081 | 860 | 221 | ninguno |
| MEC-09B (`mec-09b/functional-audit`) | 1.130 | 909 | 221 | ninguno |

- **Pruebas nuevas: 49, todas aprobadas**, en `mec09b` (27) y `mec09b-catalog` (22). Se ejecutan con el catálogo completo y están incluidas en `release:verify`.
- **Regresiones: 0.** Los 221 fallos son los mismos casos históricos de MEC-09A, clasificados allí; los 42 de las reglas genéricas se revisaron uno a uno (punto 4.5).
- **Pruebas retiradas: 0.** No se eliminó ni debilitó ninguna.
- **Expectativas actualizadas.** Se detectaron en la primera ejecución completa y se corrigieron antes de la definitiva:
  - en MEC-04 (n.º 20) y MEC-05 (n.º 23), los recuentos de destinos y yacimientos siguen exigiendo exactamente 13 y 7 de MEC-04, y además el total con los 6 y 3 de MEC-09B;
  - en MEC-09A (V), la etiqueta de compilación admite `MEC-09[AB]`.
- **Corrección propia durante la auditoría.** El bloque de placas creaba `state.mec06` en partidas sin el módulo de Taller (`naturalist-v400`, fixtures históricos). Ahora no actúa sin MEC-06.

Correspondencia con la sección 33:

| Punto | Prueba |
| --- | --- |
| 1 · actividades anteriores a la aceptación | `mec09b` 1, 1b |
| 2 · cierre cronológico de eventos | `mec09b` 2, 2b |
| 3 · viabilidad al aceptar | `mec09b` 3, 3b |
| 4 · progresión inicial sin ayudas | `mec09b` 4 (controlador real, 130 pasos hasta Asia) |
| 5-6 · cartografía y dependencias continentales | `mec09b-catalog` 5, 6 |
| 7-25 · regiones, especies, monografías, variantes, legendarios, relictos, récords, conductas, piezas, colecciones, materiales, recetas, artefactos, estudios, Campamento, rangos, Museo, fósiles, comercio y expediciones | `mec09b-catalog` 7-25 |
| 26 · placas con procedencia | `mec09b` 26a-26e |
| 27 · encargos avanzados por perfil | `mec09b` 27 |
| 28 · logros y medallas | `mec09b-catalog` 28 |
| 29 · partidas anteriores | `mec09b` 29 (12 partidas auténticas, de 5.4.0 a MEC-08) |
| 30 · sin regresiones MEC-01…MEC-09A | suite completa: 0 regresiones |
| 4.5 · fallos históricos | `mec09b` 4.5 |
| Versión y APK | `mec09b` V |

## 11. Hallazgos por prioridad

[`hallazgos.csv`](hallazgos.csv). P1: 4.1-4.4 y placas, corregidos. P2: cobertura geográfica (corregida), grafo de la auditoría (cerrado sin cambio de motor) y revisión individual de 4.5. P3: la visibilidad de la cadena del morral reforzado, que es condicional y no se cambió; las propuestas históricas, que no se aplicaron; y la política del controlador, que se corrigió.

## 12. Limitaciones

También en [`limitaciones.md`](limitaciones.md).

- **Balance:** nada se ajustó. Los tiempos del controlador (unos 120 días de juego con 12 búsquedas manuales cada 30 min) no estiman el ritmo de un jugador real; quedan para BAL-01.
- **Controlador:** es una política codiciosa con dos semillas. Se reanudó desde sus propios puntos de control tras corregir su política (objetivos de material, refabricación de intermedios, presencias profundas y reserva de conocimiento para los niveles V); las decisiones quedan en `decisions`. No prueba todas las rutas posibles.
- **Tiradas:** las piezas, colecciones, legendarios y relictos no obtenidos tienen fuente ejecutable desde cero, pero su obtención concreta se comprobó con semilla en partida preparada (C, Condicional).
- **Encargos, logros y perfiles sintéticos:** «coleccionista», «explorador», «rango 20 con catálogo en curso» y «catálogo completo» son estados preparados y están señalados como tales.
- **Revisión histórica:** fechas contrastadas con las notas de MEC-03 y conocimiento general, sin fuentes bibliográficas nuevas. Las propuestas no se aplicaron.
- **Accesibilidad de interfaz:** la tarjeta bloqueada muestra el motivo y desactiva el botón. Los lectores de pantalla quedan para MEC-09C.
- **Fallos históricos:** el destino de las pruebas obsoletas (retirar o reescribir) queda para MEC-09D, como en MEC-09A.

## 13. Archivos

- Código: `www/js/app.js` (correcciones 4.1-4.4, placas, carga de la ampliación geográfica), `www/js/mec09b-geography.js` (nuevo), `www/index.html`, `www/sw.js`, `www/atlas-release.json`.
- Herramientas: `scripts/audit-mec09b.cjs` (todas las matrices), `scripts/mec09b-progression.cjs` (controlador), `scripts/mec09b-geographic-coverage.cjs`.
- Pruebas: `tests/mec09b.test.cjs`, `tests/mec09b-catalog.test.cjs`, fixture `tests/fixtures/mec09b-controller/`.
- Regenerar: `node scripts/audit-mec09b.cjs` · `node scripts/mec09b-geographic-coverage.cjs` · `node scripts/mec09b-progression.cjs SEMILLA PASOS [reanudar]`.
