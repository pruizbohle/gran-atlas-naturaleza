# Inventario de auditoría para V5.0

La línea de partida es V4.9.6. El inventario reúne **1.000 fichas**, **304 familias**, **1.672 láminas**, **125 regiones** y **1.833 asociaciones especie–región**. Identifica la familia y la clase de cada ficha y sus hábitats, zonas, rutas WebP y factor de escala. También señala las **22 fichas** que comparten la lámina base con otra ruta de dimorfismo. Hay 302 rutas albinas, 262 melánicas y 59 fichas con rutas para ambos sexos. Las familias quedan disponibles para su revisión visual individual. [Inventario por familia y ficha](inventario-auditoria-v50.json) · [Catálogo del laboratorio](../../www/naturalist-art/CATALOGO.md)

## Hallazgos y prioridades

| Prioridad | Hallazgo | Comprobación de consolidación |
| --- | --- | --- |
| P1 | V4.9.5 registra 227 fallos históricos. Entre ellos hay pruebas de expedición que preparan sus guardados sin la cartografía vigente y pruebas con valores de catálogo de ediciones anteriores. | Reproducir y clasificar cada fallo contra partidas representativas. Corregir primero cualquier fallo que afecte una partida, una transición PWA o el acceso a fauna. |
| P1 | La PWA reúne 6.930 entradas de caché básico tras el cierre. La descarga y la renovación del caché deben funcionar con distintas cuotas y condiciones de red. | Medir instalación, actualización, recuperación de una descarga y memoria en dispositivos representativos. Repetir en 320 y 390 px y en escritorio. |
| P2 | 22 fichas reutilizan la lámina normal para una ruta de dimorfismo. Las variantes de color y los 12 legendarios también requieren comparación dentro de sus familias. | Revisar cada vínculo compartido y comprobar que las variantes estén diferenciadas según el estándar y que la ruta normal siga siendo la esperada. |
| P2 | Hay 33 asociaciones con hábitat regional distinto del perfil general de la ficha. En las 33 se halló una combinación de hábitat, hora, estación y protocolo compatible en el motor actual. | Usar el inventario para revisar que el diario, el Bestiario y la cartografía expliquen esas presencias regionales de forma coherente. |
| P2 | Persisten denominaciones históricas que merecen cotejo documental, como las del pez caracol de Kermadec y las subespecies históricas. | Revisar fuentes y alias junto con distribución y rango taxonómico. Conservar la relación de cada identidad con su clave de guardado. |
| P2 | La calidad artística del catálogo completo debe revisarse familia por familia. Las 36 láminas de cierre ya tienen comparaciones de silueta, proporción y rasgos diagnósticos. | Usar los mismos fondos claro y oscuro, tamaños de 64 y 128 px y el original de 512 px. Revisar anatomía, consistencia de acuarela y grafito, recorte y reconocimiento a través de familias. |
| P3 | Las cuatro escalas especiales conviven con el encuadre común de las demás fichas. El museo conserva nueve relictos con su presentación histórica. | Confirmar las proporciones y legibilidad de los cuatro casos y documentar la revisión de relictos y halos en sus módulos. |

[Fallos históricos y regresión de cierre](regresion.json) · [Ejemplares legendarios](legendarios.json) · [Auditoría taxonómica histórica](../cientifica-v493/auditoria-taxonomica.json) · [Gigantes en miniatura](../cientifica-v493/gigantes-en-miniatura.md)

## Etapas de revisión

1. **Partidas y publicación.** Fijar partidas históricas y recientes, incluidas las que conservan expediciones pendientes y especímenes registrados. Ensayar la migración, actualización, pérdida de conexión y recuperación del almacenamiento. Mantener la lista de fallos históricos con el resultado individual de su análisis.
2. **Catálogo y geografía.** Recorrer las familias y las presencias regionales, revisar los alias y comprobar coherencia entre clase zoológica, zonas y hábitats de encuentro.
3. **Arte y recursos.** Revisar proporciones, variantes, dimorfismo, legendarios y relictos. Clasificar por ficha los cambios que requieran corrección y registrar las decisiones de recorte, peso y calidad. Contrastar con fondos claros y oscuros.
4. **Rendimiento y estabilidad.** Repetir las mediciones de Campo, memoria y navegación entre módulos, con y sin conexión, antes de autorizar cambios de alcance. Verificar el presupuesto de caché y la presentación móvil junto con la migración de partidas.

La auditoría se prepara sobre esta entrega web y la firma de Android conserva la configuración vigente.

## Reproducción

```bash
node scripts/audit-scientific-catalog.cjs --world-coverage
npm run release:verify
```
