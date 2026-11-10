# El Gran Atlas 3.36.0 — Achievements y renovación de Sociedad

Actúa como desarrollador principal de El Gran Atlas, especialista en videojuegos incrementales, sistemas de logros, arquitectura JavaScript, interfaces móviles y compatibilidad de partidas.

**Repositorio:** `pruizbohle/gran-atlas-naturaleza`  
**Rama base:** `main`  
**Commit de referencia:** `90fc5c0`  
**Versión actual:** 3.35.0 — Consolidación mundial  
**Versión objetivo:** 3.36.0  
**Rama nueva:** `feat/achievements-v3360`

## 1. Objetivo

Implementar un sistema completo de **Achievements (Logros)** integrado en el módulo Sociedad, además de una renovación visual moderada de esa sección.

No crear una nueva pestaña principal en el juego.

No cambiar la identidad artística, navegación global ni arquitectura general.

La versión debe aportar un sistema permanente de reconocimientos que incentive al jugador a explorar los diferentes módulos de El Gran Atlas.

Quiero una actualización funcional, con logros reales, seguimiento, guardado y notificaciones; no solamente tarjetas decorativas.

## 2. Auditar Sociedad antes de modificarla

Actualmente Sociedad contiene:

- Subvenciones.
- Publicaciones.
- Misiones.

El código principal dispone de `renderSociety()`, `renderScientificMissions()` y `SCIENTIFIC_MISSIONS`.

Las misiones actuales almacenan sus recompensas reclamadas en `state.purchases['mission_'+id]`.

**Conservar íntegramente estas funcionalidades y sus datos.**

Los logros serán un sistema independiente de las misiones.

No convertir misiones existentes en logros, no eliminar misiones, no duplicar recompensas y no modificar sus requisitos.

Mantener el acceso a Sociedad desde el menú principal en escritorio y desde «Más» en móvil.

## 3. Nueva organización de Sociedad

La sección debe incorporar cuatro pestañas:

1. 💷 Subvenciones.
2. 📚 Publicaciones.
3. 🎯 Misiones.
4. 🏅 Logros.

Conservar las acciones, cantidades, funcionalidades y datos de las tres pestañas anteriores.

La nueva pestaña Logros debe integrar:

- Contador global de logros obtenidos y disponibles.
- Porcentaje de completitud.
- Categorías y filtros.
- Búsqueda por nombre.
- Filtro de completados, pendientes y secretos.
- Tarjetas de medallas.
- Progreso de cada achievement.
- Descripción y requisitos.
- Fecha de obtención cuando esté disponible.
- Recompensas, si corresponde.
- Reconocimientos destacados.

No recargar toda la interfaz por cada avance de un contador.

## 4. Catálogo inicial de achievements

Crear un catálogo declarativo de aproximadamente **80 logros**, repartidos de esta forma:

| Categoría | Objetivo de cantidad |
|---|---:|
| Exploración y cartografía | 16 |
| Zoología y Cuaderno | 18 |
| Especímenes especiales | 12 |
| Museo y paleontología | 12 |
| Investigación y fabricación | 12 |
| Expediciones y Comercio | 10 |
| **Total** | **80** |

Estos números orientan la distribución. Cada logro debe corresponder a una condición real, alcanzable y comprobable.

No inventar mecánicas que todavía no existan para completar la cantidad.

### Ejemplos de exploración

- Primer viaje fuera de las Islas Británicas.
- Descubrir cinco regiones.
- Desbloquear Asia.
- Llegar a África.
- Desbloquear Norteamérica.
- Explorar Sudamérica.
- Llegar a Oceanía.
- Acceder al Ártico.
- Acceder a la Antártida.
- Desbloquear mares superficiales.
- Realizar una exploración profunda.
- Llegar a una fosa oceánica.
- Desbloquear todas las regiones funcionales.

### Ejemplos zoológicos

- Descubrir la primera especie.
- Descubrir 10, 50, 100, 250, 500 y 900 especies.
- Completar una monografía.
- Publicar diez monografías.
- Conseguir 100 publicaciones.
- Registrar especies de los cuatro grandes grupos del juego.
- Completar colecciones regionales y etapas del Cuaderno.

### Ejemplos de especímenes especiales

- Encontrar el primer espécimen Notable.
- Registrar una variante albina.
- Registrar una variante melánica.
- Descubrir una variante alfa, cuando esté configurada.
- Registrar variantes de distintos grupos animales.
- Completar la quinta etapa de varias especies.

No exigir variantes que no existan en las configuraciones del catálogo.

### Museo

- Instalar la primera exposición.
- Completar exposiciones.
- Catalogar fósiles.
- Reconstruir un dinosaurio.
- Completar relictos.
- Fabricar artefactos.
- Realizar investigaciones paleontológicas.

### Investigación y fabricación

- Completar las primeras investigaciones.
- Dominar determinadas ramas científicas.
- Fabricar instrumentos específicos.
- Completar el equipamiento continental.
- Fabricar herramientas de exploración polar y oceánica.

### Expediciones y Comercio

- Completar la primera expedición científica.
- Completar expediciones de distintas duraciones.
- Realizar un viaje comercial.
- Completar un viaje comercial de 24 horas.
- Realizar compras y trueques.
- Completar sondeos y muestreos profundos.
- Registrar una muestra abisal.

## 5. Categorías de medallas

Proponer cuatro niveles de reconocimiento:

- Bronce.
- Plata.
- Oro.
- Platino.

El nivel debe reflejar la dificultad o importancia del logro, no aumentar artificialmente sus recompensas.

Crear medallas con una estética de insignias científicas del siglo XIX: marcos grabados, motivos botánicos, animales, mapas, libros e instrumentos.

Los logros secretos deben aparecer con nombre y descripción ocultos hasta conseguirse, excepto cuando revelar una pista sea parte explícita del diseño.

Distribuir algunos logros secretos entre las categorías existentes.

No crear condiciones ocultas imposibles o dependientes de comportamientos que el juego no registre.

## 6. Retroactividad y persistencia

Este es un requisito prioritario.

Los usuarios de 3.35.0 ya tienen animales descubiertos, monografías publicadas, regiones visitadas, investigaciones, equipamiento y Museo.

**Los logros que puedan verificarse con los datos actuales deben concederse retroactivamente.**

Auditar y aprovechar contadores existentes, incluidos:

- `state.discovered`
- `state.sightings`
- `state.stages`
- `state.published`
- `state.regionUnlocked`
- `state.regionsVisited`
- `state.purchases`
- `state.craftedItems`
- `state.museum`
- `state.inventory`
- `state.commerce`
- Historial de expediciones y operaciones, si conserva la evidencia necesaria.

No asumir que el historial limitado de expediciones comerciales representa todos los viajes realizados.

Si un logro necesita un contador histórico inexistente, crear un contador acumulativo a partir de 3.36.0, pero **no inventar acciones pasadas**.

En esos casos, especificar que se contabilizará desde la nueva versión.

Diseñar un campo aditivo `state.achievements`, o una estructura equivalente compatible con el código actual, para mantener:

- IDs conseguidos.
- Fechas de desbloqueo disponibles.
- Recompensas reclamadas.
- Notificaciones ya mostradas.
- Contadores acumulativos cuando sean necesarios.

Conservar la clave `gran_atlas_v05` y todas las partidas anteriores.

Las recompensas solo pueden otorgarse una vez, incluso tras recargar, actualizar, importar o restaurar una partida.

Una primera migración con numerosos logros conseguidos debe mostrarse como resumen, no generar decenas de ventanas emergentes.

## 7. Sistema de recompensas

El objetivo principal del logro será el reconocimiento permanente.

Priorizar:

- Medallas.
- Títulos científicos.
- Distintivos.
- Diplomas o reconocimientos dentro de Sociedad.

Permitir destacar un título obtenido en la cabecera o registro de Sociedad, sin necesidad de crear un sistema de perfiles nuevo.

Un número limitado de logros destacados puede otorgar libras, conocimiento o materiales modestos.

No entregar prestigio automáticamente ni crear grandes bonificaciones pasivas.

No alterar probabilidades globales, economía, costes de expediciones ni ingresos del Museo.

Si existe recompensa reclamable, mostrar su estado claramente y garantizar que no pueda reclamarse dos veces.

## 8. Notificación de logro desbloqueado

Cuando se consiga un achievement nuevo, mostrar una notificación breve y elegante.

Propuesta:

🏅 Logro desbloqueado

**Explorador de los cinco continentes**

Has alcanzado un nuevo reconocimiento científico.

La notificación debe:

- Aparecer sin interrumpir la partida.
- Desaparecer automáticamente.
- No ocultar botones críticos en móvil.
- Permitir abrir Sociedad → Logros.
- No repetirse cada vez que se renderiza la interfaz.
- No reproducirse al importar logros ya obtenidos.

Priorizar animaciones discretas y compatibles con preferencias de movimiento reducido.

No añadir sonidos obligatorios.

## 9. Renovación visual moderada de Sociedad

La apariencia actual de Sociedad es funcional pero sencilla.

Realizar un retoque exclusivamente en esta sección.

**Cambios deseados:**

### Cabecera

Crear una presentación más cuidada de «Real Sociedad de Historia Natural».

Mantener la ambientación de 1842, la paleta verde, pergamino y detalles dorados.

Agregar un pequeño bloque de reconocimiento científico con datos reales del jugador: descubrimientos, publicaciones, prestigio y logros obtenidos.

### Navegación

Homologar visualmente las cuatro pestañas.

Usar botones compactos, iconografía clara, estado activo distinguible y buen comportamiento en móvil.

No introducir un menú horizontal que obligue a desplazarse excesivamente para encontrar Logros.

### Tarjetas

Renovar las tarjetas de Sociedad con:

- Mejor jerarquía de títulos.
- Fondos suaves.
- Separadores discretos.
- Bordes históricos.
- Espaciado uniforme.
- Botones de acción claros.
- Barras de progreso compactas.

### Misiones

Aplicar el mismo estilo a las misiones existentes.

Mostrar mejor el progreso, pero **sin modificar sus condiciones ni recompensas**.

### Publicaciones y Subvenciones

Homologar su presentación, manteniendo todas las operaciones.

No rediseñar el resto del juego ni cambiar sus módulos.

La renovación debe sentirse como un refinamiento de la Sociedad existente, no como una interfaz completamente diferente.

## 10. Arquitectura

Evitar agregar un bloque monolítico de cientos de líneas al archivo principal si puede mantenerse una arquitectura modular.

Evaluar crear:

- `www/js/achievements-v3360.js` para catálogo y reglas.
- `www/js/society-achievements-ui-v3360.js` para la presentación.
- `www/css/society-v3360.css` para estilos exclusivos.

Los nombres pueden adaptarse a las convenciones reales del proyecto.

Integrar el sistema con el motor existente, sin duplicar estado ni implementar un segundo guardado.

Mantener funciones de cálculo independientes de las funciones que entregan recompensas.

No ejecutar mutaciones de estado al renderizar una tarjeta.

Evitar comprobaciones completas de 80 logros en cada tick si puede usarse evaluación selectiva o eventos ya disponibles.

## 11. Pruebas obligatorias

Verificar:

- Catálogo de logros válido y sin IDs repetidos.
- Cada condición alcanzable con el juego real.
- Reconocimiento retroactivo desde 3.35.0.
- Logros nuevos persistentes.
- Contadores acumulativos sin duplicación.
- Recompensas únicas.
- Logros secretos correctamente ocultos.
- Notificaciones sin repetición.
- Compatibilidad con las misiones existentes.
- Subvenciones y publicaciones funcionales.
- Importación/exportación de partidas antiguas.
- Funcionamiento offline.
- Actualización PWA 3.35.0 → 3.36.0.
- Sin regresiones en las 945 especies, 113 regiones y 1.744 presencias.
- Pantallas de 320, 360, 390, 412 y 1280 px.
- Rendimiento y navegación táctil.

Mantener separadas las pruebas históricas y las pruebas del runtime actual.

## 12. Etapas de desarrollo

**ACH-01:** auditoría de contadores, definición del catálogo y diseño de persistencia.

**ACH-02:** lógica de achievements, retroactividad, recompensas y tests.

**ACH-03:** pestaña Logros, medallas, búsqueda, filtros y notificaciones.

**ACH-04:** renovación visual breve de Sociedad y adaptación móvil.

**ACH-05:** pruebas de regresión, compatibilidad, documentación y publicación.

Realizar commits independientes, verificando cada etapa antes de continuar.

## 13. Publicación

Una vez validado:

1. Actualizar el juego a 3.36.0.
2. Crear `README_V3360.md`.
3. Documentar los achievements y las reglas de retroactividad.
4. Crear un laboratorio visual o página de pruebas aislada, sin alterar partidas reales.
5. Generar PWA actualizable con respaldo.
6. Integrar en `main`.
7. Ejecutar GitHub Actions.
8. Comprobar que GitHub Pages sirve la nueva versión.
9. Validar hashes de recursos publicados.
10. Entregar enlaces comprobados de juego, actualización y laboratorio.

Mantener Android y la firma permanente como proyecto independiente.

No agregar especies, regiones, investigaciones nuevas o grandes mecánicas económicas.

## Resultado esperado

Una **Sociedad renovada** con cuatro pestañas y aproximadamente 80 achievements funcionales, permanentes y retroactivos cuando los datos existentes lo permitan.

Los jugadores deben recibir reconocimiento por lo que ya han conseguido y nuevos objetivos a largo plazo.

El sistema debe quedar preparado para ampliarse posteriormente con encargos adicionales y colecciones del Museo, sin mezclar los conceptos de misión y logro.

**Comienza con ACH-01, auditando el código real de Sociedad y los contadores disponibles. Después continúa las etapas hasta publicar 3.36.0, siempre que sus pruebas sean satisfactorias.**