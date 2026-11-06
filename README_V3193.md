# El Gran Atlas v3.19.3 · Aviario ilustrado

Revisión artística de **136 aves del catálogo efectivo, 136 taxones y 58 familias visuales**. El catálogo efectivo contiene 487 animales; las ilustraciones de los otros 351 conservan exactamente su resultado anterior. No se añaden ni eliminan especies ni se cambian datos de progresión.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio de aves](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-aves.html) · [Workflow de publicación](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/static.yml)

## Alcance artístico

- Rapaces: águilas, pigargos, águila pescadora, halcones, azores, gavilanes, milanos, busardos, buitres, alimoche, quebrantahuesos y secretaria.
- Rapaces nocturnas: búhos con penachos, búho nival sin penachos, lechuza con disco de corazón y mochuelo compacto.
- Aves pequeñas: petirrojos, collalbas, páridos, pinzones, camachuelos, túrdidos, alondra, ampelis, oropéndola, mosquero, bulbul, picatartes, vanga y tejedor.
- Córvidos: cuervo, arrendajos, urracas y rabilargos con diferencias de pico, cola y proporciones.
- Nadadoras: patos, cisnes, gansos, cormoranes, focha, somormujo y zampullín.
- Ribereñas: garzas, garceta, cigüeñas, grullas, flamencos, ibis, jacana, pelícanos y picozapato.
- Marinas: pingüino, ambos frailecillos, alcatraz en vuelo y ostrero.
- Galliformes: ambos pavos reales, faisanes, monales, tragopán, gallo lira, urogallo, perdices y lagópodos.
- Tropicales y carpinteros: loros, inseparable, seis cálaos, tres turacos, carracas, abejarucos, abubilla, martines pescadores, picapinos y píleo.
- Ratites: avestruces común y somalí.

Se afinaron especialmente el águila real, el águila de las Filipinas, el pigargo de Steller, el halcón peregrino, el quebrantahuesos, la secretaria, los discos faciales de las rapaces nocturnas, el pico del pato cuchara, las velas del mandarín, las crestas de las grullas y monales, las colas de faisanes y galliformes, el abanico de los pavos reales y los cascos de los cálaos. Pingüino, frailecillos, alcatraz y ostrero tienen composiciones propias.

## Arquitectura e integración

`www/js/bird-art-v3193.js` es un módulo independiente sin dependencias. Exporta `classifyBird`, `renderBird` y `BIRD_FAMILIES` para Node; en navegador expone `ATLAS_BIRD_ART_V3193`. El taxón determina primero la familia, después la morfología y por último la paleta. Los contornos principales son curvas continuas; cuerpo, cuello y cabeza no dependen de una elipse y un círculo superpuestos. Se emplean perfiles laterales, frontales y vuelo; varias familias miran a la izquierda.

Se inspeccionaron `spriteFor`, `premiumSpeciesSprite`, `polishedSpeciesSprite`, `sexSpriteMarkup`, `SEXUAL_DIMORPHISM`, `getSpriteMarkup`, los motores históricos asiáticos y africanos, ambos módulos de peces/herpetología, los laboratorios anteriores, estilos, entrada HTML, service worker, pruebas y workflow. La nueva ruta precede a los renderizadores históricos en `spriteFor` y también se aplica dentro de `sexSpriteMarkup`; `getSpriteMarkup` mantiene su caché y los pases originales de coloración. Los motores previos quedan disponibles como respaldo.

El laboratorio reutiliza el mismo módulo artístico y los mismos pases finales de pintura que el juego; una prueba compara literalmente los SVG de ambos. La columna anterior es una copia reproducible del renderizador publicado en el commit `730d6b89098b3eba63e614d0f623b35666861287`, nunca cargada por la entrada del juego. El laboratorio no arranca `app.js` ni accede a partidas. Ofrece tamaños 56/80/120, siluetas negras, búsqueda, filtros de familia, variantes configuradas, sexos existentes y vista compacta.

Se conserva `viewBox="0 0 100 100"`. El SVG más grande medido ocupa 3.317 caracteres. El módulo se carga antes de `app.js`, se incluyen sus archivos en la caché `gran-atlas-v3.19.3-aves-1` y se mantiene la arquitectura de GitHub Pages. No se cambia `.github/workflows/static.yml`: su glob de pruebas ya ejecuta las nuevas comprobaciones. Capacitor conserva el mismo `appId` y `webDir`; solo cambia el nombre de versión mostrado.

## Inventario y hallazgos históricos

[Inventario completo en CSV](docs/aves-v3193/inventario.csv): identificador, nombre común, taxón, `kind` persistido, familia artística, configuración sexual y variantes existentes.

El antiguo auxiliar `tests/helpers/sprites.cjs` corta la evaluación en `GLOBAL_BIOMES_FULL`: no incluye las ampliaciones africanas y norteamericanas posteriores ni las migraciones finales. El nuevo auxiliar `tests/helpers/catalog.cjs` evalúa el catálogo completo hasta el inicio de las funciones de guardado. El navegador confirma que sus 487 registros coinciden con los del juego en ejecución. Este hallazgo evita dejar fuera 25 aves de las ampliaciones, entre ellas el peregrino, el búho nival, el cuervo y el píleo.

El picapinos conserva su categoría histórica `small`; el motor lo reconoce como carpintero por `Dendrocopos major`. También se reconoce `Buceros rhinoceros` aunque se reciba el antiguo `kind: rhino`, `Aquila chrysaetos` como águila aunque figure como `forestbird`, y `Tyto alba` como lechuza aunque figure como `raptor`.

El código fuente conserva dos declaraciones históricas de `Gypaetus barbatus`, pero la v3.15.3 ya migraba `af_quebrantahuesos` al identificador original `quebrantahuesos`. La v3.15.4 ya distinguía `Lagopus muta` (Perdiz nival) de `Lagopus lagopus` (Lagópodo común) y ya corregía el `kind` del cálao rinoceronte. Esta entrega no cambia esas migraciones, nombres ni identificadores y no realiza nuevas fusiones o renombrados.

Se corrigen la dependencia artística de categorías históricas, las siluetas genéricas compartidas por aves muy distintas y la divergencia visual entre ilustración base y sexos alternativos. Durante la revisión se separaron además los contornos de busardo/águila, carraca/córvido, túrdido/petirrojo, herrerillo/carbonero y las morfologías prioritarias de halcones, búhos y galliformes.

## Dimorfismo y variantes

Se mantienen exactamente las **12 configuraciones sexuales de aves**: gallo lira, urogallo, pato cuchara, pinzón, mirlo, camachuelo, oropéndola, pavo real común, pato mandarín y faisanes común, dorado y plateado. Ambos sexos utilizan el nuevo acabado; las especies sin configuración siguen sin ofrecer un sexo alternativo en el juego ni en el laboratorio.

Normal, albino/leucístico, melánico y notable/alfa conservan su comportamiento, geometría y probabilidades anteriores. El pase melánico elimina los acentos de color fijos; el albino conserva los ojos rosados. La prioridad existente de variante especial sobre sexo permanece intacta. No se agregan configuraciones sexuales ni variantes.

## Verificación

- `node --test tests/*.test.cjs`: **133 aprobadas, 0 fallos, 0 omitidas**, incluidas las 124 previas y 9 pruebas nuevas.
- Validación sintáctica de los módulos de producción y del laboratorio.
- Reproducción de la columna anterior con `node scripts/bird-lab-baseline.cjs --check`.
- Inventario reproducible con `node scripts/bird-inventory.cjs --check`.
- **1.704 combinaciones** comprobadas en Chromium: 136 aves × 4 paletas × 3 tamaños, más macho/hembra de las 12 configuraciones existentes × 3 tamaños. XML, longitudes de trazados, dimensiones y límites incluyendo el grosor del contorno: 0 errores y 0 recortes.
- Integración del juego completo: 136 ilustraciones de aves en Bestiario, 14 en el Cuaderno de la región de prueba, 1 en Campo y 1 en Museo; se verifica el motor 3.19.3 en los cuatro módulos.
- Guardado: los contadores, descubrimientos, etapas, sexos, variantes, inventario, regiones, compras y publicaciones de una partida de prueba se conservan tras recargar.
- Service worker real: juego y los tres laboratorios recargan sin conexión.
- Vista móvil de 390 × 844: navegación visible y laboratorio sin desbordamiento horizontal.
- Ningún error JavaScript del navegador. [Resultado estructurado](docs/aves-v3193/validacion-navegador.json).

Se revisaron visualmente las láminas renderizadas, incluidas las ampliaciones del catálogo y ambos sexos. No quedan aves del catálogo efectivo pendientes de clasificación o dibujo. La comprobación móvil utiliza Chromium con viewport móvil; no se ejecutó una APK en un dispositivo Android físico.

## Láminas de revisión

- [136 aves, antes/después, 80 px](docs/aves-v3193/aves-136-antes-despues.jpg).
- [58 familias, siluetas, 56 px](docs/aves-v3193/aves-58-siluetas-56.jpg).
- [12 hembras, antes/después](docs/aves-v3193/aves-hembras-antes-despues.jpg).
- [12 machos, antes/después](docs/aves-v3193/aves-machos-antes-despues.jpg).

La revisión de navegador puede repetirse sirviendo `www` por HTTP en localhost y ejecutando `node scripts/review-birds-browser.cjs http://localhost:8765 work/bird-review`. El script opcional requiere Playwright y Chromium disponibles en el entorno; no agrega dependencias a la aplicación. `ATLAS_CHROMIUM` permite indicar la ruta del ejecutable.

## Familias visuales

| Familia | Código | Aves |
| --- | --- | ---: |
| Águilas y pigargos | `eagle` | 13 |
| Águilas pescadoras | `osprey` | 1 |
| Halcones y cernícalos | `falcon` | 6 |
| Gavilanes y azores | `accipiter` | 2 |
| Milanos | `kite` | 1 |
| Busardos | `buzzard` | 1 |
| Buitres | `vulture` | 4 |
| Quebrantahuesos | `bearded-vulture` | 1 |
| Ave secretaria | `secretary` | 1 |
| Búhos | `horned-owl` | 3 |
| Lechuzas | `barn-owl` | 1 |
| Mochuelos | `little-owl` | 1 |
| Petirrojos y collalbas | `robin` | 3 |
| Herrerillos y carboneros | `tit` | 2 |
| Pinzones y camachuelos | `finch` | 2 |
| Mirlos y zorzales | `thrush` | 2 |
| Alondras | `lark` | 1 |
| Ampelis | `waxwing` | 1 |
| Oropéndolas | `oriole` | 1 |
| Córvidos | `corvid` | 6 |
| Mosqueros del paraíso | `flycatcher` | 1 |
| Bulbules | `bulbul` | 1 |
| Picatartes | `rockfowl` | 1 |
| Vangas | `vanga` | 1 |
| Tejedores | `weaver` | 1 |
| Patos | `duck` | 2 |
| Cisnes | `swan` | 2 |
| Gansos | `goose` | 2 |
| Cormoranes | `cormorant` | 2 |
| Fochas | `coot` | 1 |
| Somormujos y zampullines | `grebe` | 2 |
| Garzas | `heron` | 3 |
| Cigüeñas | `stork` | 3 |
| Grullas | `crane` | 6 |
| Flamencos | `flamingo` | 2 |
| Ibis | `ibis` | 2 |
| Jacanas | `jacana` | 1 |
| Pelícanos | `pelican` | 3 |
| Picozapatos | `shoebill` | 1 |
| Pingüinos | `penguin` | 1 |
| Frailecillos | `puffin` | 2 |
| Alcatraces | `gannet` | 1 |
| Ostreros | `oystercatcher` | 1 |
| Pavos reales | `peafowl` | 2 |
| Faisanes | `pheasant` | 4 |
| Monales | `monal` | 2 |
| Tragopanes | `tragopan` | 1 |
| Urogallos y gallos lira | `grouse` | 2 |
| Perdices y lagópodos | `partridge` | 5 |
| Loros e inseparables | `parrot` | 3 |
| Cálaos | `hornbill` | 6 |
| Turacos | `turaco` | 3 |
| Carracas | `roller` | 2 |
| Abejarucos | `bee-eater` | 3 |
| Abubillas | `hoopoe` | 1 |
| Martines pescadores | `kingfisher` | 3 |
| Pájaros carpinteros | `woodpecker` | 2 |
| Avestruces | `ostrich` | 2 |

## Archivos de la entrega

- `www/js/bird-art-v3193.js`: motor especializado.
- `www/js/app.js`: enrutamiento de sprites y acceso al aviario desde Bestiario.
- `www/index.html`, `www/sw.js`, `package.json`, `capacitor.config.json`: carga, caché y versión 3.19.3.
- `www/laboratorio-aves.html`, `www/js/lab/bird-lab-v3193.js`, `www/js/lab/bird-sprites-v3192b-before.js`: laboratorio y referencia anterior.
- `tests/birds-v3193.test.cjs`, `tests/helpers/catalog.cjs`: cobertura del catálogo efectivo y regresiones artísticas.
- `tests/herp-v3192b.test.cjs`: expectativa de caché actualizada a 3.19.3, manteniendo sus comprobaciones.
- `scripts/bird-lab-baseline.cjs`, `scripts/bird-inventory.cjs`, `scripts/review-birds-browser.cjs`: reproducción de referencia, inventario y revisión de navegador.
- `README_V3193.md` y `docs/aves-v3193/`: informe, inventario, resultados y láminas.

Las reglas de avistamientos, rarezas, inventario, investigación, mapas, regiones, economía, exploración y guardado no reciben modificaciones. Los motores de peces, anfibios, reptiles y mamíferos permanecen intactos. Las imágenes de este informe están fuera de `www` y no aumentan la descarga del juego.

La publicación sigue el workflow existente **Deploy El Gran Atlas**, que valida el código y todas las pruebas antes del paso de GitHub Pages. El SHA y el resultado confirmado de la ejecución correspondiente se informan en la entrega del turno.


## Incidencias observadas al publicar

Las primeras publicaciones del commit artístico `d73ab9384513e58d333d73fe922930a623607629` aprobaron las 133 pruebas y la subida del sitio, pero el backend de Pages devolvió `Deployment failed, try again later` después de `deployment_queued`.

- [Ejecución por push](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42267403277): primer intento con error del servicio; al reejecutar el job, `deploy-pages` encontró dos artefactos con el mismo nombre en esa ejecución.
- [Ejecución nueva independiente](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42268701035): un único artefacto, 133 pruebas aprobadas y el mismo error del backend de Pages.

Se comprobó que Pages sigue configurado como público, con HTTPS y `build_type: workflow`. Su API solo informa `deployment_failed`, sin un motivo adicional. El panel público de estado no mostraba incidentes. Esta revisión deja constancia de los resultados y provoca una publicación con un identificador de revisión nuevo; no modifica el contenido del juego ni el workflow. Solo el resultado final confirmado de Actions y la comprobación HTTP permiten considerar publicada la versión.
