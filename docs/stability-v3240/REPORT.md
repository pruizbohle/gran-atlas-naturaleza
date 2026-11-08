# Informe verificable de AM-06

## Resumen

710 especies · 79 regiones · 1.329 presencias · 294 pruebas Node aprobadas. Se conservan los 206 registros norteamericanos y 192 sudamericanos.

## Métodos de rendimiento

Se mide render/layout síncrono tras el clic, no latencia completa de entrada, pintura GPU, arranque nativo ni consumo de batería. El primer Bestiario tiene caché SVG fría. Las colecciones se miden con apertura y evento toggle síncrono del manejador de producción; la prueba funcional independiente utiliza clics reales en el navegador. La memoria es el heap JavaScript tras GC, no el RSS completo del proceso.

La comparación principal usa ABBA repetido dos veces, 710 especies y 355 monografías en ambas versiones, CPU ×4 y 390×844. Los service workers y temporizadores se pausan por igual solo en el banco, evitando que precarga/ticks alteren las muestras; PWA y ticks se validan por separado.

La mediana convencional promedia los dos valores centrales cuando hay un número par de muestras. Se publican todas las muestras, sin eliminar valores lentos.

## Módulos complementarios

Cada versión tiene dos visitas en orden ABBA y tres reaperturas por visita, con la misma CPU y resolución. Campo ya se renderiza durante el arranque, por lo que se usa el nombre primer clic, no arranque frío.

| Módulo | 3.23.1 primer clic | 3.24.0 primer clic | 3.23.1 caliente | 3.24.0 caliente |
|---|---:|---:|---:|---:|
| Campo | 12.75 ms | 11.50 ms | 12.55 ms | 11.05 ms |
| Atlas | 71.40 ms | 43.95 ms | 25.90 ms | 29.15 ms |
| Cuaderno | 170.15 ms | 138.30 ms | 72.65 ms | 63.65 ms |
| Museo | 27.95 ms | 20.15 ms | 10.80 ms | 12.70 ms |
| Investigaciones | 45.55 ms | 34.20 ms | 22.35 ms | 22.55 ms |
| Expediciones | 18.70 ms | 10.60 ms | 7.15 ms | 9.50 ms |
| Inventario | 69.05 ms | 54.05 ms | 39.05 ms | 44.00 ms |

Se registran también los aumentos calientes de Atlas, Museo, Investigaciones, Expediciones e Inventario. Son de aproximadamente 0,2–5 ms en esta ejecución; esos renderizadores y su estilo permanecen idénticos. Las muestras no permiten atribuir causalidad ni garantizar un tiempo universal.

## Pruebas funcionales

- 2.658 encuentros ponderados dirigidos: manual y automático para cada una de las 1.329 presencias.
- 158 encuentros múltiples y verificación de censos y cupo horario en las 79 regiones.
- 3.550 avances y 710 publicaciones de monografías sin recompensas repetidas.
- Progresión cartográfica con materiales obtenidos por expediciones anteriores al desbloqueo, investigaciones reales y viajes a las 79 regiones.
- Seis partidas de referencia originales, exportación/importación nativa simulada y ocho horas offline con estado/RNG idénticos a 3.23.1.
- Todas las suites anteriores de Museo, fósiles, relictos, inventario, expediciones, variantes y dimorfismo siguen pasando.

## Navegador y móvil

32 casos de módulo/resolución, veinte de mapa/resolución, 79 viajes con observación manual, naturalistas y Cuaderno. Las 23 páginas permiten acceder a las 710 identidades. Se conservan contadores, orden, filtros y colección bajo demanda. La página no se guarda, se conserva entre pestañas y se reinicia al recargar.

Se prueban 320×640, 360×740, 390×844 y 412×915, sin desbordamiento horizontal. Los mapas completos y acciones de Atlas y Campo permanecen accesibles. Los ocho módulos y cinco continentes funcionan sin conexión. Cero errores JavaScript detectados.

Las capturas antes/después muestran las mismas tarjetas y estilos, con los controles de navegación añadidos. No se prueba un dispositivo Android físico.

## Publicación y límites

Publicación verificada: código `b35caa6`, ambos workflows SUCCESS, APK 3.24.0/32400 con 87 archivos web idénticos y plugins nativos presentes. La firma difiere de 3.23.1. Los resultados reales están en [publication.json](publication.json) y [android-report.json](android-report.json). El repositorio incluye herramientas reproducibles y certificado público del APK 3.23.1 como referencia, sin ninguna clave privada. El estado técnico y pendientes están en [STATUS.md](STATUS.md).
