# El Gran Atlas V4.7.4 · Paseriformes y cierre de aves

V4.7.4 incorpora **90 láminas científicas de 44 paseriformes de 26 familias**. Quedan ilustradas las **287 aves** y los **461 mamíferos**. El atlas alcanza **749 de 998 especies**, **1.311 láminas**, 577 rutas de variantes biológicas, siete legendarios ilustrados y 16 paisajes compartidos. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar la PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v474.html)

## Revisión artística

| Tipo de lámina nueva | Cantidad |
| --- | ---: |
| Normales | 44 |
| Albinas | 9 |
| Melánicas | 13 |
| Machos y hembras dibujados por separado | 24 |
| **Total** | **90** |

Los córvidos se distinguieron por proporciones del pico, plumas de garganta, longitud de cola y contrastes alares. Para las aves del paraíso se revisaron el escudo y la capa cervical de *Lophorina*, los discos y espirales de las rectrices de *Cicinnurus*, y los filamentos de los flancos de *Seleucidis*. Se revisaron también la cola en lira, la cresta del gallito de las rocas, el iris violeta de la jardinera, las patas del huet-huet y el abanico caudal de *Rhipidura*. [Estándar científico clásico](../cientifica-v440/estandar.md) · [Australian Museum, *Seleucidis melanoleucus*](https://australian.museum/about/history/exhibitions/birds-of-paradise/twelve-wired-bird-of-paradise/)

Las nueve láminas albinas se dibujaron por separado. Las 13 melánicas conservan el dibujo de la base y oscurecen la pigmentación, con variaciones tonales para mantener legibles los rasgos. Se revisaron las láminas con fondos claros y oscuros. En miniatura se compararon picos, rayas oculares, manchas pectorales y colas. Los filamentos finos se aprecian mejor al ampliar la lámina. [Muestra de melanismo a 128 px](melanismo-128.jpg)

El laboratorio suma 11 conjuntos anatómicos y el filtro **Ilustradas en V4.7.4** muestra las 44 altas gráficas. Los conjuntos de dimorfismo comparan machos y hembras con la misma escala, fondo y halo. Campo mixto usa fauna que conserva SVG, como el lución europeo. Se mantienen las simulaciones, los filtros zoológicos, la revisión individual y la exportación JSON.

## Auditoría de aves y revisión cartográfica

Se verificaron **496 láminas de aves** en 84 familias, incluidas 81 variantes albinas, 59 melánicas, 34 especies con dimorfismo configurado y Centinela, el águila real legendaria. Cada ruta se cotejó contra el catálogo vigente y se comprobó su presentación en Campo, Cuaderno, Bestiario y Museo. El chucao conserva la lámina y las rutas de V4.7.3. [Auditoría de las 287 aves](auditoria-aves.json) · [Lista IOC 15.2](https://doi.org/10.14344/IOC.ML.15.2)

Se revisaron las **14 regiones sudamericanas de las 125 regiones jugables**. El Litoral caribeño y Darién y Chocó tienen costa y bosque, pero corresponden a otra franja geográfica. Las costas de Galápagos, Humboldt, Atacama y los bosques templados del sur representan otros ecosistemas. El sector atlántico frente a Brasil está representado por zonas marinas. La cartografía vigente carece de una región de bosque atlántico para Serra Bonita, Bahía. El sapo pulga conserva la aproximación en el bosque del Cerrado brasileño y los datos de V4.7.3. [Distribución documentada por el AMNH](https://amphibiansoftheworld.amnh.org/Amphibia/Anura/Brachycephaloidea/Brachycephalidae/Brachycephalus/Brachycephalus-pulex)

## Peso e integridad

Se decodificaron los **5.244 WebP de animales** y se verificaron dimensiones, transparencia, márgenes y tamaño visible en las miniaturas. Los **4.884 WebP previos**, los 16 paisajes y las rutas de las 705 especies ya ilustradas coinciden con V4.7.3. Las 90 láminas nuevas se exportaron a 64, 128, 256 y 512 px con calidades 82, 83, 86 y 90 y alfa a calidad 100.

| Resolución | V4.7.3 | Lote nuevo | V4.7.4 |
| --- | ---: | ---: | ---: |
| 64 px | 2,48 MB | 0,18 MB | 2,66 MB |
| 128 px | 5,91 MB | 0,42 MB | 6,34 MB |
| 256 px | 16,68 MB | 1,19 MB | 17,87 MB |
| 512 px | 50,71 MB | 3,76 MB | 54,47 MB |
| **Total** | **75,78 MB** | **5,55 MB** | **81,34 MB** |

El caché base pasa de **99,02 MB a 104,85 MB**. Los **636 recursos de referencia opcionales** ocupan **11,70 MB** y siguen separados. Una lámina de 128 px ocupa 65.536 bytes RGBA decodificada. [Mediciones por resolución](mediciones.json)

## Validación funcional

Pasaron las 16 pruebas de publicación. La suite completa ejecutó 814 pruebas, con 586 aprobadas y los mismos 228 fallos que V4.7.3. [Comparación de la suite histórica](regresion.json)

El laboratorio pasó los 13 modos en anchos de 320 y 1280 px, incluida la exportación JSON sin conexión. Cargaron carbonero y herrerillo a 64 px y tres pares de aves del paraíso a 128 px. [Dimorfismo de aves del paraíso](dimorfismo-aves-del-paraiso-1280.jpg)

La actualización PWA de V4.7.3 a V4.7.4 conservó el respaldo exacto y los once campos de partida cotejados. Sin conexión, el pinzón vulgar apareció en una ronda automática y sus láminas cargaron en Campo, Cuaderno, Bestiario y Museo. También cargaron Centinela, el chucao y el sapo pulga. [Resultados de PWA](pwa.json) · [Pinzón en Campo](pinzon-390.jpg)

| Ancho | Apertura de Campo y decodificación | Memoria JS de Campo | Avistamiento automático de prueba del pinzón |
| --- | ---: | ---: | ---: |
| 390 px | 131 a 105 ms | 6,41 a 8,83 MB | 2315 ms |
| 1280 px | 81 a 105 ms | 7,45 a 11,01 MB | 7292 ms |

Los tiempos y la memoria corresponden a las pruebas en Chromium. Las dos primeras columnas de medidas muestran V4.7.3 y V4.7.4 en ese orden.

Capacitor sincronizó los 5.905 recursos cotejados byte a byte con `versionCode 40704`. La restauración en un dispositivo físico es una comprobación separada del candidato firmado. [Firma Android](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml)

## Preparación de V4.8

El inventario asigna los **104 reptiles y 35 anfibios** a tres lotes, con **225 láminas pendientes**. Incluye los legendarios Basalto, Seda, Junco y Áncora. La lámina existente del sapo pulga queda registrada como completa. [Inventario y plan de herpetología](plan-herpetologia.md)
