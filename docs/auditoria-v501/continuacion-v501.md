# V5.0.1 · Segunda etapa de consolidación

La rama local `audit/aud-01-v501` ya contenía los diez commits de `audit/v501-aud01` desde `5567e9d`. Las referencias remotas comprobadas siguen en `c8af26e` para `main` y `1ac134d` para la auditoría paralela. Esta etapa continuó desde `c976671`, con versión pública 4.9.6 en la candidata.

## AUD-01 · Regresión

Se reutilizó la reproducción individual y la clasificación de las 227 condiciones iniciales fallidas. El registro conserva 104 pruebas obsoletas, 75 problemas del arnés, 45 cambios intencionados y 3 casos de un mismo fallo en el generador histórico de dimorfismo. [Clasificación original](aud01-resultados.json) · [Informe de integración](integracion-v501.md)

La comparación integral de `96badbc` ejecutó 837 pruebas. Aprobó 626 y mantuvo los mismos 211 fallos de `c976671`. Los 227 resultados históricos conservaron su estado desde la integración anterior. Tres comparaciones históricas incorporaron una aserción explícita sobre el recibo nuevo y siguen comparando todas las variables económicas de la referencia. [Evidencia de regresión](aud01-continuacion-regresion.json)

La verificación específica de entrega aprobó 28 de 28 pruebas. El conjunto de guardado, Campo, migraciones históricas y Android estático aprobó 59 de 59. Las cuatro comprobaciones añadidas reproducen sustitución por ID con totales iguales, migración de alias con progreso posterior, liquidación de un regreso fuera del historial visible y recuperación por cuadros con guardado al salir.

## AUD-03 · Partidas y recompensas

La restauración copia el respaldo de entrada, aplica las migraciones y comprueba que el almacenamiento recibió exactamente la partida que preparó el motor. Si la comprobación falla, repone la escritura anterior y recupera el estado previo de la sesión. La copia de emergencia permanece disponible. Los avisos de interfaz posteriores a una escritura exitosa se gestionan fuera del resultado de la transacción. La comprobación posterior coteja el último estado persistido, de modo que un cuadro de procesamiento pendiente o una compra normal entre el aviso y la comprobación puedan convivir con la restauración.

La prueba de integración altera los avistamientos de zorro por lobo y borra inventario sin variar el total de avistamientos, dinero o prestigio. El importador rechaza la escritura y conserva el original. Otra prueba fusiona alias del quebrantahuesos, conserva el nivel de estudio superior y confirma la partida tras un gasto legítimo. La revisión por identificador verifica la escritura del estado ya migrado. Los límites de los campos en un respaldo estructuralmente inválido, como el ala cero del Museo, siguen en el registro de consolidación.

Las expediciones científicas guardan el identificador de liquidación más allá de los doce recibos visibles. Un regreso válido se contabiliza una vez por partida guardada, incluso si reaparece un trabajo con el identificador numérico como texto. El historial truncado de un respaldo antiguo únicamente permite reconstruir los identificadores que todavía contiene. Importar un respaldo anterior restaura también su economía y sus recibos disponibles. No se acumulan premios del futuro sobre el saldo restaurado.

## AUD-02 · Campo e investigaciones

En una pantalla visible, la recuperación procesa la cola en cuadros con un presupuesto de 8 ms que se comprueba entre intentos y un máximo de 500 intentos por tramo. El intervalo periódico sigue coordinando la interfaz y el almacenamiento. Al abandonar la página se intenta guardar el avance que quede entre dos escrituras periódicas. Volver a mostrar la página reanuda el trabajo. El tope de ocho horas y los cupos de 100 registros por especie y hora siguen vigentes.

En Chromium con viewport 390 × 844 y CPU ralentizada 4×, se compararon los dos motores con la misma partida de diez naturalistas, ocho horas de atraso y semilla fija. En unos cinco segundos se retiraron 2.500 intentos pendientes en la base y 9.272 en la candidata. La candidata terminó y guardó la cola unos 16,1 segundos después de detectar el primer lote. El muestreo registra tareas largas en ambas revisiones durante la navegación entre Campo y Cuaderno. El máximo observado durante esa ventana fue de 257 ms en la base y 392 ms en la candidata. La recuperación termina antes y queda pendiente mejorar la respuesta durante la navegación en este escenario. [Mediciones en Chromium](aud01-continuacion-navegador.json)

Chromium también instaló la revisión `gran-atlas-v4.9.6-naturalist-d918d878d73a` con verificación de integridad y abrió el juego offline. El Bestiario mantuvo las 1.000 fichas y los tres filtros del laboratorio devolvieron 302 albinas, 262 melánicas y 564 combinadas.

Se reutilizaron los casos integrales de prismáticos, catalejo, cuaderno, capacitación, equipo y censo. La simulación de referencias comprueba Ictiología II con recursos ganados jugando. El peso de un pez payaso raro pasa de 1,8 a 2,97 y el calamar de Humboldt sigue en 1,8. Se revalidaron los importes, materiales y tiradas frente al motor histórico para 64 combinaciones de ruta, Paleontología y equipo. Las nueve sesiones de 1, 8 y 72 horas se repitieron y compararon también los identificadores de viajes liquidados. [Resultados integrales](aud01-continuacion-partidas.json) Queda pendiente precisar el alcance que describe la interfaz, porque los cefalópodos se muestran en Peces en el Bestiario. Los bonos aplicables a un intento pendiente se consideran al ejecutarlo.

La retirada de ayudas y coronas tiene su secuencia de inventario, retirada de entradas, pruebas y preservación de respaldos en el plan existente. Queda pendiente decidir qué hacer con las coronas históricas sin canjear. [Plan de retirada](retiro-ayudas.md)

## AUD-04 · Pigmentación

Se revisaron 20 variantes de Mustelidae y 21 de Accipitridae. Se comparó cada lámina normal y su variante, incluidas miniaturas WebP de 64 y 128 px en crema y carbón. Como referencias se usaron el volumen y los tejidos del wombat, la estructura de plumas y tejidos del cuervo, las branquias y el ojo del ajolote y la lectura de aletas y ojo del salmón rosado.

En este lote quedaron 2 correctas, 25 mejorables y 14 insuficientes. Se conservaron como correctos el águila calva y el alimoche albinos. En los mustélidos se priorizan las vibrisas, la trufa, el relieve del pecho y la identidad en las nutrias y turones de aspecto similar. En las rapaces se priorizan los ojos, la cera del pico, los tarsos y la separación de primarias, además de verificar la pigmentación de los morfos dudosos. Las correcciones se documentan por componente anatómico. El generador de hojas de auditoría muestra las nuevas decisiones. Los archivos de las láminas y del laboratorio jugable conservan su contenido. [Mustélidos](aud04-mustelidae.json) · [Accipítridos](aud04-accipitridae.json)

El inventario acumula **108 variantes revisadas de 564** y 456 pendientes. De las 108, hay 6 correctas, 60 mejorables y 42 insuficientes. A continuación corresponden las restantes por familia y, más adelante, dimorfismo, escalas, legendarios, relictos y homogeneidad. La comprobación Android fue estática. La prueba física y la autorización de publicación siguen pendientes.


## Reproducción

Ejecutar desde un checkout con historial Git. La suite completa se ejecuta en un árbol desechable porque algunas pruebas regeneran sus informes antiguos.

    AUD01_OUTPUT=/tmp/atlas-v501-regresion node scripts/aud01-run.cjs
    npm run release:verify
    node --test tests/aud01-online-offline.test.cjs tests/live-save.test.cjs tests/and3420-migrations.test.cjs tests/and3420-native.test.cjs
    AUD01_ADVANCED_SAVE=/tmp/atlas-v501-partida.json node scripts/aud01-playthrough.cjs
    git worktree add --detach /tmp/atlas-v501-previa c976671
    AUD01_ADVANCED_SAVE=/tmp/atlas-v501-partida.json node scripts/aud01-browser.cjs /tmp/atlas-v501-previa/www
    node scripts/aud04-contact-sheets.cjs --family Mustelidae
    node scripts/aud04-contact-sheets.cjs --family Accipitridae
