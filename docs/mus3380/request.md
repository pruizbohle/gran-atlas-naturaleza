# El Gran Atlas 3.38.0 — Museo avanzado y exposiciones temáticas

Actúa como desarrollador principal de El Gran Atlas, especialista en videojuegos incrementales, museología, JavaScript, interfaces móviles y compatibilidad de partidas.

**Repositorio:** `pruizbohle/gran-atlas-naturaleza`  
**Base:** `main`, versión 3.37.0  
**Commit de referencia:** `b5286e8`  
**Rama nueva:** `feat/museo-avanzado-v3380`  
**Versión objetivo:** 3.38.0

## 1. Objetivo

Potenciar la jugabilidad del Museo mediante un sistema de **exposiciones temáticas y proyectos curatoriales**, aprovechando las piezas y mecanismos existentes.

No reconstruir el Museo desde cero.

Actualmente tiene cinco salas:

1. Exposiciones.
2. Muestras.
3. Fósiles.
4. Relictos.
5. Artefactos.

Conservar exactamente estas cinco salas.

Queremos que coleccionar animales, montar dinosaurios, investigar relictos y fabricar artefactos tenga un propósito adicional: organizar colecciones científicas de carácter histórico.

## 2. Auditoría obligatoria

Antes de programar, revisar:

- `www/js/museum-ui-v3270.js`
- `www/css/museum-v3270.css`
- Funciones y catálogos del Museo en `www/js/app.js`
- `README_V3270.md`
- `README_V3350.md`
- `README_V3360.md`
- `README_V3370.md`
- Los 80 achievements actuales.
- Las 37 misiones existentes.
- Guardados y migraciones desde 3.28.0 hasta 3.37.0.

Confirmar las reglas existentes:

- Capacidad animal: 3, 7 y 12 vitrinas.
- Ocho reconstrucciones paleontológicas.
- Nueve relictos.
- Cinco artefactos.
- Sistema de conservación hasta 20 puntos.
- Bonificaciones ya implementadas por conjuntos científicos.
- Ingresos actuales del Museo.
- Historial de excavaciones y prospecciones.

No duplicar funcionalidades que ya están implementadas.

## 3. Exposiciones temáticas

Crear un nuevo apartado dentro de **Museo → Exposiciones**, sin añadir una sexta sala.

Proponer inicialmente entre ocho y doce proyectos curatoriales.

Ejemplos temáticos:

- Fauna de las Islas Británicas.
- Aves del mundo.
- Grandes depredadores.
- Fauna de la sabana africana.
- Biodiversidad de Asia.
- Animales de territorios insulares.
- Mamíferos marinos.
- Vida polar.
- Secretos de las profundidades.
- Historia de los grandes reptiles.
- Linajes antiguos y relictos.
- Instrumentos de las grandes expediciones.

**Estos son temas propuestos, no requisitos zoológicos cerrados.**

Comprobar el catálogo real antes de fijar cada colección. Elegir agrupaciones científicamente coherentes y alcanzables.

No añadir especies, regiones, fósiles ni artefactos nuevos para completar los proyectos.

## 4. Funcionamiento de una exposición

Una exposición temática será un proyecto curatorial con requisitos concretos.

Puede requerir una combinación de:

- Animales descubiertos.
- Monografías publicadas.
- Especies expuestas en vitrinas.
- Reconstrucciones paleontológicas.
- Relictos catalogados.
- Artefactos fabricados.
- Investigaciones realizadas.

Distinguir explícitamente entre:

- Especie descubierta.
- Monografía terminada.
- Muestra disponible para exponer.
- Muestra actualmente expuesta.
- Pieza científica catalogada.

No contar una especie descubierta como si ya tuviera una muestra preparada.

Las exposiciones deben comprobar el inventario y las condiciones reales del jugador.

Una vez completado un proyecto curatorial, registrar permanentemente su acreditación, sin exigir mantener eternamente la misma distribución de vitrinas.

Diferenciar entre **proyecto completado** y **montaje actualmente exhibido**.

Las piezas científicas mantienen sus espacios independientes y no consumen vitrinas animales.

No superar la capacidad histórica de 3/7/12 vitrinas.

## 5. Ejemplo de proyecto

**Exposición: Historia de las aves**

Requisitos posibles:

- Tener tres monografías de aves publicadas.
- Colocar dos aves compatibles en las vitrinas zoológicas.
- Completar una investigación relacionada con aves.

Recompensa propuesta:

- Diploma curatorial.
- Registro permanente de exposición completada.
- Una cantidad moderada de conocimiento, si el análisis económico lo justifica.

No entregar grandes bonificaciones pasivas.

No convertir el proyecto en un achievement duplicado: la exposición es una actividad curatorial que requiere organizar las piezas.

## 6. Presentación visual

Renovar moderadamente la pantalla de Exposiciones, conservando el estilo de 1842.

Quiero un Museo que se perciba como una institución científica en crecimiento.

Agregar:

- Una cabecera con nivel de galería, capacidad, ingresos y proyectos completados.
- Tarjetas de exposiciones temáticas.
- Indicadores visuales de progreso.
- Pequeñas placas o diplomas.
- Requisitos disponibles y pendientes.
- Acceso a las piezas necesarias.
- Vista de la exposición completada.
- Registro histórico de exposiciones acreditadas.

Mantener las vitrinas actuales, sus imágenes SVG y las fichas interactivas.

La vista debe permitir distinguir rápidamente las piezas que el jugador puede utilizar para completar cada exposición.

En móvil, evitar crear una pantalla excesivamente larga. Utilizar secciones plegables, filtros y tarjetas compactas.

No modificar la navegación global.

## 7. Selección de piezas

Cuando una exposición requiera muestras zoológicas, permitir consultar qué animales disponibles cumplen sus requisitos.

Ofrecer atajos a:

- Muestras.
- Cuaderno.
- Bestiario.
- Fósiles.
- Relictos.
- Artefactos.
- Investigación.

No ejecutar automáticamente compras, fabricación, retiros de vitrinas ni consumo de materiales.

El jugador debe conservar el control de la composición de su Museo.

Reutilizar las fichas, ilustraciones y controles existentes.

No recalcular ni dibujar las 945 especies simultáneamente.

## 8. Colecciones científicas y Museo

Integrar las exposiciones con las mecánicas existentes sin duplicarlas.

### Fósiles

Las reconstrucciones montadas pueden contribuir a exposiciones temáticas.

Mantener las ocho reconstrucciones y sus recetas.

No consumir esqueletos ya fabricados.

### Relictos

Los nueve expedientes actuales pueden contribuir a exposiciones sobre linajes antiguos y biodiversidad singular.

Mantener sus tres indicios, prospecciones, análisis y bonificaciones originales.

### Artefactos

Los cinco artefactos actuales pueden formar exposiciones sobre historia de la exploración.

Conservar materiales, recetas y acreditación de fabricación.

### Conservación

Reutilizar el registro y los proyectos de conservación existentes.

Evitar crear una segunda moneda de conservación o modificar el máximo actual sin justificación.

## 9. Recompensas y equilibrio

La auditoría mundial GM-05 detectó que el Museo puede dominar los ingresos de libras.

Por lo tanto, **no añadir automáticamente más multiplicadores permanentes de renta**.

Priorizar recompensas curatoriales:

- Diplomas.
- Placas.
- Sellos institucionales.
- Registro histórico de exhibiciones.
- Mejor presentación visual de la institución.

Si se proponen recompensas de conocimiento o materiales, que sean únicas, moderadas y verificadas mediante simulación.

No entregar prestigio directamente.

No modificar la renta base de muestras, los costos de ampliación, las bonificaciones de relictos o las tasas de hallazgo.

La actualización debe enriquecer la jugabilidad sin provocar inflación económica.

## 10. Integración con Sociedad

Conservar los 80 logros de 3.36.0 y las 37 misiones de 3.37.0.

Permitir consultar un proyecto curatorial desde las misiones relacionadas con el Museo.

No cambiar los requisitos ni los premios de las misiones existentes.

No añadir achievements nuevos en esta etapa, salvo correcciones indispensables de compatibilidad.

El Museo tendrá proyectos curatoriales propios, distintos de los logros permanentes y los encargos de Sociedad.

Los tres sistemas deben complementarse, no duplicarse.

## 11. Retroactividad y guardado

Mantener `gran_atlas_v05`.

Guardar la información nueva de forma aditiva dentro del estado del Museo, por ejemplo:

- ID de proyecto curatorial.
- Requisitos acreditados.
- Estado de completitud.
- Fecha conocida de finalización.
- Diplomas obtenidos.
- Exposición destacada, si corresponde.

No inventar fechas históricas.

Si una partida de 3.37.0 ya cumple los requisitos verificables de una exposición, reconocerla retroactivamente.

No inferir que una pieza estuvo exhibida en el pasado si el guardado únicamente demuestra que está catalogada.

No eliminar ni reiniciar:

- Muestras expuestas.
- Capacidad de galería.
- Reconstrucciones.
- Fósiles.
- Relictos.
- Artefactos.
- Ingresos.
- Conservación.
- Excavaciones pendientes.
- Investigaciones.
- Logros.
- Misiones.
- Recursos económicos.

Garantizar que cambiar de exposición no duplique recompensas ni altere la propiedad de las piezas.

## 12. Arquitectura y rendimiento

Preferir una implementación modular.

Posibles archivos:

- `www/js/museum-curation-v3380.js`
- `www/js/museum-curation-ui-v3380.js`
- `www/css/museum-curation-v3380.css`

Adaptar nombres a las convenciones reales del repositorio.

Separar:

- Definición de proyectos.
- Validación de requisitos.
- Registro de acreditaciones.
- Interfaz.
- Persistencia.

No duplicar un catálogo de animales.

No recalcular todos los proyectos en cada tick inactivo.

Mantener el renderizado diferido de SVG y paginación de Muestras.

## 13. Pruebas obligatorias

Verificar:

1. Las cinco salas originales funcionan.
2. Los proyectos curatoriales son alcanzables.
3. La capacidad de vitrinas se respeta.
4. Una misma pieza no genera propiedad duplicada.
5. Los proyectos se acreditan una sola vez.
6. Los estados retroactivos son correctos.
7. Las recompensas no se duplican.
8. La renta del Museo mantiene sus reglas.
9. Las ocho reconstrucciones anteriores permanecen intactas.
10. Los nueve relictos conservan sus progresos.
11. Los cinco artefactos conservan sus recetas.
12. Los 80 achievements no cambian.
13. Las 37 misiones no cambian.
14. Importación/exportación histórica compatible.
15. Excavaciones y prospecciones pendientes compatibles.
16. Funcionamiento offline.
17. Pantallas de 320, 360, 390, 412 y 1280 px.
18. Sin desbordamiento ni errores JavaScript.
19. Rendimiento de Museo con 945 especies disponibles.
20. Actualización PWA 3.37.0 → 3.38.0 con respaldo exacto.

Partir de la línea de 540 pruebas reportadas en 3.37.0, diferenciando las históricas de las actuales.

No modificar expectativas anteriores únicamente para que las pruebas pasen.

## 14. Etapas

**MUS-01:** auditoría del Museo y definición de proyectos posibles.

**MUS-02:** catálogo y lógica de exposiciones temáticas.

**MUS-03:** registro persistente, retroactividad y acreditaciones.

**MUS-04:** integración visual en Exposiciones y accesos a piezas.

**MUS-05:** pruebas de jugabilidad, economía, rendimiento y compatibilidad.

**MUS-06:** publicación 3.38.0 y validación web.

Realizar commits separados y continuar automáticamente cuando cada etapa esté validada.

## 15. Publicación

Al terminar:

- Actualizar a 3.38.0.
- Crear `README_V3380.md`.
- Documentar cada exposición, sus requisitos y reconocimiento.
- Crear laboratorio aislado de Museo con escenarios iniciales y avanzados.
- Preparar actualización PWA con respaldo.
- Integrar en `main`.
- Ejecutar GitHub Actions.
- Verificar la versión publicada.
- Confirmar hashes de los recursos web.
- Probar navegación, exposiciones y guardado offline.

Entregar enlaces comprobados del juego, actualizador, laboratorio e informe.

No generar APK Android debug ni modificar la firma permanente.

No ampliar fauna, mapa o economía global.

## Resultado esperado

El Museo conserva sus cinco salas, vitrinas y piezas, pero adquiere una nueva capa de jugabilidad: **organizar exposiciones temáticas de historia natural**.

Los proyectos deben dar un motivo para estudiar especies, publicar monografías, preparar muestras y combinar los hallazgos científicos de distintas expediciones.

La actualización debe aportar profundidad y objetivos a largo plazo sin sobrecargar la interfaz ni desequilibrar la economía.

**Comienza por MUS-01 y ejecuta las etapas hasta completar y verificar 3.38.0.**