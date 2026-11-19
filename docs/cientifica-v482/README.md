# El Gran Atlas V4.8.2 · Anfibios

GM-07-R03 incorpora **51 láminas** para **34 especies**. Incluye 22 anuros, 12 salamandras y tritones, 11 variantes albinas y seis melánicas. Con el sapo pulga ilustrado desde V4.7.3, la cobertura llega a **35 de 35 anfibios** y cierra la migración artística de reptiles y anfibios. El total es **887 de 998 especies ilustradas**, **1.536 láminas** y **11 de 12 legendarios**. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar la PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v482.html)

## Dirección artística y auditoría

Las ranas y los sapos se distinguen por la forma del cuerpo, la postura, los discos adhesivos, las membranas, las glándulas y el contorno de la cabeza. La rana goliat muestra extremidades posteriores largas y pies palmeados. La de ojos rojos muestra discos naranjas y flancos bandeados. Se ilustraron las proyecciones supraoculares de la cornuda, el hocico de la ranita de Darwin, el perfil corto de la rana de lluvia y los patrones de las ranas dardo y la corroboree.

Las salamandras gigantes muestran cabeza aplanada y pliegues laterales. En la japonesa se acentuaron los tubérculos de la cabeza y la mandíbula. Las salamandras terrestres se distinguen por la forma de la cola, los surcos y las manchas. Los tritones se comparan por el vientre, la cresta y los pies. El ajolote silvestre muestra pigmentación moteada. Su lámina albina tiene pigmento dorado tenue y ojos rojizos, con las branquias externas delineadas en ambas. Las otras variantes conservan el contorno y la textura de la lámina base, con un ajuste de pigmentación.

El laboratorio ofrece **nueve conjuntos** de anfibios. Incluye ranas, sapos, arborícolas, dardo, salamandras gigantes y terrestres, tritones, el ajolote normal y albino y el sapo pulga junto a la rana goliat. El sapo pulga mantiene su factor 0,25. El colibrí abeja mantiene 0,50 y el resto 1,00. La auditoría coteja las 35 especies, sus 18 familias, hábitats, variantes e identificadores contra el catálogo. [Auditoría](auditoria-herpetologica.json) · [Estándar gráfico](../cientifica-v440/estandar.md)

## Peso y conservación

Se conservaron sin cambios los **5.940 WebP** y las **853 rutas** de las láminas existentes. Las 51 láminas nuevas suman 204 WebP con alfa y margen transparente. Las calidades de exportación son 82, 83, 86 y 90, con alfa 100. Se revisaron las siluetas en fondos claros y oscuros y se comprobó la distribución de alfa en las cuatro resoluciones.

| Resolución | V4.8.1 | Lote nuevo | V4.8.2 |
| --- | ---: | ---: | ---: |
| 64 px | 3,05 MB | 0,11 MB | 3,16 MB |
| 128 px | 7,30 MB | 0,26 MB | 7,56 MB |
| 256 px | 20,66 MB | 0,75 MB | 21,40 MB |
| 512 px | 63,32 MB | 2,31 MB | 65,62 MB |
| **Total** | **94,33 MB** | **3,41 MB** | **97,74 MB** |

El caché básico ocupa **122,04 MB**. Los 636 recursos opcionales del laboratorio suman **11,70 MB**. Se reutilizaron los 16 paisajes y el sistema de halos externos. [Mediciones y bytes exactos](mediciones.json)

## Validación funcional

Pasaron las **17 pruebas de publicación**. En las **815 pruebas históricas** hubo 587 aprobadas y los mismos 228 fallos de V4.8.1. [Comparación de la suite histórica](regresion.json)

Los 16 modos del laboratorio funcionaron a 320 y 1280 px, con exportación JSON offline. Se probaron el ajolote y las salamandras gigantes a 64 y 128 px y se midió la escala del sapo pulga frente a la rana goliat. [Comparar ajolotes](comparacion-ajolote-1280.jpg) · [Comparar tamaños](comparacion-escala-anfibios-1280.jpg)

La actualización PWA desde V4.8.1 conservó el respaldo exacto y los once campos de partida cotejados. Se probaron avistamientos automáticos y la integración de la rana bermeja y el ajolote en Campo, Cuaderno, Bestiario y Museo sin conexión. Se verificaron el halo de sus variantes, los paisajes según zona y las dos excepciones de escala tras actualizar y reiniciar. [Resultados PWA](pwa.json) · [Ajolote albino en Campo](campo-albino-390.jpg) · [Rana bermeja melánica en Campo](campo-melanico-390.jpg)

| Ancho | Apertura de Campo | Memoria JS de Campo | Avistamiento automático de rana | Avistamiento automático de ajolote |
| --- | ---: | ---: | ---: | ---: |
| 390 px | 116 a 97 ms | 6,55 a 9,51 MB | 1868 ms | 2408 ms |
| 1280 px | 71 a 81 ms | 7,55 a 8,61 MB | 2816 ms | 3830 ms |

Los tiempos y la memoria corresponden a Chromium en el entorno de pruebas. Las medidas comparativas muestran V4.8.1 y V4.8.2 en ese orden. La mediana de decodificar las 51 láminas nuevas de 128 px en la auditoría local fue de 23,39 ms para el lote completo.

Pasaron las 62 pruebas del verificador Android, incluidas las rutas UTF-8. Capacitor sincronizó el paquete web con versionCode 40802. La restauración física sigue pendiente y es un requisito independiente para la distribución estable de Android. [Flujo de firma permanente](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml)

## Preparación de V4.9

Quedan **111 especies y 134 láminas** en siete lotes. El plan incluye peces y cefalópodos, sus variantes y la última lámina legendaria, **Remonte**, el salmón rosado. [Plan V4.9](plan-v49.md) · [Inventario técnico](inventario-v49.json)
