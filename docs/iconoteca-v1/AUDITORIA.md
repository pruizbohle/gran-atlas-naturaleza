# Iconoteca de El Gran Atlas — revisión visual unificada (21/11/2026)

## Aclaración de la corrección

La primera entrega produjo **dos colecciones distintas** con los mismos identificadores: una colección PNG ilustrada (24 recortes de una lámina artística original) y una propuesta SVG simplificada. Los dibujos **no eran equivalentes**, por lo que se produjo una contradicción entre los iconos anunciados y los mostrados en el laboratorio.

**Corrección aplicada:** la página `www/iconoteca/index.html` ahora contiene internamente los **24 PNG ilustrados** (imágenes base64). No depende de `AtlasItemArt` ni del catálogo de SVG alternativos. La propuesta SVG simplificada fue retirada del directorio del laboratorio.

## Alcance y auditoría

Auditoría exploratoria de 17 archivos seleccionados de la interfaz (entre ellos `www/index.html`, `www/js/app.js` y `www/js/mobile-ui.js`): 146 símbolos pictográficos distintos y 561 apariciones. Son conteos parciales, no equivalen a 146 iconos finales ni constituyen revisión integral de repositorio.

Algunos módulos ya cuentan con **arte vectorial de objetos** en `www/js/item-art-v3198.js`. No se ha modificado ese módulo.

## Estado

- Las 24 ilustraciones PNG de la biblioteca son **candidatas para revisión**, no están integradas al juego.
- No se han reemplazado emojis en menús, fichas, inventario ni mensajes.
- El juego y las partidas mantienen su comportamiento anterior.
- `main` contiene **solamente el visor independiente** como previsualización; el trabajo de integración y aprobación permanece en esta rama.
- GitHub Pages puede continuar bloqueado por una comprobación previa de integridad de release; la ruta en GitHub sí existe. El documento HTML es completamente autónomo y puede visualizarse desde una copia local.

## Próximos controles

1. Confirmar que cada ilustración representa correctamente el módulo, no solo el emoji original.
2. Evaluar el diseño a 24/32/48 px: el grabado muy detallado puede ser ilegible a tamaño de navegación.
3. Corregir bordes y fragmentos residuales de recorte en las versiones PNG.
4. Cuando los diseños sean aprobados, crear SVG/PNG optimizados **a partir de la misma referencia visual**, con correspondencia 1:1, sin usar interpretaciones alternativas.
5. Integrar iconos en un PR separado, con pruebas mobile/desktop y sin afectar las partidas.
