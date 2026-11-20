# Rendimiento de Campo en V4.9.6

Se midió el mismo registro de la columna batial del Pacífico suroccidental en V4.9.5 y V4.9.6. La escena reúne al pez cabeza transparente, con WebP en ambas versiones, y al calamar de aguas profundas, que pasa de SVG a WebP. Se hicieron doce rondas alternadas por ancho, con una apertura y dos reaperturas de Campo en cada una. [Datos completos](rendimiento.json)

| Ancho | Versión | Primera apertura, mediana | Primera apertura, p90 | Reapertura, mediana | Memoria JavaScript, mediana | RGBA de WebP visibles |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 390 px | 4.9.5 | 111,4 ms | 146,4 ms | 106,5 ms | 7,91 MB | 64 KiB |
| 390 px | 4.9.6 | 112,3 ms | 225,3 ms | 105,3 ms | 7,80 MB | 128 KiB |
| 1280 px | 4.9.5 | 64,0 ms | 101,7 ms | 51,1 ms | 7,87 MB | 64 KiB |
| 1280 px | 4.9.6 | 57,4 ms | 116,1 ms | 27,5 ms | 7,81 MB | 128 KiB |

El segundo WebP de 128 px suma 64 KiB de píxeles decodificados. Las mediciones corresponden a Chromium 156 en un servicio HTTP local. La reapertura y los encuentros sin conexión se validaron por separado en una PWA instalada.

```bash
ATLAS_HISTORY_WWW=/ruta/a/archivos-de-versiones ATLAS_FIELD_REPETITIONS=12 node scripts/benchmark-field-release.cjs
```

La ruta de archivo debe contener la versión base en `495/www`. El candidato se toma de `www` en el repositorio actual.
