# OBJ-10 · Gabinete de Historia natural y exploración

La etapa completa las cinco colecciones del gabinete con **60 candidatas**, 34 nuevas y 26 reutilizadas de OBJ-01, OBJ-02 y OBJ-05. Con esto termina la producción artística inicial de los objetos. Las candidatas quedan pendientes de aprobación e integración.

- [Plancha general de las 60 piezas](historia-natural-general-obj-10.webp)
- [Huevos de aves](historia-natural-huevos-obj-10.webp) · [Fósiles menores](historia-natural-fosiles-obj-10.webp) · [Instrumentos de exploración](historia-natural-instrumentos-obj-10.webp)
- [Gabinete de maravillas](historia-natural-maravillas-obj-10.webp) · [Arquitecturas animales](historia-natural-arquitecturas-obj-10.webp)
- [Fichas científicas](fichas-historia-natural.tsv) · [Asociaciones con fauna](fauna-historia-natural.json) · [Auditoría cronológica](auditoria-cronologica.tsv) · [Pendientes para OBJ-11](pendientes-obj-11.md)

## Laboratorios

El laboratorio artístico ofrece las cinco cuadrículas con fichas, variantes, halos, fondos y seis escalas. El comparador de huevos reutiliza las ilustraciones de inventario y presenta una casilla normalizada o una silueta de longitud proporcional a una regla común de 300 mm. Cada ejemplar se puede ampliar a 256 px. Las dimensiones representan referencias de especie o de museo. La longitud del colibrí corresponde a una referencia comparativa de troquílidos cuya medida para el picoespada sigue pendiente.

El laboratorio de inclusiones ofrece las 26 colecciones en álbum, gabinete y vitrina. El Gran gabinete muestra el avance global, el de cada gabinete y el de cada colección, además de puntuación de prueba y distribución de rarezas. Permite filtrar por gabinete, colección, nombre, ID o especie asociada. La presentación de una colección, un gabinete o un catálogo completos es visual.

Los cinco escenarios de hallazgos naturalistas permiten consultar la ficha y transferir al álbum simulado una observación, un registro o un modelo de gabinete. Se validan 14 vínculos por ID contra la fauna productiva. Las demás arquitecturas con constructor ausente recurren al hábitat y a la documentación. El hornero, la golondrina común y el pájaro sastre quedan asociados por esta vía. Los insectos y arácnidos representados mediante sus arquitecturas se mantienen fuera del catálogo productivo. Los estados posteriores a 1842 se conservan para revisión documental.

## Cobertura

| Conjunto | Ilustradas |
| --- | ---: |
| Botánica | 48/48 |
| Geología | 60/60 |
| Oceanografía | 60/60 |
| Historia | 72/72 |
| Historia natural y exploración | 60/60 |
| Coleccionables | **300/300** |
| Inventario funcional | 68/68 |
| Museo, sujetos principales | 17/17 |
| Ilustraciones principales | **385/385** |
| Conceptos y complementos ilustrados | 33 |
| Sujetos ilustrados | **418** |

| Tamaño WebP | Clásica media | Inventario medio |
| --- | ---: | ---: |
| 64 px | 2,10 KiB | 2,19 KiB |
| 128 px | 5,64 KiB | 5,98 KiB |
| 256 px | 17,24 KiB | 15,92 KiB |
| 512 px | 56,38 KiB | 45,83 KiB |

OBJ-10 suma **272 WebP transparentes y 5,02 MiB**. El total es **3.344 WebP y 56,84 MiB**. Las [seis maestras](maestras-obj-10/) y el [plan de recorte](obj-10.json) trazan los sprites. La exportación se reproduce con `python docs/objetos-cientificos/preparar-arte.py --obj-10` y `node docs/objetos-cientificos/generar-manifiesto.cjs`.

## Validación

Se verificaron los 461 IDs, las cinco colecciones de 12 piezas del último gabinete, los 300 coleccionables, las 26 colecciones y todos los WebP mediante dimensión, formato, transparencia, margen y asociación con el manifiesto. Los 3.072 sprites previos y el catálogo conservan sus bytes de OBJ-09. En el comparador se comprobó la relación entre el colibrí y el ave elefante. El Gran gabinete pagina los 300 registros de 24 en 24, con imágenes diferidas. La vista artística solicita la resolución elegida y reutiliza el recurso de 64 px para las escalas inferiores.

Las mismas suites de Inventario, GM06 y Museo dieron **79 pruebas aprobadas y 12 fallos históricos**. La lista de fallos coincide con la base. Las pruebas de Chromium incluyen persistencia y exportación de las evaluaciones, y verificación de interfaz móvil con recursos locales.

La siguiente etapa es OBJ-11, auditoría, homologación y optimización global.
