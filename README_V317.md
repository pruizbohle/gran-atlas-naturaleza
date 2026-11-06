# El Gran Atlas — Beta 3.17 · Fósiles y Museo

## Objetivo
Desarrollar las excavaciones y colecciones paleontológicas conservando el Atlas, el sistema de avistamientos, las expediciones, el Museo y las partidas de Beta 3.16.

### Excavaciones persistentes
Cuatro yacimientos asociados a regiones existentes: Islas Británicas, Alpes, Namib y Columbia Británica. El jugador paga libras y conocimiento al iniciar una campaña; la excavación se completa por tiempo real y **se recoge manualmente** al terminar, incluso después de cerrar Android. Solo se reclama una vez.

- Islas Británicas: 3 min, £55, 15 conocimiento, 2–3 fragmentos garantizados.
- Alpes: 5 min, £135, 45 conocimiento, 3–5 fragmentos.
- Namib: 9 min, £550, 160 conocimiento, 5–8 fragmentos.
- Columbia Británica: 11 min, £750, 225 conocimiento, 6–9 fragmentos.
- Cada yacimiento tiene probabilidades independientes de encontrar dientes, huellas fosilizadas, garras y cráneos.
- Requiere que la región esté desbloqueada. Namib y Columbia Británica también requieren las investigaciones de su continente.
- Se mantiene una campaña simultánea por defecto; **Excavaciones coordinadas** permite dos y +1 fragmento garantizado por campaña. **Laboratorio de fósiles** aumenta 10 puntos porcentuales la probabilidad de huellas y 5 la de garras.
- La excavación no modifica las recompensas de las expediciones, ni los avistamientos, ni el límite automático horario.

### Nuevas piezas, colecciones y esqueletos
- Materiales: **huella fosilizada**, **garra fósil** y **costilla fósil** (esta última se ensambla con 3 fragmentos).
- Reconstrucciones permanentes: **Anquilosaurio** e **Iguanodonte**, con imágenes SVG propias. Las 4 reconstrucciones antiguas permanecen intactas.
- Fichas científicas: **Archivo de pisadas fósiles** y **Estudio de estratos antiguos**, que se catalogan una vez en el Museo.
- Las 6 reconstrucciones de dinosaurios cuentan como piezas del Museo, no como especies zoológicas del Atlas. Las piezas anteriores siguen pudiendo mostrarse o retirarse de las vitrinas.

### Colecciones temáticas y trabajo después del montaje
- **Dinosaurios contrastados:** T. rex + Triceratops → +5 % relativo sobre ingresos de las muestras animales expuestas.
- **Galería de esqueletos:** Estegosaurio + Anquilosaurio + Iguanodonte → +5 % adicional.
- Tras montar al menos una reconstrucción, se habilitan 3 estudios repetibles de conservación (fragmentos, huellas, restauración). Consumen materiales y producen conocimiento, junto con 1–3 puntos permanentes de conservación por estudio.
- Cada punto de conservación agrega 1 % al ingreso del Museo, hasta 20 puntos (+20 %). Después del límite, los estudios siguen aportando conocimiento, no más renta.
- Las bonificaciones de colecciones, conservación, investigaciones y medallón de la Beta 3.16 se suman sin alterar el ingreso base de cada muestra ni el coste de exposición.

### Bestiario
Nueva casilla **«Ocultar especies con monografía publicada»**:
- Apagada por defecto; encendida muestra únicamente especies con `state.published[id]` falso.
- No oculta las especies 5/5 que todavía no tengan monografía publicada.
- Conserva los 3 ordenamientos y el sentido ascendente/descendente.
- Muestra la cantidad visible, sin cambiar el total global de especies identificadas.
- Se conserva en el respaldo y se restaura en la partida.

## Compatibilidad y pruebas
- Sigue la clave local `gran_atlas_v05`, IDs de inventario/colecciones existentes, nombre de paquete Android y formato de respaldo JSON.
- Se añaden campos opcionales dentro de `state.museum`; los guardados antiguos inicializan las nuevas estructuras en cero.
- Las excavaciones en curso se guardan con un identificador y marca de finalización; no se duplican las recompensas.
- Nuevas pruebas en `tests/patch-v317.test.cjs` para excavaciones, tiempos, costos, recompensas, colecciones, recetas, conservación, filtro y restauración de partidas antiguas.

APK de prueba: publicación prerelease `v3.17.0` con archivo `El-Gran-Atlas-Beta-3.17.0-debug.apk`.
