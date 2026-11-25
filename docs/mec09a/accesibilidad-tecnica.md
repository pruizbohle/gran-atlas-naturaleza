# MEC-09A · Revisión técnica de accesibilidad (anexo 7)

**Método.** Revisión de código y comprobación en Chrome sin interfaz (412 × 900) con teclado: foco, `Enter` y `Tab`. Se usó el script `check/a11y9.cjs` del entorno de trabajo.

**Lectores de pantalla.** **No se ejecutaron pruebas con TalkBack ni VoiceOver**, porque este entorno no dispone de ellos. La validación física queda para MEC-09C.

| Superficie | Comprobación | Resultado |
| --- | --- | --- |
| Sociedad → Encargos, Eventos, Logros | Todo botón, `select` o `input` visible tiene nombre accesible (texto, `aria-label` o `<label>`) | 0 controles sin nombre |
| Registro de récords (Cuaderno) | Igual | 0 sin nombre; filtros con `aria-label`, búsqueda `type="search"` |
| Orden de tabulación | Ningún `tabindex` positivo | 0 |
| Foco tras aceptar con teclado | Antes se perdía (al `body`) por el re-render del panel. Ahora vuelve al mismo control o, si ya no existe, al siguiente equivalente | Corregido (`restoreFocusMEC09A`) |
| Foco tras abandonar | El botón desaparece; el foco va al encabezado de la sección (`tabindex=-1`) | Corregido |
| Foco tras paginar | Vuelve al botón de la misma dirección (`data-dir`) si sigue activo | Corregido |
| Foco tras filtrar o buscar | Vuelve al mismo `select` o `input` | Corregido |
| Avisos | Agrupados, sin ventanas emergentes en el campo; la franja tiene `role="status"` | Sin cambios (aceptado provisionalmente) |
| Errores de consola durante el recorrido | — | 0 |

**Pendiente para MEC-09B/09C.**
- La auditoría exhaustiva de accesibilidad de la progresión (MEC-09B).
- Lectores de pantalla reales, contraste en todos los temas y tamaño de objetivos en toda la aplicación (MEC-09C).
