# Revisión independiente de integración — v3.19.9

Se inspeccionó el laboratorio real servido desde `www/laboratorio-pulido-v3199.html` en Chromium. Esta revisión es adicional a las auditorías artísticas por grupo; no sustituye su inspección anatómica individual.

## Defectos encontrados y correcciones verificadas

1. **Comparación de 120 px desbordaba tarjetas en anchos intermedios.** A 500, 701, 768, 800 y 1024 px, los SVG salían del contenido de las tarjetas aunque el documento no mostrara desplazamiento horizontal. Se comunicó el defecto y se cambió la cuadrícula a columnas adaptativas con un mínimo de 290 px, permitiendo envolver el par cuando es necesario. La segunda comprobación a 390, 420, 500, 700, 701, 768, 800, 900, 1000, 1024 y 1440 px dio cero tarjetas con desbordamiento interno, conservando SVG de 120 px.
2. **Controles sin efecto en grupos no aplicables.** Sexo permanecía habilitado para peces, Legendarios y relictos; pigmentación también para Legendarios y relictos. Se deshabilitaron donde no tienen representación disponible. Se comprobó que permanecen activos sexo/pigmentación en mamíferos y pigmentación en peces.
3. **Prefijado de IDs alteraba metadatos de identidad.** La expresión `\bid="..."` también capturaba el sufijo de `data-legendary-id`, convirtiendo por ejemplo `ascua` en `after-ascua-ascua`. Se restringió la sustitución al atributo `id` precedido por espacio. La comprobación posterior confirmó los 12 metadatos Legendarios iguales al identificador original de su tarjeta, y referencias de recorte sin roturas.

## Procedencia y arquitectura

- El generador de comparación fija el commit `bacffc91dc39fecfbba850f0d4bcfc10ba36398f` y protege la instantánea anterior con SHA-256. Contiene la **copia inline de peces realmente usada en producción**, además de los motores anteriores de mamíferos, aves, herpetofauna y Legendarios, catálogo, pigmentación y dibujos museísticos. No se confundió con el archivo externo histórico del laboratorio de peces.
- La instantánea anterior vive dentro de un ámbito de `globalThis/window` aislado; los motores actuales no sustituyen sus funciones capturadas. La exportación pública es `ATLAS_POLISH_BEFORE`.
- El dibujo actual del laboratorio se extrae de los mismos renderizadores de producción. Se ejecutaron los controles de reproducibilidad `build-polish-lab-v3199.cjs --check` y `build-dimorphism-lab.cjs --check`, ambos correctos.
- Los prefijos de IDs del laboratorio separan antes/después y especie sin modificar rutas, colores ni dimensiones. En la primera página de mamíferos se comprobaron 34 IDs, los 34 únicos, sin referencias `clip-path` ausentes; también se comprobaron referencias en los otros tres grupos.

## Comportamiento comprobado

- Inventario del laboratorio: 269 mamíferos, 18 peces/rayas, 12 Legendarios y 9 relictos.
- Búsqueda sin tildes: `tiburon` devuelve las dos especies correspondientes. Filtro `carpa`: una tarjeta.
- Cambio macho/hembra en una especie con dimorfismo (`asia_esp_0441`) produce dibujos distintos; seleccionar Albino usa el SVG con `data-pigmentation="albino"`.
- Cambio de grupo, filtros, tamaño, fondo oscuro, silueta y comparación funcionan sin errores JavaScript observados.
- El laboratorio pagina 24 tarjetas, evitando dibujar simultáneamente los 308 registros. Una medición orientativa en este Chromium registró aproximadamente 14,5 ms para regenerar una página de mamíferos. El conjunto de scripts del laboratorio fue de aproximadamente 1,22 MB sin comprimir, incluyendo las referencias históricas; esos datos de comparación no se cargan desde el juego principal. No es una medición de rendimiento Android.

## Interpretación de resultados

El rótulo «Cambio de construcción SVG» compara geometría, no solo color; **no es una aprobación artística automática**. Los textos del desplegable «Registro artístico» describen pautas de grupo/familia, por lo que la evidencia individual y los defectos corregidos deben leerse en las auditorías adjuntas. No se deben convertir conteos, XML válidos o ausencia de excepciones en una afirmación de calidad anatómica por sí solos. La comprobación anatómica propia de esta revisión cubre los 18 peces en la plancha documentada aparte; los otros grupos requieren sus revisiones específicas.
