# GM-04B · resumen de reutilización, sin implementación

Los CSV GM-01 documentan 44 filas y cinco regiones profundas. Aquí solo se enumeran recursos existentes; no se crean regiones, hábitats ni métodos de inmersión.

## Identidades ya disponibles

- `mar_esp_architeuthis_dux`: Architeuthis dux
- `polar_esp_gonatus_fabricii`: Gonatus fabricii
- `mar_esp_isistius_brasiliensis`: Isistius brasiliensis
- `polar_esp_somniosus_microcephalus`: Somniosus microcephalus

## Infraestructura reutilizable

- Índice por presencia con fila/hoja/HX/ESP, nombre original y efectivo, ámbito, estadio y método de observación.
- IDs estables y deduplicación exacta; no crear versiones profundas del mismo animal.
- Mapas delegados que preservan geometrías anteriores, sin convertir reservas en celdas funcionales.
- Perfiles ya implementados de cefalópodos, tiburones, cetáceos y peces; reutilizar solo cuando la familia y anatomía correspondan.
- Laboratorio con búsqueda por nombre, agrupación familiar, escalas 64/80/120 y control de límites.
- Campo marino y escenas cacheadas; requerirá diseñar métodos profundos propios, no copiar encuentros superficiales.
- Comercio de cuatro duraciones, plazos absolutos, guardados aditivos, actualización PWA con respaldo y hashes publicados.

## Conceptos aún fuera del juego

Los siguientes nombres pertenecen al alcance futuro y no se agregan a datos productivos en GM-04A: Anoplogaster brachycera, Anoplogaster cornuta, Argyropelecus aculeatus, Bathypterois grallator, Benthosema glaciale, Ceratias holboelli, Chauliodus macouni, Chlamydoselachus anguineus, Dissostichus mawsoni, Eurypharynx pelecanoides, Grimpoteuthis umbellata, Haliphron atlanticus, Histioteuthis reversa, Idiacanthus antrostomus, Macropinna microstoma, Mesonychoteuthis hamiltoni, Mitsukurina owstoni, Onykia ingens, Stomias boa, Vampyroteuthis infernalis.

Las dos fosas abisales y sus tres filas siguen igualmente sin implementación. No se fija aquí un umbral, investigación, objeto o mecánica de GM-04B/C.
