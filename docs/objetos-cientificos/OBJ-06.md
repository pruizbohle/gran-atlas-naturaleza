# OBJ-06 · Gabinete de Botánica

La rama parte de `1612830`. La auditoría inicial confirmó 68 objetos funcionales ilustrados, 300 coleccionables en 26 colecciones, 461 registros experimentales, 145 de 385 láminas principales y 33 conceptos o complementos ilustrados. Los 1.424 WebP de OBJ-01 a OBJ-05 se conservaron byte por byte.

| Colección | Conservadas | Nuevas | Cobertura |
| --- | ---: | ---: | ---: |
| Herbario del mundo | 1 | 11 | 12 de 12 |
| Semillas extraordinarias | 1 | 11 | 12 de 12 |
| Pigmentos del mundo | 0 | 12 | 12 de 12 |
| Hojas y frondas del mundo | 1 | 11 | 12 de 12 |

Se conservaron BOT-01 Rosa silvestre, SEM-12 Coco de mar y HOJ-01 Hoja de ginkgo. La cobertura termina en **48 de 48** para Botánica, **105 de 300** para coleccionables y **190 de 385** para el conjunto principal. Inventario y Museo conservan **68 de 68** y **17 de 17** láminas propias. El manifiesto cuenta **223 sujetos con candidato**, incluidos los 33 conceptos y complementos previos. Se preservaron los IDs y el contenido del catálogo de 300 piezas.

## Homologación y fichas

- **Herbario.** Las composiciones se concentran en la flor o inflorescencia con una porción breve de tallo y hojas. La Rafflesia tiene cinco lóbulos gruesos, verrugas claras y cavidad central; la protea se distingue del waratah por sus brácteas exteriores claras y su centro abierto. La rosa conserva la ramilla y el follaje que la separan de la flor prensada funcional.
- **Semillas.** La bellota lleva cúpula; el haya muestra nueces angulosas; el eucalipto, cápsulas valvadas; y el arce, dos alas divergentes. La testa oscura del saguaro se amplía y el coco de mar se reduce para compartir la cuadrícula. El piñón de araucaria usa un perfil alargado y cuneiforme de referencia. El cacao criollo muestra una semilla seccionada, frente a la mazorca abierta de la mercancía regional.
- **Pigmentos.** Se combinaron fragmentos fisurados, terrones, trazos, cápsulas, insectos conservados, tejido y soporte cerámico. Las tierras minerales, los pigmentos vegetales, los de origen animal y la muestra mixta de azul maya conservan sus fichas dentro del gabinete. La malaquita y el lapislázuli se distinguen de los minerales de muestra por el pequeño trazo de pigmento; la cochinilla aparece como muestra documental de gabinete. La púrpura se representa en lana histórica teñida. Las fichas documentan materiales y procedencia.
- **Hojas.** El arce, la higuera y el tulípero se separan por lobulación y nervadura. El culantrillo conserva ejes oscuros finos. El helecho plateado muestra el envés dividido. La planta jarro representa la trampa y el zarcillo como parte modificada de la hoja. El limbo flotante de Victoria amazonica se reduce para la cuadrícula; Kew documenta hasta 2,3 m de anchura. Las escalas relativas quedan indicadas en las fichas.

La dirección artística toma como referencias generales la acuarela, las transiciones de volumen y el detalle de las publicaciones de Redouté y Merian. Las 45 nuevas láminas son composiciones propias. Las [fichas botánicas](fichas-botanica.tsv) registran identificaciones u orígenes, rasgos diagnósticos y escalas de muestra. La identificación de ejemplares representativos y el detalle morfológico quedan sujetos a aprobación, en particular la forma fina de los lóbulos del arce, la testa del piñón de araucaria y las divisiones y soros de las frondas. Las semejanzas entre ocres se revisan mejor a 64 px por el grano del terrón y la diferencia entre trazo y muestra suelta. [Redouté, Biodiversity Heritage Library](https://blog.biodiversitylibrary.org/2017/06/the-botanical-art-of-redoute) · [Merian, Biodiversity Heritage Library](https://www.biodiversitylibrary.org/bibliography/167476) · [Rafflesia, Kew](https://www.kew.org/plants/rafflesia-arnoldi) · [Victoria amazonica, Kew](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:605776-1/general-information) · [Nepenthes rafflesiana, Kew](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:603790-1) · [Azul maya, CAMEO](https://cameo.mfa.org/wiki/Maya_blue) · [Siena natural, CAMEO](https://cameo.mfa.org/wiki/Raw_sienna)

## Planchas

- [Plancha general · 48 ejemplares](botanica-general-obj-06.webp)
- [Herbario del mundo](botanica-herbario-obj-06.webp)
- [Semillas extraordinarias](botanica-semillas-obj-06.webp)
- [Pigmentos del mundo](botanica-pigmentos-obj-06.webp)
- [Hojas y frondas del mundo](botanica-hojas-obj-06.webp)

Las planchas individuales comparan ambas variantes a 64 px y muestran también inventario a 24 y 32 px. La plancha general usa inventario a 64 px. Se revisaron y ajustaron los límites de recorte y se retiró alfa residual de las dos planchas de semillas y pigmentos. Las [cinco maestras RGBA](maestras-obj-06) y el [plan de recorte](obj-06.json) conservan la trazabilidad. Para regenerar, ejecutar `python docs/objetos-cientificos/preparar-arte.py --obj-06` y `node docs/objetos-cientificos/generar-manifiesto.cjs`.

## Laboratorios

La vista **Gabinete botánico** del laboratorio artístico muestra las cuatro colecciones juntas o como cuadrículas individuales de doce piezas. Permite elegir clásica, inventario o ambas. Los fondos, halos y seis escalas se aplican a las cuadrículas. Cada ficha enlaza con la evaluación y su exportación habitual.

En el **Álbum** del laboratorio de inclusiones, selecciona **Botánica**. El progreso simulado ofrece 0, 25, 50, 75 y 100 %. El gabinete suma 116 puntos de colección, 29 por colección. Cada ficha muestra procedencia, descripción, obtención sugerida, rareza y escala real. Las piezas pendientes se muestran como siluetas discretas.

**Probar descubrimiento** muestra una lámina ampliada y actualiza el progreso y los puntos de su colección. La rareza se elige de forma explícita y usa un halo externo distinto para las cuatro categorías. La demostración utiliza las piezas pendientes de la selección actual. Cambiar el porcentaje reinicia los descubrimientos de prueba. El registro de evaluaciones sigue usando la clave de navegador existente.

## Peso y validación

| Resolución | Clásica OBJ-06, media | Inventario OBJ-06, media |
| ---: | ---: | ---: |
| 64 px | 2,07 KiB | 2,17 KiB |
| 128 px | 5,54 KiB | 5,85 KiB |
| 256 px | 16,74 KiB | 15,38 KiB |
| 512 px | 48,18 KiB | 41,09 KiB |

OBJ-06 añade **360 WebP y 6,02 MiB**. El conjunto suma **1.784 WebP y 29,85 MiB**. Ambos laboratorios reutilizan los archivos y cargan de forma diferida.

Se verificaron dimensiones, márgenes, canal alfa, pesos y asociaciones del manifiesto. Chromium móvil verificó los laboratorios con solicitudes externas bloqueadas, incluidas las cuatro cuadrículas, las seis escalas, el progreso y los descubrimientos de cada rareza, la persistencia y ambas exportaciones. Pasaron **25 pruebas**. Los **11 fallos históricos** de GM06 y Museo coinciden con OBJ-05.

La aprobación artística queda pendiente. La siguiente etapa es **OBJ-07 · Gabinete de Geología**.
