# El Gran Atlas v3.19.7 — Especímenes excepcionales

La base v3.19.6 estaba integrada en `1f7a6bf` y su corrección de pruebas en `5cec57b`. Antes de implementar pasaban las 166 pruebas anteriores. La versión conserva las 487 fichas zoológicas, sus rarezas, mapas, regiones, anatomías normales, pigmentación, dimorfismo y reglas de progreso. Las categorías describen singularidad individual, no evolución biológica. No conceden ingresos, recursos, probabilidades, producción ni otras bonificaciones.

## Disponibilidad y tasas

| Categoría | Fichas elegibles | Probabilidad por observación elegible | Con Etología II |
|---|---:|---:|---:|
| Notable | 455 | 1 % | 1,5 % |
| Épico | 24 | 0,2 % | 0,3 % |
| Excepcional | 14 | 0,04 % | 0,06 % |
| Legendario | 12 | 0,01 % | 0,015 % |

Notable conserva toda su disponibilidad histórica. Su tasa anterior dependía de la longitud de la lista (`1 % / n`); se fija ahora en 1 % por especie elegible para que sea claramente la categoría más frecuente y mantenga accesible el requisito histórico de espécimen especial. Este aumento explícito no cambia las tasas de pigmentación. Las otras categorías se seleccionan mediante listas explícitas de IDs reales, por representatividad zoológica e interés visual, sin derivarlas de la rareza. Hay especies comunes con Legendario: Ascua pertenece al zorro rojo. Los tres metales usan exactamente el SVG normal y un componente compartido de halo/emblema: bronce sin estrellas, plata y oro con un emblema pequeño en una esquina. No cambian coloración ni tamaño del animal. Los Legendarios usan láminas originales en `www/js/legendary-art-v3197.js`, con 12 geometrías propias, sin filtros, imágenes externas ni animaciones.

El sorteo utiliza intervalos absolutos, no pesos renormalizados entre las categorías disponibles. No tener Épico, Excepcional o Legendario no aumenta las otras tasas. Retirar un Legendario descubierto tampoco las aumenta. Se conserva el factor histórico ×1,5 de Etología II; no se añade protección contra mala suerte.

Pigmentación tiene un sorteo independiente. Para cada variante histórica disponible, `P(Albino) = P(Melánico) = (0,01 + 0,005 si Etología II) / n`, donde `n` es la longitud de la lista original normalizada de la especie. Las listas originales `sp.special` no reciben las nuevas categorías y no cambian los denominadores. Si una variante no estaba configurada, sigue siendo imposible. Albino y Melánico permanecen registros independientes y mutuamente excluyentes entre sí. Una observación puede registrar pigmentación y categoría simultáneamente; en Campo combina pigmentación y halo metálico. El Legendario conserva siempre su ilustración individual y también registra cualquier pigmentación sorteada en la colección.

`specialSeen` conserva su significado de cantidad de encuentros especiales: aumenta una vez por especie observada si hubo cualquier resultado especial, incluso si coinciden pigmentación y categoría. Censo ×2/×3 no crea sorteos ni contadores extra. Encuentros múltiples sortean una vez por cada especie distinta, como hacía el motor anterior.

## Ritmo real y frecuencia regional

La búsqueda manual no tiene un tiempo de espera impuesto: su ritmo depende de los clics. La probabilidad inicial de encuentro es 50 %, y puede aumentar hasta 96 %. La automática se ejecuta cada 5/3/2/1/0,5 segundos según la mejora; necesita al menos un naturalista. Con uno y sin otras mejoras, la probabilidad es `0,38 × 1,03 = 39,14 %`, unas 281,808 búsquedas exitosas/hora al intervalo inicial, antes de filtros y cupos. A velocidad máxima hay hasta 7.200 intentos/hora, pero siguen vigentes los cupos de 100 registros por especie/hora y los encuentros sin reemplazo.

Con una especie por encuentro, `P(categoría por búsqueda) = P(encuentro) × peso de especie / suma de pesos elegibles × P(categoría | especie)`. Los pesos base siguen siendo 12/5/1,8/0,4. Las especialidades, estación y filtros cambian el conjunto o los pesos; los encuentros grupales cambian la inclusión sin reemplazo. El censo cambia registros, no oportunidades especiales. En automático el cupo permite como máximo 100 oportunidades/especie/hora con censo ×1, o 50 con censo ×2. Por tanto, incluso con Etología II, la cota de oportunidad de un Legendario es `1 − (1 − 0,00015)^100 = 1,489 %` por hora para esa especie; no es una garantía ni un rendimiento repetible.

[simulation.json](docs/v3197/simulation.json) incluye las probabilidades efectivas de las cuatro categorías por intento para los 12 individuos, frecuencia regional, filtros, tamaño del conjunto, encuentros/hora y probabilidad de primer hallazgo por hora. Escenarios de referencia: primera región real que contiene la especie, estación compatible, mejor filtro manual de esa región, sin especialidades ni Etología, una especie por encuentro y censo ×1. Manual ilustra 1 clic/segundo; automático usa un naturalista e intervalo de 5 segundos. Son estimaciones del conjunto inicial: el agotamiento de cupos puede cambiarlo.

| Individuo | Región de referencia | Oportunidades manuales/h | Oportunidades automáticas/h | P(Legendario en 1 h automática) |
|---|---|---:|---:|---:|
| Silverback | HX-09-11 | 31.6 | 1.1 | 0.0108 % |
| Ámbar | HX-03-16 | 1472.7 | 7.4 | 0.0737 % |
| Niebla | HX-04-15 | 100.0 | 0.9 | 0.0090 % |
| Fenrir | HX-01-11 | 311.5 | 4.6 | 0.0464 % |
| Atlas | HX-07-10 | 174.2 | 2.7 | 0.0269 % |
| Centinela | HX-02-09 | 654.5 | 47.1 | 0.4699 % |
| Basalto | HX-06-17 | 131.9 | 15.7 | 0.1570 % |
| Seda | HX-06-17 | 131.9 | 15.7 | 0.1570 % |
| Junco | HX-07-10 | 274.6 | 2.7 | 0.0269 % |
| Áncora | HX-07-14 | 327.3 | 7.6 | 0.0761 % |
| Ascua | HX-01-09 | 218.6 | 10.7 | 0.1073 % |
| Remonte | HX-03-18 | 900.0 | 24.2 | 0.2418 % |

## Doce identidades legendarias

Son identidades artísticas ficticias, no afirmaciones sobre animales históricos documentados. Silverback es un sobrenombre dentro de la ficción; también es un término general para los machos adultos de espalda plateada.

| ID permanente | Nombre | Especie | Diseño exclusivo |
|---|---|---|---|
| silverback | Silverback | Gorila de montaña | Postura frontal, brazos articulados y manto plateado |
| ambar | Ámbar | Tigre siberiano | Postura vigilante, rayas propias y mejillas claras |
| niebla | Niebla | Leopardo de las nieves | Cola curvada, rosetas abiertas y cabeza frontal |
| fenrir | Fenrir | Lobo gris | Perfil elevado, pecho claro y pelaje dorsal marcado |
| atlas | Atlas | Elefante africano de sabana | Oreja desplegada, trompa curvada y colmillos asimétricos |
| centinela | Centinela | Águila real | Postura posada, plumas individualizadas y nuca dorada |
| basalto | Basalto | Dragón de Komodo | Cuerpo rasante, cola curvada y escamación dorsal |
| seda | Seda | Cobra real | Anillos propios, capucha estrecha y escudos ventrales |
| junco | Junco | Cocodrilo del Nilo | Silueta baja, escudos dorsales y hocico cicatrizado |
| ancora | Áncora | Tortuga gigante de Aldabra | Anillos del caparazón, cuello extendido y patas columnares |
| ascua | Ascua | Zorro rojo | Postura sentada, cola envolvente y pecho marfil |
| remonte | Remonte | Salmón rosado | Perfil de remontada, mandíbula curva y moteado natural |

La distribución abarca Europa, Asia y África, seis mamíferos, un ave, cuatro reptiles y un pez. No se incorporan especies nuevas.

## Unicidad, guardados y restauración

`legendaryFound` es la única fuente de verdad de los individuos. Se indexa por ID estable y conserva su ID y especie canónica; no se duplica como un booleano `specialFound.Legendario`. La asociación compara el binomio científico para fichas equivalentes sin fusionar ni modificar registros zoológicos. El sorteo omite inmediatamente al individuo descubierto y mantiene disponibles todas las otras categorías. El registrador también rechaza descubrimientos duplicados. La colección muestra 1/1, nunca un contador repetible de Legendario.

La migración añade `legendaryFound`, `specialCounts` y `collectionId` sin alterar `specialSeen`, `specialFound`, progresión, monografías, inventario, avistamientos ni Museo. Es idempotente. Los Notables históricos siguen descubiertos y no se convierten en categorías nuevas. Sus totales individuales no pueden reconstruirse a partir del contador agregado: la tarjeta conserva «registro histórico» y los nuevos contadores indican explícitamente «encuentros desde v3.19.7».

Se mantienen la clave local y el formato de respaldo 1. El exportador incluye los nuevos campos porque serializa toda la partida. Al importar un respaldo de la misma `collectionId`, el motor conserva también los Legendarios ya descubiertos en la sesión, para que volver a un respaldo anterior de esa partida no los reactive. Una partida con identidad diferente conserva su colección independiente. Los respaldos anteriores a esta versión reciben una identidad al migrar; nunca habían podido contener hallazgos legendarios. Sin un respaldo que incluya el hallazgo, una instalación nueva no puede reconstruir datos que ya no existen: la permanencia tras reinstalar depende del respaldo recuperado.

No hay recompensas adicionales de descubrimiento o exhibición. La restauración no genera encuentros ni concede dinero. Cuaderno y Bestiario muestran exclusivamente las categorías configuradas, ocultan nombre/arte legendario hasta descubrirlo y registran las repeticiones metálicas. El Museo añade una colección visual sin ocupar vitrinas económicas ni cambiar exposiciones, fósiles, relictos o artefactos. No se cambian requisitos de monografía; los especiales accesibles siguen satisfaciendo sus reglas históricas.

## Laboratorio y verificación

`www/laboratorio-especiales.html` ofrece filtros por categoría/grupo/especie, nombres propios, solo Legendarios, tamaños 56/80/120, halos opcionales y comparación con normal. Incluye tasas técnicas de todas las fichas elegibles y simulación con semilla y frecuencia regional configurable. El proceso se divide en bloques para mantener la interfaz operativa. No carga `app.js`, no accede a almacenamiento y no registra progreso. Todos sus recursos se precargan offline. Los laboratorios anteriores permanecen disponibles.

Simulación reproducible, semilla 3197, un millón de observaciones elegibles de zorro rojo:

| Resultado | Observado | Esperado |
|---|---:|---:|
| Notable | 9.970 | 10.000 |
| Épico | 2.033 | 2.000 |
| Excepcional | 400 | 400 |
| Oportunidad legendaria independiente | 91 | 100 |
| Albino | 3.303 | 3.333,33 |
| Melánico | 3.181 | 3.333,33 |

Las desviaciones están dentro del umbral estadístico de seis desviaciones estándar utilizado por la comprobación reproducible. En una partida con exclusión permanente se registró exactamente **un** Legendario en un millón de observaciones; los metales continuaron apareciendo. Las oportunidades independientes se usan para medir la tasa, no representan múltiples descubrimientos permitidos en una partida.

Validación: **179 pruebas Node pasan, 0 fallos, 0 omitidas** (166 anteriores y 13 nuevas). Se mantienen las comprobaciones históricas y sus fixtures de geometría normal/sexual. Solo se actualizan las expectativas de versión, el mobiliario de presentación y el contrato de probabilidades que esta versión reemplaza; no se desactivan pruebas.

La revisión automatizada en Chromium valida los 505 SVG configurados como XML, las 12 ilustraciones a 56/120 px, los controles, ancho móvil de 390 px, la simulación aislada, importación JSON por la interfaz real, recarga, Museo, pestañas existentes y una instalación real del service worker seguida de arranque y laboratorio sin conexión. Resultado: **cero errores JavaScript**. Véase [browser-report.json](docs/v3197/browser-report.json).

Comandos reproducibles desde el repositorio:

```sh
node scripts/build-dimorphism-lab.cjs --check
node --test tests/*.test.cjs
node scripts/simulate-specials-v3197.cjs
python3 -m http.server 8765 --directory www
# En otra terminal, con Playwright y Chromium disponibles:
node scripts/check-specials-browser-v3197.cjs
```

## Archivos y publicación

Cambios funcionales: `www/js/app.js`, `www/js/legendary-art-v3197.js`, `www/laboratorio-especiales.html`, `www/js/lab/special-lab-v3197.js`, `www/css/styles.css`, `www/js/lab/dimorphism-production.js` y su generador `scripts/build-dimorphism-lab.cjs`.

Versionado/offline: `www/index.html`, `www/sw.js` (caché `gran-atlas-v3.19.7-especimenes-1`), `www/js/save-manager.js`, `package.json`, `capacitor.config.json`. El `appId` y la arquitectura GitHub Pages se conservan.

Verificación/documentación: `tests/specials-v3197.test.cjs`, los dos helpers de ejecución/SVG, expectativas actualizadas de aves/herpetología/mamíferos/pigmentación/SVG, los scripts de simulación y navegador, `docs/v3197/*.json`, `README.md` y este informe. El commit contiene la lista exacta de archivos. Las capturas de revisión quedan en `work/browser-v3197/` y se pueden regenerar; no se distribuyen como recursos del juego.

El workflow **Deploy El Gran Atlas** ejecuta toda la suite Node antes de desplegar `www/`. El estado de publicación se debe verificar en la ejecución del commit correspondiente, no inferirse de las pruebas locales: [ejecuciones de despliegue](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/static.yml).

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-especiales.html)
