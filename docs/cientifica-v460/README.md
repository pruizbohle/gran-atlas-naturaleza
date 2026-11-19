# El Gran Atlas V4.6.0 · Mamíferos acuáticos

GM-07-M08 completa la ilustración científica clásica de los **461 mamíferos del catálogo**. El atlas reúne 461 de 997 especies ilustradas, 814 láminas distintas, 369 registros de variantes biológicas y los seis legendarios de Mammalia. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Estándar artístico](../cientifica-v440/estandar.md)

## Alcance y revisión zoológica

El punto de partida fue V4.5.0, commit `94a0763fe0b44d5ef5ffdfab35cb1caa0eb930f3`, con 410 especies ilustradas, 757 láminas, 363 registros de variantes y 49,28 MB de ilustraciones. El lote previsto coincidió por ID y variante con el inventario vigente.

| Grupo | Especies nuevas | Variantes de pigmentación | Láminas |
| --- | ---: | ---: | ---: |
| Cetáceos | 28 | 1 | 29 |
| Pinnípedos | 20 | 2 | 22 |
| Sirenios | 2 | 2 | 4 |
| Nutria marina | 1 | 1 | 2 |
| **Total** | **51** | **6** | **57** |

La revisión de cetáceos cotejó los perfiles de ballenas con barbas y odontocetos, los rostros, las aletas, los pedúnculos y la lectura de las aletas caudales horizontales. Las aletas pectorales largas de la jorobada, la cabeza cuadrada del cachalote y la pigmentación de orcas y delfines se distinguen a escala de juego. Se revisaron las orejas externas de los otáridos, las proporciones de los fócidos y los colmillos de la morsa. El dugongo tiene aleta caudal bilobulada y el manatí una cola redonda. La nutria marina aparece en postura supina con patas traseras palmeadas.

Las 57 láminas digitales usan la estética de acuarela, grafito y tinta fina. Se exportaron con alfa real. En los cetáceos nadadores, la silueta y la postura aportan el contexto. El agua, las burbujas y los paisajes pertenecen a capas separadas. La comparación del laboratorio utiliza el SVG de referencia y la nueva lámina.

## Fondos y módulos

Se revisó la biblioteca vigente de 16 paisajes. Campo conserva el paisaje y la iluminación de la zona y el hábitat explorados. Bestiario elige un fondo de acuerdo con los hábitats de cada especie. Río, costa, arrecife, océano, profundidades y regiones polares tienen fondos reutilizables. La plataforma continental comparte el fondo oceánico vigente. Los dos *Inia* tienen hábitat fluvial y se presentan con el fondo de río. Cuaderno y Museo conservan sus composiciones de papel y vitrina.

Campo, el registro del último avistamiento, Cuaderno, Bestiario y Museo comparten las rutas gráficas y el sistema de halos vigente. La agrupación editorial por familia en el laboratorio conserva las clasificaciones y mecánicas productivas del juego. [Auditoría de especies, variantes y hábitats](inventario-mammalia.json)

## Cierre de Mammalia y preparación de aves

La auditoría coteja las rutas por ID de las 461 especies, la pigmentación y el dimorfismo configurados y las láminas exclusivas de Silverback, Ámbar, Niebla, Fenrir, Ascua y Atlas. El inventario confirma el cierre de Mammalia. La clasificación de las 287 aves para la Serie 4.7 incluye familias, variantes, dimorfismos, una estimación de 496 láminas y la ruta propuesta para Centinela en V4.7.0. [Plan de aves](plan-aves.md)

## Peso e integridad de recursos

Las cifras usan MB decimales. La comprobación byte a byte preservó los 3.028 WebP de V4.5.0, las rutas de sus 410 especies, los 16 paisajes y las referencias previas del laboratorio. El lote añadió 228 archivos derivados de 57 láminas. Las 814 láminas tienen sus cuatro resoluciones y se verificaron los 3.256 WebP de animales.

| Resolución | V4.5.0 | Lote nuevo | V4.6.0 |
| --- | ---: | ---: | ---: |
| 64 px | 1,60 MB | 0,08 MB | 1,68 MB |
| 128 px | 3,85 MB | 0,18 MB | 4,03 MB |
| 256 px | 10,97 MB | 0,49 MB | 11,47 MB |
| 512 px | 32,85 MB | 1,61 MB | 34,47 MB |
| **Total** | **49,28 MB** | **2,37 MB** | **51,65 MB** |

El caché base pasó de **71,06 a 73,58 MB** y las comparaciones opcionales conservaron **11,70 MB**. Los derivados mantienen las calidades 82, 83, 86 y 90, con alfa a calidad 100. Los 57 WebP nuevos a 128 px se decodificaron en una mediana total de 15,91 ms en el equipo de validación. [Mediciones y comprobaciones](mediciones.json)
