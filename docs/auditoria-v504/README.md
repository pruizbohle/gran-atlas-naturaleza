# El Gran Atlas · V5.0.4 · AUD-06

La candidata parte de V5.0.3 en `9812f77`, en la rama `audit/aud-01-v501`. La referencia es de 634 pruebas aprobadas de 845, 211 fallos históricos y una tarea de 810 ms en el arranque emulado. El catálogo, las láminas y las 108 evaluaciones pigmentarias se conservaron. [Informe de V5.0.3](../auditoria-v503/README.md) · [Auditoría artística](../auditoria-v501/AUD-04-arte.md)

## Arranque y causas comprobadas

Se ejecutaron tres aperturas por revisión y por tipo de partida, con contextos de navegador nuevos, Chromium 156.0.8078.79, viewport móvil de 390 × 844 y CPU ralentizada 4×. Se alternó el orden de las revisiones. El indicador de Campo listo termina tras montar su interfaz y esperar dos cuadros. La primera pintura registrada por el navegador puede corresponder a la cabecera del sitio. Chrome DevTools separó evaluación de scripts, HTML, estilos, disposición, pintura y decodificación de imágenes. Las duraciones de una tarea que contiene trabajo de varias categorías pueden solaparse.

| Partida | Campo listo, mediana y rango en ms | Mayor tarea de arranque en ms | Tareas superiores a 50 ms, mediana | Heap JS máximo muestreado en MB |
|---|---:|---:|---:|---:|
| Nueva | 1439 (1430–1441) → 1123 (970–1181) | 676 → 436 | 4 → 2 | 9,28 → 7,70 |
| Intermedia | 1394 (1254–1431) → 1081 (1080–1093) | 671 → 358 | 3 → 3 | 8,09 → 8,48 |
| Avanzada | 1451 (1303–1463) → 1113 (1062–1121) | 721 → 361 | 2 → 2 | 8,90 → 8,97 |

La tarea de 810 ms de V5.0.3 carecía de desglose. El perfil aislado reprodujo hasta 721 ms y atribuyó el tramo dominante a la evaluación síncrona de `app.js`. El archivo normalizaba los nombres de las doce especies legendarias una y otra vez, volvía a enumerar el catálogo al comprobar colisiones y, durante el cálculo inicial de logros, buscaba por referencia el ID de cada especie en todo el catálogo. El máximo de la candidata bajó a 436 ms. Con otras pruebas en paralelo, los máximos fueron 3891 y 2190 ms respectivamente. En esa serie, la mediana de Campo empeoró en la partida intermedia, de 4,47 a 7,15 s. La serie aislada es la referencia principal. [Trazas por repetición](arranque.json) · [Serie con carga concurrente](arranque-bajo-carga.json)

Se indexó la correspondencia taxonómica de legendarios y se consultó una vez por especie. Los catálogos regionales detectan duplicados con un conjunto de nombres. El índice inverso de variantes se crea al solicitarlo. Los logros, el Museo y el Bestiario comparten la taxonomía resuelta. El índice de resultados del Bestiario se construye al abrirlo. La disponibilidad de diplomas, medallas y encargos se sigue calculando antes de guardar, con los mismos módulos de reglas.

| Fase de la partida avanzada | Mediana V5.0.3 en ms | Mediana V5.0.4 en ms |
|---|---:|---:|
| Evaluación de `app.js` desde la entrada a la salida | 633,2 | 333,7 |
| Categorías de especímenes | 71,9 | 10,2 |
| Ampliaciones de catálogo y comprobación de nombres | 184,0 | 76,4 |
| Lectura y normalización del guardado | 11,1 | 10,2 |
| Lectura local incluida en el guardado | 0,1 | 0,0 |
| Índice de investigaciones | 0,6 | 0,5 |
| Logros | 147,1 | 38,2 |
| Encargos | 13,5 | 14,5 |
| Candidaturas del Museo | 30,8 | 28,2 |
| Primer render y guardado | 38,6 | 42,3 |
| Preparación del modelo visual | 11,9 | 13,1 |
| Inserción del DOM de Campo | 2,4 | 3,2 |
| Vinculación inicial del panel | 1,0 | 1,1 |

Se registraron aparte los intervalos de estilo, disposición, pintura y decodificación. Las diferencias de la primera apertura se explican en parte por el trabajo de disposición que medimos fuera del controlador JavaScript. También se conservaron los tiempos de recursos que reportó el navegador, incluidos los WebP. [Trazas de inicio y aperturas](arranque.json)

## Primeras aperturas

Las tarjetas fuera de pantalla del Bestiario y el selector regional del Cuaderno conservan su espacio y posponen la disposición de su contenido. La paginación, los datos, los enlaces de teclado y las ilustraciones siguen disponibles. El motor conserva la selección y los filtros al volver. El Campo reutiliza el cálculo de capacidad automática entre sus indicadores y actualiza sus secciones cuando cambia el marcado generado.

| Módulo, partida avanzada | Mediana al segundo cuadro en ms | Rango de V5.0.3 en ms | Rango de V5.0.4 en ms |
|---|---:|---:|---:|
| Cuaderno | 252 → 152 | 205–277 | 123–188 |
| Bestiario | 271 → 231 | 266–291 | 199–293 |
| Atlas | 107 → 118 | 106–120 | 113–127 |
| Investigaciones | 64 → 66 | 59–67 | 66–76 |
| Museo | 93 → 112 | 89–102 | 105–161 |
| Sociedad | 79 → 81 | 68–82 | 71–91 |
| Inventario | 65 → 70 | 60–82 | 59–73 |
| Campamento | 43 → 48 | 40–49 | 47–52 |

En la partida avanzada, la mediana de disposición bajó de 102,3 a 58,1 ms al abrir el Cuaderno y de 115,4 a 86,3 ms al abrir el Bestiario. En una partida nueva, sus medianas al segundo cuadro subieron de 89 a 110 ms y de 125 a 133 ms respectivamente. Un piloto intermedio, con los cambios de tarjetas fuera de pantalla, redujo la disposición en ambas repeticiones. El trabajo del Bestiario sigue siendo sensible a la cantidad de láminas descubiertas y a la carga del entorno. El recorrido táctil comprobó un descubrimiento real efectuado tras abrir el Bestiario, su ficha al volver, la restauración del foco, el avance de página con Enter, el filtro al regresar, un desplazamiento táctil de 165 px en Cuaderno y la conservación del filtro en paisaje. [Piloto de tarjetas](piloto-tarjetas.json) · [Validación de interacción](compatibilidad.json)

## Naturalistas activos

Se abrieron tres veces los escenarios de uno, cinco y diez naturalistas por revisión. Cada recorrido pasa por las 32 páginas y comprueba las 1.000 posiciones. Para cinco naturalistas se repitió la paginación con el mismo guardado y el reloj congelado, de modo que el trabajo visual se pudiera observar con el mismo catálogo sin avanzar las búsquedas.

| Naturalistas | Mediana del controlador en ms | Máximo del controlador en ms | Mediana al segundo cuadro en ms | Máximo al segundo cuadro en ms | Avistamientos durante cada recorrido |
|---:|---:|---:|---:|---:|---:|
| 1 | 67,0 → 22,3 | 298,6 → 104,0 | 118,8 → 103,2 | 444,3 → 433,6 | 0 / 0 / 0 → 0 / 0 / 0 |
| 5 | 57,1 → 21,5 | 151,6 → 55,3 | 103,5 → 89,7 | 267,5 → 315,5 | 5 / 4 / 4 → 4 / 3 / 4 |
| 10 | 62,1 → 19,9 | 207,8 → 130,7 | 110,1 → 94,8 | 331,5 → 464,5 | 5 / 5 / 4 → 5 / 3 / 5 |

Las medianas reúnen 93 cambios de página por configuración y revisión. Con cinco naturalistas, el controlador mejoró de forma consistente en la serie. El peor cuadro de la candidata fue más tardío, por lo que persisten picos de respuesta. El grupo de un naturalista ejecutó ticks sin registrar avistamientos durante esos recorridos cortos. Con cinco naturalistas y el reloj fijo, la mediana del controlador pasó de 53,8 a 21,0 ms y el segundo cuadro de 91,9 a 83,0 ms. La mejora de paginación también aparece al aislar el trabajo visual. [Control con reloj fijo](cinco-reloj-fijo.json) [Paginación por tamaño del equipo](naturalistas.json)

En una corrida instrumentada de cinco naturalistas con carga adicional, la disposición acumulada al recorrer las páginas pasó de 3,90 a 2,67 s. Las búsquedas en los cuadros de animación ocuparon 87 y 103 ms respectivamente. Los ticks dedicaron 1,66 y 1,78 s al guardado y su preparación. En ese tramo, la actualización del registro de Campo aportó menos de 7 ms porque ese módulo estaba oculto. Logros y encargos se midieron dentro de la preparación del guardado. La disposición y las transacciones periódicas compiten por el hilo principal. El perfil no atribuye el deterioro histórico de cinco naturalistas a un cambio de cadencia. [Perfil instrumentado de cinco naturalistas](perfil-cinco.json)

## Recuperación offline

| Ausencia | Naturalistas | Recuperación en segundos | Tarea máxima en ms |
|---:|---:|---:|---:|
| 1 h | 1 | 1,02 → 1,04 | 199 → 176 |
| 1 h | 5 | 1,05 → 1,05 | 208 → 172 |
| 1 h | 10 | 1,03 → 1,04 | 229 → 155 |
| 4 h | 1 | 2,06 → 2,04 | 186 → 167 |
| 4 h | 5 | 2,05 → 2,05 | 336 → 238 |
| 4 h | 10 | 2,08 → 2,04 | 192 → 323 |
| 8 h | 1 | 3,04 → 3,03 | 202 → 148 |
| 8 h | 5 | 3,02 → 3,02 | 215 → 217 |
| 8 h | 10 | 3,02 → 3,02 | 212 → 247 |
| 72 h | 1 | 3,03 → 3,02 | 256 → 148 |
| 72 h | 5 | 3,03 → 3,03 | 186 → 197 |
| 72 h | 10 | 3,02 → 3,02 | 253 → 148 |

En los doce pares y en la reapertura tras un cierre durante la recuperación coincidieron los 59 campos comparables. Se excluyó el diario, que agrupa el texto según los lotes de cada tick. Para los cupos se compararon las franjas vigentes y se descartaron las caducadas. La prueba de ocho horas con diez naturalistas duró 3,02 s en la matriz. En una repetición aislada duró 3,04 → 3,01 s, con una tarea máxima de 209 → 152 ms y siete escrituras por revisión. La tarea de la candidata fue de 247 ms en la matriz. [Matriz, reapertura y repetición aislada](recuperacion.json)

## Guardados, PWA y Android

Las tres partidas reproducibles se formaron jugando desde la etapa inicial. Las nueve simulaciones aisladas conservaron el resultado de V5.0.3 en cada etapa, con ausencias de 1, 8 y 72 horas. La comparación excluyó el tiempo de ejecución. La selección de campos incluye expediciones y recompensas, inventario, investigaciones, registros por especie, monografías y variantes. [Simulaciones del motor](partidas.json)

Chromium interrumpió el proceso justo después de leer y normalizar el guardado, antes de guardar. Se comprobó la igualdad exacta del archivo antes de reabrir y se verificaron once campos de la partida avanzada recuperada. Desde el diálogo de Respaldos también se importó un archivo 3.19.9, con sus avistamientos por identificador, monografías, inventario y compras.

El límite de ocho horas se aplica a las búsquedas automáticas. Una prueba de partidas preparadas añadió una operación comercial de 24 horas al guardado de referencia. Su ID seguía pendiente al reabrir después de ocho horas. Después de 72 había exactamente un recibo y se había abonado el premio. El motor liquida los trabajos temporizados comparando su vencimiento con la hora de regreso. El tramo de búsquedas conserva su propio límite. [Comprobación del trabajo de 24 horas](comercio-24h.json)

La actualización local de V5.0.3 a V5.0.4 requirió autorización, comprobó la revisión SHA-256 y guardó una copia exacta de la partida avanzada antes de activarse. El juego reinició sin red con las 1.000 fichas contabilizadas y los filtros de 302 variantes albinas y 262 melánicas disponibles en el laboratorio. El manifiesto de entrega verificó 6.930 archivos del juego y la revisión del laboratorio. La comprobación estática de Android dio código 50004. Las pruebas táctiles, de orientación y de PWA se hicieron en Chromium emulado. La validación en Android físico sigue pendiente. [Interacción, cierre y actualización](compatibilidad.json)

## Regresión automatizada

Aprobaron **636 de 847 pruebas**. Se reprodujeron los mismos 211 fallos históricos. En el inventario de 227 casos de AUD-01 coinciden los 211 fallos y los 16 aprobados. La comprobación de entrega aprobó 28 de 28 pruebas. Las dos pruebas nuevas verifican el índice diferido del Bestiario y la equivalencia taxonómica y de variantes en las 1.000 fichas.

Un piloto editó los módulos de logros y curaduría y activó la prueba de integridad de código. La candidata conserva esos archivos byte por byte y aplica las mejoras a la indexación y las consultas del catálogo. La prueba original pasa sin ajustes. [Resultados por identificador](regresion.json)

## Continuidad

Las 108 variantes evaluadas y las 456 pendientes conservan su inventario. El wombat albino, el cuervo albino, el ajolote albino y el salmón rosado albino siguen como referencias artísticas. [Inventario AUD-04](../auditoria-v501/continuacion-v501.md)

Para cerrar la estabilización, conviene medir en Android físico la PWA instalada, el arranque con caché caliente, la primera vista de un Bestiario avanzado y un ciclo de ocho horas con diez naturalistas. Las tareas restantes se pueden perfilar por separado entre evaluación síncrona, disposición de tarjetas visibles y persistencia bajo carga. Después corresponde completar AUD-04 por familias y pasar a la consolidación global.

## Reproducción

Ejecutar desde la raíz con Chromium, Playwright e historial completo de Git. La suite se ejecuta en un árbol separado porque algunas pruebas escriben informes históricos.

```sh
git worktree add --detach /tmp/atlas-v503-base 9812f77
AUD05_SAVE_DIR=/tmp/atlas-v504-fixtures node scripts/aud01-playthrough.cjs
node scripts/aud06-startup.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures
AUD06_ACTIVE=1 AUD06_PAGES=1 AUD06_STAGES=initial,intermediate-five,advanced node scripts/aud06-startup.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures
AUD06_PAGES=1 AUD06_STAGES=intermediate-five node scripts/aud06-startup.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures
AUD06_ACTIVE=1 AUD06_PAGES=1 AUD06_PAGING_DETAIL=1 AUD06_STAGES=intermediate-five AUD06_REPEATS=1 node scripts/aud06-startup.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures
AUD06_STAGES=new AUD06_REPEATS=1 AUD06_QA=1 node scripts/aud06-startup.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures candidate
AUD06_INTERRUPT=1 node scripts/aud06-startup.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures candidate
ATLAS_OFFLINE_EXACT=1 node scripts/aud02-offline-matrix.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures/advanced.json
ATLAS_OFFLINE_EXACT=1 ATLAS_OFFLINE_TRADE24=1 ATLAS_OFFLINE_CASE=72:10 node scripts/aud02-offline-matrix.cjs /tmp/atlas-v503-base/www /tmp/atlas-v504-fixtures/advanced.json
AUD05_PWA_ONLY=1 AUD05_PWA_TRANSITION=1 AUD05_PWA_SAVE=/tmp/atlas-v504-fixtures/advanced.json node scripts/aud01-browser.cjs /tmp/atlas-v503-base/www
npm run release:verify
git worktree add --detach /tmp/atlas-v504-pruebas HEAD
(cd /tmp/atlas-v504-pruebas && AUD01_OUTPUT=/tmp/atlas-v504-regresion node scripts/aud01-run.cjs)
```
