# El Gran Atlas 3.40.0 · Inventario, Cartografía y Trueques Regionales

Inventario mantiene sus cinco pestañas y añade búsqueda, filtros, orden por nombre/cantidad, seis tarjetas por página, fichas de procedencia/usos y un planificador recursivo. Taller reúne todas las recetas, incluidos abrigo polar y equipo de sondeo, sin duplicar botones. Las recetas consumidoras, Investigación, Museo y Comercio se consultan desde cada objeto. [Matriz de 68 objetos](docs/inv3400/inventory-matrix.json).

Estado de publicación: candidato completo y validado localmente; verificación pública pendiente.

## Cartografía

| Documento | Partes propias | Fuente anterior al destino |
|---|---:|---|
| Asia | 10 | Norte y Alpes, botín original |
| África | 10 | Balcanes y reconocimientos africanos, botín original |
| Norteamérica | 8 | Reconocimiento del Atlántico, muestra garantizada y botín original |
| Sudamérica | 10 | Reconocimiento del Atlántico, tras investigar Norteamérica |
| Oceanía | 10 | Atlántico, Norte o Alpes, tras investigar Sudamérica |
| Regiones polares | 8 | Norte o Alpes, tras investigar Oceanía |

Las tres fuentes nuevas añaden una prospección independiente del 50 % por viaje elegible. La elegibilidad y el resultado quedan fijados al partir y se guardan dentro del trabajo. No consumen tiradas del generador de botín anterior, no sustituyen recompensas ni añaden bonos a viajes antiguos. La investigación de una etapa puede preceder a su prestigio regional; se conserva esa regla del motor.

Sudamérica, Oceanía y Polos exigen su mapa acreditado, además de las investigaciones, herramientas y prestigio anteriores. Los mares superficiales requieren **Mapamundi**, y profundos/abisales heredan esa condición con sus protocolos y equipo de sondeo. Los mapas no se consumen al abrir regiones. Asia conserva ahora físicamente su mapa al investigar; África y Norteamérica ya lo conservaban.

El Mapamundi exige reunir físicamente los seis mapas y los conserva. Se acredita una sola vez, sin admitir fragmentos sueltos ni derechos históricos como documentos. Europa es conocida desde el comienzo. El Archivo cartográfico está plegado dentro de Coleccionables y permite consultar regiones sin viajar automáticamente.

## Compatibilidad

[Reglas detalladas](docs/inv3400/migration.md). Se conserva `gran_atlas_v05`. `cartography3400.version=1` distingue partidas nuevas de respaldos anteriores; `historicalAccess` conserva derechos reconocidos por investigaciones, regiones abiertas/visitadas o región actual. Una etapa histórica avanzada acredita sus predecesoras cartográficas. No se inventan fragmentos, mapas físicos ni nuevas regiones desbloqueadas.

Las partidas nuevas no reciben exenciones por comprar investigaciones y recargar. La migración es idempotente. Restaurar la misma colección conserva sus acreditaciones y recibos; otra partida mantiene los suyos. Se prueban exportadores reales de 3.28–3.39, viajes comerciales de 24 h, operaciones científicas, excavaciones y prospecciones. El actualizador realiza una copia exacta antes de activar la PWA y bloquea la activación si existe otra ventana abierta.

Las reservas protegen las seis preparaciones anteriores, las partes propias de mapas pendientes y los mapas físicos reunidos para el Mapamundi. Una fabricación que perjudique otra preparación muestra advertencia y exige confirmación. Las operaciones nuevas utilizan el sistema transaccional existente: una escritura fallida revierte recursos, objetos, trabajos, recibos y evaluación diferida de logros/misiones/Museo.

## Trueques regionales

Los cinco intercambios anteriores aparecen como **Conversiones de suministros**, con los mismos IDs, costos y resultados. Los siete **Trueques regionales** requieren acceso regional legítimo, Astillero, excedentes sobre reserva y confirmación. Tienen recibos permanentes y rechazan botones obsoletos.

| Procedencia | Mercancía exclusiva | Entrega por una unidad |
|---|---|---|
| Asia | Especias de gabinete oriental | 50 flores prensadas |
| Asia | Folio de comercio asiático | 100 pergaminos |
| África | Muestra textil de gabinete africano | 50 maderas talladas |
| Norteamérica | Documento comercial norteamericano | 50 pergaminos |
| Sudamérica | Cacao de colección botánica | 100 flores prensadas |
| Oceanía | Nácar insular histórico | 100 piedras de río |
| Polos | Registro geológico polar | 100 maderas talladas |

Son bienes históricos abstractos de colección con procedencia y descripción, SVG propios y reconocimiento visual al reunir los siete. No se obtienen en Campo, botín, fabricación, Mercado ni premios ordinarios. No habilitan territorios ni conceden rentas, conocimiento o prestigio. Se eligieron alternativas documentales/textiles al marfil y la pólvora propuestos; no se añaden extracción de fauna ni usos de sustancias.

[Economía reproducible](docs/inv3400/economy-report.json): 140 intercambios reales conservan libras/conocimiento/prestigio. Los objetos de salida no alimentan ninguna receta, venta ni intercambio, por lo que no cierran ciclos productivos. Las 14 ofertas de 3.39 y su prueba de potencial económico se conservan. No se alteran ingresos del Museo, probabilidades científicas, bonificaciones, prestigio, duraciones comerciales ni recompensas originales.

## Arte y validación

Solo la tierra de `map_fragment` cambia de verde a ocre `#c5aa5f`; pergamino, contorno y proporciones permanecen. Las láminas anteriores restantes son idénticas. Los tres mapas nuevos tienen siluetas distintas y el Mapamundi, abrigo, sondeo y mercancías cuentan con SVG locales. [Comparación a 64 y 24 px](docs/inv3400/browser/map-art-comparison.png).

**666 pruebas aprobadas, 0 fallidas:** 599 de referencia sin modificar, ejecutadas sobre sus fuentes exactas (473 históricas anteriores y 126 sobre 3.39), más 67 sobre 3.40. Las expectativas antiguas sobre 54 objetos y acceso sin mapas se conservan en 3.39; la nueva batería comprueba los 68 objetos y los requisitos autorizados. [Resultados](docs/inv3400/final-tests.txt) · [Resumen](docs/inv3400/test-summary.json).

[Tres campañas completas](docs/inv3400/world-campaigns.json), semillas 19/71/503: inician con £420, cero conocimiento/prestigio, inventario vacío y sin exenciones. Usan encuentros reales, tres ayudantes contratados, subvención una vez por minuto, conversión pagada de Sociedad, viajes, fabricación, investigación, publicaciones y Museo. Llegan a las fosas en 260/255/259 horas virtuales, con todos los mapas antes de sus investigaciones y Mapamundi antes de mares. Es una política automatizada con reloj simulado, **no una estimación de duración humana**. No se inyectan materiales, observaciones, dinero, investigaciones ni prestigio.

[Navegador](docs/inv3400/browser/report.json): 320/360/390/412/1280 px, cinco pestañas, búsqueda y filtros, un botón de fabricación por ficha, seis tarjetas como máximo, Mapamundi no destructivo persistente, cancelación/confirmación de trueques, laboratorio aislado, error de guardado y funcionamiento offline. Cien renderizados conservan el número de nodos y un solo intervalo. [PWA 3.39→3.40](docs/inv3400/pwa/report.json): copia exacta, trabajos pendientes, acceso oceánico histórico sin mapa físico y retorno tras 90 días.

Se mantienen 945 especies, 113 regiones, 1.744 presencias, 80 logros, 37 misiones, doce exposiciones y cinco salas del Museo. No se genera APK ni se modifica la firma permanente. Pendiente de comprobación en Android físico; las limitaciones científicas/artísticas de GM-05 continúan documentadas.

```sh
node scripts/validate-inventory-v3400.cjs
node scripts/simulate-inventory-world-v3400.cjs
node scripts/audit-inventory-v3400.cjs
node scripts/build-inventory-release-v3400.cjs
# Con www servido en localhost:8768:
node scripts/check-inventory-v3400.cjs
node scripts/check-inventory-pwa-v3400.cjs
```

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Actualizar con respaldo exacto](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3400.html) · [Laboratorio aislado](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-inventario-v3400.html).
