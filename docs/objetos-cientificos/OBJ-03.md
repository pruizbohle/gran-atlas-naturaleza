# OBJ-03 · Materiales animales y de expedición

La etapa parte de `67d86e4` en `experiment/scientific-illustration-objects`. La auditoría inicial confirmó 68 objetos funcionales, 300 coleccionables en 26 colecciones, 403 registros experimentales y 488 WebP de OBJ-01 y OBJ-02. Los WebP existentes se conservaron byte por byte.

## Cobertura

| Conjunto | Conservados | Candidatos nuevos | Pendientes |
| --- | ---: | ---: | ---: |
| Materiales de expedición | 3 | 8 | 0 |
| Materiales animales existentes | 1 | 6 | 0 |
| Materiales animales futuros | 0 | 8 | 20 |

- **Conservados.** Flor prensada, pergamino antiguo, moneda antigua y diente de lobo.
- **Expedición.** Fragmento de mapa, piedra de río pulida, lente pulida, pieza de latón antiguo, tintero antiguo, madera tallada, muestra de huellas y fragmento fósil.
- **Animales.** Pluma de rapaz, fragmento de cornamenta, bigote de nutria, colmillo de jabalí, escama de cola de castor y pluma de garza.
- **Ampliación ilustrada.** Pluma de contorno tropical, restos de plumón, muda seca de serpiente, fragmento de escudo de caparazón, mechón de pelo de guarda, púas desprendidas, fragmento de cáscara moteada y fragmento de sepión.

El [catálogo experimental](materiales-futuros.tsv) registra 28 ideas de materiales animales, que con los siete existentes dan **35 tipos**. Las asociaciones de especies son propuestas editoriales. Las 28 ideas se pueden consultar mediante el filtro OBJ-03 y su ficha individual. Ocho tienen lámina y 20 quedan pendientes. Los conceptos representan hallazgos naturales, moldes, reproducciones o ejemplares históricos conservados.

El manifiesto reúne **431 registros**. Entre los 385 sujetos de inventario, catálogo y Museo que requieren lámina propia, **68 tienen candidato y 317 quedan pendientes**. Las ocho muestras futuras y los siete conceptos de equipamiento ilustrados quedan fuera de esa cuenta. La aprobación artística sigue pendiente.

## Homologación y legibilidad

La [plancha comparativa](materiales-obj-03.webp) muestra la variante clásica y la de inventario a 64 px y miniaturas de inventario a 24 y 32 px. La iluminación superior izquierda y el tratamiento de acuarela y grafito continúan la dirección de OBJ-01 y OBJ-02. Los materiales sueltos usan encuadres sencillos y siluetas de fragmento, muestra o recurso de taller.

| Comparación | Rasgo que permite distinguirla |
| --- | --- |
| Flor prensada y rosa silvestre | La flor funcional tiene corola única y tallo aplanado. La rosa catalogada incluye una rama diagnóstica con hojas y botón. |
| Moneda antigua y penique victoriano | La pátina verdosa y el canto irregular distinguen la moneda funcional del disco cobrizo y regular. El detalle del relieve se aprecia mejor desde 64 px. |
| Piedra de río y gema | Perfil rodado, superficie mate y veta opaca frente a cristal, aristas y facetas naturales. |
| Lente y gema | Contorno elíptico regular, transparencia del vidrio y bisel continuo frente a la masa opaca y el reflejo del ópalo. El bisel se aprecia mejor desde 32 px. |
| Fragmento y carta cartográfica | Una esquina rasgada y costa incompleta frente a la extensión, los pliegues y el trazado de la carta. |
| Muestra de huellas y huella fosilizada | La muestra es un vaciado claro de yeso con una pisada reciente. El laboratorio muestra el SVG de la huella fósil como referencia en tanto llega OBJ-05. El fragmento fósil usa matriz estratificada con una impronta parcial, y servirá de referencia para esa etapa. |
| Diente, colmillo y cornamenta | La raíz estrecha y la punta del diente difieren de la curva gruesa y la base hueca del colmillo. La bifurcación distingue la cornamenta. |
| Plumas y filamentos | El bandeado pardo de la rapaz y el perfil azul grisáceo de la garza se leen desde 32 px. Las pestañas de conservación ayudan a localizar el bigote, cuyo filamento se aprecia mejor a 64 px. |

## Laboratorio

En **Materiales acumulables**, las 18 fichas muestran 1, 5, 25, 100, 500 o 1.000 unidades. El selector permite usar cantidades variadas o aplicar un valor a las fichas visibles. El contador se ubica arriba a la derecha, fuera del área ilustrada, y el nombre queda debajo del sprite. Esto mantiene estable el encuadre al cambiar la cantidad.

En **Taller de fabricación**, las 22 recetas de taller se pueden consultar visualmente. El selector permite abrir directamente la brújula, los prismáticos, el sombrero académico, el catalejo, el abrigo polar o el medallón de ámbar. Cada flujo muestra materiales ilustrados, fabricación simulada y resultado. Las cantidades requeridas se toman de las recetas existentes. Las disponibles son ficticias y los faltantes se calculan por ingrediente. En móvil el flujo se apila verticalmente.

**Familias y evolución** incorpora seis grupos de materiales y un grupo con las ocho muestras futuras. La revisión individual conserva el SVG original donde existe, ambas variantes científicas, las seis escalas, los fondos, los halos y las evaluaciones exportables.

## Archivos y validación

| Resolución | Clásica OBJ-03, media | Inventario OBJ-03, media |
| ---: | ---: | ---: |
| 64 px | 2,24 KiB | 2,33 KiB |
| 128 px | 5,99 KiB | 6,42 KiB |
| 256 px | 18,75 KiB | 17,66 KiB |
| 512 px | 58,88 KiB | 49,37 KiB |

OBJ-03 añade **176 WebP transparentes y 3,47 MiB**. Las tres etapas reúnen **664 WebP y 11,64 MiB**. Las maestras RGBA se conservan en [maestras-obj-03](maestras-obj-03), fuera de la carga del laboratorio. El [plan de recorte](obj-03.json) vincula cada celda con su ID. Para reproducir los derivados, ejecutar `python docs/objetos-cientificos/preparar-arte.py --obj-03` y luego `node docs/objetos-cientificos/generar-manifiesto.cjs`.

Se verificaron las dimensiones, el canal alfa, los márgenes y la asociación de los 664 WebP. El generador valida los 68 objetos funcionales, los 300 coleccionables, los IDs únicos y los seis ejemplos de receta. Chromium móvil, con solicitudes externas bloqueadas, verificó las seis escalas, la navegación, los filtros, los seis valores de existencias con un mismo sprite, los faltantes de las seis recetas, las vistas previas, la persistencia y la exportación JSON.

**Resultados de regresión.** Pasaron 25 pruebas. Los 11 fallos se reprodujeron con los mismos nombres que en OBJ-02 y corresponden a las suites históricas GM06 y Museo. Se mantiene la rama experimental como punto de revisión.

La siguiente etapa es **OBJ-04 · Cartografía y mercancías regionales**.
