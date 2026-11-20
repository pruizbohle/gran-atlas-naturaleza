# El Gran Atlas V4.9.1 · Salmónidos y Remonte

GM-07-P02 completa los **ocho salmónidos** del catálogo con **16 láminas**. El lote comprende cinco salmones, tres truchas, cuatro variantes albinas, tres melánicas y la lámina exclusiva de Remonte. La cobertura llega a **913 de 998 especies**, **1.573 láminas** y **12 de 12 ejemplares legendarios**. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizador universal](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## Revisión artística

En el salmón rosado marino destacan el pedúnculo estrecho y las manchas ovales de la cola. El chum muestra barras nupciales y el salmón rojo muestra el contraste natural entre cuerpo rojo y cabeza olivácea. El salmón real tiene cabeza robusta y manchas caudales. Se contrastan la cola y las mandíbulas del salmón atlántico y la trucha común, la línea lateral rosada de la arcoíris y las vermiculaciones y aletas de borde claro de la trucha de arroyo. Las láminas incluyen la aleta adiposa y cuatro derivados WebP con transparencia real.

Remonte presenta joroba dorsal, mandíbulas ganchudas y manchas dorsales y caudales de un salmón rosado macho en fase nupcial. La coloración plateada y el perfil fino distinguen al ejemplar habitual. La ficha, sus condiciones de aparición y el halo permanecen en el sistema de juego. Su recurso es `asia_esp_0369--remonte.webp`. [Inventario de V4.9.1](../cientifica-v490/plan-v491.md)

El laboratorio incorpora cinco comparaciones de salmónidos y una vista de la colección de doce legendarios con sus halos. La auditoría coteja los doce nombres, descripciones, IDs, rutas, resoluciones y categorías. Las 1.557 láminas anteriores y los 16 paisajes se mantienen, así como las excepciones de escala del sapo pulga y el colibrí abeja. [Auditoría de legendarios](legendarios.json)

## Peso y rendimiento

| Resolución | V4.9.0 en MB | Lote nuevo en MB | V4.9.1 en MB |
| --- | ---: | ---: | ---: |
| 64 px | 3,19 | 0,02 | 3,21 |
| 128 px | 7,63 | 0,05 | 7,68 |
| 256 px | 21,57 | 0,13 | 21,70 |
| 512 px | 66,10 | 0,42 | 66,53 |
| **Total** | **98,48** | **0,63** | **99,11** |

El caché básico suma **123,54 MB** en 6533 archivos. El caché opcional se mantiene en **11,70 MB**. Se conservaron byte a byte los **6.228 WebP anteriores**, los paisajes y las referencias del laboratorio. Se verificaron los cuatro tamaños y el alfa real. [Mediciones exactas](mediciones.json)

La subida puntual de cientos de milisegundos en la apertura móvil de Campo no se reprodujo con la misma escena y doce rondas por resolución. En móvil emulado, la mediana pareada de V4.9.0 frente a V4.8.2 aumentó 0,45 ms en la primera apertura. Las reaperturas tuvieron una mediana inferior. El registro incluye V4.9.1 y deja documentadas las condiciones para V4.10. [Rendimiento de Campo](rendimiento.md)

## Pruebas

Pasaron las **24 pruebas de publicación** y las **62 del verificador Android**, incluidas las rutas UTF-8. La suite histórica ejecutó **817 pruebas**, con **590 aprobadas** y los mismos **227 fallos** que V4.9.0. [Regresión histórica](regresion.json)

Se verificaron desde archivos reales las migraciones a V4.9.1 desde V4.3.0, V4.8.1, V4.8.2 y V4.9.0. La PWA de V4.9.0 detectó V4.9.1 al recuperar el foco. Se comprobó la autorización de descarga, el rechazo de un WebP alterado, la interrupción de transferencia, la conservación del respaldo y el bloqueo con otra ventana abierta. El enlace histórico de V4.3.0 siguió funcionando y también se actualizó una PWA de V4.9.0 instalada en una ventana independiente de Chromium. [Migraciones PWA](migraciones-pwa.json) · [Actualizador en móvil emulado](actualizador-movil.jpg) · [Guía de recuperación](../cientifica-v490/actualizaciones-pwa.md)

El laboratorio pasó los 19 modos a 320 y 1280 px. Se verificaron la comparación del salmón rosado y Remonte a 64 y 128 px y la vista de los doce legendarios. En el juego se comprobó el avistamiento automático del salmón rosado y la lámina de Remonte con halo. Campo, Cuaderno, Bestiario y Museo cargaron sin conexión. [Salmón rosado y Remonte](remonte-comparacion-1280.jpg) · [Doce legendarios](legendarios-1280.jpg) · [Remonte en Campo](remonte-campo.jpg) · [Pruebas de módulos](pwa-modulos.json)

Android sincronizó el WebView con versionCode 40901. La restauración en un dispositivo físico sigue pendiente y es un requisito para distribuir el APK estable. [Flujo de firma](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml)

## V4.9.2

El siguiente lote prevé **23 peces dulceacuícolas y estuarinos** y **35 láminas**. [Plan de V4.9.2](plan-v492.md) · [Inventario pendiente](inventario-pendiente.json)
