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

## Lote 2 · Emojis (cerrado)
Una partida nueva solo muestra ya ✦ (marca) y marcas tipográficas (✥ ✓ ☆) en las 10 pestañas y sus subpestañas; Corona usa su imagen. El resto de los ~540 emojis eran datos sin uso (`emoji:` de los objetos, que se conservan como respaldo), código muerto o textos que otros módulos sobrescriben.

- `iconArt530(id, respaldo)`: ramas de investigación, proyectos y colecciones del Museo y continentes usan la imagen equivalente.
- Encargos científicos: las 6 categorías usan imagen.
- Registro: 45 mensajes de `pushLog` y el registro inicial sin emoji. Los registros guardados conservan el texto antiguo.
- `regionLandscape` (46 viñetas con emoji) no se llamaba desde ningún sitio y se elimina.
- 97 rótulos con prefijo emoji (secciones, subpestañas, hábitat, hora y estación) pasan a texto.
- Se mantienen ♂ ♀ ⚤ ✦ ✓ ★ ☆ ✕ ❧ ✥ y el ❔ de especie no descubierta.
- Pruebas: dos expectativas de texto se actualizaron (`expeditions-research-v3280`, compara el registro sin emoji inicial; `patch-v3154`, `selva:'Selva'`). Suite completa en clon superficial: 492 pasan y 273 fallan, la misma lista de fallos que antes del Lote 2.

## Lote 3 · Hexágonos por bioma (opción B)
- Cada hexágono del mapa lleva `data-biome` y un matiz de bioma en relleno y borde (`css/iconography-v530.css`). Pradera verde lima, estepa ocre grisáceo y desierto naranja dejan de confundirse.
- El estado se sigue leyendo igual: la región actual conserva su verde oscuro, las bloqueadas se atenúan, las disponibles mantienen el borde discontinuo y las abiertas usan el color pleno del bioma.
- La biblioteca de iconografía carga la misma hoja de estilos, así que su vista previa de hexágonos muestra el mismo diseño.
- Los dibujos de los motivos no cambian. Pendiente de revisar con una partida avanzada: contraste del nombre de región sobre los biomas más oscuros (profundo, hadal) y 125 regiones juntas.
