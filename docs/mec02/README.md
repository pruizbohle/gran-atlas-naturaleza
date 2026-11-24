# MEC-02 · Campamento evolutivo y gestión de instalaciones → V5.6.2 Beta

Rama `mec-02/v5.6.2-beta`, creada desde `mec-01/v5.6.1-beta` (`769477a`). No se fusiona a `main`. **No se generó ni se publicó ninguna APK**, no se ejecutó ningún flujo de Android y no se tocó `android-native/`.

El Campamento deja de ser solo navegación: sus cinco instalaciones productivas tienen ahora cinco niveles cada una, y cada nivel cambia algo que el motor ejecuta (capacidad, tipos de actividad, acceso a funciones o complejidad). Todos los costos, requisitos, capacidades, tiempos y porcentajes nuevos son **provisionales** y viven en una sola configuración. No hay balance definitivo.

## 1. Correcciones de MEC-01

| Punto | Resultado |
| --- | --- |
| Pruebas MEC-01 en la verificación habitual | `npm run release:verify` ejecuta ahora `tests/mec01.test.cjs` y `tests/mec02.test.cjs` |
| Canal beta frente a estable | `atlas-release.json` ya tenía un campo `channel` (de la etapa Oceanía, valor `release`); ahora vale `beta`. `index.html` lleva `<meta name="atlas-channel" content="beta">`. **Compatibilidad con el actualizador PWA comprobada en el código**: `atlas-pwa-update.js` exige una versión `\d+.\d+.\d+` y el nombre de la caché offline la repite, así que la versión sigue siendo numérica (`5.6.2`) y el canal se informa aparte. El actualizador muestra «(canal beta)» junto a la versión disponible |
| Historial de git | El informe de MEC-01 decía que el repositorio tenía un único commit. Era falso: el clon de trabajo era superficial. Con `git fetch --unshallow --filter=blob:none` el historial completo (461 commits) queda disponible y los objetos antiguos se descargan bajo demanda. El informe de MEC-01 quedó corregido |
| Fallos imposibles de resolver por el entorno | Con historial completo, `fatal: invalid object name` desaparece. Quedan 216 pruebas históricas que fallan por aserciones (ya existían; el README las situaba en 219 desde antes de V5.2) y `global-v3240`, que agota los 600 s por archivo en este entorno de 2 CPU. Detalle en la sección 8 |
| Libro de ingresos y registro de coleccionables | Se conservan. Las pruebas de MEC-01 siguen pasando; dos de sus comprobaciones de versión pasaron de un literal `5.6.1` a la versión vigente de `package.json` |

## 2. Arquitectura

- **`www/js/mec02-camp.js`** (nuevo): única fuente de configuración de las 25 etapas y lógica pura. Cada instalación tiene identificador permanente, nombre por nivel, nivel actual (en la partida), nivel máximo (5), costo de mejora, requisitos, funciones, efectos y referencia artística por nivel.
- **Bloque «MEC-02» al final de `www/js/app.js`**: conecta esos efectos a los motores existentes envolviendo sus funciones, sin duplicarlos.
- **`www/js/mec02-camp-ui.js`** y **`www/css/mec02.css`** (nuevos): ficha de instalación.
- **Tienda del naturalista**: sexta zona, sin niveles productivos (`PERSONAL_AREA`).
- **Requisito de rango de Sociedad**: cada etapa trae `requires.societyRank` y `requires.societyRankActive:false`, preparados para MEC-04 y sin exigirse.

### Estado guardado

```js
camp: {
  schema: 1,
  levels: { shipyard: 1, caravan: 1, workshop: 1, excavations: 1, surveys: 1 },
  history: [ { facility: 'excavations', level: 2, at: 1795…, cost: { money: 500, knowledge: 300 } } ], // últimas 50
  migratedAt: 1795… | null,
  migration: { method: 'nivel-1-con-derechos-adquiridos', at } | null
}
```

Marcas por trabajo, dentro de los registros que ya existían: `voyages[i].modality` (`'ampliada'`), `museum.excavations[i].mode` (`'profunda'` | `'especial'`). Recibos nuevos que impiden pagar dos veces los extras: `museum.excavationModeSettled[id]` y `museum.relictSurveyBonusSettled[id]`.

## 3. Las 25 etapas

Costos comunes a las cinco instalaciones (provisionales): II £500 y 300 de conocimiento · III £2.000 y 1.200 · IV £8.000 y 4.000 · V £25.000 y 12.000. El prestigio mínimo (2, 5, 10, 20) no se consume. Toda mejora exige el nivel anterior, es inmediata, pide confirmación y es permanente.

### Astillero (`shipyard`)

Reutiliza: `VOYAGES`, `sail`, `processVoyages`, `resolveVoyageReward`, `maxVoyages`, `voyageDuration`, `state.voyages`. Requiere: Investigación «Astillero básico».

| Nivel | Nombre | Costo de mejora | Prestigio mínimo | Efectos (provisionales) | Funciones que desbloquea | Arte |
| --- | --- | --- | --- | --- | --- | --- |
| I | Embarcadero | — | 0 | `capacityBonus`: 0<br>`durationFactor`: 1<br>`modalities`: ["normal"] | Gestiona las expediciones científicas existentes con su capacidad histórica (2 + «Segundo destacamento»).<br>Los viajes conservan sus requisitos de prestigio, cartografía, investigación y mapas. | `shipyard-1` |
| II | Muelle | £500 · 300 C | 2 | `capacityBonus`: 1<br>`durationFactor`: 1<br>`modalities`: ["normal"] | +1 expedición simultánea. | `shipyard-2` |
| III | Astillero | £2.000 · 1.200 C | 5 | `capacityBonus`: 1<br>`durationFactor`: 0.9<br>`modalities`: ["normal"] | Preparación de expediciones: −10 % de duración en las nuevas salidas (provisional). | `shipyard-3` |
| IV | Dársena | £8.000 · 4.000 C | 10 | `capacityBonus`: 2<br>`durationFactor`: 0.9<br>`modalities`: ["normal"] | +1 expedición simultánea (+2 en total). | `shipyard-4` |
| V | Puerto científico | £25.000 · 12.000 C | 20 | `capacityBonus`: 2<br>`durationFactor`: 0.9<br>`modalities`: ["normal","ampliada"] | Modalidad especial «Expedición ampliada»: misma ruta, doble duración y doble costo, con una tirada adicional de hallazgos (provisional). | `shipyard-5` |

### Caravana (`caravan`)

Reutiliza: `TRADE_ROUTES`, `startTrade3300`, `settleTrade3300`, `tradeCanStart3300`, `TRADE_MARKET`, `buyTrade3300`, `TRADE_BARTERS`, `SUPPLY_CONTRACTS3390`, `CARGO_MANIFESTS3390`, `REGIONAL_BARTERS3400`, `state.commerce`. Requiere: Investigación «Astillero básico» (habilita el comercio).

| Nivel | Nombre | Costo de mejora | Prestigio mínimo | Efectos (provisionales) | Funciones que desbloquea | Arte |
| --- | --- | --- | --- | --- | --- | --- |
| I | Carreta | — | 0 | `routeCapacity`: 1<br>`marketLot`: 1<br>`collectibleExchange`: false | 1 ruta comercial simultánea, mercado, trueques, contratos de suministro y manifiestos (sin cambios).<br>Las mercancías regionales conservan sus condiciones de acceso. | `caravan-1` |
| II | Caravana equipada | £500 · 300 C | 2 | `routeCapacity`: 2<br>`marketLot`: 1<br>`collectibleExchange`: false | 2 rutas comerciales simultáneas. | `caravan-2` |
| III | Convoy | £2.000 · 1.200 C | 5 | `routeCapacity`: 2<br>`marketLot`: 5<br>`collectibleExchange`: false | Capacidad logística: compra por lotes de 5 unidades en el mercado, con una sola confirmación. | `caravan-3` |
| IV | Estación comercial | £8.000 · 4.000 C | 10 | `routeCapacity`: 3<br>`marketLot`: 5<br>`collectibleExchange`: false | 3 rutas comerciales simultáneas. | `caravan-4` |
| V | Central comercial | £25.000 · 12.000 C | 20 | `routeCapacity`: 4<br>`marketLot`: 5<br>`collectibleExchange`: "preparado" | 4 rutas comerciales simultáneas.<br>Conexión preparada para el intercambio de coleccionables (se activa en MEC-03). | `caravan-5` |

### Taller (`workshop`)

Reutiliza: `RECIPES`, `canCraft`, `craftItem`, `recipePlan3400`, `V316_MATERIAL_STUDIES`, `canProcessMaterials`, `processMaterials`.

| Nivel | Nombre | Costo de mejora | Prestigio mínimo | Efectos (provisionales) | Funciones que desbloquea | Arte |
| --- | --- | --- | --- | --- | --- | --- |
| I | Mesa de trabajo | — | 0 | `recipeLevel`: 1<br>`craftBatches`: [1]<br>`studyBatches`: [1,5]<br>`componentCrafting`: false | Todas las recetas existentes, con fabricación inmediata.<br>Estudios de materiales ×1 y ×5. | `workshop-1` |
| II | Taller artesanal | £500 · 300 C | 2 | `recipeLevel`: 2<br>`craftBatches`: [1]<br>`studyBatches`: [1,5,10]<br>`componentCrafting`: false | Procesamiento de materiales animales: estudios ×10.<br>Recetas de nivel 2 (preparado). | `workshop-2` |
| III | Taller científico | £2.000 · 1.200 C | 5 | `recipeLevel`: 3<br>`craftBatches`: [1,5]<br>`studyBatches`: [1,5,10]<br>`componentCrafting`: false | Fabricación múltiple: ×5 con una sola confirmación.<br>Recetas de nivel 3 (preparado). | `workshop-3` |
| IV | Taller especializado | £8.000 · 4.000 C | 10 | `recipeLevel`: 4<br>`craftBatches`: [1,5]<br>`studyBatches`: [1,5,10]<br>`componentCrafting`: true | Fabricación con subcomponentes: fabrica primero los componentes intermedios que falten.<br>Recetas de nivel 4 (preparado). | `workshop-4` |
| V | Laboratorio | £25.000 · 12.000 C | 20 | `recipeLevel`: 5<br>`craftBatches`: [1,5,10]<br>`studyBatches`: [1,5,10,25]<br>`componentCrafting`: true | Fabricación ×10 y estudios ×25.<br>Recetas de laboratorio (nivel 5, preparado). | `workshop-5` |

### Excavaciones (`excavations`)

Reutiliza: `MUSEUM_DIG_SITES`, `canStartExcavation`, `startExcavation`, `collectExcavation`, `maxExcavations`, `state.museum.excavations`.

| Nivel | Nombre | Costo de mejora | Prestigio mínimo | Efectos (provisionales) | Funciones que desbloquea | Arte |
| --- | --- | --- | --- | --- | --- | --- |
| I | Pozo exploratorio | — | 0 | `capacityBonus`: 0<br>`modes`: ["normal"]<br>`collectAll`: false | Yacimientos existentes del Museo con su capacidad histórica (1, o 2 con «Excavaciones coordinadas»). | `excavations-1` |
| II | Excavación | £500 · 300 C | 2 | `capacityBonus`: 1<br>`modes`: ["normal"]<br>`collectAll`: false | +1 excavación simultánea. | `excavations-2` |
| III | Yacimiento | £2.000 · 1.200 C | 5 | `capacityBonus`: 1<br>`modes`: ["normal","profunda"]<br>`collectAll`: false | Excavación profunda: doble duración y doble costo; +2 fragmentos y una segunda tirada de diente fósil (provisional). | `excavations-3` |
| IV | Complejo paleontológico | £8.000 · 4.000 C | 10 | `capacityBonus`: 2<br>`modes`: ["normal","profunda"]<br>`collectAll`: true | +1 excavación simultánea (+2 en total).<br>Recoger de una vez todas las excavaciones terminadas. | `excavations-4` |
| V | Instituto paleontológico | £25.000 · 12.000 C | 20 | `capacityBonus`: 2<br>`modes`: ["normal","profunda","especial"]<br>`collectAll`: true | Excavación especial: 1,5 × duración y costo; garantiza una huella fosilizada (provisional).<br>Conexión preparada para coleccionables históricos y geológicos (MEC-03, sin drops). | `excavations-5` |

### Prospecciones (`surveys`)

Reutiliza: `MUSEUM_RELICTS`, `relictSurveySpec`, `canStartRelictSurvey`, `startRelictSurvey`, `collectRelictSurvey`, `maxRelictSurveys`, `addRelictLead`, `state.museum.relictSurveys`.

| Nivel | Nombre | Costo de mejora | Prestigio mínimo | Efectos (provisionales) | Funciones que desbloquea | Arte |
| --- | --- | --- | --- | --- | --- | --- |
| I | Reconocimiento | — | 0 | `capacityBonus`: 0<br>`extraLead`: 0<br>`durationFactor`: 1<br>`collectAll`: false | Prospección documental de indicios de relictos con su capacidad histórica (1, o 2 con «Archivos de historia natural»).<br>Los relictos siguen siendo hallazgos de campo. | `surveys-1` |
| II | Estación de reconocimiento | £500 · 300 C | 2 | `capacityBonus`: 1<br>`extraLead`: 0<br>`durationFactor`: 1<br>`collectAll`: false | +1 prospección simultánea. | `surveys-2` |
| III | Estación topográfica | £2.000 · 1.200 C | 5 | `capacityBonus`: 1<br>`extraLead`: 1<br>`durationFactor`: 1<br>`collectAll`: false | +1 indicio al completar una prospección (sin superar el máximo de 3; nunca entrega un relicto). | `surveys-3` |
| IV | Centro de estudios | £8.000 · 4.000 C | 10 | `capacityBonus`: 1<br>`extraLead`: 1<br>`durationFactor`: 0.8<br>`collectAll`: true | −20 % de duración en las nuevas prospecciones (provisional).<br>Recoger de una vez todas las prospecciones terminadas. | `surveys-4` |
| V | Centro de prospección | £25.000 · 12.000 C | 20 | `capacityBonus`: 2<br>`extraLead`: 1<br>`durationFactor`: 0.8<br>`collectAll`: true | +1 prospección simultánea (+2 en total).<br>Tipos preparados: geológica, regional, minerales, metales, meteoritos y piedras preciosas (MEC-03). | `surveys-5` |

### Clasificación de las recetas del Taller

Ninguna receta histórica ni de la beta 5.6.0 exige nivel de Taller. Las recetas nuevas podrán declarar `minWorkshop` (1–5) y `canCraft` lo respetará; las pruebas lo comprueban con una receta de ejemplo. Categorías: equipamiento (con ranura), cartografía (mapas y cuadrante), material para artefactos y, para las futuras, componente y otros. Complejidad: simple (1–2 insumos), intermedia (3 o más) y avanzada (usa otra receta como insumo).

| Receta | Categoría | Complejidad | Insumos | Nivel de Taller |
| --- | --- | --- | --- | --- |
| Mapa de África (`africa_map`) | cartografia | simple | 1 | 1 |
| Mapa de Asia (`asia_map`) | cartografia | simple | 1 | 1 |
| Mapa de Norteamérica (`north_america_map`) | cartografia | simple | 1 | 1 |
| Mapa de Oceanía (`oceania_map`) | cartografia | simple | 1 | 1 |
| Mapa de regiones polares (`polar_map`) | cartografia | simple | 1 | 1 |
| Mapa de Sudamérica (`south_america_map`) | cartografia | simple | 1 | 1 |
| Mapamundi (`world_map`) | cartografia | avanzada | 6 | 1 |
| Amuleto de ámbar (`amber_charm`) | equipamiento | simple | 2 | 1 |
| Colgante del explorador (`amulet`) | equipamiento | simple | 2 | 1 |
| Prismáticos de viaje (`binoculars`) | equipamiento | simple | 2 | 1 |
| Brújula de latón (`brass_compass`) | equipamiento | simple | 2 | 1 |
| Gorro emplumado (`feather_cap`) | equipamiento | simple | 2 | 1 |
| Sombrero de naturalista (`field_hat`) | equipamiento | simple | 2 | 1 |
| Catalejo de precisión (`field_telescope`) | equipamiento | avanzada | 4 | 1 |
| Medallón de ámbar (`museum_medallion`) | equipamiento | avanzada | 4 | 1 |
| Capucha impermeable (`rain_hood`) | equipamiento | simple | 2 | 1 |
| Sombrero académico (`scholar_hat`) | equipamiento | avanzada | 4 | 1 |
| Collar de conchas (`shell_necklace`) | equipamiento | simple | 2 | 1 |
| Morral reforzado (`sturdy_pack`) | equipamiento | simple | 2 | 1 |
| Carta estelar (`carta_estelar`) | material-artefacto | simple | 2 | 1 |
| Componente eléctrico (`componente_electrico`) | material-artefacto | simple | 2 | 1 |
| Engranaje de latón (`engranaje`) | material-artefacto | simple | 1 | 1 |
| Espejo pulido (`espejo`) | material-artefacto | simple | 2 | 1 |
| Módulo luminoso (`modulo_luminoso`) | material-artefacto | intermedia | 3 | 1 |
| Cuadrante transatlántico (`oceanic_quadrant`) | material-artefacto | intermedia | 4 | 1 |
| Placa de daguerrotipo (`placa_daguerrotipo`) | material-artefacto | simple | 2 | 1 |
| Abrigo de expedición polar (`polar_coat`) | material-artefacto | avanzada | 4 | 1 |
| Equipo de sondeo y muestreo (`sounding_kit`) | material-artefacto | avanzada | 4 | 1 |

## 4. Migración y derechos adquiridos

- Una partida sin `state.camp` empieza con las cinco instalaciones en **nivel I**, y el nivel I es exactamente el comportamiento anterior. La prueba «nivel I reproduce el comportamiento histórico» lo compara función por función con el juego sin el módulo MEC-02: capacidades, duraciones, recetas, estudios y rutas.
- **Derechos adquiridos**: las capacidades que la partida ya tenía por investigación («Segundo destacamento», «Excavaciones coordinadas», «Archivos de historia natural», «Casco aligerado», «Astillero básico») se conservan tal cual, y los bonos de nivel se suman encima. Nadie pierde una plaza, una ruta, una receta ni un equipo.
- **Reconocimiento retroactivo, evaluado y descartado**: dar niveles gratis según el progreso o las investigaciones duplicaría capacidades (investigación + nivel) y adelantaría el balance. Queda documentado como opción para MEC-04.
- Los trabajos en curso nunca se eliminan: la capacidad solo se comprueba al iniciar uno nuevo. Una partida con más trabajos que su capacidad los termina y los cobra igual (probado).
- Los niveles son irreversibles: `normalize` nunca baja un nivel, solo lo limita a 1–5, y lo eleva si el historial registra uno mayor.
- Importar un respaldo restaura sus propios niveles. Uno anterior a MEC-02 queda en nivel I.

## 5. Interfaz del Campamento

- **Fondo pintado y seis zonas intactos.** Cada zona muestra en su rótulo, por ejemplo: «II/V · 1 en curso · 1 terminada · ↑ mejora». Sin trabajos, conserva el estado anterior («Acción disponible», «Requisitos pendientes»).
- **Al entrar en una instalación**, una ficha encabeza la vista existente con:
  - ilustración provisional (icono actual) y nivel;
  - estado operativo y capacidad usada y total;
  - actividades en curso, terminadas, por recoger y liquidadas;
  - funciones disponibles y controles de los niveles alcanzados;
  - próximo nivel, con funciones, costo y requisitos faltantes.
- Toda acción que gasta recursos pide confirmación: mejoras, expedición ampliada, compra por lotes, fabricación múltiple, fabricación con subcomponentes y modalidades de excavación.
- **Referencias artísticas**: `AtlasCampMEC02.ART` tiene 25 ranuras (`shipyard-1` … `surveys-5`), cada una con `file:null`, `status:'pendiente'` y su icono provisional. Basta con rellenar `file` para que la ficha muestre la imagen definitiva, sin tocar el motor.

## 6. Modelo común de actividades

`AtlasCampMEC02.activityState` distingue `disponible`, `bloqueada`, `en-ejecucion`, `terminada`, `recompensa-pendiente` y `liquidada` para expediciones, comercio, excavaciones y prospecciones. Es solo de lectura: cada motor conserva sus reglas.
- Expediciones y rutas comerciales se liquidan solas en `tick`, también tras volver de estar sin conexión.
- Excavaciones y prospecciones esperan a que el jugador las recoja.
- Los recibos existentes (`voyageSettled`, `tradeReceipts`, `excavationSettled`, `relictSurveySettled`) siguen impidiendo cobrar dos veces. Los extras de MEC-02 se pagan dentro de la misma liquidación o con su propio recibo.

## 7. Integración con MEC-01

- Todo ingreso nuevo pasa por `earnMoney`: las expediciones ampliadas y las rutas adicionales cobran por las funciones originales.
- Todo objeto nuevo entra por `addInventory`, que alimenta el registro de coleccionables.
- No se activó ninguna fuente nueva de coleccionables. Quedan preparadas las conexiones `PREPARED_SOURCES`:
  - expediciones → Astillero;
  - comercio → Caravana (intercambio de coleccionables, MEC-03);
  - excavaciones → Excavaciones (`DIG_MODES.especial.collectiblesPrepared`);
  - prospecciones → Prospecciones (`SURVEY_TYPES` geológica, regional, minerales, metales, meteoritos y piedras preciosas, todos `active:false`).
- `AtlasMEC01.consume` sigue siendo la vía para consumir coleccionables sin tocar las unidades reservadas en el Museo.

## 8. Pruebas

`tests/mec02.test.cjs`: **12 de 12 aprobadas**. Comprueban efectos reales sobre el motor:

| Requisito del encargo | Prueba |
| --- | --- |
| 5 instalaciones y 25 niveles | Nombres, 25 ranuras de arte, y que cada nivel cambia al menos un efecto respecto del anterior |
| Persistencia del nivel | Reabrir, importar e intentar bajar el nivel |
| Compra y consumo de recursos | Descuento exacto, prestigio intacto, historial, cancelación de la confirmación |
| Rechazo sin requisitos | Dinero, conocimiento, prestigio, investigación de astillero y nivel máximo, sin alterar la partida; una mejora no desbloquea regiones |
| Capacidades | Zarpar 5 expediciones y rechazar la 6.ª; 2 rutas en II; 3 excavaciones; 2 prospecciones |
| Funciones por nivel | Duración en III, expedición ampliada en V, lotes de mercado en III, indicio extra en III (tope de 3, sin relicto), estudios ×10, fabricación ×5, subcomponentes, receta con `minWorkshop`, excavación profunda y especial, recoger todas |
| Partidas antiguas | Nivel I, capacidades por investigación conservadas, trabajos en curso y por encima de la capacidad que terminan |
| Sin duplicados, offline | Volver tras horas: dos rutas y una expedición ampliada cobran una sola vez; reabrir y repetir `tick` no paga de nuevo |
| Exportar e importar | Niveles, historial y modalidad en curso |
| Sistemas históricos | Nivel I frente al juego sin MEC-02, función por función |
| Versión y canal | 5.6.2 numérica, canal beta, actualizador, caché offline y `release:verify` |

### Suite completa (línea base MEC-01 frente a MEC-02)

Las dos ejecuciones tienen el historial de git completo, archivo por archivo, 600 s por archivo:

| | MEC-01 `769477a` | MEC-02 |
| --- | --- | --- |
| Pruebas | 894 | 906 (+12 de MEC-02) |
| Aprobadas | 678 | 690 |
| Fallidas | 216 | 216 (las mismas) |
| Regresiones | — | **0** |
| Archivo que agota los 600 s | `global-v3240` | `global-v3240` |

La única diferencia de nombre es la prueba de versión de MEC-01, que pasó de «versión 5.6.1 Beta…» a «versión beta coherente…» y sigue aprobada. Con el historial completo, la línea base de MEC-01 sube de 492/760 (clon superficial) a 678/894. Las 216 que fallan son aserciones históricas preexistentes y no dependen del entorno. Resultados por prueba: [`linea-base-mec01.json`](linea-base-mec01.json) y [`resultado.json`](resultado.json). No se eliminó ni se debilitó ninguna prueba.

Comprobación en navegador (Chrome sin interfaz, 412 × 900): los seis rótulos del Campamento muestran nivel y estado sobre el fondo pintado. La ficha de Excavaciones muestra capacidad, actividades y próximo nivel. Dos mejoras confirmadas llevan la instalación a III/V y la guardan. La ficha del Taller clasifica las 28 recetas. Sin errores de consola.

## 9. Revisión manual

1. Servir `www/` en local (`python3 -m http.server -d www 8080`) con un perfil de navegador limpio y comprobar el subtítulo «v5.6.2 Beta · MEC-02».
2. Campamento: cada zona muestra «I/V» y su estado.
3. Con el Astillero básico investigado y recursos suficientes, mejorar la Caravana a II y lanzar dos rutas comerciales.
4. Mejorar Excavaciones a III, iniciar una excavación profunda y recogerla al terminar: deben aparecer 2 fragmentos más.
5. Prospecciones III: al recoger una, el expediente gana un indicio extra, con un máximo de 3 y nunca un relicto.
6. Taller II–IV: estudios ×10, fabricación ×5 y telescopio con subcomponentes.
7. Exportar el respaldo, importarlo en otro perfil y comprobar niveles y trabajos.
8. Cerrar con expediciones y rutas en curso y volver más tarde: deben cobrarse una sola vez.

## 10. Pendientes y decisiones abiertas

- **Balance** (MEC-04 o posterior): costos, prestigio, capacidades, porcentajes de duración y modalidades. Todos están en `mec02-camp.js`.
- **Rango de Sociedad como requisito**: los campos existen (`societyRank`, `societyRankActive`), sin valores ni exigencia (MEC-04).
- **Reconocimiento retroactivo** de niveles: descartado por ahora (sección 4).
- **MEC-03**:
  - intercambio de coleccionables en la Caravana V;
  - drops de coleccionables en excavaciones especiales;
  - tipos de prospección geológica, regional, minerales, metales, meteoritos y piedras preciosas.
- **Recetas por nivel de Taller**: la estructura existe; faltan recetas nuevas que la usen.
- **Arte**: 25 ilustraciones de instalación pendientes (`AtlasCampMEC02.ART`); se usan los iconos actuales.
- **Versión web aislada**: no se publicó. `www/` pesa unos 166 MB y GitHub Pages despliega solo `main`. Revisión local (sección 9).
- `global-v3240` necesita más de 600 s en este entorno; conviene revisarlo en una máquina con más CPU.

## 11. Confirmación

No se generó ni se publicó ninguna APK, no se ejecutó ningún flujo de Android y la APK pública autorizada no se tocó. El desarrollo se detiene aquí para la auditoría externa; no se avanzó a MEC-03.
