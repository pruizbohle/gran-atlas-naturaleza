# El Gran Atlas · V5.0.5 · ART-01

Se aprobaron **11 correcciones en siete mamíferos**. Se revisaron las diez variantes prioritarias y se añadió la nutria europea melánica, que en la auditoría de Mustelidae perdía el hocico, el ojo y el flanco sobre fondo oscuro. Se descartaron tres propuestas iniciales y se aprobaron sus segundas versiones tras cotejarlas con las láminas vigentes. [Comparativas visuales](comparativas.md) · [Decisiones individuales](decisiones.json)

La candidata parte de V5.0.4, commit `cd90a9e`, en `audit/aud-01-v501`. Se mantienen las 1.000 especies, las 125 regiones y las 1.672 láminas científicas. Continúan las referencias positivas del wombat común, cuervo, ajolote mexicano y salmón rosado albinos. [Auditoría inicial](../auditoria-v501/AUD-04-arte.md) · [Referencia técnica](../auditoria-v504/README.md)

## Decisiones por variante

| Especie | Variantes aprobadas | Criterio |
|---|---|---|
| Gorila de montaña | Albino y melánico | Piel desnuda distinta del pelaje en el albino. Rostro, cejas y manos recuperados en el manto oscuro. |
| Tigre | Albino y melánico | La interpretación albina recupera la gorguera y el relieve del hocico. La versión oscura usa rayas que se ensanchan y confluyen, con ventanas ocres propias del pseudomelanismo. |
| Jaguar | Albino y melánico | Los tejidos claros del albino dejan ver el hocico y la mandíbula. El jaguar oscuro conserva rosetas de bajo contraste, ojos y separación de las extremidades. |
| Zorro rojo | Albino y melánico | El albino separa tejidos de orejas, párpados y hocico. El morfo plateado retiene la máscara, guardas claras y el extremo claro de la cola. |
| Hipopótamo | Melánico | Transiciones de pizarra a pardo sobre la piel, con pliegues de la nuca y la papada legibles. |
| Pangolín gigante | Melánico | Modelado individual de escamas oscuras. Se recuperan estrías, hocico y garras. |
| Nutria europea | Melánico | Las vibrisas, trufa y garganta se separan del manto oscuro. Se conservan los dedos y el contorno de la cola. |

El pseudomelanismo del tigre se apoyó en el patrón de rayas confluentes descrito para Similipal. La coloración blanca estudiada en tigres conserva rayas pigmentadas. La lámina etiquetada como albina representa hipopigmentación extrema y usa bandas tonales discretas como parte del modelado. [Pseudomelanismo en tigres](https://doi.org/10.1073/pnas.2025273118) · [Coloración del tigre blanco](https://doi.org/10.1016/j.cub.2013.04.054)

El melanismo del jaguar y los morfos oscuros de zorro rojo tienen respaldo documentado. El albinismo del gorila de montaña se ilustró por analogía con el caso del gorila occidental Copito de Nieve. Los demás casos de evidencia insuficiente se señalan en el laboratorio como hipótesis o interpretaciones de pigmentación. [Melanismo en félidos](https://doi.org/10.1016/S0960-9822(03)00128-3) · [Pigmentación del zorro rojo](https://pubmed.ncbi.nlm.nih.gov/?term=A+non-epistatic+interaction+of+agouti+and+extension+in+the+fox) · [Genoma de Copito de Nieve](https://doi.org/10.1186/1471-2164-14-363)

Las primeras propuestas del gorila melánico y el jaguar melánico perdían la lectura del morfo por un manto demasiado gris o pardo. El primer tigre albino perdía rasgos del contorno de la cabeza. El cotejo conserva el motivo de cada descarte y la versión aprobada. A 64 px, la silueta, el morro y la separación de las extremidades son el criterio principal. Las vibrisas finas y parte de las rosetas se aprecian mejor a partir de 128 px. [Mesa de revisión](mesa-de-revision.jpg)

## Inventario AUD-04

| Estado | Antes | Después |
|---|---:|---:|
| Correcta y aprobada | 6 | 17 |
| Mejorable, pendiente de ajuste | 60 | 57 |
| Insuficiente, requiere nueva ilustración | 42 | 34 |
| Pendiente de evaluación | 456 | 456 |
| Variantes examinadas únicas | 108 | 108 |
| Correcciones aprobadas en el lote | 0 | 11 |

Las 11 correcciones ya tenían una evaluación en AUD-04. Las 302 albinas y 262 melánicas mantienen sus identificadores. [Inventario de 564 variantes](inventario-aud04.json)

## Integridad y tamaño

Se repintó cada variante como una lámina individual a partir de la anatomía de la normal. La extracción y exportación reproducen cuatro dimensiones cuadradas de 64, 128, 256 y 512 px. Se contrastaron las propuestas con las antiguas en crema y carbón, con revisión de ojos, tejidos, contornos y volumen. Los 44 derivados exportados usan transparencia WebP y conservan las rutas. Los 44 archivos históricos archivados son idénticos a los de V5.0.4. [Rutas, pesos y SHA-256](integridad.json)

| Recursos | V5.0.4 | V5.0.5 | Diferencia |
|---|---:|---:|---:|
| Derivados de las 11 variantes | 541.706 B | 762.318 B | +220.612 B |
| Ilustraciones de animales | 104.439.218 B | 104.659.830 B | +0,21 % |
| Caché básica PWA | 129.214.092 B | 129.446.667 B | +0,18 % |
| Comparativas de descarga opcional | 11.702.828 B | 12.244.534 B | +541.706 B |

El aumento de las láminas de producción corresponde a bordes, trama de grafito, pelaje, rosetas y superficies más detallados. El modo **Variantes revisadas en ART-01** del laboratorio permite comparar normal, anterior y corregida usando las cuatro resoluciones, búsqueda, familia y fondos claro u oscuro. Los originales forman parte de la descarga opcional de comparaciones. [Laboratorio en la rama de auditoría](../../www/naturalist-art/index.html)

## Validación funcional

Aprobaron **638 de 849 pruebas**, con dos casos nuevos para los archivos y el inventario. Los 211 fallos históricos conservaron su clasificación y no aparecieron fallos nuevos. La verificación de entrega aprobó 28 de 28 pruebas. El código de avistamientos, su tabla de probabilidades y la lógica de recompensas coinciden con V5.0.4. [Regresión por identificador](regresion.json)

En Chromium emulado, la actualización desde V5.0.4 conservó el respaldo exacto de la partida avanzada y lo reabrió sin red. El melánico de zorro rojo se cargó en Campo, Cuaderno y la colección del Bestiario con la ruta habitual. En el Museo jugable se abrió la muestra zoológica normal. El laboratorio mostró la variante en las cuatro simulaciones. Se decodificaron las 33 imágenes de comparación en cada resolución sin conexión y se verificaron los filtros de familia, búsqueda, fondos y las 564 variantes pigmentarias. [PWA y comparaciones](pwa.json)

La recuperación aislada de ocho horas con diez naturalistas tardó entre 3,02 y 3,04 s en ambas revisiones, con orden alternado. Los tres pares conservaron el mismo estado de progresión, incluido el saldo, el inventario y las observaciones por especie. La serie concurrente quedó registrada aparte. [Recuperación comparada](recuperacion.json)

Se repitieron el arranque y las primeras aperturas tres veces por revisión y tipo de partida, alternando el orden en Chromium móvil 390 × 844 con CPU ralentizada 4×. Las medianas muestran la variación de la serie. El máximo de heap JS muestreado en la partida avanzada pasó de 9,01 a 8,93 MB. [Mediciones por repetición](arranque.json)

| Partida | Campo listo | Primera apertura del Cuaderno | Primera apertura del Bestiario |
|---|---:|---:|---:|
| Nueva | 1.266 → 1.137 ms | 106 → 114 ms | 139 → 132 ms |
| Avanzada | 1.175 → 1.194 ms | 185 → 145 ms | 335 → 264 ms |

## Próximo lote propuesto

Priorizar antes de ampliar familias el guepardo albino, el tejón albino y el visón europeo melánico. Las evaluaciones describen pérdida de lectura del hocico, la trufa, los párpados o las marcas diagnósticas. Conviene resolver esos casos con referencias por taxón y validar las miniaturas antes de continuar con dimorfismo, escalas, legendarios y relictos. [Felinos y cánidos](../auditoria-v501/aud04-felidae-canidae.json) · [Mustélidos](../auditoria-v501/aud04-mustelidae.json)

## Procedimiento de aprobación

1. Abrir la lámina normal y la variante de producción a 512 px. Recuperar su evaluación histórica por identificador y anotar el problema y los rasgos que deben conservarse.
2. Revisar el respaldo biológico del morfo. Identificar por separado las estructuras que se repintan y marcar como interpretación cualquier rasgo de pigmentación extrapolado.
3. Repintar los rasgos concretos. Usar una lámina individual con alfa y verificar el relieve, la silueta y la ausencia de fondos o halos.
4. Cotejar la propuesta y la versión vigente a 64, 128, 256 y 512 px sobre crema y carbón. Aprobar si mejora los tejidos o patrones documentados y conserva la lectura anatómica. Registrar cualquier propuesta descartada con su motivo.
5. Exportar a las cuatro resoluciones. Archivar los cuatro WebP anteriores por variante y copiar los aprobados a sus rutas de producción. El exportador `scripts/build-classical-plates.py` acepta un objeto JSON de hojas con `file`, `columns`, `rows` y `stems`. Para ART-01 se indican directamente identificadores de variante y se omite `--inventory`.
6. Regenerar los metadatos y correr las verificaciones. [Decisiones](decisiones.json) · [Comparativas](comparativas.md)

```sh
node scripts/art01-inventory.cjs --write
node scripts/build-naturalist-lab.cjs
node scripts/build-naturalist-release.cjs --write
node scripts/art01-inventory.cjs
node --test tests/art01-variants.test.cjs
npm run release:verify
```

La actualización, la comparación offline y la recuperación se reproducen con Chromium y Playwright. La suite completa se ejecuta en un árbol separado porque algunas pruebas históricas generan informes.

```sh
git worktree add --detach /tmp/atlas-v504-base cd90a9e
AUD05_SAVE_DIR=/tmp/atlas-v505-fixtures node scripts/aud01-playthrough.cjs
ATLAS_ART01=1 AUD05_PWA_ONLY=1 AUD05_PWA_TRANSITION=1 AUD05_PWA_SAVE=/tmp/atlas-v505-fixtures/advanced.json node scripts/aud01-browser.cjs /tmp/atlas-v504-base/www
ATLAS_OFFLINE_EXACT=1 ATLAS_OFFLINE_CASE=8:10 node scripts/aud02-offline-matrix.cjs /tmp/atlas-v504-base/www /tmp/atlas-v505-fixtures/advanced.json
AUD06_STAGES=new,advanced node scripts/aud06-startup.cjs /tmp/atlas-v504-base/www /tmp/atlas-v505-fixtures
git worktree add --detach /tmp/atlas-v505-pruebas HEAD
(cd /tmp/atlas-v505-pruebas && AUD01_OUTPUT=/tmp/atlas-v505-regresion node scripts/aud01-run.cjs)
```
