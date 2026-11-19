# El Gran Atlas V4.8.0 · Serpientes y lagartos

GM-07-R01 incorpora **128 láminas científicas** para **36 serpientes y 42 lagartos** de 20 familias. El atlas alcanza **827 de 998 especies ilustradas**, **1.439 láminas**, **625 rutas de variantes biológicas** y **9 de 12 legendarios ilustrados**. Los mamíferos y las aves conservan su cobertura completa. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar la PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v480.html)

## Dirección artística

| Tipo | Láminas nuevas |
| --- | ---: |
| Láminas normales | 78 |
| Variantes albinas | 28 |
| Variantes melánicas | 20 |
| Ejemplares legendarios | 2 |
| **Total** | **128** |

La revisión de serpientes se centró en la continuidad del cuerpo, las proporciones entre cuello, cuerpo y cola, la forma de la capucha, los patrones dorsales y la terminación de la cola. Los cascabeles, el apéndice natatorio de *Laticauda* y el extremo caudal de la víbora de la muerte se revisaron por separado. Se utilizaron posturas distintas para las víboras cornudas, la bufadora y la áspid para que la identificación tome en cuenta la silueta además del color.

En lagartos se verificaron las almohadillas y las membranas interdigitales de los geckos, las crestas de iguanas y basiliscos, el patagio del dragón volador, el volante de *Chlamydosaurus* y la forma de dedos y cola en los varanos. El lución y el lagarto de cristal se presentan con cabeza y escamas de lagarto ápodo. El segundo conserva el surco lateral que lo distingue del lución. [Estándar científico clásico](../cientifica-v440/estandar.md) · [Inventario y rutas del lote](auditoria-escamosos.json)

La pigmentación de las variantes se deriva de las láminas base. Las albinas mantienen el contraste de manchas y anillos en tonos cálidos claros. Las melánicas retienen diferencias tonales entre escamas. La revisión a 64 y 128 px comprobó la lectura de la silueta y de los patrones principales sobre fondos claros y oscuros. Las escamas más finas se distinguen al ampliar la lámina. [Comparación de pigmentación a 128 px](pigmentacion-128.jpg)

## Ejemplares legendarios y laboratorio

**Basalto** conserva el ID `basalto` del dragón de Komodo, *Varanus komodoensis*. La lámina lo muestra bajo, robusto y de pigmentación oscura. **Seda** conserva el ID `seda` de la cobra real, *Ophiophagus hannah*. Su capucha estrecha se eleva desde una postura enrollada. Las dos láminas tienen una composición propia y las categorías se aplican mediante el halo externo. [Basalto](comparacion-basalto-1280.jpg) · [Seda](comparacion-seda-1280.jpg)

El filtro **Ilustradas en V4.8.0** muestra las 78 especies del lote. **Comparar reptiles** ofrece 13 conjuntos, incluidos los dos pares legendarios. Los conjuntos de aves, los filtros zoológicos, las escalas, las simulaciones y la exportación JSON siguen disponibles.

## Hábitats y capas

Cada especie del lote tiene al menos una región jugable con un hábitat compatible. Se revisaron la selva de Basalto y Seda, el desierto de las víboras cornudas, los arrecifes de la serpiente marina, el río de la culebra viperina y las zonas abiertas y rocosas del lagarto ocelado. Campo usa el hábitat explorado. Cuaderno, Bestiario y Museo comparten la lámina y aplican su propia presentación. Los 16 paisajes existentes cubren las necesidades del lote.

## Peso e integridad

Se decodificaron **5.756 WebP de animales** y se comprobaron sus dimensiones, canal alfa, márgenes y área visible a 64 y 128 px. Se cotejaron byte a byte los **5.244 WebP anteriores**, las rutas de las 749 especies ya ilustradas y los 16 paisajes. Las 48 variantes nuevas conservan el alfa de su lámina base en las cuatro resoluciones y mantienen contraste en el interior de la silueta.

| Resolución | V4.7.4 | Lote nuevo | V4.8.0 |
| --- | ---: | ---: | ---: |
| 64 px | 2,66 MB | 0,31 MB | 2,97 MB |
| 128 px | 6,34 MB | 0,77 MB | 7,11 MB |
| 256 px | 17,87 MB | 2,23 MB | 20,10 MB |
| 512 px | 54,47 MB | 7,07 MB | 61,54 MB |
| **Total** | **81,34 MB** | **10,39 MB** | **91,72 MB** |

Cada lámina se exportó a 64, 128, 256 y 512 px con calidades WebP 82, 83, 86 y 90 y alfa a calidad 100. El caché base pasó de **104,85 MB a 115,64 MB**. Los 636 recursos de comparación del laboratorio conservan su caché opcional de **11,70 MB**. [Mediciones por resolución](mediciones.json)

## Validación funcional

Pasaron las 16 pruebas de publicación. La suite completa ejecutó 814 pruebas, con 586 aprobadas y los mismos 228 fallos que V4.7.4. [Comparación de la suite histórica](regresion.json)

El laboratorio pasó los 14 modos en anchos de 320 y 1280 px, incluida la exportación JSON sin conexión. Cargaron cuatro geckos a 64 px y los pares de Basalto y Seda a 128 px. [Comparación de Basalto](comparacion-basalto-1280.jpg) · [Comparación de Seda](comparacion-seda-1280.jpg)

La actualización PWA de V4.7.4 a V4.8.0 conservó el respaldo exacto y los once campos de partida cotejados. Sin conexión, el lagarto ocelado apareció en una ronda automática y sus láminas cargaron en Campo, Cuaderno, Bestiario y Museo. Basalto y Seda cargaron en Campo con el halo y paisaje vigentes. [Resultados de PWA](pwa.json) · [Seda en Campo](seda-390.jpg)

| Ancho | Apertura de Campo y decodificación | Memoria JS de Campo | Avistamiento automático de prueba del lagarto ocelado |
| --- | ---: | ---: | ---: |
| 390 px | 99 a 94 ms | 6,45 a 8,89 MB | 2499 ms |
| 1280 px | 126 a 82 ms | 7,49 a 9,16 MB | 2326 ms |

Los tiempos y la memoria corresponden a las pruebas en Chromium. Las dos primeras columnas de medidas muestran V4.7.4 y V4.8.0 en ese orden.

Capacitor sincronizó los 6.417 recursos cotejados byte a byte con `versionCode 40800`. La restauración en un dispositivo físico es una comprobación separada del candidato firmado. [Firma Android](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml)

## Preparación de V4.8.1

Quedan planificadas **26 especies y 46 láminas**, incluidos Junco y Áncora. [Inventario de tortugas, crocodilianos y tuátara](plan-v481.md)
