# MEC-09D §17 · Grafo de dependencias de progresión

## Herramientas

- **Análisis:** `scripts/mec09d-graph.cjs`. Prueba: `tests/mec09d-graph.test.cjs`, con 5 pruebas.
- **Grafo:** el grafo tipado que genera `scripts/audit-mec09b.cjs` desde el motor real. En MEC-09D se regeneró sobre el motor vigente y salió **idéntico** a `docs/mec09b/grafo-dependencias.csv`.
- **Semántica del análisis:**
  - requisitos **obligatorios**: deben cumplirse todos;
  - **fuentes alternativas**: basta una, y cada fuente exige a la vez sus propias dependencias;
  - **regiones de campo alternativas**: basta una.
- **Recursos (dinero, conocimiento, prestigio):** son costes renovables con fuentes del juego (búsquedas, monografías, subvenciones, canje de notas). **No se usan como prueba de alcance**: el análisis solo admite cadenas legítimas de requisitos y fuentes desde la partida nueva, sin herramientas GM ni estados preparados.

## Resultado

| Comprobación | Resultado |
|---|---|
| Nodos | 1230: 57 investigaciones, 10 continentes, 125 regiones, 524 objetos, 19 expediciones, 4 rutas comerciales, 10 yacimientos, 25 niveles de instalación, 20 rangos, 5 niveles de Museo, 431 coleccionables |
| Referencias rotas | **0** |
| Ciclos de dependencias obligatorias (componentes fuertemente conexas, todos los tipos de nodo) | **0** |
| Nodos inalcanzables: bloqueos permanentes o requisitos imposibles | **0** |
| Objetos con más de una fuente alternativa | 432 |
| Accesos prematuros en el motor | 0: en una partida nueva solo Europa es accesible, y ninguna investigación se compra sin su requisito, aunque sobren recursos |

**Corrección de rigor respecto de MEC-09B.** Las partes de mapa del estudio «cálculo de derrotas» figuraban con el seudonodo `continent:X:fuente`, que la auditoría de MEC-09B daba por alcanzado. Ahora se resuelve a su requisito real en el motor (`CARTOGRAPHY3400.sourceResearch`):
- Sudamérica → `norteamerica_1`;
- Oceanía → `sudamerica_1`;
- Polos → `oceania_1`;
- Asia, África y Norteamérica no tienen requisito.

Aun así, todo sigue siendo alcanzable.

## Cadena principal (camino crítico de continentes)

El paso es la profundidad mínima de la cadena legítima más corta.

| Continente | Paso | Cadena crítica |
|---|---|---|
| Europa | 1 | inicial |
| Asia | 7 | capacitacion_1 → astillero → expedición costera → parte de mapa de Asia → Mapa de Asia → asia_1 |
| África | 8 | … → asia_1 → africa_1 |
| Norteamérica | 10 | … → africa_1 → nuevo_mundo_1 → norteamerica_1 |
| Sudamérica | 12 | … → nuevo_mundo_1 → Exploración atlántica → parte de mapa → Mapa de Sudamérica |
| Oceanía | 13 | … → sudamerica_1 → parte de mapa → Mapa de Oceanía |
| Polos | 14 | … → oceania_1 → parte de mapa → Mapa polar |
| Océanos | 15 | … → Mapa polar → Mapamundi |
| Océanos profundos | 15 | … → polos_1 → mares_superficiales_1 → exploracion_profunda_1 |
| Fosas abisales | 16 | … → exploracion_profunda_1 → exploracion_abisal_1 |

- Además, cada continente exige las **preparaciones acumulativas de 3.30**: brújula, cuadrante, catalejo, sombrero de erudito, abrigo polar y equipo de sondeo.
- Los rangos 1 a 20 y los niveles de Museo 1 a 5 son cadenas estrictas.

## Bloqueos principales (cuellos de botella, no defectos)

- **Expedición costera.** Es la primera fuente de partes del Mapa de Asia y abre toda la progresión continental. Requiere astillero, que a su vez requiere capacitacion_1.
- **Exploración atlántica.** Es la fuente de las partes de mapa de Norteamérica y Sudamérica. Hay alternativa: el estudio «cálculo de derrotas» del Taller.
- **Recetas de fuente única.** Brújula, cuadrante, catalejo, sombrero, abrigo, equipo de sondeo, los mapas y el Mapamundi solo salen por receta. Sus materiales tienen varias fuentes.
- **Reconstrucciones fósiles** (huesos, cráneos y placas): solo por reconstrucción a partir de fragmentos de yacimiento.

## Evidencia de cadena real

El controlador de progresión de MEC-09B (`docs/mec09b/progresion-controlador-29.json` y `-31.json`) usa solo acciones del jugador, sin ayudas, desde una partida nueva. Alcanza:
- ocho continentes, hasta Océanos;
- rango 20;
- Campamento 5×5;
- Museo 5;
- 28 objetos fabricados.

Océanos profundos y Fosas abisales quedan cubiertos por `deep-v3330` y `abyssal-v3340`, con acciones reales del motor sobre partidas avanzadas.

**Sin errores funcionales.** Los tiempos de progresión son cuestión de BAL-01.
