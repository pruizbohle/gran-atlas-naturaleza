# Actualizar El Gran Atlas y conservar la partida

Si la aplicación sigue mostrando V4.3 o una edición anterior, abre el actualizador universal en **el mismo navegador y perfil** que usas para jugar. Si tienes una ventana de la aplicación instalada, espera a que guarde y ciérrala antes de instalar la actualización. [Abrir el actualizador](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

1. Conéctate a internet y abre el enlace universal.
2. Comprueba las dos versiones y pulsa **Descargar actualización**. El actualizador guarda y verifica una copia exacta de la partida local antes de descargar.
3. Espera el mensaje **Descarga completa e integridad verificada**. Puedes guardar el archivo con **Descargar copia de la partida**.
4. Cierra las otras pestañas y ventanas del Atlas. Pulsa **Instalar** y vuelve al juego.
5. Si se interrumpe la descarga, vuelve a intentarlo cuando regrese la conexión. El juego anterior y la partida siguen disponibles.

Desde V4.9.0, el juego consulta la versión publicada al abrir y recuperar el foco, con un intervalo de un minuto. **Menú del naturalista → Guardar y restaurar → Buscar actualizaciones** realiza una consulta manual. **Más tarde** oculta el aviso durante esa sesión. Si el navegador es nuevo, el mismo actualizador ofrece **Descargar para jugar sin conexión**. La página se puede usar con o sin una partida previa.

## Comportamiento con V4.3

El service worker de V4.3 sirve archivos con preferencia por su caché. Una apertura normal puede seguir titulada V4.3.0 mientras el servidor publica otra versión. El enlace histórico `actualizar.html` incluso puede mostrar su texto de V3.38.0. Agregar un parámetro a ese enlace no cambia el resultado porque ese worker descarta la consulta al buscar en caché. La ruta `actualizar-atlas.html` se publicó por primera vez en V4.9.0 y V4.3 la pide a la red.

Si instalaste el juego con otro perfil, vuelve a abrir el enlace allí para acceder a su partida. Los archivos de respaldo se pueden recuperar desde **Respaldos → Recuperar una partida JSON**. El proceso normal conserva los datos del sitio, incluido el almacenamiento de la partida.

## Cómo funciona

La comprobación lee `atlas-release.json` mediante una consulta única con `cache: no-store`. El worker trata la consulta de versión como exclusiva de red. La revisión de descarga liga mediante SHA-256 el manifiesto `atlas-integrity.json` al worker. El worker coteja los bytes y el SHA-256 de cada archivo y muestra el avance según archivos verificados. Una descarga fallida descarta su caché parcial y permite reintentar. Al activar la revisión correcta se retiran las cachés obsoletas del juego.

La página escribe en `gran_atlas_backup_before_update` los bytes exactos de la partida `gran_atlas_v05` y vuelve a leerlos antes de aceptar la copia. Si cambia durante la descarga, se renueva la copia cuando el usuario se dispone a instalar. Se bloquea la activación manual mientras queden otras ventanas del Atlas abiertas. La página confirma el cambio de controlador antes de anunciar el final. Los actualizadores históricos mantienen su protocolo. Los respaldos locales y las referencias opcionales del laboratorio tienen su propio almacenamiento. [Verificador de revisiones](../../scripts/build-naturalist-release.cjs) · [Service worker](../../www/sw.js)
