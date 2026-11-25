# MEC-09C · Informe de rendimiento

Herramienta: `scripts/mec09c-perf.cjs` (Chrome real, 390×844, reloj fijo, partidas A nueva, B intermedia, C avanzada, D final de MEC-09B con 1.000 especies y monografías). Resultados: `rendimiento-antes.json` (MEC-09B servido desde `05fc522`) y `rendimiento-despues.json`.

| Partida | Inicio (ms) | Cambio de pestaña, máx. de medianas (ms) | DOM máx. | Página del Bestiario (ms) | Logros (ms) | Memoria JS (MB) |
| --- | --- | --- | --- | --- | --- | --- |
| A | 550 → 501 | 33 → 33 | 1025 → 1032 | 17 → 18 | 25 → 19 | 16 → 13 |
| B | 562 → 542 | 33 → 34 | 1120 → 1127 | 20 → 23 | 36 → 29 | 21 → 21 |
| C | 496 → 529 | 32 → 32 | 1137 → 1144 | 24 → 27 | 49 → 38 | 18 → 19 |
| D | 627 → 572 | 32 → 37 | 1189 → 1196 | 26 → 26 | 52 → 55 | 19 → 25 |

Recuperación offline (partida guardada hace 8 h; inicio en ms):

| Partida | MEC-09B → MEC-09C |
| --- | --- |
| B | 520 → 527 |
| C | 551 → 510 |
| D | 599 → 669 |

## Conclusiones

- **Sin regresiones:** las diferencias están dentro de la variación entre ejecuciones (±60 ms). La capa móvil agrega un observador agrupado por fotograma y no recorre listas completas.
- **El motor ya actualiza de forma selectiva:** en 5 s de reposo el panel no se reconstruye (solo cambian contadores y temporizadores, unas 24 mutaciones). Una búsqueda de campo actualiza el resultado sin regenerar el panel. Los cambios de saldo no reconstruyen listas.
- **Listas extensas:** el Bestiario pagina 32 fichas de 1.000; los logros paginan; el Inventario pagina 12 objetos. DOM máximo ≈ 1.200 nodos con la partida final.
- **Recuperación offline:** no bloquea el inicio (≈ 0,5–0,7 s). Las búsquedas offline se procesan por cola efectiva y en tramos, sin perder acciones. No se agregó indicador, porque el procesamiento no tarda perceptiblemente.
- **Ilustraciones:** unas 40 imágenes en la primera pantalla; el resto de las láminas se cargan al pasar de página.
- No se modificó el ritmo del motor.
