# El Gran Atlas V4.7.1 · Aves acuáticas y marinas

GM-07-A02 incorpora **92 aves de 25 familias**. El atlas reúne **602 de 997 especies** ilustradas, **141 de 287 aves**, los 461 mamíferos, 1.044 láminas, 457 registros de variantes biológicas y siete legendarios. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar la PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v471.html)

## Dos tandas de ilustración

El inventario se cotejó por ID, nombre, hábitat, pigmentación y dimorfismo con V4.7.0, commit `8d95f5125a9f4c58260ceecc604439903df9b8af`. [Inventario por especie](../cientifica-v460/inventario-aves.json) · [Estándar artístico](../cientifica-v440/estandar.md)

| Tanda | Especies | Albinas | Melánicas | Especies con dimorfismo | Láminas |
| --- | ---: | ---: | ---: | ---: | ---: |
| Marina y costera | 42 | 5 | 3 | 0 | 50 |
| Ribereña y de humedales | 50 | 20 | 14 | 5 | 94 |
| **Total** | **92** | **25** | **17** | **5** | **144** |

La tanda marina revisó las siluetas de los pingüinos y sus bandas faciales, las proporciones alares de los albatros, las placas del pico de los frailecillos, las patas palmeadas y las alas vestigiales del cormorán no volador. La tanda ribereña cotejó los picos de filtración, pesca y sondeo, las patas y los dedos de jacanas y aves zancudas, las carúnculas y la longitud de cuello y pico. El mandarín, el joyuyo, el ánade real, el pato real y el pato cuchara cuentan con láminas distintas de macho y hembra, además de la normal.

Las variantes se revisaron frente a la lámina normal. Se dibujaron por separado doce casos de pigmentación para mostrar diferencias que se pierden con un ajuste general de color. Entre ellos están el ánsar nival y la garceta común albinos, los dos pigmentos extraordinarios del pingüino africano y la focha melánica. Las otras variantes de pigmentación usan la silueta normal y ajustes de color que conservan el dibujo de plumas. [Comparación de pingüinos](comparacion-pinguinos-1280.jpg) · [Dimorfismo del pato cuchara](pato-cuchara-1280.jpg)

## Presentación y laboratorio

El laboratorio añade 16 conjuntos de aves acuáticas a los diez conjuntos de rapaces. Sus fichas usan un tamaño y un fondo comunes. El panel Variantes admite las mismas escalas y fondos en pigmentaciones y dimorfismos. Se conserva la revisión individual, el historial gráfico y la exportación JSON.

Campo muestra el paisaje de la zona. Bestiario permite la elección ecológica de paisaje para estas aves. Los lagos reutilizan el paisaje fluvial y los estuarios usan el humedal o la costa según la zona. Las vistas pelágicas de albatros y otros navegantes usan el océano cuando el inventario lo contempla. El pato cuchara tiene paisaje de humedal en Bestiario, con las zonas jugables del registro vigente. Los 16 paisajes y el halo externo siguen compartidos por los módulos.

## Peso e integridad

La auditoría cotejó **3.600 WebP previos** y las rutas de las **510 especies** ilustradas en V4.7.0. Se abrieron los **4.176 WebP de animales** y se comprobaron dimensiones, canal alfa y bordes transparentes. El lote nuevo añade 576 derivados y usa calidades 82, 83, 86 y 90 con alfa a calidad 100. La revisión de márgenes llevó a redibujar la garza goliat y el piquero de patas azules. En la revisión sobre fondo oscuro se redibujaron cuatro garzas y se afinó la transparencia del borde en cuatro aves marinas.

| Resolución | V4.7.0 | Lote nuevo | V4.7.1 |
| --- | ---: | ---: | ---: |
| 64 px | 1,85 MB | 0,28 MB | 2,13 MB |
| 128 px | 4,43 MB | 0,65 MB | 5,08 MB |
| 256 px | 12,58 MB | 1,77 MB | 14,34 MB |
| 512 px | 37,94 MB | 5,42 MB | 43,36 MB |
| **Total** | **56,80 MB** | **8,11 MB** | **64,91 MB** |

La tanda marina aporta **2,75 MB** y la ribereña **5,36 MB**. El caché base pasa de **79,01 MB** a **87,54 MB**. Los 636 recursos comparativos se sirven desde un caché opcional de **11,70 MB**. Una lámina de 128 px requiere 65.536 bytes RGBA decodificada. [Mediciones y comprobaciones](mediciones.json)

## Validación funcional

Pasaron las 13 pruebas de publicación. La suite histórica ejecutó 811 pruebas, con 583 aprobadas y los mismos 228 fallos de V4.7.0. [Comparación de la suite histórica](regresion.json)

El laboratorio pasó los trece modos a 320 y 1280 px, con los dos filtros de tanda, orden, familia, revisión individual y exportación JSON sin conexión. Se comprobaron las láminas de los pingüinos a 64 px y las variantes del pato cuchara a 128 px. [Comparación marina en móvil](comparacion-pinguinos-320.jpg) · [Variantes en móvil](pato-cuchara-320.jpg)

La actualización de V4.7.0 a V4.7.1 en Chromium conservó el respaldo exacto y los diez campos de partida comprobados en ambos tamaños. Sin conexión se verificaron el frailecillo atlántico con su halo notable y el paisaje de costa, el avistamiento automático del pato cuchara y su lámina en Cuaderno, Bestiario y Museo. Campo conservó el bosque de la zona durante el avistamiento y Bestiario mostró un humedal para la misma especie. [Resultados de PWA](pwa.json) · [Frailecillo en Campo](frailecillo-390.jpg)

| Ancho | Apertura de Campo y decodificación | Memoria JS de Campo | Siguiente avistamiento de pato cuchara |
| --- | ---: | ---: | ---: |
| 390 px | 66 a 52 ms | 7,21 a 10,62 MB | 1574 ms |
| 1280 px | 42 a 61 ms | 8,00 a 10,52 MB | 1986 ms |

Los tiempos y la memoria son mediciones puntuales del navegador de validación. Las dos primeras columnas de medidas muestran V4.7.0 y V4.7.1 en ese orden.

Capacitor sincronizó los 4.832 archivos cotejados byte a byte con `versionCode 40701`. El flujo Android verifica el APK firmado y lo vincula al commit de publicación. La restauración en un dispositivo físico se valida con el procedimiento Android. [Flujo de firma](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml) · [Procedimiento Android](../../README_ANDROID_FIRMA_PERMANENTE.md)

## Preparación de V4.7.2

El inventario del siguiente lote reúne 39 especies terrestres, corredoras y galliformes. [Plan de preparación](plan-v472.md)
