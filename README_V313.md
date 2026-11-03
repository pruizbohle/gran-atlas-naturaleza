# El Gran Atlas — Beta 3.13 · Regularización de África

## Datos y contenido
- Se incorporan dos regiones: **Desierto del Sáhara** (HX-06-07, prestigio 119) y **Sahel oriental** (HX-07-11, prestigio 122).
- África alcanza **24 regiones**. Se mantiene el requisito del Mapa de África y el desbloqueo progresivo sin consumir prestigio.
- Se incorporan **38 nuevas fichas de fauna** tomadas como referencia del Excel `Atlas_Fauna_Hexagonal_209_900_Especies(2).xlsx`, y se reutilizan tres especies existentes en Europa/Asia (gato de las arenas, gineta, tortuga griega).
- Se asignan **okapi** a Cuenca del Congo y **facóquero** a distintas sabanas y al Sahel, antes definidos pero no observables en ninguna zona africana.
- Se amplía la fauna en Madagascar, Magreb, Nilo, Congo, sabanas, Cuerno de África y Etiopía.
- `AFRICA_EXCEL_HEX` contiene correspondencias del Excel original. **No se modifican ID de regiones antiguas**.
- `AFRICA_V313_ASSIGN` contiene las ampliaciones por región y omite duplicados.

## Compatibilidad
La clave de guardado sigue siendo `gran_atlas_v05`, y el formato de respaldo JSON no cambia. Los datos previos del Museo, exposiciones, relictos, expediciones, publicaciones, investigación y avistamientos se conservan. Se recomienda exportar el guardado previo antes de instalar la nueva aplicación Android.

## Control de calidad
- Pruebas de 24 regiones, IDs únicos, fauna regional, equivalencias con el Excel y ausencia de duplicación taxonómica entre fichas africanas nuevas y previas.
- Comprobaciones ecológicas sin cambiar los biomas originales de regiones anteriores.
- Actualización de la versión web, la caché de service worker y la configuración de Capacitor.

## Límite del alcance
El Excel de 900 especies funciona como referencia maestra para seguir ampliando el mundo. Esta versión **no carga todas las especies del Excel** ni reemplaza las 22 regiones históricas por los 14 hexágonos de la hoja.
