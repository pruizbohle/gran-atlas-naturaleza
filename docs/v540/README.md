# V5.4 · Iconografía (en curso, rama `feat/v540-iconografia`)

La versión del paquete sigue en 5.3.0 mientras los lotes 0 y 1 cierran la iconografía de V5.3. Nada de esto está en `main`.

## Lote 0 · Objetos pendientes de V5.3
Seis objetos de OBJ-11 conectados: moneda antigua, prismáticos, sombrero de campo, cuadrante oceánico, lente pulida y ámbar fósil. Quedan diferidos `misiones` y el análisis comparativo.

## Lote 1 · Objetos de OBJ-11 por incorporar
- 55 WebP de 128 px con alfa tomados de `experiment/scientific-illustration-objects` (952d9c0e), uno por objeto jugable con el mismo identificador: 280.432 bytes en total.
- Se registran en `AtlasIcons530.objects`, en la lista offline de `sw.js`, en `atlas-integrity.json` y en `docs/v530/inventario.json`. Sus fichas pasan de `existente` a `corregido`.
- Quedan fuera, a la espera de homologación o ajuste menor según la revisión preliminar de OBJ-11: `fossil_tooth`, `field_telescope` (homologación) y `parchment_scrap` (ajuste menor).
- Presentación solamente: no cambia inventario, equipo, recetas ni guardado. Los objetos que no estén en el mapa conservan su lámina nativa.

## Verificación
- `tests/iconography-v530.test.cjs`: 2 de 2.
- Suite completa en clon superficial: 492 pasan y 273 fallan, idéntico al commit anterior. Los fallos dependen de `git show` sobre commits históricos ausentes. Falta repetirla con historial completo contra la línea base de V5.3 (666 / 219 / 0).
- Biblioteca en navegador: 68 fichas de objeto, 0 recursos con error.

## Lote 2 · Emojis (en curso)
Auditoría de emojis: el texto de las 10 pestañas y sus subpestañas, en una partida nueva, solo muestra ✦ (marca), ✥ ✓ ☆ (marcas tipográficas) y 👑 (Corona). El resto de los ~540 emojis del código son datos sin uso visible (`emoji:` de los objetos), viñetas de paisaje, mensajes del registro o textos que aparecen más adelante en la partida.

Hecho hasta ahora (solo presentación; el emoji queda como respaldo si no hay imagen):
- `iconArt530(id, respaldo)` en `app.js`: ramas de investigación, proyectos y colecciones del Museo y continentes usan la imagen equivalente.
- Encargos científicos (`commissions-ui-v3370.js`): las 6 categorías usan imagen (monografías, mapa, fósiles, investigación, navegación, mapa polar).
- Pendiente: viñetas de paisaje por motivos de bioma, mensajes del registro sin emoji y textos de interfaz con prefijo emoji.
