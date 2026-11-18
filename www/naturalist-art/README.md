# El Gran Atlas · Laboratorio naturalista V4.2

La versión 4.2.0 se ejecuta desde `www/`. En la raíz del repositorio, inicia `python3 -m http.server 8080 --directory www` y abre el [laboratorio local](http://localhost:8080/naturalist-art/) o el [juego local](http://localhost:8080/). El laboratorio tiene filtros para Marsupiales, Monotremas, Felinos, Cánidos y Carnívoros terrestres, con filtros por familia y búsqueda en todos los modos. Incluye Campo y avistamiento mixto SVG/WebP, Cuaderno, Bestiario, Museo, Galería, Variantes, Ejemplares especiales, comparación con el SVG de respaldo y selección entre marco clásico, contorno minimalista y presentación sin marco, Escala real y Revisión artística con exportación JSON. Las observaciones se guardan localmente en el navegador.

- [Inventario de las 142 entradas, familias y variantes](CATALOGO.md)
- [Informe editorial y técnico de la candidata](../../docs/v420-naturalista/README.md)

## Incorporar ilustraciones

Guarda una lámina canónica WebP de 512 × 512 en `plates/<id>--<variante>.webp`. Para un legendario, usa su identificador de individuo como variante. El catálogo de revisión se deriva del juego y el generador rechaza láminas sin una ruta compatible. Una ruta sin WebP se marca como pendiente en el laboratorio y se resuelve con el SVG vigente en el juego. Los marcos se aplican por separado. Notable, Épico y Excepcional comparten el archivo de la variante biológica correspondiente.

```sh
python scripts/build-naturalist-derivatives.py
node scripts/build-naturalist-lab.cjs
node scripts/build-naturalist-release.cjs --write
npm run release:verify
node scripts/check-naturalist-lab.cjs
node scripts/check-naturalist-candidate.cjs
```

La derivación requiere Pillow. Las pruebas de navegador requieren Playwright y Chromium. Tanto el juego como el laboratorio aprovechan la misma caché offline.

Para incorporar Primates, amplía la clasificación zoológica del generador y añade las láminas exactas del catálogo. Los filtros de grupo y familia, el indicador de avance, el manifiesto de caché y el motor leen el inventario generado.
