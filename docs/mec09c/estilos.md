# MEC-09C · Estilos homologados

Archivo: `www/css/mobile-v569c.css`, cargado el **último**. Solo presentación. Conserva la paleta, la tipografía (Georgia para títulos, sistema para controles) y las ilustraciones.

## Fichas de diseño (`:root`)

| Ficha | Valor | Uso |
| --- | --- | --- |
| `--ux-tap` | 44 px | Área táctil objetivo: barra inferior, cierre de ventanas, filtros |
| `--ux-tap-min` | 40 px | Mínimo para controles secundarios (herramientas del título, botones de panel) |
| `--ux-subtab-h` | 40 px | Alto único de subpestañas |
| `--ux-gap` / `--ux-gap-s` / `--ux-pad` | 8 / 6 / 12 px | Separaciones |
| `--ux-radius` / `--ux-radius-s` | 12 / 9 px | Tarjetas / controles |
| `--ux-h1` … `--ux-micro` | 20 · 17 · 15 · 14 · 12,5 · 11,5 px | Escala tipográfica |
| `--ux-ink`, `--ux-ink-soft`, `--ux-paper`, `--ux-line`, `--ux-accent`, `--ux-focus` | paleta existente | Texto, papel, líneas, foco |

## Reglas compartidas

- **Marco móvil:** encabezado 52 · recursos 46 · título 44 · navegación 58 = **200 px** (antes 212). Áreas seguras (`env(safe-area-inset-*)`) arriba, abajo y a los lados. Las ventanas usan `100dvh` como límite.
- **Subpestañas:** una fila, 40 px de alto, desplazable dentro de su contenedor (`overflow-x:auto`, sin barra visible). La seleccionada se marca con fondo y una línea inferior (no solo color) y se mantiene a la vista (`mobile-ux-v569c.js`). Aplica a Inventario, Sociedad (fija bajo la cabecera) e Investigación. Las salas del Museo conservan su fila de iconos de V5.5.0.
- **Pestaña activa de la barra inferior:** contorno y línea inferior, además de `aria-current="page"`.
- **Ventanas del marco:** encabezado compacto, botón de cierre de 44 px, nunca fuera de pantalla, el foco vuelve al control que las abrió.
- **Diálogos de módulo** (perfil, Bestiario, Museo, MEC-01): ancho máximo `100vw - 16px`, alto `100dvh - 24px`, desplazamiento interno.
- **Avisos:** una línea sobre la barra inferior; el aviso entero sigue siendo pulsable.
- **Cifras de recursos:** completas hasta 9.999; después, formato compacto («13,3k», «£74M»). El valor exacto queda en `aria-label` y `title`.
- **Foco visible:** contorno de 3 px en todos los controles navegables por teclado.
- **Contenido nunca más ancho que el panel:** los bloques del panel tienen `min-width:0` para que una fila desplazable interna no los ensanche.
- **Textos traducidos:** `overflow-wrap:anywhere` y filas con `flex-wrap` en la configuración y en la guía, sin anchos fijos.
- **Teléfonos estrechos (≤ 359 px):** recursos con iconos de 18 px; estados del Campamento en una línea con elipsis.
- **Teléfono en horizontal (> 700 × ≤ 520 px):** recursos en una fila, pestañas en una fila desplazable, contenido visible desde el inicio.

## Lo que no se cambió

Ilustraciones zoológicas y sus proporciones, fondo del Campamento y sus seis zonas, mapa de hexágonos y sus proporciones, iconos propios, variantes pigmentarias.
