# MEC-09C · Optimización de interfaz móvil, navegación, experiencia de usuario y rendimiento

**Versión 5.6.9 Beta — compilación MEC-09C**, rama `mec-09c/mobile-ux` (sobre MEC-09B `05fc522`, sin fusionar a producción).

Restricciones cumplidas:
- No se generó ni publicó APK, y la APK pública V4.9.6 no se tocó.
- **No se modificó el balance:** costos, probabilidades, tiempos y recompensas siguen igual.
- No se tocaron ilustraciones, variantes pigmentarias, el fondo del Campamento ni los iconos propios.
- No se agregaron especies, regiones ni mecánicas, ni se eliminaron funciones.
- No se avanza a MEC-09D.

## 1. Línea base (MEC-09B)

- **Suite:** 1.130 pruebas, 909 aprobadas, 221 fallidas históricas, 0 regresiones, sin tiempos agotados.
- **Capturas reales:** 246 tomadas antes de modificar (`capturas/antes/`).
- **Auditoría:** [`auditoria-visual-inicial.md`](auditoria-visual-inicial.md), con 13 problemas.

## 2. Método

- **`scripts/mec09c-capture.cjs`:** sirve `www/` en local y abre el juego real en Chrome con Playwright. Carga cuatro partidas: A nueva, B intermedia (rango 7), C avanzada (Polos abiertos) y D final de MEC-09B (1.000 especies y monografías), guardadas en `saves/`.
  - Resoluciones: las nueve pestañas en 320×568, 360×800, 390×844, 412×915 y 430×932, más ventanas emergentes, horizontal (844×390), tableta (768×1024) y escritorio (1280×800).
  - Mide el marco, el espacio central, las acciones visibles sin desplazamiento, el desbordamiento horizontal, el contenido recortado, los controles pequeños, el texto visible, el DOM y el tiempo de cambio de pestaña.
- **`scripts/mec09c-a11y.cjs`:** contraste, nombres accesibles, estados seleccionados, teclado y ampliación al 130 %.
- **`scripts/mec09c-perf.cjs`:** inicio, recuperación offline, cambio de pestaña, listas extensas, reposo y memoria.
- **Comparación:** las mismas mediciones sobre MEC-09B, servido desde `05fc522`.

## 3. Resultados de encuadre

[`matriz-encuadre.csv`](matriz-encuadre.csv) tiene 234 filas (partida × pestaña × resolución), con antes y después, justificación del desplazamiento vertical y correcciones.

| Resolución | Marco fijo (px) | Espacio central (px) | Controles < 40 px | Subpestañas en varias filas | Desbordamiento horizontal |
| --- | --- | --- | --- | --- | --- |
| 320×568 | 212 → 200 | 356 → 368 | 128 → 40 | 4 → 0 | 0 |
| 360×800 | 212 → 200 | 588 → 600 | 104 → 0 | 8 → 0 | 0 |
| 390×844 | 212 → 200 | 632 → 644 | 108 → 0 | 8 → 0 | 0 |
| 412×915 | 212 → 200 | 703 → 715 | 112 → 0 | 8 → 0 | 0 |
| 430×932 | 212 → 200 | 720 → 732 | 112 → 0 | 8 → 0 | 0 |

Pantalla por pantalla (partida final, 390×844):

| Pestaña | Subpestañas, alto (px) | Acciones visibles | Texto en pantalla (car.) | Desplazamiento vertical necesario | Correcciones |
| --- | --- | --- | --- | --- | --- |
| Atlas | 0 → 0 | 4 → 4 | 36 → 36 | — | Marco compacto (200 px fijos); mapa sin cambios |
| Campo | 0 → 0 | 2 → 2 | 276 → 297 | Hallazgos secundarios bajo la acción principal | Prismáticos de la escena inicial dentro de su marco (ya no tapan el rótulo); contraste |
| Cuaderno | 0 → 0 | 8 → 8 | 960 → 960 | Rail de especies y registro de etapas | Marco compacto |
| Investigación | 0 → 0 | 9 → 10 | 496 → 465 | Listado de proyectos de la rama | Ramas en una fila desplazable; cabecera compacta; contraste AA de ramas y estados |
| Sociedad | 164 → 53 | 8 → 10 | 322 → 467 | — | Subpestañas en una fila fija bajo la cabecera; registro numérico en una fila; aviso de evento a ancho completo; texto de subvención plegado (ⓘ) |
| Bestiario | 0 → 0 | 12 → 7 | 525 → 453 | Catálogo paginado de 32 fichas por página | Búsqueda visible; grupo, avistamientos y orden en «Filtros»; rótulo repetido retirado |
| Campamento | 0 → 0 | 6 → 6 | 227 → 227 | — | Marco compacto; rótulos de instalación sin solape en 320 px |
| Inventario | 97 → 46 | 13 → 17 | 497 → 505 | Cuadrícula paginada y ficha del objeto | Subpestañas en una fila; rótulos repetidos retirados; desbordamiento interno corregido |
| Museo | 46 → 46 | 8 → 10 | 1969 → 1739 | Salas con exposiciones y gabinetes paginados | Introducción plegada (ⓘ); notas repetidas por tarjeta retiradas |

- En las 180 pantallas de teléfono, las acciones visibles sin desplazamiento pasan de 1370 a 1420.
- En Bestiario y Sociedad aparece **menos texto** y **más contenido útil**: ilustraciones y secciones.
- El desplazamiento vertical solo queda en listas y catálogos; la columna «justificación» de la matriz lo explica pantalla por pantalla.
- Desbordamiento horizontal general: **0** en las 234 capturas, antes y después.
- Contenido recortado: **0** (comprobado automáticamente, también en `tests/mec09c.test.cjs`).

## 4. Cambios

Todo es presentación. `www/css/mobile-v569c.css` y `www/js/mobile-ux-v569c.js` se cargan al final y no leen ni escriben el estado; `www/js/frame-v550.js` también se modificó; `app.js` solo cambió en lo que lista el punto 4.

1. **Marco.** Pasa de 212 a 200 px fijos, con áreas seguras y límites en `dvh`. Las cifras de recursos ya no se cortan: formato compacto a partir de 10.000 y valor exacto en `aria-label`. Las herramientas del título suben de 32 a 40 px.
2. **Navegación inferior.** Conserva los nueve accesos en el mismo orden y posición. La pestaña activa se marca con contorno y línea, además de `aria-current`; los botones miden 48 px de alto.
3. **Subpestañas homologadas.** Una fila de 40 px, desplazable dentro de su contenedor, y la seleccionada siempre visible:
   - Inventario: de 2 filas a 1;
   - Sociedad: de 3 filas a 1, fija bajo la cabecera;
   - Investigación: ya era de 1 fila, ahora con marca de selección.
   Pantallas con subpestañas de más de 60 px de alto: 36 → 0.
4. **Guía contextual de progresión.** La ficha de cada objeto incluye «Cómo se obtiene». Es una cadena recursiva de recetas, ingredientes, fuentes, investigación requerida, regiones (con enlace), hábitat y horario. Usa los mismos datos del motor, con enlaces de navegación existentes y regreso.
   - Ejemplo de MEC-09B: **Polos → abrigo polar → morral reforzado → escama de cola de castor → Gabinete de especímenes → Europa Central / Oriental / Báltico · río o costa · atardecer o noche.**
   - No revela especies sin identificar: nombra la región y las condiciones, no el animal.
   - Código en `app.js`, bloque `MEC09C`.
5. **Configuración del perfil** (menú del naturalista → «Configuración»). Sección preparada para MEC-09E:
   - contiene idioma (solo español, selector desactivado), preferencias, guardado y respaldos, y versión;
   - la sección Game Master está reservada y oculta, sin implementar;
   - no hay ayudas de desarrollo ni décima pestaña;
   - el diseño admite textos más largos (`flex-wrap`, `overflow-wrap`).
6. **Textos.** Inventario en [`textos.csv`](textos.csv):
   - D (redundantes): ocultos en el móvil, por ejemplo los rótulos «· 1842» y los títulos que repiten la pestaña o las notas repetidas en cada tarjeta.
   - C (explicativos): plegados tras «ⓘ Más información».
   - A y B (acción y requisito): sin cambios. Costos, requisitos, consumos, recompensas y bloqueos siguen visibles.
7. **Divulgación progresiva.** El Bestiario muestra la búsqueda y un botón «Filtros · N activos». Grupo, avistamientos y orden se conservan al cambiar de pestaña y al volver de una ficha.
8. **Ventanas emergentes.** Cierre visible de 44 px, Escape, foco devuelto al control de origen y límites de ancho y alto en el teléfono (también en los diálogos de módulo). En 320×568 todas caben.
9. **Avisos.** Ocupan una línea sobre la barra inferior, en lugar de tres líneas sobre el contenido.
10. **Correcciones visuales.**
    - Aviso de evento en Sociedad: antes ocupaba una columna de una palabra por línea; ahora va a ancho completo, también en escritorio.
    - Prismáticos del Campo: ya no tapan el rótulo.
    - Rótulos del Campamento en 320 px: sin solape.
    - Inventario: ya no se ensancha por la fila de subpestañas.
11. **Teléfono en horizontal y tableta.** Recursos y pestañas en una fila, con el contenido visible desde el inicio. Antes, en horizontal la pantalla quedaba llena de cabecera.
12. **Contraste AA.** Textos bajo el umbral: 64 → 3 (en 624 textos comprobados).

Estilos: [`estilos.md`](estilos.md). Navegación contextual: [`matriz-navegacion.csv`](matriz-navegacion.csv), con 16 accesos: 10 existentes o ampliados, 2 nuevos y 4 parciales, que pasan a MEC-09D.

## 5. Pantallas (secciones 13–24)

| Pantalla | Estado tras MEC-09C |
| --- | --- |
| Campo | La ilustración sigue siendo protagonista; los indicadores del encuentro no cambian. La escena vacía se corrigió. Los registros mantienen su altura controlada de V5.5.0. |
| Cuaderno | Sin cambios de estructura: rail de especies, cinco etapas en fila compacta y solo el próximo objetivo (ya era así). |
| Bestiario | Filtros plegados con recuento, 32 fichas por página y ficha completa al pulsar. Conserva posición y filtros. |
| Atlas | Mapa y proporciones intactos. Ficha de región en panel compacto. Los requisitos enlazan a la receta, y la receta muestra la cadena. |
| Brújula | Sin cambios de contenido (avisos agrupados de V3.41). Se cierra con Escape o tocando fuera, y ahora devuelve el foco al botón; su ventana respeta el alto del teléfono. |
| Campamento | Conserva la ilustración y las seis zonas; sin solape en 320 px. |
| Museo | Salas como fila de iconos (V5.5.0), introducción plegada y notas repetidas retiradas. |
| Sociedad | Muestra primero el rango y el registro en una fila; subpestañas fijas y aviso del evento activo con su tiempo restante. |
| Taller e Inventario | Subpestañas en una fila; fichas con la cadena de obtención y enlaces a fuentes y recetas. |
| Investigación | Ramas desplazables con estado legible; la cadena enlaza a la investigación requerida. |

## 6. Accesibilidad y rendimiento

- Accesibilidad: [`accesibilidad.md`](accesibilidad.md).
  - Controles < 40 px: 564 → 40. Solo quedan los hexágonos del mapa en 320 px, que tienen zoom.
  - Ningún control sin nombre accesible.
  - **La prueba física con TalkBack o VoiceOver queda pendiente**, porque no hay dispositivo en este entorno.
- Rendimiento: [`rendimiento.md`](rendimiento.md).
  - Sin regresiones; el motor ya actualizaba de forma selectiva y la capa nueva no reconstruye listas.
  - Con la partida final: inicio de unos 0,6 s, cambio de pestaña por debajo de 40 ms y DOM de unos 1.200 nodos.

## 7. Pruebas

Suite completa (132 archivos), comparada **prueba por prueba** con MEC-09B ([`comparacion-pruebas.csv`](comparacion-pruebas.csv), [`resultado-suite-mec09c.json`](resultado-suite-mec09c.json)):

| Conjunto | Pruebas | Aprobadas | Fallidas | Tiempo agotado |
| --- | --- | --- | --- | --- |
| MEC-09B (`05fc522`) | 1.130 | 909 | 221 | ninguno |
| MEC-09C (`mec-09c/mobile-ux`) | 1.145 | 924 | 221 | ninguno |

- **15 pruebas nuevas en `tests/mec09c.test.cjs`, todas aprobadas.** Se ejecutan con el catálogo completo y Chrome real, y están incluidas en `release:verify`.
- **0 regresiones, 0 pruebas retiradas.** Los 221 fallos son los históricos ya clasificados; su revisión queda para MEC-09D.
- **Expectativas actualizadas, sin debilitar las pruebas:** las etiquetas de compilación de MEC-09A (V) y MEC-09B (V) admiten `MEC-09C`.

Correspondencia con la sección 34:

| Punto | Prueba en `mec09c` |
| --- | --- |
| 1-3 · navegación estable, subpestañas en una fila, sin desplazamiento horizontal ni recortes (5 resoluciones × 9 pestañas, partida final) | 1-3 |
| 4 · ventanas en 320×568: caben, cierre, Escape, foco | 4 |
| 5, 7 · filtros y posición del Bestiario; regreso desde ficha | 5/7 |
| 6 · navegación contextual (receta → cadena → investigación) | 6 |
| 8 · controles táctiles | 8 |
| 9-10 · recompensas y actualización sin reconstruir el panel | 9-10 |
| 11 · rendimiento de listas extensas | 11 |
| 12 · partidas anteriores (12 auténticas, de 5.4.0 a MEC-08) | 12 |
| Guía contextual y su privacidad | guía (2 pruebas) |
| Configuración del perfil | configuración (2 pruebas) |
| Horizontal, tableta y escritorio | horizontal y escritorio |
| Versión, carga y restricciones | V; capa solo de presentación |

Las funciones de juego (búsquedas, monografías, investigaciones, viajes, comercio, excavaciones, prospecciones, fabricación, instrumentos, Museo, gabinetes, rangos, encargos, logros, eventos, inventario, guardado, importación y modo offline) siguen cubiertas por sus suites históricas: todas mantienen su resultado.

## 8. Galería y vista de revisión

- [`galeria.html`](galeria.html): galería navegable con las capturas reales antes y después, por partida, resolución y pantalla, junto a sus medidas.
- Una selección de la galería (132 capturas: 390×844 en las cuatro partidas; 320×568 y horizontal en la final) se publicó además como página privada autocontenida, para revisarla desde el teléfono.
- **No fue posible publicar el juego completo como vista web aislada:** son más de 7.000 archivos y el servidor de páginas admite 256 por envío. Para revisar la interfaz real, sirve `www/` en local (por ejemplo, `npx serve www`) o despliega la rama en un entorno de prueba. El despliegue público no se tocó.

## 9. Pendientes

- [`pendientes-mec09d.md`](pendientes-mec09d.md): observaciones de MEC-09B y las detectadas ahora.
- [`arte-pendiente.md`](arte-pendiente.md): iconos que hoy se repiten o usan caracteres.

## 10. Archivos

- **Interfaz:**
  - nuevos: `www/css/mobile-v569c.css`, `www/js/mobile-ux-v569c.js`;
  - modificados: `www/js/frame-v550.js` (cifras compactas, cierre y foco) y `www/js/app.js` (bloque `MEC09C`: guía y configuración);
  - `index.html`, `sw.js`, `manifest.webmanifest` y `atlas-release.json` (etiqueta MEC-09C, bloque `v569c`).
- **Herramientas:** `scripts/mec09c-capture.cjs`, `scripts/mec09c-a11y.cjs`, `scripts/mec09c-perf.cjs` y `scripts/mec09c-docs.py`.
- **Pruebas:** `tests/mec09c.test.cjs` (en `release:verify`).
