# OBJ-07 · Gabinete de Geología

La etapa parte de `73c1fbd` en la rama experimental. La auditoría confirmó 68 objetos funcionales, 300 coleccionables, 26 colecciones, 461 registros, 190 láminas principales y 33 conceptos o complementos ilustrados. Los 1.784 WebP anteriores se conservaron byte por byte.

| Colección | Conservados | Nuevos | Cobertura |
| --- | ---: | ---: | ---: |
| Piedras preciosas | 2 | 10 | 12 de 12 |
| Minerales extraordinarios | 1 | 11 | 12 de 12 |
| Ámbar y resinas fósiles | 1 | 11 | 12 de 12 |
| Meteoritos | 1 | 11 | 12 de 12 |
| Rocas y formaciones geológicas | 0 | 12 | 12 de 12 |

Se conservaron la esmeralda colombiana, el ópalo negro, la obsidiana negra, el ámbar azul dominicano y el meteorito de Gibeon. El total es **160 de 300 coleccionables** y **245 de 385 láminas principales**. La cobertura por gabinete queda en Botánica **48/48**, Geología **60/60**, Oceanografía **11/60**, Historia **15/72** e Historia natural y exploración **26/60**. Inventario y Museo conservan **68/68** y **17/17** láminas propias.

## Planchas

- [Plancha general · 60 piezas](geologia-general-obj-07.webp)
- [Piedras preciosas](geologia-gemas-obj-07.webp)
- [Minerales extraordinarios](geologia-minerales-obj-07.webp)
- [Ámbar y resinas fósiles](geologia-resinas-obj-07.webp)
- [Meteoritos](geologia-meteoritos-obj-07.webp)
- [Rocas y formaciones geológicas](geologia-rocas-obj-07.webp)

Las planchas individuales comparan clásica e inventario a 64 px y muestran también la variante de inventario a 24 y 32 px. La plancha general usa inventario a 64 px. La escala es relativa al álbum. Hoba se representa como modelo de una masa de unas 60 toneladas y las formaciones de Antrim y Pamukkale como modelos estructurales reducidos. Las demás muestras se encuadran como ejemplares de mano o fragmentos. [Hoba, Meteoritical Bulletin](https://www.lpi.usra.edu/meteor/metbull.php?code=11890) · [Antrim, UNESCO](https://whc.unesco.org/en/list/369/) · [Pamukkale, UNESCO](https://whc.unesco.org/en/list/485/)

## Homologación y fichas científicas

Las [60 fichas científicas](fichas-geologia.tsv) se incorporaron al manifiesto con clasificación, composición, hábito o estructura, rasgo documentado, contexto histórico, observación artística y fuente. Nombre, procedencia, rareza, puntos e ID provienen del catálogo existente. La obsidiana está clasificada como vidrio volcánico, el lapislázuli como roca ornamental y el ópalo como mineraloide. Los tres permanecen en sus colecciones editoriales. [Obsidiana, National Park Service](https://home.nps.gov/articles/archeology-obsidian-mvp-yellowstone-stones.htm) · [Handbook of Mineralogy](https://www.handbookofmineralogy.org/) · [Rocas, British Geological Survey](https://www.bgs.ac.uk/discovering-geology/rocks-and-minerals/)

- **Gemas y minerales.** El cuarzo rosa es masivo, la amatista se ve en drusa y el granate en cristal natural sobre matriz. La pirita se reconoce por planos cúbicos y brillo metálico, la fluorita por cubos intercrecidos, la calcita por el romboedro y la vivianita por hojas cristalinas alargadas.
- **Resinas, ámbar y pigmentos.** La resina reciente mantiene corteza vegetal. El copal se documenta como resina de maduración parcial, cuya edad requiere más evidencia que su apariencia. Se diferencian ventanas translúcidas, velos opacos e inclusiones. El ámbar azul conserva un cuerpo cálido con coloración óptica superficial. Las láminas minerales se distinguen de los pigmentos de OBJ-06 por la forma de muestra y la ausencia de trazo preparado. [Fluorescencia del ámbar azul, GIA](https://www.gia.edu/gems-gemology/summer-2014-liu-color-phenomena-blue-amber)
- **Meteoritos, rocas y fósiles.** El relieve de la muestra metálica, la corteza de fusión, los cóndrulos y el olivino en metal ayudan a separar las tres familias meteóricas. La ficha de Gibeon distingue el fragmento en bruto de los patrones de Widmanstätten que se estudian en sección. Los fósiles conservan improntas o hueso. En las rocas se distinguen columna, clivaje en láminas, porosidad, clastos y bandas. Un canto rodado conserva su perfil redondeado.
- **Cristales y lente pulida.** La lente mantiene un perfil regular de disco. La calcita presenta caras de clivaje oblicuas y una sugerencia gráfica de doble imagen. La aguamarina y el cuarzo alargan el volumen con caras prismáticas y terminaciones reconocibles.

Ocho meteoritos quedan marcados como **posteriores a 1842** por su caída o hallazgo documentado. Son Nantan (1958; atribución a 1516 incierta), Allende y Murchison (1969), Cheliábinsk (2013), Sikhote-Alin (1947), Fukang (2000), Hoba (1920) y ALH 84001 (1984). Ensisheim (1492), Campo del Cielo (1576), Imilac (1822) y Gibeon (1836) tienen antecedentes previos a 1842. Kimberlita de Kimberley también se presenta como futura en el contexto de los hallazgos de la década de 1870. Las fechas modernas son metadatos documentales. [Meteoritical Bulletin Database](https://www.lpi.usra.edu/meteor/metbull.php) · [Kimberlitas, GIA](https://www.gia.edu/gems-gemology/summer-2019-kimberlites-earths-diamond-delivery-system)

El cotejo de hábitos finos, transparencias e inclusiones queda pendiente de aprobación. A 24 y 32 px, calcita y cuarzo, meteoritos pétreos oscuros y algunos terrones dependen mucho de la silueta y la matriz. Se distinguen mejor a 64 px o más. Los cóndrulos y las vetas se comprobaron visualmente a 128 px. Se eliminaron guías residuales mediante recortes y ajustes localizados del alfa. Las [maestras RGBA](maestras-obj-07) y el [plan de recorte](obj-07.json) documentan el proceso. Regeneración con `python docs/objetos-cientificos/preparar-arte.py --obj-07` y `node docs/objetos-cientificos/generar-manifiesto.cjs`.

## Laboratorios

El **Gabinete de Geología** del laboratorio artístico compara las cinco colecciones y seis grupos de muestras semejantes. Mantiene fondos, halos, seis escalas, ambas variantes, observaciones y exportación JSON. En **Álbum → Geología**, el laboratorio de inclusiones muestra progreso por gabinete y colección, rareza, puntos, procedencia, obtención, ficha científica y simulación de descubrimientos. Las fichas permiten abrir muestras semejantes. Las evaluaciones existentes se conservan.

La sección **Exhibición de colecciones** ofrece las nueve colecciones de Botánica y Geología, cinco porcentajes de progreso y tres presentaciones. El álbum usa papel, el gabinete usa compartimentos y la vitrina usa un fondo oscuro con iluminación mediante CSS. Las tres reutilizan los sprites y el progreso de prueba de la exhibición es independiente del álbum.

## Peso y validación

| Resolución | Clásica OBJ-07, media | Inventario OBJ-07, media |
| ---: | ---: | ---: |
| 64 px | 1,97 KiB | 2,07 KiB |
| 128 px | 5,28 KiB | 5,64 KiB |
| 256 px | 16,64 KiB | 14,36 KiB |
| 512 px | 47,50 KiB | 36,87 KiB |

OBJ-07 añade **440 WebP transparentes y 7,00 MiB**. El conjunto suma **2.224 WebP y 36,85 MiB**. Se verificaron IDs únicos, dimensiones, alfa, peso y asociaciones. Chromium móvil con solicitudes externas bloqueadas comprobó ambas vistas de gabinete, las seis escalas, descubrimientos de las cuatro rarezas, las tres exhibiciones, persistencia y exportaciones. Pasaron **25 pruebas** de las suites ejecutadas y se reprodujeron los **11 fallos históricos** de GM06 y Museo de OBJ-06.

La aprobación artística queda pendiente. La siguiente etapa es **OBJ-08 · Gabinete de Oceanografía**.
