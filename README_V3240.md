# El Gran Atlas v3.24.0 — Estabilización global

AM-06 cierra la estabilización de las Américas con **710 especies, 79 regiones y cinco continentes**. La única modificación funcional de producción es la presentación paginada del Bestiario. No cambia catálogo, ilustraciones, geometría, investigaciones, requisitos, costes, economía, observación, naturalistas ni estructura de partidas.

## Bestiario

Se muestran **32 tarjetas por página**, en 23 páginas para el catálogo completo. La selección se realiza **después** del filtrado de monografías y del ordenamiento alfabético, por rareza o por tipo, en ambos sentidos. Los contadores siguen describiendo el catálogo completo o el conjunto filtrado; las 710 identidades continúan disponibles.

Los controles aparecen arriba y abajo, con anterior/siguiente, página y rango. Se conservan las tarjetas, sus estilos y las colecciones de especímenes desplegables. Solo se generan SVG para las tarjetas visibles. La caché existente se reutiliza; recorrer repetidamente las 23 páginas no añade entradas normales por encima de las 710 identidades.

`bestiaryPage` es una variable temporal de interfaz, fuera de `state`. Cambiar de pestaña conserva la página; recargar la aplicación vuelve a la primera. Al reducirse el conjunto filtrado, el índice se ajusta a la última página existente, incluyendo el caso sin resultados. Cambiar de página no escribe en `gran_atlas_v05` ni modifica progreso o colecciones. Los filtros y órdenes anteriores conservan su comportamiento de persistencia.

| Evidencia a 320×640 | |
|---|---|
| [Antes: 710 tarjetas](docs/stability-v3240/bestiary-before-320.png) | [Después: 32 tarjetas y controles](docs/stability-v3240/bestiary-320.png) |
| [Campo](docs/stability-v3240/field-320.png) | [Museo](docs/stability-v3240/museum-320.png) |

## Rendimiento medido

Comparación nueva entre el commit **1cda484 / 3.23.1** y 3.24.0, ambas con 710 especies y 355 monografías. Mismo navegador, contexto, página, sesión CDP, resolución 390×844 y **CPU ×4**. Orden ABBA repetido dos veces: cuatro visitas por versión y tres reaperturas calientes por visita. Los temporizadores y service workers se pausan por igual exclusivamente en el banco de medición para excluir escrituras/ticks y precarga; se prueban por separado en ejecución funcional.

| Operación, mediana | 3.23.1 | 3.24.0 |
|---|---:|---:|
| Primera apertura, caché SVG fría | 2.587,55 ms | **209,60 ms** |
| Reapertura, caché caliente | 2.143,80 ms | **95,70 ms** |
| Ordenar | 2.081,20 ms | 124,25 ms |
| Ocultar/mostrar monografías | 2.084,00 ms | 106,40 ms |
| Página nueva, SVG aún no visitados | No aplicable | 127,50 ms |
| Volver a página ya visitada | No aplicable | 105,55 ms |
| Primera colección de especímenes | 30,35 ms | 6,30 ms |
| Reabrir colección ya generada | 0,55 ms | 0,60 ms |
| Volver a Campo desde Bestiario | 131,75 ms | 18,00 ms |
| Generar 710 SVG en prueba aislada, fría | 148,55 ms | 148,95 ms |
| Recorrer los 710 SVG en caché | 3,75 ms | 4,15 ms |
| Serialización JSON del estado | 2,85 ms | 3,27 ms |
| Memoria JS tras GC, secuencia medida | 7.506.176 bytes | 4.846.122 bytes |
| Nodos DOM tras la secuencia | 31.943 | 1.623 |
| Llamadas SVG en primera apertura | 710 | **32** |

La reducción medida es **91,9 % en apertura y 95,5 % en reapertura**. La memoria corresponde a la misma secuencia de operaciones, con el catálogo completo representado en memoria en ambas versiones y solo las tarjetas visibles en el DOM de 3.24.0. El guardado mide aproximadamente 108.585 bytes en ambas, con diferencias de uno o dos bytes en campos variables de ejecución.

Se informa también el empeoramiento pequeño de serialización (**+0,42 ms**) y de algunos recorridos calientes, sin atribuir causalidad a cambios de un serializador o motor SVG que permanecen intactos. Todas las muestras y el cálculo de medianas se conservan en [performance-report.json](docs/stability-v3240/performance-report.json). Las mediciones nuevas no se mezclan con la cifra histórica de 2,46 s de AM-05, que utilizaba otra semilla de progreso.

Un ensayo complementario compara Campo, Atlas, Cuaderno, Museo, Investigaciones, Expediciones e Inventario con el mismo catálogo, resolución y CPU: [module-performance.json](docs/stability-v3240/module-performance.json). Sus valores y variación se muestran en el [informe detallado](docs/stability-v3240/REPORT.md). No se aplicaron otras optimizaciones al no encontrarse un bloqueo que las justificara.

**Estas son pruebas de Chromium con emulación móvil, no de un Android físico.** La prueba gráfica de 710 SVG se ejecuta únicamente para medir; no forma parte de la apertura normal del juego.

## Regresión e integridad

Las **294 pruebas Node pasan**. Se conservan todos los fixtures históricos: los contratos que esperaban 487 o 710 tarjetas simultáneas se ajustan a la nueva ventana de 32; la cobertura completa y el orden se comprueban recorriendo las páginas. El Jaguar continúa presente en su página correspondiente. No se modifican datos históricos para ocultar fallos.

Los hashes históricos del código de juego se verifican retirando exclusivamente las inserciones marcadas `AM-06`, con [legacy-source.cjs](tests/helpers/legacy-source.cjs). El resultado es idéntico byte a byte a 3.23.1. Los datos, estilos, cartografía y motores artísticos se comparan directamente con sus hashes originales. Esto conserva las probabilidades, recompensas, velocidades y reglas de todos los sistemas.

- **710 identidades científicas únicas**, sin especies huérfanas ni referencias rotas.
- **79 regiones y 1.329 presencias globales**: Norteamérica conserva 14/206 y Sudamérica 10/192.
- Todas las presencias tienen hábitat, horario y estación alcanzables.
- Se preservan Pecari/Dicotyles, las decisiones sudamericanas y los IDs separados de Amazonía y Sáhara.
- **2.658 encuentros dirigidos** cubren manual y automático para cada presencia, con recompensas originales verificadas.
- Grupos, censos y límite de 100 observaciones automáticas por especie/hora se verifican en las 79 regiones.
- **3.550 avances de etapa y 710 publicaciones únicas** verifican el Cuaderno completo y sus costes/recompensas.
- Museo, fósiles, relictos, artefactos, equipo y expediciones conservan sus suites especializadas, además de una regresión integrada con temporizadores, ingresos, límites, historial y ausencia de recompensas duplicadas.

[Catálogo](docs/stability-v3240/catalog-integrity.json) · [Encuentros](docs/stability-v3240/global-encounters.json) · [Grupos](docs/stability-v3240/global-groups.json) · [Cuaderno](docs/stability-v3240/global-notebook.json) · [Subsistemas](docs/stability-v3240/subsystems.json) · [Registro de pruebas](docs/stability-v3240/node-tests.txt)

## Progresión continental

Se simula Europa → Asia → África → Nuevo Mundo → Norteamérica → Sudamérica. Los materiales cartográficos y del cuadrante se obtienen mediante expediciones que ya están disponibles antes de necesitarlos; después se fabrican los mapas y se compran las investigaciones reales. La prueba utiliza fondos/prestigio de una partida avanzada y selección determinista de intervalos originales de botín, sin cambiar producción ni certificar cuánto tarda una partida en reunir esos recursos.

Se comprueba el grafo completo de investigaciones sin ciclos, los requisitos de objetos, los umbrales de las 79 regiones, viajes, compras persistentes y prestigio sin consumo. Comprar acceso continental no abre automáticamente sus regiones. Se conserva la regla histórica de los Alpes al llegar a prestigio 2.

**No se corrigieron precios ni requisitos:** no se encontró una dependencia imposible. Asia consume su mapa al investigar, tal como lo hacía 3.23.1; África y Norteamérica conservan los suyos. El mapa norteamericano puede obtenerse tras Navegación al Nuevo Mundo, antes de comprar Cartografía de Norteamérica. Sudamérica conserva los umbrales 167–194 y no exige materiales de un continente bloqueado.

[Informe de progresión](docs/stability-v3240/continental-progression.json)

## Partidas, PWA y Android

Se mantienen `gran_atlas_v05` y su formato. Se prueban seis partidas representativas generadas con las versiones originales del historial: Europa 3.19.9, África 3.21.2, Norteamérica 3.22.1, Sudamérica 3.23.1, Museo 3.23.0 y variantes/monografías 3.22.1. Se conservan sus hashes y procedencia en [stability-saves-v3240.json](tests/fixtures/stability-saves-v3240.json). Pasan carga inicial, exportación y selector nativo/importación simulados, restauración y recarga, conservando los campos críticos de progreso.

La simulación de ocho horas con el catálogo completo coincide **en todos los bytes del estado y llamadas RNG** con 3.23.1: [offline-simulation.json](docs/stability-v3240/offline-simulation.json). También pasan las pruebas previas de guardados corruptos, almacenamiento denegado o lleno, reversión de importación fallida y recuperación explícita. No se sustituye un guardado ilegible por uno vacío.

Se prueba actualización PWA desde **3.21.2, 3.22.1, 3.23.0 y 3.23.1**: revisión antigua coherente hasta aceptación, bloqueo con otra ventana abierta, respaldo bruto idéntico, progreso conservado y recarga offline. Se añade [actualizar-v3240.html](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3240.html), conservando las rutas anteriores y el actualizador seguro.

En navegador se verifican **32 combinaciones de módulo/resolución, veinte de mapa continental/resolución y las 79 regiones** con viajes por la interfaz, observación manual, `tick` real de naturalistas y Cuaderno. Se prueban las cuatro resoluciones solicitadas, navegación del Bestiario, colección bajo demanda, conservación al recargar y los ocho módulos/cinco continentes offline. No se detectan errores JavaScript: [browser-report.json](docs/stability-v3240/browser-report.json).

Capacitor mantiene `com.elgranatlas.naturaleza.beta314`. El APK debe declarar **3.24.0 / 32400**, incluir todos los archivos web y conservar los plugins nativos de importación/exportación. [verify-stability-apk-v3240.py](scripts/verify-stability-apk-v3240.py) valida el APK descargado y compara su certificado público con el [APK 3.23.1 de referencia](docs/stability-v3240/android-signing-baseline.json). El [informe Android verificado](docs/stability-v3240/android-report.json) confirma versión/código, los **87 archivos web idénticos** y ambos plugins nativos. El certificado nuevo **difiere del de 3.23.1**; no se garantiza actualización directa sobre ese APK. No se realizó instalación en un dispositivo físico.

El workflow actual usa la firma de depuración del runner, sin una clave persistente configurada. **No se garantiza actualización directa si cambia el certificado.** Se mantienen las [instrucciones de respaldo y recuperación Android](README_RESPALDOS_ANDROID.md); no se recomienda desinstalar una partida sin respaldarla.

## Cierre y siguientes etapas

La serie **AM-01 a AM-06 queda cerrada**. El código publicado es [`b35caa6`](https://github.com/pruizbohle/gran-atlas-naturaleza/commit/b35caa6c8c7625df1b5095d6777db78968923c87): [Deploy El Gran Atlas](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42531264195) y [Android APK de prueba](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42531264157) finalizaron con **SUCCESS**. El APK se descargó y verificó. No quedan fallos críticos conocidos. [Resultado de publicación](docs/stability-v3240/publication.json).

Quedan como trabajo posterior: pruebas en Android físico, firma persistente para distribución de actualizaciones, evolución visual de Cuaderno/Bestiario y revisión científica de los conceptos amplios que AM-04 ya dejó documentados. No se inicia ninguna de esas ampliaciones en esta versión. [Estado de la serie y pendientes](docs/stability-v3240/STATUS.md) · [Plan actualizado](docs/americas-implementation-plan.md)

## Reproducción y publicación

```sh
ATLAS_EVIDENCE_DIR=docs/stability-v3240 node --test tests/*.test.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-stability-browser-v3240.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-pwa-upgrade-v3240.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/benchmark-stability-v3240.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/benchmark-modules-v3240.cjs
```

Playwright y Chromium se usan solo para desarrollo; no se agregan dependencias al juego. Los bancos comparativos y generador inicial de partidas necesitan el historial Git completo; las pruebas de CI consumen fixtures locales y funcionan con checkout superficial.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Actualización segura](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3240.html) · [Publicación APK](https://github.com/pruizbohle/gran-atlas-naturaleza/releases/tag/v3.24.0) · [Archivos modificados](docs/stability-v3240/FILES.md)

Ambos workflows del código `b35caa6` finalizaron correctamente después de ejecutar las 294 pruebas. El informe final se incorpora mediante un commit de documentación, sin modificar `www` ni recompilar el APK verificado. La conexión directa a GitHub Pages está restringida por la política de red de este entorno; se verifica el despliegue mediante su ejecución real de Actions y destino publicado, y el APK mediante descarga y comparación de contenido.
