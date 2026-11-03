# El Gran Atlas — Beta 3.14 · Balance ecológico y viaje al Nuevo Mundo

## 1. Presencia y probabilidad de avistamientos
- La probabilidad base de **encontrar algo** se conserva: 50 % en búsqueda manual y 38 % en búsqueda automática, antes de bonificaciones.
- Una vez obtenido un encuentro, las especies disponibles se seleccionan por ponderación de rareza: **Común 12, Poco común 5, Raro 1,8 y Muy rara 0,4**. Son parámetros lúdicos, no estimaciones reales de abundancia.
- Solo pueden seleccionarse especies declaradas para la región y compatibles con el bioma, la hora y la estación elegidos.
- Se amplía la lista de varias regiones africanas con fauna de hábitats compatibles, sin reducir artificialmente sabanas muy diversas ni forzar todas las zonas al mismo tamaño.
- Se añaden tres aves costeras propias del África austral: alcatraz del Cabo (*Morus capensis*), cormorán del Cabo (*Phalacrocorax capensis*) y ostrero africano (*Haematopus moquini*).
- Se corrige la ecología del gato de las arenas (*Felis margarita*): desierto y estepa. Se evita que resulte inaccesible en el Sáhara por la antigua normalización asiática.
- Conserva las **24 zonas africanas** y la cobertura de 154 taxones del Excel base conseguida en 3.13.1.

## 2. Investigaciones encadenadas
1. **Estudios cartográficos de África** (requiere Cartografía de Asia y poseer Mapa de África): £1.200 + 900 conocimiento.
2. **Navegación al Nuevo Mundo** (requiere la investigación africana y poseer Cuadrante transatlántico): £2.200 + 1.800 conocimiento. Habilita expediciones atlánticas para obtener fragmentos.
3. **Cartografía de Norteamérica** (requiere Navegación al Nuevo Mundo y poseer Mapa de Norteamérica): £2.800 + 2.400 conocimiento. Habilita el continente y sus regiones al alcanzar el prestigio acumulado.

**Los mapas y el instrumento se presentan en investigación, pero no se consumen.** Se conserva el acceso a regiones africanas desbloqueadas en partidas anteriores.

## 3. Nuevos objetos y fabricación
- **Cuadrante transatlántico**: 3 piezas de latón antiguo + 2 lentes pulidas + 2 fragmentos de mapa + 1 pergamino antiguo.
- **Parte de mapa de Norteamérica**: 1 fragmento garantizado al completar un Reconocimiento del Atlántico, más posibilidad de hallarlo en botín tras la investigación de navegación.
- **Mapa de Norteamérica**: 8 partes de mapa. Se fabrica desde Inventario → Coleccionables.
- Reconocimiento del Atlántico: requiere Astillero, Cartografía naval II, Navegación al Nuevo Mundo y prestigio 116; dura 720 s antes de bonificaciones, con coste £1.700 y 650 conocimiento. Retorna £2.050 y 850 conocimiento, más una parte garantizada del mapa.

## 4. Primera exploración norteamericana
Se activan **dos hexágonos iniciales** con fauna de `Atlas_Fauna_Hexagonal_209_900_Especies(2).xlsx`:
- **Alaska** (HX-01-05): 17 especies y prestigio mínimo **125**.
- **Columbia Británica** (HX-02-02): 11 especies y prestigio mínimo **128**.

Las otras **12 zonas norteamericanas del Excel** permanecen pendientes de incorporación, en lugar de figurar como si ya estuvieran jugables.

## 5. Compatibilidad y regresiones
- Se conserva la clave local `gran_atlas_v05` y el respaldo JSON `el-gran-atlas-save` versión 1.
- Se mantienen los identificadores de regiones anteriores, avistamientos, equipos, investigaciones previas, expediciones activas y Museo.
- Se añadieron pruebas de la secuencia de tres investigaciones, la posesión (sin consumo) del artefacto y mapas, la apertura condicionada de Alaska, los biomas africanos y las ponderaciones por rareza.
- Las pruebas no reemplazan la verificación manual de una partida avanzada. Antes de instalar una nueva versión Android, exportar el respaldo JSON.

## Nota de diseño
No se iguala el número de especies a un valor fijo por zona: la mayor riqueza de sabanas y selvas frente a islas, desiertos y costas responde al tipo de región, y los avistamientos están condicionados por la ecología.
