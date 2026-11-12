# AND-03 · Respaldo y migración

El gestor mantiene `gran_atlas_v05`, el formato JSON v1 y los plugins AtlasExport/AtlasImport. Compartir resuelve Filesystem y Share mediante la API actual de Capacitor si no están en Plugins. Importar nunca ocurre al elegir un archivo: primero se valida y previsualiza, después se confirma expresamente.

Se invalidan las selecciones pendientes al iniciar otra lectura nativa. Una respuesta antigua no reemplaza la selección más reciente; el mensaje diferido del guardado tampoco valida otra restauración. Se rechazan formatos incompatibles y claves de prototipo peligrosas en niveles anidados. Fallar al escribir la copia de emergencia impide adoptar el respaldo. Una restauración fallida conserva la partida anterior y sus bytes guardados cuando la recuperación puede completarse; si también falla la recuperación se informa expresamente y se conservan las copias.

Quince pruebas actuales usan el motor real y puentes nativos simulados: todos los campos de una partida avanzada, previsualización/confirmación, texto/archivo, cancelación, lecturas fuera de orden, cuota y trabajos pagados una sola vez. No acreditan un selector Android físico. Las migraciones históricas se ejecutan además sobre sus fuentes exactas y se comprobarán contra el candidato actual en el navegador.

## Procedimiento del propietario

1. Antes de tocar la instalación anterior, guardar el JSON mediante Guardar o Compartir en una ubicación externa al almacenamiento privado de la app. Conservar al menos dos copias independientes, por ejemplo Descargas y PC, y comprobar nombres y tamaños.
2. Anotar privadamente libras, conocimiento, prestigio, región, mapas, equipo, investigación, especies/avistamientos, publicaciones/variantes, logros, misiones, Museo, comercio, viajes, excavaciones y operaciones oceánicas.
3. En un perfil de navegador separado, importar una copia; revisar la previsualización antes de confirmar. Verificar los datos y volver a exportarla. No usar una partida web personal para esta comprobación sin respaldarla.
4. Si falla cualquier comprobación, conservar la instalación original y detener la transición. No basta con tener un archivo llamado JSON: debe validarse y poder restaurarse/exportarse.
5. Comparar certificados públicos. **Mismo certificado e ID:** actualización normal del candidato, sin desinstalar. **Certificados distintos:** no se puede instalar por encima; solo el propietario, con las copias ya validadas y autorización expresa de la transición, puede desinstalar manualmente e instalar el candidato. Nunca hay desinstalación automática.
6. Restaurar en el candidato exacto, comprobar los campos anotados, cerrar totalmente, reabrir offline y exportar otra copia. Considerar el avance legítimo del tiempo; verificar que un recibo o premio no se pague dos veces. Guardar resultados del dispositivo siguiendo la lista física.

No se requieren archivos privados en Git ni en el chat. Las pruebas con datos personales permanecen en los dispositivos del propietario; el registro público contiene únicamente resultados y metadatos no sensibles del candidato.
