# El Gran Atlas — Beta 3.10

## Expansión de África
- Lagos del Rift (HX-08-12, prestigio 107): flamenco enano, pelícano blanco, jirafa de Rothschild, gran kudú y fauna compartida.
- Islas Seychelles y Aldabra (HX-07-14, prestigio 110): tortuga gigante, loro negro, cernícalo y tiburón de puntas negras, más fauna marina compartida.
- 20 regiones africanas, 385 especies globales; no se cambian regiones ni especies anteriores.

## Museo
- Fósiles: Fósil catalogado (3 fragmentos fósiles + 180 conocimiento), Registro de huellas antiguas (2 fragmentos fósiles, 2 huellas + 300 conocimiento).
- Relictos: Carta cartográfica histórica (2 fragmentos de mapa, 1 moneda antigua + 180 conocimiento), Medallón de expedición (2 monedas antiguas, 1 pergamino antiguo + 300 conocimiento).
- Los materiales ya existentes se descuentan al catalogar y las piezas quedan marcadas permanentemente. Sin ingresos ni prestigio adicionales.
- La pestaña Museo permite comprobar recursos y catalogar cuando se cumplan requisitos.

## Compatibilidad
- Conserva clave `gran_atlas_v05`, esquema `el-gran-atlas-save` v1 y los datos anteriores.
- La subclave opcional `museum.collections` no afecta partidas antiguas; se carga por defecto vacía.
- Android usa `com.elgranatlas.naturaleza.beta310`, instalación independiente. Exportar JSON en 3.9, instalar 3.10, importar y comprobar la persistencia.
- Pruebas automáticas: regiones, fauna, ilustraciones, costes únicos, persistencia y recuperación de JSON anterior.
