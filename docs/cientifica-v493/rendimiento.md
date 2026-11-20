# Rendimiento de Campo en V4.9.3

Se compararon V4.9.2 y V4.9.3 con doce rondas alternadas por ancho. La escena usa el mismo encuentro múltiple en un arrecife del Índico. El dugongo albino usa WebP en ambas versiones. El pez payaso se muestra mediante SVG en V4.9.2 y mediante su lámina WebP en V4.9.3. Se hicieron dos reaperturas después de la primera apertura de Campo por ronda. [Datos de las rondas](rendimiento.json)

| Ancho | Versión | Primera apertura, mediana | Primera apertura, p90 | Reapertura, mediana | Montículo de JavaScript | RGBA de láminas visibles |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 390 px | 4.9.2 | 101,1 ms | 179,6 ms | 68,4 ms | 7,40 MB | 64 KiB |
| 390 px | 4.9.3 | 84,2 ms | 157,8 ms | 85,0 ms | 7,57 MB | 128 KiB |
| 1280 px | 4.9.2 | 68,2 ms | 133,9 ms | 40,1 ms | 7,42 MB | 64 KiB |
| 1280 px | 4.9.3 | 78,7 ms | 100,9 ms | 62,2 ms | 7,50 MB | 128 KiB |

La segunda lámina de 128 px suma 64 KiB de píxeles decodificados. El montículo de JavaScript de la escena se mantuvo por debajo de 7,6 MB en la mediana. Las reaperturas tardaron alrededor de 17 ms más a 390 px y 22 ms más a 1280 px. La primera apertura presentó diferencias de sentido distinto según el ancho. Estas cifras corresponden a Chromium 156 en el entorno de pruebas con servicio HTTP local. El verificador de la PWA instalada comprobó por separado la reapertura y los avistamientos sin conexión.

```bash
ATLAS_HISTORY_WWW=/ruta/a/archivos-de-versiones ATLAS_FIELD_REPETITIONS=12 node scripts/benchmark-field-release.cjs
```

La ruta de archivo debe contener la versión base en `492/www`. El candidato se toma de `www` en el repositorio actual.
