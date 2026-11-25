# MEC-09D §8–§9 · Guardado diferido e integridad transaccional

Las pruebas están en `tests/mec09d-persistence.test.cjs`. Usan el motor real (`www/js/app.js`, catálogo completo de 1000 especies) con un almacenamiento simulado que puede fallar a voluntad. No se modificó código del juego en esta tarea.

## §8 Guardado diferido

**Cómo se guarda.**
- `render()` llama a `persist()` de forma síncrona.
- Los registros diferidos (logros, encargos y curaduría) se vuelcan dentro de ese mismo `persist()`.
- Dentro de una transacción, solo escribe la transacción más externa.
- Las búsquedas automáticas se procesan por cuadros (`requestAnimationFrame`) y no escriben por cuadro. Las escribe el ciclo de 1 s (`persist({skipUnchanged:true})`) y el evento `pagehide`.

**Resultados.**

| Prueba | Resultado |
|---|---|
| G1 · Monografía, subvención, canje de notas, tomo, investigación y fabricación | Cada una queda escrita al terminar la acción, con **una sola escritura**. Un cierre inmediato, sin ciclo ni `pagehide`, no la pierde. |
| G2 · Avistamientos automáticos | 600 ciclos de 1 s con naturalistas activos: **como máximo una escritura por ciclo**, sea cual sea el número de búsquedas. Recuperación de 8 h de ausencia: una escritura por tramo procesado. El estado escrito coincide con la memoria. |

No hay operaciones de juego que dependan de un guardado posterior para no perderse. La única ventana diferida es el progreso automático procesado por cuadros entre dos ciclos, como máximo 1 s. Esa ventana la cubre `pagehide`.

## §9 Integridad transaccional

| Prueba | Resultado |
|---|---|
| T1 · Investigación y fabricación (`tradeTransaction3300`) | Si el almacenamiento falla, se **revierte la memoria completa**. El reintento da exactamente el mismo estado que una ejecución limpia, queda guardado y no deja negativos. |
| T2 · Monografía, subvención, canje de notas y tomo (F10 de MEC-09A, política aprobada de «sesión viva exportable») | Si falla el guardado, la operación queda aplicada **una sola vez** en memoria, igual que en una ejecución limpia y sin estado parcial, y aparece el aviso de guardado. Publicar y pedir la subvención no se duplican al reintentar. Cuando el almacenamiento se recupera, la partida se guarda. |
| T3 · Rutas comerciales | Un fallo al partir revierte la salida. Un fallo al liquidar revierte la liquidación completa. Al reintentar se cobra **exactamente una vez** el importe y los materiales de la ruta, y el historial tiene una sola entrada. |

**Coherencia con MEC-09A.** Coincide con `docs/mec09a/auditoria-transacciones.csv`. El resto de operaciones atómicas de esa matriz (expediciones, excavaciones, prospecciones, sondeos, Museo, Taller, encargos y récords) siguen cubiertas por sus pruebas: `aud01-online-offline`, `deep-v3330`, `abyssal-v3340`, `enc3370-state` y `mec05` a `mec09a`. Todas pasan en la suite.

**Riesgo residual (P3, sin cambios).** F10: un fallo de almacenamiento seguido de un cierre inmediato pierde por completo una de las cuatro operaciones sencillas. Nunca la duplica ni deja estado parcial. Hacerlas transaccionales cambiaría la política aprobada, y se deja a decisión del propietario.
