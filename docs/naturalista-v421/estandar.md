# Estándar gráfico naturalista de El Gran Atlas

Vigente desde V4.2.1. Es el criterio de aceptación de las siguientes migraciones de Serie 4, comenzando por V4.3.0 · Primates.

## Lámina del animal

- Acuarela y grafito naturalistas, con anatomía, proporciones, pelaje y rasgos diagnósticos reconocibles a tamaño de juego. Las variantes biológicas, el dimorfismo y los individuos legendarios se ajustan a las entradas ya configuradas en el catálogo.
- Entregar una lámina canónica cuadrada WebP de 512 × 512 px con transparencia real y derivados de 64, 128 y 256 px. Dejar margen para patas, orejas, cola, bigotes y halos. El encuadre de un original existente conserva sus límites.
- Al migrar una lámina existente, aplicar una máscara al original. Revisar por separado pelaje fino, bigotes, orejas, cola, garras, membranas, extremidades, espacios entre patas y vegetación o piedra en contacto con el ejemplar. Comparar a 512 px sobre fondo claro, oscuro y cuadrícula. Comprobar la legibilidad a 64 y 128 px.
- El punto de partida es WebP con calidad 90 a 512 px, 86 a 256 px, 83 a 128 px y 82 a 64 px. Conservar el alfa a calidad 100 y descartar RGB bajo transparencia total. Medir peso y revisar la textura visible. Registrar cualquier borde dudoso por nombre de archivo en `www/naturalist-art/review/observations.json`.
- El sistema usa una misma lámina por variante y tamaño en Campo, Bestiario, Cuaderno y Museo. La composición definitiva entrega el animal con alfa y el ambiente por separado.

## Composición

| Capa | Tratamiento |
| --- | --- |
| Paisaje | Campo elige el paisaje y la iluminación por región, bioma y hora activos. Bestiario usa un paisaje genérico del hábitat representativo. Cuaderno usa papel naturalista y Museo un fondo discreto de vitrina. |
| Halo | Normal sin halo. Notable en bronce, Épico en plata, Excepcional en oro. Legendario combina luz esmeralda y contorno cálido. El efecto de CSS sigue el alfa y acompaña la silueta. |
| Ilustración | WebP transparente. Cada módulo usa la misma ruta de ilustración según variante y tamaño. |
| Interfaz | Etiquetas y controles sobre la composición. Los indicadores de cantidad y apariciones múltiples siguen en Campo. El laboratorio conserva el marco clásico para comparación. |

Reutilizar la biblioteca de paisajes por bioma. Agregar una escena solo cuando se documente una diferencia geográfica o ecológica que la biblioteca actual no representa.

## Cierre de cada migración

1. Comprobar las asociaciones y variantes contra el catálogo. Revisar la máscara y el peso por resolución. El laboratorio muestra el original de referencia y el recorte mediante archivos separados.
2. Generar los derivados, regenerar el catálogo gráfico con `node scripts/build-naturalist-lab.cjs` y recalcular la revisión de caché con `node scripts/build-naturalist-release.cjs --write`.
3. Ejecutar `npm run release:verify` y revisar Campo automático, Bestiario, Cuaderno, Museo, laboratorio y actualización offline. Confirmar que las partidas guardadas se conservan. La evidencia Android distingue contenido del APK, firma y prueba de restauración en dispositivo.
