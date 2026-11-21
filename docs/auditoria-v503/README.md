# El Gran Atlas · V5.0.3 · AUD-05

La candidata parte de `626d390` en `audit/aud-01-v501`. En esa revisión, el informe registra 632 pruebas aprobadas de 843 y 211 fallos históricos. La medición de ocho horas con diez naturalistas dio 3,0 s y una tarea máxima de 221 ms. Una repetición posterior de V5.0.2 registró también 3,0 s y una tarea de 261 ms. [Evidencia de referencia](../auditoria-v502/README.md)

La rama de auditoría se creó en el remoto desde esa base. El `main` remoto se comprobó en `c8af26e`. Las ilustraciones y el código del laboratorio científico coinciden con la candidata de partida. Se conservaron los informes de AUD-01 a AUD-04 y las evaluaciones de 108 variantes pigmentarias. [Rama de auditoría](https://github.com/pruizbohle/gran-atlas-naturaleza/tree/audit/aud-01-v501) · [Continuidad artística](../auditoria-v501/continuacion-v501.md)

## Hallazgos y cambios

| ID | Prioridad | Hallazgo y causa | Cambio o seguimiento |
|---|---|---|---|
| AUD05-01 | P1 | La paginación del Bestiario volvía a abrir el módulo entero. Cada cambio reconstruía controles, encabezado y resultados, volvía a enlazar eventos y recorría el catálogo con varias copias y filtros intermedios. | Se actualiza el área de resultados y se conserva el control de búsqueda. Se reúnen las condiciones por ficha en un recorrido, se reutilizan el comparador español y los índices de búsqueda de nombres conocidos. La vista sigue mostrando 32 fichas por página. La navegación con teclado lleva el foco al estado de la nueva página. |
| AUD05-02 | P1 | Al volver al Cuaderno se recreaban todos los botones regionales y sus miniaturas, incluidos los que conservaban la misma ilustración y el mismo estado. Seleccionar un folio también creaba y ordenaba la lista completa. | Se reutiliza la lista DOM de la última región. Se actualizan los registros que cambiaron, se conserva la identidad del nodo de cada lámina y se ordena sin redibujar las imágenes. La ficha se calcula directamente al seleccionar un ejemplar. Las pruebas cubren también la restauración de una partida que revele menos especies. |
| AUD05-03 | P2 | `bindPanel` buscaba raíces de módulos ausentes y registraba un manejador independiente en cada hexágono del Atlas. El Cuaderno volvía a aplicar el filtro que ya estaba incorporado al HTML. | La vinculación se acota al módulo activo. El Atlas delega el teclado en el panel. El filtro del Cuaderno sigue aplicándose al escribir, y la búsqueda se conserva al alternar vistas. |
| AUD05-04 | P1 | El actualizador universal deshabilitaba la descarga cuando una revisión offline instalada y la candidata declaraban la misma versión 4.9.6. Se reprodujo con dos revisiones de caché en el mismo origen. | La candidata de auditoría se identifica como 5.0.3 en los manifiestos y en la cabecera de los respaldos. El actualizador existente detecta la versión nueva y solicita autorización antes de descargarla. |
| AUD05-05 | P1 | El arranque y varias primeras aperturas conservan tareas largas en Chromium emulado. La interfaz también hace trabajo de estilo, disposición y pintura tras terminar el controlador JavaScript. | El inicio y las aperturas de Cuaderno y Bestiario merecen perfiles aislados del hilo principal antes de la siguiente publicación. Se conservan las actividades observadas de más de 50 ms con su ruta y momento. |

## Navegación y rendimiento

Chromium 156.0.8078.79, pantalla emulada de 390 × 844 y CPU ralentizada 4×. Se midió el tiempo síncrono del controlador y el tiempo hasta la segunda devolución de llamada de animación. Las mediciones de desplazamiento recorrieron 1.152 px en el selector del Cuaderno. El máximo de memoria corresponde a cinco muestras de heap de JavaScript. Las escrituras son cambios de la clave principal de guardado. La navegación se midió con el service worker bloqueado. El comportamiento offline se comprobó en una sesión separada.

| Partida | Mediana por página del Bestiario | Mediana de regreso rápido al Cuaderno | Reconstrucciones completas | Mayor intervalo al desplazar | Heap máximo muestreado | Escrituras |
|---|---:|---:|---:|---:|---:|---:|
| Nueva | 59,7 → 47,0 ms | 29,9 → 27,8 ms | 98 → 67 | 16,8 → 16,8 ms | 8,8 → 8,2 MB | 32 → 31 |
| Intermedia | 59,0 → 49,5 ms | 74,3 → 52,9 ms | 98 → 67 | 16,7 → 16,8 ms | 12,2 → 9,9 MB | 29 → 27 |
| Avanzada | 55,4 → 54,1 ms | 71,3 → 58,2 ms | 100 → 69 | 50,0 → 33,3 ms | 11,4 → 10,8 MB | 31 → 31 |

En una medición intermedia con la optimización del Bestiario aplicada, el recorrido avanzado pasó de 100 a 69 reconstrucciones, con una mediana de 66,9 a 57,2 ms por página. [Medición intermedia](piloto-bestiario.json)

La comparación de navegación incorpora también la reutilización de la lista del Cuaderno. Se midió sobre `d000472`. La sesión con perfil y los recorridos con uno y cinco naturalistas se repitieron con el manifiesto 5.0.3. Las tres partidas recorrieron las 1.000 fichas, mantuvieron las consultas tras cambiar de pestaña y conservaron la carga diferida de las miniaturas científicas visibles en el Bestiario. En el recorrido avanzado se visitaron Campo, Atlas, Investigación, Campamento, Expediciones, Comercio, Inventario, Sociedad, logros, perfil y las cinco salas del Museo.

En la partida avanzada, la primera apertura del Cuaderno llegó al segundo cuadro en 256 → 173 ms y la reapertura en 210 → 165 ms. El mayor bloqueo atribuido a navegación se mantuvo en 193 → 192 ms. El mayor del arranque subió de 708 a 810 ms en esa corrida. La primera pintura del Bestiario pasó de 237 a 258 ms. Estas últimas mediciones impiden dar por resuelto el inicio en frío. Los datos registran las aperturas de cada módulo, filtros, salas, cambios de región, intervalos de desplazamiento y tareas largas para volver a perfilar estos casos. [Mediciones detalladas](navegacion.json)

Con uno y con cinco naturalistas, el recorrido también avanzó por el motor en línea, conservó los filtros y mostró las 1.000 fichas. Ambos tamaños evitaron 31 reconstrucciones. Con cinco naturalistas se registró una mediana mayor por página en esta repetición con carga concurrente, de 58,3 a 95,9 ms. [Escenarios de un naturalista y cinco naturalistas](navegacion-equipos.json)

El perfil de navegación y el minuto de exploración activa avanzaron el número de avistamientos y mantuvieron un guardado verificable. Se abrió un estudio completo de cinco etapas y se observaron registros múltiples con multiplicador. Los muestreos asignaron menos tiempo propio a `renderPanel`. La disposición vinculada al Cuaderno y las actualizaciones de Campo siguieron siendo costosas en `bindPanel` y `updateFieldOutput`. Los cálculos de logros también aparecieron entre las funciones más muestreadas. El muestreo de CPU y los tiempos de navegación son mediciones separadas. [Perfil y sesión de exploración](navegacion-perfil.json)

## Recuperación y partidas

Se usó el respaldo avanzado de V5.0.1 que sirvió como referencia en V5.0.2, con SHA-256 `8ad9004ea8b02eef42c5f248cb63751dd3abd131f279ac3e77ff508e16f4089b`. Cada pareja inició con la misma semilla, reloj, catálogo y cantidad de naturalistas. El intervalo medido comienza al iniciar el procesamiento y termina cuando el cursor vacío queda guardado. En esta matriz hubo otras cargas en el entorno de trabajo, por lo que sus tiempos describen las ejecuciones observadas y se complementan con una repetición dirigida.

| Ausencia | Naturalistas | Recuperación en segundos | Tarea máxima en ms | Escrituras |
|---:|---:|---:|---:|---:|
| 1 h | 1 | 1,83 → 2,94 | 311 → 1.103 | 5 → 6 |
| 1 h | 5 | 2,32 → 1,54 | 478 → 324 | 5 → 5 |
| 1 h | 10 | 1,64 → 2,10 | 388 → 534 | 5 → 5 |
| 4 h | 1 | 3,12 → 3,65 | 401 → 436 | 7 → 8 |
| 4 h | 5 | 3,40 → 3,03 | 368 → 366 | 8 → 7 |
| 4 h | 10 | 6,11 → 3,02 | 496 → 368 | 10 → 7 |
| 8 h | 1 | 4,06 → 5,69 | 362 → 475 | 8 → 10 |
| 8 h | 5 | 5,47 → 4,81 | 486 → 337 | 10 → 9 |
| 8 h | 10 | 5,66 → 4,65 | 358 → 396 | 10 → 9 |
| 72 h | 1 | 4,59 → 4,08 | 330 → 390 | 9 → 8 |
| 72 h | 5 | 5,32 → 4,01 | 321 → 335 | 11 → 8 |
| 72 h | 10 | 4,05 → 4,04 | 312 → 407 | 8 → 8 |

Las dos últimas repeticiones de ocho horas con diez naturalistas, ejecutadas sin otras pruebas de la auditoría en paralelo y con orden alternado, dieron 3,03 s de recuperación y siete escrituras en ambas revisiones. Las tareas máximas fueron de 379 → 219 ms y 257 → 203 ms. En las otras dos repeticiones, la candidata tardó 4,07–4,49 s y la tarea máxima fue de 337–352 ms. Los resultados más recientes recuperan la referencia histórica de 3,0 s y sitúan la tarea máxima por debajo de 221 ms en esas dos ejecuciones. [Repetición dirigida](recuperacion-confirmacion.json)

Las doce parejas y una reapertura tras cierre brusco coincidieron en los 59 campos comparables, incluidos avistamientos por identificador, inventario, variantes, legendarios, monografías, investigaciones, recompensas, expediciones, excavaciones, sondeos, accesos y franjas vigentes de los cupos. El diario se excluyó de la igualdad porque agrupa el texto según los lotes procesados en cada tick. La comparación descartó las franjas caducadas hace más de ocho horas, cuya retirada depende de cuándo se vacía la cola. La reapertura retomó un cursor parcial ya guardado y llegó al mismo resultado de la sesión continua. [Matriz de recuperación y huellas por campo](recuperacion.json)

Se repitieron también nueve simulaciones del motor aislado, con 1, 8 y 72 horas sobre tres etapas de progreso. Las tres etapas se obtuvieron jugando desde el saldo inicial con las búsquedas, compras, publicaciones y subvenciones normales. La etapa avanzada tuvo diez naturalistas, 86 descubrimientos, 23 monografías, 12 clases de objetos y tres exposiciones. Las pruebas compararon 18 campos identificados, verificaron la reapertura de cada sesión y comprobaron el límite de ocho horas, los cupos de hasta 100 por especie y hora y la bonificación de Ictiología. [Simulaciones integrales](partidas.json)

## PWA, Android y arte

La PWA se comprobó sirviendo primero la revisión offline de V5.0.2, que declara 4.9.6, y después V5.0.3 en el mismo origen local. La descarga requirió autorización, conservó un respaldo idéntico al guardado anterior, verificó el manifiesto SHA-256 y activó la nueva caché. El juego conservó el recibo de progreso y abrió sin red el Bestiario con 1.000 fichas contabilizadas y el laboratorio. Se comprobaron 6.930 archivos del juego, más el marcador de integridad, y los filtros de 302 variantes albinas, 262 melánicas y 564 combinadas. [Validación PWA](pwa.json)

La comprobación estática de Android calculó `versionName` 5.0.3 y `versionCode` 50003. La experiencia móvil se verificó en Chromium emulado. La validación física de la PWA en Android queda pendiente. Se mantienen las 108 evaluaciones artísticas y las 456 variantes pendientes. [Comprobación Android](android-estatico.json) · [Inventario artístico](../auditoria-v501/AUD-04-arte.md)

## Regresión

La suite completa de la candidata aprobó **634 de 845** pruebas. Se reprodujeron los mismos 211 fallos históricos y se verificó la clasificación por identificador en los 227 casos de AUD-01. Los 16 que ya pasaban siguieron aprobados. Las dos pruebas nuevas verifican la reutilización de las láminas del Cuaderno y el ocultamiento al abrir un respaldo con menos descubrimientos. La comprobación de entrega y PWA aprobó 28 de 28 pruebas. [Resultado de regresión](regresion.json)

## Siguiente etapa

- Perfilar por separado la carga inicial, la disposición del Cuaderno y el primer cuadro del Bestiario. Las tareas largas de la sesión se concentran en momentos distintos. La diferencia entre el tiempo del controlador y el siguiente cuadro hace necesario medir estilo, disposición y pintura.
- Repetir con un Android físico y medir los casos de recuperación de ocho horas en un entorno exclusivo. Medir después los contadores del Campo y los cálculos de logros con y sin avistamientos.
- Conservar los casos pendientes de V5.0.2 sobre respaldos estructuralmente anómalos y el alcance textual de Ictiología. Continuar AUD-04 por familias con las 456 variantes pendientes. [Pendientes funcionales de V5.0.2](../auditoria-v502/README.md#pendientes) · [Auditoría artística](../auditoria-v501/AUD-04-arte.md)

## Reproducción

Ejecutar desde la raíz del repositorio con Playwright, Chromium y el historial de Git. La suite completa se ejecuta desde un árbol separado porque algunos ensayos históricos escriben sus propios informes.

```sh
git worktree add --detach /tmp/atlas-v502-base 626d390
AUD05_SAVE_DIR=/tmp/atlas-v503-partidas node scripts/aud01-playthrough.cjs
node scripts/aud05-navigation.cjs /tmp/atlas-v502-base/www /tmp/atlas-v503-partidas
AUD05_STAGE=initial,intermediate-five node scripts/aud05-navigation.cjs /tmp/atlas-v502-base/www /tmp/atlas-v503-partidas
AUD05_STAGE=advanced AUD05_EXTENDED=1 AUD05_CPU_PROFILE=1 AUD05_SOAK_MS=60000 node scripts/aud05-navigation.cjs /tmp/atlas-v502-base/www /tmp/atlas-v503-partidas
ATLAS_OFFLINE_EXACT=1 node scripts/aud02-offline-matrix.cjs /tmp/atlas-v502-base/www /tmp/atlas-v503-partidas/advanced.json
ATLAS_OFFLINE_CASE=8:10 ATLAS_OFFLINE_EXACT=1 node scripts/aud02-offline-matrix.cjs /tmp/atlas-v502-base/www /tmp/atlas-v503-partidas/advanced.json
AUD05_PWA_ONLY=1 AUD05_PWA_TRANSITION=1 AUD05_PWA_SAVE=/tmp/atlas-v503-partidas/advanced.json node scripts/aud01-browser.cjs /tmp/atlas-v502-base/www
npm run release:verify
git worktree add --detach /tmp/atlas-v503-pruebas HEAD
(cd /tmp/atlas-v503-pruebas && AUD01_OUTPUT=/tmp/atlas-v503-regresion node scripts/aud01-run.cjs)
```
