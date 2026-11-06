# El Gran Atlas — Beta 3.15.3 · Variantes, sprites y encuentros visuales

## Alcance
Actualización visual y de datos puntual, sin cambiar los costes, requisitos de investigación, probabilidades de avistamiento, fauna geográfica ni las reglas de progreso del juego.

### 1. Nutria europea
- Se corrige la ficha de `nutria_europea` (*Lutra lutra*), que tenía `special:[]`.
- Variantes: **Leucístico**, **Melánico** y **Notable**.
- Las nuevas variantes usan los identificadores y la arquitectura de pieles ya existentes, sin alterar los registros previos.

### 2. Mustélidos
- Se introduce la función SVG común `unifiedFamilySprite` como fuente visual prioritaria para nutrias, tejones, glotones, martas, comadrejas, turones, visones y especies afines, basándose en su género científico.
- Se mantienen diferencias anatómicas: cuerpo acuático y cola alargada en nutrias; cabeza y bandas de tejones; complexión del glotón; silueta estilizada de martas y comadrejas.
- Todas las especies siguen conservando sus colores particulares y compatibilidad con las variantes albinas, melánicas y notables.
- Se corrige la clasificación `salamandra_alpina` a `salamander`, ya que estaba etiquetada erróneamente como mustélido.

### 3. Pangolines
- Se aplica la misma arquitectura de renderizado a los géneros `Manis`, `Smutsia` y `Phataginus`.
- Escamas superpuestas con estética común, diferenciando las proporciones y la cola de los pangolines arborícolas y gigantes.
- El cambio es visual: no modifica hábitats, rareza ni las estadísticas de juego.

### 4. Quebrantahuesos duplicado
- Se detectaron dos identificadores para el taxón *Gypaetus barbatus*: `quebrantahuesos` y `af_quebrantahuesos`.
- Se conserva **`quebrantahuesos`** como identificador canónico y se reemplaza en las listas regionales de África, manteniendo sus apariciones en Europa, Asia y África.
- En la lectura del guardado y la restauración de respaldo se fusionan los datos históricos del ID antiguo: avistamientos (suma), etapas (máximo), descubrimientos, variantes, observaciones de alimentación, cupos automáticos, selección del Cuaderno y registros básicos del Museo.
- No se resta prestigio ni se revocan desbloqueos previos; si una partida tenía las dos entradas registradas, se conserva el progreso consolidado.

### 5. Representación visual de encuentros
- En **Campo**, un encuentro de 2 o 3 especies muestra **2 o 3 sprites al mismo tiempo**, en tarjetas pequeñas con nombre y variantes.
- El censo **×2** y **×3** aparece como un distintivo grande sobre el sprite de cada especie beneficiada, tanto en encuentros individuales como múltiples.
- Se mantiene una versión compatible para resultados anteriores almacenados sin la lista de especies.
- La presentación se adapta a pantallas estrechas y respeta las preferencias de movimiento reducido.
- Cada resultado tiene un número secuencial para asegurar la actualización visual incluso cuando se repite un encuentro con las mismas especies y cantidades.

### 6. Pruebas y compatibilidad
- Pruebas nuevas en `tests/patch-v3153.test.cjs`: variantes de nutria; ausencia de quebrantahuesos duplicado; presencia en tres continentes; migración idempotente del guardado; sprites familiares; presentación gráfica de 1, 2 y 3 especies y multiplicadores.
- Se mantiene la clave local `gran_atlas_v05`, el respaldo JSON y el identificador Android `com.elgranatlas.naturaleza.beta314`.
- Recomendación para Android: respaldar/exportar la partida antes de actualizar la aplicación.

## Fuera de alcance
- Nueva fauna o regiones.
- Cambios de probabilidades o equilibrio.
- Rediseño general de todas las ilustraciones zoológicas o de toda la interfaz.
