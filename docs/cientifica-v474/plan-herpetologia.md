# Inventario de reptiles y anfibios para la Serie 4.8

El catálogo de V4.7.4 contiene **104 reptiles y 35 anfibios**. Quedan **138 especies y 225 láminas** por producir. El sapo pulga ya usa la lámina científica publicada en V4.7.3. [Inventario completo por especie, familia y ruta](inventario-herpetologia.json)

| Lote | Especies | Familias | Albinos | Melánicos | Dimorfismos configurados | Legendarios | Láminas pendientes |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| V4.8.0 · Serpientes y lagartos | 78 | 20 | 28 | 20 | 0 | Basalto, Seda | 128 |
| V4.8.1 · Tortugas, crocodilianos y otros reptiles | 26 | 8 | 10 | 8 | 0 | Junco, Áncora | 46 |
| V4.8.2 · Anfibios | 35, con 34 pendientes | 18 | 11 | 6 | 0 | — | 51 |
| **Total** | **139, con 138 pendientes** | **46** | **49** | **34** | **0** | **4** | **225** |

El primer lote reúne 36 serpientes y 42 lagartos. El segundo reúne 12 tortugas, 13 crocodilianos y un rincocéfalo, el tuátara. El tercero reúne 23 anuros y 12 salamandras y tritones. Las cifras incluyen las variantes de pigmentación configuradas y una lámina independiente por ejemplar legendario. Notable, Épico y Excepcional reutilizan la lámina de su variante mediante halos externos.

| Legendario | Especie | ID del ejemplar | Lote |
| --- | --- | --- | --- |
| Basalto | Dragón de Komodo · *Varanus komodoensis* | `basalto` | V4.8.0 |
| Seda | Cobra real · *Ophiophagus hannah* | `seda` | V4.8.0 |
| Junco | Cocodrilo del Nilo · *Crocodylus niloticus* | `junco` | V4.8.1 |
| Áncora | Tortuga gigante de Aldabra · *Aldabrachelys gigantea* | `ancora` | V4.8.1 |

El inventario conserva los nombres, IDs, hábitats y categorías del juego. El lote se asigna por orden y familia zoológicos. Por ejemplo, la ficha histórica de la pitón reticulada agrupa a la especie con los lagartos. La planificación la incorpora a las serpientes de Pythonidae. Se conserva el nombre `Ranoidea caerulea` del juego para el anfibio que el catálogo del AMNH lista como *Pelodryas caerulea*. [The Reptile Database](https://reptile-database.reptarium.cz/) · [Pitón reticulada](https://reptile-database.reptarium.cz/Malayopython/reticulatus) · [Amphibian Species of the World](https://amphibiansoftheworld.amnh.org/) · [Ficha de *Pelodryas caerulea*](https://amphibiansoftheworld.amnh.org/Amphibia/Anura/Pelodryadidae/Pelodryas/Pelodryas-caerulea)

El comando `node scripts/audit-scientific-catalog.cjs --herpetology` reproduce el documento JSON a partir del catálogo del juego. La planificación de V4.8.0–V4.8.2 queda lista para su producción posterior.
