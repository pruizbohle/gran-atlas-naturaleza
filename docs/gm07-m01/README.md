# El Gran Atlas 3.45.0 · Cierre GM-07-M01

Entrega final autorizada para integrar en main, basada en 3.44.0 (2e0535d149ff9fd574397b78dc09bba31d16f7f3).

El segundo JSON del usuario contiene **31 aprobaciones y una observación**: las manchas del cuscús moteado se superponían a cabeza y patas. Se reordenaron las capas para pintar las manchas antes de esas siluetas. Cambian únicamente sus versiones normal y Notable respecto de M01-R2; las otras 68 rutas aprobadas permanecen idénticas. La autorización del usuario permite aplicar esta corrección e integrar, sin una tercera ronda de aprobación.

La corrección queda identificada como «resuelta»; no se atribuye una aprobación humana nueva al dibujo corregido. Se conservan ambos JSON originales y los hashes de las propuestas revisadas.

## Balance

| Dato | 3.44.0 | 3.45.0 |
| --- | ---: | ---: |
| Especies | 997 | 997 |
| Regiones | 125 | 125 |
| Asociaciones zoológicas | 1.829 | 1.829 |
| Registros del lote | 32 | 32 |
| Normales pulidos frente a 3.44.0 | — | 30 |
| Originales conservados | — | 2 |
| Rutas configuradas del lote | 70 | 70 |
| Especies ajenas intactas | — | 965 |

Los dos originales conservados son Zarigüeya común (*Didelphis marsupialis*) y Wómbat común (*Vombatus ursinus*). Las otras 30 láminas y sus variantes se enumeran a continuación. El lote reúne 29 marsupiales y tres monotremas, con familias contrastadas independientemente con MDD 2.5.

## Entrega

- [Laboratorio final autónomo](../../www/laboratorio-marsupiales-monotremas.html): original 3.44.0, M01-R2 y versión final; filtros y exportación opcional para revisiones posteriores.
- [Informe visual autónomo](informe-m01.html).
- [Inventario y justificaciones CSV](audit/review-ledger.csv).
- [Autorización y resolución final](audit/final-approval.json).
- [Primera revisión recibida](reviews/2026-11-18-original.json) y [segunda revisión recibida](reviews/2026-11-18-r2-original.json).
- [Manifiesto de la versión web](release-manifest.json).

## Inventario y justificación individual

| Nombre e ID | Familia | Decisión final | Justificación |
| --- | --- | --- | --- |
| Zarigüeya común · *Didelphis marsupialis*<br>`na_esp_didelphis_marsupialis` | Didelphidae | Aprobada por el usuario | Se conserva íntegra la lámina original, con hocico alargado, orejas, cuatro miembros y cola desnuda prensil. Se confirma Didelphidae/Marsupialia independientemente del subgrupo histórico «Otros mamíferos». |
| Zarigüeya de Virginia · *Didelphis virginiana*<br>`na_esp_didelphis_virginiana` | Didelphidae | Aprobada por el usuario | Se responde a la duda de distinción: la primera propuesta compartía geometría con D. marsupialis y solo cambiaba de tono. La nueva lámina muestra cabeza blanco grisácea, hocico rosado, orejas desnudas oscuras y pelaje entrecano con pelos de guarda; manos y cola prensil tienen detalle. La coloración varía entre poblaciones y no constituye por sí sola una clave taxonómica. |
| Zarigüeya listada · *Dactylopsila trivirgata*<br>`oc_esp_dactylopsila_trivirgata` | Petauridae | Aprobada por el usuario | Se alarga el cuerpo en una postura de avance sobre la rama, en lugar del torso circular sentado. Se conservan las bandas longitudinales negras, el extremo claro de la cola y el dedo anterior alargado. |
| Mulgará de cola crestada · *Dasycercus cristicauda*<br>`oc_esp_dasycercus_cristicauda` | Dasyuridae | Aprobada por el usuario | Se elimina la banda ventral que sobresalía bajo las patas. El vientre claro queda dentro del abdomen y detrás de las extremidades; se conservan el hocico, la cola gruesa y su cresta negra. |
| Quol oriental · *Dasyurus viverrinus*<br>`oc_esp_dasyurus_viverrinus` | Dasyuridae | Aprobada por el usuario | Se corrige el orden de las capas y se recoge el color ventral dentro del torso, sin una línea flotante bajo las patas. Se conservan las manchas blancas y la cola sin manchas. |
| Canguro arborícola de Goodfellow · *Dendrolagus goodfellowi*<br>`oc_esp_dendrolagus_goodfellowi` | Macropodidae | Aprobada por el usuario | Postura arborícola baja, brazos robustos, pies y manos de agarre, cola larga descendente. Se conservan el pardo rojizo y las dos bandas claras longitudinales del dorso; la cola muestra bandas suaves. |
| Canguro arborícola de Lumholtz · *Dendrolagus lumholtzi*<br>`oc_esp_dendrolagus_lumholtzi` | Macropodidae | Aprobada por el usuario | Cara y manos oscuras, pelaje gris pardo, orejas redondeadas y extremidades robustas. La cola cae como contrapeso; las manos abrazan el apoyo. No es un canguro terrestre recoloreado. |
| Canguro arborícola de Matschie · *Dendrolagus matschiei*<br>`oc_esp_dendrolagus_matschiei` | Macropodidae | Aprobada por el usuario | Cuerpo castaño, cara y extremidades claras, cola amarillenta sin anillos y ausencia de las dos bandas claras de Goodfellow. Piernas cortas y brazos capaces de trepar, con dedos y garras visibles. |
| Canguro gris occidental · *Macropus fuliginosus*<br>`oc_esp_macropus_fuliginosus` | Macropodidae | Aprobada por el usuario | Se mantiene el tono pardo grisáceo y la cara más oscura. Se modelan el torso, muslo y hocico y se añaden dedos, pliegues y textura siguiendo la anatomía, sin usar manchas inventadas. |
| Canguro gris oriental · *Macropus giganteus*<br>`oc_esp_macropus_giganteus` | Macropodidae | Aprobada por el usuario | Se conserva el gris, el mentón claro y la nariz oscura. Se perfilan cuello, vientre, masa del muslo, corvejón y pie largo; las orejas dejan de dominar toda la cabeza. |
| Bilbi mayor · *Macrotis lagotis*<br>`oc_esp_macrotis_lagotis` | Thylacomyidae | Aprobada por el usuario | Se mantienen las orejas largas, pero con interior rosado y unión natural al cráneo. Hocico largo fino, pelaje gris azulado, muslo, garras de excavación y cola fina con tramo oscuro y extremo blanco. |
| Numbat · *Myrmecobius fasciatus*<br>`oc_esp_myrmecobius_fasciatus` | Myrmecobiidae | Aprobada por el usuario | Hocico estrecho, raya ocular, cola tupida y bandas claras concentradas en la parte posterior del cuerpo. Se conserva el volumen y se recuperan patas y garras; no se usan bandas iguales por todo el torso. |
| Ualabí ágil · *Notamacropus agilis*<br>`oc_esp_notamacropus_agilis` | Macropodidae | Aprobada por el usuario | Constitución esbelta, orejas con puntas oscuras, línea clara de mejilla y marca lateral de cadera. Muslo, corvejón, pies y brazos tienen contorno y sombreado propios del macrópodo. |
| Ualabí de Tammar · *Notamacropus eugenii*<br>`oc_esp_notamacropus_eugenii` | Macropodidae | Aprobada por el usuario | Se reduce el predominio de las orejas y se da una constitución más compacta. Se conservan el pelaje pardo gris y el vientre claro; pies largos, manos pequeñas y cola proporcionada. |
| Ualabí de Bennett · *Notamacropus rufogriseus*<br>`oc_esp_notamacropus_rufogriseus` | Macropodidae | Aprobada por el usuario | Se mantiene el cuello y hombro rojizo sobre el cuerpo gris. Se pulen la mandíbula clara, la masa del muslo, el pie oscuro y la postura; no se cambia la identidad ni se añade una variante. |
| Ornitorrinco · *Ornithorhynchus anatinus*<br>`oc_esp_ornithorhynchus_anatinus` | Ornithorhynchidae | Aprobada por el usuario | Redibujo completo con cuerpo bajo y pelaje castaño, cola ancha aplanada con textura de pelo, pico gris de borde y narinas visibles separado de la cara, ojos pequeños y patas palmeadas con dedos y uñas. |
| Canguro rojo · *Osphranter rufus*<br>`oc_esp_osphranter_rufus` | Macropodidae | Aprobada por el usuario | Orejas proporcionadas a la cabeza, hocico más fino, tórax y muslo con volumen, brazos cortos articulados y cola larga de apoyo. Paleta rojiza representativa; se mantienen la cara clara y los detalles de pelaje. |
| Petauro mayor · *Petauroides volans*<br>`oc_esp_petauroides_volans` | Pseudocheiridae | Aprobada por el usuario | Prioridad: orejas grandes con borde peludo, hocico corto, cuerpo de pelaje abundante y cola larga tupida no prensil. Postura apoyada; el pliegue de planeo corresponde al costado entre codo y rodilla, sin copiar el planeo del petauro del azúcar. |
| Petauro del azúcar · *Petaurus breviceps*<br>`oc_esp_petaurus_breviceps` | Petauridae | Aprobada por el usuario | Cuerpo más pequeño y esbelto, orejas finas con interior desnudo, máscara y raya dorsal oscuras. Membrana plegada entre muñeca y tobillo; cola y volumen de pelaje menores que en el petauro mayor. |
| Ualabí de roca de Mareeba · *Petrogale mareeba*<br>`oc_esp_petrogale_mareeba` | Macropodidae | Aprobada por el usuario | Orejas moderadas, cara con líneas claras, pie de apoyo y cola con extremo oscuro. Se mejora el volumen y la articulación de las patas; la lámina no pretende ser una clave exhaustiva de los Petrogale próximos. |
| Cuscús común · *Phalanger orientalis*<br>`oc_esp_phalanger_orientalis` | Phalangeridae | Aprobada por el usuario | Se incorpora el comentario aunque la ficha estaba marcada aprobada: espalda y abdomen más alargados, con transición hacia el hombro. Se conservan cara corta, pelaje lanoso y cola prensil con zona distal desnuda. |
| Koala · *Phascolarctos cinereus*<br>`oc_esp_phascolarctos_cinereus` | Phascolarctidae | Aprobada por el usuario | Redibujo completo: cuerpo robusto con volumen y textura, orejas grandes de borde peludo, nariz negra alargada, mejillas claras y ojos diferenciados. Brazos y manos se aferran a la rama con dedos y garras visibles; no se añade cola. |
| Demonio de Tasmania · *Sarcophilus harrisii*<br>`oc_esp_sarcophilus_harrisii` | Dasyuridae | Aprobada por el usuario | Se alarga el torso en perfil y el hocico, manteniendo cuello y mandíbula robustos, orejas redondeadas, mancha pectoral y cola de base gruesa. |
| Quokka · *Setonix brachyurus*<br>`oc_esp_setonix_brachyurus` | Macropodidae | Aprobada por el usuario | Se conserva el lomo arqueado, pero se corrigen cabeza, orejas redondas, brazos muy cortos y cola relativamente corta. Muslo y pie definidos sin una expresión facial humana añadida. |
| Cuscús moteado · *Spilocuscus maculatus*<br>`oc_esp_spilocuscus_maculatus` | Phalangeridae | Corrección resuelta | Se pintan las manchas del torso antes de las patas, las orejas y la cabeza. Las siluetas delanteras cubren el patrón y conservan sus colores; no cambia ninguna de las otras 31 ilustraciones. |
| Equidna de hocico corto · *Tachyglossus aculeatus*<br>`oc_esp_tachyglossus_aculeatus` | Tachyglossidae | Aprobada por el usuario | Cuerpo abombado, hocico tubular corto, patas fuertes y garras. Las espinas son finas, oblicuas y distribuidas siguiendo el dorso, con puntas claras y pelo entre ellas; se elimina el efecto de peine. |
| Pademelón de Tasmania · *Thylogale billardierii*<br>`oc_esp_thylogale_billardierii` | Macropodidae | Aprobada por el usuario | Se redibuja el tronco en forma de pera: hombros y cuello estrechos, cabeza pequeña y grupa ancha. Se mantienen patas posteriores potentes, orejas cortas, cola y vientre rojizo; se evita el torso circular. |
| Possum cola de cepillo · *Trichosurus vulpecula*<br>`oc_esp_trichosurus_vulpecula` | Phalangeridae | Aprobada por el usuario | Se alarga el torso y se marca el hombro sin una forma circular. Se conservan orejas apuntadas, hocico más largo que el de los cuscús, pecho claro y cola oscura tupida. |
| Wómbat común · *Vombatus ursinus*<br>`oc_esp_vombatus_ursinus` | Vombatidae | Aprobada por el usuario | Se conserva íntegro el original, superior a la candidata masiva: cuerpo compacto con luces y sombras, cabeza robusta, patas cortas y garras. Se mantiene también su variante albina original. |
| Ualabí de pantano · *Wallabia bicolor*<br>`oc_esp_wallabia_bicolor` | Macropodidae | Aprobada por el usuario | Se conserva el pelaje oscuro con zonas de pecho y mejilla cálidas. Se modelan cuerpo robusto, cabeza, pie y cola; los detalles siguen visibles dentro de la paleta oscura. |
| Equidna de hocico largo oriental · *Zaglossus bartoni*<br>`oc_esp_zaglossus_bartoni` | Tachyglossidae | Aprobada por el usuario | Rostro largo curvado hacia abajo, cuerpo más alto, extremidades visibles y abundante pelo oscuro entre espinas menos expuestas. Difiere de Tachyglossus en anatomía y textura, no solo en color. |
| Monito del monte · *Dromiciops gliroides*<br>`gm06_dromiciops_gliroides` | Microbiotheriidae | Aprobada por el usuario | Redibujo completo: cuerpo pardo pequeño con pelaje, cara clara, grandes ojos rodeados de anillos oscuros, orejas redondeadas y manos de agarre. La cola está cubierta de pelo, salvo la pequeña superficie desnuda de agarre distal; no es una cola de roedor desnuda. |

## Funcionamiento y aislamiento

El módulo js/gm07-m01/art.js se carga una sola vez después de GM06 y antes del motor. El adaptador se limita a los 32 identificadores del lote. Se mantiene la configuración de catálogo, mapas, economía, progresión, Campamento, inventario, Museo, Sociedad y coleccionables. No se integra el candidato mundial masivo ni la rama de coleccionables.

Hay 32 normales, 32 Notables, cuatro Albinos, un Épico y un Excepcional. Frente a 3.44.0 cambian 65 rutas y se conservan cinco. No se añaden variantes. La copia de seguridad informa versión 3.45.0; el resto de su código permanece idéntico. Los recursos M01, el laboratorio y el actualizador seguro se incluyen en la caché offline nueva.

## Verificaciones

- 12 pruebas específicas del motor y de integración: catálogo, todas las rutas gráficas, variantes, guardados, progreso offline, procedencia, entrada pública, versión y conservación de Android.
- Solo las dos rutas del cuscús moteado cambian respecto de M01-R2; se preservan las 68 rutas de las otras 31 especies aprobadas.
- Las 2.743 rutas configuradas de las 965 especies ajenas a M01 coinciden exactamente con 3.44.0; la comparación raster de los 965 normales no detecta píxeles distintos.
- Las 70 rutas del lote se renderizan y validan como SVG. Se mantienen probabilidades, rarezas, dimorfismos y descubrimientos.
- Laboratorio probado a 320, 360, 390, 412 y 1.280 px: comparación, ampliación, filtros, decisiones, exportación de 32 registros y funcionamiento offline sin acceso a la partida.
- Actualización PWA auténtica 3.44.0 → 3.45.0: copia exacta de la partida, bloqueo con otra ventana abierta, conservación de campos y trabajos pendientes, arte M01 en el Bestiario real y recarga offline.
- La validación de release conserva la cadena histórica en worktrees de sus commits originales y ejecuta las comprobaciones actuales de M01 y continuidad. El registro de ejecución está en checks/release-final.log.

No se genera una APK ni se altera la firma, identidad o configuración Android. Las pruebas móviles usan Chromium con distintos tamaños de pantalla; no son una validación de Android físico.

## Reproducción

```sh
node scripts/capture-gm07-m01.cjs
node scripts/finalize-gm07-m01.cjs
node scripts/build-gm07-m01-lab.cjs
node scripts/build-gm07-m01-release.cjs --write
npm run release:verify
node scripts/test-gm07-m01-browser.cjs
node scripts/check-gm07-m01-pwa.cjs
node scripts/raster-gm07-m01.cjs
node scripts/boards-gm07-m01.cjs --candidate --final
node scripts/visual-checks-gm07-m01.cjs
node scripts/document-gm07-m01.cjs
```

Las comprobaciones de navegador requieren Playwright y Chromium. Las revisiones R1 y R2 permanecen congeladas en revisions/. La candidata mundial se conserva en reference/ y en su worktree separado. M02 no se inicia automáticamente.
