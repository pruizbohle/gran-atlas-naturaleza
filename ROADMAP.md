# El Gran Atlas — hoja de ruta (25 de noviembre de 2026, MEC-09C)

Estado de partida: **V5.5.1** publicada. **V5.6.1 Beta — MEC-01** aprobada en auditoría externa. **V5.6.2 Beta — MEC-02** aprobada. **V5.6.3 Beta — MEC-03** auditada; sus observaciones se corrigen en MEC-04. **V5.6.4 Beta — MEC-04** aprobada. **V5.6.5 Beta — MEC-05** aprobada. **V5.6.6 Beta — MEC-06** aprobada. **V5.6.7 Beta — MEC-07** entregada en la rama `mec-07/v5.6.7-beta`; sus observaciones se corrigen en MEC-08. **V5.6.8 Beta — MEC-08** auditada externamente; sus hallazgos se corrigen en MEC-09A. **V5.6.9 Beta — MEC-09A** (revisión técnica) entregada en la rama `mec-09a/technical-audit`. **V5.6.9 Beta — MEC-09B** aprobada para continuar (observaciones para MEC-09D). **V5.6.9 Beta — MEC-09C** (interfaz móvil, navegación y rendimiento) en revisión en la rama `mec-09c/mobile-ux`, sin fusionar a producción; no se avanza a MEC-09D sin auditoría. **MEC-09D** en curso en la rama `mec-09d/consolidation`: 221/221 pruebas históricas resueltas, Preview web 01 publicada (rama `preview-mec09d-01`), MEC-09D.2 con §7 parcial, §8, §9 y §15 hechos, suite 1200/1200 ([docs/mec09d](docs/mec09d/README.md)); sin APK y sin avanzar a MEC-09E.

## Etapas acordadas tras MEC-09B

| Etapa | Contenido | Condición |
| --- | --- | --- |
| MEC-09C | Optimización móvil, navegación y rendimiento | En revisión |
| MEC-09D | Consolidación integral y cierre técnico. Incluye las observaciones de MEC-09B: 143 piezas individuales, niveles de evidencia, 30 legendarios, 20 relictos, rutas comerciales, grafo, `AVAIL`, revelado fotográfico, funciones redefinidas, 221 pruebas históricas y guardado diferido. Incluye también las de MEC-09C (`docs/mec09c/pendientes-mec09d.md`) | Tras aprobar MEC-09C |
| MEC-09E | **V5.7.0 Beta** como versión integral propuesta. Contenido:<br>• APK privada de prueba instalable, conservando la versión pública;<br>• selección de idioma desde el perfil, con traducciones centralizadas;<br>• modo Game Master exclusivo de compilaciones de prueba, con partidas GM identificadas y aisladas de la progresión normal;<br>• herramientas GM: 500 avistamientos en un clic, 500 búsquedas aceleradas con el motor real, saltos temporales, finalización de actividades, diagnóstico y desbloqueo | Única etapa autorizada para generar APK (privada, de prueba) |
| TEST-01 | Revisión personal del propietario y correcciones (incluye la prueba física con lector de pantalla) | Tras MEC-09E |
| BAL-01 | Simulación de progresión | No antes de completar MEC-09E y TEST-01 |
| BAL-02 | Ajustes económicos y probabilísticos | Tras BAL-01 |
| BAL-03 | Validación del balance | Tras BAL-02 |
| RC-01 | Candidata a publicación | Tras BAL-03 |

## Completado

| Etapa | Versiones | Resultado |
| --- | --- | --- |
| Android Alpha y móvil | 2.5 – 3.0 | Navegación vertical, uso sin conexión y persistencia local |
| Europa, Asia y África | 2.1 – 3.12 | Europa y Asia completas; África en etapas |
| Américas | 3.22 – 3.23 | Norteamérica completa y Sudamérica pulida |
| Oceanía, Polos y mares | 3.29 – 3.32 | Oceanía, regiones polares y doce mares superficiales |
| Océanos profundos | 3.33 – 3.34 | Regiones profundas y fosas abisales |
| Consolidación mundial | 3.35 – 3.44 | 997 especies y 125 regiones, con cartografía del naturalista |
| Módulos del juego | 3.24 – 3.43 | Bestiario, Museo, Expediciones, Sociedad, Inventario, Campamento y perfil |
| Catálogo mundial ilustrado | 4.2 – 4.9.6 | 1.000 fichas activas con láminas científicas de todos los grupos |
| Auditoría y arte | 5.0.1 – 5.0.12 | Auditoría global, rendimiento de arranque y repintado de variantes pigmentarias |
| Legendarios, relictos y guía | 5.1.2 – 5.2.0 | 30 legendarios, 20 relictos y Guía del naturalista |
| Iconografía | 5.3.0 – 5.4.2 | 63 iconos y 16 motivos de bioma, 64 objetos ilustrados más, hexágonos por bioma e interfaz sin emojis |
| Interfaz móvil, navegación y rendimiento (MEC-09C, pendiente de auditoría) | 5.6.9 Beta | Marco de 212 a 200 px fijos, con áreas seguras; cifras compactas sin cortes; subpestañas en una fila; Bestiario con filtros plegados; textos redundantes retirados y explicativos plegados; ventanas con cierre y foco; guía «Cómo se obtiene» (cadena del abrigo polar hasta el castor); configuración del perfil preparada para MEC-09E; horizontal y escritorio corregidos; contraste AA (64 → 3 fallos). Capturas reales antes y después (492) y galería. Sin balance ni APK |
| Auditoría funcional y de progresión (MEC-09B, aprobada con observaciones) | 5.6.9 Beta | Encargos: sin crédito anterior a la aceptación, cierre cronológico de eventos, viabilidad al aceptar y `AVAIL` sin `Infinity`; placas daguerrotípicas con procedencia (`state.mec06.plates`); 6 expediciones y 3 yacimientos en regiones existentes con carencia medida; controlador desde partida nueva sin ayudas (1.000 especies, 125 regiones, rango 20, Campamento y Museo completos); matrices de accesibilidad de todo el catálogo; revisión histórica A–F; 42 fallos históricos revisados uno a uno. Sin balance ni APK |
| Auditoría técnica (MEC-09A, entregada) | 5.6.9 Beta | Hallazgos de MEC-08 corregidos; fallos históricos clasificados; `global-v3240` estable; migraciones, partidas dañadas, transacciones, ingresos, reservas e integridad de catálogos verificados; 49 pruebas nuevas con catálogo completo | [docs/mec09a](docs/mec09a/README.md) |
| Encargos, logros y eventos (MEC-08, auditada) | 5.6.8 Beta | 74 logros nuevos o actualizados y 10 medallas conmemorativas; 12 encargos permanentes con compuerta de acceso; correspondencia renovable y proyectos institucionales en un solo motor; 10 eventos con calendario local y capa de modificadores temporales; franja y pestaña de Eventos en Sociedad; correcciones de MEC-07 | [docs/mec08](docs/mec08/README.md) |
| Récords naturales y conductas (MEC-07, observaciones corregidas en MEC-08) | 5.6.7 Beta | 25 hitos y 20 conductas con el motor de campo real, RNG aislado, validación instrumental, registro regional, Cuaderno y Bestiario; migración del guepardo; correcciones de MEC-06 | [docs/mec07](docs/mec07/README.md) |
| Artefactos, instrumentos y Taller (MEC-06, aprobada) | 5.6.6 Beta | Funciones reales para 20 artefactos, 6 componentes y 27 materiales animales; estudios, fotografía, demostraciones y atractivo; ubicación única; Taller por niveles; auditoría de inventario; correcciones de MEC-05 | [docs/mec06](docs/mec06/README.md) |
| Museo evolutivo (MEC-05, aprobada) | 5.6.5 Beta | Gabinetes con beneficios reales y distintos, exposiciones temáticas por colección, niveles IV–V con rango, ingreso desglosado; correcciones de MEC-04 (investigaciones, regiones visitadas, auditoría con fuentes reales) | [docs/mec05](docs/mec05/README.md) |
| Sociedad científica y rangos (MEC-04, aprobada) | 5.6.4 Beta | 20 rangos con ascenso explícito y permanente, desbloqueos de Campamento IV–V, comercio, encargos y financiación; correcciones de MEC-03; origen, hallazgo y compra separados; destinos y yacimientos en Asia, Sudamérica, Oceanía y Polos | [docs/mec04](docs/mec04/README.md) |
| Obtención de coleccionables (MEC-03, auditada) | 5.6.3 Beta | Drop universal retirado; fuentes por pieza en campo, expediciones, comercio, excavaciones, prospecciones, Taller y encargos; intercambio y protección de piezas; transacciones atómicas. [Informe MEC-03](docs/mec03/README.md) |
| Campamento evolutivo (MEC-02, aprobada) | 5.6.2 Beta | 5 instalaciones × 5 niveles con efectos reales en capacidades y funciones, configuración central, ficha de instalación, migración en nivel I con derechos adquiridos y canal beta explícito. [Informe MEC-02](docs/mec02/README.md) |
| Mecánicas beta y consolidación (MEC-01, aprobada) | 5.6.0 Beta – 5.6.1 Beta | Drops por canal con los materiales históricos restituidos, registro permanente de coleccionables y su interfaz, libro de ingresos por procedencia, gabinetes con selector completo y reservas, niveles del Museo en una tabla y estructura de hitos naturales. Sin balance. [Informe MEC-01](docs/mec01/README.md) |
| Marco móvil y Campamento | 5.5.0 – 5.5.1 | Cabecera, monedas, título de pestaña y barra de 9 iconos fijos; el contenido se desplaza dentro de su ventana; el Campamento tiene fondo pintado y 6 áreas |

## Pendiente según los informes del repositorio

| Tema | Estado | Fuente |
| --- | --- | --- |
| Android estable | APK sin generar. El certificado permanente ya tiene su huella fijada; faltan el candidato compilado, el registro de restauración en un dispositivo físico y la autorización expresa | [Notas de Android](docs/android/release-notes.md), [firma permanente](docs/android/signing-certificate.json), [informe 3.42.0](README_V3420.md) |
| Pruebas históricas | Clasificadas en MEC-09A: 146 obsoletas por diseño aprobado, 74 con arnés incompatible, 1 de entorno Android y 1 de rendimiento (corregida); ninguna esconde un error funcional vigente. Su destino (retirar o reescribir) queda para MEC-09D | [Regresión V5.3.0](docs/v530/regresion.json) |
| Arte pigmentario | Siguiente lote propuesto: 20 animales con variante albina o melánica mejorable | [Próximo lote ART-08](docs/arte-v5012/proximo-lote.md) |
| Coleccionables | 431 piezas en 32 colecciones integradas como beta (V5.6.0) y consolidadas en MEC-01. Pendiente: Filatelia, arte definitivo, descripciones y balance de tasas | [Auditoría de integración](docs/v520/auditoria.md), [MEC-01](docs/mec01/README.md) |
| Revisión de coherencia de coleccionables | MEC-04 corrigió el origen de 110 piezas «Mundial» y añadió destinos y yacimientos fuera de Europa. Quedan 21 «Mundial» con motivo y las observaciones de MEC-03 para revisión externa; una etapa geográfica propia antes de MEC-09 si hiciera falta | [docs/mec04](docs/mec04/README.md) |
| Balance de mecánicas (BAL-01) | Tasas, precios e intercambio de coleccionables (MEC-03); costos, capacidades y tiempos del Campamento (MEC-02); umbrales, recompensas y financiación de los 20 rangos (MEC-04); valores por punto, topes, hitos temáticos y rangos del Museo (MEC-05); recompensas y esperas de estudios y demostraciones, atractivo, fotografía y niveles del Taller (MEC-06); probabilidades, modelos, umbrales y recompensas de récords y conductas (MEC-07); objetivos, recompensas, periodo de renovación y modificadores de eventos (MEC-08). Todo es provisional | [docs/mec05](docs/mec05/README.md) |
| Iconos restantes | Motivo `comparativo` (sin pantalla donde mostrarlo todavía) y arte de legendarios y relictos | [docs/v540](docs/v540/README.md) |
| Arte de los niveles del Campamento | Los niveles ya funcionan (MEC-02; la Tienda quedó sin niveles productivos). Faltan las 25 ilustraciones `<instalación>-1` a `<instalación>-5`, cuyas ranuras están en `AtlasCampMEC02.ART` | [MEC-02](docs/mec02/README.md#5-interfaz-del-campamento) |

## Propuestas

Son ideas mías para ordenar el proyecto. No están decididas en ningún informe:

- Mover los más de 60 `README_V*.md` de la raíz a `docs/` y actualizar los enlaces.
- Crear un `CLAUDE.md` con las reglas del proyecto: no tocar `gran_atlas_v05`, ejecutar `npm run release:verify` antes de publicar y no generar APK sin autorización.
- Dejar una sola fuente de la versión vigente, ya que hoy aparece en `package.json` y en `www/atlas-release.json`.

## Reglas de compatibilidad

- No modificar `gran_atlas_v05` ni el formato de respaldo `el-gran-atlas-save` versión 1 sin una migración.
- El prestigio es acumulado y no se consume al viajar.
- Cada cambio visual conserva rutas, etiquetas de juego e identificadores de guardado.
