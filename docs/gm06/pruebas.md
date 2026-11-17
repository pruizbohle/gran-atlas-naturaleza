Actualización de validación: 17 de noviembre de 2026. Informe de cierre: `cierre-validacion.md`.

# Verificación GM-06E

Entorno: Chromium 156.0.8078.79 y Node 24 en Linux. No se compiló APK ni se probó un dispositivo Android físico.

## Pruebas focalizadas

`node --test tests/gm06*.test.cjs tests/cp3430-ui.test.cjs tests/cp3430-release.test.cjs`: **27/27 pasan**.

GM-06 verifica:

- 945 registros zoológicos anteriores completos, 113 IDs, continentes y umbrales históricos sin cambios.
- Objetos, recetas, rutas, misiones, niveles y legendarios anteriores iguales.
- Geometría axial sin solapamientos y dos vértices comunes por arista vecina; todas las regiones poseen posición.
- Independencia de nombres; norte/sur y oeste/este de las zonas intervenidas; aislamiento de las nuevas islas.
- Cero nombres científicos duplicados y cero especies huérfanas. Hábitat compatible para todas las asociaciones nuevas.
- 945 ilustraciones anteriores comparadas en normal, albino y melánico; 52 resultados nuevos distintos y variantes sin recursos externos.
- Las 52 incorporaciones recorren encuentros manual y automático con RNG controlado y sin forzar la probabilidad, cinco etapas de estudio y publicación única. Se usa una selección de una sola especie por iteración para probar determinísticamente cada identidad; las tasas normales no se alteran. Se añadió una comparación del retorno offline de 72 horas contra la base.
- Acceso desde Cuaderno y Bestiario.
- Una partida 3.43.0 con perfil, región Patagonia ya visitada, monografías, logros acreditados, exposición británica acreditada, inventario y las cuatro colas pendientes: viajes, comercio, excavaciones y prospecciones.
- Carga, persistencia, importación y exportación con formato 1; no se reinicia la región trasladada.

El guardia de integridad CP se actualiza para reconocer exclusivamente los tres puntos de extensión GM-06. Después de retirarlos, sigue exigiendo igualdad del motor anterior, salvo las extensiones CP ya aprobadas. La prueba GM-06 exige además igualdad con la base exacta 3.43.0 fuera de esos tres puntos; no se elimina la verificación.

## Suite histórica completa

Se ejecutó `node --test --test-concurrency=2 tests/*.test.cjs` en dos worktrees:

| Fuente | Pruebas | Pasan | Fallan |
|---|---:|---:|---:|
| Base exacta 3.43.0 / 41a4bbd | 776 | 566 | 210 |
| Candidato, incluidas las siete pruebas GM-06 | 783 | 573 | 210 |

**Cero fallos adicionales:** coinciden los 210 títulos que fallan. No se presenta la suite completa como verde. Entre los fallos anteriores hay verificaciones de versiones antiguas que esperan 3.41.0 y contratos de módulos históricos. Se conserva la lista completa y la comparación en `pruebas/reauditoria/suite-comparada.json`. Corregir todos esos contratos históricos está fuera de esta ampliación; la publicación 3.44.0 requerirá preparar su verificación de release tras la aprobación.

## Navegador y aislamiento

`node scripts/test-gm06-browser.cjs` comprueba **320, 360, 390, 412 y 1280 px**, sin errores JavaScript ni desbordamiento horizontal de la página o del motor. El mapa conserva su desplazamiento interno intencional. Se verifican los 12 destinos nuevos y Patagonia, los escenarios de estudio y continuidad y los accesos Atlas/Cuaderno/Bestiario/Campamento.

Se introduce una marca sintética en el almacenamiento del contenedor y se comprueba que el motor no la lee y que sigue intacta después de todos los escenarios. El marco no tiene `allow-same-origin`, y su almacenamiento es exclusivamente el Map inyectado. El HTML completo arranca el motor con la red desactivada. La política de este Chromium impide navegar a `file://`; la prueba offline carga los mismos bytes mediante `setContent` con el contexto sin red. No se afirma haber validado el gestor de archivos de un teléfono.

El Bestiario mantuvo nueve SVG visibles en el escenario de Galápagos; la galería mantiene 12 fichas por página, con carga de sus ilustraciones al mostrar esa página. Las capturas y las mediciones se conservan en `pruebas/`.

## Rendimiento

Las medianas de cambio de pantalla del navegador, incluyendo la interacción y espera de Playwright, se mantuvieron alrededor de una décima de segundo en esta ejecución. No equivalen a tiempo exclusivo de CPU ni a rendimiento de un teléfono.

Microbenchmark del modelo y marcado, caché caliente, 50 repeticiones, misma partida sintética desarrollada y región británica:

| Operación | Base 945: mediana ms | Candidato 997: mediana ms |
|---|---:|---:|
| Atlas | 0,468 | 0,451 |
| Cuaderno | 0,231 | 0,227 |
| Bestiario | 1,276 | 1,317 |
| Encuentro automático | 0,048 | 0,050 |

El aumento observado del Bestiario es aproximadamente 0,041 ms en este entorno, sin una degradación material detectada. El benchmark de Node no mide DOM, pintura, consumo de batería ni equipos Android. Metodología, percentiles y resultados originales: `pruebas/microbenchmark.json` y `pruebas/navegador.json`.

## Límites y pendientes de revisión

Revisión visual humana de las 52 láminas, decisiones regionales y expediente de Rapa Nui. La hoja XLSX de AviList 2026 no pudo descargarse; esto está declarado en la revisión zoológica. No se convierte esa limitación en una supuesta validación individual de la hoja. La referencia mundial es una composición de mapas continentales, no una proyección geográfica a escala.

Después de aprobación: integración de la entrada web 3.44.0, versiones, precache, manifiesto, verificación de release y comprobación de publicación. Hasta entonces no hay commit, push ni despliegue.
