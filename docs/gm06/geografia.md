# Decisiones cartográficas

La retícula mantiene radio 46, separación horizontal √3·46 y separación vertical 69. Todas las posiciones nuevas usan coordenadas axiales enteras. El nombre y el ID histórico no se usan como coordenadas. La comparación base se conserva en `base-cartografia.json`; las posiciones propuestas en `coordenadas-propuestas.json`.

`regiones-revision.tsv` reúne los 125 IDs, nombres anteriores/propuestos, coordenadas, hábitats, cantidades de fauna y umbrales de acceso. Como referencia geográfica general se consultó [Natural Earth: costas e islas principales, 110m](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-coastline/). La composición hexagonal es una interpretación editorial, no una transformación de coordenadas GIS ni una reproducción a escala de ese conjunto de datos. Las fuentes zoológicas regionales complementan los recortes naturales de cada región.

## Nuevas regiones

| ID | Identidad | Prestigio compartido | Justificación |
|---|---|---:|---|
| gm06_hudson | Bahía de Hudson | 137 | Costa subártica, banquisa estacional, aguas y cuencas boreales diferenciadas por hábitat |
| gm06_labrador | Labrador subártico | 149 | Península continental boreal y tundra; lince, marta y arrendajo no extrapolados a toda la tundra |
| gm06_atlantico | Atlántico canadiense | 153 | Terranova, San Lorenzo y costas: fauna oceánica distinta de la terrestre de Labrador |
| gm06_antillas | Antillas y Caribe insular | 177 | Islas separadas del continente, con endemismos identificados por isla |
| gm06_darien | Darién y Chocó | 182 | Puente centroamericano y selvas del Pacífico colombiano-ecuatoriano |
| gm06_galapagos | Islas Galápagos | 197 | Archipiélago al oeste de Ecuador, más al sur que la marca rosada inicial |
| gm06_humboldt | Litoral del Pacífico suroriental | 197 | Litoral peruano-chileno al oeste de los Andes centrales y al norte de Atacama |
| gm06_bosques | Bosques templados del sur | 227 | Selva valdiviana, Chiloé y bosques húmedos andinos; ocupa la antigua celda de Patagonia |
| gm06_rojo | Arco del mar Rojo | 83 | Noreste africano frente a Arabia; macizos áridos, costas y arrecifes |
| gm06_sonda | Islas de la Sonda occidentales | 48 | Sumatra, Java y Borneo, sin atribuir fauna indistintamente a las tres islas |
| gm06_wallacea | Célebes y Molucas | 48 | Islas de transición, al este de Sonda y al oeste de Nueva Guinea |
| gm06_melanesia | Melanesia oriental | 269 | Nueva Caledonia; al este de Australia y al norte de Nueva Zelanda |

Se mantienen las tres regiones canadienses porque sus combinaciones boreal, subártica y marítima son distintas. La liebre y el colimbo son compartidos donde corresponde, sin duplicar fichas.

Patagonia y Tierra del Fuego se traslada una fila al sur, conservando `sa_patagonia_y_tierra_del_fuego`, su prestigio 227 y los registros de partida. Se trasladan al nuevo bosque las asociaciones actuales de pudú, ranita de Darwin y zorro de Darwin. Carpintero negro y cachaña conservan presencia compartida austral. Los descubrimientos, observaciones, monografías, variantes y acreditaciones históricas siguen referidos a los mismos IDs de especies.

Bangweulu pasa de fila 4 a 3; Okavango de 4 a 5. Miombo se sitúa entre ambos y Namib queda en el flanco occidental. Bangweulu permanece dos filas al norte de Okavango. Madagascar y Seychelles/Aldabra conservan separación marítima.

## Nombres

Se adoptan ocho cambios: Litoral caribeño sudamericano, Bosques atlánticos ecuatoriales, Bosques guineanos occidentales, Litoral sudoriental africano, Sabanas del sudeste africano, Archipiélagos del Índico occidental, Interior árido australiano y Australia tropical septentrional. Se elimina así «Kruger» como referencia cartográfica de 1842.

Se conservan **Humedales de Bangweulu** y **Delta del Okavango**. Sus faunas y sus identidades actuales justifican sistemas hidrográficos concretos; ampliar el nombre a todos los humedales centroaustrales o del Kalahari insinuaría una cobertura que no se ha añadido.

La región de Seychelles/Aldabra representa archipiélagos distintos: la tortuga gigante corresponde a Aldabra, la fauna endémica seychellense a sus islas específicas. No se interpreta el hexágono como una isla continua. Las nuevas asociaciones tienen localidades en `asociaciones-nuevas.tsv`.

Se revisan las relaciones asiáticas existentes: Urales al oeste de Siberia, Tíbet al norte del Himalaya, India al sur, Corea al oeste de Japón. No requieren un desplazamiento adicional. Se preservan los cuatro hexágonos decorativos de hielo/reserva de Asia; no se vuelven regiones. No se añade Ceilán ni otra región australiana.

La referencia 9 permanece como reserva del Pacífico ecuatorial, fuera del recuento. Rapa Nui aparece aislada en la referencia mundial, al oeste de Sudamérica y muy al sur de Galápagos. Los desplazamientos entre continentes en ese plano son una composición visual; la geometría jugable se audita por continente. No se añade una pantalla principal nueva al juego.

## Progresión y partidas

La escala EC-3300 ordenaba las regiones por continente y recalculaba todos los umbrales. GM-06 excluye de esa operación las regiones con `origin: gm06`. Las 113 condiciones anteriores quedan exactamente iguales; los nuevos umbrales son compartidos y provisionales. El prestigio no se consume. Permanecen las reglas continentales y las acreditaciones permanentes de cartografía ya existentes.

No se modifica `gran_atlas_v05`, la versión 1 del respaldo ni la selección de región al cargar. Renombrar o trasladar una celda no altera la posición guardada. Los logros y diplomas curatoriales acreditados se conservan: el catálogo nuevo puede ampliar futuras posibilidades, pero no revoca títulos anteriores ni cambia sus requisitos fijos.
