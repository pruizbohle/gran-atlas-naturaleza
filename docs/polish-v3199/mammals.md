# Mamíferos — revisión anatómica 3.19.9

Se revisaron los **269 mamíferos del catálogo**, pertenecientes a **68 familias visuales**. El catálogo actual conserva **16 configuraciones de dimorfismo de mamíferos** (12 históricas y cuatro incorporadas posteriormente). No se modifica ningún registro zoológico, identificador, rareza, sexo, pigmentación o mecánica.

## Problemas y correcciones

La revisión parte del motor utilizado en v3.19.8, no de dibujos de demostración. Se conserva la selección por taxón, cada morfotipo y las proporciones anatómicas por especie. La API y el nombre histórico del módulo permanecen; `data-mammal-polish="3.19.9"` identifica el acabado nuevo.

- Los miembros tenían bases cerradas que parecían piezas prendidas al tronco y los segmentos inferiores se leían como varillas. El nuevo rig separa muslo/rodilla/corvejón y hombro/codo/carpo, dispone otro apoyo para el plano lejano y elimina la línea que cerraba la raíz dentro del tórax. El pie varía entre apoyo digitígrado, plantígrado y pezuña. Se conserva la configuración por proporciones de cada familia.
- Se redibujaron los perfiles de **56 morfotipos** del diccionario anatómico: frentes, hocicos, mandíbulas, cuellos y lomo utilizan curvas continuas, con rostrum corto de félido frente al alargado de cánido y cabeza estrecha de ungulado. Alces, saigas, bisontes y otros taxones conservan sus anatomías particulares. Los perfiles de gaúr, buey almizclero, topi, rinocerontes y otros derivados se ajustaron a las nuevas rutas para no perder sus diferencias.
- Colas de zorro y lobo, larga de félido y gruesa del leopardo de las nieves tienen conexión y curvatura continuas. No se modifica qué cola corresponde a cada especie.
- Osos: transición hombro/cuello/cabeza, pechera y apoyo plantígrado; se conserva la postura frontal del panda.
- Primates: se redibujaron antebrazos, muñecas, nudillos, tarsos y apoyos que terminaban en triángulos. Orangután, gorilas, macacos, babuinos, langures, cercopitecos, sifacas, indris, loris, gálagos y tarsios conservan sus poses y estructuras específicas.
- Pequeños mamíferos: se modelaron grupos de tórax/grupa/cuello de ardillas, marmotas, castores, topillos y lirones; se curvaron los apoyos. Se conservan patas excavadoras, trompas, incisivos, colas y mantos de las familias especializadas. La nariz de la rata topo gigante, antes separada visualmente del hocico, se recolocó dentro del rostro.
- Patagios de murciélagos y ardillas voladoras: continuidad de muñeca y membrana, dedos y bases de apoyos; sin cambiar número de extremidades.
- Pangolines: apoyos curvos y muñeca flexionada, conservando cola y placas. Las escamas no se sustituyen por un animal genérico.
- Delfín y dugongo: rostrum, dorso, pedúnculo caudal y lóbulos horizontales continuos; aletas pectorales con bases curvas. El lobo marino conserva su anatomía y postura, con limpieza de uniones del cuello y mandíbula.
- La limpieza acotada de pequeñas esquinas del contorno mantiene el perfil original del taxón; no sustituye los cambios anatómicos anteriores. Colores, patrones, transformación de pigmentación, halos y emblemas permanecen bajo el mismo sistema.

## Inspección visual y evidencias

Se renderizó y examinó cada una de las 269 especies a **120 px**, en ocho planchas antes/después, y a **56 px**, en cuatro planchas del resultado final. También se examinaron 68 representantes, uno por familia, en cinco planchas comparativas. No se aprueba por el mero hecho de que el XML sea válido.

Durante la inspección se detectaron y corrigieron apoyos demasiado estrechos, raíces que aún parecían piezas superpuestas, perfiles de cabezas todavía rectangulares y la nariz flotante de la rata topo. Se añadió una comparación geométrica que excluye color, ojos, patrones y otros detalles: los **269 contornos anatómicos cambian** frente a la versión anterior y siguen siendo **269 contornos distintos**.

[Comparación de carnívoros](mammals/comparison-carnivores.png) · [Comparación de ungulados y grandes mamíferos](mammals/comparison-ungulates.png) · [Auditoría individual de 269 registros](mammals-audit.json).

Las planchas completas se pueden reproducir desde la raíz mediante `node scripts/review-mammals-polish-v3199.cjs`, con Playwright resoluble. Usan la instantánea controlada de v3.19.8 y el motor de producción actual, sin abrir el juego ni acceder a partidas. `ATLAS_ARTIFACT_DIR` permite elegir salida; por defecto, `/tmp/mammals-v3199`. Los nombres de evidencia de la auditoría corresponden a esa salida. Los IDs de clipping de la comparación anterior se separan para no alterar el dibujo actual.

## Validación técnica

- `node --test tests/mammals-v3194.test.cjs`: 10/10 aprobadas, con los ajustes de integración de versión del trabajo conjunto. Incluye 269 contornos diferentes, 68 familias, variantes, dimorfismo histórico, no captura de otros grupos y coherencia de laboratorios.
- `node --test tests/mammal-polish-v3199.test.cjs`: 3/3 aprobadas. Compara contornos anatómicos anteriores/actuales excluyendo detalle y pintura, comprueba las 16 configuraciones actuales de dimorfismo y asegura que el render no muta registros zoológicos congelados.
- `node --check www/js/mammal-art-v3194.js`: aprobado.

La evaluación de acabados es cualitativa. Las diferencias entre congéneres próximos no se convierten en una promesa de identificación por silueta sin nombre a 56 px. Se mantiene el estilo vectorial del Atlas; no se pretende una ilustración fotográfica. No hay especies omitidas ni dibujos pendientes de inspección a los tamaños indicados. No se ejecutó una APK en dispositivo Android físico en esta revisión.
