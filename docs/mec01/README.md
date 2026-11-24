# MEC-01 · Consolidación funcional de V5.6.0 Beta → V5.6.1 Beta

Rama de trabajo: `mec-01/v5.6.1-beta`, creada desde `main` en el commit `9006b53` («Integra v5.6.0-beta»). No se fusiona a `main`, no se generó ni se publicó ninguna APK y no se tocó `android-native/` ni los flujos de firma.

Esta etapa deja las mecánicas de la V5.6.0 Beta funcionales, persistentes, extensibles y verificables. **No calibra** economía, probabilidades, costos, tiempos, requisitos ni multiplicadores: los números nuevos que aparecen aquí son marcadores provisionales y lo dicen en el código.

## 1. Auditoría previa

### Estado de partida

- `main` = `9006b53`. *Corrección de MEC-02:* aquí decía «único commit del repositorio»; era un efecto del clon superficial. El remoto conserva el historial completo (461 commits en esta rama). Ver [docs/mec02](../mec02/README.md#1-correcciones-de-mec-01).
- La V5.6.0 Beta está integrada en `www/js/beta-v560-data.js` y en el bloque «Beta 5.6.0» al final de `www/js/app.js`, pero la versión publicada seguía siendo 5.5.1 en `package.json`, `atlas-release.json`, `sw.js` e `index.html`.

### Problemas confirmados en el código (no solo en la interfaz)

| # | Problema | Efecto real |
| --- | --- | --- |
| A1 | El drop beta sustituía a `maybeSpeciesDrop` para **toda especie con pozo beta**, y las 1.000 especies tienen pozo | Los 12 drops históricos de `SPECIES_DROPS` (diente de lobo, pluma de rapaz, vibrisa…) **dejaron de caer**. Recetas (amuleto, mochila, gorro de plumas…) y estudios del Taller quedaron sin fuente de campo |
| A2 | Ocho materiales históricos (`owl_feather`, `heron_feather`, `otter_whisker`, `antler_fragment`, `animal_trace`, `wolf_tooth`, `boar_tusk`, `beaver_tail_scale`) estaban también en la tabla beta, repartidos en 131 asignaciones a otras especies | Además de A1, cambiaba sus condiciones de obtención |
| A3 | Coleccionables, materiales nuevos y rarezas compartían una sola tirada y una sola tabla por especie | Imposible configurar una categoría sin alterar las otras |
| A4 | El avance de colecciones y el requisito de la Sociedad contaban `inventory > 0` | Vender o consumir una pieza borraba el avance |
| A5 | El «dinero acumulado» se calculaba en cada `render()` como diferencia entre saldos observados | Ingresos y gastos entre dos repintados se compensaban (subconteo); restaurar un respaldo con más dinero contaba como ingreso (sobreconteo); el capital inicial de £420 contaba como ingreso |
| A6 | Los gabinetes listaban solo las primeras 12 piezas (`owned.slice(0,12)`) | Las demás no se podían exponer |
| A7 | Una pieza expuesta podía quedar en el gabinete sin existencias (solo se ocultaba al pintar) y no había validación al cargar | Exhibiciones inconsistentes en partidas importadas |
| A8 | Niveles del Museo repartidos en tres sitios (`MUSEUM_WINGS`, un arreglo literal en `museumCapacity` y un `push` en el bloque beta) | Sin fuente única |
| A9 | `state.beta560` se creaba de forma perezosa y sin normalizar | Datos dañados podían romper el panel |

### Dónde se genera dinero (todas las entradas, verificadas)

| Procedencia (`moneyLedger.bySource`) | Función |
| --- | --- |
| `descubrimientos` | `encounter` (primer avistamiento, £15) |
| `publicaciones` | `publishMonograph` (£90) |
| `subvenciones` | `requestGrant` |
| `canjeNotas` | `exchangeNotes` |
| `encargos` | `claimScientificMission` y `AtlasCommissions3370.pay` (vía `commissionClaim3370`) |
| `taller` | `processMaterials` (donación de materiales) |
| `expediciones` | `resolveVoyageReward` |
| `museo` | `tick` (ingreso por segundo, también el tramo offline, tope 8 h) |
| `comercio` | `deliverContract3390`, `settleTrade3300` (ruta y manifiesto) |
| `recompensas`, `otros` | Reservadas para fuentes futuras |

### Dónde entra inventario, se consume material y se guarda

- **Entradas**: `addInventory` (drops, viajes, botín, comercio, Taller, Museo) y una escritura directa en `commissions-v3370.js` (recompensas de encargos; no incluye coleccionables beta).
- **Consumo**: `craftItem`, `processMaterials`, recetas del Museo, trueques y contratos de comercio, sondeos. Ninguno consume coleccionables beta hoy.
- **Guardado**: `persist()` (clave `gran_atlas_v05`), `load()`, `AtlasSaveBridge.restoreGame` (importación) y `save-manager.js` (respaldo `el-gran-atlas-save` v1, sin cambios de formato).

### Sistemas históricos que dependen de materiales animales

Recetas `feather_cap`, `amulet`, `amber_charm`, `sturdy_pack`, `rain_hood`; estudios del Taller `tracking`, `ornithology`, `mammalogy`, `river_mammals`; misiones y logros que cuentan estos objetos. Todos vuelven a tener su fuente de campo original (A1).

## 2. Mecánicas implementadas

### Drops separados por canal (`www/js/mec01-core.js` · `createDrops`)

| Canal | Contenido | Tirada en campo (manual / automática) |
| --- | --- | --- |
| `historicos` | Tabla `SPECIES_DROPS` (12 especies) | 2 % / 0,5 %, **función original `maybeSpeciesDrop` sin cambios**, siempre primera |
| `nuevosMateriales` | 19 materiales animales nuevos (`MAT-N…`) | 0,2 % / 0,05 % · provisional |
| `coleccionables` | 419 piezas de colección | 1,9 % / 0,475 % · provisional |
| `rarezas` | 12 rarezas y mitos (solo en el pozo de 44 especies) | 0,04 % / 0,01 % · provisional |

- Cada canal tira de forma independiente, con su propia configuración (`configure(canal, fuente, {manual, auto})`) y sus pesos de rareza (Común 12 · Poco común 5 · Raro 1,8 · Muy raro 0,4, los de la beta).
- Las tasas provisionales reproducen **en promedio** lo que cada categoría recibía en la beta 5.6.0 (tirada única de 2 % / 0,5 % repartida por peso). No son una calibración.
- Los 8 materiales históricos de A2 quedan excluidos de los canales nuevos (`exclude`); su reparto beta se conserva en los datos como propuesta para una etapa posterior.
- Fuentes declaradas: `campo` (activa), `expediciones`, `comercio`, `excavaciones`, `prospecciones`, `encargos`, `eventos` (inactivas). Una fuente se activa con `activateSource(id, resolvedor)`, que devuelve el pozo de cada canal; no hace falta tocar el campo.

### Registro permanente de coleccionables (`state.collectionRegistry`)

```js
collectionRegistry: {
  schema: 1,
  pieces: {                       // solo piezas descubiertas; nunca se borran
    'BOT-01': { firstAt: 1795…,   // ms; null si vino de una migración
                firstSource: 'campo', // 'campo' | 'migracion' | 'otros' | fuente futura
                obtained: 7,      // unidades obtenidas en total (duplicados ilimitados)
                sources: { campo: 6, migracion: 1 } }
  },
  migratedAt: 1795… | null,
  migratedPieces: 12
}
```

Estado de cada pieza (`AtlasMEC01.pieceStatus`): descubierta, en inventario (`owned`), en exhibición (`exhibited`), disponible (`available = owned − exhibited`) y disponible para intercambios (`tradable`, igual a `available` mientras no exista el intercambio). El registro es independiente del inventario: el avance de colecciones y el requisito «coleccionables» de la Sociedad usan `discoveredCount`.

### Interfaz de colecciones (Inventario → Coleccionables)

Panel «Colecciones · BETA» encima de la lista existente: contador global (piezas descubiertas y colecciones completas), filtros por colección, rareza y estado, las 32 colecciones agrupadas con su contador e indicador «✓ Colección completa», tarjetas con nombre corto, rareza y cantidad disponible, y siluetas «?» sin nombre para las piezas pendientes. Al tocar una pieza se abre una ventana con descripción, colección, gabinete, rareza, procedencia (continente), existencias y cómo se obtiene. Solo se generan las tarjetas de las colecciones abiertas. Sin arte nuevo: se usa la lámina genérica «?» con cinta BETA.

### Libro de ingresos (`state.moneyLedger`)

```js
moneyLedger: {
  schema: 1,
  total: 14580,                   // solo sube; los gastos no lo tocan
  bySource: { sinDesglose: 14000, publicaciones: 450, museo: 130 },
  migration: { at, baseline, method, startingCapital } // null en partidas que ya lo tenían
}
```

- Toda entrada de dinero pasa por `earnMoney(cantidad, procedencia)` en `app.js` (el único `state.money+=` que queda). Los encargos de `commissions-v3370.js` se anotan una vez al cobrarse.
- El libro vive dentro de la partida: las transacciones que revierten el estado completo (comercio, encargos) revierten también el libro.
- **Offline**: el ingreso del Museo se calcula solo en `tick`, a partir de `lastTick` guardado, con el tope de 8 h. Cargar no liquida nada por sí solo e importar fija `lastTick` en el momento actual, así que no hay doble conteo.
- **Criterio de migración** (partidas sin libro): no hay forma de reconstruir los ingresos pasados. Como saldo = capital inicial + ingresos − gastos, los ingresos son al menos `saldo − 420`. Se toma `max(saldo, beta560.moneyEarned) − 420` (mínimo 0) como cota inferior, anotada como `sinDesglose`. Una partida sin ningún avistamiento se considera nueva y empieza en 0. `beta560.moneyEarned` y `lastMoney` se conservan en la partida, pero ya no se actualizan.

### Museo y gabinetes

- `MUSEUM_LEVELS` en `app.js` es la única fuente: `MUSEUM_WINGS` y `museumCapacity()` se derivan de ella, y los niveles 4–5 (beta) se añaden desde la misma tabla.
- Gabinetes: selector completo con búsqueda por nombre, filtros por colección y rareza, paginación de 12, indicador de capacidad y botones Exponer / Retirar. `state.museum.cabinets` conserva el formato de la beta (`{gabinete: [ids]}`).
- Exponer reserva una unidad (no la descuenta) y solo si hay una disponible; retirar la libera. `normalizeCabinets` corrige al cargar, importar y pintar: quita piezas desconocidas, duplicadas, sin existencias o en un gabinete ajeno, y respeta la capacidad. `AtlasMEC01.consume` es la vía para un consumo futuro (venta, intercambio) y nunca toca unidades reservadas.
- Sin ingresos ni bonificaciones por gabinete.

Valores que el juego ejecuta y que se conservan, frente a la propuesta `docs/v560-beta/niveles-beta-v560.json`:

| Nivel | Ejecutado: nombre · costo · prestigio · vitrinas animales · casillas por gabinete | Propuesta: nombre · costo · rango mínimo de Sociedad · vitrinas · casillas |
| --- | --- | --- |
| 1 | Galería de fauna · £0 · 0 · 3 · 4 | Sala inicial · £0 · 1 · 3 · 4 |
| 2 | Sala de historia natural · £300 · 2 · 7 · 8 | Galería · £5.000 · 4 · 6 · 8 |
| 3 | Gran galería zoológica · £900 · 5 · 12 · 12 | Pabellón · £50.000 · 8 · 9 · 12 |
| 4 | Pabellón de ciencias (BETA) · £50.000 · 60 · 18 · 16 | Gran museo · £500.000 · 12 · 12 · 16 |
| 5 | Gabinete de maravillas (BETA) · £500.000 · 150 · 25 · 20 | Gabinete de maravillas · £5.000.000 · 16 · 15 · 20 |

La propuesta pide rango de Sociedad en lugar de prestigio y menos vitrinas animales; adoptarla es una decisión de balance para una etapa posterior.

### Hitos naturales

`NATURAL_MILESTONES` (en `app.js`, porque también funciona sin los datos beta) describe cada hito: especie, tipo (`velocidad`, `tamano`, `peso`, `longevidad`, `profundidad`, `altitud`, `distancia`, `conducta`), conducta, unidad, distribución, umbral, probabilidad por encuentro y etapa del cuaderno a la que sirve de alternativa. Solo existe el del guepardo, con sus valores y su orden de tiradas originales (media 85, desviación 10, rango 50–120, umbral 100 km/h, 10 % por encuentro). El registro sigue en `state.beta560.hitos.af_guepardo` y suma `bestAt` y `approvedAt`; un récord ≥ 100 km/h queda aprobado aunque el dato guardado venga incompleto.

### Versión

Compilación **V5.6.1 Beta — MEC-01**: `5.6.1` en `package.json`, `package-lock.json`, `atlas-release.json` (con `build: "MEC-01"`), `index.html` (meta `atlas-version`, `atlas-build`, título, `?v=`), `sw.js` (versión, archivos nuevos en `CORE` y caché `gran-atlas-v5.6.1-naturalist-…`), `atlas-integrity.json` y el respaldo (`gameVersion`). El número es `5.6.1` sin sufijo porque `scripts/configure-android-version.py` exige una versión numérica.

## 3. Archivos

| Archivo | Cambio |
| --- | --- |
| `www/js/mec01-core.js` | Nuevo. Canales de drops, fuentes, registro, reservas de gabinete y libro de ingresos (sin DOM) |
| `www/js/mec01-ui.js` | Nuevo. HTML de colecciones, gabinetes y ventana de pieza |
| `www/js/mec01-catalog-meta.js` | Nuevo, generado por `scripts/build-mec01-meta.cjs`. Continente de cada pieza |
| `www/css/mec01.css` | Nuevo. Estilos del panel, gabinetes y ventana |
| `www/js/app.js` | `earnMoney` en todas las entradas de dinero; `MUSEUM_LEVELS`; ganchos `mec01FieldDrops` y `normalizeMEC01`; bloque «Beta 5.6.0 / MEC-01» reescrito |
| `www/index.html`, `www/sw.js`, `www/atlas-release.json`, `www/atlas-integrity.json`, `www/manifest.webmanifest`, `www/js/save-manager.js`, `package.json`, `package-lock.json` | Versión 5.6.1 Beta — MEC-01 y archivos nuevos en la caché offline |
| `tests/mec01.test.cjs`, `tests/helpers/mec01-game.cjs` | Nuevas pruebas y arnés con los datos beta cargados |

No se modificaron `beta-v560-data.js`, especies, legendarios, relictos, láminas ni variantes pigmentarias.

## 4. Pruebas

`tests/mec01.test.cjs` cubre los 13 puntos obligatorios más la coherencia de versión: **14 de 14 aprobadas**.

| # | Comprobación |
| --- | --- |
| 1 | `maybeSpeciesDrop` conserva su texto exacto; tasas 2 % / 0,5 % medidas en 60.000 tiradas; el histórico tira primero |
| 2 | Pozos por canal sin mezclar categorías ni objetos históricos; anular un canal no afecta a los otros; una fuente futura se activa sin tocar el campo |
| 3 | Pieza descubierta sigue registrada tras salir del inventario, también al reabrir |
| 4 | Duplicados sin límite en inventario y registro |
| 5 | Colecciones y Sociedad cuentan el registro tras retirar existencias, también tras reabrir |
| 6 | Ingresos por procedencia; los gastos y los cambios de saldo no tocan el libro |
| 7 | Offline, recarga, tope de 8 h e importación sin doble conteo |
| 8 | Todas las piezas de un gabinete accesibles (paginación, búsqueda, filtros) y límite de capacidad |
| 9 | Reserva y liberación; consumo bloqueado para unidades reservadas; normalización de exhibiciones inconsistentes; persistencia |
| 10 | Migración de partidas anteriores a 5.6.0, de la beta 5.6.0, nuevas y dañadas; idempotente |
| 11 | Exportar e importar conserva registro, libro, gabinetes, hitos y materiales |
| 12 | Hito del guepardo: probabilidad, récord, aprobación, alternativa del cuaderno, persistencia y conexión con los encuentros |
| 13 | Sin datos beta, el motor se comporta como V5.5.1 |

### Suite completa (línea base frente a MEC-01)

Ejecutada archivo por archivo (`node --test`, 600 s por archivo) en este entorno, con un clon superficial: las pruebas que comparan con commits históricos (`git show <commit>`) fallan igual en ambas ejecuciones.

| | Línea base `9006b53` | MEC-01 |
| --- | --- | --- |
| Pruebas registradas | 760 | 774 (+14 nuevas) |
| Aprobadas | 492 | 506 |
| Fallidas | 268 | 268 |
| Regresiones (aprobada antes, fallida ahora) | — | **0** |
| Archivo que agota los 600 s | `global-v3240` | `global-v3240` |

De los 268 fallos, 256 menciones son `fatal: invalid object name` (commits históricos ausentes). Las 6 pruebas de `npm run release:verify` dan el mismo resultado antes y después (13 aprobadas, 5 fallidas, por la misma causa). Resultados por prueba: [`linea-base.json`](linea-base.json) y [`resultado.json`](resultado.json). No se eliminó ni se debilitó ninguna prueba existente.

Comprobación en navegador (Chrome sin interfaz, 412 × 900, partida beta 5.6.0 simulada): migración del libro (método `beta560.moneyEarned`), registro de 19 piezas, gabinete corregido, filtros, búsqueda con foco conservado, exponer, ventana de pieza y panel de Rango sin errores de consola.

## 5. Revisión manual

1. Servir `www/` en local (`npx serve www` o `python3 -m http.server -d www 8080`) y abrir `http://localhost:8080`. Conviene un perfil de navegador limpio para no mezclar la partida real.
2. Comprobar el subtítulo «v5.6.1 Beta · MEC-01».
3. Con una partida avanzada y el Gabinete de especímenes, hacer búsquedas manuales: deben caer tanto materiales históricos (con las 12 especies de siempre, por ejemplo el lobo gris) como piezas beta.
4. Inventario → Coleccionables: filtrar por colección, rareza y estado; abrir una pieza descubierta y una pendiente.
5. Museo → Gabinetes: con más de 12 piezas de un gabinete, recorrer las páginas, buscar por nombre, exponer hasta llenar y retirar. Una pieza expuesta con 1 unidad debe seguir figurando en el inventario.
6. Sociedad → Rango: «Dinero acumulado» no baja al gastar; desplegar «Ingresos acumulados por procedencia».
7. Exportar un respaldo, borrar los datos del sitio, importarlo y repetir 4–6.
8. Cerrar la pestaña con exposiciones de animales activas, volver unos minutos después y comprobar que «museo» sube solo por el tiempo transcurrido.

## 6. Problemas y pendientes

- **Versión web de prueba aislada**: no se publicó. `www/` ocupa 166 MB y 8.250 archivos (muy por encima de lo que admite un artefacto) y GitHub Pages solo despliega `main`. Para probar sin tocar producción: revisión local (sección 5) o un flujo de Pages de vista previa, que requiere autorización.
- **Balance** (MEC-02 o posterior): tasas de los tres canales nuevos, umbrales de la Sociedad, niveles del Museo (tabla de la sección 2) y si los 8 materiales históricos deben ganar fuentes nuevas (A2).
- **Fuentes inactivas**: expediciones, comercio, excavaciones, prospecciones, encargos y eventos están declaradas pero sin resolvedor.
- **Descripciones**: los datos beta no traen texto descriptivo; la ventana usa una descripción generada (colección y gabinete) y el continente de procedencia.
- **Reconciliación del registro**: si otro módulo escribe coleccionables directamente en el inventario después de que se consumieran unidades, el total `obtained` puede quedar corto (nunca afecta a «descubierta»). Hoy ningún módulo lo hace.
- **Ingresos migrados**: las partidas anteriores a MEC-01 no tienen desglose de su historial; queda como `sinDesglose`.
- La Sociedad sigue siendo informativa: sus «desbloqueos» no bloquean mecánicas.
- `global-v3240` agota los 600 s por archivo en este entorno, antes y después.

## 7. Confirmación

No se generó ni se publicó ninguna APK, no se ejecutó ningún flujo de Android y la última APK pública autorizada no se tocó. El desarrollo se detiene aquí para la auditoría externa; no se avanzó a MEC-02.
