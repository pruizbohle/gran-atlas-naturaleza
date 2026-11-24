# MEC-08 · Auditoría de accesibilidad ampliada (sección 23)

Revisión de las superficies nuevas o modificadas.

| Superficie | Criterio | Resultado |
| --- | --- | --- |
| Pestañas de Sociedad (Eventos incluida) | Botones nativos con `aria-pressed` y texto; `nav` con `aria-label` | Cumple (componente existente, sin cambios de patrón) |
| Franja de cabecera | `role="status"`; texto completo sin depender de iconos; se oculta vacía | Cumple |
| Filtros de logros (categoría, estado, nivel, búsqueda) | `select` nativos con etiqueta; la medalla se indica con texto («Bronce · Obtenido»), no solo con color | Cumple |
| Tarjetas de correspondencia, proyectos y eventos | Encabezados `h4` y lista de objetivos con valor/objetivo en texto; botones nativos de al menos 44 px (`mec08.css`) | Cumple |
| Abandonar encargo | Confirmación explícita y un mensaje que dice que no hay penalización | Cumple |
| Registro de récords (Cuaderno) | Paginador `nav` con `aria-label`; estado de página `aria-live="polite"`; botones deshabilitados en los extremos; búsqueda `type="search"` con `aria-label`; filtros con etiquetas propias («Estado del hito», «Evidencia»); controles de 44 px | Cumple |
| Validar evidencia por región | Botón por evidencia, con la región en texto; si está deshabilitado, `title` explica el motivo (instrumento y ubicación) | Cumple. Mejora propuesta para MEC-09: mostrar el motivo también como texto visible, no solo como `title` |
| Marcas regionales «◆ N regiones» | El número de regiones está en texto; el `title` lista las regiones | Cumple; el símbolo es decorativo y va acompañado de texto |
| Avisos | Agrupados en el canal existente (`notifyExperience`), con prioridad y acción; sin ventanas emergentes durante el campo; sin repeticiones | Cumple |
| Movimiento | Sin animaciones nuevas; `prefers-reduced-motion` anula transiciones en los componentes MEC-08 | Cumple |
| Idioma y fechas | Fechas con `toLocaleDateString('es-CL')`; tiempos restantes en texto («quedan 3 días») | Cumple |
| Teclado | Todos los controles nuevos son `button`, `select` o `input` nativos dentro del orden del documento | Cumple |

**Pendiente.** No se hizo una revisión con lector de pantalla real (VoiceOver o TalkBack). Queda propuesta para la auditoría técnica MEC-09A.
