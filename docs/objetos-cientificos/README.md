# Laboratorio de objetos científicos

Base experimental **Atlas 4.3.0**, commit `0719d28`. Abre `www/laboratorio-objetos-cientificos.html` desde una copia local de la rama para usar el laboratorio sin conexión. También se puede servir el directorio `www` por HTTP. Las evaluaciones se guardan en una clave propia del navegador y se pueden exportar en JSON. El orden por peso usa la variante de inventario a la escala elegida, seguida por orden alfabético para los registros pendientes.

## Auditoría del catálogo

| Fuente | Comprobación |
| --- | --- |
| `www/js/app.js` y matriz INV3400 | 68 IDs idénticos en el catálogo funcional ejecutado y en la matriz. 12 objetos equipables en tres ranuras y 22 recetas de taller. Incluye materiales de expedición, muestras animales, fósiles, cartografía y siete mercancías de trueques regionales. |
| `www/js/item-art-v3198.js` | 76 entradas de renderizado SVG. 68 pertenecen al inventario y ocho corresponden a estudios. |
| Catálogo GM06 y matriz TSV | 240 piezas en 21 colecciones. La matriz TSV aporta asociaciones regionales y una fecha para FIL-04. El laboratorio conserva los 240 registros originales en `catalogo-300.json` y añade una anotación cronológica por ID. |
| Museo | Nueve fichas de colección y ocho montajes únicos necesitan su propia lámina. Nueve expedientes de relictos reutilizan ilustración de especie. Los otros nueve resultados de las recetas fósiles ya están en el inventario funcional. |
| Equipo futuro | Dos referencias de construcción para tiers III y IV incluidas como ideas. |

| Gabinete | Base | Ampliación | Total |
| --- | ---: | ---: | ---: |
| Botánica | 36 | 12 | 48 |
| Geología | 48 | 12 | 60 |
| Oceanografía | 48 | 12 | 60 |
| Historia | 60 | 12 | 72 |
| Historia natural y exploración | 48 | 12 | 60 |
| **Total** | **240** | **60** | **300** |

Las 26 colecciones suman 125 piezas comunes, 100 poco comunes, 50 raras y 25 muy raras. Los valores preliminares de 1, 2, 4 y 8 suman 725 puntos. Los cuatro sujetos nuevos del piloto son `HOJ-01` (ginkgo), `ALG-01` (sargazo), `MED-01` (Waterloo) y `ARQ-01` (nido de ave tejedora).

### Solapamientos

- `brass_compass` y `INS-02`, así como `field_telescope` e `INS-08`, representan instrumentos próximos. Reservar las características del equipo de viaje para la versión funcional y usar un ejemplar de época identificable en el álbum.
- `pressed_flower` representa una flor suelta. `BOT-01` representa una rama de rosa silvestre con hojas y botón. La nueva colección de hojas usa la lámina foliar como unidad.
- `ancient_coin` representa una moneda genérica. `NUM-01` y las restantes monedas del álbum requieren un ejemplar datado. Las medallas se reconocen por la suspensión, la cinta y el relieve. `MED-01` y `medallon_viajero` tienen contextos distintos.
- `fossil_track`, `FOS-09`, `huella_paleontologica` y `huellas_teropodos` son una muestra, un molde y fichas comparativas. `fossil_amber`, `AMB-09` y `AMB-12` necesitan atributos distintos. Los dos últimos comparten procedencia y deben diferenciarse por el fenómeno óptico del azul.
- `world_map`, `carta_historica` y `MAP-09` corresponden a un mapa mundial, un montaje de gabinete y una carta de estrecho. Las futuras láminas documentales deben usar contornos y soportes distintos.
- `river_pebble` representa un canto alisado. La nueva colección geológica usa secciones de roca y modelos de estructuras geológicas. Los minerales preexistentes conservan su hábito cristalino.
- Las simulaciones del Museo exponen cada identificador una vez. Los nueve componentes fósiles reutilizan su entrada funcional. El manifiesto conserva un solo registro por ID.

### Contexto de 1842

La datación es editorial y preliminar. El manifiesto marca como futuros los sellos posteriores a 1842 identificados (incluida la emisión de Sind de 1852), la pluma de Solnhofen, el birr de Menelik II, la kimberlita de Kimberley, la Orden del Mérito tunecina, los montajes fósiles nombrados posteriormente y el expediente del celacanto. El huevo de ave elefante se presenta como candidato a lámina de una documentación museística posterior, con distinción entre el conocimiento local y la descripción taxonómica de 1851. Las identificaciones restantes con fecha incierta llevan esa condición en el manifiesto.

El relicto, el patrimonio y las muestras sensibles se presentan como expedientes, reproducciones o ejemplares históricos conservados. La columna de obtención del catálogo base conserva las ideas GM06 para trazabilidad. Secretos de Atlántida y la corona de oricalco tienen el rótulo explícito de ficción.

Referencias del piloto. [Waterloo, National Army Museum](https://collection.nam.ac.uk/detail.php?acc=1958-11-96--6) · [Gibeon, Meteoritical Bulletin](https://www.lpi.usra.edu/meteor/metbull.cfm?code=10912) · [Aves fósiles, Natural History Museum](https://www.nhm.ac.uk/our-science/services/collections/palaeontology/fossil-birds.html)

## Familias y producción

| Familia | Convención de lámina |
| --- | --- |
| Instrumentos científicos | Tres cuartos o eje oblicuo, vidrio y metal modelados por separado. Latón envejecido, reflejos estrechos. |
| Sombreros y prendas | Tres cuartos, caída visible de paño, costuras delgadas. |
| Collares, amuletos y medallones | Frontal, suspensión corta, volumen en el borde. |
| Materiales de expedición | Tres cuartos, refuerzos y uniones reconocibles, madera y cuero mates. |
| Materiales animales | Vista diagnóstica, escala óptica uniforme, tono mate para hueso y queratina. |
| Fósiles | Perfil o sección diagnóstica, matriz terrosa y sombras internas. |
| Cartografía | Plano ligeramente oblicuo, papel mate y pliegues suaves. |
| Botánica | Lámina frontal, nervaduras y articulaciones esenciales. |
| Minerales y piedras preciosas | Tres cuartos, planos de fractura, óptica propia de cada mineral. |
| Numismática | Una cara de la pieza, luz rasante, pátina diferenciada por metal. |
| Objetos marítimos | Abertura o rasgo diagnóstico orientado hacia el observador. |
| Artefactos históricos | Vista diagnóstica, soporte natural, desgaste documentado. |
| Otras piezas de colección | Tratamiento según material, encuadre y luz del gabinete. |

La luz principal viene de arriba a la izquierda. La versión clásica ocupa cerca del 81 % del lado mayor. La variante de inventario usa el 89 %, reduce microtextura y refuerza el contraste y bordes a 64 y 128 px. Los tiers se reservan para la construcción. El catalejo de precisión, por ejemplo, introduce varios tramos telescópicos y un acabado óptico más elaborado. La rareza del álbum se puede probar con un halo CSS exterior.

Tras aprobar el piloto, hay **355 láminas propias pendientes** entre los 56 objetos funcionales restantes, los 282 coleccionables restantes y las 17 piezas del Museo. Se pueden distribuir en 12 tandas de 29–30 láminas. Empezar con instrumentos, prendas y colgantes comparables al piloto; seguir con mapas y documentos, materiales animales y fósiles, botánica, minerales, piezas marítimas y artefactos. Repartir las familias densas entre tandas contiguas y cerrar con montajes y registros del Museo. Las dos ideas futuras quedan fuera de ese cálculo.

Regeneración local del manifiesto y catálogo con `node docs/objetos-cientificos/generar-manifiesto.cjs`. Para reproducir el recorte desde las tres planchas maestras RGBA, usar `preparar-arte.py` con Python y Pillow. El manifiesto incluye la ruta y tamaño de cada archivo y expone el estado de cada registro.

## Peso y legibilidad

| Archivo | Clásica, media | Inventario, media |
| --- | ---: | ---: |
| WebP 64 px | 2,05 KiB | 2,17 KiB |
| WebP 128 px | 5,46 KiB | 5,74 KiB |
| WebP 256 px | 17,07 KiB | 14,75 KiB |
| WebP 512 px | 50,36 KiB | 39,37 KiB |

Las 30 ilustraciones, con dos variantes y cuatro resoluciones, ocupan **4,01 MiB** en 240 archivos WebP transparentes. Los 12 SVG funcionales originales del piloto promedian **0,79 KiB** de marcado sin comprimir por objeto. Cada casilla carga la resolución seleccionada. Las escalas de 24 y 32 px usan el archivo de 64 px.

En la [plancha de legibilidad](legibilidad.webp), cada sujeto aparece primero a 32 y luego a 64 px, con clásica a la izquierda e inventario a la derecha. A 32 px los prismáticos, el catalejo, el sombrero, el ginkgo y el coco de mar conservan siluetas distintas. El contorno oval del ópalo y la fractura de la obsidiana ayudan a separarlos. El relieve de las monedas y las costas de las cartas requieren 64 px o más para distinguirse. Conviene acentuar pliegues y perfiles en esos pares antes de aprobarlos. La carta de Magallanes, el grabado de los sellos y las piezas acuñadas requieren un cotejo con ejemplares datados. La evaluación individual queda en **Pendiente** hasta que se revise cada propuesta.

Se verificaron los 240 archivos con sus dimensiones y canal alfa. En Chromium móvil se comprobó el funcionamiento con un servidor local y solicitudes externas bloqueadas, incluyendo filtros, escalas, las cinco simulaciones y persistencia y exportación JSON. Las seis pruebas de inventario pasaron. Las suites históricas GM06 y Museo dieron 19 aprobadas y los mismos 11 fallos en la base 4.3.0 y en la rama experimental.

## Hoja de ruta

| Etapa | Alcance |
| --- | --- |
| OBJ-01 | Laboratorio y piloto |
| OBJ-02 | [Equipamiento e instrumentos](OBJ-02.md) |
| OBJ-03 | [Materiales animales y de expedición](OBJ-03.md) |
| OBJ-04 | [Cartografía y mercancías regionales](OBJ-04.md) |
| OBJ-05 | [Paleontología, Museo y laboratorio de inclusiones](OBJ-05.md) |
| OBJ-06 | [Gabinete de Botánica](OBJ-06.md) |
| OBJ-07 | [Gabinete de Geología](OBJ-07.md) |
| OBJ-08 | [Gabinete de Oceanografía](OBJ-08.md) |
| OBJ-09 | [Gabinete de Historia](OBJ-09.md) |
| OBJ-10 | [Gabinete de Historia natural y exploración](OBJ-10.md) |
| OBJ-11 | [Auditoría global y homologación](OBJ-11.md) |
| OBJ-12 | Integración posterior a la aprobación artística de los animales |
