# El Gran Atlas V4.4.0 · Ilustración científica clásica y ungulados

La Serie 4 pasa a la ilustración zoológica clásica con tinta y grafito finos, acuarela controlada y una silueta transparente por ejemplar. El juego conserva 997 especies, 125 regiones y 16 paisajes reutilizables. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Estándar de ilustración](estandar.md)

## Inventario

| Grupo | Especies ilustradas | Láminas distintas |
| --- | ---: | ---: |
| Marsupiales | 29 | 33 |
| Monotremas | 3 | 3 |
| Felinos | 31 | 63 |
| Cánidos | 28 | 53 |
| Otros carnívoros terrestres | 51 | 93 |
| Primates | 49 | 96 |
| Ungulados | 122 | 249 |
| **Total** | **313** | **590** |

La auditoría partió de `0719d2816470ad9a7adbb35387384d97bfaa3794`. Confirmó 191 especies migradas, 341 WebP transparentes, 146 registros de variantes biológicas, cinco legendarios y 16 paisajes. Se sustituyeron las 341 láminas y se conservaron sus 342 rutas, incluida la ruta masculina que comparte la lámina normal del león. Se incorporaron 249 archivos canónicos para los ungulados ya presentes en el catálogo. El resultado incluye 294 registros de variantes y cinco legendarios con lámina propia. Cada una de las 590 láminas existe a cuatro resoluciones, para un total de 2.360 WebP de animales. [Inventario y rutas](inventario.json) · [Catálogo gráfico](../../www/naturalist-art/CATALOGO.md)

El cruce de géneros y familias recuperó cuatro registros del catálogo que faltaban en la lista preliminar de 118. Son el rebeco pirenaico, el muflón europeo y los pudúes del norte y del sur. Las 21 especies de ungulados con dimorfismo configurado tienen una lámina específica de hembra y usan una lámina de macho adulto para las rutas normal y macho. Ámbar, Niebla, Fenrir, Ascua y Silverback conservan sus identidades, sus rutas y su halo legendario.

## Revisión artística

Se reutilizaron las 33 láminas del piloto de marsupiales y se generaron 557 láminas para el resto del alcance. Algunas poses cambiaron para hacer visibles los rasgos diagnósticos. La revisión se centró en pezuñas, cornamenta, hocicos, proporciones y pigmentación. Por ejemplo, los asnos africano y somalí se distinguen por la marca de la cruz y las bandas de las patas. Los rinocerontes blanco y negro difieren en la línea del labio y el porte de la cabeza. Se corrigieron láminas tras detectar bordes claros en algunos zorros y diferencias anatómicas insuficientes entre taxones cercanos.

El laboratorio presenta el SVG, el WebP de V4.3.0 y la nueva ilustración a la misma escala. Los 341 WebP históricos a 256 px son copias exactas de la versión anterior. Los ungulados muestran el SVG previo y su primera lámina de Serie 4. La vista de recorte histórico sigue disponible. El laboratorio mantiene Campo mixto, los cuatro contextos del juego, escalas reales, halos, filtros, revisión por variante, exportación JSON y un caché opcional para las comparaciones. [Comparación a 320 px](comparacion-320.jpg) · [Comparación a 1280 px](comparacion-1280.jpg)

## Almacenamiento y compresión

Las cifras usan MB decimales. La columna «mismas identidades» compara exactamente las 341 láminas de V4.3.0 con sus sustitutas.

| Tamaño | V4.3.0 | V4.4.0, mismas identidades | Ungulados | V4.4.0 total |
| --- | ---: | ---: | ---: | ---: |
| 64 px | 0,79 MB | 0,72 MB | 0,57 MB | 1,29 MB |
| 128 px | 1,92 MB | 1,75 MB | 1,36 MB | 3,11 MB |
| 256 px | 5,48 MB | 5,04 MB | 3,77 MB | 8,80 MB |
| 512 px | 14,02 MB | 14,91 MB | 10,80 MB | 25,72 MB |
| **Total** | **22,21 MB** | **22,42 MB** | **16,50 MB** | **38,92 MB** |

Sustituir las 341 láminas aumentó el peso combinado en 0,21 MB. Los derivados de 64, 128 y 256 px se redujeron entre 8,1 % y 8,8 %. El caché base pasó de 41,27 MB a 60,11 MB, y la descarga opcional de referencias del laboratorio pasó de 6,18 MB a 11,70 MB.

La comparación de compresión incluye diez láminas canónicas. A calidades 75, 80, 85, 90 y 95 totalizaron 316, 356, 400, 472 y 589 kB, respectivamente. La calidad 90 dio 37,60 dB de PSNR medio sobre píxeles visibles. Se mantuvieron los niveles 82, 83, 86 y 90 por tamaño y el alfa a calidad 100. [Mediciones por resolución](mediciones.json) · [Muestras de compresión](compresion.json)

## Compatibilidad

El catálogo zoológico, los cuatro módulos, las condiciones de aparición, la economía y el formato de partida usan el código de V4.3.0. La versión 4.4.0 identifica por separado la exportación del respaldo y el nuevo caché PWA. La auditoría verificó las cuatro resoluciones, el canal alfa, el margen de las siluetas y el contenido visible de las miniaturas en los 2.360 WebP.

La actualización PWA desde V4.3.0 se probó en Chromium a 390 y 1280 px. Conservó los diez campos de partida cotejados y su respaldo exacto, y respetó el bloqueo de actualización cuando había otra ventana abierta. Campo automático reutilizó el paisaje y la imagen en encuentros consecutivos. Campo, Bestiario, Cuaderno, Museo y los halos se verificaron en el juego. También se verificó la carga sin conexión de las ilustraciones, incluido el dimorfismo del ciervo rojo, y del laboratorio con su caché opcional independiente. [Resultados PWA](pwa.json) · [Campo](campo-390.jpg) · [Cuaderno](cuaderno-390.jpg) · [Silverback](silverback-390.jpg)

En esa ejecución se observaron 102 → 105 ms de apertura y decodificación de Campo a 390 px y 62 → 88 ms a 1280 px. El heap de JavaScript medido pasó de 7,96 a 10,11 MB y de 7,43 a 10,22 MB, respectivamente. Un WebP de 128 px decodificado ocupa 65.536 bytes RGBA. Estas cifras corresponden a Chromium en el equipo de validación. [Mediciones de Campo](pwa.json)

La validación de Android utiliza el candidato firmado del flujo del repositorio. La distribución como release Android requiere restaurar una partida en un dispositivo físico y vincular el resultado al hash exacto del APK. [Procedimiento Android](../../README_ANDROID_FIRMA_PERMANENTE.md)
