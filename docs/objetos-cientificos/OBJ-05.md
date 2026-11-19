# OBJ-05 · Paleontología, Museo y laboratorio de inclusiones

La etapa parte de `5552aa2` en `experiment/scientific-illustration-objects`. La auditoría inicial confirmó 68 objetos funcionales, 300 coleccionables en 26 colecciones, 441 registros, 107 láminas principales y 21 conceptos ilustrados. Los 1.024 WebP de OBJ-01 a OBJ-04 se conservaron byte por byte.

| Conjunto | Nuevas láminas | Cobertura |
| --- | ---: | ---: |
| Objetos funcionales | 14 | 68 de 68 |
| Fósiles menores | 12 | 12 de 12 |
| Montajes fósiles del Museo | 8 | 8 de 8 |
| Archivo paleontológico del Museo | 4 | 4 de 4 |
| Artefactos históricos del Museo | 0 | 5 de 5, conservados |
| Interpretaciones complementarias en vida | 8 | 8 de 8 |
| Montajes futuros | 4 | 4 ilustrados y 8 pendientes |

Los 17 recursos propios del Museo quedan cubiertos. Los nueve expedientes de relictos reutilizan sus ilustraciones documentales existentes. La cobertura principal alcanza **145 de 385**, con 240 pendientes en los gabinetes restantes. Hay **461 registros experimentales** y **178 sujetos con candidato** en total. De estos, 33 son conceptos y complementos que quedan fuera de las 385 láminas principales.

## Revisión paleontológica

La [plancha de fósiles y archivo](fosiles-obj-05.webp) distingue huesos cortos y largos por proporción y epífisis, dientes por curvatura y sección, y cráneos por perfil y dentición. La placa dorsal tiene base ancha y perfil triangular. La espina de vela es estrecha y alargada. El hueso denso muestra sección cortical y estructura interna. Los relieves en roca conservan una matriz visible. El ámbar funcional se representa en bruto, con corteza e interior resinoso, y la perla fluvial como nácar satinado. Los fósiles menores presentan piezas diagnósticas. El archivo emplea bandejas, documentos y muestras organizadas.

La [plancha de montajes](montajes-obj-05.webp) compara los ocho esqueletos y sus interpretaciones naturalistas. Las siluetas muestran la gola y los cuernos de Triceratops, las placas de Stegosaurus, la vela de Spinosaurus, la maza caudal de Ankylosaurus y la cúpula de Pachycephalosaurus. Las extremidades, costillas, falanges y dientes finos requieren cotejo anatómico a 128–512 px. A 24 y 32 px se distingue principalmente el perfil, en especial en Diplodocus y Pteranodon. Las interpretaciones en vida son hipótesis sobre el aspecto. El color, los tejidos y la postura permanecen pendientes de aprobación. La reconstrucción de Spinosaurus adopta una cola profunda y conserva la nota sobre locomoción y ecología debatidas. [Ibrahim et al., estudio de la cola de Spinosaurus](https://doi.org/10.1038/s41586-020-2190-3)

El manifiesto mantiene los IDs FOS-01 a FOS-12 y añade notas de datación o procedencia. La pluma de Solnhofen se marca como posterior a 1842 si corresponde al hallazgo publicado en 1861. El gastrólito requiere asociación diagnóstica y una fecha documental antes de tratarlo como una identificación histórica. El montaje de Iguanodon mantiene el contexto del taxón conocido en 1842 y usa una interpretación anatómica moderna. Los otros siete montajes existentes conservan su anotación posterior a 1842. [Natural History Museum, Archaeopteryx](https://www.nhm.ac.uk/discover/dino-directory/archaeopteryx.html)

El [catálogo de montajes futuros](montajes-futuros.tsv) separa dinosaurios, reptiles voladores, reptiles marinos y mamíferos prehistóricos. Diplodocus, Pteranodon, Plesiosaurus y mamut lanudo tienen lámina. Las otras ocho propuestas quedan documentadas como pendientes.

## Laboratorios

- **Comparación artística.** La vista Paleontología permite recorrer materiales, fósiles menores, archivo, montajes y propuestas. Cada montaje usa su receta real, existencias simuladas y cuatro fases. El revelado reutiliza la misma imagen esquelética y permite alternar con la interpretación en vida.
- **Inclusiones.** El laboratorio independiente permite revisar el inventario, combinar equipamiento, consultar muestras, explorar rutas y trueques, simular el progreso del álbum y recorrer las cinco salas del Museo. El registro contiene las 300 piezas de álbum, 59 ideas y ocho interpretaciones complementarias. Guarda decisiones y observaciones con `atlas-laboratorio-inclusiones:v1` y exporta JSON. La evaluación artística conserva su propia clave.
- **Cartografía.** El Archivo lee las recetas vigentes. Asia, África, Sudamérica y Oceanía usan diez partes; Norteamérica y regiones polares usan ocho. Las cinco fases visuales y la conservación de los seis mapas al ensamblar el Mapamundi siguen disponibles.

Desde una copia local, abre `www/laboratorio-objetos-cientificos.html` o `www/laboratorio-inclusiones-objetos.html`. Ambos laboratorios comparten el manifiesto y los sprites.

## Archivos, peso y validación

| Resolución | Clásica OBJ-05, media | Inventario OBJ-05, media |
| ---: | ---: | ---: |
| 64 px | 1,94 KiB | 2,03 KiB |
| 128 px | 5,19 KiB | 5,55 KiB |
| 256 px | 15,64 KiB | 14,95 KiB |
| 512 px | 52,81 KiB | 45,08 KiB |

OBJ-05 añade **400 WebP transparentes y 6,99 MiB**. El conjunto tiene **1.424 WebP y 23,83 MiB**. Las [maestras](maestras-obj-05) y el [plan de recorte](obj-05.json) preservan la trazabilidad. Se descartaron dos celdas inadecuadas y se regeneraron el pez fósil y el Spinosaurus en vida, cuya cola quedaba cortada. Se ajustó el alfa residual de la plancha en vida. El Diplodocus y el Pteranodon se separaron con máscaras poligonales para conservar sus extremos. Regeneración con `python docs/objetos-cientificos/preparar-arte.py --obj-05` y `node docs/objetos-cientificos/generar-manifiesto.cjs`.

Se verificaron resolución, canal alfa, márgenes, asociación y peso de los 1.424 WebP. Chromium móvil, con solicitudes externas bloqueadas, comprobó las vistas anteriores, las siete nuevas secciones, las cuatro fases de los ocho montajes, el ensamblaje cartográfico, el progreso del álbum, la persistencia separada y las dos exportaciones. Pasaron **25 pruebas** de las suites ejecutadas. Los **11 fallos históricos** de GM06 y Museo coinciden por nombre con los de OBJ-04.

La aprobación artística sigue pendiente. La siguiente etapa es **OBJ-06 · Gabinete de Botánica**.
