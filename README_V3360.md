# El Gran Atlas 3.36.0 · Logros y Sociedad

Sociedad incorpora **80 logros permanentes** y conserva sus subvenciones, publicaciones y 13 misiones. Se mantienen los 945 animales, 113 regiones, 1.744 presencias, IDs y guardado `gran_atlas_v05`. Android y su firma permanente siguen independientes; esta entrega no genera APK.

## Sociedad

Cuatro pestañas internas: Subvenciones, Publicaciones, Misiones y Logros. El acceso principal y «Más» móvil se conservan. La cabecera muestra descubrimientos, publicaciones, prestigio, medallas y un título obtenido que el jugador puede destacar.

Logros ofrece búsqueda por nombre, seis categorías, estados completados/pendientes/secretos, progreso, fecha conocida y medallas Bronce/Plata/Oro/Platino. Los secretos ocultan nombre, requisitos y progreso hasta obtenerse. Las insignias SVG reutilizan la paleta verde, pergamino y dorado, con motivos de cartografía, libros, especímenes, Museo, laboratorio y navegación. El estilo solo afecta Sociedad y sus avisos.

| Categoría | Logros |
|---|---:|
| Exploración y cartografía | 16 |
| Zoología y Cuaderno | 18 |
| Especímenes especiales | 12 |
| Museo y paleontología | 12 |
| Investigación y fabricación | 12 |
| Expediciones y Comercio | 10 |

El [catálogo completo](docs/ach3360/catalogue.md) documenta condiciones, niveles y retroactividad. Las medallas y cinco títulos son **reconocimientos cosméticos**: no entregan libras, conocimiento, materiales, prestigio ni bonificaciones pasivas. No se cambian probabilidades, costos ni ingresos del Museo. No hay premios económicos reclamables que puedan duplicarse al restaurar.

## Persistencia y reconocimiento retroactivo

[AUDITORÍA ACH-01](docs/ach3360/ach-01.md). Se aprovechan descubrimientos, publicaciones, etapas, regiones realmente visitadas o desbloqueadas, investigaciones, fabricación acreditada, variantes y registros del Museo. Las recompensas y los marcadores `mission_*` de las misiones anteriores no se modifican.

`state.achievements` añade `unlocked`, `notified`, `recognized`, `counters`, `evidence` y `featured`. Cada ID ocupa una sola entrada. Una medalla obtenida permanece aunque se retiren exposiciones o se consuman materiales. El nivel de Museo exige como máximo 12 exposiciones, su capacidad real. No se inventa una variante Alfa: se comprueban las variantes configuradas.

Los logros retroactivos tienen `earnedAt: null`, `observedAt` y `retroactive: true`: su fecha histórica es desconocida y la interfaz lo indica. La primera migración reúne las medallas en un único resumen. Los avances posteriores generan avisos breves, sin sonido, con acceso a Logros y cierre manual; respetan movimiento reducido. Recargar o importar medallas obtenidas no reproduce avisos.

Los historiales de viajes y protocolos se recortan. Se conserva la evidencia disponible de tipos científicos, métodos profundos y muestras abisales; no se presenta como un historial completo. `museum.voyagesCompleted` sí permite usar el total científico conservado desde la introducción de ese contador.

Los **viajes comerciales completados, viajes comerciales de 24 horas, compras y trueques empiezan a contarse en 3.36.0**. Sus textos lo indican. No se suman doce viajes recientes para inventar un total anterior. Los trabajos pendientes antiguos sí cuentan al completarse bajo la versión nueva. La tenencia de herramientas no sustituye al crédito explícito de fabricación.

Importar sigue siendo un reemplazo explícito por el respaldo elegido. Se conserva su propio registro; no se combinan logros ni historiales de partidas distintas. No se elimina ni reinicia progreso ajeno al campo aditivo. Los contadores comerciales se actualizan dentro de las transacciones existentes y se revierten cuando falla el guardado.

## Arquitectura y rendimiento

- [Reglas y catálogo](www/js/achievements-v3360.js): cálculos separados de la concesión, normalización y registro de eventos.
- [Presentación](www/js/society-achievements-ui-v3360.js): filtros, tarjetas, títulos y cola de avisos.
- [Estilos de Sociedad](www/css/society-v3360.css): sin rediseñar módulos externos.

El motor marca categorías al viajar, investigar, fabricar, registrar especímenes, avanzar el Cuaderno y resolver operaciones. Un tick inactivo no evalúa el catálogo. La clasificación y las variantes configuradas se indexan una vez por catálogo. La actualización de progreso sustituye únicamente tarjetas modificadas; no vuelve a dibujar la interfaz global ni los controles de búsqueda. No se añade ningún intervalo.

[Sesión Chromium de 200 ciclos / 800 cambios de pestaña](docs/ach3360/browser/session-report.json): un intervalo activo y 1.344 nodos DOM en todos los puntos de control; heap después de GC 3,77 / 3,88 / 3,87 / 4,02 MB. Son ciclos automatizados medidos, no horas de uso humano ni una garantía de ausencia de fugas en cualquier dispositivo.

## Validación

**524 pruebas aprobadas:** 473 históricas ejecutadas sobre sus commits originales y 51 sobre el runtime actual, incluidas 14 nuevas de esta entrega. [Log completo](docs/ach3360/final-tests.txt).

Las pruebas nuevas cubren catálogo, capacidad y configuraciones reales, retroactividad, secreto visual, render sin mutaciones, persistencia, reconocimiento único, importación/exportación auténtica 3.35, contadores exitosos/fallidos, rollback por falta de almacenamiento y evidencia profunda/abisal antigua. Se mantienen las comprobaciones de compatibilidad 3.28–3.34 y de catálogo/economía/arte de GM-05.

[Testigos de los 80 logros](docs/ach3360/attainability.json): se invocan acciones reales de fabricación, investigación, desbloqueo, viaje, etapas, publicaciones, especímenes, Museo, expediciones, comercio y protocolos. Los recursos y observaciones iniciales son fixtures sintéticos explícitos. Esta prueba demuestra alcanzabilidad de condiciones, no el tiempo ni la facilidad de una campaña humana.

[Navegador](docs/ach3360/browser/report.json): 320, 360, 390, 412 y 1280 px, acceso móvil, filtros, secretos, notificación enlazada, no repetición al recargar/importar, título destacado, subvenciones, publicación y 13 misiones; sin desbordamiento ni errores JavaScript.

[PWA 3.35→3.36](docs/ach3360/pwa/browser-report.json): respaldo exacto antes de activar, protección frente a otra ventana abierta, resumen único de migración, operaciones pendientes conservadas, liquidación única, viajes y laboratorios offline. El laboratorio mundial conserva 945 identidades; el de Sociedad presenta 80 tarjetas en memoria aislada.

No se afirma validación en Android físico. Las pruebas de retorno y plazos usan relojes aislados; el tiempo real de producción no se modifica. Los límites científicos y artísticos documentados en GM-05 continúan abiertos y no se reinterpretan como resueltos por esta versión.

## Reproducir

```sh
node scripts/validate-society-v3360.cjs
node scripts/build-society-release-v3360.cjs
node scripts/check-society-pwa-v3360.cjs
# Con www servido localmente en el puerto 8766:
node scripts/check-society-v3360.cjs
node scripts/check-society-session-v3360.cjs
```

La validación de publicación y los enlaces comprobados se incorporan después del despliegue de GitHub Pages.
