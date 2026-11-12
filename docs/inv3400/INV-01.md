# INV-01 · Auditoría de Inventario y Cartografía

Base: `4496003` (3.39.0), árbol limpio; main remoto coincide y no existe rama 3.40. Se conserva la implementación LOG-01–06. Referencia: 599 pruebas, sin cambiar sus expectativas.

El catálogo efectivo contiene 54 objetos y 18 recetas (incluidos abrigo polar y equipo de sondeo, instalados al final del motor). Inventario tiene cinco pestañas, pero renderiza listas extensas y añade dos bloques de preparación fuera de Taller. Los bonos y ranuras se calculan en el motor, no en las tarjetas.

## Acceso real

| Etapa | Investigación | Preparación/cartografía anterior | Cambio autorizado |
|---|---|---|---|
| Asia | asia_1 | 10 partes → mapa; rutas II | Conservar físicamente el mapa al investigar |
| África | africa_1 | mapa (10), brújula | Sin cambio |
| Norteamérica | nuevo_mundo_1 → norteamerica_1 | cuadrante, mapa (8), brújula | Sin cambio |
| Sudamérica | sudamerica_1 | anteriores + catalejo | Añadir mapa (10) |
| Oceanía | oceania_1 | anteriores + sombrero académico | Añadir mapa (10) |
| Polos | polos_1 | anteriores + abrigo polar | Añadir mapa (8) |
| Mares | mares_superficiales_1 | anteriores | Añadir Mapamundi no destructivo |
| Profundos/abisales | exploracion_profunda_1 / exploracion_abisal_1 | anteriores + equipo de sondeo | Heredar Mapamundi |

Prestigio inicial/por región: 0/1, 10/2, 53/3, 125/4, 182/5, 233/6, 282/7, 332/8, 429/9 y 475/10. No se cambia. Las funciones efectivas son regionRequirementsMet y regionAccessible, envueltas por las expansiones 3.30–3.34; el acceso comprado y el ya desbloqueado deben conservarse.

## Fuentes y reserva

[Matriz de los 54 objetos](../log3390/inventory-matrix.json). Botín original: V316_LOOT_BASE y ocho tablas de ruta, probabilidad inicial 35 % con bonos de equipo. Los cinco trueques, siete productos de Mercado, diez contratos y cuatro manifiestos se mantienen. Las seis preparaciones se reservan recursivamente mediante supplyReserve3390. Los nuevos mapas y sus partes quedan fuera de entregas y trueques; el planificador debe considerar piezas intermedias y stock compartido.

Se añadirá una prospección cartográfica separada después del botín original: una parte con 50 % de probabilidad por viaje elegible, determinada al partir. Sudamérica: investigación norteamericana + ruta atlántica; Oceanía: investigación sudamericana + ruta atlántica/norte/Alpes; Polos: investigación de Oceanía + norte/Alpes. Fuentes anteriores al destino y sin modificar RNG ni premios originales. Los viajes antiguos no reciben tiradas retroactivas. La campaña medirá medianas, percentiles y máximos con varias semillas, sin afirmar tiempos humanos de progresión científica.

## Persistencia y compatibilidad

load combina initialState con el archivo; restoreGame combina, normaliza Comercio, fusiona recibos por collectionId y migra preparaciones. migrateProgression3300 reconoce equipamiento, investigaciones y regiones históricas. Migraciones polar/marina/profunda reconstruyen flags de investigación. save-manager conserva campos adicionales del respaldo. La copia exacta PWA ya existe.

Se añadirá un marcador cartográfico versionado: partidas nuevas sin derechos heredados; importaciones anteriores sin marcador reconocerán investigaciones, regiones abiertas/visitadas y situación actual. Derechos históricos separados de inventario y craftedItems; no fabricar mapas ni inventar fragmentos. La migración no cambia regionUnlocked. Misma partida conserva acreditaciones/recibos al restaurar; partidas distintas no los comparten. Se probarán fuentes históricas 3.28–3.39, no solo datos escritos a mano.

Los nuevos bienes regionales serán coleccionables terminales (50:1/100:1), sin recetas, ventas ni premios; sin ciclos económicos nuevos. Se priorizan procedencias documentales: especias, folio de comercio asiático, lámina patrimonial africana, documento comercial norteamericano, cacao botánico, nácar histórico insular y registro geológico polar. No se simula extracción de marfil ni uso de pólvora.
