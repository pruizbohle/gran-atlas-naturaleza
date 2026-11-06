# El Gran Atlas 3.19.2b · pulido del herpetario

Revisión gráfica de las **45 especies del catálogo** que utiliza el motor de herpetología, distribuidas en **22 familias visuales**. El laboratorio añade **8 referencias anatómicas** solicitadas para revisar rasgos ausentes del catálogo: 53 dibujos y 23 familias en total. El catálogo del juego conserva sus 393 especies y sus identificadores.

## Cambios visibles

| Grupo | Especies del catálogo | Refinamiento |
| --- | ---: | --- |
| Ranas | 1 | Muslos plegados, brazos articulados, dedos separados, cabeza continua. Morfologías robusta y acuática para goliat y Xenopus en las referencias. |
| Sapos | 2 | Cintura escapular y caderas integradas, glándulas parótidas, postura compacta y manchas seleccionadas. Franja dorsal del corredor; morfología corta de la rana de lluvia. |
| Salamandras y tritones | 8 | Contorno continuo de cola a hocico; patas pequeñas con dedos unidos; cresta del tritón y cabeza aplanada de Andrias. Manchas de la común compatibles con variantes. |
| Tortugas | 6 | Bóveda terrestre, perfil bajo semiacuático y aletas marinas. La laúd tiene caparazón sin placas poligonales, crestas longitudinales y aletas curvadas. |
| Serpientes | 11 | Contornos cerrados y colas ahusadas; cabeza integrada. Capuchas diferentes para cobra india y real, víboras robustas, pitones musculosas y bandas que siguen al krait. La mamba de referencia tiene un perfil delgado propio. |
| Lagartos y varanos, incluidos ápodos | 7 | Miembros con articulaciones y dedos conectados; Komodo de torso pesado y Bengala de cuello más largo. Cola con escotaduras en Uromastyx; oído y párpado del lución. |
| Gecos | 3 | Cabeza ancha, ojo grande y dedos con almohadillas; particularidades tokay, diurnas y palmeadas. Cola foliar curva en la referencia Uroplatus. |
| Camaleones | 3 | Cola espiral cerrada, pelvis continua y patas de agarre. Cuernos de Jackson y casco de Parson en referencias; patrón transversal del pantera. |
| Cocodrilos | 3 | Cola continua, patas laterales, escudos discretos y hocico estrecho proporcionalmente más largo. |
| Dragones voladores | 1 | Membranas curvas conectadas a los flancos, radios de soporte y extremidades por delante del patagio. |

Especial atención: rana bermeja, goliat y de uñas africana; sapos corredor y mongol y rana de lluvia; salamandras común, alpina y gigante china; tritón crestado; laúd y radiada; cobras india y real; krait; Komodo y Bengala; tokay, diurno y cola de hoja; camaleones pantera, Jackson y Parson; cocodrilo de hocico estrecho y dragón volador común.

## Compatibilidad

Se conservan `renderHerp`, `classifyHerp`, `ATLAS_HERP_ART_V3192`, `data-herp-family` y `viewBox="0 0 100 100"`. La integración utiliza `globalThis` protegido y funciona sin `window` en Node. No cambian reglas, guardado, especies, avistamientos, investigaciones, economía ni regiones.

La clasificación usa palabras completas: las tres musarañas y la liebre ibérica dejan de ser capturadas por «rana» y recuperan sus ilustraciones de mamífero. El lagarto cabeza de sapo sigue siendo lagarto; el pez cabeza de serpiente conserva el motor de peces. Para las otras 344 especies se compara el SVG de las cuatro coloraciones con la versión anterior, sin diferencias.

Contornos principales de 2,6 unidades, detalles interiores más finos y sin filtros ni dependencias de renderizado. Los 53 SVG normales ocupan entre 812 y 2808 bytes (media 1939). La geometría se conserva entre coloraciones.

El laboratorio no lee `localStorage`. Ofrece comparación 3.19.2/3.19.2b, siluetas sin marcas internas, tamaños exactos 56/80/120 px, coloraciones y filtro por familia. La copia anterior se carga exclusivamente en el laboratorio. Sus datos se regeneran con:

```sh
node scripts/herp-lab-specimens.cjs
node scripts/herp-lab-specimens.cjs --check
```

La caché cambia a `gran-atlas-v3.19.2b-herpetologia-1` e incluye los recursos del laboratorio. La recuperación sin red ignora el sufijo de versión al buscar recursos precargados. No elimina partidas ni cambia su clave.

## Validación

```sh
node --check www/js/herp-art-v3192.js
node --check www/js/app.js
node --check www/js/mobile-ui.js
node --check www/js/save-manager.js
node --check www/sw.js
node --test tests/*.test.cjs
```

Resultado local: **124 pruebas correctas, 0 fallos, 0 omitidas**; se conservan las 117 pruebas previas y se añaden 7 de regresión.

Comprobación adicional en Chromium: 53 SVG parseados como XML, trazados de longitud finita y geometría dentro del viewBox; controles, tamaños y coloraciones; móvil de 390 px sin desbordamiento; motor 3.19.2b presente en Bestiario y Cuaderno; juego y laboratorio abiertos sin red después de precargar; conservación de 123 avistamientos, £4465 y prestigio 4 en una partida de prueba aislada. Sin errores de navegador. Revisión de conectividad sobre siluetas rasterizadas a 400 px: ningún componente anatómico separado.

El workflow de publicación existente se conserva. El estado publicado debe comprobarse en la ejecución de `Deploy El Gran Atlas` correspondiente al commit, sin inferirlo de las pruebas locales.

## Límites artísticos

Se mantiene la simplificación necesaria para 56 px: no se representan todas las escamas, placas marginales ni diferencias finas entre especies del mismo género. Algunas especies próximas comparten una morfología base, con rasgos seleccionados. Los dedos y marcas muy finos se aprecian mejor a 80–120 px. La comprobación móvil usa Chromium; no sustituye la revisión de una APK en un dispositivo Android físico. No se incorporan especies nuevas ni nuevas variantes.
