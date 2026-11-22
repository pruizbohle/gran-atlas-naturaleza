# El Gran Atlas · V5.3.0

Candidata en feat/v530-iconografia-naturalista, basada en el commit público 5070f8a de V5.2.0. La biblioteca ofrece 138 fichas en ocho categorías, comparación anterior y propuesta, filtros de estado y categoría, fondo claro y oscuro, y vistas a tamaño de uso, 32, 64 y 128 px. [Biblioteca en el árbol de la candidata](../../www/iconoteca/biblioteca.html)

## Auditoría y selección

| Rama auditada | Contenido de origen | Selección para V5.3 |
| --- | --- | --- |
| main · 5070f8a | 68 objetos con renderizador nativo, navegación con emojis, biomas de línea y los dos visores anteriores | Se conservan 64 ilustraciones de objetos y ambos visores. |
| arte/iconoteca-1842-v1 · a1d22c7 | 24 conceptos PNG RGBA a 256 px | Se recuperan los 24. Se limpian y se exportan a WebP de 128 px. La candidata usa 23 y deja el sobre individual de Misiones en revisión. |
| arte/iconoteca-1842-lote2-revision · 3ce29ec | 20 ubicaciones de interfaz registradas, con emojis de referencia | Sirve para ubicar mejoras en Sociedad, Museo, Campo, Atlas, respaldos y controles. |
| experiment/scientific-illustration-objects · 952d9c0e | 461 fichas de laboratorio, 3.550 WebP y 68 identificadores coincidentes con objetos jugables | Diez derivados de 128 px se recuperan byte a byte. Cuatro se incorporan a la candidata y seis quedan en comparación. |
| feat/coleccionables-arte-240 · 451e844 | 240 SVG de catálogo experimental y su visor | Rama auditada. Los 240 recursos pertenecen a su colección experimental. |

El inventario registra **143 pictogramas distintos en 557 menciones** en catorce archivos de interfaz de V5.2.0 y 138 distintos en 515 menciones en los mismos archivos de la candidata. El cómputo agrupa las variantes de presentación Unicode e incluye referencias secundarias, el registro y los iconos de reserva. Cada entrada anota sus ubicaciones. [Inventario de fuentes, WebP y huellas](inventario.json) · [Coincidencias de objetos](objetos-coincidentes.json)

## Cambios jugables

- Navegación principal de escritorio y móvil, estadísticas y respaldos. Los controles conservan sus nombres y área táctil.
- Cinco instalaciones del Campamento, secciones de Inventario, cinco salas del Museo, proyectos de Investigación, expediciones, comercio y Sociedad.
- Cuatro objetos reutilizados con el mismo identificador y los WebP originales del laboratorio. Son la flor prensada, el fragmento fósil, el guijarro de río y el equipo de sondeo.
- 29 ilustraciones nuevas de acuarela y grafito. La cartografía usa 16 motivos para representar los 31 hábitats reales. Los símbolos y el borde discontinuo distinguen bloqueada, disponible, desbloqueada, visitada, seleccionada y especial.
- El Atlas muestra indicios de relictos cuando ya constan en el expediente y la región es accesible. Las rutas o ejemplares sin una localización individual registrada conservan su información en sus módulos.

Los 63 WebP de la iconoteca pesan **493.132 bytes**. La incorporación completa aumenta en **575.389 bytes** la caché esencial, hasta **133.430.111 bytes** en 7.166 recursos. Cada imagen tiene una única URL compartida entre el juego y la biblioteca. La iconoteca V1 permanece como archivo independiente en línea. [Mapa en móvil](evidencia/mapa-movil.png) · [Biblioteca en móvil](evidencia/biblioteca-movil.png)

## Vitrinas

El título precede a un área propia de ilustración, seguida por el nombre científico, el estado y los indicios. Localización, hábitat, comportamiento, fecha y descripción siguen el orden del expediente. Las entradas sin descubrir muestran los bloques permitidos por el número de indicios. El detalle ampliado sigue la misma jerarquía. [Cinco comparativas](comparativas.md)

## Validación

- Chromium verificó los veinte relictos a **320, 360, 390, 412, 768 y 1.280 px**. Se midieron 120 vitrinas y seis fichas ampliadas. Se cubrieron niveles de indicio del 0 al 3 y la ocultación del arte y los datos de las especies desconocidas.
- Se comprobaron selección con teclado, escalas del Atlas, navegación móvil y el indicador de un indicio legitimado. El visor ofrece controles de tamaño, categoría, estado y fondos claro y oscuro.
- La PWA descargó y verificó los **7.166 recursos**. Chromium abrió la biblioteca y el mapa con la red desactivada. También se ejecutó la actualización autorizada desde la instalación de V5.2.0, se cotejó el respaldo byte a byte y se reabrió la partida sin conexión. Se conservaron saldos, inventario y el relicto histórico. La revisión de restauración comprobó las exposiciones, los hallazgos y la identidad de Nácar. Las pruebas de navegador recorrieron los indicios y el hallazgo en Campo del tilacino y comprobaron los 30 legendarios. [Resultados de Chromium](navegador.json)
- Las **42 pruebas críticas** pasaron en Node 22. La suite completa registró 666 pruebas aprobadas, 219 fallos ya presentes en V5.2.0 y cero fallos nuevos. [Regresión](regresion.json)
- La verificación Android fue estática. APK sin generar.

## Pendientes de revisión

Ocho fichas están pendientes. Incluyen el motivo de análisis comparativo, el sobre individual de V1 y seis propuestas de objetos que conservan su representación vigente en el juego. Son la moneda antigua, los prismáticos, el sombrero de naturalista, el ámbar fósil, el cuadrante oceánico y la lente pulida. El inventario también identifica emojis secundarios. [Pendientes en la biblioteca](../../www/iconoteca/biblioteca.html)
