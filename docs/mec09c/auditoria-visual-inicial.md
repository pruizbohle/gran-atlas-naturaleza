# MEC-09C · Auditoría visual inicial (MEC-09B, antes de modificar)

Capturas reales: `capturas/antes/` (246: 4 partidas × 5 resoluciones de teléfono × 9 pestañas, más ventanas, horizontal, tableta y escritorio). Medidas: `medidas-antes.json`.

## Marco

Encabezado 60 + recursos 54 + título 40 + navegación 58 = **212 px fijos** en todas las resoluciones (confirma el valor histórico de V5.5.0). En 320×568 quedan 356 px para el contenido.

## Problemas observados (inspección de capturas y medidas)

| # | Pantalla | Problema | Gravedad |
| --- | --- | --- | --- |
| 1 | Marco | Las cifras de recursos se cortan con puntos suspensivos a partir de 10.000 («13....», «£74...»); en 320 px se cortan todas («1....») | Alta (información ilegible) |
| 2 | Sociedad | El aviso de evento queda en una columna estrecha de una palabra por línea (también en escritorio); subpestañas en tres filas (164 px); las secciones empiezan a 464 px | Alta |
| 3 | Inventario | Rótulo y título que repiten «Inventario»; subpestañas en dos filas (97 px); rótulo «Buscar objetos» sobre un campo que ya lo indica | Media |
| 4 | Bestiario | Búsqueda, grupo, avistamientos, orden y «Más filtros» ocupan la mitad de la primera pantalla; las ilustraciones empiezan bajo el pliegue | Media |
| 5 | Campo (partida nueva) | Los prismáticos de la escena vacía tapan el rótulo «El campo te espera» | Media |
| 6 | Museo | Introducción de la mecánica y dos notas repetidas en cada tarjeta de exposición | Media |
| 7 | Investigación | Ramas en una fila más ancha que la pantalla, sin indicación; textos de estado de 8–9 px con contraste 3,4–4,1:1 | Media |
| 8 | Avisos | El aviso «Evento iniciado» (3 líneas, 90 px) tapa la parte inferior del contenido en todas las pestañas durante 6,5 s | Media |
| 9 | Ventanas del marco | Sin botón de cierre visible (solo tocar fuera o Escape); el foco no vuelve al botón que las abrió | Media |
| 10 | Controles | 564 controles visibles por debajo de 40 px en teléfonos (herramientas del título 32 px, subpestañas, botones de panel) | Media |
| 11 | Teléfono en horizontal (844×390) | Se aplica el diseño de escritorio: encabezado, estadísticas y tres filas de pestañas llenan la pantalla; el contenido no aparece | Alta |
| 12 | Contraste | 64 de 590 textos comprobados por debajo de AA | Media |
| 13 | Campamento (320 px) | Los estados de las instalaciones se montan sobre la ilustración | Baja |

Sin desbordamiento horizontal general en ninguna captura de MEC-09B. Rendimiento ya selectivo: en reposo el panel no se reconstruye y una búsqueda no lo regenera entero.
