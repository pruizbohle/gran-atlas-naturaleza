# El Gran Atlas 3.38.0 · Museo avanzado

El Museo conserva **sus cinco salas, vitrinas, fichas e ilustraciones**, e incorpora **doce exposiciones temáticas dentro de Exposiciones**. Los proyectos premian la organización de muestras y gabinetes con diplomas permanentes. No añaden dinero, conocimiento, materiales, prestigio ni renta.

Se conservan **945 identidades, 113 regiones y 1.744 presencias**, los **80 achievements**, las **37 misiones** y el guardado `gran_atlas_v05`. No hay especies, fósiles, artefactos, regiones ni monedas nuevas. Android y su firma siguen independientes.

## Proyectos

[Catálogo completo de requisitos y reconocimiento](docs/mus3380/catalogue.md):

1. Gabinete de las Islas Británicas.
2. Historia de las aves.
3. Grandes felinos del género Panthera.
4. Sabana y aguas de África oriental.
5. Biodiversidad de Asia.
6. Madagascar, Seychelles y Aldabra.
7. Cetáceos y mamíferos marinos.
8. Vida de los polos.
9. Evidencias de las profundidades.
10. Reptiles actuales y reconstrucciones.
11. Archivo de relictos y conservación.
12. Instrumentos y archivo de expediciones.

Se usan selectores sobre `SPECIES`, `REGIONS` y la taxonomía existente; no se duplica el catálogo de animales. La pertenencia a un catálogo regional no certifica el lugar de cada avistamiento ni implica endemismo. Se conservan los rangos zoológicos del juego. Los relictos no se describen todos como fósiles vivientes, los montajes paleontológicos no se presentan como fauna coetánea y las láminas profundas son reconstrucciones científicas, con la abstracción histórica ya documentada.

## Organización y acreditación

Las tarjetas muestran por separado requisitos cumplidos y pendientes. Un proyecto puede exigir descubrimientos, monografías, muestras actualmente expuestas, investigaciones, reconstrucciones, relictos o artefactos. Los proyectos científicos también comprueban qué piezas están actualmente visibles en sus gabinetes.

Los requisitos se cumplen **simultáneamente**. Cuando se reúnen, el motor acredita el diploma una sola vez. Después distingue **acreditación permanente** y **montaje vigente**: retirar una muestra o una pieza puede dejar el montaje pendiente, pero conserva el diploma y la evidencia del montaje acreditado. No se infieren vitrinas pasadas a partir de una mera pieza catalogada.

Destacar una exposición solo cambia la placa institucional. No compra, retira, monta ni consume piezas; no altera su propiedad o su renta. Una misma pieza puede servir para estudiar temas distintos, pero no se generan unidades nuevas por ello.

La capacidad animal sigue siendo **3/7/12**. Los gabinetes científicos continúan independientes. Un montaje histórico que supere su capacidad no se borra automáticamente, pero no obtiene una acreditación nueva mientras sea imposible según esa capacidad.

## Muestras y presentación

Se distinguen expresamente:

- Identidad descubierta.
- Monografía publicada.
- Muestra habilitada: estudio5/5 y publicación, según el motor existente.
- Muestra disponible ahora: habilitada, con libras y espacio suficientes.
- Muestra actualmente expuesta o pieza científica catalogada/mostrada.

Exposiciones añade filtros, tarjetas plegables, cuatro proyectos por página, diplomas, exposición destacada y archivo histórico. Los candidatos se consultan de doce en doce y no dibujan SVG masivos. Las fichas ampliadas son las originales del Museo. «Muestras del proyecto» filtra antes de paginar; mantiene32 tarjetas por página y ofrece un botón visible para volver al catálogo completo.

Los atajos abren Muestras, Cuaderno, Bestiario, Fósiles, Relictos, Artefactos o Investigación. Nunca ejecutan compras, fabricación, retiros ni viajes automáticos. Los encargos relacionados del Museo incluyen un enlace para consultar proyectos, conservando sus requisitos y premios.

## Persistencia y retroactividad

[Auditoría MUS-01](docs/mus3380/mus-01.md). `museum.curation` es aditivo y se crea cuando existe una acreditación o contenido persistente; no se añade un registro vacío a partidas que aún no usan proyectos. Contiene IDs acreditados, diploma, requisitos e IDs testigos, capacidad y disposición observadas, fecha conocida y destacado. Consultar proyectos y filtros no muta la partida.

La migración reconoce exclusivamente los requisitos que demuestra la disposición del respaldo. Las acreditaciones retroactivas tienen `completedAt: null`, `observedAt` y `retroactive: true`; la interfaz declara que la fecha original no está disponible. Las nuevas acreditaciones obtenidas jugando sí registran fecha conocida.

Restaurar un respaldo de la misma `collectionId` conserva los diplomas ya documentados localmente; no restaura automáticamente sus piezas ni modifica la composición del respaldo elegido. Las partidas distintas no mezclan acreditaciones. El traslado a otra instalación conserva lo que figure en el respaldo exportado; no puede recuperar un diploma posterior ausente de ese archivo.

Destacar tiene protección frente a errores de guardado. La acreditación no entrega recompensas económicas que puedan duplicarse. Los campos previos del Museo, la conservación, los trabajos pendientes y los recursos no se limpian ni reinician.

## Economía y compatibilidad

[Equivalencia económica](docs/mus3380/economy-equivalence.json): la función `museumRate` es idéntica a3.37.0, al igual que los precios e ingresos de945 muestras. Permanecen las ocho reconstrucciones, nueve relictos, cinco artefactos, recetas, conjuntos y proyectos originales de conservación hasta20 puntos. No se añade un segundo sistema de puntos ni bonificaciones.

Seis escenarios de ocho horas producen los mismos recursos con niveles de galería, conservación, medallón, investigación y conjuntos distintos. Los premios económicos nuevos son exactamente cero. No se afirma un balance universal ni se vuelve a simular la campaña mundial GM-05.

Los diez exportadores reales de **3.28–3.37** conservan cada campo previo del Museo al importar en3.38, incluidos animales expuestos, piezas, pistas, análisis, hitos, conservación y campañas pendientes. Las excavaciones y prospecciones siguen necesitando recogida manual después del plazo y rechazan una segunda recogida.

## Pruebas y rendimiento

**566 pruebas aprobadas:**540 retenidas sin cambiar expectativas y26 nuevas. Las473 históricas corren en sus commits originales;93 comprueban el runtime candidato. [Log final](docs/mus3380/final-tests.txt).

Las nuevas pruebas cubren requisitos reales, diferencias entre estados de piezas, diplomas únicos, retroactividad, montaje actual, límites de capacidad, render puro, muestras temáticas, atajos sin gasto, error de guardado, separación de partidas y diez exportadores históricos. Los archivos de los80 logros,37 misiones y renderer base del Museo se comparan byte a byte con `b5286e8`.

[Testigos de los doce proyectos](docs/mus3380/playability.json): acciones reales de estudio, publicación, investigación, fabricación, catálogo, montaje y exposición; semilla3380, con financiación, materiales y observaciones iniciales sintéticos. No representan duración ni facilidad de una campaña humana.

[Navegador](docs/mus3380/browser/report.json): 320,360,390,412 y1280 px, cinco salas, fichas originales, cuatro proyectos por página, doce candidatos, capacidad mediante controles reales, acreditación en vivo, destacado, persistencia y acceso desde Sociedad. Sin errores JavaScript ni desbordamientos.

[Sesión con945 monografías disponibles](docs/mus3380/browser/session-report.json):12 vitrinas, todas las piezas científicas,200 ciclos/1000 cambios entre las cinco salas. Un intervalo activo y913 nodos constantes; heap tras GC5,05/5,90/6,00/6,11 MB. Se informa el calentamiento y la variación de cachés, sin afirmar ausencia universal de fugas. Muestras sigue dibujando32 piezas por página; no se renderizan945 SVG simultáneamente. El tick inactivo no evalúa proyectos. Son pruebas Chromium, no Android físico ni horas humanas.

[PWA3.37→3.38](docs/mus3380/pwa/browser-report.json): copia exacta antes de activar, rechazo con otra ventana abierta, viajes y operaciones científicas conservados, excavaciones/prospecciones preservadas y recogidas manualmente una sola vez, diploma retroactivo sin fecha inventada, destacado persistente, juego y laboratorios offline.

Los límites científicos y artísticos pendientes de GM-05 continúan documentados; esta entrega no los declara resueltos.

## Reproducir

```sh
node scripts/validate-museum-curation-v3380.cjs
node scripts/build-museum-curation-release-v3380.cjs
node scripts/check-museum-curation-pwa-v3380.cjs
# Con www servido en localhost:8768:
node scripts/check-museum-curation-v3380.cjs
node scripts/check-museum-curation-session-v3380.cjs
```

La evidencia y los enlaces verificados de GitHub Pages se incorporan tras el despliegue. No se genera APK ni se modifica la firma permanente Android.
