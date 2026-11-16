# El Gran Atlas 3.43.0 · Implementación aprobada para publicación

El usuario aprobó Campamento y perfil, solicitando únicamente un botón explícito para volver al Campamento. El usuario aprobó también la integración y publicación en GitHub. Se publica la versión web 3.43.0 con el botón solicitado. No se construye una APK.

## Cambio solicitado

Las cinco instalaciones tienen el botón **← Volver al Campamento**, con área táctil de 44 px. Vuelve al plano general sin iniciar actividades ni gastar recursos. El diseño aprobado se conserva.

[Captura móvil del botón](production-back-390.png) · [Campamento móvil](production-camp-390.png) · [Campamento escritorio](production-camp-1280.png)

## Integración

- El juego real incorpora Campamento, ocho retratos, perfil opcional y estadísticas. Conserva el alias `expeditions` y los diez módulos.
- Los motores, catálogos y operaciones anteriores permanecen intactos fuera del adaptador de presentación y la normalización opcional del perfil. Una prueba compara el código anterior byte a byte retirando esas adiciones.
- Inventario, Museo, Sociedad y notificaciones usan los adaptadores de navegación originales. El acceso de Caravana al Taller también llega a su instalación con el botón de vuelta.
- `naturalistProfile3430` es opcional, se conserva en la misma partida, se valida al cargar/restaurar y viaja en JSON de formato 1. Las partidas sin perfil no reciben valores persistidos hasta configurarlo.
- El gestor de respaldos conserva su lógica SAF, recuperación, confirmación y copia de emergencia. Su única modificación es la versión del exportador, 3.43.0.
- El avatar conserva las advertencias de cuota y de partida ilegible. No reemplaza una partida que no pueda leer.
- Los indicadores del plano se actualizan desde la persistencia/tick original, sin añadir intervalos.
- Cabecera, menú móvil, paquete web, metadatos, actualizador y caché PWA son coherentes con 3.43.0. Se incluyen 190 rutas offline.
- No se cambian firma, paquete, código nativo, workflows de APK ni certificado Android. El workflow web de Pages ejecuta el validador 3.43.0; este conserva los controles históricos Android en su referencia exacta 3.42.0. No se construye una APK.

## Verificación

El validador `scripts/validate-campamento-v3430.cjs` ejecuta la suite histórica 3.42.0 sobre su commit original `c9991a5` y las regresiones actuales de navegación, respaldos, migración de partidas 3.28–3.42 y perfil. Las pruebas históricas originales no se editan.

El navegador ejecutó el `index.html` real de 3.43.0, sin puentes de prueba ni reloj de laboratorio dentro de los archivos de producción:

- 320, 360, 390, 412 y 1280 px; cinco partidas sintéticas por ancho y 125 entradas y retornos de instalaciones.
- Botón visible de 44 px, sin desbordamiento y sin cambios de progreso al consultar.
- Nombre/avatar persistentes tras recargar, exportación 3.43.0 y restauración confirmada por el gestor real.
- Advertencia de cuota visible y acceso a respaldos.
- Partida ilegible conservada sin reemplazar, con aviso original accesible.
- Instalación del service worker y recarga real con el navegador sin red.
- Sin errores JavaScript en los recorridos de integración.

[Validación completa: 896 pruebas Node y 61 Python, incluyendo regresiones repetidas](validation-report.json) · [Informe de navegador](production-report.json) · [Manifiesto de la candidata](release-manifest.json)

## Revisar la candidata

El servidor local del entorno sigue disponible en `http://127.0.0.1:8783/index.html`. Esta dirección pertenece al entorno de desarrollo y no es una publicación.

Los bundles ZIP de revisión se entregaron en la conversación y no se versionan. Para ejecutar la copia del repositorio:

```sh
python3 -m http.server 8783 --directory www
```

Abrir `http://127.0.0.1:8783/index.html`. El laboratorio aislado actualizado sigue disponible en `laboratorio-campamento-perfil-v3430.html`, con el botón solicitado y partidas sintéticas.

La automatización del escritorio compartido había fallado al abrir pestañas. Las verificaciones y capturas anteriores proceden del navegador Chromium de pruebas; no se afirma haber dejado una pestaña compartida abierta.

## Alcance de publicación

Integración y publicación autorizadas por el usuario. La prueba en un teléfono Android físico y la distribución de una APK no forman parte de esta versión web.
