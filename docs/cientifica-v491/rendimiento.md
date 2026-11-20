# Medición de Campo para la auditoría V4.10

En V4.9.0, una prueba general de navegador midió **297 ms en V4.8.2 y 520 ms en V4.9.0** a 390 px. Esa prueba fue una sola apertura por versión y su cronómetro incluía el controlador de pruebas. [Medición previa](../cientifica-v490/pwa-modulos.json)

El ensayo controlado usó Chromium 156.0.8078.79, con emulación táctil a 390 px y escritorio a 1280 px. Se alternaron V4.8.2, V4.9.0 y V4.9.1 en 12 rondas por ancho, cada una con sesiones nuevas, el mismo servidor local, la misma partida y el mismo encuentro de nutria albina WebP y barbo común SVG. Cada sesión midió tres aperturas desde Cuaderno y esperó la decodificación del WebP. Se desactivaron los service workers durante el ensayo para aislar la apertura de Campo de la descarga y el caché de las ediciones. [Script reproducible](../../scripts/benchmark-field-release.cjs) · [Resultados y muestras](rendimiento-campo.json)

| Ancho | Versión | Primera apertura, mediana en ms | Primera, p90 en ms | Repetición, mediana en ms | Primera con controlador, mediana en ms | Heap JS, mediana en MB |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 390 px | 4.8.2 | 4,70 | 7,80 | 5,10 | 10,54 | 7,72 |
| 390 px | 4.9.0 | 6,25 | 9,80 | 3,05 | 11,36 | 7,89 |
| 390 px | 4.9.1 | 6,65 | 8,40 | 4,20 | 12,09 | 7,91 |
| 1280 px | 4.8.2 | 4,35 | 7,30 | 2,25 | 9,21 | 7,79 |
| 1280 px | 4.9.0 | 3,50 | 5,50 | 3,15 | 7,47 | 7,91 |
| 1280 px | 4.9.1 | 4,45 | 8,80 | 2,25 | 10,15 | 7,81 |

El aumento de cientos de milisegundos no se reprodujo. A 390 px, la primera apertura de V4.9.0 fue más lenta en siete rondas, más rápida en cuatro e igual en una respecto de V4.8.2. La diferencia pareada mediana fue de **0,45 ms**. Al volver a abrir Campo, la mediana de V4.9.0 fue de 3,05 ms frente a 5,10 ms en V4.8.2. V4.9.1 registró 6,65 ms en la primera apertura y 4,20 ms en las repeticiones. El mismo WebP de Campo ocupó 65.536 bytes RGBA en las seis combinaciones.

Estos resultados dejan un aumento pequeño en la primera apertura emulada y no muestran una regresión sostenida. Para V4.10 queda por contrastar el arranque completo y la decodificación con caché frío en Android físico. El ensayo local mide Campo con el navegador y la partida ya abiertos.
