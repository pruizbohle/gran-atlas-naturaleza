# MEC-09B · Cobertura geográfica (sección 10)

Matriz: [`cobertura-geografica.csv`](cobertura-geografica.csv), generada por `scripts/mec09b-geographic-coverage.cjs` desde el motor real.

## Criterio

- Solo regiones **existentes**: no se crean regiones, mapas, especies ni mecánicas.
- Cada adición responde a una carencia **medida**: continentes con muchas regiones y pocos destinos de expedición o yacimientos.
- Se usan los motores vigentes: expediciones (`VOYAGES`, `voyageConditions3280`, botín y cámara de MEC-06) y excavaciones (`MUSEUM_DIG_SITES`, `canStartExcavation`).
- Coleccionables: cada destino nuevo **hereda** el conjunto de piezas que ya se hallaban en el destino o yacimiento vecino del mismo continente (campo `inherits`). No hay procedencias inventadas.
- Costos, duraciones y recompensas: **provisionales (BAL-01)**, en el rango de los destinos vecinos.
- Los destinos históricos se conservan sin cambios.

## Carencias y adiciones

| Continente | Regiones | Expediciones antes → después | Yacimientos antes → después | Adición | Contexto histórico |
| --- | --- | --- | --- | --- | --- |
| Asia | 23 | 2 → 5 | 1 → 2 | `himalaya_survey`, `malay_survey`, `siwalik_beds` (+ `indian_ocean_survey` toca Asia) | Gran Levantamiento Trigonométrico (activo en la década de 1840); fósiles de Siwalik descritos por Falconer y Cautley en la década de 1830. |
| Sudamérica | 14 | 2 → 3 | 1 → 2 | `amazon_survey`, `punta_alta` | Spix y Martius (1817-1820), R. Schomburgk (1835-1844); megafauna de Punta Alta recogida por Darwin en 1832. |
| Oceanía | 9 | 1 → 2 | 1 → 2 | `nz_survey`, `moa_deposits` | E. Dieffenbach en Nueva Zelanda (1839-1841); R. Owen identificó el moa en 1839. |
| Polos | 7 | 1 → 2 | 0 → 0 | `antarctic_survey` | Expedición de J. C. Ross (1839-1843). |
| Océanos | 19 | 3 → 6 | 0 → 0 | `indian_ocean_survey` (+ `malay_survey`, `antarctic_survey` con tramo marino) | Rutas regulares por el Cabo hacia la India. |
| Europa, África, Norteamérica | — | sin cambios | sin cambios | — | Cobertura suficiente o sin carencia priorizada. |

Polos y Océanos siguen sin yacimiento: no hay un yacimiento terrestre históricamente defendible en 1842 en esas regiones, y añadirlo exigiría un tipo de excavación nuevo (fuera de alcance).

## Requisitos de acceso

Cada destino nuevo usa la misma compuerta que su continente: mapa continental (`asia_map`, `south_america_map`, `oceania_map`, `polar_map`, `world_map`), la investigación continental (`asia_1`, `sudamerica_1`, `oceania_1`, `polos_1`, `mares_superficiales_1`) y el prestigio mínimo (`required`) del rango de los destinos vecinos. Ninguno adelanta un continente.

## Evidencia

- C: todas las expediciones nuevas superan `voyageConditions3280` y zarpan/liquidan en una partida preparada; los yacimientos nuevos superan `canStartExcavation` y se recogen (`comercio-expediciones.csv`, columna `nueva`).
- D: el controlador, desde partida nueva y sin ayudas, usó las seis expediciones nuevas (hitos `expedicion-*` en `progresion-controlador-29.json` y `-31.json`).
- Pruebas: `tests/mec09b-catalog.test.cjs` punto 25 (cada adición con justificación `gap` y `inherits`).
