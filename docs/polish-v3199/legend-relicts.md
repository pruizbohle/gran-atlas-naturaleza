# Revisión individual: 12 Legendarios y 9 relictos

Se mantienen los doce identificadores legendarios del motor `legendary-art-v3197.js`. Sus rutas se reconstruyen, sin transformar sprites normales ni tocar descubrimientos, probabilidades, halos o emblemas. `relict-art-v3199.js` reúne nueve láminas zoológicas específicas y expone `ATLAS_RELICT_ART.render(id)` y `renderRelictArt(id)`; devuelve una cadena vacía para IDs ajenos. Ambos módulos funcionan aislados en Node y navegador.

La referencia anterior es el commit `bacffc91dc39fecfbba850f0d4bcfc10ba36398f` (producción 3.19.8). Se revisaron visualmente las 21 parejas antes/después a 56, 80 y 120 px, con fondo claro, fondo oscuro y silueta. La comparación usa directamente los motores de producción actuales y las funciones anteriores obtenidas del commit de referencia. No se utilizan ilustraciones exclusivas del laboratorio.

[Lámina antes/después a 120 px](legend-relicts-comparison.png) · [Lámina a 56 px](legend-relicts-56.png) · [Informe geométrico](legend-relicts-report.json).

## Legendarios

| Individuo / especie | Familia | Problema anterior | Corrección aplicada | Resultado inspeccionado |
| --- | --- | --- | --- | --- |
| Silverback / gorila de montaña | Hominidae | Brazos en bloques, dedos sin apoyo claro y parche plateado frontal | Hombros curvos; antebrazos con volumen y manos sobre nudillos; gris en el dorso lateral, pecho oscuro y rostro más continuo | Postura robusta y apoyada; plateado no confundido con el pecho |
| Ámbar / tigre | Felidae | Patas como cuñas rectas, cráneo y orejas triangulares; hocico canino | Musculatura y patas superpuestas con corvejones; cara ancha de tres cuartos, orejas redondeadas, hocico felino bilobulado corto y rayas sobre el volumen | Fisonomía felina y cuatro miembros diferenciados; se corrigió otra vez el hocico tras revisar la primera versión |
| Niebla / leopardo de las nieves | Felidae | Cara puntiaguda, extremidades rectas y cola pesada sin un cuerpo equilibrado | Cráneo y orejas redondeados, mofletes y nariz central; miembros articulados, rosetas distribuidas por flancos y cola continua gruesa | Rostro distinguible de zorro; cola y patas legibles a 56 px |
| Fenrir / lobo | Canidae | Cuñas corporales, patas sin articulaciones y cola puntiaguda rígida | Tórax más profundo, rodillas/corvejones, almohadillas, frente y hocico propios de un cánido; cola peluda conectada al anca | Silueta canina reconocible sin color y postura estable |
| Atlas / elefante | Elephantidae | Patas rectangulares, oreja y trompa segmentadas | Miembros lejanos y cercanos superpuestos, oreja con pliegue, trompa de curvas continuas y dos colmillos acotados | Mejor lectura de peso, apoyo y trompa; anatomía sin apéndices flotantes |
| Centinela / águila | Accipitridae | Pico demasiado angular, alas como triángulos y tarsos poco integrados | Perfil de cráneo y pico ganchudo suave; alas curvas con primarias apoyadas en la base; tarsos y garras diferenciados | Ave posada coherente, conservando su identidad y plumaje dorado |
| Basalto / dragón de Komodo | Varanidae | Miembros lejanos parecían alas; torso corto y cuello poco definido | Tronco alargado, cuello muscular hacia cabeza baja, miembros splayados debajo del lomo, dedos y cola gruesa continua | Morfología de varano; se revisó por segunda vez longitud y posición de las patas tras la comparación |
| Seda / cobra | Elapidae | Transición de cuello a espiras fragmentada y capucha angular | Capucha bilateral de curvas suaves, cuello conectado a dos espiras y escamas ventrales discretas | Cuerpo continuo y capucha simétrica, sin efectos mágicos |
| Junco / cocodrilo | Crocodylidae | Cuerpo triangular, miembros unidos como trazos y escudos genéricos | Lomo arqueado, hocico con mandíbula continua, patas volumétricas flexionadas con dedos y cola cónica ancha en su inserción | Crocodiliano rasante de apoyos diferenciados |
| Áncora / tortuga gigante | Testudinidae | Extremidades triangulares, cuello como pieza separada y escudos planos | Pies macizos curvos, cuello continuo, caparazón abovedado y escudos que siguen su curvatura | Peso y volumen de tortuga terrestre, conservando cuello extendido |
| Ascua / zorro rojo | Canidae | Torso en rombo y patas pegadas | Cuerpo sentado curvo, extremidades cercanas articuladas, hocico afinado, babero integrado y cola voluminosa que envuelve al cuerpo | Silueta sentada expresiva con orejas y cola propias de zorro |
| Remonte / salmón rosado | Salmonidae | Forma fusiforme genérica, cola y aletas poco integradas | Lomo de macho de `Oncorhynchus gorbuscha`, mandíbula inferior ganchuda, opérculo curvo, dorsal/adiposa y aletas ventrales con base corporal | Salmón en remonte identificable por proporción, no solo por manchas |

Basalto se confirmó por su especie asociada: `asia_esp_0527`, *Varanus komodoensis*. Remonte corresponde a `asia_esp_0369`, *Oncorhynchus gorbuscha*. No se cambiaron esas asociaciones.

## Relictos

| Relicto / especie | Familia | Problema anterior | Corrección aplicada | Resultado inspeccionado |
| --- | --- | --- | --- | --- |
| Celacanto del Índico / *Latimeria chalumnae* | Latimeriidae | Pez convencional con cola bifurcada y aletas triangulares | Cuerpo profundo, cola trilobulada, aletas pares lobuladas de pedúnculos carnosos, dorsal posterior y moteado | Se separa claramente de peces convencionales por su silueta |
| León del Atlas / *Panthera leo leo* | Felidae | Cuerpo elíptico, patas en trazos y cara pentagonal | Tronco curvo, hombros y cuatro patas con volumen, melena adulta, rostro y hocico felino, cola larga con borla | León adulto reconocible, con continuidad entre melena y cuello |
| Murciélago de Seychelles / *Coleura seychellensis* | Emballonuridae | Membrana en dos polígonos sin estructura de extremidades | Contorno membranoso curvo, antebrazos, dedos radiales, pulgares, orejas y uropatagio | Alas sostenidas por anatomía; cabeza sin ojos sobredimensionados |
| Cocodrilo enano / *Osteolaemus tetraspis* | Crocodylidae | Silueta fusiforme, hocico sin estructura y patas lineales | Cuerpo robusto corto, cabeza ancha, mandíbula, cuatro apoyos sugeridos por superposición, escudos y cola continua | Cuerpo compacto y hocico distinto del gavial |
| Angonoka / *Astrochelys yniphora* | Testudinidae | Semicírculo de caparazón con escudos aislados | Caparazón alto, escudos curvos con radios oscuros, patas escamosas macizas, cuello y proyección gular | Tortuga abovedada con identidad propia frente a Áncora |
| Pez pulmonado / *Protopterus aethiopicus* | Protopteridae | Silueta de pez típico, cola bifurcada y dorsal triangular | Cabeza roma, cuerpo alargado, aleta mediana continua y aletas pares filamentosas | Morfología de pez pulmonado legible, sin plantilla de pez convencional |
| Esturión blanco / *Acipenser transmontanus* | Acipenseridae | Escudos como picos dorsales gigantes y cola simétrica | Hocico largo, boca inferior/barbillones, pequeños escudos seriados, dorsal posterior y cola heterocerca de lóbulo superior alargado | Esturión identificable por cabeza, escudos y cola; se corrigió la primera cola después de renderizar |
| Gavial / *Gavialis gangeticus* | Gavialidae | Hocico rectangular grueso y cuerpo sin patas articuladas | Rostro muy largo y estrecho, mandíbula continua, tronco curvo, dedos y extremidades splayadas | Diferencia clara respecto al cocodrilo enano aun en silueta |
| Proteo / *Proteus anguinus* | Proteidae | Cuerpo ancho en zigzag, patas rígidas y branquias como púas | Cuerpo pálido alargado con pliegue caudal, cuatro extremidades pequeñas, ramificación de branquias externas y ojo reducido | Anfibio acuático cavernícola, sin perfil de lagarto terrestre |

## Segunda revisión y límites

La primera comparación detectó cuatro problemas que se corrigieron antes de cerrar: plateado frontal de Silverback, perfiles caninos en los dos félidos, extremidades elevadas de Basalto y caudal insuficientemente heterocerca en el esturión. Las láminas adjuntas reflejan las correcciones finales. No se marca ninguna de estas 21 ilustraciones como pendiente de implementación o sin inspección visual; la apreciación artística puede seguir revisándose desde el laboratorio comparativo.

## Verificación reproducible

- `node --test tests/legend-relicts-v3199.test.cjs`: identidades exactas, 21 geometrías diferentes del estado anterior incluso eliminando toda la pintura, dibujos distintos por ID, caché determinista, ausencia de recursos externos/filtros/animaciones, salida válida y ejecución sin `window`.
- `NODE_PATH=/workspace/atlas-tools/node_modules node scripts/review-legend-relicts-v3199.cjs`: renderiza los 21 casos a 56/80/120 y fondo oscuro/silueta; cada SVG parsea como XML, no contiene IDs duplicados y su geometría está dentro de `viewBox="0 0 100 100"`.
- Pruebas existentes de Legendarios: se ejecutó `tests/specials-v3197.test.cjs`, incluidas aparición única, probabilidades absolutas, geometría de categorías, persistencia y migración. La prueba de arquitectura offline corresponde a la integración global que realiza la versión 3.19.9.

Los módulos solo contienen primitivas vectoriales y una caché de resultados; no leen ni modifican partidas. Los cambios de integración, service worker, versión y despliegue quedan en la revisión global de v3.19.9.
