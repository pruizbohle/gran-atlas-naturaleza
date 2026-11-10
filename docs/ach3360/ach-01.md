# ACH-01 · auditoría y diseño desde 90fc5c0

Sociedad conserva 13 misiones (`SCIENTIFIC_MISSIONS`), sus condiciones, premios y registros `purchases['mission_'+id]`. Subvenciones, canjes y publicaciones siguen siendo operaciones del motor actual. No se crea otra pestaña principal.

Catálogo declarativo: 80 reconocimientos, distribuidos 16/18/12/12/12/10. Las medallas y los cinco títulos son cosméticos: no entregan libras, conocimiento, materiales ni prestigio. Así no se introduce una segunda fuente de recompensas ni se altera el balance. No se exige «Alfa»: se usan los nombres y variantes realmente configurados (Notable, Albino, Melánico, Épico, Excepcional, Legendario).

Evidencia retroactiva: discovered, published, stages, regionsVisited, regionUnlocked, purchases, craftedItems, specialFound/specialCounts/legendaryFound, museum.exhibits/collections/relicts, museum.voyagesCompleted y paleoTier. La tenencia actual de una herramienta no prueba haberla fabricado: se exige craftedItems. Una región desbloqueada no prueba haberla visitado. La primera región no concede «primer viaje».

Los historiales científicos, comerciales y profundos se recortan a 12 registros. Los tipos científicos y protocolos profundos conservados prueban existencia, no totales históricos. Se preserva esa evidencia en conjuntos acumulativos desde la migración; no se inventan los elementos descartados. El contador científico existente museum.voyagesCompleted sí es acumulativo desde su introducción y se utiliza como tal.

Los totales comerciales, compras y trueques carecen de contador fiable previo: empiezan en cero desde 3.36.0, con texto explícito. No se suman historiales truncados. Los trabajos antiguos pendientes que regresen bajo 3.36 sí cuentan cuando se resuelven efectivamente.

Persistencia aditiva en state.achievements bajo gran_atlas_v05: version, unlocked (earnedAt, observedAt, retroactive), notified, recognized, counters, evidence, featured. Fecha real desconocida de un logro retroactivo: earnedAt=null, sin inventar fecha histórica. Se muestra resumen al migrar y se silencian importaciones. Los logros no se mutan al dibujar tarjetas. Evaluación de reglas solo cuando eventos del motor marcan cambios; el tick inactivo no recorre el catálogo.

La importación de una partida es reemplazo explícito; conserva su propio registro y no concede premios económicos. No se mezcla el historial de otra partida. En una misma partida, una medalla desbloqueada no se pierde aunque el inventario o las exposiciones cambien.
