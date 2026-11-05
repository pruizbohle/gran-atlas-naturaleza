# El Gran Atlas — Beta 3.15.2 · Auditoría del motor, probabilidades e inventario

## Alcance
Revisión del motor del juego tras Beta 3.15.1, sin añadir regiones ni cambiar los topes, costes de investigación, fórmula de rarezas o esquema de partidas guardadas. Se activan tres bonificaciones que estaban escritas en Inventario pero sin implementación; se cuantifican las bonificaciones y se completa la clasificación zoológica de especies para aplicar las disciplinas de Naturalismo.

## 1. Funcionamiento de naturalistas
- El equipo automático comienza a buscar si `state.helpers > 0`. El número de naturalistas **no** crea búsquedas paralelas; incrementa la probabilidad de acierto (+3 % relativo por ayudante) hasta el límite compartido de ayudantes/capacitación (+45 %).
- Los niveles de Método de rastreo determinan el intervalo **5, 3, 2, 1 o 0,5 segundos por intento**.
- La búsqueda automática usa la fauna de todos los hábitats y horarios compatibles de la región, con la estación elegida; la manual mantiene los filtros seleccionados.
- Máximo **100 avistamientos automáticos por especie y por hora**. Al saturar todas las especies compatibles, la búsqueda automática se pausa hasta la siguiente hora. La manual no comparte ese límite.
- No hay servidor ejecutando naturalistas con el navegador cerrado. Al reanudar, el juego calcula tiempo transcurrido hasta un máximo de **8 horas**, con un límite adicional de **500 búsquedas procesadas en un solo tick**. La ejecución automática en pestañas de segundo plano también puede ser limitada por el navegador o el sistema operativo.
- El diario informa estado de pausa y muestra progreso cuando hay cambios.

## 2. Probabilidad base y bonificaciones de búsqueda
El motor calcula `P(manual) = min(0,96, 0,50 × [1 + 0,12 × prismáticosInvestigación + 0,12 × prismáticosEquipados])`.

| Configuración manual | Probabilidad por intento |
|---|---:|
| Base | 50 % |
| Prismáticos I | 56 % |
| Prismáticos II, sin equipamiento | 62 % |
| Prismáticos II + objeto Prismáticos de viaje | 68 % |

La búsqueda automática calcula `P(auto) = min(0,96, 0,38 × [1 + min(0,45, 0,03 × naturalistas + 0,08 × capacitación) + 0,08 × colgante + 0,05 × capucha])`. Requiere al menos un naturalista para generar búsquedas.

| Configuración automática | Probabilidad por intento |
|---|---:|
| Probabilidad base | 38 % (sin naturalista no se ejecutan intentos) |
| 1 naturalista | 39,14 % |
| 10 naturalistas + Capacitación II | 55,10 % |
| Anterior + Colgante del explorador | 58,14 % |
| Anterior + Capucha impermeable | 60,04 % |

Los ejemplos suponen fauna disponible y cupo sin saturación. Los bonos indicados (+3 %, +5 %, +8 %, +12 %) son *relativos al porcentaje base*, no puntos porcentuales directos.

## 3. Encuentros múltiples y censos
La probabilidad de acertar una búsqueda se calcula solo una vez, antes de elegir si se registran varias especies:
- Grupo I: 10 % de dos especies por encuentro manual.
- Grupo II: 20 % de dos.
- Grupo III: 70 % de una, 25 % de dos, 5 % de tres (si existen suficientes especies diferentes compatibles).
- Patrullas automáticas: 86 % de una, 12 % de dos, 2 % de tres.
- Censo manual: ×1, ×2 o ×3 según nivel. Censo automático requiere investigación adicional y permite ×2.
- Un censo no multiplica los hallazgos de objetos, fósiles ni variantes. Se conserva el límite horario automático.

Los encuentros no determinan directamente una especie rara: escogen una especie del conjunto elegible según los pesos Común=12, Poco común=5, Raro=1,8 y Muy rara=0,4. Especializarse en su grupo zoológico aumenta el peso relativo de las especies menos frecuentes, sin hacerlas obligatorias ni modificar la probabilidad base de la búsqueda.

## 4. Equipamiento: verificación y correcciones

| Objeto equipado | Efecto |
|---|---|
| Prismáticos de viaje | +12 % relativo de probabilidad manual |
| Brújula de latón | +4 % de conocimiento obtenido al regresar de expedición, redondeado |
| Morral reforzado | +3 puntos porcentuales sobre la probabilidad de botín de expedición (35 % → 38 %) |
| Sombrero de naturalista | +10 % de conocimiento generado en búsquedas |
| Gorro emplumado | +6 puntos porcentuales de botín en expedición (35 % → 41 %) |
| Capucha impermeable | **Corregido:** +5 % relativo de probabilidad de encuentro automático |
| Colgante del explorador | +8 % relativo de probabilidad de encuentro automático |
| Amuleto de ámbar | **Corregido:** +5 % de la subvención base al solicitarla |
| Collar de conchas | **Corregido:** +5 % de libras entregadas al regresar de expedición |

Los objetos sin ranura son materiales, muestras, mapas, reliquias o ingredientes: su utilidad no implica un buff equipable. El Inventario permite una pieza por ranura (instrumento, sombrero, collar).

## 5. Investigaciones y otras mecánicas
- Investigación I/II de prismáticos, naturalistas, entrenamiento y autoTier: sus efectos están conectados al motor.
- Grupo I–III, Censos I–II, Patrullas y Censo automático: efectos cuantificados y probados con cupo horario.
- Mastozoología, Ornitología, Herpetología e Ictiología: afectan **el peso** de las especies elegibles. Se amplió la tabla taxonómica para clasificar especies de tipo elefante, rinoceronte, pangolín, jirafa, lémur, cebra, dugongo, cetáceo, avestruz, cocodrilo y raya; las rayas ahora participan de Ictiología.
- Etología I/II: aumenta la observación del sexo en especies configuradas con dimorfismo; Etología II eleva la posibilidad de variante especial de 1 % a 1,5 % por encuentro de especie.
- Paleontología I–III: tiradas adicionales de expedición para fragmentos, dientes y cráneos, sin eliminar el botín previo.
- Gabinete de especímenes: muestra especial solo en especies con un objeto de especie asociado, con 2 % por avistamiento manual o 0,5 % automático.
- Economía del Museo: +15 % de ingresos de exposiciones, siempre que existan exposiciones que produzcan ingresos.
- Rutas, astillero, mapas, acceso a África y Norteamérica: reglas presentes y cubiertas por pruebas de regresión. **Norteamérica operativa actualmente con Alaska y Columbia Británica**; otras zonas del Excel siguen pendientes.

## 6. Mejoras visibles de la Beta 3.15.2
- Campo: probabilidades efectivas manual y automática, frecuencia de búsqueda, censos, encuentros múltiples y especies con cupo.
- Investigación: resumen de bonificaciones adquiridas, intervalos y estados; descripciones de nodos actualizadas con porcentajes o cantidades precisas.
- Inventario: descripción explícita de bonos equipados; distinción de porcentajes relativos y puntos porcentuales; premios mostrados según equipamiento activo.
- Se añadieron pruebas de objetos para subvenciones, expediciones, botín, probabilidades y cobertura taxonómica.

## 7. Pendiente antes de la versión final
1. Calibrar el límite de 100 avistamientos automáticos por especie y hora frente al número de naturalistas y al intervalo mínimo de búsqueda: en zonas con poca fauna, incluso este comportamiento corregido obliga a esperar parte de la hora.
2. Rediseñar el cálculo del progreso fuera de línea para representar mejor intervalos largos y el máximo actual de 500 intentos por actualización.
3. Afinar los costes y multiplicadores después de completar la expansión regional.
4. Probar en dispositivos reales la carga prolongada, la actualización visual del diario, la compatibilidad Android y el equilibrio del juego.
5. Completar la fauna y zonas norteamericanas todavía pendientes.

**Compatibilidad:** clave local `gran_atlas_v05`, formato JSON de respaldo e identificador Android `com.elgranatlas.naturaleza.beta314` permanecen intactos.
