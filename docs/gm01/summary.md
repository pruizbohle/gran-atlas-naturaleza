# GM-01 · Auditoría del Globo Mundial

**Comparación documental terminada; implementación no iniciada.** Las decisiones taxonómicas y geográficas pendientes siguen expresamente abiertas, sin impedir inventariar cada fila. No equivale a aprobar todas las distribuciones o nuevas identidades.

Base `main`: `85f151aa40b5d93f8db33adb8297b1a6356560d0`; código jugable `7ca276ba4d92e13ed51be71667b663b194d6aae4`. Versión **3.28.0**, guardado **gran_atlas_v05**.

Excel `Atlas_Fauna_Hexagonal_209_900_Especies.xlsx`, SHA-256 `5cd22412e6b251d8f02a90e4c8303e02946d5e5d26855589d2c6750649fe4350`. Lectura efectiva de las seis hojas: **209 celdas, 103 pobladas, 106 reservadas, 900 registros científicos y 1.574 presencias**. El archivo no se modifica ni se publica.

Motor efectivo: **710 identidades de catálogo, 79 regiones funcionales y 1.329 presencias**, cinco continentes. Hay **83 celdas visuales**; 4 no son regiones. Cero nombres científicos completos duplicados; los solapamientos de especie/subespecie se registran aparte, sin fusiones.

## Inventario por continente o medio

| Fuente | Celdas con fauna | Reservadas | Regiones pendientes | Presencias fuente | Conceptos sin ID canónico actual |
| --- | ---: | ---: | ---: | ---: | ---: |
| América del Norte | 14 | 0 | 0 | 206 | 0 |
| América del Sur | 10 | 0 | 0 | 192 | 0 |
| Asia | 21 | 0 | 0 | 291 | 1 |
| Europa | 10 | 0 | 0 | 250 | 0 |
| Hielo | 7 | 22 | 7 | 45 | 21 |
| Mar | 12 | 72 | 12 | 192 | 104 |
| Mar abisal | 2 | 0 | 2 | 3 | 3 |
| Mar profundo | 5 | 12 | 5 | 44 | 24 |
| Oceanía | 8 | 0 | 8 | 131 | 97 |
| África | 14 | 0 | 0 | 220 | 2 |

Los conceptos se comparten entre medios: **no sumar la última columna para obtener altas globales**. Las 106 celdas vacías no se convierten en regiones. Las equivalencias africanas parciales tampoco autorizan reducir toda una región amplia a su destino actual.

## Identidades y presencias

De 900 filas de catálogo, 664 tienen correspondencia demostrada con **663 IDs actuales**. Cuatro equivalencias documentadas conservan `Pecari tajacu → Dicotyles tajacu`, `Pudu mephistophiles → Pudella mephistophiles`, `Dasypus hybridus → Dasypus septemcinctus` y `Conepatus humboldtii → Conepatus chinga`. Solo el pecarí reúne dos registros nominales de esta fuente en una identidad: las 900 filas representan 899 conceptos tras esa decisión.

Quedan **236 conceptos fuente sin correspondencia canónica**: 233 sin representación actual demostrada y **3 bloqueos de rango/intención** (Canis familiaris, Gorilla beringei, Panthera pardus). No son 190 altas por resta ni 236 altas aprobadas. El número de conceptos sin representación es exacto bajo las equivalencias declaradas; las revisiones de complejos pueden cambiar la decisión biológica futura, nunca se resuelven inventando un sinónimo.

Hay 47 IDs actuales sin registro fuente canónico después de los alias, incluidos candidatos de rango. Se conservan. `species.csv` contiene las 900 filas fuente y estos registros adicionales; no cuenta un candidato como correspondencia aprobada.

Las 1574 presencias originales permanecen una vez cada una en `presences.csv`, con todos sus campos, hoja, fila, ESP e HX. Concordancias de datos: **1148**; candidatos de rango sin equivalencia aprobada: **10**. Las regiones futuras reúnen **415 presencias**. Hay 0 asignaciones pendientes sin justificación documentada en regiones actuales; diferencias por corrección taxonómica histórica: 1, que requieren revisar la fuente, no ampliar automáticamente la fauna. Las 171 asignaciones adicionales del juego no se eliminan ni se califican automáticamente de error; se exportan junto a los candidatos, separadas de las filas fuente.

Concordancia de datos no significa ocurrencia científicamente validada. Se distinguen las equivalencias geográficas parciales y las alertas de AM-01/AM-04. Cada presencia actual tiene una combinación manual válida y estación automática alcanzable; no se modificaron filtros.

## Incidencias prioritarias

- `HX-06-07`: Amazonía en Excel y Sáhara en juego; se conserva `sa_amazonia`. Se inventarían colisiones adicionales si se reutilizaran IDs oceánicos/polares ocupados por regiones africanas.
- Leopardo de fuente `Panthera pardus` frente a las dos subespecies actuales; gorila oriental frente a gorila de montaña; Dingo etiquetado `Canis familiaris`. No resolver por nombre común, género ni truncamiento.
- Magreb, Fauna fila 607: la fuente dice `Canis aureus`; el juego usa allí `Canis lupaster`, explícitamente distinguido en el código. Se conservan ambas identidades y el registro original: no es un alias ni una orden de introducir el chacal euroasiático en África.
- Cuatro equivalencias africanas son parciales; las diez regiones funcionales adicionales africanas no son regiones fuente pendientes ni duplicados que borrar.
- Se conservan los cinco conceptos sudamericanos no resueltos por AM-04 y las alertas de distribución. Los conceptos marinos amplios y límites batimétricos quedan señalados para revisión, no certificados por un enlace GBIF.
- El vocabulario actual no representa por sí solo pelágico, abisal o hielo antártico interior. Planificar hábitats compatibles después, sin meter toda la fauna oceánica en Costa para forzar encuentros.

## Arte y planificación

`art-audit.csv` contiene 236 registros sin ID canónico actual: perfiles y familias editoriales preliminares, clasificación actual consultada sin renderizar especies nuevas. No hay albinismo, melanismo, sexos ni especiales nuevos configurados. Los tres registros bloqueados no autorizan tres ilustraciones nuevas. Las cargas cuentan tratamientos de especie, no motores o familias nuevos.

Orden recomendado: resolver bloqueos de identidad y crosswalk → GM-02 Oceanía → GM-03 áreas polares → GM-04 superficie/profundidad/abisal → GM-05 consolidación y diferencias heredadas. [Plan exacto por conjuntos](implementation-plan.md).

## Trazabilidad y validación

Categorías: A identidad vinculada sin diferencias comparadas; B identidad existente con diferencias; C sin identidad actual demostrada; D alias explícito; E revisión de identidad, distribución o concepto. Una E no significa necesariamente especie ausente. Las anotaciones de subárea vigentes de AM-04 se conservan por fila, junto al aviso histórico; un aviso no prueba un defecto funcional.

Clasificación de las 900 filas fuente: C = 219, B = 306, A = 316, E = 55, D = 4.

El snapshot se ejecuta en una VM aislada con almacenamiento en memoria. No lee partidas personales. Las condiciones de acceso se exportan del motor; cualquier indicador `met` del snapshot pertenece a ese estado inicial de prueba. La compatibilidad histórica se comprueba mediante las suites existentes, no mediante acceso a una partida del usuario.

[Regiones](regions.csv) · [Especies](species.csv) · [Presencias](presences.csv) · [Incidencias](issues.csv) · [Arte preliminar](art-audit.csv) · [Totales y comprobaciones](summary.json) · [Snapshot efectivo](game-snapshot.json) · [Decisiones declaradas](decisions.json) · [Notas de fuente](source-notes.json).

Todas las verificaciones estructurales de `summary.json` pasan. El manifiesto de archivos productivos demuestra que esta auditoría no los cambia. Las pruebas existentes y la reproducción se registran separadamente en `validation.json`; no se altera `www/`, la versión ni se genera APK. Los CSV incluyen datos originales, efectivos y propuestas en columnas separadas.
