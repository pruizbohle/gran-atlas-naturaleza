# ENC-01 · auditoría desde 0e28edf

Sociedad posee 13 SCIENTIFIC_MISSIONS. Sus IDs, condiciones, premios y registros purchases['mission_'+id] se conservan sin cambiar el catálogo ni la función original de recompensa. Se añadirá un envoltorio transaccional para que el guardado fallido revierta el premio. La UI nueva mantendrá accesibles los encargos originales en una categoría propia.

Los 80 achievements y sus criterios permanecen intactos. El sistema nuevo no usa sus medallas como moneda ni concede prestigio. Se reutilizan los contadores fiables de achievements.counters (trade, trade24, market, barter, iniciados en 3.36), y evidence (tipos científicos, métodos profundos, operaciones y evidencia abisal). Los historiales recortados solo prueban eventos presentes; no se convierten en totales históricos inventados. museum.excavationsCompleted y museum.voyagesCompleted son contadores acumulativos existentes.

Estado verificable: discovered, sightings, stages, published, regionsVisited, purchases, craftedItems, inventory, museum.exhibits/collections/relicts. Las regiones se relacionan con sus especies mediante REGIONS; nunca se deduce el continente por el ID. «Estudiar catálogos de regiones visitadas» no se presenta como prueba de haber observado localmente cada especie. Desbloquear no prueba visitar; poseer una herramienta no prueba fabricarla.

No hace falta un contador nuevo de actividad en 3.37: las 24 condiciones propuestas se basan en estado verificable o contadores fiables ya disponibles. Las compras, trueques y retornos comerciales usan la evidencia desde 3.36, indicada en las tarjetas.

Persistencia aditiva propuesta: state.commissions, con satisfechas, listas, reclamadas, avisos mostrados, hasta tres destacadas y recibos originales. Se registra la satisfacción de objetivos incluso cuando un predecesor aún no habilita la recompensa. Así no se pierde un objetivo de materiales consumibles por completar una cadena después. Los premios se reclaman explícitamente y una sola vez.

La importación conservará recibos de premios ya pagados cuando se restaure un respaldo de la misma collectionId, de manera análoga a la protección existente de legendarios. No se mezclan partidas diferentes. Una instalación nueva sin el recibo posterior no puede conocer acciones que no figuran en el respaldo; no se ofrece una garantía entre instalaciones sin historial compartido. Importar reemplaza los demás datos como en 3.36.

Los eventos existentes marcan trabajo pendiente; no habrá un recorrido de misiones en cada tick inactivo. Avisos agrupados de encargos, separados de los achievements; la migración/importación será silenciosa. Atajos solo cambian vistas, nunca viajan, desbloquean, compran ni gastan recursos automáticamente.
