# MEC-09D §16 · Los 25 récords y las 20 conductas

Prueba: `tests/mec09d-records.test.cjs`, con 46 pruebas: una por récord, una por conducta y una general. Comprueba la configuración real del módulo (`www/js/mec07-natural-records.js`) contra el catálogo completo de 1000 especies y 125 regiones. La integración con Campo, búsquedas automáticas, trabajo sin conexión, guardado, importación y recompensas en partida sigue cubierta por `mec07` (26 pruebas), que pasa.

## Resultados

| Comprobación | Récords (25) | Conductas (20) |
|---|---|---|
| Especie existente y presente en alguna región | 25/25 | 20/20 |
| Condiciones de turno, estación, hábitat o profundidad compatibles con la especie y con sus regiones | 25/25 | 20/20 |
| Probabilidad por evaluación positiva | 25/25 | 20/20 |
| Umbral alcanzable con el generador real o con la evidencia regional real | 25/25 | – |
| Las dos migraciones (evidencia regional): todas las zonas de ruta cubiertas por regiones reales de la especie | 2/2 | – |
| Instrumento de validación existente en el Taller (MEC-06): microscopio compuesto, estereoscopio de espejos, telescopio astronómico | 5/5 | – |
| Hito y recompensa una sola vez; la mejor marca solo mejora; sin validar queda como evidencia pendiente y sin hito | 25/25 | – |
| Sexo: el contrario no es elegible y el desconocido se registra como inferido | – | Todas las sexuadas |
| Elegible en un encuentro real de su especie y solo de ella | – | 20/20 |

Las recompensas (`first`, `milestone`, `behavior`) no cambian. Su valor es provisional y corresponde a BAL-01.

**Sin errores funcionales.**

## Probabilidad de alcanzar el umbral (cuestión de equilibrio, reservada para BAL)

Porcentaje de mediciones generadas que alcanzan el umbral, con 20 000 muestras por récord y el RNG aislado del módulo. Se multiplica por la probabilidad de evaluación, que es 0,08 en búsqueda manual y 0,04 en automática (salvo excepciones).

| Récord | Alcanza el umbral |
|---|---|
| cachalote-profundidad | 0,10 % |
| pinguino-emperador-inmersion | 0,34 % |
| elefante-marino-profundidad | 0,55 % |
| zifio-inmersion | 0,90 % |
| berrendo-carrera | 1,07 % |
| condor-altitud | 1,34 % |
| pez-vela-velocidad | 2,04 % |
| aguila-real-altitud | 2,26 % |
| anaconda-longitud | 2,56 % |
| cocodrilo-longitud | 2,61 % |
| elefante-masa | 4,09 % |
| jirafa-altura | 4,60 % |
| tortuga-aldabra-longevidad | 4,98 % |
| ballena-azul-longitud | 5,63 % |
| colibri-abeja-aleteo | 5,63 % |
| liebre-carrera | 5,70 % |
| guepardo-velocidad | 6,76 % |
| halcon-picada | 9,18 % |
| colibri-abeja-tamano | 10,29 % |
| sapo-pulga-tamano | 10,45 % |
| murcielago-abejorro-tamano | 12,02 % |
| tiburon-groenlandia-longevidad | 16,00 % |
| cobra-escupidora-precision | 26,70 % |

- Los cuatro récords de profundidad o inmersión necesitan, en promedio, entre unas 1400 y unas 12 500 observaciones manuales de su especie. Son alcanzables pero extremos.
- **Se propone revisarlos en BAL-01.** No se cambian aquí, porque MEC-09D prohíbe tocar probabilidades.
