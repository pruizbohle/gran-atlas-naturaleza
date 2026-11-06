# El Gran Atlas — Beta 3.15.4 · Revisión zoológica y sprites

## Cambios publicados
- **Catálogo conciliado:** 57 zonas y 487 fichas zoológicas, todas asignadas al menos a una zona. Se incorporan al mapa meloncillo, chacal dorado, cigüeña blanca y martín pescador.
- **Duplicaciones:** caracal y zorro de Rüppell reutilizan un ID global entre Asia y África; migración del progreso anterior sin duplicar avistamientos. El lobo dorado africano se identifica como *Canis lupaster*, distinto del chacal dorado *Canis aureus*. El leopardo persa queda documentado como *Panthera pardus tulliana* y el africano como *P. p. pardus*.
- **Perdices nivales:** *Lagopus muta* conserva «Perdiz nival» y *Lagopus lagopus* aparece como «Lagópodo común». No cambian sus rarezas ni IDs.
- **Clases y grupos zoológicos:** centralizados en la función taxonómica para el Cuaderno, Bestiario y las investigaciones. Ranas y sapos pasan a Amphibia; cálao rinoceronte pasa a Aves.
- **Sprites:** cálao rinoceronte con anatomía de ave, desmán ibérico sin caparazón (el problema provenía de una coincidencia parcial de `Galemys` con `Emys`), cobras del género *Naja* y cobra real con capucha y estilo común, liebres de *Lepus* con silueta compartida, y colores norteamericanos diferenciados.
- **Bestiario:** al pulsar de nuevo Abecedario, Rareza o Tipo se invierte el orden ascendente/descendente, con flechas ↑/↓. Cambiar de criterio inicia en ascendente.
- **Escenarios:** diferenciación de Selva y Sabana en Campo, con colores y vegetación propios.
- **Pruebas:** `tests/patch-v3154.test.cjs` valida clasificación, biogeografía, migraciones, sprites, filtros y ordenamiento.

## Compatibilidad
- Clave local `gran_atlas_v05` y respaldo JSON sin cambios.
- Conserva el identificador Android `com.elgranatlas.naturaleza.beta314`.
- Sin cambios de economía, progresión, ratios de avistamiento, cupos, precios, requisitos ni investigaciones.
- Respaldar/exportar la partida antes de actualizar el APK Android.

## Pendiente
Auditoría de ecología real de las 57 zonas con la planilla fuente completa, ampliación de Norteamérica, pruebas de rendimiento prolongadas en dispositivos reales y progreso offline con más de 500 intentos por actualización.
