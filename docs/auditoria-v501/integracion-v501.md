# V5.0.1 · Informe de integración y resultados

Se integraron los diez commits de auditoría sobre V4.9.6 en `audit/aud-01-v501`. El commit `5567e9d` conserva el historial de la rama de trabajo paralelo y el filtro de variantes de `main`. La candidata de auditoría se mantuvo en un árbol separado. La versión pública sigue en 4.9.6.

## AUD-01 · Reproducción y clasificación

La base ejecutó 821 pruebas en Node 24.22.1, con 594 aprobadas y 227 fallidas. Los 227 fallos se reprodujeron también lanzando cada caso por separado. En dos archivos el fallo ocurrió al cargar el arnés, antes de registrar subpruebas.

| Clasificación de la primera condición fallida | Casos |
|---|---:|
| Prueba obsoleta | 104 |
| Problema del entorno de pruebas | 75 |
| Cambio funcional intencionado | 45 |
| Error funcional real | 3 |
| Error crítico confirmado por un caso histórico | 0 |
| Pendiente de investigación sobre causa inicial | 0 |
| **Total** | **227** |

Los tres errores reales remiten al mismo generador histórico de dimorfismo, que devuelve `Stale production lab`. Los errores de guardado y progresión descritos abajo se confirmaron mediante pruebas nuevas. Los dos barridos globales de V3.24 fallan primero porque intentan entrar al Caribe sudamericano sin el mapa acreditado y siguen en HX-05-04. Tras acreditar los mapas, reaparecen expectativas históricas sobre hábitat polar y observación directa profunda. La causa inicial está localizada y queda pendiente adaptar el barrido completo a los métodos actuales. La [matriz individual](aud01-resultados.json) contiene los 227 títulos, archivos, aserciones, observaciones y commits causantes identificados.

La candidata validada en `90dd1cc` ejecutó 833 pruebas. Aprobó 622 y registró 211 fallos, todos de la línea base. Se recuperaron 16 pruebas históricas y se añadieron 12 comprobaciones. No se quitaron casos ni se agregaron omisiones. La verificación específica de entrega aprobó sus 28 comprobaciones. Ocho casos adicionales de acceso y avistamiento en Polos, superficie, profundidad y fosas aprobaron en una ejecución aparte al acreditar sus mapas en una copia del fixture, conservando las aserciones y el motor de la base. Siguen contabilizados como fallos en la suite porque esa preparación solo se usó para aislar la causa.

Se actualizaron los contratos de versión del exportador y de Android usando la versión declarada. Las garantías de igualdad de las tres entregas artísticas anteriores ahora comparan los commits de cada entrega. Las comprobaciones actuales siguen validando rutas, recursos, especies, legendarios y variantes. La prueba de las seis partidas históricas verifica los dos campos nuevos y compara todos los campos anteriores al cargar e importar.

## AUD-02 y AUD-03 · Hallazgos en el motor

| ID | Prioridad | Módulo y causa | Impacto y comprobación | Estado y acción |
|---|---|---|---|---|
| AUD02-01 | P1 | Campo. El reloj descontaba todos los intentos calculados antes de limitar el ciclo a 500. | Una ausencia de una hora a 5 s pierde intentos. La prueba de reapertura exige exactamente 720 intentos repartidos entre ciclos. | Corregido en `f58c7c7`. La cola y la fracción se guardan con el avance del jugador. |
| AUD02-02 | P1 | Campo. La capacidad de la hora actual y la primera hora saturada detenían el lote completo. | Se perdían horas con cupo disponible. Las pruebas verifican horas anteriores, cambio de región, censo con un registro libre y máximo de 100 por especie/hora. | Corregido en `f58c7c7`. Se respetan las ocho horas y los cupos existentes. El lote conserva región, estación, horario, hábitat y método de la zona al programarse. |
| AUD03-03 | P1 | Expediciones. Una lista importada podía incluir el mismo identificador dos veces. Las expediciones ordinarias dependían de un guardado posterior a la liquidación. | Una partida anómala permitía un cobro doble o dejaba un cobro en memoria con disco desactualizado. Pruebas con ID numérico y textual, historial, reinicio y cuota llena en regreso automático y manual. | Corregido en `43a914b`. Se deduplican los trabajos registrados y se liquida con persistencia transaccional. |
| AUD03-04 | P1 | Respaldos. La restauración persistía antes de terminar de actualizar los contadores y la interfaz. | Una excepción podía devolver el estado previo en memoria y dejar guardado el estado importado. La prueba inyecta una excepción en el contador y compara ambos estados. | Corregido en `43a914b` para el fallo reproducido. |
| AUD03-01 | P1 | Respaldos. El recibo muestra agregados de avistamientos, monografías, prestigio, región y algunas comprobaciones monetarias. | Un total estable puede ocultar sustitución por ID o pérdida de inventario y etapas. La limitación viene de los casos aislados y de inspeccionar `AtlasSaveBridge` y `restoreSelected`. | Comparar un estado normalizado por IDs antes y después. Incluir operaciones que ya liquidaron fuera del historial reciente y rollback de notificaciones. |
| AUD03-02 / AUD02-05 | P2 | Museo y respaldos. El motor admite un ala cero y `museumCapacity` usa un fallback que devuelve 12. | La prueba integral importa el ala cero y confirma la capacidad incorrecta. Los límites de etapas y otros campos estructurados requieren validación adicional. | Validar los rangos documentados al normalizar respaldos conservando los datos originales. |
| AUD02-03 | P1 antes de publicar | Campo y Corona. Las acciones de prueba siguen accesibles desde el producto. | El código confirma concesiones directas y el caso aislado confirma coronas canjeables 1 a 1 por libras. | [Retirada preparada](retiro-ayudas.md). Aplicarla en un cambio propio y probar compatibilidad de guardados. |
| AUD02-04 | P2 | Investigación. Ictiología usa la clase zoológica. Su texto se refiere a «peces» y el Bestiario también muestra cefalópodos en ese grupo jugable. | Ictiología II llevó el peso de dos ejemplares raros de 1,8 a 2,97 para el pez payaso y mantuvo 1,8 para el calamar de Humboldt, después de comprar ambos niveles con los recursos de la partida avanzada. | Resolver alcance y descripción en una entrega de consolidación. |
| AUD02-06 | P1 antes de publicar | Campo móvil. Un ciclo de recuperación puede ejecutar hasta 500 búsquedas más la actualización de la interfaz y persistencia. | Con diez naturalistas, la captura de navegador registró tareas largas y la simulación necesitó más de 110 ciclos para ocho horas. | Evaluar un presupuesto de tiempo por ciclo y documentar cómo termina la recuperación al volver de segundo plano. Los bonos de una búsqueda pendiente se leen al ejecutarla. Confirmar si se deben fijar al encolarla. |

Las pruebas con el motor verificaron que prismáticos y catalejo cambian el umbral manual de 50 % a 74 %, que el cuaderno concede el conocimiento redondeado correspondiente, que capacitación y equipo equipado cambian el umbral automático hasta 60,04 %, que una undécima contratación se rechaza y que el último nivel mantiene la cadencia de 0,5 s. Las comprobaciones aisladas de AUD-02 y AUD-03 mantienen su alcance original. El informe no acredita todavía todas las bonificaciones, ni una validación exhaustiva por ID de partidas largas.

## Partidas integrales y rendimiento

La partida comenzó con el saldo inicial ordinario de £420. Las etapas se obtuvieron mediante búsquedas, compras, subvenciones con espera, estudios y monografías, viajes y actividad del Museo. Se controlaron reloj y semilla de azar. No se usaron ayudas de Campo, coronas ni recursos añadidos al guardado. Las tres instantáneas se copiaron para regresar independientemente tras 1, 8 y 72 horas.

| Etapa | Juego activo simulado | Naturalistas | Especies descubiertas | Prestigio | Atraso de 8 h liquidado |
|---|---:|---:|---:|---:|---:|
| Inicial | 12 búsquedas manuales previas | 1 | 4 | 0 | 12 ciclos |
| Intermedia | 1,5 h | 2 | 33 | 0 | 115 ciclos |
| Avanzada | 27,5 h | 10 | 86 | 23 | 111 ciclos |

Las nueve reaperturas conservaron los avistamientos, inventario, estudios, equipo, Museo, expediciones, comercio y demás campos enumerados en los resultados. Un segundo ciclo al mismo tiempo tampoco alteró esos registros ni volvió a conceder recompensas. La etapa avanzada alcanzó cinco regiones, tres exhibiciones y 17 expediciones científicas completadas. La simulación no llegó a los requisitos intercontinentales ni recorrió toda la progresión abisal. En partidas intermedias y avanzadas, 8 y 72 horas pueden otorgar distintas cantidades de avistamientos porque las ocho horas aceptadas al volver no necesariamente comparten el mismo cupo previo. La prueba determinista aparte confirma el máximo de horas con el equipo en condiciones equivalentes. [Resultados de las nueve sesiones](aud01-partidas-integrales.json)

Chromium móvil emulado a 390 × 844 y CPU ralentizada 4×, tres pasadas por revisión. Medianas base → candidata, arranque 2.034 → 1.793 ms, giro de página del Bestiario 95,8 → 87,2 ms y heap JavaScript tras recolección 4,63 → 4,62 MB. Las 1.000 fichas se recorrieron en 32 páginas. La apertura del Cuaderno osciló entre pasadas y su mediana pasó de 134,7 a 158,5 ms. El muestreo es pequeño y comparte el entorno con las demás pruebas. Durante la recuperación con diez naturalistas, el heap medido fue 8,42 MB y la tarea larga máxima registrada, incluido el arranque, fue de 701 ms. [Datos de Chromium](aud01-navegador.json)

La PWA verificó integridad, activó la caché autorizada, conservó el recibo al volver y abrió el juego sin red. Se recorrieron Campo, Cuaderno, Museo y Bestiario. Los filtros del laboratorio devolvieron 302 albinas, 262 melánicas y 564 en conjunto sin conexión. El manifiesto coteja 6.930 recursos y 129.207.119 bytes. La lámina animal suma 104.439.218 bytes y los paisajes 417.488 bytes. Chromium registró 6.931 entradas de caché contando el propio manifiesto. Se verificaron los adaptadores de versión, identidad y registro nativo de Android con pruebas estáticas. La validación en un dispositivo físico sigue pendiente. [Datos del navegador](aud01-navegador.json)

## AUD-04 · Variantes por familia

Se revisaron las 29 láminas pigmentarias de Felidae y las 23 de Canidae en claro y oscuro, a 64 y 128 px, con la lámina de 512 px como fuente de la vista comparada. Son 46 incorporaciones y 6 reevaluaciones sobre la muestra previa. Resultado acumulado de las 564 fichas de variante, **67 revisadas y 497 pendientes**. En las dos familias, 24 láminas quedaron insuficientes y 28 mejorables. Se documentan por lámina la pérdida de ojos y tejidos en albinos, el contraste de patas y hocico en melánicos, la lectura de rosetas o rayas y los casos que requieren confirmar el morfo. [Registro Felidae y Canidae](aud04-felidae-canidae.json)

Se conservan como referencias positivas wombat, cuervo, ajolote y salmón rosado albinos. Permanecen byte a byte los recursos existentes. El chequeo de cobertura mantiene 1.000 especies, 125 regiones, 1.672 láminas, 6.688 archivos de animales, 16 paisajes, 12 legendarios, 9 relictos y las cuatro escalas especiales. La aprobación de futuros ajustes requiere trabajo localizado en ojos, tejidos, pelo y volumen, además de confirmación zoológica del morfo cuando corresponda. Los cambios globales de brillo, saturación o contraste son insuficientes como acabado.

## Orden de consolidación

1. Verificar recibos y operaciones persistentes por ID, añadir casos de almacenamiento lleno y revisar la compatibilidad con partidas largas. Mantener la copia de seguridad original de cada importación.
2. Actualizar la preparación cartográfica, las presencias polares y los métodos profundos en los barridos globales, y volver a validar sus contratos completos de elegibilidad y censo. Mantener las pruebas históricas y restaurar sus entornos de ejecución.
3. Reducir las tareas largas de la recuperación en Campo y probar el presupuesto de procesamiento en un Android autorizado. Aislar la retirada de ayudas y coronas en su propia actualización.
4. Corregir las variantes insuficientes por familia con revisión zoológica y visual. Continuar con las 497 variantes restantes, dimorfismo, escalas, legendarios, relictos y homogeneidad. La auditoría artística no cambia las reglas ni las tasas de aparición.
