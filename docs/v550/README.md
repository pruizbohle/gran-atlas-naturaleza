# V5.5.0 · Marco móvil estable

Solo presentación (`www/css/frame-v550.css`, `www/js/frame-v550.js`, ajustes en `www/index.html`). No cambia datos, guardado ni lógica de juego.

En pantallas de hasta 700 px el marco es idéntico en las 10 pestañas y no se mueve:

| Zona | Alto | Contenido |
| --- | --- | --- |
| Cabecera | 60 px | Título, región sin código y perfil |
| Monedas | 54 px | Conocimiento, libras, prestigio y coronas: icono y cantidad; al tocar abre un pop |
| Título | 40 px | Nombre de la pestaña, ficha (Atlas y Museo), Guía y Brújula como pops |
| Ventana | resto | El contenido se desplaza dentro de ella |
| Barra inferior | 58 px | 9 iconos; Coronas se abre desde su moneda |

- Atlas: el mapa es lo central; la ficha de región aparece como pop al tocar un hexágono o el icono de ficha.
- Campo: escena central; se retira el encabezado repetido de la expedición.
- Museo: las salas pasan a una fila de iconos y el resumen del museo es un pop.
- «Tomos» ya no se muestra (sin cambios en los datos); «Equipo» sale de las monedas y queda para la tienda del naturalista.
- Pendiente: la Brújula solo existe en Atlas; en las demás pestañas su pop remite a él.

Verificación: `release:verify` 42/42; suite completa 885 pruebas, 666 pasan y 219 fallan, los mismos del historial (0 nuevos).

## Antecedente para mecánicas: niveles del Campamento

Cada una de las 6 áreas del Campamento (Astillero, Caravana, Taller, Excavación, Prospecciones y Tienda) tendrá **5 niveles** de mejora y una imagen por nivel. Por ahora se mantiene el ícono actual de cada área. Las imágenes del nivel 1 y siguientes se irán incorporando a `www/iconoteca/arte`, y la subida de nivel (costos, requisitos y efectos) se define en la etapa de mecánicas y balance. El fondo del Campamento debe quedar libre de construcciones para que estas se muestren como capas que cambian con el nivel.
