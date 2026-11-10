# 3.31.0 — Regiones polares

GM-03 añade 21 identidades, siete regiones y 45 presencias: **828 especies, 94 regiones, 1.505 presencias**. Se reutiliza Vulpes lagopus sin modificar su identidad, rareza o ilustración. Los 807 animales anteriores, sus registros regionales e ilustraciones se comparan íntegramente contra 3.30.0. No se inicia Océanos ni se generan APK.

## Etapas y decisiones

GM-03A: catálogo trazado desde los informes existentes GM-01, sin reauditar el Excel. [Decisiones científicas y editoriales](docs/gm03/decisions.md), [catálogo y filas originales](docs/gm03/catalog.json). Los IDs semánticos conservan HX de origen y evitan la colisión antártica con Costa del Cabo. No se incorporan celdas vacías.

GM-03B: tres sectores árticos y cuatro antárticos en grupos separados del Atlas. Aguas junto al hielo, banquisa ártica, banquisa antártica, costa antártica y enclaves rocosos interiores tienen filtros propios. El sector central antártico conserva sus cuatro filas como transecto de subáreas; solo el petrel níveo aparece en los enclaves interiores. Ningún cetáceo, tiburón ni calamar aparece en tierra. Todas las presencias tienen acceso manual y automático demostrado por el motor real.

Exploración polar: requiere Oceanía, £4500, 4000 conocimiento y cinco objetos fabricados acumulativos. El abrigo polar requiere capucha impermeable, morral reforzado, tres maderas talladas y dos pergaminos; sus fuentes son europeas, no polares. Se fabrica desde Inventario. Las cuatro preparaciones anteriores mantienen su acreditación y no se consumen. Prestigio por región: 282, 289, 296, 303, 310, 317, 324; Oceanía termina en 275. Prestigio no consumible y regiones anteriores conservadas.

Las cuatro rutas comerciales, mercado y trueques no cambian. La receta usa suministros ya accesibles: añadir otra ruta fría no aporta un recurso necesario y se descarta para evitar redundancia.

GM-03C: perfiles SVG de oso, morsa, pinnípedos, cetáceos, calamar, tiburón y aves polares. [Laboratorio normal/64 px](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-polar-v3310.html). Sin pigmentaciones ni dimorfismos nuevos; categoría jugable Notable con la tasa existente para hacer alcanzable el quinto nivel del Cuaderno. Conserva anatomía normal y no implica una variante zoológica.

GM-03D: actualización PWA con respaldo, caché completa y página de actualización histórica corregida: las ocho celdas son Oceanía, no Comercio. README principal actualizado. No cambia la clave `gran_atlas_v05` ni se reestructura la partida. La bandera polar es aditiva; los viajes comerciales pendientes conservan tiempos y recompensas únicas.

## Validación reproducible

Resultado local: **430/430 pruebas históricas y 11/11 pruebas del runtime actual aprobadas**. Las **430 pruebas históricas permanecen sin editar**. `node scripts/validate-polar-v3310.cjs` las ejecuta en un worktree temporal del commit real 3.30.0 `33c99b3`, con su código, recursos y expectativas originales. A continuación ejecuta las pruebas polares contra el código de producción actual. No se presentan las 430 pruebas como ejecutadas sobre el catálogo ampliado: las comprobaciones actuales contrastan las 807 identidades, 87 regiones, arte anterior, Comercio y partidas con la base real, además de probar la nueva expansión.

- `node --test tests/polar-v3310.test.cjs`: catálogo, colisiones, las 45 presencias, encuentros reales manuales/automáticos, prestigio, investigación, recetas, monografías, SVG, guardados y viajes comerciales pendientes.
- `node scripts/check-polar-v3310.cjs`: actualización PWA real 3.30→3.31, rechazo con otra ventana, respaldo exacto, cinco preparaciones, investigación y viaje desde UI; pantallas 320/360/390/412/1280; laboratorio y partida offline.
- `node scripts/build-polar-release-v3310.cjs`: manifiesto y revisión de caché reproducibles.
- `python3 scripts/build-polar-data-v3310.py`: regeneración trazable desde GM-01, sin leer el Excel.

Evidencias en `docs/gm03`. Las pruebas móviles son emulación Chromium táctil, no pruebas en Android físico. Publicada en [GitHub Pages](https://pruizbohle.github.io/gran-atlas-naturaleza/). [GitHub Actions correcto](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42822199192), commit desplegado `efe8ede1dc04437526558146be66570d9911e9db`. Verificados los hashes de los **133 archivos web**, sin diferencias. La prueba pública confirma siete celdas, desbloqueo/viaje a costa antártica desde la interfaz y persistencia offline del sector y laboratorio de 21 láminas, sin errores de JavaScript. Informes: `published-report.json` y `published-browser.json`.

Comprobación pública repetible: `python3 scripts/check-polar-published-hashes-v3310.py` y `node scripts/check-polar-published-v3310.cjs`.

El navegador completó la actualización con otra ventana bloqueando correctamente el primer intento; al cerrarla se guardó el respaldo exacto. Se comprobó la continuidad del viaje comercial, fabricación del abrigo, investigación, desbloqueo sin gastar prestigio, viaje al Ártico y recarga offline. El informe registra diez aperturas de Atlas con latencia de automatización incluida; no es una medida en teléfono físico ni una comparación de rendimiento humano.
