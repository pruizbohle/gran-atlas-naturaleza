# AUD-01 · Auditoría v5.0.1 — fase estática inicial

Base: V4.9.6, commit 84298f39b4e333dc2f9a8bae0e07e3ae84a1264e. La rama audit/v501-aud01 no cambia producción ni firma Android.

## Resultados preliminares
- 227 entradas únicas: 20 contienen expectativas antiguas verificadas en código; 24 comparaciones históricas probables; 15 candidatos a fixture incompleto; 166 requieren investigación; 2 entradas de fallo de archivo sin diagnóstico. Son grupos excluyentes de triaje, no causas raíz verificadas.
- 92 entradas enlazadas a una ubicación en el código de pruebas. Las restantes se localizarán al reproducir. Prioridades heurísticas: 48 P1, 78 P2, 101 P3; no son severidades confirmadas.
- 0 errores funcionales confirmados en esta fase; no implica 0 errores reales. No se ejecutó la batería del juego por falta del checkout completo en el entorno de revisión.
- Las 14 pruebas AND03 exigen que una nueva exportación declare exactamente 3.42.0. Deben conservar todas las comprobaciones de integridad y contrastar la versión vigente.
- Cuatro pruebas de Bestiario 3.26 fijan 807 fichas, 26 páginas o sus cantidades derivadas; mantener comprobaciones de filtros, orden, descubrimiento y paginación con el tamaño real.
- La prueba AND08 de coherencia usa 3.42.0 y la comparación de arte/código de Bestiario exige una instantánea de 3.25. Separar invariantes históricos de los contratos actuales.
- Los helpers de exploración profunda/hadal preparan recursos y desbloqueos sin acreditar explícitamente las reglas cartográficas posteriores. Probar requisitos completos antes de atribuir un fallo al motor.

## Reproducción
En un checkout completo de esta rama, con historial Git y Node 22, instalar dependencias mediante npm ci. Desde la raíz ejecutar:

    node scripts/aud01-run.cjs

Para un primer bloque:

    node scripts/aud01-run.cjs tests/and3420-migrations.test.cjs tests/bestiary-v3260.test.cjs tests/deep-v3330.test.cjs tests/abyssal-v3340.test.cjs tests/patch-v318.test.cjs

El ejecutor conserva eventos NDJSON, stderr y report.json en un directorio temporal (o AUD01_OUTPUT). Los resultados históricos no observados y los omitidos no cuentan como aprobados. No modifica pruebas, código ni publicación. El proceso conserva el código de salida de las pruebas. El ejecutor se probó con Node 22.16.0 y casos sintéticos de éxito, fallo, omisión y ausencia; no se ha ejecutado con el juego real.

## Siguiente paso
Guardar el reporte de ejecución, vincular cada ID con su aserción y causa comprobada, y corregir primero los errores reales de partidas y acceso. Actualizar pruebas antiguas preservando su propósito. No cambiar mecánicas de relictos ni economía; no generar APK firmado. Mantener main intacto hasta revisión.
