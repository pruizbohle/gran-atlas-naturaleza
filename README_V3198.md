# El Gran Atlas v3.19.8 — Inventario ilustrado

52 objetos inventariables y 8 proyectos del Taller reciben láminas SVG originales, en una paleta de latón, cuero, papel y fósiles de gabinete naturalista. No se añaden objetos ni se modifican mecánicas, especies o guardados.

[Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-objetos.html) · [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Láminas a 48 px](docs/items-v3198/plates-48.png) · [Prueba de navegador](docs/items-v3198/browser-report.json).

## Catálogo y dirección artística

| Grupo | Láminas | Diferencias revisadas |
| --- | ---: | --- |
| Equipamiento | 12 | Dos tubos de prismáticos frente al catalejo extensible; sombreros de campo, emplumado y académico; capucha; morral; tres colgantes y collar de conchas. Medallón con montura frente al ámbar básico. |
| Materiales animales | 7 | Plumas de distinta forma; diente de lobo frente al colmillo arqueado; cornamenta ramificada; bigotes en ficha; muestra queratinizada reticulada. |
| Expedición | 14 | Fragmento fósil, muestra de huellas, herbario, moneda, mapas completos y fragmentados, pergamino, piedra y lente. Cada continente tiene un trazado propio. |
| Fósiles | 13 | Tres cráneos con anatomías distintas; diente con raíz; huesos corto, largo y denso; placa ancha, espina estrecha, icnita, garra, costilla arqueada y cuerno. |
| Materiales históricos | 4 | Cuadrante angular, componente de latón perforado, tintero y madera tallada. |
| Raros | 2 | Ámbar con inclusión frente a perla modelada con reflejos sobre soporte mineral. |
| Taller | 8 | Folios de estudio compuestos con las muestras del motor compartido. |

Los 52 objetos tienen una composición diferenciada por identificador. Se comparten primitivas de trazo, papel, cordones, materiales, estructuras cartográficas y folios; no se usa una biblioteca de iconos ni se recolorea un único dibujo para objetos anatómicamente diferentes. Los SVG se almacenan en caché por ID, sin filtros, animaciones ni recursos externos. El motor pesa aproximadamente 12 KB sin comprimir.

## Integración

`AtlasItemArt.renderItemArt(id)` devuelve el mismo SVG en Node y navegador (`viewBox="0 0 100 100"`). Los estudios utilizan el espacio de nombres `study:`; no son objetos nuevos. Tres siluetas tenues identifican ranuras vacías. Los nombres junto a las imágenes mantienen la información accesible y los SVG son decorativos.

Reemplazos: tarjetas de las cinco pestañas del inventario, equipo ocupado/vacío, recetas de equipo y mapas, ingredientes, ocho estudios, requisitos de investigación, materiales del taller paleontológico, colecciones, conservación e historial de recompensas de excavación. Los emojis de navegación, encabezados y registros narrativos se conservan. Las piezas terminadas del Museo mantienen sus SVG especializados.

El laboratorio muestra los 60 dibujos del motor de producción con nombres e IDs, siete categorías, búsqueda, tamaños 32/48/64/96, fondos claro/oscuro, siluetas, comparación con el emoji anterior, completitud y pendientes. No carga el motor del juego ni lee/escribe la partida. El service worker incorpora el nuevo laboratorio y los dos scripts, y renueva su caché.

## Validación y revisión visual

- Suite de Node: 179 pruebas anteriores y 5 nuevas. Las expectativas de versión/caché antiguas se actualizan a 3.19.8, conservando las verificaciones de recursos y arquitectura.
- Comparación exacta de los datos anteriores: `ITEMS`, `RECIPES`, `V316_MATERIAL_STUDIES`, `MUSEUM_FOSSIL_RECIPES` y `MUSEUM_COLLECTIONS`. Se conservan IDs, cantidades, bonificaciones, costes y recompensas.
- Pruebas de consumo, mejora de prismáticos a catalejo, bonificaciones de equipo, estudios y fabricación paleontológica.
- Chromium: 60 XML SVG válidos, geometría dentro del viewport, tamaños, categorías, búsqueda, partida antigua con 52 materiales y equipo, botones reales, consumo y persistencia, juego y laboratorio sin conexión y sin errores JavaScript.
- Revisión de las 60 láminas en la plancha completa y en móvil de 390 px; sin desbordamiento horizontal. Se corrigió el bajo contraste del enlace al laboratorio sobre la cabecera verde.
- Android: comprobado el puente simulado de Capacitor en las pruebas existentes y la disposición móvil en Chromium; no se ha ejecutado una APK en un dispositivo Android físico.

Reproducir desde la raíz con `node --test tests/*.test.cjs`. Para navegador, servir `www` en el puerto 8765 y ejecutar `node scripts/check-items-browser-v3198.cjs` con Playwright resoluble. El script admite `ATLAS_TEST_URL`, `ATLAS_CHROMIUM` y `ATLAS_ARTIFACT_DIR`; sus capturas/resultados se guardan en `/tmp/atlas-v3198` por defecto, sin sobrescribir documentación.

## Publicación

La versión visible, referencias de scripts, paquete y nombre de Capacitor están en 3.19.8; el identificador Android y el formato de guardado siguen intactos. GitHub Pages sirve `www` mediante `Deploy El Gran Atlas`. Los enlaces anteriores son las rutas de destino; una validación local no confirma publicación. El resultado remoto debe verificarse para el commit de esta versión.
