# El Gran Atlas 3.37.0 — Encargos del naturalista y evolución de Sociedad

Actúa como desarrollador principal de El Gran Atlas, especialista en videojuegos incrementales, sistemas de misiones, JavaScript, diseño de interfaces móviles y persistencia offline.

**Repositorio:** `pruizbohle/gran-atlas-naturaleza`
**Rama base:** `main`
**Commit de referencia:** `0e28edf`
**Versión base:** 3.36.0
**Nueva rama:** `feat/encargos-v3370`
**Versión objetivo:** 3.37.0

## 1. Objetivo principal

Mejorar significativamente el sistema **Misiones** de la Real Sociedad de Historia Natural.

La versión 3.36.0 incorporó 80 achievements, cuatro pestañas de Sociedad y una presentación visual renovada.

Ahora queremos desarrollar la jugabilidad de Misiones, con encargos científicos organizados, objetivos claros, recompensas proporcionadas y seguimiento de progreso.

No crear un módulo independiente.

El resultado debe integrarse en **Sociedad → Misiones**, aprovechando la arquitectura y el diseño de 3.36.0.

Implementar el sistema completo. No limitarse a entregar documentación.

## 2. Auditar el sistema existente

Antes de modificar, revisar:

- `SCIENTIFIC_MISSIONS`.
- `renderScientificMissions()`.
- `claimScientificMission()`.
- Los 13 encargos originales.
- `state.purchases['mission_'+id]`.
- `www/js/achievements-v3360.js`.
- `www/js/society-achievements-ui-v3360.js`.
- `www/css/society-v3360.css`.
- El guardado `gran_atlas_v05`.

Conservar las 13 misiones originales, sus identificadores, condiciones, recompensas y estados de reclamación.

No conceder sus recompensas nuevamente a quienes ya las reclamaron.

No modificar los 80 achievements ni sus criterios.

No convertir los logros en misiones duplicadas.

## 3. Nueva estructura: tablón de encargos

Renovar la pestaña Misiones, conservando el estilo de Sociedad de 3.36.0.

Crear un tablón de encargos científicos con:

- Resumen de misiones completadas y disponibles.
- Misiones activas o recomendadas.
- Recompensas pendientes de reclamar.
- Historial de misiones completadas.
- Categorías de encargos.
- Progreso visible de cada misión.
- Descripción clara de requisitos.
- Navegación al módulo relacionado.
- Indicadores de disponibilidad y bloqueo.

Permitir destacar hasta tres encargos para seguir su progreso.

Destacar un encargo no debe impedir avanzar en los demás.

Las misiones seguirán progresando automáticamente cuando se realicen sus actividades, aunque no estén destacadas.

No obligar al jugador a activar manualmente una misión que dependa de acciones irrepetibles.

## 4. Catálogo nuevo: aproximadamente 24 encargos

Crear 24 misiones nuevas, distribuidas en seis líneas temáticas de cuatro encargos cada una.

La lista es orientativa: ajustar los requisitos según las mecánicas reales del motor.

### Línea A — Primeros estudios

Objetivos tempranos destinados a familiarizar al jugador con los distintos sistemas.

Ejemplos:

- Registrar nuevas especies.
- Completar etapas iniciales del Cuaderno.
- Publicar estudios científicos.
- Realizar un encargo básico de exploración.

Evitar repetir literalmente las misiones originales de diez especies, primera publicación y 50 avistamientos.

### Línea B — Expediciones del mundo

Encargos sobre exploración geográfica y trabajo de campo.

Ejemplos:

- Investigar fauna de dos regiones diferentes.
- Visitar y estudiar nuevos sectores.
- Realizar expediciones científicas de distintos tipos.
- Completar una pequeña serie de exploración continental.

Utilizar los datos geográficos reales, no inferir continentes por prefijos de ID.

### Línea C — Museo y paleontología

Encargos sobre las mecánicas ya existentes del Museo.

Ejemplos:

- Preparar muestras para exposición.
- Completar una colección.
- Realizar una excavación.
- Fabricar o reunir componentes para un montaje paleontológico.

No repetir las misiones de prospección paleontológica existentes.

### Línea D — Instituto y fabricación

Encargos vinculados con investigación y creación de herramientas.

Ejemplos:

- Completar una investigación de una rama específica.
- Fabricar un instrumento científico.
- Preparar un conjunto de materiales.
- Completar una cadena breve de estudios.

No exigir objetos inaccesibles ni volver a consumir los instrumentos permanentes de progresión continental.

### Línea E — Navegación y Comercio

Encargos relacionados con expediciones científicas y comerciales.

Ejemplos:

- Completar una ruta científica.
- Finalizar una ruta comercial.
- Conseguir suministros mediante Comercio.
- Realizar una actividad de intercambio.

Los contadores comerciales deben partir de la información fiable disponible desde 3.36.0.

No inventar viajes anteriores a partir de historiales truncados.

No utilizar fechas o plazos reales como requisito obligatorio.

### Línea F — Especializaciones y ambientes extremos

Encargos de progresión avanzada.

Ejemplos:

- Estudiar especies de distintas categorías zoológicas.
- Registrar un espécimen especial permitido por su configuración.
- Completar un sondeo profundo.
- Registrar evidencia científica en una región abisal.

Los encargos deben corresponder a acciones realmente posibles y ecológicamente válidas.

No exigir albinismo, melanismo u otra variante en especies donde no exista.

## 5. Cadenas de encargos

Incorporar pequeñas cadenas de dos a cuatro misiones cuando tenga sentido.

Ejemplo de secuencia:

1. Registrar fauna de un nuevo territorio.
2. Completar una etapa de estudio.
3. Publicar una monografía.
4. Incorporar un ejemplar al Museo.

Cada misión tiene recompensa propia.

Una cadena completada puede entregar un reconocimiento adicional o una recompensa final pequeña.

No duplicar los 80 achievements existentes ni utilizar sus medallas como una segunda moneda.

Los nuevos encargos no pueden bloquear los continentes ni las regiones principales.

Si una misión se desbloquea después de que el jugador realizó una acción irrepetible, reconocer la evidencia histórica disponible o definir un objetivo alternativo alcanzable.

## 6. Recompensas y equilibrio

Las misiones originales conservan exactamente sus premios.

Para las nuevas misiones, priorizar:

- Libras.
- Conocimiento.
- Materiales de fabricación.
- Objetos comunes del inventario.

Las recompensas deben estar proporcionadas al esfuerzo y a la fase de progresión.

Una misión básica no debe entregar una cantidad enorme de dinero.

Una misión avanzada debe ofrecer una recompensa apropiada, sin sustituir las fuentes principales de ingresos.

No entregar prestigio directamente.

No modificar las tasas de avistamiento, probabilidades de especímenes, ingresos pasivos del Museo ni recompensas comerciales.

Auditar las 24 recompensas como conjunto, comparando su impacto económico con la situación 3.36.0.

Cada premio debe poder reclamarse una sola vez.

Las transacciones deben tener protección contra errores de guardado y evitar duplicaciones al recargar o importar partidas.

## 7. Progreso histórico y nuevas actividades

Separar dos clases de requisitos:

**Estado verificable:** especies descubiertas, monografías, regiones visitadas, investigaciones adquiridas, instrumentos fabricados y colecciones existentes.

**Eventos acumulativos nuevos:** operaciones o transacciones que carecen de contador histórico completo.

Para los requisitos verificables, reconocer el progreso previo.

Para los eventos sin evidencia fiable, comenzar a contabilizar desde 3.37.0 y señalarlo claramente.

Aprovechar los contadores ya existentes en `state.achievements` cuando representen correctamente la actividad necesaria.

No crear registros duplicados del mismo evento.

No asumir que una región desbloqueada ya fue visitada.

No asumir que poseer un instrumento demuestra que fue fabricado.

No inventar fechas históricas.

Las misiones cumplidas y reclamadas deben permanecer registradas aun si cambia posteriormente el inventario o la exposición del Museo.

## 8. Interfaz y experiencia de usuario

Mantener el diseño de Sociedad de 3.36.0 y mejorar únicamente la presentación de Misiones.

Organizar el contenido de forma compacta y clara.

Propuesta de filtros:

- Disponibles.
- En progreso.
- Para reclamar.
- Completadas.

Incorporar filtros por temática cuando resulte útil.

Cada tarjeta debe mostrar:

- Icono de la categoría.
- Nombre del encargo.
- Descripción breve.
- Requisito o progreso actual.
- Barra de avance.
- Recompensa.
- Botón para reclamar o consultar.
- Acceso al módulo pertinente.

Las misiones completadas deben quedar archivadas visualmente para no saturar el tablón.

Incorporar un pequeño indicador en la pestaña Misiones cuando existan recompensas pendientes, sin introducir notificaciones intrusivas.

En móvil, priorizar tarjetas verticales y navegación accesible a 320 y 360 píxeles.

No modificar la navegación principal ni el menú inferior.

## 9. Atajos a los módulos

Cuando un encargo requiera una acción específica, permitir un botón contextual:

- Ir a Campo.
- Ir al Cuaderno.
- Ir al Museo.
- Ir a Investigación.
- Ir a Expediciones.
- Ir al Inventario.
- Ir al Atlas.

Reutilizar la navegación existente.

No crear rutas que apunten a pantallas inexistentes.

No modificar automáticamente los recursos o decisiones del jugador al utilizar un atajo.

Si el encargo corresponde a una región particular, mostrar una opción para localizarla en el Atlas cuando el motor admita esa acción de forma segura.

## 10. Notificaciones

Implementar avisos discretos cuando un nuevo encargo esté listo para reclamar.

No mostrar avisos continuamente por cada avistamiento.

Agrupar las misiones que se completen simultáneamente.

La reclamación de premios debe seguir siendo una acción explícita del usuario.

Evitar avisos repetidos después de recargar o importar.

Respetar las preferencias de movimiento reducido.

Mantener separados los avisos de misiones y los achievements de 3.36.0.

## 11. Arquitectura técnica

Preferir una estructura modular:

- Definiciones declarativas de misiones.
- Funciones puras de evaluación de progreso.
- Control independiente de reclamación de premios.
- UI de encargos dentro de Sociedad.
- Estilos exclusivos de esa sección.

Reutilizar eventos y datos existentes del motor.

Evitar recorrer todas las misiones en cada tick inactivo.

Conservar los registros anteriores y añadir campos nuevos de manera compatible.

El estado debe poder exportarse e importarse mediante el sistema actual.

No modificar la clave de guardado `gran_atlas_v05`.

Preservar los 80 logros y los títulos destacados del jugador.

## 12. Alcance excluido

No implementar todavía:

- Misiones diarias o semanales.
- Temporizadores de vencimiento.
- Rachas de conexión.
- Objetivos que obliguen a conectarse periódicamente.
- Nuevos continentes o especies.
- Una nueva moneda.
- Pase de temporada.
- Rangos de membresía pagados.
- Cambios generales en la economía.

El sistema debe funcionar offline, sin presión para entrar diariamente.

## 13. Pruebas y validación

Verificar:

1. Conservación de las 13 misiones originales y sus recompensas.
2. Aproximadamente 24 encargos nuevos, sin IDs duplicados.
3. Todas las condiciones alcanzables mediante el juego real.
4. Cadenas de misiones funcionales.
5. Reconocimiento retroactivo solo con evidencia suficiente.
6. Persistencia de progreso y reclamaciones.
7. Ausencia de recompensas duplicadas.
8. Compatibilidad con partidas 3.35.0 y 3.36.0.
9. Integridad de los 80 achievements.
10. Ninguna regresión en subvenciones y publicaciones.
11. Navegación contextual a los módulos.
12. Funcionamiento offline.
13. Compatibilidad con viajes comerciales y operaciones profundas pendientes.
14. UI a 320, 360, 390, 412 y 1280 píxeles.
15. Sin errores de JavaScript ni desbordamientos.
16. Rendimiento de Sociedad con todas las misiones disponibles.

Mantener las 945 especies, 113 regiones y 1.744 presencias.

Partir de las 524 pruebas aprobadas en 3.36.0, diferenciando las suites históricas y las pruebas actuales.

No editar pruebas anteriores para forzar resultados favorables.

## 14. Etapas de desarrollo

Realizar commits independientes:

**ENC-01:** auditar las misiones existentes, eventos y contadores.

**ENC-02:** crear el catálogo nuevo, las cadenas y la lógica de progreso.

**ENC-03:** incorporar persistencia y reclamación segura de recompensas.

**ENC-04:** renovar el tablón de Misiones, filtros, progreso y navegación contextual.

**ENC-05:** ejecutar pruebas de jugabilidad, equilibrio y regresión.

**ENC-06:** preparar versión 3.37.0, PWA y publicación.

Continuar automáticamente entre etapas cuando las verificaciones lo permitan.

No sustituir el desarrollo por un plan documental.

## 15. Publicación

Cuando el sistema esté completo y validado:

- Actualizar el juego a 3.37.0.
- Crear `README_V3370.md`.
- Documentar los encargos nuevos y sus recompensas.
- Crear un laboratorio de Misiones con una partida aislada, sin modificar el progreso real.
- Preparar actualización PWA con respaldo.
- Integrar los cambios en `main`.
- Ejecutar GitHub Actions.
- Verificar que el juego publicado corresponda a 3.37.0.
- Confirmar los hashes de los recursos publicados.
- Comprobar navegación y funcionamiento offline en navegador.

No construir APK Android ni modificar su firma permanente.

Entregar enlaces comprobados del juego, actualizador, laboratorio e informe.

## Resultado esperado

La pestaña Misiones debe transformarse en un tablón de encargos más completo y entretenido, conectado con todas las mecánicas relevantes del juego.

Conservar las 13 misiones originales y añadir aproximadamente 24 encargos nuevos para ofrecer objetivos durante toda la progresión.

Los achievements continúan siendo reconocimientos permanentes; las misiones ofrecen actividades concretas y recompensas limitadas.

La actualización debe mantener intactas las partidas, evitar duplicaciones de premios y respetar la identidad visual de Sociedad.

**Comienza ejecutando ENC-01 y continúa hasta completar 3.37.0, si todas las verificaciones necesarias son satisfactorias.**