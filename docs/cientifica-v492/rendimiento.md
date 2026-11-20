# Rendimiento de Campo en V4.9.2

Se mantuvo el procedimiento de V4.9.1 con 12 rondas, orden alternado por versión, primera apertura y dos reaperturas de Campo desde Cuaderno por sesión. El navegador fue Chromium 156.0.8078.79. Se midieron las tres versiones con un dugongo albino en WebP y un pez payaso en SVG, en la misma región de arrecife. El barbo del ensayo anterior cambió de SVG a WebP en V4.9.2. Los tiempos de esta página se comparan entre las tres versiones con el mismo encuentro. [Procedimiento de V4.9.1](../cientifica-v491/rendimiento.md) · [Script](../../scripts/benchmark-field-release.cjs)

## Con el service worker desactivado

| Ancho | Versión | Primera apertura, mediana en ms | Primera, p90 en ms | Reapertura, mediana en ms | Primera con controlador, mediana en ms | Heap JS, mediana en MB |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 390 px | 4.9.0 | 7,65 | 10,60 | 2,70 | 13,50 | 7,44 |
| 390 px | 4.9.1 | 8,00 | 10,60 | 2,90 | 14,29 | 7,41 |
| 390 px | 4.9.2 | 4,00 | 6,30 | 3,10 | 9,94 | 7,52 |
| 1280 px | 4.9.0 | 6,55 | 98,50 | 2,25 | 10,90 | 7,38 |
| 1280 px | 4.9.1 | 4,30 | 60,60 | 3,30 | 9,46 | 7,47 |
| 1280 px | 4.9.2 | 5,25 | 56,00 | 2,35 | 10,05 | 7,48 |

Las primeras aperturas de escritorio incluyen valores altos en algunas rondas. La mediana de reapertura y el p90 se presentan por separado. [Muestras sin service worker](rendimiento-campo.json)

## Con el caché offline activo

Se preparó una instalación por versión. Cada ronda abrió una pestaña nueva sin red, con el mismo encuentro y los mismos ajustes de Campo. [Muestras offline](rendimiento-campo-offline.json)

| Ancho | Versión | Primera apertura, mediana en ms | Primera, p90 en ms | Reapertura, mediana en ms | Primera con controlador, mediana en ms | Heap JS, mediana en MB |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 390 px | 4.9.0 | 12,95 | 26,90 | 6,65 | 23,64 | 9,20 |
| 390 px | 4.9.1 | 12,45 | 31,50 | 5,50 | 34,82 | 9,14 |
| 390 px | 4.9.2 | 21,40 | 52,20 | 6,15 | 38,69 | 9,16 |

Con el caché activo, la mediana de primera apertura fue de **12,45 ms** en V4.9.1 y **21,40 ms** en V4.9.2. La mediana del heap pasó de **9,14 MB** a **9,16 MB**. La mediana de la diferencia dentro de cada ronda fue de **+1,40 ms**, con siete rondas más lentas y cinco más rápidas. Las medianas de reapertura fueron de **5,50 ms** y **6,15 ms** respectivamente. El aumento de la primera apertura varió entre rondas. Son mediciones de la escena controlada en el navegador. Las pruebas de módulos verificaron por separado la escena fluvial que pasó de un SVG y un WebP a dos WebP. El arranque de Android en un dispositivo físico queda fuera de esta medición. [Pruebas de módulos](pwa-modulos.json)

## Repetir el ensayo

Exporta `www` de V4.9.0 y V4.9.1 a `490/www` y `491/www` dentro del directorio de `ATLAS_HISTORY_WWW`. Los commits usados fueron `4ee0853` y `dc7929a`.

```bash
ATLAS_HISTORY_WWW=/ruta/archivos ATLAS_FIELD_REPETITIONS=12 node scripts/benchmark-field-release.cjs
ATLAS_HISTORY_WWW=/ruta/archivos ATLAS_FIELD_REPETITIONS=12 node scripts/benchmark-field-release.cjs --offline
```
