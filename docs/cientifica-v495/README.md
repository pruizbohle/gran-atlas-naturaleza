# El Gran Atlas V4.9.5 · Fauna de las profundidades

GM-07-P05 incorpora **14 láminas científicas de peces de aguas profundas**. La cobertura pasa a **964 de 1.000 fichas** y **1.636 láminas**, con **125 regiones**, **12 ejemplares legendarios** y **9 relictos**. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizador PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## Ilustración

Las láminas mantienen el dibujo científico en acuarela y grafito con fondo transparente. Se revisaron las siluetas sobre fondo oscuro y se añadieron cuatro comparativas de laboratorio a 64 y 128 px. [Inventario de V4.9.5](../cientifica-v493/plan-v495.md)

- El pez ogro *Anoplogaster brachycera* se representó como juvenil, con dientes pequeños y espinas cefálicas cortas documentadas. La lámina de *A. cornuta* muestra el adulto, con ojo pequeño y colmillos largos en una mandíbula robusta. [NOAA, diagnóstico de los juveniles](https://repository.library.noaa.gov/view/noaa/8559/noaa_8559_DS1.pdf) · [FishBase, pez abisal colmillo largo](https://fishbase.org/summary/Anoplogaster_cornuta.html)
- Los fotóforos son detalles anatómicos sin resplandor. En los peces dragón se distinguieron el perfil, las aletas posteriores, la dentición y la barbilla. El pez cabeza transparente exhibe los ojos tubulares verdes bajo la cubierta cefálica y los orificios nasales en el rostro. [Fotóforos de estomíidos](https://www.journals.uchicago.edu/doi/full/10.1086/738399) · [MBARI, ojos y cubierta cefálica](https://www.mbari.org/animal/barreleye-fish/)
- El pez trípode separa sus dos radios pélvicos y el radio caudal que actúan como apoyo. Ambos peces caracol se representaron con cuerpo blando, aletas continuas y ojos pequeños. [Naturalis, diagnóstico de pez trípode](https://fishes-fnam.linnaeus.naturalis.nl/linnaeus_ng/app/views/species/nsr_taxon.php?epi=141&id=109828) · [Descripción del pez caracol de las Marianas](https://doi.org/10.11646/zootaxa.4358.1.7)

## Pez caracol de Kermadec

Eschmeyer's Catalog of Fishes acepta *Pseudoliparis kermadecensis* (Nielsen, 1964). WoRMS recoge *Notoliparis kermadecensis* y la descripción original usó *Careproctus kermadecensis*. Se conserva *Pseudoliparis* como nombre principal y se menciona *Notoliparis* en la comparativa hadal. Las dos combinaciones vigentes en los datos del juego resuelven al mismo ID, `abisal_esp_pseudoliparis_kermadecensis`. [Eschmeyer's Catalog of Fishes](https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=24584) · [WoRMS](https://www.marinespecies.org/aphia.php?p=taxlist&tName=Careproctus)

## Exploración

La ilustración de una muestra se resuelve a partir del mismo ID que usan el registro de expedición y la partida. La observación en arrecife sigue el recorrido directo de Campo. La columna profunda conserva el sondeo, el fondo batial usa muestreo y los peces de Marianas y Kermadec se registran mediante sondeo extraordinario en su propia subárea. Se preservaron las escalas de **Gigantes en miniatura**. [Reglas vigentes de Gigantes en miniatura](../cientifica-v493/gigantes-en-miniatura.md)

## Recursos

Se añadieron 56 WebP transparentes y se verificaron las cuatro resoluciones. Las calidades de 64, 128, 256 y 512 px son 82, 83, 86 y 90 con alfa a calidad 100. Los **6.488 WebP anteriores**, los 16 paisajes y las referencias de revisión permanecen idénticos. [Pesos exactos](mediciones.json)

| Resolución | V4.9.3 en MB | Lote nuevo en MB | V4.9.5 en MB |
| --- | ---: | ---: | ---: |
| 64 px | 3,29 | 0,02 | 3,31 |
| 128 px | 7,86 | 0,05 | 7,91 |
| 256 px | 22,24 | 0,13 | 22,36 |
| 512 px | 68,28 | 0,39 | 68,68 |
| **Total** | **101,67** | **0,59** | **102,26** |

El caché básico reúne 6.786 recursos y ocupa **126,91 MB**. El caché de revisión conserva **11,70 MB**. Se midió la misma escena de sondeo antes y después de incorporar la lámina del pez cabeza transparente. [Rendimiento y memoria](rendimiento.md)

## Validación

Pasaron las **27 pruebas de publicación** y las **62 comprobaciones estáticas de Android**. La suite histórica ejecutó **820 pruebas**, con **593 aprobadas** y los mismos **227 fallos** de V4.9.3. Entre ellos figuran pruebas antiguas de expedición cuyos guardados de prueba carecen de la acreditación cartográfica vigente. La prueba actual ejercitó los métodos con Mapamundi y equipo de sondeo acreditados. [Comparación de fallos](regresion.json)

La PWA instalada desde V4.9.3 se actualizó, conservó un registro de Kermadec en la partida y volvió a abrir sin conexión. También se verificaron las rutas de actualización desde V4.3.0, V4.8.1, V4.8.2 y V4.9.2. En la migración de V4.9.3 se ensayó la pérdida de conexión, una transferencia cortada, el rechazo por SHA-256 y la activación tras cerrar la otra ventana. Después se probó el recorrido directo en arrecife y los protocolos de columna, fondo y las dos fosas. Los cuatro casos de aguas profundas mostraron la lámina en Campo, Cuaderno, Bestiario y Museo. [Resultados PWA](migraciones-pwa.json) · [Sondeo en columna](deep_esp_macropinna_microstoma-campo.jpg) · [Muestreo batial](deep_esp_bathypterois_grallator-campo.jpg) · [Sondeo en Kermadec](abisal_esp_pseudoliparis_kermadecensis-campo.jpg) · [Sondeo en Marianas](abisal_esp_pseudoliparis_swirei-campo.jpg)

En el laboratorio se comprobaron las cuatro comparativas del lote a 64 y 128 px en los anchos de 320 y 1280 px. [Dentición](profundidad-fangtooths-1280.jpg) · [Fotóforos](profundidad-photophores-1280.jpg) · [Fondo y columna](profundidad-deepAnatomy-1280.jpg) · [Hadal](profundidad-hadal-1280.jpg)

## Distribución

La entrega es web. La compatibilidad Android se revisa de forma estática y la infraestructura de firma queda en la configuración de V4.9.3.

## V4.9.6

El inventario reúne 16 peces costeros, pelágicos y de plataforma y 20 cefalópodos. Con ese lote se completará la cobertura artística de las 1.000 fichas. [Plan V4.9.6](plan-v496.md)
