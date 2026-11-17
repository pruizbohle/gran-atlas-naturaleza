Estado actualizado: laboratorio aprobado expresamente el 17-11-2026. Integración web 3.44.0 autorizada, sin cambios adicionales de coordenadas. Los textos siguientes conservan el historial de revisión; ver `publicacion-3.44.0.md` para el cierre de integración.

# GM-06E — candidato para revisión

Base: `41a4bbdc90a16ebdb612f67591ea6e2dd9dfe259` (3.43.0). Rama local: `feat/gm06-cartografia-naturalista`. Destino posterior a aprobación: 3.44.0.

Esta entrega contiene el motor jugable candidato y el laboratorio cartográfico y zoológico. **No se ha creado ningún commit, push, despliegue ni APK.** La entrada pública `www/index.html`, su versión, service worker y manifiesto de publicación permanecen en 3.43.0.

Abrir `www/laboratorio-cartografia-gm06.html`. Es un archivo autónomo, sin bibliotecas, fuentes ni imágenes remotas. Incluye comparación anterior/propuesta, referencia mundial, cambios por ID, galería paginada con escalas 48/80/120, tres niveles especiales y escenarios con el motor real. Los enlaces de bibliografía necesitan conexión; el laboratorio no.

El motor del marco usa un sandbox sin `allow-same-origin` y reemplaza localStorage/sessionStorage por un Map. No consulta el guardado de producción. Los botones de encuentro garantizado son herramientas del laboratorio. La búsqueda ordinaria del motor conserva sus probabilidades.

## Contenido

- 997 especies: 945 fichas anteriores intactas y 52 incorporaciones, todas asignadas y jugables.
- 125 regiones ordinarias: 113 IDs anteriores y 12 nuevos. Rapa Nui es un expediente aparte.
- Tres puntos de extensión opcionales en `app.js`: instalación del catálogo, ilustraciones y exclusión de nuevas regiones del recálculo histórico de prestigio.
- Coordenadas axiales por ID estable en los seis continentes terrestres. Polos, mares, profundidades y fosas conservan su cartografía.
- Los 240 coleccionables permanecen como referencia documental. Su biblioteca artística independiente no se mezcla con esta rama.

Validación retomada el 17 de noviembre de 2026: ver `cierre-validacion.md` y `pruebas/validacion-final.json`. Pendiente de aprobación expresa del laboratorio conforme al paso 7.

Consultar `geografia.md`, `zoologia.md`, `arte.md`, `planificacion-regional.md`, `rapa-nui.md`, `pruebas.md` y las matrices generadas. `resumen-generado.json` contiene los recuentos exactos de la compilación.

## Reconstrucción

Desde la raíz del repositorio:

```sh
python3 scripts/build-gm06-data.py
python3 scripts/build-gm06-geography.py
node scripts/build-gm06-lab.cjs
node --test tests/gm06*.test.cjs tests/cp3430-ui.test.cjs tests/cp3430-release.test.cjs
python3 -m http.server 8126 --directory www
```

En otra terminal, `node scripts/test-gm06-browser.cjs` verifica los cinco anchos. Playwright y Chromium deben estar instalados en el entorno de pruebas. No son dependencias del juego.

## Después de la revisión

Recoger observaciones, corregir el candidato y solo después de la aprobación crear commits e integrar 3.44.0. Esa integración añadirá los módulos GM-06 a la entrada web y regenerará versiones, precache y manifiestos. El botón de volver al Campamento de la versión anterior se conserva. Android permanece como proceso independiente.
