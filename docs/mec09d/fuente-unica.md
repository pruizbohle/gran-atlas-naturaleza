# MEC-09D §10 · Fuente única de verdad

Prueba: `tests/mec09d-sot.test.cjs`, con 5 pruebas. Se revisaron las fuentes de datos de los sistemas auditados en MEC-09D.3 (catálogo zoológico, regiones, legendarios, relictos, récords, cartografía y canales de obtención) y las copias secundarias que existen fuera del motor.

| Fuente o copia | Relación con la fuente del juego | Resultado |
|---|---|---|
| `www/naturalist-art/catalog.js`: laboratorio de láminas, 1000 fichas | Copia de `SPECIES`/`REGIONS` para revisión artística | **Coincide** en las 1000 especies: nombre, nombre científico, rareza, hábitats y regiones |
| `www/naturalist-art/relict-catalog.js`: revisión de relictos | Copia de `MUSEUM_RELICTS` | **Coincide**: nombre, nombre científico, localidad y código de región. El campo `hex` usa el código visible de la región, por ejemplo `OC-05` para `oc_tasmania`, y no el identificador interno; es coherente |
| Compuerta cartográfica | Definida en tres sitios: `CONTINENT_RULES3300[c].cartography`, `CARTOGRAPHIC_GATES3400` y `CARTOGRAPHY3400` | **Coherentes** entre sí. Mapas exigidos por investigación (`reqItem`): asia_1, africa_1, nuevo_mundo_1 (cuadrante oceánico) y norteamerica_1 |
| Canales de obtención (`AtlasBeta560Actions.drops`) | Única configuración activa | El **drop experimental universal** de coleccionables y rarezas por especie **sigue desactivado** (campo 0/0). Los materiales históricos siguen en 0,02 / 0,005 |
| Récords, conductas, legendarios y relictos | Referencian especies y regiones por identificador | Todas las referencias resuelven en la fuente única |
| Láminas (`naturalist-assets-v400.js`) | Rutas por especie | Sin rutas huérfanas ni faltantes (§4) |

**Correcciones:** no hacía falta ninguna. No se encontraron duplicidades inconsistentes ni datos divergentes entre módulos.

**Observación de contenido (no es de datos):** O1, el relicto que repite una especie del Bestiario. Ver `integridad-contenido.md`.

**Riesgo residual (P3).** El catálogo de láminas y la revisión de relictos son copias generadas y no fuentes. Las pruebas F1 y F2 detectan cualquier divergencia futura, así que si cambia la fuente hay que regenerar la copia.
