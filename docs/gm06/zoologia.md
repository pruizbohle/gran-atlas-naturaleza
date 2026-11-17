# Revisión zoológica

El candidato añade 52 especies, sin duplicar nombres científicos ni dejar fichas huérfanas. Los 945 registros previos conservan todos sus campos. La matriz `especies-revision.tsv` reúne identidad, familia, localidad, hábitat, presencia compartida y fuentes. La rareza nueva «Raro» es una decisión de catálogo provisional, no una categoría de amenaza ni una estimación de abundancia científica. No se cambian rarezas o probabilidades anteriores.

## Fuentes consultadas el 16 de noviembre de 2026

- **Mammal Diversity Database 2.5**, publicación del 28-07-2026: se descargó el ZIP oficial y se contrastaron las 16 incorporaciones de mamíferos por nombre, familia, ID y países. El extracto factual se conserva en `sources/mdd-2.5-extracto.json`. [Base ASM](https://www.mammaldiversity.org/), [dataset](https://doi.org/10.5281/zenodo.17033774).
- **GBIF Species API**: 52 consultas exactas conservadas en `sources/gbif-identidades.json`. Son un contraste de identidad, no una certificación de distribución ni una revisión integral de todos los sinónimos.
- **AviList 2026**, publicada el 20-10-2026: se consultaron la versión y sus criterios. El XLSX no fue descargable desde este entorno; no se declara una comparación fila a fila con ese fichero. Los nombres nuevos se contrastaron con GBIF y fuentes regionales. Para *Nannopterum harrisi*, se comprobó además la nomenclatura AviList publicada por BirdLife Finlandia. [AviList](https://www.avilist.org/checklist/v2026/), [BirdLife Finlandia](https://www.birdlife.fi/lintutieto/maailman-lintulajien-suomenkieliset-nimet/).
- **Charles Darwin Foundation**, listas y fichas de Galápagos: localidades insulares y alcance de los taxones. [Lista](https://datazone.darwinfoundation.org/en/checklist), [tortuga de Santa Cruz occidental](https://datazone.darwinfoundation.org/es/checklist/?species=18498), [iguana terrestre](https://datazone.darwinfoundation.org/en/checklist/?species=5262), [cormorán](https://datazone.darwinfoundation.org/en/checklist?species=5144).
- **The Reptile Database**: *Crocodylus rhombifer*, *Cyclura nubila*, *Cyclura cornuta*, *Basiliscus basiliscus*, *Amblyrhynchus cristatus*, *Conolophus subcristatus* y *Chelonoidis porteri*. Las fichas se enlazan por género/especie en la matriz.
- **Canadá / DFO / COSEWIC**: salmón y foca de Groenlandia; [salmón 2025](https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports/multiple-populations-atlantic-salmon-2025.html), [foca](https://www.dfo-mpo.gc.ca/species-especes/profiles-profils/harpseal-phoquegroenland-eng.html), [pato arlequín](https://www.canada.ca/en/environment-climate-change/services/migratory-game-bird-hunting/consultation-process-regulations/report-series/population-status-2025.html), [liebre ártica en Terranova/Labrador](https://www.gov.nl.ca/ffa/files/wildlife-endangeredspecies-ssac-arctic-hare.pdf).
- **IUCN Hornbill Specialist Group**: [cálao rinoceronte](https://iucnhornbills.org/rhinoceros-hornbill/), con subespecies de Sumatra/península malaya, Borneo y Java.
- **Autoridad de conservación de Indonesia**: [manual de especies de Célebes](https://ksdae.menlhk.go.id/assets/publikasi/Book_Manual%20Identifikasi%20dan%20Bio-Ekologi%20Spesies%20Kunci%20di%20Sulawesi.pdf). **KBA/BirdLife/IUCN**: [Célebes](https://www.keybiodiversityareas.org/en/site/factsheet/44818/assessment), [Nueva Caledonia](https://www.keybiodiversityareas.org/en/site/factsheet/21839/assessment).
- **FishBase**: [comunidad del mar Rojo](https://www.fishbase.se/TrophicEco/FishEcoList.php?ve_code=5), donde figuran *Pterois miles* y *Chaetodon semilarvatus* como peces asociados al arrecife.

Las fuentes acreditan identidad y distribución con distintos niveles de detalle. Los países de MDD no se presentan como un mapa de presencia fina; las localidades insulares y subregionales son el recorte editorial explícito del candidato. La matriz permite revisar esos recortes. No se hizo una revisión taxonómica masiva de las 945 especies antiguas ni una reconstrucción paleodistributiva completa de 1842.

## Conceptos y exclusiones

*Chelonoidis porteri* representa **Santa Cruz occidental**, no todo el complejo de tortugas de Galápagos. No se crean especies adicionales de tortugas.

*Dromiciops gliroides* sigue MDD 2.5: incluye *mondaca*; *D. bozinovici* se reconoce por separado en esa fuente. La sistemática continúa en revisión. No se cuentan tres nuevas especies de monito del monte.

*Nannopterum harrisi* conserva *Phalacrocorax harrisi* como sinónimo documentado. GBIF devuelve este último como concepto aceptado en su backbone, mientras la nomenclatura aviar elegida usa *Nannopterum*. Es la misma identidad zoológica, no dos fichas. Se mantiene *Leucocarbo bougainvilliorum* para el guanay.

*Scolopax minor* se omite de Labrador: no se fuerza su incorporación sin un recorte meridional comprobado. Tampoco se reutiliza el alce introducido en Terranova. El alca gigante queda como futura posibilidad excepcional de 1842, no como encuentro habitual ni incorporación de esta fase.

Las especies cubanas, de La Española, de Seram, de las Molucas septentrionales y de Nueva Caledonia llevan su isla o subárea escrita. No se presenta a cada animal como habitante de todo un archipiélago. El orangután de Borneo y el mono narigudo se retiran del Sudeste continental y se reutilizan en Sonda. Cálao rinoceronte y rinoceronte de Sumatra conservan presencia continental histórica válida y añaden la insular. No se traslada fauna de Borneo a Célebes.

El mar Rojo separa íbice/damán en montaña/desierto, dugongo en costa y peces/tortuga verde en arrecife o costa marina. Hudson separa banquisa, aguas polares, tundra y bosque. La etiqueta oceánica del bacalao y del alcatraz es la del catálogo anterior; no se reescriben esas fichas en GM-06.

Las estaciones son las cuatro etiquetas globales del motor, con disponibilidad anual simplificada en las incorporaciones. No equivalen a un modelo fenológico local detallado. Las franjas horarias diurnas/nocturnas distinguen, por ejemplo, solenodonte, monito y zorro volador. Cada ficha tiene al menos una combinación real de filtros manuales y automáticos y puede completar las cinco etapas sin diferencias sexuales inventadas.

Las monografías mantienen observaciones, costes, alimentación y espécimen especial del sistema existente. Los tres niveles disponibles usan las tasas actuales; no hay nuevo individuo legendario, dodo, mamut ni críptido.
