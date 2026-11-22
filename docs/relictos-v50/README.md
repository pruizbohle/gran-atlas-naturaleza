# El Gran Atlas V5.1.2 · Relictos 5.0

La rama `feat/relictos-5` amplía el gabinete de **9 a 20 relictos** desde `7cd5110`. Las 1.000 fichas del Atlas, las 125 regiones y los 30 legendarios permanecen en sus catálogos. La ampliación reutiliza los nueve identificadores de partida y añade once identificadores exclusivos de Museo. La elegibilidad usa la clave estable de región y distingue sectores que comparten un código cartográfico histórico. [Auditoría previa](auditoria-inicial.md) · [Láminas nuevas, grupo 1](evidencia/laminas-1.jpg) · [Láminas nuevas, grupo 2](evidencia/laminas-2.jpg)

## Inventario y encaje histórico

| Relicto | Identificador | Región y entorno | Situación |
| --- | --- | --- | --- |
| Celacanto del Índico | `coelacanth_indic` · conservado | `HX-10-12`, costa de África sudoriental | Viviente en 1842 y en la actualidad. El encuentro del juego representa fondos rocosos de plataforma. La descripción distingue este encuentro ficticio del registro científico de 1938. [NOAA Fisheries](https://www.fisheries.noaa.gov/species/african-coelacanth) |
| León del Atlas | `atlas_lion` · conservado | `HX-06-08`, montaña y estepa | Población norteafricana histórica, hoy desaparecida en estado silvestre. Asociación con `af_leon`, la ficha general del león. |
| Murciélago de Seychelles | `seychelles_sheathbat` · conservado | `HX-07-14`, bosque de Seychelles | Especie viviente muy amenazada. Su localidad queda acotada dentro del Índico occidental. |
| Cocodrilo enano africano | `gabon_dwarf_croc` · conservado | `HX-08-10`, río, bosque o humedal de Gabón | Especie viviente y vinculada a la ficha `af_xlsx_cocodrilo_enano` ya existente. |
| Tortuga angonoka | `angonoka` · conservado | `HX-09-14`, bosque seco y claros de la bahía de Baly | Especie viviente en situación crítica y distinta de la tortuga radiada del Atlas. |
| Pez pulmonado africano | `african_lungfish` · conservado | `HX-09-11`, humedal de los grandes lagos africanos | Especie viviente, *Protopterus aethiopicus*. |
| Esturión blanco del Pacífico | `white_sturgeon` · conservado | `HX-02-02`, río Fraser | Especie viviente de la costa pacífica norteamericana. |
| Gavial del Ganges | `gharial` · conservado | `HX-05-16`, río de la cuenca del Ganges | Especie viviente en situación crítica. |
| Proteo de las cuevas | `olm_balkans` · conservado | `HX-03-12`, río del karst dinárico | Especie viviente cavernícola. El selector Río representa arroyos subterráneos y el turno regula la búsqueda. Se corrigió la condición anterior de bosque. [Grupo de Especialistas en Anfibios de la UICN](https://www.iucn-amphibians.org/wp-content/uploads/sites/4/2018/11/TAW-Threatened-Species-Profiles_Part5.pdf) |
| Tilacino | `thylacine` · nuevo | `oc_tasmania`, bosque o pradera | Presente en 1842. El último cautivo murió en 1936. [Australian Museum](https://australian.museum/learn/australia-over-time/extinct-animals/the-thylacine/) |
| Alca gigante | `great_auk` · nuevo | `mar_atlantico_septentrional`, archipiélago de Eldey, Islandia | Presente en 1842 y próxima a desaparecer. Los últimos ejemplares documentados allí datan de 1844. [Natural History Museum](https://www.nhm.ac.uk/discover/worlds-collide-great-auk.html) |
| Lobo de las Malvinas | `falkland_wolf` · nuevo | `mar_atlantico_austral`, archipiélago de Malvinas | Presente en 1842, extinto desde 1876. Aunque el hexágono es oceánico, la búsqueda representa los pastizales terrestres del archipiélago. [Falkland Islands Museum](https://falklands-museum.com/the-warrah) |
| Periquito de Carolina | `carolina_parakeet` · nuevo | `HX-03-04`, bosque y humedal del este norteamericano | Presente en 1842. El último cautivo murió en 1918. [Biblioteca de Cornell](https://exhibits.library.cornell.edu/last-call/feature/carolina-parakeet) |
| Huía | `huia` · nuevo | `oc_nueva_zelanda`, bosque del sur de Isla Norte | Ya escaso en 1842 y extinto después. La lámina muestra la hembra de pico curvo. [Te Ara](https://teara.govt.nz/en/photograph/2687/hunted-to-extinction) |
| Foca monje del Caribe | `caribbean_monk_seal` · nuevo | `gm06_antillas`, costas y cayos del Caribe | Presente en 1842. Último registro confirmado en 1952. Se usa *Neomonachus tropicalis*. [Smithsonian Institution](https://www.si.edu/newsdesk/releases/smithsonian-scientists-use-extinct-species-reclassify-world-s-remaining-two-species-monk-se) |
| Pez espátula chino | `chinese_paddlefish` · nuevo | `HX-05-17`, río de la cuenca del Yangtsé | Presente en 1842. La extinción se estima a comienzos del siglo XXI. [Zhang y colaboradores](https://pubmed.ncbi.nlm.nih.gov/31911255/) |
| Pez pulmonado australiano | `australian_lungfish` · nuevo | `oc_costa_nordeste_australiana`, ríos Burnett y Mary | Especie viviente. El hexágono costero representa su localidad fluvial de Queensland. [DCCEEW](https://www.dcceew.gov.au/environment/biodiversity/threatened/conservation-advices/neoceratodus-forsteri) |
| Pez sierra común | `largetooth_sawfish` · nuevo | `HX-04-04`, desembocaduras y estuarios del golfo de México | Especie viviente de presencia histórica en el golfo. Se fija la identidad en *Pristis pristis*, pez sierra de dientes grandes. [NOAA Fisheries](https://www.fisheries.noaa.gov/species/largetooth-sawfish) |
| Solenodonte cubano | `cuban_solenodon` · nuevo | `gm06_antillas`, bosque y selva del oriente de Cuba | Viviente. Se usa *Atopogale cubana*, sinónimo *Solenodon cubanus*, distinto de `gm06_solenodon_paradoxus` en La Española. [Mammal Diversity Database](https://www.mammaldiversity.org/taxon/1003837/) |
| Iguana bandeada de Fiyi | `fiji_banded_iguana` · nuevo | `gm06_melanesia`, bosque y selva de Fiyi oriental | Viviente. La ficha se refiere a *Brachylophus fasciatus*, forma bandeada de Lau. [ITIS](https://itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=202155) |

## Búsqueda y Museo

- Los tres indicios se conservan en el mismo registro de partida. El I revela el hexágono y la localidad, el II revela el bioma y el III revela el turno. Museo muestra el nombre desde el primer indicio y reserva la lámina, el nombre científico y la descripción para el descubrimiento.
- Una prospección documental entrega el siguiente indicio. Archivos de historia natural conserva las dos plazas y la posibilidad de obtener dos indicios consecutivos. Comprar las dos investigaciones de relictos registra un indicio si hay un expediente accesible. Las expediciones científicas a los Balcanes y el Atlántico aportan indicios del proteo y el alca, respectivamente, y el recibo muestra el resultado. Las búsquedas de Campo conservan sus probabilidades anteriores de indicio, incluida la mejora de Rastreo.
- El encuentro exige región, bioma y turno. La tirada del relicto es independiente del resultado ordinario de esa búsqueda. El naturalista usa las condiciones registradas en su cola, con un máximo de **un intento válido por relicto y hora** que se guarda al cerrar. Los indicios reunidos durante una búsqueda se aplican desde la siguiente.
- La ficha completa y su vitrina se desbloquean en el encuentro. El aviso de Campo queda disponible hasta cerrarlo. Los respaldos conservan las posesiones, pistas, vitrinas y prospecciones. Los descubrimientos nuevos registran fecha, método y condiciones. Las posesiones anteriores sin fecha conservan esa condición.
- Se retiró la compra de relictos en Museo con tinta, pergamino y conocimiento. El inventario mantiene sus materiales y las prospecciones y el análisis comparativo conservan las recompensas y los costos propios. Los relictos quedan fuera de los contadores zoológicos.

## Probabilidad determinista

Se barrió una malla uniforme de 10.000 valores para cada nivel en las búsquedas manuales y en las automáticas elegibles. La prueba usó la función de producción. El límite usa horas de reloj. Una sesión de ocho horas que cruza horas parciales puede abarcar hasta nueve tramos.

| Indicios | Probabilidad por intento válido | Hallazgos manuales / 10.000 | Hallazgos automáticos / 10.000 |
| --- | ---: | ---: | ---: |
| 0 | 0,02 % | 2 | 2 |
| 1 | 0,05 % | 5 | 5 |
| 2 | 0,12 % | 12 | 12 |
| 3 | 0,30 % | 30 | 30 |

## Recursos y verificación

Se conservaron los nueve SVG revisados de V3.19.9. Las once láminas nuevas aportan 44 WebP transparentes de 64, 128, 256 y 512 px, con un peso total de 533.586 bytes. El paquete offline suma 132.393.784 bytes, 557.684 más que V5.1.1. Las pruebas cotejan las 6.760 placas previas del Atlas por SHA-256, incluidas las 120 correspondientes a los legendarios. Se comprobaron los veinte encuentros en el motor y el ciclo completo de un tilacino en Chromium. [Pruebas del motor](../../tests/relictos-v50.test.cjs) · [Prueba del juego y el laboratorio en Chromium](../../scripts/relictos-browser.cjs)

La revisión del motor abarca `www/js/app.js`, los presentadores de Campo, Museo y expediciones, y sus hojas de estilo. Los cambios de recursos, caché y laboratorio se generan con `scripts/build-naturalist-lab.cjs` y `scripts/build-naturalist-release.cjs`. El laboratorio también abre desde `/laboratorio-relictos.html` al servir `www`. El APK conserva la infraestructura de compilación anterior. Esta entrega se limita al código de revisión y al laboratorio aislado.

Chromium completó la descarga autorizada y verificó 7.061 recursos mediante el actualizador. Con la red desactivada se reabrieron el juego y el laboratorio, incluida la búsqueda de fichas y las cuatro resoluciones WebP. [Resultados en Chromium](evidencia/navegador.json) · [Aviso en Campo móvil](evidencia/campo-movil.png) · [Ficha en Museo](evidencia/museo-escritorio.png)

Sites confirmó el despliegue del laboratorio aislado. El navegador compartido no abrió la URL autenticada. La revisión visual y sin conexión se realizó en la copia local de la misma galería. [Laboratorio privado](https://el-gran-atlas-visor-pigmentario.muddyroadrunner17.chatgpt.site/laboratorio-relictos.html)

APK de esta entrega: no generado ni firmado.

La versión de referencia registró 652 pruebas aprobadas y 222 fallos. La suite de la candidata registró 657 aprobadas y 223 fallos. El único fallo adicional exigía que el inventario de relictos siguiera siendo idéntico al de 3.38. La prueba se actualizó para comprobar los nueve identificadores originales y seguir exigiendo los mismos costos, ingresos y bonificaciones. Sus tres casos pasaron al repetir el archivo. El resultado combinado es **658 aprobadas y los mismos 222 fallos históricos**. [Resultado de la suite y repetición dirigida](evidencia/regresion.json)
