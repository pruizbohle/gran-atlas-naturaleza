# Laboratorio naturalista V4.2.1

Desde la raíz del repositorio, inicia `python3 -m http.server 8080 --directory www`. Abre el [laboratorio local](http://localhost:8080/naturalist-art/) o el [juego local](http://localhost:8080/).

El laboratorio filtra por grupo, familia, especie y estado del recorte. **Antes y después** compara cada lámina a 256 px con su versión de V4.2.0. **Compresión** presenta diez muestras a 512 px con calidad WebP 75, 80, 85, 90 y 95 frente a la edición del juego. El fondo de revisión alterna claro, oscuro y cuadrícula. Los modos de Campo, Campo mixto, Cuaderno, Bestiario y Museo usan el renderizador compartido. **Presentación** permite contrastar los halos actuales con el marco clásico.

**Revisión artística** permite anotar cada variante y descargar el JSON. Las anotaciones personales se guardan en el navegador. El JSON incluye el estado del recorte, las observaciones de esta edición y el progreso acumulado. Los originales de comparación y las muestras de compresión se incluyen en el caché offline.

El [estándar de Serie 4](../../docs/naturalista-v421/estandar.md) documenta los criterios de calidad, compresión y publicación.
