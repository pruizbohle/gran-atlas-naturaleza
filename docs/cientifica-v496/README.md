# El Gran Atlas V4.9.6 · Catálogo mundial ilustrado

GM-07-P06 incorpora **36 láminas científicas**, correspondientes a 16 peces marinos y 20 cefalópodos. Las **1.000 fichas activas** alcanzan cobertura completa, con **1.672 láminas**, **125 regiones**, **12 legendarios** y **9 relictos**. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizar PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## Revisión artística

Se revisaron individualmente las 36 láminas en fondos claros y oscuros. Las comparativas de laboratorio usan el mismo encuadre y resoluciones de 64 y 128 px para juzgar silueta, contraste y anatomía. Comparan proporciones dentro de cada ejemplar y mantienen los factores de escala de *Gigantes en miniatura*. Las láminas se muestran por tamaño de muestra en pantalla. [Inventario del lote](../cientifica-v495/plan-v496.md) · [Escalas conservadas](../cientifica-v493/gigantes-en-miniatura.md) · [Peces sobre fondo claro](revision-peces-light.jpg) · [Peces sobre fondo oscuro](revision-peces-dark.jpg) · [Cefalópodos sobre fondo claro](revision-cefalopodos-light.jpg) · [Cefalópodos sobre fondo oscuro](revision-cefalopodos-dark.jpg)

- Los escómbridos se diferencian por el tramo de la pectoral en el bonito del norte, las aletas posteriores prolongadas en el atún de aleta amarilla y el tronco robusto del atún rojo. Se compararon los perfiles cefálicos y líneas laterales de los bacalaos y los escudos y perfiles de los jureles. [FAO, caracteres de los atunes](https://www.fao.org/4/i3508e/i3508e.pdf) · [Ficha de jurel chileno](https://www.fishbase.se/Fieldguide/FieldGuideSummary.php?c_code=152B&genusname=Trachurus&speciesname=murphyi)
- El pez luna del sur presenta prominencias en la frente y el mentón y un *clavus* redondeado. El pez luna común conserva un perfil frontal más continuo y un margen posterior ondulado. [Redescripción de Sawai y colaboradores](https://researchportal.murdoch.edu.au/esploro/outputs/journalArticle/Redescription-of-the-bump-head-sunfish-Mola/991005545329907891)
- El calamar gigante presenta un manto estrecho y dos tentáculos de captura muy largos. El calamar colosal tiene el manto más robusto, las aletas más anchas y mazas tentaculares armadas. En los pulpos se comprobaron las proporciones del manto, brazos, ventosas, ocelos o membranas según la especie. La lámina del pulpo de siete brazos representa una hembra. [Comparación anatómica de Te Papa](https://www.tepapa.govt.nz/digital-museum/explore-digital-museum/colossal-squid/difference-between-colossal-squid-giant-squid) · [Ganchos y ventosas del calamar colosal](https://www.tepapa.govt.nz/digital-museum/explore-digital-museum/colossal-squid/anatomy-colossal-squid/arms-and-tentacles)

Los cefalópodos mantienen la categoría jugable **Peces** y la clase zoológica **Cephalopoda**. El laboratorio conserva el SVG histórico en Campo mixto para la comparación visual de formatos. [Inventario de auditoría por ficha](inventario-auditoria-v50.json)

## Recursos

Las 36 láminas añadieron **144 WebP transparentes** a 64, 128, 256 y 512 px, con calidades 82, 83, 86 y 90 y alfa a calidad 100. Se comprobaron el alfa y las dimensiones de cada archivo. El manifiesto de caché básico incluye las rutas de todas las variantes. Se conservaron byte a byte los 6.544 WebP previos, los 16 paisajes y las referencias del laboratorio. [Mediciones exactas](mediciones.json)

| Resolución | V4.9.5 en MB | Lote nuevo en MB | V4.9.6 en MB |
| --- | ---: | ---: | ---: |
| 64 px | 3,31 | 0,07 | 3,38 |
| 128 px | 7,91 | 0,18 | 8,09 |
| 256 px | 22,36 | 0,48 | 22,84 |
| 512 px | 68,68 | 1,45 | 70,13 |
| **Total** | **102,26** | **2,18** | **104,44** |

El caché básico ocupa **129,20 MB** y reúne 6.930 entradas. El caché opcional de revisión conserva **11,70 MB**. Se midió la escena de columna batial antes y después de sustituir el SVG del calamar de aguas profundas. [Rendimiento y memoria](rendimiento.md)

## Validación

Pasaron las **28 pruebas de publicación** y las **62 comprobaciones estáticas de Android**. El laboratorio pasó sus **24 modos** a 320 y 1280 px, con once grupos nuevos de comparación y pruebas de descarga de referencias y reapertura sin conexión. La regresión ejecutó **821 pruebas**, aprobó **594** y reprodujo exactamente los **227 fallos históricos** de V4.9.5. [Regresión frente a V4.9.5](regresion.json)

El actualizador validó la recuperación de una transferencia interrumpida y rechazó una lámina con SHA-256 alterado. Se comprobó la activación tras cerrar la otra ventana y las migraciones desde V4.3.0, V4.8.1, V4.8.2, V4.9.2, V4.9.3 y V4.9.5. Se actualizó una PWA instalada de V4.9.5 con un registro hadal previo. Se comprobó la conservación de la partida y su respaldo exacto. Ya sin conexión, se registraron el atún de aleta amarilla y el pulpo de coco mediante observación manual y automática y se completó el muestreo batial del pulpo dumbo. Las láminas cargaron en Campo, Cuaderno, Bestiario y Museo. [Pruebas de migración PWA](migraciones-pwa.json) · [Muestreo del pulpo dumbo en Campo](campo-pulpo-dumbo.jpg)

## Auditoría V5.0

La auditoría se entrega como inventario por familia y ficha con un registro de prioridades y etapas. Identifica las presencias regionales que usan reglas específicas, las rutas gráficas compartidas y el conjunto de fallos históricos. [Plan e inventario de auditoría](auditoria-v50.md)

La entrega corresponde a la versión web. Las comprobaciones de Android son estáticas.
