# AND-04 · Auditoría de rendimiento

Se compara 3.41.0 exacta (3422b10) con el candidato en el mismo Chromium, ocho estados sintéticos, cinco anchos y diez módulos. La ráfaga mide 600 cambios y 200 persistencias; no se presenta como una sesión de tiempo real. Se conservan los informes de veinte minutos de 3.41 como referencia histórica. No son resultados de un teléfono Android.

| Medición | 3.41.0 | 3.42.0 |
|---|---:|---:|
| 390 px · P50 cambio | 5.3 ms | 5.5 ms |
| 390 px · P95 cambio | 16.6 ms | 16.7 ms |
| 390 px · 200 persistencias | 290.3 ms | 326.9 ms |
| 1280 px · P50 cambio | 4.9 ms | 4.9 ms |
| 1280 px · P95 cambio | 12.6 ms | 13.8 ms |
| 1280 px · 200 persistencias | 274.4 ms | 333.8 ms |

Nodos CDP y escuchadores activos coinciden antes/después en cada ráfaga: 533/532 nodos según ancho, 73 escuchadores y un intervalo. El heap y los tiempos completos por módulo, incluidos Bestiario, Inventario, Sociedad y Museo, se conservan en los JSON. Los guardados son más lentos en esta ejecución; se informa la variación, sin reducir frecuencia de guardado ni validaciones. Los cambios P95 son pequeños y no muestran otra regresión grave frente a 3.41 en este entorno. No se afirma una mejora general de velocidad.

No se justifica una refactorización del renderizador: app.js, algoritmos temporales, arte y catálogos son idénticos a 3422b10. La corrección focalizada de compatibilidad evita registrar el service worker web dentro de Android; el APK utiliza sus recursos empaquetados y la PWA web conserva su mecanismo de actualización. No se añaden intervalos. Su comportamiento físico sigue pendiente.

[Antes](performance-before/report.json) · [Después](performance-after/report.json) · [Comparación](performance-comparison.json).
