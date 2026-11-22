# El Gran Atlas V5.0.9 · ART-05

Base `75eb63d` (V5.0.8) en `audit/aud-01-v501`. Se corrigieron ocho variantes clasificadas previamente como insuficientes. Las decisiones se tomaron comparando la normal, la variante de V5.0.8 y el repintado sobre crema y carbón a 64, 128, 256 y 512 px.

## Visor de albinos y melánicos

En el laboratorio, elegir **Visor de albinos y melánicos**, o abrir directamente `naturalist-art/?view=pigment-audit` al servir `www/` desde esta rama. La vista reúne 302 albinas y 262 melánicas en una lista continua. Cada tarjeta muestra nombre, taxón, ID, familia, tipo y estado de AUD-04. Donde hay corrección archivada, también muestra el antes y el después. La ficha ampliada presenta el historial disponible, las observaciones de la auditoría y el tamaño nativo de lámina que se selecciona.

Los filtros del visor permiten buscar por nombre común, nombre científico o ID y combinar tipo, estado, familia, corrección y disponibilidad de comparativa. Se conservan los modos y selectores anteriores del laboratorio. La prioridad ordena insuficientes, mejorables, pendientes y correctas, y respeta las marcas P1 dentro de cada estado. El fondo claro u oscuro se puede cambiar tanto en la galería como en la ficha. El botón del laboratorio para comparativas sin conexión sigue preparando los originales históricos en el caché opcional.

[Captura de la vista global](evidencia/visor-global.png) · [Captura de la ficha ampliada](evidencia/ficha-ampliada.png) · [Comprobación de navegador](evidencia/laboratorio.json)

## Ocho correcciones aprobadas

| Variante | Decisión artística | Comparativa |
| --- | --- | --- |
| Caracal melánico | Se recuperan los pinceles auriculares largos, el hocico y los bigotes. Se conserva el volumen de flanco y patas en carbón. | [Antes y después](comparativas/af_caracal--melanico.jpg) |
| Gato de la jungla melánico | Las orejas altas de pinceles cortos, el hocico triangular y los anillos de cola conservan lectura. | [Antes y después](comparativas/asia_esp_0205--melanico.jpg) |
| Manul melánico | La cara aplanada, las orejas bajas y la cola gruesa se distinguen del pelaje largo oscuro. | [Antes y después](comparativas/asia_esp_0387--melanico.jpg) |
| Gato montés europeo melánico | Se separan mejillas, pecho y patas. Se conserva la punta roma y anillada de la cola. | [Antes y después](comparativas/gato_montes--melanico.jpg) |
| Lobo dorado africano albino | Recupera vibrisas, hocico estrecho, orejas y dedos sobre crema. Conserva la clave `af_chacal_dorado`. | [Antes y después](comparativas/af_chacal_dorado--albino.jpg) |
| Glotón albino | Se separan trufa, párpado y garras del pelaje marfil. La banda del flanco se sugiere por el volumen del pelo. | [Antes y después](comparativas/gloton--albino.jpg) |
| Zorro del Cabo melánico | Se recuperan las orejas anchas, el hocico fino y el contorno de la cola, con patas distinguibles en carbón. | [Antes y después](comparativas/af_zorro_cabo--melanico.jpg) |
| Pigargo vocinglero, variante albina | Las cobertoras, el pico ganchudo, la cera pajiza y los tarsos se separan del fondo. La lámina se identifica como hipopigmentación intensa e interpretativa. | [Antes y después](comparativas/af_aguila_pescadora--albino.jpg) |

El melanismo del caracal y del gato de la jungla está documentado. Las demás representaciones oscuras del lote se identifican como interpretativas. Se conservó la gama natural de los ojos en las cinco variantes melánicas. Se aclararon el iris y la órbita en el lobo dorado, el glotón y el pigargo con tonos poco saturados, registrados individualmente. En el pigargo, el iris discreto y las diferencias entre las plumas de vuelo y las cobertoras se representan como hipopigmentación artística. [Decisiones individuales](decisiones.json) · [Caracal, Mammalian Species](https://academic.oup.com/mspecies/article/52/993/71/6016926) · [Gato de la jungla, IUCN Cat Specialist Group](https://www.catsg.org/living-species-junglecat) · [Manul, Mammalian Species](https://doi.org/10.1093/mspecies/seae004) · [Gato montés europeo, IUCN Cat Specialist Group](https://www.catsg.org/living-species-europeanwildcat) · [Zorro del Cabo, Mammalian Species](https://academic.oup.com/mspecies/article/51/972/11/5528386) · [Lobo dorado africano, Mammal Diversity Database](https://www.mammaldiversity.org/taxon/1005942/) · [Glotón, Alaska Department of Fish and Game](https://www.awc.adfg.alaska.gov/index.cfm?adfg=wolverine.main) · [Pigargo, Animal Diversity Web](https://animaldiversity.org/accounts/Haliaeetus_vocifer/)

Los ocho candidatos de este lote se aprobaron. El oso tibetano melánico sigue insuficiente y pendiente de justificación biológica.

## Inventario

| Indicador | V5.0.8 | V5.0.9 |
| --- | ---: | ---: |
| Variantes pigmentarias | 564 | 564 |
| Examinadas únicas | 174 | 174 |
| Correctas | 39 | 47 |
| Mejorables | 104 | 104 |
| Insuficientes | 31 | 23 |
| Pendientes de evaluación | 390 | 390 |
| Variantes únicas corregidas | 30 | 38 |
| Correcciones aprobadas acumuladas | 32 | 40 |
| Propuestas rechazadas acumuladas | 8 | 8 |

[Inventario AUD-04](inventario-aud04.json)

## Comprobaciones dirigidas

Se verificaron formato, alfa, dimensiones, huellas y rutas de los 32 WebP de reemplazo. Las versiones previas se archivaron con los mismos bytes de V5.0.8. Los reemplazos aumentaron el peso de 373.180 a 504.214 bytes. El manifiesto básico incluye los archivos del visor y registra 6.937 recursos. [Manifiesto de los cambios](integridad.json)

En Node se aprobaron 13 pruebas de ART-01 a ART-05 y tres comprobaciones dirigidas de renderizado. En Chromium se verificaron el listado de 564 variantes, los filtros y el orden, búsquedas por nombre e ID, la ficha en las cuatro resoluciones y ambos fondos, el historial del visón y la etiqueta de pseudomelanismo del tigre. La comprobación a 390 px verificó el ajuste del visor y del diálogo en móvil. Se comprobaron además los selectores anteriores y la carga en las vistas previas de Campo, Cuaderno, Bestiario y Museo. Las campañas integrales quedan para el cierre de la consolidación artística. [Resultado del navegador](evidencia/laboratorio.json)

```sh
node scripts/art05-inventory.cjs
node scripts/build-naturalist-release.cjs
node --test tests/art01-variants.test.cjs tests/art02-variants.test.cjs tests/art03-variants.test.cjs tests/art04-variants.test.cjs tests/art05-variants.test.cjs
node --test --test-name-pattern='configured pigment selects its own image|lab preserves the originals|visual exceptions preserve image paths' tests/naturalist-v400.test.cjs
ATLAS_ART05_SMOKE=1 node scripts/aud01-browser.cjs
```

## Próximo lote recomendado

Priorizar las albinas de leopardo, licaón, chacal de dorso negro, abejaruco carmín y águila esteparia, además de las melánicas de zorro pálido, cuón y nutria lisa. Las ocho están registradas como insuficientes. La corrección de las aves debe cuidar la diferencia entre pigmento, color de tejidos y sombras de las plumas.
