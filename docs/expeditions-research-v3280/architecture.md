# Alcance y contratos de la 3.28.0

La capa `AtlasDevelopmentUI` presenta Expediciones e Investigaciones. Los modelos `*3280()` leen las tablas y funciones existentes; no crean rutas, investigaciones ni artículos. Los cambios sobre `app.js` están delimitados por `E-3280` y se comparan con el archivo publicado de 3.27.0 (`71d4f4e`), congelado en el laboratorio. Su SHA-256 es `bd8c672c73002aa034bb91e28e6c4bb6be2ba2ec89768fae6c09547bace642dc`.

## Dos correcciones autorizadas

1. `buyNode()` llama a `canBuy()` antes de gastar o aplicar efectos. Así, además de las validaciones originales, respeta `reqAll`. Los cuatro nodos afectados son `grupos_auto_1`, `censo_auto_1`, `preparacion_fosiles_1` y `relictos_2`. No se retiran compras anteriores ni se alteran requisitos o precios.
2. `finishVoyage()` comprueba que el viaje exista, tenga `endAt` numérico finito y haya vencido. Solo entonces lo retira y resuelve. Una solicitud anticipada o repetida no modifica nada. El flujo automático sigue en `processVoyages()`. Este también rechaza relojes no válidos y conserva trabajos con una fecha no interpretable, sin inventarles un vencimiento ni premiarlos.

La presentación de producción no incluye «Finalizar ahora». La versión anterior del laboratorio conserva su código real, incluido ese control, únicamente en un marco aislado con memoria temporal.

## Observación del resultado, sin nuevos sorteos

El cálculo económico y todas las tiradas de `resolveVoyageReward()` permanecen intactos. Se toma una copia pequeña del inventario antes de ejecutar el motor y se calcula su diferencia después. Los importes de libras y conocimiento se registran desde las variables que el propio motor acaba de aplicar. La muestra dirigida `v.sample`, cuando existe, se separa del resto de los incrementos. Si el sorteo también entrega ese mismo artículo, la unidad extra queda en los hallazgos, no se pierde ni se considera dos veces garantizada.

El historial `voyageHistory` se crea únicamente al producirse un regreso nuevo y conserva los últimos doce resultados. Cada registro contiene `jobId`, `type`, `at`, `money`, `knowledge`, `guaranteed` y `found`. No se reconstruye el botín anterior desde mensajes ambiguos. Los nombres e ilustraciones proceden de `ITEMS` y del motor SVG actual. Abrir detalles o consultar Inventario nunca llama a `rollLoot()` ni vuelve a pagar.

Las previsiones de una ruta usan `voyageMoneyReward()`, `voyageKnowledgeReward()` y `voyageDuration()`. Se indica que corresponden al equipo actual: el motor existente calcula las bonificaciones al regresar, no las congela al zarpar. El listado de hallazgos posibles se deriva de las tablas ponderadas vigentes y las tiradas adicionales existentes, separado de lo recibido y de la muestra garantizada. Las bonificaciones de brújula, collar, morral y gorro se muestran solo cuando el objeto ocupa realmente su ranura.

## Fechas, progreso y tick

Los viajes nuevos reciben `startedAt`, derivado del `endAt` recién creado y la misma duración usada al zarpar. No se añade ese dato retrospectivamente a viajes antiguos. La barra exige un inicio numérico válido anterior a `endAt`; de lo contrario se muestra solo el tiempo restante y la fecha de regreso.

El tick global conserva sus operaciones, velocidades y límites. Un único gancho de presentación actualiza los textos y barras de los viajes visibles y la disponibilidad del proyecto o ruta seleccionados. No reconstruye la pantalla ni recorre los 52 proyectos cada segundo. No genera SVG en esas actualizaciones. La resolución automática conserva el rerender único que ya ocurría cuando regresaban expediciones.

Los datos de interfaz —ruta, filtro, proyecto por rama, posición y desplegables— permanecen en memoria. Se conservan los campos históricos `researchBranch` e `inventoryView` cuando se usan sus flujos normales. Las claves de desplegables de recibos se depuran contra los doce registros vigentes; no crecen con viajes ya descartados del historial.

## Investigación y navegación

El estado de compra se deriva de `canBuy()`, `purchases`, `req`, `reqAll`, el objeto requerido y los límites de cada nodo. Los filtros se aplican sobre los nodos reales de la rama. Un repetible solo cuenta como completado al llegar a su máximo, cuando lo tiene; no se confunde una compra parcial con un proyecto terminado.

Los símbolos de rama son SVG locales decorativos. Solo la ficha seleccionada genera sus materiales ilustrados; las demás investigaciones tienen entradas compactas. El resumen de bonificaciones se construye bajo demanda y utiliza las funciones efectivas de encuentros, censos, velocidad, conocimiento y ponderación, sin llamar al selector aleatorio de encuentros.

Una ruta abre la investigación exacta en su rama y no realiza compras automáticas. El regreso al astillero conserva la ruta y el contexto. Consultar un material abre la sección del Inventario existente y destaca su entrada mediante desplazamiento; no se cambia la presentación ni se crea una copia del objeto.

## Compatibilidad y pruebas históricas

Se mantienen `gran_atlas_v05`, el formato de exportación y todos los IDs. `startedAt` y `voyageHistory` son las únicas adiciones persistentes; la solicitud las autoriza expresamente. Las partidas sin esos datos siguen funcionando, sin reinicio ni migraciones económicas.

Los fixtures históricos no se cambian. Sus comprobaciones de hash eliminan únicamente los bloques nuevos identificados; las nuevas pruebas ejercitan explícitamente las validaciones corregidas. En los ensayos antiguos que comparan cada byte del estado se proyectan solo los dos campos observacionales nuevos, comprobando por separado que no alteren recursos, progreso ni llamadas aleatorias. El caso que antes cobraba inmediatamente se modifica para comprobar rechazo anticipado y resolución normal al vencer el plazo, conservando las mismas recompensas esperadas.

No cambia el catálogo de 710 especies/79 regiones, el mapa, los motores de animales, Museo, Campo, Cuaderno, Bestiario, inventario, economía ni las tablas de botín. El shell generado del laboratorio Atlas solo actualiza metadatos y enlaces de la versión.
