# El Gran Atlas · V5.0.2

La candidata continúa `audit/aud-01-v501` desde `4d3737d`. Conserva la versión pública 4.9.6 en su manifiesto y tiene una revisión propia de caché para las pruebas locales. La integración AUD-01 a AUD-04 y su evidencia permanecen disponibles. [Informe de V5.0.1](../auditoria-v501/continuacion-v501.md)

## Qué cambió en el motor

- **Búsquedas automáticas.** Se calcula una lista de especies con cupo por franja de cada tramo. Una especie sale de esa lista al alcanzar el cupo. Se reutilizan los pesos dentro del lote y se conserva el orden de suma, de resta y de tiradas originales. Se mantiene el máximo histórico de 10 naturalistas, las ocho horas offline, el límite de 100 registros por especie y hora y la frecuencia de cada nivel de investigación.
- **Recompensas y presentación.** El lote cuenta los registros al entregarlos y prepara una sola presentación final por tramo para Campo de superficie. Las muestras profundas conservan su presentación específica. Los contadores reutilizan el formateador numérico y el reemplazo del avistamiento deja de forzar un cálculo inmediato de geometría. La agregación del diario y el repintado visible siguen el ciclo periódico.
- **Escrituras.** Se omite un autoguardado periódico únicamente cuando el estado serializado y el registro durable siguen siendo idénticos. Las acciones explícitas y la comprobación del actualizador siguen intentando guardar. El cursor, el saldo y el botín se escriben como una sola partida.
- **Recibos.** Excavaciones y prospecciones retiran el trabajo y guardan su identificador, saldo y premio en la misma transacción. Un fallo de almacenamiento revierte también el inicio del trabajo. Los sondeos conservan sus identificadores liquidados al rotar el historial, como ya ocurría con expediciones científicas y comercio.
- **Ayudas y Corona.** Se retiraron las acciones internas y los botones de ayudas de Campo, compra ficticia y canje experimental. Corona muestra el saldo histórico, que sigue guardándose bajo `crownCoins`. Los saldos y los recursos existentes se conservan. Las pruebas antiguas de las ayudas ejercitan la revisión archivada por Git.

## Rendimiento

Chromium 156.0.8078.79 con viewport 390 × 844 y CPU ralentizada 4×. Las parejas alternaron el orden y usaron la misma partida avanzada, el mismo reloj y la misma semilla. La duración abarca desde el primer lote hasta que el cursor vacío quedó guardado. El retraso se midió con un sondeo de 40 ms durante la navegación y el heap se tomó al cierre de cada caso. Uno, cinco y diez naturalistas son ajustes controlados de la partida de medición. Las sesiones integrales de progresión se ejecutaron por separado. Cada fila muestra V5.0.1 → V5.0.2. La matriz se midió en `60be368`, antes del ajuste para conservar la entrada histórica de un yacimiento desconocido.

| Ausencia (h) | Naturalistas | Recuperación (s) | Tarea máxima (ms) | Retraso del sondeo (ms) | Heap JS (MB) | Escrituras |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1 | 8,1 → 2,9 | 788 → 678 | 794 → 680 | 9,3 → 10,5 | 12 → 7 |
| 1 | 5 | 10,5 → 3,4 | 831 → 838 | 1113 → 371 | 10,8 → 11,2 | 15 → 8 |
| 1 | 10 | 5,9 → 3,4 | 909 → 786 | 1186 → 320 | 13,0 → 9,4 | 12 → 8 |
| 4 | 1 | 9,7 → 7,2 | 414 → 746 | 560 → 916 | 12,4 → 12,8 | 17 → 14 |
| 4 | 5 | 8,8 → 3,0 | 323 → 425 | 476 → 250 | 13,8 → 9,7 | 14 → 7 |
| 4 | 10 | 8,7 → 4,2 | 418 → 455 | 404 → 248 | 10,9 → 10,7 | 14 → 8 |
| 8 | 1 | 13,7 → 4,1 | 551 → 250 | 338 → 199 | 12,3 → 10,3 | 19 → 8 |
| 8 | 5 | 13,6 → 4,6 | 494 → 303 | 756 → 271 | 13,1 → 12,0 | 19 → 9 |
| 8 | 10 | 9,6 → 3,0 | 359 → 221 | 535 → 165 | 11,7 → 12,2 | 15 → 7 |
| 72 | 1 | 8,1 → 3,0 | 251 → 267 | 141 → 80 | 12,3 → 12,6 | 13 → 7 |
| 72 | 5 | 10,0 → 3,0 | 196 → 200 | 215 → 112 | 11,9 → 11,6 | 15 → 7 |
| 72 | 10 | 9,0 → 3,0 | 213 → 225 | 162 → 141 | 10,7 → 12,9 | 14 → 7 |

Con ocho horas y diez naturalistas, la recuperación se redujo un 68 % y el máximo de la tarea bajó de 359 a 221 ms. Las 12 parejas conservaron idénticos inventario, avistamientos por especie, libras y conocimiento. El reloj de 72 horas aplicó el límite de ocho horas. La prueba adicional cerró el proceso de renderizado después de escribir avances parciales y recuperó los mismos resultados que la ejecución continua. Las tareas de navegación y el heap variaron entre casos. Los tiempos son observaciones de una ejecución por pareja en el entorno compartido. [Matriz y cierre interrumpido](rendimiento.json)

La repetición de ocho horas y diez naturalistas en la revisión final `a1a4fb9` dio 8,0 → 3,0 segundos, con tarea máxima de 315 → 261 ms y retraso del sondeo de 148 → 79 ms. El resultado económico y zoológico volvió a ser idéntico. [Repetición en la revisión final](rendimiento-confirmacion.json)

El perfil complementario de Chromium atribuyó cerca de 2,2 s de CPU al formateador de números en un escenario de V5.0.1. No apareció entre las veinte funciones de mayor tiempo propio de la candidata en ese muestreo. También registró costes en la preparación de avistamientos, la vinculación de acciones del DOM y el renderizado de los módulos. La optimización acota la preparación de avistamientos por lote y reduce escrituras duplicadas. El perfil conserva el tiempo de CPU JavaScript de cada función muestreada. [Perfil de CPU](perfil-cpu.json)

## Integridad y regresión

Antes de editar la persistencia se copió una partida avanzada generada en V5.0.1 y se verificaron 12 campos tras importarla y reabrirla. La candidata volvió a conservar esos mismos campos tras importar el respaldo. [Verificación de los campos](respaldo.json)

El SHA-256 del respaldo de control es `8ad9004ea8b02eef42c5f248cb63751dd3abd131f279ac3e77ff508e16f4089b`. Se reutilizaron además las pruebas de migraciones históricas, corrupción de escritura y cuota del almacenamiento.

El motor optimizado devolvió el mismo estado completo y consumió la misma secuencia y cantidad de tiradas que V5.0.1 en una prueba con censos, grupos y dos especialidades activas. En las pruebas de excavación y prospección se forzaron fallos de escritura al iniciar y recoger, además de volver a importar identificadores liquidados. En el sondeo se probó un identificador que había salido del historial visible. Las pruebas de comercio y expediciones conservaron su alcance. Se conservan los trabajos históricos de yacimientos desconocidos, sin habilitar su cobro. Los recibos antiguos sin identificador no permiten inferir trabajos liquidados antes de que existiera ese registro.

La PWA de la candidata instaló la revisión `gran-atlas-v4.9.6-naturalist-6d46d2018396` con verificación de integridad y reabrió sin red. Conservó el guardado, las 1.000 fichas del Bestiario y los filtros de 302 albinas, 262 melánicas y 564 variantes combinadas. [Prueba PWA](pwa.json)

La prueba de cierre inesperado retomó el último cursor escrito. Los cuadros que quedaron en memoria se recalcularon una vez desde ese punto. La prueba de Chromium mantuvo la semilla de ensayo junto al cursor para comparar los resultados exactos con una recuperación ininterrumpida. [Partidas integrales](partidas.json)

La suite completa en `a1a4fb9` aprobó 632 de 843. Los 211 fallos corresponden a los mismos casos históricos de la referencia, que aprobó 626 de 837. Se añadieron seis pruebas. El conjunto dirigido aprobó 77 de 77 y la verificación de entrega aprobó 28 de 28. La comprobación del respaldo de 3.30 pasó después de preservar su entrada de yacimiento histórico. [Resultado de regresión](regresion.json)

## Pendientes

- Reducir los bloqueos que todavía aparecen al navegar entre Campo y Cuaderno mientras el dispositivo procesa el atraso. Priorizar la vinculación masiva de acciones de `bindPanel` y el renderizado de los módulos, que siguieron apareciendo en el perfil. Repetir las mediciones en un Android físico cuando exista autorización para esa etapa.
- Completar la validación de respaldos estructuralmente anómalos, incluido el nivel cero del Museo. Mantener la adaptación de las pruebas históricas y aclarar el alcance de Ictiología en la interfaz.
- Continuar AUD-04 con las 456 variantes pendientes y las revisiones posteriores de dimorfismo, escalas, legendarios, relictos y homogeneidad. Se conservaron las 108 clasificaciones anteriores, las láminas y el laboratorio.
- Evaluar los límites de naturalistas, cadencias, probabilidades, cupos y economía en la etapa posterior de balanceo. La infraestructura de firma Android conserva su estado y la presente validación fue estática.

## Reproducción

Ejecutar desde la raíz con Chromium, Playwright y el historial Git completo. La suite se ejecuta en un árbol separado porque algunos bloques históricos generan informes propios.

    git worktree add --detach /tmp/atlas-v501-base 4d3737d
    (cd /tmp/atlas-v501-base && AUD01_ADVANCED_SAVE=/tmp/atlas-v501-save.json node scripts/aud01-playthrough.cjs)
    node scripts/aud02-offline-matrix.cjs /tmp/atlas-v501-base/www /tmp/atlas-v501-save.json
    ATLAS_OFFLINE_CASE=8:10 ATLAS_OFFLINE_PROFILE=1 node scripts/aud02-offline-matrix.cjs /tmp/atlas-v501-base/www /tmp/atlas-v501-save.json
    npm run release:verify
    AUD01_OUTPUT=/tmp/atlas-v502-regresion node scripts/aud01-run.cjs
