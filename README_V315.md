# El Gran Atlas — Beta 3.15 · Instituto de Historia Natural

## Objetivo de esta versión
Conservar el mapa, las regiones y los avances existentes, e inaugurar una progresión de investigaciones con **cinco ramas**. No se agregan regiones ni se cambian las exigencias de prestigio. Los precios de las 21 investigaciones nuevas son **de prueba** y se revisarán cuando la expansión geográfica esté completa.

## Ramas
1. **Exploración**: prismáticos, búsqueda automática, naturalistas, encuentros múltiples y censos.
2. **Naturalismo**: cuaderno, Mastozoología, Ornitología, Herpetología, Ictiología y Etología.
3. **Expediciones**: astillero, mejoras de navegación, rutas y estudios cartográficos de continentes.
4. **Museología**: gabinete, Paleontología I–III y Economía científica del Museo.
5. **Sociedad**: subvenciones, catálogo de notas y escalas de fondos científicos.

Las investigaciones antiguas mantienen **sus IDs, dependencias, compras y efectos**. El menú de investigaciones incorpora pestañas horizontales desplazables y tarjetas legibles en móviles.

## Nuevas investigaciones y resultados

| Cadena | Niveles nuevos | Efecto |
|---|---:|---|
| Observación en grupo | I, II, III | 10 % o 20 % de una segunda especie; máximo 25 % de dos y 5 % de tres especies al último nivel |
| Censo poblacional | I, II | Dos o tres avistamientos de la misma especie por observación manual |
| Patrullas de observación | I | Encuentros múltiples en búsquedas automáticas con probabilidades menores |
| Censo automatizado | I | Censo ×2 automático, respetando cupos |
| Mastozoología | Básica y media | Mejora progresiva de encuentros poco comunes, raros y muy raros en mamíferos |
| Ornitología | Básica y media | Equivalente para aves |
| Herpetología | Básica y media | Equivalente para reptiles y anfibios |
| Ictiología | Básica y media | Equivalente para peces |
| Etología | Básica y media | Mejora probabilidad de distinguir sexo y de observar variantes |
| Paleontología | Básica, media, avanzada | Prospección **adicional** de fragmentos, dientes y cráneos al completar expediciones |
| Economía científica del Museo | I | +15 % de ingresos del Museo |

Las mejoras automáticas están **bloqueadas detrás de investigaciones previas**: Patrullas requiere Observación en grupo III y Método de rastreo II; Censo automatizado requiere Censo poblacional II y Método de rastreo III.

## Reglas de equilibrio

- La probabilidad de que la búsqueda encuentre algo no cambia. Un éxito puede generar entre **una y tres especies distintas** de la misma región, compatibles con el hábitat, horario y estación actuales.
- La **selección de rareza** se mantiene, con una bonificación específica según disciplina zoológica; no se eliminan especies de otros grupos ni se bloquean especies raras detrás de conocimientos obligatorios.
- Un censo ×2 o ×3 **solo aumenta la cantidad de avistamientos** registrados para esa especie. No multiplica las oportunidades de fósiles, materiales del Museo o variantes.
- El equipo automático no aplica grupos ni censos mejorados hasta investigarlos por separado. Incluso al aplicar ×2, **nunca supera 100 avistamientos automáticos de una especie por hora**, límite preexistente.
- Los descubrimientos únicos y los premios de primera observación se otorgan como antes, **una sola vez por especie**.
- Las expediciones **conservan sus hallazgos fósiles originales**. Paleontología añade a lo sumo una recompensa fósil adicional por expedición, con probabilidades crecientes por nivel.
- La posibilidad de encontrar un relicto no se duplica con censos, ni los avistamientos múltiples aumentan las tiradas de fósiles por búsqueda.
- No se modifica la fauna, las zonas ni la progresión territorial de Beta 3.14.

## Pruebas de esta beta
Se incluye `tests/research-v315.test.cjs`, que verifica las cinco ramas, dependencias, tres especies distintas por búsqueda, censos ×3, límite horario automático, bonificaciones de Paleontología y selección por especialidad. Las pruebas anteriores continúan ejecutándose en GitHub Actions.

## Partidas y Android
- Clave web local: `gran_atlas_v05` (sin cambios).
- Formato de exportación e importación: no se modifica.
- Identificador de Android: `com.elgranatlas.naturaleza.beta314` (conservado para no crear otra aplicación durante el desarrollo).
- Exportar el respaldo de la partida antes de instalar un APK de prueba: la capacidad de actualización depende también de la firma del APK y del sistema Android.

## Próximos pasos sugeridos
Evaluar tasas reales de progreso y costes de investigación con una partida de prueba avanzada; después extender Etología y las especialidades zoológicas hasta niveles III, vincular hallazgos fósiles con regiones, y profundizar las recetas y la presentación del Museo.
