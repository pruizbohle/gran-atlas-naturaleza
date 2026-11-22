# El Gran Atlas V5.0.10 · ART-06

Base `415b36a` (V5.0.9) en `audit/aud-01-v501`. Se aprobaron ocho correcciones con diagnóstico previo y la sustitución de la variante del oso tibetano. Las láminas se compararon con la normal y la versión anterior en crema y carbón, usando los derivados de 64, 128, 256 y 512 px.

## Selección con el visor global

Se abrió el visor de V5.0.9, se aplicó el filtro **Insuficiente** y se ordenó por **Prioridad**. El resultado mostró 23 variantes. Se abrieron, por ID, las nueve fichas intervenidas, incluida la variante melánica del oso, y se guardaron sus diagnósticos vigentes. Tras la actualización, el visor y el laboratorio muestran las propuestas aprobadas junto a los archivos históricos disponibles. [Captura de la selección](evidencia/seleccion-v509.png) · [Diagnósticos leídos en las fichas](evidencia/seleccion-v509.json) · [Visor actualizado](evidencia/visor-global.png)

## Oso tibetano, de melánico a albino

El pelaje habitual de *Ursus thibetanus* ya es negro. La revisión anterior dejó sin confirmar un morfo melánico distinguible. Los rasgos de la especie que guían la nueva lámina son las orejas redondas y grandes, la gorguera de pelo más largo y la media luna pectoral. El repintado marfil conserva estos rasgos y el volumen del tronco. La media luna queda sugerida por la dirección y el valor del pelo. Se modelaron hocico, nariz gris rosada, garras, párpados y un iris gris rosado tenue. La lámina representa **albinismo interpretativo**, con despigmentación del pelaje y de los tejidos visibles. Se usaron referencias anatómicas de la especie. [IUCN SSC Bear Specialist Group](https://globalbearconservation.org/Species/species_cls/7) · [International Association for Bear Research and Management](https://www.bearbiology.org/the-eight-bear-species/ursus-thibetanus-asiatic-black-bear/)

El ID de especie `asia_esp_0523` se conserva. Su variante activa cambia de `melanico` a `albino`. Las cuatro láminas melánicas de V5.0.9 se retiraron de las rutas activas y se archivaron byte a byte. La ficha del visor marca la imagen anterior como retirada. El lote ART-03 y las referencias anteriores de Serie 4.3 conservan el historial, identificado como melánico. [Ficha melánica en V5.0.9](evidencia/oso-melanico-v509.png) · [Ficha albina en V5.0.10](evidencia/ficha-ampliada.png) · [Comparativa en cuatro resoluciones](comparativas/asia_esp_0523--albino.jpg)

Al cargar una partida anterior o importar un respaldo, el registro de descubrimiento y los recuentos de la variante retirada pasan a **Albino** para preservar el progreso de colección. Si el respaldo contiene ambos recuentos, se suman una vez y se elimina la clave antigua del registro activo. El diario y los encuentros ya registrados conservan su descripción histórica. Se verificó que la probabilidad del pigmento, incluida la bonificación de etología, y la categoría Notable mantienen sus umbrales. [Prueba dirigida de compatibilidad](../../tests/art06-variants.test.cjs)

## Ocho correcciones adicionales

| Variante | Resultado visual | Evidencia |
| --- | --- | --- |
| Leopardo, variante albina | Se preservaron cola y musculatura. Moteado tenue, nariz rosada y mejor lectura de los bigotes. Se identifica como hipopigmentación interpretativa. | [Comparativa](comparativas/af_leopardo--albino.jpg) |
| Licaón albino | Orejas redondas, hocico, patas largas y punta de la cola conservan la silueta. La segunda propuesta atenúa las marcas. | [Comparativa](comparativas/af_licaon--albino.jpg) · [Primer candidato rechazado](comparativas/af_licaon--albino--rechazo.jpg) |
| Chacal de lomo negro albino | Se recuperaron orejas, hocico y extremidades. La silla dorsal queda sugerida por el valor del pelaje. | [Comparativa](comparativas/af_xlsx_131_lupulella_mesomelas--albino.jpg) |
| Abejaruco carmín, variante albina | Pico curvo, dígitos y plumas centrales largas se distinguen del plumaje marfil. Hipopigmentación interpretativa. | [Comparativa](comparativas/af_abejaruco_carmin--albino.jpg) |
| Águila esteparia albina | Se recuperó el perfil de las primarias digitadas, el pico y la cabeza en vuelo, especialmente sobre fondo crema. | [Comparativa](comparativas/asia_esp_0030--albino.jpg) |
| Zorro pálido melánico | El hocico fino, las orejas altas, las patas largas y la punta de la cola conservan volumen en carbón. | [Comparativa](comparativas/af_zorro_palido--melanico.jpg) |
| Cuón melánico | Se recuperaron hocico, patas y hombros con sombreado localizado. La cola tupida pierde menos detalle en fondo oscuro. | [Comparativa](comparativas/asia_esp_0820--melanico.jpg) |
| Nutria lisa melánica | Se distinguen mandíbula, vibrisas, patas cortas y cola ancha y aplanada sobre carbón. | [Comparativa](comparativas/asia_esp_0300--melanico.jpg) |

Se rechazó la primera propuesta del licaón por conservar manchas y máscara oscuras que debilitaban la lectura de la despigmentación. El oso, el leopardo, el licaón, el chacal y las dos aves recibieron tonos oculares más claros. En las tres variantes melánicas se mantuvo la gama parda o ámbar, y la lectura de la cabeza mejoró mediante sombras locales. Los tonos de la lámina y el diagnóstico del morfo se registran por separado. [Decisiones y motivos](decisiones.json) · [Leopardo, SANBI](https://www.sanbi.org/animal-of-the-week/leopard/) · [Licaón, Mammalian Species](https://academic.oup.com/mspecies/article/54/1017/seac002/6565923) · [Cuón, Central Zoo Authority](https://cza.nic.in/uploads/documents/studbooks/hindi/Wild%20Dog%20Studbook%20%28Cuon%20alpinus%29.pdf) · [Nutria lisa, IUCN SSC Otter Specialist Group](https://www.otterspecialistgroup.org/otter-species/lutrogale-perspicillata/) · [Pigmentación de aves, Guay et al.](https://vuir.vu.edu.au/22213/7/AFO2012V029N01_023.pdf)

## Inventario y comprobaciones dirigidas

| Indicador | V5.0.9 | V5.0.10 |
| --- | ---: | ---: |
| Variantes pigmentarias | 564 | 564 |
| Albinas | 302 | 303 |
| Melánicas | 262 | 261 |
| Examinadas únicas | 174 | 174 |
| Correctas | 47 | 56 |
| Mejorables | 104 | 104 |
| Insuficientes | 23 | 14 |
| Pendientes de evaluación | 390 | 390 |
| Variantes únicas corregidas | 38 | 47 |
| Correcciones aprobadas acumuladas | 40 | 49 |
| Propuestas rechazadas acumuladas | 8 | 9 |

La sustitución del oso reutiliza su registro de auditoría. Se verificaron 36 WebP de reemplazo y sus originales, las dimensiones y el alfa, las huellas, las rutas y los manifiestos. Los archivos de las variantes intervenidas pasan de 411.894 a 517.540 bytes. El catálogo mantiene 1.000 especies y 1.672 láminas. [Inventario](inventario-aud04.json) · [Huellas y rutas](integridad.json)

Pasaron 17 pruebas de ART-01 a ART-06 y tres comprobaciones dirigidas de renderizado. En Chromium se verificaron el visor en escritorio y a 390 px, la ausencia de una tarjeta melánica activa del oso, su historial en ART-03, el acceso a los originales de Serie 4.3 y la carga en las cuatro resoluciones. Las vistas previas de Campo, Cuaderno, Bestiario y Museo usan la nueva lámina. [Evidencia de navegador](evidencia/laboratorio.json)

```sh
node scripts/art06-inventory.cjs
node scripts/build-naturalist-release.cjs
node --test tests/art0[1-6]-variants.test.cjs
node --test --test-name-pattern='configured pigment selects its own image|lab preserves the originals|visual exceptions preserve image paths' tests/naturalist-v400.test.cjs
ATLAS_ART06_SMOKE=1 node scripts/aud01-browser.cjs
```

## Próximo lote recomendado

Priorizar las variantes albinas del pigargo vocinglero de Madagascar, águila culebrera, buitre dorsiblanco, águila marcial, buitre orejudo y nutria de cuello manchado, junto con las melánicas del armiño y la pantera nebulosa. Las ocho constan como insuficientes. En rapaces, evaluar por separado plumas, cera, tarsos e iris, con referencias de pigmentación cuando estén disponibles.
