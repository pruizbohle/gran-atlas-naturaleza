# El Gran Atlas V4.7.3 · Aves arborícolas, chucao y sapo pulga

GM-07-A04 añade **94 láminas científicas para 64 especies**. El atlas alcanza **705 de 998 especies ilustradas**, entre ellas **243 de 287 aves**, con **1.221 láminas**, 531 registros de variantes biológicas y siete legendarios. El inventario de partida corresponde a V4.7.2, commit `89c8c6ba852cf1f8a43b5af00e644ecacb357ec2`. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar la PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v473.html)

## Cobertura artística

| Alcance | Especies | Normales | Albinas | Melánicas | Machos y hembras |
| --- | ---: | ---: | ---: | ---: | ---: |
| Inventario arborícola y demás no paseriformes | 62 | 62 | 15 | 7 | 8 |
| Chucao y sapo pulga | 2 | 2 | 0 | 0 | 0 |
| **Total** | **64** | **64** | **15** | **7** | **8** |

Los guacamayos se revisaron por forma del pico, longitud de cola, franjas alares y piel facial. En los tucanes y cálaos se cotejaron los perfiles y sus proporciones, incluido el casco curvado hacia arriba del cálao rinoceronte. Se dibujaron por separado los machos y hembras del carpintero magallánico, los colibríes garganta rubí y de Ana, y la cacatúa ninfa. La pose del picoespada conserva el pico completo. La del colibrí abeja amplía sus rasgos al tamaño de juego. La cola del quetzal se dispuso en diagonal para conservar las plumas ornamentales.

Doce láminas de pigmentación se dibujaron por separado. Las otras diez se derivaron de la lámina normal y se revisaron sobre fondos claros y oscuros para conservar detalles diagnósticos. El laboratorio suma 13 conjuntos anatómicos a los 38 anteriores. El filtro Edición permite revisar las 64 especies ilustradas, las dos fichas de esta edición y el alta del sapo pulga. [Estándar artístico](../cientifica-v440/estandar.md) · [Comparación de cálaos](comparacion-calaos-1280.jpg)

## Chucao y sapo pulga

El chucao ya formaba parte de las 997 especies de V4.7.2 con el ID `sa_esp_scelorchilus_rubecula`. Su rareza vigente es **Común**. Mantiene su presencia en Patagonia y Tierra del Fuego y suma **Bosques templados del sur** como región principal, donde puede observarse en el bosque. Su nombre científico es *Scelorchilus rubecula*, orden Passeriformes, familia Rhinocryptidae. La monografía describe su distribución chileno-argentina, alimentación en el sotobosque y canto. [Ficha del Ministerio del Medio Ambiente de Chile](https://clasificacionespecies.mma.gob.cl/wp-content/uploads/2019/10/Scerlochilus_rubecula_14RCE_FINAL.pdf)

El sapo pulga es el alta del lote, con ID `sa_esp_brachycephalus_pulex`, clase Amphibia, orden Anura y familia Brachycephalidae. Tiene rareza **Muy rara**, hábitat `bosque`, actividad diurna y al atardecer, las cuatro estaciones y ejemplares Notables. Su distribución natural documentada es **Serra Bonita, Bahía, Brasil**. Para el avistamiento, el bosque del Cerrado brasileño (`sa_cerrado_brasileno`) aproxima la localidad en la cartografía jugable vigente, que tiene 125 regiones. [Descripción original y distribución](https://amphibiansoftheworld.amnh.org/Amphibia/Anura/Brachycephaloidea/Brachycephalidae/Brachycephalus/Brachycephalus-pulex)

La monografía cita la medición de **6,45 mm** de longitud hocico-cloaca en un macho adulto. El estudio lo identifica como el anfibio más pequeño conocido. El dato figura en la ficha zoológica como referencia para futuros récords. Las monografías se leen en Sociedad y en el Bestiario después de publicarlas. [Bolaños, Dias y Solé (2024)](https://doi.org/10.1111/zsc.12654)

## Peso e integridad

Se cotejaron **4.508 archivos WebP previos** y las rutas de las **641 especies** que ya tenían lámina científica. Se abrieron los **4.884 WebP de animales** y se verificaron las dimensiones, el canal alfa y los márgenes. El lote añade 376 derivados con calidades 82, 83, 86 y 90 y alfa a calidad 100.

| Resolución | V4.7.2 | Lote nuevo | V4.7.3 |
| --- | ---: | ---: | ---: |
| 64 px | 2,30 MB | 0,17 MB | 2,48 MB |
| 128 px | 5,50 MB | 0,41 MB | 5,91 MB |
| 256 px | 15,55 MB | 1,13 MB | 16,68 MB |
| 512 px | 47,22 MB | 3,49 MB | 50,71 MB |
| **Total** | **70,58 MB** | **5,21 MB** | **75,78 MB** |

El caché base pasa de **93,50 MB** a **99,02 MB**. Los 636 recursos de comparación del laboratorio ocupan **11,70 MB** en el caché opcional. Una lámina de 128 px ocupa 65.536 bytes RGBA decodificada. [Mediciones y comprobaciones](mediciones.json)

## Validación funcional

Pasaron las 15 pruebas de publicación. La suite completa ejecutó 813 pruebas, con 585 aprobadas, incluidas las dos pruebas nuevas, y los mismos 228 fallos de V4.7.2. [Comparación de la suite histórica](regresion.json)

El laboratorio pasó los trece modos a 320 y 1280 px, incluido el filtro Edición, la revisión individual y la exportación JSON sin conexión. Se comprobaron las cuatro láminas de colibríes a 64 px y los tres cálaos asiáticos a 128 px. [Comparación de cálaos en móvil](comparacion-calaos-320.jpg)

La actualización de V4.7.2 a V4.7.3 en Chromium conservó el respaldo exacto y los once campos de partida comprobados en ambos tamaños. Sin conexión se registraron los descubrimientos automáticos del chucao y del sapo pulga, cada uno en el bosque de su región configurada. Las láminas cargaron en Campo, Cuaderno, Bestiario y Museo. Las fichas publicadas mostraron la monografía y su referencia. [Resultados de PWA](pwa.json) · [Chucao en Campo](chucao-390.jpg) · [Sapo pulga en Campo](sapo-pulga-390.jpg)

| Ancho | Apertura de Campo y decodificación | Memoria JS de Campo | Tiempo hasta el primer avistamiento de prueba del sapo |
| --- | ---: | ---: | ---: |
| 390 px | 164 a 141 ms | 8,42 a 8,48 MB | 2365 ms |
| 1280 px | 63 a 87 ms | 7,15 a 10,76 MB | 1312 ms |

Los tiempos y la memoria son mediciones puntuales del navegador de validación. Las dos primeras columnas de medidas muestran V4.7.2 y V4.7.3 en ese orden.

Capacitor sincronizó los 5.543 archivos cotejados byte a byte con `versionCode 40703`. El flujo Android verifica el APK firmado y lo vincula al commit de publicación. La restauración en un dispositivo físico se valida con el procedimiento Android. [Flujo de firma](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml) · [Procedimiento Android](../../README_ANDROID_FIRMA_PERMANENTE.md)

## Preparación de V4.7.4

Quedan 44 paseriformes por ilustrar. El plan canónico asigna el chucao a V4.7.3. [Inventario pendiente de V4.7.4](plan-v474.md)
