# Iconoteca 1842 — Etapa 2: 20 objetos

Fecha: 21 de noviembre de 2026. Estado: **preparación y comparación visual**, sin integración al juego.

## Qué se hizo realmente

- Se identificaron 20 piezas de objetos y se verificó que cada identificador existe en `www/js/item-art-v3198.js`.
- Se publicó en `main` una galería aislada de esas **referencias vectoriales que ya estaban en el juego**, accesible en `www/iconoteca/lote2-revision.html`. No se tocaron la economía, el catálogo zoológico, las partidas ni el runtime.
- Las 24 ilustraciones PNG anteriores siguen en `www/iconoteca/index.html` y no son sustituidas por estas referencias.
- **No se crearon 20 ilustraciones nuevas**: el generador de imágenes falló. La siguiente versión pictórica sigue pendiente. No presentar la galería de referencias como iconos finales.

## Catálogo y orden

| Grupo | Identificadores |
|---|---|
| Fósiles (10) | fossil_fragment, fossil_skull, fossil_tooth, fossil_horn, hard_bone, fossil_track, fossil_plate, fossil_rib, fossil_claw, fossil_amber |
| Coleccionables (5) | pressed_flower, owl_feather, antler_fragment, river_pebble, ancient_coin |
| Instrumentos (5) | brass_compass, field_telescope, old_ink, brass_shard, carved_wood |

## Diseño futuro

- Misma dirección artística que los 24 PNG V1: grabado naturalista victoriano, tintas sepia, bronce envejecido, cuero y papel marfil.
- Un icono = un objeto real, sin sustituirlo por una silueta genérica ni reutilizar otra imagen arbitraria.
- Separar referencias, propuestas ilustradas y piezas aprobadas con identificadores permanentes y una vista comparativa que muestre el objeto exacto del juego.
- Validar a 24/32/48/60/128 px, fondos claro y oscuro, bordes de recorte, transparencia y legibilidad.
- En la V1 siguen pendientes las nueve limpiezas de borde documentadas en `docs/iconoteca-v1/REVISION_VISUAL_24.md` antes de declarar los PNG aptos para integrar.

## Criterio de incorporación

1. Generar láminas pictóricas nuevas a partir de estos 20 IDs; recortar y guardar cada figura como un recurso independiente.
2. Revisión visual humana y aprobación explícita, con 1:1 entre ilustración, nombre y destino de UI.
3. Publicar los PNG optimizados con el mismo estilo del lote V1. No agregar un segundo set SVG alternativo que contradiga las ilustraciones.
4. Reemplazar emojis en el juego únicamente en un PR distinto y verificable, con pruebas automáticas y capturas desktop/móvil. Nunca alterar el guardado ni cambiar la versión jugable 4.9.6 como parte de esta fase visual.
