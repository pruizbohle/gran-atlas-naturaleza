# MEC-09D §19–§20 · Encargos, disponibilidad (AVAIL), calendario y progreso sin conexión

## Herramientas

- **Pruebas:**
  - `tests/mec09d-commissions.test.cjs`, con 8 pruebas;
  - `tests/mec09d-calendar.test.cjs`, con 7 pruebas.
- **Motor:** el vigente, con el catálogo completo.
- **Perfiles de jugador** (para el tablero de encargos):
  - partida nueva;
  - las tres partidas de referencia de MEC-09C: intermedia, avanzada y final MEC-09B;
  - «todas las regiones»: desbloqueadas y visitadas;
  - «casi completo»: 999 monografías publicadas.

## §19 Encargos y disponibilidad

| Comprobación | Resultado |
|---|---|
| 36 encargos permanentes (24 de 3.37 y 12 de MEC-08) | Identificadores únicos. Cadenas «previo» válidas y sin ciclos. Todas las métricas las calcula el motor (también las dinámicas, como `craft:*`). Premios con objetos existentes y valores no negativos |
| Alcanzabilidad de los 36 | Ninguno bloqueado ni incoherente. 24 con evidencia D (desde partida nueva) y 12 con evidencia C (motor real con condiciones preparadas), según `docs/mec09b/encargos.csv` |
| Tablero AVAIL: 10 periodos de 72 h en cada uno de los 6 perfiles | **Ninguna oferta imposible**. Todo objetivo es viable según AVAIL, y ningún objetivo incremental sobre contenido finito supera lo que queda (por ejemplo, en «casi completo» no se piden más monografías de las pendientes). No se ofrecen plantillas ya activas. El tablero de un periodo **no se regenera** al recargar |
| Política | Periodo de 72 h. 3 encargos de correspondencia y 1 proyecto por periodo. Los encargos aceptados no caducan |
| Abandonar | Sin coste: dinero, conocimiento e inventario no cambian. El encargo queda «abandonado» y el hueco se libera |
| Inactividad | 60 días sin actuar no cambian recursos ni caducan encargos aceptados |
| Completar y cobrar | Un proyecto de excavaciones se completa con excavaciones reales y se cobra **una sola vez**. Tampoco cobra de nuevo tras recargar |
| Integración | Las métricas de los encargos leen el mismo estado que Sociedad (logros), exploración, colecciones, Museo y Campamento. AVAIL consulta catálogo, regiones accesibles, capacidad del Museo y gabinetes, instrumentos y niveles de Taller y Caravana |

**Sin errores funcionales.**

## §20 Calendario

Los diez eventos son anuales y se fijan por día civil local. Fechas de 2027:

| Evento | Inicio 2027 | Días | Modificadores |
|---|---|---|---|
| Año Nuevo | 1 ene | 7 | – |
| Día de Darwin | 12 feb | 5 | – |
| Equinoccio de marzo | 19 mar (víspera del equinoccio) | 3 | Campo botánico +25 % |
| Día de la Tierra | 22 abr | 5 | Prospección geológica +15 % |
| Día de la Biodiversidad | 22 may | 5 | – |
| Día de los Océanos | 8 jun | 7 | Expedición oceanográfica +20 % |
| Gran Exposición | 1 ago | 14 | – |
| Equinoccio de septiembre | 22 sep (víspera del equinoccio) | 3 | Campo oceanográfico +25 % |
| Noche de las Criaturas | 30 oct | 3 | – |
| Navidad del Naturalista | 24 dic | 9, hasta enero | – |

| Comprobación | Resultado |
|---|---|
| Activación | Se mantiene el estado aprobado: los diez eventos de MEC-08 se activan por calendario. Los eventos de coleccionables de MEC-03 siguen **desactivados** |
| Ediciones 2026–2032 | Empiezan a medianoche local y duran exactamente sus días (con cambio de hora incluido). Las de fecha fija caen en su día y mes; las de equinoccio, la víspera |
| Cambio de año | La Navidad del Naturalista sigue activa el 1 de enero del año siguiente |
| Zona horaria | Las fechas fijas empiezan el mismo día local en Santiago, Madrid, Tokio, Kiritimati (UTC+14) y Pago Pago (UTC−11). Los equinoccios pueden variar ±1 día según la zona, porque el equinoccio es un instante universal |
| Encargo de evento | Se acepta dentro de su edición y una sola vez. Al cerrar la edición queda caducado o completado. Si caducó no se cobra; si se completó, se cobra una vez. Se conserva al recargar |

## §20 Progreso sin conexión

| Comprobación | Resultado |
|---|---|
| Tope de 8 h | Solo afecta a las búsquedas automáticas, como siempre: una ausencia de 72 h deja **los mismos avistamientos** que una de 8 h |
| Actividades durante la ausencia | Expediciones y rutas comerciales se liquidan **una vez y sin tope** tras 8 h y tras 72 h. La excavación termina y queda lista para recogerse, y se recoge una sola vez |
| En línea frente a sin conexión | Una hora en ciclos de 60 s y una hora de golpe dejan los mismos avistamientos y el mismo conocimiento |
| Reloj que retrocede | No da progreso, no deshace trabajos liquidados ni provoca ráfagas. Al volver a avanzar no se liquida nada dos veces |

Cobertura complementaria, toda en verde:
- `aud01-online-offline`: cursor de búsquedas, cupos por hora, 72 h frente a 8 h;
- `persistence-v3240`: equivalencia de 8 h;
- `mec09a`: horizonte efectivo de las fechas de actividad.

**Sin errores funcionales.**
