# MEC-09D Preview 01 · revisión web jugable

- Enlace (versión fija, CDN): https://rawcdn.githack.com/pruizbohle/gran-atlas-naturaleza/700f983cf3ac5ab145eb3c1f3d3fd0cc3802ee55/index.html
- Enlace alternativo (sigue la rama): https://raw.githack.com/pruizbohle/gran-atlas-naturaleza/preview-mec09d-01/index.html
- Rama de despliegue: `preview-mec09d-01` (huérfana, commit `700f983`), construida desde `mec-09d/consolidation` `86bc3af` con `scripts/build-preview-mec09d.cjs`.

## Qué es

Copia exacta de `www/` (V5.6.9, todas las mecánicas hasta MEC-09C y la consolidación de pruebas de MEC-09D). Solo cambia:

1. **Guardado independiente.** Las cinco claves de almacenamiento llevan el sufijo `_preview_mec09d`, así que la Preview nunca lee ni escribe la partida pública, aunque se abra en el mismo origen.
2. **Insignia visible** «MEC-09D Preview 01 · V5.6.9 · 86bc3af · guardado independiente» y el título de la pestaña.
3. **Sin instalación PWA.** No registra el trabajador sin conexión y oculta el actualizador, porque los archivos identificados no coinciden con el manifiesto de la publicación, que no se reescribe.

La rama no altera la versión pública: GitHub Pages sigue publicando `main`. No hay cambios de juego ni de balance, no se genera APK y no se usan herramientas de desarrollo nuevas.

## Verificación

**En Chrome sin interfaz, con los mismos archivos servidos localmente**, a 1366×800, 1366×900 y 390×844:
- cero errores de consola o de página y cero recursos fallidos (4xx o error de red);
- láminas e iconos cargados;
- las 10 secciones (Atlas, Campo, Cuaderno, Investigación, Sociedad, Bestiario, Campamento, Inventario, Museo, Corona) se abren con sus imágenes;
- «Observar fauna» registra avistamientos en `gran_atlas_v05_preview_mec09d`, que se conservan al recargar;
- la clave pública `gran_atlas_v05` no se crea.

**En remoto:** los dos enlaces sirven el `index.html` identificado y `preview-mec09d.json` (8264 archivos). La ejecución del juego en el navegador remoto no se pudo comprobar desde el entorno de trabajo, que no puede abrir esos servidores en un navegador.
