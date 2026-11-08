# El Gran Atlas 3.22.0 · Norteamérica completa

Norteamérica pasa de dos regiones jugables y doce celdas de contexto a **14 regiones jugables en las mismas 14 celdas**. Se conservan el radio, la malla, coordenadas, silueta, centrado, zoom, controles y navegación táctil. La expansión añade datos e ilustraciones y mantiene los algoritmos de observación, economía, inventario, Museo, fósiles, expediciones y formato de guardado.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio norteamericano](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-norteamerica-v3220.html) · [Actualizar conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3220.html)

## Conteos y fuente

Se utiliza el Excel previamente confirmado por el usuario, `Atlas_Fauna_Hexagonal_209_900_Especies.xlsx`, SHA-256 `5cd22412e6b251d8f02a90e4c8303e02946d5e5d26855589d2c6750649fe4350`, y los resultados de AM-01. La comparación automatizada independiente incorpora las filas reales de la hoja Fauna en `tests/fixtures/northamerica-fauna-excel.json`, con procedencia por fila. La geometría se contrasta además con la revisión 3.21.2 y la lista exacta de catorce celdas del Excel.

| Medida | Resultado |
| --- | ---: |
| Regiones norteamericanas jugables | **14** |
| Celdas norteamericanas | **14**, sin cambios geométricos |
| Presencias especie × región | **206** |
| Nombres científicos distintos en la fuente | **129** |
| Identidades taxonómicas jugables | **128** |
| Identidades reutilizadas del catálogo | **26** |
| Identidades nuevas | **102** |
| Catálogo completo del juego | 589 especies y 69 regiones |

**129 binomios de la fuente no equivalen a 129 especies diferentes:** `Pecari tajacu` (ESP-0411, Sonora) y `Dicotyles tajacu` (ESP-0167, Yucatán) se integran como una sola identidad, `na_esp_dicotyles_tajacu`. Se conservan las dos asignaciones norteamericanas y los dos IDs originales en su procedencia; las 206 filas no se reducen. Crear un segundo pecarí solo para alcanzar 129 entradas duplicaría una especie. La equivalencia ya estaba documentada en AM-01 y está probada explícitamente.

Alaska mantiene sus 17 asignaciones, Columbia Británica sus 11, sus IDs y su progreso. Sus 24 identidades distintas se conservan; también se reutilizan `eu_esp_0267` (Lagopus lagopus) y `af_xlsx_131_pandion_haliaetus`. La identidad de una especie es independiente del prefijo continental de su ID. Lobo, zorro, oso, alce, reno, puma y las demás compartidas no se vuelven a crear.

## Regiones y progresión

Todas exigen **Cartografía de Norteamérica**, conservar `north_america_map` y alcanzar el prestigio indicado. La cadena previa Navegación al Nuevo Mundo → Cartografía de Norteamérica, sus costes, recetas y condiciones permanecen intactos. El prestigio no se consume. No se abren regiones automáticamente: alcanzar el umbral permite pulsar Desbloquear región y después Viajar a Campo.

| Región | Asignaciones | Prestigio mínimo |
| --- | ---: | ---: |
| Alaska | 17 | 125 |
| Columbia Británica | 11 | 128 |
| Yukón | 14 | 131 |
| Bosques boreales de Canadá | 13 | 134 |
| Montañas Rocosas | 16 | 137 |
| Grandes Llanuras | 15 | 140 |
| Región de los Grandes Lagos | 17 | 143 |
| Bosques del este norteamericano | 17 | 146 |
| Costa del Pacífico | 14 | 149 |
| Desierto de Sonora | 13 | 152 |
| Sierra Madre | 11 | 155 |
| Costa del golfo de México | 11 | 158 |
| Península de Yucatán | 15 | 161 |
| América Central | 22 | 164 |
La curva continúa con incrementos de tres puntos, conservando Alaska 125 y Columbia Británica 128. La fuente del mapa y las investigaciones son accesibles mediante la cadena existente, sin depender de una región nueva bloqueada ni crear recetas o expediciones. Europa, Asia, África y todos los continentes futuros conservan sus datos; Sudamérica sigue sin regiones jugables.

## Identidad, clasificación y ecología

`northamerica-data-v3220.js` centraliza las 102 altas, doce regiones, identidad por binomio, equivalencia, procedencia y configuraciones de ejemplares. Una instalación aditiva comprueba colisiones y añade los registros una sola vez. No reescribe las 487 especies ni 57 regiones anteriores. La clasificación explícita se utiliza únicamente para altas nuevas; la ruta histórica sigue atendiendo las demás.

Se corrige la clasificación de origen del ajolote: **Amphibia / salamandras y tritones**, con branquias externas en su dibujo. El tecolote enano se clasifica como estrígido. Iguanas, tortugas acuáticas, boas y pecaríes conservan sus familias propias. `Lagopus lagopus` reutiliza Lagópodo común; no se confunde con `perdiz_nival = Lagopus muta`. Se mantienen las cinco rarezas de especies existentes que difieren del Excel, evitando cambiar encuentros en otros continentes. Para altas nuevas, el texto Muy raro se normaliza al tier interno Muy rara, sin alterar pesos globales.

**Decisiones y límites científicos:** se conserva el concepto de especie del Excel para `Dasypus novemcinctus` y `Spilogale gracilis`; no se crean subdivisiones regionales adicionales sin una autoridad y delimitación verificadas. Las revisiones taxonómicas de AM-01 quedan como antecedentes explícitos, no se presenta la planilla como una lista científica certificada. Los horarios, estaciones, hábitats individuales y paletas son configuración de juego razonada, no campos atribuidos al Excel. Los colibríes garganta rubí y zorzales maculados se limitan a primavera–otoño; las especies nocturnas y anfibios disponen de horarios crepusculares/nocturnos. Cada presencia tiene al menos una combinación de hábitat, horario y estación alcanzable.

Se conservan las asignaciones originales sin reinterpretar silenciosamente la geografía. Deben leerse con la escala amplia/ilustrativa de sus regiones: la marmota de Vancouver y el mapache de Cozumel representan subáreas insulares; el ajolote requiere el ambiente lacustre de la región mexicana; el conejo pigmeo requiere matorral/estepa montana. La tortuga de Sonora conserva el binomio de fuente `Gopherus agassizii`, cuyo alcance frente a `G. morafkai` continúa documentado como reserva científica de AM-01. Esta entrega verifica integración y acceso a las presencias del Excel; no afirma una validación externa nueva de todas sus distribuciones.

## Ilustraciones y ejemplares

Las 26 identidades reutilizadas conservan sus ilustraciones. La extensión SVG local cubre las 102 nuevas: usa el motor mamífero 3.19 cuando reconoce el taxón real y perfiles específicos por clase/familia para las demás. No se cambia el nombre científico por el de un animal parecido para acceder a un dibujo. No hay emojis animales, imágenes remotas, dependencias gráficas externas ni descargas durante un encuentro.

Los perfiles distinguen, entre otros, al berrendo, bisonte, zorrillos, mapaches/coatí, zarigüeyas, armadillo, monos americanos, perezoso, oso hormiguero, manatí, guacamayos, tucán, quetzal, colibríes, pavos, correcaminos, ajolote, tortuga pintada, iguana, aligátor, cascabeles y los tres peces nuevos. Las primitivas de una familia se comparten y se ajustan por género/especie. El laboratorio muestra la ruta/familia y permite comparar origen, región, grupo y ejemplares.

| Configuración nueva | Identidades |
| --- | ---: |
| Albino | 26 |
| Melánico | 4: coyote, jaguar, venado de cola blanca y ardilla gris |
| Dimorfismo sexual | 9 |
| Notable | 102 |
| Épico | 4: jaguar, bisonte, aligátor y quetzal |
| Excepcional | 2: jaguar y bisonte |
| Legendarios exclusivos nuevos | **0** |

Los nueve dimorfismos son pato joyuyo, ánade real, cardenal rojo, los dos colibríes, wapití, venado de cola blanca y los dos pavos. Se conservan las configuraciones anteriores de alce/reno y del resto del mundo. No configurar dimorfismo para otro taxón no afirma que carezca de diferencias sexuales biológicas: solo indica que no se habilitan más ilustraciones comparativas en esta versión. Notable mantiene un espécimen especial alcanzable para estudiar todas las especies hasta 5/5; no es una variante biológica. Las variantes usan exactamente las tasas, reglas y transformaciones existentes. No se modifica la velocidad de naturalistas ni la probabilidad global de avistamiento.

## Validación realizada

- **242 pruebas automáticas aprobadas.** Incluyen cotejo de las 206 filas del Excel, ausencia de duplicados, 128 identidades canónicas, 102 altas/26 reutilizaciones, clasificación, ecología, progresión y preservación de todo el catálogo previo.
- Los contratos históricos siguen comprobando las funciones de observación/economía/guardado y 3.473 combinaciones de ilustración anteriores. Las pruebas históricas de catálogo usan su inventario anterior; las pruebas nuevas y el laboratorio de Atlas ejecutan el inventario completo. No se sustituyen snapshots de comportamiento para aceptar resultados diferentes.
- **56 casos de mapa y viaje:** catorce regiones en cada resolución 320 × 640, 360 × 740, 390 × 844 y 412 × 915. Continente completo dentro del panel, botón de acción sobre el dock, sin desbordamiento horizontal ni scroll vertical adicional. Selección, desbloqueo sin gasto de prestigio y viaje a Campo comprobados.
- Observación manual mediante la interfaz en las catorce regiones y naturalistas mediante el tick real; Cuaderno, cinco etapas y publicación única de una especie nueva; Bestiario de 589 entradas y filtros; sexos y variantes.
- **240 SVG de variantes analizados como XML**, además de paridad de rutas producción/laboratorio para las especies y configuraciones incluidas, y gestos táctiles reales enviados a Chromium.
- Exportación/importación con progreso nuevo y anterior, incluidos inventario, monografías, regiones, sexo, variantes, Legendarios, Museo y expediciones.
- Juego y laboratorio navegables después de desconectar la red. **Cero errores JavaScript** en los recorridos de navegador.

[Resultados móviles](docs/norteamerica-v3220/browser-report.json) · [Mapa a 320 px](docs/norteamerica-v3220/map-320.png) · [Mamíferos](docs/norteamerica-v3220/mammals-review.png) · [Aves](docs/norteamerica-v3220/birds-review.png) · [Herpetofauna](docs/norteamerica-v3220/herps-review.png) · [Peces](docs/norteamerica-v3220/fish-review.png).

## Rendimiento

No se añaden operaciones al tick ni se altera la caché de sprites. El catálogo regional se instala al arrancar y el dibujo mantiene la caché existente. La precarga completa ocupa aproximadamente **3,39 MB sin comprimir**, incluidos laboratorios históricos y el nuevo.

Se midió el Bestiario completo conocido con Chromium y ralentización de CPU ×4: en la muestra 3.21.2 presentó 4.282 ms en apertura fría / 2.128 ms caliente para 487 especies; 3.22.0 presentó 3.103 / 2.134 ms para 589. La serialización del guardado de la muestra nueva promedió 0,49 ms y 29.529 bytes. Son muestras puntuales sujetas a caché y GC, no una garantía de tiempos en teléfonos ni una prueba de mejora general. [Mediciones, memoria y condiciones](docs/norteamerica-v3220/performance-report.json).

Las resoluciones y CPU son emuladas en Chromium; no se ha realizado una prueba física en un teléfono Android. La compilación nativa se verifica por GitHub Actions.

## Guardados y actualización PWA

Se conserva `gran_atlas_v05`, el formato, el app ID de Android y los plugins de exportación/importación. Las nuevas regiones no se agregan a `regionUnlocked` hasta que el jugador las abre. Las configuraciones nuevas de sexo añaden únicamente sus entradas iniciales, preservando las observaciones anteriores.

Se ha reproducido una instalación real **3.21.2 con dos celdas jugables** y otra ventana abierta. La recarga normal sigue sirviendo su revisión coherente. El acceso **actualizar-v3220.html**, cuyo nombre nuevo evita la página de actualización antigua ya cacheada, descarga el conjunto completo, exige cerrar otras ventanas, respalda el JSON byte por byte y activa la nueva revisión con consentimiento del botón. Tras volver al juego aparecen las 14 regiones; las nuevas siguen sin abrir. Los datos históricos y el funcionamiento posterior sin conexión se conservan.

El actualizador nuevo consulta dinámicamente la versión publicada, de modo que una revisión futura puede prepararse desde ese acceso sin quedar atada a una cadena 3.22.0. No hay recarga forzada de una sesión activa ni borrado del almacenamiento. [Prueba de actualización](docs/norteamerica-v3220/upgrade-report.json) · [Antes](docs/norteamerica-v3220/upgrade-before.png) · [Después](docs/norteamerica-v3220/upgrade-after.png).

## Android y publicación

Capacitor mantiene `com.elgranatlas.naturaleza.beta314` y muestra Gran Atlas Beta 3.22.0. El workflow establece también `versionName=3.22.0` y `versionCode=32200` en el proyecto Android generado. La versión de la exportación JSON coincide.

Se publican mediante los workflows **Deploy El Gran Atlas** y **Android APK de prueba**. Sus resultados y el artefacto se comprueban para el commit de implementación antes de informar éxito. El enlace esperado del artefacto, una vez generado, es `releases/download/v3.22.0/El-Gran-Atlas-Beta-3.22.0-debug.apk`.

El APK es de depuración: las firmas temporales de distintos runners pueden diferir. Mantener el mismo app ID y el formato de guardado no recupera una clave privada de firma anterior. No se ha cambiado el sistema de firma ni se garantiza actualización directa sobre cualquier APK antiguo; se conserva el flujo de respaldo/exportación e importación y la aplicación anterior no debe desinstalarse para resolver un conflicto de firma. [Condiciones Android y firma estable](README_RESPALDOS_ANDROID.md).

## Archivos y reproducción

- Datos y procedencia: `www/js/northamerica-data-v3220.js`, `scripts/build-northamerica-v3220.py`, fixture Excel y `docs/norteamerica-v3220/source-presences.json`.
- Integración: bloque aditivo y dos rutas SVG en `www/js/app.js`; doce anclajes en `atlas-geography-v3211b.js`, conservando la geometría. La UI y el controlador del Atlas no se modifican.
- Arte/laboratorio: `northamerica-art-v3220.js`, `laboratorio-norteamerica-v3220.html`, catálogo generado y controlador de filtros. Se regeneran los snapshots de laboratorio que incorporan las rutas de producción.
- Versión/actualización: index, package/Capacitor, metadatos de respaldo, registro del worker, manifest de versión, nuevo acceso/actualizador y precarga offline.
- Pruebas: suite específica, fixture independiente, verificaciones de navegador/actualización/rendimiento y expectativas de versión/cantidad para las ampliaciones expresamente autorizadas. No cambian las funciones de mecánicas protegidas.
- Publicación: workflows Pages/Android y script de metadatos de versión nativa.

```sh
python3 scripts/build-northamerica-v3220.py
node scripts/build-atlas-lab-v3211.cjs
node scripts/build-northamerica-lab-v3220.cjs --check
node --test tests/*.test.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-northamerica-browser-v3220.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-pwa-upgrade-v3220.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/benchmark-northamerica-v3220.cjs
```

Las herramientas de navegador requieren Playwright y Chromium; las comparaciones de actualización/mediciones utilizan la revisión Git `07a6f06`. El generador de datos emplea las filas auditadas y confirmadas de AM-01; las pruebas cotejan aparte una extracción directa del XLSX. Los informes de AM-01 conservan sus cifras históricas y no se reinterpretan como el inventario posterior a la expansión.
