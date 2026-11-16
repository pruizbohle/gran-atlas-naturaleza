# Biblioteca almacenada en GitHub

- Rama: `feat/coleccionables-arte-240`.
- [Informe y acceso al catálogo](https://github.com/pruizbohle/gran-atlas-naturaleza/blob/feat/coleccionables-arte-240/README_ART_COL_01.md).
- Commit de arte: `8e551bc8d14003feed8fbb72edbfc8051b4dfa94`.
- El árbol remoto de GitHub contiene **240 SVG individuales** en `www/assets/collectibles-draft/` y no está truncado.
- `main` continúa en `41a4bbdc90a16ebdb612f67591ea6e2dd9dfe259`, igual que al empezar.
- Se comprobaron los hashes públicos de `index.html`, `atlas-release.json`, `sw.js` y `js/item-art-v3198.js`; coinciden con la versión publicada 3.43.0.
- No hay ejecuciones de Actions en la rama artística. Pages escucha los pushes de `main` y su job también exige explícitamente esa referencia, bloqueando despliegues manuales desde la rama de arte.
- No se creó PR, merge, release, APK ni despliegue público. La integración de los objetos queda pendiente de autorización posterior.

[Registro de aislamiento y comprobación remota](isolation-report.json).
