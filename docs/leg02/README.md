# El Gran Atlas V5.1.1 · LEG-02

La colección alcanza **30 legendarios únicos** en la rama `audit/aud-01-v501`, a partir de `1f136518`. Se conservan las veinte identidades anteriores y se incorporan diez individuos de especies ya presentes. El catálogo mantiene 1.000 especies, 125 regiones y 9 relictos. [Inventario de 30 identidades, rutas y SHA-256](inventario.json) · [Comparativas y decisiones](comparativas.md)

## Nácar y compatibilidad de partidas

Filigrana se muestra como **Nácar** en Campo, Cuaderno, Bestiario, Museo, diario de Campo y laboratorio. La lámina, el identificador `filigrana`, la especie `na_esp_ambystoma_mexicanum` y la probabilidad se conservan. El visor busca por ambos nombres. En los registros históricos, la interfaz muestra Nácar y el respaldo conserva el texto original.

Se importó un respaldo de V5.1.0 con los veinte descubrimientos, incluido Filigrana. Se probaron los diez nuevos descubrimientos en el motor, la exclusión de duplicados incluso al registrar el mismo encuentro otra vez, la persistencia tras recargar y la exportación e importación de los 30 descubrimientos. La prueba compara las tasas de todas las especies antes y después. Solo incorpora la categoría legendaria a los diez taxones indicados, con la tasa existente y su modificador de etología. [Pruebas del motor y del manifiesto](../../tests/leg02.test.cjs)

## Láminas y archivos

| Recurso | Archivos | Bytes |
| --- | ---: | ---: |
| Diez nuevas identidades activas | 40 | 642.466 |
| Tres láminas revisadas, antes | 12 | 209.968 |
| Tres láminas revisadas, después | 12 | 207.840 |
| Propuestas descartadas para comparación | 12 | 200.252 |
| Total de láminas activas de producción | 6.760 | 106.785.820 |
| Manifiesto offline del juego | 7.014 | 131.836.100 |

Los 1.690 diseños activos se distribuyen en WebP transparente de 64, 128, 256 y 512 px. El aumento neto de archivos de producción es de **640.338 bytes** y el del manifiesto offline es de **689.079 bytes**. Las versiones anteriores y las propuestas descartadas forman parte de los recursos de revisión del laboratorio. La comparación se hace sin halos y sobre fondos comunes. Se conservan las escalas especiales y todos los archivos históricos de pigmentación. [Estado de la pausa pigmentaria](../arte-pigmentarias/estado-pausa.md)

## Verificación de la biblioteca

La biblioteca permite buscar por identidad, nombre común o nombre científico, elegir los lotes LEG-01 y LEG-02 y abrir las comparativas históricas. Se probaron las cuatro resoluciones en Chromium, a 1.280 y 390 px de ancho. Se verificaron las 40 combinaciones de las diez nuevas láminas y las cuatro vistas previas del laboratorio. También se comprobó la presentación de Nácar en los cuatro módulos del juego con un registro histórico. [Evidencia de escritorio y móvil](evidencia/) · [Prueba reproducible en Chromium](../../scripts/leg02-browser.cjs)

El laboratorio de la rama abre en `/naturalist-art/?view=legendary` al servir el directorio `www`. El visor aislado incluye la colección y conserva el acceso a las 564 variantes pigmentarias. [Colección de legendarios en el visor](https://el-gran-atlas-visor-pigmentario.muddyroadrunner17.chatgpt.site/legendarios/)

En la suite completa, LEG-01 registró 649 pruebas aprobadas y 222 fallidas. LEG-02 registró **652 aprobadas y los mismos 222 fallos**, comparados por archivo y nombre. Se actualizaron las expectativas de inventarios anteriores para reflejar las incorporaciones previstas. Las tres nuevas pruebas dirigidas pasaron. El verificador de la publicación regeneró íntegramente el manifiesto SHA-256. [Resultados de la regresión](evidencia/regresion.json) · [Resultados de Chromium](evidencia/laboratorio.json)

Sites confirmó el despliegue privado del visor aislado. El paquete se verificó localmente, incluidos los 30 ejemplares, el alias de Nácar y las rutas de imágenes. La apertura de la URL privada en el navegador compartido y la vista previa administrada quedaron sin verificar por fallos de la infraestructura. El despliegue del juego y la firma Android están fuera de esta entrega.
