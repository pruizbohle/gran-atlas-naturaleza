# Beta 3.7.1 — parche exclusivo de melánicos

- Corrige la conversión de las etiquetas guardadas `Melánico` y `Melánica` al skin `melanico`; la tilde hacía que se seleccionara `normal`.
- El pase final de recoloreo transforma todos los fill/stroke a negro y gris carbón, incluyendo colores literales, abreviados, RGB, colores nombrados y estilos inline. Solo pequeños círculos de ojos ámbar conservan color. Se mantienen `none` y `transparent`.
- Campo y tarjetas de Variantes observadas del Cuaderno usan `getSpriteMarkup(id, variantToSkin(variante))`. Se verifica la ruta real con etiquetas de todas las especies y la regresión del zorro rojo. Museo y listas de especies no almacenan ni seleccionan variantes: conservan su representación normal, sin inferir una variante por haberla observado.
- Actualiza la versión web/package a 3.7.1 y la caché web para renovar recursos antiguos.

Sin cambios en mecánicas, datos de especies, regiones, misiones, economía, guardado, JSON, otros skins ni package ID Android. No requiere migración ni añade dependencias.

Validación: `node --check www/js/app.js`, `node --test tests/*.test.cjs`. Las pruebas comprueban todas las especies, ambos argumentos de sexo, caché, paleta, etiquetas con tilde, tarjetas observadas y compatibilidad de guardado. Se verificó por comparación que app.js solo cambia en variantToSkin y enforceMelanicColors. No se compiló APK ni se realizó validación en dispositivo físico para este parche.
