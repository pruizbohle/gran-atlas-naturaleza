# OBJ-08 · Gabinete de Oceanografía

La etapa partió de `7bf7f19`. Se verificaron 68 objetos funcionales, 300 coleccionables, 26 colecciones, 461 registros experimentales, 245 láminas principales, 33 conceptos y complementos ilustrados y 2.224 WebP. Los archivos previos se conservaron byte por byte.

| Colección | Conservadas | Nuevas | Cobertura |
| --- | ---: | ---: | ---: |
| Los siete mares | 7 | 0 | 7 de 7 |
| Secretos de Atlántida | 1 | 4 | 5 de 5 |
| Conchas de los océanos | 1 | 11 | 12 de 12 |
| Curiosidades de marineros | 0 | 12 | 12 de 12 |
| Corales del mundo | 1 | 11 | 12 de 12 |
| Algas del mundo | 1 | 11 | 12 de 12 |

Se conservaron Los siete mares, la Corona de oricalco, la Caracola reina, el Coral cerebro y el Sargazo. La cobertura total llega a **209 de 300 coleccionables** y **294 de 385 láminas principales**. Inventario y Museo conservan **68/68** y **17/17**. Por gabinete, Botánica **48/48**, Geología **60/60**, Oceanografía **60/60**, Historia **15/72** e Historia natural y exploración **26/60**. IDs, rarezas, puntos y composición permanecen en el catálogo original.

## Planchas

- [General · 60 piezas](oceanografia-general-obj-08.webp)
- [Los siete mares](oceanografia-siete-mares-obj-08.webp)
- [Secretos de Atlántida](oceanografia-atlantida-obj-08.webp)
- [Conchas de los océanos](oceanografia-conchas-obj-08.webp)
- [Curiosidades de marineros](oceanografia-marineros-obj-08.webp)
- [Corales del mundo](oceanografia-corales-obj-08.webp)
- [Algas del mundo](oceanografia-algas-obj-08.webp)

Las planchas individuales comparan ambas variantes a 64 px y presentan inventario a 24 y 32 px. La general muestra inventario a 64 px. El recorte de conchas conserva las espiras y puntas. Se ajustaron los rectángulos de la plancha de corales y algas para separar una vista adicional del coral azul de las nueve piezas seleccionadas. Se corrigió el alfa residual de la plancha de algas. Las [seis maestras RGBA](maestras-obj-08) y el [plan de recorte](obj-08.json) conservan la trazabilidad. Regeneración con `python docs/objetos-cientificos/preparar-arte.py --obj-08` y `node docs/objetos-cientificos/generar-manifiesto.cjs`.

## Fichas y homologación

Las [60 fichas](fichas-oceanografia.tsv) separan registros científicos, analogías marítimas históricas y ficción explícita. Incluyen identificación de referencia, clasificación, material, rasgos, hábitat cuando corresponde, cronología, observaciones y fuente. La procedencia se conserva desde el catálogo. Las fuentes generales de referencia contextualizan los morfotipos; la identidad de una ilustración candidata sigue sujeta a cotejo.

- **Conchas.** El nautilo tiene una concha verdadera con cámaras y septos. El argonauta se representa mediante el estuche ovígero calcáreo delgado secretado por la hembra. La oreja de mar se reconoce por los orificios y el nácar, frente a la pieza ornamental pulida de comercio. Vieira y almeja se distinguen por aurículas, espesor y ondulación. [Nautilidae, WoRMS](https://www.marinespecies.org/aphia.php?id=153112&p=taxdetails) · [Argonautidae, WoRMS](https://www.marinespecies.org/aphia.php?id=11785&p=taxdetails)
- **Corales y algas.** Las formas pétreas incluyen masas, discos, ramas cilíndricas y láminas palmeadas. Los tubos paralelos, la malla de gorgonia y los ejes segmentados separan otros morfotipos. El cochayuyo muestra cintas gruesas y fijación basal con una pequeña sección como referencia. El kelpo y el sargazo usan vesículas, mientras el wakame presenta nervio medio. La forma ramificada australiana conserva identificación específica pendiente. Las simulaciones presentan láminas, modelos, reproducciones y ejemplares históricos. [Acropora, NOAA Fisheries](https://repository.library.noaa.gov/view/noaa/16200/noaa_16200_DS1.pdf) · [Cochayuyo, Ministerio del Medio Ambiente de Chile](https://metadatos.mma.gob.cl/sinia/Documento_Fichas.pdf) · [AlgaeBase](https://www.algaebase.org/)
- **Objetos marítimos.** La sonda muestra metal y amarre; el contrapeso, piedra perforada; y las dos botellas se separan por el sedimento o el papel visible. La medalla mantiene su cinta y la ficha un disco de intercambio. La pipa aparece aislada como objeto museístico. El flotador japonés se rotula como posterior a 1842 por su uso documentado desde 1910. La fecha de la maqueta en botella y el nombre técnico de la rueda miniatura requieren cotejo. [Sonda, Royal Museums Greenwich](https://www.rmg.co.uk/collections/objects/rmgc-object-42888) · [Flotador de vidrio japonés, Collections WA](https://collectionswa.net.au/items/d72a4368-a99e-4e9a-a1c7-99fc53bfe25c)
- **Atlántida.** Piedra grabada, bronce, cristal y pátina mantienen un lenguaje arqueológico coherente. Las cinco fichas llevan la etiqueta **Ficción explícita**. La composición de cierre emplea anillos dibujados por CSS y las mismas cinco ilustraciones.

Las fichas y los seis grupos de comparación permiten contrastar también corales con minerales, algas con hojas terrestres, objetos marítimos con instrumentos de exploración y artefactos ficticios con piezas de gabinete histórico. A 24–32 px, los bordes finos del argonauta, la malla de la gorgonia y los ejes del coral negro conservan mejor su lectura sobre fondo claro. La textura diagnóstica se revisa desde 64 px y las inclusiones y poros desde 128 px. La aprobación final sigue pendiente.

## Laboratorios

El **Gabinete de Oceanografía** del laboratorio artístico presenta las seis colecciones y sus comparaciones, con variantes, fondos, halos, seis escalas, fichas y exportación de observaciones. En inclusiones, **Álbum → Oceanografía** conserva progreso, puntos, rarezas, fichas, descubrimientos y evaluaciones previas. Las seis colecciones están disponibles como álbum, gabinete o vitrina.

**Descubrimientos marítimos** ofrece exploración costera, expedición, investigación, comercio y misiones especiales como asociaciones editoriales. Al simular un descubrimiento, el escenario de prueba añade la ficha al álbum y permite abrir la colección correspondiente. **El misterio de Atlántida** tiene un contador independiente de cero a cinco piezas. El cierre reúne las cinco láminas, el texto narrativo y el plano imaginario de anillos.

## Peso y validación

| Resolución | Clásica OBJ-08, media | Inventario OBJ-08, media |
| ---: | ---: | ---: |
| 64 px | 2,29 KiB | 2,37 KiB |
| 128 px | 6,11 KiB | 6,46 KiB |
| 256 px | 18,69 KiB | 17,34 KiB |
| 512 px | 53,83 KiB | 46,48 KiB |

OBJ-08 añade **392 WebP y 7,35 MiB**. El conjunto suma **2.616 WebP y 44,20 MiB**. Se comprobaron ID, asociación, tamaño, peso, transparencia y márgenes. Chromium móvil verificó ambos laboratorios con solicitudes externas bloqueadas, incluyendo seis escalas, cinco fuentes y transferencia al álbum, exhibiciones, Atlántida 0–5, persistencia y exportaciones. Las suites ejecutadas dieron **25 pruebas aprobadas y 11 fallos históricos** de GM06 y Museo, con los mismos nombres que OBJ-07.

La siguiente etapa es **OBJ-09 · Gabinete de Historia**.
