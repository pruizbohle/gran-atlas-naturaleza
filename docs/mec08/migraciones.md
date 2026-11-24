# MEC-08 · Migraciones

Todas las migraciones son idempotentes: se registran en `state.mec08.migration` o en `state.naturalRecords.migration`. Ninguna paga dinero retroactivo.

| Migración | Qué hace | Bandera |
| --- | --- | --- |
| Estado MEC-08 | Crea `state.mec08` (`schema:1`) con semilla, contadores en 0 (se cuentan desde MEC-08), tablero vacío, encargos, medallas, avisos y migración. Descarta encargos con estado desconocido o id duplicado y recorta los cerrados a 40 | `normalize8` (cada carga) |
| Logros nuevos ya cumplidos | Al cargar una partida anterior, `initialize` del motor 3360 los concede. MEC-08 los reescribe como `retroactive:true`, con `earnedAt:null` (la interfaz muestra «fecha original no disponible») y `migration:'MEC-08'`. Los logros no dan dinero | `mec08.migration.achievements` |
| Encargos permanentes nuevos ya cumplidos | Se marcan cobrados con recompensa cero y `retroactive:true`: no hay pago por trabajo anterior a su existencia | `mec08.migration.commissions` |
| Partidas importadas | La migración se vuelve a comprobar en cada `tick`; si la partida importada no trae las banderas, se aplica una vez | ambas |
| Migraciones de MEC-07 por rutas | Los registros del charrán y la pardela reciben `model:'rutas'`. Si ya tenían marca o hito, se guarda `modelBefore` (modelo de MEC-07, marca y estado) y **el hito no se revoca** | `naturalRecords.migration.routes` |
| Evidencias por región | `pending` (MEC-07) se convierte en `pendingByRegion[región]`; `pending` se mantiene como la mejor evidencia | cada carga (derivado) |
| Normalización de récords | Contadores, fechas, magnitudes, regiones, evidencias, cumplidos y recompensas (ver README, 3.7). Se aplica tras la migración del guepardo | cada carga (idempotente, prueba 31) |

**Compatibilidad.**
- **Versiones anteriores.** Una partida guardada en 5.6.8 y abierta en 5.6.7 conserva todo. Los campos nuevos (`state.mec08`, `pendingByRegion`, `model`, `modelBefore`, `sex`, `validatedAt`) son aditivos.
- **Formato del respaldo.** No cambia; el campo `gameVersion` pasa a 5.6.8.
