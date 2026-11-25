# MEC-09B · Placas daguerrotípicas con procedencia (sección 22)

## Diseño

Estado nuevo y aditivo: `state.mec06.plates = {schema:1, seq, lots[], recoveries[], migrated, archived?}`.

Cada lote tiene `id` (`L<n>`), `kind`, `qty`, `origin`, `at`, `activity`, `region`, y según el tipo `continents`, `voyage`, `jobId`, `from` (lote virgen de origen), `settledAt`, `developedAt`, `developedIn` (`campamento` o `taller`), `study` y `result` (pieza obtenida).

| Tipo | Significado | ¿Cuenta como existencias? |
| --- | --- | --- |
| `virgen` | Placa en el inventario, con el origen de su alta | Sí. Invariante: suma de lotes vírgenes = `inventory.placa_daguerrotipo` |
| `expuesta` | Consumida al zarpar con cámara; lleva la evidencia del destino (continentes, viaje, trabajo) | No |
| `revelada` | Registro de archivo con su resultado (o sin imagen) | No |

## Reglas

1. **Alta**: `addInventory('placa_daguerrotipo', n)` crea un lote virgen con el origen del registro MEC-01 (`mec01Source`: fabricación, comercio, recompensa…). No se inventa procedencia.
2. **Consumo FIFO**: al zarpar con cámara (`sail`), el lote virgen más antiguo pasa a un lote `expuesta` (con `from`, `origin`, `continents`, `voyage`, `jobId`), en la misma transacción que el descuento del inventario.
3. **Liquidación** (`resolveVoyageReward`): si la tirada de la cámara trae imagen, el lote pasa a `revelada` en el Campamento con su `result`. Si no, queda `expuesta` con `settledAt`: es evidencia pendiente que el Taller puede revelar.
4. **Revelado en el Taller** (`revelado-placas`):
   - con una placa expuesta ya liquidada, la usa (no consume una virgen) y la imagen se elige **solo entre los continentes de su destino**;
   - si no hay ninguna, se conserva la regla de MEC-06: se consume una placa virgen (FIFO) y la imagen sale de los territorios accesibles. El lote revelado conserva su origen.
   - Una placa de un viaje en curso no es revelable (`settledAt` ausente).
5. **Sin doble recompensa**: cada placa produce como máximo una imagen (en la vuelta o en el Taller, nunca en ambos), porque solo se revela un lote `expuesta` una vez.
6. `registro-paisajistico` (cámara oscura, sin placa) no usa lotes.

## Migración

- Partidas anteriores: el stock existente se registra como un lote virgen con origen «anterior a MEC-09B (procedencia desconocida)» y `at:null`. No se inventa fecha ni actividad.
- Viajes en curso con cámara: se crea su lote `expuesta` con origen desconocido y los continentes del destino.
- Diferencias posteriores entre inventario y lotes (p. ej., cambios de otros sistemas) se reconcilian: un alta sin registrar crea un lote «sin registrar»; un consumo sin registrar recorta FIFO y queda en `recoveries` (últimos 30).
- Los lotes revelados se limitan a 80 (los anteriores se cuentan en `archived`).
- Normalización idempotente (recargar dos veces no cambia nada).

## Resultados

`tests/mec09b.test.cjs` puntos 26a-26e: invariante de existencias, origen en el alta, FIFO, exposición con evidencia del destino, no revelable a bordo, liquidación sin imagen → revelado en el Taller con imagen del destino, liquidación con imagen → revelada en el Campamento, regla MEC-06 conservada sin placa expuesta, migración sin procedencia inventada, persistencia e idempotencia. Las pruebas de MEC-06 (15) y MEC-07 (3) siguen pasando sin cambios.

API de inspección: `globalThis.AtlasPlatesMEC09B = {normalize, reconcile, lots, available, exposed, UNKNOWN}`.
