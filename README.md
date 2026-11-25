# El Gran Atlas · Catálogo mundial ilustrado

Juego naturalista y catálogo ilustrado de la fauna del mundo. Funciona en el navegador como PWA, también sin conexión, y tiene una versión Android preparada con Capacitor. La partida se guarda en el propio dispositivo.

**Versión publicada: 5.5.1** · **Compilación de trabajo: 5.6.9 Beta — MEC-09A** (revisión técnica de la versión de consolidación), canal beta (rama `mec-09a/technical-audit`, sobre MEC-08, sin fusionar a `main`)

[Jugar](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio gráfico](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Galería de relictos](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-relictos.html) · [Actualizar la PWA conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## V5.6.9 Beta — MEC-09A: auditoría técnica (en revisión)

Es la primera etapa de consolidación: no añade mecánicas nuevas.

- **Hallazgos de MEC-08:**
  - los eventos comprueban la caducidad antes que el cumplimiento y usan la fecha efectiva de cada actividad;
  - los contadores se escriben en la misma transacción que la actividad;
  - un registro permanente impide repetir ediciones de eventos;
  - aceptar un encargo conserva la oferta presentada;
  - la viabilidad compara la meta concreta con lo disponible;
  - el foco ya no se pierde tras las acciones.
- **Estabilidad:**
  - una partida local dañada se recupera de forma determinista;
  - se corrigió un bucle sin límite que hacía agotar la suite `global-v3240` (de más de 600 s a unos 39 s).
- **Pruebas:**
  - los 216 fallos históricos están clasificados por causa raíz, con pruebas equivalentes del comportamiento vigente en el catálogo completo;
  - se revisaron migraciones con partidas auténticas de 5.4 a MEC-08, partidas dañadas, transacciones, ingresos, reservas e integridad de catálogos;
  - la suite pasa a 1.081 pruebas, 860 aprobadas y 0 regresiones.

Informe completo: [docs/mec09a](docs/mec09a/README.md). No se generó APK.

## V5.6.8 Beta — MEC-08 (auditada; hallazgos corregidos en MEC-09A)

La Sociedad gana un sistema completo de **reconocimientos y encargos**, construido sobre los motores existentes:

- **74 logros nuevos o actualizados** para el catálogo completo (1.000 especies y 125 regiones), más 10 medallas conmemorativas. Los ids y medallas históricos se conservan como reconocimientos intermedios; hay filtro por nivel (Bronce, Plata, Oro y Platino) y títulos destacables.
- **12 encargos permanentes nuevos** en cuatro líneas: coleccionables, Taller, récords y Campamento. Solo se ofrecen si la función correspondiente es accesible.
- **Correspondencia científica renovable** (13 plantillas) y **proyectos institucionales** (7) sobre un solo motor:
  - objetivos incrementales con línea base, o de posesión sin consumir;
  - recompensas por el libro de ingresos;
  - cobro atómico y único;
  - sin caducidad ni penalizaciones.
- **Diez eventos anuales** con un calendario local: Año Nuevo, Darwin, equinoccios, Día de la Tierra, Biodiversidad, Océanos, la Gran Exposición (ficticia), Noche de las Criaturas y Navidad del Naturalista. Cada uno tiene su encargo por edición, y algunos aplican modificadores temporales en una capa separada que se fija al iniciar las actividades.
- **Correcciones de MEC-07:**
  - migraciones como reconstrucción documental por rutas;
  - evidencias pendientes por región;
  - conductas con el sexo del ejemplar observado;
  - descripciones instrumentales prudentes;
  - registro paginado con búsqueda;
  - una sola fuente de procedencias;
  - normalización robusta.

Informe completo: [docs/mec08](docs/mec08/README.md). No se generó APK.

## V5.6.7 Beta — MEC-07 (observaciones corregidas en MEC-08)

La observación zoológica gana un registro de **récords naturales** y **conductas extraordinarias**: 25 hitos y 20 conductas, sobre especies reales del catálogo.

- **Hitos:** velocidad, longitud, altura, masa, tamaño mínimo, profundidad, duración, altitud, migración, longevidad, frecuencia y precisión.
- **Conductas:** herramientas, construcción, cortejo, camuflaje, planeo, caza cooperativa y otras.

Así funcionan:

- Salen de los avistamientos reales (manuales, automáticos, offline y sondeos), con una evaluación por especie observada.
- Usan un generador aislado que no altera las probabilidades históricas.
- Guardan la mejor marca global y regional, los hitos y las evidencias con validación instrumental.
- Se integran en el Cuaderno y el Bestiario.

El hito del guepardo se migra sin cambios. También corrige MEC-06: fuentes del índice, acceso cartográfico, cámara voluntaria, ingresos del Museo y normalización de instrumentos.

Configuración en `www/js/mec07-natural-records.js`; informe en [docs/mec07](docs/mec07/README.md). Valores provisionales para BAL-01.

## V5.6.6 Beta — MEC-06 (aprobada en auditoría externa)

Los artefactos, componentes y materiales tienen funciones reales, conectadas con el Taller, el Museo y las expediciones:

- **Artefactos**: los 15 de la beta y los 5 históricos se ubican en la vitrina, el Taller, el Campamento o el almacén, en una sola ubicación a la vez.
- **Análisis de muestras**: usan los 27 materiales animales.
- **Astronomía y cartografía**: cartas estelares y partes de mapa.
- **Fotografía**: revelado de placas y cámara en expediciones, con procedencia real.
- **Experimentos eléctricos** encadenados.
- **Demostraciones** en el Museo, con espera.
- **Atractivo de artefactos exhibidos**: ingreso nuevo y separado del zoológico.
- **Instrumentos de expedición**: sus condiciones se fijan al zarpar.

El Taller usa sus cinco niveles para los componentes, los artefactos y los estudios nuevos; las recetas históricas no cambian.

Corrige MEC-05:

- transacciones de exhibición;
- estados reales de vitrina;
- conocimiento de expediciones sin efecto de equipar a último momento, con recibo desglosado;
- fichas con la geografía de MEC-04;
- registro regional de avistamientos.

Incluye una auditoría funcional del inventario en CSV. Configuración en `www/js/mec06-workshop.js`; informe en [docs/mec06](docs/mec06/README.md). Valores provisionales para BAL-01.

## V5.6.5 Beta — MEC-05 (aprobada en auditoría externa)

El Museo pasa a ser un sistema de especialización. Cada uno de los cinco gabinetes de coleccionables da beneficios propios en actividades del Atlas:

- **Botánica**: hallazgos y expediciones botánicas.
- **Geología**: prospecciones geológicas y especializadas.
- **Oceanografía**: hallazgos marinos y expediciones oceanográficas.
- **Historia**: descuento en piezas históricas y expediciones arqueológicas.
- **Historia natural y exploración**: conocimiento y reconocimientos.

Las 32 colecciones forman exposiciones temáticas con cuatro hitos. Las bonificaciones son aditivas, tienen tope y dependen de las piezas expuestas ahora: desaparecen al retirarlas. Las actividades temporizadas las fijan al iniciar.

Los niveles IV y V del Museo exigen los rangos 11 y 14; las partidas que ya los tenían los conservan. El ingreso zoológico no cambia y se muestra desglosado.

También corrige MEC-04: el indicador de investigaciones cuenta solo el catálogo, la Sociedad usa regiones visitadas (con cuatro estados de región) y la auditoría de dependencias exige fuentes reales. Explica, además, la diferencia entre 113 y 125 regiones: los catálogos GM-06/GM-07 no se cargaban en el arnés de pruebas.

Configuración en `www/js/mec05-museum.js`; informe en [docs/mec05](docs/mec05/README.md). Valores provisionales para BAL-01.

## V5.6.4 Beta — MEC-04 (aprobada en auditoría externa)

La Sociedad tiene 20 rangos con requisitos variados (prestigio, especies, monografías, coleccionables, expediciones, investigaciones, ingresos históricos del libro, regiones y colecciones). El ascenso es explícito, permanente y paga una recompensa única. Los rangos desbloquean los niveles IV y V del Campamento (I–III siguen libres), ofertas de la Caravana, encargos y cuatro categorías de financiación sin cobros dobles; el Museo queda preparado para MEC-05. Las partidas anteriores reciben el rango que sus registros justifican, sin pagos inventados.

También corrige MEC-03 (hallazgos ambientales sin avistamiento, contexto manual, automático y offline, ofertas regionales con piezas «Mundial», cobertura real del comercio) y separa origen, hallazgo y compra de cada pieza: 110 de las 131 piezas «Mundial» tienen ahora origen concreto, y hay 5 destinos de expedición y 3 yacimientos nuevos en Asia, Sudamérica, Oceanía y Polos. Valores provisionales para BAL-01. Informe en [docs/mec04](docs/mec04/README.md).

## V5.6.3 Beta — MEC-03 (auditada; observaciones corregidas en MEC-04)

Retira el drop experimental de coleccionables por especie y da a cada una de las 431 piezas fuentes según su naturaleza:

- campo, separado en exploración ambiental (por región y bioma) y observación animal (por tipo de animal);
- expediciones, con modalidades botánica, oceanográfica, arqueológica, de reconocimiento y extraordinaria;
- comerciantes y coleccionistas de la Caravana: compra, intercambio de repetidos, solicitudes y ofertas rotativas persistentes;
- excavaciones;
- prospecciones geológicas, regionales y especializadas;
- preparaciones del Taller;
- encargos de coleccionistas;
- eventos, preparados pero desactivados.

Las piezas expuestas y la última unidad quedan protegidas. Las operaciones compuestas son ahora atómicas: correcciones de MEC-02. Configuración por pieza en `www/js/mec03-catalog.js`; informe y matriz CSV en [docs/mec03](docs/mec03/README.md). Valores provisionales; no se generó APK.

## V5.6.2 Beta — MEC-02 (aprobada en auditoría externa)

Convierte el Campamento en un centro de operaciones evolutivo. Astillero, Caravana, Taller, Excavaciones y Prospecciones tienen cinco niveles cada uno, definidos en una sola configuración (`www/js/mec02-camp.js`), y cada nivel cambia algo que el motor ejecuta: más expediciones, rutas, excavaciones o prospecciones simultáneas; expedición ampliada; compra por lotes; fabricación múltiple y con subcomponentes; estudios en lote; excavación profunda y especial; indicio adicional; y recogida conjunta. La Tienda sigue siendo el espacio personal. Las partidas anteriores empiezan en nivel I sin perder nada. Los valores son provisionales y no se generó APK. Informe, tabla de las 25 etapas y pruebas en [docs/mec02](docs/mec02/README.md).

## V5.6.1 Beta — MEC-01 (aprobada en auditoría externa)

Consolida las mecánicas de la V5.6.0 Beta sin calibrar todavía su balance: los materiales animales históricos vuelven a caer como antes y cada categoría nueva (materiales, coleccionables, rarezas) tiene su propio canal de drops; un registro permanente de coleccionables con su interfaz por colección; un libro de ingresos por procedencia que sustituye al cálculo por diferencias de saldo; gabinetes del Museo con selector completo y reservas de piezas; niveles del Museo en una sola tabla y una estructura reutilizable para hitos naturales. No se generó APK. Informe, estructuras de datos, pruebas y pendientes en [docs/mec01](docs/mec01/README.md).

## Estado publicado (V5.5.1)

| Contenido | Cantidad |
| --- | --- |
| Especies activas | 1.000 |
| Regiones | 125 |
| Paisajes (motivos de bioma) | 16 |
| Láminas zoológicas | 1.690 |
| Legendarios | 30 |
| Relictos (registro propio en el Museo) | 20 |
| Iconos de objetos ilustrados | 68 |

- **V5.2** añadió la Guía del naturalista, que se abre dentro de cada módulo, y retiró las ayudas ficticias de prueba. Detalles en el [informe de V5.2.0](docs/v520/README.md) y en la [auditoría de integración](docs/v520/auditoria.md).
- **V5.3** introdujo la iconografía naturalista: 63 iconos en WebP, pestañas, motivos de bioma y la [Biblioteca visual](https://pruizbohle.github.io/gran-atlas-naturaleza/iconoteca/biblioteca.html). Informe en [docs/v530](docs/v530/README.md).
- **V5.4** cierra la iconografía: 64 objetos jugables más con ilustración científica (OBJ-11), hexágonos del mapa con el color de su bioma, y la interfaz y el registro sin emojis. Informe en [docs/v540](docs/v540/README.md).

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `www/` | El juego: páginas, código, imágenes, laboratorios y páginas de actualización de la PWA |
| `docs/` | Informes por versión, auditorías, inventarios y evidencia |
| `scripts/` | Generación de la versión, inventarios de arte, pruebas en navegador y firma de APK |
| `tests/` | Pruebas en Node (`*.test.cjs`) |
| `android-native/` | Complementos nativos de Android: firma y exportación e importación de partidas |
| `.github/workflows/` | Despliegue en GitHub Pages y compilación, firma y publicación de Android |
| `capacitor.config.json`, `package.json` | Configuración de Capacitor y de las dependencias |
| `README_V*.md` | Informes de las versiones 3.x, conservados en la raíz para no romper enlaces |

## Desarrollo

La comprobación de publicación se ejecuta con:

```
npm ci
npm run release:verify
```

`release:verify` genera la versión (`scripts/build-naturalist-release.cjs`) y ejecuta las pruebas críticas. La compilación de Pages usa Node 22. La suite completa (`node --test --test-concurrency=4 tests/*.test.cjs`, con el historial de git completo) da 666 de 885 pruebas aprobadas en V5.4.2. En MEC-02, con el historial completo, da 690 de 906 frente a 678 de 894 en MEC-01, sin regresiones. Las 216 que fallan son aserciones históricas preexistentes, y `global-v3240` supera los 600 s por archivo en una máquina de 2 CPU. `release:verify` incluye `tests/mec01.test.cjs` y `tests/mec02.test.cjs`. Los 219 fallos restantes ya se reproducían en V5.3.0 y V5.2.0: son comparaciones con commits históricos que hay que revisar una a una. Ver [docs/v530/regresion.json](docs/v530/regresion.json).

Cada envío a `main` despliega el sitio mediante `.github/workflows/static.yml`.

## Compatibilidad de partidas

- La clave de guardado `gran_atlas_v05` y el respaldo JSON (formato `el-gran-atlas-save`, versión 1) no se cambian sin una migración.
- El prestigio es acumulado y no se consume al viajar ni al habilitar una región.
- Antes de actualizar una instalación, usa la [página de actualización](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html), que conserva la partida.

## Android

La configuración de Capacitor, los flujos de firma y el certificado permanente (su huella SHA-256 está fijada en [`docs/android/signing-certificate.json`](docs/android/signing-certificate.json)) están preparados. Todavía no hay APK generado para V5.2, V5.3 ni V5.4. Para publicar uno falta el candidato compilado, el registro de la restauración física en un dispositivo (`docs/android/restoration-validation.json`, que aún no existe) y la autorización expresa del propietario. Procedimiento y límites en [`docs/android/release-notes.md`](docs/android/release-notes.md) y en [`README_ANDROID_FIRMA_PERMANENTE.md`](README_ANDROID_FIRMA_PERMANENTE.md).

## Documentación por versión

La hoja de ruta vigente está en [`ROADMAP.md`](ROADMAP.md). El historial completo de versiones está en [`docs/CHANGELOG.md`](docs/CHANGELOG.md), y la hoja de ruta anterior, que llega hasta la Beta 3.12, en [`docs/ROADMAP-historico.md`](docs/ROADMAP-historico.md).

### Serie 5 · Auditoría, arte, relictos y legendarios

| Versión | Tema | Informe |
| --- | --- | --- |
| 5.6.7 Beta | MEC-07: récords naturales y conductas extraordinarias | [docs/mec07](docs/mec07/README.md) |
| 5.6.8 Beta | MEC-08: encargos, logros, reconocimientos y eventos especiales | [docs/mec08](docs/mec08/README.md) |
| 5.6.9 Beta | MEC-09A: auditoría técnica, estabilidad y consolidación de motores | [docs/mec09a](docs/mec09a/README.md) |
| 5.6.6 Beta | MEC-06: artefactos, materiales, instrumentos y Taller | [docs/mec06](docs/mec06/README.md) |
| 5.6.5 Beta | MEC-05: Museo evolutivo, gabinetes y exposiciones funcionales | [docs/mec05](docs/mec05/README.md) |
| 5.6.4 Beta | MEC-04: Sociedad científica, rangos y desbloqueos | [docs/mec04](docs/mec04/README.md) |
| 5.6.3 Beta | MEC-03: obtención híbrida de coleccionables e intercambio | [docs/mec03](docs/mec03/README.md) |
| 5.6.2 Beta | MEC-02: Campamento evolutivo, 5 instalaciones × 5 niveles | [docs/mec02](docs/mec02/README.md) |
| 5.6.1 Beta | MEC-01: consolidación de drops, colecciones, ingresos, gabinetes e hitos de la V5.6.0 Beta | [docs/mec01](docs/mec01/README.md) |
| 5.6.0 Beta | Coleccionables, drops, Sociedad, Museo e hito del guepardo (datos beta) | [docs/v560-beta](docs/v560-beta/README.md) |
| 5.4.0 | Iconografía: objetos OBJ-11, hexágonos por bioma e interfaz sin emojis | [docs/v540](docs/v540/README.md) |
| 5.3.0 | Iconografía naturalista: 63 iconos, biblioteca visual y motivos de bioma | [docs/v530](docs/v530/README.md) |
| 5.2.0 | 30 legendarios, 20 relictos, Guía del naturalista e integración de ramas | [docs/v520](docs/v520/README.md) |
| 5.1.2 | Relictos 5.0: de 9 a 20 relictos | [docs/relictos-v50](docs/relictos-v50/README.md) |
| 5.0.12 | ART-08: revisión de variantes pigmentarias | [docs/arte-v5012](docs/arte-v5012/README.md) |
| 5.0.11 | ART-07: rapaces y nutria | [docs/arte-v5011](docs/arte-v5011/README.md) |
| 5.0.10 | ART-06 | [docs/arte-v5010](docs/arte-v5010/README.md) |
| 5.0.9 | ART-05: visor de albinos y melánicos | [docs/arte-v509](docs/arte-v509/README.md) |
| 5.0.8 | ART-04 | [docs/arte-v508](docs/arte-v508/README.md) |
| 5.0.7 | ART-03 | [docs/arte-v507](docs/arte-v507/README.md) |
| 5.0.6 | ART-02 | [docs/arte-v506](docs/arte-v506/README.md) |
| 5.0.5 | ART-01: 11 correcciones en siete mamíferos | [docs/arte-v505](docs/arte-v505/README.md) |
| 5.0.4 | AUD-06: arranque y rendimiento | [docs/auditoria-v504](docs/auditoria-v504/README.md) |
| 5.0.3 | AUD-05 | [docs/auditoria-v503](docs/auditoria-v503/README.md) |
| 5.0.2 | Motor y caché | [docs/auditoria-v502](docs/auditoria-v502/README.md) |
| 5.0.1 | Integración de la auditoría global | [docs/auditoria-v501](docs/auditoria-v501/README.md) |

### Serie 4 · Catálogo mundial ilustrado

| Versión | Tema | Informe |
| --- | --- | --- |
| 4.9.6 | Peces marinos y cefalópodos (36 láminas) | [docs/cientifica-v496](docs/cientifica-v496/README.md) |
| 4.9.5 | Fauna de las profundidades | [docs/cientifica-v495](docs/cientifica-v495/README.md) |
| 4.9.3 | Peces de arrecife y cierre del catálogo mundial | [docs/cientifica-v493](docs/cientifica-v493/README.md) |
| 4.9.2 | Peces dulceacuícolas y estuarinos | [docs/cientifica-v492](docs/cientifica-v492/README.md) |
| 4.9.1 | Salmónidos y remonte | [docs/cientifica-v491](docs/cientifica-v491/README.md) |
| 4.9.0 | Tiburones, rayas y actualización de la PWA | [docs/cientifica-v490](docs/cientifica-v490/README.md) |
| 4.8.2 | Anfibios | [docs/cientifica-v482](docs/cientifica-v482/README.md) |
| 4.8.1 | Tortugas, crocodilianos y tuátara | [docs/cientifica-v481](docs/cientifica-v481/README.md) |
| 4.8.0 | Serpientes y lagartos | [docs/cientifica-v480](docs/cientifica-v480/README.md) |
| 4.7.4 | Paseriformes y cierre de aves | [docs/cientifica-v474](docs/cientifica-v474/README.md) |
| 4.7.3 | Aves arborícolas, chucao y sapo pulga | [docs/cientifica-v473](docs/cientifica-v473/README.md) |
| 4.7.2 | Aves terrestres, corredoras y galliformes | [docs/cientifica-v472](docs/cientifica-v472/README.md) |
| 4.7.1 | Aves acuáticas y marinas | [docs/cientifica-v471](docs/cientifica-v471/README.md) |
| 4.7.0 | Rapaces diurnas y nocturnas | [docs/cientifica-v470](docs/cientifica-v470/README.md) |
| 4.6.0 | Mamíferos acuáticos | [docs/cientifica-v460](docs/cientifica-v460/README.md) |
| 4.5.0 | Mamíferos terrestres restantes | [docs/cientifica-v450](docs/cientifica-v450/README.md) |
| 4.4.0 | Ilustración científica clásica y ungulados | [docs/cientifica-v440](docs/cientifica-v440/README.md) |
| 4.3.0 | Primates | [docs/naturalista-v430](docs/naturalista-v430/README.md) |
| 4.2.1 | Consolidación naturalista | [docs/naturalista-v421](docs/naturalista-v421/README.md) |

### Series 3 y anteriores

Los informes de las versiones 3.x están en la raíz como `README_V3xx.md`. Por ejemplo, la 3.44.0 (cartografía del naturalista) está documentada en [`docs/gm06/cierre-validacion.md`](docs/gm06/cierre-validacion.md) y la 3.43.0 en [`README_V3430.md`](README_V3430.md). El resumen de cada una está en el [historial de versiones](docs/CHANGELOG.md).
