# El Gran Atlas V4.7.2 · Aves terrestres, corredoras y galliformes

GM-07-A03 incorpora **39 aves de 13 familias** y 83 láminas. El atlas alcanza **641 de 997 especies ilustradas**, con **180 de 287 aves** y los 461 mamíferos. El inventario gráfico reúne 1.127 láminas, 501 registros de variantes biológicas y siete legendarios. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar la PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v472.html)

## Cobertura y revisión artística

El lote se cotejó por ID, familia, orden, nombre, hábitats, pigmentación y dimorfismo con el catálogo de V4.7.1, commit `9eed5e7d4b8ffe0c53a033cc2f8f874ed8b9d14c`. La agrupación permite consultar nueve corredoras y paleognatas, 24 galliformes y seis aves terrestres de otros órdenes. [Inventario de aves](../cientifica-v460/inventario-aves.json) · [Estándar artístico](../cientifica-v440/estandar.md)

| Tipo de lámina | Nuevas |
| --- | ---: |
| Normal | 39 |
| Albina | 12 |
| Melánica | 8 |
| Macho y hembra en 12 especies | 24 |
| **Total** | **83** |

En las corredoras se revisaron la longitud del cuello, los tarsos y el número de dedos. El avestruz común y el somalí se distinguen por la coloración de cuello y patas y por la coronilla. En los ñandúes se cotejaron la garganta, el plumaje y los tarsos. Las tres especies de kiwi se distinguen por el moteado, la textura y las proporciones. Los lagópodos blancos de invierno conservan el iris y el pico oscuros característicos de su pigmentación natural.

En las galliformes se revisaron los ocelos del pavo ocelado y del pavo real, el casco del maleo, las crestas de ambos monales, los patrones de las perdices y los contornos de colas en lira, en abanico y largas. Las 24 láminas de dimorfismo se dibujaron por separado. Las poses preservan las proporciones del ejemplar y encuadran las colas y las plumas ornamentales completas. Se revisaron además las siluetas y los picos del kagú, weka, takahé, correcaminos, seriema e ibis eremita.

Doce variantes de pigmentación tienen dibujos propios. Las demás se derivan de la lámina normal con ajustes de pigmento que conservan el plumaje y la silueta. [Kiwis en el laboratorio](comparacion-kiwis-1280.jpg) · [Dimorfismo del pavo real común](pavo-real-1280.jpg)

## Laboratorio

El laboratorio amplía de 26 a 38 los conjuntos de comparación anatómica. El panel Variantes permite mostrar todas las láminas de una especie o comparar macho y hembra. El tamaño, el fondo y el halo de revisión se aplican en común. Los halos pertenecen a la presentación de laboratorio. Se conservan la revisión individual, la exportación JSON y los modos de Campo, Cuaderno, Bestiario y Museo.

## Peso e integridad

La auditoría cotejó **4.176 archivos WebP previos** y las rutas de las **602 especies** que ya tenían lámina científica. Se abrieron los **4.508 WebP de animales** y se comprobaron tamaños, alfa y márgenes. El lote agrega 332 derivados con las calidades 82, 83, 86 y 90, y alfa a calidad 100. La revisión sobre fondo oscuro llevó a redibujar los pavos y a afinar el borde de las ilustraciones del pavo real común y el faisán común.

| Resolución | V4.7.1 | Lote nuevo | V4.7.2 |
| --- | ---: | ---: | ---: |
| 64 px | 2,13 MB | 0,17 MB | 2,30 MB |
| 128 px | 5,08 MB | 0,43 MB | 5,50 MB |
| 256 px | 14,34 MB | 1,21 MB | 15,55 MB |
| 512 px | 43,36 MB | 3,86 MB | 47,22 MB |
| **Total** | **64,91 MB** | **5,66 MB** | **70,58 MB** |

El caché base pasa de **87,54 MB** a **93,50 MB**. Los 636 recursos comparativos del laboratorio ocupan **11,70 MB** en el caché opcional. Una lámina de 128 px ocupa 65.536 bytes RGBA decodificada. [Mediciones y comprobaciones](mediciones.json)

## Validación funcional

Pasaron las 13 pruebas de publicación. La suite histórica ejecutó 811 pruebas, con 583 aprobadas y los mismos 228 fallos de V4.7.1. [Comparación de la suite histórica](regresion.json)

El laboratorio pasó los trece modos a 320 y 1280 px, con filtros por grupo, orden y familia, revisión individual y exportación JSON sin conexión. Se comprobaron los tres kiwis a 64 px y las dos láminas de dimorfismo del pavo real a 128 px, con un halo común. [Kiwis en móvil](comparacion-kiwis-320.jpg) · [Pavo real en móvil](pavo-real-320.jpg)

La actualización de V4.7.1 a V4.7.2 en Chromium conservó el respaldo exacto y los diez campos de partida comprobados en ambos tamaños. Sin conexión se verificaron la hembra del avestruz común con halo notable en Campo, la pradera de la zona, el avistamiento automático de la perdiz roja y las láminas del avestruz en Cuaderno, Bestiario y Museo. [Resultados de PWA](pwa.json) · [Avestruz en Campo](avestruz-390.jpg)

| Ancho | Apertura de Campo y decodificación | Memoria JS de Campo | Siguiente avistamiento de perdiz roja |
| --- | ---: | ---: | ---: |
| 390 px | 87 a 91 ms | 6,41 a 10,35 MB | 674 ms |
| 1280 px | 96 a 79 ms | 8,26 a 8,47 MB | 970 ms |

Los tiempos y la memoria son mediciones puntuales del navegador de validación. Las dos primeras columnas de medidas muestran V4.7.1 y V4.7.2 en ese orden.

Capacitor sincronizó los 5.164 archivos cotejados byte a byte con `versionCode 40702`. El flujo Android verifica el APK firmado y lo vincula al commit de publicación. La restauración en un dispositivo físico se valida con el procedimiento Android. [Flujo de firma](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml) · [Procedimiento Android](../../README_ANDROID_FIRMA_PERMANENTE.md)

## Preparación de V4.7.3

El siguiente inventario reúne 62 aves arborícolas y de otros grupos no paseriformes. [Inventario preparado](plan-v473.md)
