# El Gran Atlas v3.19.5 — Dimorfismo sexual

Base auditada: `feff3da89526b9cb83e7aceaaa171136a414cfea` (main, 3.19.4).
Configuración original verificada: **24 IDs**, no 24 familias. Resultado: **32 IDs: 24 conservados + 8 incorporados**. El catálogo sigue teniendo 487 especies. No se agregan taxones.

## Auditoría y arquitectura

Se revisaron app.js, motores 3.19.1–3.19.4, index, service worker, pruebas y laboratorios. `sexSpriteMarkup` ya priorizaba aves 3.19.3 y mamíferos 3.19.4; se conserva ese orden. El antiguo fallback no sustituye a estos motores. Cada modificación se aplica sobre la anatomía existente, sin otro motor.

Hallazgos: la paleta femenina universal en aves diluía la identidad específica; la melena de león y el manto de hamadríade no discriminaban sexo; las etiquetas `ibex` de Procapra y Antilope eran erróneas. El indicador de elegibilidad se inicializaba antes de las últimas extensiones: ahora se reconcilia también al terminar la carga completa. Solo se recalcula metadato del catálogo, nunca progreso.

Los 24 originales tienen SVG distintos y utilizan el motor moderno correspondiente en ambos sexos. Ninguno necesita recuperar una ilustración del fallback antiguo. Comparación de cada pareja a 56 px y 120 px en Chromium; diferencias anatómicas o de plumaje visibles. La validez XML y los límites geométricos se comprueban por separado: un SVG diferente por sí solo no constituye aprobación zoológica.

| ID original | Especie | Resultado y rasgos revisados |
|---|---|---|
| asia_esp_0880 | Gallo lira | Cola en lira del macho conservada; hembra barrada con cola corta y paleta propia |
| asia_esp_0441 | Gacela de Mongolia | Corregido `ibex` → `gazelle`; hembra sin cuernos, macho con garganta desarrollada; anatomía de Procapra |
| ciervo_rojo | Ciervo rojo | Astas masculinas conservadas; cuello masculino más voluminoso |
| corzo_europeo | Corzo europeo | Astas cortas propias, hembra sin astas; proporciones conservadas |
| alce | Alce | Astas palmeadas del macho; hembra sin astas ni adorno gular masculino exagerado |
| reno | Reno | Astas conservadas en ambos sexos, menor desarrollo femenino; barba/volumen gular diferenciado |
| ibice_alpino | Íbice alpino | Cuernos femeninos cortos propios, barba masculina; evita reducir todo el macho mediante escala |
| cabra_montes_iberica | Cabra montés ibérica | Cuernos femeninos cortos y curvos; barba y silueta diferenciadas |
| urogallo_comun | Urogallo común | Macho oscuro y cola desplegada; hembra barrada con pecho ocre propio |
| eu_esp_0649 | Pato cuchara europeo | Pico ancho compartido; paleta críptica femenina propia frente a cabeza verde masculina |
| eu_esp_0629 | Pinzón vulgar | Paleta femenina oliva gris; macho con pecho rosado; anatomía y bandas alares conservadas |
| eu_esp_0628 | Mirlo común | Macho negro, pico amarillo; hembra parda con pecho marcado conservada |
| eu_esp_0639 | Camachuelo común | Capucha negra compartida corregida; pecho femenino pardo frente al rosado masculino |
| eu_esp_0638 | Oropéndola europea | Macho amarillo/negro; hembra verdosa conservada |
| asia_esp_0081 | Tur del Cáucaso oriental | Cuernos femeninos cortos; barba masculina; sin plantilla de antílope |
| asia_esp_0149 | Gamo | Astas palmeadas masculinas y hembra sin astas; moteado compartido conservado |
| asia_esp_0080 | Cabra salvaje | Cuernos femeninos cortos y barba masculina; cuerpo propio de Capra aegagrus |
| asia_esp_0410 | Pavo real común | Tren ornamental masculino conservado; hembra con cuello verde y sin tren largo |
| asia_esp_0891 | Pato mandarín | Velas masculinas conservadas; reforzados anillo ocular y línea postocular femeninos |
| asia_esp_0422 | Faisán común | Cabeza/cola masculinas conservadas; paleta críptica propia de la hembra |
| asia_esp_0124 | Faisán dorado | Cresta y esclavina masculinas conservadas; hembra barrada con cola más corta |
| asia_esp_0296 | Faisán plateado | Macho plateado con cresta; hembra parda específica, cola y marcas propias |
| asia_esp_0833 | Antílope negro | Corregido `ibex` → `blackbuck`; macho adulto oscuro con espirales, hembra leonada normalmente sin cuernos |
| asia_esp_0111 | Ciervo sika | Astas y cuello masculinos, hembra sin astas; moteado compartido |

Las diferencias de proporciones son secundarias; no justifican por sí solas ninguna incorporación. Los colores usan la paleta del Atlas, sin pretender reproducir iridiscencia física. Las láminas representan adultos de referencia, no todos los estados estacionales o variaciones individuales.

## Nuevas incorporaciones y fuentes consultadas

Consulta: 2026-11-07. Resúmenes de desarrollo, sin citas textuales ni referencias extensas dentro del juego.

| ID / especie | Diferencia confirmada y decisión artística | Fuente |
|---|---|---|
| af_leon / Panthera leo | Melena y cuello del macho adulto; leona sin melena, rostro y silueta esbeltos. Se conserva pelaje leonado compartido. Melena variable entre individuos y edades. | [San Diego Zoo Wildlife Alliance, características](https://ielc.libguides.com/sdzg/factsheets/lions/characteristics) |
| af_mandril / Mandrillus sphinx | Rostro masculino con azul y rojo intensos, relieve y cráneo robusto; hembra con rostro menos desarrollado y tonos discretos, sin eliminar toda coloración. | [Animal Diversity Web](https://animaldiversity.org/accounts/Mandrillus_sphinx/), [Setchell et al., coloración femenina](https://pmc.ncbi.nlm.nih.gov/articles/PMC1636084/) |
| af_babuino_hamadryas / Papio hamadryas | Macho adulto gris plateado con manto de hombros; hembra parda sin ese manto. Se mantiene el hocico de babuino. | [Animal Diversity Web](https://animaldiversity.org/accounts/Papio_hamadryas/) |
| af_gelada / Theropithecus gelada | Manto adulto masculino desarrollado en hombros; hembra sin él. Mancha pectoral en ambos sexos, sin usarla como rasgo exclusivo masculino ni fijar un estado reproductivo. | [SDZWA, características físicas](https://ielc.libguides.com/sdzg/factsheets/gelada/characteristics-page) |
| asia_esp_0294 / Lophophorus impejanus | Macho multicolor con cresta verde y cola castaña; hembra críptica con garganta clara y marcas alares. | [Bird Conservation Nepal](https://www.birdlifenepal.org/birds/view/14) |
| asia_esp_0864 / Lophophorus lhuysii | Macho con cresta púrpura caída y cola verde azulada; hembra más oscura con garganta blanca. No se copia la pareja del monal del Himalaya. | [Avibase, identificación y taxonomía](https://avibase.bsc-eoc.org/species.jsp?avibaseid=583D3E979D655290&lang=EN) (su reseña descriptiva es secundaria) |
| asia_esp_0865 / Tragopan satyra | Macho rojizo moteado con piel facial azul; hembra críptica parda. Sin cuernos carnosos ni babero desplegados permanentemente. | [Animal Diversity Web](https://animaldiversity.org/accounts/Tragopan_satyra/), [Bird Conservation Nepal](https://birdlifenepal.org/birds/view/17) |
| af_avestruz / Struthio camelus | Contraste negro/blanco masculino frente a gris/pardo femenino; ala femenina atenuada. Diferencia cromática documentada suficiente, sin inventar nueva anatomía. | [Toronto Zoo](https://www.torontozoo.com/animals/Ostrich), [MNHN](https://www.mnhn.fr/en/ostrich) |

Correcciones zoológicas originales contrastadas con [Procapra, ADW](https://animaldiversity.org/accounts/Procapra_gutturosa/), [antílope negro, MNHN](https://www.mnhn.fr/en/blackbuck), [reno, Alaska Department of Fish and Game](https://www.adfg.alaska.gov/index.cfm?adfg=caribouidentification.main). Las hembras de reno pueden tener astas; su desarrollo y calendario no son universales. Las hembras de antílope negro son normalmente, no invariablemente, acornes.

## Candidatas aplazadas

No se afirma que carezcan de dimorfismo. Se priorizaron ocho parejas completas en lugar de activar registros con arte sin terminar.

- Gorilas occidental y de montaña: aplazados hasta resolver explícitamente el adulto maduro de dorso plateado frente a macho todavía joven, y sus proporciones femeninas.
- Gran kudú, niala común y nyala de montaña: requieren cuernos y ornamentos específicos, además de dos parejas diferenciadas de nialas. No activar mediante un antílope genérico.
- Impala, saiga y gerenuc: aplazados; necesitan revisión de cuernos, nariz del saiga y cuello singular del gerenuc en ambos sexos. No se modifica su anatomía general.
- Antílope sable: aplazado; ambos sexos deben conservar cuernos y necesitan coloración y curvatura diferenciadas.
- Faisán cobrizo: aplazado hasta desarrollar cola, plumaje y hembra específicos con comprobación visual propia.
- Pavo verde: aplazado; la hembra conserva verde y no debe heredar sin revisión la hembra del pavo real común.
- Camaleón de Jackson: aplazado por variación de cuernos entre poblaciones/subespecies; el catálogo no resuelve aquí esa selección morfológica.
- Camaleón pantera y agama común: aplazados hasta definir una referencia adulta de población/estado fisiológico. No se fija color reproductivo como aspecto constante universal.
- Faisanes dorado y plateado, y antílope negro: ya estaban entre los 24 originales; revisados, no duplicados.

## Compatibilidad, pruebas y reproducción

`state.sexSeen`, `state.dimorphism`, `SEXUAL_DIMORPHISM`, IDs y formato de guardado permanecen. Migración de completados históricos intacta. Las ocho incorporaciones comienzan en 0/2 sin observaciones; no se inventa progreso. Se conserva el requisito de diez alimentaciones O ambos sexos y no se recalculan etapas publicadas.

`recordSexObservation`, distribución 50/50, probabilidades manuales/automáticas, mejoras de Etología y recompensas no se modificaron. Tampoco exploración, economía, rarezas, regiones, expediciones, museo, inventario, investigaciones ni variantes. Los sprites base sin sexo y las variantes se conservan; las correcciones sexuales se solicitan solo para normal. No se implementan combinaciones nuevas de sexo/variante.

- `node --test tests/*.test.cjs`: 150 pruebas aprobadas, cero fallos, cero omitidas.
- Nuevas pruebas: 32 IDs válidos, conservación de 24 originales, catálogo intacto salvo elegibilidad, 64 SVG, rasgos específicos, prioridad de variantes, 0/1/2, registros históricos, requisito alternativo y límites exactos de Etología/manual/automático.
- Pruebas históricas actualizadas únicamente en expectativas de versión, nuevos metadatos permitidos y snapshot del motor de aves modificado. Se conserva una instantánea genuina del catálogo 3.19.4 para verificar todos los campos de juego.
- `node scripts/build-dimorphism-lab.cjs --check`: extracción reproducible del catálogo completo y router de producción. No inicia el juego ni accede al almacenamiento. Regenerar al cambiar app.js.
- `node scripts/check-dimorphism-browser.cjs`: integración opcional con Playwright/Chromium y servidor en localhost:8000; XML, geometría, tamaños, filtros, aislamiento de almacenamiento, Cuaderno y recarga offline.
- Laboratorio independiente con contador 24 + 8 = 32, búsqueda, colores/siluetas, filtros y tamaños 56/80/120. El contador de problemas detecta defectos técnicos; no sustituye la auditoría zoológica anterior.

No se modificó `.github/workflows/deploy.yml`: Deploy El Gran Atlas ejecuta la suite antes de subir y publicar Pages. El resultado remoto y SHA final se informan en la entrega.
