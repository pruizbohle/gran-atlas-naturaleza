# Auditoría previa · Relictos 5.0

Referencia reproducida en el motor de `7cd5110` (V5.1.1), con los módulos de catálogo, cartografía y arte de producción. Hay **9 relictos, 1.000 especies del Atlas, 125 regiones y 30 legendarios**. Las 9 láminas SVG específicas de V3.19.9 están disponibles, incluso sin conexión.

| Relicto | Identificador de partida | Región | Bioma y turno en V5.1.1 | Hallazgo de auditoría |
| --- | --- | --- | --- | --- |
| Celacanto del Índico | `coelacanth_indic` | `HX-10-12`, litoral sudoriental africano | Costa, atardecer o noche | El sector es plausible si el encuentro se sitúa en aguas rocosas de la plataforma, no en la orilla. El primer registro científico es posterior a 1842. |
| León del Atlas | `atlas_lion` | `HX-06-08`, montañas del Atlas | Montaña o estepa, amanecer, atardecer o noche | Vinculado a la población norteafricana de `af_leon` para evitar una segunda ficha zoológica. |
| Murciélago de Seychelles | `seychelles_sheathbat` | `HX-07-14`, Índico occidental | Bosque, atardecer o noche | El expediente debe indicar Seychelles dentro del hexágono compartido. |
| Cocodrilo enano africano | `gabon_dwarf_croc` | `HX-08-10`, bosques atlánticos ecuatoriales | Río, bosque o humedal, atardecer o noche | La especie ya es `af_xlsx_cocodrilo_enano`. Se conserva su identidad del gabinete como un registro especial independiente. |
| Tortuga angonoka | `angonoka` | `HX-09-14`, Madagascar | Bosque o pradera, amanecer, día o atardecer | Es distinta de la tortuga radiada del Atlas. Limitar el expediente al matorral y al bosque seco de la bahía de Baly. |
| Pez pulmonado africano | `african_lungfish` | `HX-09-11`, grandes lagos africanos | Humedal, amanecer, atardecer o noche | Corresponde a `Protopterus aethiopicus`, con presencia localizada en aguas someras. |
| Esturión blanco del Pacífico | `white_sturgeon` | `HX-02-02`, Columbia Británica | Río, amanecer, atardecer o noche | Buscar en el sistema del Fraser. |
| Gavial del Ganges | `gharial` | `HX-05-16`, subcontinente indio | Río, amanecer, día o atardecer | Los ríos compatibles se extienden dentro de la cuenca del Ganges. |
| Proteo de las cuevas | `olm_balkans` | `HX-03-12`, Balcanes | Bosque, noche | La configuración contradecía la descripción cavernícola. Usar el canal fluvial existente como representación de aguas subterráneas del karst dinárico. El turno se refiere al muestreo. |

### Mecánica anterior

- Una búsqueda con avistamiento ordinario podía dar un indicio con 4 % manual o 0,7 % automático, duplicables por Rastreo. También podía registrar un relicto con 0,06 % manual o 0,009 % automático, sin relación con los indicios.
- Investigar por prospección documental consumía las libras y el conocimiento ya establecidos. Sus recibos impedían el cobro duplicado, y la mejora aumentaba el cupo y las pistas. El hallazgo natural y la catalogación forzaban 3/3 aunque faltaran indicios.
- Catalogar desde Museo concedía el relicto sin salir a Campo a cambio de 140 de conocimiento, una tinta y dos pergaminos. Las expediciones científicas no aportaban indicios.
- Museo mostraba la región incluso con 0/3. Las posesiones se guardaban como valores booleanos, sin fecha ni constancia de si se habían obtenido por Campo o por catálogo. Las vitrinas, colecciones, hitos y bonificaciones ya funcionaban con esos identificadores.
- Los nueve códigos de región y las nueve láminas son válidos. La configuración superficial del proteo requería una corrección ecológica. El motor no comprobaba que las restricciones de Campo fueran coherentes con la descripción antes de la tirada.
