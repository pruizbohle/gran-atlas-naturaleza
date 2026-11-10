# 3.35.0 · Consolidación mundial (GM-05)

Base `main` **9da9808**, versión3.34.0. Rama `gm05/consolidacion-mundial`. **945 identidades, 113 regiones funcionales y1744 presencias**, sin altas ni eliminaciones. Se conserva `gran_atlas_v05`. Los cambios productivos justifican3.35.0: tres clasificaciones biológicas incorrectas reparadas, cuatro perfiles de tiburón antes idénticos diferenciados y laboratorio mundial aislado. Android permanece independiente; no se construye APK debug ni se afirma validación en dispositivo.

## GM-05A · datos, fuente e incidencias

[Auditoría del motor](docs/gm05/runtime-audit.json), [945 fichas operativas](docs/gm05/production-species-audit.csv), [1574 filas conciliadas](docs/gm05/presences-concordance.csv), [900 registros fuente](docs/gm05/source-species-concordance.csv), [413 incidencias vigentes](docs/gm05/issues-current.csv) y [resumen verificable](docs/gm05/source-audit.json).

Todas las 1744 presencias tienen testigo de filtro manual y automático con protocolo, hábitat, hora y estación; no hay referencias rotas ni nombres completos duplicados. Se conservan las 1148 concordancias históricas,415 incorporaciones posteriores,10 conflictos de rango y una diferencia Canis aureus/lupaster. Hay898 IDs canónicos vinculados con la fuente y47 identidades históricas sin correspondencia canónica aprobada que se conservan, enumeradas y revisadas estructural y visualmente. No se impone un catálogo de 900.

Los209 sectores fuente son103 poblados y106 reservados. Se corrige su presentación **solo en la vista derivada**; el JSON histórico GM01 conserva su discrepancia209/0 y todos sus archivos permanecen idénticos, comprobados con hashes y bytes. No se reconstruye el Excel ni se activan reservas.

Incidencias: **21 resueltas, 22 pendientes, 59 de contexto histórico y 311 sin defecto demostrado**. Los avisos científicos de fases posteriores ya resueltos no se reabren por aparecer en un CSV viejo. Cada fila mantiene origen, decisión, evidencia y commit cuando corresponde. Los cinco grupos de binomios compartidos no son cinco duplicados demostrados.

[Decisiones taxonómicas](docs/gm05/taxonomic-decisions.json) y [correcciones nuevas](docs/gm05/classification-corrections.json). GBIF se consultó para casos prioritarios; no certifica distribuciones. Panthera pardus y Gorilla beringei mantienen conflictos de rango/intención frente a las subespecies del juego. HIGHERRANK de tulliana no es una sinonimia. Canis aureus y C.lupaster continúan distintos. Arapaima, Electrophorus y los complejos de Leopardus requieren localidad/autoridad antes de reasignar. La sinonimia colocola/colocolo registrada por GBIF no resuelve la circunscripción heredada amplia de Pampas/Patagonia.

**Corregido:** Dendrocopos major (`eu_esp_0159`) deja de figurar como mamífero y pasa a Aves/Picidae. Carcharodon carcharias y Carcharhinus melanopterus dejan de clasificarse como peces óseos, con familias Lamnidae/Carcharhinidae. GBIF los sitúa en Elasmobranchii; el juego conserva el vocabulario cartilaginoso Chondrichthyes utilizado por sus otros tiburones. Solo cambian etiquetas de clasificación/familia; IDs, dibujos de estos tres casos, rarezas, condiciones y partidas se mantienen.484 perfiles históricos carecen de familia explícita; no se les inventa una certificación individual. No se afirma haber consultado una autoridad actual para cada uno de los 945 nombres.

## GM-05B · economía y progresión

[Informe](docs/gm05/stage-b.md) · [18 trayectorias con semillas](docs/gm05/economy-simulations.json) · [control de política rudimentaria](docs/gm05/economy-coarse-policy-control.json).

Tres semillas, estados cero/intermedio/avanzado,10/30 intentos manuales por hora y336 h simuladas por trayectoria. Se invocan motor, ticker, encuentros, compras legales, fabricación recursiva, monografías y viajes reales; no hallazgos forzados ni ingresos inventados. Los estados intermedio/avanzado son fixtures explícitos de partidas guardadas, no cronómetros desde cero. Las áreas no alcanzadas quedan censuradas al horizonte; no se extrapola una fecha humana hasta 485.

El prestigio final varía12–16 desde cero,186–190 desde el estado180 y455–456 desde440 bajo estas políticas. Hay tramos largos sin prestigio; el agente, la selección de regiones y el quinto nivel influyen. No es una campaña óptima ni demuestra equilibrio universal. Los diez incrementos+1 a+10 y máximo485 se verifican, al igual que dependencias acíclicas de investigaciones/recetas y sus referencias.

Las900 operaciones temporizadas verifican60/180/300 s y costes reales; algunas series de 100 no encuentran Notable. Se separan importe cargado, ganancias de descubrimiento y saldo neto. No se transforma1% por espécimen en tiempo universal. Las945 identidades completan sus cinco etapas usando un resultado especial **realmente permitido por su configuración**, incluidos pigmentos históricos; se comprueba publicación única y costes sin inyectar `specialSeen`.

Comercio mantiene4/8/12/24 h y beneficio neto15/17,5/20,83/18,75£/h. Museo puede dominar ingresos una vez investigada la muestra; eso no prueba por sí solo un defecto global. **No cambian probabilidades, costes, recompensas ni límites offline.** La igualdad de definiciones,945 configuraciones y tasas con 9da9808 tiene prueba propia.

## GM-05C · revisión visual

[Laboratorio mundial](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-mundial-v3350.html), [registro de 945 láminas](docs/gm05/art/review-ledger.csv), [revisión y comparaciones](docs/gm05/stage-c.md).

945 láminas normales inspeccionadas en 14 tableros. Grupos, familia/subgrupo, búsqueda,64/80/120 px, paginación y variantes exclusivamente configuradas. Motor exacto en iframe opaco con memoria aislada, sin acceso a partidas reales.

Carcharhinus longimanus, Isurus oxyrinchus, Lamna ditropis y Prionace glauca usaban el mismo dibujo. Se diferencian cuerpo, hocico, dorsal, pectoral, cola y marcas conservando estilo. [Antes](docs/gm05/art/before-shark-profiles.png) · [Después](docs/gm05/art/fish-0.png). De2605 rutas configuradas cambian solo esas cuatro identidades (ocho rutas normal/Notable); las otras941 y sus variantes/sexos siguen literales. Las27 coincidencias restantes quedan como revisión de diferenciación, no como duplicados biológicos. No hay rediseño masivo, pigmentaciones nuevas ni dimorfismos inventados.

## GM-05D · estabilidad, memoria y compatibilidad

[Informe comparativo](docs/gm05/stage-d.md), [métricas Chromium](docs/gm05/stability/browser-report.json), [compatibilidad](docs/gm05/compatibility-tests.txt).

320/360/390/412/1280 px;32 tarjetas de Bestiario. A390 px CPU×4, primera apertura154,9→166,3 ms y mediana de reapertura73,3→67,9 ms. Se informa la variación sin atribuir una mejora al cambio.200 ciclos de ocho paneles/ticker en reloj acelerado: heap retenido≈5,91→6,10→6,13 MB con GC controlado,735 nodos y un intervalo constante. No se observó acumulación bajo este escenario; no se declara ausencia universal de fugas ni200 minutos humanos.

Exportadores reales3.28–3.34 e importador actual conservan monedas/conocimiento fraccionarios, animales, avistamientos, etapas, publicaciones, prestigio, regiones, inventario, equipo, investigaciones, Museo y trabajos pendientes. Regresos8/24/72/168 h: los trabajos aún no vencidos siguen pendientes y los vencidos se pagan una vez. El puente nativo es simulado; no es un ensayo Android físico.

## GM-05E · validación y publicación

**510 pruebas:**473 históricas sobre sus commits reales sin cambiar expectativas,20 actuales de protocolos/integración existentes y17 nuevas de GM-05. Las históricas no se presentan como ejecutadas sobre el catálogo actual. [Log final](docs/gm05/final-tests.txt).

[Actualización PWA3.34→3.35](docs/gm05/pwa/browser-report.json): respaldo exacto, rechazo con otra ventana, viaje comercial24 h y operación científica pendientes conservados, resolución única, acceso/viaje por UI, cinco anchuras y juego/laboratorios offline. El laboratorio mundial abre945 identidades y80 tarjetas iniciales offline.

Hay157 archivos web con hashes y155 recursos únicos offline. La revisión de caché deriva de sus contenidos. La verificación de Pages y de los archivos servidos se añade tras el despliegue; no se declara publicada únicamente por crear este README.

Reproducción principal:

```sh
node scripts/audit-gm05-runtime.cjs
python3 scripts/audit-gm05-sources.py
node scripts/simulate-gm05-economy.cjs
node scripts/check-gm05-art.cjs
node scripts/check-gm05-stability.cjs
node scripts/validate-world-v3350.cjs
node scripts/check-world-pwa-v3350.cjs
node scripts/build-world-release-v3350.cjs
```

## Límites pendientes

22 incidencias científicas/localidades permanecen abiertas,27 grupos de ilustraciones requieren más diferenciación y484 perfiles antiguos no representan familia explícita. Las simulaciones no equivalen a una campaña humana completa o balance universal. Se conservan comportamientos inciertos sin inventar una resolución. Android, certificado permanente y restauración en dispositivo siguen independientes. No se amplían mapas, fauna ni economías.
