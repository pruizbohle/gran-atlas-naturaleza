# MEC-09D §18 · Expediciones, rutas comerciales y yacimientos

Prueba: `tests/mec09d-activities.test.cjs`, con 34 pruebas: una por actividad y una general. Usa el motor vigente con el catálogo completo y un reloj virtual.

## Comprobaciones por actividad

| Comprobación | Expediciones (19) | Rutas comerciales (4) | Yacimientos (10) |
|---|---|---|---|
| No arrancan sin sus requisitos | 19/19: astillero, prestigio, mapa (no consumido), rango de rutas, investigación | 4/4: astillero, prestigio, una ruta a la vez | 10/10: región desbloqueada, investigación |
| Coste exacto descontado al iniciar | 19/19 | 4/4 | 10/10 |
| Duración exacta | 19/19, con `voyageTime` | 4/4, en horas | 10/10, en segundos |
| Sin liquidación anticipada | 19/19 | 4/4 | 10/10 |
| Trabajo a medias conservado al guardar y recargar | 19/19 | 4/4 | 10/10 |
| **Liquidación única**: reprocesar no paga de nuevo; restaurar el guardado anterior paga una sola vez en esa línea temporal | 19/19 | 4/4, cobro e importes de materiales exactos | 10/10 |
| Recompensas entregadas | Dinero y conocimiento de la ruta, botín, muestras y fósiles | Dinero y materiales exactos | Fragmentos dentro de su intervalo, hallazgos fósiles y contador del Museo |

**Cancelación.** El juego no ofrece cancelar estas actividades, ni en el motor ni en la interfaz. Es un comportamiento histórico y no es un defecto.

**Cobertura complementaria:**
- Piezas de mapa por la capa cartográfica: `global-v3240` y `mec07`, cálculo de derrotas.
- Coleccionables de expediciones y excavaciones: `mec09d-collectibles`, con 45 y 36 piezas.
- Modalidades, capacidad y niveles del Campamento: `mec02`.
- Fósiles en el Museo: `mec05`.
- Fallos de guardado: `mec09d-persistence`.
- Equivalencia de 8 horas sin conexión: `persistence-v3240`.

## Integración y utilidad

- **Sin actividades inaccesibles.** Todas aparecen en el grafo de progresión (§17) con una cadena legítima.
- **Sin actividades sin utilidad.** Todas entregan dinero, conocimiento o materiales; además, las rutas y expediciones alimentan recetas, mapas y colecciones.
- **Objetos sin utilidad:** ninguno. Los 20 materiales animales nuevos (MAT-N*) se usan en estudios del Taller por grupo animal, y los cuatro equipos continentales son credenciales de acceso.

**Sin errores funcionales.**
