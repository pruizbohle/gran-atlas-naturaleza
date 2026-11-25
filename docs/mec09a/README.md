# MEC-09A · Auditoría técnica, estabilidad y consolidación de motores → V5.6.9 Beta

Rama `mec-09a/technical-audit`, creada desde `mec-08/v5.6.8-beta` (`e930fad`, publicada y auditada externamente). No se fusiona a `main`.

- **APK.** **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de firma ni de Android y la APK pública no se tocó.
- **Contenido.** No se añadieron especies, regiones, eventos ni arte, y no se modificaron ilustraciones ni variantes pigmentarias.
- **Balance.** No se cambió ningún costo, tiempo, probabilidad ni recompensa.
- **Versión.** Se propone **V5.6.9 Beta** como versión de consolidación mecánica, en el canal beta. **MEC-09A** es su revisión técnica (`atlas-release.json`: `build: "MEC-09A"`, bloque `v569`).

## 1. Verificación inicial

- **MEC-08.** Está completa, con commit y push (`origin/mec-08/v5.6.8-beta` = `e930fad`).
- **Entregables y pruebas revisados.** Sin instrucciones pendientes de MEC-08 más allá de los hallazgos del anexo de la auditoría externa, que se resuelven aquí (§3).

## 2. Línea base técnica

Datos en `linea-base.json`, `modulos.csv` y `resultado-suite-mec08.json`.

| Aspecto | Valor |
| --- | --- |
| Rama y commit de partida | `mec-08/v5.6.8-beta` · `e930fad` · 5.6.8 Beta |
| Guardado | Clave `gran_atlas_v05`; formato de respaldo sin cambios. Subesquemas: `moneyLedger`, `collectionRegistry`, `camp`, `society`, `mec06`, `naturalRecords`, `regionalRecords` y `mec08`; nuevo: `mec09a` (registro de recuperaciones) |
| Módulos JS cargados por `index.html` | 73 (orden, tamaño y globales en `modulos.csv`) |
| Catálogos | 1.000 especies, 125 regiones, 30 legendarios, 20 relictos, 431 coleccionables, 32 colecciones, 27 materiales animales, 20 artefactos, 25 récords, 20 conductas, 20 rangos, 5 × 5 instalaciones, 5 niveles de Museo, 164 logros, 36 encargos permanentes, 20 plantillas y 10 eventos |
| Suite MEC-08 (real) | **1.027 pruebas · 811 aprobadas · 216 fallidas** (215 casos y el archivo `global-v3240`, que agotaba los 600 s sin resultados). 32 nuevas de MEC-08 y 0 regresiones frente a MEC-07 |

## 3. Hallazgos de la auditoría externa de MEC-08 (anexo)

| # | Hallazgo | Corrección | Pruebas |
| --- | --- | --- | --- |
| 1 | `syncContracts` comprobaba el cumplimiento antes que la caducidad | **Caducidad primero.** Un encargo de evento se cierra cuando el **horizonte efectivo** alcanza el final. Ese horizonte es el mínimo entre «ahora», la primera búsqueda automática pendiente y los trabajos terminados sin liquidar (expediciones, excavaciones, prospecciones de relictos y de MEC-04, sondeos y comercio).<br>**Dentro del periodo.** Los objetivos se marcan alcanzados (`reachedAt`) solo con actividad cuya fecha efectiva es anterior al cierre. Lo realizado en el cierre o después se excluye (`excluded`) aunque se liquide antes que una actividad anterior pendiente.<br>**Fechas separadas.** `completedAt`/`reachedAt` (actividad efectiva), `settledAt` (liquidación) y `claimedAt` (cobro).<br>**Recompensas.** Las cumplidas dentro del periodo se conservan y se cobran después.<br>**Orden de procesamiento** del ciclo: búsquedas automáticas → ingresos del Museo y de artefactos → sincronización de encargos (con horizonte) → expediciones → sondeos → comercio → guardado. Cada liquidación sincroniza con su propia fecha efectiva (`endAt`) | A1.1–A1.4 |
| 2 | Contadores incrementados después de funciones que ya se habían guardado | **En la misma transacción.** Los contadores de fabricación y de excavaciones especiales se escriben en la misma `tradeTransaction3300` que la actividad: si falla el guardado, se revierten juntos.<br>**Validación.** El contador se registra dentro de la transacción de MEC-07 (`recognitionHookMEC08`). Esto corrige además que **la validación hecha desde la interfaz no contaba**, porque la acción del Cuaderno usaba la función local, sin la envoltura pública.<br>**Expediciones.** Su contador se escribe en el mismo paso síncrono que la liquidación y se guarda con ella | A2.1–A2.2 |
| 3 | El recorte a 40 del historial permitía repetir una edición | `state.mec08.editions` es un registro permanente y compacto: `{edición: {status, at}}`, con prioridad cobrado > abandonado/caducado > completado > aceptado. Se reconstruye desde los encargos y las medallas al migrar partidas de MEC-08. Limitaciones del reloj local y de los respaldos antiguos en §7 | A3 |
| 4 | Los modificadores de evento usaban la fecha actual | Cada actividad se ejecuta con su fecha efectiva (`activityScope`; los encuentros usan su `at`). `eventLive(act, at)` consulta esa fecha: una búsqueda anterior al inicio o posterior al final no recibe el beneficio, aunque se procese durante el evento | A4 |
| 5 | Aceptar recalculaba la dificultad con el rango actual | Se copia la oferta presentada: objetivos, dificultad, recompensa y condiciones. Solo se fija la línea base de los objetivos incrementales | A5 |
| 6 | Viabilidad de encargos | `AVAIL` por métrica: especies por descubrir, regiones por visitar, monografías pendientes, pares región-especie sin registro, continentes sin registros, capacidad real de exposición, observaciones posibles y demostraciones. La meta concreta de cada oferta se compara con lo disponible.<br>En partidas avanzadas sin especies, regiones ni monografías pendientes esas plantillas no se ofrecen, y los eventos usan su alternativa; si tampoco es viable, el evento indica que no ofrece encargo.<br>Se corrigieron 4 descripciones que no correspondían a su métrica (Caravana, región, continentes y materiales). La auditoría exhaustiva de accesibilidad de la progresión pasa a MEC-09B | A6.1–A6.2 |
| 7 | Accesibilidad de interfaz | Revisión técnica con teclado en Chrome, sin lectores de pantalla (`accesibilidad-tecnica.md`).<br>**Etiquetas:** 0 controles sin nombre y ningún `tabindex` positivo.<br>**Foco:** se corrigió su pérdida tras aceptar, abandonar, paginar y filtrar (`restoreFocusMEC09A`).<br>**Pendiente:** TalkBack y VoiceOver **no se ejecutaron** (MEC-09C) | A7 |

## 4. Hallazgos P0–P3

La matriz completa está en `hallazgos.csv`. **No hay P0 conocidos.** Los 5 P1 están corregidos:
- F01: partida local dañada con recursos no numéricos;
- F02–F05: los hallazgos 1, 2, 3 y 5 del anexo.

Los P2 corregidos son tres:
- modificadores con fecha efectiva;
- viabilidad de encargos;
- el bucle infinito que hacía agotar `global-v3240`.

Los P3 están documentados.

## 5. Fallos históricos

Matriz completa en `fallos-historicos.csv`, con archivo, prueba, error, clase, causa raíz, mecánica, prioridad, corrección, resultado posterior y justificación. El resumen por causa está en `causas-raiz.csv`. El clasificador es reproducible: `scripts/classify-mec09a-failures.py`.

**Contraste con 5.3.0.** De los 215 casos, **213** ya figuraban como fallidos en el registro de 5.3.0 (`docs/v530/regresion.json`). Los otros 2 son instantáneas de código modificado por MEC-03 y MEC-08.

| Clase | Casos | Causas raíz |
| --- | --- | --- |
| G · Rendimiento | 1 (el archivo `global-v3240`) | **R01.** Bucle de Box-Muller `while(!u)u=Math.random()` sin límite en el hito del guepardo: con el generador de prueba `rng:()=>0` la suite giraba para siempre. **Corregido** con 64 intentos y `Number.EPSILON`; con un generador real la secuencia de tiradas es idéntica. El archivo pasa de >600 s sin resultados a unos 39 s, con sus 6 pruebas ejecutadas y clasificadas como B: catálogo 807/79, compuertas posteriores e investigación que ya no consume el mapa |
| B · Desactualizada por diseño aprobado | 140 + 6 de `global-v3240`, ahora visibles | **R05:** literales de versión 3.x. **R06:** recuentos de catálogo, legendarios, variantes y pestañas. **R07:** instantáneas byte a byte o hashes de código posterior. **R08:** catálogo, recetas e investigaciones comparados con versiones anteriores. **R09:** laboratorio congelado en 3.22. **R10:** script GM-06. **R12:** preparación anterior a las compuertas cartográficas de INV 3.40 y a los rangos de MEC-04 |
| C · Arnés incompatible | 74 | **R02:** arnés histórico que carga `app.js` sin los datos polares 3.31, obligatorios. **R03:** fuente reconstruida por `legacy-source` que elimina bloques necesarios. **R04:** módulos de navegador fuera de contexto |
| H · Entorno | 1 | **R11:** proyecto Android nativo ausente |
| A, D, E, F, I | 0 | — |

**R12: por qué no es un error funcional.** Las pruebas de sondeos, fosas, mares, polos, presencias de GM-05 y puertas continentales preparan la partida sin los mapas que exige INV 3.40 (`CARTOGRAPHIC_GATES3400`). Con las compuertas vigentes, las **pruebas equivalentes** E1–E4 (`tests/mec09a-integral.test.cjs`) demuestran que funciona:
- las **1.744** presencias auditadas en GM-05 son alcanzables de forma manual y automática;
- **todas las presencias de las 125 regiones** tienen una vía manual y automática;
- la operación profunda cobra al iniciar, se resuelve una sola vez, da el mismo resultado tras recargar y se revierte si falla el guardado;
- polos y mares se descubren con búsquedas reales y quedan bloqueados sin su mapa.

**Pruebas obsoletas.** No se modificó ninguna expectativa histórica para aprobarla.

**Expectativas actualizadas (6 archivos).** Por el cambio aprobado de versión y de etiqueta de compilación (`MEC-09A`) se ajustaron los literales de versión y compilación de las pruebas MEC-01 a MEC-08. La expresión `^MEC-0\d$` pasa a `^MEC-0\d[A-Z]?$`, y MEC-08 deja de usar los literales 5.6.8. El marcado de la paginación de récords ganó `data-dir`, y la expresión de la prueba MEC-08 n.º 29 se amplió en consecuencia.

## 6. Arnés de pruebas

- **Arnés integral** (`tests/helpers/mec01-game.cjs` con `full:true`). Carga GM-06 y GM-07, el arte necesario, los módulos MEC-01 a MEC-08, los logros 3360 y los encargos 3370: **1.000 especies y 125 regiones**. MEC-09A amplió las funciones expuestas.
- **Qué archivos usan el catálogo completo:**
  - `tests/mec09a-integral.test.cjs`, `tests/mec09a.test.cjs` y `tests/mec09a-catalog.test.cjs`: siempre, salvo E1, que usa el reducido porque verifica el corpus de 113 regiones de GM-05;
  - `tests/mec07.test.cjs` y `tests/mec08.test.cjs`: varias pruebas.
- **Entorno reducido.** Lo usan las pruebas unitarias y las históricas: `live-game.cjs` con 113 regiones y 945 especies, y `legacy-source.cjs`. **No se usa un catálogo incompleto como evidencia de progresión**: la progresión vigente se comprueba con E1–E4 e I1–I8.

## 7. Calendario, reloj local y respaldos

| Aspecto | Comportamiento |
| --- | --- |
| Identificador de ocurrencia | `evento-año` |
| Inicio y final | 00:00 local; el final es exclusivo. El cambio de año queda cubierto (Navidad 24-12 a 01-01) |
| Bisiestos y zona horaria | `Date` local construye las fechas, así que los años bisiestos no requieren reglas propias. La zona horaria es la del dispositivo |
| Sin red y estaciones | Funciona sin red y no toca las estaciones del juego (prueba C2) |
| Recargar | No reinicia premios ni regenera ofertas: el tablero se guarda y las ediciones quedan registradas |

**Limitaciones del reloj local.**
- **Adelantar el reloj** muestra eventos futuros.
- **Atrasarlo** permite volver a ver ofertas de correspondencia de periodos anteriores, porque el tablero se regenera con la misma semilla. **No permite repetir ediciones de evento**, por el registro permanente.
- **Restaurar un respaldo antiguo** devuelve el estado de entonces, incluidas sus ediciones. Es inherente a un juego local sin servidor.

## 8. Arquitectura

Matriz en `funciones-redefinidas.csv`, generada por `scripts/audit-mec09a-architecture.py`. Para cada función recoge la declaración original, las redefiniciones con su bloque, la implementación efectiva, las llamadas, las capturas de la versión anterior y los riesgos.

- **96 funciones redefinidas, con 187 redefiniciones.** Las cadenas más largas son `taxonomyInfo` (9), `atlasRegionModel` (9), `normalizeMEC01` (9), `regionRequirementsMet` (8) y `mec02Action` (6).
- **`tick` no se redefine nunca.** `setInterval(tick)` captura la versión original y los ganchos viven dentro de `tick`. Así se confirma el patrón de todas las etapas.
- **Base de normalización.** La normalización de MEC-01 reemplaza la base sin llamarla. Por eso el saneador de MEC-09A se invoca desde la versión efectiva.
- **Una sola vía de ingreso.** Todas las entradas de dinero pasan por `earnMoney` (libro de ingresos). El único `money+=` directo restante es el pago del motor 3370, que `commissionClaim3370` acredita en la misma operación (prueba T2).
- **Una sola fuente de procedencias.** Ficha, índice del Taller, auditoría, CSV y API pública usan `AtlasItemSources` desde MEC-08. Ninguna interfaz presenta el sistema experimental de drops por especie (prueba I7).
- **Sin reescritura de `app.js`.** No se refactorizó de forma general. La consolidación de cadenas se propone para MEC-09D.

## 9. Transacciones, ingresos y reservas

- **Transacciones** (`auditoria-transacciones.csv`). Se simularon fallos de almacenamiento en fabricación, excavación, estudio, construcción de artefactos, expedición, mercado, prospección de relictos y ampliación del Museo (T1), además de los casos A2, E3 y N1. En ninguno hay estado parcial, cobro sin actividad, actividad sin cobro ni duplicados.
  - **Operaciones sin transacción.** El canje de notas, la publicación, la subvención y el tomo no usan transacción. Ante un fallo de guardado quedan **coherentes en memoria** y se guardan en el ciclo siguiente (≤ 1 s): es la política histórica de «sesión viva exportable» (F10, P3).
- **Ingresos** (T2). Cada entrada de dinero aumenta el libro de ingresos en la misma cantidad, y un gasto no reduce el ingreso acumulado. El saldo disponible y el ingreso bruto histórico quedan separados (`moneyLedger.total` frente a `money`). No hay dobles registros. Los montos no cambian.
- **Reservas** (I1, I8, N2). La exhibición reserva unidades y la protección de la última unidad funciona. Una partida con reservas inconsistentes se recorta a las existencias. El registro permanente no desaparece al vender, intercambiar o consumir, y los instrumentos por encima de la capacidad pasan al almacén sin perderse.

## 10. Guardado, migraciones y partidas dañadas

Ver `auditoria-migraciones.md`.

- **Corpus auténtico.** 12 versiones (5.4.0 a MEC-08, ejecutadas con su propio código mediante `git worktree`) más 6 partidas 3.19–3.23.
- **Qué se comprueba:** conservación de todo el progreso, idempotencia al recargar, importación repetida sin premios y sin pago por migrar.
- **Partidas dañadas.** Se recuperan de forma determinista, sin borrar secciones completas.
- **Saneador nuevo** (`sanitizeCoreMEC09A`). Recursos no numéricos o negativos pasan a 0 (o a su valor si son texto numérico), las existencias quedan enteras y no negativas, y el ala del Museo no supera el máximo. Todo queda registrado en `state.mec09a.recoveries`.
- **Lo que se conserva tal cual por política histórica:** los identificadores desconocidos del inventario, que las pruebas históricas exigen conservar, y el ala 0 admitida por la restauración, que documenta la prueba AUD-03.

## 11. Integridad de catálogos

`integridad-catalogos.csv` y `tests/mec09a-catalog.test.cjs` comprueban, con el catálogo completo:
- identificadores y nombres científicos únicos;
- referencias región-especie;
- especies sin región;
- recetas e investigaciones (sin ciclos);
- piezas y colecciones;
- artefactos y sus usos;
- materiales, instalaciones, récords, conductas, encargos, plantillas, eventos, logros, legendarios, relictos y rangos.

**Resultado: 0 problemas.** La auditoría científica exhaustiva queda para MEC-09B.

## 12. Rendimiento de las suites

`rendimiento-suites.csv` recoge la duración por archivo antes y después. `global-v3240` pasa de más de 600 s (tiempo agotado) a unos 39 s. Ninguna otra suite cambió de forma apreciable.

## 13. Placas daguerrotípicas

Diseño en `placas-daguerrotipicas.md`: lotes complementarios en `state.mec06.plates`, con `state.inventory` como referencia, FIFO y sin procedencias ficticias. **Se traslada a MEC-09B** por su alcance.

## 14. Resultados de las pruebas

Ver `resultado-pruebas.md`.

## 15. Qué queda pendiente y dónde

| Etapa | Pendiente |
| --- | --- |
| MEC-09B | Accesibilidad real de la progresión (dependencias, fuentes de objetos, cobertura geográfica, recetas, rangos y desbloqueos; obtención de todas las piezas; especies y registros extraordinarios), revisión científica de catálogos y procedencia de placas |
| MEC-09C | TalkBack y VoiceOver, experiencia móvil, foco y contraste en toda la aplicación, saturación de menús y rendimiento percibido |
| MEC-09D | Consolidar las cadenas de envolturas de `app.js`; retirar o regenerar las herramientas obsoletas (laboratorio de dimorfismo y script GM-06); decidir el destino de las 215 pruebas históricas clasificadas |
| BAL-01 | Todos los valores (costos, tiempos, probabilidades, recompensas, periodos de renovación y modificadores) |
| ART | Arte definitivo de medallas, títulos, encargos y eventos (150 referencias pendientes de MEC-08) y el laboratorio de dimorfismo |

**Criterio de aprobación.**
- No hay P0 conocidos y los P1 están corregidos.
- Los fallos históricos están clasificados, sin regresiones; las transacciones, migraciones y catálogos se verificaron.
- Los sistemas experimentales siguen desactivados y no hubo balance.

La aprobación corresponde a la auditoría externa.
