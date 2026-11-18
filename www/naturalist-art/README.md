# El Gran Atlas · laboratorio naturalista

Experimento de ilustración sobre el catálogo publicado de El Gran Atlas 3.45.0. Desde la raíz del repositorio, ejecuta `python3 -m http.server 8080 --directory www` y abre <http://localhost:8080/naturalist-art/>. Tras la primera carga, un service worker de alcance local conserva el laboratorio y todas las láminas. El estado de revisión se guarda en el navegador y se puede exportar como JSON.

## Vistas

**Campo** presenta un avistamiento compacto con marco de 88 px y zona del juego. **Cuaderno** usa papel pautado y una ficha de colección. **Bestiario** muestra una lámina amplia y la ficha zoológica con grupo, continente y rareza de origen. El selector de lámina permite probar una variante del catálogo en cada una. **Variantes** compara las láminas lado a lado, y **Ejemplares especiales** muestra las categorías habilitadas para la especie elegida. El laboratorio conserva Galería, Comparación con el SVG vigente, Escala real y Revisión artística.

## Inventario y resultados

| Medición | Resultado |
| --- | ---: |
| Marsupiales catalogados | 29 |
| Ilustraciones base | 29 |
| Variantes biológicas ilustradas | 4 |
| Recursos pendientes de importar | 0 |
| Peso medio de una imagen | 93,64 kB |
| Peso total de las 33 ilustraciones WebP | 3,09 MB |
| Proyección de 1.000 láminas base | 96,73 MB |
| Proyección con la proporción de variantes de esta prueba | 106,56 MB |

Pesos decimales. Las proyecciones de almacenamiento corresponden solo a las imágenes y no incluyen marcos, archivos del laboratorio ni miniaturas adicionales.

El inventario cruza la taxonomía del juego con la familia zoológica. Esto incluye la zarigüeya común, clasificada en pantalla en «Otros mamíferos», y el monito del monte, publicado en la ampliación GM-06. Se conservan los nombres e identificadores de producción. Las únicas variantes biológicas configuradas en los marsupiales son las albinas del canguro gris oriental, canguro rojo, wómbat común y zarigüeya de Virginia. Ninguno tiene dimorfismo jugable ni un legendario configurado. El [inventario por especie](CATALOGO.md) incluye ID interno, nombres, continente, zona, variantes, dimorfismo y categorías detectadas desde el juego. El monito del monte permite comparar Normal, Notable, Épico y Excepcional dentro de una especie. El marco Legendario está implementado y queda reservado para especies con esa categoría.

Los marcos se construyen con un carril, paspartú, línea interior y esquinas CSS. Normal usa el mismo sistema con una paleta sobria. Notable, Épico y Excepcional usan bronce, plata y oro, respectivamente. En la comparación de ejemplares, esos cuatro marcos apuntan al mismo WebP base. En las fichas se puede aplicar el marco a una variante biológica habilitada sin crear un archivo adicional.

## Revisión visual

Esta revisión reutiliza las 29 láminas base y las cuatro ediciones albinas generadas para la rama experimental anterior. La comparación usa los SVG actuales de 3.45.0. Todas las imágenes se entregan como candidatas a revisión, con acuarela, grafito y hábitats ilustrados. Las cuatro variantes se obtuvieron editando sus láminas base. La pose y los elementos principales del hábitat se conservan, con cambios locales de dibujo y textura cerca del pelaje y del suelo que conviene revisar en paralelo.

- Revisar hocico y proporciones de la cabeza en el monito del monte, y manos y pies en los tres canguros arborícolas.
- Reforzar en los canguros grises y ualabíes los rasgos diagnósticos que se pierden al reducir la imagen, en particular las marcas faciales, la región del hombro y el extremo de la cola.
- Revisar el contraste de la membrana plegada del petauro mayor y la legibilidad de la cresta de la cola en la mulgará de cola crestada.
- Las franjas del numbat, las orejas del bilbi y el pelaje moteado del cuscús se distinguen mejor en tarjetas y láminas grandes. A 32–48 px predomina la silueta y el fondo puede competir con los rasgos finos.

En las 29 bases, la prueba de recompresión WebP a calidad 80 promedió 1,44 kB a 64 px, 5,18 kB a 128 px y 20,21 kB a 256 px. Las miniaturas derivadas reducirían transferencia y decodificación en vistas con muchas tarjetas. Una serie de 128 px añadiría unos 5,18 MB por cada 1.000 imágenes si se almacena junto a las bases. El formato es viable para galerías y fichas amplias. Extenderlo a todo el catálogo requiere revisión por especie, una prueba de legibilidad de las vistas pequeñas y medir el impacto de la caché en Android antes de adoptar el formato como estándar. CSS permite iterar en marcos y fichas sin regenerar el animal. La ventaja de tiempo para producir una lámina naturalista frente a un SVG se mantiene como hipótesis, ya que la prueba no midió tiempo editorial por especie.

## Importar o sustituir una lámina

Coloca el WebP de 512 × 512 px en `plates/<id>--<variante>.webp`. Las claves válidas se construyen desde el catálogo. El generador rechaza archivos WebP sin una entrada válida y vuelve a crear el catálogo visual y el inventario offline.

```sh
node scripts/build-naturalist-lab.cjs
node scripts/check-naturalist-lab.cjs
```

La prueba del navegador requiere Playwright y Chromium. Se verificaron los nueve modos, las categorías por especie, el uso de un solo archivo en los marcos compatibles, los tamaños pequeños, la búsqueda, la persistencia de la revisión, la descarga JSON y la decodificación de los recursos tras una recarga offline en Chromium a 320 y 1280 px. En una ejecución local, Campo tardó 382 ms a 320 px y 262 ms a 1280 px desde la navegación hasta decodificar la primera lámina. Son mediciones de referencia en condiciones de laboratorio. La ejecución en un dispositivo Android físico queda por verificar.
