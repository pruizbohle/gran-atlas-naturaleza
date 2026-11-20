# AUD-02 — Mecánicas, bonificaciones y economía (fase de auditoría)
Base: V4.9.6, 84298f39b4e333dc2f9a8bae0e07e3ae84a1264e. Se inspeccionaron app.js y la interfaz de Campo, y se ejecutaron nueve casos aislados con extractos exactos del código y dependencias controladas. No equivalen a una prueba integral del juego ni resuelven las 227 pruebas históricas. Resultados: aud02-pruebas-aisladas.json.

## Mecánicas comprobadas en código
| Mecánica | Efecto observado | Evidencia app.js |
|---|---|---|
| Búsqueda manual | 50% base; dos investigaciones y catalejo suman 48% relativo: 74% | 2511–2520, 2734–2747 |
| Equipo automático | 38% base con un multiplicador por ayudantes (+3% c/u, máximo 10), capacitación (+8% por nivel); ambos comparten límite relativo +45%. Colgante +8% y capucha +5%, fuera de ese límite: máximo 60,04% | 2038–2050, 2513–2518 |
| Intervalo | 5/3/2/1/0,5 s, una búsqueda del equipo, no una por ayudante | 2510, 5246–5270 |
| Censos y grupos | Manual x1/2/3; auto x1/2; grupos manuales nivel III 25% dos y 5% tres; grupo auto 12% dos y 2% tres. Selección sin reemplazo; cupo de 100 registros por especie/hora | 2080–2087, 2687–2777 |
| Conocimiento | Base manual éxito 5 y fallo 3; auto éxito 3 y fallo 1,5; redondeo; cuaderno +25%, sombrero académico +20% o de naturalista +10%; relictos hasta +12% análisis y +9% hitos | 2512, 2744–2765, 3850–3864 |
| Etología | Sexo manual 18/24/27%; auto 12/15/16,5%; nivel II multiplica tasas especiales por 1,5; legendario nominal 0,01% pasa a 0,015% | 1819, 1854–1884, 2541–2553 |
| Sociedad | Subvención (35 + 5 por especie descubierta), +25% investigación y +5% ámbar; cooldown 60 s; canje 40 conocimiento por 25 libras (+50% con mejora) | 2871–2888 |
| Fondos | 100 libras por 70 conocimiento; multiplicadores 1/10/100/1000 según compra, no dinero gratis | 3169–3178 |
| Expediciones | Collar +5% libras, brújula +4% conocimiento, gorro +6 pp y morral +3 pp sobre 35% botín base; sólo equipo equipado | 4489–4500, 4698–4708 |
| Museo | 0,16/0,24/0,34/0,50 libras/s según rareza; +15% estudio, +10% medallón, más conjuntos y conservación | 4196–4201 |
| Relictos | Pistas duplicadas por rastreo y misiones con dos plazas/dos pistas por mejora; se mantiene pendiente revisión de diseño | 2111–2114, 3761–3832 |

Las pruebas aisladas comprobaron los valores base/máximo, la recompensa de expedición, la exclusión de cefalópodos, el límite de offline, la capacidad con ala cero y las coronas de prueba. Los demás efectos están vinculados a su implementación por inspección; probar su integración con el motor real.

## Hallazgos priorizados
| ID | Prioridad | Estado | Hallazgo y acción propuesta |
|---|---|---|---|
| AUD02-01 | P1 | Comportamiento reproducido | tick() resta todo actualSearches de autoAccum antes de limitarlo a 500. Ocho horas representan 5.760 intentos a 5 s o 57.600 a 0,5 s antes de cupos; el caso aislado ejecutó 500 en ambas condiciones y dejó 0 acumulado. Procesar por intervalos horarios y lotes acotados, conservando deuda de tiempo hasta completarla, sin superar ocho horas ni duplicar recompensas. No aumentar cupos ni probabilidades. |
| AUD02-02 | P1 | Comportamiento reproducido | El tick consulta saturación a la hora actual antes de recorrer horas anteriores. Con cupo actual agotado y disponibilidad anterior simulada, ejecutó cero incursiones; además un break por saturación puede saltarse horas posteriores. Reproducir en motor con reloj controlado y corregir por ventanas de hora. |
| AUD02-03 | P1 antes de release | Confirmado en código y conversión aislada | Persisten fieldAid (500 conocimiento, 50 búsquedas garantizadas, sesión guiada) y controles en fieldViewModel; buyCrownPack y exchangeTrialCrowns permiten crear y convertir coronas sin costo. La prueba creó y convirtió 100, elevando libras de 420 a 520. Excluir estas acciones de la versión estable con guardas tanto en UI como en motor; conservar útiles de desarrollo aislados y no tocar partidas legítimas ni economía por ahora. Revisar también texto de prueba del fondo inicial. |
| AUD02-04 | P2 | Comportamiento reproducido, diseño por confirmar | Cephalopoda pertenece a Peces en bestiario (6764), pero researchRarityWeight sólo aplica ictiología a Actinopterygii y Chondrichthyes (2666–2680): un raro recibe x1,65 si pez y x1 si cefalópodo. Decidir si la especialidad marina cubre la categoría jugable completa o si debe explicitarse la exclusión; mantener taxonomía científica. |
| AUD02-05 | P3 | Caso límite reproducido | museumCapacity usa [0,3,7,12][wing] || 12: para wing=0 devuelve 12. Estado inicial normal wing=1; comprobar si importación permite 0 y, si corresponde, normalizar o usar fallback explícito. No se determina impacto normal. |

## Próxima etapa AUD-03
Auditar guardado, normalización, migraciones, operaciones pendientes, importación y protección ante cuota. Diseñar pruebas con relojes simulados y respaldos representativos; no marcar aprobadas pruebas no ejecutadas. AUD-02 no modifica motor, arte, economía, relictos ni workflow de Android. No fusionar a main ni firmar APK antes de consolidación.
