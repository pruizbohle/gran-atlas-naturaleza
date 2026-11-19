# Inventario de aves para la Serie 4.7

El catálogo de V4.6.0 contiene **287 aves**. Cada ID figura en un solo lote. Se cotejaron los nombres científicos con la lista IOC 15.2 incluida en el repositorio. Hubo 280 coincidencias directas por binomio y siete equivalencias de nomenclatura anotadas en el inventario. Se conservan los IDs, los nombres y la clasificación productiva del juego. [Inventario por ID, orden y familia](inventario-aves.json) · [IOC World Bird List 15.2](https://doi.org/10.14344/IOC.ML.15.2)

| Versión | Lote | Especies | Familias | Albinos | Melánicos | Especies con dimorfismo | Legendarios | Láminas estimadas |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 4.7.0 | Rapaces diurnas y nocturnas | 49 | 7 | 20 | 14 | 1 | 1 | 86 |
| 4.7.1 | Acuáticas y marinas | 92 | 25 | 25 | 17 | 5 | 0 | 144 |
| 4.7.2 | Terrestres, corredoras y galliformes | 39 | 13 | 12 | 8 | 12 | 0 | 83 |
| 4.7.3 | Arborícolas, demás no paseriformes y chucao | 63 | 17 | 15 | 7 | 4 | 0 | 93 |
| 4.7.4 | Paseriformes pendientes | 44 | 26 | 9 | 13 | 12 | 0 | 90 |
| **Total** | | **287** | **84 distintas** | **81** | **59** | **34** | **1** | **496** |

La estimación suma una lámina normal por especie, una por variante de pigmentación, dos por dimorfismo configurado y una para Centinela. El total podrá ajustarse donde el estándar permita compartir la lámina normal con la ruta del macho.

## Criterios de asignación

- V4.7.0 reúne Accipitriformes, Falconiformes y Strigiformes. V4.7.4 reúne el orden Passeriformes, incluidas las aves del paraíso.
- V4.7.1 reúne los órdenes acuáticos y marinos y los tres martines pescadores con alimentación ligada al agua. Los cucaburras forestales figuran en V4.7.3.
- V4.7.2 agrupa paleognatas, galliformes y aves de desplazamiento principalmente terrestre. Incluye el correcaminos, el weka, el takahē y el ibis eremita. El inventario explica estas asignaciones.
- V4.7.3 cubre los demás no paseriformes e incluye loros, cálaos, trogones, carpinteros y colibríes.

El lote V4.7.1 permite dos tandas internas de revisión con una sola versión de publicación. La tanda marina y costera tiene 42 especies y 50 láminas estimadas. La tanda ribereña y de humedales tiene 50 especies y 94 láminas estimadas. La asignación de especie a lote se mantiene única.

## Centinela

El registro legendario vigente corresponde al águila real, *Aquila chrysaetos*, con ID de especie `aguila_real` e ID legendario `centinela`. En V4.7.0 se prevé la ruta `AtlasNaturalistAssets.routes.aguila_real.legendario` hacia `aguila_real--centinela.webp`, con el archivo canónico en `www/naturalist-art/plates/` y los derivados en `64/`, `128/` y `256/`. El inventario conserva la descripción «La nuca dorada destaca sobre las alas recogidas de este vigilante». La producción de láminas de aves queda para la Serie 4.7.

El inventario se reproduce con `node scripts/audit-scientific-catalog.cjs --birds`, seguido de `python scripts/plan-bird-illustrations.py` con el JSON extraído como argumento.

El chucao se adelantó a V4.7.3 con su ID original. La planificación de aves mantiene 287 especies y 496 láminas previstas. [Inventario pendiente de V4.7.4](../cientifica-v473/plan-v474.md)
