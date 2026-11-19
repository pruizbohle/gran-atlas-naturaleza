# El Gran Atlas V4.8.1 · Tortugas, crocodilianos y tuátara

GM-07-R02 añade **46 láminas de 26 especies**. Incluye 12 tortugas, 13 crocodilianos y un rincocéfalo de ocho familias, con 10 variantes albinas, ocho melánicas y dos láminas legendarias. La cobertura alcanza **104 de 104 reptiles**, **853 de 998 especies ilustradas**, **1.485 láminas** y **11 de 12 legendarios ilustrados**. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar la PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v481.html)

## Dirección artística y auditoría

Las tortugas terrestres se distinguieron por el perfil del caparazón, sus escudos y la forma de las patas. La de Aldabra tiene cabeza roma y patas columnares. La de Santa Cruz occidental se muestra con el cuello alargado y el caparazón alto. Las tortugas marinas conservan su silueta de aletas. La laúd muestra crestas longitudinales en una cubierta coriácea, y la carey se distingue por el pico ganchudo y el borde posterior serrado. En las dulceacuícolas se revisaron las rayas y la membrana entre los dedos.

En los crocodilianos se compararon la anchura del hocico, el perfil de la mandíbula, los escudos dorsales y las posturas. Se diferenciaron el hocico ancho en U del aligátor, la cresta entre los ojos del caimán de anteojos y los hocicos estrechos del cocodrilo de agua dulce australiano y de *Mecistops*. El tuátara conserva su orden Rhynchocephalia y muestra cabeza roma, cresta corta y cuerpo robusto. Las variantes de pigmentación conservan la silueta y el contraste de los patrones de la lámina base. [Auditoría de las 104 especies](auditoria-reptiles.json)

**Junco** conserva su ficha del cocodrilo del Nilo. Su lámina representa los escudos irregulares y las viejas cicatrices del hocico. **Áncora** conserva su ficha de Aldabra. Su lámina muestra los anillos del caparazón, el cuello extendido y las patas columnares. Los halos se aplican mediante el motor gráfico. [Junco](comparacion-junco-1280.jpg) · [Áncora](comparacion-ancora-1280.jpg)

El laboratorio suma nueve conjuntos de comparación, entre ellos tortugas gigantes, tortugas marinas, tortugas terrestres, crocodilianos y las parejas de Junco y Áncora. Los conjuntos de tortugas dulceacuícolas y de tuátara con iguana permiten contrastar grupos próximos en apariencia. Cada reptil tiene al menos una zona compatible en el catálogo y usa la biblioteca vigente de 16 paisajes.

## Escala visual

| Especie | ID | Factor aplicado a ancho y alto |
| --- | --- | ---: |
| Sapo pulga | `sa_esp_brachycephalus_pulex` | 0,25 |
| Colibrí abeja | `gm06_mellisuga_helenae` | 0,50 |
| Resto del catálogo | | 1,00 |

`visualScales` se mantiene en el generador de metadatos del laboratorio y se emite en `AtlasNaturalistAssets`. El motor gráfico aplica el factor al plano de la imagen después de definir su tamaño normal. El halo sigue esa transformación y el marco, el fondo y los botones conservan sus dimensiones. La escala se resuelve al renderizar y se aplica una sola vez por imagen. El modo **Ajustes de escala** compara el mismo archivo al 100 % y al factor configurado. La muestra ampliada de **Escala real** conserva el tamaño completo a 512 px. [Estándar y uso del metadato](../cientifica-v440/estandar.md) · [Sapo pulga](escala-sapo-pulga-1280.jpg) · [Colibrí abeja](escala-colibri-abeja-1280.jpg)

## Peso y conservación

Las **1.439 láminas anteriores**, incluidas las del sapo pulga y el colibrí abeja, se conservaron byte a byte en las cuatro resoluciones. Se verificaron 5.756 WebP anteriores y 184 nuevos. Las 18 variantes mantienen el alfa de sus láminas base y se comprobaron los márgenes y el contraste a 64 y 128 px.

| Resolución | V4.8.0 | Lote nuevo | V4.8.1 |
| --- | ---: | ---: | ---: |
| 64 px | 2,97 MB | 0,08 MB | 3,05 MB |
| 128 px | 7,11 MB | 0,19 MB | 7,30 MB |
| 256 px | 20,10 MB | 0,55 MB | 20,66 MB |
| 512 px | 61,54 MB | 1,77 MB | 63,32 MB |
| **Total** | **91,72 MB** | **2,60 MB** | **94,33 MB** |

El caché básico ocupa **118,41 MB**. Los 636 recursos del laboratorio siguen en un caché opcional de **11,70 MB**. Cada lámina se exportó con calidades WebP 82, 83, 86 y 90, y alfa a calidad 100. [Mediciones](mediciones.json)

## Preparación de V4.8.2

El inventario de anfibios mantiene 35 especies. El sapo pulga ya tiene lámina y quedan **34 especies y 51 láminas pendientes**. [Inventario de V4.8.2](plan-v482.md)
