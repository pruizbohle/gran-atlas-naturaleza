# V5.6.0 beta · coleccionables, drops, niveles y gabinetes (borrador de datos)

Todo lo de esta carpeta es **beta** y **no está conectado al juego**: son datos y reglas listas para la próxima versión. No se tocó `www/`, el formato de guardado ni el APK.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `drops-beta-v560.json` | 470 piezas (431 coleccionables, 27 materiales animales, 12 rarezas y mitos) y qué especie bota cada una; incluye el pozo de cada una de las 1000 especies |
| `niveles-beta-v560.json` | 20 niveles de la Sociedad, 5 del Museo, hito del guepardo, 20 artefactos y 6 materiales nuevos |
| `El_Gran_Atlas_Drops_Beta_v560.xlsx` | La misma información para revisar en hoja de cálculo |

## Reglas de los drops (prueba)

- Cada pieza puede caer de **1 a 50 especies**: Común 30–50, Poco común 15–30, Raro 6–14, Muy raro 1–5. Los materiales caen de 12 a 31 especies; las rarezas y mitos, de 1 a 8, por afinidad.
- Tirada: primero la probabilidad de drop de la especie (2 % manual y 0,5 % automático, como hoy en `maybeSpeciesDrop`); luego se elige una pieza del pozo de la especie con peso Común 12, Poco común 5, Raro 1,8 y Muy raro 0,4.
- El reparto es por afinidad (huevos → aves; conchas, corales y algas → especies marinas; continente de la pieza → continente de la especie) y balanceado: cada especie tiene entre 10 y 23 piezas en su pozo.
- Los 12 drops que ya existen (`SPECIES_DROPS`) se conservan.
- Las 131 piezas nuevas no traían rareza: se asignó por posición dentro de su colección (40 % Común, 35 % Poco común, 17 % Raro, 8 % Muy raro). Hay que confirmarla.

## Sociedad: 20 niveles

Se sube cumpliendo a la vez prestigio, dinero acumulado y coleccionables distintos. Los umbrales están en el JSON y son un primer borrador para calibrar con el simulador.

## Museo: 5 niveles y gabinetes

Cinco niveles, como las áreas del Campamento. Cada nivel pide dinero y un nivel mínimo de Sociedad. Las "muestras" se reemplazan por **gabinetes** (Botánica, Geología, Oceanografía, Historia, Historia natural y exploración). Desde la pestaña Museo se elige qué exhibir, incluidas las exposiciones de animales.

## Hito del guepardo (único por ahora)

Conducta "correr": cada registro da una velocidad al azar (normal truncada, media 85 km/h, desviación 10, rango 50–120). Se guarda la máxima; con **100 km/h o más** el hito queda aprobado y cuenta como alternativa a las 10 observaciones comiendo de la etapa 4.

## Colecciones

Propuesta: las piezas se guardan como colección privada en el Campamento y se exhiben en los gabinetes del Museo; completar colecciones suma al nivel de la Sociedad.

## Marca beta

Cada elemento lleva `beta: true` en los datos y debe mostrar una insignia "BETA" en pantalla.

## Estado de integración

| Paso | Estado |
| --- | --- |
| 1. Objetos nuevos en el inventario (470 piezas), imagen genérica "?" con cinta BETA y drops de prueba | **Integrado** en la rama `feat/v560-beta` (`www/js/beta-v560-data.js` y bloque "Beta 5.6.0" al final de `app.js`) |
| 2. 6 materiales nuevos con receta en el Taller y 15 artefactos nuevos en el Museo (sala Artefactos) | **Integrado** en la rama. Los artefactos no dan bonificación; no se ha fijado ninguna |
| 3. Niveles de la Sociedad (20) | **Integrado** como pestaña *Rango* en la Sociedad. Muestra el rango, el avance hacia el siguiente y la lista de los 20. Por ahora **no bloquea ninguna mecánica**; el dinero acumulado se cuenta desde esta versión (`state.beta560`) |
| 4. Museo: 5 niveles y gabinetes con exhibición de animales | Pendiente |
| 5. Hito de velocidad del guepardo | Pendiente |
| 6. Colecciones privadas en el Campamento | Pendiente |

**Cómo se ve el paso 1:** los objetos beta solo aparecen en el inventario cuando el jugador los tiene. Las piezas y rarezas van en *Coleccionables* y los materiales en *Animales*. Todo objeto sin arte propio, beta o no, muestra una lámina genérica con un "?". Los drops exigen el Gabinete de especímenes, como los actuales. El número de versión no cambia hasta el lanzamiento.
