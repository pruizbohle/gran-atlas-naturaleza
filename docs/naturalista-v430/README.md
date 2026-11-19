# El Gran Atlas V4.3.0 · Primates

[Juego web](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizador PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v430.html)

## Inventario

Base `0e7767dbbc9b59f17fb18855dabcd7538a408851` de V4.2.1. Se conservaron las 997 especies existentes. La revisión de nombres científicos identificó 49 primates en 14 familias, incluidos los dos tarseros y primates americanos que estaban en otras categorías de la interfaz. El grupo «Primates» del laboratorio usa la familia zoológica. Las categorías de producción conservan sus reglas y valores.

| Indicador | V4.2.1 | V4.3.0 |
| --- | ---: | ---: |
| Especies migradas | 142 | 191 |
| Proporción del catálogo | 14,24 % | 19,16 % |
| Ilustraciones transparentes distintas | 245 | 341 |
| Registros de variantes biológicas | 100 | 146 |
| Legendarios migrados | 4 | 5 |
| Paisajes reutilizables | 16 | 16 |

El lote añade **96 láminas**: 49 normales, 21 albinas, 19 melánicas, tres machos, tres hembras y Silverback. Los sexos corresponden a mandril, babuino hamadríade y gelada. Los albinos y melánicos adaptan el pigmento sobre la geometría de su especie y conservan el alfa. Las placas de ambos sexos y el legendario son ilustraciones distintas. Silverback conserva su ID y sus condiciones de aparición y tiene una postura sentada diferenciada del gorila de montaña normal. El conteo de variantes incluye el registro de macho que comparte la ilustración base del león africano. [Inventario por familia, especie y variante](inventario.json)

Las láminas usan acuarela y grafito, fondo transparente y WebP a 64/128/256/512 px con calidades 82/83/86/90 y alfa 100. Se revisaron curvas de cola, manos, pies, rostro y pelaje sobre fondo claro, oscuro y a tamaño reducido. Los halos se aplican en el motor gráfico. [Muestra visual a 64 px](revision-primates.jpg) · [Silverback en Campo](silverback-390.jpg)

## Peso y funcionamiento offline

| Recurso | Tamaño |
| --- | ---: |
| Lote nuevo de primates, cuatro resoluciones | 6 907 976 B |
| Láminas de juego acumuladas | 22 212 726 B |
| Caché básico de V4.2.1 | 40 070 760 B |
| Caché básico de V4.3.0 | 41 272 458 B |
| Comparativas y muestras opcionales del laboratorio | 6 181 330 B |

El caché básico crece 1 201 698 B (+3,00 %) tras añadir los primates y separar 295 recursos comparativos. **Descargar comparaciones offline** guarda el lote opcional en su propio caché. Las visualizaciones individuales también se guardan al consultarlas. Las láminas, los SVG de referencia y las vistas de juego del laboratorio están disponibles en el caché básico. El APK conserva las comparativas en sus archivos porque el flujo Android habitual empaqueta `www/` completo y comprueba su paridad. [Mediciones por lámina y resolución](mediciones.json)

## Revisión secundaria

Se revisaron las diez observaciones de V4.2.1. Se retiraron restos aislados del fondo de la lámina normal del leopardo de las nieves y del numbat, conservando el resto de sus máscaras. Se cerró la observación del leopardo y se mantuvo la del numbat por el pelo fino de la cola. Quedan nueve observaciones activas. La revisión preservó los originales de los otros grupos. [Observaciones vigentes](../../www/naturalist-art/review/observations.json)

## Validación

- Pasaron las diez pruebas específicas de la versión. Se comprobó el WebP, tamaño y alfa real de los **1364 archivos** de juego y se comprobó el alfa bit a bit al generar los cuatro tamaños de primates.
- Chromium validó los doce modos del laboratorio a 320 y 1280 px, las dos referencias comparativas, los filtros zoológicos, Silverback, el JSON y las cinco calidades offline desde el caché opcional.
- La prueba PWA parte de V4.2.1 y usa ambos puntos de entrada del actualizador. Comprueba el respaldo exacto, diez campos restaurados, avistamientos múltiples, Campo automático, el paisaje activo, las vitrinas, Cuaderno, Bestiario y reapertura offline. [Resultados PWA](pwa.json)
- En la muestra de Chromium, el primer render de Campo pasó de 237 a 90 ms a 390 px y de 82 a 103 ms a 1280 px. El heap JavaScript pasó de 5,95 a 9,53 MB y de 7,45 a 9,52 MB. Son muestras de navegador y el heap mide únicamente JavaScript. Una lámina de Campo de 128 px ocupa 64 KiB al decodificarse. En automático, las repeticiones del babuino reutilizaron la imagen decodificada y se observaron a los 786 y 857 ms.
- La comparación histórica de los módulos cubrió 78 casos. Pasaron 57 y los otros 21 coincidieron con los fallos de V4.2.1. [Comparación](pruebas-compatibilidad.json)
- El proyecto Android conserva el identificador de la aplicación y los plugins de respaldos. El flujo de firma usa el código 40300. La publicación oficial de Android requiere validar la restauración en un dispositivo con el mismo APK.

La siguiente migración tiene un inventario preliminar de 118 registros de ungulados para revisión zoológica. [Preparación de V4.4.0](ungulados.md)
