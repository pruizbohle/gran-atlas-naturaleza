# El Gran Atlas · Lámina zoológica clásica

[Laboratorio experimental privado](https://el-gran-atlas-ilustracion-cientifica.muddyroadrunner17.chatgpt.site/scientific-illustration/)

El ajuste continúa en `experiment/scientific-illustration-marsupials` a partir de V4.3.0. Compara el SVG de Serie 3, la ilustración naturalista vigente y la nueva candidata clásica. Para la dirección artística se usó la pauta escrita del usuario, con libertad para cambiar la pose, la orientación y el encuadre. La primera comparación experimental sigue disponible en el commit `2d6139f`.

## Resumen visual

Se renovaron las **33 candidatas** de los 29 marsupiales del catálogo, incluidas las cuatro albinas autorizadas de canguro gris oriental, canguro rojo, wómbat común y zarigüeya de Virginia. Las nuevas poses priorizan el gesto natural de la especie. La acuarela modela el volumen y la tinta o el grafito fino definen el pelaje, los perfiles y las marcas diagnósticas. El papel y los paisajes se aplican por separado a las tres columnas del laboratorio. [Vista de las 33 láminas](laminas-clasicas.jpg)

Dieciséis láminas conservan un apoyo breve, con trece ramas o troncos, una roca y dos sugerencias de suelo. El petauro mayor y los canguros arborícolas ganan una lectura vertical, mientras que el petauro del azúcar deja ver el patagio extendido durante el planeo. Se ajustó el recorte del canguro gris oriental en sus dos pigmentaciones para retirar veladuras alrededor de las orejas.

- **A 64 px**, se distinguen las manchas del quol, el patagio del petauro del azúcar y la cola anillada del canguro arborícola de Goodfellow. Los apoyos finos mantienen visible el contorno principal.
- **A 32 px**, el tronco del possum cola de cepillo se aproxima visualmente a la cola. Los dos canguros grises pierden parte de las diferencias finas del hocico, y el pelaje albino tiene menos contraste sobre papel claro. Conviene revisar esos ejemplares en la evaluación.
- El halo sigue el alfa completo, que incluye los apoyos. En el koala y el possum se extiende alrededor del tronco. El contorno incluye la roca bajo las patas del ualabí de Mareeba. [Comparación de miniaturas](minis.jpg)

## Peso y compresión

| Resolución | Naturalista vigente | Lámina clásica |
| --- | ---: | ---: |
| 64 px | 81 020 B | 73 718 B |
| 128 px | 200 878 B | 178 742 B |
| 256 px | 582 314 B | 518 076 B |
| 512 px | 1 603 504 B | 1 618 364 B |
| **Total** | **2 467 716 B** | **2 388 900 B** |

El conjunto clásico ocupa **78 816 B menos (−3,19 %)**. Las 16 láminas con apoyo suman 1 262 694 B en clásica frente a 1 305 630 B en los mismos registros naturalistas. Es una comparación por ejemplar que también refleja las nuevas poses y la textura de pintura. La codificación usa calidades 82, 83, 86 y 90 con alfa 100. Se verificaron 132 archivos WebP cuadrados, el tamaño y la presencia de alfa con transparencia real.

La mediana de decodificación de los 33 WebP de 64 px fue de 4,86 ms para naturalista y de 4,72 ms para clásica en Pillow con los bytes ya en memoria. Las dimensiones de cada resolución determinan el mismo tamaño de píxeles decodificados para ambos estilos. El solapamiento mediano de sus siluetas a 32 px fue 0,6054, consistente con los cambios de pose y composición. Los cuatro lotes de generación clásica tardaron entre 46 y 197 s entre solicitud y recepción. [Mediciones por archivo](measurements.json)

## Laboratorio y verificación

Campo y Campo mixto permiten elegir el bioma. Bestiario usa un fondo por hábitat, Cuaderno usa papel y Museo usa un fondo de exposición. Se conservan los fondos manuales, los halos, las cinco escalas y las seis vistas. La evaluación compara ambos estilos por especie y variante, guarda la preferencia y las observaciones en una clave local de la edición clásica y exporta los 33 registros a JSON.

**Guardar para usar sin conexión** descarga 295 recursos para volver a abrir la página del laboratorio. Su caché tiene su propio ámbito y nombre. En una prueba simulada se comprobaron recuperación sin red de los 295 recursos, recuperación tras una descarga incompleta y aislamiento del caché del juego. Una prueba DOM comprobó las seis vistas y la exportación. También pasaron las diez pruebas de la versión base. La previsualización administrada en navegador quedó limitada por un fallo del entorno.

La decisión sobre la dirección definitiva queda pendiente de la revisión del usuario.
