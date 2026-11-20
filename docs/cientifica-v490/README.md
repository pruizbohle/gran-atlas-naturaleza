# El Gran Atlas V4.9.0 · Tiburones, rayas y actualización de la PWA

GM-07-P01 completa el arte de los **18 condrictios de 12 familias**. Las **21 láminas** incluyen 14 tiburones, cuatro rayas y tres variantes de pigmentación. El catálogo queda en **905 de 998 especies**, **1.557 láminas** y **11 de 12 legendarios**. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizador universal](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## Revisión artística

Los tiburones se distinguen por el perfil del hocico, las branquias, las aletas y la forma de la cola. Entre los lámnidos se contrastan el cuerpo robusto del tiburón blanco, el perfil fusiforme del marrajo y las manchas ventrales del tiburón salmón. El zorro muestra el lóbulo alto característico. El tiburón anguila tiene forma sinuosa y branquias a modo de collar. Los mobúlidos muestran los lóbulos a ambos lados de la boca. La raya águila moteada conserva su rostro saliente y su cola en látigo. El laboratorio añade ocho conjuntos para comparar las 18 especies y las tres variantes a partir de 64 px.

El tiburón blanco tiene dos láminas de pigmentación, albina y melánica. La manta gigante conserva su variante melánica. Las 21 láminas se exportaron en WebP con las cuatro calidades vigentes y alfa a calidad 100. Se conservaron las **1.536 láminas previas** y sus 6.144 archivos exactos, los 16 paisajes y las excepciones de escala del sapo pulga y el colibrí abeja. [Inventario de condrictios en V4.8.2](../cientifica-v482/inventario-v49.json) · [Mediciones](mediciones.json)

## Actualización y conservación de la partida

La PWA consulta la versión publicada sin precargar el juego. La descarga requiere la acción del jugador y verifica los archivos contra un manifiesto SHA-256. El actualizador permite descargar el respaldo exacto antes de aplicar la revisión y confirma la activación. Funciona también en un navegador nuevo sin partida. La ruta universal permite recuperar una instalación que permanece en V4.3. [Uso, recuperación y funcionamiento](actualizaciones-pwa.md)

## Peso

| Resolución | V4.8.2 en MB | Lote nuevo en MB | V4.9.0 en MB |
| --- | ---: | ---: | ---: |
| 64 px | 3,16 | 0,03 | 3,19 |
| 128 px | 7,56 | 0,07 | 7,63 |
| 256 px | 21,40 | 0,17 | 21,57 |
| 512 px | 65,62 | 0,48 | 66,10 |
| **Total** | **97,74** | **0,74** | **98,48** |

El caché básico suma **122,86 MB** en 6469 archivos y el caché opcional se mantiene en **11,70 MB**. El manifiesto SHA-256 se consulta durante la preparación y queda fuera de ese peso básico. Se validaron los márgenes transparentes y las cuatro resoluciones. La mediana de decodificación de las 21 imágenes nuevas de 128 px fue de 25,84 ms para el lote completo. [Mediciones exactas](mediciones.json)

## Pruebas

Pasaron las **23 pruebas de publicación** y las **62 del verificador Android**, incluidas las rutas UTF-8. La suite histórica cubrió 816 pruebas. Tras volver a ejecutar las pruebas del actualizador con el modelo vigente de service worker y cartografía, el total verificado fue de 589 aprobadas y 227 fallos ya registrados en V4.8.2. [Regresión histórica](regresion.json)

Se probaron actualizaciones desde los archivos reales de V4.3.0, V4.8.1 y V4.8.2 en Chromium de escritorio y móvil, además de una PWA realmente instalada en ventana independiente. Se verificaron la descarga interrumpida, un WebP con SHA-256 incorrecto, la pérdida de conexión, el cierre de ventanas, el enlace histórico, la consulta manual, el aviso al recuperar el foco y la instalación sin partida. Se cotejaron los bytes del respaldo y se comprobó el funcionamiento offline tras recargar. [Resultados de actualizaciones](migraciones-pwa.json) · [Actualizador en móvil](actualizador-movil.jpg) · [PWA instalada](pwa-instalada.jpg)

El laboratorio pasó 17 modos, incluida la comparación a 64 y 128 px, a 320 y 1280 px. Se probó un avistamiento automático de manta gigante, su variante melánica con halo, y su acceso en Campo, Cuaderno, Bestiario y Museo sin conexión. [Rayas](rayas-1280.jpg) · [Tiburón blanco](tiburon-blanco-1280.jpg) · [Manta gigante en Campo](manta-campo.jpg)

| Ancho | Apertura de Campo | Memoria JS de Campo |
| --- | ---: | ---: |
| 390 px | 297 a 520 ms | 6,58 a 8,73 MB |
| 1280 px | 141 a 107 ms | 6,49 a 8,70 MB |

Estas mediciones de Chromium comparan V4.8.2 con V4.9.0. La memoria corresponde al heap de JavaScript. El paquete de Capacitor quedó sincronizado con versionCode 40900. La restauración en un dispositivo Android físico sigue pendiente y es un requisito para la distribución estable. [Resultados del juego](pwa-modulos.json) · [Firma de Android](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml)

## V4.9.1

El siguiente lote tiene ocho salmónidos y 16 láminas previstas, incluida la de Remonte. [Plan del lote](plan-v491.md)
