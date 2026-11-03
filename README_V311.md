# El Gran Atlas — Beta 3.11: Museo con cinco salas

## Navegación
- **Exposiciones:** galería de vitrinas con animales, fósiles catalogados, relictos encontrados y artefactos.
- **Muestras:** animales investigados 5/5 y monografía publicada, ordenados por ingreso £/segundo (descendente); mantiene los doce espacios de especies del Museo anterior.
- **Fósiles:** taller de fabricación y registros fósiles existentes.
- **Relictos:** cuatro posibles hallazgos extremadamente escasos por región y hábitat. Se almacenan únicamente en museum.relicts, no en el Atlas, dinero, prestigio ni las misiones de biodiversidad.
- **Artefactos:** cartas cartográficas y medallones históricos de la Beta 3.10. Conserva IDs carta_historica / medallon_viajero y piezas adquiridas.

## Taller paleontológico
| Fabricación | Materiales |
|---|---|
| Hueso corto | 2 fragmentos fósiles |
| Hueso largo | 4 fragmentos fósiles |
| Cráneo carnívoro | 1 cráneo fósil y 10 dientes fósiles |
| Reconstrucción de T. rex | 10 huesos largos, 25 huesos cortos y 1 cráneo carnívoro |

Fabricación x1/x5/x10 para piezas repetibles. Montaje final único. La muestra de T. rex es una reconstrucción coleccionable, no un descubrimiento de fauna africana.

## Obtención
- Expediciones conservan el botín antiguo y suman probabilidad independiente del diente fósil (20,5%) o cráneo fósil (2,5%) por regreso.
- Tras avistamientos normales existen probabilidades bajas adicionales de fragmentos, dientes, cráneos y, solo en cuatro zonas concretas, relictos.
- Encargos en Sociedad: 200 avistamientos totales y 3 expediciones completadas desde esta versión otorgan materiales paleontológicos (recompensa única).

## Guardado
Se conserva gran_atlas_v05 y el-gran-atlas-save formato v1. Nuevas propiedades opcionales museum.relicts, museum.displays y museum.voyagesCompleted se crean si faltan; museum.collections previo se mantiene.
El APK usa com.elgranatlas.naturaleza.beta311 para instalar aparte de Beta 3.10.1. Exportar JSON, instalar Beta 3.11 e importar; verificar datos antes de desinstalar.
