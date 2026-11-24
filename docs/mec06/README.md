# MEC-06 · Artefactos científicos, materiales, instrumentos y evolución del Taller → V5.6.6 Beta

Rama `mec-06/v5.6.6-beta`, creada desde `mec-05/v5.6.5-beta` (`2aa10a1`). No se fusiona a `main`. **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó.

Los 15 artefactos de la beta, los 5 históricos, los 6 componentes y los 27 materiales animales tienen ahora funciones reales y conectadas entre sí:

- análisis de muestras;
- astronomía y cartografía;
- fotografía;
- experimentos físicos;
- demostraciones en el Museo;
- atractivo museístico.

Todo pasa por los motores existentes de inventario, ingresos, transacciones y bonificaciones. **Todos los valores son provisionales** (BAL-01).

## 1. Correcciones de MEC-05

| Punto | Corrección |
| --- | --- |
| 3.1 Transacciones de exhibición | Varias operaciones se guardan ahora en una transacción: exponer y retirar en los gabinetes, exponer y retirar animales, alternar vitrina, catalogar artefactos y fósiles, montar reconstrucciones, cambiar la ubicación de un artefacto, los estudios y las demostraciones. Un fallo de guardado no deja reservas ni bonificaciones sin exposición guardada, ni piezas duplicadas o perdidas, ni consumos parciales (pruebas 1 y 22) |
| 3.2 Estados | Exhibido significa catalogado y en vitrina (`state.museum.displays`, la condición real del Museo), no solo catalogado. Se distinguen: adquirido, catalogado, en posesión, exhibido, instalado (Taller o Campamento), equipado, disponible y almacenado (`AtlasMEC06Actions.states`). Un objeto retirado de la vitrina deja de contar como exhibido, también en los fósiles de MEC-05 |
| 3.3 Conocimiento de expediciones | El extra del Museo se calcula sobre el conocimiento **base** de la ruta, fijado al zarpar, así que equipar un instrumento antes de recoger ya no lo cambia. La brújula de latón **conserva su regla histórica** (+4 % si está equipada al liquidar, `voyageKnowledgeReward`); no se modificó sin aprobación. El recibo trae `knowledgeTotal` y `knowledgeBreakdown` (base, equipamiento, Museo, instrumentos) |
| 3.4 Fichas de coleccionables | La ficha muestra **Origen** (continente y lugar), **Se encuentra en** y **Se compra en**, con la geografía de MEC-04. Ya no aparece la procedencia de la beta |
| 3.5 Exploración regional | Nuevo registro de actividad regional `state.regionalRecords` (avistamientos por región, desde MEC-06; nada retroactivo). Una región «explorada» o «completada» exige visita y avistamientos en esa región. El catálogo global se informa aparte (`globalComplete`). Los rangos no cambian, porque usan regiones visitadas. La estructura queda lista para los logros regionales de MEC-08 |

## 2. Auditoría funcional del inventario

`scripts/build-mec06-inventory.cjs` genera la matriz desde el motor real, con el catálogo completo:

- [`inventario.csv`](inventario.csv): 544 objetos (524 de `ITEMS` y 20 artefactos). Columnas: id, nombre, categoría, fuentes, usos, recetas en que participa, receta propia, investigaciones, encargos, compra, venta o intercambio, nivel de Taller, beneficio, estado y **estado antes de MEC-06**.
- [`inventario-resumen.json`](inventario-resumen.json): el resumen.

| Categoría | Objetos |
| --- | --- |
| equipamiento | 12 |
| material fósil | 15 |
| material animal | 27 |
| materia prima | 8 |
| objeto cartográfico | 14 |
| componente fabricado | 9 |
| objeto especial | 1 |
| mercancía comercial | 7 |
| coleccionable | 431 |
| instrumento científico | 13 |
| artefacto museístico | 7 |

- **Antes de MEC-06**:
  - 19 materiales animales nuevos (`MAT-N*`) no tenían ningún uso.
  - Los 20 artefactos solo se catalogaban, sin función.
- **Después**: ningún objeto queda sin utilidad ni requerido sin fuente.
- Las mercancías regionales, el mapamundi y el ámbar conservan sus usos históricos (colección de mercancías, puerta oceánica, medallón). No se asignaron usos artificiales.

## 3. Arquitectura de artefactos

`www/js/mec06-workshop.js` (`AtlasMEC06`) es la configuración única, con los ids de siempre y sin duplicados entre Taller, Museo e inventario. Incluye:

- los artefactos (familia, Taller, funciones, ubicaciones, utilidades, atractivo, beneficios, límites, integraciones y arte);
- los componentes;
- los grupos de materiales animales;
- los estudios, las demostraciones y el atractivo;
- los modificadores;
- las referencias de arte.

La receta y el conocimiento siguen en `MUSEUM_COLLECTIONS`, sin cambios.

**Ubicación.** Cada artefacto catalogado está en una sola de estas: vitrina del Museo (`displays`), instalado en el Taller, instalado en el Campamento o almacén.

- La catalogación es permanente: retirarlo o instalarlo no lo elimina.
- Reasignar es atómico y reversible. Volver a la vitrina con el botón histórico lo desinstala.
- Capacidad del Taller: 2, 3, 4, 5 y 6 según su nivel. Campamento: 2.
- **Expediciones**: se evaluó una ubicación «en expedición» y se descartó para no obligar a mover instrumentos en cada salida. Los instrumentos de expedición quedan instalados en el Campamento y sus condiciones se fijan al zarpar (`job.mec06`).
- **Equipamiento portátil (C)**: ningún artefacto de la beta es portátil por su tamaño y su naturaleza. Se sigue usando el equipamiento histórico, sin ranuras nuevas.
- **Migración**: los artefactos ya catalogados quedan en vitrina, o en el almacén si estaban retirados. No se instala nada y no se exige reconstruirlos.

| Artefacto (id) | Familia | Taller | Receta (sin cambios) | Conocimiento | Funciones | Ubicaciones | Utilidad | Atractivo £/s | Arte |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Microscopio compuesto (`microscopio_compuesto`) | Óptica | III | Pieza de latón antiguo ×3, Lente pulida ×2, Madera tallada ×1, Engranaje de latón ×1 | 490 | B instalado, A museístico | taller, museo, almacen | Análisis microscópico de plumas; Clasificación de pelo y mudas; Estudio de escamas y caparazones | 0.01 | `artifact-microscopio-compuesto` |
| Telescopio refractor (`telescopio_astronomico`) | Óptica | IV | Pieza de latón antiguo ×4, Lente pulida ×3, Madera tallada ×2, Engranaje de latón ×2 | 770 | B instalado, A museístico | taller, museo, almacen | Observación astronómica | 0.01 | `artifact-telescopio-astronomico` |
| Globo celeste (`globo_celeste`) | Astronomía | IV | Pieza de latón antiguo ×2, Madera tallada ×2, Fragmento de mapa ×2, Carta estelar ×1 | 490 | D expedición, A museístico | campamento, museo, almacen | −10 % de duración de expediciones (Campamento); preparacion-derrotas | 0.01 | `artifact-globo-celeste` |
| Esfera armilar (`esfera_armilar`) | Astronomía | IV | Pieza de latón antiguo ×5, Engranaje de latón ×2, Carta estelar ×1 | 560 | B instalado, A museístico | taller, museo, almacen | Cálculo de derrotas y cartografía | 0.01 | `artifact-esfera-armilar` |
| Planetario mecánico (`planetario_orrery`) | Astronomía | V | Pieza de latón antiguo ×3, Engranaje de latón ×3, Madera tallada ×2, Carta estelar ×1 | 630 | A museístico | museo, almacen | Demostración del planetario mecánico | 0.04 | `artifact-planetario-orrery` |
| Autómata cantor (`automata_ave`) | Autómatas | III | Madera tallada ×2, Engranaje de latón ×4, Pieza de latón antiguo ×2 | 560 | A museístico | museo, almacen | Exhibición del autómata cantor | 0.05 | `artifact-automata-ave` |
| Autómata escribiente (`automata_escribiente`) | Autómatas | V | Madera tallada ×3, Engranaje de latón ×5, Pieza de latón antiguo ×2, Tintero antiguo ×1, Pergamino antiguo ×1 | 840 | B instalado, A museístico | taller, museo, almacen | Copia mecánica de informes | 0.03 | `artifact-automata-escribiente` |
| Estereoscopio de espejos (`estereoscopio_espejos`) | Óptica | III | Espejo pulido ×2, Madera tallada ×2, Pieza de latón antiguo ×2 | 420 | B instalado, A museístico | taller, museo, almacen | +15 puntos de probabilidad fotográfica (Taller); Revelado de placas daguerrotípicas; foto-expedicion | 0.01 | `artifact-estereoscopio-espejos` |
| Cámara daguerrotípica (`camara_daguerrotipos`) | Fotografía | IV | Lente pulida ×2, Madera tallada ×2, Placa de daguerrotipo ×1, Pieza de latón antiguo ×2 | 490 | D expedición, A museístico | campamento, museo, almacen | Tirada fotográfica en expediciones (consume placa); foto-expedicion | 0.01 | `artifact-camara-daguerrotipos` |
| Linterna mágica (`linterna_magica`) | Óptica | IV | Lente pulida ×2, Pieza de latón antiguo ×2, Módulo luminoso ×1, Madera tallada ×1 | 420 | A museístico | museo, almacen | Conferencia con linterna mágica | 0.02 | `artifact-linterna-magica` |
| Cámara oscura (`camara_oscura`) | Fotografía | III | Madera tallada ×2, Lente pulida ×2, Espejo pulido ×1, Pergamino antiguo ×1 | 420 | B instalado, A museístico | taller, museo, almacen | Revelado de placas daguerrotípicas; Registro paisajístico con cámara oscura | 0.01 | `artifact-camara-oscura` |
| Máquina electrostática (`maquina_electrostatica`) | Electricidad | IV | Pieza de latón antiguo ×2, Madera tallada ×2, Componente eléctrico ×2, Engranaje de latón ×1 | 490 | A museístico, B instalado | museo, taller, almacen | Demostración electrostática; Experimento electrostático | 0.02 | `artifact-maquina-electrostatica` |
| Pila de Volta (`pila_volta`) | Electricidad | IV | Pieza de latón antiguo ×2, Madera tallada ×2, Componente eléctrico ×2 | 420 | B instalado, A museístico | taller, museo, almacen | Experimento con la pila voltaica; Medición galvánica; Experimento de inducción | 0.01 | `artifact-pila-volta` |
| Galvanómetro (`galvanometro`) | Electricidad | IV | Pieza de latón antiguo ×2, Lente pulida ×1, Madera tallada ×2, Componente eléctrico ×1 | 420 | B instalado, A museístico | taller, museo, almacen | Medición galvánica; Experimento de inducción | 0.01 | `artifact-galvanometro` |
| Demostrador de inducción (`induccion_farad`) | Electricidad | V | Pieza de latón antiguo ×3, Engranaje de latón ×2, Componente eléctrico ×2, Madera tallada ×1 | 560 | B instalado, A museístico | taller, museo, almacen | Experimento de inducción | 0.01 | `artifact-induccion-farad` |
| Carta cartográfica histórica (`carta_historica`) · histórico | Cartografía | I | Fragmento de mapa ×2, Moneda antigua ×1 | 180 | A museístico | museo, almacen | Atractivo museístico | 0.01 | `artifact-carta-historica` |
| Medallón de expedición (`medallon_viajero`) · histórico | Historia | I | Moneda antigua ×2, Pergamino antiguo ×1 | 300 | A museístico | museo, almacen | Atractivo museístico | 0.01 | `artifact-medallon-viajero` |
| Astrolabio de latón (`astrolabio_laton`) · histórico | Astronomía | I | Pieza de latón antiguo ×3, Lente pulida ×1, Moneda antigua ×1 | 420 | B instalado, A museístico | taller, museo, almacen | Cálculo de derrotas y cartografía | 0.01 | `artifact-astrolabio-laton` |
| Diario de explorador (`diario_explorador`) · histórico | Historia | I | Tintero antiguo ×1, Pergamino antiguo ×3, Fragmento de mapa ×2 | 350 | A museístico | museo, almacen | Atractivo museístico | 0.01 | `artifact-diario-explorador` |
| Globo cartográfico antiguo (`globo_cartografico`) · histórico | Cartografía | I | Pieza de latón antiguo ×2, Madera tallada ×2, Fragmento de mapa ×4 | 500 | A museístico | museo, almacen | Atractivo museístico | 0.02 | `artifact-globo-cartografico` |

## 4. Materiales y componentes

| Componente | Receta | Taller | Fuentes alternativas | Usado en |
| --- | --- | --- | --- | --- |
| Engranaje de latón (`engranaje`) | Pieza de latón antiguo ×2 | II | — | Microscopio compuesto, Telescopio refractor, Esfera armilar, Planetario mecánico, Autómata cantor, Autómata escribiente, Máquina electrostática, Demostrador de inducción, Experimento de inducción |
| Espejo pulido (`espejo`) | Lente pulida ×1, Pieza de latón antiguo ×1 | III | — | Estereoscopio de espejos, Cámara oscura |
| Carta estelar (`carta_estelar`) | Pergamino antiguo ×1, Tintero antiguo ×1 | III | Observación astronómica | Globo celeste, Esfera armilar, Planetario mecánico, Cálculo de derrotas y cartografía |
| Placa de daguerrotipo (`placa_daguerrotipo`) | Pieza de latón antiguo ×1, Lente pulida ×1 | IV | — | Cámara daguerrotípica, Revelado de placas daguerrotípicas |
| Módulo luminoso (`modulo_luminoso`) | Lente pulida ×1, Pieza de latón antiguo ×1, Madera tallada ×1 | IV | — | Linterna mágica |
| Componente eléctrico (`componente_electrico`) | Pieza de latón antiguo ×2, Piedra de río pulida ×1 | IV | — | Máquina electrostática, Pila de Volta, Galvanómetro, Demostrador de inducción, Experimento con la pila voltaica, Experimento de inducción, Demostración electrostática |

- **Niveles de Taller**: se asignaron solo a estos seis componentes y a los artefactos nuevos.
- **Recetas históricas**: sin cambios, incluidas las preparaciones que desbloquean continentes; la prueba 9 las compara una a una.
- **Mejoras del Taller**: solo cuestan dinero y conocimiento, así que ninguna receta necesaria para mejorarlo exige ese mismo nivel.

| Grupo | Materiales | Estudio |
| --- | --- | --- |
| Plumas | Pluma tropical (`MAT-N01`), Plumón (`MAT-N02`), Pluma caudal (`MAT-N03`), Pluma marina (`MAT-N04`), Pluma facial (`MAT-N05`), Pluma de rapaz (`owl_feather`), Pluma de garza (`heron_feather`), Pluma iridiscente (`MAT-N08`) | Análisis microscópico de plumas |
| Pelo, lana y mudas | Pelo de guarda (`MAT-N09`), Lana desprendida (`MAT-N10`), Crin caída (`MAT-N11`), Muda estacional (`MAT-N12`), Bigote de nutria (`otter_whisker`) | Clasificación de pelo y mudas |
| Escamas y caparazones | Muda de serpiente (`MAT-N14`), Muda escamosa (`MAT-N15`), Escudo de caparazón (`MAT-N16`), Escama de cola de castor (`beaver_tail_scale`) | Estudio de escamas y caparazones |
| Huesos, dientes y estructuras calcáreas | Fragmento de cornamenta (`antler_fragment`), Púas desprendidas (`MAT-N18`), Diente de lobo (`wolf_tooth`), Colmillo de jabalí (`boar_tusk`), Cascarón moteado (`MAT-N19`), Fragmento de sepión (`MAT-N21`) | Estudio osteológico y de estructuras calcáreas |
| Rastros y señales | Huella en arcilla (`MAT-N22`), Muestra de huellas (`animal_trace`), Marca de alimentación (`MAT-N24`), Egagrópila (`MAT-N20`) | Análisis de rastros y señales |

Las fuentes y probabilidades históricas y las ampliaciones de MEC-03 no cambian. Ningún material depende de legendarios, relictos ni variantes (prueba 8).

## 5. Taller por niveles

| Nivel | Nombre | Componentes | Artefactos | Estudios | Lotes | Subcomponentes |
| --- | --- | --- | --- | --- | --- | --- |
| I | Mesa de trabajo | todas las recetas históricas | Carta cartográfica histórica, Medallón de expedición, Astrolabio de latón, Diario de explorador, Globo cartográfico antiguo | — | 1 | no |
| II | Taller artesanal | Engranaje de latón | — | Estudio osteológico y de estructuras calcáreas, Análisis de rastros y señales | 1 | no |
| III | Taller científico | Espejo pulido, Carta estelar | Microscopio compuesto, Autómata cantor, Estereoscopio de espejos, Cámara oscura | Análisis microscópico de plumas, Clasificación de pelo y mudas, Estudio de escamas y caparazones, Registro paisajístico con cámara oscura | 1, 5 | no |
| IV | Taller especializado | Placa de daguerrotipo, Módulo luminoso, Componente eléctrico | Telescopio refractor, Globo celeste, Esfera armilar, Cámara daguerrotípica, Linterna mágica, Máquina electrostática, Pila de Volta, Galvanómetro | Observación astronómica, Cálculo de derrotas y cartografía, Revelado de placas daguerrotípicas, Experimento electrostático, Experimento con la pila voltaica, Medición galvánica | 1, 5 | sí |
| V | Laboratorio | — | Planetario mecánico, Autómata escribiente, Demostrador de inducción | Copia mecánica de informes, Experimento de inducción | 1, 5, 10 | sí |

## 6. Actividades científicas

Se reutilizan los estudios de materiales del Taller: son **instantáneos**, algunos con espera, y no se crearon temporizadores nuevos.

- Se validan instrumentos, nivel, materiales y espera.
- La confirmación muestra lo que se consume y lo que se recibe.
- El dinero pasa por `earnMoney` (`taller`).
- Los coleccionables pasan por `grant` y conservan su procedencia.
- Ningún estudio consume coleccionables.

| Estudio | Motor | Taller | Instrumentos | Consume | Recompensa | Espera |
| --- | --- | --- | --- | --- | --- | --- |
| Análisis microscópico de plumas | analisis | III | Microscopio compuesto (taller) | 3 × plumas | 90 C, £30 | — |
| Clasificación de pelo y mudas | analisis | III | Microscopio compuesto (taller) | 3 × pelo, lana y mudas | 85 C, £25 | — |
| Estudio de escamas y caparazones | analisis | III | Microscopio compuesto (taller) | 2 × escamas y caparazones | 80 C, £25 | — |
| Estudio osteológico y de estructuras calcáreas | analisis | II | — | 2 × huesos, dientes y estructuras calcáreas | 60 C | — |
| Análisis de rastros y señales | analisis | II | — | 3 × rastros y señales | 55 C | — |
| Copia mecánica de informes | analisis | V | Autómata escribiente (taller) | Pergamino antiguo ×2, Tintero antiguo ×1 | 70 C, £60 | — |
| Observación astronómica | astronomia | IV | Telescopio refractor (taller) | Pergamino antiguo ×1 | 40 C, Carta estelar ×1 | 6 h |
| Cálculo de derrotas y cartografía | astronomia | IV | Esfera armilar o Astrolabio de latón (taller) | Carta estelar ×1, Fragmento de mapa ×3 | 50 C, 1 parte de mapa | — |
| Registro paisajístico con cámara oscura | fotografia | III | Cámara oscura (taller) | Pergamino antiguo ×2, Tintero antiguo ×1 | 30 C, Fragmento de mapa ×1 | — |
| Revelado de placas daguerrotípicas | fotografia | IV | Cámara oscura (taller) | Placa de daguerrotipo ×1, Tintero antiguo ×1 | 40 C, 45 % daguerrotipo accesible | — |
| Experimento electrostático | fisica | IV | Máquina electrostática (taller) | Madera tallada ×1 | 110 C | 4 h |
| Experimento con la pila voltaica | fisica | IV | Pila de Volta (taller) | Componente eléctrico ×1 | 140 C, £40 | — |
| Medición galvánica | fisica | IV | Pila de Volta (taller), Galvanómetro (taller) | Piedra de río pulida ×2 | 120 C, £80 | 6 h |
| Experimento de inducción | fisica | V | Pila de Volta (taller), Galvanómetro (taller), Demostrador de inducción (taller) | Componente eléctrico ×2, Engranaje de latón ×1 | 420 C, £200 | 24 h |

**Fotografía.**

- Las expediciones siguen encontrando daguerrotipos, igual que en MEC-03.
- La cámara, instalada en el Campamento, consume una placa al zarpar y fija una tirada fotográfica. El resultado es un daguerrotipo de un continente del destino y queda en el recibo (`photography`).
- El Taller revela placas con la cámara oscura. Solo salen imágenes de territorios desbloqueados, con su origen y lugar registrados.
- El estereoscopio suma probabilidad.
- Los comerciantes siguen ofreciendo daguerrotipos.

**Cartografía.** El cálculo de derrotas, con la esfera armilar o el astrolabio, produce una parte del primer mapa continental pendiente cuya fuente es accesible, con la misma regla que la capa cartográfica. Nunca produce mapas de territorios cuya investigación previa falta.

## 7. Museo: demostraciones y atractivo

| Demostración | Artefacto expuesto | Consume | Recompensa | Espera |
| --- | --- | --- | --- | --- |
| Demostración del planetario mecánico | Planetario mecánico | — | £250 y 60 C | 8 h |
| Exhibición del autómata cantor | Autómata cantor | — | £180 | 6 h |
| Conferencia con linterna mágica | Linterna mágica | Pergamino antiguo ×1 | £120 y 120 C | 8 h |
| Demostración electrostática | Máquina electrostática | Componente eléctrico ×1 | £300 | 8 h |

- **Demostraciones**: exigen el artefacto **en vitrina**. La espera se guarda con marca de tiempo, así que recargar, exportar o reorganizar no permite cobrar otra vez. El dinero va a `demostraciones` en el libro.
- **Atractivo**: es un ingreso nuevo y separado del zoológico. Solo cuentan los artefactos exhibidos, con un tope de £0,25/s, el mismo tick y el mismo límite offline de 8 h que el Museo. Va a la fuente `artefactos` del libro.
- El ingreso de los animales no cambia (prueba 16).
- No se implementó un calendario de eventos.

## 8. Modificadores

Se añade una sexta capa, **instrumentos**, independiente de las de MEC-05 (equipamiento, investigaciones, Campamento, Sociedad y Museo). Aparece en `breakdown(actividad).layers.instrumentos`.

| Id | Capa / fuente | Actividad | Tipo | Valor | Acumulación | Límite | Condición |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `globo-duracion` | instrumento:globo_celeste | expedicion:duracion | factor-aditivo | -0.1 | no acumulable (un globo) | -0.1 | globo celeste instalado en el Campamento al zarpar; se fija en job.mec06 |
| `camara-foto` | instrumento:camara_daguerrotipos | expedicion:fotografia | tirada-adicional | 0.5 | una tirada por expedición; consume una placa al zarpar | 0.65 | cámara instalada en el Campamento y una placa disponible al zarpar; se fija en job.mec06 |
| `estereo-foto` | instrumento:estereoscopio_espejos | fotografia:probabilidad | suma-a-probabilidad | 0.15 | suma con la base; límite | 0.15 | estereoscopio instalado en el Taller (revelado) o al zarpar (expedición) |

No se tocan las probabilidades de legendarios, relictos ni variantes.

## 9. Interfaz

En el Campamento, la ficha del **Taller** incluye cuatro secciones plegables que recuerdan su estado:

- **Instrumentos y artefactos**: ubicación con botones Vitrina, Taller, Campamento y Almacén, y la sección «Por fabricar», con plan de subcomponentes.
- **Estudios científicos**: con motivos de bloqueo.
- **Demostraciones del Museo**: con el atractivo actual.
- **Índice de objetos**, por categoría.

Cada objeto abre una **ficha** emergente: qué es, cantidad, estado, para qué sirve, receta con enlaces a sus materiales, cómo se obtiene y dónde se usa, con enlaces a las recetas y estudios que lo emplean. Se conservan los nombres cortos. Comprobado en Chrome sin interfaz (412 × 900), sin errores de consola.

## 10. Referencias artísticas

[`arte.csv`](arte.csv) cubre los 20 artefactos, los 6 componentes, los 27 materiales animales, los instrumentos instalados, los estudios y las demostraciones: 65 referencias necesitan arte nuevo y 8 pueden reutilizar ilustraciones existentes (`item-art-v3198`). Todas son estables, sin archivo, y no se generó arte.

## 11. Auditoría de dependencias

`tests/helpers/mec04-audit.cjs` conserva el verificador de MEC-04 y MEC-05 con sus supuestos (S1–S6) y añade `workshopAudit` sobre el estado final de la progresión. Comprueba:

- niveles del Taller sin objetos;
- componentes con fuentes reales para cada material base y sin ciclos;
- artefactos con nivel efectivo (componentes incluidos);
- estudios con instrumentos fabricables y materiales con fuente;
- demostraciones;
- la regla prohibida: ninguna receta exige un artefacto y ningún artefacto exige un componente que solo produzca su propio estudio.

Después **ejercita el motor real**: fabrica los 20 artefactos, los instala, realiza 13 estudios y presenta las 4 demostraciones. El cálculo de derrotas no se aplica en el estado final porque ya están todos los mapas; se prueba en un estado intermedio (prueba 6).

**Supuesto sintético (S4)**: las cantidades de materiales se asignan solo si el material tiene una fuente real. No es una simulación de duración ni se presenta como tal.

Resultado ([`auditoria-taller.json`](auditoria-taller.json)): con los dos catálogos (113 y 125 regiones) se llega al rango 20, los 20 artefactos son fabricables, no hay ciclos y 17 de 17 actividades aplicables se ejecutan.

## 12. Guardado y migración

- Se conservan:
  - los artefactos catalogados y su vitrina, el equipamiento, el inventario y los materiales;
  - las recetas, las exhibiciones y reservas, y las instalaciones;
  - los rangos, las colecciones, las actividades pendientes y los ingresos.
- `state.mec06` y `state.regionalRecords` se normalizan de forma idempotente y viajan con la exportación.
- No hay recompensas retroactivas.
- Ningún modificador derivado se guarda: el atractivo y las capas se calculan desde el estado.
- Las expediciones en curso sin `job.mec06` se liquidan sin foto ni duración nueva.

## 13. Pruebas

`tests/mec06.test.cjs`: **17 de 17 aprobadas**. Cubren los 26 puntos e incluyen el inventario. Los puntos 5–7, 13 y 14 se ejecutan con los dos arneses: el histórico (945 especies y 113 regiones) y el **catálogo completo (1.000 especies y 125 regiones)**.

| Prueba | Puntos |
| --- | --- |
| 1 | 1, 22 · transacciones de exhibición, catálogo y ubicación ante fallos de guardado |
| 2 | 2 · estados distintos; fósiles retirados no cuentan como exhibidos |
| 3 | 3, 23 · partidas antiguas: vitrina y almacén conservados, sin recompensas, viajes en curso |
| 4 | 4 · regiones: visita, registro regional, catálogo global; registro por encuentro real |
| 5 | 5, 6, 7, 13, 14 · auditoría del Taller con los dos catálogos |
| 6 | 6 · telescopio, esfera armilar (sin territorios inaccesibles), globo y cámara |
| 7 | 8 · 27 materiales con fuente y uso; tasas históricas intactas |
| 8 | 9–12 · niveles, recetas históricas intactas, lotes ×5, subcomponentes atómicos, artefactos únicos |
| 9 | 14, 17, 20 · análisis: instrumento, consumo, recompensas, recibo; sin coleccionables |
| 10 | 15 · revelado y cámara con procedencia y territorios accesibles |
| 11 | 16, 21, 24 · demostraciones con espera persistente; atractivo offline 8 h sin doble pago |
| 12 | 18 · reversibilidad y capa de instrumentos |
| 13 | 19, 20 · condiciones fijadas al zarpar; recibo con total y desglose; regla histórica de la brújula |
| 14 | 22 · fallos de guardado en estudios y demostraciones |
| 15 | 25 · exportación e importación idempotentes |
| 16 | inventario funcional, fichas enlazadas, geografía de MEC-04 en fichas |
| 17 | 26 · MEC-01 a MEC-05, versión, `release:verify`, catálogo completo |

### Suite completa (línea base MEC-05 frente a MEC-06)

| | MEC-05 `2aa10a1` | MEC-06 |
| --- | --- | --- |
| Pruebas | 960 | 977 (+17 de MEC-06) |
| Aprobadas | 744 | 761 |
| Fallidas | 216 | 216 (las mismas, aserciones históricas preexistentes) |
| Regresiones | — | **0** |
| Archivo que agota los 600 s | `global-v3240` | `global-v3240` |

**Cambios en pruebas existentes** (ninguna se eliminó ni se debilitó):
- MEC-02, prueba del Taller: las recetas históricas siguen sin nivel; los seis componentes de la beta ahora esperan el nivel de MEC-06.
- MEC-05:
  - Prueba 2: el catálogo global ya no explora ni completa una región (corrección 3.5); se comprueba con el registro regional.
  - Prueba 13: el desglose trae además la capa «instrumentos».
  - Prueba 23: la versión se compara con `package.json`.
- Pruebas de MEC-01 a MEC-05: 14/14, 12/12, 17/17, 15/15 y 22/22.

Resultados por prueba: [`linea-base-mec05.json`](linea-base-mec05.json) y [`resultado.json`](resultado.json). `release:verify` incluye `tests/mec06.test.cjs`.

## 14. Pendientes

- **BAL-01**: recompensas de estudios y demostraciones, esperas, atractivo, probabilidades fotográficas, duración del globo y niveles.
- **MEC-08**: logros regionales sobre `state.regionalRecords`.
- **Arte**: las referencias de `arte.csv` marcadas como nuevas.
- **Regla de la brújula**: decidir si su +4 % debe fijarse también al zarpar; hoy conserva la regla histórica.

## 15. Confirmación

No se generó ni se publicó ninguna APK, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó. No se modificaron ilustraciones zoológicas, variantes pigmentarias ni el fondo del Campamento. No se eliminaron recetas ni objetos, y no se añadieron ayudas de desarrollo a la progresión. El desarrollo se detiene aquí para la auditoría externa; no se avanzó a MEC-07.
