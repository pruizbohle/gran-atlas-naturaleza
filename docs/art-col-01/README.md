# ART-COL-01 · Biblioteca revisable de 240 coleccionables

Rama de arte: `feat/coleccionables-arte-240`. Base `41a4bbdc90a16ebdb612f67591ea6e2dd9dfe259`, El Gran Atlas 3.43.0. **No fusionar con main ni desplegar el juego desde esta rama.**

Se incluyen 240 dibujos SVG originales con fondo transparente, 5 gabinetes y 21 colecciones. El JSON adjunto se conserva byte a byte; rarezas: **100 comunes, 80 poco comunes, 40 raros y 20 muy raros**. No se activan los puntos, obtención ni recompensas propuestos.

[Comprobación de rama remota y aislamiento](GITHUB.md)

## Revisar el laboratorio

- [HTML autónomo sin dependencias de red](laboratorio-coleccionables-autonomo.html): descargar el archivo y abrirlo en un navegador.
- [Laboratorio con archivos locales](../../www/laboratorio-coleccionables-v1.html).
- [Vista general de las 240 piezas](overview-240.png).
- [Comparación de las doce piezas marítimas](marine-twelve.png).
- [Tamaños reales 24, 48, 80 y 120 px](sizes-real.png).
- [Móvil](captures/lab-390.png), [fondo oscuro](captures/dark-390.png), [ficha individual](captures/detail-390.png), [sin red](captures/offline-390.png).

El laboratorio permite buscar nombre/ID, filtrar gabinete/colección/rareza, ampliar, comparar tamaños reales y descargar cada SVG. En móvil la comparación puede desplazarse horizontalmente sin reducir los dibujos; las flechas funcionan al enfocar una pieza. Atlántida se identifica como **ficción mitológica** en colección, ficha y metadatos de cada SVG.

## Totales por gabinete

| Gabinete | Piezas |
|---|---:|
| Botánica | 36 |
| Geología | 48 |
| Oceanografía | 48 |
| Historia | 60 |
| Historia natural y exploración | 48 |
| **Total** | **240** |

## Colecciones y 21 capturas reales de navegador

| Colección | Piezas | Captura |
|---|---:|---|
| Herbario del mundo | 12 | [Ver](captures/collection-01.png) |
| Semillas extraordinarias | 12 | [Ver](captures/collection-02.png) |
| Pigmentos del mundo | 12 | [Ver](captures/collection-03.png) |
| Piedras preciosas | 12 | [Ver](captures/collection-04.png) |
| Minerales extraordinarios | 12 | [Ver](captures/collection-05.png) |
| Ámbar y resinas fósiles | 12 | [Ver](captures/collection-06.png) |
| Meteoritos | 12 | [Ver](captures/collection-07.png) |
| Los siete mares | 7 | [Ver](captures/collection-08.png) |
| Secretos de Atlántida | 5 | [Ver](captures/collection-09.png) |
| Conchas de los océanos | 12 | [Ver](captures/collection-10.png) |
| Curiosidades de marineros | 12 | [Ver](captures/collection-11.png) |
| Corales del mundo | 12 | [Ver](captures/collection-12.png) |
| Numismática | 12 | [Ver](captures/collection-13.png) |
| Objetos de civilizaciones | 12 | [Ver](captures/collection-14.png) |
| Filatelia | 12 | [Ver](captures/collection-15.png) |
| Máscaras y figurillas | 12 | [Ver](captures/collection-16.png) |
| Cartografía antigua | 12 | [Ver](captures/collection-17.png) |
| Huevos de aves | 12 | [Ver](captures/collection-18.png) |
| Fósiles menores | 12 | [Ver](captures/collection-19.png) |
| Instrumentos de exploración | 12 | [Ver](captures/collection-20.png) |
| Gabinete de maravillas | 12 | [Ver](captures/collection-21.png) |

## Biblioteca y exports

- API: [collectibles-art-draft.js](../../www/js/collectibles-art-draft.js), `AtlasCollectiblesArtDraft.render('MAR-11', {size:80})`.
- Código común y cinco familias: `www/js/art-draft/`.
- Los [240 SVG individuales](../../www/assets/collectibles-draft/) están listos para uso futuro por ID, sin depender de cartas HTML.
- [Manifiesto original](../../www/data/atlas_coleccionables_240_manifest_v2.json).
- [Índice técnico y estructuras por ID](build-report.json).

No se carga ningún archivo de esta biblioteca desde el `index.html` del juego, el service worker, Inventario ni Museo. La versión y los 68 objetos operativos siguen intactos.

## Reutilización gráfica

| Estructura | IDs que la reutilizan | Diferenciación |
|---|---|---|
| Pliego de herbario | BOT-01…BOT-12 | Cada flor/planta tiene pétalos, hojas, tallo y silueta propios. |
| Materia prima + muestra de polvo | PIG-01…PIG-12 | Carbón, rocas, achiote, recipientes y concha son diferentes. |
| Prisma cristalino | GEM-03/05/09, MIN-01/10/12 | Número, proporciones, facetas, inclinación y hábito de los cristales. |
| Facetas de gema | GEM-01/02/04/08/10/11 | Perfiles y caras interiores definidos individualmente. |
| Resina, capas y burbujas | AMB-01…AMB-12 | Doce contornos; opacidad, estrías, hoja y fluorescencia específicas. |
| Matriz meteorítica | MET-01…MET-12 | Doce perfiles, texturas y cortes; Widmanstätten, pallasitas y gran masa aplanada particulares. |
| Espira | CON-03/09/12, FOS-02 | Contornos, aperturas, cámaras y costillas distintos. |
| Ramas de coral | COR-04/05/09/10/11 | Ejes, articulaciones y patrones de bifurcación diferentes. |
| Cospel circular u ovalado | NUM-01/02/03/05/06/07/08/09/10/11, MAR-01 | Relieves propios; el koban es ovalado. NUM-04 tiene orificio transparente y NUM-12 perfil irregular. |
| Perfil victoriano | NUM-01, FIL-01, FIL-09 | Referencia temática común; moneda y sellos con bordes, grabado y cancelación diferenciados. |
| Marcos de sellos | FIL-01…FIL-12 | Formatos rectangular, circular y triangular; retratos, fauna y motivos específicos. |
| Pliegos cartográficos | MAP-01/02/03/05/06/07/08/09/10/11/12 | Diagramas por región/ruta; MAP-04 usa un atlas abierto. |
| Curva de huevo | HUE-01…HUE-12 | Proporciones, manchas, porosidad, posición y tamaño comparativo por especie. |
| Matriz fósil | FOS-01/02/04/06/07/08/09/11 | Impresiones y anatomías propias, no un fósil genérico recoloreado. |
| Esferas instrumentales | INS-02/05 | Brújula y barómetro tienen caras, agujas y monturas distintas. |
| Trípode | INS-07/09 | Teodolito y cámara de placas con cuerpos y ópticas diferentes. |

Los elementos `path`, `ellipse`, `rect`, trazos y paleta son utilidades compartidas. No hay máscaras, gradientes, imágenes externas, IDs SVG ni colisiones cuando se muestran varias copias a la vez.

## Correcciones y límites

[Correcciones gráficas y por similitud](CORRECCIONES.md) · [Notas históricas/culturales](NOTAS-CURATORIALES.md).

La edición es **revisable**. No se atribuye autenticidad a monedas, máscaras, sellos, mapas ni réplicas culturales. Se documentan elecciones formales y anacronismos, y no se modifica el manifiesto para ocultarlos. Los detalles de grabado se revisan a 80/120 px o en ampliación; a 24 px se prioriza silueta y motivo principal.

## Verificaciones

- 12 pruebas Node de catálogo, rarezas, API, seguridad, exports, aislamiento y workflow.
- 240 SVG analizados como XML; cero recursos externos, cero IDs colisionantes.
- 960 rasterizados con píxeles visibles y esquinas transparentes; **cero duplicados raster exactos**.
- Comparación de gradientes de luminancia: se corrigieron los pares Ceres/Franklin y Penny Red/Mauritius; no hay pares con coseno ≥0,985. La semejanza más alta restante es 0,93518, para el perfil victoriano relacionado de Penny Red/Penny Black.
- Revisión visual de las 21 colecciones y las doce piezas marítimas antes del commit.
- Navegador Chromium a 320, 360, 390, 412 y 1280 px: filtros, tamaños reales, teclado, detalle, descarga y fondos. Al denegar todo acceso a `localStorage` y `sessionStorage`, el laboratorio sigue funcionando.
- HTML autónomo cargado sin red: muestra las 240 piezas y mantiene fichas/filtros.
- Las 196 fuentes de producción coinciden con el manifiesto 3.43.0 anterior. El único archivo previo modificado en esta rama es el workflow web: se añade `if: github.ref == 'refs/heads/main'` para impedir despliegues manuales desde la rama de arte.

[Pruebas de navegador](browser-report.json) · [SVG/XML](xml-report.json) · [Rasters y semejanza](raster-report.json) · [Revisión visual](visual-review.json) · [Límites medidos](bounds.json).

## Reproducir

```sh
node scripts/build-collectibles-art-draft.cjs
node --test tests/art-col-01.test.cjs
python3 scripts/validate-collectibles-svg.py
python3 -m http.server 8794 --directory www
# En otra terminal con Playwright/Chromium disponibles:
node scripts/check-collectibles-lab.cjs
node scripts/render-collectibles-review.cjs
# Las láminas y métricas de raster usan Pillow y NumPy disponibles en el entorno de revisión:
python3 scripts/analyze-collectibles-rasters.py
```

No se añaden dependencias a la aplicación ni se cambian `package.json`, la PWA, Android, los guardados o las mecánicas. Los ZIP de revisión se generan para descarga y se excluyen de Git; los SVG, catálogo, laboratorio y capturas sí se almacenan en la rama.
