# El Gran Atlas V4.9.2 · Peces dulceacuícolas y estuarinos

GM-07-P03 completa **23 especies de 18 familias** con **35 láminas**. El lote incluye siete albinas y cinco melánicas. La cobertura llega a **936 de 998 especies**, **1.608 láminas** y **12 de 12 ejemplares legendarios**. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizador universal](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## Revisión artística

El pez eléctrico amazónico muestra una aleta anal larga y un extremo caudal continuo. El lucio y el arapaima concentran las aletas dorsal y anal hacia la cola, con hocicos y escamas distintos. El pez cabeza de serpiente se distingue por su dorsal larga, su cabeza aplanada y las manchas laterales. El esturión muestra escudos alineados y cola heterocerca. Los barbillones del surubí y el barbo y las pectorales del pez mariposa africano se distinguen en el contorno. El laboratorio contrasta la dentición de los peces tigre africanos, las dos percas, los peces de perfil alto, los alargados, la carpa con el barbo y la tenca y las variantes de pigmentación.

Las láminas se exportaron en cuatro resoluciones WebP con transparencia real y halo externo. Se conservaron las 1.573 láminas previas, los 16 paisajes, los factores de escala del sapo pulga y el colibrí abeja y la colección completa de legendarios. [Inventario del lote](../cientifica-v491/plan-v492.md) · [Auditoría de legendarios](legendarios.json)

## Peso y rendimiento

| Resolución | V4.9.1 en MB | Lote nuevo en MB | V4.9.2 en MB |
| --- | ---: | ---: | ---: |
| 64 px | 3,21 | 0,05 | 3,26 |
| 128 px | 7,68 | 0,13 | 7,80 |
| 256 px | 21,70 | 0,36 | 22,06 |
| 512 px | 66,53 | 1,15 | 67,68 |
| **Total** | **99,11** | **1,69** | **100,80** |

El caché básico suma **125,36 MB** en 6673 archivos. El caché opcional se mantiene en **11,70 MB**. Se conservaron byte a byte los **6.292 WebP anteriores**, los paisajes y las referencias del laboratorio. Se verificaron los cuatro tamaños y el alfa real. [Mediciones exactas](mediciones.json)

Se repitió la medición de V4.9.1 con doce rondas por configuración, usando la misma escena entre versiones y una segunda serie con el caché offline activo. En esta edición, el ensayo utiliza un dugongo WebP y un pez payaso SVG porque el barbo que se usó en el lote anterior pasó a WebP. Se midieron aperturas de Campo, latencias de repetición y memoria JavaScript. [Mediciones de Campo](rendimiento.md)

## Pruebas

Pasaron las **25 pruebas de publicación** y las **62 del verificador Android**, incluidas las rutas UTF-8. La suite histórica cubrió **818 pruebas**. Tras repetir la comprobación del hábitat con la ruta relativa del entorno de pruebas, quedaron verificadas **591 aprobadas** y los mismos **227 fallos** de V4.9.1. [Regresión histórica](regresion.json)

Se verificaron desde archivos reales las migraciones a V4.9.2 desde V4.3.0, V4.8.1, V4.8.2 y V4.9.1. La PWA de V4.9.1 detectó V4.9.2 al recuperar el foco. Se comprobó la autorización de descarga, el rechazo de un WebP alterado, la interrupción de transferencia, la conservación del respaldo y el bloqueo con otra ventana abierta. El enlace histórico de V4.3.0 siguió funcionando y también se actualizó una PWA de V4.9.1 instalada en una ventana independiente de Chromium. [Migraciones PWA](migraciones-pwa.json) · [Actualizador en móvil emulado](actualizador-movil.jpg) · [Guía de recuperación](../cientifica-v490/actualizaciones-pwa.md)

El laboratorio pasó los 20 modos a 320 y 1280 px. Las siete comparaciones nuevas cargaron a 64 y 128 px. La colección de doce legendarios siguió disponible. En el juego se comprobó el avistamiento automático del barbo, la presentación del ejemplar melánico con halo y el acceso offline en Campo, Cuaderno, Bestiario y Museo. [Peces tigre](peces-tigre-1280.jpg) · [Peces alargados](peces-alargados-1280.jpg) · [Peces altos](peces-altos-1280.jpg) · [Carpas y barbos](carpas-y-barbos-1280.jpg) · [Barbo en Campo](barbo-campo.jpg) · [Pruebas de módulos](pwa-modulos.json)

Android sincronizó el WebView con versionCode 40902. La restauración en un dispositivo físico sigue pendiente y es un requisito para distribuir el APK estable. [Flujo de firma](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml)

## V4.9.3

El siguiente lote comprende **12 peces óseos de arrecife** y **12 láminas previstas**. [Plan V4.9.3](plan-v493.md) · [Inventario pendiente](inventario-pendiente.json)
