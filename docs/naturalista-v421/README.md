# El Gran Atlas V4.2.1 · Consolidación naturalista

[Web pública](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Estándar obligatorio](estandar.md)

El inventario de `feat/serie4-capas-naturalistas` en `64d1e59` confirmó 997 especies, 142 especies migradas, 245 ilustraciones distintas y 16 paisajes. Partía con 16 ilustraciones con alfa. Se recortaron las 229 restantes y se reoptimizaron las primeras 16. Las 245 láminas usan sus originales y conservan las rutas existentes. El recorte combina segmentación y revisión sobre fondo claro y oscuro. Se usaron máscaras alternativas y ediciones localizadas para aislar colas, eliminar ramas, abrir espacios entre patas y conservar pelaje y garras.

El inventario final contiene **245 láminas recortadas, 0 pendientes de recorte y 10 observaciones de borde** en ilustraciones ya operativas. El laboratorio muestra la nota y la exporta en JSON. [Observaciones individuales](../../www/naturalist-art/review/observations.json)

## Archivos WebP

| Recurso | V4.2.0 pública | V4.2.1 |
| --- | ---: | ---: |
| Láminas de 64 px | 274 504 B | 566 834 B |
| Láminas de 128 px | 963 192 B | 1 384 032 B |
| Láminas de 256 px | 4 091 668 B | 3 977 204 B |
| Láminas de 512 px | 16 192 976 B | 9 378 758 B |
| Total de láminas | 21 522 340 B | 15 306 828 B |
| 16 paisajes compartidos | — | 417 488 B |
| 245 originales de referencia a 256 px | — | 4 091 668 B |
| 50 muestras de compresión a 512 px | — | 2 089 662 B |
| Total gráfico con laboratorio | 21 522 340 B | 21 905 646 B |

Las láminas del juego pesan **6 215 512 B menos (−28,88 %)**. Los recursos de comparación offline llevan el total gráfico publicado a 383 306 B por encima de la versión pública anterior (+1,78 %). Frente a los 22 479 630 B de láminas de la rama inicial, el nuevo juego reduce 7 172 802 B de láminas. [Pesos por archivo](mediciones.json)

Se compararon 10 ilustraciones representativas a calidades 75, 80, 85, 90 y 95. La muestra cubre pelaje fino y espinas, pelaje claro y oscuro, postura de cuerpo completo y dos ejemplares legendarios. A 512 px, la calidad 90 redujo la muestra de 1 337 488 B sin pérdida a 456 822 B, con PSNR medio de 41,36 dB en RGB del interior del animal y un error del percentil 95 de hasta 6 niveles RGB. La calidad 85 ahorraba otros 43 034 B de la muestra a 512 px, con 38,52 dB. El canal alfa usa calidad 100. Reducirlo a 85 o 95 a 512 px ahorraba menos del 0,13 % en la muestra a calidad 90 y cambiaba píxeles del borde. Las calidades finales son 82, 83, 86 y 90 para 64, 128, 256 y 512 px. [Muestra y mediciones](compresion.json)

## Presentación

Normal se presenta sin halo. Bronce, plata y oro distinguen Notable, Épico y Excepcional. Legendario combina esmeralda y luz cálida. Los halos siguen el alfa por CSS. Campo reutiliza el paisaje asociado a la zona y ajusta la iluminación al amanecer, atardecer y noche. Bestiario utiliza el hábitat representativo para especies descubiertas. Cuaderno usa papel y Museo vitrina. Se revisaron los 31 hábitats de las 125 regiones. La biblioteca sigue con 16 paisajes. El mapa de bosque regional incorpora perfiles húmedos tropicales, de taiga y de sabana arbolada usando escenas existentes.

El laboratorio añade comparación antes y después, compresión, fondo claro/oscuro/cuadrícula y filtro por estado. Conserva simulaciones por módulo, filtro zoológico, vista individual, revisión, exportación JSON y marco clásico comparativo. Las ilustraciones base, las variaciones biológicas y los legendarios siguen las rutas de la misma población del catálogo.

## Validación

- Se comprobó formato WebP, tamaño y presencia real de opacidad y transparencia en los **980 archivos** de juego. Al codificar, se verificó que las cuatro resoluciones conservan el alfa respecto de sus máscaras de entrada.
- Pasaron las nueve pruebas de versión y los doce modos del laboratorio a 320 y 1280 px. Se comprobaron comparaciones de las cinco calidades, cambio de fondo, filtros, notas, exportación individual y acceso offline.
- El proyecto Android generado con Capacitor pasó la comprobación de identidad histórica, código de versión 40201, orientación, plugins de respaldo y paridad de los 1512 archivos web.
- Chromium probó la actualización desde la V4.2.0 pública en 390 y 1280 px, incluido el acceso desde su actualizador anterior. La copia del guardado se mantuvo exacta, los 10 campos controlados coincidieron y el caché nuevo conservó 1502 entradas. Campo mantuvo `×3` y `×2`, el encuentro mixto y la reutilización de la ilustración decodificada y del paisaje en avistamientos automáticos. Se comprobaron luz del día, cambio de hábitat, Cuaderno, Bestiario, Museo y reapertura offline. [Resultados PWA](pwa.json)
- En esa ejecución, el primer render de Campo pasó de 112 a 158 ms a 390 px y de 59 a 123 ms a 1280 px. El heap JavaScript observado pasó de 7,97 a 9,50 MB y de 7,87 a 10,77 MB, respectivamente. La ilustración de Campo de 128 px ocupa 64 KiB decodificada. Las cifras son muestras de Chromium en el entorno de prueba y el heap mide solo memoria JavaScript. [Campo móvil](campo-390.jpg) · [Cuaderno móvil](cuaderno-390.jpg)

- Las pruebas concurrentes de Campo, Bestiario, Cuaderno, Museo, PWA y arte incluyeron 77 casos. Pasaron 56 y los 21 fallos coincidieron por nombre con los de la V4.2.0 pública. [Comparación histórica](pruebas-compatibilidad.json)

El APK se genera con el workflow de firma permanente. La publicación oficial de Android requiere la verificación de restauración en un dispositivo con el mismo binario candidato.
