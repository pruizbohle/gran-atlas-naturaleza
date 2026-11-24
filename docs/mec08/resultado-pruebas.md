# MEC-08 · Resultado de las pruebas

| Conjunto | Pruebas | Pasan | Fallan | Notas |
| --- | --- | --- | --- | --- |
| Línea base (MEC-07, `a10a686`) | 995 | 779 | 216 | Tiempo agotado: `global-v3240` |
| MEC-08 (`mec-08/v5.6.8-beta`) | 1.027 | 811 | 216 | Mismas 216 fallas históricas, ninguna nueva; mismo tiempo agotado `global-v3240` |
| `tests/mec08.test.cjs` | 32 | 32 | 0 | Incorporado a `release:verify` |
| MEC-01 a MEC-07 | 14 + 12 + 17 + 15 + 22 + 17 + 18 | todas | 0 | — |

Comparación por nombre de prueba contra la línea base: **0 regresiones**, 32 pruebas nuevas, todas en verde. El detalle está en `resultado-suite.json`.

**Pruebas anteriores ajustadas, sin debilitarlas.**
- `tests/mec07.test.cjs`, prueba 26. La versión se compara con `package.json` en lugar del literal 5.6.7, igual que hizo MEC-07 con MEC-06.
- `tests/helpers/mec04-audit.cjs` (`recordsAudit`). Entiende el modelo de rutas: exige que las zonas de ruta estén cubiertas por regiones accesibles, lo que es una comprobación más estricta.
- `tests/helpers/mec01-game.cjs`. Carga `mec08-recognition` y expone las globales nuevas.

**Comprobación en navegador** (Chrome sin interfaz, 412×900). Sin errores de consola. Se probaron:
- Sociedad → Encargos: correspondencia y aceptación;
- Sociedad → Eventos: calendario;
- Logros: filtro por nivel Platino;
- Cuaderno → Récords: paginación 1 → 2 de 3, con 45 entradas.

**Corrección hallada en la prueba de navegador.** Las acciones `mec07-*` (validar, Atlas, página) no se enrutaban desde el panel. Se añadió el prefijo en `handlePanelAction`.
