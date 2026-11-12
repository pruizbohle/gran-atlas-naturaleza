# Cierre INV-01–INV-08 · 3.40.0

Estado: implementado, integrado, publicado y verificado en producción.

| Etapa | Commit | Resultado |
|---|---|---|
| INV-01 | a87f858 | Auditoría de 54 objetos, fuentes, reglas y migraciones. |
| INV-02 | 14cf883 | Búsqueda, filtros, seis tarjetas, fichas y planificador. |
| INV-03 | 41564a8 | Tres mapas nuevos, fuentes separadas y Mapamundi no destructivo. |
| INV-04 | 6cb9240 | Requisitos geográficos y acreditación histórica sin mapas ficticios. |
| INV-05 | 9a4e0e5 | Siete trueques regionales 50:1/100:1, bienes terminales y recibos. |
| INV-06 | c2a0f01 | Fragmento genérico ocre, mapas verdes, SVG propios y cinco resoluciones. |
| INV-07 | 352aab6 | Reservas, transacciones, importadores 3.28–3.39 y tres campañas desde cero. |
| INV-08 | 3416324 | 3.40.0, laboratorio, PWA con respaldo exacto, integración y despliegue. |

## Resultado comprobado

- Inventario: 54 objetos anteriores conservados, 14 nuevos; 68 en total. Cinco pestañas originales y ninguna pestaña principal adicional.
- Cartografía: Asia 10, África 10, Norteamérica 8, Sudamérica 10, Oceanía 10 y Polos 8 partes propias. Mapamundi permanente que conserva los seis originales. Las partes nuevas se fijan al partir mediante una capa del 50 % por expedición elegible; el botín previo no cambia.
- Acceso: mapas nuevos y Mapamundi se suman a investigaciones, preparaciones y prestigio. Los derechos históricos se reconocen separadamente, sin crear documentos físicos ni cambiar regiones abiertas.
- Trueques: siete mercancías exclusivas, sin recetas, botín, ventas o premios alternativos; cinco conversiones anteriores intactas. Los bienes solo sirven a la colección del gabinete. Cero bonos económicos nuevos y cero ciclos productivos rentables añadidos.
- Partidas: misma clave gran_atlas_v05, exportación/importación íntegra, secuencias y recibos permanentes por colección, materiales reservados y reversión transaccional.
- Integridad: 945 especies, 113 regiones, 1.744 presencias, ocho expediciones, cuatro rutas 4/8/12/24 h, diez contratos, cuatro manifiestos, 80 logros, 37 misiones, doce exposiciones y cinco salas conservados.

## Pruebas y publicación

[Resultados locales](final-tests.txt): **666 aprobadas y 0 fallidas**. Incluyen 599 referencias sin modificar ejecutadas con sus fuentes exactas (473 históricas anteriores y 126 de 3.39) y 67 pruebas actuales de 3.40. Los nuevos requisitos se verifican en la batería actual; no se alteran expectativas antiguas para hacerlas pasar.

[Tres campañas desde cero](world-campaigns.json), semillas 19/71/503: £420 iniciales, cero conocimiento/prestigio y sin inventario ni herencia. Alcanzan fosas a las 260/255/259 horas virtuales respectivamente. No se inyectan recursos, observaciones, investigaciones ni prestigio. Los tiempos pertenecen a una política automatizada con subvención por minuto y reloj simulado; no representan duración humana.

[GitHub Actions](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/43225239681): **666/666**, tres campañas repetidas con los mismos hitos y despliegue correcto del commit `3416324ef65dc49bde1d027f8831ae36b5113155`. [Resumen de logs](actions-report.json).

[Producción](published-report.json): **182 archivos con SHA-256 coincidente, 0 diferencias**. [Navegador de producción](published-browser/report.json): 320/360/390/412/1280 px, búsqueda/filtros, fabricación única por ficha, Mapamundi no destructivo persistente, cancelación/confirmación de trueques, cinco conversiones antiguas, laboratorio aislado, error de guardado y offline. Sin errores JavaScript ni desbordamientos; cien renderizados mantienen nodos e intervalo constantes.

[PWA 3.39→3.40](pwa/report.json): respaldo exacto, bloqueo con otra ventana abierta, viajes científicos/comerciales de 24 h pendientes, excavaciones/prospecciones/sondeo, retorno de 90 días y acceso oceánico histórico sin mapas físicos. Caché `gran-atlas-v3.40.0-inventory-b23829f28eb9`, 180 archivos offline.

## Recursos

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/).
- [Actualizador con respaldo exacto](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3400.html).
- [Laboratorio aislado de Inventario y Cartografía](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-inventario-v3400.html).
- [README 3.40.0](../../README_V3400.md).
- [Matriz de objetos y fuentes](inventory-matrix.json).
- [Economía y trueques](economy-report.json).
- [Migración histórica](migration.md).
- [Comparación visual en producción a 64/24 px](published-browser/map-art-comparison.png).

Sin fallos funcionales pendientes detectados en las comprobaciones realizadas. No se probó hardware Android físico; no se generó APK ni se modificó la firma permanente. Las limitaciones científicas/artísticas anteriores de GM-05 se conservan. Para una siguiente versión: sesiones en Android real, seguimiento del uso de trueques y reservas, y medición del crecimiento del archivo de recibos antes de ampliar la colección.
