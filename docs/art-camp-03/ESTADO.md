# ART-CAMP-03 · Continuidad

Rama `art-camp-03` desde ART-CAMP-02 `d3deb113ea0a0b5b3c546e65cd555f5e5c8751c3`. La punta remota de MEC-09D es `d7cc4cb30b44656f922c2413a020ea93ee03c989` y ya está en la historia de la rama.

La revisión de los adjuntos, la carpeta compartida, la biblioteca y las imágenes generadas en el espacio encontró el encargo ART-CAMP-03 y las maestras entregadas de las fases anteriores. Los originales de Astillero I–V y Caravana I–IV no estaban disponibles. El encargo autoriza ilustrar estos nueve IDs.

## Nueve etapas nuevas

Maestras nuevas `shipyard-1-4.png`, `shipyard-5.png` y `caravan-1-4.png`. Las 30 etapas ya tienen archivo. La secuencia naval conserva el acceso por la derecha y amplía muelles, grúa, cobertizo y embarcaciones. La secuencia comercial conserva el carro y añade toldo, convoy y depósito. Dieciocho WebP nuevos, registrados en la PWA. Pasaron las tres pruebas ART-CAMP-02.

## Auditoría de proporciones

Se registró una medida por etapa en [medidas.csv](medidas.csv). Las lecturas se hicieron sobre la variante de 384 px. Las dimensiones físicas son referencias de diseño estimadas a partir de vanos, mobiliario, herramientas, ruedas y aparejos visibles. No se dispone de planos verificados de las edificaciones ilustradas.

Las 21 láminas de ART-CAMP-02 conservan sus píxeles y sus maestras. Las correcciones se aplican al encuadre de cada etapa en la composición. Puertas de unos 2 m, bancos de unos 0,9 m y ruedas de unos 1,1 m ayudan a comprobar que el crecimiento responde a naves, terrazas y equipamiento.

## Homologación

El mapa de 900 px de referencia usa 14,5 px por metro en la fila central y aplica una corrección de profundidad de 0,94, 1 y 1,06 por fila. Cada etapa calcula su tamaño a partir de su propia medida. Las huellas se toman del canal alfa y comparten los puntos de apoyo con el juego. En Astillero el ancla es el punto de llegada del muelle a tierra. Los otros recortes se apoyan en su base central. [Anclas y escala](anclas.json)

Se reproducen las medidas y huellas en el manifiesto con `python scripts/build-art-camp-03.py`.

## Composición provisional

La prueba simultánea de los niveles I, III y V utiliza el fondo anterior como referencia. [Comparativa provisional](composicion-provisional.webp) · [Guía de terreno](guia-terreno.png)

Las seis huellas de nivel V caben simultáneamente. Se comprobaron todos los pares de etapas de sectores distintos y se reservó el corredor central entre el 45 % y el 55 % del ancho. El fondo antiguo deja el Astillero sobre el suelo y ya contiene muelle, excavación y fogón propios. La guía sitúa la ribera bajo los muelles y reserva claros libres para las piezas superpuestas.

## Fondo definitivo

El paisaje se produjo después de la prueba de las seis etapas V. Maestra `maestras/campamento-terreno.png`, 1024 × 1536 px, y WebP `www/img/campamento-art-camp-03.webp`. La curva de la ribera sostiene la capitanía en tierra mientras los pilotes y las embarcaciones ocupan el agua. La franja de tierra natural detrás de Excavaciones reserva espacio para todas las fosas. El camino y los tres cruces conectan los seis claros. [Niveles I, III y V](comparativa-definitiva.webp) · [Plano de nivel V](campamento-v.webp)

## Integración

El juego y el laboratorio usan el fondo definitivo y el mismo manifiesto de las 30 etapas. Se conserva la URL de ART-CAMP-02. El catálogo compara el tamaño inicial y homologado con el mismo recorte. La comparativa presenta I, III y V con el mismo encuadre. La vista de encaje marca huellas alfa, anclas, corredor y colisiones. El Campamento central sigue siendo visual y muestra Fogón en el juego.


## Verificación y publicación

- Cobertura de 30 de 30 etapas, 60 variantes WebP con alfa y un fondo de 1024 × 1536 px. Se verificaron dimensiones, márgenes y huellas SHA-256. Las 21 imágenes ya integradas conservan sus archivos.
- Las 375 parejas de niveles de sectores distintos mantienen sus huellas separadas. Las seis etapas V caben dentro del plano y las 30 huellas dejan libre el corredor central.
- Pasaron 217 pruebas de integración y regresión, incluidas ART-CAMP-02, ART-OBJ-12/13, MEC-02, MEC-09D, PWA y guardado. La prueba del trabajador devolvió los 61 archivos directamente desde la caché con la red desconectada.
- Chromium local a 390 y 1280 px verificó el catálogo, las comparativas, las marcas de huella, la combinación mixta, el zoom y la restauración. Tras recargar una partida de prueba, el mapa y la ficha del Taller III cargaron el mismo WebP. El juego conservó el Campamento central en su etapa visual I.
- Versión 3 de Sites con el catálogo de 30 etapas, despliegue `appgdep_6b0acc482da88191949a2423d3257f0c`. Versión 4 con el fondo definitivo y las comparativas, despliegue `appgdep_6b0acd9ef4d48191ba7714f113548d93`. [Laboratorio privado](https://el-gran-atlas-art-camp-02.muddyroadrunner17.chatgpt.site/art-camp-02/)

El HTML, el manifiesto, el fondo y Puerto científico de 768 px publicados coinciden byte por byte con la revisión de la beta.

| Entrega | Commit |
| --- | --- |
| Nueve etapas | `7f189f78` |
| Auditoría | `0a4580b3` |
| Escala y anclas | `e5b5666a` |
| Composición provisional | `6647c47a` |
| Fondo definitivo | `19652422` |
| Integración y laboratorio | `4e0e1e41` |

La última revisión de continuidad se identifica con `git log -1 --format=%H -- docs/art-camp-03/ESTADO.md`. Próximo paso. Revisar con el usuario el laboratorio publicado y registrar por ID cualquier ajuste artístico solicitado.
