# Laboratorio naturalista V4.3.0

Desde la raíz del repositorio, inicia `python3 -m http.server 8080 --directory www`. Abre el [laboratorio local](http://localhost:8080/naturalist-art/) o el [juego local](http://localhost:8080/).

**Antes y después** permite alternar el SVG del juego y el original de referencia de V4.2.0, cuando existe. **Compresión** compara diez muestras a 512 px a calidades WebP 75, 80, 85, 90 y 95. El fondo cambia entre claro, oscuro y cuadrícula. Los filtros por grupo, familia, especie y estado del recorte se aplican a la galería y las vistas de revisión. Campo, Campo mixto, Cuaderno, Bestiario y Museo usan el renderizador gráfico del juego. **Presentación** permite comparar los halos con el marco clásico.

**Revisión artística** permite anotar cada variante y exportar el JSON con el estado de recorte y el progreso acumulado. Las observaciones personales se guardan en el navegador. Los SVG, las láminas y las vistas de juego están en el caché básico. Los originales WebP y las muestras de compresión se guardan al consultarlos. **Descargar comparaciones offline** permite preparar todo ese lote por separado para usarlo sin conexión.

[Informe V4.3.0](../../docs/naturalista-v430/README.md) · [Estándar de Serie 4](../../docs/naturalista-v421/estandar.md).
