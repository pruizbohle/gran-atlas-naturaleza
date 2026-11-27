# ART-CAMP-02 · Continuidad

Rama artística `art-camp-02` desde ART-OBJ-13 `ec84903d20ebfa042e16fc1bfb0a936f99dde12e`. La punta remota de MEC-09D verificada es `d7cc4cb30b44656f922c2413a020ea93ee03c989`, ancestro de ambas ramas.

## Archivos recibidos y referencia

La carpeta compartida no contiene adjuntos de esta tanda. Los 48 PNG accesibles de ImageGen coinciden byte por byte con maestras de ART-OBJ-12 y ART-OBJ-13. Los archivos de biblioteca disponibles corresponden a ART-OBJ-12. Se incorpora al laboratorio como referencia provisional `www/img/campamento-fondo.webp`, el fondo de la beta de 900 × 1350. Este fondo ya tiene un muelle, una terraza de excavación y un fogón pintados. Se usa para estudiar las anclas y el encaje.

| Original solicitado | Referencias | Estado |
| --- | --- | --- |
| Fondo | Fondo de la nueva tanda | Falta el archivo original |
| Astillero I–V | `shipyard-1` a `shipyard-5` | Faltan los cinco originales |
| Caravana I–IV | `caravan-1` a `caravan-4` | Faltan los cuatro originales |
| Caravana V | `caravan-5` | Generada e integrada |
| Taller I–V | `workshop-1` a `workshop-5` | Generadas e integradas · `17182a32` |
| Excavaciones I–V | `excavations-1` a `excavations-5` | Generadas e integradas · `1f55d33d` |
| Prospecciones I–V | `surveys-1` a `surveys-5` | Generadas e integradas · `7abd255d` |
| Campamento central I–V | `central-camp-1` a `central-camp-5` | Generadas e integradas como etapas visuales |

## Laboratorio

El catálogo y el mapa leen el mismo manifiesto. Las seis anclas se ajustaron al fondo de la beta. La validación contra el fondo y los originales nuevos requiere esos archivos. El laboratorio local se abre en [http://localhost:8000/art-camp-02/](http://localhost:8000/art-camp-02/) al ejecutar `python -m http.server 8000 --directory www`.

Próximo paso. Recuperar el fondo de la tanda y los nueve originales reservados. Cotejar sus anclas con las 21 etapas nuevas antes del cierre.

## Caravana V

Se generó y conectó `caravan-5` en el catálogo, la composición, el mapa de la beta y la ficha de instalación. La maestra es `maestras/caravan-5.png`, con WebP de 384 y 768 px. La casa mercantil mantiene el carro cubierto y añade un depósito con rampa. El encaje con Caravana IV queda pendiente de recuperar esa lámina.

## Taller I–V

Integradas las cinco etapas `workshop-1` a `workshop-5`. El banco de roble, el frente abierto y la cubierta a dos aguas se mantienen en la evolución. El microscopio caracteriza el nivel III, la bancada óptica el IV y las dos estaciones visibles el V. Dos maestras PNG, diez WebP y dos pruebas de correspondencia y caché aprobadas.

## Publicación inicial

La revisión inicial de Sites incluye el fondo provisional, la matriz y Caravana V. [Laboratorio privado](https://el-gran-atlas-art-camp-02.muddyroadrunner17.chatgpt.site/art-camp-02/)

Commits de arranque `22e31cb5` (laboratorio), `9acb66da` (conexión a beta y caché) y `09dad7b2` (Caravana V).

## Excavaciones I–V

Integradas `excavations-1` a `excavations-5`. La fosa conserva sus estratos conforme se añaden escalera, tamiz, andamios, clasificación e instituto. Dos maestras y diez WebP. Se limpió la neblina de alfa de la plancha sin recortar las terrazas visibles. El nivel V se revisó en la composición provisional, donde la terraza pintada sigue visible detrás.

## Prospecciones I–V

Integradas `surveys-1` a `surveys-5` con dos maestras y diez WebP. Los trípodes y la mesa de mapas evolucionan a la estación topográfica y al gabinete mineralógico. Se ajustó el recorte entre las etapas III y IV alrededor de las cuerdas y el alero. Se unificó la posición de las etiquetas del juego con las anclas del laboratorio y se aprobó la prueba de combinación mixta.

## Campamento central I–V

Integradas `central-camp-1` a `central-camp-5` en el laboratorio. El fogón y los troncos pasan del refugio a la sede con mesa cartográfica y biblioteca. El juego muestra Fogón como etapa visual fija. Las cinco opciones del laboratorio viven en memoria. Dos maestras y diez WebP.

## Estado de encaje

Cobertura de esta revisión. 21 etapas nuevas, 42 WebP, nueve ranuras reservadas y un fondo provisional. Pasaron las 30 selecciones de nivel del catálogo, incluida la combinación mixta, y las comprobaciones de alfa, dimensiones, márgenes, caminos y huellas para las 21 imágenes disponibles. El [plano de revisión](encaje-v.webp) muestra las cinco etapas V disponibles juntas. La conexión real de los muelles al lago y la comparación definitiva de las terrazas requieren los originales. El navegador compartido pidió iniciar sesión en Sites.

Los recortes y escalas se reproducen con `python scripts/prepare-art-camp-02.py <sector>`. Cada maestra y su asignación quedan en `maestras/` y `planchas.json`. Tras actualizar los archivos en el manifiesto, reconstruir la revisión con `node scripts/build-naturalist-release.cjs --write`.

## Verificación de esta revisión

- Commit artístico más reciente `a6fe8fff1165c7df27be48e1e1e4ebd402db02b8`.
- Revisión beta `gran-atlas-v5.6.9-naturalist-521343d9e6e7`. Huellas verificadas para los 42 WebP de instalaciones y el fondo de referencia.
- 216 pruebas aprobadas entre ART-CAMP-02, ART-OBJ-12, ART-OBJ-13, MEC-02, MEC-09D, actualización PWA y respaldos. Se mantuvieron los archivos de reglas MEC-02 y del sistema de guardado.
- Despliegue privado de revisión 2 de Sites `appgdep_6b09ca8812e48191998ff566915ed7eb`. [Abrir laboratorio](https://el-gran-atlas-art-camp-02.muddyroadrunner17.chatgpt.site/art-camp-02/)

## Revisión en Chromium local

La revisión local se completó a 390 y 1280 px con los archivos de la beta. Se verificaron las 30 posiciones del catálogo, la ampliación de Caravana V, una combinación mixta, los modos móvil y escritorio, el zoom al 150 % y la restauración a nivel I. El plano y la ficha del Taller III mostraron el mismo WebP después de recargar una partida de prueba. El plano de la beta mantuvo Fogón como única etapa del Campamento central.

El usuario indicó que adjuntará los diez originales. La revisión de encaje del fondo, los muelles y las etapas iniciales de Caravana se realizará con esos archivos.
