# El Gran Atlas v3.20.0 — Optimización y estabilidad

Actualización técnica sin contenido nuevo, cambios de progresión ni retoques gráficos. Conserva 487 especies, 52 objetos, ocho estudios, 12 Legendarios, nueve relictos, las probabilidades y las partidas existentes.

## Diagnóstico y cambios

[Diagnóstico previo](docs/stability-v3200/diagnosis.md). El Bestiario generaba también todas las variantes de colecciones cerradas y la caché de sprites no cubría las categorías especiales. Los contadores reemplazaban texto en cada tick, aunque no cambiara. Los handlers de acciones se instalaban sobre cada elemento recreado. El service worker actualizaba recursos de una revisión individualmente y podía responder HTML al solicitar un script ausente.

- El Bestiario mantiene todas las tarjetas, ordenamientos, filtros, desplazamiento y diseño. Solo se generan los contenidos de una colección cuando se abre; se reutilizan mientras permanece esa pantalla. No hay virtualización ni paginación nueva.
- La caché central incluye Notable, Épico, Excepcional y Legendario. Se conserva la prioridad de sexo/pigmentación/categoría y cada SVG completo, sin redibujos ni recoloreados nuevos.
- Un listener delegado de acciones permanece en el panel, junto con un listener de expansión. Los listeners específicos de scroll y edición permanecen. No se ha demostrado una fuga de memoria: se elimina trabajo repetido, no se anuncia la corrección de una fuga inexistente.
- Los contadores solo escriben texto cuando el valor visible cambia. Tick continúa cada 1000 ms, con el mismo progreso, topes, azar y frecuencia de guardado. No se reducen escrituras del estado: lastTick cambia cada ciclo.
- Se conservan las cachés de una revisión completa hasta cerrar sus pestañas. El siguiente worker espera; no fuerza la recarga de una partida activa. Los recursos precargados se sirven desde la revisión instalada, sin actualizar archivos sueltos dentro de ella. Un recurso no HTML ausente nunca recibe index.html como respuesta alternativa.
- La inscripción del worker también admite los hosts de loopback 127.0.0.1 e IPv6, además de localhost/HTTPS.

## Guardado

La auditoría reprodujo un defecto: tras fallar la lectura de JSON, la partida inicial se guardaba sobre el original. Ahora se conserva el dato ilegible sin reemplazarlo y se informa desde Respaldos. Una restauración válida permite recuperarse.

Los errores de cuota/acceso no expulsan al motor de la sesión: el progreso continúa en memoria. La exportación usa una copia del estado activo y puede rescatarlo aunque falle la escritura. Una importación cuya escritura falla revierte el estado en memoria y los acumuladores de sesión. Si el JSON almacenado es conocido e ilegible, se impide exportar una partida inicial como si fuese ese progreso perdido; el original sigue intacto. Si la lectura está prohibida por la plataforma, la copia de disco permanece protegida y el progreso nuevo en memoria sí puede exportarse.

Las claves de almacenamiento y el formato del respaldo permanecen intactos. La etiqueta informativa de exportación se actualiza a 3.20.0. Una restricción de almacenamiento del navegador requiere intervención del usuario; ningún código puede garantizar escritura cuando el sistema la prohíbe.

## Integridad y regresión

La suite final contiene **204 pruebas aprobadas**. Las siete nuevas cubren sprites, conservación de guardados ilegibles, errores de cuota/acceso, exportación/restauración avanzada, estrés determinista y el contrato offline.

- Igualdad byte por byte de 3473 combinaciones de sprites normales, pigmentados, especiales y sexuales respecto a 3.19.9, además de hashes de los siete motores de dibujo completos. Objetos, relictos y láminas del Museo conservan sus módulos.
- 28 operaciones públicas de progresión, economía, hallazgos, Museo y expediciones conservan sus implementaciones anteriores. El catálogo completo mantiene su hash.
- Estrés determinista con 487 especies, 48,7 millones de avistamientos, 240 monografías, 40 naturalistas, inventario amplio, exposiciones y relictos: pausas de 1 s, 1 h y 8 h generan exactamente el mismo estado serializado y número de llamadas aleatorias que 3.19.9. No se modifican los parámetros de producción.
- Exportación e importación representativas conservan descubrimientos, etapas, avistamientos, monografías, dimorfismo, variantes, Legendarios, inventario, equipo, compras, Museo y expediciones.
- Chromium: 487 tarjetas, expansión/cierre de colecciones, órdenes ascendente/descendente, filtros, acciones sobre elementos hijos, navegación móvil, respaldo/restauración durante la sesión, cierre/reapertura offline, escritura offline y actualización de worker en espera.
- La prueba offline impide también las respuestas del servidor local, además de usar el modo offline del navegador. Se prueba la separación entre recursos y navegación HTML, y que una sesión abierta conserve la revisión anterior hasta cerrarse.
- Se mantienen las pruebas históricas; sus expectativas de versión y caché se actualizan. La antigua verificación de todo app.js se sustituye por hashes de operaciones de juego, igualdad del catálogo y regresión diferencial del estado completo: las modificaciones técnicas autorizadas no se confunden con cambios de mecánica.

## Rendimiento y tamaños

Los archivos JSON de `docs/stability-v3200/` conservan ensayos y métricas, no estimaciones. Método: Chromium Linux, 390×844, ralentización de CPU 4× mediante CDP, cinco ensayos por revisión y medianas. La comparación final alterna antes/después en orden ABBA dentro del mismo proceso. Las pasadas secuenciales anteriores muestran variación del host y se conservan para transparencia. Se compara app.js de referencia y el optimizado sobre el mismo shell y motores. El campo jsFiles describe el workspace del ensayo; los tamaños exactos de los artefactos y del app.js anterior están en artifacts.json.

| Medición | Antes | Después |
| --- | ---: | ---: |
| Carga inicial (ms) | 691.8 | 620.1 |
| Primera generación de sprites (ms) | 1052.1 | 705.1 |
| Cinco recorridos de sprites en caché (ms) | 533.6 | 28.6 |
| Generación del HTML del Bestiario (ms) | 270.8 | 63 |
| Apertura y layout del Bestiario (ms) | 3449.2 | 1966.3 |
| Nodos DOM totales con Bestiario abierto | 55162 | 23256 |
| SVG del Bestiario al entrar | 1499 | 487 |
| Treinta ticks (ms) | 304.4 | 213.2 |
| Treinta persistencias (ms) | 211.8 | 125.8 |
| Heap JS tras GC (bytes) | 8294480 | 8840004 |
| Entradas de caché de sprites | 1461 | 2934 |

El Bestiario abre con aproximadamente un **43 % menos de tiempo** en esta muestra, un **58 % menos de nodos DOM** y un **95 % menos de tiempo** en los recorridos calientes de sprites. Las demás cifras se presentan como observaciones del ensayo; no se promete el mismo cambio de carga o persistencia en otros equipos. El heap JS aumenta aproximadamente **0,55 MB (6,6 %)** por la caché adicional.

La memoria de cadenas UTF-16 calculada no equivale al heap real, ni incluye memoria nativa del navegador. La caché de categorías aumenta memoria para evitar recomposición repetida. No se impone un límite LRU arbitrario que haría recalcular sprites al recorrer el catálogo; el espacio usado por las combinaciones conocidas es finito. No se afirma una reducción global de RAM.

[Referencia secuencial](docs/stability-v3200/before.json) · [Después secuencial](docs/stability-v3200/after.json) · [Comparación intercalada](docs/stability-v3200/paired.json) · [Prueba funcional de navegador](docs/stability-v3200/browser-report.json).

[Captura anterior](docs/stability-v3200/bestiary-before.png) y [posterior](docs/stability-v3200/bestiary-after.png) del Bestiario cerrado tienen el mismo SHA-256; no cambió el diseño ni el resultado visible.


Tamaños finales en bytes: `www/js/app.js`: 615979, `www/js/mobile-ui.js`: 3258, `www/js/save-manager.js`: 17117, `www/sw.js`: 2303, `www/index.html`: 8812. App.js anterior: 613133 bytes. El archivo crece por los controles de recuperación; no se atribuye una reducción de descarga.

## Limpieza y límites

Se retiran dos variables sin lectores: preImportKey (duplicaba EMERGENCY_KEY) y lastDisplayRefresh (solo se asignaba). Ninguna función de juego se elimina. Los generadores históricos siguen siendo respaldo y consumidores de pruebas/laboratorios; no se borran por antigüedad. Tampoco se elimina CSS dinámico ni se incorporan frameworks o dependencias.

Android se comprueba mediante viewport vertical de 390 px, CPU simulada 4×, puente de exportación Capacitor simulado y pruebas de guardados. No se ha ejecutado una APK en un dispositivo físico, ni medido FPS, memoria nativa o batería. No se alteran orientación, pantalla completa ni el identificador de Capacitor.

## Reproducción y publicación

```sh
node --test tests/*.test.cjs
NODE_PATH=/ruta/a/node_modules node scripts/check-stability-browser-v3200.cjs
# app.js de referencia extraído de b08b892:
ATLAS_COMPARE_SOURCE=/ruta/app-anterior.js ATLAS_REPORT=/tmp/paired.json NODE_PATH=/ruta/a/node_modules node scripts/measure-stability-v3200.cjs
```

Las herramientas de navegador requieren Playwright y Chromium del entorno; no son nuevas dependencias del juego. El benchmark no modifica el repositorio salvo las rutas explícitas de resultados. GitHub Pages valida toda la suite mediante `Deploy El Gran Atlas`. La publicación se confirma en el resultado remoto del commit, no por terminar las pruebas locales.
