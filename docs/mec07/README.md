# MEC-07 · Récords naturales, conductas extraordinarias y observaciones científicas → V5.6.7 Beta

Rama `mec-07/v5.6.7-beta`, creada desde `mec-06/v5.6.6-beta` (`8e4e9f5`). No se fusiona a `main`. **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó.

La observación zoológica gana un sistema central, persistente y ampliable con **25 hitos** de récord natural (doce tipos de magnitud, con mínimos y máximos) y **20 conductas extraordinarias**.

- **De dónde salen.** Todo sale de los avistamientos reales del motor de campo: búsqueda manual, automática, tramos offline y sondeos profundos. No hay una exploración paralela.
- **Sorteos.** Los nuevos usan un generador aislado, así que las secuencias y probabilidades históricas no cambian.
- **Valores.** **Todos son provisionales** (BAL-01). Son récords de la especie en el juego, no récords mundiales absolutos.

## 1. Correcciones de MEC-06

| Punto | Corrección |
| --- | --- |
| 3.1 Fuentes del inventario | **Coleccionables**: solo las fuentes activas de MEC-03 y MEC-04 (`sourceText`); desaparecen las líneas «BETA» y «cae de N especies».<br>**Materiales históricos**: `SPECIES_DROPS` y la ampliación de MEC-03 por tipo de animal.<br>**Materiales nuevos**: el canal `nuevosMateriales` de MEC-01, solo mientras esté activo (tasa > 0); si se desactiva, deja de mostrarse.<br>La tabla experimental `speciesOf` queda archivada y el canal experimental de coleccionables sigue en 0. No se reactivó nada |
| 3.2 Cartografía | `mapAccess` exige cuatro cosas: que el mapa no esté fabricado, que no se tengan ya todas las partes, la investigación previa y una ruta de origen accesible (botín o capa cartográfica). El estudio usa esa misma regla (`studyCheck`), y la confirmación nombra la parte que se obtendrá antes de consumir. Las fuentes históricas no cambian |
| 3.3 Fotografía | **La cámara es voluntaria.** Política en `state.mec06.camera`: «preguntar» (por defecto), «siempre» o «nunca», también en el panel de instrumentos.<br>**Cuándo actúa.** Solo se ofrece, y solo consume placa, si hay daguerrotipos compatibles con los continentes del destino.<br>**Aviso.** El mensaje nombra el instrumento, la placa y el efecto; cancelar zarpa sin cámara.<br>**Decisión fijada.** Se guarda al zarpar en `job.mec06.camera`. Vale la misma regla para expediciones normales, ampliadas y especializadas.<br>**Sin cambios.** Las fuentes fotográficas y las probabilidades de MEC-03 |
| 3.4 Museo | El resumen distingue ingreso zoológico, bonificaciones históricas, ingreso de artefactos, combinado, proyección por hora y offline (8 h). Las demostraciones disponibles tienen acceso principal desde el Museo, con botones; se conserva el acceso del Taller. No se cuentan en el ingreso por segundo y sus recompensas no cambian |
| 3.5 Normalización | Instalados con ubicación válida, artefacto catalogado y fuera de la vitrina. Si se excede la capacidad, se conservan en el **orden de la configuración** (`AtlasMEC06.ARTIFACTS`) y el resto pasa al almacén. Nunca se pierde un artefacto, cada recuperación queda en `state.mec06.recovered` y el proceso es idempotente |

**Procedencia de las placas (propuesta para MEC-09).** No se implementó, porque guardar el origen en cada placa exigiría unidades con metadatos y un segundo inventario incompatible con el actual. La propuesta:

- Un registro opcional `state.mec06.plates` con lotes {origen, fecha, cantidad}, consumidos en orden FIFO.
- El revelado lo consultaría sin cambiar `state.inventory`.

## 2. Auditoría zoológica previa

- **Catálogo.** 1.000 especies y 125 regiones (arnés `full`, que carga GM-06 y GM-07 como `www/index.html`).
  - Cada especie tiene regiones (`REGIONS[].species`), biomas, horarios y estaciones (`SPECIES[id].habitats/times/seasons`).
  - El dimorfismo vive en `SEXUAL_DIMORPHISM`.
- **Vías de observación.** Una sola función registra avistamientos: el `encounter` base. Por ella pasan:
  - la búsqueda manual;
  - la búsqueda automática (`processAutomaticSearches`, por tramos `autoPending` con región, estación, hábitat, hora y método propios, y cursor `segment.at`);
  - los tramos offline (8 h);
  - los sondeos profundos y abisales (`encounter` → envoltura GM-3330 → base, con `segment.method`).
- **Qué hace `encounter` por cada especie avistada:**
  - registra el avistamiento y el registro regional (MEC-06);
  - anota la alimentación (12 %);
  - ejecuta el hito de MEC-01;
  - registra el sexo y el espécimen especial;
  - tira las muestras (una vez por búsqueda);
  - anota los relictos.
- **Censos.** Multiplican la cantidad (`amount`), nunca las tiradas.
- **Cuaderno.** Cinco etapas (`stageRequirements`), con la alternativa del guepardo en la etapa 3.
- **Punto de enganche.** Los récords se enganchan en el lugar exacto del hito de MEC-01 (`naturalRecordsMEC07`). Así se cubren todas las vías anteriores y no se crea un segundo bucle.
- **Especies sustituidas por no existir en el catálogo:**
  - *Anser indicus* → águila real;
  - *Limosa lapponica* → pardela sombría;
  - *Toxotes* → cobra escupidora de Mozambique.

## 3. Arquitectura

`www/js/mec07-natural-records.js` (`AtlasMEC07`) separa cinco capas:

1. **Configuración**: `RECORDS`, `BEHAVIORS`, `TYPES`, `METHODS`, `REWARDS` y `ART`.
2. **Elegibilidad** (`eligible`): especie realmente observada, hora, estación, bioma y sondeo.
3. **Generación** (`generate`): modelos normal acotado, triangular, uniforme, discreto y de evidencia acumulada por regiones.
4. **Actualización pura** (`update`): primera observación, mejor marca global y regional, mínimos o máximos, hito y evidencia pendiente.
5. **Presentación**: `fmt` y pistas.

**Varios hitos por especie.** El registro está organizado por hito, no por especie. El colibrí abeja tiene dos; el pingüino emperador, un récord y una conducta.

**Magnitudes que no pueden conocerse a simple vista:**

- longevidad: estimación con validación instrumental;
- profundidad: evidencia (presas, duración);
- migración: evidencia acumulada en regiones distintas; una sola observación no la revela.

**Generador aislado.** Es `rng(sal|fecha|fuente|región|especie|hito)`, sin `Math.random`. La sal se guarda en `state.naturalRecords.salt`.

- Cada búsqueda tiene un único resultado posible por hito, así que recargar o reabrir no permite repetir el sorteo.
- Las búsquedas ya liquidadas no se reevalúan, porque avanza el cursor histórico.

**Guepardo.** Conserva su secuencia exacta de `Math.random`, su probabilidad y sus textos. Es la única tirada de velocidad: `AtlasBeta560Actions.run` apunta al motor nuevo.

## 4. Hitos

| Id | Especie (id) | Tipo | Modelo | Límites | Umbral | Prob. manual/auto | Condiciones | Método | Instrumento | Testigo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `guepardo-velocidad` | Guepardo (`af_guepardo`) | Velocidad (máximo) | normal μ 85 σ 10 | 50 km/h – 120 km/h | ≥ 100 km/h | 0.1 / 0.1 | las de la especie | Observación directa | — | 209 búsq. |
| `halcon-picada` | Halcón peregrino (`na_esp_falco_peregrinus`) | Velocidad (máximo) | normal μ 240 σ 45 | 120 km/h – 350 km/h | ≥ 300 km/h | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 106 búsq. |
| `pez-vela-velocidad` | Pez vela del Indo-Pacífico (`mar_esp_istiophorus_platypterus`) | Velocidad (máximo) | normal μ 30 σ 7 | 12 km/h – 55 km/h | ≥ 45 km/h | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 194 búsq. |
| `berrendo-carrera` | Berrendo (`na_esp_antilocapra_americana`) | Velocidad (máximo) | normal μ 56 σ 8 | 35 km/h – 88 km/h | ≥ 75 km/h | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 4669 búsq. |
| `liebre-carrera` | Liebre europea (`liebre_europea`) | Velocidad (máximo) | normal μ 52 σ 8 | 30 km/h – 72 km/h | ≥ 65 km/h | 0.08 / 0.04 | times: amanecer/atardecer/noche | Estimación de campo | — | 753 búsq. |
| `ballena-azul-longitud` | Ballena azul (`mar_esp_balaenoptera_musculus`) | Longitud (máximo) | normal μ 24 σ 2.5 | 18 m – 30 m | ≥ 28 m | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 157 búsq. |
| `elefante-masa` | Elefante africano de sabana (`af_elefante_sabana`) | Masa (máximo) | normal μ 5.2 σ 1 | 2,5 t – 8 t | ≥ 7 t | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 456 búsq. |
| `jirafa-altura` | Jirafa (`af_jirafa`) | Altura (máximo) | normal μ 5 σ 0.35 | 4 m – 5,9 m | ≥ 5,6 m | 0.08 / 0.04 | las de la especie | Observación directa | — | 70 búsq. |
| `cocodrilo-longitud` | Cocodrilo marino (`oc_esp_crocodylus_porosus`) | Longitud (máximo) | normal μ 4.6 σ 0.6 | 3 m – 6,3 m | ≥ 5,8 m | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 91 búsq. |
| `anaconda-longitud` | Anaconda verde (`sa_esp_eunectes_murinus`) | Longitud (máximo) | normal μ 4 σ 0.6 | 2,5 m – 5,6 m | ≥ 5,2 m | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 23 búsq. |
| `sapo-pulga-tamano` | Sapo pulga (`sa_esp_brachycephalus_pulex`) | Tamaño mínimo (mínimo) | triangular 7.5/9/11 | 7,5 mm – 11 mm | ≤ 8,2 mm | 0.08 / 0.04 | las de la especie | Estimación de campo | microscopio_compuesto (taller) | 2588 búsq. |
| `colibri-abeja-tamano` | Colibrí abeja (`gm06_mellisuga_helenae`) | Tamaño mínimo (mínimo) | triangular 5/5.7/6.3 | 5 cm – 6,3 cm | ≤ 5,3 cm | 0.08 / 0.04 | las de la especie | Estimación de campo | — | 13 búsq. |
| `colibri-abeja-aleteo` | Colibrí abeja (`gm06_mellisuga_helenae`) | Frecuencia (máximo) | normal μ 70 σ 6 | 55 Hz – 85 Hz | ≥ 80 Hz | 0.08 / 0.04 | las de la especie | Estimación de campo | estereoscopio_espejos (taller) | 108 búsq. |
| `murcielago-abejorro-tamano` | Murciélago abejorro (`asia_esp_craseonycteris_thonglongyai`) | Tamaño mínimo (mínimo) | triangular 28/31/34 | 28 mm – 34 mm | ≤ 29 mm | 0.08 / 0.04 | times: amanecer/atardecer | Estimación de campo | — | 684 búsq. |
| `cachalote-profundidad` | Cachalote (`mar_esp_physeter_macrocephalus`) | Profundidad (máximo) | normal μ 900 σ 350 | 300 m – 2250 m | ≥ 2000 m | 0.08 / 0.04 | las de la especie | Evidencia de campo | — | 5 búsq. |
| `zifio-inmersion` | Zifio de Cuvier (`mar_esp_ziphius_cavirostris`) | Duración (máximo) | normal μ 60 σ 25 | 20 min – 222 min | ≥ 120 min | 0.08 / 0.04 | las de la especie | Observación directa | — | 572 búsq. |
| `pinguino-emperador-inmersion` | Pingüino emperador (`polar_esp_aptenodytes_forsteri`) | Profundidad (máximo) | normal μ 200 σ 110 | 40 m – 560 m | ≥ 500 m | 0.08 / 0.04 | las de la especie | Evidencia de campo | — | 5 búsq. |
| `elefante-marino-profundidad` | Elefante marino del sur (`polar_esp_mirounga_leonina`) | Profundidad (máximo) | normal μ 600 σ 350 | 100 m – 2300 m | ≥ 1500 m | 0.08 / 0.04 | las de la especie | Evidencia de campo | — | 65 búsq. |
| `condor-altitud` | Cóndor andino (`sa_esp_vultur_gryphus`) | Altitud (máximo) | normal μ 3500 σ 900 | 1500 m – 6500 m | ≥ 5500 m | 0.08 / 0.04 | las de la especie | Estimación de campo | telescopio_astronomico (taller) | 55 búsq. |
| `aguila-real-altitud` | Águila real (`aguila_real`) | Altitud (máximo) | normal μ 2400 σ 800 | 800 m – 4800 m | ≥ 4000 m | 0.08 / 0.04 | habitats: montana | Estimación de campo | — | 91 búsq. |
| `charran-migracion` | Charrán ártico (`polar_esp_sterna_paradisaea`) | Distancia migratoria (máximo) | evidencia: 35.500 km por región adicional | 0 km – 71.000 km | ≥ 70.000 km | 0.12 / 0.06 | las de la especie | Evidencia de campo | — | 17 búsq. |
| `pardela-migracion` | Pardela sombría (`mar_esp_ardenna_grisea`) | Distancia migratoria (máximo) | evidencia: 64.000 km por región adicional | 0 km – 64.000 km | ≥ 60.000 km | 0.12 / 0.06 | las de la especie | Evidencia de campo | — | 7 búsq. |
| `tiburon-groenlandia-longevidad` | Tiburón de Groenlandia (`polar_esp_somniosus_microcephalus`) | Longevidad estimada (máximo) | normal μ 230 σ 70 | 80 años – 400 años | ≥ 300 años | 0.05 / 0.025 | las de la especie | Estimación de campo | microscopio_compuesto (taller) | 74 búsq. |
| `tortuga-aldabra-longevidad` | Tortuga gigante de Aldabra (`af_tortuga_aldabra`) | Longevidad estimada (máximo) | normal μ 100 σ 30 | 40 años – 190 años | ≥ 150 años | 0.05 / 0.025 | las de la especie | Estimación de campo | microscopio_compuesto (taller) | 19 búsq. |
| `cobra-escupidora-precision` | Cobra escupidora de Mozambique (`af_xlsx_131_naja_mossambica`) | Precisión (máximo) | discreta 1/1.5/2/2.5/3 | 1 m – 3 m | ≥ 2,5 m | 0.08 / 0.04 | las de la especie | Observación directa | — | 899 búsq. |

## 5. Conductas extraordinarias

Son cualitativas: se registran para siempre al observarse por primera vez y después solo suman observaciones. Están asignadas especie a especie, no por familia, y ninguna es requisito de monografía.

| Id | Especie (id) | Categoría | Conducta | Prob. manual/auto | Condiciones | Método | Testigo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `emparrado-decorado` | Ave jardinera satinada (`oc_esp_ptilonorhynchus_violaceus`) | Construcción de estructuras | Emparrado decorado | 0.05 / 0.025 | times: dia | Observación directa | 2028 búsq. |
| `chimpance-herramientas` | Chimpancé común (`af_chimpance`) | Utilización de herramientas | Pesca de termitas | 0.05 / 0.025 | times: amanecer/dia/atardecer | Observación directa | 103 búsq. |
| `cuervo-nc-herramientas` | Cuervo de Nueva Caledonia (`gm06_corvus_moneduloides`) | Utilización de herramientas | Fabricación de ganchos | 0.05 / 0.025 | las de la especie | Observación directa | 324 búsq. |
| `cuervo-problemas` | Cuervo común (`na_esp_corvus_corax`) | Resolución de problemas | Resolución de problemas | 0.05 / 0.025 | las de la especie | Observación directa | 3 búsq. |
| `ave-lira-imitacion` | Ave lira soberbia (`oc_esp_menura_novaehollandiae`) | Imitación vocal | Imitación vocal | 0.05 / 0.025 | times: dia | Observación directa | 95 búsq. |
| `pulpo-camuflaje` | Pulpo común (`mar_esp_octopus_vulgaris`) | Camuflaje | Cambio de color y textura | 0.05 / 0.025 | las de la especie | Observación directa | 19 búsq. |
| `pulpo-coco-refugio` | Pulpo de coco (`mar_esp_amphioctopus_marginatus`) | Utilización de herramientas | Refugio transportado | 0.05 / 0.025 | las de la especie | Observación directa | 12 búsq. |
| `orca-caza-cooperativa` | Orca (`mar_esp_orcinus_orca`) | Caza cooperativa | Caza cooperativa | 0.05 / 0.025 | las de la especie | Observación directa | 199 búsq. |
| `pavo-real-cortejo` | Pavo real común (`asia_esp_0410`) | Cortejo | Exhibición de cortejo | 0.05 / 0.025 | times: amanecer/dia | Observación directa | 53 búsq. |
| `castor-dique` | Castor europeo (`castor_europeo`) | Construcción de estructuras | Construcción de un dique | 0.05 / 0.025 | times: atardecer/noche | Observación directa | 52 búsq. |
| `pez-volador-planeo` | Pez volador tropical (`mar_esp_exocoetus_volitans`) | Planeo | Planeo sobre el agua | 0.05 / 0.025 | las de la especie | Observación directa | 163 búsq. |
| `nutria-marina-piedras` | Nutria marina (`asia_esp_0177`) | Utilización de herramientas | Uso de piedras | 0.05 / 0.025 | las de la especie | Observación directa | 51 búsq. |
| `jorobada-burbujas` | Ballena jorobada (`mar_esp_megaptera_novaeangliae`) | Captura especializada de presas | Red de burbujas | 0.05 / 0.025 | las de la especie | Observación directa | 406 búsq. |
| `buey-almizclero-defensa` | Buey almizclero (`na_esp_ovibos_moschatus`) | Defensa colectiva | Círculo defensivo | 0.05 / 0.025 | las de la especie | Observación directa | 76 búsq. |
| `tejedor-nido` | Tejedor común (`af_xlsx_131_ploceus_cucullatus`) | Construcción de nidos | Nido tejido | 0.05 / 0.025 | times: amanecer/dia | Observación directa | 87 búsq. |
| `ardilla-voladora-planeo` | Ardilla voladora siberiana (`asia_esp_0843`) | Planeo | Planeo entre árboles | 0.05 / 0.025 | times: amanecer/atardecer/noche | Observación directa | 184 búsq. |
| `geco-hoja-camuflaje` | Geco cola de hoja satánico (`af_xlsx_gecko_hoja`) | Mimetismo | Mimetismo de hoja seca | 0.05 / 0.025 | las de la especie | Observación directa | 318 búsq. |
| `pez-hacha-bioluminiscencia` | Pez hacha plateado (`deep_esp_argyropelecus_aculeatus`) | Bioluminiscencia | Contrailuminación | 0.05 / 0.025 | deep: true | Evidencia de campo | 49 búsq. |
| `urogallo-cantadero` | Urogallo común (`urogallo_comun`) | Exhibiciones territoriales | Canto en el cantadero | 0.05 / 0.025 | times: amanecer | Observación directa | 856 búsq. |
| `emperador-incubacion` | Pingüino emperador (`polar_esp_aptenodytes_forsteri`) | Cuidado parental | Incubación en invierno | 0.05 / 0.025 | seasons: invierno | Observación directa | 51 búsq. |

## 6. Integración con el campo

- **Una evaluación por especie.** Como máximo, una de cada hito elegible por especie realmente observada en cada búsqueda.
  - Nunca por individuo del censo; la prueba 10 lo comprueba con censo ×3.
  - En los encuentros grupales, cada especie se evalúa por separado.
  - No hay registros en búsquedas sin avistamiento.
- **Probabilidad.** Mayor en la búsqueda manual (configurable); en la automática, la mitad.
- **Hábitats.** En la manual, el bioma elegido. En la automática, los biomas de la especie en la región (reglas del equipo automático).
- **Tramos offline.** Usan la región, estación, hora y fecha del propio tramo, no `Date.now()`. Respetan el límite de 8 h y los cupos por hora.
- **Sondeos profundos.** Producen **evidencia** (por ejemplo, la bioluminiscencia del pez hacha), no observación directa.
- **Diario.** Avisos breves con «◆» solo en estos casos:
  - primera conducta;
  - primera medición;
  - récord personal con mejora de al menos 2 %;
  - hito cumplido;
  - evidencia pendiente.
  
  Las mejoras pequeñas se guardan sin llenar el diario. El encuentro muestra insignias «◆» propias, sin halos de rareza ni ventanas obligatorias.

## 7. Progreso, Cuaderno, instrumentos y recompensas

- **Estado por hito:**
  - número de observaciones;
  - primera observación;
  - mejor marca global (valor, fecha, región, método, instrumento) y por región;
  - hito cumplido y su fecha;
  - evidencia pendiente.
  
  El historial se limita a 30 entradas; no hay una entrada por búsqueda.
- **Cuaderno.**
  - Las cinco etapas históricas no cambian.
  - El guepardo conserva su alternativa de velocidad en la etapa 3, con sus valores provisionales intactos.
  - Se añade **una** alternativa nueva: el halcón peregrino (picada ≥ 300 km/h, etapa 3).
  - Ningún récord es obligatorio ni bloquea monografías (prueba 13).
- **Instrumentos (MEC-06).** Solo cinco integraciones justificadas, todas de **validación científica**:
  - microscopio: sapo pulga y las dos longevidades;
  - estereoscopio: aleteo del colibrí;
  - telescopio: altitud del cóndor.
  
  El registro observado se conserva y se valida después desde el Cuaderno, en una transacción. Ninguno exige el Taller V.
- **Recompensas provisionales, únicas y persistentes:**
  - primera observación de un hito: 20 de conocimiento;
  - hito cumplido: 150 de conocimiento, 2 de prestigio y referencia de medalla;
  - primera conducta: 40 de conocimiento y 1 de prestigio.
  
  Mejorar una marca no da prestigio, y nada se paga de nuevo al recargar, importar o migrar. No cambian los rangos de la Sociedad. `state.naturalRecords` queda listo para los logros de MEC-08.
- **Independencia.** Variantes, dimorfismo, especímenes, legendarios y relictos no se tocan. Ninguna especie de los hitos es legendaria ni relicta, y ningún récord entrega objetos.

## 8. Interfaz

- **Cuaderno → «Récords naturales»** (plegable, sin icono nuevo en la barra):
  - totales: observados, cumplidos, conductas y por validar;
  - progreso por categoría;
  - filtros por tipo, grupo zoológico, estado y región;
  - mejor marca con región y método;
  - botón «Atlas», que abre la región con los accesos existentes;
  - validación de evidencias.
- **Hitos no descubiertos.** Muestran solo el tipo y una pista. La especie aparece como «No identificado» hasta descubrirla.
- **Bestiario.** La ficha añade «Registros especiales» solo con lo descubierto de esa especie: marcas, conductas y regiones. Se mantienen la paginación y los filtros.
- **Comprobación.** Chrome sin interfaz (412 × 900): migración del guepardo, sección, filtros y botones, sin errores de consola.

## 9. Registro regional

- Se reutiliza `state.regionalRecords` de MEC-06: cada región guarda `natural[hito]` (número de observaciones). El detalle de cada marca regional vive en `naturalRecords.records[hito].regions`.
- **Global frente a regional.** El mejor global es el máximo de los regionales.
- **Atribución.** Un récord se atribuye a la región del encuentro, también en tramos offline y sondeos. No se inventan observaciones retrospectivas.

## 10. Auditoría de accesibilidad

`recordsAudit` está en `tests/helpers/mec04-audit.cjs`. Parte de la progresión real de `run()`: rango 20, 125 regiones y todas las investigaciones. Para cada hito y conducta comprueba:

- especie;
- regiones válidas según el método (campo o sondeo);
- horarios, estaciones y biomas compatibles;
- probabilidad positiva;
- instrumento fabricable (MEC-06);
- límites y alcanzabilidad del umbral (20.000 muestras);
- regiones suficientes para la evidencia migratoria.

Después ejecuta un **testigo con el motor real**: encuentros reales con semilla reproducible hasta registrar el hito.

**Resultado: 25 hitos y 20 conductas, todos accesibles y sin problemas.** El detalle, con el número de búsquedas de cada testigo, está en [`auditoria-registros.json`](auditoria-registros.json).

**Supuesto sintético.** Tras la progresión real, el testigo fija región, hábitat, hora y estación. No es una simulación económica ni temporal.

## 11. Referencias artísticas

[`arte.csv`](arte.csv) recoge 43 referencias nuevas:

- categorías de récord;
- indicadores (nueva marca, hito, evidencia pendiente, primera conducta);
- medallas futuras de cada hito;
- lámina de evidencia.

Los 25 hitos y las 20 conductas reutilizan las ilustraciones zoológicas existentes (45 referencias). No se generó arte ni se tocaron variantes o tratamientos de rareza.

## 12. Fuentes científicas

| Id | Respaldo científico |
| --- | --- |
| `guepardo-velocidad` | Acinonyx jubatus: carreras de caza registradas con collares GPS hasta unos 93 km/h (Wilson et al. 2013); estimaciones clásicas de 100–110 km/h. |
| `halcon-picada` | Falco peregrinus: picados medidos de 300–390 km/h en vuelos entrenados (Tucker 1998; Ponitz et al. 2014); en caza silvestre suelen ser menores. |
| `pez-vela-velocidad` | Istiophorus platypterus: mediciones modernas de arranques de unos 30 km/h (Svendsen et al. 2016); las cifras históricas de 110 km/h no se consideran fiables, por eso el límite es prudente. |
| `berrendo-carrera` | Antilocapra americana: carreras sostenidas de unos 56 km/h durante kilómetros y picos de 86–88 km/h (Byers 1997). |
| `liebre-carrera` | Lepus europaeus: carreras de huida de hasta unos 70 km/h. |
| `ballena-azul-longitud` | Balaenoptera musculus: adultos de 24–27 m; los mayores ejemplares medidos rondan los 30 m. |
| `elefante-masa` | Loxodonta africana: machos adultos de 4,5–6,1 t; los mayores registros superan las 10 t. El límite del juego es conservador. |
| `jirafa-altura` | Giraffa camelopardalis: machos de unos 5,5 m; máximos registrados cercanos a 5,9 m. |
| `cocodrilo-longitud` | Crocodylus porosus: machos de 4–5,5 m; el mayor ejemplar medido con fiabilidad, 6,17 m. |
| `anaconda-longitud` | Eunectes murinus: hembras de 4–5 m; las cifras de 7 m o más no están verificadas (Rivas 2000). |
| `sapo-pulga-tamano` | Brachycephalus pulex: adultos de unos 8–10 mm (Napoli et al. 2011). Se estima en el campo y se valida con el microscopio. |
| `colibri-abeja-tamano` | Mellisuga helenae: 5–6 cm y unos 2 g; el ave más pequeña. |
| `colibri-abeja-aleteo` | Mellisuga helenae: frecuencias de aleteo de unas 80 por segundo en machos en cortejo. La cifra exige un registro visual analizado. |
| `murcielago-abejorro-tamano` | Craseonycteris thonglongyai: 29–33 mm de cabeza y cuerpo y unos 2 g; uno de los mamíferos más pequeños. |
| `cachalote-profundidad` | Physeter macrocephalus: inmersiones habituales de 400–1.200 m y máximos de más de 2.000 m (Watwood et al. 2006). En 1842 solo puede inferirse. |
| `zifio-inmersion` | Ziphius cavirostris: inmersiones de unos 60 min; máximo registrado de 222 min (Quick et al. 2020). |
| `pinguino-emperador-inmersion` | Aptenodytes forsteri: inmersiones habituales de 100–200 m y máximos de unos 560 m (Wienecke et al. 2007). |
| `elefante-marino-profundidad` | Mirounga leonina: inmersiones habituales de 300–800 m y máximos superiores a 2.000 m. |
| `condor-altitud` | Vultur gryphus: planea habitualmente entre 3.000 y 5.000 m y se ha observado por encima de 6.000 m en los Andes. |
| `aguila-real-altitud` | Sustituye al ganso de cabeza barrada (Anser indicus), ausente del catálogo. Aquila chrysaetos se ha registrado volando por encima de 4.000 m en cordilleras. |
| `charran-migracion` | Sterna paradisaea: migraciones anuales de unos 70.900 km entre el Ártico y la Antártida (Egevang et al. 2010). Una sola observación no permite conocerla. |
| `pardela-migracion` | Sustituye a la aguja colipinta (Limosa lapponica), ausente del catálogo. Ardenna grisea: migraciones de unos 64.000 km al año (Shaffer et al. 2006). |
| `tiburon-groenlandia-longevidad` | Somniosus microcephalus: datación del cristalino de 272 a unos 392 años (Nielsen et al. 2016). Es una estimación que exige validación. |
| `tortuga-aldabra-longevidad` | Aldabrachelys gigantea: individuos documentados de más de 150 años; algunos casos superan los 180. Es una estimación que exige validación. |
| `cobra-escupidora-precision` | Sustituye al pez arquero (Toxotes), ausente del catálogo. Naja mossambica proyecta veneno con precisión hacia los ojos a unos 2–3 m (Westhoff et al. 2005). |
| `emparrado-decorado` | Ptilonorhynchus violaceus: los machos decoran el emparrado con objetos azules. |
| `chimpance-herramientas` | Pan troglodytes: uso documentado de herramientas, como varas para termitas o piedras para cascar nueces (Goodall 1964). |
| `cuervo-nc-herramientas` | Corvus moneduloides: fabrica herramientas con gancho (Hunt 1996). |
| `cuervo-problemas` | Corvus corax: resuelve problemas de varios pasos (Heinrich 1995). |
| `ave-lira-imitacion` | Menura novaehollandiae: imita con fidelidad cantos ajenos y sonidos del entorno. |
| `pulpo-camuflaje` | Octopus vulgaris: camuflaje rápido mediante cromatóforos y papilas. |
| `pulpo-coco-refugio` | Amphioctopus marginatus: transporta cáscaras para usarlas como refugio (Finn et al. 2009). |
| `orca-caza-cooperativa` | Orcinus orca: caza coordinada en grupo, incluido el «lavado de olas» sobre témpanos. |
| `pavo-real-cortejo` | Pavo cristatus: exhibición de cortejo con la cola desplegada y vibrante. |
| `castor-dique` | Castor fiber: construye diques y madrigueras que modifican el cauce. |
| `pez-volador-planeo` | Exocoetus volitans: planeos de más de 50 m sobre la superficie. |
| `nutria-marina-piedras` | Enhydra lutris: usa piedras para abrir moluscos. |
| `jorobada-burbujas` | Megaptera novaeangliae: alimentación con redes de burbujas, a veces en grupo. |
| `buey-almizclero-defensa` | Ovibos moschatus: defensa colectiva en círculo ante depredadores. |
| `tejedor-nido` | Ploceus cucullatus: los machos tejen nidos colgantes con nudos de fibras. |
| `ardilla-voladora-planeo` | Pteromys volans: planeo con patagio de hasta varias decenas de metros. |
| `geco-hoja-camuflaje` | Uroplatus phantasticus: mimetismo de hoja seca con cola foliácea. |
| `pez-hacha-bioluminiscencia` | Argyropelecus aculeatus: fotóforos ventrales para contrailuminación. En el juego, evidencia indirecta del sondeo. |
| `urogallo-cantadero` | Tetrao urogallus: cantaderos al amanecer; en el juego se limita a la franja del alba. |
| `emperador-incubacion` | Aptenodytes forsteri: el macho incuba unos dos meses sin alimentarse. |

Las matrices completas están en [`hitos.csv`](hitos.csv) y [`conductas.csv`](conductas.csv), generadas por `scripts/build-mec07-records.cjs`. Incluyen regiones, horarios, estaciones, biomas, probabilidades, límites y testigos.

## 13. Guardado y migración

- **Estructura.** `state.naturalRecords = {schema, salt, records:{hito}, behaviors:{conducta}, history (≤ 30), migration}`. Es compacta, normalizable e idempotente, y descarta ids desconocidos.
- **Guepardo.**
  - `state.beta560.hitos.af_guepardo` se migra una sola vez: mejor velocidad, intentos, estado y fechas.
  - No genera recompensas: `rewards: {first:'migrado', milestone:'migrado'}`.
  - El registro antiguo se conserva y se mantiene como espejo para el requisito histórico del Cuaderno.
- **Exportación e importación.** Conservan el registro sin pagar de nuevo.
- **Fallos de guardado.** La validación es atómica.

## 14. Pruebas

`tests/mec07.test.cjs`: **18 de 18 aprobadas**. Cubren los 26 puntos. Los puntos 1, 8–10 y 13 usan el catálogo completo (1.000 especies y 125 regiones).

| Prueba | Puntos |
| --- | --- |
| 1 | 1 · fuentes sin tabla experimental; canal activo; nada reactivado |
| 2 | 2 · acceso cartográfico efectivo, misma regla en el estudio y aviso previo |
| 3 | 3 · placas voluntarias, compatibles, decisión fijada; modalidad especializada |
| 4 | 4 · desglose del Museo y demostraciones activas |
| 5 | 5 · normalización determinista sin pérdidas |
| 6 | 6, 7 · migración del guepardo, idempotencia, alternativa, una tirada |
| 7 | 8, 9, 10 · 25 hitos, 20 conductas, varios por especie; auditoría con testigos |
| 8 | 11, 12 · máximos, mínimos, mejores marcas, evidencia pendiente, límites |
| 9 | 13 · elegibilidad geográfica y ambiental |
| 10 | 14, 15, 16 · encuentros grupales, censo ×3, búsquedas manuales y automáticas |
| 11 | 17 · offline con contexto histórico y sin repetir sorteos |
| 12 | 18, 19 · misma secuencia histórica con y sin MEC-07; legendarios y relictos |
| 13 | 20 · monografías no bloqueadas |
| 14 | 21 · recompensas únicas y persistentes |
| 15 | 22, 24 · validación científica y fallo de guardado |
| 16 | 23 · registro regional y procedencia |
| 17 | 25 · exportación e importación; Cuaderno y Bestiario |
| 18 | 26 · MEC-01 a MEC-06, catálogo completo, versión y verificación |

### Suite completa (línea base MEC-06 frente a MEC-07)

| | MEC-06 `8e4e9f5` | MEC-07 |
| --- | --- | --- |
| Pruebas | 977 | 995 (+18 de MEC-07) |
| Aprobadas | 761 | 779 |
| Fallidas | 216 | 216 (las mismas, aserciones históricas preexistentes) |
| Regresiones | — | **0** |
| Archivo que agota los 600 s | `global-v3240` | `global-v3240` |

**Cambios en pruebas existentes** (ninguna se eliminó ni se debilitó):

- **MEC-06, prueba 26:** la versión se compara con `package.json` en lugar del literal 5.6.6.
- **Arnés de pruebas:**
  - el modo `full` carga también `gm06/art.js` y `gm07-m01/art.js`, como `www/index.html`, para poder dibujar las especies de GM-06;
  - la opción nueva `without` permite comparar el juego con y sin un módulo.
- **MEC-01 a MEC-06:** 14/14, 12/12, 17/17, 15/15, 22/22 y 17/17. La prueba 12 de MEC-01 (guepardo) pasa sin cambios con el motor nuevo.

Resultados por prueba: [`linea-base-mec06.json`](linea-base-mec06.json) y [`resultado.json`](resultado.json). `release:verify` incluye `tests/mec07.test.cjs`.

## 15. Pendientes

- **BAL-01**: probabilidades, modelos, umbrales y recompensas de hitos y conductas.
- **MEC-08**: logros sobre `state.naturalRecords` y `regionalRecords[].natural`; medallas.
- **MEC-09**: procedencia de las placas (propuesta en la sección 1).
- **Arte**: las referencias nuevas de `arte.csv`.

## 16. Confirmación

No se generó ni se publicó ninguna APK, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó. No se añadieron especies. No se modificaron ilustraciones zoológicas, variantes pigmentarias ni probabilidades históricas, y no se añadieron ayudas de desarrollo a la progresión. El desarrollo se detiene aquí para la auditoría externa; no se avanzó a MEC-08.
