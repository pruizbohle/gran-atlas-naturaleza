# GM-01 · Inventario y reproducción

[Informe ejecutivo](summary.md) · [Plan GM-02 a GM-05](implementation-plan.md) · [Validación](validation.json)

Auditoría documental sobre la base 3.28.0, commit `85f151aa40b5d93f8db33adb8297b1a6356560d0`. No es una versión nueva del juego. El Excel permanece fuera del repositorio y no se publica.

## Reproducir

Entorno comprobado: Python 3.12.14, openpyxl 3.1.5 y Node 24.22.1. openpyxl solo se utiliza para la auditoría; no hay dependencias nuevas de producción. No hace falta iniciar servidor ni abrir una partida. Es necesario disponer del XLSX original con el hash indicado en `summary.json`.

```bash
python scripts/audit-world-gm01.py /ruta/Atlas_Fauna_Hexagonal_209_900_Especies.xlsx
python scripts/audit-world-gm01.py /ruta/Atlas_Fauna_Hexagonal_209_900_Especies.xlsx --check
python scripts/verify-world-gm01.py /ruta/Atlas_Fauna_Hexagonal_209_900_Especies.xlsx
node --test tests/*.test.cjs
```

El generador crea diez informes deterministas. `--check` no escribe: compara sus bytes con los informes presentes. `--output /ruta/temporal` permite regenerarlos por separado; dentro del repositorio solo acepta destinos bajo `docs/`. Un archivo ausente o de hash diferente detiene la generación. Las advertencias de openpyxl sobre extensiones de formato no implican cambios: se abre con `read_only=True`, nunca se guarda y se comprueba el hash original después de leerlo.

El verificador incluye 16 pruebas independientes: coteja todas las columnas y filas originales de las tres tablas, cobertura del catálogo efectivo, conjuntos de las fases, reglas de identidad, decisiones de subárea, rechazo de destinos productivos y reproducción byte por byte. Usa carpetas temporales y no genera bytecode dentro del repositorio.

## Qué representa cada archivo

| Archivo | Contenido |
| --- | --- |
| `regions.csv` | 209 celdas fuente y diez regiones funcionales actuales sin equivalencia fuente uno a uno; no suma celdas vacías como futuras regiones. |
| `species.csv` | 900 filas fuente y 47 IDs actuales sin equivalencia canónica fuente; incluye candidatos de rango sin aprobarlos como alias. |
| `presences.csv` | Las 1.574 filas originales completas y 181 pares actuales sin concordancia fuente demostrada: diez candidatos de rango y 171 adiciones históricas. |
| `issues.csv` | 413 observaciones, incluidos vocabularios distintos y revisiones científicas; no significa 413 errores de ejecución. |
| `art-audit.csv` | 236 conceptos sin identidad actual demostrada, tres bloqueados, con propuestas de perfil. Ninguna ilustración nueva generada o aprobada. |
| `summary.json` | Totales, 33 verificaciones, conjuntos exactos por fase y manifiestos SHA-256 de producción e insumos de auditoría. |
| `game-snapshot.json` | Catálogo y regiones efectivos, ecología, requisitos, rutas gráficas, configuración actual de variantes y render normal de especies existentes resumido por hash/atributos; no contiene nuevas ilustraciones. |
| `source-notes.json` | Celdas no vacías de Resumen y Metodología, con hoja/fila/columna; no sustituye al Excel. |
| `decisions.json` | Cuatro alias documentados, crosswalk regional explícito, revisiones y propuestas artísticas preliminares; es un insumo, no un parche al juego. |
| `regression-tests.txt`, `audit-tests.txt` | Salidas reales de las suites ejecutadas. |
| `validation.json` | Comandos, resultados, alcance y comprobación del árbol productivo. |

## Leer los CSV

`row_kind=source` conserva una fila original; `game_only` o `game_unmatched` representa datos adicionales del motor. Las columnas `source_` seguidas del encabezado original reproducen el valor de la celda; `source_sheet` y `source_row` conservan su posición física. Otros campos `source_*` normalizados son auxiliares de consulta. Las columnas `game_*` son efectivas; las que contienen `NOT_IMPLEMENTED`, `NOT_EQUIVALENCE`, `NOT_TRANSFER` o `PRELIMINARY` son propuestas o candidatos expresamente no aprobados. Los números de fila no son índices regenerados del CSV.

Las identidades se cotejan por nombre científico completo normalizado en Unicode, espacios y mayúsculas, o por uno de los cuatro alias explícitos con evidencia histórica. No se utiliza género, nombre común, truncamiento a binomio, parecido gráfico ni fauna compartida para establecer equivalencia. El agrupamiento por binomio de cinco grupos actuales solo diagnostica conceptos relacionados, no los fusiona.

Las cuatro correspondencias africanas parciales se conservan como tales, incluso si una presencia concuerda en ambas listas. Las notas actuales de subárea AM-04 se exportan junto a las alertas heredadas; una alerta no vuelve incorrecta toda una región ni demuestra un fallo funcional. `Canis aureus` del Magreb se mantiene separado de `Canis lupaster`: la diferencia histórica requiere revisar la fuente, no añadir automáticamente otra especie.

## Límites del resultado

Los 233 conceptos no representados son un inventario exacto bajo los tratamientos declarados, no 233 identidades biológicas certificadas ni IDs aprobados. Además hay tres casos bloqueados de rango/intención. Las revisiones de complejos, subáreas y profundidad permanecen explícitas para las fases posteriores. No se hicieron consultas taxonómicas externas nuevas; se reutilizaron decisiones documentadas de AM-01/AM-04. Un enlace de consulta GBIF del Excel no certifica presencia.

El snapshot usa el motor real en una VM aislada y almacenamiento en memoria. Su estado inicial sirve para describir requisitos, no para afirmar acceso en una partida personal. La alcanzabilidad indica una combinación válida de hábitat/hora/estación por presencia actual y una estación automática; no simula una frecuencia de aparición ni cambia probabilidades. Las suites existentes comprueban los contratos funcionales y de persistencia. GM-01 no hace una auditoría artística final ni nuevas pruebas físicas Android.

No se modifica `www/`, el guardado `gran_atlas_v05`, la versión, los workflows ni el catálogo. No se genera APK ni se publica una nueva versión jugable.
