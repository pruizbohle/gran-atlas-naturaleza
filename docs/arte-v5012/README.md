# El Gran Atlas V5.0.12 · ART-08

La revisión parte de `8ff5428`, V5.0.11 en `audit/aud-01-v501`. La selección se limita a variantes previamente evaluadas como mejorables. El primer lote se evaluó y archivó antes de iniciar las propuestas del segundo. [Biblioteca ART-08A](ART-08A.md) · [Biblioteca ART-08B](ART-08B.md) · [Decisiones e iris](decisiones.json)

## Visor

El visor agrupa 564 variantes pigmentarias de 479 animales. Muestra 20 tarjetas por página, con opciones de 40 y 60. Cada tarjeta comparte una lámina normal para las variantes que cumplen los filtros. Las fichas conservan la página, los filtros y el fondo de la galería al cerrarse. Los enlaces ART-08A y ART-08B abren cada biblioteca en el visor.

[Captura de escritorio](evidencia/visor-pc.png) · [Captura móvil](evidencia/visor-movil.png) · [Pruebas de navegador](evidencia/visor-final.json)

## Inventario y almacenamiento

| Indicador | V5.0.11 | V5.0.12 |
| --- | ---: | ---: |
| Examinadas únicas | 174 | 174 |
| Correctas | 68 | 88 |
| Mejorables | 104 | 84 |
| Insuficientes | 2 | 2 |
| Sin evaluar | 390 | 390 |

Los casos melánicos del león y del zorro ártico esperan revisión biológica. [Inventario AUD-04](inventario-aud04.json)

| Lote | Animales revisados | Aprobadas | Propuestas rechazadas | WebP activos | Antes | Después |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ART-08A | 10 | 10 | 1 | 40 | 530.342 B | 676.308 B |
| ART-08B | 10 | 10 | 1 | 40 | 563.538 B | 687.742 B |

El peso de los archivos activos modificados aumentó 270.170 bytes. El laboratorio archivó 1.093.880 bytes de originales. [SHA-256 y rutas](integridad.json) · [Alfa y peso por tamaño](evidencia/calidad-y-peso.json)

## Comprobaciones dirigidas

Se comprobaron la transparencia y dimensiones de 64, 128, 256 y 512 px, los archivos anteriores archivados, el manifiesto, la agrupación por animal y los filtros. En Chromium se recorrieron las páginas hasta el último grupo, se abrieron ambas bibliotecas y se cargaron las fichas y sus comparativas. La interfaz se comprobó también a 390 px de ancho. [Resultados](evidencia/visor-final.json)

## Próxima selección

La propuesta siguiente reúne veinte animales diferentes con variantes ya calificadas como mejorables. [Próximo lote](proximo-lote.md)
