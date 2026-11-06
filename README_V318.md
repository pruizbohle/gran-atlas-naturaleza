# El Gran Atlas — Beta 3.18 · Relictos y mecánicas

## Objetivo
Dar protagonismo a los relictos como un sistema de investigación propio y conservar el Museo, el Atlas, los guardados y todas las mecánicas de Beta 3.17.

## Relictos: nuevas mecánicas

- **Nueve relictos** (seis históricos + tres nuevos): esturión blanco del Pacífico (*Acipenser transmontanus*, Columbia Británica), gavial del Ganges (*Gavialis gangeticus*, subcontinente indio) y proteo cavernícola (*Proteus anguinus*, Balcanes). Los relictos representan linajes antiguos, poblaciones singulares o registros históricos, no nuevas especies del Bestiario.
- **Indicios en Campo:** aparecen de manera independiente al censo, tras observar fauna en el hábitat y horario de la región correspondiente (4 % manual, 0,7 % automático, duplicables mediante investigación). Se requieren **3 indicios** para completar un expediente. Los hallazgos extraordinarios directos originales se conservan.
- **Misiones documentales:** una misión simultánea por defecto, o dos con la investigación *Archivos de historia natural*. Duran 5 minutos en Europa, 7 en Asia, 8 en África o 9 en Norteamérica y consumen libras y conocimiento. Entregan un indicio garantizado (dos con investigación), con 20 % de opción de una muestra de huellas. No se pueden ejecutar dos misiones simultáneas sobre el mismo relicto ni obtener doble recompensa por reclamar una misión.
- **Catalogar expediente:** con 3 indicios, 140 conocimiento, 1 tinta y 2 pergaminos. Los relictos encontrados directamente en versiones anteriores siguen catalogados sin nuevos requisitos.
- **Colecciones especiales:** *Linajes acuáticos antiguos* (+2,5 % de ingreso del Museo), *Biodiversidad insular singular* (+2 %) y *Crocodilianos singulares* (+2 %). No hay ingreso individual por relicto.
- **Logros:** por 2, 5 y 8 relictos. Se reclaman una sola vez, conceden 175, 450 y 900 conocimiento respectivamente y cada logro añade +3 % al conocimiento obtenido en Campo.
- **Análisis comparativo:** con un relicto catalogado, 2 muestras de huellas, 1 tinta y 100 conocimiento, permite añadir +1 % permanente al conocimiento de Campo por nivel, hasta +12 % (12 niveles).
- **Investigaciones nuevas:** *Archivos de historia natural* (2 misiones simultáneas y +1 indicio por misión) y *Rastreo de poblaciones singulares* (duplica hallazgos de indicios en Campo).
- **Registro histórico:** las misiones documentales muestran tiempo restante y los últimos ocho resultados con indicios/materiales. El Museo conserva el control de exponer/retirar las vitrinas.

## Dinosaurios y fósiles

- **Paquicefalosaurio** y **Carnotauro** como reconstrucciones inéditas, con sprites SVG propios: ya son ocho montajes permanentes de dinosaurios.
- Nuevo objeto fabricable **Cuerno fósil** (4 fragmentos + 2 dientes fósiles); necesario para Triceratops (3 cuernos) y Carnotauro (2).
- Nuevo objeto fabricable **Hueso duro** (6 fragmentos + 2 piedras de río); necesario para Anquilosaurio (4) y Paquicefalosaurio (6).
- *Cráneos y defensas fósiles*: nueva colección formada por Triceratops, Paquicefalosaurio y Carnotauro; +2,5 % al ingreso del Museo.
- Los esqueletos ya montados en partidas anteriores permanecen montados: la actualización de recetas afecta únicamente a las fabricaciones futuras.
- Las reconstrucciones no cuentan como animales del Atlas.

## Excavaciones: tiempo restante y recompensas visibles

- Las excavaciones activas muestran un contador **HH:MM:SS** actualizado aproximadamente cada segundo; al concluir, cambia a «lista para recoger».
- Las recompensas se guardan en un historial separado de las **últimas 12 excavaciones** (fecha, yacimiento, objetos y cantidades), además del registro general.
- Las excavaciones anteriores conservan sus objetos y progresión; no es posible reconstruir automáticamente un desglose retrospectivo de recompensas si la Beta 3.17 no lo guardó.
- Los registros se persisten con la partida y se conservan al cerrar/reabrir el juego.

## Compatibilidad

- Mantiene **487 especies y 57 zonas**.
- No cambia los IDs, la configuración ni la economía base de los avistamientos; las bonificaciones nuevas tienen efectos verificables y se aplican solo al cumplir requisitos.
- No cambia el identificador del paquete Android ni la clave `gran_atlas_v05`.
- Los guardados de versiones anteriores inicializan los nuevos campos sin eliminar colecciones, relictos, excavaciones, inventario ni monografías.
- Las fichas del Museo continúan organizadas en cinco pestañas.
- Las pruebas incluyen hitos, límites, recompensas únicas, tiempos, recetas, compatibilidad de guardados y efectos de bonos.

## Publicación
Version web en GitHub Pages; APK de prueba de Android en Release `v3.18.0` como `El-Gran-Atlas-Beta-3.18.0-debug.apk`.
Antes de instalar un APK, exporta un respaldo del progreso.
