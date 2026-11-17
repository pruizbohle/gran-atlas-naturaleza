# Integración web 3.44.0

El usuario aprobó expresamente el laboratorio GM-06 el 17 de noviembre de 2026 y autorizó avanzar con la integración. Las sugerencias menores de ubicación quedan diferidas: se publican las coordenadas ya revisadas. Esta aprobación reemplaza los estados pendientes conservados en los informes históricos de GM-06E.

La entrada pública carga catálogo, cartografía y arte GM-06 antes de iniciar el motor. Paquete, lockfile, PWA, metadatos de respaldo y actualizador indican 3.44.0. El nuevo precache contiene los tres módulos, el laboratorio y la página de actualización; se conserva la activación explícita con copia exacta de partida y cierre de otras ventanas.

| Contenido | 3.43.0 | 3.44.0 |
|---|---:|---:|
| Especies | 945 | 997 |
| Regiones | 113 | 125 |
| Asociaciones | 1.744 | 1.829 |

Rapa Nui es un expediente especial fuera del recuento. No se integra la biblioteca de 240 coleccionables, no se modifican la economía ni los flujos nativos, y no se genera APK. Las firmas, los workflows Android y la configuración de Capacitor se comparan byte a byte con la base. El gestor de respaldo solo cambia su etiqueta `gameVersion`; conserva formato 1 y todo su código funcional.

## Verificación

- Verificador completo de release 3.43.0 ejecutado en el worktree de referencia, incluida su cadena de contratos históricos: aprobado.
- 93 pruebas actuales de GM-06, accesibilidad completa, offline, Campamento, migraciones 3.28–3.42, respaldo, brújula, navegación y eventos: aprobadas.
- Tres pruebas de integración pública, archivos Android protegidos y hashes/precache: aprobadas.
- Actualización real local de una PWA 3.43.0: copia previa idéntica, recursos/inventario/perfil preservados y recarga offline de 3.44.0. Evidencia: `pruebas/produccion-local.json`.
- Manifiesto reproducible con hashes de todos los archivos web: `release-manifest.json`. El pipeline repite el verificador de referencia y las pruebas actuales antes de desplegar.

Los 210 fallos de la suite general histórica identificados en la auditoría anterior permanecen documentados; no se usan como una supuesta suite verde. El gate de publicación ejecuta contratos de cada versión en su referencia original y pruebas vigentes contra 3.44.0.

## Enlaces

- Juego: https://pruizbohle.github.io/gran-atlas-naturaleza/
- Laboratorio: https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-cartografia-gm06.html
- Actualización conservando la partida: https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3440.html

La comprobación del despliegue se registra después de finalizar GitHub Pages. No se inicia GM-07.

## Publicación verificada

GitHub Pages completó correctamente el [run 44126811877](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/44126811877), con el commit de aplicación `52446ca8e434e8980ba29e625196da80546501ba`. Las comprobaciones y el despliegue finalizaron con `success`.

Los **204 archivos web publicados** se descargaron por HTTPS con validación de certificados y coinciden byte a byte con los hashes del manifiesto de release. Evidencia: `pruebas/publicado-https.json`.

Se verificó también el juego, Campamento y el laboratorio sin conexión usando el service worker y una copia local exacta de esos archivos publicados. El Chromium administrado rechaza la autoridad certificadora remota; no se deshabilitaron certificados ni se afirma que esa prueba de navegador se ejecutó bajo el origen público HTTPS. La comprobación HTTPS de todos los archivos se hizo con el cliente de red de confianza del entorno. Detalle: `pruebas/publicado-offline.json`.

La cadena histórica de referencia y las 96 comprobaciones actuales pasaron antes del despliegue. La prueba local de actualización real desde la PWA 3.43.0 conservó la copia exacta, recursos y perfil. Los ajustes menores de hexágonos indicados por el usuario quedan pendientes de sus sugerencias; no se cambiaron las coordenadas aprobadas.
