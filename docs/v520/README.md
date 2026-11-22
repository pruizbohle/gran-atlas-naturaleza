# El Gran Atlas · V5.2.0

V5.2 reúne 30 legendarios, 20 relictos y la Guía del naturalista. Conserva 1.000 especies activas, 125 regiones, 16 paisajes y 1.690 láminas zoológicas. Los 20 relictos tienen un registro propio en el Museo, separado del contador zoológico del Atlas. [Auditoría de integración y ramas](auditoria.md)

## Inventarios individuales

- **30 legendarios.** Cada ficha incluye nombre, identificador de guardado, especie, regiones, ejemplos de encuentros válidos en el motor, tasas de aparición y SHA-256 de los cuatro tamaños. Ascua y Atlas mantienen las láminas aprobadas. Nácar mantiene el identificador de guardado `filigrana`. La auditoría comprobó condiciones elegibles para los 30 legendarios y para cada región en que figuran. [Inventario de legendarios](legendarios.json)
- **20 relictos.** Cada ficha incluye identificador, nombre científico, región, biomas, horas y cuatro archivos WebP con huellas SHA-256. La detección requiere un intento de Campo en la región, el hábitat y el turno correctos. Los tres indicios se pueden reunir por varias vías. La tasa en condiciones válidas pasa de 0,02 % a 0,05 %, 0,12 % y 0,30 %. El equipo automático dispone de un intento por relicto y hora, y el guardado conserva ese cupo al reabrir. Museo registra el origen y la fecha cuando existen; las colecciones antiguas conservan su descubrimiento histórico. [Inventario de relictos](relictos.json)

## Renovación artística

| Nuevas láminas | Comparación en dos fondos y a 64 px |
| --- | --- |
| Celacanto del Índico, León del Atlas y Murciélago de Seychelles | [Lámina comparativa 1](evidencia/comparativas-1.jpg) |
| Cocodrilo enano africano, Tortuga angonoka y Pez pulmonado africano | [Lámina comparativa 2](evidencia/comparativas-2.jpg) |
| Esturión blanco del Pacífico, Gavial del Ganges y Proteo de las cuevas | [Lámina comparativa 3](evidencia/comparativas-3.jpg) |

Se produjeron 36 WebP transparentes en 64, 128, 256 y 512 px, con un peso de **454.332 bytes**. Los 44 archivos de los once relictos restantes coinciden con las huellas de la rama de origen. Los 80 archivos de relictos pesan en conjunto **987.918 bytes**. El caché esencial de la PWA contiene **7.097 archivos** y **132.854.722 bytes**. El laboratorio permite alternar tamaños, fondo claro u oscuro y el SVG anterior de los nueve originales. [Galería de relictos](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-relictos.html)

## Ayudas y navegación

Las ayudas ficticias de conocimiento y avistamientos, las sesiones gratuitas de prueba y la emisión y canje de coronas ficticias quedaron fuera de las acciones de juego. Corona conserva el saldo histórico. La contratación, el equipo, las investigaciones y sus bonificaciones siguen disponibles mediante sus flujos ordinarios.

La Guía del naturalista se abre dentro de cada módulo y explica dónde consultar monografías, requisitos regionales, expediciones, fuentes de materiales, legendarios, relictos y exhibiciones. La Brújula conserva plegado y accesos a objetivos. Los enlaces permiten volver al contexto de origen, incluidas las instalaciones del Campamento y la sala o página correspondiente del Museo. El acceso de un expediente a Campo respeta los requisitos de cartografía.

## Validación

- **Pruebas críticas.** 40 aprobadas con `npm run release:verify`. Cubren integridad gráfica, reglas de los 20 relictos, catálogo y guardado de legendarios, comprobación de SHA-256, actualizador, ayudas y recuperación de respaldos.
- **Chromium.** En escritorio y a 390 px se verificaron la Brújula, Investigación, la receta del Mapamundi y el regreso entre Campamento y Museo. Se recorrieron los tres indicios y el hallazgo del tilacino en Campo. Se comprobaron su registro y su ficha en Museo tras recargar, la galería de 20, nueve comparativas y la apertura sin conexión con los 7.097 recursos. Se revisaron 40 vistas de los diez legendarios de LEG-02 y las cuatro superficies jugables para Nácar. [Campo en móvil](evidencia/campo-movil.png) · [Ficha de Museo](evidencia/museo-escritorio.png)
- **Actualización desde producción.** Se instaló V4.9.6 del commit `50cdf3c` en Chromium móvil, se autorizó la descarga de V5.2.0 y se cotejó el respaldo byte a byte. Al reabrir sin conexión se comprobaron libras, conocimiento, coronas históricas, inventario, descubrimientos, avistamientos, pigmentos y el celacanto histórico. El navegador confirmó el caché completo tras verificar SHA-256. [Prueba reproducible](../../scripts/v520-browser.cjs)
- **Suite completa.** 664 de 883 pruebas aprobadas. Los 219 fallos restantes ya se reproducían en la línea anterior. Tres pruebas de migración de V4.7.3, V4.9.3 y V4.9.5 ahora comparan con sus cortes históricos de Git, que conservan el pigmento del oso tibetano de esas versiones. El catálogo actual sigue cubierto por la prueba de integridad. El listado de fallos conserva el archivo y el nombre de cada caso. [Regresión](regresion.json)
- **Compilación de Pages.** El primer intento se detuvo por una referencia a `brace-expansion@^5.1.0` heredada de LEG-01. Se recuperó el rango y la resolución ya probados en producción y se repitió la instalación limpia con Node 22.
- **Android.** Se conservó la configuración de Capacitor y de los flujos de firma. APK sin generar.
