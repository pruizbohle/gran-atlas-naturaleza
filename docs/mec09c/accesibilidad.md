# MEC-09C · Informe de accesibilidad

Herramienta: `scripts/mec09c-a11y.cjs` (Chrome real, 390×844, partidas nueva y final, las 9 pestañas). Resultados: `accesibilidad-antes.json` y `accesibilidad-despues.json`.

| Comprobación | MEC-09B | MEC-09C |
| --- | --- | --- |
| Textos bajo contraste AA (4,5:1; 3:1 en texto grande) | 64 de 590 | **3 de 624** |
| Controles visibles sin nombre accesible | 0 | 0 |
| Controles < 40 px en teléfonos (180 pantallas) | 564 | **40** (solo hexágonos del mapa en 320 px, con zoom disponible) |
| Pestaña activa de la barra expuesta (`aria-current`) y marcada sin depender del color | no (solo color) | sí |
| Subpestañas con estado (`aria-pressed`) y marca no cromática | Inventario sin marca | todas |
| Barra inferior alcanzable con el teclado; sin `tabindex` positivo | sí | sí |
| Ventanas: cierre visible, Escape, foco devuelto | Escape; sin cierre visible; sin devolver el foco | **sí** (prueba `mec09c` 4) |
| Ampliación al 130 % sin desbordamiento horizontal | sí | sí |
| Cifras de recursos legibles completas | cortadas | completas en formato compacto, valor exacto en `aria-label` |

Los tres textos que siguen bajo AA están en botones de la partida nueva (4,47:1 y 4,43:1, a 0,05 del umbral) y en un rótulo histórico del Cuaderno. Los botones desactivados (subvención en espera, investigación pendiente) quedan fuera de la norma de contraste y se excluyen.

**Lectores de pantalla:** no hay un dispositivo físico con TalkBack o VoiceOver en este entorno. La prueba física queda **pendiente** (TEST-01). Las comprobaciones automatizadas cubren nombres accesibles, estados y foco.

**Áreas táctiles:** la barra inferior tiene 9 accesos de 48 px de alto y 35–48 px de ancho según el teléfono. En 320 px el ancho por acceso es de 35 px, menor que el objetivo de 44. Se conservaron los nueve accesos sin etiquetas visibles (diseño de V5.5.0), con nombre accesible y marca de selección. No se adoptó una solución compacta con menú «Más», porque ocultaría secciones principales detrás de un paso adicional.
