# MEC-09A · Auditoría de guardado y migraciones (sección 11)

## Corpus de partidas auténticas

`tests/fixtures/mec09a-saves.json` se genera con `scripts/build-mec09a-save-corpus.cjs`. Para cada versión, el script:

1. ejecuta **el código de esa versión** en un `git worktree` temporal, con su propio arnés;
2. juega 60 búsquedas, guarda materiales, un coleccionable, una mejora del Taller y, en MEC-08, un encargo y un encargo de evento;
3. guarda la partida.

Versiones incluidas:
- 5.4.0, 5.4.2, 5.5.1 y 5.6.0 (`main`);
- MEC-01 a MEC-08;
- las seis partidas históricas 3.19.9–3.23.1 de `tests/fixtures/stability-saves-v3240.json`.

## Qué comprueba cada partida (`tests/mec09a-integral.test.cjs`, pruebas «M …»)

| Aspecto | Resultado |
| --- | --- |
| Dinero, conocimiento, prestigio, avistamientos y monografías | Iguales tras migrar |
| Especies descubiertas, investigaciones, regiones desbloqueadas e inventario | Conservados (⊇) |
| Instalaciones, encargos, registro de coleccionables y medallas | Conservados |
| Recargar dos veces | Ningún cambio en recursos, libro de ingresos, logros, MEC-08, récords, registro, inventario, Campamento ni Sociedad |
| Importar el mismo respaldo dos veces (`AtlasSaveBridge.restoreGame`) | Mismo resultado; **la importación no paga** |

**Partidas dañadas (pruebas N1 y N2).** Se recuperan de forma determinista:
- valores negativos o no numéricos;
- identificadores desconocidos (se apartan, no se borran);
- niveles por encima del máximo;
- piezas exhibidas sin existencias;
- instrumentos por encima de la capacidad (ningún artefacto se pierde);
- encargos sin plantilla (se registran en `mec08.recoveries`);
- ediciones inválidas;
- récords fuera de límites, sin revocar hitos.

Las correcciones de recursos básicos quedan en `state.mec09a.recoveries`.

## Limitaciones inherentes

- **Respaldos antiguos.** Restaurar voluntariamente un respaldo devuelve el estado de esa fecha, incluidas las ediciones de eventos y los encargos de entonces. Es inherente a un juego local sin servidor. Dentro de la partida restaurada no se duplican liquidaciones: los recibos por id viajan con la partida.
- **Sin invenciones.** No se inventan fechas, ingresos ni observaciones: los logros retroactivos quedan con `earnedAt:null` y el libro de ingresos usa la estimación «sin desglose» documentada en MEC-01.
