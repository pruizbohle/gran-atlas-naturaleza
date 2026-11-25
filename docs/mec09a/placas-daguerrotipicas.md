# MEC-09A · Procedencia de placas daguerrotípicas (sección 16): evaluación y diseño

**Decisión.** No se implementa en MEC-09A. Se traslada a **MEC-09B** con el diseño siguiente. Los motivos:

- La solución toca la cámara de expediciones (MEC-06), el revelado y los estudios.
- Exige migrar las placas existentes y añadir una interfaz de lotes.
- Es más amplia que una corrección técnica acotada.
- El encargo permite trasladarla si las modificaciones son demasiado amplias.

## Situación actual

- **Existencias.** `state.inventory.placa_daguerrotipo` es la única fuente. Las placas no llevan procedencia.
- **Consumo.** La cámara consume una placa al zarpar, si la política lo permite (`state.mec06.camera`). La decisión se fija en `job.mec06.camera`.
- **Resultado.** La evidencia regional que produce el revelado es la de la expedición: el resultado se calcula al liquidar con el destino del trabajo. No existe una «placa con evidencia» almacenada.

## Diseño propuesto: `state.mec06.plates`

**Lotes.** Un registro complementario, no un segundo inventario. Cada lote tiene esta forma:

`{id, kind:'virgen'|'expuesta', qty, origin, at, activity, region|null, jobId|null}`

| Regla | Detalle |
| --- | --- |
| Fuente de existencias | `state.inventory.placa_daguerrotipo` sigue siendo la referencia. Invariante: la suma de los lotes `virgen` es igual a esa cantidad |
| Placas antiguas | Un lote `{origin:'anterior a MEC-09B', at:null}`. **No se asignan procedencias ficticias** |
| Entradas | Cada entrada crea un lote `virgen` con su origen (comercio, Taller, encargo…) en la misma transacción que `addInventory` |
| Consumo al zarpar | FIFO sobre los lotes `virgen`. El lote consumido se convierte en `expuesta` con `region` y `jobId` del viaje |
| Revelado | Consume el lote `expuesta` correspondiente (`jobId`) al liquidar. Si la expedición se pierde o se cancela, el lote se registra como «expuesta sin revelar» |
| Normalización | Si `inventory` y los lotes no coinciden, los lotes se ajustan al inventario: se recortan los más antiguos o se añade un lote sin procedencia, y se registra la recuperación |
| Interfaz | La ficha de la placa muestra los lotes. Distingue placa sin exponer de placa con evidencia de una región |

**Pruebas previstas para MEC-09B:**
- la invariante de la suma;
- FIFO;
- el revelado consume su lote;
- importar dos veces no duplica;
- las placas antiguas no reciben procedencia inventada.
