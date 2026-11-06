# El Gran Atlas v3.19.4 — Atlas ilustrado de mamíferos

Esta entrega revisa los **269 mamíferos del catálogo efectivo de 487 especies**, incluidas las incorporaciones africanas y norteamericanas posteriores a `GLOBAL_BIOMES_FULL`. El motor contiene **68 familias visuales ocupadas y 142 morfotipos**. El laboratorio y el juego renderizan el mismo SVG, con los mismos acabados de variantes.

## Cobertura y auditoría

- [Inventario completo, CSV](docs/mamiferos-v3194/inventario.csv): identificador, nombres, `kind` persistido, familia, generador anterior, estado anterior, necesidad de tratamiento específico, dimorfismo y variantes. Incluye evaluación de silueta, anatomía, prolijidad e identidad para cada especie.
- [Auditoría, JSON](docs/mamiferos-v3194/auditoria.json): los 269 registros, recuentos por familia y morfotipo, 30 controles prioritarios y huellas del catálogo y del dimorfismo.
- [Láminas y resultados del navegador](docs/mamiferos-v3194/README.md).

Las cuatro láminas antes/después cubren **todas las especies**. Se revisaron los dibujos renderizados, las familias en silueta a 56 px, las comparaciones de similares a 120 px y los sexos y variantes existentes. Se corrigieron durante esta entrega patas inicialmente demasiado angulosas, poses demasiado parecidas de pequeños primates, colas de ungulados, cuernos y paletas heredadas poco naturales.

Hay **269 geometrías exteriores diferentes**, calculadas sin ojos, manchas, coloración ni otros detalles interiores. Esto expresa diferencias de contorno; no se usa como sustituto del juicio artístico ni como garantía de identificar cada congénere sin nombre a 56 px.

**96 morfotipos corresponden a una sola especie**; los otros 46 sirven a **173 especies** emparentadas. Hay además **136 tratamientos explícitos de proporciones por taxón**. Estos recuentos se solapan y no deben sumarse. Las 30 especies prioritarias tienen tratamiento y control de especie; no constituyen el límite del inventario.

## Arquitectura y reutilización

`www/js/mammal-art-v3194.js` es un módulo independiente, sin estado, compatible con navegador y Node.js:

**Taxón → familia visual → morfotipo → proporciones y estructuras de especie → paleta.**

Exporta `renderMammal`, `classifyMammal`, `MAMMAL_FAMILIES`, `mammalMorphology` y `MAMMAL_SPECIES_ANATOMY`; en navegador publica `ATLAS_MAMMAL_ART_V3194`. Conserva `viewBox="0 0 100 100"`, se conecta con `spriteFor` y `sexSpriteMarkup` y aprovecha la caché de `getSpriteMarkup`.

La reutilización sigue anatomías compatibles:

| Elementos compartidos | Familias que los usan |
| --- | --- |
| Miembros digitígrados, variando volumen y proporciones | Félidos, cánidos, hienas, civetas, fosas y mustélidos |
| Apoyos bajos y troncos alargados | Comadrejas, turones, visones y mangostas |
| Miembros con pezuñas, cuellos y grupos de cornamenta | Cérvidos, gacelas, antílopes, bovinos, caprinos, équidos, okapis y grandes herbívoros |
| Patrones de escamas contenidos en el contorno | Pangolines terrestres, gigantes y arborícolas |
| Miembros y manos en poses compatibles | Macacos, cercopitecos y langures, con diferencias de hocico, manto y cola |
| Torso compacto, patas y orejas de anatomía próxima | Marmotas, topillos, lemmings y lirones, con perfiles y estructuras propios |
| Funciones de trazo, ojos, orejas y acabados | Todas las familias |

Las ramas especiales distinguen elefantes, jirafas, camellos, osos, panda gigante, panda rojo, binturong, nutria marina, suricata, pangolines, cerdo hormiguero, murciélagos, ardillas voladoras, grandes simios, gibones, prosimios y mamíferos marinos. Compartir funciones no supone compartir un contorno final idéntico.

Los dibujos anteriores permanecen disponibles en el código histórico y en la referencia congelada del laboratorio, basada en `f153def213eab6e9b2818abfe7d02174cfdf2c5b`. La comparación permitió conservar rasgos útiles —escamas de pangolines, orejas y patrones— y rehacer contornos y apoyos que necesitaban refinamiento.

## Clasificación histórica

La nueva clasificación no escribe campos en las especies ni en las partidas. Reconoce géneros científicos completos; los nombres comunes usan límites de palabra y exclusiones. Las categorías antiguas solo sirven como último recurso cuando no existe nombre científico.

| Categoría histórica mezclada | Separación artística aplicada |
| --- | --- |
| `small` | 26 familias, incluidos murciélagos, musarañas, roedores, liebres, panda rojo, osos y primates |
| `deer` | 13 familias, incluidos équidos, tapires, suidos, gacelas y distintos antílopes |
| `canid` | Cánidos e hienas |
| `cat` | Félidos, vivérridos y fosas |
| `otter` | Nutrias y pinnípedos |
| `bison` | Bovinos, nilgó y ñu |
| `giraffe` | Jirafas y okapi |
| `mustelid` | Mustélidos, mangostas, gineta y suricata |

Cálao rinoceronte, salamandra alpina y pico picapinos quedan expresamente fuera del motor. Las correcciones históricas del catálogo ya existentes siguen intactas. Delfín, dugongo y lobo marino se identifican por sus taxones y reciben anatomías acuáticas distintas.

## Anatomía y acabado

Los cuerpos usan perfiles continuos; las patas tienen volumen y articulaciones. Se distinguen musculatura y colas de grandes félidos, hocicos y orejas de cánidos, pendiente corporal de hienas, volúmenes de osos y bovinos, tipos de cornamenta, trompas y orejas de elefantes, labios y cuernos de rinocerontes, cuellos de jirafas y número de jorobas de camellos.

Los primates incluyen apoyo sobre nudillos, suspensión, posturas sentadas, cuadrupedia y poses de agarre. Aye-aye, loris, gálago y tarsios tienen composiciones distintas. Los murciélagos muestran membranas y dedos alares; los roedores y lagomorfos diferencian colas, grupa, patagio y orejas; topos y desmanes muestran miembros especializados. Delfín, dugongo, lobo marino y nutrias conservan sus respectivas anatomías.

Rayas, rosetas, manchas y placas se contienen mediante `clipPath`; crines y púas se simplifican en grupos legibles. Las paletas son naturales y los trazos mantienen un acabado común. No hay filtros costosos, animaciones nuevas ni dependencias gráficas. El SVG más grande comprobado ocupa **4.853 caracteres**; las láminas de revisión están fuera de `www`.

## Variantes, dimorfismo y compatibilidad

Se conservan las **24 configuraciones de dimorfismo existentes: 12 mamíferos y 12 aves**. Los 12 mamíferos mantienen macho y hembra, diferencias de cornamenta y cuerpo femenino más ligero y claro. No se incorporan nuevas especies al sistema de sexos.

El catálogo conserva sus variantes configuradas: 135 mamíferos con albina/leucística, 153 con melánica y 252 con notable/alfa. El generador soporta los cuatro acabados; el laboratorio solo ofrece las variantes ya existentes de cada especie. Las variantes especiales conservan su prioridad sobre la selección de sexo. No cambian probabilidades ni registros de descubrimiento.

Los **218 animales restantes** conservan exactamente los SVG anteriores en sus cuatro acabados y sexos configurados. Los módulos de aves, herpetofauna y peces no se modificaron. La huella del catálogo completo y la de `SEXUAL_DIMORPHISM` coinciden con la versión base.

## Validación reproducible

```sh
node --test tests/*.test.cjs
node scripts/mammal-inventory.cjs --check
node scripts/mammal-lab-baseline.cjs --check
# Opcional, con Playwright y Chromium disponibles, servir www en localhost:
node scripts/review-mammals-browser.cjs http://localhost:8766 docs/mamiferos-v3194
```

Resultado de la entrega:

- **143 pruebas automáticas aprobadas**, incluidas las 133 anteriores y 10 pruebas específicas nuevas. Solo se actualizaron las expectativas de versión/caché de dos pruebas anteriores.
- **3.300 combinaciones renderizadas** en Chromium: 269 × 4 acabados × 3 tamaños, más 12 × 2 sexos × 3 tamaños. Sin errores de XML, rutas, viewport ni elementos recortados, incluyendo grosor del trazo.
- 269 contornos exteriores diferentes y 10 filtros comparativos comprobados.
- Campo, Bestiario (269 mamíferos), Cuaderno y Museo muestran el motor nuevo.
- Catálogo completo contrastado con el catálogo real cargado por el juego.
- Guardado y recarga conservan descubrimientos, avistamientos, etapas, sexos, variantes, inventario, desbloqueos, compras y publicaciones.
- Juego y cuatro laboratorios cargan sin conexión mediante el service worker real.
- Interfaz móvil de 390 × 844 px y laboratorio a 120 px sin desbordamiento horizontal.
- Las pruebas anteriores cubren economía, investigación, expediciones, progreso offline, inventario y sistemas de guardado. No se cambia su implementación.

`Deploy El Gran Atlas` ejecuta las pruebas y añade comprobaciones de sintaxis del nuevo motor y su adaptador. Se conserva la configuración de Pages y el identificador Android `com.elgranatlas.naturaleza.beta314`.

## Archivos y publicación

Cambios de producción: motor nuevo; laboratorio HTML, adaptador y referencia anterior; dos conexiones de sprites y enlace al laboratorio en `app.js`; versión en `index.html`, `package.json` y `capacitor.config.json`; recursos y nombre de caché en `sw.js`.

Soporte: prueba `mammals-v3194.test.cjs`, tres scripts de inventario/referencia/revisión, comprobaciones de sintaxis del workflow, expectativas de versión de dos pruebas, este informe y los artefactos de `docs/mamiferos-v3194/`.

- Juego: https://pruizbohle.github.io/gran-atlas-naturaleza/
- Laboratorio: https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-mamiferos.html
- Historial de publicación: https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/static.yml

El commit y el resultado terminal del despliegue se indican en la entrega final, tras comprobar `success` y los archivos servidos por Pages.

## Límites conocidos

El estilo es una ilustración vectorial simplificada. En especies y subespecies próximas, los rasgos finos de pelaje y proporción se aprecian mejor a 80–120 px; a 56 px el nombre también ayuda a distinguirlas. La firma geométrica detecta duplicados exactos, pero no mide por sí sola la semejanza perceptual.

Se conserva el alcance del dimorfismo anterior; no se pretende completar en esta versión toda la variación sexual o estacional de la fauna. No se generó un APK ni se probó un dispositivo Android físico: se comprobaron la configuración de Capacitor y el comportamiento web móvil.
