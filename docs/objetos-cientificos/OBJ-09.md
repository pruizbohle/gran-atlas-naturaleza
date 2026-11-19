# OBJ-09 · Gabinete de Historia

Las seis colecciones de Historia tienen 12 piezas ilustradas cada una. Esta etapa añade 57 candidatas y reutiliza las 15 anteriores, incluidas las 12 cartas de OBJ-04. El [catálogo experimental](catalogo-300.json) conserva las 300 piezas de 26 colecciones, con sus IDs, rarezas y puntuaciones.

## Planchas y fichas

- [Plancha general de las 72 piezas](historia-general-obj-09.webp)
- [Numismática](historia-monedas-obj-09.webp) · [Objetos de civilizaciones](historia-civilizaciones-obj-09.webp) · [Filatelia](historia-filatelia-obj-09.webp)
- [Máscaras y figurillas](historia-mascaras-obj-09.webp) · [Cartografía antigua](historia-cartografia-obj-09.webp) · [Medallas y condecoraciones históricas](historia-medallas-obj-09.webp)
- [72 fichas documentales](fichas-historia.tsv) · [Auditoría cronológica de 461 registros](auditoria-cronologica.tsv)

Las planchas por colección muestran clásica e inventario a 64 px, además del inventario a 24 y 32 px. A esas escalas se distinguen mejor el contorno, las perforaciones, los materiales y las cintas. La lectura de leyendas, improntas y detalles textiles requiere abrir la ficha a mayor escala. Las candidatas incluyen interpretaciones artísticas y referencias cuya identificación individual sigue pendiente. El laboratorio compara seis grupos de piezas históricas con equivalentes funcionales, mercancías, documentos o ficción declarada. Los halos se aplican en la interfaz.

El [laboratorio artístico](../../www/laboratorio-objetos-cientificos.html) incorpora la plancha de Historia, seis colecciones y filtros de etapa, periodo y compatibilidad. El [laboratorio de inclusiones](../../www/laboratorio-inclusiones-objetos.html) incluye las seis colecciones en el álbum y sus tres modos de exhibición. El Archivo de civilizaciones reutiliza las fichas y permite recorrerlas por continente, cultura, periodo y tipo. Las cinco fuentes históricas simulan registros, reproducciones y adquisiciones o préstamos autorizados. En la simulación de 1842, las referencias posteriores se consultan en ficha y quedan excluidas de las acciones de descubrimiento. El progreso de prueba y las exhibiciones permiten revisar la colección completa.

## Cronología y cartografía

La auditoría clasifica 8 registros como compatibles, 54 con reservas documentales, 49 posteriores a 1842, 345 pendientes de verificar y 5 como ficción explícita. Es un inventario de evidencias y pendientes. Una tecnología, especie o cultura puede ser anterior a 1842 aun cuando el ejemplar, hallazgo o emisión representados sean posteriores. En Historia se distinguen 10 sellos posteriores, además del birr documentado y el ejemplar de referencia tunecino. La ficha de este último distingue el establecimiento de la orden del modelo de referencia. La [auditoría](auditoria-cronologica.tsv) y las [fichas](fichas-historia.tsv) consignan la evidencia y sus fuentes cuando están identificadas.

Las doce cartas de OBJ-04 conservan sus recursos. El cotejo de gabinete cubre formato, ámbito, orientación provisional y técnica. Los dibujos simplifican perfiles y escalas. El cotejo de ejemplares y las correcciones visuales quedan registrados para OBJ-11.

| Piezas | Comprobación y pendiente |
| --- | --- |
| MAP-01 a MAP-04 | Portulano mediterráneo, tira vial romana conservada en copia medieval, carta de Juan de la Cosa y atlas impreso. Cotejar rumbos, orientación occidental de la carta y folio de Mercator. |
| MAP-05 a MAP-08 | Fragmento de Piri Reis, rutas centroasiáticas, costa suajili y valle de México. Revisar el perfil del fragmento, la atribución de las rutas, la orientación litoral y las calzadas del plano. |
| MAP-09 a MAP-12 | Cartas de estrecho, arrecifes, derrotero y navegación austral. Cotejar perfiles, escalas, retículas y publicaciones. En MAP-12 distinguir las observaciones de campaña del atlas publicado en 1844. |

## Cobertura y peso

| Conjunto | Ilustradas |
| --- | ---: |
| Botánica | 48/48 |
| Geología | 60/60 |
| Oceanografía | 60/60 |
| Historia | 72/72 |
| Historia natural y exploración | 26/60 |
| Coleccionables | 266/300 |
| Inventario funcional | 68/68 |
| Museo | 17/17 |
| Ilustraciones principales | 351/385 |
| Conceptos y complementos | 33 |

| Tamaño | Clásica media | Inventario medio |
| --- | ---: | ---: |
| 64 px | 1,99 KiB | 2,12 KiB |
| 128 px | 5,42 KiB | 5,80 KiB |
| 256 px | 17,47 KiB | 14,87 KiB |
| 512 px | 51,38 KiB | 37,92 KiB |

OBJ-09 añade **456 WebP (7,62 MiB)**. El conjunto de sprites suma **3.072 WebP (51,82 MiB)**. Las [siete maestras](maestras-obj-09/) y el [plan de recorte](obj-09.json) permiten reconstruir la etapa con `python docs/objetos-cientificos/preparar-arte.py --obj-09` y `node docs/objetos-cientificos/generar-manifiesto.cjs`. A 24 y 32 px se reutiliza el WebP de 64 px. Ambos laboratorios cargan los recursos bajo demanda desde el mismo directorio local.

## Validación

Se comprobaron cobertura, IDs únicos, correspondencia de cada WebP con el manifiesto, dimensiones, transparencia y márgenes. Los 2.616 WebP anteriores y el catálogo coinciden byte por byte con OBJ-08. Chromium en un viewport móvil de 390 × 844 px verificó ambos laboratorios con solicitudes externas bloqueadas, incluidas las seis escalas, los filtros cronológicos, las tres exhibiciones, el archivo, el traslado al álbum desde las cinco fuentes y la persistencia y exportación de evaluaciones.

La suite ampliada de Inventario, GM06 y Museo dio 79 aprobadas y 12 fallos preexistentes, con los mismos nombres que en la copia base. Los fallos corresponden a catálogos y comparaciones históricas de GM06, una comparación de presentación de Inventario y los contratos de versiones anteriores de Museo.

La aprobación artística y la integración definitiva quedan pendientes de revisión. La siguiente etapa es OBJ-10, Gabinete de Historia natural y exploración.
