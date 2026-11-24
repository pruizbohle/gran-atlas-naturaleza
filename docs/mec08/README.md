# MEC-08 · Encargos, logros, reconocimientos y eventos especiales → V5.6.8 Beta

Rama `mec-08/v5.6.8-beta`, creada desde `mec-07/v5.6.7-beta` (`a10a686`). No se fusiona a `main`. **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó.

MEC-08 amplía los motores que ya existían (logros 3360 y encargos 3370) en lugar de crear sistemas paralelos. Añade, sobre un solo motor, la correspondencia científica renovable, los proyectos institucionales y los encargos de evento. Añade también un calendario central de diez eventos con una capa propia de modificadores temporales. **Todos los valores son provisionales** (BAL-01). No hay monetización, ni contenido exclusivo de eventos, ni penalizaciones por ausencia.

## 1. Correcciones de MEC-07

| Punto | Corrección |
| --- | --- |
| 3.1 Migraciones | **Modelo.** El modelo de «km por región» se sustituye por **conjuntos de rutas** (`model.basis:'rutas'`): zonas de cría, tránsito e invernada, formadas por las regiones del catálogo donde vive la especie. El valor es la ruta completa solo cuando están cubiertas todas las zonas exigidas; si no, es un tramo parcial (25 % × zonas cubiertas / exigidas), siempre por debajo del umbral.<br>**Charrán ártico.** Exige cría en el Ártico (dos regiones) e invernada en el océano Austral, es decir, ambos hemisferios. Ruta: 70.900 km.<br>**Pardela sombría.** Exige colonias subantárticas y la zona de tránsito y alimentación del Pacífico austral. Ruta: 64.000 km.<br>**Método.** Pasa a ser «Reconstrucción documental», con una nota explícita: no se afirma que se haya seguido al mismo individuo.<br>**Hitos previos.** Los reconocidos con el modelo anterior **se conservan**, y el registro guarda `modelBefore` con el modelo de MEC-07 (`perRegion`), su marca y su estado. La migración es idempotente (`naturalRecords.migration.routes`) |
| 3.2 Evidencias regionales | **Conservación.** `update` guarda la mejor evidencia pendiente **de cada región** (`pendingByRegion`); `pending` sigue siendo la mejor de todas, por compatibilidad.<br>**Validación por región.** `validate(id, now, región)` valida una sola región y conserva las demás. La validación **no suma observaciones**: el contador global y el regional quedan iguales.<br>**Fechas.** La fecha de observación se mantiene (`best.at`) y la de validación se guarda aparte (`best.validatedAt`).<br>**Recompensas.** No se repiten: cada recompensa se paga una sola vez por hito (`rewards`) |
| 3.3 Conductas y sexo | **Conductas sexuadas** (`sex:'male'`): emparrado, pavo real, urogallo e incubación del pingüino emperador. Se evalúan con un segundo enganche (`naturalRecordsSexMEC08`), justo después de `recordSexObservation`, y usan el sexo del ejemplar observado **sin una segunda tirada**.<br>**Política documentada** (`SEX_POLICY`): sexo contrario → no elegible en ese encuentro; sexo desconocido o especie sin dimorfismo registrable → se registra «inferido por la conducta». La conducta guarda `sex` y `sexSource`.<br>**Orden de tiradas.** Las conductas usan el RNG aislado, y la prueba 27 comprueba que el enganche hace cero llamadas a `Math.random`. Por eso el orden histórico de tiradas no cambia |
| 3.4 Coherencia instrumental | **Métodos.** Se añaden «Análisis de muestras» y «Reconstrucción documental», y cada método lleva una nota (`METHOD_NOTES`).<br>**Instrumentos.** Cada uno indica su método y una nota prudente. Por ejemplo, las placas estereoscópicas «confirman que la estimación por el zumbido es plausible; no miden la frecuencia», y la triangulación es «una estimación mejor fundada, no una medición directa».<br>**Magnitudes.** Ningún texto afirma que un instrumento de 1842 demuestre una medición moderna. Magnitudes, umbrales y probabilidades **sin cambios** (prueba 28) |
| 3.5 Interfaz | **Registro.** Paginado a 20 por página: las 45 entradas son accesibles sin filtros (prueba 29).<br>**Búsqueda por especie.** Usa el nombre visible, el científico o el del hito, y nunca revela especies sin identificar.<br>**Filtros.** «Estado del hito» (nunca, observado, cumplido, registrada) y «Evidencia» (pendiente o sin pendiente) son independientes. Se corrige el filtro de pendientes.<br>**Marcas regionales.** «◆ N regiones», y en las migraciones el estado de la ruta (zonas cubiertas y faltantes).<br>**Navegación.** El Bestiario abre el registro del Cuaderno filtrado por la especie (`mec07-records`); se mantienen el acceso desde el Cuaderno y el botón Atlas |
| 3.6 Fuentes del inventario | **Una sola fuente vigente**: `globalThis.AtlasItemSources`, la misma función que el `sourcesOf()` público. La `sourcesOf` local de MEC-06 delega en ella; la base de artefactos queda como `sourcesOfBase`.<br>**Usuarios.** La ficha, el índice del Taller, `audit()`, `inventoryAudit()` y el CSV (`scripts/build-mec06-inventory.cjs`) usan todos la misma fuente.<br>**Asociaciones.** Las experimentales coleccionable-especie no aparecen. Los materiales nuevos muestran su procedencia real, el canal `nuevosMateriales` activo (prueba 30) |
| 3.7 Persistencia | **Normalización robusta.** `normRecord8` y `normBehavior8` cubren contadores (enteros ≥ 0), fechas (número positivo o `null`), magnitudes acotadas a `bounds`, regiones, evidencias, estados cumplidos y recompensas.<br>**Hitos.** Un hito cumplido **nunca se revoca**.<br>**Idempotencia.** Se normaliza después de la migración del guepardo, así que el proceso es idempotente (prueba 31) |

## 2. Inventario de sistemas existentes (sección 4)

| Sistema | Archivo | Estado encontrado | Decisión MEC-08 |
| --- | --- | --- | --- |
| Logros | `achievements-v3360.js` | **Catálogo:** 80 logros en 6 categorías (exploración 16, zoología 18, especímenes 12, museo 12, investigación 12, navegación 10), con 5 títulos y 6 secretos.<br>**Evaluación:** por categorías marcadas (`achievementMark3360`/`achievementFlush3360`), no al renderizar.<br>**Retroactividad:** `initialize` marca retroactivos los primeros. Umbrales de 113 regiones y 945 monografías | **Reutilizado.** Se añadió `extend({categories, definitions, metrics})`, con proveedor de métricas. Ids y medallas históricos intactos |
| Interfaz de logros | `society-achievements-ui-v3360.js` | Pestañas de Sociedad; filtros por categoría, estado y búsqueda; 8 por página; título destacado; fecha o «retroactivo» | Filtro por **nivel** (Bronce, Plata, Oro, Platino), pestaña **Eventos**, «Encargos» como etiqueta de la pestaña de misiones y franja MEC-08 en la cabecera |
| Encargos permanentes | `commissions-v3370.js` (+`commissions-ui-v3370.js`) | **Catálogo:** 24 encargos, 6 líneas × 4, en DAG (`previous`), con hasta 3 seguidos.<br>**Cobro:** atómico en `commissionClaim3370` (`pay` + ledger «encargos» + `persist`, con reversión).<br>**Misiones históricas:** 13 `SCIENTIFIC_MISSIONS` como `legacy` | **Reutilizado.** Se añadió `extend({categories, definitions, gate})`; la compuerta impide ofrecer encargos que exigen funciones inaccesibles |
| Encargos coleccionistas | MEC-03 (`AtlasMEC03.COMMISSIONS`) | 6 solicitudes de la Caravana | Sin cambios |
| Encargos de rango | MEC-04 (`NEW_COMMISSIONS`) | 2 | Sin cambios |
| Proyectos de curaduría | `museum-curation-v3380.js` | 12 exposiciones temáticas acreditables | Sin cambios; se cuentan en las métricas (`themesActive`, `themesComplete`) |
| Subvenciones | `state.society.grants` | Campo, expediciones (`funded`/`count`), proyectos y patrocinio | Métrica `fundingClaims` |
| Títulos de perfil | `cpTitle3430` / `AtlasSociety3360.featured` | Título destacado de un logro con `title` | 19 títulos en total (14 nuevos) |
| Notificaciones | `AtlasSociety3360.notifyExperience` | Avisos agrupados con acción | Avisos MEC-08 agrupados por la misma vía, sin repetir (`state.mec08.notified`) |
| Seguimiento | `state.commissions.tracked` (máx. 3) | — | Sin cambios |
| Eventos de MEC-03 | `eventsActive:false` en `atlas-release.json` (v563) | Sin motor de eventos | El nuevo calendario central sustituye esa integración pendiente |

## 3. Logros (secciones 5 a 7)

**Cuántos son.** 84 entradas nuevas o actualizadas, para un catálogo de **164**.
- **74 logros**: dentro del intervalo 60–80 que pide el encargo.
- **10 medallas conmemorativas**, una por evento. Se cuentan aparte porque son el reconocimiento permanente de la sección 17 y no amplían el catálogo de logros.

Cada definición tiene id, nombre, categoría, descripción, condición (métrica y objetivo), medalla, referencia de arte, título opcional, bandera de secreto, política de migración y recompensa única: la medalla, sin dinero. La matriz completa está en `logros.csv`.

| Bloque | Logros |
| --- | --- |
| Catálogo completo (1.000/125) | **Exploración:** `world_unlocked_125`, `visit_50`, `visit_100` y `visit_125`.<br>**Zoología:** `discover_1000`, `publish_250`, `publish_500` y `publish_1000`.<br>**Leyendas:** `legendary_10` y `legendary_30` (secretos).<br>Los históricos `world_unlocked` (113), `discover_900` y `publish_945` quedan como **reconocimientos intermedios** |
| Registros regionales | `regional_census_1` y `regional_census_10` (región visitada y todas sus especies en `state.regionalRecords`) y `continents_recorded`. Se distinguen región desbloqueada, visitada, registro regional real, catálogo global y censo regional completo |
| Zoología | `dimorphism_10` y `dimorphism_50` |
| Récords y conductas | `record_first`, `record_milestone_1/5/10/25`, `record_minimum`, `record_validated_1/5`, `record_regions_10` y `behavior_1/5/10/20`. Son **solo medalla**: MEC-07 ya paga conocimiento y prestigio, y no se duplica (prueba 6) |
| Coleccionables | `pieces_1/25/50/100/250/431`, `collection_1/8/32` y 5 gabinetes completos. Se cuentan sobre el **registro permanente**, así que vender no revoca nada |
| Campamento y Sociedad | `camp_first`, `camp_level3/5`, `camp_all3/5`, `rank_5/10/15/20` («Gran Naturalista») y `funding_first` |
| Museo | `museum_wing_3/5`, `theme_1`, `theme_complete`, `artifacts_exhibited_5` y `demo_1/10` |
| Taller | `components_6`, `instruments_5`, `artifacts_20`, `studies_1/25`, `advanced_experiment` y `crafted_25` |
| Navegación y paleontología | `specialized_1/10`, `deep_10`, `prospection_1/10`, `excavation_10`, `excavation_special` y `relict_20` |
| Eventos | 10 medallas conmemorativas (`evento_*`), una por evento; cada edición completada queda en `state.mec08.medals` |

**Contadores desde MEC-08.** Cuatro métricas no se pueden reconstruir del estado histórico y se cuentan desde esta versión, como indica su descripción: fabricaciones, expediciones especializadas, excavaciones especiales y observaciones nocturnas.

**Medallas y títulos (sección 8).**
- **Medallas.** El perfil ya mostraba las obtenidas y las pendientes, con su fecha o «retroactivo».
- **Filtros.** Por categoría, estado y búsqueda; MEC-08 añade el filtro por nivel.
- **Título destacado.** Se elige con «Destacar título».
- **Sin multiplicadores.** Ningún título ni medalla aplica multiplicadores económicos.

## 4. Encargos (secciones 9 a 13)

**Permanentes.** Se añaden 12, en 4 líneas nuevas de 3 (coleccionables y gabinetes, Taller e instrumentos, récords y conductas, Campamento y expediciones), para un total de 36. Ver `encargos.csv`.
- La compuerta (`gate`) exige el nivel de instalación necesario: un componente pide Taller II; la expedición especializada, Astillero III; la prospección, Prospecciones II.

**Correspondencia científica renovable.** 13 plantillas (`plantillas.csv`).
- **Qué guarda cada instancia:** `id`, `template`, `createdAt`, `conditions`, `objectives` con `baseline`, recompensa fija, `status` (ofrecido, aceptado, completado, cobrado, abandonado, caducado), `acceptedAt`, `completedAt` y `claimedAt`.
- **Tipos de objetivo:**
  - **incremental**: solo cuenta lo hecho desde la aceptación (línea base);
  - **posesión**: se acredita sin consumir;
  - **histórico**.
- **Periodo de renovación:** 72 h. Las ofertas se generan con una semilla guardada (`state.mec08.seed`) y el periodo, y quedan almacenadas, así que **recargar no regenera** (prueba 11).

**Proyectos institucionales.** 7 plantillas (`proyectos.csv`), con el mismo motor y varios objetivos. Requieren los rangos 6 a 12 y las instalaciones necesarias.

**Selección.**
- **Viabilidad.** `feasible` comprueba rango, instalaciones, Astillero, regiones accesibles sin visitar, especies accesibles sin descubrir, monografías publicables, yacimiento accesible, Museo y artefacto de demostración. Así nunca se ofrece un objetivo imposible (prueba 12).
- **Escala.** El objetivo y la recompensa escalan en tres tramos de rango.

**Límites y abandono.**
- **Activos a la vez:** 3 de correspondencia y 1 proyecto.
- **Abandonar.** Pide confirmación, libera el hueco y no penaliza; la siguiente oferta llega con el próximo periodo. Es configurable en `CONTRACT_POLICY`.
- **Caducidad.** Los encargos aceptados **no caducan** y no hay rachas.

**Recompensas.**
- **Dinero.** Va por el ledger: `earnMoney(…,'encargos')`.
- **Objetos.** Van al inventario común (`addInventory`) y son solo materias primas: nunca piezas, legendarios ni relictos.
- **Posesión.** Acreditar no entrega nada.
- **Cobro.** Es atómico (`tradeTransaction3300`: si falla el guardado, se revierte) y único (prueba 14).

## 5. Eventos (secciones 14 a 19)

Un solo módulo con el calendario (`AtlasMEC08.EVENTS`) y **diez eventos anuales** (`eventos.csv`, ediciones 2026–2028). Cada uno tiene una actividad funcional: un encargo de evento, sobre el mismo motor de encargos.

| Evento | Fecha | Naturaleza |
| --- | --- | --- |
| Año Nuevo: nuevos horizontes | 1 ene, 7 días | Celebración externa |
| Día de Darwin | 12 feb, 5 días | Celebración moderna del natalicio (12-02-1809) |
| Equinoccio de marzo | Calculado (Meeus, cap. 27), 3 días | Astronómico |
| Día de la Tierra | 22 abr, 5 días | Celebración moderna (desde 1970) |
| Día de la Biodiversidad | 22 may, 5 días | Día internacional de la ONU |
| Día de los Océanos | 8 jun, 7 días | Día mundial de la ONU |
| Gran Exposición Científica | 1 ago, 14 días | **Ficticio**, fecha configurable |
| Equinoccio de septiembre | Calculado, 3 días | Astronómico |
| Noche de las Criaturas | 30 oct, 3 días | Celebración externa adaptada |
| Navidad del Naturalista | 24 dic, 9 días | Celebración externa |

**Política de tiempo.**
- **Hora local del dispositivo.** Cada ocurrencia empieza a las 00:00 locales y dura `days` días; el equinoccio empieza el día anterior al instante astronómico local. La precisión es de minutos; las pruebas comparan con IMCCE/USNO con un margen de 20 minutos.
- **Identificador.** Cada ocurrencia lleva la edición: `evento-año`.
- **Calendario aparte.** El calendario real no toca las estaciones del juego, y todo funciona offline.
- **Fechas simuladas.** Solo existen en las pruebas: el arnés fija `Date.now`. No hay ningún control de fecha en el juego.

**Encargos de evento.**
- **Cuándo.** Se aceptan durante la ocurrencia, una vez por edición.
- **Al terminar.** Si estaba completado, la recompensa **se conserva** y se puede cobrar después; si seguía en curso, se cierra («caducado») sin penalización.
- **Alternativa.** Si el objetivo principal no es viable para el jugador, se usa la variante `alt`.
- **Medalla.** El cobro registra la edición en `state.mec08.medals`.

**Sin contenido exclusivo.** No hay piezas ni especies exclusivas; las recompensas son dinero, conocimiento y materias primas (prueba 21).

**Modificadores temporales.** Son una **capa separada** de la del Museo (`modificadores-temporales.csv`):
- `museumMEC05.live()` sigue devolviendo solo el Museo;
- `eventLive()` y `withEvents()` dan la capa del evento;
- `snapshot()` la **captura al iniciar** las actividades temporizadas (expediciones y prospecciones), y `value()` la suma;
- desaparece al terminar el evento, aunque una actividad iniciada durante el evento la conserva;
- en el campo actúa como banda adicional (`layer:'evento'`) mientras dura;
- el desglose (`breakdown`) incluye la capa «eventos»;
- topes: 25 % o menos.

## 6. Interfaz y avisos (secciones 20 y 21)

- **Sociedad.**
  - **Pestañas.** Rangos, Subvenciones, Publicaciones, Encargos (encargos permanentes, correspondencia y proyectos), Logros y Eventos (evento activo, encargo, recompensas pendientes, próximos eventos y medallas conmemorativas).
  - **Franja de cabecera** (`AtlasMEC08Strip`, `role="status"`). Muestra lo pendiente de cobro, los proyectos activos, los reconocimientos de las últimas 72 h y el evento activo con el tiempo restante.
- **Avisos.**
  - **Cuáles.** Encargo completado, proyecto finalizado, evento iniciado, evento a punto de terminar (menos de 24 h) e hito validado.
  - **Cómo.** Se agrupan con `notifyExperience`, no se repiten (`state.mec08.notified`) y no abren ventanas emergentes en el campo.
- **Navegación.** El destino `society:events` está en la lista de destinos válidos.

## 7. Migración (sección 22)

`state.mec08` (`schema:1`) guarda la semilla, los contadores, el tablero, los encargos (los cerrados se recortan a 40), las medallas, los avisos y la migración. La migración es idempotente:

- **Logros nuevos ya cumplidos** al cargar una partida anterior: se reconocen `retroactive:true`, con `earnedAt:null` (sin fecha inventada) y **sin dinero**. Ningún logro da dinero.
- **Encargos permanentes nuevos ya cumplidos antes de existir**: se marcan cobrados con recompensa cero (`retroactive:true`), sin pago retroactivo.
- **Importaciones.** La migración vuelve a comprobarse en cada `tick` para cubrir partidas importadas.
- **Récords.** Las migraciones de MEC-07 están descritas en el punto 3.1 y la normalización en el 3.7.

## 8. Accesibilidad (sección 23)

Ver `accesibilidad.md`.

## 9. Pruebas

Ver `resultado-pruebas.md`. `tests/mec08.test.cjs` contiene 32 pruebas (más de las 30 exigidas), varias con el catálogo completo, y está incorporado a `release:verify`.

## 10. Archivos

- **Código:**
  - `www/js/mec08-recognition.js`, la configuración y las reglas puras;
  - el bloque MEC-08 de `www/js/app.js`;
  - las extensiones de `achievements-v3360.js`, `commissions-v3370.js` y `society-achievements-ui-v3360.js`;
  - las correcciones de `mec07-natural-records.js`;
  - `www/css/mec08.css`.
- **Matrices** (generadas con `node scripts/build-mec08-docs.cjs`; las fechas locales del calendario se calculan en la zona horaria del entorno):
  - `logros.csv` y `medallas-titulos.csv`;
  - `encargos.csv`, `plantillas.csv` y `proyectos.csv`;
  - `eventos.csv`, `recompensas.csv` y `modificadores-temporales.csv`;
  - `arte.csv`, con 150 referencias, todas pendientes. **No se generó arte definitivo.**

No se modificaron ilustraciones zoológicas ni variantes pigmentarias, no se añadieron especies ni regiones y no se avanzó a MEC-09.
