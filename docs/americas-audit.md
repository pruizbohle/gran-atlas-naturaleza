# AM-01 · Auditoría de fauna y preparación de las Américas

**Estado: análisis terminado; integración no iniciada.** Referencia del juego: 3.21.2, commit `07a6f06cfea22daa573b8a841fca6b2c603bba93`. El usuario confirmó usar el Excel previamente adjuntado, `Atlas_Fauna_Hexagonal_209_900_Especies.xlsx`, en lugar de exigir una copia con sufijo `(3)`. Su SHA-256 es `5cd22412e6b251d8f02a90e4c8303e02946d5e5d26855589d2c6750649fe4350`.

Se han añadido documentos y herramientas de lectura. El catálogo, mapa, sprites, rarezas, probabilidades, economía, investigaciones, Museo, expediciones, guardados y versión jugable permanecen sin cambios. No se ha generado arte nuevo ni importado ninguna especie.

[Especies: 250 filas](americas-species-audit.csv) · [Regiones: 24 filas](americas-regions-audit.csv) · [Plan AM-02 a AM-06](americas-implementation-plan.md) · [Presencias originales: 398 filas](americas-audit/source-presences.csv) · [Incidencias: 72](americas-audit/issues.csv) · [Resumen verificable](americas-audit/source-and-summary.json)

## Resumen ejecutivo

| Medida | Norteamérica | Sudamérica | Unión de ambas |
| --- | ---: | ---: | ---: |
| Regiones del Excel | 14 | 10 | 24 |
| Registros especie × región | 206 | 192 | 398 |
| Nombres científicos distintos en la fuente | 129 | 131 | **250** |
| Identidades de planificación tras agrupar un sinónimo | 128 | 131 | **249, provisional** |
| Identidades ya presentes en el catálogo del juego | 26 | 1 | **26** |
| Identidades sin ID actual, antes de ampliar ningún continente | 102 | 130 | **223, condicionadas a revisión** |
| De ellas, con duda taxonómica bloqueante | 2 | 12 | **14** |
| Regiones funcionales pendientes | **12** | **10** | **22** |

La fuente tiene diez nombres científicos compartidos entre las dos Américas. Sudamérica ya puede reutilizar el ID del puma. Las otras nueve identidades compartidas todavía no existen; se crearían una sola vez. Si se implementa primero Norteamérica, AM-02 prepararía 102 identidades y AM-04 otras **121**, no 130 adicionales. La proyección máxima bajo estas decisiones sería 487 + 223 = **710 entradas de catálogo** y 57 + 22 = **79 regiones funcionales**; no es una cifra taxonómica aprobada ni una ampliación realizada.

Las 398 presencias originales se conservan individualmente, con hoja, número de fila, ID de especie e ID de hexágono de la fuente. Las dos regiones funcionales actuales ya contienen las 28 presencias esperadas (17 + 11); las siguientes fases integrarían **178 presencias norteamericanas y 192 sudamericanas**, sin eliminar registros marcados para revisión.

### Categorías por nombre científico de la fuente

| Categoría | Número | Interpretación |
| --- | ---: | --- |
| A · Existente y reutilizable | 19 | Misma identidad taxonómica; reutilizar ID y progreso. No implica aprobación artística definitiva. |
| B · Existente con diferencias | 7 | Cinco diferencias de rareza, una de clasificación y una de nombre ambiguo. |
| C · Nueva | 209 | No hay ID del mismo taxón en el catálogo final. |
| D · Duplicado o sinónimo | 1 | `Pecari tajacu`, agrupado para planificar con `Dicotyles tajacu`. |
| E · Requiere revisión | 14 | Concepto o delimitación taxonómica pendiente; sin alta aprobada. |
| Total | **250** | La suma corresponde a nombres de fuente, no a 250 altas. |

Las 223 identidades pendientes incluyen 209 C y 14 E. La agrupación D reduce una identidad de planificación; no suprime ninguna presencia del Excel y no fusiona IDs del juego.

## Fuente, método y límites

Se leyeron **las seis hojas**: Resumen, Mapa, Hexágonos, Fauna, Catálogo especies y Metodología y fuentes. El recuento real completo es 209 hexágonos, 1.574 presencias y 900 entradas/nombres científicos del catálogo. Las filas vacías con formato no son especies: Catálogo especies ocupa físicamente 1.041 filas, pero contiene 900 registros útiles; Fauna ocupa 1.778 filas y contiene 1.574 registros útiles. El Resumen coincide con los datos contados.

- **Resumen:** cifras generales, desglose continental y rarezas contrastados con las tablas de datos.
- **Mapa:** inspeccionadas las 209 casillas y sus rótulos/cantidades; se conserva como referencia histórica, sin copiar su disposición.
- **Hexágonos:** IDs, nombres, continentes, biomas, riqueza y cantidades cotejados con Fauna. Sus centros X/Y y fila/columna no son coordenadas obligatorias del juego.
- **Fauna:** todas las presencias examinadas para integridad referencial y las 398 americanas exportadas sin pérdida de atributos.
- **Catálogo especies:** 900 IDs/nombres y sus recuentos de presencia cotejados con Fauna; se revisó la coincidencia americana y se preservaron los IDs de origen.
- **Metodología y fuentes:** advierte expresamente que las consultas GBIF están **sin validar**, la distribución es ilustrativa y la rareza es lúdica, no UICN. [Notas y celdas relevantes](americas-audit/workbook-notes.json).

El catálogo del juego se obtuvo **ejecutando toda la inicialización** en una VM aislada, después de los `Object.assign`, eliminaciones, alias y parches de taxonomía, hábitats y color. Resultado: **487 especies y 57 regiones**. No se tomaron únicamente los literales iniciales. Se registraron motores SVG, variantes y `SEXUAL_DIMORPHISM`, y se generaron hashes de los dibujos existentes, sin guardar sprites nuevos. [Snapshot de las 487 entradas](americas-audit/game-catalog-snapshot.csv).

Se comparan nombres científicos completos normalizando mayúsculas, Unicode y espacios. Se preserva la grafía original. No se fusionan especies por nombre común, por compartir género ni truncando automáticamente subespecies a dos palabras. Las combinaciones alternativas se registran explícitamente. Los IDs fuente `ESP-*` identifican filas de la planilla; no sustituyen los IDs actuales del juego.

**Alcance científico:** se realizó un cribado taxonómico y biogeográfico razonado, no una validación externa de ocurrencias. No se consultaron registros georreferenciados ni se resolvió una autoridad taxonómica actualizada. Las familias zoológicas, subáreas, posiciones conceptuales y bases artísticas están etiquetadas como referencias manuales de planificación, no como columnas del Excel. Una búsqueda GBIF enlazada no acredita una identificación o presencia. Los casos pendientes deben resolverse antes de sus altas; una fila sin alerta significa «sin contradicción evidente en este cribado», no «presencia científicamente certificada».

## Identidad, duplicados y diferencias

### El pecarí de collar no debe convertirse en dos especies

`ESP-0411 / Pecari tajacu` aparece una vez, en Sonora. `ESP-0167 / Dicotyles tajacu` aparece cuatro veces, en Yucatán, Caribe sudamericano, Amazonía y Pantanal. Se propone un grupo de identidad `Dicotyles tajacu` con **cinco presencias** y ambos IDs de origen. La autoridad elegida en la siguiente fase deberá confirmar la combinación aceptada. El origen de cada registro permanece recuperable.

No hay duplicados exactos especie × región en Fauna. Que un taxón figure en varias regiones constituye distribución compartida, no un registro que deba borrarse. Los nombres compartidos entre continentes son `Ara macao`, `Bradypus variegatus`, `Caracara plancus`, `Ctenosaura similis`, `Dicotyles tajacu`, `Myrmecophaga tridactyla`, `Odocoileus virginianus`, `Panthera onca`, `Pelecanus occidentalis` y `Puma concolor`.

### Reutilización de las regiones piloto

Alaska y Columbia Británica coinciden exactamente con el Excel: 17 y 11 presencias, respectivamente, y **24 identidades distintas** entre ambas. Se preservan los IDs `HX-01-05` y `HX-02-02`, todos sus IDs de especie y el progreso. Otras dos especies americanas ya existen fuera de esos pilotos: `Lagopus lagopus` como `eu_esp_0267` y `Pandion haliaetus` como `af_xlsx_131_pandion_haliaetus`. Los prefijos europeos o africanos de esos IDs no justifican duplicarlos.

Sudamérica reutilizará **`na_esp_puma_concolor`**: el prefijo norteamericano no obliga a crear otro puma. `Cervus canadensis` no se fusiona con `Cervus elaphus`; `Bison bison` con `Bison bonasus`; `Perca flavescens` con `Perca fluviatilis`; ni los tapires americanos con `Tapirus indicus`.

### Diferencias existentes: registrar, conservar y decidir después

| Especie | Rareza en Excel | Rareza actual |
| --- | --- | --- |
| Alces alces | Común | Poco común |
| Canis lupus | Común | Raro |
| Gulo gulo | Común | Raro |
| Pandion haliaetus | Común | Poco común |
| Ursus arctos | Común | Poco común |

Estas cinco rarezas actuales se mantienen. El cambio de género gramatical **Muy raro → Muy rara** representa la misma categoría, pero es necesario normalizarlo al preparar datos: `rarityWeight` solo reconoce `Muy rara`; importar literalmente `Muy raro` caería en el valor por defecto y alteraría encuentros. No debe ejecutarse un ajuste de probabilidades como efecto lateral de importar texto.

La fuente también sitúa al ajolote en Ranas y sapos y al tecolote enano en Aves terrestres. Se documentan como clasificación de origen a revisar: el primero es un caudado y el segundo un estrígido. La clase propuesta se registra separadamente del grupo de la fuente.

Las otras dos B son `Aquila chrysaetos`, cuya clasificación interna actual es Aves terrestres frente a Rapaces en la fuente, y `Lagopus lagopus`, llamado Perdiz nival en el Excel pero Lagópodo común en el juego. Este último **no es `perdiz_nival`**, que identifica `Lagopus muta`. Reno/Caribú son nombres comunes compatibles de `Rangifer tarandus`; no requieren dos identidades.

### Catorce conceptos que exigen revisión

| Nombre en la fuente | Decisión necesaria antes de importar |
| --- | --- |
| `Pudu mephistophiles` | Revisar Pudella mephistophiles y delimitaciones recientes del pudú del norte; no mezclar con Pudu puda ni asignar el mismo ID por nombre común. |
| `Leopardus colocola` | Complejo de gatos de las pampas: tratamientos divididos cambian el alcance de colocola, pajeros, munoai y braccatus. La presencia en Pampas/Patagonia depende de la autoridad elegida. |
| `Leopardus tigrinus` | Complejo de tigrillos: revisar delimitación frente a L. guttulus y L. pardinoides, en especial Andes del Norte; no fusionar con L. wiedii. |
| `Mazama americana` | Complejo de venados colorados; fijar autoridad y alcance regional antes de asignar una identidad definitiva. |
| `Saimiri sciureus` | Complejo de monos ardilla; verificar los límites de sciureus frente a otros Saimiri en Caribe y Amazonía. |
| `Cyclopes didactylus` | Las revisiones de Cyclopes separan varios taxones; el binomio original no garantiza cobertura de toda Amazonía. |
| `Inia boliviensis` | Tratamientos como especie o como taxón de Inia geoffrensis; resolver conjuntamente con geoffrensis y limitar a la cuenca correspondiente. |
| `Inia geoffrensis` | Resolver con Inia boliviensis el criterio de especie/subespecie para impedir dos IDs que contabilicen el mismo taxón en una misma localidad. |
| `Electrophorus electricus` | Revisar la delimitación frente a E. voltai y E. varii; la denominación histórica amplia no debe extenderse automáticamente a toda Amazonía. |
| `Dasypus novemcinctus` | Complejo con revisiones recientes, incluido el tratamiento de poblaciones mesoamericanas; fijar autoridad antes de convertir sus dos presencias norteamericanas. |
| `Dasypus hybridus` | Revisar el tratamiento de hybridus frente a D. septemcinctus; conservar la fila de Pampas durante la decisión. |
| `Conepatus humboldtii` | Revisar el tratamiento frente a C. chinga y el alcance patagónico según la autoridad elegida. |
| `Spilogale gracilis` | Complejo de zorrillos occidentales; las presencias Costa del Pacífico/Sonora pueden corresponder a delimitaciones diferentes. |
| `Arapaima gigas` | Revisar el alcance de gigas frente a otras especies descritas de Arapaima; conservar el concepto de la fuente hasta la revisión. |

Además se anotan combinaciones alternativas conocidas para `Herpailurus/Puma yagouaroundi`, `Falcipennis/Canachites canadensis` y `Lithobates/Rana`, sin crear nuevos taxones por el cambio de género. Adoptar otro tratamiento de alces o caribúes requeriría una decisión explícita de autoridad; no se divide el progreso existente en AM-01.

## Inventario de regiones y cartografía conceptual

Todas las regiones incluyen en el CSV bioma de origen, hábitats actuales/propuestos, cantidad de presencias, especies compartidas, estado, ID propuesto, incidencias y centro geográfico conceptual. **Latitud y longitud son aproximaciones del autor para ubicar una región amplia; no son ocurrencias ni coordenadas de celdas.** No se asignan q/r, no se construye malla y no se mueve ninguna región.

| Región | Hexágono de origen | Presencias | Estado funcional | Posición conceptual sugerida |
| --- | --- | ---: | --- | --- |
| Alaska | HX-01-05 | 17 | Funcional; conservar | extremo noroeste |
| Columbia Británica | HX-02-02 | 11 | Funcional; conservar | oeste, bajo Alaska/Yukón; incluye Vancouver |
| Bosques boreales de Canadá | HX-02-03 | 13 | Pendiente | franja norte central |
| Montañas Rocosas | HX-02-04 | 16 | Pendiente | cordillera occidental interior |
| Grandes Llanuras | HX-02-05 | 15 | Pendiente | centro, al este de Rocosas |
| Yukón | HX-02-06 | 14 | Pendiente | noroeste interior, junto a Alaska |
| Región de los Grandes Lagos | HX-03-02 | 17 | Pendiente | centro oriental |
| Costa del Pacífico | HX-03-03 | 14 | Pendiente | borde occidental, bajo Columbia |
| Bosques del este norteamericano | HX-03-04 | 17 | Pendiente | este continental |
| Desierto de Sonora | HX-03-05 | 13 | Pendiente | suroeste, frontera EEUU/México |
| Sierra Madre | HX-04-02 | 11 | Pendiente | sur interior mexicano |
| Península de Yucatán | HX-04-03 | 15 | Pendiente | saliente sureste; Cozumel como subárea |
| Costa del golfo de México | HX-04-04 | 11 | Pendiente | costa sureste, sobre Yucatán |
| América Central | HX-05-04 | 22 | Pendiente | estrechamiento sur de Norteamérica |
| Caribe sudamericano | HX-05-05 | 18 | Pendiente | franja norte costera |
| Llanos del Orinoco | HX-06-04 | 11 | Pendiente | norte interior, al este de Andes |
| Andes Centrales | HX-06-05 | 11 | Pendiente | oeste central y altoandino |
| Andes del Norte | HX-06-06 | 16 | Pendiente | noroeste cordillerano |
| Amazonía | HX-06-07 | 41 | Pendiente | gran interior norte y este de Andes |
| Pantanal | HX-07-05 | 26 | Pendiente | centro sur, cuenca Paraguay |
| Cerrado brasileño | HX-07-06 | 17 | Pendiente | centro oriental, al este del Pantanal |
| Pampas | HX-08-05 | 22 | Pendiente | sureste templado |
| Desierto de Atacama | HX-08-06 | 10 | Pendiente | costa occidental árida; precisar si incluye altiplano |
| Patagonia y Tierra del Fuego | HX-09-05 | 20 | Pendiente | extremo sur estrecho, bosque y ambas costas |

Las doce celdas norteamericanas que hoy son contexto cartográfico no equivalen a regiones funcionales. Sudamérica figura en el selector como continente no implementado y no tiene regiones jugables. Su mera presencia en esa lista no significa que ya esté incorporada.

**Colisión bloqueante: Amazonía.** La fuente usa `HX-06-07`; en producción ese ID pertenece a **Desierto del Sáhara, África**. No copiarlo a `REGIONS`, cambiarle el continente ni renombrar el ID existente. Se propone `sa_amazonia` como identidad nueva y `sourceHexId: HX-06-07` como procedencia. El CSV propone IDs semánticos para Sudamérica y conserva los IDs actuales africanos. Las otras regiones nuevas se contrastaron contra todos los IDs funcionales del juego.

Los hábitats propuestos pertenecen al vocabulario actual y no exceden cuatro por región. Son decisiones de planificación. El bioma genérico de la fuente **no es una lista de hábitats de cada animal** y no permite inferir horarios o estaciones. El siguiente importador deberá definir la ecología por especie y demostrar que cada presencia queda accesible en al menos una combinación válida.

## Distribución: 38 alertas trazables

El registro de incidencias conserva fila, especie, región, motivo y severidad. No se elimina ni reasigna fauna en esta fase. Siete alertas prioritarias del cribado son:

1. Ajolote mexicano en Sierra Madre con bioma de bosque de coníferas: precisar el sistema lacustre de Xochimilco.
2. `Phyllobates terribilis` en Andes del Norte: contrastar selvas bajas del Pacífico con bosque nublado montano.
3. `Primolius couloni` en Andes del Norte: revisar región y vertiente respecto de su ámbito peruano/boliviano/brasileño.
4. `Colossoma macropomum` en Pantanal: separar presencia nativa de cultivo o introducción en cuenca del Paraguay.
5. `Gopherus agassizii` en Sonora: comprobar delimitación frente a `G. morafkai`.
6. Zorro de Darwin en Patagonia/Tierra del Fuego: precisar bosques templados del ámbito norteño; no generalizar a todo el extremo sur.
7. Degú en Atacama: revisar la extensión hacia el norte chico/matorral, sin asumir el núcleo hiperárido.

También deben precisarse Vancouver para su marmota; Cozumel para `Procyon pygmaeus`; cuencas de Inia y Electrophorus; ámbitos de monos amazónicos; salares y puna para flamencos/vicuña en Atacama; litoral rocoso para `Microlophus atacamensis` y `Lontra felina`; y bosques húmedos para pudú y ranita de Darwin. Estas subáreas no exigen automáticamente hexágonos adicionales. La revisión puede conservar una región amplia documentando subhábitats, o proponer una reasignación respaldada; debe guardar siempre la relación original y su decisión.

## Auditoría artística

Las columnas artísticas cubren las 250 denominaciones de fuente; el trabajo se cuenta por **249 identidades de planificación**. Las rutas se consultan en los cuatro motores actuales y en `spriteFor` para especies existentes. Un clasificador que devuelve una familia visual no garantiza una lámina específica correcta; una ausencia de coincidencia tampoco implica escribir un motor completo desde cero.

| Trabajo estimado por identidad | Norteamérica | Sudamérica | Unión sin repetir compartidas |
| --- | ---: | ---: | ---: |
| Reutilizar dibujo existente | 25 | 1 | 25 |
| Revisar dibujo existente | 1 | 0 | 1 |
| Adaptar base compatible, clasificador, morfología y paleta | 59 | 59 | **114** |
| Crear perfil anatómico específico nuevo | 43 | 71 | **109** |
| Total | 128 | 131 | 249 |

**Estimación editorial, no 109 motores nuevos ni 109 familias nuevas.** Cada cifra cuenta especies que necesitan trabajo; varias pueden compartir una nueva base. Se estiman 223 tratamientos nuevos de especie: 109 con perfil sustancial y 114 mediante adaptación, más una revisión de arte existente. Las 14 dudas taxonómicas pueden cambiar esa carga. Primero deben aprobarse las identidades; después se diseñan y agrupan las bases.

Hay **156 nombres de fuente sin coincidencia en los clasificadores actuales** —155 identidades tras agrupar el alias—. Por ejemplo, varios felinos o cánidos americanos pueden ampliar una familia anatómica ya existente; no debe aceptarse un sprite genérico por el mero hecho de que `kind` dibuje algo.

Prioridades de perfiles: primates americanos con colas y proporciones propias; perezosos; armadillos; osos hormigueros; pecaríes; capibaras y maras; coatíes/mapaches; manatí; delfines fluviales; tucanes y colibríes; guacamayos de cola larga; ñandúes; ajolote; iguanas; aligátores/caimanes; y peces como arapaima, piraña, surubí y pez eléctrico. Se pueden reutilizar motores y primitivas SVG, pero deben cambiar los rasgos que definen la anatomía.

### Rutas que requieren revisión explícita

- **Chrysemys picta**: El clasificador devuelve land-tortoise para una tortuga acuática de Emydidae; no aceptar como tortuga terrestre.
- **Ctenosaura similis**: Devuelve spiny-lizard por cola espinosa: esa ruta representa Uromastyx (Agamidae), no una iguana Iguanidae.
- **Dicamptodon tenebrosus**: Devuelve giant-salamander por el nombre gigante; revisar cuerpo de Dicamptodon, sin reutilizar automáticamente Andrias.
- **Boa imperator**: Devuelve python; Boidae no equivale a Pythonidae. Requiere perfil de boa.
- **Epicrates cenchria**: Devuelve python; diseñar perfil de boa arcoíris y patrón propio.
- **Caiman crocodilus**: Devuelve crocodile genérico; revisar hocico y escudos de Alligatoridae.
- **Caiman yacare**: Devuelve crocodile genérico; revisar hocico, mandíbula y patrón de yacaré.
- **Melanosuchus niger**: Devuelve crocodile genérico; revisar anatomía de caimán negro.
- **Bubo scandiacus**: Ruta actual horned-owl/eagle-owl: comprobar que el búho nival no herede penachos auriculares de otros Bubo. Es revisión pendiente, no defecto visual demostrado.

### Sexo, pigmentación y categorías

Solo **dos** de las 26 identidades existentes tienen dimorfismo configurado: `alce` y `reno`. Se mantienen sus tipos y progreso. Se señalan **26 identidades nuevas** con candidatos de dimorfismo visual —por ejemplo patos, colibríes, pavos, ciervos y bóvidos— para revisión biológica antes de crear configuraciones. Para las restantes se registra «sin configuración; revisar», sin afirmar ausencia de diferencias sexuales.

Entre las 26 existentes, 20 tienen Albino como único pigmento configurado, una tiene Albino y Melánico, y cinco no tienen pigmentos configurados. Las categorías Notable/Épico/Excepcional/Legendario se registran separadamente de pigmentos. Las especies nuevas no heredan automáticamente variantes, sexos, categorías ni individuos legendarios de una base gráfica. El Excel no define esas reglas. Cambiar el tamaño de `special` alteraría los intervalos probabilísticos: debe preservarse para IDs actuales y revisarse por separado para altas futuras.

## Progresión existente y propuesta

[Snapshot de investigaciones, recetas y viaje](americas-audit/progression-snapshot.json). Los umbrales actuales abarcan Europa 0–9, Asia 10–50, África 53–122 y Norteamérica 125/128. El prestigio no se gasta al desbloquear una región: se usa como mínimo acumulado. Una monografía publicada concede +1 prestigio y £90; compilar Atlas concede +1 a cambio de 500 conocimiento tras al menos 20 publicaciones. Estos caminos impiden inferir costes nuevos simplemente contando especies.

| Investigación actual | £ | Conocimiento | Antecedente | Objeto requerido |
| --- | ---: | ---: | --- | --- |
| Cartografía de Asia | 800 | 650 | Cartografía naval II | Mapa de Asia |
| Estudios cartográficos de África | 1.200 | 900 | Cartografía de Asia | Mapa de África, conservado |
| Navegación al Nuevo Mundo | 2.200 | 1.800 | Estudios de África | Cuadrante transatlántico, conservado |
| Cartografía de Norteamérica | 2.800 | 2.400 | Navegación al Nuevo Mundo | Mapa de Norteamérica, conservado |

Mapa de Asia y África: diez piezas cada uno; mapa de Norteamérica: **ocho piezas**. El cuadrante usa tres fragmentos de latón, dos lentes pulidas, dos fragmentos de mapa y un pergamino. Reconocimiento del Atlántico dura 720 s antes de bonificaciones; exige prestigio 116, cartografía naval II, Navegación al Nuevo Mundo y astillero/cupo de expedición. Cuesta £1.700 y 650 conocimiento; puede obtener piezas norteamericanas como botín. No hay que depender de una región norteamericana para fabricar el primer mapa que da acceso a ella.

Alaska conserva prestigio 125 y Columbia Británica 128. El requisito efectivo de entrada norteamericana exige `northAmericaUnlocked`, conservar `north_america_map` y alcanzar el prestigio de la región. Las compras reconstruyen los flags al cargar la partida. Las visitas a regiones ya desbloqueadas usan `regionUnlocked`; no deben bloquearse retroactivamente al ampliar el catálogo.

**Propuesta posterior, sin costes definitivos:** mantener la cadena actual y abrir las doce regiones norteamericanas con mínimos ordenados y revisados mediante simulación/partidas avanzadas. Después, una investigación Cartografía de Sudamérica podría depender de Cartografía de Norteamérica y de un mapa sudamericano fabricable. Su fuente de piezas tendría que estar accesible desde Norteamérica antes de abrir Sudamérica, evitando un ciclo. No se diseña ni modifica esa expedición en AM-01; se especificará en una solicitud de progresión posterior. No exigir completar las 128 identidades norteamericanas para permitir continuar sin evaluar el tiempo real y los bloqueos taxonómicos.

Sudamérica necesita su rama explícita en `regionRequirementsMet` y `continentStatus`, una compra/flag persistible y la receta/materiales correspondientes si se aprueba esa propuesta. Hoy una región de un continente desconocido caería en la condición genérica de prestigio; añadir únicamente filas a `REGIONS` sería insuficiente. No reutilizar el flag norteamericano ni cambiar sus requisitos para simular el acceso sudamericano.

## Riesgos y condiciones de integración

- **Identidad y partidas:** evitar la colisión Amazonía/Sáhara, mantener IDs existentes y reutilizar los compartidos. Los IDs propuestos de los CSV no son altas ejecutadas; los E permanecen pendientes.
- **Taxonomía:** decidir una autoridad, combinaciones aceptadas, sinónimos y alcance de los 14 E. Conservar evidencia y procedencia, sin utilizar nombres comunes como claves.
- **Distribución:** resolver o documentar las 38 alertas. Ninguna eliminación o sustitución silenciosa; preservar las 398 filas como trazabilidad.
- **Datos incompletos:** faltan familias formales, ecología por especie, horarios, estaciones, dimorfismo, variantes, costes y umbrales. El bioma de región no completa esos campos automáticamente.
- **Clasificación y dibujo:** `taxonomyInfo` tiene un fallback Mammalia; un `kind` incompleto puede convertir aves/anfibios nuevos en mamíferos. Probar clase, familia zoológica, ruta gráfica y morfología, especialmente ajolote, iguanas, caimanes y serpientes.
- **Balance:** normalizar etiquetas sin cambiar tiers; preservar las cinco rarezas existentes discrepantes. Nuevas especies compartidas no deben duplicar progreso ni alterar observaciones históricas.
- **Atlas:** su diseño visual sigue pendiente de aprobación. La relación datos ↔ celda será una integración posterior explícita; no rehacer la malla en AM-01 ni añadir relleno.
- **Rendimiento y plataformas:** el catálogo proyectado crece un 45,8 %. Medir Cuaderno, filtros, caché SVG y guardado con 710 entradas, sin asumir que el crecimiento será lineal. Validar Android y PWA/offline en AM-06, con respaldo y restauración reales.
- **Museo y expediciones:** no se modifican como efecto lateral de añadir especies. Cualquier contenido o ruta nueva necesita alcance propio.

## Reproducción y comprobaciones

Requisitos ya presentes en el entorno: Python 3 con `openpyxl` y Node. Ejecutar desde la raíz del repositorio, indicando la ubicación del Excel confirmado:

```sh
python3 scripts/audit-americas-am01.py /ruta/Atlas_Fauna_Hexagonal_209_900_Especies.xlsx
python3 scripts/audit-americas-am01.py /ruta/Atlas_Fauna_Hexagonal_209_900_Especies.xlsx --check
node --check scripts/export-americas-runtime.cjs
```

El generador escribe solo documentación tabular/JSON. `--check` reproduce y contrasta los ocho artefactos generados sin reescribirlos. Las decisiones manuales están separadas en [manual-decisions.json](americas-audit/manual-decisions.json); los dos informes narrativos requieren revisión editorial al cambiar esas decisiones. No guarda ni modifica el Excel original.

**18 controles de integridad aprobados:** cobertura y cantidades de las 209 casillas de Mapa; unicidad y referencias de todos los IDs hex/especie; nombres del catálogo frente a presencias; cantidades por hexágono y por especie; ausencia de duplicados exactos; conservación de las 398 filas y todos sus campos; cobertura de 24 regiones; coincidencia de ambos pilotos; resolución de IDs existentes; unicidad de propuestas por taxón y de IDs regionales; y ausencia de reemplazo de IDs funcionales existentes. Las huellas de los cinco archivos de catálogo/arte quedan en el resumen. Estos controles verifican consistencia y trazabilidad, no sustituyen las revisiones científicas pendientes ni constituyen pruebas de futuras funciones todavía no implementadas.
