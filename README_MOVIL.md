# El Gran Atlas v2.5 — primera edición móvil

Conserva el motor de v2.4.2 y sus 280 especies. Se modificó la interfaz y se añadió navegación vertical en pantallas pequeñas. Los diez módulos permanecen disponibles. No se han modificado los sprites, la economía ni los requisitos de prestigio.

## Prueba inmediata desde el teléfono

1. Sube el contenido de la carpeta `www/` a la misma web de GitHub Pages donde juegas actualmente.
2. Abre la página desde tu teléfono y recárgala. En Android puedes instalarla desde el menú del navegador como app web si la página está servida por HTTPS.
3. Si el navegador conserva contenido anterior, recarga una vez más con conexión. El caché offline se actualizará.

**Guardado:** si mantienes el mismo dominio, ruta y navegador, `localStorage` conserva la partida. Antes de reemplazar el sitio conviene hacer una copia de seguridad del guardado. Una APK de Capacitor utiliza otro origen y no importa automáticamente los datos guardados en el navegador.

## Navegación

- Barra fija: Atlas, Campo, Cuaderno, Investigación y Más.
- Más: Expediciones, Museo, Sociedad, Bestiario, Inventario y Corona.
- En escritorio permanece la navegación completa de diez botones.
- Investigación conserva el árbol ancho, con desplazamiento táctil horizontal.

## Base para Android con Capacitor (opcional)

Instala Node.js y Android Studio. Desde la carpeta que contiene package.json ejecuta:

```bash
npm install
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```

Esto es el proyecto fuente preparado para Android, no un APK compilado. Capacitor no convierte por sí solo el guardado del navegador web al de la app instalada.


## Versión 2.5.1 · móvil compacto

- Cabecera y estadísticas compactas; tres recursos principales siempre visibles, secundarios desplegables.
- Campo redimensionado con botón de observar visible y filtros plegables.
- Cuaderno: selector de especies en lugar de largas tarjetas en pantallas móviles.
- Menú inferior y subpestañas reducidas, sin eliminar funciones.
- Fondo inicial de prueba de £420, solo en partidas nuevas. Partidas previas conservan su saldo exacto.
- Corona: paquetes **gratuitos simulados** y canje 1 corona = £1. No hay pasarela ni compras reales.
- Actualización de versión de caché PWA, sin modificar la clave de guardado.


## Fase 3 · v3.0.1

Respaldo y recuperación de partida desde el botón 💾, exportación Android mediante menú de compartir y flujo de firma estable preparado. Consulta [README_RESPALDOS_ANDROID.md](README_RESPALDOS_ANDROID.md) para instrucciones, limitaciones y claves.
