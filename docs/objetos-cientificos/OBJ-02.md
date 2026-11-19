# OBJ-02 · Equipamiento e instrumentos

La etapa parte de `9d6fea6` en `experiment/scientific-illustration-objects`. El inventario base tenía 68 objetos, el catálogo 300 coleccionables en 26 colecciones y el manifiesto 396 registros. De los 385 sujetos de inventario, catálogo y Museo que requieren lámina propia, 30 ya tenían candidato. Se conservaron sus 240 WebP.

## Cobertura

| Conjunto | Conservados de OBJ-01 | Nuevos en OBJ-02 | Cubiertos |
| --- | ---: | ---: | ---: |
| Instrumentos funcionales y morral | 4 | 0 | 4 de 4 |
| Sombreros y prendas | 1 | 3 | 4 de 4 |
| Collares y amuletos | 1 | 3 | 4 de 4 |
| Preparaciones especiales | 0 | 3 | 3 de 3 |
| Instrumentos de exploración | 0 | 12 | 12 de 12 |
| Artefactos del Museo | 0 | 3 | 3 de 3 |
| Conceptos nuevos de evolución | 0 | 7 | 7 de 7 |

El manifiesto reúne **403 registros**. Hay **54 de 385** sujetos con arte propio candidato, **331 pendientes** y siete conceptos de evolución ilustrados aparte. Los dos conceptos exploratorios de OBJ-01 siguen disponibles para una etapa futura.

### Inventario de recursos

- **Conservados para OBJ-02.** `binoculars`, `brass_compass`, `sturdy_pack`, `field_telescope`, `field_hat` y `museum_medallion`. También se preservaron las otras 24 láminas de OBJ-01.
- **Equipamiento y preparaciones nuevos.** `feather_cap`, `rain_hood`, `scholar_hat`, `amulet`, `amber_charm`, `shell_necklace`, `oceanic_quadrant`, `polar_coat` y `sounding_kit`.
- **Colección y Museo.** `INS-01` a `INS-12`, `astrolabio_laton`, `globo_cartografico` y `medallon_viajero`.
- **Evolución.** `idea-refractor-campo`, `idea-refractor-observatorio`, `idea-sombrero-tratado`, `idea-sombrero-velo`, `idea-morral-dividido`, `idea-valija-muestras` y `idea-gabinete-portatil`.
- **Recortes corregidos antes de exportar.** Se ajustaron separaciones de fila y columna en las planchas de equipamiento e instrumentos B. Se limpió la opacidad residual de la plancha de evolución mediante una rampa alfa documentada. Las cuatro maestras RGBA se guardaron íntegras. La etapa conserva las ilustraciones anteriores.

El [plan de recorte](obj-02.json) relaciona cada celda con su ID y registra sus límites. Para reproducir los 248 derivados con Pillow, ejecutar `python docs/objetos-cientificos/preparar-arte.py --obj-02` y luego `node docs/objetos-cientificos/generar-manifiesto.cjs`.

## Homologación

La [plancha comparativa](familias-obj-02.webp) reúne las variantes clásica y de inventario a 64 px y las miniaturas de inventario a 24 y 32 px. En el laboratorio, la vista **Familias y evolución** alinea los sujetos horizontalmente y permite ver las tres versiones a cualquier escala. Las láminas nuevas conservan la luz superior izquierda, los bordes finos y el tratamiento de acuarela con grafito. Las orientaciones siguen la lectura del objeto. Instrumentos largos en oblicuo, prendas a tres cuartos y joyas frente al observador.

| Familia | Observaciones de revisión |
| --- | --- |
| Óptica y navegación | Los reflejos estrechos y las sombras cálidas unifican el latón envejecido. La caja abierta identifica la brújula de colección. El catalejo histórico usa un cuerpo largo de madera y un tapón suspendido, y el funcional muestra tramos telescópicos. Compararlos a 64 px para verificar sus detalles. Cuadrante, sextante y astrolabio se distinguen por arco bajo, retícula triangular y disco perforado, respectivamente. |
| Sombreros y prendas | Sombrero, gorro bajo con visera, capucha con esclavina y copa académica conservan perfiles propios. A 24 px se lee el volumen general y la pluma se distingue mejor desde 32 px. El paño y el fieltro mantienen brillo bajo. |
| Collares y amuletos | La rosa de los vientos, la resina irregular, el arco de conchas y el ámbar redondo en engaste separan las piezas. En fondo claro, las conchas y cabos finos tienen menor contraste a 24 px. La silueta de cinta corta y el disco plateado identifican el medallón del Museo. |
| Viaje y preparaciones | Lona, cuero, cristal y madera se diferencian por el acabado. En sondeo se lee el conjunto a 24 px y el vial y las vueltas de cuerda a mayor escala. La valija rígida y el gabinete de cajones aportan siluetas y funciones distintas. |
| Instrumentos de colección | La prensa se lee por retícula y correas; el cuaderno, por lomo y broche. La cámara y el cronómetro se distinguen por objetivo exterior y caja con esfera, especialmente a 64 px. En relojería e instrumentos con escalas, el detalle fino se evalúa a 128 px o más. |

Las tres líneas de evolución cubren los tiers I a IV. En óptica se pasa de prismáticos a catalejo, refractor de trípode y refractor con contrapeso. En sombreros, la copa estructurada del sombrero académico se usa como referencia II y las propuestas III y IV añaden refuerzos, ajuste y protección de nuca. En viaje, el morral existente da paso al morral dividido, la valija rígida y el gabinete de cajones. Los siete conceptos corresponden exclusivamente a ideas futuras.

Se conservaron los IDs, nombres y composición de la colección. El barómetro aneroide se rotuló como posterior a 1842 en el laboratorio. La cámara usa como referencia una daguerreotípica de caja deslizante. Las piezas se presentan como interpretaciones de gabinete, con aprobación artística pendiente. [Patente de Vidie, Science Museum Group](https://collection.sciencemuseumgroup.org.uk/people/cp71753/lucien-vidie) · [Cámara Daguerre-Giroux](https://collection.sciencemuseumgroup.org.uk/objects/co8189231) · [Brújula de bolsillo en caoba, 1790–1794](https://collection.sciencemuseumgroup.org.uk/objects/co53220)

## Peso y validación

| Resolución WebP | Clásica OBJ-02, media | Inventario OBJ-02, media |
| ---: | ---: | ---: |
| 64 px | 2,15 KiB | 2,26 KiB |
| 128 px | 5,48 KiB | 5,83 KiB |
| 256 px | 16,27 KiB | 15,23 KiB |
| 512 px | 49,06 KiB | 40,95 KiB |

OBJ-02 suma **248 WebP y 4,15 MiB**. El laboratorio tiene **488 WebP y 8,17 MiB** entre ambas etapas. Las cuatro maestras se guardan en la documentación y quedan fuera de la carga del laboratorio. Cada vista carga de forma diferida la variante de la resolución elegida y usa el derivado de 64 px para mostrar 24 y 32 px.

Se comprobaron los 488 archivos contra sus rutas, dimensiones, peso y transparencia, además de la cobertura de los grupos y tiers y los IDs únicos. El catálogo de 300 coleccionables y los WebP de OBJ-01 conservaron su contenido. Chromium verificó las seis escalas en móvil, los filtros de etapa, la comparación horizontal, las cinco simulaciones previas, la persistencia y la exportación JSON con solicitudes externas bloqueadas. Las suites dieron **25 aprobadas y los mismos 11 fallos históricos** de GM06 y Museo observados en la base.

Para revisar el resultado, abre `www/laboratorio-objetos-cientificos.html` desde una copia de la rama y elige **Familias y evolución**. El laboratorio también funciona con un servidor estático local que sirva `www`.
