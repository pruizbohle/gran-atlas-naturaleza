# El Gran Atlas V4.5.0 · Mamíferos terrestres restantes

La migración GM-07-M07 incorpora ilustraciones científicas clásicas para los mamíferos terrestres y semiacuáticos pendientes del catálogo. Las 590 láminas de V4.4.0 conservan sus cuatro resoluciones y sus rutas. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Estándar gráfico](../cientifica-v440/estandar.md)

## Alcance auditado

Punto de partida `5cf1806c0d795aa6e849a8b7511f6c9f0fa6286d`. El juego tiene 997 especies. La base incluía 313 especies ilustradas, 590 láminas distintas, 294 registros de variantes y cinco legendarios migrados. Sus ilustraciones pesaban 38,92 MB entre las cuatro resoluciones y usaban 16 paisajes reutilizables.

| Orden | Especies del lote |
| --- | ---: |
| Rodentia | 41 |
| Lagomorpha | 15 |
| Eulipotyphla | 10 |
| Chiroptera | 7 |
| Cingulata | 6 |
| Pilosa | 6 |
| Pholidota | 6 |
| Proboscidea | 3 |
| Afrosoricida | 1 |
| Hyracoidea | 1 |
| Tubulidentata | 1 |
| **Total** | **97** |

Las 97 especies abarcan 35 familias y tienen 69 variantes de pigmentación configuradas. El juego no asigna dimorfismos sexuales a este lote. Atlas, el elefante africano de sabana legendario, tiene una ilustración individual con constitución robusta, orejas desplegadas y colmillos asimétricos. Su halo se compone con el mismo motor que los cinco legendarios anteriores.

Se incorporaron 167 láminas y 668 WebP contando las cuatro resoluciones. El avance acumulado es de **410 de 997 especies**, **757 láminas**, **363 registros de variantes** y **seis legendarios**. La biblioteca conserva sus 16 paisajes. [Inventario por familia y estado](inventario.json) · [Catálogo gráfico](../../www/naturalist-art/CATALOGO.md)

## Revisión artística

La revisión contrastó las siluetas a tamaño de juego y sobre fondos claros y oscuros. Se distinguieron murciélagos por forma de orejas, estructura alar, dedos y postura. Los erizos, puercoespines y tenrecs se revisaron por el tipo y la distribución de las púas. Se cotejaron el número de bandas y la forma de las placas de cada armadillo, las escamas de los pangolines, y las garras y posturas de los perezosos y osos hormigueros. En el conjunto de elefantes se revisaron las orejas, las cúpulas craneales, la trompa y los colmillos.

La comparación del laboratorio muestra el SVG original, las referencias históricas disponibles y la lámina actual. El nuevo lote estrena su primera ilustración de Serie 4, por lo que dispone de dos referencias visuales. Los controles de escala, fondos, halos, campo mixto, simulación de módulos, filtrado por familia, revisión individual y exportación JSON siguen disponibles. Los referentes de V4.4.0 conservan su tamaño y se cachean por separado. [Comparación de Atlas en el laboratorio](comparacion-atlas-1280.jpg)

## Inventario para V4.6.0

La auditoría de los 461 registros de Mammalia deja 410 migrados y 51 reservados para la siguiente versión, con seis variantes de pigmentación pendientes y todas las identidades legendarias de Mammalia ilustradas. El inventario reservado distingue cetáceos, sirenios, pinnípedos y la nutria marina. Los dos delfines del género *Inia* se cuentan en el lote de cetáceos, con hábitat de agua dulce. Los castores, el chigüiro, el coipo y los desmanes están en V4.5.0.

Se documentaron etiquetas históricas que no coinciden con las familias zoológicas, por ejemplo el lobo marino del Cabo clasificado como mustélido y la rata topo gigante agrupada entre insectívoros. La clasificación editorial del informe y del laboratorio es independiente de la clasificación productiva. [Inventario de V4.6.0 y observaciones](inventario.json)

## Tamaños y proyección

Las cifras usan MB decimales. Se cotejaron byte a byte los 2.360 WebP de V4.4.0 y las rutas de sus 313 especies.

| Resolución | V4.4.0 | Lote nuevo | V4.5.0 |
| --- | ---: | ---: | ---: |
| 64 px | 1,29 MB | 0,31 MB | 1,60 MB |
| 128 px | 3,11 MB | 0,74 MB | 3,85 MB |
| 256 px | 8,80 MB | 2,17 MB | 10,97 MB |
| 512 px | 25,72 MB | 7,14 MB | 32,85 MB |
| **Total** | **38,92 MB** | **10,35 MB** | **49,28 MB** |

El caché base pasa de **60,11 MB a 71,06 MB**. El caché opcional del laboratorio conserva **11,70 MB** y 636 recursos. Los 3.028 WebP de animales pasaron la comprobación de tamaño, alfa real y bordes del lienzo. Las miniaturas de 64 y 128 px también pasaron la comprobación de cobertura visible. Se mantuvieron las calidades 82, 83, 86 y 90, con alfa a calidad 100.

Para completar las 997 especies, quedan 587 especies con 912 rutas de ilustración estimadas al contar una lámina por variante y sexo. Con un promedio de 61.994 bytes por lámina y sus derivados en este lote, el arte productivo llegaría a **105,81 MB** y el caché base a **127,60 MB**. Aplicar los pesos de los percentiles 25 y 75 del lote produce un intervalo de 114,51 a 138,88 MB para el caché base. La proyección atribuye el aumento a las láminas. Las diferencias entre clases zoológicas, las rutas compartidas para dimorfismo y el tamaño de futuros índices pueden cambiar la cifra. [Mediciones y metodología](mediciones.json)

## Validación funcional

Las doce pruebas del control de release pasaron. La actualización PWA desde V4.4.0 se probó en Chromium a 390 y 1280 px. Conservó el respaldo exacto y los diez campos de partida cotejados, entre ellos los descubrimientos, las variantes, el Museo, la economía y el inventario. Se verificaron Campo, Cuaderno, Bestiario y Museo. Campo conservó el encuentro mixto y reutilizó el paisaje y el WebP decodificado en encuentros consecutivos. Atlas y su halo se cargaron sin conexión. El laboratorio pasó los doce modos a 320 y 1280 px, con la exportación JSON y la descarga opcional de referencias. [Prueba PWA](pwa.json) · [Atlas en Campo](atlas-390.jpg) · [Atlas en el laboratorio](comparacion-atlas-1280.jpg)

En la ejecución medida, la apertura de Campo hasta decodificar la lámina pasó de 75 a 35 ms a 390 px y de 58 a 46 ms a 1280 px. El heap de JavaScript pasó de 6,09 a 10,47 MB y de 7,89 a 10,18 MB respectivamente. El siguiente encuentro automático de la prueba tardó 837 y 801 ms. Una imagen de Campo de 128 px ocupa 65.536 bytes RGBA una vez decodificada. Son mediciones puntuales del navegador de validación. [Tiempos y memoria](pwa.json)

La sincronización local de Capacitor confirmó `versionCode 40500` y la igualdad byte a byte de los 3.684 recursos cotejados. El flujo firmado comprueba el APK generado y lo vincula al commit. La restauración en dispositivo físico se valida mediante el procedimiento Android del repositorio. [Procedimiento Android](../../README_ANDROID_FIRMA_PERMANENTE.md)
