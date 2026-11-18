# V4.1.0 · Cánidos y consolidación naturalista

La 4.1.0 incorpora el trabajo revisado de la [versión 4.0.0](../v400-naturalista/README.md) y el lote GM-07-M03. La base publicada anterior fue 3.45.0. El juego y el laboratorio usan los mismos datos y el mismo motor híbrido.

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/)
- [Laboratorio V4.1](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/)
- [Inventario por especie, variantes y zonas](../../www/naturalist-art/CATALOGO.md)

| Cobertura | Especies | Variantes biológicas | Legendarios |
| --- | ---: | ---: | ---: |
| Marsupiales, monotremas y felinos | 63 | 35 | 2 |
| Canidae | 28 | 23 | 2 |
| Total | 91 | 58 | 4 |

Se incorporaron 28 láminas normales, nueve albinas, 14 melánicas y dos legendarios, Fenrir y Ascua. Canidae tiene 53 láminas nuevas. Ningún cánido registrado tiene dimorfismo jugable ni leucismo independiente. Las hienas rayada, manchada y parda son Hyaenidae. Su agrupación histórica «Cánidos» en el juego se conserva y sus láminas quedan fuera del lote. El total representa **9,13 %** de las 997 entradas. Se preservaron las 99 imágenes originales de 4.0.0 y sus derivados. Las 153 rutas acumuladas apuntan a 152 láminas distintas.

## Revisión artística

- El aguará guazú se distingue por sus patas negras desproporcionadamente largas y la crin. El licaón tiene orejas redondas grandes y pelaje en parches. El perro de monte tiene cuerpo bajo y compacto, extremidades cortas, orejas redondeadas y cola corta. El zorro de orejas cortas muestra hocico más afinado, cuerpo más largo y cola más gruesa.
- El lobo gris tiene cabeza, tórax y pies más robustos que el coyote. El chacal dorado es más fino y el chacal de lomo negro se reconoce por la montura oscura de límite más nítido. El lobo etíope presenta patas largas, hocico estrecho, garganta clara y un perfil propio.
- Los zorros de ambientes áridos se distinguen por perfil de orejas, proporciones, contraste del dorso y punta de la cola. La cola del zorro de Rüppell termina clara. La gorguera cuadrada distingue al zorro tibetano. A 64 px, el contraste entre el zorro pálido, el corsac y otros zorros arena depende en parte de la silueta. El tanuki y el zorro orejudo se distinguen por proporciones incluso en miniatura.
- Las ediciones albinas aclaran solo al animal. Las melánicas conservan silueta y detalle, y en el licaón se retiene parte del patrón en el pelaje oscuro. Hay diferencias leves de textura entre algunas variantes y sus bases. Los legendarios conservan su identidad y un encuadre propio.
- Los tratamientos cambiables del laboratorio comparten un archivo de imagen. El contorno minimalista conserva el color de categoría. La presentación sin marco usa un halo discreto para los ejemplares especiales. El marco clásico de producción se mantiene. Campo mixto utiliza el mismo renderizador de avistamientos que el juego, con una lámina WebP y un SVG de respaldo.

## Almacenamiento y rendimiento

| WebP | Archivos | Peso total |
| --- | ---: | ---: |
| 64 px | 152 | 0,173 MB |
| 128 px | 152 | 0,605 MB |
| 256 px | 152 | 2,490 MB |
| 512 px | 152 | 10,620 MB |
| Total | 608 | 13,888 MB |

La media de las láminas de 512 px es 69,87 kB. La proyección para 997 entradas es de 106 MB con ilustraciones normales en cuatro tamaños y 152 MB si se replica la proporción de variantes de esta versión. Entre la primera y la última salida del generador transcurrieron aproximadamente 5 min 23 s, incluyendo la espera y preparación de las variantes. La revisión editorial se comprobó aparte sin cronometraje independiente.

La PWA prepara 815 recursos offline, incluidos los 608 WebP comprimidos. Las tarjetas de galería usan carga diferida. Campo usa derivados de 128 px y el registro reciente usa 64 px. En un avistamiento mixto, una imagen de 128 px equivale a 64 KiB de píxeles RGBA antes de la sobrecarga del navegador. La prueba recogió el heap de JavaScript como medida separada del uso nativo de imágenes. En Chromium se comprobó la reutilización del mismo nodo de imagen en los avistamientos automáticos consecutivos a una cadencia de un segundo. [Evidencia de navegador](prueba-pwa.json)

## Validación de publicación

- Los seis controles de V4.1 pasaron. Incluyen rutas Canidae, nombres de legendarios, contrato de ocultación, resultados idénticos con y sin el motor WebP en avistamientos manuales y automáticos, y lectura y restauración de respaldos históricos con el mismo resultado que 3.45.0.
- Chromium comprobó los once modos del laboratorio a 320 y 1280 px. La migración PWA desde 3.45.0 pasó a 390 y 1280 px. Verificó el respaldo exacto, diez campos de partida, el bloqueo de activación con una segunda pestaña, juego y laboratorio offline, avistamiento mixto y las vistas del Bestiario, Cuaderno y Museo.
- Las pruebas históricas obtuvieron 90 de 111 en ambas versiones. De los 21 fallos previos, tres comparan el código con instantáneas de versiones anteriores, siete usan recuentos antiguos, cuatro esperan identificadores de versión o caché históricos, uno elimina una dependencia necesaria al montar Campo y seis corresponden a los respaldos de Museo. De estos últimos, cinco esperan la etiqueta de exportación 3.30.0 y uno exige el objeto Museo histórico sin normalizar. Los seis respaldos se volvieron a abrir y restaurar contra 3.45.0 como referencia, con resultado equivalente. Esto y la prueba de privacidad y migración actual permiten publicar sin evidencia de regresión. [Lista de los 21 casos](pruebas-historicas.json)
- Capacitor verificó 826 archivos web copiados, el identificador de aplicación y `versionCode=40100`. La verificación de restauración en Android físico pertenece al flujo posterior de publicación del APK.
