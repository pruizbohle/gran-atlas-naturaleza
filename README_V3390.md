# El Gran Atlas 3.39.0 · Expediciones y Comercio II

Comercio incorpora una mesa de abastecimiento científico: **ocho contratos únicos, dos repetibles y cuatro manifiestos opcionales**, dentro de Expediciones → Comercio. [Catálogo de instituciones, insumos, accesos y premios](docs/log3390/catalogue.md).

Se conservan 945 especies, 113 regiones, 1744 presencias, 80 logros, 37 misiones, doce exposiciones y cinco salas del Museo. Los catálogos y renderizadores previos se comparan con `45137aa`; sus costos, probabilidades, duraciones, premios y rentas permanecen iguales. No se crean objetos, monedas, regiones ni una pestaña principal. No se compila APK ni se modifica la firma permanente.

## LOG-01 · Auditoría

[Matriz de 54 objetos y sus fuentes reales](docs/log3390/log-01.md), generada del motor: fabricación, estudios, investigación continental, Museo, rutas, Mercado y trueques. Se revisan GM-05 y Comercio 3.30. La fabricación no tiene ciclos; los siete artículos de Mercado, cinco trueques y ocho estudios conservan sus equivalencias.

Flores, pergaminos, piedras, huellas, fósiles, madera, lentes, latón y tinteros adquieren usos adicionales. Los excedentes son potenciales: fósiles y materiales históricos siguen teniendo usos opcionales en Museo y estudios. La interfaz distingue existencias y reservas.

La reserva recorre las recetas de Brújula de latón, Cuadrante transatlántico, Catalejo de precisión, Sombrero académico, Abrigo polar y Equipo de sondeo aún no acreditados. Las piezas intermedias presentes reducen esa necesidad; nunca se entregan. Solo se consumen cantidades que dejen intacta la reserva. Una prueba fabrica después las seis preparaciones con los insumos conservados. Los mapas y todos sus fragmentos quedan excluidos.

## LOG-02–04 · Entregas, cargas e interfaz

Contratos de Gabinete, Museo, Taller y Abastecimiento. Cada entrega muestra institución, propósito, acceso, cantidades disponibles, reserva y premio. Requiere confirmación antes de consumir. Los ocho únicos registran su pago permanentemente; los repetibles exigen nuevos insumos y una nueva confirmación.

Manifiestos: Documentación científica, Instrumentación, Materiales naturales y Suministros museológicos. Se asigna uno a cada ruta existente. El envío ordinario sigue disponible y es idéntico a 3.38. Las cuatro duraciones continúan en 4/8/12/24 horas, con una plaza comercial independiente de las ocho expediciones científicas. La carga guarda sus insumos y retorno adicional exacto al partir; el recibo conserva ese detalle. No hay nuevas tiradas de azar al regresar o reabrir.

Cinco secciones internas: Rutas, Contratos, Mercado, Trueques y Registro. Contratos usa filtros, tarjetas plegables y cuatro resultados por página. Se muestran requisitos pendientes, recursos insuficientes, disponibilidad, viaje en curso, entrega lista y contrato completado. Identidad de pergamino, verde y latón; icono local del archivo de objetos. No se añaden temporizadores.

## LOG-05 · Persistencia

Se mantiene `gran_atlas_v05`. `commerce.deliveries` conserva todos los recibos de contratos y `deliverySeq` evita procesar de nuevo una confirmación anterior. `commerce.tradeReceipts` conserva los viajes pagados; `jobs[].manifest` guarda la carga confirmada. La vista de Registro muestra como máximo doce entradas recientes; los recibos permanentes no se recortan. Los recibos comerciales históricos todavía conocidos se conservan al entrar en el nuevo archivo; no se inventan viajes anteriores ya eliminados por 3.38.

Restaurar un respaldo de la misma `collectionId` une los recibos locales y los importados, conservando la mayor secuencia, sin volver a acreditar sus premios. También se cubren dos ramas del mismo respaldo con entregas de distinto contrato y secuencia coincidente. Partidas diferentes conservan registros separados. La importación no modifica el objeto de respaldo recibido. Otra instalación solo puede conocer los recibos incluidos en el archivo trasladado.

Las operaciones reutilizan `tradeTransaction3300` y `persist`. Un fallo revierte el estado completo: recursos, inventario, trabajo, recibos, misiones, logros, acreditaciones del Museo y evaluación diferida. Se puede reintentar. Los viajes antiguos sin manifiesto no reciben bonos nuevos. No se añade otra clave de guardado; el actualizador conserva la clave de copia exacta que ya existía.

## Economía

[Informe reproducible](docs/log3390/economy-report.json). Los ocho contratos únicos suman £780 y 710 conocimientos, a cambio de mercancías. Todas las ofertas nuevas reducen estrictamente el potencial de reposición heredado de 3.30, valorando 40 conocimientos en £25. No entregan objetos que puedan cerrar un ciclo nuevo.

Comprar y entregar 100 veces cada repetible pierde £32.000 y £40.750 de valor combinado, respectivamente. Los manifiestos también devuelven menos valor que sus insumos y requieren el plazo real original. Cuatro escenarios de 72 h comparan viajes con/sin carga usando las transacciones reales y verifican igual número de viajes y contadores. Son partidas sintéticas financiadas, no una estimación de duración humana ni un nuevo balance global de GM-05. El Museo y las fuentes económicas anteriores no se alteran.

## LOG-06 · Validación y recursos

La referencia de 3.38 contiene 566 pruebas: 473 ejecutadas en sus versiones históricas exactas y 93 sobre el motor candidato. Se conservan sin cambiar expectativas. Se añaden 33 pruebas sobre contratos, fuentes ejecutables, reservas, economía, cargas, pagos únicos, importación, aislamiento de partidas, fallos de escritura, integridad y metadatos: **599 pruebas**, 126 de ellas sobre el motor candidato.

[Pruebas finales](docs/log3390/final-tests.txt). [Navegador](docs/log3390/browser/report.json): 320/360/390/412/1280px, cinco secciones, filtros y paginación, cancelación sin consumo, entrega confirmada, manifiesto de 24 h persistente, juego y laboratorio offline. Doscientos renderizados reales mantienen 305 nodos y un solo intervalo en cada resolución. Las mediciones son Chromium emulado, sin promesa de rendimiento en Android físico.

[PWA 3.38→3.39](docs/log3390/pwa/report.json): respaldo exacto, bloqueo con otra ventana abierta, comparación de los subsistemas anteriores, viajes científicos y de 24 h, excavaciones, prospecciones y operación profunda pendientes. Retorno tras 90 días offline, recogidas manuales de Museo una sola vez, contratos/carga conservados al recargar y contadores comerciales únicos. Sin errores JavaScript.

El [laboratorio aislado](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-logistica-v3390.html) ejecuta el motor de producción con almacenamiento solo en memoria, dentro de un iframe sin mismo origen. Seis escenarios: requisitos pendientes, excedentes, reserva protegida, carga de 24 h, retorno tras 90 días y fallo de guardado. No lee ni reemplaza la partida real y funciona offline. Las operaciones de prueba piden confirmación en el propio laboratorio.

```sh
node scripts/audit-logistics-v3390.cjs
node scripts/simulate-logistics-v3390.cjs
node scripts/validate-logistics-v3390.cjs
node scripts/build-logistics-release-v3390.cjs
# Con www servido en localhost:8768:
node scripts/check-logistics-v3390.cjs
node scripts/check-logistics-pwa-v3390.cjs
```

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Actualizar con respaldo exacto](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3390.html) · [Laboratorio comercial](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-logistica-v3390.html).

**Publicación verificada.** El commit [`148321e`](https://github.com/pruizbohle/gran-atlas-naturaleza/commit/148321e7b11e85c0452876bdb26d361659c83602) integra LOG-01–LOG-06 en `main` y `feat/logistica-comercio-v3390`. [GitHub Actions](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/43143070014) aprobó599/599 pruebas y desplegó Pages. Los [178 archivos públicos](docs/log3390/published-report.json) coinciden con sus hashes SHA-256, sin diferencias. La [prueba Chromium sobre producción](docs/log3390/published-browser/report.json) pasó en las cinco resoluciones, incluyendo carga de24h persistente, confirmaciones, laboratorio aislado, error de guardado y juego/laboratorio offline. Caché `gran-atlas-v3.39.0-logistics-52386e479b41`,176 archivos únicos declarados offline. No se generó APK ni se modificó la firma Android.

## Próxima versión 3.40.0

Priorizar una sesión prolongada en dispositivos Android reales para medir desplazamiento, almacenamiento y respuesta táctil. Evaluar con campañas observadas el uso de contratos repetibles y el crecimiento del archivo permanente antes de añadir más ofertas. Mantener separados los ajustes de economía, las ampliaciones de catálogo y los problemas científicos/artísticos pendientes de GM-05.
