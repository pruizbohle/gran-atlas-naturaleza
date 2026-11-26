# ART-OBJ-13 · Revisión artística y técnica

El manifiesto vigente se genera con `scripts/build-art-obj-12.cjs` y conserva el mapa de rutas de ART-OBJ-12. [Cobertura de coleccionables](coleccionables.csv) · [Pendientes](pendientes.csv)

Las variantes de 64, 128 y 256 px de la colección forman parte de la instalación offline. Las de 512 px se verifican por tamaño y SHA-256 al solicitarlas y quedan disponibles en la caché de la revisión. Las ampliaciones que todavía no se hayan consultado requieren conexión. Las pruebas del trabajador cubren ambos casos.

## Lote 1 · Botánica

Se cotejaron individualmente 31 láminas nuevas y sus 124 WebP. En el herbario se revisaron las estructuras florales y el follaje. Las maderas se representan como muestras pulidas con muestras de veta entrelazada, grano longitudinal, albura o poro visible según el ejemplar. Los helechos se leyeron por ramificación, pinna, roseta, fronda entera o hábito arborescente.

Las planchas usan los mismos archivos que Inventario y Museo. [64 px](planchas/01-64.webp) · [128 px](planchas/01-128.webp)

Pasaron 26 pruebas de ART-OBJ-12, ART-OBJ-13, MEC-01 y del trabajador offline. Chromium a 390 × 844 px verificó el visor, la búsqueda, el filtro de colección, los estados, el fondo oscuro y el acceso al Lote A de ART-OBJ-12.
