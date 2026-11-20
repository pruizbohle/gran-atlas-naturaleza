# V5.0.1 · Integración de la auditoría global

Rama de trabajo `audit/aud-01-v501`. Se integraron los diez commits de `audit/v501-aud01` mediante `5567e9d`, sobre el `main` de V4.9.6 que ya incluía el filtro de variantes del laboratorio en `c8af26e`. La candidata conserva la versión pública declarada 4.9.6 hasta la consolidación. El repositorio principal sigue en esa versión.

## Registro de resultados

- [AUD-01 · Clasificación y evidencia individual](aud01-resultados.json). Contiene los 227 casos reproducidos individualmente y en la suite, el punto de fallo, su causa o pregunta pendiente y el resultado sobre la candidata. El [registro preliminar](registro-aud01.json) conserva el triaje anterior.
- [AUD-02 · Revisión de mecánicas](AUD-02-mecanicas.md) y [casos aislados](aud02-pruebas-aisladas.json). Los bonos verificados con el motor y las sesiones completas se describen en el [informe de integración](integracion-v501.md).
- [AUD-03 · Revisión de partidas](AUD-03-partidas.md) y [casos aislados](aud03-pruebas-aisladas.json). Las pruebas nuevas verifican el rollback de guardado y la liquidación de expediciones; las limitaciones restantes constan en el informe de integración.
- [AUD-04 · Inventario de arte y muestra inicial](AUD-04-arte.md). La [continuación por familia](aud04-felidae-canidae.json) registra cada una de las 52 láminas pigmentarias de Felidae y Canidae. Los recursos de producción y la revisión previa se conservan.
- [Partidas integrales](aud01-partidas-integrales.json), [mediciones de Chromium y PWA](aud01-navegador.json) y [plan de retirada de ayudas](retiro-ayudas.md).

## Reproducción

Usar un checkout completo con historial Git, Node 24.22.1 para la comparación registrada y las dependencias del proyecto. Las suites históricas incluyen ejecutores que regeneran sus propios informes. Ejecutarlas en un árbol desechable.

    git worktree add --detach /tmp/atlas-aud01-base 5567e9d
    git worktree add --detach /tmp/atlas-aud01-final 90dd1cc

En cada árbol, ejecutar `AUD01_OUTPUT=/ruta/al/directorio node scripts/aud01-run.cjs`. El directorio contiene `events.ndjson`, `stderr.log` y `report.json`. Para repetir una sola aserción sobre la base, usar el título y archivo de `aud01-resultados.json`. Escapar los metacaracteres de la expresión regular y anclarla a ambos extremos. Los IDs 219 y 220 se reproducen ejecutando cada archivo completo.

    node --test --test-name-pattern='^título escapado$' tests/archivo.test.cjs
    npm run release:verify
    node --test tests/aud01-online-offline.test.cjs tests/live-save.test.cjs tests/and3420-migrations.test.cjs tests/and3420-native.test.cjs

Los siguientes comandos se ejecutan desde el checkout actual. Para el navegador se requieren Chromium y Playwright. `ATLAS_CHROMIUM` permite seleccionar el binario. El laboratorio HTML generado usa rutas locales de ese checkout.

    AUD01_ADVANCED_SAVE=/tmp/atlas-aud01-avanzada.json node scripts/aud01-playthrough.cjs
    AUD01_ADVANCED_SAVE=/tmp/atlas-aud01-avanzada.json node scripts/aud01-browser.cjs /tmp/atlas-aud01-base/www
    node scripts/aud04-contact-sheets.cjs --family Felidae --mode variants
    node scripts/aud04-contact-sheets.cjs --family Canidae --mode variants
