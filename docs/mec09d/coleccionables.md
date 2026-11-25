# MEC-09D §11–§13 · Las 431 piezas y las 32 colecciones

## Herramientas

- **Script:** `scripts/mec09d-collectibles.cjs`. Genera la matriz por pieza (`piezas.csv`) y la de colecciones (`colecciones.csv`).
- **Prueba:** `tests/mec09d-collectibles.test.cjs`, con 6 pruebas.
- **Motor y estado:** el motor vigente con el catálogo completo, en una partida con todas las regiones e instalaciones a nivel 5. No se usan herramientas GM ni `addInventory` directo.

## Método: nivel C individual en las 431 piezas

Cada pieza se obtiene por una vía real del juego:

| Vía | Cómo se obtiene | Piezas |
|---|---|---|
| Campo | Búsqueda completa `mec03AmbientFinds` en una región y bioma legítimos, con el azar dirigido a la pieza | 144 |
| Caravana | Ofertas reales de compra o intercambio, recorriendo 1500 periodos de 72 h; compra con `executeOffer`. Las «solicitudes» piden la pieza al jugador y **no** cuentan como fuente | 182 |
| Expediciones | Pozo y sorteo reales del motor por ruta y modalidad, con incorporación real `grant` | 45 |
| Excavaciones | Pozo y sorteo reales por yacimiento y modo, con `grant` | 36 |
| Observación animal | `mec01FieldDrops`, con Gabinete de especímenes y especie compatible | 17 |
| Encargos de coleccionista | `claimCommission` real | 7 |

Cada incorporación se verifica en el inventario, en el registro permanente (`collectionRegistry`) y en el registro de procedencia. Después se guarda y se recarga la partida.

## Resultados

| Comprobación | Resultado |
|---|---|
| Piezas obtenidas por la selección real del motor | **431/431** |
| Referencias rotas en las fuentes (continentes, biomas, rutas, yacimientos, recetas, especies) | **0** |
| Fuentes declaradas pero no operativas | **0**. Las 224 piezas con fuente Caravana aparecen como oferta de compra o intercambio |
| Colecciones completables | **32/32**. Ninguna depende de eventos de calendario, que siguen desactivados |
| Duplicados | Ilimitados. Obtener de nuevo suma unidades pero **no** suma progreso de colección (cuenta piezas distintas) |
| Excedentes | Con la regla real `chooseGive`, intercambiables = poseídas − expuestas − 1 (protección de la última unidad). Nunca se entrega la pieza objetivo ni la última unidad |
| Persistencia | Inventario, registro (431 descubiertas), procedencias y progreso iguales tras guardar y recargar |
| Coherencia | Inventario, registro de colección, gabinetes del Museo (reserva de expuestas) y reconocimientos de la Sociedad leen del mismo registro (`collectionRegistry` / `inventory`) |

**Sin errores funcionales.**

Antecedente: MEC-09B ya había obtenido 288 de estas piezas desde una partida nueva con el controlador de progresión (nivel D).

## Reservado para BAL

- **Rotación lenta de la Caravana.** Algunas piezas poco comunes tardan muchos periodos en aparecer por primera vez como oferta, con semilla fija:

  | Pieza | Primera aparición (periodo) | Equivale a |
  |---|---|---|
  | MAD-08 Nogal europeo | 468 | ≈ 3,8 años |
  | MARV-07 Piedra solar de calcita | 413 | – |
  | NUM-13 Tálero de María Teresa | 326 | – |
  | NUM-17 Placa sueca | 280 | – |
  | NUM-18 Rublo imperial | 279 | – |
  | MED-13 Insignia civil de la Orden de Leopoldo | 276 | – |

  Las que tienen otra fuente no bloquean. Frecuencias completas en la columna `caravana_ofertas_por_100_periodos`.
- **Piezas con una sola fuente operativa (10):**
  - MAR-08 a MAR-12: solo en la expedición atlántica extraordinaria. Es la colección «Secretos de Atlántida», que tiene 5 piezas y es un cuello de botella.
  - ARQ-04, ARQ-05, ARQ-09, ARQ-10 y ARQ-11: solo en Campo, en pocos biomas o regiones.
- **«Rarezas y mitos»:** sus 12 piezas son raras, así que es la colección potencialmente más lenta.
- **Colecciones pequeñas:** «Los siete mares» (7), «Siete maravillas antiguas» (7) y «Secretos de Atlántida» (5).
