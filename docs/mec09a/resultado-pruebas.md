# MEC-09A · Resultado de las pruebas

| Conjunto | Pruebas | Aprobadas | Fallidas | Tiempo agotado |
| --- | --- | --- | --- | --- |
| Línea base MEC-08 (`e930fad`) | 1.027 | 811 | 216 | `global-v3240` (>600 s, sin resultados) |
| MEC-09A (`mec-09a/technical-audit`) | 1.081 | 860 | 221 | ninguno |

**De dónde salen las diferencias.**
- **Pruebas nuevas: +55.**
  - 49 de MEC-09A, todas aprobadas: `mec09a` (12), `mec09a-integral` (35) y `mec09a-catalog` (2).
  - 6 pruebas de `global-v3240` que antes no producían resultado. Antes contaban como un solo fallo («archivo sin resultados»); ahora se ejecutan.
- **Fallidas: 216 → 221.** Se retira el fallo del archivo y aparecen las 6 de `global-v3240`, clasificadas B (catálogo 807, compuertas posteriores e investigación que ya no consume el mapa). Los 215 casos históricos siguen igual.
- **Aprobadas: 811 → 860.** Son +49, las pruebas nuevas.
- **Regresiones respecto de MEC-08: 0.** Comparación por nombre de prueba en `resultado-suite-mec08.json` frente a `resultado-suite-mec09a.json`.

**Pruebas MEC-01 a MEC-08.** Todas aprobadas: 14, 12, 17, 15, 22, 17, 18 y 32.

**Expectativas actualizadas.**
- **Etiqueta de compilación.** `^MEC-0\d$` pasa a `^MEC-0\d[A-Z]?$` en MEC-01…MEC-07, por la etiqueta aprobada `MEC-09A`.
- **Versión en MEC-08.** La versión se compara con `package.json` en lugar del literal 5.6.8.
- **Paginación.** La expresión de la paginación (prueba MEC-08 n.º 29) admite el nuevo `data-dir`.

No se eliminó ninguna prueba.

**Comprobación en navegador** (Chrome sin interfaz): teclado y foco en Sociedad y Récords, sin errores de consola. **Lectores de pantalla:** no ejecutados (MEC-09C).

**Clasificación de los fallos** (`fallos-historicos.csv`, `causas-raiz.csv`):

| Clase | Casos |
| --- | --- |
| B · Prueba desactualizada por diseño aprobado | 146 |
| C · Arnés incompatible | 74 |
| G · Rendimiento (corregido) | 1 |
| H · Entorno Android | 1 |
| A, D, E, F, I | 0 |
