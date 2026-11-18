# V4.0.0 · La Era Naturalista

Rama `feat/v400-naturalist-art`, basada en la estable 3.45.0 (`d906224`). Se recuperaron y comprobaron los 33 WebP del laboratorio experimental, sin incorporar su rama completa. El catálogo vigente conserva 997 especies y 125 regiones. El laboratorio deja todas las imágenes disponibles para revisión editorial individual.

## Cobertura

| Grupo | Normales | Variantes biológicas | Legendarios |
| --- | ---: | ---: | ---: |
| Marsupiales | 29 | 4 | 0 |
| Monotremas | 3 | 0 | 0 |
| Felinos | 31 | 31 | 2 |
| Total | 63 | 35 | 2 |

Hay 100 rutas con ilustración y 99 láminas distintas. El macho del león africano comparte la normal, que ya muestra un macho adulto. La hembra tiene lámina propia. Las cuatro variantes albinas del laboratorio preexistente se conservaron. Se generaron 66 láminas nuevas y se reutilizaron 33. No quedan rutas sin ilustración entre estas tres agrupaciones. Ámbar mantiene su identidad como tigre siberiano y Niebla como leopardo de las nieves.

Familias migradas. Felidae 31, Macropodidae 13, Dasyuridae y Phalangeridae 3 cada una, Didelphidae, Petauridae y Tachyglossidae 2 cada una. Microbiotheriidae, Myrmecobiidae, Ornithorhynchidae, Phascolarctidae, Pseudocheiridae, Thylacomyidae y Vombatidae aportan una entrada cada una. [Inventario por entrada](../../www/naturalist-art/CATALOGO.md)

## Revisión visual

- GM-07-M01 sigue como referencia anatómica y conserva su SVG de respaldo. En las láminas reutilizadas se revisaron el hocico del monito del monte, los apoyos de manos y pies en los canguros arborícolas, la silueta de los macrópodos, el pliegue de la membrana del petauro, la cresta caudal de la mulgará y los bordes de las manchas del cuscús. La membrana plegada y la cresta pierden lectura a 64 px. Algunas manos y pies quedan parcialmente ocultos por ramas. Se conservaron las láminas del laboratorio.
- Los monotremas se distinguen por forma del pico, proporciones y silueta. El ornitorrinco presenta pico aplanado, cola ancha y patas palmeadas. El equidna de hocico largo presenta un rostro más largo y curvado y espinas más dispersas que el de hocico corto.
- GM-07-M02 conserva las identidades exactas del catálogo. Hay una entrada de tigre y dos entradas infraespecíficas de leopardo. Las láminas del jaguar y los leopardos se distinguen por cráneo, robustez y rosetas. El guepardo usa manchas sólidas y franjas lagrimales. Los linces diferencian patas, penachos, gola, cola y patrón del pelaje. Los felinos pequeños contrastan por porte, longitud de cola, rosetas o manchas y contextos propios. La lectura a 64 px de los gatos moteados pequeños sigue dependiendo mucho de la silueta.
- Se usó una edición localizada para las variantes. Se mantienen el encuadre, la pose general y el hábitat. Se observan pequeñas diferencias de textura y contorno entre pares. Los patrones residuales se aprecian mejor en las láminas grandes. Los fenotipos extraordinarios se representan según la configuración del juego. En concreto, una categoría melánica jugable no documenta por sí sola un fenotipo observado en fauna real. El pigmento histórico que el juego normaliza a Albino conserva ese identificador. No se añadió Leucístico como categoría separada.
- La carpeta de pruebas incluye capturas reales del Cuaderno. La ficha de aprobación del laboratorio permite anotar ajustes y descargar la revisión para cada variante.

## Motor y almacenamiento

El adaptador de presentación usa una sola tabla de rutas y consulta especie, variante y tamaño. La categoría aplica el marco independiente. Notable, Épico y Excepcional no requieren un archivo adicional. Una variante futura sin ruta conserva el SVG pertinente. Los controles de descubrimiento y el guardado de los encuentros se mantienen. Se utiliza el mismo adaptador en las cuatro vistas productivas y en el registro visual del último encuentro. El historial anterior sigue usando sus entradas de texto originales.

| Tamaño WebP | Archivos | Total | Media por archivo |
| --- | ---: | ---: | ---: |
| 64 px | 99 | 0,130 MB | 1,31 kB |
| 128 px | 99 | 0,470 MB | 4,75 kB |
| 256 px | 99 | 1,920 MB | 19,40 kB |
| 512 px | 99 | 8,016 MB | 80,97 kB |
| Total | 396 | 10,536 MB | 26,61 kB |

A la media de las láminas normales, las cuatro resoluciones de 997 especies ocuparían aproximadamente 120 MB. Si se mantiene la proporción de variantes e individuos de este lote serían unos 167 MB. La prueba precarga archivos comprimidos para uso offline y difiere la carga visual de las fichas fuera de pantalla. Campo conserva los nodos de imagen que se repiten entre encuentros. La arquitectura admite incorporar otra familia mediante láminas y rutas de datos. Una expansión del tamaño proyectado merece medir la instalación offline y la cuota practicable en Android antes de adoptarla de una sola vez.

La prueba de rendimiento mide el tiempo desde abrir Campo hasta que el SVG está visible o la lámina principal está decodificada. Son mediciones locales, con la caché PWA instalada y sin estrangulamiento de red. Los tiempos y tamaños de pantalla están en la [evidencia PWA](prueba-pwa.json). Entre las primeras y últimas salidas del generador transcurrieron aproximadamente 12 minutos, incluida la espera de la herramienta. No se cronometró la revisión editorial por separado ni se hizo una comparación equivalente con el método SVG.

## Compatibilidad

La prueba PWA actualiza desde 3.45.0, comprueba el bloqueo con otra pestaña abierta, verifica una copia exacta del guardado, compara 10 campos de estado y abre el juego y el laboratorio sin conexión. También comprueba dos ilustraciones con sus multiplicadores y un ejemplar albino notable en Campo, el Bestiario y sus fichas, el Cuaderno y el Museo. [Resultados de Chromium](prueba-pwa.json)

La batería histórica de Campo, Cuaderno, Bestiario, Museo, respaldos, ejemplares y PWA dio el mismo resultado a ambos lados de la comparación. Pasaron 90 de 111 pruebas. Las 21 pruebas restantes ya fallaban en la 3.45.0 con los mismos nombres. Los controles nuevos de la candidata y la prueba de navegador pasaron.

Capacitor sincronizó el contenido web y los complementos nativos. La versión Android preparada conserva el identificador, usa `versionName=4.0.0` y `versionCode=40000`. No hay SDK ni un dispositivo físico en este entorno, y el flujo vigente de firma permanente está limitado a la rama principal. No se creó una APK ni se verificó una restauración en el dispositivo. [Validación del empaquetado](prueba-android.json)
