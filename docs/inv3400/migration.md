# Compatibilidad cartográfica 3.40.0

## Tres estados distintos

1. **Mapa fabricado:** inventory contiene el documento y craftedItems acredita la fabricación. Para el Mapamundi se requieren los seis mapas físicos; su ensamblaje no los consume.
2. **Derecho histórico:** cartography3400.historicalAccess indica que una partida anterior ya tenía una investigación, región abierta/visitada o región actual en esa etapa. No crea mapas ni fragmentos. Se conservan prestigio y preparaciones anteriores.
3. **Pendiente en partida nueva:** initialState incluye cartography3400.version=1 sin derechos históricos. Las nuevas investigaciones no generan exenciones al recargar o exportar/importar.

load conserva explícitamente la ausencia del marcador en un guardado antiguo, en vez de confundirla con el valor inicial de una partida nueva. restoreGame pasa también el archivo original a la migración. La normalización construye objetos nuevos sin modificar el archivo de entrada.

## Acreditación y separación

Se reconocen Sudamérica, Oceanía, Polos, mares, profundos y fosas. Una evidencia histórica de una etapa posterior reconoce sus predecesoras, porque esa etapa ya implicaba la cadena continental. Profundidad y fosas se identifican por los índices efectivos del motor, no solo por continent='Océanos'. No se modifica regionUnlocked ni se adjudica una visita adicional.

En una restauración de la misma collectionId se unen los derechos históricos conocidos. Partidas diferentes no los comparten. Un guardado de 3.40 con marcador conserva solo sus derechos ya registrados; completar investigación después no lo transforma en un guardado antiguo.

Los controles de regionRequirementsMet, regionAccessible, setRegion, continentStatus y canBuy incorporan la cartografía. Se conservan la cadena de investigaciones, las preparaciones previas y el prestigio de cada región. El Atlas y la ficha de Investigación explican el mapa o la acreditación histórica.

## Trabajos y transacciones

Los viajes científicos nuevos guardan `cartography: {version:1, parts:{...}}`, calculado al partir sin consumir el RNG previo. Un viaje antiguo sin ese campo termina con sus premios originales. No se hace una tirada al reabrir ni al retornar. Los manifiestos comerciales no cambian.

Los trueques regionales agregan commerce.regionalSeq y commerce.regionalReceipts. No se recortan los recibos; la vista muestra doce. Restaurar la misma partida une recibos y conserva la mayor secuencia; no abona mercancías otra vez. Cada confirmación revalida recursos, acceso y secuencia. Los resultados regionales son coleccionables terminales.

Fabricación, investigación y salidas/resoluciones científicas nuevas utilizan tradeTransaction3300; no hay escrituras intermedias antes de confirmar el estado completo. Los fallos revierten objetos, dinero, conocimiento, trabajos, recibos y evaluación diferida. Un reintento posterior vuelve a pasar por las validaciones reales.

## Evidencia

La batería utiliza fuentes/exportadores de 3.28 (`85f151a`), 3.29 (`07cf5d8`), 3.30 (`33c99b3`), 3.31 (`043a9e5`), 3.32 (`28deed5`), 3.33 (`e060d0f`), 3.34 (`9da9808`), 3.35 (`90fc5c0`), 3.36 (`0e28edf`), 3.37 (`b5286e8`), 3.38 (`45137aa`) y 3.39 (`4496003`). Compara moneda, conocimiento, prestigio, inventario, expediciones, comercio, regiones, ciencia, investigaciones y equipo después de importar y recargar. Hay pruebas adicionales de exportación actual, aislamiento de partidas, respaldo de misma partida, errores de almacenamiento y PWA con 24 h pendientes/90 días offline.

No se agrega una clave de guardado. Se conservan las claves de respaldo y recuperación ya existentes. La PWA copia exactamente gran_atlas_v05 antes de activar el nuevo worker y rechaza activación con otras ventanas abiertas. El laboratorio ejecuta el mismo motor dentro de un iframe sandbox sin mismo origen y sustituye localStorage por memoria: no accede a la partida real.
