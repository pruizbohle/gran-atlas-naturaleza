# Ictiofauna v3.19.9 — inventario y revisión artística

## Arquitectura real

Se verificaron **18 registros zoológicos: 15 peces óseos, 2 tiburones y 1 manta**. No se incluyen delfines ni otros mamíferos acuáticos. La clasificación se deriva de las identidades científicas presentes, no de la apariencia del nombre ni de `kind`. El clasificador reconoce estos mismos peces aunque su etiqueta de dibujo sea incorrecta, y rechaza reptiles, anfibios y cetáceos aunque reciban `kind:fish` accidentalmente.

Antes de la actualización coexistían una copia **activa** al principio de `app.js` (183 líneas, `ATLAS FISH INLINE 3.19.1b`) y `fish-art-v3191.js`, utilizado por el laboratorio antiguo. Las dos implementaciones no eran idénticas. La comparación aquí presentada usa la copia inline real de la producción anterior, no la alternativa del laboratorio. La integración de esta versión carga el archivo externo y retira esa duplicación; no elimina los generadores históricos de `spriteFor`, que siguen sirviendo como fallback y para especies fuera de este alcance.

La interfaz pública `ATLAS_FISH_ART_V3191(sp,color,skin)` se conserva. Se agrega su clasificador `.classify(sp)` y exportaciones CommonJS `renderFish`/`classifyFish`. El módulo funciona sin `window`. La API mantiene el parámetro de color por compatibilidad; las paletas normales proceden de perfiles naturales por taxón. La pigmentación de producción sigue pasando por la transformación centralizada del juego.

## Comparación individual

Se inspeccionó visualmente la [plancha completa de comparación](fish-comparison.png): izquierda es producción anterior, derecha es el refinamiento, con controles adicionales a 56 px y en silueta. Se revisaron los 18 taxones a 120 px y 56 px. Los cambios de rutas, inserciones y proporciones preceden a los cambios de color.

| Especie / identificador | Problema anterior observado | Corrección anatómica y resultado |
| --- | --- | --- |
| Esturión siberiano — `asia_esp_0914` | Cola y aletas triangulares, escudos sobredimensionados sobre el lomo, hocico poco modelado. | Perfil alargado con rostro progresivamente afilado, dorsal retrasada hacia la cola en esta orientación, caudal heterocerca, escudos menores y dos pares de barbillas. Durante la revisión se corrigieron también dos radios que salían de la dorsal. |
| Trucha común — `eu_esp_0669` | Perfil azul genérico compartido con otros peces, sin adiposa y manchas indiferenciadas. | Pedúnculo definido, dorsal curva, pequeña adiposa, pectoral de inserción opercular y puntos pardos/rojizos. |
| Barbo común — `eu_esp_0668` | Mismo perfil estándar de pez con aletas angulares. | Cuerpo más largo, vientre tenue, dorsal alta y barbillas a la altura de la boca inferior. |
| Tenca — `eu_esp_0667` | Aletas triangulares sobre un óvalo rígido. | Cuerpo profundo, caudal convexa y aletas dorsal y pélvica redondeadas, tonos de agua dulce oliváceos. |
| Perca europea — `eu_esp_0670` | Dorsal como un serrucho aislado, barras rectas. | Dorsal espinosa de base amplia con sección blanda posterior, cuerpo comprimido, barras que terminan dentro del flanco y aletas inferiores ocres. |
| Salmón rosado — `asia_esp_0369` | Silueta igual a la trucha con mero cambio de color. | Contorno dorsal con joroba de adulto reproductor, caudal escotada, adiposa y manchas mayores; silueta claramente diferenciada. |
| Salmón rojo — `asia_esp_0371` | Misma plantilla que otros salmones. | Cuerpo fusiforme más profundo, boca y pedúnculo definidos, adiposa, dorsal específica y cabeza olivácea de fase reproductora. |
| Carpa común — `asia_esp_0910` | Boca y vientre esquemáticos, aletas triangulares desconectadas visualmente. | Perfil alto de dorso arqueado, dorsal larga y baja, inserciones pélvicas curvas, boca con barbillas y escamas que siguen el volumen del flanco. |
| Cabeza de serpiente del norte — `asia_esp_0915` | Dorsal pequeña genérica y cola bifurcada impropia. | Perfil alargado, cabeza aplanada, dorsal y anal extendidas, caudal redondeada y manchas en cadena. |
| Pez mandarín chino — `asia_esp_0911` | Dorsal serrada y puntos circulares uniformes. | Cabeza y boca amplias, cuerpo alto, dorsal de base continua, caudal redondeada y manchas irregulares del flanco. |
| Tiburón blanco — `af_tiburon_blanco` | Contorno rectilíneo y aletas triangulares de inserción brusca. | Volumen fusiforme más robusto, dorsal falcada, pectoral curvada de base ancha, caudal heterocerca y cinco hendiduras branquiales separadas del ojo. |
| Manta gigante — `af_manta_gigante` | Aletas tipo boomerang, cola rectangular gruesa y rostro antropomorfo. | Disco pectoral de curvatura continua, lóbulos cefálicos, ojos dorsolaterales pequeños y cola fina y flexible; se eliminó la boca sonriente. |
| Tiburón de puntas negras — `af_tiburon_puntas_negras` | Perfil casi idéntico al blanco. | Tronco más fino, dorsal y pectoral de proporciones propias, caudal alta, branquias y marcas apicales discretas; no se diferencia solo por color. |
| Tilapia del Nilo — `af_xlsx_tilapia` | Plantilla alargada de depredador con dorsal pequeña. | Cuerpo comprimido alto de cíclido, dorsal larga con radios espinosos y blandos, anal ancha y caudal redondeada marcada. |
| Pez tigre goliat — `af_xlsx_pez_tigre_goliat` | Plantilla estrecha con barras de otro taxón. | Cabeza robusta y mandíbula dentada, tórax más profundo, cola fuertemente bifurcada y dorsal/adiposa separadas. |
| Pez mariposa africano — `af_xlsx_131_pantodon_buchholzi` | Aleta superior triangular aislada y boca angular. | Pectorales amplias con base integrada detrás de la cabeza, radios convergentes y aletas inferiores filamentosas; perfil superior relativamente plano. |
| Pez tigre africano — `af_xlsx_131_hydrocynus_vittatus` | Dibujado como el goliat, con barras verticales. | Perfil más estrecho y veloz, cabeza menos masiva, adiposa y bandas longitudinales, coherentes con el taxón. |
| Trucha arcoíris — `na_esp_oncorhynchus_mykiss` | Pez azul estándar sin identidad propia. | Contorno propio, caudal escotada, adiposa, banda rosada y puntos pequeños distribuidos sobre el dorso y flanco. |

## Pruebas y límites

- Tres pruebas específicas en `tests/fish-v3199.test.cjs`: cobertura/clasificación de 18 taxones y exclusión de grupos ajenos; 18 geometrías distintas y variantes de pigmento con las mismas rutas; ejecución CommonJS y VM sin navegador.
- Chromium: los 18 SVG se analizaron como XML válido y se midió `getBBox`; todos permanecen dentro de `0–100` en ambos ejes. No se detectaron valores no finitos ni recursos externos.
- Los dibujos ocupan aproximadamente 1,3–4,3 KB por taxón, sin filtros, animaciones ni identificadores internos que colisionen al repetirse en tarjetas.
- No se alteraron datos del catálogo, rarezas, regiones, encuentros, dimorfismo, colecciones ni guardados. La suite completa y la integración de pigmentos/halos se verifican en el informe global de la versión.
- La revisión visual aquí documentada es en Chromium de escritorio a tamaños 56 y 120, con siluetas; no constituye validación en un dispositivo Android físico ni revisión de los tres peces relictos museísticos, que se documentan por separado.
