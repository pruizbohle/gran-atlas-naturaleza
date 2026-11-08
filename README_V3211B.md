# El Gran Atlas v3.21.1b — Propuesta inicial archivada

Esta propuesta de 406 celdas fue sustituida por la [corrección de alcance: Atlas simple](README_ATLAS_SIMPLE.md). Las mediciones de este documento describen la propuesta anterior. La planilla Excel se facilitó después y se revisó durante la corrección.

La cartografía ya no se deriva de los códigos HX ni de la cantidad de regiones jugables. Cada continente tiene una máscara geográfica propia sobre una retícula axial regular. Se conservan las 57 regiones funcionales y sus datos completos.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio antes/después](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-atlas-v3211b.html) · [Comparación visual](docs/cartography-v3211b/comparison.png) · [Tabla de las 57 posiciones](docs/cartography-v3211b/positions.md).

## Cobertura y vínculos

| Continente | Celdas visuales | Regiones conservadas | Celdas con juego | Celdas adicionales | Sectores compartidos |
| --- | ---: | ---: | ---: | ---: | ---: |
| Europa | 79 | 10 | 10 | 69 cartográficas | 0 |
| Asia | 152 | 21 | 21 | 131 cartográficas | 0 |
| África | 70 | 24 | 22 | 48 cartográficas | 2 |
| Norteamérica | 105 | 2 | 2 | 103 reservadas | 0 |
| Total | **406** | **57** | **55** | **351** | **2** |

Los dos sectores africanos compartidos contienen cuatro regiones: Magreb/Montañas del Atlas y Grandes Lagos africanos/Lagos del Rift. La ficha incluye un selector de las regiones originales. No se combinan sus requisitos ni sus datos; cada acción conserva el identificador exacto de la región elegida. El marcador del sector puede indicar que contiene la región actual, mientras la ficha presenta la opción concreta seleccionada.

Las 248 celdas cartográficas y las 103 reservadas no tienen acciones, fauna, progreso ni requisitos. Las reservadas norteamericanas utilizan una cruz discreta y una leyenda distinta de los candados de regiones jugables bloqueadas. Alaska y Columbia Británica mantienen sus ubicaciones noroccidentales, dentro de una silueta que representa también Canadá, Estados Unidos, México y Groenlandia.

## Fuentes y criterio geográfico

No se encontraron los archivos `Atlas_Fauna_Hexagonal_209.xlsx` ni `Atlas_Fauna_Hexagonal_209_900_Especies.xlsx` en el repositorio o el entorno. Se revisaron el catálogo vigente, sus nombres, los datos JSON de Asia y las referencias documentadas a la planilla original, especialmente `README_V3131.md` y `README_V314.md`. No se afirma haber leído planillas que no estaban disponibles.

La cobertura original de 209 celdas se interpreta como intención de representar tierras, océanos y polos; no se reutiliza como una geografía perfecta. Las nuevas máscaras son estilizadas y originales, con norte arriba y escala independiente por continente.

- Europa integra Iberia al suroeste, Francia al norte de Iberia, los Alpes sobre Italia, Escandinavia al norte y los Balcanes al este de Italia. Islas Británicas e Irlanda están separadas del continente.
- Asia sitúa las tres Siberias al norte y en orden oeste–este. Asia central queda sobre el Himalaya, India bajo el Himalaya y China meridional debajo de la septentrional. Japón queda separado al este de Corea; Kamchatka al noreste.
- África tiene norte ancho, Sahara septentrional, Sahel debajo, Congo ecuatorial, Cuerno al este y estrechamiento austral. Namib queda al suroeste; Madagascar y Seychelles/Aldabra forman islas separadas.
- Norteamérica conserva Alaska al noroeste y Columbia Británica al sureste de Alaska. El territorio no funcional completa la forma continental sin activar regiones.

La [tabla de auditoría](docs/cartography-v3211b/positions.md) contiene nombre, continente, centro anterior, coordenadas axiales nuevas, centro nuevo, celda y justificación para cada región. Los [datos completos](docs/cartography-v3211b/geometry.json) incluyen los identificadores heredados para diagnóstico y compatibilidad.

## Geometría comprobada

Todos los hexágonos tienen radio **46**, seis vértices regulares y orientación con vértice superior:

```text
x = √3 × R × (q + r/2) + desplazamiento horizontal del continente
y = 1,5 × R × r + desplazamiento vertical del continente
```

Los desplazamientos solo centran los límites dentro del lienzo; no alteran las relaciones entre celdas. No hay separación añadida entre vecinos. La distancia entre centros adyacentes es **79,6743371482 unidades**.

Se verifican **960 pares vecinos**. Cada par comparte exactamente dos vértices; el error máximo de distancia es `1,43 × 10⁻¹³` y el máximo error de coincidencia del lado compartido es `2,28 × 10⁻¹³` unidades. No hay centros duplicados, solapamientos ni vértices costeros abiertos: cada vértice del contorno tiene grado dos. Las islas conservan contornos cerrados independientes.

Los SVG usan coordenadas sin redondear y trazos finos uniformes. El contorno de selección queda dentro del hexágono. No se agregan filtros, imágenes remotas ni animaciones continuas.

## Móvil y navegación

Se conserva la estructura de 3.21.1. La vista inicial ajusta el continente completo sin deformarlo. Los marcadores de regiones conservan símbolos legibles en la vista general; el zoom amplía los territorios y muestra sus nombres. El botón central vuelve a ajustar el continente; el desplazamiento se realiza dentro del mapa. Selección, teclado, memoria de posición y viaje a Campo se mantienen.

| Viewport | Scroll vertical | Alto del mapa inicial | Acción sobre el dock |
| --- | ---: | ---: | --- |
| 320 × 640 | 0 px | 194 px | Sí |
| 360 × 740 | 0 px | 311 px | Sí |
| 390 × 844 | 0 px | 415 px | Sí |
| 412 × 915 | 0 px | 486 px | Sí |
| 1440 × 1000 | 0 px | 411 px | Sí, ficha lateral |

Mediciones: [antes, versión publicada fcd2f6f](docs/cartography-v3211b/before.json) y [después](docs/cartography-v3211b/after.json). Se revisaron las capturas de los cuatro continentes, la comparación completa, [África agrupada en 320 px](docs/cartography-v3211b/africa-group-320.png) y [Norteamérica en 320 px](docs/cartography-v3211b/north-america-320.png). Son viewports CSS y eventos de toque en Chromium, no una prueba física en Android.

## Laboratorio y pruebas

El laboratorio conserva el renderizador y proyección anteriores para comparar con la malla actual. La vista nueva y los ocho paneles comparativos utilizan el motor de producción correspondiente. Permite nombres, coordenadas internas, líneas y distancias entre vecinos, selección por región y cinco tamaños. La tabla geométrica indica cobertura, vecinos y errores. No carga `app.js` ni lee o escribe la partida.

- **225 pruebas Node aprobadas**, incluidas siete nuevas de geometría, costa cerrada, geografía relativa, agrupaciones, celdas sin juego, ausencia visual de HX y revisión aislada.
- **100 casos responsive aprobados**, con 0 px de scroll vertical en todos: cinco tamaños, estados de regiones y continentes futuros.
- Las **57 regiones** se seleccionaron en 320 × 640, conservando la acción por encima del dock. Se verificó el viaje concreto a Montañas del Atlas y Lagos del Rift desde sus sectores compartidos.
- Arrastre con eventos táctiles, teclado, zoom, conservación del SVG durante selección, memoria entre continentes y regreso desde Campo comprobados. Ninguna reconstrucción del mapa en el tick inactivo medido.
- Juego y laboratorio cargan offline con el navegador sin conexión y el servidor devolviendo error. La comparación anterior y los diagnósticos también están precargados.
- Las funciones de requisitos, desbloqueo y viaje conservan sus hashes anteriores. El catálogo y las 57 regiones son idénticos; la proyección, CSS e ilustraciones de Campo permanecen sin cambios. Siguen pasando las pruebas de economía, fauna, Museo, Inventario, investigaciones, expediciones, guardado, restauración, 3.473 sprites y simulación determinista de ocho horas.

[Informe del navegador](docs/cartography-v3211b/browser-report.json). La prueba anterior que exigía centros derivados de HX se actualiza al contrato geográfico solicitado; conserva la verificación del catálogo, metadatos y ausencia de mutaciones del estado.

## Compatibilidad e identificadores

HX continúa como identificador interno en regiones, guardados, fauna y desbloqueos. No aparece en los nombres, títulos ni fichas del Atlas actual. No se renumera ninguna región ni se ejecuta una migración de partidas.

Para una futura migración semántica conviene introducir una tabla explícita de alias, por ejemplo `HX-01-09 → europa-islas-britanicas`, versionar el formato y migrar de forma atómica `currentRegion`, `atlasSelectedRegion`, `regionUnlocked` y `regionsVisited`, conservando copia y lectura de identificadores antiguos. Esa migración no forma parte de esta versión. Las celdas cartográficas ya tienen identificadores independientes y pueden vincularse a futuras regiones sin rehacer su geometría. Hay plantillas reservadas extensibles para Sudamérica, Oceanía y polos; siguen sin activarse como continentes jugables.

## Archivos y reproducción

- `www/js/atlas-geography-v3211b.js`: máscaras, anclajes geográficos, retícula y auditoría matemática.
- `www/js/app.js`: vinculación visual del modelo y selector delegado de sectores compartidos.
- `www/js/atlas-ui-v3211.js`, `www/js/atlas-map-v3211.js`, `www/css/atlas-v3211.css`: dibujo continuo, marcadores, ajuste de escala y selección de regiones agrupadas.
- `www/laboratorio-atlas-v3211b.html`, `www/js/lab/geography-lab-v3211b.js`, snapshots anteriores y catálogo generado: revisión y diagnóstico. El laboratorio previo sigue disponible.
- `scripts/audit-geography-v3211b.cjs`, `scripts/check-geography-browser-v3211b.cjs`, pruebas, documentación y evidencias.
- Entrypoint, worker, Capacitor, metadatos y workflows: recursos offline y versión. Npm usa el SemVer válido `3.21.1-b`; la versión visible, el respaldo y la release Android usan `3.21.1b`. Se conserva el identificador Android.

```sh
node scripts/build-atlas-lab-v3211.cjs --check
node scripts/audit-geography-v3211b.cjs
node --test tests/*.test.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-geography-browser-v3211b.cjs
```

Los scripts de navegador requieren Playwright y `/usr/bin/chromium`, sin incorporar dependencias al juego. Los servidores de revisión se cierran al finalizar. Las capturas históricas se reproducen con `scripts/review-atlas-v3211.cjs`, `ATLAS_REVIEW_REF=fcd2f6f`, modo `before`; la versión actual usa `ATLAS_REVIEW_REF=working`, modo `after`.
