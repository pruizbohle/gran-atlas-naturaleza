# Atlas continental simple · corrección de alcance

La propuesta de 406 celdas era excesiva. Esta corrección mantiene el motor hexagonal y la interfaz móvil, y reduce el Atlas a **73 celdas**, con las **57 regiones existentes** accesibles. No se añaden regiones funcionales, fauna, requisitos ni progreso.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Comparación interactiva](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-atlas-v3211b.html) · [Antes y después](docs/atlas-simple/comparison.png)

| Continente | Antes | Ahora | Composición actual |
| --- | ---: | ---: | --- |
| Europa | 79 | **10** | Sus diez regiones, sin relleno |
| Asia | 152 | **25** | 21 regiones y cuatro celdas vacías de hielo al norte |
| África | 70 | **24** | Sus 24 regiones con celda propia; dos islas independientes |
| Norteamérica | 105 | **14** | Las 14 celdas originales del Excel; dos regiones jugables actuales |
| Total | 406 | **73** | 57 regiones con celda propia y 16 celdas no jugables |

Europa sugiere las Islas Británicas separadas, Escandinavia al norte, Iberia al suroeste y el centro europeo con Italia/Balcanes y la prolongación oriental. Asia concentra Siberia bajo una franja corta de hielo, con las proyecciones meridionales y Japón separado. África mantiene un norte ancho, centro y extremo sur estrecho. Norteamérica usa una forma breve con Alaska al noroeste y las referencias de Canadá, Estados Unidos y México.

**Las dos islas africanas quedan separadas del continente y entre sí por mar visible.** Madagascar y Seychelles/Aldabra tienen celdas independientes. Una prueba específica comprueba la separación de ambas respecto del continente y de la otra isla. Las 24 regiones africanas mantienen sus datos y acciones individuales; sus posiciones se aproximan al mapa real, priorizando una silueta compacta.

## Referencia Excel

Se revisó el archivo aportado `Atlas_Fauna_Hexagonal_209_900_Especies.xlsx`, en especial las hojas Mapa y Hexágonos. Contiene 209 registros, con diez zonas europeas y 21 asiáticas; su referencia africana tiene 14 y la norteamericana 14. El juego actual conserva sus 24 regiones africanas y dos norteamericanas.

La planilla se usó para contrastar cobertura y nombres. No se copiaron sus 209 casillas ni sus coordenadas de pantalla, ni se importaron especies, rarezas o reglas. [Registro de la fuente revisada](docs/atlas-simple/spreadsheet-reference.json).

## Verificación

**227 pruebas automáticas y 100 casos responsive aprobados**, con 0 px de scroll vertical en los casos revisados. Se mantienen el radio uniforme, las coordenadas axiales y los lados compartidos sin espacios. Las pruebas comprueban todos los pares vecinos, los contornos cerrados, ausencia de solapamientos y los límites de celdas de esta corrección. En Europa y África todas las celdas tienen regiones; las cuatro celdas de hielo asiáticas son inertes. Las doce celdas norteamericanas restantes conservan los nombres e IDs de la planilla como referencia cartográfica, sin activar fauna ni progreso nuevos. Una prueba coteja el inventario exacto de las 14 celdas con el Excel.

Se comprueban selección de las 57 regiones, regiones individuales, viaje a Campo, teclado, desplazamiento, zoom, guardado y funcionamiento offline. La vista inicial muestra el continente completo dentro del panel; los detalles y la acción conservan su lugar por encima del dock. Las pruebas usan 320 × 640, 360 × 740, 390 × 844, 412 × 915 y escritorio.

[Resultados del navegador](docs/atlas-simple/browser-report.json) · [Geometría y posiciones](docs/atlas-simple/geometry.json) · [Captura de África en móvil](docs/atlas-simple/africa-320.png).

La comparación del laboratorio muestra la propuesta de 406 celdas frente a esta corrección; las celdas de la vista actual se dibujan con el motor de producción. Se retiraron del mapa actual los trazos ambientales y marcadores duplicados que no ayudaban a leer las siluetas. Se conservan los IDs internos, las reglas de desbloqueo y el formato de las partidas. Campo y el resto del juego mantienen sus implementaciones.

## Archivos y reproducción

Los cambios se concentran en `atlas-geography-v3211b.js`, el dibujo del Atlas, sus estilos y el laboratorio. Los snapshots de la propuesta anterior solo se cargan en la comparación. La revisión final incorpora la petición de conservar las 14 celdas norteamericanas del Excel y las 24 regiones africanas independientes. Se actualizan la caché offline y las referencias de recursos; la precarga pide archivos frescos para evitar reutilizar una revisión HTTP anterior; la versión visible continúa siendo 3.21.1b.

```sh
node --test tests/*.test.cjs
node scripts/audit-geography-v3211b.cjs
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-geography-browser-v3211b.cjs
```

Las pruebas de navegador requieren Playwright y Chromium. No sustituyen la revisión física en un teléfono Android.
