# El Gran Atlas · Laboratorio de ilustración científica

El experimento parte de V4.3.0, commit `0719d2816470ad9a7adbb35387384d97bfaa3794`, en la rama `experiment/scientific-illustration-marsupials`. Las referencias SVG se extraen del código de la serie 3.45.0 en `d906224533559193e87704fa44471ea73d4069c9`. El proyecto mantiene el inventario, las ilustraciones y el guardado de producción. La evaluación se guarda localmente con su propia clave y puede exportarse en JSON.

Se verificaron **29 marsupiales y 33 láminas**, incluidas las cuatro variantes albinas configuradas de canguro gris oriental, canguro rojo, wómbat común y zarigüeya de Virginia. Hay **33 candidatas disponibles y 0 pendientes**. Cada candidata usa un WebP alfa de 512 px con derivados propios de 64, 128 y 256 px. Los 132 archivos se decodificaron para verificar tamaño, color y transparencia real.

## Revisión artística

La prueba usa las mismas posturas y encuadres de referencia, con tinta y grafito finos, rayado, punteado y acuarela controlada. El anclaje y la escala se ajustaron contra la caja alfa de la lámina naturalista, respetando la proporción de cada candidata. El halo se aplica con la misma función y CSS del juego. Cada vista comparte fondo, categoría, escala y espécimen. En Campo mixto, el segundo marsupial queda fijo en las tres columnas.

- La mediana del coeficiente Dice de las máscaras a 32 px fue **0,9805**. Este indicador mide el solapamiento de las siluetas. La memoria visual y la preferencia quedan para la evaluación en el laboratorio.
- Las mayores diferencias de silueta se concentran en petauro del azúcar, possum cola de cepillo y monito del monte. Cambiaron el espacio entre patas, la curva del cuerpo o el contorno de la cola. Conviene revisar esos tres registros al decidir el estilo. Se revisaron los extremos del arborícola de Goodfellow y del canguro rojo, donde la entrada generada quedó cerca del borde de su celda.
- En la muestra a 64 px conservan buena lectura los grandes patagios, las colas anilladas y los patrones de manchas o franjas. A 32 px disminuye la lectura del rayado fino y dominan la silueta, la distribución de tonos y unos pocos rasgos contrastantes. La muestra gráfica presenta Naturalista a la izquierda y Científica a la derecha para cada ejemplar. [Comparación de miniaturas](minis.jpg)

## Medición técnica

| Resolución | Naturalista vigente | Científica | PSNR naturalista / científica | Decodificación de 33 archivos, naturalista / científica |
| --- | ---: | ---: | ---: | ---: |
| 64 px | 81 020 B | 78 750 B | 33,31 / 32,67 dB | 4,76 / 4,79 ms |
| 128 px | 200 878 B | 196 178 B | 34,19 / 33,20 dB | 12,06 / 11,72 ms |
| 256 px | 582 314 B | 585 224 B | 35,95 / 34,29 dB | 37,63 / 37,19 ms |
| 512 px | 1 603 504 B | 1 895 190 B | 46,29 / 36,60 dB | 129,27 / 137,71 ms |
| **Total** | **2 467 716 B** | **2 755 342 B** | | |

La candidata agrega **287 626 B (+11,66 %)**. El mayor incremento está en los WebP de 512 px. La codificación usó calidades 82, 83, 86 y 90 con alfa 100. El PSNR compara cada estilo con su propia entrada de codificación, en píxeles casi opacos, con el mismo codificador y parámetros. La entrada naturalista procede del WebP de referencia ya comprimido. La candidata procede del recorte antes de codificar. Esa diferencia limita la comparación de calidad de una primera compresión.

Se midió la mediana de cinco recorridos de decodificación con Pillow y bytes ya en memoria. Una lámina RGBA ocupa 16, 64, 256 o 1024 KiB decodificada según la resolución. La memoria total de un navegador depende del contexto de render y el caché. El tiempo aproximado de codificación de las 132 imágenes fue 1,80 s para las entradas naturalistas y 1,72 s para las candidatas. Se midieron 46 a 190 s entre el lanzamiento de las solicitudes de generación y la recepción de los cuatro lotes científicos. El tiempo histórico de generación naturalista queda sin medición comparable. [Datos por archivo](measurements.json)

## Uso y verificación

El laboratorio compara SVG, Naturalista y Científica en Campo, Campo mixto, Cuaderno, Bestiario y Museo. La matriz de escalas permite ver 32, 64, 128, 256 y 512 px. La vista de 32 px usa el derivado de 64 px. La evaluación registra cinco criterios para cada estilo, una preferencia y observaciones por especie y variante.

Para usarlo desde el checkout, sirve `www/` como sitio estático y abre `/scientific-illustration/`. `node scripts/build-scientific-marsupials.cjs` regenera los datos. `node scripts/package-scientific-marsupials.cjs <directorio>` crea el sitio autónomo con sus recursos. La decisión sobre el estilo definitivo queda pendiente de la evaluación del usuario.
