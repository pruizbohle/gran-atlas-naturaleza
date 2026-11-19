# OBJ-11 · Auditoría global y homologación artística

La rama experimental partió de OBJ-10 (`32aa667`). El cotejo con `origin/main` (`89c8c6b`) dio 10 commits de cada lado y un ancestro común en `0719d28`. El trabajo se realizó en `experiment/scientific-illustration-objects`.

## Resultado

- **300 coleccionables vigentes**, 26 colecciones, cinco gabinetes y 725 puntos. La distribución es 125 comunes, 100 poco comunes, 50 raros y 25 muy raros.
- **385 ilustraciones principales vigentes**, incluidas 68 funcionales y 17 propias del Museo. Con los 33 complementos hay 418 sujetos vigentes en 461 registros activos.
- **25 sustituciones**, con 12 integrantes nuevos en Armería histórica, ocho meteoritos y cinco referencias de otras colecciones. La rareza de Armería se basa en singularidad cultural y museística. Su composición de 5/4/2/1 suma 29 puntos. Todas son láminas de objetos históricos o modelos inertes de gabinete.
- **25 registros archivados**, con sus 200 WebP originales, fichas e IDs disponibles en el archivo histórico. Las evaluaciones siguen vinculadas a los IDs originales con las mismas claves de almacenamiento y exportación JSON. Las versiones anteriores de las tres revisiones visuales se conservan en seis WebP adicionales.

[Catálogo activo](catalogo-300.json) · [Armería histórica](planchas-obj-11/armeria.webp) · [Registro de las 25 sustituciones](sustituciones-obj-11.tsv) · [Comparación antes y después](planchas-obj-11/antes-despues.webp)

## Cronología documental

Se conservan Ensisheim, Gibeon, Campo del Cielo e Imilac. El conjunto incorpora L’Aigle (1803), Wold Cottage (1795), Benares (1798), Weston (1807), Chassigny (1815), Krasnojarsk (1749), Alais (1806) y Stannern (1808). Mantiene condritas, acondritas, ejemplares metálicos y palasitas. El nombre Krasnojarsk identifica la referencia histórica del hierro de Pallas. [Meteoritical Bulletin, Krasnojarsk](https://www.lpi.usra.edu/meteor/metbull.php?code=12356)

El barómetro de gabinete representa un tipo de mercurio anterior a 1842, el tálero remite a la emisión de 1780, el flotador de corcho corresponde a pesca tradicional y el basalto olivínico remite a la investigación geológica escocesa de principios del XIX. En la insignia de Leopoldo, el inicio de la orden en 1832 y la datación del modelo representado tienen distinto grado de certeza. Los ejemplos de museo de Armería se tratan como interpretaciones, con reservas explícitas para el patrón de piel zulú y el contexto de la clava mapuche. [Tálero de 1780, Met](https://www.metmuseum.org/art/collection/search/237844) · [Insignia civil, Royal Museums Greenwich](https://www.rmg.co.uk/collections/objects/rmgc-object-202791)

Las fechas científicas posteriores se conservan como evidencia para reconstrucciones, fauna y fósiles. Los cinco Secretos de Atlántida se conservan como ficción explícita. La fecha de referencia del sacarímetro de gabinete, aún concepto futuro, queda pendiente de cotejo. La auditoría distingue la fecha de emisión o fabricación, de hallazgo, de descripción y las reservas sobre procedencia dentro de cada ficha.

De los 461 registros activos, 15 son compatibles, 111 tienen reservas documentales, 329 conservan fecha pendiente, cinco son ficción explícita y un concepto de equipamiento se mantiene como posterior a 1842.

[Auditoría cronológica, 461 activos y 25 archivados](auditoria-cronologica.tsv) · [Fichas originales de Historia y Filatelia](fichas-historia.tsv) · [Maestras OBJ-09](maestras-obj-09/) · [Maestras OBJ-11](maestras-obj-11/)

## Revisión y correcciones

La [auditoría artística individual](auditoria-artistica-obj-11.tsv) cubre los 385 sujetos principales. Se revisaron en planchas los perfiles a 64 y 24 px, la diferenciación por material y orientación, y el contraste de color y textura. El control automatizado cubre tamaños, pesos, canal alfa, márgenes y duplicidad binaria por variante y resolución. Las 385 evaluaciones definitivas siguen pendientes.

| Resultado preliminar | Piezas |
| --- | ---: |
| Sin problemas detectados en plancha | 249 |
| Requiere ajuste menor | 9 |
| Requiere homologación | 25 |
| Requiere rediseño | 2 |
| Pendiente de cotejo científico | 82 |
| Pendiente de aprobación del usuario como estado preliminar | 18 |

- Se retiró el penacho añadido al casco corintio para aproximarlo a la calota del ejemplar de referencia. [Comparación del casco](planchas-obj-11/revision-arm-02.webp) · [Met](https://www.metmuseum.org/art/collection/search/250921)
- Se corrigió el chimalli a cuatro medias lunas y fleco inferior. [Comparación del chimalli](planchas-obj-11/revision-arm-11.webp) · [INAH](https://mnh.inah.gob.mx/chimalli-tesoro-de-moctezuma-en-chapultepec)
- Se reforzaron el contraste y la presencia de las hebras en los sprites de inventario de ARQ-10 a 64 y 128 px. En tamaño de casilla la geometría sigue simplificada. [Comparación de la telaraña](planchas-obj-11/revision-arq-10.webp)
- MAP-06 y MAP-07 requieren una referencia de carta concreta para redibujar ruta, costa y orientación. Las cartas restantes, anatomías paleontológicas y estructuras botánicas conservan sus imágenes hasta el cotejo. Las alas y tejidos translúcidos, geodas, calcitas y resinas quedan marcados para comparar sobre fondos claro y oscuro.
- Se compararon monedas, cráneos y dientes, mapas, pergaminos, medallas, collares, minerales, geodas, resinas, meteoritos, huevos, conchas, fibras, plumas e instrumentos. El archivo de similitudes del laboratorio agrupa casos entre categorías. Se mantiene la diferenciación entre sujetos físicos y documentos en los grupos de comparación.

[Funcionales](planchas-obj-11/funcionales.webp) · [Museo](planchas-obj-11/museo.webp) · [Botánica](planchas-obj-11/botanica.webp) · [Geología](planchas-obj-11/geologia.webp) · [Oceanografía](planchas-obj-11/oceanografia.webp) · [Historia](planchas-obj-11/historia.webp) · [Historia natural y exploración](planchas-obj-11/historia-natural.webp)

## Perfiles de distribución

La [comparación en el laboratorio](../../www/laboratorio-objetos-cientificos.html?vista=performance) usa los mismos tres sujetos y distingue la resolución solicitada del archivo utilizado.

| Perfil | Archivos vigentes | Disco medido | RGBA simultánea estimada | Efecto visual |
| --- | ---: | ---: | ---: | --- |
| Completo | 3.344 | 56,63 MiB | 1.110,31 MiB | Variantes a las cuatro resoluciones. |
| Equilibrado | 1.672 | 30,59 MiB | 555,16 MiB | Inventario a 64–128 px y clásica a 256–512 px. |
| Ligero | 836 | 7,64 MiB | 111,03 MiB | Inventario a 64 px y clásica a 256 px, con interpolación en ampliaciones. |

La estimación RGBA usa cuatro bytes por píxel y supone decodificación simultánea de todos los archivos. El uso real depende de la carga diferida, la memoria del navegador y la gestión de texturas. La auditoría técnica abarca además los 200 WebP archivados. No se encontraron duplicados binarios vigentes para una misma variante y resolución.

Prueba local en Chromium a 390 × 844 px, con mediana de siete lecturas sin caché de tres sprites. La casilla de 64 px compartió los mismos **5.712 bytes** entre perfiles. Las ampliaciones dieron los siguientes resultados.

| Perfil | Bytes de la muestra a 512 px solicitados | Lectura HTTP local | Decodificación |
| --- | ---: | ---: | ---: |
| Completo | 106.202 | 10,0 ms | 12,6 ms |
| Equilibrado | 130.094 | 10,6 ms | 20,7 ms |
| Ligero | 42.886 | 11,1 ms | 5,2 ms |

Estos tiempos corresponden al entorno de prueba. Para futura distribución móvil, el perfil equilibrado conserva la resolución de ficha y reduce el tamaño del paquete. El perfil ligero ofrece menor peso donde la ampliación de trama, texto o relieve es secundaria. El laboratorio conserva las variantes y resoluciones completas para revisión.

## Obtención, utilidad y progresión

La [matriz de 300 coleccionables](matriz-obtencion-obj-11.tsv) cruza cada pieza con una fuente principal y secundaria, zona, rareza, etapa sugerida y requisitos. Las arquitecturas de especies registradas pueden partir de una observación. La cartografía favorece la investigación y las misiones, Armería los intercambios documentados y los fósiles registros de excavación autorizada o réplicas. La zona y la procedencia se tratan como referencias editoriales.

| Clase | Utilidad propuesta |
| --- | --- |
| Objetos funcionales | Fabricación, investigación, equipamiento y avance según los sistemas existentes. |
| Coleccionables | Registro permanente en álbum o gabinete, con ficha y exhibición experimental. |
| Piezas del Museo | Presentación a través de las modalidades museísticas existentes. |
| Conceptos futuros | Evaluación aislada hasta una decisión de inclusión. |

Para una partida casual de varios meses y tres o cuatro sesiones diarias, las primeras semanas pueden introducir documentación y observación regional con tareas acumulativas. Entre las semanas tres y seis, el avance automático puede preparar informes y réplicas para la próxima sesión. Entre los meses dos y cinco, expediciones, misiones e intercambios pueden diversificar los objetivos. Completar una colección puede abrir su lámina temática, completar un gabinete puede destacar una exposición y completar el catálogo puede reunir una memoria del viaje. Las tres ideas son reconocimientos editoriales en evaluación.

## Laboratorios y validación

El [portal](../../www/laboratorios-objetos.html) enlaza seis vistas. Auditoría global permite filtrar por problema, familia o gabinete, abrir fichas, comparar versiones y exportar evaluaciones. El panel de inclusiones reúne equipamiento futuro, tiers, materiales, mercancías, montajes, coleccionables, exhibiciones, asociaciones con fauna y evaluaciones archivadas.

Las suites de Inventario, GM06 y Museo dieron **79 aprobadas y 12 fallos preexistentes**, con los mismos casos que OBJ-10. Se comprobaron el catálogo, la ausencia de IDs retirados en las agrupaciones vigentes, la separación del archivo, la persistencia por ID, la exportación JSON y la navegación móvil con recursos locales. La revisión artística y las decisiones de inclusión quedan pendientes de aprobación.

La reconstrucción de los recursos utiliza `preparar-arte.py --obj-11`, `corregir-obj-11.py`, `generar-manifiesto.cjs` y `auditar-obj-11.py`, en ese orden.
