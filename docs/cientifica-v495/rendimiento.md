# Rendimiento de Campo en V4.9.5

Se midió el mismo registro indirecto de columna mesopelágica del Pacífico oriental en V4.9.3 y V4.9.5. La escena combina un tiburón cigarro con lámina WebP en ambas versiones y un pez cabeza transparente que pasa de SVG a WebP en V4.9.5. Se alternó el orden de las versiones durante doce rondas por ancho. En cada ronda se midió una apertura y dos reaperturas de Campo. [Datos completos](rendimiento.json)

| Ancho | Versión | Primera apertura, mediana | Primera apertura, p90 | Reapertura, mediana | Memoria JavaScript, mediana | RGBA de láminas visibles |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 390 px | 4.9.3 | 89,2 ms | 126,9 ms | 75,4 ms | 7,80 MB | 64 KiB |
| 390 px | 4.9.5 | 85,3 ms | 136,8 ms | 62,9 ms | 7,78 MB | 128 KiB |
| 1280 px | 4.9.3 | 33,7 ms | 82,4 ms | 26,3 ms | 7,75 MB | 64 KiB |
| 1280 px | 4.9.5 | 70,4 ms | 91,7 ms | 20,3 ms | 7,75 MB | 128 KiB |

El paso a dos WebP agregó 64 KiB de píxeles decodificados en esta escena. La memoria JavaScript de ambas versiones se mantuvo cerca de 7,8 MB en la mediana. La primera apertura a 1280 px pasó de 33,7 a 70,4 ms y su p90 pasó de 82,4 a 91,7 ms. A 390 px las medianas de apertura fueron 89,2 y 85,3 ms. Las reaperturas permanecieron por debajo de 63 ms en la mediana de V4.9.5. Se trata de mediciones en Chromium 156 sobre HTTP local. La reapertura sin conexión se validó por separado con una PWA instalada.

```bash
ATLAS_HISTORY_WWW=/ruta/a/archivos-de-versiones ATLAS_FIELD_REPETITIONS=12 node scripts/benchmark-field-release.cjs
```

La ruta de archivo debe contener la versión base en `493/www`. El candidato se toma de `www` en el repositorio actual.
