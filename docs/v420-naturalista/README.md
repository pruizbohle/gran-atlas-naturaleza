# V4.2.0 · Carnívoros terrestres

GM-07-M04 parte de la 4.1.0 publicada, commit `b485713`. Se preservaron las 152 láminas y sus derivados. El motor híbrido, el marco de producción y el registro de doce legendarios son los de la 4.1.0. Campo, Cuaderno, Bestiario, Museo, monografías, variantes y registro de avistamientos consumen el mismo inventario gráfico.

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/)
- [Laboratorio V4.2](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/)
- [Inventario por especie, familia, zona y variante](../../www/naturalist-art/CATALOGO.md)

## Alcance

| Familia | Especies |
| --- | ---: |
| Mustelidae | 24 |
| Ursidae | 8 |
| Herpestidae | 4 |
| Viverridae | 4 |
| Hyaenidae | 3 |
| Mephitidae | 3 |
| Procyonidae | 3 |
| Ailuridae | 1 |
| Eupleridae | 1 |
| Total | 51 |

El inventario del juego determina los identificadores, nombres y variantes. El generador del laboratorio resuelve la familia desde los géneros cuando la clasificación histórica usa agrupaciones amplias. Así aparecen, por ejemplo, las hienas en Hyaenidae, el meloncillo en Herpestidae y la fosa en Eupleridae. Nandiniidae y Prionodontidae no tienen entradas en el lote. Se incluyen las nutrias de río, el huillín y el chungungo, que se representa sobre la costa. La nutria marina `Enhydra lutris`, predominantemente marina, se reserva junto con pinnípedos. Canidae y Felidae se conservaron tal como se publicaron.

El lote añade 51 láminas normales y 42 variantes biológicas, 18 albinas y 24 melánicas. Ninguna entrada de este lote tiene dimorfismo jugable, leucismo independiente o legendario configurado. El avance pasa a **142 de 997 especies (14,24 %)**. El acumulado contiene 100 variantes biológicas, cuatro legendarios ilustrados y 245 láminas distintas que cubren 246 rutas.

## Revisión zoológica y visual

- **Úrsidos.** El oso pardo se distingue por la joroba escapular y las uñas delanteras. El americano presenta orejas más altas y perfil sin joroba. El asiático conserva la media luna pectoral. Oso polar, oso malayo y oso bezudo se separan mediante cuello, perfil, tamaño de orejas y pelaje. El oso de anteojos usa la máscara clara y el panda gigante conserva el patrón de cabeza y hombros.
- **Mustélidos.** La comadreja tiene cola corta y el armiño un extremo negro. Las martas se diferencian por babero, forma de cabeza y cola, y los turones por máscara y pelaje. El visón conserva las marcas claras de los labios. Tejones, glotón y tejón melero se separan por cráneo, perfil, garras y franjas. Las nutrias se representan fuera del agua para que se lean la silueta, el perfil de cabeza y la cola. A tamaño pequeño, la separación entre algunas nutrias y martas depende más de la silueta que de las marcas finas.
- **Hienas, mangostas y vivérridos.** Se distinguen el lomo potente y las orejas redondas de la hiena manchada, la crin y las rayas de la rayada y el manto largo de la parda. Suricata, meloncillo y mangostas tienen poses y proporciones propias. Máscara, manchas y anillos separan a civetas y gineta. La cola prensil y el pelaje largo distinguen al binturong.
- **Eupléridos, ailúridos, mefítidos y prociónidos.** La fosa muestra cráneo, postura y cola propios. El panda rojo se distingue por su máscara y cola anillada. Los zorrillos mantienen patrones independientes. El coatí tiene el hocico y la cola elevados. Entre los mapaches, la cola de tonos dorados ayuda a separar al de Cozumel.
- **Pigmentación.** Se generaron variantes editando la lámina original. Se preservaron el entorno y la pose general. Hay pequeñas diferencias locales de textura y contorno en algunos pares. Los melanismos de especies de pelaje naturalmente oscuro tienen menor contraste a 64 px.

El laboratorio permite combinar grupo, familia y búsqueda en todos los modos. Conserva Campo mixto, revisión y exportación, los tres tratamientos de marco y las cuatro resoluciones. Los grupos y familias se construyen desde el inventario generado. Añadir Primates requiere incorporar su clasificación y las láminas del catálogo, con los mismos filtros, rutas, comprobación offline y visualización.

## Almacenamiento y rendimiento

| Resolución WebP | Archivos | Peso |
| --- | ---: | ---: |
| 64 px | 245 | 0,275 MB |
| 128 px | 245 | 0,963 MB |
| 256 px | 245 | 4,092 MB |
| 512 px | 245 | 16,193 MB |
| Total | 980 | 21,522 MB |

El WebP base de 512 px promedia 66,09 kB. Para 997 entradas se proyectan 100 MB con láminas normales en cuatro tamaños y 151 MB si se mantiene la proporción de variantes e individuos de la 4.2.0. Entre la primera y la última salida del generador transcurrieron 9 min 23 s, incluida la espera y la preparación de los grupos de variantes. La revisión visual fue independiente de esa medición.

La PWA precarga 1.188 rutas de recursos, incluidos los 980 WebP comprimidos. Las tarjetas de galería se cargan de forma diferida. Campo usa 128 px y el registro reciente usa 64 px. Una lámina de Campo de 128 px ocupa 64 KiB de píxeles RGBA antes de la sobrecarga del navegador. La prueba recoge también el heap de JavaScript. Los avistamientos automáticos consecutivos reutilizan el nodo de imagen. [PWA desde 4.1.0](prueba-pwa-v410.json) · [PWA desde 3.45.0](prueba-pwa-serie3.json) · [Mediciones y proyecciones](medicion-imagenes.json)

## Validación

- El cotejo histórico dio 90 aprobadas de 111 en 4.1.0 y 4.2.0, con los mismos 21 fallos y cero omitidas. Los controles vigentes prueban independientemente el contenido zoológico del lote, el motor híbrido, los resultados de avistamientos, el guardado y la equivalencia de restauración de seis respaldos anteriores. [Fallos históricos](pruebas-historicas.json)
- Chromium probó los once modos del laboratorio a 320 y 1280 px, incluida la combinación de filtros, la exportación y la recarga offline. Probó la migración PWA desde ambas versiones, con copia exacta del guardado, comprobación de los estados de partida, retirada del caché anterior, funcionamiento offline y avistamiento mixto. Las capturas del Cuaderno corresponden al juego en 390 y 1280 px.
- La verificación de Capacitor compara los archivos web del empaquetado, el identificador de aplicación, los complementos nativos y la versión 4.2.0 con código 40200. La restauración en un dispositivo Android físico queda como prueba posterior. [Validación de empaquetado](prueba-android-empaquetado.json)
