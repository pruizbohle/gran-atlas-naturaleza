# El Gran Atlas V4.7.0 · Rapaces diurnas y nocturnas

GM-07-A01 incorpora **49 rapaces de siete familias** y 86 láminas científicas. El atlas alcanza **510 de 997 especies** ilustradas, con **49 de 287 aves** y los **461 mamíferos**. La colección reúne 900 láminas distintas, 405 registros de variantes biológicas y siete legendarios. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualización PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v470.html)

## Alcance artístico

| Orden | Familias en el lote | Especies |
| --- | --- | ---: |
| Accipitriformes | Accipitridae, Cathartidae, Pandionidae, Sagittariidae | 31 |
| Falconiformes | Falconidae | 7 |
| Strigiformes | Strigidae, Tytonidae | 11 |
| **Total** | **7 familias** | **49** |

Se cotejó el alcance contra el catálogo de V4.6.0, commit `3560d7d350e3baa4199516f36606e82a8d240021`. El conteo de 86 láminas suma 49 normales, 20 albinas, 14 melánicas, dos láminas de dimorfismo y una legendaria. El cóndor andino tiene tres láminas distintas. La normal lo muestra en vuelo y las posadas permiten comparar la carúncula del macho con la cabeza de la hembra. Centinela tiene su propia lámina de águila real adulta con nuca dorada, postura vigilante y alas recogidas. Su descripción sigue siendo «La nuca dorada destaca sobre las alas recogidas de este vigilante». [Inventario por ID, orden y familia](../cientifica-v460/inventario-aves.json) · [Estándar artístico](../cientifica-v440/estandar.md)

La revisión anatómica se centró en las proporciones de alas y cola, las marcas faciales de los falcónidos, las gorgueras y la piel desnuda de los carroñeros, y los discos faciales, los ojos y los penachos de los estrigiformes. Las comparaciones de pigmentación distinguen el búho nival blanco de ojos amarillos y el albino de ojos rosados. La mayoría de las variantes se obtuvo ajustando la pigmentación de la lámina normal. Se dibujaron de forma independiente los albinos de búho nival, pigargo americano y alimoche y el gerifalte melánico. Se ajustaron las sombras del resto de los melánicos para que las plumas siguieran siendo legibles. Se rehízo la lechuza común por la cercanía de las garras al borde del original. Se revisaron siluetas sobre fondos claros y oscuros, junto con los derivados a 64 y 128 px.

## Laboratorio y presentación

El laboratorio añade filtros por orden y familia y diez comparaciones anatómicas. Cada conjunto usa un fondo y escala comunes con fichas de rasgos diagnósticos. El laboratorio conserva la comparación con SVG, las variantes, los legendarios, la revisión individual, la exportación JSON y las simulaciones de Campo, Campo mixto, Cuaderno, Bestiario y Museo.

Campo utiliza paisajes de la zona explorada y Bestiario usa el hábitat representativo. Cuaderno conserva el papel naturalista y Museo la ambientación de colección. Los halos se dibujan sobre la silueta desde el motor existente. Se conservan los 16 paisajes compartidos.

## Peso e integridad

La auditoría cotejó los **3.256 WebP previos** y las rutas de las **461 especies** publicadas en V4.6.0. El lote añade **344 archivos**. Los 3.600 WebP de animales se abrieron y verificaron con sus dimensiones, canal alfa y márgenes transparentes. Se conservan las cuatro resoluciones con calidades 82, 83, 86 y 90 y alfa a calidad 100.

| Resolución | V4.6.0 | Lote nuevo | V4.7.0 |
| --- | ---: | ---: | ---: |
| 64 px | 1,68 MB | 0,17 MB | 1,85 MB |
| 128 px | 4,03 MB | 0,40 MB | 4,43 MB |
| 256 px | 11,47 MB | 1,11 MB | 12,58 MB |
| 512 px | 34,47 MB | 3,48 MB | 37,94 MB |
| **Total** | **51,65 MB** | **5,15 MB** | **56,80 MB** |

El caché base pasa de **73,58 MB** a **79,01 MB**. Los 636 recursos comparativos permanecen en un caché opcional de **11,70 MB**. A 128 px, cada lámina ocupa 65.536 bytes RGBA decodificada. [Mediciones y comprobaciones](mediciones.json)

## Validación funcional

Las 13 pruebas de publicación pasaron. El laboratorio pasó sus trece modos a 320 y 1280 px, incluidos los filtros por orden y familia, el dimorfismo del cóndor, el halo de Centinela, la nueva comparación anatómica y la exportación de revisiones sin conexión. [Comparación de búhos en móvil](comparacion-buhos-320.jpg) · [Comparación en escritorio](comparacion-buhos-1280.jpg)

Chromium conservó el respaldo exacto y los diez campos comparados de la partida al actualizar de V4.6.0 a V4.7.0, tanto desde la pantalla de actualización anterior como desde la nueva. Sin conexión cargaron el laboratorio, los encuentros mixtos SVG y WebP y Centinela con su halo sobre el paisaje de montaña. Cuaderno mostró la lámina normal del águila real y el avistamiento automático de busardo reutilizó el elemento de imagen. [Resultados PWA](pwa.json) · [Centinela en Campo](centinela-390.jpg)

| Ancho | Apertura de Campo y decodificación | Memoria JS de Campo | Siguiente avistamiento de busardo |
| --- | ---: | ---: | ---: |
| 390 px | 87 a 45 ms | 6,14 a 10,40 MB | 516 ms |
| 1280 px | 58 a 91 ms | 7,96 a 10,38 MB | 796 ms |

Los tiempos y la memoria representan la ejecución en Chromium en el equipo de validación. Las cifras de apertura y memoria muestran V4.6.0 y V4.7.0 en ese orden.

La sincronización local de Capacitor confirmó `versionCode 40700` y la igualdad byte a byte de 4.256 archivos entre la web y el paquete nativo. El flujo de firma verifica el APK y lo vincula al commit. La restauración en un dispositivo físico se registra con el procedimiento Android del repositorio. [Flujo de firma](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml) · [Procedimiento Android](../../README_ANDROID_FIRMA_PERMANENTE.md)

## Preparación de la próxima edición

V4.7.1 queda delimitada en dos tandas internas de 42 especies marinas y costeras y 50 ribereñas y de humedales. [Plan de preparación V4.7.1](plan-v471.md)
