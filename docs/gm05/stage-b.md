# GM-05B · economía y progresión medida

18 trayectorias: tres semillas, tres estados iniciales (cero/intermedio/avanzado), dos cadencias manuales (10/30 intentos/h) y 336 horas simuladas. Solo se usan el tick, encuentros, fabricación recursiva, mercado legal, investigación, monografías y expediciones reales. No se fuerzan hallazgos ni se inyectan ingresos. Los estados intermedio y avanzado son fixtures sintéticos explícitos de progreso guardado, no cronómetros de una partida iniciada de cero.

| Estado | Manual/h | Prestigio final (rango) | Libras finales (rango) | Conocimiento final (rango) | Mayor tramo sin prestigio |
|---|---:|---:|---:|---:|---:|
| zero | 10 | 12–13 | 410088–459008 | 3626–11094 | 144 h |
| zero | 30 | 16–16 | 428416–482943 | 9364–9840 | 135 h |
| intermediate | 10 | 186–188 | 1463713–1470090 | 2277–2986 | 153 h |
| intermediate | 30 | 188–190 | 1465058–1470572 | 1640–2189 | 143 h |
| advanced | 10 | 455–455 | 3714545–3715214 | 1744–6342 | 156 h |
| advanced | 30 | 456–456 | 3714327–3714693 | 9338–10746 | 146 h |

Los hitos de cada área se conservan en `milestonesHours`; cero significa acceso inicial del fixture. `notReached` significa censura al horizonte, **no** una estimación de tiempo hasta completar. En estas políticas no se alcanza 485 desde cero dentro de 336 h. La espera observada depende del agente (elección de regiones, naturalistas, expediciones horarias y compras), además del quinto nivel y recursos. No se presenta como días humanos ni como una campaña óptima. Un control de política más rudimentaria, sin compras ni fabricación secundaria, se conserva separado; sus atascos no se atribuyen al motor.

Las diez escalas reales tienen pasos +1 a +10 y máximo485. El grafo de investigaciones (incluidos reqAll) y recetas es acíclico; no se añaden materiales ni requisitos. Las cuatro rutas comerciales permanecen en4/8/12/24 h, con beneficio neto15/17,5/20,83/18,75 £/h; una sola plaza independiente. El Museo puede dominar las libras una vez acreditados los ejemplares: el retorno del precio base de una muestra toma aproximadamente4,7–5,1 minutos con sus ingresos actuales, pero su desbloqueo requiere la investigación previa. Esto confirma una relación de ingresos, no justifica por sí solo rebalancear una economía heredada.

Se ejecutaron900 operaciones pagadas con semillas, plazos y resolución reales:100 por protocolo y semilla. Sondeo60s, muestreo180s y extraordinario300s. El informe distingue coste cargado de saldo monetario neto (los descubrimientos también dan libras) y conocimiento neto. Algunas series de100 operaciones no obtienen ningún Notable; no se calcula un plazo universal a partir del1% por espécimen ni se garantiza la quinta etapa. El contexto de pruebas dispone de mejoras/censos explícitos y no es un naturalista inicial.

No se han modificado costes, recompensas, probabilidades, límites offline ni Comercio. Las18 trayectorias y el control de política identifican esperas/objetivos para futura telemetría; no demuestran por sí solos un desequilibrio universal que autorice un ajuste global. La igualdad de definiciones económicas y tasas frente a9da9808 tiene prueba propia.
