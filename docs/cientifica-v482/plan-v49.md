# V4.9 · Plan de peces y otros animales acuáticos

El catálogo conserva **111 especies por ilustrar**. La clasificación zoológica de trabajo comprende 73 actinopterigios, 18 condrictios y 20 cefalópodos, repartidos en 74 familias. Se estiman **134 láminas** y **536 archivos WebP** al exportar las cuatro resoluciones. La estimación incluye 111 normales, 12 albinas, 10 melánicas y una legendaria. [Especies, familias, hábitats, categorías y rutas previstas](inventario-v49.json)

El inventario registra la clasificación zoológica por separado del grupo jugable. Las asignaciones de zonas, nombres y categorías se leen del catálogo. Los lotes agrupan especies que comparten un tipo de revisión, entre ellas los salmónidos que aparecen en costa y río. Los tiburones y cefalópodos profundos permanecen en sus lotes zoológicos. El lote de aguas profundas se dedica a peces óseos e incluye los dos taxones hadales.

| Orden propuesto | Lote | Especies | Familias | Albinas | Melánicas | Legendarias | Láminas |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | Tiburones y rayas | 18 | 12 | 1 | 2 | 0 | 21 |
| 2 | Salmónidos y Remonte | 8 | 1 | 4 | 3 | 1 | 16 |
| 3 | Peces dulceacuícolas y estuarinos | 23 | 18 | 7 | 5 | 0 | 35 |
| 4 | Peces óseos de arrecife | 12 | 11 | 0 | 0 | 0 | 12 |
| 5 | Peces óseos costeros, pelágicos y de plataforma | 16 | 9 | 0 | 0 | 0 | 16 |
| 6 | Peces óseos de aguas profundas | 14 | 10 | 0 | 0 | 0 | 14 |
| 7 | Pulpos, calamares y calamar vampiro | 20 | 14 | 0 | 0 | 0 | 20 |
| | **Total** | **111** | **74 distintas** | **12** | **10** | **1** | **134** |

## Criterios de producción

- **Tiburones y rayas.** Separar siluetas por el hocico, las hendiduras branquiales y las aletas. En las rayas conviene mostrar el disco, los lóbulos cefálicos cuando correspondan y el largo de la cola.
- **Salmónidos.** Comparar el maxilar, los patrones de manchas, la aleta adiposa y el pedúnculo caudal. Revisar las libreas migratorias y nupciales. Es el lote con más variantes por especie.
- **Peces dulceacuícolas y estuarinos.** Dividir la revisión interna entre peces de perfil alto, formas alargadas y especies con placas o barbillones. Es el lote con más láminas y puede producirse en dos tandas.
- **Arrecife y mar abierto.** Revisar aletas, espinas y patrones de color con un contorno suficientemente legible en miniatura. Comparar los peces luna, los escómbridos y los peces de pico dentro de sus grupos.
- **Aguas profundas.** Revisar fotóforos, señuelos, ojos y radios finos. Conservar contraste sobre claro y oscuro, con atención al contorno translúcido y a las formas hadales.
- **Cefalópodos.** Revisar brazos, tentáculos, membranas, aletas y ventosas por grupo. Distinguir el pulpo, el calamar y el calamar vampiro por su anatomía y posición de apéndices.

## Remonte

Remonte pertenece a *Oncorhynchus gorbuscha* (salmón rosado, `asia_esp_0369`). Su ficha vigente describe un salmón de dorso moteado y mandíbula curva en plena remontada. La lámina legendaria debe mostrar un macho en fase nupcial con la joroba marcada, mandíbula ganchuda y grandes manchas dorsales y caudales. La silueta debe distinguirse con claridad de la lámina normal y de las variantes albina y melánica. El motor aplica el halo legendario. La ruta prevista es `asia_esp_0369--remonte.webp`.

Este plan se obtuvo con `node scripts/audit-scientific-catalog.cjs --aquatic-plan`. La producción de V4.9 queda pendiente. [Estándar gráfico](../cientifica-v440/estandar.md)
