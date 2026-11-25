# MEC-09D §14 · Los 30 legendarios

Prueba: `tests/mec09d-legendaries.test.cjs`. Usa el motor real con el catálogo completo (1000 especies y 125 regiones), y tiene una prueba por legendario más dos generales.

## Cómo funciona

- Un legendario es una categoría de espécimen ligada a una especie. `legendaryForSpecies` usa el nombre científico canónico.
- Solo puede aparecer cuando esa especie se observa en un encuentro real: Campo → `rollSpecimen` → `recordSpecimen`. La tasa es 0,0001 (LEG-02, sin cambios).
- Una vez registrado, `rollSpecimen` omite el intervalo legendario. Por eso no se repite, y `recordSpecimen` no lo duplica.

## Resultados por legendario (30/30)

| Comprobación | Resultado |
|---|---|
| Especie existente, presencia regional y lámina legendaria en los cuatro tamaños | 30/30 |
| **Aparición por encuentro real en Campo**: región desbloqueada, hábitat, turno y estación de la especie, selección ponderada real | **30/30**, incluidos los marinos, polares y el calamar gigante |
| Sin aparición prematura: en una partida nueva solo es posible si la especie vive en la región inicial; fuera de ella hace falta desbloquear la región | 30/30 |
| Registro único `{id, speciesId}`; una segunda tirada en el mismo intervalo nunca vuelve a darlo; registrarlo otra vez no añade nada | 30/30 |
| Persistencia y recarga desde el almacenamiento | 30/30 |
| Tasa Legendario 0,0001 sin cambios | 30/30 |
| Bestiario: la lámina sale de la ruta `legendario`; el recuento de la Sociedad usa `legendaryFound` sin duplicar | Comprobado |

Distribución: 30 legendarios con 30 especies distintas, de ellos 12 históricos y 18 solo legendarios (LEG-02).

**Sin errores funcionales.** No hay recompensas económicas asociadas al legendario, así que no existe riesgo de cobro duplicado.

La rareza efectiva (0,0001 por observación de la especie) es una cuestión de equilibrio y queda reservada para BAL-01 o BAL-02.
