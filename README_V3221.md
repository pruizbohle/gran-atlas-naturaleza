# El Gran Atlas v3.22.1 — Norteamérica pulida

AM-03 revisa la incorporación 3.22.0 antes de iniciar otro continente. Se mantienen **14 regiones, 206 presencias, 128 identidades canónicas y 589 especies mundiales**. No se añade fauna, regiones, mecánicas ni Legendarios.

## Resultado artístico

Se inspeccionaron las **128 especies renderizadas**, incluidas las **26 reutilizadas**. La clasificación inicial fue A: **31**, B: **31**, C: **63**, D: **3**. Se conservan los 31 dibujos A, se mejoran 31 B y se corrigen 66 C/D. Las 97 intervenciones cambian geometría y detalles, no solamente metadatos o color. El resultado final se valora como apto para el estilo móvil del juego; no es una certificación zoológica externa.

La [auditoría por especie](docs/norteamerica-v3221/ART-AUDIT.md) contiene la lista completa, problema, gravedad y corrección. Su [registro JSON](docs/norteamerica-v3221/art-audit.json) y los [hashes de SVG renderizados](docs/norteamerica-v3221/render-inventory-after.json) permiten comprobar qué cambió. Los 26 sprites reutilizados y los cinco nuevos que ya eran correctos conservan exactamente sus SVG normales, variantes y sexos.

Los tres errores D eran el tapir de Baird con la silla blanca del tapir malayo, el búho moteado con ojos amarillos y la tortuga pintada con anatomía terrestre. Se corrigen junto con perfiles de berrendo, bisonte, cérvidos, cánidos, felinos, prociónidos, pequeños mamíferos, primates, perezoso, oso hormiguero, manatí, aves, herpetofauna y peces que detalla la tabla. Las familias de motores existentes se reutilizan; el nuevo módulo se limita a una lista explícita de 97 identidades `na3220`.

No se detectaron errores C/D pendientes tras revisar las láminas finales. Se conserva la simplificación gráfica del juego: poses laterales, escala de tarjeta uniforme, colores amortiguados y contornos claros. El realismo y detalles finos admiten mejoras futuras.

## Evidencia visual

Las siguientes láminas se generaron con el mismo catálogo y enrutamiento de SVG de producción y se abrieron para inspección visual:

- [Mamíferos antes](docs/norteamerica-v3221/before-mammals.png) / [después](docs/norteamerica-v3221/after-mammals.png): 64 especies.
- [Aves antes](docs/norteamerica-v3221/before-birds.png) / [después](docs/norteamerica-v3221/after-birds.png): 37 especies.
- [Reptiles y anfibios antes](docs/norteamerica-v3221/before-herps.png) / [después](docs/norteamerica-v3221/after-herps.png): 23 especies.
- [Peces antes](docs/norteamerica-v3221/before-fish.png) / [después](docs/norteamerica-v3221/after-fish.png): cuatro especies.
- [97 comparaciones antes/después](docs/norteamerica-v3221/before-after.png).
- [37 especies de morfologías similares](docs/norteamerica-v3221/similar-morphologies.png), incluidas las reutilizadas.
- [Dimorfismo](docs/norteamerica-v3221/dimorphism.png), [albinos](docs/norteamerica-v3221/albinos.png), [melánicos](docs/norteamerica-v3221/melanics.png), [épicos y excepcionales](docs/norteamerica-v3221/epic-exceptional.png).
- [Los tres casos D en el laboratorio](docs/norteamerica-v3221/lab-severe-before-after.png).

No se utilizan imágenes externas, emojis como sprites ni recursos gráficos de internet.

## Variantes y dimorfismo

Se conserva exactamente la configuración 3.22.0 de las 102 identidades nuevas: **26 albinos, cuatro melánicos, nueve dimorfismos, 102 Notables, cuatro Épicos y dos Excepcionales**. No se añaden variantes ni se cambian probabilidades o recompensas.

Las láminas incluyen también las especies reutilizadas: **47 albinos, cinco melánicos, once pares de sexo** y ocho identidades con Épico/Excepcional. Los nueve dimorfismos de AM-02 son ánade real, wapití, pato joyuyo, colibrí garganta rubí, venado de cola blanca, colibrí de Ana, cardenal, guajolote silvestre y pavo ocelado. Se distinguen astas, abanico y ornamentos cuando corresponde, además del plumaje. Alce y reno conservan su ilustración previa. Las variantes mantienen contornos, detalles y anatomía; se conserva la transformación central de pigmentación y la caché de producción. Se validaron **382 SVG** normales, especiales y combinaciones de sexo configuradas mediante el DOMParser del navegador.

## Integridad y funcionamiento

No se cambian `northamerica-data-v3220.js`, `app.js`, la malla, coordenadas, otros continentes ni los motores globales. [Hashes de los sistemas protegidos](tests/fixtures/northamerica-protected-v3220.json) verifican que permanecen idénticos a `1daf805`.

No se encontraron identidades duplicadas nuevas. **Pecari tajacu / Dicotyles tajacu** siguen asociados a un único ID: 129 nombres de origen representan 128 identidades. Las etiquetas de familia del laboratorio completan metadatos que faltan en los registros antiguos, sin alterar el catálogo global.

La [auditoría funcional](docs/norteamerica-v3221/functional-report.json) enumera las 206 presencias y una combinación válida de región, hábitat, horario y estación por cada una. Las pruebas ejecutan **412 encuentros efectivos**, manual y automático por presencia, con el selector ponderado de producción. El argumento de búsqueda garantizada se utiliza solamente en esa prueba para evitar que el azar produzca «sin avistamiento»; no cambia el juego.

Se comprueban viajes, requisitos, cuaderno, Bestiario de 589 especies, registro de variantes, persistencia, grupos sin reemplazo y multiplicadores en las 14 regiones. El censo manual conserva ×3 y el automático ×2; el cupo automático de 100 registros por especie/hora se mantiene. La generación de SVG no consume aleatoriedad ni modifica el estado de partida. Las pruebas de cinco etapas y monografía siguen pasando.

La curva permanece intacta:

| Región | Prestigio acumulado | Fauna |
|---|---:|---:|
| Alaska | 125 | 17 |
| Columbia Británica | 128 | 11 |
| Yukón | 131 | 14 |
| Bosques boreales de Canadá | 134 | 13 |
| Montañas Rocosas | 137 | 16 |
| Grandes Llanuras | 140 | 15 |
| Región de los Grandes Lagos | 143 | 17 |
| Bosques del este norteamericano | 146 | 17 |
| Costa del Pacífico | 149 | 14 |
| Desierto de Sonora | 152 | 13 |
| Sierra Madre | 155 | 11 |
| Costa del golfo de México | 158 | 11 |
| Península de Yucatán | 161 | 15 |
| América Central | 164 | 22 |

Se mantienen Navegación al Nuevo Mundo, Cartografía de Norteamérica y el mapa fabricado. Los umbrales se prueban justo antes y al alcanzarlos; el prestigio no se consume. No se modifica ninguna investigación o receta.

## Móvil, partidas y PWA

En Chromium con interacción táctil se probaron **320×640, 360×740, 390×844 y 412×915**: 56 selecciones/viajes en Atlas, 56 comprobaciones de Campo y 16 casos de variantes. El continente completo y su acción principal quedan visibles; Campo muestra el animal y el botón por encima de la navegación. No hay desbordamiento horizontal. Se prueba desplazamiento táctil tras aumentar zoom y las 14 exploraciones manuales. El laboratorio supera otros ocho casos móviles, incluida comparación a 120 px.

[Informe del navegador](docs/norteamerica-v3221/browser-report.json) · [laboratorio móvil](docs/norteamerica-v3221/lab-mobile-report.json) · [Campo 320](docs/norteamerica-v3221/field-320.png) · [mapa 320](docs/norteamerica-v3221/map-320.png) · [mapa 412](docs/norteamerica-v3221/map-412.png).

Las actualizaciones reales de service worker desde [3.21.2](docs/norteamerica-v3221/upgrade-3.21.2-report.json) y [3.22.0](docs/norteamerica-v3221/upgrade-3.22.0-report.json) verifican: revisión antigua coherente hasta la aceptación explícita, bloqueo con otra ventana abierta, copia exacta del respaldo, conservación del progreso y funcionamiento offline posterior. Se conserva `gran_atlas_v05`, importación/exportación, monografías, variantes, inventario, Museo, investigaciones, prestigio y expediciones. No se fuerzan reinicios. El actualizador nuevo utiliza el contrato seguro existente; las rutas anteriores siguen aceptadas.

Las pruebas móviles y de rendimiento son **emuladas en Chromium**, no ejecutadas sobre un teléfono Android físico. El APK se compila mediante el workflow existente y conserva `com.elgranatlas.naturaleza.beta314`, exportación/importación nativas y `versionCode=32201`. Es un APK debug: actualizar una instalación existente también exige la misma clave de firma; no se garantiza esa continuidad entre compilaciones efímeras de Actions. Se mantiene la recomendación de respaldo de [README_RESPALDOS_ANDROID.md](README_RESPALDOS_ANDROID.md).

## Laboratorio y rendimiento

Se actualiza la página existente, sin cargar `app.js` ni leer o escribir partidas. Incluye región, grupo, familia, motor, gravedad inicial, origen, nombre común/científico, variantes, sexo, tamaño 64/80/120 px, antes/después y lámina de similitudes. Abre **32 tarjetas** por página y permite 64 o las 128; la navegación recorre todo el catálogo. La instantánea 3.22.0 vive en módulos exclusivos del laboratorio. Los módulos de comparación no se cargan en el juego.

Los datos brutos y el método de medición están en [performance-report.json](docs/norteamerica-v3221/performance-report.json). Se compara con 3.22.0 usando el mismo catálogo de 589 especies, una sesión de CPU ×4 y orden ABBA. Se conservan las mediciones exploratorias que motivaron simplificar el sombreado. Se reducen los recortes SVG a las cinco serpientes que realmente los necesitan. En esta ejecución, el Bestiario completo arroja una mediana caliente de **1.923 ms** frente a **3.355 ms** de 3.22.0 con CPU ×4; los tiempos varían y no se extrapolan a teléfonos físicos. La serialización de la misma partida de 29.529 bytes queda en aproximadamente **0,98 ms**, y recorrer los 128 SVG ya en caché tarda **0,37 ms**. El laboratorio inicial baja de **4.135 a 1.430 nodos** (128 a 32 tarjetas); la vista completa sigue disponible. Los valores de heap son instantáneas con basura pendiente de GC, no una medición de memoria retenida. No se añaden dependencias, procesos periódicos ni trabajo al bucle de observación; se conserva la caché del motor.

## Reproducir la validación

Se ejecutó la suite completa: **250/250 pruebas aprobadas**, además de sintaxis, los generadores reproducibles y las pruebas de navegador. Las ocho pruebas nuevas incluyen integridad de los sistemas protegidos, cambios geométricos reales, exclusión de especies ajenas, variantes, los nueve dimorfismos, las 412 observaciones, grupos/censos, persistencia y recursos offline. Las fixtures del Excel no se modifican.

```sh
node --test tests/*.test.cjs
node scripts/build-atlas-lab-v3211.cjs --check
node scripts/build-northamerica-lab-v3220.cjs --check
node scripts/report-northamerica-v3221.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/review-northamerica-v3221.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/review-northamerica-variants-v3221.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-northamerica-browser-v3221.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-northamerica-lab-mobile-v3221.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-pwa-upgrade-v3221.cjs
ATLAS_UPGRADE_FROM=3.22.0 NODE_PATH=/ruta/a/playwright/node_modules node scripts/check-pwa-upgrade-v3221.cjs
NODE_PATH=/ruta/a/playwright/node_modules node scripts/benchmark-northamerica-v3221.cjs
```

Los scripts de navegador requieren Chromium en `/usr/bin/chromium` y Playwright; no son dependencias del juego. La comparación histórica de navegador requiere los commits `07a6f06` y `1daf805`; las pruebas Node de CI utilizan fixtures y no dependen de un checkout profundo.

## Publicación y archivos

Se actualizan versión visible, consultas de scripts, metadatos Android, exportación, manifiesto de revisión, caché del service worker y recursos offline. Los workflows **Deploy El Gran Atlas** y **Android APK de prueba** ejecutan las pruebas y las comprobaciones del módulo nuevo antes de publicar.

[Lista de archivos modificados](docs/norteamerica-v3221/FILES.md).

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/).
- [Actualización conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3221.html).
- [Laboratorio artístico](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-norteamerica-v3220.html).
- [Workflows y resultados reales](https://github.com/pruizbohle/gran-atlas-naturaleza/actions).
- [Release 3.22.1](https://github.com/pruizbohle/gran-atlas-naturaleza/releases/tag/v3.22.1): el enlace al APK es válido cuando el workflow lo haya generado.

La creación de un commit no prueba la publicación: el resultado real de Actions, el commit publicado y la comprobación del APK descargado se verifican al cerrar la entrega. `scripts/verify-northamerica-apk-v3221.py` valida la versión del manifiesto binario, el ID de aplicación, los plugins nativos y cada archivo web del APK contra producción.
