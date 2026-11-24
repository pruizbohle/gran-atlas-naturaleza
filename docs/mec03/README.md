# MEC-03 · Obtención híbrida de coleccionables e intercambio → V5.6.3 Beta

Rama `mec-03/v5.6.3-beta`, creada desde `mec-02/v5.6.2-beta` (`27e2493`). No se fusiona a `main`. **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de Android y no se tocó `android-native/`.

El drop experimental de la V5.6.0 (cualquier especie podía entregar cualquier coleccionable) queda **retirado de la progresión normal**. Cada pieza se obtiene ahora por las actividades que corresponden a su naturaleza, procedencia y rareza: campo, expediciones, comercio, excavaciones, prospecciones, Taller y encargos. Los eventos tienen el mecanismo listo, pero siguen desactivados. Todas las probabilidades, precios, costos, tiempos y proporciones de intercambio son **provisionales**.

## 1. Decisiones aprobadas y cómo se aplicaron

| Decisión | Aplicación |
| --- | --- |
| Conservar las fuentes de los 8 materiales históricos y ampliarlas con coherencia | `SPECIES_DROPS` y `maybeSpeciesDrop` no cambian. Las 12 especies con drop histórico conservan exactamente esa fuente. Las demás pueden dar esos materiales si la beta los asignó **y** el tipo de animal es coherente: plumas de rapaz en rapaces y búhos, astas en cérvidos, diente de lobo en cánidos, etc. Las huellas valen para cualquier especie. Ver `HISTORIC_KINDS` |
| Ingresos antiguos como estimación sin desglose | Se mantiene `sinDesglose`. El informe de MEC-01 ya no la presenta como una cota inferior garantizada |
| Museo, Campamento en nivel I, sin niveles retroactivos, recetas históricas libres, sin rangos de Sociedad hasta MEC-04 | Sin cambios |
| Recetas nuevas con nivel de Taller | Las preparaciones de colección exigen Taller II–IV |

## 2. Correcciones técnicas de MEC-02

**Transacciones anidadas.** `tradeTransaction3300` lleva ahora un contador de profundidad. Solo la transacción más externa escribe la partida, y `persist()` no escribe dentro de una transacción. Una operación compuesta se guarda entera o se revierte entera, en memoria y en disco.

| # | Corrección | Cómo |
| --- | --- | --- |
| 1 | Expediciones con modalidad | Salida, costo extra, modalidad, duración y condiciones en una sola transacción |
| 2 | Excavaciones profundas y especiales | Ídem |
| 3 | Liquidación conjunta | La recompensa original, el extra de la modalidad y los coleccionables se liquidan en una transacción: en excavaciones, prospecciones documentales y prospecciones nuevas, y dentro de la liquidación única de `processVoyages` en expediciones |
| 4 | Hallazgos en recibos | `voyageHistory`, `excavationHistory` y `relictSurveyHistory` reciben `extra`, `collectibles`, `mode`/`modality` y `extraLeads` en el mismo registro (`jobId`). Además, `collectibleFinds` guarda los últimos 120 hallazgos con fuente, actividad e identificador |
| 5 | Fabricación múltiple | Comprueba antes los materiales de todas las unidades. Fabrica las N confirmadas o ninguna, con una sola confirmación |
| 6 | Subcomponentes | `AtlasCampMEC02Plan` valida la cadena completa (materiales y nivel de Taller de cada receta) antes de empezar, y la ejecuta en una sola transacción |
| 7 | Condiciones al inicio | Cada expedición, excavación y prospección registra `job.mec` al empezar (modalidad, nivel de la instalación, extras y tiradas) |
| 8 | Mejorar no cambia lo que está en curso | Los extras se calculan con `job.mec`. A los trabajos anteriores a MEC-03 se les fija una vez, al migrar, la condición vigente (`migrated:true`) |

Las pruebas simulan fallos de `localStorage.setItem` al iniciar y al liquidar, y comprueban que el estado y el disco quedan intactos, que la recuperación paga una sola vez y que repetir una liquidación no paga dos veces.

## 3. Configuración centralizada por pieza

- `scripts/build-mec03-catalog.cjs` contiene las reglas por colección: destinos de expedición, yacimientos, tipos de animal y anacronismos.
- Ese script genera `www/js/mec03-catalog.js` (configuración de las 431 piezas) y la matriz de auditoría [`matriz-coleccionables.csv`](matriz-coleccionables.csv), separada por `;` y en UTF-8, que abre en Excel.
- `release:verify` comprueba, mediante una prueba, que ambos archivos están al día.

Cada pieza registra:
- identificador, nombre corto, colección, gabinete y rareza provisional;
- procedencia y continentes compatibles;
- biomas;
- fuente principal y alternativas, con las actividades compatibles (por ejemplo, `expedicion:botanica` o `excavacion:profunda`);
- requisitos y nivel mínimo de instalación;
- peso por rareza (provisional: 12 / 5 / 1,8 / 0,4);
- observaciones de coherencia.

Fuentes por colección (entre paréntesis, cuántas piezas la usan cuando no son todas):

| Colección | Piezas | Fuente principal | Alternativas |
| --- | --- | --- | --- |
| Herbario del mundo | 20 | campo | expediciones (13), taller (19) |
| Semillas extraordinarias | 12 | campo | comercio |
| Pigmentos del mundo | 12 | expediciones (6), comercio (6) | comercio (6) |
| Piedras preciosas | 20 | prospecciones | comercio |
| Minerales extraordinarios | 12 | prospecciones | excavaciones (10), taller (11) |
| Ámbar y resinas fósiles | 12 | excavaciones (8), prospecciones (4) | prospecciones (8) |
| Meteoritos | 12 | prospecciones | expediciones (7) |
| Los siete mares | 7 | expediciones (3), encargos (4) | encargos (3) |
| Secretos de Atlántida | 5 | expediciones |  |
| Conchas de los océanos | 20 | campo | expediciones (14) |
| Curiosidades de marineros | 12 | comercio | expediciones (10) |
| Corales del mundo | 20 | expediciones (15), campo (5) | campo (15) |
| Numismática | 20 | excavaciones (15), comercio (5) | comercio (15) |
| Objetos de civilizaciones | 20 | excavaciones (15), comercio (5) | expediciones (13) |
| Armería histórica | 12 | comercio | excavaciones (7) |
| Máscaras y figurillas | 12 | expediciones (5), comercio (7) | comercio (5) |
| Cartografía antigua | 12 | expediciones (5), comercio (7) | comercio (5) |
| Huevos de aves | 20 | observacion (19), expediciones (1) | comercio, expediciones (12) |
| Fósiles menores | 12 | excavaciones (10), prospecciones (2) | prospecciones (10), taller (11) |
| Instrumentos de exploración | 12 | comercio | expediciones |
| Gabinete de maravillas | 12 | expediciones (6), comercio (6) | comercio (6) |
| Hojas y frondas del mundo | 12 | campo | prospecciones |
| Rocas y formaciones geológicas | 12 | campo | prospecciones |
| Algas del mundo | 12 | campo | expediciones (8) |
| Medallas y condecoraciones históricas | 12 | comercio | encargos |
| Arquitecturas animales | 12 | observacion (7), campo (5) | campo (7) |
| Maderas del mundo | 12 | campo | taller, comercio |
| Pteridomanía | 12 | campo | expediciones |
| Metales raros | 12 | prospecciones | comercio |
| Siete maravillas antiguas | 7 | expediciones | excavaciones |
| Imágenes daguerrotipadas | 20 | expediciones | taller (19), comercio |
| Rarezas y mitos | 12 | observacion | expediciones, comercio |

Las 5 piezas de «Objetos de civilizaciones» que no llegan por excavación ni por expedición reciben el comercio como vía añadida por accesibilidad, y así se marca en la matriz. Son CIV-05, CIV-06, CIV-09, CIV-10 y CIV-11. Ocurre porque todos los yacimientos y destinos existentes están en Europa, África y Norteamérica.

## 4. Fuentes activas y pendientes

| Fuente | Estado | Cómo funciona |
| --- | --- | --- |
| Campo · exploración ambiental | **Activa** | Una tirada por búsqueda, manual o automática (provisional: 3 % y 0,75 %), sin multiplicar por avistamientos. Depende de la región actual (continente y hábitats), no de la especie, y no exige el Gabinete |
| Campo · observación animal | **Activa** | Exige el Gabinete de especímenes. Huevos, arquitecturas y rarezas según el tipo de animal (las rátidas, por especie) y su continente (0,6 % y 0,15 %). También los materiales animales nuevos (sin cambios) y la ampliación de los históricos (0,5 % y 0,125 %) |
| Expediciones | **Activa** | Toda expedición puede traer coleccionables de su destino (normal: 1 tirada al 40 %). Modalidades: botánica y reconocimiento naturalista (Astillero II), oceanográfica (III), arqueológica (IV), exploración extraordinaria (V; incluye Atlántida y rarezas). Las especializadas hacen 2 tiradas al 60 %, cuestan ×1,25–1,5 y duran ×1,25. Ninguna omite los requisitos de la ruta |
| Comercio (Caravana) | **Activa** | Sección «Comerciantes y coleccionistas», separada del mercado de suministros. II: compra e intercambio de comunes. III: comerciantes regionales y poco comunes. IV: raras y solicitudes. V: coleccionistas especializados y muy raras. Solo piezas de continentes ya accesibles |
| Excavaciones | **Activa** | Hallazgo adicional a los fósiles originales, según yacimiento y modalidad. Normal: 1 tirada al 25 %, comunes y poco comunes. Profunda: 2 al 35 %, hasta raras. Especial: 3 al 45 %, todas, más las siete maravillas |
| Prospecciones geológicas y regionales | **Activa** | Actividades completas con capacidad compartida. Regional (nivel I): botánica y ambiental de la región. Geológica (II). Especializada (IV), con todas las rarezas. Las documentales de relictos no cambian: máximo de 3 indicios y nunca un relicto |
| Taller | **Activa** | Herbario y maderas (Taller II), pulido de minerales y reconstrucción de fósiles (III), daguerrotipos (IV). Cada una consume sus materiales y entrega una pieza común o poco común (rara desde Taller IV) |
| Encargos de coleccionistas | **Activa** | Seis solicitudes repetibles con espera de 8–12 h. Entregan piezas de «Los siete mares», «Medallas», «Arquitecturas» y «Semillas», con preferencia por las no descubiertas. Los encargos históricos no cambian |
| Eventos | **Preparada** | `deliverEvent` entrega una pieza una sola vez por evento. Los eventos de calendario siguen desactivados hasta MEC-08, y ninguna pieza depende solo de un evento (validado) |
| Hallazgos científicos extraordinarios (prospección) | Pendiente | Sin actividad propia: Atlántida y las rarezas llegan por la exploración extraordinaria |

## 5. Comercio e intercambio: ejemplos funcionales

- **Ofertas.** Son deterministas por periodo (24 h, provisional), semilla de la partida y nivel de la Caravana, y se guardan en `state.collectorMarket`. Recargar, cambiar de pestaña o reabrir no las cambia. Subir la Caravana añade los comerciantes del nivel nuevo sin rehacer las ofertas existentes. Cada pieza aparece en una sola oferta por periodo y cada oferta se completa una vez.
- **Compra**: «Mercader de curiosidades · Compra · £150 · Piedra de río perforada». Se paga en libras, la pieza entra con fuente `comercio` y la compra no cuenta como ingreso.
- **Intercambio de repetidos**: «3 repetidas de Historia natural y exploración → Lupa de naturalista». El juego elige automáticamente las piezas del mismo gabinete o colección con rareza suficiente y más unidades libres. No existe una conversión universal.
- **Solicitud de coleccionista** (Caravana IV): entregas una unidad libre y cobras el 60 % del precio de referencia, que entra en el libro de ingresos como `comercio`.
- **Antes de confirmar** se muestra lo que entregas, lo que pagas o recibes y lo que te queda de cada pieza: «Después: Brújula de bolsillo: quedan 2 (0 en vitrina)».

## 6. Protección de piezas

`stock()` distingue unidades en inventario, exhibidas, disponibles y disponibles para intercambio:
- Las exhibidas nunca se entregan, aunque se desactive la protección.
- La preferencia `collectionPrefs.protectLast` (activada por defecto, con un interruptor en la Caravana) reserva además la última unidad de cada pieza que no esté expuesta.
- El registro histórico de descubrimientos no cambia al vender o intercambiar.

## 7. Interfaz

- **Fichas de coleccionables**:
  - nombre corto;
  - descripción en ventana emergente;
  - rareza y procedencia;
  - fuentes principal y alternativas, con su nivel de instalación;
  - cantidades obtenida, disponible, exhibida y para intercambio (indicando la protegida);
  - registro de procedencia (por ejemplo, «Campo · exploración ambiental: 2»).
- **Piezas no descubiertas**: muestran solo una pista («Campo · exploración ambiental · Taller · procedencia: Sudamérica»), sin el nombre.
- **Textos retirados**: los que decían «cae de N especies… requiere el Gabinete».
- **Fichas del Campamento**: cada actividad muestra los hallazgos posibles y los últimos obtenidos, con los controles nuevos:
  - modalidades especializadas;
  - comerciantes y coleccionistas;
  - prospecciones con selector de región;
  - preparaciones del Taller;
  - encargos de coleccionistas.
- Toda acción que gasta recursos pide confirmación. Se conservan los marcadores artísticos provisionales.

## 8. Coherencia geográfica e histórica (para revisión externa)

Ninguna pieza se eliminó ni se sustituyó. Las dudas quedan en la columna `observaciones` de la matriz:

| Pieza | Nombre | Observación |
| --- | --- | --- |
| PIG-09 | Azul maya | Revisar: el azul maya se identificó como pigmento en 1931. |
| GEM-12 | Ópalo negro | Anacronismo probable: el ópalo negro de Lightning Ridge se descubrió hacia 1900. |
| AMB-08 | Ámbar libanés | Anacronismo probable: el ámbar libanés se describió científicamente en el siglo XX. |
| AMB-12 | Ámbar azul dominicano | Revisar: el ámbar azul dominicano se reconoce como variedad en el siglo XX. |
| NUM-05 | Rupia de la India británica | Revisar: «India británica» es posterior a 1858; en 1842 sería rupia de la Compañía. |
| CIV-06 | Figurilla del valle del Indo | Anacronismo: la civilización del valle del Indo se identificó en la década de 1920. |
| CIV-10 | Textil nazca | Revisar: la cultura nazca se identificó en 1901. |
| CIV-12 | Placa del Reino de Benín | Anacronismo: las placas de Benín llegaron a Europa en 1897. |
| MAS-07 | Figurilla olmeca | Anacronismo probable: la cultura olmeca se identificó entre 1862 y 1920. |
| MAS-09 | Vasija retrato moche | Revisar: la cultura moche se denomina así desde el siglo XX. |
| HUE-11 | Huevo de pingüino emperador | Revisar: el pingüino emperador se describió en 1844 y su huevo se recolectó en 1902. |
| HUE-12 | Huevo de ave elefante | Revisar: los huevos de ave elefante llegaron a Europa hacia 1850. |
| FOS-04 | Trilobite marroquí | Revisar: el comercio de trilobites marroquíes es del siglo XX. |
| FOS-11 | Pluma fósil de Solnhofen | Anacronismo: la pluma de Archaeopteryx de Solnhofen se halló en 1861. |
| MARV-11 | Vidrio del desierto libio | Anacronismo: el vidrio del desierto libio se descubrió en 1932. |
| ROC-11 | Hierro bandeado de Hamersley | Revisar: el hierro bandeado de Hamersley se describió después de 1861. |
| BOT-13 | Copihue | Geografía: el copihue es chileno y figura como «Mundial». |
| BOT-14 | Orquídea vainilla | Geografía: la vainilla es mesoamericana y figura como «Mundial». |
| MAD-01 | Caoba cubana | Geografía: las 12 maderas tienen procedencia concreta (Cuba, Honduras, Ceilán…) y figuran como «Mundial». |
| CIV-13 | Tablilla sumeria | Anacronismo probable: los sumerios se identificaron en 1869. |
| CIV-17 | Cerámica Jōmon | Revisar: el término Jōmon es de 1877. |
| CIV-19 | Disco misisipiano | Revisar: «misisipiano» es una denominación del siglo XX. |
| CIV-20 | Relieve jemer | Revisar: Angkor se difundió en Europa a partir de 1860. |
| DAG-01 | Westminster | Geografía: los 20 daguerrotipos muestran lugares concretos y figuran como «Mundial». |
| DAG-12 | Taj Mahal | Anacronismo probable: no hay daguerrotipos conocidos del Taj Mahal en 1842. |
| DAG-13 | Gran Muralla | Anacronismo probable: la Gran Muralla se fotografió a partir de la década de 1870. |
| DAG-14 | Ciudad Prohibida | Anacronismo probable: la Ciudad Prohibida se fotografió a partir de 1860. |
| DAG-15 | Monte Fuji | Anacronismo: Japón estuvo cerrado a fotógrafos occidentales hasta 1854. |
| DAG-16 | Angkor Wat | Anacronismo: Angkor Wat se fotografió a partir de 1866. |
| DAG-19 | Cusco histórico | Revisar: no hay daguerrotipos conocidos de Cusco en 1842. |
| DAG-20 | Moáis de Rapa Nui | Anacronismo probable: no hay daguerrotipos de Rapa Nui en 1842. |

Excepción configurada expresamente: el destino `atlantic_survey` da acceso a piezas marinas de las cuatro costas atlánticas (Europa, África, Norteamérica y Sudamérica).

## 9. Migración y guardado

- **Partidas anteriores** (de la beta 5.6.0 a MEC-02) conservan todas sus piezas y su registro.
- **Trabajos en curso sin condiciones** reciben `job.mec` una sola vez, con `migrated:true`.
- **Estructuras nuevas**, con valores por defecto y normalización al cargar e importar:
  - `collectionPrefs.protectLast` (por defecto `true`);
  - `prospections` (`seq`, `jobs`, `settled`, `history`);
  - `collectorMarket` (`seed`, `period`, `level`, `offers`, `history`);
  - `collectorCommissions.claims`;
  - `collectibleFinds`;
  - `collectibleEvents`;
  - `mec03Region`.
- **Identificadores**: cada actividad tiene uno persistente: `job.id` en expediciones, excavaciones y prospecciones, y `P<periodo>-<nivel>-<n>` en las ofertas. Los recibos `settled` impiden pagar dos veces, también al recargar o importar.
- **Ingresos y consumos**: toda entrada de dinero pasa por `earnMoney`. Todo consumo de coleccionables respeta las reservas del Museo y la protección.

## 10. Pruebas

`tests/mec03.test.cjs`: **17 de 17 aprobadas**. Cubren los 20 puntos de la sección 18; algunas pruebas agrupan varios.

| Punto | Comprobación |
| --- | --- |
| 1 | Canales universales a 0 y tablas archivadas; 20.000 búsquedas con el lobo no dan coleccionables; fichas sin texto de drop universal |
| 2 | Las 12 especies históricas sin ampliación; ampliación coherente por tipo de animal; tasa del 2 % intacta; 27 materiales animales |
| 3 | Pozo ambiental por región y bioma; hallazgo ambiental sin Gabinete; huevos solo de aves; como máximo un hallazgo ambiental por búsqueda en 400 encuentros reales |
| 4 | Cada fuente (campo, observación, expedición, excavación, prospección, Taller, comercio, encargo y evento de prueba) añade piezas reales al registro con su fuente; ninguna queda como «otros» |
| 5 | Las 431 piezas son alcanzables, y cada fuente declarada en la configuración funciona para esa pieza |
| 6 | Continentes y biomas de los pozos; expediciones terrestres sin piezas marinas; comercio limitado a continentes accesibles; matriz CSV y anacronismos |
| 7, 9 | Intercambio real de 3 repetidas; exhibidas y última unidad protegidas; texto de confirmación con lo entregado, recibido y restante |
| 8 | Compra en libras, sin ingreso; solicitud pagada a través del libro de ingresos |
| 10 | Registro intacto tras entregar la última unidad y reabrir |
| 11 | Ofertas iguales tras recargar o cambiar de pestaña; niveles añadidos sin rehacer; ofertas completadas persistentes; renovación a las 24 h |
| 12 | Costos, nivel requerido, capacidad compartida con las documentales, duración, recompensas, conocimiento, historial; sin relictos |
| 13, 14 | Recibos con modalidad, coleccionables y extras; `tick`, recoger todas y reabrir no pagan dos veces |
| 15 | Fallos de guardado al iniciar y al liquidar sin efectos a medias; recuperación con un solo pago |
| 16 | Fabricación ×5 con materiales para 3 no fabrica ninguna; los fallos de guardado revierten todo; cadena de subcomponentes validada |
| 17 | Partida de MEC-02 con trabajos en curso: condiciones fijadas al migrar y no cambian al mejorar |
| 18, 19 | Volver sin conexión tras 10 h; exportar e importar conserva ofertas, prospecciones, preferencias, recibos y hallazgos |
| 20 | Invariantes de MEC-01 y MEC-02, versión, canal, caché offline, `release:verify` y matriz al día |

### Suite completa (línea base MEC-02 frente a MEC-03)

| | MEC-02 `27e2493` | MEC-03 |
| --- | --- | --- |
| Pruebas | 906 | 923 (+17 de MEC-03) |
| Aprobadas | 690 | 707 |
| Fallidas | 216 | 216 (las mismas, aserciones históricas preexistentes) |
| Regresiones | — | **0** |
| Archivo que agota los 600 s | `global-v3240` | `global-v3240` |

- **Prueba renombrada**: la de versión de MEC-02 pasó de «versión 5.6.2 Beta…» a «versión beta…». Ahora compara con la versión vigente y sigue aprobada.
- **Pruebas de MEC-01 y MEC-02**: pasan igual (14 de 14 y 12 de 12).
- **Resultados por prueba**: [`linea-base-mec02.json`](linea-base-mec02.json) y [`resultado.json`](resultado.json). No se eliminó ni se debilitó ninguna prueba.
- **`release:verify`**: incluye ahora `tests/mec03.test.cjs`.

**Comprobación en navegador** (Chrome sin interfaz, 412 × 900), sin errores de consola:
- La sección de comerciantes y coleccionistas de la Caravana III muestra ofertas regionales de Europa, y la compra pide confirmación con el detalle.
- Prospección geológica iniciada desde la ficha.
- Ficha de pieza con fuentes y registro de procedencia; pista para una pieza no descubierta.

## 11. Pendientes

- **Balance**: tasas, precios, proporciones de intercambio, tiempos y costos. Todos están en `scripts/build-mec03-catalog.cjs` y `www/js/mec03-collect.js` (`RATES`, `PRICE`, `MARKET`, `PROSPECTIONS`, `PREPARATIONS`, `COMMISSIONS`, `VOYAGE_MODALITIES`).
- **Geografía de las actividades**: no hay yacimientos ni destinos de expedición en Asia, Oceanía ni Sudamérica. Por eso esas piezas se obtienen sobre todo por campo, prospecciones y comercio. Ampliar destinos es contenido para una etapa posterior.
- **Coherencia**: revisión externa de las 31 observaciones de la sección 8.
- **Taller y MEC-06**: las preparaciones quedan como ejemplos; su integración con materiales y artefactos corresponde a MEC-06.
- **Eventos**: de calendario en MEC-08; hallazgos científicos extraordinarios como actividad propia.
- **Rango de Sociedad**: como requisito de ofertas y encargos, en MEC-04.
- **Versión web aislada**: no se publicó (`www/` pesa unos 166 MB y GitHub Pages despliega solo `main`). Revisión local: `python3 -m http.server -d www 8080`.

## 12. Confirmación

No se generó ni se publicó ninguna APK, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó. El desarrollo se detiene aquí para la auditoría externa; no se avanzó a MEC-04.
